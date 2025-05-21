// services/postService.js
import axios from "axios";

// Create one axios instance
const API_Conservation = axios.create({
    baseURL: "http://localhost:5000/conversations",
    withCredentials: true,
});
const API_Messages = axios.create({
    baseURL: "http://localhost:5000/messages",
    withCredentials: true,
});

//--- CONSERVATION ---//
export const createOrGetConservation = async (receiverId) => {
    try {
        const res = await API_Conservation.post("/", {otherUserId: receiverId})
        return res.data
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong while create or get the conservation." };
    }
}

export const getAllConservations = async()=>{
    try {
        const res = await API_Conservation.get("/")
        return res.data
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong while get all conservations." };
    }
}

export const getReceiver = async(conversationId) => {
    try {
        const res = await API_Conservation.get(`/${conversationId}/receiver`);
        return res.data
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong while get receiver of a conservation." };
    }
}

//--- MESSAGE ---//
export const sendMessage = async(receiverId, content)=>{
    try {
        const res = await API_Messages.post(`/`, {receiverId: receiverId, content: content});
        return res.data
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong while get receiver of a conservation." };
    }
}

export const getAllMessages = async (conversationId, page = 1) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const res = await API_Messages.get("/", {
            params: { conversationId, page }
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong while getting messages." };
    }
}

export const deleteAMessage = async (messageId) => {
    try {
        const res = await API_Messages.delete(`/${messageId}`);
        return res.data
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong while deleting messages." };
    }
}