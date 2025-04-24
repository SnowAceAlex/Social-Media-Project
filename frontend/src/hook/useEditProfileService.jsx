// useEditProfileService.js
import { useState } from "react";
import { editProfile, updateCover } from "../services/editProfileService";

export const useEditProfileService = (onSuccess, onError) => {
    const [loading, setLoading] = useState(false);

    const handleSaveProfile = async (formData) => {
        setLoading(true);
        try {
        const result = await editProfile({
            username: formData.username,
            full_name: formData.full_name,
            date_of_birth: formData.dob,
            bio: formData.bio,
            profile_pic_url: formData.profile_pic_url,          
            profile_pic_public_id: formData.profile_pic_public_id, 
        });

        if (onSuccess) onSuccess(result);
        } catch (error) {
        if (onError) onError(error.message);
        } finally {
        setLoading(false);
        }
    };

    const handleUpdateCover = async ({ cover_url, cover_public_id }) => {
        try {
            const updatedUser = await updateCover({ cover_url, cover_public_id });
            return updatedUser;
        } catch (error) {
            console.error('Error updating cover:', error);
            if (onError) onError(error.message);
        }
    };

    return { handleSaveProfile,handleUpdateCover, loading };
};