import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsersProfile,
} from "../controller/userController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", getUserProfile);
router.get("/profile", getAllUsersProfile);
router.put("/profile/:id", updateUserProfile);

export default router;
