const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('bg-[#F5F8FF]')) {
    content = content.replace(/bg-\[\#F5F8FF\]/g, 'bg-[#F4F7FF]');
    fs.writeFileSync(filePath, content);
    console.log(`Updated bg color in ${file}`);
  }
}
