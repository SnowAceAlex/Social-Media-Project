// services/createPostService.js
import axios from "axios";

export const createPostService = async (caption) => {
    try {
    const res = await axios.post(
        "http://localhost:5000/posts",
        { caption },
        { withCredentials: true }
    );
        return res.data;
    } catch (err) {
        const msg = err.response?.data?.error || "Failed to create post";
        throw new Error(msg);
    }
};

export const deletePostById = async (postId) => {
    const response = await axios.delete(`http://localhost:5000/posts/${postId}`, {
        withCredentials: true, 
    });
    return response.data;
};