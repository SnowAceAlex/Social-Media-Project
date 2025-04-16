import { pool } from "../config/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res) => {
  const { username, email, password, full_name, bio, profile_pic_url } =
    req.body;

  console.log("Received data:", req.body);

  if (!media_url) {
    return res.status(400).json({ error: "Media URL is required" });
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
    console.error("Error creating post:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all posts with pagination
export const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

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
    console.error("Error liking post:", error);
    res.status(500).json({ error: error.message });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  const { post_id } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING *`,
      [userId, post_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Like not found" });
    }

    res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error("Error unliking post:", error);
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
    console.error("Error commenting on post:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get comments of a post
export const getComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const result = await pool.query(
      "SELECT id, username, email, full_name, bio, profile_pic_url, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likesResult = await pool.query(
      `SELECT users.id, users.username, users.profile_pic_url 
         FROM likes 
         JOIN users ON likes.user_id = users.id 
         WHERE post_id = $1`,
      [postId]
    );

    const commentsResult = await pool.query(
      `SELECT comments.*, users.username, users.profile_pic_url 
         FROM comments 
         JOIN users ON comments.user_id = users.id 
         WHERE post_id = $1 
         ORDER BY comments.created_at ASC`,
      [postId]
    );

    res.status(200).json({
      post: postResult.rows[0],
      likes: likesResult.rows,
      comments: commentsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching post details:", error);
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
