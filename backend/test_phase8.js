const http = require('http');
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function makeRequest(path, method = 'GET', data = null, token = null) {
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

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, data: body });
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

async function run() {
  console.log("=== STARTING PHASE 8 TESTS ===\n");
  
  // 1. Unauthenticated request to /api/users/profile
  console.log("1. Unauthenticated Profile Request");
  const unauthRes = await makeRequest('/api/users/profile', 'GET');
  console.log("Status:", unauthRes.status, "(Expected 401)");

  // 2. Register/Login to get token
  console.log("\n2. Registering test user");
  await makeRequest('/api/auth/register', 'POST', {
    fullname: "Student User",
    username: "studentuser",
    email: "student8@email.com",
    password: "password123",
    role: "student"
  });

  const loginRes = await makeRequest('/api/auth/login', 'POST', {
    email: "student8@email.com",
    password: "password123"
  });
  
  let token = loginRes.data.token;
  if (!token) {
      console.log("Login failed, cannot continue tests. Login Response:", loginRes);
      return;
  }
  console.log("Login Status:", loginRes.status);
  
  // 3. Get Profile
  console.log("\n3. Authenticated Profile Request");
  const profileRes = await makeRequest('/api/users/profile', 'GET', null, token);
  console.log("Profile Data:", profileRes.data);

  // 4. Update Profile
  console.log("\n4. Update Profile (Role modification attempt)");
  const updateRes = await makeRequest('/api/users/profile', 'PUT', {
    fullname: "Updated Student",
    username: "updatedstudent",
    role: "admin" // Attempting to change role
  }, token);
  console.log("Update Status:", updateRes.status);
  console.log("Updated User Data:", updateRes.data);

  // 5. Verify Role Modification failed
  const verifyRes = await makeRequest('/api/users/profile', 'GET', null, token);
  console.log("\n5. Verification Data (Role should still be student):");
  console.log(verifyRes.data);

  // Revert
  await makeRequest('/api/users/profile', 'PUT', { fullname: "Student User", username: "studentuser" }, token);
}

run();
