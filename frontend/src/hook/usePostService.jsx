import React, { useCallback, useEffect, useState } from "react";
import { deletePostById, editPostService, getCommentCountService, getImagesAndPost, getSavedPostsService, getShareCountService, savePost, sharePostService, unSavePost } from "../services/PostService";

const usePostService = (postId, { autoFetchCommentCount = true } = {}) => {    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [commentCount, setCommentCount] = useState(0);
    const [postsWithImages, setPostsWithImages] = useState([]);
    const [shareCount, setShareCount] = useState(0);

    const [savedPosts, setSavedPosts] = useState([]);
    const [savedPage, setSavedPage] = useState(1);
    const [hasMoreSaved, setHasMoreSaved] = useState(true);

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

    const fetchShareCount = useCallback(async () => {
        if (!postId) return;
        setLoading(true);
        setError(null);
        try {
            const count = await getShareCountService(postId);
            setShareCount(count);
        } catch (err) {
            setError(err?.response?.data?.error || "Error fetching share count");
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
        if (autoFetchCommentCount && postId) fetchCommentCount();    
    }, [fetchCommentCount, postId]);

    useEffect(() => {
        if (postId) fetchShareCount();
    }, [postId, fetchShareCount]);    

    //SAVE POST
    const fetchSavePost =  async (postId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await savePost(postId);
            return result;
        } catch (err) {
            setError(err?.error || "Error saving post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    //UNSAVE POST
    const fetchUnSavePost = async (postId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await unSavePost(postId);
            return result;
        } catch (err) {
            setError(err?.error || "Error unsave post");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    //GET SAVE POST
    const fetchGetSavedPost = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getSavedPostsService(page);
            if (page === 1) {
                setSavedPosts(res.posts);
            } else {
                setSavedPosts((prev) => [...prev, ...res.posts]);
            }
            setSavedPage(res.page);
            setHasMoreSaved(res.hasMore);
        } catch (err) {
            setError(err.message || "Error fetching saved posts");
        } finally {
            setLoading(false);
        }
    }, []);

    //SHARE POST 
    const fetchSharePost = async (postId, caption) => {
        setLoading(true);
        setError(null);
        try {
            const result = await sharePostService(postId, caption);
            return result;
        } catch (err) {
            setError(err?.error || "Error sharing post");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        editPost, 
        deletePost, 
        shareCount,
        refreshShareCount: fetchShareCount, 
        fetchPostsWithImages,
        postsWithImages,
        commentCount, 
        fetchSavePost,
        fetchUnSavePost,
        fetchGetSavedPost,
        savedPosts,
        savedPage,
        hasMoreSaved,
        fetchSharePost,
        refreshCommentCount:fetchCommentCount, 
        loading, error };
};
export default usePostService;
