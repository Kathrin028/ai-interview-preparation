require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};
async function test() {
  const ai = getAiClient();
  const questions = [
    { question: 'Tell me about React', answer: 'React is a frontend library' }
  ];
  const prompt = `Evaluate the following Resume-Based Interview answers.
      Provide a JSON response containing:
      - relevanceScore (number 1-10)
      - clarityScore (number 1-10)
      - completenessScore (number 1-10)
      - professionalismScore (number 1-10)
      - overallScore (number 1-10)
      - strengths (array of strings)
      - improvements (array of strings)
      - feedback (string)
      - questions (array matching input order, each with {score: number 1-10, feedback: string, suggestedAnswer: string})
      Questions and Answers: ${JSON.stringify(questions.map(q => ({ question: q.question, answer: q.answer })))}`;

  try {
    console.log("SENDING REQUEST");
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    console.log('RAW RESPONSE:');
    console.log(response.text);
    const parsed = JSON.parse(response.text);
    console.log('PARSED KEYS:', Object.keys(parsed));
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}
test();
