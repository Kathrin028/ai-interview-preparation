require('dotenv').config();
const https = require('https');

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const supported = json.models.map(m => m.name).filter(m => m.includes('flash'));
    console.log("Supported Flash Models:", supported);
  });
});
