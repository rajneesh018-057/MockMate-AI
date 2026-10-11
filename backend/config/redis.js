import Redis from 'ioredis';

let redisConnection = null;

const getRedisConnection = () => {
    if (!redisConnection) {
        const redisUrl = process.env.REDIS_URL;

        if (!redisUrl) {
            console.warn('[Redis] REDIS_URL not set. Redis features will be disabled.');
            return null;
        }

        redisConnection = new Redis(redisUrl, {
            maxRetriesPerRequest: null, // Required by BullMQ
            enableReadyCheck: false,
            retryStrategy(times) {
                const delay = Math.min(times * 200, 5000);
                console.log(`[Redis] Reconnecting in ${delay}ms (attempt ${times})`);
                return delay;
            },
        });

        redisConnection.on('connect', () => {
            console.log('[Redis] Connected successfully.');
        });

        redisConnection.on('error', (err) => {
            console.error('[Redis] Connection error:', err.message);
        });
    }

    return redisConnection;
};

export default getRedisConnection;
