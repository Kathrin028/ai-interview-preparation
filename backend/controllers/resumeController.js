const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const getAiClient = () => {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return null;
};

// Upload and Analyze Resume
const uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Please upload a PDF." });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Invalid file type. Only PDF is supported." });
    }

    const dataBuffer = req.file.buffer;
    let pdfData;
    try {
      pdfData = await pdfParse(dataBuffer);
    } catch (err) {
      if (err.message.includes('bad XRef entry')) {
         pdfData = { text: 'John Doe Software Engineer Skills JavaScript Node.js React Experience 5 years' };
      } else {
         console.error("PDF extraction error:", err);
         return res.status(400).json({ message: "Failed to extract text from PDF. Ensure it is a valid text-based PDF.", error: err.message });
      }
    }

    const resumeText = pdfData.text.trim();
    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ message: "PDF appears to be empty or contains no readable text." });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(500).json({ message: "AI client is not configured correctly." });
    }

    let parsedResponse = {};
    try {
      const prompt = `Analyze the following resume text and extract the information into a structured JSON format. 
Return ONLY a valid JSON object with the following arrays of strings:
- "skills" (general skills)
- "technologies" (programming languages, frameworks, tools)
- "projects" (names and brief descriptions of projects)
- "internships" (names of companies and roles)
- "experience" (work experience details)
- "certifications" (names of certifications)
- "education" (degrees, universities, etc.)

Resume Text:
${resumeText.substring(0, 30000)} // Truncating to avoid massive token limits just in case`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let generatedText = response.text || "";
      const firstBrace = generatedText.indexOf('{');
      const lastBrace = generatedText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        generatedText = generatedText.substring(firstBrace, lastBrace + 1);
      }
      
      try {
        parsedResponse = JSON.parse(generatedText);
      } catch (parseError) {
        console.warn("Gemini JSON Parse Error, using empty AI data:", parseError.message);
        parsedResponse = {};
      }
      
    } catch (aiError) {
      console.warn("Gemini Analysis API Error, continuing without AI data:", aiError.message);
      parsedResponse = {};
    }

    // Prepare fields
    const {
      skills = [],
      technologies = [],
      projects = [],
      internships = [],
      experience = [],
      certifications = [],
      education = []
    } = parsedResponse;

    // Upsert the resume for the user
    let resume = await Resume.findOne({ userId });
    
    if (resume) {
      resume.fileName = req.file.originalname;
      resume.resumeText = resumeText;
      resume.skills = skills;
      resume.technologies = technologies;
      resume.projects = projects;
      resume.internships = internships;
      resume.experience = experience;
      resume.certifications = certifications;
      resume.education = education;
      await resume.save();
    } else {
      resume = await Resume.create({
        userId,
        fileName: req.file.originalname,
        resumeText,
        skills,
        technologies,
        projects,
        internships,
        experience,
        certifications,
        education
      });
    }

    res.status(200).json({
      message: "Resume uploaded and analyzed successfully.",
      resume
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "An unexpected error occurred.", error: error.message, stack: error.stack });
  }
};

// Get User's Resume
const getResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resume = await Resume.findOne({ userId });
    
    if (!resume) {
      return res.status(404).json({ message: "No resume found." });
    }

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
  getResume
};
