import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getCurrentUserProfile,
  logoutUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsersByUsername,
  isFollowing,
  getFollowerFollowingCount,
} from "../controller/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authenticate } from "../middleware/authenticateUser.js";
import upload from "../middleware/multer.js";

const router = Router();

// Route register: Áp dụng middleware upload.single("image") để xử lý form-data
router.post("/register", upload.single("avatar"), registerUser);

router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/profile/:id", authenticate, getUserProfile);
router.get("/profile", authenticate, getCurrentUserProfile);
router.put("/profile/me/update", authenticate, updateUserProfile);
router.get("/search", authenticate, searchUsersByUsername)

router.post("/follow", authenticate, followUser);
router.post("/unfollow", authenticate, unfollowUser);
router.get("/:id/followers", authenticate, getFollowers);
router.get("/:id/followings", authenticate, getFollowing);
router.get("/is-following/:id", authenticate, isFollowing);
router.get("/followCount/:id", authenticate, getFollowerFollowingCount);
export default router;
