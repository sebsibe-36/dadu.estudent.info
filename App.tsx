import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import GeminiAssistant from './components/GeminiAssistant';

// Layout wrapper for authenticated routes
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen custom-scrollbar">
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      <Route path="/*" element={
        <ProtectedLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/assistant" element={<GeminiAssistant />} />
            {/* Placeholders for other routes */}
            <Route path="/schedule" element={<div className="p-10 text-center text-slate-500 dark:text-slate-400">Schedule View Placeholder</div>} />
            <Route path="/grades" element={<div className="p-10 text-center text-slate-500 dark:text-slate-400">Grades View Placeholder</div>} />
            <Route path="/settings" element={<div className="p-10 text-center text-slate-500 dark:text-slate-400">Settings View Placeholder</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProtectedLayout>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;