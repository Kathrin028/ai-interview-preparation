import { 
  Target, Loader2, Sparkles, Code2, Briefcase, Brain, Mic, 
  CheckCircle2, Rocket, FileText 
} from "lucide-react";

function InterviewSetup({
  title,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount,
  categories,
  category,
  setCategory,
  onStart,
  loading,
  error,
}) {
  const displayTitle = title || (categories ? "Technical Interview" : "HR Interview");
  
  // Determine icon and theme based on title
  let ThemeIcon = Target;
  let themeColor = "blue";
  
  if (displayTitle.includes("Technical")) { ThemeIcon = Code2; themeColor = "indigo"; }
  else if (displayTitle.includes("HR")) { ThemeIcon = Briefcase; themeColor = "blue"; }
  else if (displayTitle.includes("Aptitude")) { ThemeIcon = Brain; themeColor = "purple"; }
  else if (displayTitle.includes("Communication")) { ThemeIcon = Mic; themeColor = "emerald"; }
  else if (displayTitle.includes("Resume")) { ThemeIcon = FileText; themeColor = "indigo"; }

  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    indigo: "text-indigo-600 bg-indigo-100",
    purple: "text-purple-600 bg-purple-100",
    emerald: "text-emerald-600 bg-emerald-100",
  };

  const borderFocusClasses = {
    blue: "focus:border-blue-500 focus:ring-blue-200",
    indigo: "focus:border-indigo-500 focus:ring-indigo-200",
    purple: "focus:border-purple-500 focus:ring-purple-200",
    emerald: "focus:border-emerald-500 focus:ring-emerald-200",
  };

  const buttonClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30",
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-600/30",
    emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30",
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto min-h-[75vh] flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center relative">
      
      {/* Background Decor */}
      <div className={`absolute top-0 left-0 w-96 h-96 bg-${themeColor}-100/40 rounded-full blur-3xl -z-10 pointer-events-none -mt-20 -ml-20`} />
      <div className={`absolute bottom-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl -z-10 pointer-events-none -mb-20 -mr-20`} />

      {/* LEFT SIDE - Hero & Info */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest mb-6 w-max">
          <Sparkles size={14} className={`text-${themeColor}-500`} />
          AI-Powered Assessment
        </div>

        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
          Prepare for your <br/>
          <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${themeColor}-600 to-purple-600`}>
            {displayTitle}
          </span>
        </h1>
        
        <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
          Elevate your career readiness with our advanced AI. Customize your assessment and receive instant, personalized feedback designed to help you succeed.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className={`text-${themeColor}-500 shrink-0 mt-0.5`} size={20} />
            <span className="text-slate-700 font-medium">Industry-standard topics</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className={`text-${themeColor}-500 shrink-0 mt-0.5`} size={20} />
            <span className="text-slate-700 font-medium">Adaptive difficulty</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className={`text-${themeColor}-500 shrink-0 mt-0.5`} size={20} />
            <span className="text-slate-700 font-medium">Detailed AI feedback</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className={`text-${themeColor}-500 shrink-0 mt-0.5`} size={20} />
            <span className="text-slate-700 font-medium">Build confidence</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center p-6 bg-white/50 border border-slate-200 rounded-3xl w-max shadow-sm">
           <ThemeIcon size={64} className={`text-${themeColor}-500 opacity-80`} />
           <div className="ml-6">
             <div className="font-bold text-slate-800 text-lg">AI Coach Ready</div>
             <div className="text-sm text-slate-500">Your personalized session awaits.</div>
           </div>
        </div>
      </div>

      {/* RIGHT SIDE - Setup Card */}
      <div className="w-full lg:w-[45%] max-w-[500px]">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 sm:p-10 relative overflow-hidden">
          
          <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-${themeColor}-500 to-purple-500`} />
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              Setup Options
            </h2>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[themeColor]}`}>
              <ThemeIcon size={20} />
            </div>
          </div>

          <p className="text-sm text-slate-500 font-medium mb-8">Customize your interview experience before starting.</p>

          <div className="space-y-6">
            {categories && categories.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Category</label>
                <div className="relative">
                  <select
                    className={`w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3.5 outline-none focus:ring-2 appearance-none transition ${borderFocusClasses[themeColor]}`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Difficulty
              </label>
              <div className="relative">
                <select
                  className={`w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3.5 outline-none focus:ring-2 appearance-none transition ${borderFocusClasses[themeColor]}`}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    ▼
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Number of Questions
              </label>
              <div className="relative">
                <select
                  className={`w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3.5 outline-none focus:ring-2 appearance-none transition ${borderFocusClasses[themeColor]}`}
                  value={questionCount}
                  onChange={(e) =>
                    setQuestionCount(Number(e.target.value))
                  }
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    ▼
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                <Target size={16} />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              onClick={onStart}
              className={`w-full flex justify-center items-center gap-2 text-white py-4 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-lg mt-2 ${buttonClasses[themeColor]}`}
            >
              {loading ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Rocket size={22} /> Start Interview
                </>
              )}
            </button>
            
            <div className="text-center mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Sparkles size={12} className="text-purple-400" /> Powered by Gemini AI
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default InterviewSetup;