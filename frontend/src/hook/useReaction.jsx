import { useState, useEffect, useCallback } from "react";
import { getMyReaction, getReactions, getReactionsByPost, reactToPost, removeReaction } from "../services/reactionService";

export const useReactions = (postId) => {
    const [reactions, setReactions] = useState({
        like: 0,
        haha: 0,
        wow: 0,
        cry: 0,
        angry: 0,
    });
    const [myReaction, setMyReaction] = useState(null);
    const [reactUsers, setReactUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sortedReactions = Object.entries(reactions)
        .filter(([_, count]) => count > 0)  //SKIP 0 REACTIONS
        .sort((a, b) => b[1] - a[1])    //SORT BY COUNT DESCENDING  
        .map(([type]) => {
            const emojiMap = {
                like: "❤️",
                haha: "😂",
                wow: "😮",
                cry: "😢",
                angry: "😡",
            };
        return emojiMap[type];
    });

    // GET REACTIONS, MY REACTION, AND USERS WHO REACTED
    const fetchReactions = useCallback(async () => {
        try {
            setLoading(true);
            const [reactionData, userReact, userList] = await Promise.all([ 
                getReactions(postId),
                getMyReaction(postId),
                getReactionsByPost(postId),
            ]);
            setReactions(reactionData);
            setMyReaction(userReact);
            setReactUsers(userList);
        } catch (err) {
            setError(err.message || "Failed to fetch reactions");
        } finally {
            setLoading(false);
        }
    }, [postId]);
    
    // REACT TO POST
    const handleReact = async (reactionType) => {
        try {
            // IF USER REACTED, REMOVE REACTION
            if (myReaction === reactionType) {
                await removeReaction(postId);
                setMyReaction(null);
            // IF USER REACTED DIFFERENTLY, CHANGE REACTION
            } else {
                await reactToPost(postId, reactionType);
                setMyReaction(reactionType);
            }
            fetchReactions();
        } catch (err) {
            console.error("React error:", err);
        }
    };

    useEffect(() => {
        fetchReactions();
    }, [fetchReactions]);

    return {
        myReaction,
        sortedReactions,
        reactions,
        reactUsers,
        loading,
        error,
        react: handleReact,
        refresh: fetchReactions,
    };
};