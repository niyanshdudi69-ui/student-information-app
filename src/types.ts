export interface CourseCredit {
  id: string;
  code: string;
  name: string;
  credits: number;
  attendedClasses: number;
  totalClasses: number;
  grade?: string; // e.g. 'A+', 'A', 'B', 'C', 'F'
  gradePoints?: number;
}

export interface StudentRecord {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  department: string;
  className: string; // e.g. "CSE-3A", "IT-2B", "ECE-4A"
  semester: number; // 1 to 8
  academicYear: string; // e.g. "2025-2026"
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  creditsRequired: number; // For current semester
  creditsObtained: number; // Earned so far
  cumulativeCredits?: number; // Total degree credits accumulated
  cgpa?: number;
  sgpa?: number;
  status: 'active' | 'detained' | 'on_probation' | 'graduated';
  courses: CourseCredit[];
  remarks?: string;
  lastUpdated: string;
}

export type ViewMode = 'table' | 'cards' | 'credits' | 'analytics';

export type AttendanceFilter = 'all' | 'safe' | 'warning' | 'shortage'; // safe >=75%, warning 70-74.9%, shortage <70%

export interface ERPStats {
  totalStudents: number;
  avgAttendance: number;
  avgCredits: number;
  shortageCount: number;
  safeCount: number;
  totalClasses: number;
}
