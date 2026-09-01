import { StudentRecord, CourseCredit } from '../types';

export function calculateAttendancePercentage(attended: number, total: number): number {
  if (total <= 0) return 0;
  const pct = (attended / total) * 100;
  return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
}

export function getAttendanceStatus(percentage: number): {
  label: string;
  badgeClass: string;
  textClass: string;
  isShortage: boolean;
  status: 'safe' | 'warning' | 'shortage';
} {
  if (percentage >= 75) {
    return {
      label: 'Safe (Eligible)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      textClass: 'text-emerald-700',
      isShortage: false,
      status: 'safe',
    };
  } else if (percentage >= 70) {
    return {
      label: 'Warning Zone',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      textClass: 'text-amber-700',
      isShortage: true,
      status: 'warning',
    };
  } else {
    return {
      label: 'Critical Shortage',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      textClass: 'text-rose-700',
      isShortage: true,
      status: 'shortage',
    };
  }
}

/**
 * Calculates how many consecutive classes a student must attend to reach 75%,
 * or how many they can afford to miss before falling below 75%.
 */
export function calculateAttendanceAdvisory(attended: number, total: number) {
  const currentPct = calculateAttendancePercentage(attended, total);
  
  if (total === 0) {
    return {
      type: 'neutral',
      currentPct: 0,
      classesToAttend: 0,
      classesCanBunk: 0,
      message: 'No class sessions recorded yet.',
    };
  }

  if (currentPct >= 75) {
    // How many classes can they miss without dropping below 75%?
    // Formula: (attended) / (total + x) >= 0.75 => attended / 0.75 - total >= x
    const maxTotal = Math.floor(attended / 0.75);
    const classesCanBunk = Math.max(0, maxTotal - total);
    return {
      type: 'eligible',
      currentPct,
      classesToAttend: 0,
      classesCanBunk,
      message: classesCanBunk > 0
        ? `You can safely miss ${classesCanBunk} class${classesCanBunk === 1 ? '' : 'es'} while maintaining >= 75% attendance.`
        : `You are right at the 75% threshold. Do not miss the upcoming class!`,
    };
  } else {
    // How many consecutive classes must they attend to reach 75%?
    // Formula: (attended + y) / (total + y) >= 0.75
    // attended + y >= 0.75 * total + 0.75 * y
    // 0.25 * y >= 0.75 * total - attended
    // y >= (3 * total - 4 * attended)
    const needed = Math.max(1, Math.ceil(3 * total - 4 * attended));
    return {
      type: 'shortage',
      currentPct,
      classesToAttend: needed,
      classesCanBunk: 0,
      message: `Must attend next ${needed} consecutive class${needed === 1 ? '' : 'es'} without absence to achieve 75% exam eligibility.`,
    };
  }
}

export function calculateCreditsFromCourses(courses: CourseCredit[]): {
  totalObtained: number;
  totalRequired: number;
} {
  const totalRequired = courses.reduce((acc, c) => acc + (c.credits || 0), 0);
  const totalObtained = courses
    .filter((c) => !c.grade || c.grade !== 'F')
    .reduce((acc, c) => acc + (c.credits || 0), 0);
  return { totalObtained, totalRequired };
}

export function exportToCSV(students: StudentRecord[]): void {
  const headers = [
    'Roll Number',
    'Student Name',
    'Email',
    'Class',
    'Semester',
    'Department',
    'Attended Classes',
    'Total Classes',
    'Attendance %',
    'Attendance Status',
    'Credits Obtained',
    'Credits Required',
    'CGPA',
    'SGPA',
    'Status',
  ];

  const rows = students.map((s) => [
    `"${s.rollNumber}"`,
    `"${s.name}"`,
    `"${s.email}"`,
    `"${s.className}"`,
    s.semester,
    `"${s.department}"`,
    s.attendedClasses,
    s.totalClasses,
    `${s.attendancePercentage}%`,
    `"${getAttendanceStatus(s.attendancePercentage).label}"`,
    s.creditsObtained,
    s.creditsRequired,
    s.cgpa || 'N/A',
    s.sgpa || 'N/A',
    `"${s.status}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `College_ERP_Students_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
