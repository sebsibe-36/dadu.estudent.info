import { User, Role, Course, Assignment, Announcement, AttendanceRecord, Grade, Submission } from '../types';

// Mock Users
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@dadu.edu', role: Role.STUDENT, avatar: 'https://picsum.photos/seed/alice/200/200', enrolledCourseIds: ['c1', 'c2'] },
  { id: 'u2', name: 'Bob Smith', email: 'bob@dadu.edu', role: Role.STUDENT, avatar: 'https://picsum.photos/seed/bob/200/200', enrolledCourseIds: ['c1'] },
  { id: 'u3', name: 'Dr. Eleanor Rigby', email: 'eleanor@dadu.edu', role: Role.INSTRUCTOR, avatar: 'https://picsum.photos/seed/eleanor/200/200' },
  { id: 'u4', name: 'Prof. Alan Grant', email: 'alan@dadu.edu', role: Role.INSTRUCTOR, avatar: 'https://picsum.photos/seed/alan/200/200' },
  { id: 'u5', name: 'Admin System', email: 'admin@dadu.edu', role: Role.ADMIN, avatar: 'https://picsum.photos/seed/admin/200/200' },
];

// Mock Courses
export const MOCK_COURSES: Course[] = [
  { id: 'c1', code: 'CS101', title: 'Intro to Computer Science', instructorId: 'u3', schedule: 'Mon/Wed 10:00 AM', credits: 3, description: 'Fundamentals of programming and algorithms.' },
  { id: 'c2', code: 'MATH201', title: 'Calculus II', instructorId: 'u4', schedule: 'Tue/Thu 14:00 PM', credits: 4, description: 'Integration techniques and sequences.' },
  { id: 'c3', code: 'HIST105', title: 'World History', instructorId: 'u3', schedule: 'Fri 09:00 AM', credits: 3, description: 'A survey of global history from 1500 to present.' },
];

// Mock Assignments
export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', courseId: 'c1', title: 'Python Basics', dueDate: '2023-11-15', maxPoints: 100 },
  { id: 'a2', courseId: 'c1', title: 'Sorting Algorithms', dueDate: '2023-11-22', maxPoints: 100 },
  { id: 'a3', courseId: 'c2', title: 'Integration Problem Set', dueDate: '2023-11-18', maxPoints: 50 },
];

// Mock Grades
export let MOCK_GRADES: Grade[] = [
  { studentId: 'u1', assignmentId: 'a1', points: 95, feedback: 'Excellent work!' },
  { studentId: 'u2', assignmentId: 'a1', points: 82, feedback: 'Good effort, watch indentation.' },
  { studentId: 'u1', assignmentId: 'a3', points: 45 },
];

// Mock Submissions
export let MOCK_SUBMISSIONS: Submission[] = [
  { id: 's1', assignmentId: 'a1', studentId: 'u1', submittedAt: '2023-11-14T10:30:00', fileName: 'basics.py', status: 'SUBMITTED' },
];

// Mock Announcements
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann1', title: 'Campus Maintenance', content: 'The library server will be down for maintenance this Saturday.', date: '2023-11-10', authorId: 'u5' },
  { id: 'ann2', title: 'Midterm Schedule', content: 'Midterm exams start next week. Please check your timetable.', date: '2023-11-12', authorId: 'u5' },
];

// Mock Attendance
export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'at1', studentId: 'u1', courseId: 'c1', date: '2023-11-01', status: 'PRESENT' },
  { id: 'at2', studentId: 'u2', courseId: 'c1', date: '2023-11-01', status: 'ABSENT' },
  { id: 'at3', studentId: 'u1', courseId: 'c1', date: '2023-11-03', status: 'PRESENT' },
  { id: 'at4', studentId: 'u2', courseId: 'c1', date: '2023-11-03', status: 'LATE' },
  { id: 'at5', studentId: 'u1', courseId: 'c2', date: '2023-11-02', status: 'PRESENT' },
];

export const getCoursesForUser = (user: User): Course[] => {
  if (user.role === Role.ADMIN) return MOCK_COURSES;
  if (user.role === Role.INSTRUCTOR) return MOCK_COURSES.filter(c => c.instructorId === user.id);
  if (user.role === Role.STUDENT) {
    return MOCK_COURSES.filter(c => user.enrolledCourseIds?.includes(c.id));
  }
  return [];
};

export const updateGrade = (studentId: string, assignmentId: string, points: number) => {
  const index = MOCK_GRADES.findIndex(g => g.studentId === studentId && g.assignmentId === assignmentId);
  if (index > -1) {
    MOCK_GRADES[index] = { ...MOCK_GRADES[index], points };
  } else {
    MOCK_GRADES.push({ studentId, assignmentId, points });
  }
};

export const submitAssignment = (studentId: string, assignmentId: string, fileName: string) => {
  const newSubmission: Submission = {
    id: `sub-${Date.now()}`,
    studentId,
    assignmentId,
    fileName,
    submittedAt: new Date().toISOString(),
    status: 'SUBMITTED'
  };
  MOCK_SUBMISSIONS.push(newSubmission);
  return newSubmission;
};