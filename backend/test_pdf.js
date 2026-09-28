const fs = require('fs');
const pdfParse = require('pdf-parse');

const PDFDocument = require('pdfkit');

async function test() {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('./dummy_resume.pdf'));
  doc.text('Test PDF');
  doc.end();
  await new Promise(r => setTimeout(r, 500));
  const dataBuffer = fs.readFileSync('./dummy_resume.pdf');
  console.log("pdfParse type:", typeof pdfParse);
  if (typeof pdfParse === 'function') {
      try {
          const data = await pdfParse(dataBuffer);
          console.log("Parsed using pdfParse():", data.text.substring(0, 50));
      } catch (e) {
          console.log("pdfParse() failed:", e.message);
      }
  } else {
      console.log("Keys:", Object.keys(pdfParse));
      if (typeof pdfParse.default === 'function') {
          const data = await pdfParse.default(dataBuffer);
          console.log("Parsed using pdfParse.default():", data.text.substring(0, 50));
      } else if (typeof pdfParse.PDFParse === 'function') {
          // try new
          const data = await new pdfParse.PDFParse(dataBuffer);
          console.log("Parsed using new PDFParse():", data.text ? data.text.substring(0, 50) : "no text");
      }
  }
}
test().catch(console.error);
