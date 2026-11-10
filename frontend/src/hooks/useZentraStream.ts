'use client';

import { useState, useEffect, useRef } from 'react';
import { Machine } from '../types';
import { INITIAL_MACHINES } from '../lib/initialData';

export function useZentraStream() {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<'LIVE_BACKEND' | 'FALLBACK_SIMULATION'>('FALLBACK_SIMULATION');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Attempt WebSocket connection to Python FastAPI backend
    const wsUrl = 'ws://localhost:8000/ws/telemetry';
    let socket: WebSocket;

    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        setDataSource('LIVE_BACKEND');
        console.log('[ZENTRA WS] Connected to Python FastAPI backend streaming!');
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.machines && Array.isArray(payload.machines)) {
            setMachines(payload.machines);
          }
        } catch (err) {
          console.error('[ZENTRA WS] Error parsing telemetry:', err);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        setDataSource('FALLBACK_SIMULATION');
        console.log('[ZENTRA WS] Disconnected. Switching to Fallback Simulation stream.');
      };

      socket.onerror = () => {
        setIsConnected(false);
        setDataSource('FALLBACK_SIMULATION');
      };
    } catch {
      setIsConnected(false);
      setDataSource('FALLBACK_SIMULATION');
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Fallback simulation timer if backend is offline
  useEffect(() => {
    if (isConnected) return;

    const interval = setInterval(() => {
      setMachines((prev) =>
        prev.map((m) => {
          const deltaVib = (Math.random() - 0.48) * 0.04;
          const deltaTemp = (Math.random() - 0.48) * 0.06;

          const newVib = Math.max(0.3, Number((m.vibrationRms + deltaVib).toFixed(2)));
          const newTemp = Math.max(25, Number((m.temperature + deltaTemp).toFixed(1)));
          const nowStr = new Date().toTimeString().split(' ')[0];

          return {
            ...m,
            vibrationRms: newVib,
            temperature: newTemp,
            lastUpdated: 'Live',
            historyVibRms: [...m.historyVibRms.slice(1), newVib],
            historyTemp: [...m.historyTemp.slice(1), newTemp],
            telemetryLogs: [
              {
                timestamp: nowStr,
                timeLabel: nowStr.slice(0, 5),
                temp: newTemp,
                vibRms: newVib,
                vibN1: Number((newVib * 0.85).toFixed(2)),
                vibN2: Number((newVib * (m.status === 'OUTER_RACE_FAULT' ? 1.0 : 0.75)).toFixed(2)),
              },
              ...m.telemetryLogs.slice(0, 4),
            ],
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    machines,
    setMachines,
    isConnected,
    dataSource,
  };
}
