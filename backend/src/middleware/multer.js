import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "userAva",
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: (req, file) => Date.now() + "-" + file.originalname,
    },
  });

const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 2 * 1024 * 1024 
    } // 2MB limit
});

export default upload;
