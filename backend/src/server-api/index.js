import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import cookieParser from "cookie-parser"; 
import { createServer } from "http";
import { Server } from "socket.io";

import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { pool } from "./config/pool.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Setup CORS
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  // console.log(`CORS passed for origin: ${req.headers.origin}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/upload", uploadRoute);
app.use("/notifications", notificationRoute);
app.use("/messages", messageRoute);

// Tạo server HTTP và tích hợp Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Client tham gia room khi kết nối
    socket.on("joinRoom", ({ userId, otherUserId }) => {
        const roomName = [userId, otherUserId].sort().join('_');
        socket.join(roomName);
        socket.join(userId.toString()); // Tham gia room cá nhân của user
        console.log(`User ${userId} joined room ${roomName}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
app.listen(PORT, async () => {
  console.log("API server is running on port", PORT);

  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("DB connected, current time:", rows[0].now);
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
});