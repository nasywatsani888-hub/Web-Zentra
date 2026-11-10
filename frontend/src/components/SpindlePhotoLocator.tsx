'use client';

import React from 'react';

interface SpindlePhotoLocatorProps {
  machineId?: string;
  isN1Fault?: boolean;
  isN2Fault?: boolean;
  className?: string;
}

export const SpindlePhotoLocator: React.FC<SpindlePhotoLocatorProps> = ({
  machineId = 'CNC-003',
  isN1Fault = false,
  isN2Fault = true,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full rounded-2xl bg-[#0f1523] border border-slate-800 p-6 flex flex-col items-center justify-between min-h-[290px] overflow-hidden ${className}`}
    >
      {/* Container Image & Pins */}
      <div className="relative w-full max-w-[520px] aspect-[16/9] flex items-center justify-center my-auto">
        {/* Real 3D Spindle Image from User's Design */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/spindle-horizontal.png"
          alt="CNC Spindle Unit"
          className="w-full h-auto object-contain select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
        />

        {/* ============================================================ */}
        {/* PIN N1: REAR BEARING (Blue)                                  */}
        {/* ============================================================ */}
        <div className="absolute top-[8%] left-[6%] z-10 flex flex-col items-start pointer-events-none">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0f172a]/95 border border-sky-400/60 shadow-lg backdrop-blur-md">
            <span className="font-bold text-sky-400 font-mono text-xs">N1</span>
            <span className="text-xs font-medium text-slate-100">Rear Bearing</span>
            {isN1Fault && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          {/* Pointer line & dot to rear bearing position */}
          <svg className="w-24 h-16 -mt-1 ml-4 overflow-visible" fill="none">
            <path
              d="M 12 0 L 12 28 L 52 48"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <circle cx="52" cy="48" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* ============================================================ */}
        {/* PIN N2: FRONT BEARING (Orange / Amber)                       */}
        {/* ============================================================ */}
        <div className="absolute top-[8%] right-[8%] z-10 flex flex-col items-end pointer-events-none">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0f172a]/95 border border-amber-500/80 shadow-lg backdrop-blur-md">
            <span className="font-bold text-amber-400 font-mono text-xs">N2</span>
            <span className="text-xs font-medium text-slate-100">Front Bearing</span>
            {isN2Fault && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          {/* Pointer line & dot to front bearing position */}
          <svg className="w-24 h-16 -mt-1 mr-4 overflow-visible" fill="none">
            <path
              d="M 80 0 L 80 28 L 32 46"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <circle cx="32" cy="46" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Glowing circle hotspot on N2 front bearing if fault detected */}
        {isN2Fault && (
          <div
            className="absolute right-[27%] top-[48%] -translate-y-1/2 w-14 h-14 rounded-full bg-red-500/40 border-2 border-red-500 animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.9)] pointer-events-none"
          />
        )}
      </div>

      {/* Badge ID below spindle (e.g. CNC-003) */}
      <div className="mt-2">
        <span className="px-6 py-1 rounded-full bg-slate-100 text-slate-900 font-mono font-bold text-xs tracking-wider shadow-md">
          {machineId}
        </span>
      </div>
    </div>
  );
};
