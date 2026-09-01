import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  FileText, 
  Edit3, 
  Trash2, 
  Calculator, 
  PlusCircle, 
  MinusCircle, 
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { StudentRecord, AttendanceFilter } from '../types';
import { getAttendanceStatus } from '../utils/erpCalculations';

interface StudentTableProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onEditStudent: (student: StudentRecord) => void;
  onDeleteStudent: (id: string) => void;
  onOpenAdvisory: (student: StudentRecord) => void;
  onQuickAdjustAttendance: (studentId: string, deltaAttended: number, deltaTotal: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  selectedSemester: string;
  setSelectedSemester: (sem: string) => void;
  attendanceFilter: AttendanceFilter;
  setAttendanceFilter: (filter: AttendanceFilter) => void;
  classesList: string[];
}

type SortField = 'name' | 'rollNumber' | 'className' | 'semester' | 'attendancePercentage' | 'creditsObtained' | 'cgpa';
type SortOrder = 'asc' | 'desc';

// Avatar pastel color palette from Geometric Balance archetype
const AVATAR_STYLES = [
  { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]' },
  { bg: 'bg-[#FDF2F8]', text: 'text-[#DB2777]' },
  { bg: 'bg-[#ECFDF5]', text: 'text-[#059669]' },
  { bg: 'bg-[#FFF7ED]', text: 'text-[#EA580C]' },
  { bg: 'bg-[#F5F3FF]', text: 'text-[#7C3AED]' },
  { bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]' },
];

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenAdvisory,
  onQuickAdjustAttendance,
  searchTerm,
  setSearchTerm,
  selectedClass,
  setSelectedClass,
  selectedSemester,
  setSelectedSemester,
  attendanceFilter,
  setAttendanceFilter,
  classesList,
}) => {
  const [sortField, setSortField] = useState<SortField>('rollNumber');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [viewLayout, setViewLayout] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedClass === 'ALL' || s.className === selectedClass;
    const matchesSemester = selectedSemester === 'ALL' || s.semester.toString() === selectedSemester;

    let matchesAttendance = true;
    if (attendanceFilter === 'safe') {
      matchesAttendance = s.attendancePercentage >= 75;
    } else if (attendanceFilter === 'warning') {
      matchesAttendance = s.attendancePercentage >= 70 && s.attendancePercentage < 75;
    } else if (attendanceFilter === 'shortage') {
      matchesAttendance = s.attendancePercentage < 75;
    }

    return matchesSearch && matchesClass && matchesSemester && matchesAttendance;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * itemsPerPage;
  const pageStudents = sortedStudents.slice(startIndex, startIndex + itemsPerPage);

  const getAvatarStyle = (index: number) => {
    return AVATAR_STYLES[index % AVATAR_STYLES.length];
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
      
      {/* Control Bar: Filters & Search */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="student-search-input"
              type="text"
              placeholder="Search by Student Name, Roll No, or Department..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Mode */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Class Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#64748B] hidden sm:inline">Class:</span>
              <select
                id="filter-class-select"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 text-xs font-medium bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              >
                <option value="ALL">All Classes ({classesList.length})</option>
                {classesList.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#64748B] hidden sm:inline">Sem:</span>
              <select
                id="filter-semester-select"
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 text-xs font-medium bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              >
                <option value="ALL">All Semesters (1-8)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem.toString()}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Status Filter Tabs */}
            <div className="inline-flex bg-[#E2E8F0] p-0.5 rounded-md text-xs font-medium text-[#64748B]">
              <button
                id="filter-att-all"
                onClick={() => {
                  setAttendanceFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded transition ${
                  attendanceFilter === 'all' ? 'bg-white text-[#0F172A] shadow-xs font-bold' : 'hover:text-[#0F172A]'
                }`}
              >
                All
              </button>
              <button
                id="filter-att-safe"
                onClick={() => {
                  setAttendanceFilter('safe');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded transition ${
                  attendanceFilter === 'safe' ? 'bg-white text-[#059669] shadow-xs font-bold' : 'hover:text-[#0F172A]'
                }`}
              >
                Safe (&ge;75%)
              </button>
              <button
                id="filter-att-shortage"
                onClick={() => {
                  setAttendanceFilter('shortage');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded transition ${
                  attendanceFilter === 'shortage' ? 'bg-white text-[#DC2626] shadow-xs font-bold' : 'hover:text-[#0F172A]'
                }`}
              >
                Shortage (&lt;75%)
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#CBD5E1] rounded-md overflow-hidden bg-white ml-auto lg:ml-0">
              <button
                id="view-table-btn"
                onClick={() => setViewLayout('table')}
                className={`px-2.5 py-1 text-xs font-semibold ${
                  viewLayout === 'table' ? 'bg-[#0F172A] text-white' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                Table
              </button>
              <button
                id="view-cards-btn"
                onClick={() => setViewLayout('cards')}
                className={`px-2.5 py-1 text-xs font-semibold ${
                  viewLayout === 'cards' ? 'bg-[#0F172A] text-white' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                Cards
              </button>
            </div>

          </div>

        </div>

        {/* Filter Summary */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#64748B]">
          <div>
            Showing <strong className="text-[#0F172A]">{sortedStudents.length}</strong> of{' '}
            <strong className="text-[#0F172A]">{students.length}</strong> enrolled students
            {(selectedClass !== 'ALL' || selectedSemester !== 'ALL' || attendanceFilter !== 'all' || searchTerm) && (
              <span className="ml-1 text-[#2563EB] font-semibold">(Filtered Active)</span>
            )}
          </div>
          <div className="text-[11px] text-[#94A3B8] hidden sm:block">
            Click column headers to sort &bull; Click student to view academic dossier
          </div>
        </div>
      </div>

      {/* Main Student Records Display */}
      {sortedStudents.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-12 h-12 rounded-lg bg-[#F1F5F9] text-[#64748B] flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">No student records match your criteria</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1">
            Try adjusting your search terms, changing the semester/class filters, or reset the attendance status filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedClass('ALL');
              setSelectedSemester('ALL');
              setAttendanceFilter('all');
              setCurrentPage(1);
            }}
            className="mt-4 px-3 py-1.5 text-xs font-bold text-[#2563EB] hover:bg-[#EFF6FF] bg-[#F8FAFC] border border-[#CBD5E1] rounded-md transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewLayout === 'table' ? (
        /* TABLE VIEW IN GEOMETRIC BALANCE THEME */
        <div className="flex-1 overflow-x-auto">
          {/* Header Row */}
          <div className="grid grid-cols-12 bg-[#F8FAFC] border-b border-[#E2E8F0] p-4 text-[11px] font-bold uppercase tracking-wider text-[#64748B] min-w-[760px]">
            <div 
              className="col-span-4 flex items-center gap-1.5 cursor-pointer hover:text-[#0F172A]"
              onClick={() => handleSort('name')}
            >
              <span>Student Name & Roll No</span>
              <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
            </div>
            <div 
              className="col-span-2 text-center flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#0F172A]"
              onClick={() => handleSort('className')}
            >
              <span>Class/Division</span>
              <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
            </div>
            <div 
              className="col-span-2 text-center flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#0F172A]"
              onClick={() => handleSort('semester')}
            >
              <span>Semester</span>
              <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
            </div>
            <div 
              className="col-span-2 text-center flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#0F172A]"
              onClick={() => handleSort('attendancePercentage')}
            >
              <span>Attendance</span>
              <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
            </div>
            <div 
              className="col-span-2 text-center flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#0F172A]"
              onClick={() => handleSort('creditsObtained')}
            >
              <span>Credits / Actions</span>
              <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
            </div>
          </div>

          {/* Table Data Rows */}
          <div className="divide-y divide-[#F1F5F9] min-w-[760px]">
            {pageStudents.map((student, index) => {
              const avatarStyle = getAvatarStyle(startIndex + index);
              const isSafe = student.attendancePercentage >= 75;
              const isWarning = student.attendancePercentage >= 70 && student.attendancePercentage < 75;
              const attColor = isSafe ? 'text-[#10B981]' : isWarning ? 'text-[#F59E0B]' : 'text-[#EF4444]';

              return (
                <div 
                  key={student.id} 
                  id={`student-row-${student.id}`}
                  className="grid grid-cols-12 items-center p-4 border-b border-[#F1F5F9] text-sm hover:bg-[#F8FAFC] transition-colors group"
                >
                  {/* Student Name and Avatar */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div 
                      onClick={() => onSelectStudent(student)}
                      className={`w-8 h-8 rounded ${avatarStyle.bg} ${avatarStyle.text} flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs hover:ring-1 hover:ring-[#2563EB] transition`}
                    >
                      {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div 
                        onClick={() => onSelectStudent(student)}
                        className="font-semibold text-[#0F172A] hover:text-[#2563EB] cursor-pointer flex items-center gap-1.5 leading-snug"
                      >
                        <span>{student.name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-[#64748B]">
                        {student.rollNumber} &bull; <span className="font-sans text-[#94A3B8]">{student.department.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Class / Division */}
                  <div className="col-span-2 text-center">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                      {student.className}
                    </span>
                  </div>

                  {/* Semester */}
                  <div className="col-span-2 text-center">
                    <span className="bg-[#F1F5F9] px-3 py-1 rounded-full text-xs font-medium text-[#475569]">
                      Sem {student.semester}
                    </span>
                  </div>

                  {/* Attendance */}
                  <div className="col-span-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`font-bold ${attColor}`}>
                        {student.attendancePercentage}%
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-[#64748B] mt-0.5">
                        <span>{student.attendedClasses}/{student.totalClasses}</span>
                        <button
                          onClick={() => onOpenAdvisory(student)}
                          className="text-[#2563EB] hover:underline font-semibold ml-1"
                          title="Attendance Advisory Calculator"
                        >
                          Advisory
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Credits & Action Buttons */}
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono font-bold text-[#0F172A] text-sm">
                        {student.creditsObtained.toFixed(1)}
                      </span>

                      {/* Action Menu */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          id={`btn-view-dossier-${student.id}`}
                          onClick={() => onSelectStudent(student)}
                          className="p-1 text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded transition"
                          title="View Official Dossier"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-edit-student-${student.id}`}
                          onClick={() => onEditStudent(student)}
                          className="p-1 text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded transition"
                          title="Edit Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-student-${student.id}`}
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1 text-[#94A3B8] hover:text-[#DC2626] hover:bg-rose-50 rounded transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageStudents.map((student, index) => {
            const avatarStyle = getAvatarStyle(startIndex + index);
            const isSafe = student.attendancePercentage >= 75;
            const isWarning = student.attendancePercentage >= 70 && student.attendancePercentage < 75;
            const attColor = isSafe ? 'text-[#10B981]' : isWarning ? 'text-[#F59E0B]' : 'text-[#EF4444]';

            return (
              <div 
                key={student.id}
                id={`student-card-${student.id}`}
                className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs hover:border-[#CBD5E1] transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${avatarStyle.bg} ${avatarStyle.text} font-bold text-xs flex items-center justify-center`}>
                      {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h4 
                        className="font-bold text-[#0F172A] text-sm leading-tight hover:text-[#2563EB] cursor-pointer" 
                        onClick={() => onSelectStudent(student)}
                      >
                        {student.name}
                      </h4>
                      <p className="text-xs font-mono text-[#64748B]">{student.rollNumber}</p>
                    </div>
                  </div>
                  <span className="bg-[#F1F5F9] px-2.5 py-0.5 rounded-full text-xs font-medium text-[#475569]">
                    Sem {student.semester}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] border-y border-[#F1F5F9] py-2">
                  <span className="font-mono font-bold text-[#0F172A]">{student.className}</span>
                  <span className="text-[#64748B] truncate max-w-[150px]">{student.department}</span>
                </div>

                {/* Attendance */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#64748B]">Attendance</span>
                    <span className={`font-bold ${attColor}`}>
                      {student.attendancePercentage}% ({isSafe ? 'Safe' : 'Shortage'})
                    </span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isSafe ? 'bg-[#10B981]' : isWarning ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                      style={{ width: `${Math.min(100, student.attendancePercentage)}%` }}
                    />
                  </div>
                </div>

                {/* Credits */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[#64748B] font-medium">Credits Earned</span>
                  <span className="font-mono font-bold text-[#0F172A]">
                    {student.creditsObtained.toFixed(1)} / {student.creditsRequired} cr
                  </span>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#64748B]">
                    CGPA: {student.cgpa ? student.cgpa.toFixed(2) : '--'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="px-2.5 py-1 text-xs font-bold bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-md transition"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => onEditStudent(student)}
                      className="p-1 text-[#64748B] hover:bg-[#F1F5F9] rounded-md"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar (Geometric Balance Theme) */}
      <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-[#64748B] font-medium">
          Showing {sortedStudents.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, sortedStudents.length)} of {sortedStudents.length.toLocaleString()} students
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#E2E8F0] bg-white hover:bg-gray-50 text-xs font-medium text-[#64748B] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
              Math.max(0, validPage - 3),
              Math.min(totalPages, validPage + 2)
            ).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded text-xs transition ${
                  validPage === pageNum
                    ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold'
                    : 'border border-[#E2E8F0] bg-white hover:bg-gray-50 text-[#64748B] font-medium'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#E2E8F0] bg-white hover:bg-gray-50 text-xs font-medium text-[#64748B] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
