import { pool } from "../config/pool.js";

// Get messages between two users
export const getMessages = async (req, res) => {
  const userId = req.user.id; // Lấy từ middleware authenticate
  const otherUserId = parseInt(req.query.otherUserId); // Người dùng mà userId đang trò chuyện
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    // Kiểm tra nếu otherUserId hợp lệ
    if (!otherUserId) {
      return res.status(400).json({ error: "otherUserId is required" });
    }

    // Lấy tin nhắn giữa userId và otherUserId
    const result = await pool.query(
      `SELECT messages.*, 
              sender.username AS sender_username, 
              sender.profile_pic_url AS sender_profile_pic_url,
              receiver.username AS receiver_username,
              receiver.profile_pic_url AS receiver_profile_pic_url
       FROM messages
       JOIN users AS sender ON messages.sender_id = sender.id
       JOIN users AS receiver ON messages.receiver_id = receiver.id
       WHERE (messages.sender_id = $1 AND messages.receiver_id = $2)
          OR (messages.sender_id = $2 AND messages.receiver_id = $1)
       ORDER BY messages.created_at DESC
       LIMIT $3 OFFSET $4`,
      [userId, otherUserId, limit, offset]
    );

    res.status(200).json({
      page,
      messages: result.rows,
      hasMore: result.rows.length === limit,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete all messages between two users
export const deleteAllMessages = async (req, res) => {
  const userId = req.user.id;
  const otherUserId = parseInt(req.query.otherUserId);

  try {
    if (!otherUserId) {
      return res.status(400).json({ error: "otherUserId is required" });
    }

    // Xóa tất cả tin nhắn giữa userId và otherUserId
    const result = await pool.query(
      `DELETE FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)`,
      [userId, otherUserId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No messages found to delete" });
    }

    res.status(200).json({ message: "All messages deleted successfully" });
  } catch (error) {
    console.error("Error deleting all messages:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific message
export const deleteMessage = async (req, res) => {
  const userId = req.user.id;
  const messageId = parseInt(req.params.messageId);

  try {
    if (!messageId) {
      return res.status(400).json({ error: "messageId is required" });
    }

    // Kiểm tra xem tin nhắn có tồn tại và thuộc về cuộc trò chuyện của userId
    const check = await pool.query(
      `SELECT * FROM messages WHERE id = $1 AND 
       (sender_id = $2 OR receiver_id = $2)`,
      [messageId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Message not found or unauthorized" });
    }

    // Xóa tin nhắn
    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: error.message });
  }
};