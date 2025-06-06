import express from "express";
import { createMessage } from "../controllers/messagesController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, createMessage);

export default router;
