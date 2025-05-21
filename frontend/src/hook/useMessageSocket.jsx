import React, { useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketContext';

export function useMessageSocket(conversationId, setMessages, scrollContainerRef) {
    const { socket } = useSocket();    
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage) => {
            if (newMessage.conversation_id === conversationId) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setTimeout(() => {
                    const container = scrollContainerRef.current;
                    if (container) container.scrollTop = container.scrollHeight;
                }, 100);
            }
        };

        const handleDeleteMessage = (deleted) => {
            console.log("Received deleteMessage", deleted);
            if (deleted.conversation_id === conversationId) {
                setMessages(prev => prev.filter(m => m.id !== deleted.id));
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("deleteMessage", handleDeleteMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("deleteMessage", handleDeleteMessage);
        };
    }, [socket, conversationId, setMessages, scrollContainerRef]);
}