import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  BarChart3, 
  Plus, 
  Sparkles, 
  BookOpen, 
  CalendarCheck, 
  GraduationCap, 
  Download, 
  CheckCircle,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { StudentRecord, ViewMode, AttendanceFilter, ERPStats } from './types';
import { INITIAL_STUDENTS, CLASSES_LIST } from './data/mockStudents';
import { calculateAttendancePercentage } from './utils/erpCalculations';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { StudentTable } from './components/StudentTable';
import { StudentFormModal } from './components/StudentFormModal';
import { StudentDossierModal } from './components/StudentDossierModal';
import { AttendanceAdvisoryModal } from './components/AttendanceAdvisoryModal';
import { QuickAttendanceModal } from './components/QuickAttendanceModal';
import { CreditAuditView } from './components/CreditAuditView';
import { ClassAnalyticsView } from './components/ClassAnalyticsView';
import { ExportImportModal } from './components/ExportImportModal';

const LOCAL_STORAGE_KEY = 'academix_erp_student_records_v1';

export default function App() {
  // 1. Core State
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load students from localStorage', e);
    }
    return INITIAL_STUDENTS;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  // 2. Navigation Tab State
  const [activeTab, setActiveTab] = useState<'directory' | 'credits' | 'analytics'>('directory');

  // 3. Filters and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>('all');

  // 4. Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null);

  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<StudentRecord | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const [selectedStudentForAdvisory, setSelectedStudentForAdvisory] = useState<StudentRecord | null>(null);
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState(false);

  const [isQuickAttendanceOpen, setIsQuickAttendanceOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // 5. Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 6. ERP Statistics Calculation
  const totalStudents = students.length;
  const avgAttendance = totalStudents > 0
    ? Math.round((students.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents) * 10) / 10
    : 0;
  const avgCredits = totalStudents > 0
    ? Math.round((students.reduce((acc, s) => acc + s.creditsObtained, 0) / totalStudents) * 10) / 10
    : 0;
  const shortageCount = students.filter((s) => s.attendancePercentage < 75).length;
  const safeCount = totalStudents - shortageCount;

  const stats: ERPStats = {
    totalStudents,
    avgAttendance,
    avgCredits,
    shortageCount,
    safeCount,
    totalClasses: students.reduce((acc, s) => Math.max(acc, s.totalClasses), 0),
  };

  // 7. Student CRUD Handlers
  const handleAddStudent = () => {
    setStudentToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditStudent = (student: StudentRecord) => {
    setStudentToEdit(student);
    setIsFormOpen(true);
  };

  const handleSaveStudent = (savedRecord: StudentRecord) => {
    if (studentToEdit) {
      setStudents((prev) =>
        prev.map((s) => (s.id === savedRecord.id ? savedRecord : s))
      );
      showToast(`Updated record for ${savedRecord.name}`);
    } else {
      setStudents((prev) => [savedRecord, ...prev]);
      showToast(`Enrolled new student: ${savedRecord.name}`);
    }
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    if (confirm(`Are you sure you want to remove student record for "${student?.name || id}"?`)) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast(`Removed student record.`);
      if (selectedStudentForDossier?.id === id) {
        setIsDossierOpen(false);
      }
    }
  };

  const handleSelectStudentForDossier = (student: StudentRecord) => {
    setSelectedStudentForDossier(student);
    setIsDossierOpen(true);
  };

  const handleOpenAdvisory = (student: StudentRecord) => {
    setSelectedStudentForAdvisory(student);
    setIsAdvisoryOpen(true);
  };

  // Quick single-student attendance adjustment
  const handleQuickAdjustAttendance = (studentId: string, deltaAttended: number, deltaTotal: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newTotal = Math.max(1, s.totalClasses + deltaTotal);
        const newAttended = Math.min(newTotal, Math.max(0, s.attendedClasses + deltaAttended));
        const newPct = calculateAttendancePercentage(newAttended, newTotal);
        return {
          ...s,
          totalClasses: newTotal,
          attendedClasses: newAttended,
          attendancePercentage: newPct,
          status: newPct < 65 ? 'detained' : s.status,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      })
    );
    showToast(`Updated attendance for student.`);
  };

  // Batch class attendance marking
  const handleSaveBatchAttendance = (updates: { studentId: string; wasPresent: boolean }[]) => {
    setStudents((prev) =>
      prev.map((s) => {
        const update = updates.find((u) => u.studentId === s.id);
        if (!update) return s;
        const newTotal = s.totalClasses + 1;
        const newAttended = update.wasPresent ? s.attendedClasses + 1 : s.attendedClasses;
        const newPct = calculateAttendancePercentage(newAttended, newTotal);
        return {
          ...s,
          totalClasses: newTotal,
          attendedClasses: newAttended,
          attendancePercentage: newPct,
          status: newPct < 65 ? 'detained' : s.status,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      })
    );
    showToast(`Logged session attendance for ${updates.length} students.`);
  };

  // Reset to default initial records
  const handleResetData = () => {
    if (confirm('Reset student records to default sample university data?')) {
      setStudents(INITIAL_STUDENTS);
      showToast('Reset to default university records.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
      
      {/* Top ERP Header & Action Nav */}
      <Navbar
        onAddStudent={handleAddStudent}
        onOpenQuickAttendance={() => setIsQuickAttendanceOpen(true)}
        onOpenExportImport={() => setIsExportImportOpen(true)}
        onResetData={handleResetData}
        totalStudents={students.length}
      />

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#334155] flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Metric Cards Header */}
        <StatsCards
          stats={stats}
          currentAttendanceFilter={attendanceFilter}
          onFilterShortage={() => {
            setActiveTab('directory');
            setAttendanceFilter('shortage');
          }}
          onFilterSafe={() => {
            setActiveTab('directory');
            setAttendanceFilter('safe');
          }}
          onShowAll={() => {
            setActiveTab('directory');
            setAttendanceFilter('all');
          }}
        />

        {/* ERP Navigation Sub-Tabs (Geometric Balance Style) */}
        <div className="flex items-center justify-between border border-[#E2E8F0] bg-white px-3 py-2 rounded-xl shadow-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              id="tab-students-directory"
              onClick={() => setActiveTab('directory')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'directory'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students Registry ({students.length})</span>
            </button>

            <button
              id="tab-credit-audit"
              onClick={() => setActiveTab('credits')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'credits'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Credit Audit & Degree Progress</span>
            </button>

            <button
              id="tab-class-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'analytics'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Class & Section Analytics</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#64748B] font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span>ERP Database Online</span>
          </div>
        </div>

        {/* Tab 1: Students Directory (Table & Filter Matrix) */}
        {activeTab === 'directory' && (
          <StudentTable
            students={students}
            onSelectStudent={handleSelectStudentForDossier}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onOpenAdvisory={handleOpenAdvisory}
            onQuickAdjustAttendance={handleQuickAdjustAttendance}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            attendanceFilter={attendanceFilter}
            setAttendanceFilter={setAttendanceFilter}
            classesList={CLASSES_LIST}
          />
        )}

        {/* Tab 2: Credit Audit & Progress View */}
        {activeTab === 'credits' && (
          <CreditAuditView
            students={students}
            onSelectStudent={handleSelectStudentForDossier}
          />
        )}

        {/* Tab 3: Class & Section Analytics */}
        {activeTab === 'analytics' && (
          <ClassAnalyticsView
            students={students}
            classesList={CLASSES_LIST}
            onSelectClass={(cls) => {
              setSelectedClass(cls);
              setActiveTab('directory');
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
            <span className="font-bold text-[#0F172A]">ACADEMIX College ERP & Academic Credit System</span>
          </div>
          <div className="font-medium">
            Student Information System &bull; Attendance &bull; Credits &bull; Semesters
          </div>
        </div>
      </footer>

      {/* Modal 1: Student Entry / Edit Modal */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      {/* Modal 2: Student Academic Dossier & Grade Slip */}
      <StudentDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        student={selectedStudentForDossier}
        onEdit={(student) => {
          setIsDossierOpen(false);
          handleEditStudent(student);
        }}
      />

      {/* Modal 3: Attendance Advisory & 75% Calculator */}
      <AttendanceAdvisoryModal
        isOpen={isAdvisoryOpen}
        onClose={() => setIsAdvisoryOpen(false)}
        student={selectedStudentForAdvisory}
      />

      {/* Modal 4: Batch Daily Attendance Logger */}
      <QuickAttendanceModal
        isOpen={isQuickAttendanceOpen}
        onClose={() => setIsQuickAttendanceOpen(false)}
        students={students}
        classesList={CLASSES_LIST}
        onSaveBatchAttendance={handleSaveBatchAttendance}
      />

      {/* Modal 5: Export / Import & Backup Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        students={students}
        onImportData={(newRecords) => {
          setStudents(newRecords);
          showToast(`Imported ${newRecords.length} student records.`);
        }}
        onResetToDefault={handleResetData}
      />

    </div>
  );
}
