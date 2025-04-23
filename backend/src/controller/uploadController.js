import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

export const deleteCloudinaryImage = async (publicId) => {
    if (!publicId) return;

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("🧹 Deleted image from Cloudinary:", result);
        return result;
    } catch (err) {
        console.warn("⚠️ Failed to delete image from Cloudinary:", err.message);
    }
};

// Upload một ảnh
export const uploadSingleImage = async(req, res) => {
    try {
        if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded",
        });
        }

        res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
            url: req.file.path,
            publicId: req.file.filename,
            originalName: req.file.originalname,
        },
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Error uploading image",
        });
    }
};

// Upload nhiều ảnh
export const uploadMultipleImages = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No files uploaded",
        });
        }

        const uploadedFiles = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        }));

        res.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        data: uploadedFiles,
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Error uploading images",
        });
    }
};

// Hàm xử lý lỗi chung
export const handleUpload = (uploadMiddleware, controller) => {
    return (req, res) => {
        uploadMiddleware(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File size should not exceed 2MB",
            });
            }

            return res.status(400).json({
            success: false,
            message: "Multer error: " + err.message,
            });
        } else if (err) {
            return res.status(500).json({
            success: false,
            message: "Upload failed: " + err.message,
            });
        }

        controller(req, res);
        });
    };
};