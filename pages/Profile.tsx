import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getCoursesForUser } from '../services/mockDb';
import { Mail, Shield, MapPin, Phone, Edit } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  if (!user) return null;

  const courses = getCoursesForUser(user);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
      
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col sm:flex-row justify-between items-end sm:items-end -mt-12 mb-6 gap-4">
             <div className="flex items-end gap-6">
               <img 
                 src={user.avatar} 
                 alt={user.name} 
                 className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-md bg-white" 
               />
               <div className="mb-2 hidden sm:block">
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                 <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400">
                   <Shield size={16} />
                   <span className="capitalize font-medium">{user.role.toLowerCase()}</span>
                   <span>•</span>
                   <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">ID: {user.id.toUpperCase()}</span>
                 </div>
               </div>
             </div>
             <button className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm flex items-center justify-center gap-2">
               <Edit size={16} />
               Edit Profile
             </button>
          </div>
          
          <div className="sm:hidden mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400">
              <Shield size={16} />
              <span className="capitalize">{user.role.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-lg border-b border-slate-100 dark:border-slate-700 pb-2">About</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 break-all">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Location</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Campus Dorm A, Room 101</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bio Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">Bio</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Passionate about technology and history. Always eager to learn new things and collaborate on projects. Member of the Robotics Club and Debate Team.
            </p>
          </div>
        </div>

        {/* Right Column - Activity/Courses */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
             <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  {user.role === 'INSTRUCTOR' ? 'Teaching Schedule' : 'Current Enrollment'}
                </h3>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                  {courses.length} Courses
                </span>
             </div>
             
             <div className="space-y-4">
               {courses.length > 0 ? courses.map(course => (
                 <div key={course.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all group">
                   <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                     {course.code.split(' ')[0].slice(0, 3)}
                   </div>
                   <div className="flex-1">
                     <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{course.title}</h4>
                     <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                       <span className="font-mono font-medium bg-slate-100 dark:bg-slate-700 px-1.5 rounded">{course.code}</span>
                       <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          {course.schedule}
                       </span>
                       <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          {course.credits} Credits
                       </span>
                     </div>
                   </div>
                   <div className="sm:text-right pl-16 sm:pl-0">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       Active
                     </span>
                   </div>
                 </div>
               )) : (
                 <div className="text-center py-8 bg-slate-50 dark:bg-slate-750 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                   <p className="text-slate-500 text-sm">No courses found associated with this profile.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;