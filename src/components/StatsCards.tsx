import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ERPStats } from '../types';

interface StatsCardsProps {
  stats: ERPStats;
  onFilterShortage: () => void;
  onFilterSafe: () => void;
  onShowAll: () => void;
  currentAttendanceFilter: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  onFilterShortage,
  onFilterSafe,
  onShowAll,
  currentAttendanceFilter,
}) => {
  const performanceGrade = stats.shortageCount === 0 ? 'A+' : stats.shortageCount <= 2 ? 'A' : 'A-';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Total Students */}
      <div 
        id="stat-total-students"
        onClick={onShowAll}
        className={`bg-white p-5 border rounded-xl shadow-xs transition-all cursor-pointer hover:border-[#CBD5E1] ${
          currentAttendanceFilter === 'all' ? 'ring-2 ring-[#2563EB]/30 border-[#2563EB]' : 'border-[#E2E8F0]'
        }`}
      >
        <p className="text-[10px] uppercase text-[#64748B] font-bold tracking-widest">Total Students</p>
        <div className="flex items-baseline justify-between mt-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">{stats.totalStudents.toLocaleString()}</h2>
          <span className="text-xs font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">8 SEMS</span>
        </div>
        <p className="text-[11px] text-[#64748B] mt-2 flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
          <span>Active Academic Registry</span>
        </p>
      </div>

      {/* 2. Avg Attendance */}
      <div 
        id="stat-avg-attendance"
        onClick={onShowAll}
        className="bg-white p-5 border border-[#E2E8F0] rounded-xl shadow-xs hover:border-[#CBD5E1] transition-all cursor-pointer"
      >
        <p className="text-[10px] uppercase text-[#64748B] font-bold tracking-widest">Avg. Attendance</p>
        <div className="flex items-baseline justify-between mt-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#10B981]">{stats.avgAttendance}%</h2>
          <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded">
            {stats.safeCount} Safe
          </span>
        </div>
        <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div 
            className="h-full bg-[#10B981] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, stats.avgAttendance)}%` }}
          />
        </div>
        <p className="text-[11px] text-[#64748B] mt-1.5 font-medium">
          Requirement threshold &ge; 75%
        </p>
      </div>

      {/* 3. Total Credits */}
      <div 
        id="stat-avg-credits"
        className="bg-white p-5 border border-[#E2E8F0] rounded-xl shadow-xs hover:border-[#CBD5E1] transition-all"
      >
        <p className="text-[10px] uppercase text-[#64748B] font-bold tracking-widest">Total Credits</p>
        <div className="flex items-baseline justify-between mt-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#2563EB]">
            {(stats.avgCredits * stats.totalStudents).toFixed(1)}k
          </h2>
          <span className="text-xs font-mono text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded font-bold">
            {stats.avgCredits} / sem
          </span>
        </div>
        <p className="text-[11px] text-[#64748B] mt-2 flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
          <span>Degree Milestone: 160.0 cr</span>
        </p>
      </div>

      {/* 4. Performance Index (Dark Geometric Card) */}
      <div 
        id="stat-performance-index"
        onClick={onFilterShortage}
        className={`bg-[#0F172A] p-5 rounded-xl flex items-center justify-between shadow-md cursor-pointer transition-all hover:ring-2 hover:ring-[#2563EB] ${
          currentAttendanceFilter === 'shortage' ? 'ring-2 ring-[#EF4444]' : ''
        }`}
      >
        <div>
          <p className="text-[10px] uppercase text-[#94A3B8] font-bold tracking-widest">Performance Index</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white">{performanceGrade}</h2>
            {stats.shortageCount > 0 && (
              <span className="text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/20 px-2 py-0.5 rounded">
                {stats.shortageCount} Shortage
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-2 font-medium">
            {stats.shortageCount === 0 ? 'Full Exam Eligibility' : 'Click to inspect risk list'}
          </p>
        </div>

        {/* Geometric Rotating Circle Indicator */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#1E293B] border-t-[#2563EB] rounded-full rotate-45 animate-spin-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-[#94A3B8]">
            ERP
          </div>
        </div>
      </div>

    </div>
  );
};
