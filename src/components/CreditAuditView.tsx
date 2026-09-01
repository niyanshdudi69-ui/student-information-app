import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  GraduationCap, 
  Layers, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { StudentRecord } from '../types';

interface CreditAuditViewProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
}

export const CreditAuditView: React.FC<CreditAuditViewProps> = ({
  students,
  onSelectStudent,
}) => {
  const [selectedSemFilter, setSelectedSemFilter] = useState<string>('ALL');

  // Filter students
  const filteredStudents = selectedSemFilter === 'ALL'
    ? students
    : students.filter((s) => s.semester.toString() === selectedSemFilter);

  // High credit achievers
  const topAchievers = [...students].sort((a, b) => (b.cumulativeCredits || 0) - (a.cumulativeCredits || 0)).slice(0, 5);

  // Students with credit backlogs (creditsObtained < creditsRequired)
  const studentsWithBacklogs = students.filter((s) => s.creditsObtained < s.creditsRequired);

  // Calculate degree progress milestones
  const avgCumulativeCredits = Math.round(
    students.reduce((acc, s) => acc + (s.cumulativeCredits || s.creditsObtained * s.semester), 0) / (students.length || 1)
  );

  return (
    <div className="space-y-6">
      
      {/* Overview Cards (Geometric Balance Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <p className="text-[10px] uppercase text-[#64748B] font-bold tracking-widest">Avg Cumulative Credits</p>
          <div className="flex items-baseline justify-between mt-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2563EB]">{avgCumulativeCredits}</h2>
            <span className="text-xs font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">/ 160.0 DEGREE</span>
          </div>
          <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-[#2563EB] rounded-full"
              style={{ width: `${Math.min(100, (avgCumulativeCredits / 160) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#64748B] mt-2 font-medium">
            {((avgCumulativeCredits / 160) * 100).toFixed(1)}% degree completion rate
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <p className="text-[10px] uppercase text-[#64748B] font-bold tracking-widest">100% Credit Cleared</p>
          <div className="flex items-baseline justify-between mt-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#10B981]">
              {students.length - studentsWithBacklogs.length}
            </h2>
            <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded">
              {Math.round(((students.length - studentsWithBacklogs.length) / (students.length || 1)) * 100)}% Cohort
            </span>
          </div>
          <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-[#10B981] rounded-full"
              style={{ width: `${((students.length - studentsWithBacklogs.length) / (students.length || 1)) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-[#059669] mt-2 font-medium">
            No credit deficits in current semester
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <p className="text-[10px] uppercase text-[#DC2626] font-bold tracking-widest">Credit Backlog Review</p>
          <div className="flex items-baseline justify-between mt-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#DC2626]">{studentsWithBacklogs.length}</h2>
            <span className="text-xs font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded">
              Requires Remedial
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-3 font-medium">
            Students needing supplementary exam or course repetition for missing credits
          </p>
        </div>

      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Credit Breakdown Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          
          <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">
                Student Credit Audit & Progress Table
              </h3>
              <p className="text-xs text-[#64748B]">
                Track credits earned per semester versus target degree requirements
              </p>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Semester:</span>
              <select
                value={selectedSemFilter}
                onChange={(e) => setSelectedSemFilter(e.target.value)}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              >
                <option value="ALL">All Cohorts (Sem 1-8)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s.toString()}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[11px] font-bold text-[#64748B] uppercase border-b border-[#E2E8F0]">
                  <th className="py-3 px-4">Student & Roll No</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3 text-center">Sem</th>
                  <th className="py-3 px-4 text-center">Semester Credits</th>
                  <th className="py-3 px-4">Cumulative Credits</th>
                  <th className="py-3 px-3 text-center">CGPA</th>
                  <th className="py-3 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredStudents.map((s) => {
                  const hasBacklog = s.creditsObtained < s.creditsRequired;
                  const degreePct = Math.min(100, Math.round(((s.cumulativeCredits || s.creditsObtained * s.semester) / 160) * 100));

                  return (
                    <tr key={s.id} className="hover:bg-[#F8FAFC] transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#0F172A]">{s.name}</div>
                        <div className="text-[#64748B] font-mono text-[11px]">{s.rollNumber}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                          {s.className}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="bg-[#F1F5F9] px-2.5 py-0.5 rounded-full text-xs font-medium text-[#475569]">
                          Sem {s.semester}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="font-mono font-bold text-[#0F172A] text-sm">
                          {s.creditsObtained.toFixed(1)} <span className="text-[#94A3B8] text-xs font-normal">/ {s.creditsRequired}</span>
                        </div>
                        {hasBacklog ? (
                          <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEF2F2] px-1.5 py-0.5 rounded">
                            -{(s.creditsRequired - s.creditsObtained).toFixed(1)} Backlog
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                            100% Cleared
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-[#2563EB]">
                            {(s.cumulativeCredits || s.creditsObtained * s.semester).toFixed(1)} / 160 cr
                          </span>
                          <span className="text-[11px] font-semibold text-[#64748B]">{degreePct}%</span>
                        </div>
                        <div className="w-32 bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#2563EB] rounded-full"
                            style={{ width: `${degreePct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#0F172A]">
                        {s.cgpa ? s.cgpa.toFixed(2) : '--'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectStudent(s)}
                          className="px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-[#EFF6FF] rounded-md transition"
                        >
                          Audit &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Sidebar: Top Credit Achievers & Backlog List */}
        <div className="space-y-4">
          
          {/* Top Cumulative Achievers */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#2563EB]" />
              <span>Highest Credit Accumulators</span>
            </h4>

            <div className="space-y-2.5">
              {topAchievers.map((s, idx) => (
                <div 
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded bg-[#0F172A] text-white font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">{s.name}</div>
                      <div className="text-[10px] text-[#64748B]">{s.className} &bull; Sem {s.semester}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-[#2563EB] block">
                      {(s.cumulativeCredits || s.creditsObtained * s.semester).toFixed(1)} Cr
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">CGPA: {s.cgpa ? s.cgpa.toFixed(2) : '8.50'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remedial / Backlog Alert Box */}
          {studentsWithBacklogs.length > 0 && (
            <div className="bg-[#FEF2F2] p-4 rounded-xl border border-[#FECACA] shadow-xs">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#DC2626] mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                <span>Credit Deficiencies ({studentsWithBacklogs.length})</span>
              </h4>
              <p className="text-xs text-[#991B1B] mb-3">
                Students below the semester credit quota required for regular progression:
              </p>

              <div className="space-y-2">
                {studentsWithBacklogs.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="p-2 rounded-lg bg-white border border-[#FECACA] flex items-center justify-between cursor-pointer hover:border-[#DC2626]"
                  >
                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">{s.name}</div>
                      <div className="text-[10px] text-[#DC2626] font-medium">
                        Obtained {s.creditsObtained} of {s.creditsRequired} Credits ({(s.creditsRequired - s.creditsObtained).toFixed(1)} backlog)
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB]">Review &rarr;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
