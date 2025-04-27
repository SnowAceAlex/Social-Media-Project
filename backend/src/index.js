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

// Tạo HTTP server và gắn socket.io
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Middleware kiểm tra cơ bản
  socket.use((packet, next) => {
    const [event, data, callback] = packet;
    if (event === "join" && !data) {
      if (typeof callback === 'function') {
        callback({ success: false, error: "Missing userId" });
      }
      return next(new Error("Missing userId"));
    }
    next();
  });

  socket.on("join", (userId, callback) => {
    try {
      // Rời tất cả các phòng user trước đó
      Array.from(socket.rooms).forEach(room => {
        if (room.startsWith("user_")) {
          socket.leave(room);
          console.log(`Socket ${socket.id} left room ${room}`);
        }
      });

      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined room user_${userId}`);

      if (typeof callback === 'function') {
        callback({ success: true, userId });
      }
    } catch (error) {
      console.error("Join error:", error);
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });

  // Xử lý leave room với callback
  socket.on("leave", (userId, callback) => {
    try {
      socket.leave(`user_${userId}`);
      console.log(`Socket ${socket.id} left room user_${userId}`);

      if (typeof callback === 'function') {
        callback({ success: true });
      }
    } catch (error) {
      console.error("Leave error:", error);
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);

  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("DB connected, current time:", rows[0].now);
  } catch (err) {
    console.error("DB connection error on startup:", err.message);
  }
});

export { io };