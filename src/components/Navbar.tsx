import React from 'react';
import { 
  UserPlus, 
  CheckSquare, 
  FileSpreadsheet, 
  RotateCcw,
  Search
} from 'lucide-react';

interface NavbarProps {
  onAddStudent: () => void;
  onOpenQuickAttendance: () => void;
  onOpenExportImport: () => void;
  onResetData: () => void;
  totalStudents: number;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddStudent,
  onOpenQuickAttendance,
  onOpenExportImport,
  onResetData,
  totalStudents,
  searchTerm = '',
  onSearchChange,
}) => {
  return (
    <nav className="h-16 bg-white border-b border-[#CBD5E1] px-4 sm:px-8 flex items-center justify-between z-20 text-[#1E293B]">
      
      {/* Brand & Geometric Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#2563EB] flex items-center justify-center rounded-lg shadow-sm">
          <div className="w-5 h-5 border-2 border-white rotate-45"></div>
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-[#0F172A]">
            ACADEMIA <span className="text-[#2563EB]">ERP</span>
          </span>
        </div>
      </div>

      {/* Center / Search & User Info */}
      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* Global search input */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-4 py-1.5 text-sm w-48 lg:w-64 focus:outline-none focus:ring-1 focus:ring-[#2563EB] text-[#1E293B] placeholder-[#94A3B8]"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            id="btn-quick-attendance"
            onClick={onOpenQuickAttendance}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1] transition"
            title="Batch mark class attendance"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Attendance Log</span>
          </button>

          <button
            id="btn-export-import"
            onClick={onOpenExportImport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1] transition"
            title="Import or Export Student Records"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Data / CSV</span>
          </button>

          <button
            id="btn-add-student"
            onClick={onAddStudent}
            className="inline-flex items-center gap-1.5 bg-[#2563EB] text-white px-3.5 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Student</span>
          </button>

          <button
            id="btn-reset-demo"
            onClick={onResetData}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-md transition"
            title="Reset to Default Demo Records"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Registrar Office User Profile */}
        <div className="hidden lg:flex items-center gap-3 border-l border-[#CBD5E1] pl-6">
          <div className="text-right">
            <p className="text-xs font-semibold leading-none text-[#0F172A]">Dr. Robert Wilson</p>
            <p className="text-[10px] text-[#64748B]">Registrar Office</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center text-xs font-bold text-[#475569]">
            RW
          </div>
        </div>

      </div>

    </nav>
  );
};
