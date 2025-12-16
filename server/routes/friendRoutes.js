import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/request/:receiverId", authMiddleware, sendFriendRequest);
router.post("/accept/:senderId", authMiddleware, acceptFriendRequest);
router.post("/reject/:senderId", authMiddleware, rejectFriendRequest);

export default router;
