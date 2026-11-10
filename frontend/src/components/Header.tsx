'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Clock } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [timeStr, setTimeStr] = useState<string>('13:58:22 WIB');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
      <h2 className="text-2xl font-bold tracking-tight text-white font-mono">{title}</h2>

      <div className="flex items-center gap-3">
        {/* Live WIB Clock */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 font-mono text-sm shadow-inner">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{timeStr}</span>
        </div>

        {/* Add Machine Button */}
        <Link
          href="/add-machine"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white text-sm font-medium border border-slate-700 transition-all shadow-md hover:border-slate-600 active:scale-95"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Add Machine</span>
        </Link>
      </div>
    </header>
  );
};
