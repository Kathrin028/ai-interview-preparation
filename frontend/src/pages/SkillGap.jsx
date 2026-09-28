import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { Radar, Loader2, AlertCircle, BookOpen, Sparkles, TrendingUp } from "lucide-react";

function SkillGap() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        const response = await api.get("/analytics/skill-gap");
        setTopics(response.data.topics || []);
      } catch (err) {
        setError("Failed to load skill gap data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSkillGap();
  }, []);

  const getStatusColor = (status) => {
    if (status === "Strong") return "text-green-700 bg-green-100 border-green-200";
    if (status === "Needs Practice") return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  const getProgressBarColor = (status) => {
    if (status === "Strong") return "bg-green-500";
    if (status === "Needs Practice") return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="flex h-screen bg-[#F3F6FF] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="w-full max-w-[1400px] mx-auto space-y-6">
            
            {/* Header Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-600 p-2.5 rounded-xl">
                    <Radar size={28} />
                  </div>
                  AI Skill Gap Analysis
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                  Identify your strong areas and topics that need improvement based on your interview history.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-indigo-600">
                <Loader2 size={40} className="animate-spin mb-4" />
                <p className="font-semibold text-slate-600">Analyzing your skill gaps...</p>
              </div>
            ) : error ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-red-500">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-semibold">{error}</p>
              </div>
            ) : topics.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl shadow-sm border border-slate-200 text-center">
                <Sparkles size={48} className="mx-auto text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No interview data available yet.</h2>
                <p className="text-slate-500 mb-6 font-medium">Complete an interview to see your personalized AI skill gap analysis.</p>
                <button 
                  onClick={() => navigate("/")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {topics.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-indigo-300 transition-colors">
                    <div className="mb-6">
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <h3 className="font-bold text-lg text-slate-800 leading-tight">{item.topic}</h3>
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                          <span>Proficiency</span>
                          <span className="text-slate-700">{item.score}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressBarColor(item.status)}`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {(item.status === "Needs Improvement" || item.status === "Needs Practice") ? (
                      <button
                        onClick={() => navigate(`/learning?topic=${encodeURIComponent(item.topic)}`)}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 px-4 rounded-xl transition"
                      >
                        <BookOpen size={18} /> Learn This Topic
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 font-bold py-3 px-4 rounded-xl border border-green-100">
                        <TrendingUp size={18} /> Mastered
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
}

export default SkillGap;
