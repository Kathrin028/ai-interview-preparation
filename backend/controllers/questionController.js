const hrQuestions = {
  Easy: [
    "Tell me about yourself.",
    "Why do you want to work here?",
    "What are your strengths?",
    "What motivates you?",
    "Describe yourself in three words."
  ],

  Medium: [
    "Tell me about a challenge you overcame.",
    "Describe a difficult team situation.",
    "How do you manage deadlines?",
    "Why should we hire you?",
    "How do you handle criticism?"
  ],

  Hard: [
    "Describe a time you failed and what you learned.",
    "Tell me about a conflict with a coworker.",
    "How would you handle an unhappy client?",
    "Explain a difficult decision you made.",
    "Describe your leadership experience."
  ]
};

const { GoogleGenAI } = require("@google/genai");
const Resume = require("../models/Resume");

const getAiClient = () => {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return null;
};

const localAptitudeQuestions = require('../data/aptitudeQuestions');
const localCommunicationQuestions = require('../data/communicationQuestions');

const getRandomQuestions = (bank, category, difficulty, count) => {
  let filtered = bank.filter(q => q.category === category && q.difficulty === difficulty);
  if (filtered.length < count) {
    filtered = bank.filter(q => q.category === category);
  }
  if (filtered.length < count) {
    filtered = [...bank];
  }
  return filtered.sort(() => 0.5 - Math.random()).slice(0, count);
};

const getHRQuestions = async (req, res) => {
  try {
    const { difficulty } = req.params;
    let count = parseInt(req.query.count) || 5;
    if (count > 20) count = 20;

    const ai = getAiClient();
    console.log("AI Client created:", !!ai);
    if (ai) {
      try {
        const prompt = `Generate ${count} HR interview questions for a candidate at ${difficulty} difficulty. Output as a JSON array of strings. Do not include markdown formatting outside the JSON array.`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        const generatedText = response.text;
        const parsed = JSON.parse(generatedText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json(parsed);
        }
      } catch (aiError) {
        console.error("AI Generation failed for HR questions, falling back to static:", aiError.message);
      }
    }

    const staticList = hrQuestions[difficulty] || hrQuestions.Easy;
    res.json(staticList.slice(0, count));

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getTechnicalQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.params;
    let count = parseInt(req.query.count) || 5;
    if (count > 20) count = 20;

    const ai = getAiClient();
    if (ai) {
      try {
        const prompt = `Generate ${count} Technical interview questions for a candidate in category: "${category}" at ${difficulty} difficulty. 
Output ONLY a valid JSON array of objects with the exact following schema:
[
  {
    "question": "The actual technical question",
    "topic": "${category}"
  }
]`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        const generatedText = response.text || "";
        const firstBrace = generatedText.indexOf('[');
        const lastBrace = generatedText.lastIndexOf(']');
        const cleanJson = generatedText.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ questions: parsed });
        }
      } catch (aiError) {
        console.error("AI Generation failed for Technical questions, falling back to static:", aiError.message);
      }
    }
    
    // Mock technical questions until AI integration fallback
    const questions = Array.from({ length: count }).map((_, i) => {
      const genericTemplates = [
        `Explain a core concept of ${category}.`,
        `How does ${category} handle memory or data structures?`,
        `What is an advanced feature of ${category} you have used?`,
        `Write a pseudo-code for a common problem in ${category}.`,
        `How do you optimize performance in ${category}?`
      ];
      return {
        question: genericTemplates[i % genericTemplates.length],
        topic: category
      };
    });
    
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAptitudeQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.params;
    let count = parseInt(req.query.count) || 10;
    if (count > 20) count = 20;

    const ai = getAiClient();
    if (ai) {
      try {
        const prompt = `You are an expert test creator. Generate exactly ${count} REAL, challenging multiple-choice aptitude questions for the category: "${category}" at ${difficulty} difficulty.
If the category is Quantitative Aptitude, generate real math problems (e.g. percentages, ratios, probability, time/speed/distance).
If the category is Logical Reasoning, generate real puzzle or logic problems.
DO NOT generate generic placeholders. DO NOT use generic phrases like "Sample question". Provide concrete problems and precise answers.
Output ONLY a valid JSON array of objects with the exact following schema:
[
  {
    "question": "The actual full aptitude problem text",
    "options": ["Specific Answer 1", "Specific Answer 2", "Specific Answer 3", "Specific Answer 4"],
    "correctAnswer": "The exact string from options that is correct",
    "topic": "${category}"
  }
]`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        const generatedText = response.text || "";
        const firstBrace = generatedText.indexOf('[');
        const lastBrace = generatedText.lastIndexOf(']');
        const cleanJson = generatedText.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ questions: parsed, source: "gemini" });
        }
      } catch (aiError) {
        console.error("AI Generation failed for Aptitude questions:", aiError.message);
        console.log("Gemini quota unavailable - using local question bank.");
        const fallback = getRandomQuestions(localAptitudeQuestions, category, difficulty, count);
        return res.json({ questions: fallback, source: "local" });
      }
    } else {
      console.log("Gemini client null - using local question bank.");
      const fallback = getRandomQuestions(localAptitudeQuestions, category, difficulty, count);
      return res.json({ questions: fallback, source: "local" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommunicationQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.params;
    let count = parseInt(req.query.count) || 5;
    if (count > 20) count = 20;

    const ai = getAiClient();
    if (ai) {
      try {
        const prompt = `You are an expert HR and behavioral interviewer. Generate exactly ${count} REAL, challenging Communication interview scenarios or behavioral questions for a candidate in the category: "${category}" at ${difficulty} difficulty.
DO NOT generate generic placeholders. Provide concrete, realistic workplace situations or detailed behavioral prompts (e.g. "Tell me about a time when you had to mediate a conflict between two senior team members who disagreed on a technical approach...").
Output ONLY a valid JSON array of objects with the exact following schema:
[
  {
    "question": "The actual full communication scenario or detailed behavioral question",
    "topic": "${category}"
  }
]`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        const generatedText = response.text || "";
        const firstBrace = generatedText.indexOf('[');
        const lastBrace = generatedText.lastIndexOf(']');
        const cleanJson = generatedText.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ questions: parsed, source: "gemini" });
        }
      } catch (aiError) {
        console.error("AI Generation failed for Communication questions:", aiError.message);
        console.log("Gemini quota unavailable - using local question bank.");
        const fallback = getRandomQuestions(localCommunicationQuestions, category, difficulty, count);
        return res.json({ questions: fallback, source: "local" });
      }
    } else {
      console.log("Gemini client null - using local question bank.");
      const fallback = getRandomQuestions(localCommunicationQuestions, category, difficulty, count);
      return res.json({ questions: fallback, source: "local" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResumeQuestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { difficulty, focusArea, count = 5 } = req.body;

    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({ message: "No resume found. Please upload a resume first." });
    }

    const ai = getAiClient();
    if (!ai) {
      throw new Error("AI client is not configured correctly.");
    }

    const resumeDataStr = JSON.stringify({
      skills: resume.skills,
      technologies: resume.technologies,
      projects: resume.projects,
      internships: resume.internships,
      experience: resume.experience,
      certifications: resume.certifications,
      education: resume.education
    });

    let prompt = `You are conducting a personalized technical/job interview based on the candidate's resume.
Resume Data: ${resumeDataStr}
Difficulty: ${difficulty || 'Medium'}
Focus Area: ${focusArea || 'All Resume Skills'}

Generate exactly ${count} interview questions. 
The questions must be Resume-specific, relevant, technically meaningful, and appropriate for the difficulty.
Do NOT hallucinate information that does not exist in the resume data.
Output ONLY a valid JSON array of objects with the exact following schema:
[
  {
    "question": "The interview question",
    "topic": "The general topic (e.g. React, Machine Learning)",
    "source": "Where in the resume it comes from (e.g. project, experience, skills)",
    "sourceDetail": "Specific detail (e.g. E-commerce Website)",
    "difficulty": "${difficulty || 'Medium'}"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const generatedText = response.text || "";
    const firstBrace = generatedText.indexOf('[');
    const lastBrace = generatedText.lastIndexOf(']');
    const cleanJson = generatedText.substring(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(cleanJson);
    
    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json({ questions: parsed, source: "gemini" });
    } else {
      throw new Error("Invalid AI response format");
    }

  } catch (error) {
    console.error("AI Generation failed for Resume questions:", error.message);
    console.log("Gemini quota unavailable - using local resume question generator.");
    
    try {
      const { generateResumeFallback } = require('../utils/resumeQuestionFallback');
      const userId = req.user.id;
      const { difficulty, focusArea, count = 5 } = req.body;
      const resume = await Resume.findOne({ userId });
      
      const fallbackQuestions = generateResumeFallback(resume, difficulty, focusArea, count);
      return res.json({ questions: fallbackQuestions, source: "local" });
    } catch (fallbackError) {
      console.error("Fallback generation failed:", fallbackError);
      return res.status(500).json({ message: "Failed to generate personalized questions from resume." });
    }
  }
};

module.exports = {
  getHRQuestions,
  getTechnicalQuestions,
  getAptitudeQuestions,
  getCommunicationQuestions,
  getResumeQuestions,
};