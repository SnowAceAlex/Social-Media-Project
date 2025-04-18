import { useState } from "react";
import { createPostService } from "../services/createPostService";

export const useCreatePostService = (onSuccess, onError) => {
    const [loading, setLoading] = useState(false);

    const handleCreatePost = async (caption) => {
        if (!caption.trim()) {
            alert("Please enter a caption");
            return;
        }

        setLoading(true);
        try {
            const result = await createPostService(caption);
            if (onSuccess) onSuccess(result);
        } catch (error) {
            if (onError) onError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreatePost, loading };
};