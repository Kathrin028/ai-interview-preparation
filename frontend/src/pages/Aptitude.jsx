import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import QuestionCard from "../components/QuestionCard";

import InterviewSetup from "../components/interview/InterviewSetup";
import InterviewTimer from "../components/interview/InterviewTimer";
import InterviewNavigation from "../components/interview/InterviewNavigation";
import {
  getAptitudeQuestions,
  saveInterview,
} from "../services/interviewService";

function Aptitude() {
  const navigate = useNavigate();
  const [aptQuestions, setAptQuestions] = useState([]);
  const [started, setStarted] = useState(false);
  const [category, setCategory] = useState("Quantitative Aptitude");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState(Array(15).fill(""));
  const [timeLeft, setTimeLeft] = useState(600); 

  const categories = ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation"];

  // Timer
  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  // Save Answer
  const handleAnswerChange = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = value;
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questionCount - 1) setCurrentQuestion((prev) => prev + 1);
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const [infoMessage, setInfoMessage] = useState("");

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    setInfoMessage("");
    try {
      const response = await getAptitudeQuestions(category, difficulty, questionCount);
      const questions = response?.questions || response;
      if (!questions || questions.length === 0) {
        throw new Error("No questions returned.");
      }
      if (response?.source === "local") {
        setInfoMessage("AI generation temporarily unavailable. Practice questions are being provided from the question bank.");
      }
      setAptQuestions(questions);
      setQuestionCount(questions.length);
      
      const suggestedTime = questions.length * 60;
      setTimeLeft(suggestedTime);
      
      setStarted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to start assessment.");
    } finally {
      setLoading(false);
    }
  };

  const finishInterview = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const timeTaken = (questionCount * 60) - timeLeft;
      
      const interviewData = {
        userId: user.id,
        interviewType: "Aptitude Assessment",
        category,
        difficulty,
        questions: aptQuestions.map((q, index) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          userAnswer: answers[index],
        })),
        answered: answers.filter((answer) => answer.trim() !== "").length,
        totalQuestions: questionCount,
        timeTaken: timeTaken > 0 ? timeTaken : 0,
      };

      const response = await saveInterview(interviewData);
      navigate("/result", {
        state: response?.interview || interviewData,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to save assessment");
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F6FF] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">

          {!started ? (
            <InterviewSetup
              title="Aptitude Test"
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              categories={categories}
              category={category}
              setCategory={setCategory}
              onStart={startInterview}
              loading={loading}
              error={error}
            />
          ) : (
            <div className="max-w-[1200px] mx-auto flex flex-col h-full pb-8">
              
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Aptitude Assessment</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      Topic: {aptQuestions[currentQuestion]?.topic || category}
                    </span>
                    <span className="inline-block bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      Q{currentQuestion + 1} of {questionCount}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                  <InterviewTimer timeLeft={timeLeft} />
                </div>
              </div>
              
              {infoMessage && (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-6 border border-amber-200 shadow-sm text-sm font-medium">
                  {infoMessage}
                </div>
              )}

              <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-full flex flex-col p-8 sm:p-10">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                    {aptQuestions[currentQuestion]?.question}
                  </h3>

                  <div className="space-y-4 flex-1">
                    {aptQuestions[currentQuestion]?.options?.map((option, idx) => (
                      <label 
                        key={idx} 
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition cursor-pointer ${
                          answers[currentQuestion] === option 
                            ? 'bg-purple-50 border-purple-300 shadow-sm' 
                            : 'bg-white border-slate-200 hover:border-purple-200 hover:bg-purple-50/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleAnswerChange(option)}
                          className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                        />
                        <span className={`text-base font-medium ${answers[currentQuestion] === option ? 'text-purple-900' : 'text-slate-700'}`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <InterviewNavigation
                  currentQuestion={currentQuestion}
                  totalQuestions={questionCount}
                  onPrevious={previousQuestion}
                  onNext={nextQuestion}
                  onFinish={finishInterview}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Aptitude;
