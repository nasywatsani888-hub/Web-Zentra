'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function AddMachinePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [axisType, setAxisType] = useState('3-Axis');
  const [machineType, setMachineType] = useState('CNC Milling');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Silakan masukkan nama mesin terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Kirim request ke backend FastAPI
      await fetch('http://localhost:8000/api/v1/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          ip_address: ip.trim() || '192.168.1.105',
          device_id: deviceId.trim() || 'MCH-005',
          axis_type: axisType,
          machine_type: machineType,
        }),
      });
    } catch {
      // Fallback jika backend offline - tetap anggap sukses di UI demo
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-white font-mono tracking-tight">Add Machine</h2>
      </div>

      {/* Main Registration Form (Matches Mockup 7) */}
      <form onSubmit={handleRegister} className="p-8 rounded-2xl bg-[#0f1523] border border-slate-800 space-y-6">
        {/* Row 1: Spindle Preview (Left) + IP Address (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {/* Spindle Preview Card */}
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
              Spindle Preview
            </label>
            <div className="w-full aspect-[2/1] rounded-2xl bg-[#1e2330] border border-slate-700/60 p-4 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/spindle-horizontal.png"
                alt="Spindle Preview"
                className="w-full max-h-36 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>

          {/* IP Address Field */}
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
              IP Address
            </label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="e.g. 192.168.1.105"
              className="w-full px-4 py-3 rounded-xl bg-[#1a2130] border border-slate-700/80 text-slate-100 font-mono text-sm placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2: Name Machine */}
        <div>
          <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
            Name Machine
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mesin CNC Milling 3 Axis Joglo VF-500i"
            className="w-full px-4 py-3 rounded-xl bg-[#1a2130] border border-slate-700/80 text-slate-100 font-mono text-sm placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Row 3: Device ID */}
        <div>
          <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
            Device ID
          </label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="e.g. MCJ-002"
            className="w-full px-4 py-3 rounded-xl bg-[#1a2130] border border-slate-700/80 text-slate-100 font-mono text-sm placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Row 4: Axis Type & Machine Type Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
              Axis Type
            </label>
            <select
              value={axisType}
              onChange={(e) => setAxisType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1a2130] border border-slate-700/80 text-slate-100 font-mono text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="3-Axis">3-Axis</option>
              <option value="5-Axis">5-Axis</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
              Machine Type
            </label>
            <select
              value={machineType}
              onChange={(e) => setMachineType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1a2130] border border-slate-700/80 text-slate-100 font-mono text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="CNC Milling">CNC Milling</option>
              <option value="CNC Turning">CNC Turning</option>
            </select>
          </div>
        </div>

        {/* Action Buttons: Cancel & Register Machine */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="px-8 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-mono text-sm font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-mono text-sm font-semibold border transition-all active:scale-95 ${
              isSuccess
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-[#103b60] hover:bg-[#154a78] text-white border-sky-600/40 shadow-lg shadow-sky-950'
            }`}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-white" />}
            <span>
              {isSuccess ? 'Registered!' : isSubmitting ? 'Registering...' : 'Register Machine'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
