import { pool } from "../config/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res) => {
  const { username, email, password, full_name, bio, profile_pic_url } =
    req.body;

  console.log("Received data:", req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // check if email already exists
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO users (username, email, password, full_name, bio, profile_pic_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, full_name, bio, profile_pic_url, created_at",
      [username, email, hashedPassword, full_name, bio, profile_pic_url]
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
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });


    const user = userResult.rows[0];

    // compare input password with hashed password in db
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create JWT token
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Generated JWT Token:", token);

    // hide password in response
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      bio: user.bio,
      profile_pic_url: user.profile_pic_url,
      created_at: user.created_at,
    };

    // returnn token and user
    res.status(200).json({
      token,
      user: safeUser,
    });

  } catch (error) {
    console.error("Login error:", error);
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

//Get current user profile
export const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ token
    const result = await pool.query(
      "SELECT id, username, email, full_name, bio, profile_pic_url, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
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

