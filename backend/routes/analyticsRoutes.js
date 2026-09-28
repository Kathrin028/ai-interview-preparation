const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getSkillGap, explainWrongAnswer } = require("../controllers/analyticsController");

router.get("/skill-gap", authMiddleware, getSkillGap);
router.post("/interview/:id/explain/:questionIndex", authMiddleware, explainWrongAnswer);

module.exports = router;
