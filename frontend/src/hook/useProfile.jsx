import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

const useProfile = (id) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
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

    return { profile, error, loading };
};

export default useProfile;
