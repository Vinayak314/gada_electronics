import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";

import cron from "node-cron";
import { checkChallenges, checkPenalties } from "./services/challengeService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

// Schedule Challenge Check (Every hour)
cron.schedule('0 * * * *', () => {
  checkChallenges();
});

// Schedule Penalty Cron (Every day at midnight)
cron.schedule('0 0 * * *', () => {
  checkPenalties();
});

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/users", userRoutes);
app.use("/api/challenges", challengeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});