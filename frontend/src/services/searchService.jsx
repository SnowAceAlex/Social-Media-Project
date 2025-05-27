// services/userService.js
import axios from 'axios';

export const searchUsersService = async (username) => { 
    await new Promise(resolve => setTimeout(resolve, 500));
    const res = await axios.get(`http://localhost:5000/users/search`, {
        params: { username },
        withCredentials: true,
    });
    return res.data;
};

export const searchHashtagsService = async (keyword) => {
    const res = await axios.get(`http://localhost:5000/posts/hashtags/search`, {
        params: { keyword },
        withCredentials: true,
    });
    return res.data;
};