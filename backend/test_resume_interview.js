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
  console.log("=== STARTING PHASE 3 TESTS ===");

  console.log("\n1. Logging in...");
  const loginRes = await makeRequest('/api/auth/login', 'POST', JSON.stringify({
    email: "student@email.com",
    password: "password123"
  }), { 'Content-Type': 'application/json' });

  const token = loginRes.data.token;
  if (!token) {
    console.error("Login failed.");
    return;
  }
  console.log("Login Success!");

  console.log("\n2. Getting Resume-Based Questions...");
  const qRes = await makeRequest('/api/questions/resume', 'POST', JSON.stringify({
    difficulty: "Medium",
    focusArea: "Projects",
    count: 2
  }), {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  console.log("Status:", qRes.status);
  console.log("Questions:", qRes.data);

  if (qRes.status !== 200) return;

  const questions = qRes.data;

  console.log("\n3. Saving Interview...");
  const saveRes = await makeRequest('/api/interview/save', 'POST', JSON.stringify({
    interviewType: "Resume-Based Interview",
    category: "Projects",
    difficulty: "Medium",
    questions: questions.map(q => ({
      question: q.question,
      answer: "I worked on this project by leading the backend development."
    })),
    answered: 2,
    totalQuestions: 2,
    timeTaken: 120,
    correctAnswersCount: 2,
    incorrectAnswersCount: 0,
    scorePercentage: 100
  }), {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  console.log("Save Status:", saveRes.status);
  console.log("Saved Interview ID:", saveRes.data.interview?._id);

  console.log("\n4. Waiting for Async AI Evaluation...");
  let evalStatus = "pending";
  let details = null;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const detailsRes = await makeRequest(`/api/interview/${saveRes.data.interview._id}/details`, 'GET', null, {
      'Authorization': `Bearer ${token}`
    });
    details = detailsRes.data;
    if (details.evaluationStatus !== "pending") {
      evalStatus = details.evaluationStatus;
      break;
    }
    process.stdout.write(".");
  }

  console.log("\nEvaluation finished with status:", evalStatus);
  if (evalStatus === 'completed') {
    console.log("Overall Score:", details.overallScore);
    console.log("Feedback:", details.feedback);
  }
}

run().catch(console.error);
