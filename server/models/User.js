import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: {
    type: String, // Firebase UID
    required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
);

export default mongoose.model("User", UserSchema);