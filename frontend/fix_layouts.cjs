const fs = require('fs');

const files = [
  "c:/Users/kathr/OneDrive/Desktop/Mern Stack/frontend/src/pages/PracticeResult.jsx",
  "c:/Users/kathr/OneDrive/Desktop/Mern Stack/frontend/src/pages/ReassessmentResult.jsx",
  "c:/Users/kathr/OneDrive/Desktop/Mern Stack/frontend/src/pages/Reassessment.jsx",
  "c:/Users/kathr/OneDrive/Desktop/Mern Stack/frontend/src/pages/Profile.jsx",
  "c:/Users/kathr/OneDrive/Desktop/Mern Stack/frontend/src/pages/ReportDetails.jsx",
  "c:/Users/kathr/OneDrive/Desktop/Mern Stack/frontend/src/pages/Reports.jsx",
  "c:/Users/kathr/OneDrive/Desktop/Mern Stack/frontend/src/pages/ResumeUpload.jsx",
  "c:/Users/kathr/OneDrive/Desktop/Mern Stack/frontend/src/pages/SkillGap.jsx",
  "c:/Users/kathr/OneDrive/Desktop/Mern Stack/frontend/src/pages/Settings.jsx",
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace opening layout
  content = content.replace(
    /<>\s*<Navbar \/>\s*<div className="flex">\s*<Sidebar \/>\s*<div className="([^"]*)">/g, 
    `<div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">\n      <Sidebar />\n      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">\n        <Navbar />\n        <div className="flex-1 overflow-y-auto p-6 lg:p-8">`
  );
  
  // Replace ending layout
  content = content.replace(
    /<\/div>\s*<\/div>\s*<\/>/g, 
    `</div>\n      </div>\n    </div>`
  );
  
  fs.writeFileSync(f, content);
  console.log(`Updated ${f}`);
});
