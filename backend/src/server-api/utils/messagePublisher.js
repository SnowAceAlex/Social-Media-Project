// src/redis/messagePublisher.js
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
    url: `redis://localhost:6379`, // hoặc `${process.env.REDIS_URL}`
});

redisClient.on("error", (err) => console.error("Redis error:", err));

(async () => {
    await redisClient.connect();
    console.log("Đã kết nối Redis client cho messagePublisher");
})();

export const publishMessage = async (messageData) => {
    try {
        await redisClient.publish("chat:message", JSON.stringify(messageData));
        console.log("📨 Đã publish message lên Redis:", messageData);
    } catch (err) {
        console.error("Error publishing message:", err);
    }
};

process.on("SIGINT", async () => {
    await redisClient.quit();
    console.log("Đã ngắt kết nối Redis client (messagePublisher)");
    process.exit(0);
});
