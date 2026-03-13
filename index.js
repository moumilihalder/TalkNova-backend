import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
}));


app.use(express.json());


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    const answer = response.text?.() || "No response";

    res.json({ answer });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});


app.get('/', (req, res) => {
  res.send('TalkNova Backend Running with Gemini 1.5-flash!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TalkNova Backend Running with Gemini 1.5-flash!`);
  console.log(`Server running on port ${PORT}`);
});

export default app;
