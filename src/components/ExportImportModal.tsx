import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  RotateCcw, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { StudentRecord } from '../types';
import { exportToCSV } from '../utils/erpCalculations';

interface ExportImportModalProps {
  students: StudentRecord[];
  isOpen: boolean;
  onClose: () => void;
  onImportData: (newStudents: StudentRecord[]) => void;
  onResetToDefault: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  students,
  isOpen,
  onClose,
  onImportData,
  onResetToDefault,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `College_ERP_Records_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportData(parsed);
            setImportStatus(`Successfully imported ${parsed.length} student records!`);
            setTimeout(() => {
              onClose();
            }, 1200);
          } else {
            setImportStatus('Error: JSON file must contain an array of student records.');
          }
        } catch (err) {
          setImportStatus('Error: Invalid JSON file format.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#2563EB] flex items-center justify-center font-bold text-white">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                ERP Data Management & Export
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Backup, export to CSV/JSON, or import student enrollment registries
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

        {/* Body */}
        <div className="p-6 space-y-6 text-[#0F172A] text-sm">
          
          {/* Status Message */}
          {importStatus && (
            <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
              importStatus.startsWith('Error') 
                ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]' 
                : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
            }`}>
              <Check className="w-4 h-4" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Export Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              1. Export ERP Student Registry
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-download-csv"
                onClick={() => exportToCSV(students)}
                className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] bg-[#F8FAFC] hover:bg-[#EFF6FF] text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A] text-sm">Export to CSV</span>
                  <Download className="w-4 h-4 text-[#2563EB] group-hover:translate-y-0.5 transition" />
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Download structured spreadsheet of all {students.length} student records for Excel/Sheets.
                </p>
              </button>

              <button
                id="btn-download-json"
                onClick={handleExportJSON}
                className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] bg-[#F8FAFC] hover:bg-[#EFF6FF] text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A] text-sm">Export to JSON</span>
                  <Download className="w-4 h-4 text-[#2563EB] group-hover:translate-y-0.5 transition" />
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Full ERP system backup including all semester course breakdowns and metadata.
                </p>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              2. Import Registry Backup
            </h4>
            <div className="p-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-center">
              <Upload className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="px-3.5 py-1.5 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs inline-block transition shadow-sm">
                  Choose JSON Backup File
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-[#94A3B8] mt-1.5">
                Load previously exported .json ERP file
              </p>
            </div>
          </div>

          {/* Reset Section */}
          <div className="space-y-2 pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs text-[#0F172A]">Restore Default University Sample Data</h5>
                <p className="text-[11px] text-[#64748B]">Reset to initial realistic student cohort records</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onResetToDefault();
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-bold text-[#334155] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-md transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#E2E8F0] rounded-md transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
