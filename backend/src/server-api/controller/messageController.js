import { pool } from "../config/pool.js";
import { publishMessage } from "../utils/messagePublisher.js";

// create messade and save to database
export const createMessage = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  try {
    if (!receiverId || !content) {
      return res.status(400).json({ error: "receiverId and content are required" });
    }
    if (senderId === receiverId) {
      return res.status(400).json({ error: "Cannot message yourself" });
    }

    // Kiểm tra receiver tồn tại
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [receiverId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    // Tìm hoặc tạo conversation
    const [user1, user2] = [senderId, receiverId].sort((a, b) => a - b);

    let conversationId;
    const convQuery = await pool.query(
      "SELECT id FROM conversations WHERE user1_id = $1 AND user2_id = $2",
      [user1, user2]
    );
    if (convQuery.rows.length > 0) {
      conversationId = convQuery.rows[0].id;
    } else {
      const convInsert = await pool.query(
        "INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING id",
        [user1, user2]
      );
      conversationId = convInsert.rows[0].id;
    }

    // Tạo message
    const messageInsert = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, receiver_id, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [conversationId, senderId, receiverId, content]
    );
    const message = messageInsert.rows[0];

    // Cập nhật conversation metadata
    await pool.query(
      `UPDATE conversations SET last_message_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [message.id, conversationId]
    );

    // Lấy thêm thông tin sender, receiver để trả về
    const fullMessage = await pool.query(
      `SELECT m.*,
              s.username AS sender_username,
              s.profile_pic_url AS sender_profile_pic_url,
              r.username AS receiver_username,
              r.profile_pic_url AS receiver_profile_pic_url
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE m.id = $1`,
      [message.id]
    );

    await publishMessage({
      fromUserId: senderId,
      toUserId: receiverId,
      message: fullMessage.rows[0]
    });

    res.status(201).json({
      message: "Message created successfully",
      data: fullMessage.rows[0],
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  const userId = req.user.id;
  const conversationId = parseInt(req.query.conversationId);
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  if (!conversationId) {
    return res.status(400).json({ error: "conversationId is required" });
  }

  try {
    // Kiểm tra user có quyền xem conversation này không
    const convCheck = await pool.query(
      `SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [conversationId, userId]
    );
    if (convCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or conversation not found" });
    }

    // Lấy messages theo conversation
    const messagesResult = await pool.query(
      `SELECT m.*,
              s.username AS sender_username,
              s.profile_pic_url AS sender_profile_pic_url,
              r.username AS receiver_username,
              r.profile_pic_url AS receiver_profile_pic_url
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [conversationId, limit, offset]
    );

    res.status(200).json({
      page,
      messages: messagesResult.rows,
      hasMore: messagesResult.rows.length === limit,
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

    const deletedMessage = check.rows[0];

    // Xóa tin nhắn
    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);

    await publishMessage({
      type: "delete",
      fromUserId: deletedMessage.sender_id,
      toUserId: deletedMessage.receiver_id,
      message: deletedMessage 
    });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: error.message });
  }
};