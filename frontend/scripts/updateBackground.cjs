const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it already has PastelBackground
  if (content.includes('PastelBackground')) continue;
  
  // Need to import PastelBackground if we are going to use it
  if (content.includes('Navbar')) {
    content = content.replace(/(import Navbar from [^\n]+)/, "$1\nimport PastelBackground from \"../components/PastelBackground\";");
    
    // Replace the specific background chunks. There are multiple variations:
    // Some use {/* WIDE GLOBAL BACKGROUND TREATMENT */}
    // Some use {/* Subtle Background Decoration */}
    // Some use {/* Subtle Background */}
    
    // We can replace from `<Navbar />` up to `<div className="flex-1 overflow-y-auto`
    // using a regex.
    const regex = /(<Navbar \/>)[\s\S]*?(<div className="flex-1 overflow-y-auto)/;
    
    if (regex.test(content)) {
      content = content.replace(regex, `$1\n        <PastelBackground />\n        $2`);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`Could not match regex in ${file}`);
    }
  }
}
