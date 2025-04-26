import { pool } from "../config/pool.js";

// Helper function to create a notification
const createNotification = async (userId, type, fromUserId, postId = null) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, type, from_user_id, post_id)
         VALUES ($1, $2, $3, $4)`,
      [userId, type, fromUserId, postId]
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export { createNotification };
