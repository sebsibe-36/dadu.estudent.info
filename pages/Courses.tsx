import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_COURSES } from '../services/mockDb';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Clock, User, CreditCard, ChevronRight, CheckCircle, PlusCircle } from 'lucide-react';

const Courses = () => {
  const navigate = useNavigate();
  const { user, enrollInCourse } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Courses</h1>
          <p className="text-slate-500 dark:text-slate-400">View course catalog and details.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors">
          Course Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_COURSES.map((course) => {
          const isEnrolled = user?.enrolledCourseIds?.includes(course.id);
          const isStudent = user?.role === Role.STUDENT;

          return (
            <div 
              key={course.id} 
              onClick={() => navigate(`/courses/${course.id}`)}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              <div className="h-32 bg-slate-200 dark:bg-slate-700 relative flex-shrink-0">
                 <img src={`https://picsum.photos/seed/${course.code}/600/300`} alt={course.title} className="w-full h-full object-cover opacity-90" />
                 <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-md text-xs font-bold text-slate-900 dark:text-white shadow-sm">
                   {course.code}
                 </div>
                 {isEnrolled && (
                   <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                     <CheckCircle size={12} />
                     Enrolled
                   </div>
                 )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{course.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{course.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                     <User size={16} className="text-slate-400" />
                     <span>Instructor ID: {course.instructorId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                     <Clock size={16} className="text-slate-400" />
                     <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                     <CreditCard size={16} className="text-slate-400" />
                     <span>{course.credits} Credits</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button className="flex-1 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                    Details
                  </button>
                  
                  {isStudent && !isEnrolled && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        enrollInCourse(course.id);
                      }}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={16} />
                      Enroll
                    </button>
                  )}
                  
                  {isStudent && isEnrolled && (
                    <button 
                      disabled
                      className="flex-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900 rounded-lg text-sm font-bold cursor-default flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Enrolled
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;