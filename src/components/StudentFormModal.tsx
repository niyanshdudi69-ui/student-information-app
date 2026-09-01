import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { StudentRecord, CourseCredit } from '../types';
import { calculateAttendancePercentage, getAttendanceStatus } from '../utils/erpCalculations';
import { DEPARTMENTS, CLASSES_LIST } from '../data/mockStudents';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: StudentRecord) => void;
  studentToEdit?: StudentRecord | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
}) => {
  const isEditing = !!studentToEdit;

  // Form State
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [className, setClassName] = useState(CLASSES_LIST[0]);
  const [semester, setSemester] = useState<number>(5);
  const [academicYear, setAcademicYear] = useState('2025-2026');
  
  // Attendance fields
  const [totalClasses, setTotalClasses] = useState<number>(180);
  const [attendedClasses, setAttendedClasses] = useState<number>(150);

  // Credit fields
  const [creditsRequired, setCreditsRequired] = useState<number>(24);
  const [creditsObtained, setCreditsObtained] = useState<number>(24);
  const [cumulativeCredits, setCumulativeCredits] = useState<number>(100);
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [sgpa, setSgpa] = useState<number>(8.8);
  const [status, setStatus] = useState<'active' | 'detained' | 'on_probation' | 'graduated'>('active');
  const [remarks, setRemarks] = useState('');

  // Course Credit Breakup
  const [courses, setCourses] = useState<CourseCredit[]>([]);

  // Initialize or populate when studentToEdit changes
  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setRollNumber(studentToEdit.rollNumber);
      setEmail(studentToEdit.email);
      setDepartment(studentToEdit.department);
      setClassName(studentToEdit.className);
      setSemester(studentToEdit.semester);
      setAcademicYear(studentToEdit.academicYear || '2025-2026');
      setTotalClasses(studentToEdit.totalClasses);
      setAttendedClasses(studentToEdit.attendedClasses);
      setCreditsRequired(studentToEdit.creditsRequired);
      setCreditsObtained(studentToEdit.creditsObtained);
      setCumulativeCredits(studentToEdit.cumulativeCredits || studentToEdit.creditsObtained * studentToEdit.semester);
      setCgpa(studentToEdit.cgpa || 8.0);
      setSgpa(studentToEdit.sgpa || 8.0);
      setStatus(studentToEdit.status);
      setRemarks(studentToEdit.remarks || '');
      setCourses(studentToEdit.courses || []);
    } else {
      // Defaults for new student
      const randomRoll = `2024CS${Math.floor(100 + Math.random() * 900)}`;
      setName('');
      setRollNumber(randomRoll);
      setEmail('');
      setDepartment(DEPARTMENTS[0]);
      setClassName(CLASSES_LIST[0]);
      setSemester(5);
      setAcademicYear('2025-2026');
      setTotalClasses(180);
      setAttendedClasses(155);
      setCreditsRequired(24);
      setCreditsObtained(24);
      setCumulativeCredits(112);
      setCgpa(8.25);
      setSgpa(8.5);
      setStatus('active');
      setRemarks('');
      setCourses([
        { id: 'c1', code: 'CS501', name: 'Database Management Systems', credits: 4, attendedClasses: 36, totalClasses: 40, grade: 'A', gradePoints: 9 },
        { id: 'c2', code: 'CS502', name: 'Operating Systems & Kernels', credits: 4, attendedClasses: 34, totalClasses: 40, grade: 'A', gradePoints: 9 },
        { id: 'c3', code: 'CS503', name: 'Design & Analysis of Algorithms', credits: 4, attendedClasses: 35, totalClasses: 40, grade: 'A+', gradePoints: 10 },
        { id: 'c4', code: 'CS504', name: 'Computer Networks', credits: 4, attendedClasses: 32, totalClasses: 38, grade: 'B+', gradePoints: 8 },
        { id: 'c5', code: 'CS505', name: 'Software Engineering Lab', credits: 4, attendedClasses: 18, totalClasses: 22, grade: 'A', gradePoints: 9 },
      ]);
    }
  }, [studentToEdit, isOpen]);

  // Live Attendance calculation
  const calculatedAttendancePct = calculateAttendancePercentage(attendedClasses, totalClasses);
  const attendanceStatus = getAttendanceStatus(calculatedAttendancePct);

  // Quick course handler
  const handleAddCourse = () => {
    const newCourse: CourseCredit = {
      id: `c-${Date.now()}`,
      code: `SUB${semester}0${courses.length + 1}`,
      name: `Course Subject ${courses.length + 1}`,
      credits: 4,
      attendedClasses: 30,
      totalClasses: 35,
      grade: 'A',
      gradePoints: 9,
    };
    setCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (index: number, field: keyof CourseCredit, value: any) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const handleRemoveCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const studentRecord: StudentRecord = {
      id: studentToEdit ? studentToEdit.id : `std-${Date.now()}`,
      rollNumber: rollNumber.trim() || `ROLL-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      department,
      className,
      semester: Number(semester),
      academicYear,
      totalClasses: Number(totalClasses) || 1,
      attendedClasses: Math.min(Number(attendedClasses), Number(totalClasses)),
      attendancePercentage: calculatedAttendancePct,
      creditsRequired: Number(creditsRequired) || 20,
      creditsObtained: Number(creditsObtained) || 0,
      cumulativeCredits: Number(cumulativeCredits) || (Number(creditsObtained) * Number(semester)),
      cgpa: Number(cgpa) || 8.0,
      sgpa: Number(sgpa) || 8.0,
      status: calculatedAttendancePct < 65 ? 'detained' : status,
      courses,
      remarks: remarks.trim(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onSave(studentRecord);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#2563EB] flex items-center justify-center font-bold text-white">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                {isEditing ? 'Edit ERP Student Record' : 'Obtain & Enroll New Student Record'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Enter student identity, class, semester, attendance records, and credits obtained
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-[#0F172A]">
          
          {/* 1. Primary Student Identity (Name, Roll No, Email) */}
          <div>
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>1. Student Identity (Name & Roll Number)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Full Student Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="input-student-name"
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma, Diya Patel..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Roll / University ID <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="input-student-roll"
                  type="text"
                  required
                  placeholder="e.g. 2024CS101"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB] font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Official College Email
                </label>
                <input
                  id="input-student-email"
                  type="email"
                  placeholder="e.g. student.name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

            </div>
          </div>

          {/* 2. Academic Enrollment (Class, Semester, Department) */}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>2. Academic Class & Semester Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Class / Section <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  id="input-student-class"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                >
                  {CLASSES_LIST.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Semester <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  id="input-student-semester"
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem} {sem === 1 ? '(1st Year)' : sem === 3 ? '(2nd Year)' : sem === 5 ? '(3rd Year)' : sem === 7 ? '(Final Year)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB] font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Department / Branch
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* 3. Attendance Tracking & Calculation */}
          <div className="pt-2 border-t border-[#E2E8F0] bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-[#334155] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>3. Attendance Record & Eligibility Status</span>
              </h4>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${attendanceStatus.badgeClass}`}>
                {calculatedAttendancePct}% &bull; {attendanceStatus.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Classes Attended
                </label>
                <input
                  id="input-attended-classes"
                  type="number"
                  min="0"
                  max={totalClasses}
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB] font-bold"
                />
                <span className="text-[11px] text-[#64748B]">Lectures / Practical sessions attended</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Total Conducted Classes
                </label>
                <input
                  id="input-total-classes"
                  type="number"
                  min="1"
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB] font-bold"
                />
                <span className="text-[11px] text-[#64748B]">Total sessions held so far this semester</span>
              </div>
            </div>

            {/* Attendance indicator note */}
            <div className="mt-3 text-xs flex items-center gap-2">
              {calculatedAttendancePct >= 75 ? (
                <p className="text-[#059669] font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Eligible for Semester Examination Hall Ticket (&ge;75% required).
                </p>
              ) : (
                <p className="text-[#DC2626] font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Shortage Warning: Attendance is below mandatory 75% college norm!
                </p>
              )}
            </div>
          </div>

          {/* 4. Academic Credits Obtained & GPA */}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>4. Credits Obtained & Academic Performance</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Credits Obtained <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="input-credits-obtained"
                  type="number"
                  min="0"
                  max="40"
                  value={creditsObtained}
                  onChange={(e) => setCreditsObtained(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md font-bold text-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
                <span className="text-[11px] text-[#64748B]">Earned in Sem {semester}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Credits Required
                </label>
                <input
                  id="input-credits-required"
                  type="number"
                  min="1"
                  value={creditsRequired}
                  onChange={(e) => setCreditsRequired(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md font-bold focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
                <span className="text-[11px] text-[#64748B]">Target for Sem {semester}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Cumulative Credits
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={cumulativeCredits}
                  onChange={(e) => setCumulativeCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md font-bold focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
                <span className="text-[11px] text-[#64748B]">Total Degree (160 req)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  CGPA (0 - 10)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md font-bold focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
                <span className="text-[11px] text-[#64748B]">Cumulative Grade Point</span>
              </div>
            </div>
          </div>

          {/* 5. Course List / Subject Breakup */}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                Enrolled Courses & Credit Allocation ({courses.length} Courses)
              </h4>
              <button
                type="button"
                onClick={handleAddCourse}
                className="text-xs font-bold text-[#2563EB] hover:bg-[#EFF6FF] flex items-center gap-1 px-2.5 py-1 rounded border border-[#BFDBFE]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {courses.map((course, idx) => (
                <div key={course.id || idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                  <input
                    type="text"
                    placeholder="Code (CS501)"
                    value={course.code}
                    onChange={(e) => handleUpdateCourse(idx, 'code', e.target.value)}
                    className="w-20 px-2 py-1 border border-[#CBD5E1] rounded font-mono font-bold uppercase bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={course.name}
                    onChange={(e) => handleUpdateCourse(idx, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 border border-[#CBD5E1] rounded bg-white font-medium"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#64748B]">Cr:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={course.credits}
                      onChange={(e) => handleUpdateCourse(idx, 'credits', Number(e.target.value))}
                      className="w-12 px-1 py-1 border border-[#CBD5E1] rounded text-center font-bold bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#64748B]">Grade:</span>
                    <input
                      type="text"
                      placeholder="A+"
                      value={course.grade || ''}
                      onChange={(e) => handleUpdateCourse(idx, 'grade', e.target.value)}
                      className="w-12 px-1 py-1 border border-[#CBD5E1] rounded text-center font-bold bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCourse(idx)}
                    className="p-1 text-[#94A3B8] hover:text-[#DC2626] rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1">
              ERP Remarks / Faculty Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Class Representative, Dean's List, Remedial coaching assigned..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-student-btn"
              className="px-5 py-2 text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition shadow-sm"
            >
              {isEditing ? 'Save Changes' : 'Enroll Record'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
