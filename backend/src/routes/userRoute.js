import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsersProfile,
} from "../controller/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js"; 


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protect the following routes with authentication middleware
router.get("/profile/:id", authenticateToken, getUserProfile);
router.get("/profile", authenticateToken, getAllUsersProfile);
router.put("/profile/:id", authenticateToken, updateUserProfile);

export default router;
