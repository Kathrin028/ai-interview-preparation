const mongoose = require("mongoose");

const learningResourceSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    title: { type: String, required: true },
    resourceType: { type: String, required: true }, // youtube, playlist, notes, pdf, website, documentation, practice
    url: { type: String, required: true },
    source: { type: String, required: true },
    description: { type: String },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "All"], default: "All" },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningResource", learningResourceSchema);
