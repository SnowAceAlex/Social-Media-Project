import express from "express";
import dotenv from "dotenv";
import testRoute from "./routes/test.route.js";
import { pool } from "./pool.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use("/", testRoute);

app.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);
  const result = await pool.query("SELECT * FROM users");

  console.log(result.rows);
});
