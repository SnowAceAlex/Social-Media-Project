import { useState, useEffect } from "react";
import { getFollowing } from "../services/followService";

const useFollowing = (userId) => {
    const [following, setFollowing] = useState([]);
    const [isLoading, setIsLoading] = useState(!!userId);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setFollowing([]);
            setIsLoading(false);
            return;
        }

        const fetchFollowing = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getFollowing(userId);
                setFollowing(data);
            } catch (err) {
                setError(err.message);
                console.error("❌ Error fetching following:", err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFollowing();
    }, [userId]);

    return { following, isLoading, error };
};

export default useFollowing;