const http = require('http');

async function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data && typeof data === 'string') {
      req.write(data);
    } else if (data && data instanceof Buffer) {
      req.write(data);
    }
    req.end();
  });
}

async function run() {
  console.log("=== STARTING PHASE 6 TESTS ===");

  console.log("\n1. Logging in...");
  const loginRes = await makeRequest('/api/auth/login', 'POST', JSON.stringify({
    email: "student@email.com",
    password: "password123"
  }), { 'Content-Type': 'application/json' });

  const token = loginRes.data.token;
  if (!token) return console.error("Login failed.");
  console.log("Login Success!");

  // Step 2: Ensure user has a Practice Session for a topic, e.g., "Projects"
  console.log("\n2. Simulating Practice for 'Projects' (to set progress.practiceScore)...");
  const pSaveRes = await makeRequest('/api/learning/practice/save', 'POST', JSON.stringify({
    topic: "Projects",
    difficulty: "Medium",
    questions: [
      { question: "Q1", options: ["A", "B"], correctAnswer: "A", selectedAnswer: "A", topic: "Projects" },
      { question: "Q2", options: ["A", "B"], correctAnswer: "B", selectedAnswer: "A", topic: "Projects" }
    ] // 50% score
  }), { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
  
  console.log("Practice Save Status:", pSaveRes.status);
  
  // Step 3: Generate Reassessment
  console.log("\n3. Generating Reassessment for 'Projects'...");
  const rGen = await makeRequest('/api/learning/reassess/generate', 'POST', JSON.stringify({
    topic: "Projects",
    difficulty: "Medium",
    count: 2
  }), { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
  
  console.log("Generate Reassessment Status:", rGen.status);
  if(rGen.status !== 200) return console.log(rGen.data);
  const questions = rGen.data;

  // Step 4: Submit Reassessment (Simulate 100% correct)
  console.log("\n4. Saving Reassessment (Simulate 100% correct)...");
  const answers = questions.map(q => ({
    ...q,
    selectedAnswer: q.correctAnswer
  }));
  
  const rSave = await makeRequest('/api/learning/reassess/save', 'POST', JSON.stringify({
    topic: "Projects",
    difficulty: "Medium",
    questions: answers
  }), { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

  console.log("Reassessment Save Status:", rSave.status);
  
  // Step 5: Verify Progress Calculation
  console.log("\n5. Verifying Learning Progress for 'Projects'...");
  const progressRes = await makeRequest('/api/learning/progress', 'GET', null, {
    'Authorization': `Bearer ${token}`
  });
  
  const targetProgress = progressRes.data.progress.find(p => p.topic === "Projects");
  console.log("Topic:", targetProgress.topic);
  console.log("Previous Score:", targetProgress.previousScore);
  console.log("Practice Score:", targetProgress.practiceScore);
  console.log("Latest Score (Reassessment):", targetProgress.latestScore);
  console.log("Improvement:", targetProgress.improvement);
  
}

run().catch(console.error);
