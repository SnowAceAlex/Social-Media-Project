import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

const useProfile = (id, currentUser) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const updateProfileLocally = (newProfile) => {
        setProfile(prev => ({ ...prev, ...newProfile }));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setProfile(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const data = await getProfile(id);
                setProfile(data);
            } catch (err) {
                setError(err.message || "Failed to fetch profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, currentUser]); 

    return { updateProfileLocally, profile, error, loading };
};

export default useProfile;