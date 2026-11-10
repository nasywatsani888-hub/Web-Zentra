// 3 Kelas Diagnosa AI Sesuai Model BiLSTM & Dataset SUBF
export type BearingFaultType = 'HEALTHY' | 'INNER_RACE_FAULT' | 'OUTER_RACE_FAULT';

export interface TelemetryPoint {
  timestamp: string;
  timeLabel: string;
  temp: number;
  vibRms: number;
  vibN1: number; // Rear Bearing (mm/s)
  vibN2: number; // Front Bearing (mm/s)
}

export interface Machine {
  id: string; // e.g. "CNC-001"
  name: string; // e.g. "CNC Milling EVO-1"
  modelNumber: string; // e.g. "EVO-1", "Joglo VF-500i"
  location: string; // e.g. "Bengkel YPTI - Line A"
  deviceIp: string; // e.g. "192.168.1.101"
  deviceId: string; // e.g. "MCH-001", "MCJ-001"
  axisType: '3-Axis' | '5-Axis';
  machineType: 'CNC Milling' | 'CNC Turning';

  // 3 Kondisi Output AI
  status: BearingFaultType;
  aiConfidence: number; // e.g. 94.2 (%)
  healthIndex: number; // 0 - 100 (%)

  // Telemetri Sensor Terkini
  vibrationRms: number; // e.g. 2.84 mm/s
  temperature: number; // e.g. 48.6 °C
  vibrationN1: number; // Rear Bearing (mm/s)
  vibrationN2: number; // Front Bearing (mm/s)

  // Status Operasional Mesin
  operatingState: 'Running' | 'Idle' | 'Stopped';
  monitoringState: 'Active' | 'Standby';
  runDuration: string; // e.g. "RUN 05:42:18"
  lastUpdated: string;

  // Analisis Mekanikal ISO 10816 & Karakteristik Cacat
  isoLimit: number; // default 2.80 mm/s
  maxTempLimit: number; // default 45.0 °C
  bpfoFrequencyHz?: number; // e.g. 142 Hz (Outer Race)
  bpfiFrequencyHz?: number; // e.g. 218 Hz (Inner Race)
  anomalyMessage?: string;

  // Riwayat Sparkline & Time-Series
  historyVibRms: number[];
  historyTemp: number[];
  telemetryLogs: TelemetryPoint[];

  // Data Perawatan (Predictive Maintenance)
  suggestedInspection: string; // e.g. "23 Oct 2026"
  faultLocation: 'Front Bearing (N2)' | 'Rear Bearing (N1)' | 'None';
  recommendation: string;
}

export interface ShiftReport {
  id: string;
  title: string;
  dateRange: string;
  totalMachines: number;
  averageHealth: number;
  anomalyCount: number;
  reportDate: string;
  downloadUrl?: string;
}
