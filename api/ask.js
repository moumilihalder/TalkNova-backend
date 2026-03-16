import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// POST /api/ask
router.post("/", authMiddleware, async (req, res) => {
  const { prompt } = req.body;

  try {
    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    // ⚡ Placeholder AI reply
    const answer = "This is a placeholder AI reply. Gemini model not available.";

    // Save chat to DB
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
    console.error("ASK ROUTE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;