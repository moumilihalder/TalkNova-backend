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
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    res.json({ answer: response.text });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});


app.get('/', (req, res) => {
  res.send('TalkNova Backend Running with Gemini 2.0 Flash!');
});

export default app;
