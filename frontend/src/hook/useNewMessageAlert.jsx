import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

export function useNewMessageAlert(currentUserId) {
    const { socket } = useSocket();
    const [hasNewMessage, setHasNewMessage] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage) => {
        if (newMessage.receiver_id === currentUserId) {
            console.log(currentUserId)
            setHasNewMessage(true);
        }
        };

        socket.on("new_message", handleReceiveMessage);
        return () => {
        socket.off("new_message", handleReceiveMessage);
        };
    }, [socket, currentUserId]);

    const markMessageAsSeen = () => setHasNewMessage(false);

    return { hasNewMessage, markMessageAsSeen };
}