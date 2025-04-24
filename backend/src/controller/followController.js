import { pool } from "../config/pool.js";
import { createNotification } from "../utils/notification.js";

// Follow a user and create a notification
export const followUser = async (req, res) => {
  const { user_id_to_follow } = req.body;
  const userId = req.user.id;

  if (userId === parseInt(user_id_to_follow)) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  try {
    const followResult = await pool.query(
      `INSERT INTO follow (follower_id, following_id)
         VALUES ($1, $2)
         ON CONFLICT (follower_id, following_id) DO NOTHING
         RETURNING *`,
      [userId, user_id_to_follow]
    );

    if (followResult.rowCount === 0) {
      return res.status(400).json({ error: "Already following this user" });
    }

    await createNotification(user_id_to_follow, "followed", userId);

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const { user_id_to_unfollow } = req.body;
  const userId = req.user.id;

  if (userId === parseInt(user_id_to_unfollow)) {
    return res.status(400).json({ error: "You cannot unfollow yourself" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM follow WHERE follower_id = $1 AND following_id = $2 RETURNING *`,
      [userId, user_id_to_unfollow]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "You are not following this user" });
    }

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: error.message });
  }
};
