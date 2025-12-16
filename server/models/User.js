import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: {
        type: String, // Firebase UID
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    photoURL: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tokens: {
        type: Number,
        default: 1000.0,
        min: 0,
    },
    codeforces: {
        handle: String,
        rating: Number,
        rank: String,
        maxRating: Number,
        maxRank: String,
        avatar: String,
        lastUpdated: Date
    },
    friends: [{
        type: String,
        ref: "User"
    }],
    friendRequests: {
        incoming: [{
            type: String,
            ref: "User"
        }],
        outgoing: [{
            type: String,
            ref: "User"
        }]
    }
},
);

export default mongoose.model("User", UserSchema);