'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { AlertBanner } from '../../components/AlertBanner';
import { StatCards } from '../../components/StatCards';
import { useZentraStream } from '../../hooks/useZentraStream';
import { Machine } from '../../types';

export default function SpindleDiagnosticPage() {
  const { machines } = useZentraStream();

  // Aggregate stats
  const totalMachines = machines.length;
  const normalCount = machines.filter((m) => m.status === 'HEALTHY').length;
  const actionRequiredCount = machines.filter((m) => m.status !== 'HEALTHY').length;
  const averageSpindleHealth = Math.round(
    machines.reduce((acc, m) => acc + (m.healthIndex || 85), 0) / (totalMachines || 1)
  );

  const highestCriticalMachine = machines.find((m) => m.status === 'OUTER_RACE_FAULT') || machines[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <Header title="Spindle Diagnostic" />

      {/* Alert Banner */}
      {highestCriticalMachine?.status === 'OUTER_RACE_FAULT' && (
        <AlertBanner
          urgencyText="HIGH URGENCY"
          machineName={highestCriticalMachine.name}
          message={
            highestCriticalMachine.anomalyMessage ||
            'N2 bearing vibration exceeds ISO limit (BPFO: 142 Hz). Recommended technical response: within 4 hours.'
          }
        />
      )}

      {/* 4 Stat Cards */}
      <StatCards
        totalMachines={totalMachines}
        normalCount={normalCount}
        actionRequiredCount={actionRequiredCount}
        averageSpindleHealth={averageSpindleHealth}
      />

      {/* 2x2 Grid Spindle Machine Cards (Matches Mockup 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {machines.map((machine) => {
          const isOuter = machine.status === 'OUTER_RACE_FAULT';
          const isInner = machine.status === 'INNER_RACE_FAULT';

          let badgeText = 'Normal';
          let badgeClass = 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400';
          let vibTextColor = 'text-emerald-400';
          let tempTextColor = 'text-emerald-400';
          let healthTextColor = 'text-emerald-400';

          if (isOuter) {
            badgeText = 'Urgent';
            badgeClass = 'border-red-600 bg-red-950/40 text-red-400';
            vibTextColor = 'text-red-400';
            tempTextColor = 'text-red-400';
            healthTextColor = 'text-red-400';
          } else if (isInner) {
            badgeText = 'Medium';
            badgeClass = 'border-amber-500 bg-amber-950/40 text-amber-400';
            vibTextColor = 'text-amber-400';
            tempTextColor = 'text-amber-400';
            healthTextColor = 'text-amber-400';
          }

          return (
            <div
              key={machine.id}
              className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-base font-mono tracking-tight">
                  {machine.name}
                </h3>
                <span className={`px-4 py-0.5 rounded-md text-xs font-mono font-bold border ${badgeClass}`}>
                  {badgeText}
                </span>
              </div>

              {/* 3D Spindle Photo with Glowing Hotspot */}
              <div className="relative w-full aspect-[2/1] my-3 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/spindle-horizontal.png"
                  alt={machine.name}
                  className="w-full max-h-36 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
                />

                {/* Glowing Hotspot over Front Bearing if Urgent */}
                {isOuter && (
                  <div className="absolute right-[27%] top-[50%] -translate-y-1/2 w-12 h-12 rounded-full bg-red-500/50 border-2 border-red-500 animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.95)]" />
                )}

                {/* Subtle Amber Hotspot over Rear Bearing if Medium */}
                {isInner && (
                  <div className="absolute left-[30%] top-[50%] -translate-y-1/2 w-10 h-10 rounded-full bg-amber-500/40 border border-amber-400 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
                )}
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

              {/* Detail Diagnostik Button */}
              <Link
                href={`/machine/${machine.id}`}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-center text-xs font-semibold text-slate-200 border border-slate-700 transition-all block shadow-sm font-mono"
              >
                Detail Diagnostik
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
