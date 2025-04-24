import axios from "axios";
import { uploadSingleImage } from "./uploadService";

// editProfileService.js
export const editProfile = async (profileData) => {
    try {
    const res = await fetch(`http://localhost:5000/users/profile/me/update`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify(profileData),
    });

    const text = await res.text();
        let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (err) {
        throw new Error("Failed to parse server response");
    }
    
    if (!res.ok) {
        throw new Error(data?.message || data?.error || "Update failed");
    }

        return data;
    } catch (error) {
        throw new Error(error.message || "Something went wrong");
    }
};

export const updateCover = async ({ cover_url, cover_public_id }) => {
    const res = await axios.patch("http://localhost:5000/users/profile/cover", {
        cover_url,
        cover_public_id,
    },{
        withCredentials:true, 
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res.data.user;
};