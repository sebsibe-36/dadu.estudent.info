export enum Role {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  enrolledCourseIds?: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructorId: string;
  schedule: string;
  credits: number;
  description: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  maxPoints: number;
}

export interface Grade {
  studentId: string;
  assignmentId: string;
  points: number;
  feedback?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  fileName: string;
  status: 'SUBMITTED' | 'LATE';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  authorId: string;
}