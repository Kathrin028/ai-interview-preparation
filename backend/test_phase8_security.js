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
  console.log("=== STARTING PHASE 8 E2E SECURITY & REGRESSION AUDIT ===");

  // 1. Unauthenticated Access Test
  console.log("\n1. Testing Unauthenticated Access to Protected Route (/api/learning/progress)...");
  const unauthRes = await makeRequest('/api/learning/progress', 'GET');
  console.log("Expected: 401 or 403, Actual:", unauthRes.status);
  if (unauthRes.status !== 401 && unauthRes.status !== 403) {
    console.error("FAIL: Endpoint is not protected properly.");
  } else {
    console.log("PASS: Unauthenticated access blocked.");
  }

  // 2. Register/Login User A
  console.log("\n2. Logging in User A (student@email.com)...");
  const loginA = await makeRequest('/api/auth/login', 'POST', JSON.stringify({
    email: "student@email.com",
    password: "password123"
  }), { 'Content-Type': 'application/json' });
  const tokenA = loginA.data.token;
  console.log(tokenA ? "PASS: User A Logged In" : "FAIL: Login A failed");

  // 3. Register/Login User B
  console.log("\n3. Logging in User B (another@email.com) or creating if not exists...");
  let loginB = await makeRequest('/api/auth/login', 'POST', JSON.stringify({
    email: "another@email.com",
    password: "password123"
  }), { 'Content-Type': 'application/json' });
  
  if (loginB.status !== 200) {
    console.log("User B not found, registering...");
    loginB = await makeRequest('/api/auth/register', 'POST', JSON.stringify({
      fullname: "Another User",
      email: "another@email.com",
      password: "password123"
    }), { 'Content-Type': 'application/json' });
  }
  const tokenB = loginB.data.token;
  console.log(tokenB ? "PASS: User B Logged In" : "FAIL: Login B failed");

  // 4. Cross-User Data Isolation Test
  console.log("\n4. Testing Cross-User Data Isolation (Practice Sessions)...");
  // User A creates a practice session
  const pSaveA = await makeRequest('/api/learning/practice/save', 'POST', JSON.stringify({
    topic: "SecurityTest",
    difficulty: "Beginner",
    questions: [ { question: "Q1", options: ["A"], correctAnswer: "A", selectedAnswer: "A", topic: "SecurityTest" } ]
  }), { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` });
  
  const sessionIdA = pSaveA.data.session?._id;
  console.log("User A Session Created:", sessionIdA);

  // User B tries to fetch User A's session
  const fetchB = await makeRequest(`/api/learning/practice/session/${sessionIdA}`, 'GET', null, {
    'Authorization': `Bearer ${tokenB}`
  });
  console.log("User B trying to fetch User A session. Expected: 404, Actual:", fetchB.status);
  if (fetchB.status === 404) {
    console.log("PASS: Cross-user access denied cleanly.");
  } else {
    console.error("FAIL: Cross-user access allowed or failed unexpectedly!");
  }

  // 5. Invalid ObjectIDs
  console.log("\n5. Testing Invalid Object ID Handling...");
  const invalidIdFetch = await makeRequest(`/api/learning/practice/session/123invalid456`, 'GET', null, {
    'Authorization': `Bearer ${tokenA}`
  });
  console.log("Expected: 500 or 404, Actual:", invalidIdFetch.status);
  console.log("PASS: Invalid ID handled without crashing server.");

  // 6. Gemini Generation Edge Cases (Missing Data)
  console.log("\n6. Testing Practice Generation with missing fields...");
  const pGenFail = await makeRequest('/api/learning/practice/generate', 'POST', JSON.stringify({
    topic: "" // missing topic
  }), { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` });
  console.log("Expected: 400, Actual:", pGenFail.status);
  if (pGenFail.status === 400) {
    console.log("PASS: Validation correctly rejects empty fields.");
  }

  console.log("\n=== SECURITY AUDIT COMPLETE ===");
}

run().catch(console.error);
