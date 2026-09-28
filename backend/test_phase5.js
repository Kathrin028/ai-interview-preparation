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
  console.log("=== STARTING PHASE 5 TESTS ===");

  console.log("\n1. Logging in...");
  const loginRes = await makeRequest('/api/auth/login', 'POST', JSON.stringify({
    email: "student@email.com",
    password: "password123"
  }), { 'Content-Type': 'application/json' });

  const token = loginRes.data.token;
  if (!token) return console.error("Login failed.");
  console.log("Login Success!");

  console.log("\n2. Getting Resources for 'React Hooks' (Should Normalize to 'React')...");
  const rRes = await makeRequest('/api/learning/resources/React%20Hooks', 'GET', null, {
    'Authorization': `Bearer ${token}`
  });
  console.log("Normalized Topic:", rRes.data.topic);
  console.log(`Resources found: ${rRes.data.resources?.length}`);

  console.log("\n3. Generating Practice for DBMS...");
  const pRes = await makeRequest('/api/learning/practice/generate', 'POST', JSON.stringify({
    topic: "DBMS",
    difficulty: "Medium",
    count: 2
  }), {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  console.log("Status:", pRes.status);
  
  if (pRes.status !== 200) return console.error("Generation failed:", pRes.data);
  const questions = pRes.data;
  console.log(`Generated ${questions.length} questions.`);

  console.log("\n4. Saving Practice Result...");
  // Simulate answering one correct, one wrong
  const answers = questions.map((q, idx) => {
    return {
      ...q,
      selectedAnswer: idx === 0 ? q.correctAnswer : "Wrong Answer Attempt"
    };
  });

  const saveRes = await makeRequest('/api/learning/practice/save', 'POST', JSON.stringify({
    topic: "DBMS",
    difficulty: "Medium",
    questions: answers
  }), {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  console.log("Save Status:", saveRes.status);
  console.log("Score:", saveRes.data.session?.score + "%");

  const sessionId = saveRes.data.session?._id;

  console.log("\n5. Fetching Saved Practice Session...");
  const getRes = await makeRequest(`/api/learning/practice/session/${sessionId}`, 'GET', null, {
    'Authorization': `Bearer ${token}`
  });
  console.log("Fetch Status:", getRes.status);
  console.log("Correct Answers:", getRes.data.correctAnswers);
  console.log("Total Questions:", getRes.data.totalQuestions);
}

run().catch(console.error);
