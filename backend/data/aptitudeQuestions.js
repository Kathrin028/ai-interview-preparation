const aptitudeQuestions = [
  // Quantitative Aptitude
  {
    question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
    options: ["$0.05", "$0.10", "$0.15", "$0.20"],
    correctAnswer: "$0.05",
    category: "Quantitative Aptitude",
    difficulty: "Easy"
  },
  {
    question: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
    options: ["5 minutes", "100 minutes", "50 minutes", "20 minutes"],
    correctAnswer: "5 minutes",
    category: "Quantitative Aptitude",
    difficulty: "Medium"
  },
  {
    question: "A store marks up a product by 20% and then offers a 20% discount. What is the net effect on the original price?",
    options: ["No change", "4% decrease", "4% increase", "2% decrease"],
    correctAnswer: "4% decrease",
    category: "Quantitative Aptitude",
    difficulty: "Medium"
  },
  {
    question: "If a train traveling at 60 km/h crosses a pole in 9 seconds, what is the length of the train?",
    options: ["120 meters", "150 meters", "180 meters", "200 meters"],
    correctAnswer: "150 meters",
    category: "Quantitative Aptitude",
    difficulty: "Hard"
  },
  {
    question: "A invested $1000 for 12 months and B invested $2000 for 6 months. What is the ratio of their profits?",
    options: ["1:1", "1:2", "2:1", "3:2"],
    correctAnswer: "1:1",
    category: "Quantitative Aptitude",
    difficulty: "Easy"
  },
  {
    question: "Find the compound interest on $5000 at 10% per annum for 2 years.",
    options: ["$1000", "$1050", "$1100", "$1150"],
    correctAnswer: "$1050",
    category: "Quantitative Aptitude",
    difficulty: "Medium"
  },
  {
    question: "In how many ways can the letters of the word 'APPLE' be arranged?",
    options: ["60", "120", "24", "48"],
    correctAnswer: "60",
    category: "Quantitative Aptitude",
    difficulty: "Medium"
  },
  {
    question: "What is the probability of getting a sum of 9 from two throws of a dice?",
    options: ["1/9", "1/12", "1/6", "1/8"],
    correctAnswer: "1/9",
    category: "Quantitative Aptitude",
    difficulty: "Hard"
  },
  {
    question: "A pipe can fill a tank in 10 hours and another pipe can empty it in 15 hours. How long will it take to fill the tank if both are opened?",
    options: ["25 hours", "30 hours", "5 hours", "20 hours"],
    correctAnswer: "30 hours",
    category: "Quantitative Aptitude",
    difficulty: "Medium"
  },
  {
    question: "The average of 5 consecutive odd numbers is 61. What is the difference between the highest and lowest numbers?",
    options: ["4", "8", "12", "16"],
    correctAnswer: "8",
    category: "Quantitative Aptitude",
    difficulty: "Medium"
  },
  {
    question: "If the ratio of the ages of A and B is 3:4 and the sum of their ages is 28 years, what is the age of B?",
    options: ["12 years", "16 years", "14 years", "20 years"],
    correctAnswer: "16 years",
    category: "Quantitative Aptitude",
    difficulty: "Easy"
  },
  {
    question: "The simple interest on a certain sum is 16/25 of the sum. If the rate percent and time in years are equal, find the rate percent.",
    options: ["8%", "10%", "12%", "16%"],
    correctAnswer: "8%",
    category: "Quantitative Aptitude",
    difficulty: "Hard"
  },
  {
    question: "A man can row upstream at 10 km/hr and downstream at 16 km/hr. Find the speed of the stream.",
    options: ["2 km/hr", "3 km/hr", "4 km/hr", "6 km/hr"],
    correctAnswer: "3 km/hr",
    category: "Quantitative Aptitude",
    difficulty: "Medium"
  },
  {
    question: "By selling a watch for $144, a man loses 10%. At what price should he sell it to gain 10%?",
    options: ["$160", "$176", "$180", "$192"],
    correctAnswer: "$176",
    category: "Quantitative Aptitude",
    difficulty: "Hard"
  },
  {
    question: "What is the least number which when divided by 8, 12, 15 and 20 leaves a remainder of 5 in each case?",
    options: ["115", "125", "135", "145"],
    correctAnswer: "125",
    category: "Quantitative Aptitude",
    difficulty: "Hard"
  },
  // Logical Reasoning
  {
    question: "Look at this series: 2, 6, 18, 54, ... What number should come next?",
    options: ["108", "148", "162", "216"],
    correctAnswer: "162",
    category: "Logical Reasoning",
    difficulty: "Easy"
  },
  {
    question: "Odometer is to mileage as compass is to:",
    options: ["Speed", "Hiking", "Needle", "Direction"],
    correctAnswer: "Direction",
    category: "Logical Reasoning",
    difficulty: "Easy"
  },
  {
    question: "Which word does not belong with the others?",
    options: ["Tulip", "Rose", "Bud", "Daisy"],
    correctAnswer: "Bud",
    category: "Logical Reasoning",
    difficulty: "Easy"
  },
  {
    question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
    options: ["True", "False", "Cannot be determined", "None of the above"],
    correctAnswer: "True",
    category: "Logical Reasoning",
    difficulty: "Medium"
  },
  {
    question: "SCD, TEF, UGH, ____, WKL",
    options: ["CMN", "UJI", "VIJ", "IJT"],
    correctAnswer: "VIJ",
    category: "Logical Reasoning",
    difficulty: "Medium"
  },
  {
    question: "Pointing to a photograph of a boy Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
    options: ["Brother", "Uncle", "Cousin", "Father"],
    correctAnswer: "Father",
    category: "Logical Reasoning",
    difficulty: "Medium"
  },
  {
    question: "In a certain code language, '123' means 'hot filtered coffee', '356' means 'very hot day' and '589' means 'day and night'. Which digit stands for 'very'?",
    options: ["5", "6", "8", "9"],
    correctAnswer: "6",
    category: "Logical Reasoning",
    difficulty: "Hard"
  },
  {
    question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?",
    options: ["Grandfather", "Grandmother", "Daughter", "Granddaughter"],
    correctAnswer: "Granddaughter",
    category: "Logical Reasoning",
    difficulty: "Medium"
  },
  {
    question: "If '+' means 'divided by', '-' means 'add', 'x' means 'minus' and '/' means 'multiplied by', what will be the value of the following expression: 15 - 5 / 2 + 10 x 3?",
    options: ["13", "12", "15", "10"],
    correctAnswer: "13",
    category: "Logical Reasoning",
    difficulty: "Hard"
  },
  {
    question: "Statements: All bags are cakes. All lamps are cakes. Conclusions: I. Some lamps are bags. II. No lamp is bag.",
    options: ["Only I follows", "Only II follows", "Either I or II follows", "Neither I nor II follows"],
    correctAnswer: "Either I or II follows",
    category: "Logical Reasoning",
    difficulty: "Hard"
  },
  // Verbal Ability
  {
    question: "Choose the word which is the exact OPPOSITE of the given word: EXODUS",
    options: ["Influx", "Home-coming", "Return", "Restoration"],
    correctAnswer: "Influx",
    category: "Verbal Ability",
    difficulty: "Medium"
  },
  {
    question: "Find the correctly spelt word.",
    options: ["Accomodation", "Accommodation", "Accomodation", "Accomodation"],
    correctAnswer: "Accommodation",
    category: "Verbal Ability",
    difficulty: "Easy"
  },
  {
    question: "Select the pair which has the same relationship: LIGHT : BLIND",
    options: ["speech : dumb", "language : deaf", "tongue : sound", "voice : vibration"],
    correctAnswer: "speech : dumb",
    category: "Verbal Ability",
    difficulty: "Medium"
  },
  {
    question: "Extreme old age when a man behaves like a fool is called:",
    options: ["Imbecility", "Senility", "Dotage", "Superannuation"],
    correctAnswer: "Dotage",
    category: "Verbal Ability",
    difficulty: "Hard"
  },
  {
    question: "To cry wolf means to:",
    options: ["To listen eagerly", "To give false alarm", "To turn pale", "To keep off starvation"],
    correctAnswer: "To give false alarm",
    category: "Verbal Ability",
    difficulty: "Easy"
  },
  // Data Interpretation
  {
    question: "If a pie chart shows that 25% of a company's budget is spent on R&D, and the total budget is $4 million, how much is spent on R&D?",
    options: ["$1 million", "$2 million", "$500,000", "$1.5 million"],
    correctAnswer: "$1 million",
    category: "Data Interpretation",
    difficulty: "Easy"
  },
  {
    question: "A bar graph shows sales of 100 units in Q1 and 150 units in Q2. What is the percentage increase in sales from Q1 to Q2?",
    options: ["25%", "33.3%", "50%", "66.6%"],
    correctAnswer: "50%",
    category: "Data Interpretation",
    difficulty: "Medium"
  },
  {
    question: "A line graph shows a linear trend where y = 2x + 10. If x represents months and y represents revenue in thousands, what is the revenue in month 5?",
    options: ["$15,000", "$20,000", "$25,000", "$10,000"],
    correctAnswer: "$20,000",
    category: "Data Interpretation",
    difficulty: "Medium"
  },
  {
    question: "In a table showing student grades, if 10 students scored A, 20 scored B, and 20 scored C, what is the probability that a randomly selected student scored A?",
    options: ["1/5", "1/4", "1/3", "1/2"],
    correctAnswer: "1/5",
    category: "Data Interpretation",
    difficulty: "Medium"
  },
  {
    question: "A scatter plot shows a strong negative correlation between price and demand. This means:",
    options: ["As price increases, demand increases", "As price increases, demand decreases", "Price has no effect on demand", "Demand is constant"],
    correctAnswer: "As price increases, demand decreases",
    category: "Data Interpretation",
    difficulty: "Easy"
  },
  // More mixed questions to reach > 40
  {
    question: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
    correctAnswer: "12",
    category: "Quantitative Aptitude",
    difficulty: "Easy"
  },
  {
    question: "If A = {1, 2, 3} and B = {3, 4, 5}, what is A ∩ B?",
    options: ["{1, 2}", "{4, 5}", "{3}", "{1, 2, 3, 4, 5}"],
    correctAnswer: "{3}",
    category: "Quantitative Aptitude",
    difficulty: "Medium"
  },
  {
    question: "Solve for x: 3x - 7 = 20",
    options: ["7", "8", "9", "10"],
    correctAnswer: "9",
    category: "Quantitative Aptitude",
    difficulty: "Easy"
  },
  {
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "180 metres", "324 metres", "150 metres"],
    correctAnswer: "150 metres",
    category: "Quantitative Aptitude",
    difficulty: "Medium"
  },
  {
    question: "Find the odd one out: 3, 5, 11, 14, 17, 21",
    options: ["14", "17", "21", "5"],
    correctAnswer: "14",
    category: "Logical Reasoning",
    difficulty: "Medium"
  }
];

module.exports = aptitudeQuestions;
