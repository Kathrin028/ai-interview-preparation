const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: "Hello",
    });
    console.log("Success with gemini-1.5-flash:", response.text());
  } catch(e) {
    console.error("1.5-flash failed:", e.message);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: "Hello",
    });
    console.log("Success with gemini-2.0-flash:", response.text());
  } catch(e) {
    console.error("2.0-flash failed:", e.message);
  }
}
run();
