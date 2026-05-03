const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(200).json({ content: [{ text: "API key non configurata" }] });
  }

  try {
    const body = req.body;
    const fullPrompt = body.system + "\n\n" + body.messages[0].content;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    return res.status(200).json({ content: [{ text }] });
  } catch (err) {
    return res.status(200).json({ content: [{ text: "Errore: " + err.message }] });
  }
};
