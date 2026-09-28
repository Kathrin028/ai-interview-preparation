const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: "say hi, output JSON array",
      config: {
        responseMimeType: "application/json",
      }
    });
    console.log("Success with gemini-3.5-flash:", response.text);
  } catch(e) {
    console.error("2.5-flash failed:", e.message);
  }
}
run();
