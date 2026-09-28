import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Award, ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";

function ReassessmentResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/learning/reassess/session/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch reassessment session.");
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
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Reassessment Completed</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-8">
                Topic: {session.topic}
              </p>

              <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 p-6 rounded-2xl border ${statusMsg.bg} ${statusMsg.border} ${statusMsg.color}`}>
                <div className="bg-white p-2 rounded-full shadow-sm">{statusMsg.icon}</div>
                <span className="font-bold text-lg">{statusMsg.text}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-10">
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Score History</h3>
                
                <div className="bg-slate-50 p-5 rounded-2xl flex justify-between items-center border border-slate-200">
                  <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Initial Score</span>
                  <span className="font-black text-2xl text-slate-700">{progress.previousScore}%</span>
                </div>
                <div className="bg-purple-50 p-5 rounded-2xl flex justify-between items-center border border-purple-100">
                  <span className="font-bold text-purple-500 uppercase tracking-widest text-xs">Practice Score</span>
                  <span className="font-black text-2xl text-purple-700">{progress.practiceScore}%</span>
                </div>
                <div className="bg-blue-50 p-5 rounded-2xl flex justify-between items-center border border-blue-200 shadow-sm shadow-blue-100/50">
                  <span className="font-bold text-blue-600 uppercase tracking-widest text-xs">Latest Score</span>
                  <span className="font-black text-2xl text-blue-700">{progress.latestScore}%</span>
                </div>
                <div className={`p-5 rounded-2xl flex justify-between items-center border shadow-sm ${progress.improvement > 0 ? 'bg-green-50 border-green-200 shadow-green-100/50' : progress.improvement < 0 ? 'bg-red-50 border-red-200 shadow-red-100/50' : 'bg-amber-50 border-amber-200 shadow-amber-100/50'}`}>
                  <span className={`font-bold uppercase tracking-widest text-xs ${progress.improvement > 0 ? 'text-green-600' : progress.improvement < 0 ? 'text-red-600' : 'text-amber-600'}`}>Improvement</span>
                  <span className={`font-black text-3xl ${progress.improvement > 0 ? 'text-green-700' : progress.improvement < 0 ? 'text-red-700' : 'text-amber-700'}`}>
                    {progress.improvement > 0 ? `+${progress.improvement}` : progress.improvement}
                  </span>
                </div>
              </div>

              <div className="h-80 lg:h-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-center">
                <h3 className="font-bold text-slate-800 mb-6 text-xl">Score Progression</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}} 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={() => navigate("/learning")}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition shadow-sm"
              >
                <ArrowLeft size={18} /> Back to Learning Hub
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ReassessmentResult;
