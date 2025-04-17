import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getCurrentUserProfile,
  logoutUser,
} from "../controller/userController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protect the following routes with authentication middleware
router.get("/profile/:id", authenticateUser, getUserProfile);
router.get("/profile",authenticateUser , getCurrentUserProfile);
router.put("/profile/me/update",authenticateUser , updateUserProfile);

export default router;
