import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // JWT auth middleware
import jwt from "jsonwebtoken";

const router = express.Router();

//test
router.post("/test", async(req,res) =>{
    try {
        const thread = new Thread({
            threadId: "xyz",
            title:"Testing new route Thread"
        });

        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB."});
    }
});

// Setting Up Routes-->

//Get all threads (optional: only user threads if authenticated)
router.get("/thread",authMiddleware, async(req, res) =>{
    try {
        const query = req.user ? { userId: req.user.id } : {};
        const threads = await Thread.find(query).sort({updatedAt: -1});
        //descending order[-1] of updatedAt...most recent data on top
        res.json(threads);
    }catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch Threads."});
    }
});

//Need specific thread
router.get("/thread/:threadId", authMiddleware, async(req,res) =>{
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            res.status(404).json({error: "Thread not found!"});
        }

        // If user is logged in, only allow their threads
        if (req.user && thread.userId?.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied!" });
        }
        
        res.json(thread.messages);

    }catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat."});
    }
});

//To Delete any thread
router.delete("/thread/:threadId", authMiddleware, async(req,res) =>{
    const {threadId} = req.params;

    try {
        const deleteThread = await Thread.findOne({ threadId });

        if (!deleteThread) return res.status(404).json({ error: "Thread not found!" });

        // Only allow deletion if user owns it
        if (req.user && deleteThread.userId?.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied!" });
        }

        await deleteThread.deleteOne();

        res.status(200).json({success: "Thread deleted successfully"});

    }catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread."});
    }
});

//Main route [chat reply]
router.post("/chat", async(req,res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message){
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        // ✅ Try to decode token if present (optional for guests)
        let user = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            const token = authHeader.split(" ")[1];
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log("Invalid or expired token, continuing as guest");
        }
        }

        let thread = await Thread.findOne({threadId});

        if(!thread) {
            // Create new thread, attach userId if logged in
            thread = new Thread({
                threadId,
                title: message,
                userId: user?.id || null, // optional for guests                
                messages: [{role: "user", content: message}]
            });
        }else {
            // If thread exists and is user-owned, only allow the owner
            if (req.user && thread.userId?.toString() !== req.user.id) {
                return res.status(403).json({ error: "Access denied!" });
            }
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getOpenAIAPIResponse(message);


        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply});

    }catch (err) {
        console.log(err); 
        res.status(500).json({error: "something went wrong!"});
    }
});


export default router;