const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.log("ERRORE: API key mancante");
    return { statusCode: 500, body: JSON.stringify({ content: [{ text: "API key non configurata" }] }) };
  }

  console.log("API key presente, lunghezza:", API_KEY.length);

  try {
    const body = JSON.parse(event.body);
    console.log("Body ricevuto, system length:", body.system?.length, "messages:", body.messages?.length);
    
    const fullPrompt = body.system + "\n\n" + body.messages[0].content;
    console.log("Prompt length:", fullPrompt.length);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("Chiamata a Gemini...");
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    console.log("Risposta ricevuta, length:", text.length);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ content: [{ text }] })
    };
  } catch (err) {
    console.log("ERRORE CATCH:", err.message, err.status, JSON.stringify(err));
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ content: [{ text: "Errore dettagliato: " + err.message }] })
    };
  }
};
