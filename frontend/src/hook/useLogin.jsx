import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {login} = useSocket();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userData = await loginUser(email, password);
            console.log("Login successfully:", userData);
              // Khi client gửi userId
            login(userData.user)

            sessionStorage.setItem("currentUser", JSON.stringify(userData));
            localStorage.setItem("token", userData.token);

            navigate("/home");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { email, setEmail, password, setPassword, loading, error, handleLogin };
};