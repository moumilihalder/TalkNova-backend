// api/ask.js
import express from "express";
import { GoogleGenAI } from "@google/genai";
import authMiddleware from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// POST /api/ask
router.post("/", authMiddleware, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-turbo", // use a valid model from your account
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

    res.json({ answer, chatId: chat._id });
  } catch (err) {
    console.error("FULL GEMINI ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;