import React, { useCallback, useEffect, useState } from "react";
import { deletePostById, editPostService, getCommentCountService, getImagesAndPost } from "../services/PostService";

const usePostService = (postId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [commentCount, setCommentCount] = useState(0);
    const [postsWithImages, setPostsWithImages] = useState([]);

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

    const fetchPostsWithImages = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getImagesAndPost(userId);
            setPostsWithImages(data.posts || []);
        } catch (err) {
            setError(err?.response?.data?.error || "Error fetching posts with images");
        } finally {
            setLoading(false);
        }
    }, []); 

    //REFRESH COMMENT COUNT
    useEffect(() => {
        fetchCommentCount();
    }, [fetchCommentCount]);

    return {editPost, 
        deletePost, 
        fetchPostsWithImages,
        postsWithImages,
        commentCount, 
        refreshCommentCount:fetchCommentCount, 
        loading, error };
};
export default usePostService;
