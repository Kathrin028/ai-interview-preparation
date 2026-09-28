import { useAuth } from "../context/AuthContext";
import { Sparkles, User, Bell, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="relative h-[72px] flex justify-between items-center px-6 lg:px-10 border-b border-slate-200/70 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-40 bg-white/90 backdrop-blur-md">
      
      {/* Subtle Premium Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-transparent to-purple-50/40 pointer-events-none -z-10" />

      {/* LEFT SIDE BRANDING */}
      <div className="flex items-center gap-4">
        
        {/* AI Icon Container */}
        <Link to="/dashboard" className="flex items-center gap-3 group outline-none">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-all">
            <Sparkles size={20} className="text-blue-100" />
          </div>
          
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
              AI Interview Preparation
            </h1>
            
            {/* AI Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100/50">
              <Sparkles size={10} className="text-indigo-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-700">
                AI Powered
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* RIGHT SIDE USER AREA */}
      <div className="flex items-center gap-5">
        
        {/* Optional Notification Icon */}
        <button className="hidden sm:flex w-9 h-9 items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition relative outline-none">
          <Bell size={18} />
          {/* Subtle indicator dot */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white"></span>
        </button>

        {/* Vertical Divider */}
        <div className="hidden sm:block h-6 w-px bg-slate-200/60" />

        {/* User Profile Area */}
        <Link to="/profile" className="flex items-center gap-3 group outline-none hover:bg-slate-50 p-1.5 pr-3 rounded-full transition border border-transparent hover:border-slate-200/60">
          
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Welcome back
            </div>
            <div className="text-sm font-bold text-slate-700 leading-none group-hover:text-indigo-600 transition-colors">
              {user?.fullname || "Test User"}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200/50 rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
              <User size={18} />
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition" />
          </div>
          
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;