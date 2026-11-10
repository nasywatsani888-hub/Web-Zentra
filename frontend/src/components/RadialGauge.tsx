'use client';

import React from 'react';

interface RadialGaugeProps {
  value: number;
  max?: number;
  unit?: string;
  label?: string;
  sublabel?: string;
  color?: string; // e.g. '#f97316' (orange), '#38bdf8' (sky-blue)
  className?: string;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  value,
  max = 100,
  unit = '',
  label = '',
  sublabel = '',
  color = '#f97316',
  className = '',
}) => {
  // Semicircle arc calculation
  // Radius = 60, circumference of semicircle = PI * 60 ~= 188.5
  const radius = 60;
  const arcLength = Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, 0), max);
  const fillRatio = clampedValue / max;
  const strokeDashoffset = arcLength * (1 - fillRatio);

  return (
    <div
      className={`p-5 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-col justify-between items-center text-center ${className}`}
    >
      {/* Top Title */}
      <div className="w-full text-left mb-1">
        <span className="text-xs font-mono text-slate-300 font-medium">{label}</span>
      </div>

      {/* Semicircular SVG Gauge */}
      <div className="relative w-44 h-24 my-2 flex items-center justify-center">
        <svg viewBox="0 0 160 95" className="w-full h-full overflow-visible">
          {/* Background Grey Arc */}
          <path
            d="M 20 85 A 60 60 0 0 1 140 85"
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <path
            d="M 20 85 A 60 60 0 0 1 140 85"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
            filter={`drop-shadow(0 0 8px ${color}80)`}
          />

          {/* Scale Labels: 0 and 100 */}
          <text x="20" y="98" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
            0
          </text>
          <text x="140" y="98" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
            {max}
          </text>
        </svg>

        {/* Center Big Value */}
        <div className="absolute bottom-0 text-center">
          <p className="text-2xl font-black font-mono text-white tracking-tight">
            {value.toFixed(1)}
            <span className="text-xs text-slate-400 font-normal ml-0.5">{unit}</span>
          </p>
        </div>
      </div>

      {/* Bottom Sublabel */}
      <div className="w-full text-center mt-1">
        <span
          className="text-xs font-mono font-semibold"
          style={{ color: color }}
        >
          {sublabel}
        </span>
      </div>
    </div>
  );
};
