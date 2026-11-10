'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '../../components/Header';
import { StatCards } from '../../components/StatCards';
import { useZentraStream } from '../../hooks/useZentraStream';

export default function DeviceRegistryPage() {
  const { machines } = useZentraStream();
  const [searchTerm, setSearchTerm] = useState('');

  // Aggregate stats
  const totalMachines = machines.length;
  const normalCount = machines.filter((m) => m.status === 'HEALTHY').length;
  const actionRequiredCount = machines.filter((m) => m.status !== 'HEALTHY').length;
  const averageSpindleHealth = Math.round(
    machines.reduce((acc, m) => acc + (m.healthIndex || 85), 0) / (totalMachines || 1)
  );

  const filteredMachines = machines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.deviceIp.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <Header title="Device Registry" />

      {/* 4 Stat Cards */}
      <StatCards
        totalMachines={totalMachines}
        normalCount={normalCount}
        actionRequiredCount={actionRequiredCount}
        averageSpindleHealth={averageSpindleHealth}
      />

      {/* Search Input Box (Matches Mockup 3) */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search machines"
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1e2533] border border-slate-700/80 text-slate-200 font-mono text-sm placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {/* Table with Blue Accent Theme (Matches Mockup 3) */}
      <div className="rounded-2xl bg-[#0f1725] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr className="bg-[#152338] text-slate-300 text-xs font-semibold border-b border-slate-700">
                <th className="px-6 py-4">Machine</th>
                <th className="px-6 py-4">Device ID</th>
                <th className="px-6 py-4">Device IP Address</th>
                <th className="px-6 py-4">Connection</th>
                <th className="px-6 py-4">Last Data Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMachines.map((m, idx) => (
                <tr
                  key={idx}
                  className="bg-[#0b172a] hover:bg-[#12243d] transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-slate-100">{m.name}</td>
                  <td className="px-6 py-4 text-slate-300">{m.deviceId}</td>
                  <td className="px-6 py-4 text-slate-300">{m.deviceIp}</td>
                  <td className="px-6 py-4">
                    <span className="px-3.5 py-1 rounded-md bg-[#0d3b26] border border-emerald-500/50 text-emerald-400 text-xs font-bold">
                      Connected
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">21 Oct 2026 - 00:42:18</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
