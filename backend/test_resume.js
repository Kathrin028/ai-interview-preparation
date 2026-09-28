const fs = require('fs');
const http = require('http');
const PDFDocument = require('pdfkit');
const FormData = require('form-data');

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
  console.log("=== STARTING PHASE 2 TESTS ===");

  // 1. Register/Login to get a token
  console.log("\n1. Logging in...");
  const loginRes = await makeRequest('/api/auth/login', 'POST', JSON.stringify({
    email: "student@email.com",
    password: "password123"
  }), { 'Content-Type': 'application/json' });

  let token = loginRes.data.token;
  if (!token) {
    // try registering
    const regRes = await makeRequest('/api/auth/register', 'POST', JSON.stringify({
      fullname: "Resume Test User",
      username: "resumetest",
      email: "student@email.com",
      password: "password123",
      role: "student"
    }), { 'Content-Type': 'application/json' });
    
    const loginRes2 = await makeRequest('/api/auth/login', 'POST', JSON.stringify({
      email: "student@email.com",
      password: "password123"
    }), { 'Content-Type': 'application/json' });
    token = loginRes2.data.token;
  }
  
  if (!token) {
    console.error("Authentication failed. Cannot continue.");
    return;
  }
  console.log("Login Success");

  // 2. Generate a Dummy PDF
  console.log("\n2. Generating dummy resume PDF...");
  const doc = new PDFDocument();
  const pdfPath = './dummy_resume.pdf';
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);
  doc.fontSize(20).text('John Doe', { align: 'center' });
  doc.fontSize(14).text('\nSkills: React, Node.js, Express, MongoDB, Python');
  doc.text('\nProjects:');
  doc.fontSize(12).text('- Smart Internship Portal: Built a complete MERN stack application with JWT auth.');
  doc.text('- E-Commerce App: Developed using Flutter and Firebase.');
  doc.fontSize(14).text('\nEducation:');
  doc.fontSize(12).text('- B.S. Computer Science, University of Technology, 2024');
  doc.end();

  // Wait for the file to be completely written
  await new Promise(res => writeStream.on('finish', res));

  // 3. Upload Resume
  console.log("\n3. Testing POST /api/resume/upload...");
  
  const form = new FormData();
  form.append('resume', fs.createReadStream(pdfPath));
  
  const formHeaders = form.getHeaders();
  formHeaders['Authorization'] = `Bearer ${token}`;

  const uploadOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/resume/upload',
    method: 'POST',
    headers: formHeaders
  };

  const uploadRes = await new Promise((resolve, reject) => {
    const req = http.request(uploadOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });
    req.on('error', reject);
    form.pipe(req);
  });

  console.log("Upload Status:", uploadRes.status);
  console.log("Upload Response:", uploadRes.data);
  console.log("Extracted Skills:", uploadRes.data.resume?.skills);
  console.log("Extracted Projects:", uploadRes.data.resume?.projects);
  
  // 4. Test GET /api/resume
  console.log("\n4. Testing GET /api/resume...");
  const getRes = await makeRequest('/api/resume', 'GET', null, { 'Authorization': `Bearer ${token}` });
  console.log("GET Status:", getRes.status);
  console.log("Resume Owner matches:", getRes.data.userId);

  // Clean up
  fs.unlinkSync(pdfPath);
}

run().catch(console.error);
