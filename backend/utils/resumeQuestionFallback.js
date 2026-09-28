const generateResumeFallback = (resume, difficulty, focusArea, count) => {
  const allQuestions = [];
  
  // Extract data from resume
  const projects = resume.projects || [];
  const skills = resume.skills || [];
  const technologies = resume.technologies || [];
  const experiences = resume.experience || [];
  const internships = resume.internships || [];
  const certifications = resume.certifications || [];
  const education = resume.education || [];
  
  const allSkills = [...new Set([...skills, ...technologies])];
  const allExperience = [...new Set([...experiences, ...internships])];

  // Helper to push questions
  const addQuestion = (question, topic, sourceDetail) => {
    allQuestions.push({
      question,
      topic,
      source: 'local',
      sourceDetail,
      difficulty
    });
  };

  // Generate Project Questions
  if (projects.length > 0) {
    projects.forEach(proj => {
      const pName = proj.title || proj.name || "your project";
      addQuestion(`Explain the main objective of your ${pName} project.`, 'Projects', `Resume Project: ${pName}`);
      addQuestion(`What was your specific contribution to ${pName}?`, 'Projects', `Resume Project: ${pName}`);
      addQuestion(`What challenge did you face while developing ${pName}?`, 'Projects', `Resume Project: ${pName}`);
      addQuestion(`How would you improve ${pName} in a future version?`, 'Projects', `Resume Project: ${pName}`);
      if (proj.technologies && proj.technologies.length > 0) {
        addQuestion(`What technologies did you use in ${pName}, and why did you choose them?`, 'Projects', `Resume Project: ${pName}`);
      }
    });
  }

  // Generate Skills Questions
  if (allSkills.length > 0) {
    allSkills.forEach(skill => {
      addQuestion(`How have you used ${skill} in your projects?`, skill, `Resume Skill: ${skill}`);
      addQuestion(`What is one practical use of ${skill}?`, skill, `Resume Skill: ${skill}`);
      addQuestion(`Explain a technical problem you solved using ${skill}.`, skill, `Resume Skill: ${skill}`);
    });
  }

  // Generate Experience Questions
  if (allExperience.length > 0) {
    allExperience.forEach(exp => {
      const eName = exp.title || exp.company || exp.role || "your previous role";
      addQuestion(`Describe what you learned during your experience at ${eName}.`, 'Experience', `Resume Experience: ${eName}`);
      addQuestion(`What responsibilities did you handle during your time at ${eName}?`, 'Experience', `Resume Experience: ${eName}`);
      addQuestion(`What was the most challenging aspect of your role at ${eName}?`, 'Experience', `Resume Experience: ${eName}`);
    });
  }

  // Generate Certification Questions
  if (certifications.length > 0) {
    certifications.forEach(cert => {
      const cName = cert.title || cert.name || "your certification";
      addQuestion(`What key concepts did you learn through ${cName}?`, 'Certifications', `Resume Certification: ${cName}`);
    });
  }

  // Generate Education Questions
  if (education.length > 0) {
    addQuestion(`Which academic subject has been most useful in your technical projects?`, 'Education', `Resume Education`);
    addQuestion(`How has your education prepared you for a career in technology?`, 'Education', `Resume Education`);
  }

  // Fallback if resume is completely empty
  if (allQuestions.length === 0) {
    addQuestion(`Tell me about your background and why you're interested in this role.`, 'General Background', `General`);
    addQuestion(`What are your strongest technical skills?`, 'Skills', `General`);
    addQuestion(`Describe a challenging project you've worked on recently.`, 'Projects', `General`);
    addQuestion(`Where do you see your technical career heading in the next few years?`, 'Career Goals', `General`);
    addQuestion(`How do you keep your technical skills updated?`, 'Learning', `General`);
  }

  let filtered = allQuestions;

  // If focus area is specific, try filtering by that
  if (focusArea && focusArea !== "All Resume Skills") {
    filtered = allQuestions.filter(q => q.topic.toLowerCase().includes(focusArea.toLowerCase()) || q.sourceDetail.toLowerCase().includes(focusArea.toLowerCase()));
    if (filtered.length === 0) {
      filtered = allQuestions; // fallback to all
    }
  }

  // Shuffle and slice
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  
  // Return exactly the requested count by looping or slicing
  const selected = [];
  for (let i = 0; i < count; i++) {
    if (i < shuffled.length) {
      selected.push(shuffled[i]);
    } else {
      // Loop around if needed (though usually enough questions are generated)
      selected.push(shuffled[i % shuffled.length]);
    }
  }

  return selected;
};

module.exports = { generateResumeFallback };
