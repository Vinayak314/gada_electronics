import express from "express";
import authMiddleware from "../middleware/auth.js";
import { linkCodeforces, searchUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/codeforces/link", authMiddleware, linkCodeforces);
router.get("/search", authMiddleware, searchUsers);

export default router;
