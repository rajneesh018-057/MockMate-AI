import { Worker } from 'bullmq';
import getRedisConnection from '../config/redis.js';
import Session from '../models/SessionModel.js';
import fs from 'fs';
import { generateQuestions, transcribeAudio, evaluateAnswer } from '../services/aiService.js';

/**
 * Helper to emit Socket.io events from the worker.
 * The `io` instance is passed in when starting the worker.
 */
const pushSocketUpdate = (io, userId, sessionId, status, message, session = null) => {
    if (!io) return;
    io.to(userId.toString()).emit('sessionUpdate', {
        sessionId,
        status,
        message,
        session,
    });
};

/**
 * Start the Question Generation Worker.
 * Processes jobs from the 'question-generation' queue.
 */
export const startQuestionWorker = (io) => {
    const connection = getRedisConnection();
    if (!connection) {
        console.warn('[Worker] Redis not available. Question worker disabled.');
        return null;
    }

    const worker = new Worker('question-generation', async (job) => {
        const { sessionId, userId, role, level, interviewType, count } = job.data;

        console.log(`[Worker] Processing question generation for session: ${sessionId}`);

        const session = await Session.findById(sessionId);
        if (!session) throw new Error(`Session ${sessionId} not found`);

        // Notify user that AI is working
        pushSocketUpdate(io, userId, sessionId, 'AI_GENERATING_QUESTIONS', `Generating ${count} questions for ${role}...`);

        // Call Groq AI
        const aiData = await generateQuestions(role, level, interviewType, count);
        const codingCount = interviewType === 'coding-mix' ? Math.floor(count * 0.2) : 0;

        // Map questions to sub-documents
        const questionsArray = aiData.questions.map((qText, index) => ({
            questionText: qText,
            questionType: index < codingCount ? 'coding' : 'oral',
            isEvaluated: false,
            isSubmitted: false,
        }));

        // Save to MongoDB
        session.questions = questionsArray;
        session.status = 'in-progress';
        await session.save();

        // Notify user that questions are ready
        pushSocketUpdate(io, userId, sessionId, 'QUESTIONS_READY', 'Questions generated successfully.', session);

        return { success: true, questionCount: questionsArray.length };

    }, {
        connection,
        concurrency: 5,  // Process up to 5 jobs simultaneously
    });

    worker.on('completed', (job) => {
        console.log(`[Worker] Question job ${job.id} completed.`);
    });

    worker.on('failed', async (job, err) => {
        console.error(`[Worker] Question job ${job.id} failed:`, err.message);

        // Update session to failed and notify the user
        try {
            const { sessionId, userId } = job.data;
            const session = await Session.findById(sessionId);
            if (session) {
                session.status = 'failed';
                await session.save();
            }
            pushSocketUpdate(io, userId, sessionId, 'GENERATION_FAILED', `Question generation failed: ${err.message}`);
        } catch (e) {
            console.error('[Worker] Failed to update session on error:', e.message);
        }
    });

    console.log('[Worker] Question generation worker started.');
    return worker;
};

/**
 * Start the Answer Evaluation Worker.
 * Processes jobs from the 'answer-evaluation' queue.
 */
export const startEvaluationWorker = (io) => {
    const connection = getRedisConnection();
    if (!connection) {
        console.warn('[Worker] Redis not available. Evaluation worker disabled.');
        return null;
    }

    const worker = new Worker('answer-evaluation', async (job) => {
        const { sessionId, userId, questionIndex, audioFilePath, code } = job.data;
        let transcription = "";

        console.log(`[Worker] Processing evaluation for session: ${sessionId}, Q${questionIndex + 1}`);

        const session = await Session.findById(sessionId);
        if (!session) throw new Error(`Session ${sessionId} not found`);

        const question = session.questions[questionIndex];
        if (!question) throw new Error(`Question at index ${questionIndex} not found`);

        // Phase 1: Transcription (if audio exists)
        if (audioFilePath) {
            try {
                pushSocketUpdate(io, userId, sessionId, 'AI_TRANSCRIBING', `Transcribing audio for Q${questionIndex + 1}...`);
                const transData = await transcribeAudio(audioFilePath);
                transcription = transData.transcription || "";
            } catch (error) {
                console.error(`[Worker] Transcription Error: ${error.message}`);
            } finally {
                if (audioFilePath && fs.existsSync(audioFilePath)) {
                    fs.unlinkSync(audioFilePath);
                }
            }
        }

        // Phase 2: AI Evaluation
        pushSocketUpdate(io, userId, sessionId, 'AI_EVALUATING', `AI is analyzing Q${questionIndex + 1}...`);

        const evalData = await evaluateAnswer(
            question.questionText,
            question.questionType,
            session.role,
            session.level,
            transcription,
            code || ""
        );

        // Phase 3: Save results
        question.userAnswerText = transcription;
        question.userSubmittedCode = code || "";
        question.technicalScore = evalData.technicalScore;
        question.confidenceScore = evalData.confidenceScore;
        question.aiFeedback = evalData.aiFeedback;
        question.idealAnswer = evalData.idealAnswer;
        question.isEvaluated = true;

        await session.save();

        // Notify user
        pushSocketUpdate(io, userId, sessionId, 'EVALUATION_COMPLETE', `Feedback for Q${questionIndex + 1} is ready!`, session);

        return { success: true, questionIndex };

    }, {
        connection,
        concurrency: 3,  // Process up to 3 evaluations simultaneously
    });

    worker.on('completed', (job) => {
        console.log(`[Worker] Evaluation job ${job.id} completed.`);
    });

    worker.on('failed', async (job, err) => {
        console.error(`[Worker] Evaluation job ${job.id} failed:`, err.message);

        try {
            const { sessionId, userId, questionIndex } = job.data;
            pushSocketUpdate(io, userId, sessionId, 'EVALUATION_FAILED', `Evaluation for Q${questionIndex + 1} failed.`);
        } catch (e) {
            console.error('[Worker] Failed to notify on error:', e.message);
        }
    });

    console.log('[Worker] Answer evaluation worker started.');
    return worker;
};
