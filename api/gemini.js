// File: api/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sirf POST allowed hai' });
  }

  try {
    // Frontend se hume ab multiple cheezein milengi
    const { systemPrompt, userQuery, generationConfig } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Model select karte waqt systemInstruction add karenge (Teacher mode ke liye)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Flash model fast aur sasta hai
        systemInstruction: systemPrompt || "You are a helpful assistant.",
    });

    // Agar frontend ne koi special config (JSON mode) bheja hai to wo use karenge
    const chatConfig = generationConfig || {};

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userQuery }] }],
        generationConfig: chatConfig
    });

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}