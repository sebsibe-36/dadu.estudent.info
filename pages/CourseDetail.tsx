import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { 
  MOCK_COURSES, 
  MOCK_USERS, 
  MOCK_ASSIGNMENTS, 
  MOCK_GRADES, 
  MOCK_SUBMISSIONS,
  updateGrade,
  submitAssignment
} from '../services/mockDb';
import { useAuth } from '../context/AuthContext';
import { Role, Grade } from '../types';
import { 
  Clock, User, CreditCard, ArrowLeft, Calendar, 
  FileText, BookOpen, GraduationCap, Save, Upload, CheckCircle, ChevronDown, ChevronUp, File
} from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, enrollInCourse } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'gradebook'>('overview');
  // Local state to trigger re-renders when grades update
  const [grades, setGrades] = useState<Grade[]>(MOCK_GRADES);
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const course = MOCK_COURSES.find(c => c.id === courseId);
  
  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const instructor = MOCK_USERS.find(u => u.id === course.instructorId);
  const isInstructor = user?.role === Role.INSTRUCTOR && course.instructorId === user.id;
  const isStudent = user?.role === Role.STUDENT;
  const isEnrolled = user?.enrolledCourseIds?.includes(course.id);

  // Data for Gradebook / Assignments
  const courseAssignments = MOCK_ASSIGNMENTS.filter(a => a.courseId === course.id);
  const enrolledStudents = MOCK_USERS.filter(u => 
    u.role === Role.STUDENT && u.enrolledCourseIds?.includes(course.id)
  );

  const handleGradeChange = (studentId: string, assignmentId: string, value: string) => {
    const points = parseInt(value);
    if (isNaN(points)) return;
    
    updateGrade(studentId, assignmentId, points);
    // Force update local state to reflect changes
    setGrades([...MOCK_GRADES]); 
  };

  const getGrade = (studentId: string, assignmentId: string) => {
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId)?.points ?? '';
  };

  const toggleAssignment = (id: string) => {
    if (expandedAssignmentId === id) {
      setExpandedAssignmentId(null);
      setSelectedFile(null);
      setSuccessMsg(null);
    } else {
      setExpandedAssignmentId(id);
      setSelectedFile(null);
      setSuccessMsg(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (assignmentId: string) => {
    if (!user || !selectedFile) return;
    
    submitAssignment(user.id, assignmentId, selectedFile.name);
    setSubmissions([...MOCK_SUBMISSIONS]);
    setSuccessMsg(`Successfully submitted ${selectedFile.name}`);
    setSelectedFile(null);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <button 
        onClick={() => navigate('/courses')}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Courses
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header Section */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
           <div className="absolute inset-0 bg-black/10"></div>
           <div className="absolute bottom-0 left-0 p-8 text-white relative z-10 w-full">
             <div className="flex justify-between items-end">
               <div>
                 <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold mb-2 border border-white/10">
                   {course.code}
                 </span>
                 <h1 className="text-3xl font-bold">{course.title}</h1>
               </div>
               {isStudent && !isEnrolled && (
                  <button 
                    onClick={() => enrollInCourse(course.id)}
                    className="px-6 py-2 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
                  >
                    Enroll Now
                  </button>
               )}
               {isStudent && isEnrolled && (
                  <div className="px-4 py-2 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-white font-bold rounded-lg">
                    Enrolled
                  </div>
               )}
             </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen size={18} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'assignments' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <FileText size={18} />
            Assignments
          </button>
          {(isInstructor || user?.role === Role.ADMIN) && (
            <button
              onClick={() => setActiveTab('gradebook')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'gradebook' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap size={18} />
              Gradebook
            </button>
          )}
        </div>
        
        {/* Tab Content */}
        <div className="p-8 min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Course Description</h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {course.description}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                     In this course, students will explore fundamental concepts and practical applications related to {course.title}. 
                     Through a combination of lectures, hands-on exercises, and collaborative projects, participants will gain a deep understanding of the subject matter.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Syllabus</h2>
                  <div className="space-y-3">
                    {['Introduction & Fundamentals', 'Core Methodologies', 'Advanced Topics', 'Final Project'].map((week, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-800 dark:text-white text-sm">Module {i + 1}</h4>
                           <p className="text-slate-500 dark:text-slate-400 text-sm">{week}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-750 rounded-xl p-6 border border-slate-100 dark:border-slate-700 space-y-5">
                  <h3 className="font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3">Course Details</h3>
                  
                  <div className="flex items-start gap-3">
                    <User className="text-slate-400 dark:text-slate-500 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Instructor</p>
                      <div className="flex items-center gap-2 mt-1">
                        {instructor ? (
                          <>
                            <img src={instructor.avatar} alt={instructor.name} className="w-6 h-6 rounded-full object-cover" />
                            <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">{instructor.name}</p>
                          </>
                        ) : (
                          <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">Not Assigned</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-slate-400 dark:text-slate-500 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Schedule</p>
                      <p className="font-medium text-slate-700 dark:text-slate-200 text-sm mt-1">{course.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="text-slate-400 dark:text-slate-500 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Credits</p>
                      <p className="font-medium text-slate-700 dark:text-slate-200 text-sm mt-1">{course.credits} Units</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                     <Calendar className="text-slate-400 dark:text-slate-500 mt-0.5" size={18} />
                     <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Term</p>
                        <p className="font-medium text-slate-700 dark:text-slate-200 text-sm mt-1">Fall 2023</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Course Assignments</h2>
                  {isInstructor && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                      + New Assignment
                    </button>
                  )}
                </div>
                
                {courseAssignments.length > 0 ? (
                  <div className="grid gap-4">
                    {courseAssignments.map(assign => {
                      const isExpanded = expandedAssignmentId === assign.id;
                      const mySubmission = user ? submissions.find(s => s.studentId === user.id && s.assignmentId === assign.id) : null;
                      
                      return (
                        <div key={assign.id} className="bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow overflow-hidden">
                          <div 
                            className="flex items-center justify-between p-4 cursor-pointer"
                            onClick={() => toggleAssignment(assign.id)}
                          >
                             <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-lg transition-colors ${mySubmission ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                 {mySubmission ? <CheckCircle size={24} /> : <FileText size={24} />}
                               </div>
                               <div>
                                 <h3 className="font-bold text-slate-800 dark:text-white">{assign.title}</h3>
                                 <p className="text-sm text-slate-500 dark:text-slate-400">Due: {assign.dueDate} • {assign.maxPoints} Points</p>
                               </div>
                             </div>
                             <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                               {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                             </button>
                          </div>
                          
                          {isExpanded && (
                            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                              <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Instructions</h4>
                                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Please complete the assignment according to the syllabus guidelines. Ensure your code is well-documented and test cases are included. Upload your solution as a single file (PDF or ZIP).
                                  </p>
                                  
                                  {isInstructor && (
                                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Instructor View</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {submissions.filter(s => s.assignmentId === assign.id).length} students have submitted this assignment.
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                {isStudent && isEnrolled && (
                                  <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-700 rounded-xl p-5 border border-slate-100 dark:border-slate-600">
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Submission</h4>
                                    
                                    {mySubmission ? (
                                      <div className="text-center py-6">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                          <CheckCircle size={24} />
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white">Submitted!</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                          {new Date(mySubmission.submittedAt).toLocaleDateString()} at {new Date(mySubmission.submittedAt).toLocaleTimeString()}
                                        </p>
                                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-2 px-3 rounded-lg">
                                          <File size={14} />
                                          <span className="truncate max-w-[150px]">{mySubmission.fileName}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer relative">
                                          <input 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                          />
                                          <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            {selectedFile ? selectedFile.name : "Click to upload file"}
                                          </p>
                                        </div>
                                        
                                        {successMsg && (
                                          <div className="text-xs text-center font-bold text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-top-2">
                                            {successMsg}
                                          </div>
                                        )}
                                        
                                        <button 
                                          disabled={!selectedFile}
                                          onClick={() => handleSubmit(assign.id)}
                                          className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                        >
                                          Submit Assignment
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-750 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    No assignments posted yet.
                  </div>
                )}
             </div>
          )}

          {activeTab === 'gradebook' && (isInstructor || user?.role === Role.ADMIN) && (
            <div className="space-y-6">
               <div className="flex justify-between items-center mb-4">
                 <div>
                   <h2 className="text-xl font-bold text-slate-800 dark:text-white">Gradebook</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Manage student grades for {course.code}</p>
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm">
                   <Save size={16} />
                   Export Grades
                 </button>
               </div>

               <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 dark:bg-slate-750 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                     <tr>
                       <th className="p-4 border-b border-slate-200 dark:border-slate-700 sticky left-0 bg-slate-50 dark:bg-slate-750 z-10 min-w-[200px]">Student</th>
                       {courseAssignments.map(a => (
                         <th key={a.id} className="p-4 border-b border-slate-200 dark:border-slate-700 min-w-[120px]">
                           <div className="flex flex-col">
                             <span>{a.title}</span>
                             <span className="text-[10px] opacity-70 font-normal">Max: {a.maxPoints}</span>
                           </div>
                         </th>
                       ))}
                       <th className="p-4 border-b border-slate-200 dark:border-slate-700 min-w-[100px]">Total %</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                     {enrolledStudents.map(student => {
                       let totalPoints = 0;
                       let maxTotalPoints = 0;
                       
                       return (
                         <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                           <td className="p-4 sticky left-0 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-750 z-10 border-r border-slate-100 dark:border-slate-700">
                             <div className="flex items-center gap-3">
                               <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                               <div className="min-w-0">
                                 <p className="font-medium text-sm text-slate-800 dark:text-white truncate">{student.name}</p>
                                 <p className="text-xs text-slate-400">{student.id.toUpperCase()}</p>
                               </div>
                             </div>
                           </td>
                           {courseAssignments.map(a => {
                             const currentGrade = getGrade(student.id, a.id);
                             if (typeof currentGrade === 'number') {
                               totalPoints += currentGrade;
                             }
                             maxTotalPoints += a.maxPoints;
                             const submission = submissions.find(s => s.studentId === student.id && s.assignmentId === a.id);

                             return (
                               <td key={a.id} className="p-4 align-top">
                                 <div className="flex flex-col gap-2">
                                   <div className="flex items-center gap-1">
                                     <input 
                                       type="number" 
                                       className="w-16 p-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                                       placeholder="-"
                                       max={a.maxPoints}
                                       value={currentGrade}
                                       onChange={(e) => handleGradeChange(student.id, a.id, e.target.value)}
                                     />
                                     <span className="text-xs text-slate-400">/ {a.maxPoints}</span>
                                   </div>
                                   
                                   {/* Status display */}
                                   <div>
                                      {submission ? (
                                        <div className="flex items-center gap-1">
                                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                            submission.status === 'LATE' 
                                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' 
                                              : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                                          }`}>
                                            {submission.status}
                                          </span>
                                        </div>
                                      ) : (
                                         <span className="text-[10px] text-slate-400 italic px-1">
                                           Not Submitted
                                         </span>
                                      )}
                                   </div>
                                 </div>
                               </td>
                             );
                           })}
                           <td className="p-4">
                             <span className={`font-bold text-sm ${
                               maxTotalPoints > 0 
                                 ? (totalPoints / maxTotalPoints) >= 0.9 ? 'text-green-600 dark:text-green-400' 
                                 : (totalPoints / maxTotalPoints) >= 0.7 ? 'text-slate-800 dark:text-slate-200' 
                                 : 'text-red-600 dark:text-red-400'
                                 : 'text-slate-400'
                             }`}>
                               {maxTotalPoints > 0 ? Math.round((totalPoints / maxTotalPoints) * 100) + '%' : '-'}
                             </span>
                           </td>
                         </tr>
                       );
                     })}
                     {enrolledStudents.length === 0 && (
                       <tr>
                         <td colSpan={courseAssignments.length + 2} className="p-8 text-center text-slate-500 dark:text-slate-400">
                           No students enrolled in this course.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;