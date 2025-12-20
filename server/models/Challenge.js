import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema({
    creator: {
        type: String, // Firebase UID
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    questions: {
        type: Number,
        required: true
    },
    minRating: {
        type: Number,
        required: true
    },
    currentSolved: {
        type: Number,
        default: 0
    },
    timeframe: {
        type: Number, // Duration in days
        required: true
    },
    stake: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'failed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
        required: true
    },
    participants: [{
        type: String,
        ref: "User"
    }]
});

export default mongoose.model("Challenge", ChallengeSchema);
