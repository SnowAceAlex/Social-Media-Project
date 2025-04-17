import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getCurrentUserProfile,
  logoutUser,
} from "../controller/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authenticate } from "../middleware/authenticateUser.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protect the following routes with authentication middleware
// router.get("/profile/:id", authenticateToken, getUserProfile);
// router.get("/profile", authenticateToken, getCurrentUserProfile);
// router.put("/profile/:id", authenticateToken, updateUserProfile);
router.get("/profile/:id", authenticate, getUserProfile);
router.get("/profile", authenticate, getCurrentUserProfile);
router.put("/profile/me/update", authenticate, updateUserProfile);

export default router;
