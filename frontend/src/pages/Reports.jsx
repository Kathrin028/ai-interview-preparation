import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import { getInterviews } from "../services/interviewService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

function Reports() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getInterviews();
        setInterviews(data);
      } catch (err) {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const completed = interviews.filter(i => i.evaluationStatus === "completed" || i.interviewType === "Aptitude Assessment");

  const filteredInterviews = filter === "All" 
    ? interviews 
    : interviews.filter(i => i.interviewType.includes(filter));

  // Calculations for quick stats
  const averageScore = completed.length > 0
    ? Math.round(completed.reduce((acc, curr) => acc + (curr.scorePercentage || (curr.overallScore ? curr.overallScore * 10 : 0)), 0) / completed.length)
    : 0;

  const bestScore = completed.length > 0
    ? Math.max(...completed.map(curr => (curr.scorePercentage || (curr.overallScore ? curr.overallScore * 10 : 0))))
    : 0;

  // Chart Data Preparation
  const scoreTrendData = completed.slice().reverse().map(i => ({
    name: new Date(i.createdAt).toLocaleDateString(),
    score: i.scorePercentage || (i.overallScore ? i.overallScore * 10 : 0),
    type: i.interviewType
  }));

  const getAvg = (type) => {
    const subset = completed.filter(i => i.interviewType === type);
    if (subset.length === 0) return 0;
    return Math.round(subset.reduce((acc, curr) => acc + (curr.scorePercentage || (curr.overallScore ? curr.overallScore * 10 : 0)), 0) / subset.length);
  };

  const performanceData = [
    { name: "HR", score: getAvg("HR Interview") },
    { name: "Technical", score: getAvg("Technical Interview") },
    { name: "Aptitude", score: getAvg("Aptitude Assessment") },
    { name: "Communication", score: getAvg("Communication Assessment") },
  ];

  if (loading) return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex items-center justify-center text-slate-500">
          Loading reports...
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex items-center justify-center text-red-500 font-bold">
          {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">Performance Reports</h1>

          {interviews.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
              <h2 className="text-xl font-bold text-slate-700">No interviews completed yet.</h2>
              <p className="text-slate-500 mt-2 font-medium">Check back here once you complete an assessment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Average Score</h3>
                  <h1 className="text-4xl font-bold text-blue-600 mt-2">{averageScore}%</h1>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Best Score</h3>
                  <h1 className="text-4xl font-bold text-green-600 mt-2">{bestScore}%</h1>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Total Interviews</h3>
                  <h1 className="text-4xl font-bold text-purple-600 mt-2">{interviews.length}</h1>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Score Trend</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scoreTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" />
                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} name="Score (%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Performance by Module</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" />
                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} name="Average Score (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Interview History</h2>
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-slate-200 bg-slate-50 text-slate-700 p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="All">All Types</option>
                    <option value="HR">HR Interview</option>
                    <option value="Technical">Technical Interview</option>
                    <option value="Aptitude">Aptitude Test</option>
                    <option value="Communication">Communication</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                        <th className="py-3 px-4 font-bold rounded-tl-xl">Date</th>
                        <th className="py-3 px-4 font-bold">Type</th>
                        <th className="py-3 px-4 font-bold">Difficulty</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold">Score</th>
                        <th className="py-3 px-4 font-bold rounded-tr-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInterviews.map((item) => (
                        <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition text-sm">
                          <td className="py-4 px-4 font-medium text-slate-700">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-4 font-semibold text-slate-900">
                            {item.interviewType} {item.category ? `(${item.category})` : ""}
                          </td>
                          <td className="py-4 px-4 text-slate-600">{item.difficulty}</td>
                          <td className="py-4 px-4 capitalize">
                            <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] uppercase tracking-wider ${
                              item.evaluationStatus === 'completed' ? 'bg-green-100 text-green-700' :
                              item.evaluationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.evaluationStatus || 'completed'}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-700">
                            {item.interviewType === "Aptitude Assessment" 
                              ? `${item.scorePercentage || 0}%` 
                              : item.evaluationStatus === 'completed' 
                                ? `${item.overallScore ? item.overallScore * 10 : 0}%` 
                                : '-'}
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => navigate(`/reports/${item._id}`)}
                              className="text-blue-600 hover:text-blue-800 font-bold transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredInterviews.length === 0 && (
                    <p className="text-center py-8 text-slate-400 font-medium">No records match the selected filter.</p>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Reports;
