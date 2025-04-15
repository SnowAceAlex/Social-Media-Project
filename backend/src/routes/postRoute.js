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
} from "../controller/postController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.post("/like", likePost);
router.post("/comment", commentPost);
router.get("/:postId/comments", getComments);
router.post("/unlike", unlikePost);
router.delete("/:id", deletePost);
router.get("/:id", getSinglePost);
router.put("/:id", editPost);

export default router;
