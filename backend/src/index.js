import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import { pool } from "./config/pool.js";
import cookieParser from "cookie-parser"; // Import cookie-parser
import uploadRoute from "./routes/uploadRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions)); // Use cors middleware with options

app.use((req, res, next) => {
  console.log(`CORS passed for origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser middleware

app.use("/users", userRoute);
app.use("/posts", postRoute); // Ensure authentication for post routes
app.use("/upload", uploadRoute); // Use upload route

app.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);

  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("DB connected, current time:", rows[0].now);
  } catch (err) {
    console.error("DB connection error on startup:", err.message);
  }
});
