const API_URL = "http://localhost:5000/users";

import axios from 'axios';

export const loginUser = async (email, password) => {
    try {
        console.log("📤 JSON gửi đi:", { email, password });

        const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
        });

        const data = response.data;
        console.log("📥 Response từ server:", data);

        if (!response.status === 200) throw new Error(data.message || "Fail to login");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        return data;
    } catch (error) {
        throw error; 
    }
};

export const registerUser = async (formData) => {
    try {
        let response;
        if (formData.imgFile) {
            const fd = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key]) fd.append(key, formData[key]);
            });

            response = await axios.post(`${API_URL}/register`, fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } else {
            const { imgFile, ...jsonData } = formData;

            response = await axios.post(`${API_URL}/register`, jsonData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Fail to register");
    }
};

export const getProfile = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true, 
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Fail to fetch profile");
    }
};