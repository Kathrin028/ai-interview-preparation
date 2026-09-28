const express = require("express");

const router = express.Router();

const {
  getHRQuestions,
  getTechnicalQuestions,
  getAptitudeQuestions,
  getCommunicationQuestions,
  getResumeQuestions,
} = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/hr/:difficulty", getHRQuestions);
router.get("/technical/:category/:difficulty", getTechnicalQuestions);
router.get("/aptitude/:category/:difficulty", getAptitudeQuestions);
router.get("/communication/:category/:difficulty", getCommunicationQuestions);
router.post("/resume", authMiddleware, getResumeQuestions);

module.exports = router;