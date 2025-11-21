import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS } from '../services/mockDb';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
  enrollInCourse: (courseId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Simulate session persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('dadu_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, role: Role) => {
    // Simple mock login based on email/role match or just demo users
    // For the demo, we'll just force pick a user based on the role selected
    const mockUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setUser(mockUser);
    localStorage.setItem('dadu_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dadu_user');
  };

  const enrollInCourse = (courseId: string) => {
    if (!user) return;
    // Avoid duplicates
    if (user.enrolledCourseIds?.includes(courseId)) return;

    const updatedUser = {
      ...user,
      enrolledCourseIds: [...(user.enrolledCourseIds || []), courseId]
    };

    setUser(updatedUser);
    localStorage.setItem('dadu_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, enrollInCourse, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};