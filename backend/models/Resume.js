const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // Ensure one resume per user for now, or allow multiple depending on requirement. Let's make it unique per user.
    },
    fileName: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    projects: {
      type: [String],
      default: [],
    },
    internships: {
      type: [String],
      default: [],
    },
    experience: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    education: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
