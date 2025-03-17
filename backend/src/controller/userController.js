import { pool } from "../config/pool.js";

// Register user
export const registerUser = async (req, res) => {
  const { username, email, password, full_name, bio, profile_pic_url } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password, full_name, bio, profile_pic_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, full_name, bio, profile_pic_url, created_at",
      [username, email, password, full_name, bio, profile_pic_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (user.rows.length === 0)
      return res.status(400).json({ error: "Invalid credentials" });
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get all users profile
export const getAllUsersProfile = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, username, email, full_name, bio, profile_pic_url, created_at FROM users"
    );
    if (users.rows.length === 0)
      return res.status(404).json({ error: "No users found" });
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, username, email, full_name, bio, profile_pic_url, created_at FROM users WHERE id = $1",
      [req.params.id]
    );
    if (user.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { full_name, bio, profile_pic_url } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET full_name = $1, bio = $2, profile_pic_url = $3 WHERE id = $4 RETURNING id, username, email, full_name, bio, profile_pic_url, created_at",
      [full_name, bio, profile_pic_url, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
