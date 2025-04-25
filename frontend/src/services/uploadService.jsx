import axios from "axios";

const API_URL = "http://localhost:5000/upload";

// Upload một ảnh
export const uploadSingleImage = async (file, type, targetId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    formData.append("targetId", targetId);

    const res = await axios.post(`${API_URL}/single?type=${type}&targetId=${targetId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data;
};

// Upload nhiều ảnh
export const uploadMultipleImages = async (files, type, postId, targetId) => {
    const formData = new FormData();
    for (let file of files) {
        formData.append("images", file);
    }
    formData.append("type", type);
    formData.append("postId", postId);
    formData.append("targetId", targetId);

    const res = await axios.post(`${API_URL}/multiple?type=${type}&postId=${postId}&targetId=${targetId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data;
};
