import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `
You are the official AI Assistant of "M Timepiece", a premium e-commerce store for luxury watches.
Your goal is to provide sophisticated yet natural conversation to our clients.

Key Store Information:
- Brand Name: M Timepiece.
- Founders: Muhammad Nabeel and Muhammad Anas.
- Collection: Rolex, Omega, Patek Philippe, Audemars Piguet, Cartier, Tag Heuer.
- Services: Authentication guarantees, nationwide secure shipping, 7-day return policy.
- Payment: Bank Transfers (confirmed via WhatsApp).
- Tone: Professional, polite, concise, and natural. Avoid being overly robotic.

Guidelines:
1. Do NOT start every message by introducing yourself. Only do so if specifically asked "Who are you?".
2. Answer specifically what the user asks. If the user says "Hi", just say "Hello! How can I help you?".
3. If asked about prices, gently guide them to the "Collections" page or WhatsApp for the best deal.
4. Keep responses elegant and brief (under 3 sentences).
`;

router.post('/', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;
