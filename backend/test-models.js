import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAQUdjQ2RRvN-P1sVGCcTJRaLyq6ITnbQc');
    const data = await response.json();
    const models = data.models ? data.models.map(m => m.name) : [];
    console.log('Flash Models:', models.filter(m => m.includes('flash')));
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
