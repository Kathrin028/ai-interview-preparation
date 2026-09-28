const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// =======================
// Middleware
// =======================
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
if (process.env.FRONTEND_URL) {
  // Remove trailing slash if user accidentally included it
  const cleanUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
  allowedOrigins.push(cleanUrl);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    
    // Log the blocked origin to the console for easy debugging in Render logs
    console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());

// =======================
// Import Routes
// =======================
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const learningRoutes = require("./routes/learningRoutes");

// =======================
// Home Route
// =======================
app.get("/", (req, res) => {
  res.send("AI Interview Backend Running...");
});

// =======================
// API Routes
// =======================

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Interview API is running"
  });
});

// Authentication
app.use("/api/auth", authRoutes);

// Interview
app.use("/api/interview", interviewRoutes);

// Questions
app.use("/api/questions", questionRoutes);

// Users
app.use("/api/users", userRoutes);

// Resume
app.use("/api/resume", resumeRoutes);

// Analytics
app.use("/api/analytics", analyticsRoutes);

// Learning & Practice
app.use("/api/learning", learningRoutes);

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

// Connect Database and then start server
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to MongoDB. Server not started.");
  console.error(err);
  process.exit(1);
});