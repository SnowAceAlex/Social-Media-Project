const API_URL = "http://localhost:5000/users";

export const loginUser = async (email, password) => {
    try {
        console.log("📤 JSON gửi đi:", { email, password });

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("📥 Response từ server:", data);
        if (!response.ok) throw new Error(data.message || "Đăng nhập thất bại");

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

            response = await fetch(`${API_URL}/register`, {
                method: "POST",
                body: fd,
            });
        } else {
            const { imgFile, ...jsonData } = formData;

            response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData),
            });
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Đăng ký thất bại");

        return data;
    } catch (error) {
        throw error;
    }
};

export const getProfile = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Cannot get profile");

        return data;
    } catch (error) {
        throw error;
    }
};