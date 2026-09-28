import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  BookOpen, ExternalLink, Target, RefreshCw, AlertCircle, PlayCircle, FileText, Loader2, Sparkles, TrendingUp
} from "lucide-react";

function LearningHub() {
  const [searchParams] = useSearchParams();
  const requestedTopic = searchParams.get("topic");
  const navigate = useNavigate();

  const [weakTopics, setWeakTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(requestedTopic || "");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    const fetchGapsAndProgress = async () => {
      try {
        const gapRes = await api.get("/analytics/skill-gap");
        const topics = gapRes.data.topics || [];
        const weak = topics.filter(t => t.status === "Needs Improvement" || t.status === "Needs Practice");
        setWeakTopics(weak);
        
        if (!requestedTopic && weak.length > 0) {
          setSelectedTopic(weak[0].topic);
        }

        const progRes = await api.get("/learning/progress");
        const pMap = {};
        progRes.data.progress.forEach(p => {
          pMap[p.topic] = p;
        });
        setProgressMap(pMap);

      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGapsAndProgress();
  }, [requestedTopic]);

  useEffect(() => {
    if (selectedTopic) {
      const fetchResources = async () => {
        try {
          const res = await api.get(`/learning/resources/${encodeURIComponent(selectedTopic)}`);
          setResources(res.data.resources || []);
        } catch (err) {
          console.error("Failed to fetch resources.");
        }
      };
      fetchResources();
    }
  }, [selectedTopic]);

  const getResourceIcon = (type) => {
    if (type?.toLowerCase().includes("video")) return <PlayCircle size={18} />;
    if (type?.toLowerCase().includes("article") || type?.toLowerCase().includes("doc")) return <FileText size={18} />;
    return <BookOpen size={18} />;
  };

  return (
    <div className="flex h-screen bg-[#F3F6FF] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          <div className="w-full max-w-[1500px] mx-auto space-y-8">
            
            {/* Header (Full Width) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-purple-50/50 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-widest mb-4 w-max">
                  <BookOpen size={14} /> Knowledge Hub
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                  Personalized Learning
                </h1>
                <p className="text-slate-600 text-lg max-w-2xl">
                  Recommended resources, targeted practice, and reassessments tailored precisely to your identified skill gaps.
                </p>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
              
              {/* LEFT: Weak Topics (Width 30%) */}
              <div className="w-full xl:w-[35%] 2xl:w-[30%] space-y-4">
                <h2 className="text-xl font-bold text-slate-800 px-2 flex items-center gap-2">
                  <Target size={20} className="text-indigo-500" /> Your Weak Topics
                </h2>
                
                {loading ? (
                  <div className="bg-white border border-slate-100 p-10 rounded-3xl flex justify-center text-blue-600 shadow-sm">
                    <Loader2 size={36} className="animate-spin" />
                  </div>
                ) : weakTopics.length === 0 ? (
                  <div className="bg-white border border-slate-100 p-10 rounded-3xl text-center shadow-sm">
                    <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} className="text-green-500" />
                    </div>
                    <p className="font-bold text-lg text-slate-800">No weak topics identified yet!</p>
                    <p className="text-slate-500 mt-2 font-medium">Complete more AI interviews to build your profile.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {weakTopics.map((item, idx) => {
                      const prog = progressMap[item.topic] || {};
                      const isImproved = prog.improvement !== undefined && prog.improvement !== null && prog.improvement > 0;
                      const isSelected = selectedTopic === item.topic;

                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedTopic(item.topic)}
                          className={`p-6 rounded-3xl border transition cursor-pointer relative overflow-hidden ${
                            isSelected 
                              ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/20" 
                              : "bg-white border-slate-100 text-slate-800 hover:border-purple-300 hover:shadow-sm"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
                          )}

                          <div className="flex justify-between items-start mb-6">
                            <span className="font-bold text-xl tracking-tight leading-tight mr-4">{item.topic}</span>
                            {isImproved ? (
                              <span className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg font-black shrink-0 flex items-center gap-1 border ${isSelected ? 'bg-white/20 border-white/20 text-white' : 'bg-green-50 border-green-200 text-green-700'}`}>
                                <TrendingUp size={12}/> Improved
                              </span>
                            ) : (
                              <span className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg font-black shrink-0 border ${isSelected ? 'bg-white/20 border-white/20 text-white' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                Needs Practice
                              </span>
                            )}
                          </div>
                          
                          <div className={`grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-2xl border ${isSelected ? 'bg-black/10 border-white/10 text-purple-100' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                            <div>
                              <div className="mb-1 opacity-80 font-bold uppercase tracking-widest text-[10px]">Initial</div>
                              <div className={`font-black text-lg ${isSelected ? 'text-white' : 'text-slate-800'}`}>{prog.previousScore ?? item.score}%</div>
                            </div>
                            <div className={`border-l border-r ${isSelected ? 'border-white/10' : 'border-slate-200'}`}>
                              <div className="mb-1 opacity-80 font-bold uppercase tracking-widest text-[10px]">Practice</div>
                              <div className={`font-black text-lg ${isSelected ? 'text-white' : 'text-slate-800'}`}>{prog.practiceScore ?? '--'}%</div>
                            </div>
                            <div>
                              <div className="mb-1 opacity-80 font-bold uppercase tracking-widest text-[10px]">Reassess</div>
                              <div className={`font-black text-lg ${isSelected ? 'text-white' : 'text-slate-800'}`}>{prog.latestScore ?? '--'}%</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT: Resources (Width 70%) */}
              <div className="w-full xl:w-[65%] 2xl:w-[70%]">
                {selectedTopic ? (
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 lg:p-10 min-h-[600px] flex flex-col">
                    
                    <div className="flex flex-col xl:flex-row justify-between xl:items-end mb-8 gap-6 border-b border-slate-100 pb-8">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-3 border border-indigo-100">
                          Selected Topic
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                          {selectedTopic}
                        </h2>
                        <p className="text-slate-500 font-medium mt-2">Here are a few resources that can help you improve this weak topic.</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => navigate(`/practice/${encodeURIComponent(selectedTopic)}`)}
                          className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-6 py-3.5 rounded-xl font-bold transition text-sm"
                        >
                          <Target size={18} />
                          {progressMap[selectedTopic]?.practiceCompleted ? 'Practice Again' : 'Practice First'}
                        </button>
                        <button
                          onClick={() => {
                            if (!progressMap[selectedTopic]?.practiceCompleted) {
                              alert("Please complete a practice session first before taking the reassessment.");
                              return;
                            }
                            navigate(`/reassess/${encodeURIComponent(selectedTopic)}`);
                          }}
                          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition text-sm ${
                            progressMap[selectedTopic]?.practiceCompleted 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30' 
                              : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200'
                          }`}
                        >
                          <RefreshCw size={18} /> Take Reassessment
                        </button>
                      </div>
                    </div>

                    {resources.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div className="bg-white p-5 rounded-full shadow-sm mb-6 border border-slate-100">
                          <AlertCircle size={48} className="text-slate-300" />
                        </div>
                        <p className="text-slate-800 font-bold text-lg mb-2">No curated resources available.</p>
                        <p className="text-slate-500 font-medium mb-8 max-w-sm">We're currently expanding our library. You can still practice this topic directly.</p>
                        <button
                          onClick={() => navigate(`/practice/${encodeURIComponent(selectedTopic)}`)}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-sm"
                        >
                          Start Practice Session
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-5">
                        {resources.map((res, i) => (
                          <div key={i} className="flex flex-col md:flex-row justify-between p-6 border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-md transition gap-6 bg-white group">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                                  {getResourceIcon(res.resourceType)} {res.resourceType}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                                  {res.difficulty}
                                </span>
                              </div>
                              <h3 className="font-bold text-slate-900 text-xl leading-tight group-hover:text-blue-700 transition">{res.title}</h3>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{res.source}</p>
                              {res.description && <p className="text-sm text-slate-600 mt-3 leading-relaxed font-medium">{res.description}</p>}
                            </div>
                            
                            <div className="md:self-center shrink-0">
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 px-6 py-3.5 rounded-xl font-bold transition"
                              >
                                Open Resource <ExternalLink size={18} className="text-slate-400" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 h-full flex flex-col items-center justify-center text-center py-32">
                    <div className="bg-slate-50 p-6 rounded-3xl mb-6">
                      <BookOpen size={48} className="text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Select a topic</h2>
                    <p className="text-slate-500 font-medium max-w-sm">Choose a weak topic from the left sidebar to view our hand-picked learning resources.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
          <div className="h-10"></div>
        </div>
      </div>
    </div>
  );
}

export default LearningHub;
