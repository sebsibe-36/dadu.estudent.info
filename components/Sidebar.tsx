import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Role } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Users, 
  Settings, 
  LogOut,
  MessageSquare,
  Moon,
  Sun
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => `
    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
    ${isActive(path) 
      ? 'bg-blue-600 text-white shadow-md' 
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
    }
  `;

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col h-screen sticky top-0 transition-colors duration-200">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">D</div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Dadu SIS</h1>
      </div>

      <div className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        
        <button onClick={() => navigate('/')} className={linkClass('/')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button onClick={() => navigate('/courses')} className={linkClass('/courses')}>
          <BookOpen size={20} />
          <span>Courses</span>
        </button>

        <button onClick={() => navigate('/schedule')} className={linkClass('/schedule')}>
          <Calendar size={20} />
          <span>Timetable</span>
        </button>

        <button onClick={() => navigate('/grades')} className={linkClass('/grades')}>
          <GraduationCap size={20} />
          <span>Grades & Assignments</span>
        </button>

        {user.role === Role.ADMIN && (
          <button onClick={() => navigate('/users')} className={linkClass('/users')}>
            <Users size={20} />
            <span>User Management</span>
          </button>
        )}

        <div className="px-4 py-2 mt-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Tools
        </div>

        <button onClick={() => navigate('/assistant')} className={linkClass('/assistant')}>
          <MessageSquare size={20} />
          <span>AI Assistant</span>
        </button>
        
        <button onClick={() => navigate('/settings')} className={linkClass('/settings')}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2 mb-4 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 px-4 py-2 mb-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors group"
        >
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600 group-hover:border-blue-400 transition-colors" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;