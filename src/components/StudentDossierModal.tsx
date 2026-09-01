import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  GraduationCap, 
  CalendarCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Mail, 
  BookOpen, 
  FileSpreadsheet,
  Download,
  Building,
  Sparkles
} from 'lucide-react';
import { StudentRecord } from '../types';
import { getAttendanceStatus, calculateAttendanceAdvisory } from '../utils/erpCalculations';

interface StudentDossierModalProps {
  student: StudentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: StudentRecord) => void;
}

export const StudentDossierModal: React.FC<StudentDossierModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit,
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !student) return null;

  const attStatus = getAttendanceStatus(student.attendancePercentage);
  const advisory = calculateAttendanceAdvisory(student.attendedClasses, student.totalClasses);
  const isEligible = student.attendancePercentage >= 75;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden max-h-[94vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Dossier Action Bar (Hidden during print) */}
        <div className="px-6 py-3.5 bg-[#0F172A] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#38BDF8]" />
            <span className="font-bold text-sm tracking-wide">
              Official ERP Student Academic Dossier & Grade Slip
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(student)}
              className="px-3 py-1.5 text-xs font-bold bg-[#1E293B] hover:bg-[#334155] text-[#CBD5E1] rounded-md border border-[#334155] transition"
            >
              Edit Record
            </button>
            <button
              id="btn-print-slip"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#94A3B8] hover:text-white rounded-md ml-2 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Container */}
        <div ref={printableRef} className="overflow-y-auto p-6 sm:p-8 flex-1 text-[#0F172A] space-y-6 print:p-4 print:overflow-visible">
          
          {/* Institutional Header Banner */}
          <div className="border-b-2 border-[#0F172A] pb-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-[#2563EB]">
                  <GraduationCap className="w-8 h-8 text-[#38BDF8]" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] uppercase">
                    INSTITUTE OF TECHNOLOGY & MANAGEMENT
                  </h1>
                  <p className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">
                    Office of Academic Affairs &bull; ERP Student Record
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Accredited Grade &bull; Affiliated Technical University &bull; AY {student.academicYear || '2025-2026'}
                  </p>
                </div>
              </div>

              {/* Verified Stamp */}
              <div className={`border-2 rounded-xl p-2.5 text-center min-w-[170px] ${
                isEligible ? 'border-[#10B981] bg-[#ECFDF5]' : 'border-[#DC2626] bg-[#FEF2F2]'
              }`}>
                <div className="flex items-center justify-center gap-1">
                  {isEligible ? (
                    <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                  )}
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    isEligible ? 'text-[#065F46]' : 'text-[#991B1B]'
                  }`}>
                    {isEligible ? 'EXAM ELIGIBLE' : 'SHORTAGE DETAINED'}
                  </span>
                </div>
                <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
                  ERP Code: {student.id.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Student Profile Card (Name, Class, Semester, Roll Number) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Student Name</span>
              <span className="font-bold text-[#0F172A] text-sm">{student.name}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Roll / University ID</span>
              <span className="font-mono font-bold text-[#0F172A] text-sm">{student.rollNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Class & Section</span>
              <span className="font-mono font-bold text-[#2563EB] text-sm">{student.className}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Semester</span>
              <span className="font-bold text-[#0F172A] text-sm">Semester {student.semester}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Department / Branch</span>
              <span className="font-medium text-[#334155]">{student.department}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Student Email</span>
              <span className="font-medium text-[#334155]">{student.email}</span>
            </div>
          </div>

          {/* Key ERP Summaries: Attendance & Credits Dual Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Attendance Compliance */}
            <div className={`p-4 rounded-xl border ${
              isEligible ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'bg-[#FEF2F2] border-[#FECACA]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#334155]">
                  <CalendarCheck className="w-4 h-4 text-[#2563EB]" />
                  <span>Attendance Compliance</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${attStatus.badgeClass}`}>
                  {attStatus.label}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-black ${isEligible ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                  {student.attendancePercentage}%
                </span>
                <span className="text-xs font-medium text-[#64748B]">
                  ({student.attendedClasses} attended of {student.totalClasses} sessions)
                </span>
              </div>

              <div className="w-full bg-[#E2E8F0] h-2 rounded-full mt-2 overflow-hidden relative">
                <div 
                  className={`h-full rounded-full ${isEligible ? 'bg-[#10B981]' : 'bg-[#DC2626]'}`}
                  style={{ width: `${Math.min(100, student.attendancePercentage)}%` }}
                />
              </div>

              <p className="text-xs text-[#334155] mt-2 font-medium">
                <strong>Advisory Note:</strong> {advisory.message}
              </p>
            </div>

            {/* Box 2: Credits Obtained & Academic Standing */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#334155]">
                  <Award className="w-4 h-4 text-[#2563EB]" />
                  <span>Academic Credits</span>
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                  CGPA: {student.cgpa ? student.cgpa.toFixed(2) : '--'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-[#2563EB]">
                  {student.creditsObtained}
                </span>
                <span className="text-xs font-medium text-[#64748B]">
                  / {student.creditsRequired} Credits in Sem {student.semester}
                </span>
              </div>

              <div className="w-full bg-[#F1F5F9] h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-[#2563EB] rounded-full"
                  style={{ width: `${Math.min(100, (student.creditsObtained / (student.creditsRequired || 20)) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-[#64748B] mt-2 font-medium">
                <span>Cumulative Degree Credits: <strong className="text-[#0F172A]">{student.cumulativeCredits || student.creditsObtained * student.semester}</strong> / 160</span>
                <span>SGPA: <strong className="text-[#0F172A]">{student.sgpa ? student.sgpa.toFixed(2) : '--'}</strong></span>
              </div>
            </div>

          </div>

          {/* Course-wise Credit & Attendance Breakup Table */}
          <div>
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Semester {student.semester} Course-Wise Credit & Attendance Record</span>
            </h3>

            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold text-[#64748B] uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Subject / Course Name</th>
                    <th className="py-2.5 px-3 text-center">Course Credits</th>
                    <th className="py-2.5 px-3 text-center">Classes Attended</th>
                    <th className="py-2.5 px-3 text-center">Subject Attendance %</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {student.courses && student.courses.length > 0 ? (
                    student.courses.map((c, idx) => {
                      const coursePct = Math.round((c.attendedClasses / (c.totalClasses || 1)) * 100);
                      return (
                        <tr key={c.id || idx} className="hover:bg-[#F8FAFC]">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#2563EB]">{c.code}</td>
                          <td className="py-2.5 px-3 font-medium text-[#0F172A]">{c.name}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-[#2563EB]">{c.credits} Cr</td>
                          <td className="py-2.5 px-3 text-center text-[#64748B] font-medium">
                            {c.attendedClasses} / {c.totalClasses}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">
                            <span className={coursePct >= 75 ? 'text-[#059669]' : 'text-[#DC2626]'}>
                              {coursePct}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              c.grade === 'F' 
                                ? 'bg-[#FEF2F2] text-[#DC2626]' 
                                : 'bg-[#F1F5F9] text-[#0F172A]'
                            }`}>
                              {c.grade || 'A'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-[#94A3B8]">
                        No individual course records attached.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-[#F8FAFC] font-bold border-t border-[#E2E8F0] text-[#0F172A]">
                    <td colSpan={2} className="py-2.5 px-3 text-right uppercase text-[11px] text-[#64748B]">
                      Total Semester Credits Obtained:
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#2563EB] font-mono font-bold">
                      {student.creditsObtained} / {student.creditsRequired}
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#64748B]">
                      {student.attendedClasses} / {student.totalClasses}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      <span className={student.attendancePercentage >= 75 ? 'text-[#059669]' : 'text-[#DC2626]'}>
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#64748B]">
                      SGPA: {student.sgpa || '8.0'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Remarks & Authorization Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div>
                <span className="font-bold text-[#64748B] uppercase text-[10px] block">Faculty Remarks</span>
                <p className="text-[#334155] font-medium italic mt-0.5">
                  {student.remarks || 'No adverse disciplinary record. Recommended for upcoming university assessment.'}
                </p>
                <div className="text-[10px] text-[#94A3B8] font-mono mt-2">
                  Generated on {new Date().toLocaleDateString()} &bull; ERP Timestamp: {student.lastUpdated}
                </div>
              </div>

              {/* Signature Blocks for Official College Printout */}
              <div className="flex items-center gap-8 pt-4 sm:pt-0">
                <div className="text-center">
                  <div className="w-28 border-b border-[#94A3B8] mb-1"></div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Class Advisor</span>
                </div>
                <div className="text-center">
                  <div className="w-28 border-b border-[#94A3B8] mb-1"></div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Dean (Academics)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
