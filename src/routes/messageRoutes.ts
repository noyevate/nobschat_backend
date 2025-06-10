import express from "express";
import { createMessage, getAllMessagesByConversationId } from "../controllers/messagesController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:conversationId", verifyToken, getAllMessagesByConversationId);

export default router;
