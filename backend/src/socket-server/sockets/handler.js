import redisClient from "../redis/client.js";
import { createClient } from "redis";


export async function registerSocketEvents(io) {
    const subscriber = createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    subscriber.on("error", (err) => {
        console.error("Redis subscriber error:", err);
    });
    await subscriber.connect();

    //GET NOTIFICATION
    subscriber.subscribe("notifications", (message) => {
        const data = JSON.parse(message);
        io.to(`user_${data.userId}`).emit("new_notification", data);
        console.log(`📨 Đã gửi notification real-time đến user_${data.userId}`);
    });

    //GET MESSAGE
    subscriber.subscribe("chat:message", (raw) => {
        const data = JSON.parse(raw);
        const {type, fromUserId, toUserId, message } = data;
        const roomName = [fromUserId, toUserId].sort().join("_");

        if(type === "delete"){
            io.to(roomName).emit("deleteMessage", message);
        }else{
            io.to(roomName).emit("receiveMessage", message);
            io.to(`user_${message.receiver_id}`).emit("new_message", message);
            io.to(`user_${message.sender_id}`).emit("new_message", message);
            console.log(`📨 Đã gửi message real-time cho user ${fromUserId} và ${toUserId}`);
        }
    });

    io.on("connection", (socket) => {
        console.log("🟢 Connected:", socket.id);

        socket.use((packet, next) => {
            const [event, data, callback] = packet;
            if (event === "join" && !data) {
                callback?.({ success: false, error: "Missing userId" });
                return next(new Error("Missing userId"));
            }
            next();
        });

        //JOIN PERSONAL ROOM
        socket.on("join", async (userId, callback) => {
            try {
                socket.userId = userId;

                Array.from(socket.rooms).forEach((room) => {
                    if (room.startsWith("user_")) socket.leave(room);
                });

                socket.join(`user_${userId}`);

                await redisClient.set(`user:${userId}:online`, "true");
                await redisClient.set(`user:${userId}:lastActive`, Date.now());
                //Send event to all 
                socket.broadcast.emit("user-online", { userId });

                callback?.({ success: true });
            } catch (err) {
                console.error("Join error:", err);
                callback?.({ success: false, error: err.message });
            }
        });

        // JOIN ROOM TOGETHER
        socket.on("joinRoom", (roomName, callback) => {
            try {
                socket.join(roomName);
                console.log(`🔗 Socket ${socket.id} joined room ${roomName}`);
                callback?.({ success: true });
            } catch (error) {
                console.error("JoinRoom error:", error);
                callback?.({ success: false, error: error.message });
            }
        });

        //LEAVE PERSONAL ROOM
        socket.on("leave", (userId, callback) => {
            socket.leave(`user_${userId}`);
            callback?.({ success: true });
        });

        //LEAVE ROOM
        socket.on("leaveRoom", (roomName, callback) => {
            try {
                socket.leave(roomName);
                if (socket.currentChatRoom === roomName) {
                    delete socket.currentChatRoom;
                }
                console.log(`🚪 Socket ${socket.id} left room ${roomName}`);
                callback?.({ success: true });
            } catch (error) {
                console.error("LeaveRoom error:", error);
                callback?.({ success: false, error: error.message });
            }
        });

        //DISCONNECT
        socket.on("disconnect", async () => {
            console.log("🔴 Disconnected:", socket.id);
            if (socket.userId) {
                await redisClient.set(`user:${socket.userId}:online`, "false");
                await redisClient.set(`user:${socket.userId}:lastActive`, Date.now());

                socket.broadcast.emit("user-offline", { userId: socket.userId });
            }
        });
    });
}