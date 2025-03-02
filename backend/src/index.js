import express from "express";
import dotenv from "dotenv";

import testRoute from "./routes/test.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use("/", testRoute);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
