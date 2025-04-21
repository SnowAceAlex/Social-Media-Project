import React, { useState } from "react";
import { deletePostById } from "../services/PostService";

const usePostService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deletePost = async (postId) => {
        setLoading(true);
        setError(null);
            try {
            const res = await deletePostById(postId);
            return res;
        } catch (err) {
            setError(err?.response?.data?.error || "Error deleting post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deletePost, loading, error };
};
export default usePostService;
