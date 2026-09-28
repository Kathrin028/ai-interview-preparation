const evaluateAnswersFallback = (type, questions) => {
  if (type === "Communication Assessment") {
    // Basic communication evaluation fallback
    let grammarTotal = 0, clarityTotal = 0, professionalismTotal = 0, relevanceTotal = 0;
    
    questions.forEach(q => {
      const ans = (q.answer || "").trim();
      const wordCount = ans.split(/\s+/).length;
      
      let score = 5; // default medium
      if (wordCount > 30) score += 3;
      else if (wordCount > 15) score += 1;
      else if (wordCount < 5) score -= 3;
      
      if (ans.toLowerCase().includes(q.question.toLowerCase().split(' ')[0])) {
        score += 1;
      }
      
      score = Math.max(1, Math.min(10, score));
      grammarTotal += score;
      clarityTotal += score;
      professionalismTotal += score;
      relevanceTotal += score;
    });

    const num = Math.max(1, questions.length);
    const overall = Math.round((grammarTotal + clarityTotal + professionalismTotal + relevanceTotal) / (4 * num));

    return {
      grammar: Math.round(grammarTotal / num),
      clarity: Math.round(clarityTotal / num),
      professionalism: Math.round(professionalismTotal / num),
      relevance: Math.round(relevanceTotal / num),
      overallScore: overall,
      feedback: "Your communication answers were evaluated using our built-in assessment system due to temporary AI unavailability. The score is based on response length and basic relevance.",
      improvements: ["Provide more detailed examples", "Structure your thoughts more clearly"],
      source: "local"
    };
  } else {
    // Resume-Based Interview or Technical fallback
    let relTotal = 0, clarTotal = 0, compTotal = 0, profTotal = 0;
    
    const evaluatedQuestions = questions.map(q => {
      const ans = (q.answer || "").trim();
      const wordCount = ans.split(/\s+/).length;
      
      let baseScore = 0;
      if (wordCount === 0) {
        baseScore = 1;
      } else if (wordCount < 10) {
        baseScore = 4;
      } else if (wordCount < 30) {
        baseScore = 7;
      } else {
        baseScore = 9;
      }
      
      // Relevance check: does the answer share words with the question or topic?
      const qWords = q.question.toLowerCase().split(/\s+/);
      const aWords = ans.toLowerCase().split(/\s+/);
      const overlap = qWords.filter(w => w.length > 3 && aWords.includes(w)).length;
      
      if (overlap > 2 && baseScore < 10) baseScore += 1;
      
      const score = Math.max(1, Math.min(10, baseScore));
      
      relTotal += score;
      clarTotal += score;
      compTotal += score;
      profTotal += score;
      
      let feedback = "";
      if (score <= 4) feedback = "Your answer lacks detail and could be significantly expanded.";
      else if (score <= 7) feedback = "Your answer addresses the topic but could include more specific details and examples.";
      else feedback = "Great answer with good detail and relevance to the topic.";

      return {
        score,
        feedback,
        suggestedAnswer: "A comprehensive answer should directly address the question using specific examples from your experience."
      };
    });

    const num = Math.max(1, questions.length);
    const overall = Math.round((relTotal + clarTotal + compTotal + profTotal) / (4 * num));

    return {
      relevanceScore: Math.round(relTotal / num),
      clarityScore: Math.round(clarTotal / num),
      completenessScore: Math.round(compTotal / num),
      professionalismScore: Math.round(profTotal / num),
      overallScore: overall,
      feedback: "Your answers were evaluated using our built-in assessment system. Try to include more specific details, examples, and technical context in your answers.",
      strengths: ["Provided answers to the questions", "Demonstrated basic knowledge"],
      improvements: ["Include more specific examples", "Expand on the 'how' and 'why'"],
      questions: evaluatedQuestions,
      source: "local"
    };
  }
};

module.exports = { evaluateAnswersFallback };
