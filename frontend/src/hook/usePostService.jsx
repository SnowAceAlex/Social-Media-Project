import React, { useState } from "react";
import { deletePostById, editPostService } from "../services/PostService";

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

    const editPost = async (postId, data) => {
        setLoading(true);
        setError(null);
        try {
            const result = await editPostService(postId, data);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {editPost, deletePost, loading, error };
};
export default usePostService;
