import express from "express";
import { createChallenge, getChallenges, getFriendsChallenges } from "../controllers/challengeController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", createChallenge);
router.get("/", getChallenges);
router.get("/friends", getFriendsChallenges);

export default router;
