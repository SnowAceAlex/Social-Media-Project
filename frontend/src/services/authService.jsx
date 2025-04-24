const API_URL = "http://localhost:5000/users";

import axios from 'axios';

export const loginUser = async (email, password) => {
    try {
        console.log("📤 JSON gửi đi:", { email, password });

        const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
        },
        {
            withCredentials: true,
        });

        const data = response.data;
        console.log("📥 Response từ server:", data);

        if (!response.status === 200) throw new Error(data.message || "Fail to login");
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Fail to Login");
    }
};

export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to register" };    }
};

export const getProfile = async (id = null) => {
    try {
        const response = await axios.get(`${API_URL}/profile/${id}`, {
            withCredentials: true, 
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Fail to fetch profile");
    }
};