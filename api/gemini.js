// File: api/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sirf POST allowed hai' });
  }

  try {
    const { systemPrompt, userQuery, generationConfig } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // CHANGE 1: Wapas sabse stable "gemini-pro" model par aa gaye
    // CHANGE 2: "systemInstruction" hata diya (kyunki ye model support nahi karta)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-pro" 
    });

    // TRICK: Teacher/Friend ka dimaag hum sawal ke saath jod kar bhejenge
    const finalPrompt = `${systemPrompt}\n\nUser Question: ${userQuery}`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        generationConfig: generationConfig || {}
    });

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}