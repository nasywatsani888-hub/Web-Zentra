'use client';

import React from 'react';

interface StatCardsProps {
  totalMachines: number;
  normalCount: number;
  actionRequiredCount: number;
  averageSpindleHealth: number;
}

export const StatCards: React.FC<StatCardsProps> = ({
  totalMachines,
  normalCount,
  actionRequiredCount,
  averageSpindleHealth,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Machines */}
      <div className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800/80 shadow-md">
        <p className="text-xs text-slate-400 font-mono mb-1">Total Machines</p>
        <p className="text-3xl font-extrabold text-white font-mono">{totalMachines}</p>
      </div>

      {/* 2. Normal (Healthy) */}
      <div className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800/80 shadow-md">
        <p className="text-xs text-slate-400 font-mono mb-1">Normal / Healthy:</p>
        <p className="text-3xl font-extrabold text-emerald-400 font-mono">{normalCount}</p>
      </div>

      {/* 3. Action Required */}
      <div className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800/80 shadow-md">
        <p className="text-xs text-slate-400 font-mono mb-1">Action required:</p>
        <p className="text-3xl font-extrabold text-orange-400 font-mono">{actionRequiredCount}</p>
      </div>

      {/* 4. Average Spindle Health */}
      <div className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800/80 shadow-md">
        <p className="text-xs text-slate-400 font-mono mb-1">Average Spindle Health:</p>
        <p className="text-3xl font-extrabold text-cyan-400 font-mono">{averageSpindleHealth}%</p>
      </div>
    </div>
  );
};
