import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsersProfile,
  getCurrentUserProfile,
  logoutUser,
} from "../controller/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protect the following routes with authentication middleware
router.get("/profile/:id", authenticateToken, getUserProfile);
router.get("/profile", authenticateToken, getCurrentUserProfile);
router.put("/profile/:id", authenticateToken, updateUserProfile);

export default router;
