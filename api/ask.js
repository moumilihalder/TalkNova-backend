// routes/chat.js
import express from 'express';
import Chat from '../models/Chat.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all chats for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new prompt to Gemini AI
router.post('/ask', authMiddleware, async (req, res) => {
  const { prompt } = req.body;
  try {
    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    // Call Gemini AI (replace this with your actual Gemini call)
    const answer = "AI reply placeholder"; 

    // Save chat
    const chat = new Chat({ user: req.userId, userMessage: prompt, aiReply: answer });
    await chat.save();

    res.json({ answer, chatId: chat._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;