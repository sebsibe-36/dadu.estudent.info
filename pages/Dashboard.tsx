import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_COURSES, MOCK_ANNOUNCEMENTS, MOCK_ASSIGNMENTS, MOCK_USERS, MOCK_ATTENDANCE, getCoursesForUser } from '../services/mockDb';
import { Role, AttendanceRecord } from '../types';
import { 
  Bell, Book, Clock, TrendingUp, Users, 
  CheckCircle, AlertCircle, FileText, 
  Plus, Settings, Shield, GraduationCap,
  Calendar, Search, BarChart3, X,
  ChevronLeft, ChevronRight, Save, CalendarCheck
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : 'hover:shadow-md'}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
  </div>
);

const AnnouncementsSidebar = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden h-fit">
    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
      <Bell size={20} className="text-slate-400" />
      <h2 className="font-bold text-slate-800 dark:text-white">Announcements</h2>
    </div>
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
      {MOCK_ANNOUNCEMENTS.map((ann) => (
        <div key={ann.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 block">{ann.date}</span>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{ann.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{ann.content}</p>
        </div>
      ))}
    </div>
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-100 dark:border-slate-700">
      <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</button>
    </div>
  </div>
);

const StudentDashboard = ({ user }: { user: any }) => {
  // Fetch only enrolled courses
  const myCourses = getCoursesForUser(user);
  const upcomingAssignments = MOCK_ASSIGNMENTS.filter(a => myCourses.some(c => c.id === a.courseId));
  const [showAttendance, setShowAttendance] = useState(false);

  // Calculate attendance percentage (mock calculation based on global mock data)
  const myAttendanceRecords = MOCK_ATTENDANCE.filter(a => a.studentId === user.id);
  const totalSessions = Math.max(myAttendanceRecords.length, 1); // Avoid divide by zero
  const presentSessions = myAttendanceRecords.filter(a => a.status === 'PRESENT').length;
  const attendanceRate = Math.round((presentSessions / totalSessions) * 100);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Active Courses" value={myCourses.length} icon={Book} color="bg-blue-600" />
          <StatCard title="Assignments Due" value={upcomingAssignments.length} icon={Clock} color="bg-amber-500" />
          <StatCard title="Average GPA" value="3.8" icon={TrendingUp} color="bg-emerald-500" />
          <StatCard 
            title="Attendance Rate" 
            value={`${attendanceRate}%`} 
            icon={Users} 
            color="bg-purple-500" 
            onClick={() => setShowAttendance(true)}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Schedule */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 dark:text-white">Today's Schedule</h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View Full</button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {myCourses.length > 0 ? myCourses.slice(0, 3).map((course) => (
                <div key={course.id} className="p-6 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <div className="w-16 text-center">
                    <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{course.schedule.split(' ')[0]}</span>
                    <span className="block text-lg font-bold text-slate-800 dark:text-white">{course.schedule.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{course.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{course.code} • Room 304</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">On Time</span>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No enrolled courses. Go to <a href="#/courses" className="text-blue-600 hover:underline">Courses</a> to enroll.
                </div>
              )}
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white">Upcoming Assignments</h2>
            </div>
            <div className="p-6">
              {upcomingAssignments.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingAssignments.map(a => (
                     <li key={a.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <div>
                            <p className="text-slate-700 dark:text-slate-200 font-medium text-sm">{a.title}</p>
                            <p className="text-xs text-slate-400">{MOCK_COURSES.find(c => c.id === a.courseId)?.code}</p>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Due {a.dueDate}</span>
                     </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm text-center">No upcoming assignments.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AnnouncementsSidebar />
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-4">Ask Dadu, our AI assistant, about your schedule, grades, or course materials.</p>
            <a href="#/assistant" className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">Chat with Dadu</a>
          </div>
        </div>
      </div>

      {/* Student Attendance Modal */}
      {showAttendance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAttendance(false)}>
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-750">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Attendance History</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your presence in all classes.</p>
              </div>
              <button 
                onClick={() => setShowAttendance(false)} 
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors text-slate-500 dark:text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 custom-scrollbar">
              {myCourses.map(course => {
                const courseRecords = myAttendanceRecords.filter(r => r.courseId === course.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const courseTotal = courseRecords.length;
                const coursePresent = courseRecords.filter(r => r.status === 'PRESENT').length;
                const courseRate = courseTotal > 0 ? Math.round((coursePresent / courseTotal) * 100) : 100;
                
                return (
                  <div key={course.id} className="mb-6 last:mb-0 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-750 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">{course.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{course.code}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{coursePresent}/{courseTotal} Sessions</span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-md ${courseRate >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : courseRate >= 75 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {courseRate}%
                        </span>
                      </div>
                    </div>
                    <div className="p-0">
                      {courseRecords.length > 0 ? (
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                             <tr>
                               <th className="px-4 py-2 text-xs text-slate-500 font-medium">Date</th>
                               <th className="px-4 py-2 text-xs text-slate-500 font-medium">Status</th>
                               <th className="px-4 py-2 text-xs text-slate-500 font-medium text-right">Type</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                             {courseRecords.map(record => (
                               <tr key={record.id}>
                                 <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{record.date}</td>
                                 <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium
                                      ${record.status === 'PRESENT' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 
                                        record.status === 'ABSENT' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                        record.status === 'LATE' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                                        'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                      }`}>
                                      {record.status === 'PRESENT' && <CheckCircle size={12} />}
                                      {record.status === 'ABSENT' && <AlertCircle size={12} />}
                                      {record.status === 'LATE' && <Clock size={12} />}
                                      {record.status}
                                    </span>
                                 </td>
                                 <td className="px-4 py-3 text-right text-slate-500 text-xs">Lecture</td>
                               </tr>
                             ))}
                           </tbody>
                        </table>
                      ) : (
                        <div className="p-4 text-center text-slate-400 text-sm">No attendance records yet.</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const InstructorDashboard = ({ user }: { user: any }) => {
  const myCourses = MOCK_COURSES.filter(c => c.instructorId === user.id);
  const [selectedCourseForRoster, setSelectedCourseForRoster] = useState<string | null>(null);
  const [rosterViewMode, setRosterViewMode] = useState<'list' | 'attendance'>('list');
  
  // Attendance State
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [localAttendance, setLocalAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  
  // Mock: All students enrolled in every course for demo purposes
  const enrolledStudents = MOCK_USERS.filter(u => u.role === Role.STUDENT);
  const selectedCourse = MOCK_COURSES.find(c => c.id === selectedCourseForRoster);

  const getStatusForStudent = (studentId: string, courseId: string, date: string) => {
    return localAttendance.find(
      r => r.studentId === studentId && r.courseId === courseId && r.date === date
    )?.status || null;
  };

  const handleMarkAttendance = (studentId: string, status: AttendanceRecord['status']) => {
    if (!selectedCourse) return;

    setLocalAttendance(prev => {
      const existingIndex = prev.findIndex(
        r => r.studentId === studentId && r.courseId === selectedCourse.id && r.date === attendanceDate
      );

      const newRecord: AttendanceRecord = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `new-${Date.now()}-${studentId}`,
        studentId,
        courseId: selectedCourse.id,
        date: attendanceDate,
        status
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newRecord;
        return updated;
      } else {
        return [...prev, newRecord];
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Courses Taught" value={myCourses.length} icon={GraduationCap} color="bg-blue-600" />
          <StatCard title="Total Students" value={enrolledStudents.length * myCourses.length} icon={Users} color="bg-emerald-500" />
          <StatCard title="Pending Grades" value="12" icon={FileText} color="bg-amber-500" />
          <StatCard title="Office Hours" value="2:00 PM" icon={Clock} color="bg-purple-500" />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Teaching Schedule / My Courses */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
               <h2 className="font-bold text-slate-800 dark:text-white">My Courses</h2>
               <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 rounded-lg transition-colors">
                 <Plus size={16} />
                 New Course
               </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {myCourses.map((course) => (
                <div key={course.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                       <h3 className="font-bold text-slate-800 dark:text-white text-lg">{course.title}</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400">{course.code} • {course.schedule}</p>
                     </div>
                     <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                       Active
                     </span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => { setSelectedCourseForRoster(course.id); setRosterViewMode('list'); }}
                      className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      View Roster
                    </button>
                    <button 
                      onClick={() => { setSelectedCourseForRoster(course.id); setRosterViewMode('attendance'); }}
                      className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      Attendance
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                      Gradebook
                    </button>
                  </div>
                </div>
              ))}
              {myCourses.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  You are not assigned to any courses yet.
                </div>
              )}
            </div>
          </div>

          {/* Recent Submissions to Grade */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white">Recent Submissions</h2>
            </div>
            <div className="p-6">
               <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50 mb-4">
                 <AlertCircle className="text-amber-600 dark:text-amber-500" size={20} />
                 <div className="flex-1">
                   <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">Grades Due Soon</h4>
                   <p className="text-xs text-amber-700 dark:text-amber-500/80">Midterm grades for CS101 are due in 2 days.</p>
                 </div>
                 <button className="text-xs font-bold bg-amber-200 text-amber-800 dark:bg-amber-600 dark:text-white px-3 py-1.5 rounded hover:bg-amber-300 dark:hover:bg-amber-500 transition-colors">
                   Start Grading
                 </button>
               </div>
               
               <div className="space-y-3">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-200">
                          S{i}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Student Name {i}</p>
                          <p className="text-xs text-slate-400">Assignment: Python Basics</p>
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Grade</button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AnnouncementsSidebar />
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
             <div className="p-6 border-b border-slate-100 dark:border-slate-700">
               <h2 className="font-bold text-slate-800 dark:text-white">Quick Actions</h2>
             </div>
             <div className="p-4 space-y-2">
               <button className="w-full flex items-center gap-3 p-3 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                 <Plus size={18} />
                 <span>Create Assignment</span>
               </button>
               <button className="w-full flex items-center gap-3 p-3 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                 <Bell size={18} />
                 <span>Post Announcement</span>
               </button>
               <button className="w-full flex items-center gap-3 p-3 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                 <Calendar size={18} />
                 <span>Schedule Office Hours</span>
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Roster / Attendance Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedCourseForRoster(null)}>
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
               <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-750">
                 <div>
                   <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selectedCourse.title}</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400">{selectedCourse.code}</p>
                 </div>
                 <button 
                   onClick={() => setSelectedCourseForRoster(null)} 
                   className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors text-slate-500 dark:text-slate-400"
                 >
                   <X size={24} />
                 </button>
               </div>

               {/* Tabs */}
               <div className="flex border-b border-slate-100 dark:border-slate-700 px-6">
                  <button 
                    onClick={() => setRosterViewMode('list')}
                    className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${rosterViewMode === 'list' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                    Class List
                  </button>
                  <button 
                    onClick={() => setRosterViewMode('attendance')}
                    className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${rosterViewMode === 'attendance' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                    Take Attendance
                  </button>
               </div>
               
               <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                 {rosterViewMode === 'list' ? (
                   // Existing Roster View
                   enrolledStudents.length > 0 ? (
                     <table className="w-full text-left border-collapse">
                       <thead className="bg-slate-50 dark:bg-slate-750 sticky top-0 z-10 shadow-sm">
                         <tr>
                           <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">Student</th>
                           <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">Email</th>
                           <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">Status</th>
                           <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-right">Actions</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                         {enrolledStudents.map(student => (
                           <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors group">
                             <td className="p-4">
                               <div className="flex items-center gap-3">
                                 <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600 shadow-sm" />
                                 <div>
                                   <span className="block font-medium text-slate-800 dark:text-slate-200">{student.name}</span>
                                   <span className="block text-xs text-slate-400">ID: {student.id.toUpperCase()}</span>
                                 </div>
                               </div>
                             </td>
                             <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{student.email}</td>
                             <td className="p-4">
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900">
                                 Active
                               </span>
                             </td>
                             <td className="p-4 text-right">
                               <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                 View Profile
                               </button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   ) : (
                     <div className="p-12 text-center text-slate-500">
                       No students enrolled in this course yet.
                     </div>
                   )
                 ) : (
                   // Attendance View
                   <div className="p-6">
                     <div className="flex items-center justify-between mb-6 bg-slate-50 dark:bg-slate-750 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                            <CalendarCheck className="text-blue-600 dark:text-blue-400" size={20} />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Session Date</label>
                           <input 
                             type="date" 
                             value={attendanceDate}
                             onChange={(e) => setAttendanceDate(e.target.value)}
                             className="bg-transparent font-bold text-slate-800 dark:text-white focus:outline-none"
                           />
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="text-xs text-slate-500 dark:text-slate-400">Total Enrolled</span>
                         <p className="font-bold text-slate-800 dark:text-white">{enrolledStudents.length} Students</p>
                       </div>
                     </div>

                     <div className="space-y-3">
                       {enrolledStudents.map(student => {
                         const status = getStatusForStudent(student.id, selectedCourse.id, attendanceDate);
                         return (
                           <div key={student.id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                             <div className="flex items-center gap-3">
                               <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                               <div>
                                 <p className="font-bold text-slate-800 dark:text-white">{student.name}</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">ID: {student.id.toUpperCase()}</p>
                               </div>
                             </div>
                             <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 gap-1">
                               {[
                                 { val: 'PRESENT', label: 'P', color: 'bg-green-500 text-white', icon: CheckCircle },
                                 { val: 'ABSENT', label: 'A', color: 'bg-red-500 text-white', icon: X },
                                 { val: 'LATE', label: 'L', color: 'bg-amber-500 text-white', icon: Clock },
                                 { val: 'EXCUSED', label: 'E', color: 'bg-blue-500 text-white', icon: AlertCircle },
                               ].map((opt) => (
                                 <button
                                   key={opt.val}
                                   onClick={() => handleMarkAttendance(student.id, opt.val as any)}
                                   className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition-all ${
                                     status === opt.val 
                                       ? opt.color + ' shadow-sm'
                                       : 'hover:bg-white dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400'
                                   }`}
                                   title={opt.val}
                                 >
                                   {opt.label}
                                 </button>
                               ))}
                             </div>
                           </div>
                         );
                       })}
                     </div>
                     <div className="mt-6 flex justify-end">
                        <button 
                          onClick={() => setSelectedCourseForRoster(null)}
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                        >
                          <Save size={18} />
                          Save Attendance
                        </button>
                     </div>
                   </div>
                 )}
               </div>
               
               {rosterViewMode === 'list' && (
                 <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 flex justify-between items-center">
                   <p className="text-xs text-slate-500 dark:text-slate-400">Showing {enrolledStudents.length} enrolled students</p>
                   <button 
                     onClick={() => setSelectedCourseForRoster(null)}
                     className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                   >
                     Close
                   </button>
                 </div>
               )}
          </div>
        </div>
      )}
    </>
  );
};

const AdminDashboard = ({ user }: { user: any }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={MOCK_USERS.length} icon={Users} color="bg-blue-600" />
        <StatCard title="Active Courses" value={MOCK_COURSES.length} icon={Book} color="bg-purple-500" />
        <StatCard title="System Status" value="Healthy" icon={CheckCircle} color="bg-emerald-500" />
        <StatCard title="Pending Approvals" value="3" icon={Shield} color="bg-amber-500" />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
           <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
             <h2 className="font-bold text-slate-800 dark:text-white">System Activity</h2>
             <div className="flex gap-2">
               <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Search size={18}/></button>
               <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Settings size={18}/></button>
             </div>
           </div>
           <div className="p-6">
              <div className="h-48 bg-slate-50 dark:bg-slate-750 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6">
                <div className="text-center text-slate-400 dark:text-slate-500">
                  <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Activity Chart Placeholder</p>
                </div>
              </div>
              
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Recent Logs</h3>
              <div className="space-y-4">
                 {[
                   { action: 'New User Registration', user: 'john.doe@dadu.edu', time: '2 mins ago' },
                   { action: 'Course Created', user: 'Dr. Smith (Instructor)', time: '15 mins ago' },
                   { action: 'System Backup', user: 'System', time: '1 hour ago' },
                 ].map((log, i) => (
                   <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-700 pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">{log.action}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{log.user}</p>
                      </div>
                      <span className="text-slate-400 text-xs">{log.time}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
           <div className="p-6 border-b border-slate-100 dark:border-slate-700">
             <h2 className="font-bold text-slate-800 dark:text-white">Admin Actions</h2>
           </div>
           <div className="p-4 grid grid-cols-2 gap-3">
             <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-750 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
               <Users size={24} />
               <span className="text-xs font-bold">Manage Users</span>
             </button>
             <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-750 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
               <Book size={24} />
               <span className="text-xs font-bold">Manage Courses</span>
             </button>
             <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-750 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
               <Settings size={24} />
               <span className="text-xs font-bold">Settings</span>
             </button>
             <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-750 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
               <Shield size={24} />
               <span className="text-xs font-bold">Security</span>
             </button>
           </div>
        </div>
        <AnnouncementsSidebar />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {user.role === Role.STUDENT && "Here's what's happening in your academic life today."}
            {user.role === Role.INSTRUCTOR && "Here is your teaching overview for today."}
            {user.role === Role.ADMIN && "System overview and management dashboard."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </header>

      {user.role === Role.STUDENT && <StudentDashboard user={user} />}
      {user.role === Role.INSTRUCTOR && <InstructorDashboard user={user} />}
      {user.role === Role.ADMIN && <AdminDashboard user={user} />}
    </div>
  );
};

export default Dashboard;