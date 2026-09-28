import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { 
  Target, CheckCircle2, AlertCircle, RefreshCw, XCircle, 
  ChevronRight, BrainCircuit, BarChart3, HelpCircle 
} from "lucide-react";

function InterviewResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialData = location.state;
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User" };

  const [data, setData] = useState(initialData);
  const [pollAttempts, setPollAttempts] = useState(0);
  const [isTimeout, setIsTimeout] = useState(false);
  const [explanationMap, setExplanationMap] = useState({});
  const [loadingExplain, setLoadingExplain] = useState({});

  const handleExplain = async (index) => {
    setLoadingExplain(prev => ({ ...prev, [index]: true }));
    try {
      const response = await api.post(`/analytics/interview/${data._id}/explain/${index}`);
      setExplanationMap(prev => ({ ...prev, [index]: response.data }));
    } catch (err) {
      alert("Failed to get explanation. Please try again.");
    } finally {
      setLoadingExplain(prev => ({ ...prev, [index]: false }));
    }
  };

  useEffect(() => {
    let intervalId;
    if (data?._id && data.evaluationStatus === "pending" && !isTimeout) {
      intervalId = setInterval(async () => {
        try {
          if (pollAttempts >= 20) {
            setIsTimeout(true);
            clearInterval(intervalId);
            return;
          }
          setPollAttempts(prev => prev + 1);

          const response = await api.get(`/interview/${data._id}/details`);
          const current = response.data;
          if (current && current.evaluationStatus !== "pending") {
            setData(current);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Polling failed", error);
        }
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [data?._id, data?.evaluationStatus, user.id, pollAttempts, isTimeout]);

  const scoreNum = data?.overallScore ? data.overallScore * 10 : (data?.scorePercentage || 0);
  const isAptitude = data?.interviewType === "Aptitude Assessment";

  return (
    <div className="flex h-screen bg-[#F3F6FF] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          <div className="w-full max-w-[1400px] mx-auto space-y-6">
            
            {/* Main Result Hero */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
              
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={40} />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Interview Complete</h2>
              <p className="text-slate-500 font-medium mb-8">Great job finishing your assessment!</p>
              
              {data?.evaluationStatus === "completed" || isAptitude ? (
                <div className="inline-flex flex-col items-center justify-center p-8 bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-600/30 mb-8 w-64">
                  <span className="text-6xl font-black">{scoreNum}%</span>
                  <span className="mt-2 text-blue-100 font-medium uppercase tracking-widest text-sm">Overall Score</span>
                </div>
              ) : null}

              {/* Status block */}
              {data?.evaluationStatus === "pending" || !data?.evaluationStatus ? (
                <div className="max-w-md mx-auto bg-amber-50 border border-amber-200 text-amber-700 p-6 rounded-xl flex items-center gap-4 text-left">
                  {!isTimeout ? (
                    <>
                      <RefreshCw size={24} className="animate-spin shrink-0" />
                      <div>
                        <h4 className="font-bold">AI is evaluating your answers</h4>
                        <p className="text-sm opacity-90">This may take a few moments...</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={24} className="shrink-0" />
                      <div>
                        <h4 className="font-bold">Evaluation delayed</h4>
                        <p className="text-sm opacity-90">Check back later in your reports.</p>
                      </div>
                    </>
                  )}
                </div>
              ) : data?.evaluationStatus === "failed" ? (
                <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center gap-4 text-left">
                  <XCircle size={24} className="shrink-0" />
                  <div>
                    <h4 className="font-bold">Evaluation Failed</h4>
                    <p className="text-sm opacity-90">Please try taking the interview again later.</p>
                  </div>
                </div>
              ) : null}

              {/* Details grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left mt-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Type</div>
                  <div className="font-semibold">{data?.interviewType}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Difficulty</div>
                  <div className="font-semibold">{data?.difficulty}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Answered</div>
                  <div className="font-semibold">{data?.answered} / {data?.totalQuestions || data?.total}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Time Taken</div>
                  <div className="font-semibold">
                    {Math.floor(data?.timeTaken / 60)}:
                    {String(data?.timeTaken % 60).padStart(2, "0")}
                  </div>
                </div>
              </div>

            </div>

            {data?.evaluationSource === "local" && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mt-6 shadow-sm text-sm font-medium">
                AI evaluation is temporarily unavailable. Your responses were evaluated using the built-in assessment system.
              </div>
            )}

            {/* Strengths & Improvements */}
            {data?.evaluationStatus === "completed" && !isAptitude && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="flex items-center gap-2 font-bold text-lg text-green-700 mb-4 border-b border-slate-100 pb-3">
                    <CheckCircle2 size={20} /> Strengths
                  </h3>
                  {data?.strengths && data.strengths.length > 0 ? (
                    <ul className="space-y-3">
                      {data.strengths.map((s, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">No specific strengths highlighted.</p>
                  )}
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="flex items-center gap-2 font-bold text-lg text-red-700 mb-4 border-b border-slate-100 pb-3">
                    <AlertCircle size={20} /> Needs Improvement
                  </h3>
                  {data?.improvements && data.improvements.length > 0 ? (
                    <ul className="space-y-3">
                      {data.improvements.map((im, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                          <span>{im}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">No major improvements needed.</p>
                  )}
                </div>
              </div>
            )}

            {/* Question Breakdown */}
            {data?.evaluationStatus === "completed" && data?.questions && data.questions.some(q => q.feedback) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="flex items-center gap-2 font-bold text-xl text-slate-800 mb-6 border-b border-slate-100 pb-4">
                  <BarChart3 size={24} className="text-blue-600" /> Question Breakdown
                </h3>
                
                <div className="space-y-6">
                  {data.questions.map((q, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                      <div className="p-5">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <h4 className="font-bold text-slate-800 text-lg">Q: {q.question || q.prompt}</h4>
                          {q.score !== undefined && (
                            <span className="shrink-0 bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-lg">
                              {q.score}/10
                            </span>
                          )}
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 text-slate-700">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Your Answer</span>
                          {q.answer || <span className="italic opacity-50">No answer provided</span>}
                        </div>

                        {q.feedback && (
                          <div className="text-slate-600 mb-4">
                            <span className="font-semibold text-slate-900">Feedback: </span>{q.feedback}
                          </div>
                        )}
                        
                        {q.suggestedAnswer && (
                          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-green-800 mb-4 text-sm">
                            <span className="font-bold block mb-1">Suggested Answer:</span>
                            {q.suggestedAnswer}
                          </div>
                        )}

                        {q.score !== undefined && q.score < 8 && !explanationMap[idx] && (
                          <button
                            onClick={() => handleExplain(idx)}
                            disabled={loadingExplain[idx]}
                            className="flex items-center gap-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-2 px-4 rounded-lg transition"
                          >
                            {loadingExplain[idx] ? <RefreshCw size={16} className="animate-spin" /> : <HelpCircle size={16} />}
                            {loadingExplain[idx] ? "Loading explanation..." : "Why Did I Get This Wrong?"}
                          </button>
                        )}

                        {/* Explanation Card */}
                        {explanationMap[idx] && (
                          <div className="mt-4 p-5 bg-purple-50 border border-purple-100 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                              <BrainCircuit size={64} />
                            </div>
                            
                            <h5 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                              <Sparkles size={18} className="text-purple-600" /> AI Deep Dive
                            </h5>
                            
                            <div className="space-y-4 text-sm text-purple-900">
                              <div>
                                <span className="font-bold block mb-1">Why was my answer weak?</span>
                                <p className="opacity-90 leading-relaxed">{explanationMap[idx].whyWrong}</p>
                              </div>
                              
                              {explanationMap[idx].missingConcepts?.length > 0 && (
                                <div>
                                  <span className="font-bold block mb-1">Missing Concepts:</span>
                                  <ul className="list-disc pl-5 opacity-90 space-y-1">
                                    {explanationMap[idx].missingConcepts.map((c, i) => <li key={i}>{c}</li>)}
                                  </ul>
                                </div>
                              )}

                              {explanationMap[idx].correctConcept && (
                                <div>
                                  <span className="font-bold block mb-1">Core Concept:</span>
                                  <p className="opacity-90">{explanationMap[idx].correctConcept}</p>
                                </div>
                              )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-purple-200/50 flex flex-wrap items-center gap-3">
                              <span className="text-xs font-bold text-white bg-purple-600 px-3 py-1.5 rounded-md shadow-sm">Focus: {explanationMap[idx].whatToLearn}</span>
                              <button
                                onClick={() => navigate(`/learning?topic=${encodeURIComponent(explanationMap[idx].whatToLearn || explanationMap[idx].topic)}`)}
                                className="ml-auto flex items-center gap-1 text-xs font-bold bg-white text-purple-700 hover:bg-purple-100 px-4 py-1.5 rounded-md shadow-sm transition border border-purple-200"
                              >
                                Learn This Topic <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition shadow-sm"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => navigate("/reports")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-sm shadow-blue-600/30"
              >
                View Analytics
              </button>
            </div>

          </div>
          
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
}

export default InterviewResult;
