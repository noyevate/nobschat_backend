// src/routes/authRoutes.ts
import { Router } from "express";
import { register, login } from "../controllers/authControllers"; // ✅ Use named imports

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
