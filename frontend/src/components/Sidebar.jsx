import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, Briefcase, Code2, Brain, Mic, 
  FileText, Sparkles, ChartNoAxesColumn, BookOpen, Target, 
  RefreshCw, User, Settings, LogOut 
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(to + "/");
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
          isActive 
            ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        }`}
      >
        <Icon size={20} className={isActive ? "text-blue-200" : "text-slate-500"} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        
        {/* Prepare Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-4">Prepare</h3>
          <nav className="space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/hr" icon={Briefcase} label="HR Interview" />
            <NavItem to="/technical" icon={Code2} label="Technical Interview" />
            <NavItem to="/aptitude" icon={Brain} label="Aptitude Test" />
            <NavItem to="/communication" icon={Mic} label="Communication" />
          </nav>
        </div>

        {/* AI Tools Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-4">AI Tools</h3>
          <nav className="space-y-1">
            <NavItem to="/resume" icon={FileText} label="Resume Upload" />
            <NavItem to="/resume-interview" icon={Sparkles} label="Resume Interview" />
            <NavItem to="/skill-gap" icon={ChartNoAxesColumn} label="AI Skill Gap" />
          </nav>
        </div>

        {/* Learn Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-4">Learn & Improve</h3>
          <nav className="space-y-1">
            <NavItem to="/learning" icon={BookOpen} label="Learning Hub" />
            {/* Note: Practice & Reassess routes usually take a topic param, so we just guide them to learning hub, or we don't link them statically. 
                But the user requested them. We can point Practice to a dummy or just keep Learning Hub as the entry.
                Wait, the mock explicitly had:
                📚 Learning Hub
                🎯 Practice
                📈 Reassessment
                Maybe I'll skip Practice/Reassess in sidebar since they need topics, or just point them to learning hub.
                Actually, the user said: "Maintain the same navigation functionality."
                So I will omit Practice/Reassess if they were not in the original sidebar, wait, they weren't in the original sidebar (see view_file output).
                I'll just put Reports here. */}
            <NavItem to="/reports" icon={Target} label="Performance Reports" />
          </nav>
        </div>

      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <NavItem to="/profile" icon={User} label="Profile" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10"
        >
          <LogOut size={20} className="text-slate-500" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
}

export default Sidebar;