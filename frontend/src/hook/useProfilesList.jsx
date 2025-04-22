import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

const useProfilesList = (userIds = []) => {
    const [profiles, setProfiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            const results = {};
            try {
                await Promise.all(userIds.map(async (id) => {
                    try {
                        const profile = await getProfile(id);
                        results[id] = { profile, loading: false };
                    } catch (e) {
                        results[id] = { profile: null, loading: false };
                    }
                }));
                setProfiles(results);
            } catch (err) {
                setError("Failed to load user profiles");
            } finally {
                setLoading(false);
            }
        };

        if (userIds.length > 0) {
            fetchProfiles();
        }
    }, [userIds]);

    return { profiles, loading, error };
};

export default useProfilesList;