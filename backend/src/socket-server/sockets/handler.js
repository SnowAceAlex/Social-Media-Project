import redisClient from "../redis/client.js";

export function registerSocketEvents(io) {
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

        //JOIN ROOM
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

        //LEAVE ROOM
        socket.on("leave", (userId, callback) => {
            socket.leave(`user_${userId}`);
            callback?.({ success: true });
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