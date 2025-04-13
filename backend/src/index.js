import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import userRoute from "./routes/userRoute.js";
import { pool } from "./config/pool.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  onSuccess: () => {
    if (corsOptions.optionsSuccessStatus === 200) {
      console.log("CORS configuration successful with status 200");
    }
  },
};

app.use(cors(corsOptions)); // Use cors middleware with options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoute);

app.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);

  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("DB connected, current time:", rows[0].now);
  } catch (err) {
    console.error("DB connection error on startup:", err.message);
  }
});