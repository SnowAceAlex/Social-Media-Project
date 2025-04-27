import { pool } from "../config/pool.js";
import { io } from "../index.js";

// Helper function to create a notification
const createNotification = async (userId, type, fromUserId, postId = null) => {
  try {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, type, from_user_id, post_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
      [userId, type, fromUserId, postId]
    );
    const notification = result.rows[0];

    if (notification) {
      io.to(`user_${userId}`).emit("new_notification", {
        id: notification.id,
        type: notification.type,
        fromUserId: notification.from_user_id,
        postId: notification.post_id,
        createdAt: notification.created_at,
      });
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export { createNotification };
