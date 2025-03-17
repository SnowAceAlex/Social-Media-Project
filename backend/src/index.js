import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import { pool } from "./config/pool.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoute);

app.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);
  const result = await pool.query("SELECT * FROM users");

  console.log(result.rows);
});
