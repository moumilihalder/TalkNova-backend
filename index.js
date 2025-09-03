import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


app.get("/", (req, res) => {
  res.send("Backend running on Vercel");
});


app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const result = await model.generateContent(prompt);
    const text = result?.response?.text() ||
                 result?.candidates?.[0]?.content?.parts?.[0]?.text ||
                 "No response";

    res.json({ response: text });
  } catch (error) {
    console.error("Error in /ask:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default app; 
