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


async function withRetry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && err.message.includes("503")) {
      console.warn(`Gemini overloaded. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, delay));
      return withRetry(fn, retries - 1, delay * 2); 
    }
    throw err;
  }
}

app.get("/", (req, res) => {
  res.send("Backend running on Vercel");
});

app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const result = await withRetry(() => model.generateContent(prompt));
    const text =
      result?.response?.text() ||
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ response: text });
  } catch (error) {
    console.error("Error in /ask:", error.message);
    res.status(500).json({
      error: error.message.includes("503")
        ? "Gemini service overloaded. Please try again later."
        : " Something went wrong with the AI request.",
    });
  }
});

export default app;
