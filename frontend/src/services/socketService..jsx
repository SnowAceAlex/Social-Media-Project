import axios from "axios";

// Create one axios instance
const API = axios.create({
    baseURL: "http://localhost:3001/",
});

export const getOnOffStatus = async(userId) => {
    try {
        const status = await API.get(`/users/${userId}/status`)
        return status.data;
    } catch (error) {
        const msg = error.response?.data?.error || "Failed to fetch status online offline";
        throw new Error(msg);
    }
}