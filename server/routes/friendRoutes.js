import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    getFriendRequests
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/request/:receiverId", authMiddleware, sendFriendRequest);
router.post("/accept/:senderId", authMiddleware, acceptFriendRequest);
router.post("/reject/:senderId", authMiddleware, rejectFriendRequest);
router.get("/", authMiddleware, getFriends);
router.get("/requests", authMiddleware, getFriendRequests);

export default router;
