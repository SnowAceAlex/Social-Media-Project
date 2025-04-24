import { Router } from "express";
import {
  followUser,
  unfollowUser,
} from "../controller/followController.js";
import { authenticate } from "../middleware/authenticateUser.js";

const router = Router();

// Follow/Unfollow user
router.post("/follow", authenticate, followUser); // Follow a user
router.post("/unfollow", authenticate, unfollowUser); // Unfollow a user

export default router;