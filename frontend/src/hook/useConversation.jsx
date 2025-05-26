import { useState } from "react";
import { createOrGetConservation, getReceiver } from "../services/ConservationService";
import { getAllConservations } from "../services/ConservationService";

export const useConversation = () => {
    const [loading, setLoading] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [allConversation, setAllConversation] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [error, setError] = useState(null);
    const [partnersIds, setPartnersIds] = useState([]);
    

    const createOrGet = async (receiverId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await createOrGetConservation(receiverId);
            setConversation(data.conversation);
            return data; 
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAllConservations = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllConservations();
            setAllConversation(data.conversations);

            const ids = data.conversations
                .map(c => c.partner_id)
                .filter(id => id !== undefined && id !== null);

            setPartnersIds(ids);

            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchReceiver = async(conversationId)=>{
        setLoading(true);
        setError(null);
        try {
            const data = await getReceiver(conversationId);
            setReceiver(data.receiver);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally{
            setLoading(false);
        }
    }

    return {
        loading,
        conversation,
        setAllConversation,
        receiver,
        allConversation,
        partnersIds,
        error,
        fetchAllConservations,
        fetchReceiver,
        createOrGetConversation: createOrGet,
    };
};