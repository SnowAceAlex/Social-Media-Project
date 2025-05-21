// hooks/useJoinChatRoom.js
import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useState } from "react";

export const useJoinChatRoom = ({ currentUserId, receiverId }) => {
    const { socket, currentRoom, setCurrentRoom } = useSocket();

    useEffect(() => {
        if (!socket || !currentUserId || !receiverId) return;

        const newRoomName  = [currentUserId, receiverId].sort().join("_");

        //LEAVE ROOM IF EXISTS
        if (currentRoom && currentRoom !== newRoomName) {
            socket.emit("leaveRoom", currentRoom); 
            console.log("🚪 Left previous room:", currentRoom);
        }

        socket.emit("joinRoom", newRoomName, (res) => {
            if (res.success) {
                console.log("✅ Joined chat room:", newRoomName);
                setCurrentRoom(newRoomName); 
            } else {
                console.error("❌ Failed to join chat room:", res.error);
            }
        });

        return () => {
            socket.emit("leaveRoom", newRoomName);
            console.log("🚪 Cleanup left room:", newRoomName);
            setCurrentRoom(null);
        };
    }, [socket, currentUserId, receiverId]);
};