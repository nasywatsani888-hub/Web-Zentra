'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { AlertBanner } from '../components/AlertBanner';
import { StatCards } from '../components/StatCards';
import { MachineCard } from '../components/MachineCard';
import { useZentraStream } from '../hooks/useZentraStream';

export default function OverviewPage() {
  const { machines, isConnected } = useZentraStream();
  const [isAlertResolved, setIsAlertResolved] = useState<boolean>(false);

  // Dynamic Priority Sorting (Incident-Driven Float-to-Top)
  // Outer Race (Merah) -> Inner Race (Kuning) -> Healthy (Hijau)
  const sortedMachines = useMemo(() => {
    return [...machines].sort((a, b) => {
      const priorityOrder: Record<string, number> = {
        OUTER_RACE_FAULT: 1,
        INNER_RACE_FAULT: 2,
        HEALTHY: 3,
      };
      return (priorityOrder[a.status] || 4) - (priorityOrder[b.status] || 4);
    });
  }, [machines]);

  // Aggregate stats
  const totalMachines = machines.length;
  const normalCount = machines.filter((m) => m.status === 'HEALTHY').length;
  const actionRequiredCount = machines.filter((m) => m.status !== 'HEALTHY').length;
  const averageSpindleHealth = Math.round(
    machines.reduce((acc, m) => acc + (m.healthIndex || 85), 0) / (totalMachines || 1)
  );

  // Highest critical machine for banner
  const highestCriticalMachine = sortedMachines[0];

  const handleResolveAlert = () => {
    setIsAlertResolved(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <Header title="Overview" />

      {/* High Urgency Alert Banner (Paling Kritis) */}
      {!isAlertResolved && highestCriticalMachine?.status === 'OUTER_RACE_FAULT' && (
        <AlertBanner
          urgencyText="HIGH URGENCY"
          machineName={highestCriticalMachine.name}
          message={
            highestCriticalMachine.anomalyMessage ||
            'N2 bearing vibration exceeds ISO limit (BPFO: 142 Hz). Recommended technical response: within 4 hours.'
          }
          onResolve={handleResolveAlert}
        />
      )}

      {/* 4 KPI Summary Stat Cards */}
      <StatCards
        totalMachines={totalMachines}
        normalCount={normalCount}
        actionRequiredCount={actionRequiredCount}
        averageSpindleHealth={averageSpindleHealth}
      />

      {/* 2x2 Grid Kartu Mesin CNC (Auto Float-to-Top) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sortedMachines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>
    </div>
  );
}
