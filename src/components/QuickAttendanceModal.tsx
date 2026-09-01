import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  UserCheck, 
  UserX, 
  Calendar, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { StudentRecord } from '../types';

interface QuickAttendanceModalProps {
  students: StudentRecord[];
  classesList: string[];
  isOpen: boolean;
  onClose: () => void;
  onSaveBatchAttendance: (updates: { studentId: string; wasPresent: boolean }[]) => void;
}

export const QuickAttendanceModal: React.FC<QuickAttendanceModalProps> = ({
  students,
  classesList,
  isOpen,
  onClose,
  onSaveBatchAttendance,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(classesList[0] || 'CSE-5A');
  const [sessionSubject, setSessionSubject] = useState('Core Subject Lecture');
  
  // Filter students by selected class
  const classStudents = students.filter((s) => s.className === selectedClass);

  // Present/Absent map
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});

  // When class changes or modal opens, initialize everyone to Present (true)
  React.useEffect(() => {
    const initialMap: Record<string, boolean> = {};
    classStudents.forEach((s) => {
      initialMap[s.id] = true;
    });
    setAttendanceMap(initialMap);
  }, [selectedClass, isOpen]);

  if (!isOpen) return null;

  const toggleStudent = (id: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const markAll = (present: boolean) => {
    const updated: Record<string, boolean> = {};
    classStudents.forEach((s) => {
      updated[s.id] = present;
    });
    setAttendanceMap(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates = classStudents.map((s) => ({
      studentId: s.id,
      wasPresent: attendanceMap[s.id] !== false,
    }));
    onSaveBatchAttendance(updates);
    onClose();
  };

  const presentCount = classStudents.filter((s) => attendanceMap[s.id] !== false).length;
  const absentCount = classStudents.length - presentCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#10B981] flex items-center justify-center font-bold text-white">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                Daily Class Attendance Logger
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Log session attendance for an entire class section in one click
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-[#0F172A]">
          
          {/* Class Selector & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">
                Select Class / Section
              </label>
              <select
                id="select-attendance-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold bg-white border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              >
                {classesList.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} ({students.filter((s) => s.className === cls).length} students)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">
                Lecture / Lab Session
              </label>
              <input
                type="text"
                value={sessionSubject}
                onChange={(e) => setSessionSubject(e.target.value)}
                placeholder="e.g. DBMS Lecture 24"
                className="w-full px-3 py-2 text-sm font-medium bg-white border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Quick Stats & Select All / Deselect All */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="text-[#64748B]">Enrolled: <strong className="text-[#0F172A]">{classStudents.length}</strong></span>
              <span className="text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                Present: <strong>{presentCount}</strong>
              </span>
              <span className="text-[#991B1B] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                Absent: <strong>{absentCount}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => markAll(true)}
                className="text-xs font-bold text-[#059669] hover:bg-[#ECFDF5] px-2.5 py-1 rounded border border-[#A7F3D0] transition"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => markAll(false)}
                className="text-xs font-bold text-[#DC2626] hover:bg-[#FEF2F2] px-2.5 py-1 rounded border border-[#FECACA] transition"
              >
                All Absent
              </button>
            </div>
          </div>

          {/* Student Attendance List */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#F1F5F9] max-h-64 overflow-y-auto">
            {classStudents.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#94A3B8]">
                No students enrolled in {selectedClass}. Select another class or enroll students.
              </div>
            ) : (
              classStudents.map((student) => {
                const isPresent = attendanceMap[student.id] !== false;
                return (
                  <div
                    key={student.id}
                    onClick={() => toggleStudent(student.id)}
                    className={`flex items-center justify-between p-3 cursor-pointer transition select-none ${
                      isPresent ? 'bg-white hover:bg-[#F8FAFC]' : 'bg-[#FEF2F2]/60 hover:bg-[#FEF2F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                        isPresent ? 'bg-[#0F172A] text-white' : 'bg-[#FEE2E2] text-[#991B1B]'
                      }`}>
                        {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#0F172A] leading-tight">
                          {student.name}
                        </div>
                        <div className="text-xs text-[#64748B] font-mono">
                          {student.rollNumber} &bull; Current: {student.attendancePercentage}%
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition ${
                        isPresent 
                          ? 'bg-[#10B981] hover:bg-[#059669] text-white' 
                          : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
                      }`}
                    >
                      {isPresent ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>PRESENT</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-3.5 h-3.5" />
                          <span>ABSENT</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={classStudents.length === 0}
              id="submit-attendance-batch-btn"
              className="px-5 py-2 text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white rounded-lg transition shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Record & Update {classStudents.length} Students</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
