import { useState } from "react";
import { deleteAMessage, getAllMessages, sendMessage } from "../services/ConservationService";

export const useMessage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSentMessage = async(receiverId, content)=>{
        try {
            setLoading(true);
            const data = await sendMessage(receiverId, content);
            return data;
        } catch (error) {
            setError(err);
            throw err;
        } finally{
            setLoading(false)
        }
    }

    const fetchMessages = async (conversationId, page = 1) => {
        try {
            setLoading(true);
            const data = await getAllMessages(conversationId, page);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            setLoading(true);
            await deleteAMessage(messageId);
            setError(null);
            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loadingMessage: loading,
        errorMessage: error,
        fetchSentMessage,
        fetchMessages,
        handleDeleteMessage
    };
};