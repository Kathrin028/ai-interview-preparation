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
  getCommunicationQuestions,
  saveInterview,
} from "../services/interviewService";

function Communication() {
  const navigate = useNavigate();
  const [commQuestions, setCommQuestions] = useState([]);
  const [started, setStarted] = useState(false);
  const [category, setCategory] = useState("Professional Communication");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState(Array(15).fill(""));
  const [timeLeft, setTimeLeft] = useState(300);

  const categories = ["Professional Communication", "Client Interaction", "Conflict Resolution", "Email Etiquette"];

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
      const response = await getCommunicationQuestions(category, difficulty, questionCount);
      const questions = response?.questions || response;
      if (!questions || questions.length === 0) {
        throw new Error("No questions returned.");
      }
      if (response?.source === "local") {
        setInfoMessage("AI generation temporarily unavailable. Practice questions are being provided from the question bank.");
      }
      setCommQuestions(questions);
      setQuestionCount(questions.length);
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
      
      const interviewData = {
        userId: user.id,
        interviewType: "Communication Assessment",
        category,
        difficulty,
        questions: commQuestions.map((q, index) => ({
          question: q.question,
          answer: answers[index],
        })),
        answered: answers.filter((answer) => answer.trim() !== "").length,
        totalQuestions: questionCount,
        timeTaken: 300 - timeLeft,
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
              title="Communication"
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
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Communication Assessment</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      Topic: {commQuestions[currentQuestion]?.topic || category}
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
                <QuestionCard
                  title="Communication Scenario"
                  question={commQuestions[currentQuestion]?.question || ""}
                  answer={answers[currentQuestion]}
                  setAnswer={handleAnswerChange}
                  currentQuestion={currentQuestion}
                  totalQuestions={questionCount}
                />
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

export default Communication;
