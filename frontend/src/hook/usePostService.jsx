import React, { useState } from "react";
import { deletePostById, editPostService, getCommentCountService } from "../services/PostService";

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

    const getCommentCount = async (postId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCommentCountService(postId);
            return response;
        } catch (err) {
            setError(err?.response?.data?.error || "Error fetching comment count");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {editPost, deletePost, getCommentCount, loading, error };
};
export default usePostService;
