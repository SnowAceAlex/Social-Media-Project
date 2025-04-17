import { pool } from "../config/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    full_name,
    dateOfBirth,
    bio,
    profile_pic_url,
  } = req.body;

  console.log("Received data:", req.body);
  // console.log("typeof dateOfBirth:", typeof dateOfBirth);

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if email already exists
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO users (username, email, password, full_name, date_of_birth, bio, profile_pic_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, full_name, date_of_birth, bio, profile_pic_url, created_at",
      [
        username,
        email,
        hashedPassword,
        full_name,
        dateOfBirth,
        bio,
        profile_pic_url,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error at registerUser:", error);
    res.status(500).json({ error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

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

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated token:", token);

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 3600000,
    // });

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      date_of_birth: user.date_of_birth,
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

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, username, email, full_name, bio, profile_pic_url, date_of_birth, created_at FROM users WHERE id = $1",
      [req.params.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user profile
export const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token
    const result = await pool.query(
      "SELECT id, username, email, full_name, bio, profile_pic_url, date_of_birth, created_at FROM users WHERE id = $1",
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

//Get all users profile
export const getAllUsersProfile = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, username, email, full_name, bio, profile_pic_url, date_of_birth, created_at FROM users"
    );
    if (users.rows.length === 0)
      return res.status(404).json({ error: "No users found" });
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id; // get user id from token
  const { username, full_name, bio, profile_pic_url, date_of_birth } = req.body;

  console.log("Received data for update:", req.body);

  try {
    // update user profile
    const result = await pool.query(
      "UPDATE users SET username = COALESCE($1, username), full_name = COALESCE($2, full_name), bio = COALESCE($3, bio), profile_pic_url = COALESCE($4, profile_pic_url), date_of_birth = COALESCE($5, date_of_birth) WHERE id = $6 RETURNING id, username, email, full_name, bio, profile_pic_url, created_at",
      [username, full_name, bio, profile_pic_url, date_of_birth, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: error.message });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  // res.clearCookie("token", {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  // });
  // res.status(200).json({ message: "Logged out successfully" });
};
