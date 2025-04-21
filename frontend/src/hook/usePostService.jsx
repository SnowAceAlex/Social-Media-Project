import React, { useCallback, useEffect, useState } from "react";
import { deletePostById, editPostService, getCommentCountService } from "../services/PostService";

const usePostService = (postId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [commentCount, setCommentCount] = useState(0);

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

    const fetchCommentCount = useCallback(async () => {
        if (!postId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getCommentCountService(postId);
            setCommentCount(response.commentCount);
        } catch (err) {
            setError(err?.response?.data?.error || "Error fetching comment count");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    //REFRESH COMMENT COUNT
    useEffect(() => {
        fetchCommentCount();
    }, [fetchCommentCount]);

    return {editPost, deletePost, commentCount, refreshCommentCount:fetchCommentCount, loading, error };
};
export default usePostService;
