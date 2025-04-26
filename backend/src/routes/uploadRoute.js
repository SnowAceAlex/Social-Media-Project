import express from "express";
import upload from "../middleware/multer.js";
import {
  uploadSingleImage,
  uploadMultipleImages,
  handleUpload,
} from "../controller/uploadController.js";

const router = express.Router();

// Upload 1 ảnh
router.post("/single", handleUpload(upload.single("image"), uploadSingleImage));

// Upload nhiều ảnh
router.post("/multiple", handleUpload(upload.array("images", 5), uploadMultipleImages));

export default router;