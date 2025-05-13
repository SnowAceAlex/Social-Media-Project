import { Router } from "express";
import {
  getMessages,
  deleteAllMessages,
  deleteMessage,
} from "../controller/messageController.js";
import { authenticate } from "../middleware/authenticateUser.js";

const router = Router();

// Messages
router.get("/", authenticate, getMessages); // Get messages between two users
router.delete("/", authenticate, deleteAllMessages); // Delete all messages between two users
router.delete("/:messageId", authenticate, deleteMessage); // Delete a specific message

export default router;
