import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Loader2, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, BrainCircuit, Target, BookOpen, LineChart, TrendingUp } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* ================================================== */}
      {/* LEFT PANEL - PREMIUM AI VISUAL DESIGN */}
      {/* ================================================== */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white flex-col justify-center p-12 xl:p-20 relative overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Large blurred circles */}
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[100px]" />
          
          {/* Subtle dot grid */}
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-10 mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
              backgroundSize: '32px 32px'
            }}
          />
          
          {/* Curved AI lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100,500 C200,400 300,700 900,200" fill="none" stroke="url(#gradient)" strokeWidth="2" />
            <path d="M-100,600 C300,500 400,800 900,300" fill="none" stroke="url(#gradient)" strokeWidth="1" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 w-full max-w-xl mx-auto">
          
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-blue-100 mb-8">
            <Sparkles size={12} className="text-blue-300" />
            AI-Powered Interview Preparation
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight tracking-tight">
            AI Interview <br /> Preparation System
          </h1>
          
          <p className="text-lg xl:text-xl text-blue-100/80 mb-12 font-light max-w-md leading-relaxed">
            Prepare smarter. Practice better. Improve faster with intelligent insights.
          </p>

          {/* Workflow / Timeline */}
          <div className="flex items-center gap-2 xl:gap-4 mb-12">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center border border-blue-400/30">
                <BrainCircuit size={18} className="text-blue-200" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Assess</span>
            </div>
            <div className="w-8 xl:w-12 h-px bg-blue-400/30 mb-5" />
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center border border-purple-400/30">
                <BookOpen size={18} className="text-purple-200" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Learn</span>
            </div>
            <div className="w-8 xl:w-12 h-px bg-purple-400/30 mb-5" />
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center border border-indigo-400/30">
                <Target size={18} className="text-indigo-200" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Practice</span>
            </div>
            <div className="w-8 xl:w-12 h-px bg-indigo-400/30 mb-5" />
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center border border-green-400/30">
                <LineChart size={18} className="text-green-200" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-200">Improve</span>
            </div>
          </div>

          {/* Benefit Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
              <div className="bg-blue-500/20 p-2 rounded-xl text-blue-300">
                <CheckCircle2 size={20} />
              </div>
              <span className="font-medium text-blue-50">Personalized AI Interviews</span>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
              <div className="bg-purple-500/20 p-2 rounded-xl text-purple-300">
                <BrainCircuit size={20} />
              </div>
              <span className="font-medium text-blue-50">Intelligent Skill Gap Analysis</span>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
              <div className="bg-green-500/20 p-2 rounded-xl text-green-300">
                <TrendingUp size={20} />
              </div>
              <span className="font-medium text-blue-50">Practice & Improvement Tracking</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================================================== */}
      {/* RIGHT PANEL - LOGIN FORM */}
      {/* ================================================== */}
      <div className="w-full lg:w-[48%] flex flex-col relative bg-[#F5F8FF] overflow-hidden">
        
        {/* Right Side Pastel Decorations */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-200/40 blur-[100px]" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[100px]" />
          
          <div 
            className="absolute top-10 right-10 w-[300px] h-[300px] opacity-[0.16]" 
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(99,102,241,1) 1.5px, transparent 1.5px)',
              backgroundSize: '26px 26px'
            }}
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10">
          <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-sm text-slate-500 font-medium mt-2">Sign in to continue your personalized interview preparation.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm px-1 pt-1">
                <label className="flex items-center text-slate-600 cursor-pointer font-medium hover:text-slate-900 transition">
                  <input type="checkbox" className="mr-2.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                  Remember me
                </label>
                <span className="text-indigo-600 font-bold cursor-pointer hover:text-indigo-700 hover:underline transition">
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 group mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </form>

            <div className="mt-8">
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-bold uppercase tracking-wider text-slate-400">Secure & AI-Powered</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              
              <div className="flex justify-center items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500"/> Secure Auth</div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-1.5"><Sparkles size={14} className="text-indigo-500"/> AI Assessment</div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-1.5"><Target size={14} className="text-blue-500"/> Personalized</div>
              </div>
            </div>

          </div>

          {/* Create Account Link outside the card for cleaner look */}
          <div className="mt-8 text-center text-slate-500 text-sm font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition">
              Create Account
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;
