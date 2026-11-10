'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { INITIAL_REPORTS, INITIAL_MACHINES } from '../../lib/initialData';
import { useZentraStream } from '../../hooks/useZentraStream';
import { Eye, Download, FileText, ChevronDown } from 'lucide-react';

export default function ShiftReportsPage() {
  const { machines } = useZentraStream();
  const [selectedMachine, setSelectedMachine] = useState('All Machines');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 24 Hours');
  const [previewReport, setPreviewReport] = useState<string | null>(null);

  const activeMachines = machines.length > 0 ? machines : INITIAL_MACHINES;

  // Generate real CSV download
  const handleDownloadCsv = (reportTitle: string) => {
    const headers = [
      'Machine ID',
      'Machine Name',
      'Device ID',
      'Location',
      'Status Diagnosa AI',
      'Vibration RMS (mm/s)',
      'Spindle Temp (C)',
      'Health Index (%)',
      'Anomaly Message',
      'Rekomendasi Pemeliharaan',
    ];

    const rows = activeMachines.map((m) => [
      m.id,
      `"${m.name}"`,
      m.deviceId,
      `"${m.location}"`,
      m.status,
      m.vibrationRms,
      m.temperature,
      m.healthIndex,
      `"${m.anomalyMessage || 'None'}"`,
      `"${m.recommendation || 'Standard Routine'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ZENTRA_${reportTitle.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <Header title="Shift reports" />

      {/* Filter Row (Matches Mockup 5) */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Machine Dropdown */}
        <div className="relative">
          <div className="px-5 py-3 rounded-2xl bg-[#1e2533] border border-slate-700/80 text-xs font-mono text-slate-200 flex items-center gap-6 cursor-pointer">
            <div>
              <p className="text-[10px] text-slate-400">Machine</p>
              <p className="font-semibold">{selectedMachine}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Period Dropdown */}
        <div className="relative">
          <div className="px-5 py-3 rounded-2xl bg-[#1e2533] border border-slate-700/80 text-xs font-mono text-slate-200 flex items-center gap-6 cursor-pointer">
            <div>
              <p className="text-[10px] text-slate-400">Period</p>
              <p className="font-semibold">{selectedPeriod}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Machine Data Log Header */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="font-mono text-base font-bold text-white tracking-tight">
          Machine Data Log
        </h3>
        <span className="text-xs font-mono text-slate-400">12 Machines</span>
      </div>

      {/* List of Report Items with Blue Theme (Matches Mockup 5) */}
      <div className="space-y-3">
        {INITIAL_REPORTS.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-2xl bg-[#0b1b30] border border-sky-900/60 hover:border-sky-700/80 flex flex-wrap items-center justify-between gap-4 transition-all shadow-md"
          >
            {/* Left: Icon & Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#122b4d] border border-sky-700/50 flex items-center justify-center text-sky-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white font-mono text-sm tracking-tight">
                  {report.title}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{report.dateRange}</p>
              </div>
            </div>

            {/* Right: View & Download Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewReport(report.title)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#122b4d] hover:bg-[#1a3d6e] text-xs font-mono font-medium text-slate-200 border border-sky-600/40 transition-colors shadow-sm"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>View</span>
              </button>

              <button
                onClick={() => handleDownloadCsv(report.title)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#122b4d] hover:bg-[#1a3d6e] text-xs font-mono font-medium text-slate-200 border border-sky-600/40 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview if View is clicked */}
      {previewReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#0f1725] border border-slate-700 space-y-4">
            <h4 className="font-bold text-white font-mono text-base">{previewReport}</h4>
            <p className="text-xs text-slate-400 font-mono">
              Ringkasan telemetri shift: 4 mesin aktif, rata-rata vibrasi 1.58 mm/s, rata-rata suhu 41.7°C, 1 peringatan outer race limit ISO terlampaui.
            </p>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-mono text-xs hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
