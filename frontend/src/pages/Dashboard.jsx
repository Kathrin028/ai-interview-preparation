import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import { useNavigate } from "react-router-dom";
import { getInterviews } from "../services/interviewService";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Sparkles, Briefcase, Code2, Brain, Mic, 
  TrendingUp, FileText, AlertCircle, CheckCircle2, 
  ArrowRight, BookOpen, Target, Loader2, ArrowUpRight
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [interviews, setInterviews] = useState([]);
  const [resume, setResume] = useState(null);
  const [skillGap, setSkillGap] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const intData = await getInterviews();
        setInterviews(intData);

        const resumeRes = await api.get("/resume");
        if (resumeRes.data && resumeRes.data.resume) {
          setResume(resumeRes.data.resume);
        }

        const gapRes = await api.get("/analytics/skill-gap");
        setSkillGap(gapRes.data.topics || []);

        const progRes = await api.get("/learning/progress");
        setLearningProgress(progRes.data.progress || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const completedInterviews = interviews.filter(i => i.evaluationStatus === "completed" || i.interviewType === "Aptitude Assessment");
  const totalInterviews = completedInterviews.length;

  const calculateAverage = (type) => {
    const filtered = completedInterviews.filter(i => i.interviewType === type);
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, curr) => {
      if (type === "Aptitude Assessment") {
        return acc + (curr.scorePercentage || 0);
      }
      return acc + (curr.overallScore ? curr.overallScore * 10 : 0);
    }, 0);
    
    return Math.round(sum / filtered.length);
  };

  const hrScore = calculateAverage("HR Interview");
  const techScore = calculateAverage("Technical Interview");
  const aptScore = calculateAverage("Aptitude Assessment");
  const resumeScore = calculateAverage("Resume-Based Interview");

  let averageScore = 0;
  if (totalInterviews > 0) {
    const sumAll = completedInterviews.reduce((acc, curr) => {
       if (curr.interviewType === "Aptitude Assessment") {
         return acc + (curr.scorePercentage || 0);
       }
       return acc + (curr.overallScore ? curr.overallScore * 10 : 0);
    }, 0);
    averageScore = Math.round(sumAll / totalInterviews);
  }

  const weakTopics = skillGap.filter(t => t.status === "Needs Improvement" || t.status === "Needs Practice").slice(0, 4);
  const activeProgress = learningProgress.filter(p => p.previousScore !== null).slice(0, 3);

  return (
    <div className="flex h-screen bg-[#F3F6FF] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {loading ? (
            <div className="flex items-center justify-center h-full text-blue-600">
              <Loader2 size={40} className="animate-spin" />
            </div>
          ) : (
            <div className="w-full max-w-[1500px] mx-auto space-y-8">

              {/* WELCOME / AI PREPARATION HERO (WIDE) */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 lg:p-10 flex flex-col lg:flex-row items-stretch justify-between gap-8 relative overflow-hidden">
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex-1 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4 w-max">
                    <Target size={14} /> Dashboard Overview
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Good Morning, {user?.fullname?.split(' ')[0] || 'User'} 👋
                  </h1>
                  <p className="text-slate-600 text-lg mb-8 max-w-2xl leading-relaxed">
                    Your AI-powered interview preparation journey starts here. Practice, learn, and improve with personalized recommendations based on your unique skill gaps.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => navigate("/resume-interview")} 
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold transition shadow-sm shadow-blue-600/30 text-sm"
                    >
                      <Sparkles size={18} /> Start Resume Interview
                    </button>
                    {weakTopics.length > 0 && (
                      <button 
                        onClick={() => navigate(`/learning?topic=${encodeURIComponent(weakTopics[0].topic)}`)}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl font-bold transition shadow-sm text-sm"
                      >
                        <Target size={18} className="text-indigo-500" /> Practice Weak Topic
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Resume Status Card (Right aligned) */}
                <div className="relative z-10 flex-shrink-0 w-full lg:w-96 flex">
                  {resume ? (
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl w-full text-white shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <FileText size={24} className="text-white" />
                          </div>
                          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Analyzed ✓
                          </span>
                        </div>
                        <h3 className="font-bold text-xl mb-1 truncate">{resume.fileName}</h3>
                        <p className="text-indigo-200 text-sm mb-6">Ready for personalized interviews</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {resume.skills?.slice(0, 4).map(s => (
                          <span key={s} className="px-2.5 py-1 bg-black/20 backdrop-blur-sm text-[11px] font-bold rounded-lg text-white">{s}</span>
                        ))}
                        {resume.skills?.length > 4 && (
                          <span className="px-2.5 py-1 bg-black/20 backdrop-blur-sm text-[11px] font-bold rounded-lg text-white">+{resume.skills.length - 4}</span>
                        )}
                      </div>

                      <button onClick={() => navigate("/resume")} className="w-full bg-white text-indigo-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition text-sm">
                        View Details
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border-2 border-dashed border-slate-300 p-8 rounded-3xl w-full flex flex-col items-center justify-center text-center">
                      <div className="bg-slate-50 p-4 rounded-full mb-4">
                        <FileText size={32} className="text-slate-400" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 mb-2">No resume uploaded yet</h3>
                      <p className="text-sm text-slate-500 mb-6 font-medium px-4">Upload your resume to unlock personalized AI interview preparation.</p>
                      <button onClick={() => navigate("/resume")} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-sm text-sm w-full">
                        Upload Resume
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* QUICK ACTIONS FULL WIDTH GRID */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 px-2 flex items-center gap-2">
                  <RocketIcon /> Quick Preparation Links
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <ActionCard icon={Sparkles} title="Resume Interview" desc="Practice your actual CV" color="indigo" onClick={() => navigate("/resume-interview")} />
                  <ActionCard icon={Code2} title="Technical" desc="Coding & concepts" color="blue" onClick={() => navigate("/technical")} />
                  <ActionCard icon={Briefcase} title="HR Interview" desc="Behavioral questions" color="emerald" onClick={() => navigate("/hr")} />
                  <ActionCard icon={Brain} title="Aptitude Test" desc="Logical & quantitative" color="purple" onClick={() => navigate("/aptitude")} />
                  <ActionCard icon={Mic} title="Communication" desc="Speaking skills" color="amber" onClick={() => navigate("/communication")} />
                </div>
              </div>

              {/* PERFORMANCE METRICS (FULL WIDTH) */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 px-2 flex items-center gap-2">
                  <TrendingUp size={22} className="text-blue-600" /> Preparation Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <MetricCard title="Interviews" value={totalInterviews.toString()} />
                  <MetricCard title="Avg Score" value={`${averageScore}%`} highlight={true} />
                  <MetricCard title="Technical" value={`${techScore}%`} />
                  <MetricCard title="HR" value={`${hrScore}%`} />
                  <MetricCard title="Resume AI" value={`${resumeScore}%`} />
                  <MetricCard title="Aptitude" value={`${aptScore}%`} />
                </div>
              </div>

              {/* BOTTOM TWO COLUMN SECTION (WIDE) */}
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* AI Skill Gap */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10" />
                  
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <AlertCircle size={22} className="text-red-500" /> Priority Skill Gaps
                      </h2>
                      <p className="text-sm text-slate-500 font-medium mt-1">Focus on these weak areas</p>
                    </div>
                    <button onClick={() => navigate("/skill-gap")} className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition">View All</button>
                  </div>
                  
                  {weakTopics.length > 0 ? (
                    <div className="space-y-4 flex-1">
                      {weakTopics.map((topic, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 hover:border-blue-200 p-5 rounded-2xl flex items-center justify-between group transition shadow-sm hover:shadow-md">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center font-bold text-lg">
                              {topic.score}%
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 text-lg block">{topic.topic}</span>
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Needs Practice</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => navigate(`/learning?topic=${encodeURIComponent(topic.topic)}`)}
                              className="text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition shadow-sm"
                            >
                              Learn
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="bg-green-100 p-4 rounded-full mb-4">
                        <CheckCircle2 size={32} className="text-green-600" />
                      </div>
                      <p className="font-bold text-lg text-slate-800">No critical skill gaps!</p>
                      <p className="text-slate-500 font-medium mt-1 max-w-xs">Keep taking AI interviews to continuously assess your skills.</p>
                    </div>
                  )}
                </div>

                {/* Learning Progress */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10" />
                  
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen size={22} className="text-purple-500" /> Learning Progress
                      </h2>
                      <p className="text-sm text-slate-500 font-medium mt-1">Your recent practice history</p>
                    </div>
                    <button onClick={() => navigate("/learning")} className="text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition">Learning Hub</button>
                  </div>

                  {activeProgress.length > 0 ? (
                    <div className="space-y-4 flex-1">
                      {activeProgress.map((prog, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-slate-800 text-lg">{prog.topic}</span>
                            {prog.improvement !== null && prog.improvement > 0 ? (
                              <span className="text-xs font-bold uppercase tracking-widest bg-green-100 text-green-700 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200">
                                <TrendingUp size={14}/> +{prog.improvement} pts
                              </span>
                            ) : prog.practiceCompleted && !prog.reassessmentCompleted ? (
                              <span className="text-xs font-bold uppercase tracking-widest bg-blue-100 text-blue-700 px-3 py-1 rounded-lg border border-blue-200">
                                Practiced
                              </span>
                            ) : null}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Initial</div>
                              <div className="font-black text-slate-700 text-lg">{prog.previousScore}%</div>
                            </div>
                            <div className="bg-purple-50/50 p-3 rounded-xl text-center border border-purple-100">
                              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Practice</div>
                              <div className="font-black text-purple-700 text-lg">{prog.practiceScore || '--'}%</div>
                            </div>
                            <div className="bg-blue-50/50 p-3 rounded-xl text-center border border-blue-100">
                              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Reassess</div>
                              <div className="font-black text-blue-700 text-lg">{prog.latestScore || '--'}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="bg-slate-200 p-4 rounded-full mb-4">
                        <BookOpen size={32} className="text-slate-400" />
                      </div>
                      <p className="font-bold text-lg text-slate-800">Your learning journey starts here.</p>
                      <p className="text-slate-500 font-medium mt-1 max-w-xs">Practice a weak topic to begin tracking your improvement.</p>
                      <button onClick={() => navigate("/learning")} className="mt-6 text-sm bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-sm">
                        Explore Hub
                      </button>
                    </div>
                  )}
                </div>

              </div>
              
              <div className="h-10"></div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
);

const ActionCard = ({ icon: Icon, title, desc, color, onClick }) => {
  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    emerald: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    amber: "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
  };

  return (
    <button onClick={onClick} className="flex flex-col items-start bg-white hover:bg-slate-50 border border-slate-200 p-5 rounded-2xl transition shadow-sm hover:shadow-md group text-left h-full">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition duration-300 ${colorMap[color]}`}>
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
    </button>
  );
};

const MetricCard = ({ title, value, highlight = false }) => (
  <div className={`p-5 rounded-2xl border flex flex-col justify-center h-full shadow-sm ${highlight ? 'bg-blue-600 border-blue-600 text-white shadow-blue-600/20' : 'bg-white border-slate-200 text-slate-800'}`}>
    <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>
      {title}
    </div>
    <div className={`text-3xl font-black ${highlight ? 'text-white' : 'text-slate-800'}`}>
      {value}
    </div>
  </div>
);

export default Dashboard;
