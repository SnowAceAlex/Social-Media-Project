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