import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, Sliders, Shield, Key, Loader2, CheckCircle } from "lucide-react";

function Settings() {
  const { logout } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const [preferences, setPreferences] = useState({
    defaultDifficulty: "Easy",
    defaultQuestionCount: 5,
  });

  useEffect(() => {
    const savedDifficulty = localStorage.getItem("defaultDifficulty");
    const savedCount = localStorage.getItem("defaultQuestionCount");
    
    if (savedDifficulty) {
      setPreferences(p => ({ ...p, defaultDifficulty: savedDifficulty }));
    }
    if (savedCount) {
      setPreferences(p => ({ ...p, defaultQuestionCount: parseInt(savedCount) }));
    }
  }, []);

  const handlePrefChange = (e) => {
    const { name, value } = e.target;
    setPreferences(p => ({ ...p, [name]: value }));
    localStorage.setItem(name, value);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }
    
    setSavingPassword(true);
    try {
      await api.put("/users/change-password", passwordData);
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F6FF] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="w-full max-w-[1400px] mx-auto">
            
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-slate-200 text-slate-700 p-2.5 rounded-xl">
                <SettingsIcon size={28} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
            </div>

            <div className="grid gap-6">
              
              {/* Preferences */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <Sliders size={20} className="text-blue-500" />
                  <h2 className="text-xl font-bold text-slate-800">Interview Preferences</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Default Difficulty</label>
                    <div className="relative">
                      <select
                        name="defaultDifficulty"
                        value={preferences.defaultDifficulty}
                        onChange={handlePrefChange}
                        className="w-full border border-slate-200 bg-slate-50 text-slate-700 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">▼</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Default Question Count</label>
                    <div className="relative">
                      <select
                        name="defaultQuestionCount"
                        value={preferences.defaultQuestionCount}
                        onChange={handlePrefChange}
                        className="w-full border border-slate-200 bg-slate-50 text-slate-700 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition"
                      >
                        <option value={3}>3 Questions</option>
                        <option value={5}>5 Questions</option>
                        <option value={10}>10 Questions</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">▼</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <Shield size={20} className="text-indigo-500" />
                  <h2 className="text-xl font-bold text-slate-800">Security & Password</h2>
                </div>
                
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <Key size={14} className="text-slate-400" /> Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 text-slate-800 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <Shield size={14} className="text-slate-400" /> New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Min. 6 characters"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 text-slate-800 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <CheckCircle size={14} className="text-slate-400" /> Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 text-slate-800 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold transition disabled:bg-slate-400 shadow-sm"
                    >
                      {savingPassword && <Loader2 size={16} className="animate-spin" />}
                      {savingPassword ? "Updating Password..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>

            </div>
            
            <div className="h-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
