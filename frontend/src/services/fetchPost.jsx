import axios from 'axios'
import React from 'react'

export const fetchPost = async (page = 1) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const res = await axios.get(`http://localhost:5000/posts?page=${page}`);
        return res.data; 
    } catch (err) {
        console.error("Error fetching posts:", err);
        throw err; 
    }
};
export default fetchPost