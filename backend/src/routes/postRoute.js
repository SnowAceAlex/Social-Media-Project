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
  getCommentCount,
  deleteComment,
} from "../controller/postController.js";
import { authenticate } from "../middleware/authenticateUser.js";

const router = Router();

router.post("/", authenticate, createPost); // Route to create a new post
router.get("/", getAllPosts); // Route to get all posts

router.post("/like", authenticate, likePost); // Route to like a post
router.post("/unlike", authenticate, unlikePost); // Route to unlike a post
router.get("/getlikes/:postId", authenticate, getLikes); // Route to get likes on a post

router.post("/comment", authenticate, commentPost); // Route to comment on a post
router.get("/comments/:postId", getComments); // Route to get comments for a post
router.get("/comments/:postId/count", getCommentCount); // Route to get comment count
router.delete("/comments/:commentId", authenticate, deleteComment); // Route to delete a comment

router.delete("/:postId", authenticate, deletePost); // Route to delete a post
router.get("/:postId", authenticate, getSinglePost); // Route to get a single post with likes and comments
router.put("/:postId", authenticate, editPost); // Route to edit a post
router.get("/:userId/latestPost", getLatestPostByUser); // Route to get the latest post by a user

export default router;
