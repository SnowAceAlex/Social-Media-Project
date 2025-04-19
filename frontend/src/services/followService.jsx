import axios from "axios";

const API_URL = "http://localhost:5000/users";


export const checkIfFollowing = async (targetUserId) => {
    const res = await axios.get(`${API_URL}/is-following/${targetUserId}`, {
        withCredentials: true,
    });
    return res.data.isFollowing;
};


export const followUser = async (followingId) => {
    const res = await axios.post(`${API_URL}/follow`, { followingId }, {
        withCredentials: true,
    });
    return res.data;
};

export const unfollowUser = async (followingId) => {
    const res = await axios.post(`${API_URL}/unfollow`, { followingId }, {
        withCredentials: true,
    });
    return res.data;
};

export const getFollowCount = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/followCount/${userId}`, {
            withCredentials: true,
        });
        return res.data; 
    } catch (error) {
        console.error("❌ Error in getFollowCount:", error);
        throw error;
    }
};
