import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
        // unique: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: { // NEW: optional userId to link threads to a user
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, // null for guests
    },
    title: {
        type: String,
        default: "New Chat", 
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

});

export default mongoose.model("Thread", ThreadSchema);