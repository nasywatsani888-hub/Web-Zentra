import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'ZENTRA - CNC Spindle Monitoring & Fault Diagnosis',
  description: 'Sistem Early Detection dan Diagnosa Kerusakan Komponen Bearing Mesin CNC (Kembara UNYVerse 2026)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#080c14] text-slate-100 min-h-screen flex antialiased">
        {/* Persistent Left Sidebar */}
        <Suspense fallback={<div className="w-64 min-h-screen bg-[#090d15] border-r border-slate-800/80 shrink-0" />}>
          <Sidebar />
        </Suspense>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto max-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
