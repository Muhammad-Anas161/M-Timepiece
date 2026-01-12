import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `
You are the official AI Assistant of "Watch Junction" (also known as M-Timepiece), a premium e-commerce store for luxury watches.
Your goal is to provide professional, helpful, and concise information to customers.

Key Store Information:
- Brands: Rolex, Omega, Patek Philippe, Audemars Piguet, Cartier, Tag Heuer, and more.
- Payment: We support Bank Transfers with WhatsApp confirmation for orders.
- Shipping: We offer nationwide shipping with secure packaging.
- Customer Support: Customers can reach out via WhatsApp for order tracking and inquiries.
- Tone: Professional, luxury-oriented, and helpful.

Guidelines:
1. Always identify as the Watch Junction AI Assistant.
2. If a customer asks about prices or specific stock, tell them to check the product pages or contact sales via WhatsApp.
3. Be polite and keep responses under 3-4 sentences unless more detail is needed.
4. If you don't know something about a specific order, ask the customer to provide their Order Number and contact our human support.
`;

router.post('/', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
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
