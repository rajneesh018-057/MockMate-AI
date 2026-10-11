import express from "express";
import http from "http";

import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

// Redis & BullMQ
import getRedisConnection from "./config/redis.js";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { startQuestionWorker, startEvaluationWorker } from "./workers/aiWorker.js";



dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const allowedOrigin = [
    'http://localhost:5174',
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
})

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', "X-Requested-With"],
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers (prevents clickjacking, XSS, MIME sniffing)
app.use(helmet());

// Gzip Compression (reduces API response size by ~70%)
app.use(compression());

// HTTP Request Logging
app.use(morgan("dev"));

// API Rate Limiting to prevent abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    message: { message: "Too many requests from this IP, please try again later." },
});
app.use("/api/", apiLimiter);

app.set("io", io);

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);

io.on("connection", (socket) => {
    console.log(`A user Connected ${socket.id}`);
    const userId = socket.handshake.query.userId;
    if (userId) {

        socket.join(userId);
        console.log(`User ${socket.id} joined room: ${userId}`);
    }

    socket.on("disconnect", () => {
        console.log(`User Disconnected ${socket.id}`);
    });
});

// --- Redis Adapter for Socket.io (enables multi-server WebSocket scaling) ---
const redisConn = getRedisConnection();
if (redisConn) {
    const pubClient = new Redis(process.env.REDIS_URL);
    const subClient = pubClient.duplicate();

    pubClient.on("error", (err) => console.warn("[Socket.io PubClient Error]:", err.message));
    subClient.on("error", (err) => console.warn("[Socket.io SubClient Error]:", err.message));

    Promise.all([pubClient.ping(), subClient.ping()])
        .then(() => {
            io.adapter(createAdapter(pubClient, subClient));
            console.log("[Socket.io] Redis adapter attached. WebSockets can scale horizontally.");
        })
        .catch((err) => {
            console.warn("[Socket.io] Redis adapter failed, using default in-memory adapter:", err.message);
        });

    // Start BullMQ Workers
    startQuestionWorker(io);
    startEvaluationWorker(io);
} else {
    console.warn("[Server] Redis not available. Running in single-server mode.");
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(
    PORT,
    console.log(`Server running  on port ${PORT}`)
);
export default app;