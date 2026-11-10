'use client';

import React from 'react';
import { Header } from '../../components/Header';
import { useZentraStream } from '../../hooks/useZentraStream';
import { INITIAL_MACHINES } from '../../lib/initialData';

export default function ServiceLogPage() {
  const { machines } = useZentraStream();
  const faultyMachines = (machines.length > 0 ? machines : INITIAL_MACHINES).filter(
    (m) => m.status !== 'HEALTHY'
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Header title="Service Log" />

      <div>
        <h3 className="font-mono text-sm font-semibold text-slate-300 tracking-wider mb-4">
          Recommended Maintennace :
        </h3>

        {/* 2x2 Grid of Service Cards (Matches Mockup 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {faultyMachines.map((m) => {
            const isUrgent = m.status === 'OUTER_RACE_FAULT';

            return (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                {/* Header row: Machine Name, Device ID, Timestamp, Urgent badge */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-800/80 mb-4">
                  <div>
                    <h4 className="font-bold text-white font-mono text-sm tracking-tight">
                      {m.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>Device ID: {m.deviceId}</span>
                      <span>·</span>
                      <span>24 Oct 2026, 10:42</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-0.5 rounded-md text-xs font-mono font-bold border ${
                      isUrgent
                        ? 'bg-red-950/60 border-red-500/60 text-red-400'
                        : 'bg-amber-950/60 border-amber-500/60 text-amber-400'
                    }`}
                  >
                    {isUrgent ? 'Urgent' : 'Medium'}
                  </span>
                </div>

                {/* Body: Left Vertical Cutaway Spindle Photo + Right Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Left Column: Vertical Cutaway Photo with Glowing Hotspot */}
                  <div className="relative w-full aspect-[3/4] max-h-56 rounded-xl bg-slate-950/60 p-2 flex items-center justify-center overflow-hidden border border-slate-800/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/spindle-cutaway.png"
                      alt="Vertical Spindle Cutaway"
                      className="h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                    />

                    {/* Glowing Red Hotspot on Front Lower Bearing Area */}
                    <div className="absolute left-[36%] bottom-[16%] w-10 h-10 rounded-full bg-red-500/50 border-2 border-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.95)]" />
                  </div>

                  {/* Right Column: Maintenance & Indicator Details */}
                  <div className="space-y-4 font-mono">
                    {/* 1. Component Title */}
                    <div>
                      <h5 className="font-bold text-white text-sm">Front Bearing</h5>
                      <p className="text-xs text-slate-400">Spindle · N2 · Front side</p>
                    </div>

                    {/* 2. Maintenance Reminder */}
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Maintenance Reminder</p>
                      <p className="text-xs text-slate-400">
                        Suggested inspection: {m.suggestedInspection}
                      </p>
                    </div>

                    {/* 3. Condition Indicators */}
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1.5">Condition Indicators</p>
                      <div className="space-y-2">
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                          <p className="text-[10px] text-slate-400">Vibration RMS</p>
                          <p className="font-bold text-sm text-red-400">
                            {m.vibrationRms.toFixed(2)} mm/s
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                          <p className="text-[10px] text-slate-400">Spindle Temp</p>
                          <p className="font-bold text-sm text-red-400">
                            {m.temperature.toFixed(1)} °C
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
