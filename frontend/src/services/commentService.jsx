import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/posts",
    withCredentials: true,
});

export const postComment = (postId, content) =>
API.post("/comment", { post_id: postId, content });

export const getComments = (postId) =>
API.get(`/comments/${postId}`);
