import express from "express";
import { authenticate } from "../middleware/authenticateUser.js";
import { createOrGetConversation, deleteConversation, getReceiverProfile, getUserConversations } from "../controller/conservationController.js";

const router = express.Router();

router.post("/", authenticate, createOrGetConversation);
router.get("/", authenticate, getUserConversations);
router.get("/:conversationId/receiver", authenticate, getReceiverProfile)
router.delete("/:conversationId", authenticate, deleteConversation);

export default router;