'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AlertBannerProps {
  urgencyText?: string;
  machineName?: string;
  message?: string;
  onResolve?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  urgencyText = 'HIGH URGENCY',
  machineName = 'CNC Milling EVO-1',
  message = 'N2 bearing vibration exceeds ISO limit (BPFO: 142 Hz). Recommended technical response: within 4 hours.',
  onResolve,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-950/70 via-red-950/50 to-slate-900 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)] mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-2.5 py-0.5 rounded-md bg-orange-600/30 text-orange-300 font-bold text-xs tracking-wider border border-orange-500/40 font-mono">
            {urgencyText}
          </span>
          <span className="font-semibold text-slate-100 font-mono">{machineName}:</span>
          <span className="text-slate-300">{message}</span>
        </div>
      </div>

      <button
        onClick={onResolve}
        className="px-5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs tracking-wide shadow-md transition-all active:scale-95"
      >
        Resolve
      </button>
    </div>
  );
};
