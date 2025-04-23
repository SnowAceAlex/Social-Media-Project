import express from "express";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), function (req, res) {
  try {
    // nếu user không upload file:
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }    

    // req.file sẽ chứa thông tin ảnh vừa upload lên Cloudinary
    const file = req.file;
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: req.file.path,
    });
  } catch (error) {
    console.log("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
    });
  }
});

export default router;
