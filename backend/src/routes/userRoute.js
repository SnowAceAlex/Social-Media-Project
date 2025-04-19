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
} from "../controller/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authenticate } from "../middleware/authenticateUser.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/profile/:id", authenticate, getUserProfile);
router.get("/profile", authenticate, getCurrentUserProfile);
router.put("/profile/me/update", authenticate, updateUserProfile);
router.get("/search", authenticate, searchUsersByUsername)

router.post("/follow", authenticate, followUser);
router.post("/unfollow", authenticate, unfollowUser);
router.get("/followers", authenticate, getFollowers);
router.get("/followings", authenticate, getFollowing);
export default router;
