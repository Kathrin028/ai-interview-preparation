const mongoose = require("mongoose");

const learningProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    previousScore: { type: Number, default: null }, // Initial weak-topic interview score
    practiceScore: { type: Number, default: null }, // Score from practice
    latestScore: { type: Number, default: null }, // Reassessment score
    improvement: { type: Number, default: null }, // latestScore - previousScore
    practiceCompleted: { type: Boolean, default: false },
    reassessmentCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Ensure uniqueness per user and topic
learningProgressSchema.index({ userId: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model("LearningProgress", learningProgressSchema);
