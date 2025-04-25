import { useState } from "react";
import { uploadMultipleImages, uploadSingleImage } from "../services/uploadService";

export const useUploadService = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadSingle = async (file, type, targetId) => {
        try {
        setUploading(true);
        const result = await uploadSingleImage(file, type, targetId);
        return result;
        } catch (err) {
        setError(err.message);
        throw err;
        } finally {
        setUploading(false);
        }
    };

    const uploadMultiple = async (files, type, postId, targetId) => {
        try {
        setUploading(true);
        const result = await uploadMultipleImages(files, type, postId, targetId);
        return result;
        } catch (err) {
        setError(err.message);
        throw err;
        } finally {
        setUploading(false);
        }
    };

    return {
        uploadSingle,
        uploadMultiple,
        uploading,
        error,
    };
};