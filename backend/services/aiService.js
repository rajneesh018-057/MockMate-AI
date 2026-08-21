import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

let groqClient = null;
const getGroqClient = () => {
    if (!groqClient) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not configured.");
        }
        groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }
    return groqClient;
};

const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

/**
 * Generates interview questions based on role, level, and type.
 */
export const generateQuestions = async (role, level, interviewType, count) => {
    let instruction = "";

    if (interviewType === "coding-mix") {
        const codingCount = Math.floor(count * 0.2);
        const oralCount = count - codingCount;
        instruction = `The first ${codingCount} questions MUST be coding challenges requiring code implementation. The remaining ${oralCount} questions MUST be conceptual oral questions.`;
    } else {
        instruction = "All questions MUST be conceptual oral questions. Do NOT generate coding questions.";
    }

    const prompt = `You are a professional technical interviewer.

Generate exactly ${count} interview questions.

Role: ${role}
Level: ${level}

${instruction}

Rules:
- One question per line
- No numbering
- No explanations
- No headings
`;



    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: GROQ_MODEL,
        temperature: 0.7
    });

    const rawText = completion.choices[0].message.content.trim();
    const questions = rawText
        .split("\n")
        .map(q => q.trim())
        .filter(q => q.length > 0)
        .slice(0, count);

    return {
        questions,
        model_used: GROQ_MODEL
    };
};

/**
 * Transcribes audio using Whisper
 */
export const transcribeAudio = async (audioFilePath) => {


    const groq = getGroqClient();

    // The Groq API requires a valid audio extension (like .webm or .wav)
    // If the file was uploaded without one (common with blobs), we temporarily rename it.
    let finalPath = audioFilePath;
    const ext = path.extname(audioFilePath);
    if (!ext) {
        finalPath = audioFilePath + '.webm';
        fs.renameSync(audioFilePath, finalPath);
    }

    try {
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(finalPath),
            model: "whisper-large-v3",
            response_format: "json",
            prompt: "Transcribe this audio file accurately. Return only the transcription text, nothing else. If there is no speech, silent audio, or noise, return an empty string."
        });

        return {
            transcription: transcription.text ? transcription.text.trim() : ""
        };
    } finally {
        // If we renamed it, rename it back so sessionController can clean it up properly
        if (!ext && fs.existsSync(finalPath)) {
            fs.renameSync(finalPath, audioFilePath);
        }
    }
};

/**
 * Evaluates the answer using Groq
 */
export const evaluateAnswer = async (question, questionType, role, level, userAnswer, userCode) => {
    let assessmentInstruction = "";

    if (questionType === "oral") {
        assessmentInstruction = "This is a conceptual oral question. Focus only on the verbal explanation. If answer is irrelevant, empty, or nonsense, give 0.";
    } else {
        assessmentInstruction = "This is a coding question. Evaluate correctness, logic, and efficiency. If code is empty or invalid, give 0.";
    }

    const prompt = `You are a strict technical interviewer.

${assessmentInstruction}

Return ONLY valid JSON.

{
    "technicalScore": 0,
    "confidenceScore": 0,
    "aiFeedback": "",
    "idealAnswer": ""
}

Role: ${role}
Level: ${level}

Question:
${question}

Verbal Answer:
${userAnswer || "No verbal answer provided"}

Code Answer:
${userCode || "No code provided"}
`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: GROQ_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" }
    });

    let responseText = completion.choices[0].message.content.trim();

    // Clean any markdown formatting if present
    responseText = responseText.replace(/^```json|```$/gm, "").trim();

    try {
        const evaluationData = JSON.parse(responseText);

        if (evaluationData.idealAnswer && typeof evaluationData.idealAnswer !== 'string') {
            evaluationData.idealAnswer = JSON.stringify(evaluationData.idealAnswer);
        }

        return {
            technicalScore: evaluationData.technicalScore || 0,
            confidenceScore: evaluationData.confidenceScore || 0,
            aiFeedback: evaluationData.aiFeedback || "",
            idealAnswer: evaluationData.idealAnswer || ""
        };
    } catch (err) {
        console.error("Failed Response:", responseText);
        return {
            technicalScore: 0,
            confidenceScore: 0,
            aiFeedback: "Failed to parse AI response",
            idealAnswer: "Failed to parse response"
        };
    }
};
