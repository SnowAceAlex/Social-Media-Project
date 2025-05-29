import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useSocket } from "../contexts/SocketContext";
import { useState } from "react";

export const useLogout = () => {
    const navigate = useNavigate();
    const { logout } = useSocket();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogout = async () => {
        setLoading(true);
        setError("");
        try {
            await logoutUser();
            logout(); 
            sessionStorage.removeItem("currentUser");
            localStorage.removeItem("token");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleLogout, loading, error };
};