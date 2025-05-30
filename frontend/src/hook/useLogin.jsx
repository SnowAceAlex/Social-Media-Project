import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../store/userSlice";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useSocket();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        //Validate input
        if (!email && !password) {
            setError("Missing email and password");
            return;
        }
        if (!email) {
            setError("Missing email");
            return;
        }
        if (!password) {
            setError("Missing password");
            return;
        }

        //Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email format");
            return;
        }

        setLoading(true);

        try {
            const userData = await loginUser(email, password);
            console.log("Login successfully:", userData);

            login(userData.user);

            sessionStorage.setItem("currentUser", JSON.stringify(userData.user));
            localStorage.setItem("token", userData.token);
            dispatch(setCurrentUser(userData.user));

            navigate("/home");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
    };
};