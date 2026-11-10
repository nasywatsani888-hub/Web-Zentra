'use client';

import React from 'react';

interface ChartPoint {
  time: string;
  temp: number; // 0 - 100 °C
  vib: number; // 0 - 10 mm/s
}

interface DualMonitoringChartProps {
  data?: ChartPoint[];
  currentTemp?: number;
  currentVib?: number;
}

const DEFAULT_HOURLY_DATA: ChartPoint[] = [
  { time: '00:00', temp: 32.0, vib: 1.1 },
  { time: '04:00', temp: 34.0, vib: 1.2 },
  { time: '08:00', temp: 42.0, vib: 1.6 },
  { time: '12:00', temp: 58.0, vib: 2.2 },
  { time: '14:21', temp: 70.0, vib: 4.8 },
  { time: '16:00', temp: 64.0, vib: 4.2 },
  { time: '20:00', temp: 46.0, vib: 3.1 },
  { time: '24:00', temp: 38.0, vib: 2.4 },
];

export const DualMonitoringChart: React.FC<DualMonitoringChartProps> = ({
  data = DEFAULT_HOURLY_DATA,
  currentTemp = 70.0,
  currentVib = 4.8,
}) => {
  // SVG Chart Geometry
  // Width: 650, Height: 200, Margins: L: 45, R: 45, T: 25, B: 30
  const W = 650;
  const H = 200;
  const mL = 45;
  const mR = 45;
  const mT = 25;
  const mB = 30;

  const plotW = W - mL - mR;
  const plotH = H - mT - mB;

  // Scale functions
  const getX = (idx: number) => mL + (idx / (data.length - 1)) * plotW;
  const getYTemp = (temp: number) => mT + plotH * (1 - temp / 100); // 0 to 100
  const getYVib = (vib: number) => mT + plotH * (1 - vib / 10); // 0 to 10

  // Build SVG Paths
  const tempPath = data
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getYTemp(p.temp).toFixed(1)}`)
    .join(' ');

  const vibPath = data
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getYVib(p.vib).toFixed(1)}`)
    .join(' ');

  // ISO 2.80 mm/s Line Y
  const isoY = getYVib(2.8);

  return (
    <div className="w-full p-5 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-col justify-between">
      {/* Chart Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h4 className="font-bold text-white font-mono text-sm tracking-tight">
          Temperature &amp; Vibration Monitoring
        </h4>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Temp (°C)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Vib (mm/s)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[3.2/1]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible" fill="none">
          {/* Grid Horizontal Dashed Lines */}
          {[0, 25, 50, 75, 100].map((tVal) => {
            const y = getYTemp(tVal);
            return (
              <g key={tVal}>
                <line
                  x1={mL}
                  y1={y}
                  x2={W - mR}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Left Y Axis Label (Temp: 0 to 100) */}
                <text
                  x={mL - 8}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {tVal}
                </text>
                {/* Right Y Axis Label (Vib: 0 to 10) */}
                <text
                  x={W - mR + 8}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  {(tVal / 10).toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* BATAS ISO (2.80 mm/s) Red Dotted Line */}
          <line
            x1={mL}
            y1={isoY}
            x2={W - mR}
            y2={isoY}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text
            x={mL + 6}
            y={isoY - 5}
            fill="#ef4444"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            BATAS ISO (2.80 mm/s)
          </text>

          {/* Blue Line: Temperature */}
          <path d={tempPath} stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

          {/* Orange Line: Vibration */}
          <path d={vibPath} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

          {/* Critical Point Highlight: Anomaly Point (14:21) */}
          <g>
            {/* Peak Temp Dot */}
            <circle cx={getX(4)} cy={getYTemp(70)} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            <text
              x={getX(4)}
              y={getYTemp(70) - 8}
              fill="#38bdf8"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              70°C
            </text>

            {/* Peak Vib Dot */}
            <circle cx={getX(4)} cy={getYVib(4.8)} r="5.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <text
              x={getX(4) + 12}
              y={getYVib(4.8) - 4}
              fill="#f59e0b"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              4.8 mm/s ▲ (14:21)
            </text>
          </g>

          {/* X Axis Time Labels */}
          {data.map((p, idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={H - 8}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {p.time}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
