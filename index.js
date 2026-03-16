import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import authMiddleware from "./middleware/authMiddleware.js";
import Chat from "./models/Chat.js";

dotenv.config();

const app = express();

// ---------------------------
// Middleware
// ---------------------------
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json()); // must be before routes

// ---------------------------
// MongoDB Connection
// ---------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------------------------
// Routes
// ---------------------------
app.use("/api/auth", authRoutes);  // login & register
app.use("/api/chats", chatRoutes); // chat CRUD

// ---------------------------
// Initialize Gemini AI
// ---------------------------
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ---------------------------
// Ask endpoint (Gemini AI)
// ---------------------------
app.post("/api/ask", authMiddleware, async (req, res) => {
  const { prompt } = req.body;

  try {
    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const answer =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

    // Save chat
    const chat = new Chat({
      user: req.userId,
      userMessage: prompt,
      aiReply: answer,
    });

    await chat.save();

    res.json({
      answer,
      chatId: chat._id,
    });
  } catch (err) {
    console.error("FULL GEMINI ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// Health check
// ---------------------------
app.get("/", (req, res) => {
  res.send("TalkNova Backend Running with Gemini AI 🚀");
});

// ---------------------------
// Export app for Vercel
// ---------------------------
export default app;