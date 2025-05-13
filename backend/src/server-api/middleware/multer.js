import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    //TYPE: avatar, post
    const type = req.query.type;
    //TARGET_ID: userId, postId
    const targetId = req.query.targetId;
    //POST_ID
    const postId = req.query.postId;

    let folder = "misc"; // fallback nếu không đủ thông tin
    
    //users/userId/avatar
    if (type === "avatar" && targetId) {
      folder = `users/${targetId}/avatar`;
    } 
    else if (type === "cover" && targetId) {
      folder = `users/${targetId}/cover`;
    }
    //users/userId/posts/postId/images
    else if (type === "post" && targetId && postId) {
      folder = `users/${targetId}/posts/${postId}/images`;
    }

    const fileExt = path.extname(file.originalname); // .jpg, .png
    const baseName = path.basename(file.originalname, fileExt).replace(/\s+/g, "-");

    return {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${Date.now()}-${baseName}`,
    };
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default upload;