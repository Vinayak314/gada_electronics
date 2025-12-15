import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  login,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", authMiddleware, login);

export default router;
