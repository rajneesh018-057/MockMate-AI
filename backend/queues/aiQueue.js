import { Queue } from 'bullmq';
import getRedisConnection from '../config/redis.js';

let questionQueue = null;
let evaluationQueue = null;

/**
 * Get or create the Question Generation queue.
 * This queue handles AI question generation jobs.
 */
export const getQuestionQueue = () => {
    if (!questionQueue) {
        const connection = getRedisConnection();
        if (!connection) return null;

        questionQueue = new Queue('question-generation', {
            connection,
            defaultJobOptions: {
                attempts: 3,           // Retry failed jobs up to 3 times
                backoff: {
                    type: 'exponential',
                    delay: 2000,       // Wait 2s, then 4s, then 8s
                },
                removeOnComplete: 50,  // Keep last 50 completed jobs for debugging
                removeOnFail: 100,     // Keep last 100 failed jobs for debugging
            },
        });
    }
    return questionQueue;
};

/**
 * Get or create the Answer Evaluation queue.
 * This queue handles AI transcription + evaluation jobs.
 */
export const getEvaluationQueue = () => {
    if (!evaluationQueue) {
        const connection = getRedisConnection();
        if (!connection) return null;

        evaluationQueue = new Queue('answer-evaluation', {
            connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                removeOnComplete: 50,
                removeOnFail: 100,
            },
        });
    }
    return evaluationQueue;
};
