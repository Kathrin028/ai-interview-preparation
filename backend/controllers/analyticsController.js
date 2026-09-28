const Interview = require("../models/Interview");
const { GoogleGenAI } = require("@google/genai");

const getAiClient = () => {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return null;
};

const getSkillGap = async (req, res) => {
  try {
    const userId = req.user.id;
    const interviews = await Interview.find({ 
      userId, 
      evaluationStatus: { $in: ["completed", "na"] } // na is for Aptitude sometimes if not async
    });

    if (!interviews || interviews.length === 0) {
      return res.status(200).json({ topics: [] });
    }

    const topicStats = {};

    interviews.forEach(interview => {
      // For aptitude
      if (interview.interviewType === "Aptitude Assessment") {
        const topic = interview.category || "Aptitude";
        if (!topicStats[topic]) topicStats[topic] = { totalScore: 0, count: 0 };
        topicStats[topic].totalScore += (interview.scorePercentage || 0);
        topicStats[topic].count += 1;
      } 
      // For HR / Tech / Resume
      else if (interview.questions && interview.questions.length > 0) {
        interview.questions.forEach(q => {
          if (q.score !== undefined) {
            const topic = q.topic || interview.category || "General";
            if (!topicStats[topic]) topicStats[topic] = { totalScore: 0, count: 0 };
            topicStats[topic].totalScore += (q.score * 10); // convert 1-10 to percentage
            topicStats[topic].count += 1;
          }
        });
      }
    });

    const topics = [];
    for (const [topic, stats] of Object.entries(topicStats)) {
      if (stats.count > 0) {
        const avgScore = Math.round(stats.totalScore / stats.count);
        let status = "Needs Improvement";
        if (avgScore >= 80) status = "Strong";
        else if (avgScore >= 60) status = "Needs Practice";

        topics.push({
          topic,
          score: avgScore,
          status
        });
      }
    }

    topics.sort((a, b) => a.score - b.score); // Weakest first

    res.status(200).json({ topics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const explainWrongAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, questionIndex } = req.params;

    const interview = await Interview.findOne({ _id: id, userId });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found or unauthorized." });
    }

    const q = interview.questions[questionIndex];
    if (!q) {
      return res.status(404).json({ message: "Question not found." });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(500).json({ message: "AI client is not configured correctly." });
    }

    const prompt = `Analyze this weak or incorrect interview answer.
Question: "${q.question}"
Candidate Answer: "${q.answer || 'No answer provided'}"
AI Evaluation Feedback: "${q.feedback}"
Topic: "${q.topic || interview.category || 'General'}"

Return ONLY a valid JSON object explaining why the candidate got it wrong and what they should learn. Do not include markdown formatting.
Schema:
{
  "whyWrong": "Explanation of why the answer was weak (use 'Your answer is partially correct, but...' if applicable instead of 'completely wrong' if it has some merit).",
  "missingConcepts": ["concept1", "concept2"],
  "correctConcept": "A brief explanation of the correct answer.",
  "whatToLearn": "Specific topic name to study",
  "topic": "${q.topic || interview.category || 'General'}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text);
    res.status(200).json(parsed);

  } catch (error) {
    console.error("AI Explanation failed:", error.message);
    res.status(500).json({ message: "Failed to generate explanation. " + error.message });
  }
};

module.exports = {
  getSkillGap,
  explainWrongAnswer
};
