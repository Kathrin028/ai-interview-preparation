const http = require('http');

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch(e) {
          resolve(body);
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

const jwt = require("jsonwebtoken");
require("dotenv").config();

async function run() {
  console.log("=== STARTING TESTS ===\n");
  
  const testUserId = "6459c908234ab10c8c9b2a1a";
  const token = jwt.sign({ id: testUserId, role: "student" }, process.env.JWT_SECRET || "fallback_secret_for_test", { expiresIn: "1h" });
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 1. Generate HR Questions
  console.log("1. Testing HR Easy Generation (Count 5)...");
  try {
    const hrRes = await fetch("http://localhost:5000/api/questions/hr/Easy?count=5");
    const hrData = await hrRes.json();
    console.log("HR Easy Response:", hrData);
  } catch(e) {
    console.error("HR test failed:", e);
  }

  // 2. Generate Technical Questions
  console.log("\n2. Testing Technical Java Hard Generation (Count 3)...");
  try {
    const techRes = await fetch("http://localhost:5000/api/questions/technical/Java/Hard?count=3");
    const techData = await techRes.json();
    console.log("Tech Java Hard Response:", techData);
  } catch(e) {
    console.error("Tech test failed:", e);
  }

  // 3. Save Interview + trigger AI evaluation
  console.log("\n3. Testing Save Interview + Async Evaluation...");
  try {
    const mockSaveData = {
      userId: testUserId,
      interviewType: "HR Interview",
      category: "",
      difficulty: "Easy",
      questions: [
        {
          question: "Tell me about a time you made a mistake.",
          answer: "I once dropped the production database because I ran a drop script on the wrong terminal. I immediately informed my manager, we restored from a backup within 15 minutes, and I implemented a new strict color-coded terminal policy for the team to prevent it from happening again.",
          options: []
        }
      ],
      answered: 1,
      totalQuestions: 1,
      timeTaken: 120,
      correctAnswersCount: 0,
      incorrectAnswersCount: 0,
      scorePercentage: 0
    };

    const saveRes = await fetch("http://localhost:5000/api/interview/save", {
      method: "POST",
      headers,
      body: JSON.stringify(mockSaveData)
    });
    
    const saveData = await saveRes.json();
    console.log("Save Response:", saveData);
    
    if (saveData.interview && saveData.interview._id) {
      console.log("Waiting 8 seconds for AI Evaluation to complete...");
      await new Promise(r => setTimeout(r, 8000));
      
      const getRes = await fetch("http://localhost:5000/api/interview", { headers });
      const userInterviews = await getRes.json();
      const evaluated = userInterviews.find(i => i._id === saveData.interview._id);
      
      console.log("\n4. Evaluated Interview Result:");
      console.log(JSON.stringify(evaluated, null, 2));
    }

  } catch(e) {
    console.error("Test Error:", e);
  }
}

run();
