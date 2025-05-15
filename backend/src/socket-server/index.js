import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import redisClient from "./redis/client.js";
import { registerSocketEvents } from "./sockets/handler.js";
import cors from "cors"; 
import { authenticate } from "../server-api/middleware/authenticateUser.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

registerSocketEvents(io)

// API route check trạng thái
app.get("/users/:id/status", async (req, res) => {
    const userId = req.params.id;

    const online = await redisClient.get(`user:${userId}:online`);
    const lastActive = await redisClient.get(`user:${userId}:lastActive`);

    if (online === "true") return res.json({ status: "Online" });

    if (!lastActive) return res.json({ status: "Undefined" });

    const lastActiveTime = new Date(Number(lastActive));
    const now = new Date();
    const diffMs = now - lastActiveTime;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let status;

    if (diffMin < 60) {
        status = `${diffMin} minutes ago`;
    } else if (diffHours < 24 && lastActiveTime.getDate() === now.getDate()) {
        status = `Online at ${lastActiveTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    } else if (
        diffDays === 1 ||
        (diffHours < 48 && lastActiveTime.getDate() === now.getDate() - 1)
    ) {
        // Hôm qua
        status = `Online yesterday`;
    } else if (diffDays < 7) {
        status = `Online ${diffDays} days ago`;
    } else {
        status = `Online on ${lastActiveTime.toLocaleDateString()} `;
    }

    res.json({ status });
});


app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
    console.log("🔌 Socket.IO server running at port", PORT);
});