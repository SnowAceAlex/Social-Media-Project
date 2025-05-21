import { pool } from "../config/pool.js";

//Tạo hoặc lấy đoạn chat giữa 2 người
export const createOrGetConversation = async (req, res) => {
    const userId = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId || userId === otherUserId) {
        return res.status(400).json({ error: "Invalid user" });
    }

    const [user1, user2] = [userId, otherUserId].sort((a, b) => a - b);

    try {
        const existing = await pool.query(
            `SELECT * FROM conversations WHERE user1_id = $1 AND user2_id = $2`,
            [user1, user2]
        );

        if (existing.rows.length > 0) {
            return res.status(200).json({ conversation: existing.rows[0], isNew: false });
        }

        const created = await pool.query(
            `INSERT INTO conversations (user1_id, user2_id)
            VALUES ($1, $2)
            RETURNING *`,
            [user1, user2]
        );

        res.status(201).json({ conversation: created.rows[0], isNew: true });
    } catch (error) {
        console.error("❌ Error creating/getting conversation:", error);
        res.status(500).json({ error: error.message });
    }
};

//Lấy danh sách các đoạn chat gần đây của user
export const getUserConversations = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT c.*, 
              u.id AS partner_id,
              u.username AS partner_username,
              u.profile_pic_url AS partner_avatar,
              m.content AS last_message,
              m.created_at AS last_message_time
       FROM conversations c
       JOIN users u ON u.id = CASE
                                WHEN c.user1_id = $1 THEN c.user2_id
                                ELSE c.user1_id
                              END
       LEFT JOIN messages m ON c.last_message_id = m.id
       WHERE c.user1_id = $1 OR c.user2_id = $1
       ORDER BY c.updated_at DESC`
            , [userId]
        );

        res.status(200).json({ conversations: result.rows });
    } catch (error) {
        console.error("❌ Error fetching conversations:", error);
        res.status(500).json({ error: error.message });
    }
};

// Lấy thông tin hồ sơ của người nhận từ conversationId
export const getReceiverProfile = async (req, res) => {
    const userId = req.user.id;
    const conversationId = parseInt(req.params.conversationId); 

    try {
        if (!conversationId) {
            return res.status(400).json({ error: "conversationId is required" });
        }

        // Tìm cuộc trò chuyện
        const conversation = await pool.query(
            `SELECT user1_id, user2_id 
             FROM conversations 
             WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
            [conversationId, userId]
        );

        if (conversation.rows.length === 0) {
            return res.status(404).json({ error: "Conversation not found or unauthorized" });
        }

        // Xác định ID của người nhận
        const { user1_id, user2_id } = conversation.rows[0];
        const receiverId = Number(user1_id) === Number(userId) ? user2_id : user1_id;
        
        // Lấy thông tin hồ sơ của người nhận
        const receiver = await pool.query(
            `SELECT id, username, full_name, profile_pic_url, bio, date_of_birth, created_at 
             FROM users 
             WHERE id = $1`,
            [receiverId]
        );

        if (receiver.rows.length === 0) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        res.status(200).json({ receiver: receiver.rows[0] });
    } catch (error) {
        console.error("❌ Error fetching receiver profile:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteConversation = async (req, res) => {
    const userId = req.user.id;
    const conversationId = parseInt(req.params.conversationId);

    try {
        if (!conversationId) {
            return res.status(400).json({ error: "conversationId is required" });
        }

        // Kiểm tra xem user có tham gia đoạn chat không
        const check = await pool.query(
            `SELECT * FROM conversations
       WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
            [conversationId, userId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ error: "Conversation not found or unauthorized" });
        }

        // Xóa đoạn chat → cascade sẽ tự xóa messages
        await pool.query(`DELETE FROM conversations WHERE id = $1`, [conversationId]);

        res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting conversation:", error);
        res.status(500).json({ error: error.message });
    }
};