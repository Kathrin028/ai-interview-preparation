const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  saveInterview,
  getInterviews,
  getInterviewDetails
} = require("../controllers/interviewController");

// Save Interview
router.post("/save", authMiddleware, saveInterview);

// Get User Interviews
router.get("/", authMiddleware, getInterviews);

// Get Specific Interview Details
router.get("/:id/details", authMiddleware, getInterviewDetails);

module.exports = router;