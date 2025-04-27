import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

const useProfile = (id) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const updateProfileLocally = (newProfile) => {
        setProfile(prev => ({ ...prev, ...newProfile }));
    };

    useEffect(() => {
        const fetchData = async () => {
            if(!id) return;
            setLoading(true); // Bắt đầu loading
            try {
                const data = await getProfile(id);
                console.log("📦 Profile data from backend:", data);
                setProfile(data);
            } catch (err) {
                setError(err.message || "Failed to fetch profile data");
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, [id]);

    return {updateProfileLocally, profile, error, loading };
};

export default useProfile;
