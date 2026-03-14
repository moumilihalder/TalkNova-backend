import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
saveChat,
getChats,
getChatById,
deleteChat
} from "../controllers/chatController.js";

const router = express.Router();

// Save new chat
router.post("/save", authMiddleware, saveChat);

// Get all chats (Sidebar history)
router.get("/", authMiddleware, getChats);

// Get single chat
router.get("/:id", authMiddleware, getChatById);

// Delete chat
router.delete("/:id", authMiddleware, deleteChat);

export default router;
