const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewType: {
      type: String,
      required: true,
    },

    category: {
      type: String,
    },

    difficulty: {
      type: String,
      required: true,
    },

    questions: [
      {
        question: String,
        answer: String,
        options: [String],
        correctAnswer: String,
        score: Number,
        feedback: String,
        suggestedAnswer: String,
        topic: String,
        sourceDetail: String,
      },
    ],

    answered: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 5,
    },

    timeTaken: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    correctAnswersCount: {
      type: Number,
    },

    incorrectAnswersCount: {
      type: Number,
    },

    scorePercentage: {
      type: Number,
    },

    relevanceScore: {
      type: Number,
    },

    completenessScore: {
      type: Number,
    },

    grammarScore: {
      type: Number,
    },

    clarityScore: {
      type: Number,
    },

    professionalismScore: {
      type: Number,
    },

    confidenceScore: {
      type: Number,
    },

    overallScore: {
      type: Number,
    },

    feedback: {
      type: String,
    },

    suggestions: {
      type: String,
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    evaluationStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "na"],
      default: "na",
    },

    evaluationSource: {
      type: String,
      enum: ["gemini", "local"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);