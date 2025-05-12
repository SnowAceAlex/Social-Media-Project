// src/socket-server/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createClient } from "redis"; 
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// REDIS DEFINE
const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => console.error("Lỗi Redis Client:", err));

(async () => {
    await redisClient.connect();
    console.log("Đã kết nối Redis client cho socket-server");

    await redisClient.subscribe("notifications", (message) => {
        try {
        const notificationData = JSON.parse(message); 
        const { userId, ...notification } = notificationData;
        io.to(`user_${userId}`).emit("new_notification", notification);
        console.log(`Đã gửi thông báo đến user_${userId}:`, notification);
        } catch (error) {
        console.error("Lỗi khi xử lý thông điệp từ Redis:", error);
        }
    });
    console.log("Đã đăng ký vào kênh notifications");
})();


io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.use((packet, next) => {
        const [event, data, callback] = packet;
        if (event === "join" && !data) {
            if (typeof callback === "function") {
                callback({ success: false, error: "Missing userId" });
            }
            return next(new Error("Missing userId"));
        }
        next();
    });

    socket.on("join", (userId, callback) => {
        try {
            Array.from(socket.rooms).forEach((room) => {
                if (room.startsWith("user_")) {
                    socket.leave(room);
                    console.log(`Socket ${socket.id} left room ${room}`);
                }
            });

            socket.join(`user_${userId}`);
            console.log(`Socket ${socket.id} joined room user_${userId}`);

            if (typeof callback === "function") {
                callback({ success: true, userId });
            }
        } catch (error) {
            console.error("Join error:", error);
            if (typeof callback === "function") {
                callback({ success: false, error: error.message });
            }
        }
    });

    socket.on("leave", (userId, callback) => {
        try {
            socket.leave(`user_${userId}`);
            console.log(`Socket ${socket.id} left room user_${userId}`);

            if (typeof callback === "function") {
                callback({ success: true });
            }
        } catch (error) {
            console.error("Leave error:", error);
            if (typeof callback === "function") {
                callback({ success: false, error: error.message });
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
    console.log("Socket.IO server is running on port", PORT);
});

// Đóng kết nối Redis khi server tắt
process.on("SIGINT", async () => {
    await redisClient.quit();
    console.log("Đã ngắt kết nối Redis client cho socket-server");
    process.exit(0);
});