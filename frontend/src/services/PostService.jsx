// services/postService.js
import axios from "axios";

// Create one axios instance
const API = axios.create({
    baseURL: "http://localhost:5000/posts",
    withCredentials: true,
});

// ------------------ POST SERVICES ------------------

export const getSinglePostService = async (postId) => {
    const res = await API.get(`/${postId}`);
    return res.data;
};

export const createPostService = async (caption, files) => {
    try {
        const formData = new FormData();
        formData.append("caption", caption);
        files.forEach((file) => {
          formData.append("images", file); // "images" phải khớp với multer field name
        });
        console.log(formData)
    
        const res = await API.post("/", formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });
    
        return res.data;
    } catch (err) {
        const msg = err.response?.data?.error || "Failed to create post";
        throw new Error(msg);
    }
};

export const deletePostById = async (postId) => {
    const res = await API.delete(`/${postId}`);
    return res.data;
};

export const editPostService = async (postId, data) => {
    const res = await API.put(`/${postId}`, data);
    return res.data;
};

// ------------------ COMMENT SERVICES ------------------

export const postComment = (postId, content) =>
    API.post("/comment", { post_id: postId, content });

export const getComments = (postId) =>
    API.get(`/comments/${postId}`);

export const getCommentCountService = async (postId) => {
    const res = await API.get(`/comments/${postId}/count`);
    return res.data; 
};

export const deleteCommentService = async (commentId) => {
    const res = await API.delete(`/comments/${commentId}`);
    return res.data;
}

// ------------------ HASHTAGS SERVICES ------------------ 
export const getPostsByHashTags = async (hashtag) => {
    const res = await API.get(`/hashtag/${hashtag}`);
    return res.data;
}

// ------------------ GET POST WITH IMAGES ------------------
export const getImagesAndPost = async (userId) => {
    const res = await API.get(`/getpostswithimages/${userId}`);
    return res.data;
}

// ------------------ SAVE (BOOKMARK) POST ------------------
export const savePost = async (postId) => {
    try {
        const response = await API.post("/save", { post_id: postId });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong while saving the post." };
    }
};

export const unSavePost = async (postId) => {
    try {
        const response = await API.post("/unsave", { post_id: postId });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong while unsave the post." };
    }
};

export const getSavedPostsService = async (page = 1) => {
    try {
        const response = await API.get(`/me/saved?page=${page}`);
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.error || "Failed to fetch saved posts";
        throw new Error(msg);
    }
};

// ------------------ SHARE POST ------------------
export const sharePostService = async (postId, caption) => {
    try {
        const response = await API.post("/share", {original_post_id: postId, caption: caption })
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong while share the post." };
    }
}

export const getShareCountService = async (postId) => {
    try {
        const res = await API.get(`/shared/${postId}/count`);
        return res.data.shareCount;
    } catch (error) {
        console.error("Failed to fetch share count", error);
        return 0;
    }
};