'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  Server,
  Wrench,
  FileText,
  ActivitySquare,
} from 'lucide-react';

const MENU_ITEMS = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Spindle Diagnostic', href: '/spindle', icon: Activity },
  { label: 'Device Registry', href: '/registry', icon: Server },
  { label: 'Service Log', href: '/service', icon: Wrench },
  { label: 'Shift Reports', href: '/reports', icon: FileText },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="w-64 min-h-screen bg-[#090d15] border-r border-slate-800/80 flex flex-col shrink-0 select-none">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.25)]">
          <ActivitySquare className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-wider text-white flex items-center gap-1 font-mono">
            Z<span className="text-cyan-400">E</span>NTRA
          </h1>
          <p className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
            Smart CNC Diagnostic
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1.5 flex-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = mounted
            ? pathname === item.href || (item.href !== '/' && Boolean(pathname?.startsWith(item.href)))
            : item.href === '/';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-900/60 to-cyan-950/40 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/60 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-300 text-[11px]">System: Online</span>
        </div>
        <p className="text-[10px] text-slate-500">Kembara UNYVerse 2026</p>
      </div>
    </aside>
  );
};
