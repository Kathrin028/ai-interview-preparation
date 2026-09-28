import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Sparkles, Loader2, Mail, Lock, User } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        username: formData.username,
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      alert("Registration Successful!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
        
        <div className="relative z-10 max-w-lg">
          <div className="bg-white/10 p-3 rounded-2xl inline-flex mb-6 backdrop-blur-sm border border-white/20">
            <Sparkles size={32} className="text-blue-100" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            AI Interview <br /> Preparation System
          </h1>
          <p className="text-xl text-blue-100 mb-8 font-light">
            Prepare smarter. Practice better. Improve faster.
          </p>
          <div className="flex gap-4 items-center text-sm font-medium text-blue-200">
            <span>Assess</span>
            <span className="text-blue-400">→</span>
            <span>Learn</span>
            <span className="text-blue-400">→</span>
            <span>Practice</span>
            <span className="text-blue-400">→</span>
            <span className="text-white">Improve</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-500 mt-2">Join the AI preparation platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="fullname"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe123"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm shadow-blue-600/30 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          <p className="text-center text-slate-500 mt-8 text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Register;
