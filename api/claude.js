export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.CLAUDE_API_KEY;
  if (!API_KEY) {
    return res.status(200).json({ content: [{ text: "API key non configurata sul server." }] });
  }

  try {
    const body = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: body.max_tokens || 500,
        system: body.system,
        messages: body.messages
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(200).json({ content: [{ text: "Errore: " + err.message }] });
  }
}
