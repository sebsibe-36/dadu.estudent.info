import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(Role.STUDENT);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd validate password here.
    login(email, selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
        <div className="bg-blue-600 dark:bg-blue-700 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <span className="text-3xl font-bold text-white">D</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to Dadu</h1>
          <p className="text-blue-100 mt-2">Student Information System</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Role (Demo Mode)</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(Role).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedRole === role
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter any email for demo"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="password"
                  value="password"
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-500 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <span>Sign In</span>
              <ArrowRight size={18} />
            </button>
          </form>
          
          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            Demo Environment. No real authentication required. <br/>
            Select a role and click Sign In.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;