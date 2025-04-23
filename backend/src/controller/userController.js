import { pool } from "../config/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import upload from "../middleware/multer.js"; // Import upload config
import { deleteCloudinaryImage } from "./uploadController.js";
import fs from "fs";

// Register user
// export const registerUser = async (req, res) => {
//   const {
//     username,
//     email,
//     password,
//     full_name,
//     dateOfBirth,
//     bio,
//     profile_pic_url,
//   } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     const emailCheck = await pool.query(
//       "SELECT id FROM users WHERE email = $1",
//       [email]
//     );
//     if (emailCheck.rows.length > 0) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     let cloudinaryUrl = null;
//     let cloudinaryPublicId = null;

//     if (req.file) {
//       // Đã upload ảnh bằng multer
//       cloudinaryUrl = req.file.path;
//       cloudinaryPublicId = req.file.filename; // chính là public_id
//     } else if (profile_pic_url) {
//       cloudinaryUrl = profile_pic_url;
//     }

//     const result = await pool.query(
//         `INSERT INTO users 
//           (username, email, password, full_name, date_of_birth, bio, profile_pic_url, profile_pic_public_id)
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//         RETURNING id, username, email, full_name, date_of_birth, bio, profile_pic_url, profile_pic_public_id, created_at`,
//       [
//         username,
//         email,
//         hashedPassword,
//         full_name,
//         dateOfBirth,
//         bio,
//         cloudinaryUrl,
//         cloudinaryPublicId,
//       ]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error("❌ Error at registerUser:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
import cloudinary from "../utils/cloudinary.js";
export const registerUser = async (req, res) => {
  console.log("📥 req.body:", req.body);
  console.log("📥 req.file:", req.file);

  let userId = null; // ✅ Khai báo ở đây

  const {
    username,
    email,
    password,
    full_name,
    dateOfBirth,
    bio,
    profile_pic_url,
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if(!dateOfBirth) {
    return res.status(400).json({ error: "Date of birth is required" });
  }

  try {
    const emailCheck = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const tempInsert = await pool.query(
      `INSERT INTO users (username, email, password, full_name, date_of_birth, bio)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, full_name, date_of_birth, bio, created_at`,
      [username, email, hashedPassword, full_name, dateOfBirth, bio]
    );

    const user = tempInsert.rows[0];
    userId = user.id; 

    let uploadedUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `users/${userId}/avatar`,
        public_id: Date.now() + "-" + req.file.originalname,
      });

      uploadedUrl = result.secure_url;
      publicId = result.public_id;
    } else if (profile_pic_url) {
      uploadedUrl = profile_pic_url;
    }

    await pool.query(
      `UPDATE users SET profile_pic_url = $1, profile_pic_public_id = $2 WHERE id = $3`,
      [uploadedUrl, publicId, userId]
    );

    const finalUser = await pool.query(
      `SELECT id, username, email, full_name, date_of_birth, bio, profile_pic_url, profile_pic_public_id, created_at 
       FROM users WHERE id = $1`,
      [userId]
    );

    res.status(201).json(finalUser.rows[0]);
  } catch (error) {
    if (userId) {
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    }
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

    // Compare input password with hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access from JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF
      maxAge: 3600000, // 1 hour in milliseconds
    });

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

    // Return the user information
    res.status(200).json({
      message: "Login successful",
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

//Get Users By Username
export const searchUsersByUsername = async (req, res) => {
  const { username } = req.query; 

  if (!username) {
    return res.status(400).json({ error: "Username is required for search" });
  }

  try {
    const result = await pool.query(
        `SELECT id, username, full_name, profile_pic_url
        FROM users
        WHERE username ILIKE $1`,
      [`%${username}%`] 
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: error.message });
  }
};


// Update user profile
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    username,
    full_name,
    bio,
    profile_pic_url,
    profile_pic_public_id, // ảnh mới
    date_of_birth,
  } = req.body;

  console.log("Received data for update:", req.body);

  try {
    // 1. Lấy public_id cũ từ DB
    const { rows } = await pool.query(
      "SELECT profile_pic_public_id FROM users WHERE id = $1",
      [userId]
    );
    const currentPublicId = rows[0]?.profile_pic_public_id;

        let finalProfilePicUrl = profile_pic_url;
    let finalProfilePicPublicId = profile_pic_public_id;

    // 2. Nếu có file upload từ multer (sau khi đăng ký avatar)
    if (req.file) {
      finalProfilePicUrl = req.file.path;
      finalProfilePicPublicId = req.file.filename;
    }

    // 3. Nếu có ảnh cũ và ảnh mới khác → xóa ảnh cũ
    if (
      currentPublicId &&
      finalProfilePicPublicId &&
      finalProfilePicPublicId !== currentPublicId
    ) {
      await deleteCloudinaryImage(currentPublicId);
    }

    // 3. Update profile
    const result = await pool.query(
        `UPDATE users 
        SET 
            username = COALESCE($1, username), 
            full_name = COALESCE($2, full_name), 
            bio = COALESCE($3, bio), 
            profile_pic_url = COALESCE($4, profile_pic_url), 
            profile_pic_public_id = COALESCE($5, profile_pic_public_id), 
            date_of_birth = COALESCE($6, date_of_birth)
        WHERE id = $7 
        RETURNING id, username, email, full_name, bio, profile_pic_url, profile_pic_public_id, created_at`,
      [
        username,
        full_name,
        bio,
        profile_pic_url,
        profile_pic_public_id,
        date_of_birth,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      console.warn("⚠️ No user found to update with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    res.status(500).json({ error: error.message });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// Follow user
export const followUser = async (req, res) => {
  const followerId = req.user.id; // Extracted from token
  const { followingId } = req.body;

  if (followerId === followingId) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  try {
    // Check if the user is already following
    const followCheck = await pool.query(
      "SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );

    if (followCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    // Insert follow relationship into the followers table
    const result = await pool.query(
      "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) RETURNING *",
      [followerId, followingId]
    );

    res.status(200).json({
      message: "Followed successfully",
      follower: result.rows[0],
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Unfollow user
export const unfollowUser = async (req, res) => {
  const followerId = req.user.id; // Extracted from token
  const { followingId } = req.body;

  try {
    // Check if the user is following the target user
    const followCheck = await pool.query(
      "SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );

    if (followCheck.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    // Delete the follow relationship
    await pool.query(
      "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT users.id, users.username, users.full_name, users.profile_pic_url
        FROM followers
        INNER JOIN users ON followers.follower_id = users.id
        WHERE followers.following_id = $1`,
      [userId]
    );

    res.status(200).json(result.rows || []);
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get following users of a user
export const getFollowing = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.full_name, u.profile_pic_url
        FROM followers f
        JOIN users u ON u.id = f.following_id
        WHERE f.follower_id = $1`,
      [userId]
    );

    res.status(200).json(result.rows || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if current user is following someone
export const isFollowing = async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );

    res.status(200).json({ isFollowing: result.rows.length > 0 });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get follower & following count
export const getFollowerFollowingCount = async (req, res) => {
  const userId = req.params.id;

  try {
    const followers = await pool.query(
      "SELECT COUNT(*) FROM followers WHERE following_id = $1",
      [userId]
    );
    const following = await pool.query(
      "SELECT COUNT(*) FROM followers WHERE follower_id = $1",
      [userId]
    );

    res.status(200).json({
      followers: parseInt(followers.rows[0].count),
      following: parseInt(following.rows[0].count),
    });
  } catch (error) {
    console.error("Error getting follower/following count:", error);
    res.status(500).json({ error: error.message });
  }
};