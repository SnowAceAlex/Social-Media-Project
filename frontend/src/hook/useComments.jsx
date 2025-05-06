// hooks/useComments.js
import { useEffect, useState } from "react";
import { deleteCommentService, getComments, postComment } from "../services/PostService";

const useComments = (postId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
        const res = await getComments(postId);
        setComments(res.data);
        } catch (err) {
        console.error("Failed to fetch comments", err);
        } finally {
        setLoading(false);
        }
    };

    const addComment = async (content) => {
        try {
            const res = await postComment(postId, content);
            console.log("Comment added:", res.data);
            setComments((prev) => [...prev, res.data]);
        } catch (err) {
        console.error("Failed to post comment", err);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await deleteCommentService(commentId);
            setComments((prev) => prev.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error("Failed to delete comment", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return { comments, loading, deleteComment, addComment, refreshComments:fetchComments };
}

export default useComments;