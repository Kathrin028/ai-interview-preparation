const Interview = require("../models/Interview");
const { GoogleGenAI } = require("@google/genai");
const Resume = require("../models/Resume");

const getAiClient = () => {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return null;
};

const evaluateInterviewAsync = async (interviewId, type, questions) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      throw new Error("getAiClient returned null");
    }

    console.log(`[Evaluation] Interview ID: ${interviewId}`);
    console.log(`[Evaluation] Starting AI evaluation`);
    console.log(`[Evaluation] Number of answers: ${questions.length}`);
    
    let prompt = "";
    if (type === "Communication Assessment") {
      prompt = `Evaluate the following communication assessment answers.
      Provide a JSON response containing:
      - grammar (number 1-10)
      - clarity (number 1-10)
      - professionalism (number 1-10)
      - relevance (number 1-10)
      - overallScore (number 1-10)
      - feedback (string)
      - improvements (array of strings)
      Questions and Answers: ${JSON.stringify(questions.map(q => ({ prompt: q.question, answer: q.answer })))}`;
    } else {
      let extraContext = "";
      if (type === "Resume-Based Interview") {
        try {
          const interview = await Interview.findById(interviewId);
          if (interview) {
            const resume = await Resume.findOne({ userId: interview.userId });
            if (resume) {
              extraContext = `\nCandidate Resume Data: ${JSON.stringify({
                skills: resume.skills, projects: resume.projects, experience: resume.experience
              })}. Evaluate if the candidate demonstrates genuine understanding of their own projects and skills.`;
            }
          }
        } catch (err) {
          console.error("Could not fetch resume for evaluation context:", err);
        }
      }

      prompt = `Evaluate the following ${type} answers.${extraContext}
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
    }

    console.log(`[Evaluation] Gemini request started`);
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    let generatedText = response.text || "";
    console.log(`[Evaluation] Gemini response received. Length: ${generatedText.length}`);
    const firstBrace = generatedText.indexOf('{');
    const lastBrace = generatedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      generatedText = generatedText.substring(firstBrace, lastBrace + 1);
    }
    
    const parsed = JSON.parse(generatedText);
    console.log("[Evaluation] JSON parsing successful");
    
    let updateData = { evaluationStatus: "completed", evaluationSource: "gemini" };
    if (type === "Communication Assessment") {
      updateData = {
        ...updateData,
        grammarScore: parsed.grammar,
        clarityScore: parsed.clarity,
        professionalismScore: parsed.professionalism,
        relevanceScore: parsed.relevance,
        overallScore: parsed.overallScore,
        feedback: parsed.feedback,
        improvements: parsed.improvements || []
      };
    } else {
      const updatedQuestions = questions.map((q, idx) => {
        const aiQ = parsed.questions && parsed.questions[idx] ? parsed.questions[idx] : {};
        return {
          question: q.question,
          answer: q.answer,
          options: q.options,
          correctAnswer: q.correctAnswer,
          score: aiQ.score || 0,
          feedback: aiQ.feedback || "",
          suggestedAnswer: aiQ.suggestedAnswer || ""
        };
      });

      updateData = {
        ...updateData,
        relevanceScore: parsed.relevanceScore,
        clarityScore: parsed.clarityScore,
        completenessScore: parsed.completenessScore,
        professionalismScore: parsed.professionalismScore,
        overallScore: parsed.overallScore,
        feedback: parsed.feedback,
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || [],
        questions: updatedQuestions
      };
    }
    
    await Interview.findByIdAndUpdate(interviewId, updateData);
    console.log("[Evaluation] MongoDB update successful");
    console.log("[Evaluation] Evaluation completed");

  } catch(error) {
    console.error(`[Evaluation ERROR] ${new Date().toISOString()} - ${error.message}`);
    console.log("Gemini evaluation unavailable; using local fallback evaluator.");
    
    try {
      const { evaluateAnswersFallback } = require('../utils/fallbackEvaluator');
      const parsed = evaluateAnswersFallback(type, questions);
      
      let updateData = { evaluationStatus: "completed", evaluationSource: "local" };
      if (type === "Communication Assessment") {
        updateData = {
          ...updateData,
          grammarScore: parsed.grammar,
          clarityScore: parsed.clarity,
          professionalismScore: parsed.professionalism,
          relevanceScore: parsed.relevance,
          overallScore: parsed.overallScore,
          feedback: parsed.feedback,
          improvements: parsed.improvements || []
        };
      } else {
        const updatedQuestions = questions.map((q, idx) => {
          const aiQ = parsed.questions && parsed.questions[idx] ? parsed.questions[idx] : {};
          return {
            question: q.question,
            answer: q.answer,
            options: q.options,
            correctAnswer: q.correctAnswer,
            score: aiQ.score || 0,
            feedback: aiQ.feedback || "",
            suggestedAnswer: aiQ.suggestedAnswer || ""
          };
        });

        updateData = {
          ...updateData,
          relevanceScore: parsed.relevanceScore,
          clarityScore: parsed.clarityScore,
          completenessScore: parsed.completenessScore,
          professionalismScore: parsed.professionalismScore,
          overallScore: parsed.overallScore,
          feedback: parsed.feedback,
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || [],
          questions: updatedQuestions
        };
      }
      
      await Interview.findByIdAndUpdate(interviewId, updateData);
      console.log("[Evaluation] Fallback MongoDB update successful");
    } catch (fallbackError) {
      console.error("Fallback evaluation failed:", fallbackError);
      await Interview.findByIdAndUpdate(interviewId, { evaluationStatus: "failed" });
    }
  }
};

// Save Interview
const saveInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      interviewType,
      difficulty,
      category,
      questions,
      answered,
      totalQuestions,
      timeTaken,
      correctAnswersCount,
      incorrectAnswersCount,
      scorePercentage
    } = req.body;

    const interview = await Interview.create({
      userId,
      interviewType,
      difficulty,
      category,
      questions,
      answered,
      totalQuestions,
      timeTaken,
      correctAnswersCount,
      incorrectAnswersCount,
      scorePercentage,
      evaluationStatus: "pending"
    });

    res.status(201).json({
      message: "Interview Saved Successfully",
      interview,
    });

    if (interviewType !== "Aptitude Assessment") {
      evaluateInterviewAsync(interview._id, interviewType, questions);
    } else {
      await Interview.findByIdAndUpdate(interview._id, { evaluationStatus: "completed" });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Interviews of a User
const getInterviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const interviews = await Interview.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Interview Details
const getInterviewDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const interview = await Interview.findOne({ _id: id, userId });

    if (!interview) {
      return res.status(404).json({ message: "Report not found or unauthorized" });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveInterview,
  getInterviews,
  getInterviewDetails,
  evaluateInterviewAsync
};