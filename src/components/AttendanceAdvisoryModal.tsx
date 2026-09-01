import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle, 
  Info 
} from 'lucide-react';
import { StudentRecord } from '../types';
import { calculateAttendancePercentage, calculateAttendanceAdvisory } from '../utils/erpCalculations';

interface AttendanceAdvisoryModalProps {
  student: StudentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AttendanceAdvisoryModal: React.FC<AttendanceAdvisoryModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const [futureClassesToAttend, setFutureClassesToAttend] = useState<number>(5);
  const [futureMissed, setFutureMissed] = useState<number>(0);

  if (!isOpen || !student) return null;

  const currentAttended = student.attendedClasses;
  const currentTotal = student.totalClasses;
  const currentPct = student.attendancePercentage;

  const advisory = calculateAttendanceAdvisory(currentAttended, currentTotal);

  // Simulation calculations
  const simAttended = currentAttended + futureClassesToAttend;
  const simTotal = currentTotal + futureClassesToAttend + futureMissed;
  const simPct = calculateAttendancePercentage(simAttended, simTotal);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#2563EB] flex items-center justify-center font-bold text-white">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                Attendance & Exam Eligibility Advisory
              </h3>
              <p className="text-xs text-[#94A3B8]">
                ERP 75% Rule Compliance & Simulation for {student.name}
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

        {/* Content */}
        <div className="p-6 space-y-5 text-[#0F172A] text-sm">
          
          {/* Current Status Box */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Current Record</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#0F172A]">{currentPct}%</span>
                <span className="text-xs text-[#64748B] font-semibold">
                  ({currentAttended} / {currentTotal} sessions)
                </span>
              </div>
              <span className="text-xs text-[#64748B]">{student.className} &bull; Semester {student.semester}</span>
            </div>

            <div className={`text-right px-3 py-1.5 rounded-md border text-xs font-bold ${
              currentPct >= 75 
                ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' 
                : 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
            }`}>
              {currentPct >= 75 ? 'ELIGIBLE (>=75%)' : 'SHORTAGE (<75%)'}
            </div>
          </div>

          {/* Official Advisory Output */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            advisory.type === 'eligible' 
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' 
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
          }`}>
            {advisory.type === 'eligible' ? (
              <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm mb-0.5">
                {advisory.type === 'eligible' ? 'Exam Requirement Cleared' : 'Shortage Remediation Needed'}
              </h4>
              <p className="text-xs font-medium leading-relaxed">
                {advisory.message}
              </p>
            </div>
          </div>

          {/* What-If Future Simulator */}
          <div className="pt-3 border-t border-[#E2E8F0]">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              <span>Interactive Attendance What-If Simulator</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Upcoming Classes Attended
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={futureClassesToAttend}
                    onChange={(e) => setFutureClassesToAttend(Number(e.target.value))}
                    className="w-full accent-[#2563EB]"
                  />
                  <span className="font-mono font-bold text-sm w-6 text-right text-[#2563EB]">
                    +{futureClassesToAttend}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Upcoming Classes Missed
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={futureMissed}
                    onChange={(e) => setFutureMissed(Number(e.target.value))}
                    className="w-full accent-[#DC2626]"
                  />
                  <span className="font-mono font-bold text-sm w-6 text-right text-[#DC2626]">
                    +{futureMissed}
                  </span>
                </div>
              </div>
            </div>

            {/* Projected Result Box */}
            <div className="p-3.5 rounded-xl bg-[#0F172A] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                  Projected Attendance Outcome
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className={`text-2xl font-black ${simPct >= 75 ? 'text-[#34D399]' : 'text-[#F87171]'}`}>
                    {simPct}%
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    ({simAttended} / {simTotal} total sessions)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  simPct >= 75 
                    ? 'bg-[#059669]/20 text-[#6EE7B7] border border-[#059669]/40' 
                    : 'bg-[#DC2626]/20 text-[#FCA5A5] border border-[#DC2626]/40'
                }`}>
                  {simPct >= 75 ? 'ELIGIBLE' : 'SHORTAGE'}
                </span>
                <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
                  {simPct >= currentPct ? `+${(simPct - currentPct).toFixed(1)}% gain` : `${(simPct - currentPct).toFixed(1)}% drop`}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Norms Note */}
          <div className="text-[11px] text-[#64748B] flex items-start gap-1.5 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
            <Info className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 mt-0.5" />
            <span>
              University Policy: Minimum 75% attendance is required per semester to appear for End-Semester Examinations. Condonation up to 65% is permitted only with authorized medical certificates.
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition shadow-sm"
          >
            Close Calculator
          </button>
        </div>

      </div>
    </div>
  );
};
