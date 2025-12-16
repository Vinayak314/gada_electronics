import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  login,
  me,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", authMiddleware, login);
router.get("/me", authMiddleware, me);

export default router;
