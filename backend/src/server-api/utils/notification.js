import { pool } from "../config/pool.js";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url:`${process.env.REDIS_URL}`, 
});

redisClient.on("error", (err) => console.error("Lỗi Redis Client:", err));

(async () => {
  await redisClient.connect();
  console.log("Đã kết nối Redis client cho notificationPublisher");
})();

// Helper function to create a notification
const createNotification = async (userId, type, fromUserId, postId = null) => {
  try {
    const result = await pool.query(
      `
        WITH inserted AS (
            INSERT INTO notifications (user_id, type, from_user_id, post_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        )
        SELECT inserted.id,
              inserted.type,
              inserted.from_user_id,
              inserted.post_id,
              inserted.user_id,
              inserted.created_at,
              users.username,
              users.profile_pic_url
        FROM inserted
        JOIN users ON inserted.from_user_id = users.id
    `,
      [userId, type, fromUserId, postId]
    );
    const notification = result.rows[0];

    if (notification) {
      const notificationData = {
        userId: userId,
        id: notification.id,
        username: notification.username,
        profile_pic_url: notification.profile_pic_url,
        type: notification.type,
        from_user_id: notification.from_user_id,
        post_id: notification.post_id,
        created_at: notification.created_at,
      };
      await redisClient.publish("notifications", JSON.stringify(notificationData));
      console.log(`Đã gửi thông báo cho user_${userId} đến Redis`);
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

process.on("SIGINT", async () => {
  await redisClient.quit();
  console.log("Đã ngắt kết nối Redis client cho server-api");
  process.exit(0);
});

export { createNotification };
