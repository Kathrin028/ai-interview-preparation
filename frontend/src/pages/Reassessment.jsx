import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { 
  Target, Settings2, Loader2, BookOpen, CheckCircle, ArrowRight, ArrowLeft 
} from "lucide-react";

function Reassessment() {
  const { topic } = useParams();
  const navigate = useNavigate();

  const [setup, setSetup] = useState(true);
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  const startReassessment = async () => {
    setLoading(true);
    try {
      const response = await api.post("/learning/reassess/generate", {
        topic,
        difficulty,
        count
      });
      setQuestions(response.data);
      setSetup(false);
    } catch (error) {
      alert("Failed to generate reassessment questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const submitReassessment = async () => {
    setSaving(true);
    try {
      const payloadQuestions = questions.map((q, idx) => ({
        ...q,
        selectedAnswer: answers[idx] || "Not answered"
      }));

      const response = await api.post("/learning/reassess/save", {
        topic,
        difficulty,
        questions: payloadQuestions
      });

      navigate(`/reassessment-result/${response.data.session._id}`);
    } catch (error) {
      alert("Failed to save reassessment results.");
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F6FF] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {setup ? (
            <div className="w-full max-w-[1400px] mx-auto mt-10">
              <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
                
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
                
                <div className="w-full lg:w-1/2 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 w-max">
                    <Target size={14} /> Topic Reassessment
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">Reassess <br/><span className="text-blue-600">{topic}</span></h1>
                  <p className="text-slate-600 mb-10 font-medium text-lg max-w-lg leading-relaxed">Test your improvement with fresh, new objective questions to track your progress.</p>
                </div>
                  
                <div className="w-full lg:w-1/2 relative z-10 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                  <div className="space-y-6 text-left mb-8">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                        Difficulty
                      </label>
                      <div className="relative">
                        <select 
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Medium">Medium</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">▼</div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                        Number of Questions
                      </label>
                      <div className="relative">
                        <select 
                          value={count}
                          onChange={(e) => setCount(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition"
                        >
                          <option value={3}>3 Questions</option>
                          <option value={5}>5 Questions</option>
                          <option value={10}>10 Questions</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">▼</div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={startReassessment}
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:bg-blue-400 shadow-sm shadow-blue-600/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={22} className="animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      "Start Reassessment"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[1200px] mx-auto mt-4">
              
              {/* Header & Progress */}
              <div className="flex justify-between items-end mb-4 px-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{topic} Reassessment</h2>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">Question {currentIndex + 1} of {questions.length}</p>
                </div>
                <div className="text-blue-700 font-bold bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg text-sm">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </div>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-t-xl overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 transition-all duration-300" 
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl shadow-sm p-6 sm:p-10 mb-6">
                <h3 className="text-xl sm:text-2xl font-medium text-slate-900 mb-8 leading-relaxed">
                  {questions[currentIndex].question}
                </h3>
                
                <div className="space-y-3">
                  {questions[currentIndex].options.map((opt, i) => {
                    const isSelected = answers[currentIndex] === opt;
                    return (
                      <div 
                        key={i}
                        onClick={() => handleOptionSelect(opt)}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition ${
                          isSelected ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                        </div>
                        <span className={`text-lg ${isSelected ? 'font-semibold text-blue-900' : 'text-slate-700'}`}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center px-2">
                <button
                  onClick={prevQuestion}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition disabled:opacity-0 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <ArrowLeft size={18} /> Previous
                </button>

                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={submitReassessment}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 shadow-sm shadow-green-600/30 transition disabled:bg-green-400"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    {saving ? "Submitting..." : "Submit Reassessment"}
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                )}
              </div>
              
              <div className="h-8"></div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Reassessment;
