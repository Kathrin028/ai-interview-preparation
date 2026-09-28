const mongoose = require("mongoose");
const LearningResource = require("../models/LearningResource");

const curatedResources = [
  // Quantitative Aptitude
  { topic: "Quantitative Aptitude", title: "Quantitative Aptitude Basics", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=1SjUe4pX80Y", description: "Video tutorial covering fundamental aptitude concepts like percentages and ratio." },
  { topic: "Quantitative Aptitude", title: "Quantitative Aptitude Formulas", resourceType: "Website", source: "IndiaBix", url: "https://www.indiabix.com/aptitude/questions-and-answers/", description: "Concepts, examples and practice questions." },
  { topic: "Quantitative Aptitude", title: "Aptitude Study Material", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/quantitative-aptitude/", description: "External study material for reviewing important concepts." },
  { topic: "Quantitative Aptitude", title: "Aptitude Practice Questions", resourceType: "Practice", source: "IndiaBix", url: "https://www.indiabix.com/online-test/aptitude-test/", description: "Practice questions for aptitude preparation." },

  // Logical Reasoning
  { topic: "Logical Reasoning", title: "Logical Reasoning Basics", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=FjI5v0l2uA0", description: "Learn fundamentals of logical reasoning and pattern recognition." },
  { topic: "Logical Reasoning", title: "Logical Reasoning Topics", resourceType: "Website", source: "IndiaBix", url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/", description: "Complete guide to logical reasoning topics." },
  { topic: "Logical Reasoning", title: "Reasoning Study Material", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/logical-reasoning/", description: "Comprehensive notes for reasoning." },
  { topic: "Logical Reasoning", title: "Reasoning Practice", resourceType: "Practice", source: "IndiaBix", url: "https://www.indiabix.com/online-test/logical-reasoning-test/", description: "Timed practice questions for logical reasoning." },

  // Python
  { topic: "Python", title: "Python Official Documentation", resourceType: "Documentation", source: "Python.org", url: "https://docs.python.org/3/tutorial/", description: "Official Python language tutorial." },
  { topic: "Python", title: "Python for Beginners", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=kqtD5dpn9C8", description: "Comprehensive video tutorial for Python programming." },
  { topic: "Python", title: "Python Study Material", resourceType: "Notes", source: "W3Schools", url: "https://www.w3schools.com/python/", description: "Python concepts and examples." },
  { topic: "Python", title: "Python Practice Questions", resourceType: "Practice", source: "HackerRank", url: "https://www.hackerrank.com/domains/python", description: "Solve Python programming challenges." },

  // React
  { topic: "React", title: "React Official Docs", resourceType: "Documentation", source: "React.dev", url: "https://react.dev/", description: "Learn React from the creators." },
  { topic: "React", title: "React Crash Course", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", description: "Learn React basics and build a project." },
  { topic: "React", title: "React Hooks Guide", resourceType: "Notes", source: "Web Dev Simplified", url: "https://blog.webdevsimplified.com/", description: "Detailed guide to React Hooks and lifecycle." },
  { topic: "React", title: "React Practice Exercises", resourceType: "Practice", source: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/#react", description: "Interactive React challenges." },

  // JavaScript
  { topic: "JavaScript", title: "MDN Web Docs: JavaScript", resourceType: "Documentation", source: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", description: "Complete JS Reference and tutorials." },
  { topic: "JavaScript", title: "JavaScript Full Course", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=jS4aFq5-91M", description: "Comprehensive video course for JavaScript." },
  { topic: "JavaScript", title: "Modern JavaScript Tutorial", resourceType: "Notes", source: "JavaScript.info", url: "https://javascript.info/", description: "Detailed notes on modern ES6+ features." },
  { topic: "JavaScript", title: "JavaScript Algorithms Practice", resourceType: "Practice", source: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", description: "Practice basic and advanced JavaScript." },

  // C
  { topic: "C", title: "C Programming Language", resourceType: "Documentation", source: "CPP Reference", url: "https://en.cppreference.com/w/c", description: "Standard C library reference." },
  { topic: "C", title: "C Programming for Beginners", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=KJgsSFOSQv0", description: "Learn C programming from scratch." },
  { topic: "C", title: "C Study Notes", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/c-programming-language/", description: "GeeksforGeeks notes on C." },
  { topic: "C", title: "C Practice Questions", resourceType: "Practice", source: "HackerRank", url: "https://www.hackerrank.com/domains/c", description: "Programming challenges in C." },

  // Java
  { topic: "Java", title: "Java Official Documentation", resourceType: "Documentation", source: "Oracle", url: "https://docs.oracle.com/en/java/", description: "Official Java documentation and tutorials." },
  { topic: "Java", title: "Java Tutorial for Beginners", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=eIrMbAQSU34", description: "Complete Java programming course." },
  { topic: "Java", title: "Java Study Notes", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/java/", description: "Java concepts, OOPs, and advanced topics." },
  { topic: "Java", title: "Java Practice", resourceType: "Practice", source: "HackerRank", url: "https://www.hackerrank.com/domains/java", description: "Solve Java programming challenges." },

  // DBMS & SQL
  { topic: "DBMS", title: "Database Management Systems", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=kBdlM6hNDAE", description: "Database concepts, normalization, and architecture." },
  { topic: "DBMS", title: "DBMS Study Material", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/dbms/", description: "Comprehensive notes for DBMS." },
  { topic: "SQL", title: "MySQL Documentation", resourceType: "Documentation", source: "MySQL", url: "https://dev.mysql.com/doc/", description: "Official MySQL Reference." },
  { topic: "SQL", title: "SQL Tutorial", resourceType: "Website", source: "W3Schools", url: "https://www.w3schools.com/sql/", description: "Learn SQL syntax and queries." },
  { topic: "SQL", title: "SQL Practice", resourceType: "Practice", source: "HackerRank", url: "https://www.hackerrank.com/domains/sql", description: "Practice writing SQL queries." },

  // Data Structures & Algorithms
  { topic: "Data Structures", title: "Data Structures Easy to Advanced", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=RBSGKlAvoiM", description: "Comprehensive DSA course." },
  { topic: "Data Structures", title: "DSA Notes", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/data-structures/", description: "Comprehensive DSA tutorials and concepts." },
  { topic: "Algorithms", title: "Algorithms Specialization", resourceType: "Website", source: "Coursera", url: "https://www.coursera.org/specializations/algorithms", description: "Learn advanced algorithms." },
  { topic: "Algorithms", title: "Algorithm Practice", resourceType: "Practice", source: "LeetCode", url: "https://leetcode.com/", description: "Practice algorithms and data structures." },

  // HTML & CSS
  { topic: "HTML", title: "MDN HTML Basics", resourceType: "Documentation", source: "MDN", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML", description: "Learn how to structure web pages." },
  { topic: "CSS", title: "MDN CSS Basics", resourceType: "Documentation", source: "MDN", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS", description: "Learn how to style web pages." },
  { topic: "HTML", title: "HTML & CSS Full Course", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=mU6anWqZJcc", description: "Complete beginner course for web development." },
  { topic: "CSS", title: "Responsive Web Design Practice", resourceType: "Practice", source: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/responsive-web-design/", description: "Practice HTML and CSS by building projects." },

  // Git
  { topic: "Git", title: "Git Official Documentation", resourceType: "Documentation", source: "Git", url: "https://git-scm.com/doc", description: "Official Git reference and book." },
  { topic: "Git", title: "Git and GitHub for Beginners", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", description: "Learn version control." },
  { topic: "Git", title: "Git Cheat Sheet", resourceType: "Notes", source: "GitHub", url: "https://training.github.com/", description: "Quick reference for Git commands." },

  // Node.js
  { topic: "Node.js", title: "Node.js Official Documentation", resourceType: "Documentation", source: "Node.js", url: "https://nodejs.org/en/docs/", description: "Official Node.js API reference." },
  { topic: "Node.js", title: "Node.js Crash Course", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", description: "Learn Node.js and Express." },
  { topic: "Node.js", title: "Node.js Notes", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/nodejs/", description: "Comprehensive notes on Node.js." },
  { topic: "Node.js", title: "Back End Development Practice", resourceType: "Practice", source: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/", description: "Practice building Node.js applications." },

  // Computer Networks
  { topic: "Computer Networks", title: "Computer Networking Course", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=IPvYjXCsTg8", description: "Learn how the internet and networks work." },
  { topic: "Computer Networks", title: "Computer Networks Notes", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/computer-network-tutorials/", description: "Concepts of networking, OSI model, and protocols." },

  // Operating Systems
  { topic: "Operating Systems", title: "Operating Systems Course", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=vBURTt97EkA", description: "Learn OS concepts like processes and memory management." },
  { topic: "Operating Systems", title: "Operating Systems Notes", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/operating-systems/", description: "Comprehensive study material for OS." },

  // Software Engineering
  { topic: "Software Engineering", title: "Software Engineering Basics", resourceType: "Website", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/software-engineering/", description: "Learn SDLC, agile, and software design principles." },
  { topic: "Software Engineering", title: "System Design Primer", resourceType: "Notes", source: "GitHub", url: "https://github.com/donnemartin/system-design-primer", description: "Learn how to design large-scale systems." },

  // Web Development
  { topic: "Web Development", title: "MDN Web Development Guide", resourceType: "Documentation", source: "MDN", url: "https://developer.mozilla.org/en-US/docs/Learn", description: "Structured learning path for web development." },
  { topic: "Web Development", title: "Web Development Bootcamp", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=zJSY8tbf_ys", description: "Complete frontend web development course." },
  { topic: "Web Development", title: "Frontend Mentor Practice", resourceType: "Practice", source: "Frontend Mentor", url: "https://www.frontendmentor.io/", description: "Practice building real-world web designs." },

  // General
  { topic: "General", title: "Interview Preparation Guide", resourceType: "Notes", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/placements-gq/", description: "General tips and topics for technical interviews." },
  { topic: "General", title: "Cracking the Coding Interview Tips", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=aClxtDcdpsQ", description: "Tips and strategies for acing software engineering interviews." },
  { topic: "General", title: "System Design for Beginners", resourceType: "Video", source: "YouTube", url: "https://www.youtube.com/watch?v=bUHFg8CZFws", description: "Learn the basics of designing scalable systems." },
  { topic: "General", title: "Top Interview Questions", resourceType: "Practice", source: "LeetCode", url: "https://leetcode.com/explore/interview/card/top-interview-questions-easy/", description: "Collection of common interview questions." }
];

const seedLearningResources = async () => {
  try {
    for (const res of curatedResources) {
      // Idempotent upsert based on topic and url
      await LearningResource.updateOne(
        { topic: res.topic, url: res.url },
        { $set: res },
        { upsert: true }
      );
    }
    console.log("Successfully seeded curated learning resources.");
  } catch (error) {
    console.error("Error seeding learning resources:", error);
  }
};

module.exports = { seedLearningResources, curatedResources };
