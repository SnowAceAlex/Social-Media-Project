import { useEffect, useState } from "react";
import { getFollowers } from "../services/followService";

const useFollowers = (userId) => {
    const [followers, setFollowers] = useState([]);
    const [isLoading, setIsLoading] = useState(!!userId); 
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setFollowers([]);
            setIsLoading(false);
            return;
        }

        const fetchFollowers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getFollowers(userId);
                setFollowers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFollowers();
    }, [userId]);

    return { followers, isLoading, error };
};

export default useFollowers;