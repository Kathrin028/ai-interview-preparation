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
  console.log("=== STARTING PHASE 4 TESTS ===");

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

  console.log("\n2. Fetching Skill Gap...");
  const sgRes = await makeRequest('/api/analytics/skill-gap', 'GET', null, {
    'Authorization': `Bearer ${token}`
  });
  console.log("Status:", sgRes.status);
  console.log("Topics:", sgRes.data.topics);

  console.log("\n3. Testing Explain Wrong Answer...");
  // Let's get the user's latest interview
  const intRes = await makeRequest('/api/interview/student-id', 'GET', null, {
    'Authorization': `Bearer ${token}`
  }); // Wait, getInterviews is just /api/interview for the logged-in user!
  
  const allInts = await makeRequest('/api/interview', 'GET', null, {
    'Authorization': `Bearer ${token}`
  });
  
  const targetInt = allInts.data.find(i => i.questions && i.questions.length > 0 && i.questions.some(q => q.score !== undefined && q.score < 8));
  
  if (targetInt) {
    const weakQIndex = targetInt.questions.findIndex(q => q.score !== undefined && q.score < 8);
    console.log(`Found weak question at index ${weakQIndex} in interview ${targetInt._id}`);
    
    const explainRes = await makeRequest(`/api/analytics/interview/${targetInt._id}/explain/${weakQIndex}`, 'POST', null, {
      'Authorization': `Bearer ${token}`
    });
    console.log("Explain Status:", explainRes.status);
    console.log("Explanation:", explainRes.data);
  } else {
    console.log("No weak answers found to explain.");
  }
}

run().catch(console.error);
