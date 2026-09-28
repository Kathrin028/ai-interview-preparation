import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import QuestionCard from "../components/QuestionCard";

import InterviewTimer from "../components/interview/InterviewTimer";
import InterviewNavigation from "../components/interview/InterviewNavigation";
import {
  getResumeQuestions,
  saveInterview,
} from "../services/interviewService";

import { FileText, Target, Loader2, Sparkles, CheckCircle2, AlertCircle, Rocket } from "lucide-react";

function ResumeInterview() {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [resumeChecking, setResumeChecking] = useState(true);

  const [resumeQuestions, setResumeQuestions] = useState([]);
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [focusArea, setFocusArea] = useState("All Resume Skills");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState(Array(15).fill(""));
  const [timeLeft, setTimeLeft] = useState(300);

  const focusOptions = ["All Resume Skills", "Projects", "Technologies", "Experience", "Education"];

  useEffect(() => {
    const checkResume = async () => {
      try {
        const res = await api.get("/resume");
        if (res.data) {
          setResumeData(res.data.resume || res.data);
        }
      } catch (err) {
        setResumeData(null);
      } finally {
        setResumeChecking(false);
      }
    };
    checkResume();
  }, []);

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
      const config = { difficulty, focusArea, count: questionCount };
      const response = await getResumeQuestions(config);
      const questions = response?.questions || response;
      if (!questions || questions.length === 0) {
        throw new Error("No questions returned.");
      }
      if (response?.source === "local") {
        setInfoMessage("AI generation is temporarily unavailable. Personalized questions are being provided directly from your resume data.");
      }
      setResumeQuestions(questions);
      setQuestionCount(questions.length);
      setStarted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to generate resume questions.");
    } finally {
      setLoading(false);
    }
  };

  const finishInterview = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const interviewData = {
        userId: user.id,
        interviewType: "Resume-Based Interview",
        category: focusArea,
        difficulty,
        questions: resumeQuestions.map((q, index) => ({
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
      alert("Failed to save interview");
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F6FF] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {resumeChecking ? (
            <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>
          ) : !resumeData ? (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center max-w-lg mx-auto mt-20">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={36} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-slate-800">No Resume Found</h2>
              <p className="text-slate-500 mb-8 font-medium">Please upload your resume before starting a personalized AI Interview.</p>
              <Link to="/resume" className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition shadow-sm">
                Upload Resume
              </Link>
            </div>
          ) : !started ? (
            <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-center min-h-[75vh]">
              
              {/* LEFT SIDE - Resume Info */}
              <div className="w-full lg:w-[55%] flex flex-col">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6 w-max">
                  <Sparkles size={14} />
                  AI Resume Analysis
                </div>

                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                  Personalized Interview
                </h1>
                
                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                  We'll generate an interview tailored precisely to your background. Our AI has analyzed your resume to ensure questions match your exact skill profile.
                </p>

                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><FileText size={24} /></div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">Detected Profile</h3>
                      <p className="text-slate-500 text-sm font-medium">{resumeData.fileName}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Top Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills?.slice(0, 8).map(s => (
                          <span key={s} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg">{s}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Recent Experience</h4>
                      {resumeData.experience?.slice(0, 2).map((exp, idx) => (
                        <div key={idx} className="flex items-start gap-2 mb-2 text-sm text-slate-700 font-medium">
                          <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                          <span>{exp}</span>
                        </div>
                      )) || <p className="text-sm text-slate-500">None detected</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - Setup Form */}
              <div className="w-full lg:w-[45%] max-w-[500px]">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 sm:p-10 relative overflow-hidden">
                  
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-blue-500" />
                  
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Configure Session
                    </h2>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-100 text-indigo-600">
                      <Target size={20} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Focus Area</label>
                      <div className="relative">
                        <select
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 appearance-none transition"
                          value={focusArea}
                          onChange={(e) => setFocusArea(e.target.value)}
                        >
                          {focusOptions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">▼</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Difficulty</label>
                      <div className="relative">
                        <select
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 appearance-none transition"
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                        >
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">▼</div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Number of Questions</label>
                      <div className="relative">
                        <select
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 appearance-none transition"
                          value={questionCount}
                          onChange={(e) => setQuestionCount(Number(e.target.value))}
                        >
                          <option value={3}>3 Questions</option>
                          <option value={5}>5 Questions</option>
                          <option value={10}>10 Questions</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">▼</div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                      </div>
                    )}

                    <button
                      disabled={loading}
                      onClick={startInterview}
                      className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/30 text-lg mt-2"
                    >
                      {loading ? (
                        <><Loader2 size={22} className="animate-spin" /> Generating Questions...</>
                      ) : (
                        <><Rocket size={22} /> Start Interview</>
                      )}
                    </button>
                    
                    <div className="text-center mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Sparkles size={12} className="text-purple-400" /> Powered by Gemini AI
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[1200px] mx-auto flex flex-col h-full pb-8">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Resume-Based Interview</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      Topic: {resumeQuestions[currentQuestion]?.topic}
                    </span>
                    <span className="inline-block bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      Source: {resumeQuestions[currentQuestion]?.sourceDetail}
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
                  title="Personalized Question"
                  question={resumeQuestions[currentQuestion]?.question || ""}
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

export default ResumeInterview;
