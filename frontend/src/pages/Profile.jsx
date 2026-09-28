import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Loader2, Save } from "lucide-react";

function Profile() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    fullname: "",
    username: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setProfileData({
          fullname: res.data.fullname,
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profileData.fullname.trim() || !profileData.username.trim()) {
      alert("Full name and username are required");
      return;
    }
    setSaving(true);
    try {
      const res = await api.put("/users/profile", {
        fullname: profileData.fullname,
        username: profileData.username,
      });
      updateUser(res.data.user);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
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
          <div className="w-full max-w-[1400px] mx-auto mt-4">
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <div className="absolute -bottom-12 inset-x-0 flex justify-center">
                  <div className="w-24 h-24 bg-white p-1 rounded-full shadow-md">
                    <div className="w-full h-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <User size={40} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-16 pb-8 px-8 text-center border-b border-slate-100">
                <h1 className="text-2xl font-bold text-slate-900">{user?.fullname || "Loading..."}</h1>
                <p className="text-slate-500 font-medium capitalize mt-1 flex items-center justify-center gap-1.5">
                  <Shield size={14} /> {user?.role || "Student"}
                </p>
              </div>

              <div className="p-8">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 text-blue-600">
                    <Loader2 size={32} className="animate-spin mb-4" />
                    <span className="font-semibold text-slate-500">Loading profile data...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-10 text-red-500 font-bold">{error}</div>
                ) : (
                  <form onSubmit={handleSave} className="max-w-xl mx-auto space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <User size={16} className="text-slate-400" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        value={profileData.fullname}
                        onChange={handleChange}
                        className="w-full border border-slate-200 bg-slate-50 text-slate-800 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <User size={16} className="text-slate-400" /> Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleChange}
                        className="w-full border border-slate-200 bg-slate-50 text-slate-800 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <Mail size={16} className="text-slate-400" /> Email <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded ml-2">Read Only</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        className="w-full border border-slate-100 bg-slate-100 text-slate-500 rounded-xl p-3.5 cursor-not-allowed"
                        disabled
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold transition shadow-sm shadow-blue-600/30 disabled:bg-blue-400"
                      >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? "Saving Changes..." : "Save Profile"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
