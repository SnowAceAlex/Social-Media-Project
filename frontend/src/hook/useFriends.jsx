import { useState, useEffect } from "react";
import { getFriends } from "../services/followService";

const useFriends = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
        try {
            const data = await getFriends();
            setFriends(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
        };

        fetchFriends();
    }, []);

    return { friends, loading, error };
};

export default useFriends;