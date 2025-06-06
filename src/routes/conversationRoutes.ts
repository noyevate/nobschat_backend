import { Router } from "express";
import { getUserConversations } from "../controllers/conversationController";
import { verifyToken } from '../middleware/authMiddleware';



const router = Router();

router.get("/", verifyToken, getUserConversations);





export default router;