'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Settings } from 'lucide-react';
import { INITIAL_MACHINES } from '../../../lib/initialData';
import { useZentraStream } from '../../../hooks/useZentraStream';
import { SpindlePhotoLocator } from '../../../components/SpindlePhotoLocator';
import { DualMonitoringChart } from '../../../components/DualMonitoringChart';
import { RadialGauge } from '../../../components/RadialGauge';

export default function MachineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { machines } = useZentraStream();
  const machine =
    machines.find((m) => m.id === resolvedParams.id) ||
    INITIAL_MACHINES.find((m) => m.id === resolvedParams.id) ||
    INITIAL_MACHINES[0];

  const isN2Fault = machine.status === 'OUTER_RACE_FAULT';
  const isN1Fault = machine.status === 'INNER_RACE_FAULT';

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* ============================================================ */}
      {/* TOP HEADER & ANOMALY DETECTION BANNER                        */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Machine Title & Back Arrow */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight">
              {machine.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono">Location: {machine.location}</p>
          </div>
        </div>

        {/* Anomaly Detection Banner (Red Dot + Warning) */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1c1316] border border-red-500/50 text-xs font-mono shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <div className="flex items-center gap-1.5 text-red-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Anomaly Detection</span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300 text-[11px]">
            {machine.anomalyMessage ||
              'An increase in vibration at the N2 bearing was detected at 14:21 (4.8 mm/s)'}
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 1: SENSOR OUTPUT TABLE (Left) + SPINDLE PHOTO (Right)    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Output Sensor Live Stream Table */}
        <div className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="font-bold text-slate-200">Output Sensor</span>
            <span className="text-slate-500">Friday, 24 October 2026</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="px-3.5 py-3">Time Stamp</th>
                  <th className="px-3.5 py-3">Temp (°C)</th>
                  <th className="px-3.5 py-3">N1 - Rear Bearing</th>
                  <th className="px-3.5 py-3">N2 - Front Bearing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {machine.telemetryLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="px-3.5 py-2.5 text-slate-400">{log.timestamp}</td>
                    <td className="px-3.5 py-2.5 text-slate-200 font-semibold">{log.temp} °C</td>
                    <td className="px-3.5 py-2.5 text-sky-400 font-semibold">{log.vibN1} mm/s</td>
                    <td className="px-3.5 py-2.5 text-amber-400 font-semibold">{log.vibN2} mm/s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3D Spindle Photo Locator with N1 and N2 Pins */}
        <SpindlePhotoLocator
          machineId={machine.id}
          isN1Fault={isN1Fault}
          isN2Fault={isN2Fault}
        />
      </div>

      {/* ============================================================ */}
      {/* ROW 2: TEMPERATURE & VIBRATION MONITORING DUAL CHART         */}
      {/* ============================================================ */}
      <DualMonitoringChart
        currentTemp={machine.temperature}
        currentVib={machine.vibrationRms}
      />

      {/* ============================================================ */}
      {/* ROW 3: MACHINE STATUS + 3 RADIAL GAUGES (SPEEDOMETERS)       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Machine Operating Status Card */}
        <div className="p-5 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Machine Operating Status</span>
            <span className="px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold">
              Running
            </span>
          </div>

          <div className="my-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <p className="font-bold text-white font-mono text-base">Machine Active</p>
              <p className="text-xs text-slate-400 font-mono">{machine.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-slate-800 text-slate-400">
            <div>
              <p className="text-[10px] text-slate-500">Operating State</p>
              <b className="text-slate-200">Running</b>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Monitoring</p>
              <b className="text-emerald-400">Active</b>
            </div>
          </div>
        </div>

        {/* 2. Temperature Radial Gauge */}
        <RadialGauge
          label="Temperature"
          value={machine.temperature}
          max={100}
          unit="°C"
          color="#f97316"
        />

        {/* 3. Vibration N1 Radial Gauge (Rear Bearing) */}
        <RadialGauge
          label="Vibration N1"
          value={machine.vibrationN1}
          max={100}
          unit="mm/s"
          sublabel="Rear Bearing"
          color="#38bdf8"
        />

        {/* 4. Vibration N2 Radial Gauge (Front Bearing) */}
        <RadialGauge
          label="Vibration N2"
          value={machine.vibrationN2}
          max={100}
          unit="mm/s"
          sublabel="Front Bearing"
          color="#f97316"
        />
      </div>
    </div>
  );
}
