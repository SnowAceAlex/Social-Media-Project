import axios from "axios";
const API_URL = "http://localhost:5000/posts";

export const reactToPost = async (postId, reactionType) => {
    const response = await axios.post(`${API_URL}/react`, {
        post_id: postId,
        reaction_type: reactionType,
    },{
        withCredentials: true,
    });
    return response.data;
};

export const removeReaction = async (postId) => {
    const response = await axios.post(`${API_URL}/unreact`, {
        post_id: postId,
    },{
        withCredentials: true,
    });
    return response.data;
};

export const getReactions = async (postId) => {
    const response = await axios.get(`${API_URL}/getreacts/${postId}`,{
        withCredentials: true,
    });
    return response.data;
};

export const getMyReaction = async (postId) => {
    const response = await axios.get(`${API_URL}/getMyReaction/${postId}`,{
        withCredentials: true,
    });
    return response.data.reaction;
};  