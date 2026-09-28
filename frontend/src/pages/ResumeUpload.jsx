import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { UploadCloud, FileText, Loader2, Sparkles, AlertCircle, CheckCircle, GraduationCap, Briefcase, Code, Award, Target, Folder } from "lucide-react";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resume");
      setResumeData(res.data);
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        setError("Failed to fetch existing resume.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploading(true);
      setError(null);
      const res = await api.post("/resume/upload", formData);
      setResumeData(res.data.resume);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const Section = ({ title, icon: Icon, items }) => (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full">
      <div className="flex items-center gap-2 mb-4 text-indigo-700">
        <Icon size={20} />
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      {items && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
              <span className="text-indigo-400 mt-1">•</span> {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 italic">No {title.toLowerCase()} detected.</p>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F3F6FF] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="w-full max-w-[1400px] mx-auto space-y-8">
            
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
                <Sparkles className="text-purple-500" size={32} />
                Resume AI Analysis
              </h1>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                Upload your resume and let our advanced AI extract your skills, projects, and experience to generate personalized interview questions.
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10 relative overflow-hidden">
              <form onSubmit={handleUpload} className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                  <UploadCloud size={36} />
                </div>
                
                <h2 className="text-xl font-bold text-slate-800 mb-2">Upload your resume</h2>
                <p className="text-sm text-slate-500 mb-8 font-medium">Supported format: PDF (Max 5MB)</p>

                <div className="w-full max-w-md relative">
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    disabled={uploading}
                  />
                  <div className={`w-full border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-3 ${
                    file ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300'
                  }`}>
                    <FileText size={28} className={file ? 'text-indigo-600' : 'text-slate-400'} />
                    <span className={`font-semibold ${file ? 'text-indigo-700' : 'text-slate-600'}`}>
                      {file ? file.name : "Drag & drop your PDF here, or browse"}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl text-sm font-bold border border-red-100">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={uploading || !file}
                  className="mt-8 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl disabled:bg-indigo-300 transition shadow-sm shadow-indigo-600/30"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> Upload & Analyze
                    </>
                  )}
                </button>
              </form>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-12 text-indigo-600">
                <Loader2 size={36} className="animate-spin mb-4" />
                <span className="font-semibold text-slate-600">Loading your AI analysis...</span>
              </div>
            )}

            {resumeData && !loading && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:p-10 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="text-indigo-200" size={24} />
                    <h2 className="text-2xl font-bold">Resume Analyzed</h2>
                  </div>
                  <p className="text-indigo-100 font-medium flex items-center gap-2">
                    <FileText size={16} /> {resumeData.fileName}
                  </p>
                </div>

                <div className="p-8 sm:p-10">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Section title="Skills" icon={Target} items={resumeData.skills} />
                    <Section title="Technologies" icon={Code} items={resumeData.technologies} />
                    <Section title="Experience" icon={Briefcase} items={resumeData.experience} />
                    <Section title="Projects" icon={Folder} items={resumeData.projects} />
                    <Section title="Education" icon={GraduationCap} items={resumeData.education} />
                    <Section title="Certifications" icon={Award} items={resumeData.certifications} />
                  </div>
                </div>
              </div>
            )}

            <div className="h-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;
