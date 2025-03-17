import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "Snowace2911",
  host: "localhost",
  port: 5432,
  database: "social_media",
});

export { pool };
