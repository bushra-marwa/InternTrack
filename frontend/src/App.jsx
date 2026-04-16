import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitReport from './pages/student/SubmitReport';
import UploadReport from './pages/student/UploadReport';
import MyReports from './pages/student/MyReports';
import MyScorecard from './pages/student/MyScorecard';
import MyInternship from './pages/student/MyInternship';
import PostInternship from './pages/student/PostInternship'
import SubmitInternship from './pages/student/SubmitInternship';

// Mentor
import MentorDashboard from './pages/mentor/MentorDashboard';
import MyStudents from './pages/mentor/MyStudents';
import StudentReports from './pages/mentor/StudentReports';
import EvaluateStudents from './pages/mentor/EvaluateStudents';
//import AttendanceView from './pages/mentor/AttendanceView';
import ReviewReports from './pages/mentor/ReviewReports';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AllStudents from './pages/admin/AllStudents';
import AllReports from './pages/admin/AllReports';
import InternshipRequests from './pages/admin/InternshipRequests'
//import GenerateScorecard from './pages/admin/GenerateScorecard';
//import MarkAttendance from './pages/admin/MarkAttendance';
import AllotMentors from './pages/admin/AllotMentors';

// Role → Dashboard
function DashboardRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'student') return <StudentDashboard />;
  if (user.role === 'mentor') return <MentorDashboard />;
  return <AdminDashboard />;
}

// Role → Reports
function ReportsRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'student') return <MyReports />;
  if (user.role === 'mentor') return <StudentReports />;
  return <AllReports />;
}

// Protected wrapper with layout
function AppLayout({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" />;
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-[#07071a]">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a30', color: '#e8e8f0', border: '1px solid rgba(108,99,255,.3)' }
        }} />
        <div className="min-h-screen bg-[#07071a]">
          <Header />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Shared — role decides content */}
            <Route path="/dashboard" element={<AppLayout><DashboardRoute /></AppLayout>} />
            <Route path="/reports"   element={<AppLayout><ReportsRoute /></AppLayout>} />
            <Route path="/students" element={ <AppLayout allowedRoles={['admin']}><AllStudents /></AppLayout>
  } 
/>
            {/* Student only */}
            <Route path="/upload-report"  element={<AppLayout allowedRoles={['student']}><UploadReport /></AppLayout>} />
            <Route path="/submit-report"  element={<AppLayout allowedRoles={['student']}><SubmitReport /></AppLayout>} />
            <Route path="/my-scorecard"   element={<AppLayout allowedRoles={['student']}><MyScorecard /></AppLayout>} />
            <Route path="/my-internship"  element={<AppLayout allowedRoles={['student']}><MyInternship /></AppLayout>} />
            <Route path="/post-internship" element={<AppLayout allowedRoles={['student']}><PostInternship /></AppLayout>} />
            <Route path="/submit-internship" element={<SubmitInternship />} />
            {/* Mentor only */}
            <Route path="/evaluate"        element={<AppLayout allowedRoles={['mentor']}><EvaluateStudents /></AppLayout>} />
            <Route path="/mentor/reports" element={<ReviewReports />} />

            {/* Admin only */}
            <Route path="/internship-requests" element={<AppLayout allowedRoles={['admin']}><InternshipRequests /></AppLayout>} />
            <Route path="/allot-mentors" element={<AppLayout allowedRoles={['admin']}><AllotMentors /></AppLayout>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
      </AuthProvider>
  );
}