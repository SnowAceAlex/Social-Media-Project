import { Router } from "express";
import {
  getNotifications,
  deleteNotification,
} from "../controller/notificationController.js";
import { authenticate } from "../middleware/authenticateUser.js";

const router = Router();

// Notifications
router.get("/notifications", authenticate, getNotifications); // Get notifications for the user
router.delete("/notifications/:notificationId", authenticate, deleteNotification); // Delete a notification

export default router;