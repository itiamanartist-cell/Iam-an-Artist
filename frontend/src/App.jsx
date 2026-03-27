import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminContent from './pages/Admin/Content';
import AdminCategories from './pages/Admin/Categories';
import AdminAnalytics from './pages/Admin/Analytics';
import TeacherDashboard from './pages/Teacher/Dashboard';
import TeacherViewer from './pages/Teacher/Viewer';
import StudentDashboard from './pages/Student/Dashboard';
import StudentViewer from './pages/Student/Viewer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/viewer/:id" element={<TeacherViewer />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Student', 'Admin']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/viewer/:id" element={<StudentViewer />} />
        </Route>

        {/* Home redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
