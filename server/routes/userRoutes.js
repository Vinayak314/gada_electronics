import express from "express";
import authMiddleware from "../middleware/auth.js";
import { linkCodeforces } from "../controllers/userController.js";

const router = express.Router();

router.post("/codeforces/link", authMiddleware, linkCodeforces);

export default router;
