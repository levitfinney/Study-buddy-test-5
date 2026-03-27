import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.static("."));

app.post("/ask", async (req, res) => {
  const messages = req.body.messages;
  const mode = req.body.mode || "";

  const prompt = `
You are an educational AI tutor.
- Only give safe, school-appropriate answers
- Explain clearly
- Help students understand topics
- Use examples when helpful

Conversation:
${messages.map(m => `${m.role}: ${m.content}`).join("\n")}

Task:
${mode}
`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt
    })
  });

  const data = await response.json();

  res.json({
    reply: data.output[0].content[0].text
  });
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));
