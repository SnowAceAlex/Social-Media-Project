import { Router } from "express";
import {
  createPost,
  getAllPosts,
  likePost,
  commentPost,
  getComments,
  unlikePost,
  deletePost,
  getSinglePost,
  editPost,
  getLikes,
  getLatestPostByUser,
} from "../controller/postController.js";
import { authenticate } from "../middleware/authenticateUser.js";

const router = Router();

router.post("/", authenticate, createPost);
router.get("/", getAllPosts);
router.post("/like", authenticate, likePost);
router.post("/unlike", authenticate, unlikePost);
router.get("/getlikes/:postId", authenticate, getLikes);
router.post("/comment", authenticate, commentPost);
router.get("/comments/:postId", getComments);
router.delete("/:postId", authenticate, deletePost);
router.get("/:postId", authenticate, getSinglePost);
router.put("/:postId", authenticate, editPost);
router.get("/:userId/latestPost", getLatestPostByUser); 

export default router;
