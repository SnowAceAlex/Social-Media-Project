// useEditProfileService.js
import { useState } from "react";
import { editProfile } from "../services/editProfileService";

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

    return { handleSaveProfile, loading };
};