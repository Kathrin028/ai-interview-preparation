import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { Target, CheckCircle, XCircle, BookOpen, RefreshCw, Loader2, ArrowLeft } from "lucide-react";

function PracticeResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/learning/practice/session/${id}`);
        setSession(response.data);
      } catch (error) {
        console.error("Failed to fetch practice session.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="w-full max-w-[1400px] mx-auto space-y-6">
            
            {/* Header section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 text-center mb-8 relative overflow-hidden">
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Practice Completed</h2>
              <p className="text-slate-500 font-medium mb-10 flex items-center justify-center gap-2">
                <BookOpen size={18} /> Topic: {session.topic}
              </p>

              <div className="flex justify-center gap-6">
                <div className="bg-indigo-50 p-6 rounded-2xl w-32 border border-indigo-100 shadow-sm shadow-indigo-100/50">
                  <div className="text-3xl font-black text-indigo-600 mb-1">{session.score}%</div>
                  <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Score</div>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl w-32 border border-green-100 shadow-sm shadow-green-100/50">
                  <div className="text-3xl font-black text-green-600 mb-1">{session.correctAnswers}</div>
                  <div className="text-xs uppercase tracking-wider text-green-500 font-bold">Correct</div>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl w-32 border border-red-100 shadow-sm shadow-red-100/50">
                  <div className="text-3xl font-black text-red-600 mb-1">{session.totalQuestions - session.correctAnswers}</div>
                  <div className="text-xs uppercase tracking-wider text-red-400 font-bold">Incorrect</div>
                </div>
              </div>
            </div>

            {/* Questions Review */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 px-2 flex items-center gap-2">
                Detailed Review
              </h3>
              
              {session.questions.map((q, idx) => (
                <div key={idx} className={`p-6 md:p-8 rounded-2xl border ${q.isCorrect ? 'bg-white border-green-200 shadow-sm shadow-green-100/30' : 'bg-white border-red-200 shadow-sm shadow-red-100/30'}`}>
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <h4 className="font-bold text-lg text-slate-800 leading-relaxed"><span className="text-slate-400 font-black mr-2">Q{idx + 1}.</span>{q.question}</h4>
                    {q.isCorrect ? (
                      <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border border-green-200 shrink-0">
                        <CheckCircle size={14} /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border border-red-200 shrink-0">
                        <XCircle size={14} /> Incorrect
                      </span>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-xl border ${q.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Your Answer</span>
                      <p className={`font-semibold ${q.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{q.selectedAnswer}</p>
                    </div>
                    {!q.isCorrect && (
                      <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 block mb-1">Correct Answer</span>
                        <p className="font-semibold text-green-800">{q.correctAnswer}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block mb-2 flex items-center gap-1.5">
                      <Target size={12} /> AI Explanation
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 px-2">
              <button
                onClick={() => navigate(`/practice/${encodeURIComponent(session.topic)}`)}
                className="flex-1 flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition shadow-sm shadow-purple-600/30"
              >
                <RefreshCw size={18} /> Practice Again
              </button>
              <button
                onClick={() => navigate("/learning")}
                className="flex-1 flex justify-center items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-4 px-6 rounded-xl transition shadow-sm"
              >
                <ArrowLeft size={18} /> Back to Learning Hub
              </button>
            </div>
            
            <div className="h-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeResult;
