// hooks/useComments.js
import { useEffect, useState } from "react";
import { getComments, postComment } from "../services/commentService";

export default function useComments(postId) {
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

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return { comments, loading, addComment, fetchComments };
}