import axios from 'axios'
import React from 'react'

export const fetchPost = async (page = 1, userId = null) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const queryParams = new URLSearchParams({ page });

        if (userId) {
        queryParams.append('userId', userId);
        }

        const res = await axios.get(`http://localhost:5000/posts?${queryParams.toString()}`,{
            withCredentials: true,
        });
        console.log(res.data);
        return res.data; 
    } catch (err) {
        console.error("Error fetching posts:", err);
        throw err; 
    }
};
export default fetchPost

export const fetchLatestPost = async (userId) => {
    try {
        const res = await axios.get(`http://localhost:5000/posts/${userId}/latestPost`, {
            withCredentials: true,
        });
        return res.data; 
    } catch (err) {
        console.error("Error fetching latest post:", err);
        throw err;
    }
};  