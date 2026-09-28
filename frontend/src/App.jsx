import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Interview from "./pages/Interview.jsx";
import Reports from "./pages/Reports.jsx";
import ReportDetails from "./pages/ReportDetails.jsx";
import HRInterview from "./pages/HRInterview.jsx";
import TechnicalInterview from "./pages/TechnicalInterview.jsx";
import Aptitude from "./pages/Aptitude.jsx";
import Communication from "./pages/Communication.jsx";
import ResumeUpload from "./pages/ResumeUpload.jsx";
import ResumeInterview from "./pages/ResumeInterview.jsx";
import SkillGap from "./pages/SkillGap.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import InterviewResult from "./pages/InterviewResult.jsx";
import NotFound from "./pages/NotFound.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import TopicPractice from "./pages/TopicPractice.jsx";
import PracticeResult from "./pages/PracticeResult.jsx";
import LearningHub from "./pages/LearningHub.jsx";
import Reassessment from "./pages/Reassessment.jsx";
import ReassessmentResult from "./pages/ReassessmentResult.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/:id"
            element={
              <ProtectedRoute>
                <ReportDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr"
            element={
              <ProtectedRoute>
                <HRInterview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/technical"
            element={
              <ProtectedRoute>
                <TechnicalInterview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/aptitude"
            element={
              <ProtectedRoute>
                <Aptitude />
              </ProtectedRoute>
            }
          />

          <Route
            path="/communication"
            element={
              <ProtectedRoute>
                <Communication />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumeUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-upload"
            element={
              <ProtectedRoute>
                <ResumeUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume-interview"
            element={
              <ProtectedRoute>
                <ResumeInterview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/skill-gap"
            element={
              <ProtectedRoute>
                <SkillGap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learning"
            element={
              <ProtectedRoute>
                <LearningHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice/:topic"
            element={
              <ProtectedRoute>
                <TopicPractice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice-result/:id"
            element={
              <ProtectedRoute>
                <PracticeResult />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reassess/:topic"
            element={
              <ProtectedRoute>
                <Reassessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reassessment-result/:id"
            element={
              <ProtectedRoute>
                <ReassessmentResult />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <InterviewResult />
              </ProtectedRoute>
            }
          />

          {/* Catch-All */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;