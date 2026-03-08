import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobListings from './pages/JobListings';
import StudentProfile from './pages/StudentProfile';
import ApplicationTracking from './pages/ApplicationTracking';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterProfile from './pages/RecruiterProfile';
import PostJob from './pages/PostJob';
import ViewApplicants from './pages/ViewApplicants';
import AdminDashboard from './pages/AdminDashboard';
import JobDetails from './pages/JobDetails';
import ResumeBuilder from './pages/ResumeBuilder';
import { AuthContext } from './context/AuthContext';

// Basic Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobs" element={<JobListings />} />

            {/* Student Routes */}
            <Route path="/profile" element={
              <ProtectedRoute allowedRole="student">
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute allowedRole="student">
                <ApplicationTracking />
              </ProtectedRoute>
            } />
            <Route path="/resume-builder" element={
              <ProtectedRoute allowedRole="student">
                <ResumeBuilder />
              </ProtectedRoute>
            } />
            <Route path="/job/:id" element={<JobDetails />} />

            {/* Recruiter Routes */}
            <Route path="/recruiter-dashboard" element={
              <ProtectedRoute allowedRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            } />
            <Route path="/recruiter-profile" element={
              <ProtectedRoute allowedRole="recruiter">
                <RecruiterProfile />
              </ProtectedRoute>
            } />
            <Route path="/post-job" element={
              <ProtectedRoute allowedRole="recruiter">
                <PostJob />
              </ProtectedRoute>
            } />
            <Route path="/edit-job/:id" element={
              <ProtectedRoute allowedRole="recruiter">
                <PostJob />
              </ProtectedRoute>
            } />
            <Route path="/job/:id/applicants" element={
              <ProtectedRoute allowedRole="recruiter">
                <ViewApplicants />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={
              <div className="text-center py-32">
                <h1 className="text-4xl font-bold mb-4 dark:text-white">404 - Not Found</h1>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8 text-center text-gray-500 dark:text-gray-400">
          <p>© 2026 CampusConnect. Hackathon Demo Project.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
