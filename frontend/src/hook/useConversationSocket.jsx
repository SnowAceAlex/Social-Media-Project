import { useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketContext';
import { useLocation } from 'react-router-dom';

export function useConversationSocket(currentUserId, setAllConversation) {
    const { socket } = useSocket();
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (newMessage) => {
            if (!location.pathname.startsWith("/conversation")) setHasNewMessage(true);
            // Chỉ cập nhật conversation nếu có truyền setAllConversation
            if (typeof setAllConversation === "function") {
                setAllConversation(prev => {
                    const idx = prev.findIndex(
                        c => String(c.id) === String(newMessage.conversation_id)
                    );
                    let updatedConversation;
                    if (idx !== -1) {
                        updatedConversation = {
                            ...prev[idx],
                            last_message: newMessage.content,
                            updated_at: newMessage.created_at,
                        };
                        const newList = [updatedConversation, ...prev.filter((_, i) => i !== idx)];
                        return newList;
                    } else {
                        const partner_id = newMessage.sender_id === currentUserId
                            ? newMessage.receiver_id
                            : newMessage.sender_id;
                        updatedConversation = {
                            id: newMessage.conversation_id,
                            partner_id,
                            partner_username: newMessage.sender_username,
                            partner_avatar: newMessage.sender_profile_pic_url,
                            last_message: newMessage.content,
                            updated_at: newMessage.created_at,
                        };
                        return [updatedConversation, ...prev];
                    }
                });
            }
        };
        socket.on("new_message", handleReceiveMessage);
        return () => {
            socket.off("new_message", handleReceiveMessage);
        };
    }, [socket, currentUserId, setAllConversation, location]);

    const markMessageAsSeen = () => setHasNewMessage(false);

    return { hasNewMessage, markMessageAsSeen };
}