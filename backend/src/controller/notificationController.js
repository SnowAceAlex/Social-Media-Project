import { pool } from "../config/pool.js";
import { createNotification } from "../utils/notification.js";

// Get notifications for a user
export const getNotifications = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT notifications.*, users.username, users.profile_pic_url
         FROM notifications
         JOIN users ON notifications.from_user_id = users.id
         WHERE notifications.user_id = $1
         ORDER BY notifications.created_at DESC
         LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    await pool.query(
      `UPDATE notifications SET is_read = TRUE
         WHERE user_id = $1 AND id IN (${result.rows
           .map((_, i) => `$${i + 2}`)
           .join(", ")})`,
      [userId, ...result.rows.map((n) => n.id)]
    );

    res.status(200).json({
      page,
      notifications: result.rows,
      hasMore: result.rows.length === limit,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  const notificationId = parseInt(req.params.notificationId);
  const userId = req.user.id;

  try {
    const check = await pool.query(
      `SELECT * FROM notifications WHERE id = $1 AND user_id = $2`,
      [notificationId, userId]
    );

    if (check.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Unauthorized or notification not found" });
    }

    await pool.query(`DELETE FROM notifications WHERE id = $1`, [
      notificationId,
    ]);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: error.message });
  }
};
