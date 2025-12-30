// File: api/gemini.js
// Ye code server pe chalega, kisi ko dikhega nahi

// Google ka library import kar rahe hain
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // 1. Check karna ki request "POST" hai ya nahi (Order lena)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sirf POST request allowed hai bhai' });
  }

  try {
    // 2. Frontend se data nikalna (Customer ka order)
    const { userPrompt } = req.body;

    // 3. Waiter apni jeb se Secret Key nikalega (Environment Variable)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 4. Kitchen (Gemini Model) select karna
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 5. Kitchen me order dena aur jawab ka wait karna
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    // 6. Jawab Frontend ko wapas bhejna
    return res.status(200).json({ reply: text });

  } catch (error) {
    // Agar kitchen me aag lag gayi (Error aaya)
    console.error(error);
    return res.status(500).json({ error: 'Kitchen me kuch gadbad ho gayi' });
  }
}