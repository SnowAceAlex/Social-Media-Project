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
  getMyReaction,
  getPostsByHashtag,
  searchHashtags,
  getUserPostsWithImages,
  savePost,
  unsavePost,
  getSavedPosts,
  sharePost,
  getUsersWhoSharedPost,
} from "../controller/postController.js";
import { authenticate } from "../middleware/authenticateUser.js";
import { handleUpload } from "../controller/uploadController.js";
import upload from "../middleware/multer.js";

const router = Router();

router.post("/", authenticate, upload.array("images", 5), createPost); // Create a new post
router.get("/", getAllPosts); // Get all posts

// Reactions
router.post("/react", authenticate, reactToPost); // React to a post (like, haha, wow, cry, angry)
router.post("/unreact", authenticate, removeReaction); // Remove user's reaction
router.get("/getreacts/:postId", authenticate, getReactions); // Get all reactions (counts) for a post
router.get("/getreactsinfo/:postId", authenticate, getReactionsByPost); // Get all reactions (user info) for a post
router.get("/getMyReaction/:postId", authenticate, getMyReaction);

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

//Hashtag
router.get("/hashtag/:tag", getPostsByHashtag);
router.get("/hashtags/search", authenticate, searchHashtags);

// Get posts with images by user ID
router.get("/getpostswithimages/:userId", authenticate, getUserPostsWithImages); // Get posts with images by user ID

// Save Post
router.post("/save", authenticate, savePost); // Save a post
router.post("/unsave", authenticate, unsavePost); // Unsave a post
router.get("/me/saved", authenticate, getSavedPosts); // Get all saved posts

// Share Post
router.post("/share", authenticate, sharePost); // Share a post
router.get("/shared/:postId", authenticate, getUsersWhoSharedPost); // Get users who shared a post
export default router;
