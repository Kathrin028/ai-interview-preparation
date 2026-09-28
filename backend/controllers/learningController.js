const LearningResource = require("../models/LearningResource");
const PracticeSession = require("../models/PracticeSession");
const ReassessmentSession = require("../models/ReassessmentSession");
const LearningProgress = require("../models/LearningProgress");
const Interview = require("../models/Interview");
const { GoogleGenAI } = require("@google/genai");

const getAiClient = () => {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return null;
};

// Seed resources
const { seedLearningResources, curatedResources } = require("../seed/learningResources");
seedLearningResources();

const getResourcesByTopic = async (req, res) => {
  try {
    const rawTopic = req.params.topic;
    let resources = [];
    
    if (rawTopic.toLowerCase() === "all resume skills") {
      const Resume = require("../models/Resume");
      const userId = req.user.id;
      const resume = await Resume.findOne({ userId });
      if (resume && resume.skills && resume.skills.length > 0) {
        const orQuery = resume.skills.map(s => ({ topic: { $regex: new RegExp(`^${s}$`, 'i') } }));
        resources = await LearningResource.find({ $or: orQuery }).limit(5);
      }
      if (resources.length === 0) {
        resources = await LearningResource.find({ topic: "General" }).limit(5);
      }
    } else {
      resources = await LearningResource.find({ topic: { $regex: new RegExp(`^${rawTopic}$`, 'i') } });
      
      // Basic fuzzy fallback
      if (resources.length === 0) {
        let t = rawTopic.toLowerCase();
        let normalized = "General";
        if (t.includes("aptitude")) normalized = "Quantitative Aptitude";
        else if (t.includes("reasoning")) normalized = "Logical Reasoning";
        else if (t.includes("dbms") || t.includes("database") || t.includes("sql") || t.includes("mysql") || t.includes("mongo")) normalized = "DBMS";
        else if (t.includes("react") || t.includes("hooks")) normalized = "React";
        else if (t.includes("javascript") || t.includes("js")) normalized = "JavaScript";
        else if (t.includes("data structure") || t.includes("dsa") || t.includes("algorithm")) normalized = "Data Structures";
        else if (t.includes("auth") || t.includes("jwt") || t.includes("login") || t.includes("security")) normalized = "Authentication";
        else if (t.includes("node") || t.includes("express")) normalized = "Node.js";
        else if (t.includes("python")) normalized = "Python";
        else if (t.includes("java")) normalized = "Java";
        else if (t.includes("c ") || t === "c") normalized = "C";
        
        resources = await LearningResource.find({ topic: normalized });
      }
    }

    res.status(200).json({ topic: rawTopic, resources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generatePracticeQuestions = async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;
    
    if (!topic || !difficulty || !count) {
      return res.status(400).json({ message: "Topic, difficulty, and count are required." });
    }
    
    const validCount = Math.min(Math.max(parseInt(count), 1), 10); // max 10 questions

    const ai = getAiClient();
    if (!ai) {
      return res.status(500).json({ message: "AI client is not configured correctly." });
    }

    const prompt = `Generate ${validCount} objective multiple-choice practice questions (MCQs) strictly on the topic of "${topic}". The difficulty level should be ${difficulty}.
    Do NOT include unrelated questions.
    Return ONLY a valid JSON array. Do not include markdown formatting.
    Schema:
    [
      {
        "question": "The question text",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "The exact string from options that is correct",
        "explanation": "A brief explanation of why this answer is correct",
        "topic": "${topic}"
      }
    ]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text);
    return res.status(200).json({ questions: parsed, source: "gemini" });

  } catch (error) {
    console.error("AI Practice Generation failed:", error.message);
    console.log("Gemini quota unavailable - using local practice question bank.");
    
    // Fallback logic
    const allQuestions = require("../data/practiceQuestions");
    const { topic, difficulty, count } = req.body;
    const validCount = Math.min(Math.max(parseInt(count), 1), 10);
    
    let filtered = allQuestions;
    if (topic && topic.toLowerCase() !== "general") {
      filtered = allQuestions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
      if (filtered.length === 0) {
        // If specific topic lacks questions, fallback to all questions rather than empty array
        filtered = allQuestions;
      }
    }
    
    // Try to filter by difficulty
    let difficultyFiltered = filtered.filter(q => q.difficulty === difficulty);
    if (difficultyFiltered.length < validCount) {
      difficultyFiltered = filtered; // Relax difficulty constraint
    }
    
    // Shuffle and slice
    const selected = difficultyFiltered.sort(() => 0.5 - Math.random()).slice(0, validCount);
    
    return res.status(200).json({ questions: selected, source: "local" });
  }
};

const savePracticeSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, difficulty, questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid questions data." });
    }

    const totalQuestions = questions.length;
    let correctAnswers = 0;

    const processedQuestions = questions.map(q => {
      const isCorrect = q.selectedAnswer === q.correctAnswer;
      if (isCorrect) correctAnswers++;
      return {
        ...q,
        isCorrect
      };
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const session = await PracticeSession.create({
      userId,
      topic,
      difficulty,
      questions: processedQuestions,
      totalQuestions,
      correctAnswers,
      score
    });

    await syncPracticeProgress(userId, topic, score);

    res.status(201).json({ message: "Practice saved successfully", session });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPracticeSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const session = await PracticeSession.findOne({ _id: id, userId });
    if (!session) {
      return res.status(404).json({ message: "Session not found or unauthorized." });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate initial score for a topic
const getInitialScoreForTopic = async (userId, topic) => {
  const interviews = await Interview.find({ userId, evaluationStatus: { $in: ["completed", "na"] } });
  let totalScore = 0;
  let count = 0;

  interviews.forEach(interview => {
    if (interview.interviewType === "Aptitude Assessment") {
      const cat = interview.category || "Aptitude";
      if (cat.toLowerCase() === topic.toLowerCase()) {
        totalScore += (interview.scorePercentage || 0);
        count += 1;
      }
    } else if (interview.questions) {
      interview.questions.forEach(q => {
        const qTopic = q.topic || interview.category || "General";
        if (qTopic.toLowerCase() === topic.toLowerCase() && q.score !== undefined) {
          totalScore += (q.score * 10);
          count += 1;
        }
      });
    }
  });

  if (count === 0) return null;
  return Math.round(totalScore / count);
};

const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const progresses = await LearningProgress.find({ userId });
    res.status(200).json({ progress: progresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateReassessmentQuestions = async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;
    
    if (!topic || !difficulty || !count) {
      return res.status(400).json({ message: "Topic, difficulty, and count are required." });
    }

    const validCount = Math.min(Math.max(parseInt(count), 1), 10);

    const ai = getAiClient();
    if (!ai) {
      return res.status(500).json({ message: "AI client is not configured correctly." });
    }

    const prompt = `This is a reassessment after the candidate has already practiced the topic "${topic}".
    Generate ${validCount} NEW objective multiple-choice questions (MCQs) that test the same underlying concepts without repeating previous basic questions.
    The difficulty level should be ${difficulty}.
    Return ONLY a valid JSON array. Do not include markdown formatting.
    Schema:
    [
      {
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "...",
        "explanation": "...",
        "topic": "${topic}"
      }
    ]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text);
    res.status(200).json(parsed);

  } catch (error) {
    res.status(500).json({ message: "Failed to generate reassessment questions. " + error.message });
  }
};

const saveReassessmentSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, difficulty, questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid questions data." });
    }

    const totalQuestions = questions.length;
    let correctAnswers = 0;

    const processedQuestions = questions.map(q => {
      const isCorrect = q.selectedAnswer === q.correctAnswer;
      if (isCorrect) correctAnswers++;
      return { ...q, isCorrect };
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const session = await ReassessmentSession.create({
      userId,
      topic,
      difficulty,
      questions: processedQuestions,
      totalQuestions,
      correctAnswers,
      score
    });

    // Update Progress
    let progress = await LearningProgress.findOne({ userId, topic });
    if (!progress) {
      progress = new LearningProgress({ userId, topic });
    }
    
    // Ensure previousScore is fetched
    if (progress.previousScore === null) {
      const initialScore = await getInitialScoreForTopic(userId, topic);
      progress.previousScore = initialScore !== null ? initialScore : 0;
    }

    progress.latestScore = score;
    progress.reassessmentCompleted = true;
    progress.improvement = progress.latestScore - progress.previousScore;

    await progress.save();

    res.status(201).json({ message: "Reassessment saved successfully", session, progress });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const syncPracticeProgress = async (userId, topic, score) => {
  let progress = await LearningProgress.findOne({ userId, topic });
  if (!progress) {
    progress = new LearningProgress({ userId, topic });
  }
  
  if (progress.previousScore === null) {
    const initialScore = await getInitialScoreForTopic(userId, topic);
    progress.previousScore = initialScore !== null ? initialScore : 0;
  }
  
  progress.practiceScore = score;
  progress.practiceCompleted = true;
  await progress.save();
};

const getReassessmentSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const session = await ReassessmentSession.findOne({ _id: id, userId });
    if (!session) {
      return res.status(404).json({ message: "Reassessment session not found or unauthorized." });
    }
    
    const progress = await LearningProgress.findOne({ userId, topic: session.topic });

    res.status(200).json({ session, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResourcesByTopic,
  generatePracticeQuestions,
  savePracticeSession,
  getPracticeSession,
  getProgress,
  generateReassessmentQuestions,
  saveReassessmentSession,
  getReassessmentSession
};
