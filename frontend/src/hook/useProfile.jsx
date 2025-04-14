import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProfile();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    return { profile, error };
};

export default useProfile;
