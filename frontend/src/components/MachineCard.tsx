'use client';

import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Machine } from '../types';

interface MachineCardProps {
  machine: Machine;
}

export const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  const isOuter = machine.status === 'OUTER_RACE_FAULT';
  const isInner = machine.status === 'INNER_RACE_FAULT';
  const isHealthy = machine.status === 'HEALTHY';

  // Dynamic Border & Color Scheme based on 3 classes
  let cardBorder = 'border-slate-800 hover:border-slate-700';
  let vibTextColor = 'text-emerald-400';
  let tempTextColor = 'text-emerald-400';
  let healthTextColor = 'text-emerald-400';
  let vibChartColor = '#10b981';
  let tempChartColor = '#10b981';

  if (isOuter) {
    cardBorder = 'border-red-600 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
    vibTextColor = 'text-red-400';
    tempTextColor = 'text-red-400';
    healthTextColor = 'text-red-400';
    vibChartColor = '#ef4444';
    tempChartColor = '#ef4444';
  } else if (isInner) {
    cardBorder = 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
    vibTextColor = 'text-amber-400';
    tempTextColor = 'text-amber-400';
    healthTextColor = 'text-amber-400';
    vibChartColor = '#f59e0b';
    tempChartColor = '#f59e0b';
  }

  // Generate lightweight SVG path for sparkline
  const makeSvgPath = (points: number[], minVal: number, maxVal: number) => {
    if (!points || points.length === 0) return '';
    const width = 180;
    const height = 40;
    const step = width / (points.length - 1);
    const range = maxVal - minVal || 1;

    return points
      .map((p, idx) => {
        const x = idx * step;
        const normalizedY = 1 - (p - minVal) / range;
        const y = Math.max(2, Math.min(height - 2, normalizedY * height));
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const vibPath = makeSvgPath(machine.historyVibRms, 0, 3.5);
  const tempPath = makeSvgPath(machine.historyTemp, 25, 55);

  return (
    <div
      className={`rounded-2xl bg-[#0f1523] border ${cardBorder} p-5 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px]`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-bold text-white text-base font-mono tracking-tight">
            {machine.name}
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">{machine.location}</p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{machine.runDuration}</span>
        </div>
      </div>

      {/* 2 Sparkline Charts Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Sparkline 1: Getaran RMS */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400">TREN GETARAN RMS</span>
            <span className={`font-bold ${vibTextColor}`}>
              {machine.vibrationRms.toFixed(2)} mm/s {isOuter && '▲'}
            </span>
          </div>

          <div className="relative h-11 w-full">
            {/* ISO 2.80 Threshold Dashed Line */}
            <div className="absolute top-[20%] left-0 right-0 border-t border-dashed border-red-500/80 z-0">
              <span className="absolute -top-3 left-0 text-[8px] text-red-400 font-mono">
                ISO 2.80
              </span>
            </div>

            <svg viewBox="0 0 180 40" className="w-full h-full relative z-10" fill="none">
              <path d={vibPath} stroke={vibChartColor} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Sparkline 2: Suhu Bantalan */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400">TREN SUHU BANTALAN</span>
            <span className={`font-bold ${tempTextColor}`}>
              {machine.temperature.toFixed(1)} °C {isOuter && '▲'}
            </span>
          </div>

          <div className="relative h-11 w-full">
            {/* MAX 45°C Threshold Dashed Line */}
            <div className="absolute top-[30%] left-0 right-0 border-t border-dashed border-red-500/80 z-0">
              <span className="absolute -top-3 left-0 text-[8px] text-red-400 font-mono">
                MAX 45°C
              </span>
            </div>

            <svg viewBox="0 0 180 40" className="w-full h-full relative z-10" fill="none">
              <path d={tempPath} stroke={tempChartColor} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[10px] text-slate-400 font-mono">Vibration RMS</p>
          <p className={`font-bold text-sm font-mono ${vibTextColor}`}>
            {machine.vibrationRms.toFixed(2)} mm/s
          </p>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[10px] text-slate-400 font-mono">Spindle Temp</p>
          <p className={`font-bold text-sm font-mono ${tempTextColor}`}>
            {machine.temperature.toFixed(1)} °C
          </p>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[10px] text-slate-400 font-mono">Health Index</p>
          <p className={`font-bold text-sm font-mono ${healthTextColor}`}>
            {machine.healthIndex}%
          </p>
        </div>
      </div>

      {/* Button to Detail Diagnostik */}
      <Link
        href={`/machine/${machine.id}`}
        className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-center text-xs font-semibold text-slate-200 border border-slate-700 transition-all hover:border-slate-600 block shadow-sm"
      >
        Detail Diagnostik
      </Link>
    </div>
  );
};
