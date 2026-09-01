import React from 'react';
import { 
  BarChart3, 
  Users, 
  CalendarCheck, 
  Award, 
  AlertTriangle, 
  TrendingUp,
  Building
} from 'lucide-react';
import { StudentRecord } from '../types';

interface ClassAnalyticsViewProps {
  students: StudentRecord[];
  classesList: string[];
  onSelectClass: (cls: string) => void;
}

export const ClassAnalyticsView: React.FC<ClassAnalyticsViewProps> = ({
  students,
  classesList,
  onSelectClass,
}) => {
  // Aggregate data by Class
  const classStats = classesList.map((cls) => {
    const enrolled = students.filter((s) => s.className === cls);
    if (enrolled.length === 0) {
      return {
        className: cls,
        count: 0,
        avgAttendance: 0,
        avgCredits: 0,
        shortageCount: 0,
        safeCount: 0,
      };
    }

    const totalAtt = enrolled.reduce((acc, s) => acc + s.attendancePercentage, 0);
    const totalCredits = enrolled.reduce((acc, s) => acc + s.creditsObtained, 0);
    const shortageCount = enrolled.filter((s) => s.attendancePercentage < 75).length;
    const safeCount = enrolled.length - shortageCount;

    return {
      className: cls,
      count: enrolled.length,
      avgAttendance: Math.round((totalAtt / enrolled.length) * 10) / 10,
      avgCredits: Math.round((totalCredits / enrolled.length) * 10) / 10,
      shortageCount,
      safeCount,
    };
  }).filter((c) => c.count > 0);

  // Aggregate by Semester (1-8)
  const semesterStats = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
    const semStudents = students.filter((s) => s.semester === sem);
    if (semStudents.length === 0) return null;

    const avgAtt = Math.round(
      (semStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / semStudents.length) * 10
    ) / 10;
    const avgCredits = Math.round(
      (semStudents.reduce((acc, s) => acc + s.creditsObtained, 0) / semStudents.length) * 10
    ) / 10;
    const shortage = semStudents.filter((s) => s.attendancePercentage < 75).length;

    return {
      semester: sem,
      count: semStudents.length,
      avgAttendance: avgAtt,
      avgCredits,
      shortage,
    };
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      
      {/* Class Section Breakdown */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2563EB]" />
            <span>Class & Section Performance Matrix</span>
          </h3>
          <p className="text-xs text-[#64748B]">
            Compare attendance discipline and average credits obtained across active class sections
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-[11px] font-bold text-[#64748B] uppercase border-b border-[#E2E8F0]">
                <th className="py-3 px-4">Class Section</th>
                <th className="py-3 px-3 text-center">Enrolled Strength</th>
                <th className="py-3 px-4">Class Avg Attendance</th>
                <th className="py-3 px-4 text-center">Avg Credits Obtained</th>
                <th className="py-3 px-3 text-center">Safe (&ge;75%)</th>
                <th className="py-3 px-3 text-center">Attendance Shortage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {classStats.map((c) => {
                const isSafe = c.avgAttendance >= 75;
                return (
                  <tr key={c.className} className="hover:bg-[#F8FAFC] transition">
                    <td className="py-3 px-4 font-bold text-[#0F172A] text-sm">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                        {c.className}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-[#64748B]">
                      {c.count} students
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold text-sm ${isSafe ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                          {c.avgAttendance}%
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">section average</span>
                      </div>
                      <div className="w-36 bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isSafe ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}
                          style={{ width: `${Math.min(100, c.avgAttendance)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-[#2563EB] text-sm">
                        {c.avgCredits.toFixed(1)} Cr
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[#059669] bg-[#ECFDF5] font-bold border border-emerald-200">
                        {c.safeCount}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {c.shortageCount > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[#DC2626] bg-[#FEF2F2] font-bold border border-rose-200">
                          {c.shortageCount} at risk
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] font-medium">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectClass(c.className)}
                        className="px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-[#EFF6FF] rounded-md transition"
                      >
                        View Students &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Semester Cohort Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <h3 className="font-bold text-sm text-[#0F172A] mb-3 flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-[#2563EB]" />
            <span>Semester-Wise Attendance Trends</span>
          </h3>

          <div className="space-y-3">
            {semesterStats.map((s: any) => (
              <div key={s.semester} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#64748B]">Semester {s.semester} ({s.count} students)</span>
                  <span className={s.avgAttendance >= 75 ? 'text-[#059669] font-bold' : 'text-[#D97706] font-bold'}>
                    {s.avgAttendance}% Avg
                  </span>
                </div>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${s.avgAttendance >= 75 ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}
                    style={{ width: `${Math.min(100, s.avgAttendance)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <h3 className="font-bold text-sm text-[#0F172A] mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#2563EB]" />
            <span>Semester-Wise Average Credits Earned</span>
          </h3>

          <div className="space-y-3">
            {semesterStats.map((s: any) => (
              <div key={s.semester} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#64748B]">Semester {s.semester}</span>
                  <span className="text-[#2563EB] font-mono font-bold">{s.avgCredits.toFixed(1)} Credits Avg</span>
                </div>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2563EB] rounded-full"
                    style={{ width: `${Math.min(100, (s.avgCredits / 26) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
