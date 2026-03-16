// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import askRoutes from "./api/ask.js"; // correct ask route

dotenv.config();

const app = express();

// ---------------------------
// Middleware
// ---------------------------
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json()); // parse JSON body

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
app.use("/api/auth", authRoutes);   // login & register
app.use("/api/chats", chatRoutes);  // chat CRUD
app.use("/api/ask", askRoutes);     // post prompts to Gemini AI

// ---------------------------
// Health check
// ---------------------------
app.get("/", (req, res) => {
  res.send("TalkNova Backend Running 🚀");
});

// ---------------------------
// Export app for Vercel
// ---------------------------
export default app;