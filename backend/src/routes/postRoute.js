import { Router } from "express";
import {
  createPost,
  getAllPosts,
  reactToPost,
  removeReaction,
  commentPost,
  getComments,
  deletePost,
  getSinglePost,
  editPost,
  getReactions,
  getLatestPostByUser,
  getCommentCount,
  deleteComment,
  getReactionsByPost,
} from "../controller/postController.js";
import { authenticate } from "../middleware/authenticateUser.js";

const router = Router();

router.post("/", authenticate, createPost); // Create a new post
router.get("/", getAllPosts); // Get all posts

// Reactions
router.post("/react", authenticate, reactToPost); // React to a post (like, haha, wow, cry, angry)
router.post("/unreact", authenticate, removeReaction); // Remove user's reaction
router.get("/getreacts/:postId", authenticate, getReactions); // Get all reactions (counts) for a post

// Comments
router.post("/comment", authenticate, commentPost); // Comment on a post
router.get("/comments/:postId", getComments); // Get comments
router.get("/comments/:postId/count", getCommentCount); // Get comment count
router.delete("/comments/:commentId", authenticate, deleteComment); // Delete a comment

// Post management
router.delete("/:postId", authenticate, deletePost); // Delete a post
router.get("/:postId", authenticate, getSinglePost); // Get a single post with comments + reactions
router.put("/:postId", authenticate, editPost); // Edit a post
router.get("/:userId/latestPost", getLatestPostByUser); // Get latest post by user

export default router;
