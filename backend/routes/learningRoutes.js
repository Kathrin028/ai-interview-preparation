const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  getResourcesByTopic, 
  generatePracticeQuestions, 
  savePracticeSession, 
  getPracticeSession,
  getProgress,
  generateReassessmentQuestions,
  saveReassessmentSession,
  getReassessmentSession
} = require("../controllers/learningController");

router.get("/resources/:topic", authMiddleware, getResourcesByTopic);
router.post("/practice/generate", authMiddleware, generatePracticeQuestions);
router.post("/practice/save", authMiddleware, savePracticeSession);
router.get("/practice/session/:id", authMiddleware, getPracticeSession);

router.get("/progress", authMiddleware, getProgress);
router.post("/reassess/generate", authMiddleware, generateReassessmentQuestions);
router.post("/reassess/save", authMiddleware, saveReassessmentSession);
router.get("/reassess/session/:id", authMiddleware, getReassessmentSession);

module.exports = router;
