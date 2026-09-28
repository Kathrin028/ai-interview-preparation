import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PastelBackground from "../components/PastelBackground";
import Sidebar from "../components/Sidebar";
import { getInterviewDetails } from "../services/interviewService";

function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getInterviewDetails(id);
        setReport(data);
      } catch (err) {
        setError("Failed to load report details or unauthorized access.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <PastelBackground />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">Loading...</div>
      </div>
    </div>
  );

  if (error || !report) return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">{error || "Not found"}</div>
      </div>
    </div>
  );

  const isAptitude = report.interviewType === "Aptitude Assessment";

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          
          <button 
            onClick={() => navigate("/reports")}
            className="mb-6 text-blue-600 hover:underline flex items-center"
          >
            ← Back to Reports
          </button>

          <h1 className="text-3xl font-bold mb-2">Interview Report</h1>
          <p className="text-gray-600 mb-6">
            Conducted on {new Date(report.createdAt).toLocaleString()}
          </p>

          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Type</p>
                <p className="font-semibold">{report.interviewType}</p>
              </div>
              {report.category && (
                <div>
                  <p className="text-gray-500 text-sm">Category</p>
                  <p className="font-semibold">{report.category}</p>
                </div>
              )}
              {report.difficulty && (
                <div>
                  <p className="text-gray-500 text-sm">Difficulty</p>
                  <p className="font-semibold">{report.difficulty}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-sm">Evaluation Status</p>
                <p className="font-semibold capitalize">
                  {report.evaluationStatus === "pending" ? "AI Evaluation Processing..." : report.evaluationStatus || "Completed"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Score</p>
                <p className="font-semibold text-lg text-blue-600">
                  {isAptitude 
                    ? `${report.scorePercentage || 0}%` 
                    : report.evaluationStatus === 'completed'
                      ? `${report.overallScore ? report.overallScore * 10 : 0}%`
                      : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* AI Metrics for HR/Technical/Communication */}
          {report.evaluationStatus === "completed" && !isAptitude && (
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">AI Evaluation</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {report.relevanceScore !== undefined && (
                  <div>
                    <p className="text-gray-500 text-sm">Relevance</p>
                    <p className="font-bold text-green-600">{report.relevanceScore}/10</p>
                  </div>
                )}
                {report.clarityScore !== undefined && (
                  <div>
                    <p className="text-gray-500 text-sm">Clarity</p>
                    <p className="font-bold text-green-600">{report.clarityScore}/10</p>
                  </div>
                )}
                {report.completenessScore !== undefined && (
                  <div>
                    <p className="text-gray-500 text-sm">Completeness</p>
                    <p className="font-bold text-green-600">{report.completenessScore}/10</p>
                  </div>
                )}
                {report.professionalismScore !== undefined && (
                  <div>
                    <p className="text-gray-500 text-sm">Professionalism</p>
                    <p className="font-bold text-green-600">{report.professionalismScore}/10</p>
                  </div>
                )}
                {report.grammarScore !== undefined && (
                  <div>
                    <p className="text-gray-500 text-sm">Grammar</p>
                    <p className="font-bold text-green-600">{report.grammarScore}/10</p>
                  </div>
                )}
              </div>

              {report.feedback && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700">Overall Feedback</h3>
                  <p className="text-gray-600 mt-1">{report.feedback}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {report.strengths && report.strengths.length > 0 && (
                  <div>
                    <h3 className="font-bold text-green-700">Strengths</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                      {report.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                    </ul>
                  </div>
                )}
                
                {report.improvements && report.improvements.length > 0 && (
                  <div>
                    <h3 className="font-bold text-yellow-600">Areas for Improvement</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                      {report.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aptitude Metrics */}
          {isAptitude && (
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Assessment Results</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Total Questions</p>
                  <p className="font-bold">{report.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Correct Answers</p>
                  <p className="font-bold text-green-600">{report.correctAnswersCount}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Incorrect Answers</p>
                  <p className="font-bold text-red-600">{report.incorrectAnswersCount}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Time Taken</p>
                  <p className="font-bold">{report.timeTaken} seconds</p>
                </div>
              </div>
            </div>
          )}

          {/* Question Details */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Questions & Answers</h2>
            <div className="space-y-6">
              {report.questions && report.questions.map((q, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border">
                  <p className="font-bold text-gray-800">Q{idx + 1}: {q.question}</p>
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-500">Your Answer:</p>
                    <p className="text-gray-700 mt-1">{q.answer || "No answer provided"}</p>
                  </div>
                  
                  {q.correctAnswer && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-500">Correct Answer:</p>
                      <p className="text-green-700 mt-1">{q.correctAnswer}</p>
                    </div>
                  )}

                  {q.feedback && (
                    <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-sm font-semibold text-blue-800">AI Feedback (Score: {q.score}/10):</p>
                      <p className="text-blue-900 mt-1">{q.feedback}</p>
                    </div>
                  )}

                  {q.suggestedAnswer && (
                    <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-100">
                      <p className="text-sm font-semibold text-green-800">Suggested Answer:</p>
                      <p className="text-green-900 mt-1">{q.suggestedAnswer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ReportDetails;
