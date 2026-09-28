const mongoose = require("mongoose");

const reassessmentSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: String,
        selectedAnswer: String,
        isCorrect: Boolean,
        explanation: String,
      }
    ],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReassessmentSession", reassessmentSessionSchema);
