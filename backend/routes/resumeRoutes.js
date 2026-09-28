const express = require("express");
const multer = require("multer");
const { uploadResume, getResume } = require("../controllers/resumeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Memory storage for immediate processing
const storage = multer.memoryStorage();
// Limit to 5MB
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);
router.get("/", authMiddleware, getResume);

module.exports = router;
