/**
 * ==============================================================================
 * ZENTRA - CNC Spindle Health Monitoring & Fault Diagnosis
 * Core Standalone Application Engine (Pure Client-Side / Zero Dependency)
 * Kembara UNYVerse 2026 x PT YPTI
 * ==============================================================================
 */

// 1. DATABASE MESIN AWAL (Fokus Mesin EVO-1 dan Joglo VF-500i YPTI)
const INITIAL_MACHINES = [
  {
    id: "CNC-001",
    name: "CNC Milling EVO-1",
    modelNumber: "EVO-1",
    location: "Bengkel Presisi YPTI - Line 1",
    deviceIp: "192.168.1.101",
    deviceId: "MCH-001",
    axisType: "3-Axis",
    machineType: "CNC Milling",
    spindleSpeedRpm: 6000,
    status: "OUTER_RACE_FAULT", // 2 = FOR (Outer Race)
    vibrationRms: 3.42,
    temperature: 48.5,
    vibrationN1: 1.85,
    vibrationN2: 4.80, // Kerusakan dominan di Front Bearing N2
    aiConfidence: 0.94,
    healthIndex: 42,
    runHours: 1420,
    lastUpdated: "Live",
    // BUFFER 24 JAM PENUH (Jam 00:00 - 23:00) - Lonjakan Kritis di Shift 1 Pagi (07:00 - 14:00, lalu dimatikan/idle untuk proteksi)
    historyVibRms: [1.82, 1.78, 1.75, 1.80, 1.85, 1.92, 2.10, 2.65, 3.15, 3.62, 4.18, 4.45, 2.20, 3.90, 4.25, 1.45, 1.35, 1.25, 1.20, 1.20, 1.15, 1.10, 1.05, 1.00],
    historyTemp: [36.2, 35.8, 35.5, 35.7, 36.0, 36.5, 37.8, 40.2, 43.5, 46.8, 49.2, 51.4, 44.1, 48.5, 50.8, 38.2, 36.5, 35.8, 35.0, 34.5, 34.2, 34.0, 33.8, 33.5],
    telemetryLogs: [
      { timestamp: "14:21:05", timeLabel: "14:21", temp: 48.5, vibRms: 3.42, vibN1: 1.85, vibN2: 4.80 },
      { timestamp: "14:21:00", timeLabel: "14:21", temp: 48.4, vibRms: 3.40, vibN1: 1.84, vibN2: 4.78 },
      { timestamp: "14:20:55", timeLabel: "14:20", temp: 48.2, vibRms: 3.38, vibN1: 1.82, vibN2: 4.75 },
      { timestamp: "14:20:50", timeLabel: "14:20", temp: 48.0, vibRms: 3.35, vibN1: 1.80, vibN2: 4.70 },
      { timestamp: "14:20:45", timeLabel: "14:20", temp: 47.9, vibRms: 3.32, vibN1: 1.79, vibN2: 4.68 }
    ],
    anomalyMessage: "N2 bearing vibration exceeds ISO limit (BPFO: 142 Hz). Recommended technical response: within 4 hours.",
    recommendation: "Ganti bantalan depan (N2) & periksa keausan outer race sebelum proses finishing presisi.",
    suggestedInspection: "Besok, 08:00 WIB"
  },
  {
    id: "CNC-002",
    name: "DMU 50 EVO_1",
    modelNumber: "DMU 50",
    location: "Bengkel Presisi YPTI - Line 1",
    deviceIp: "192.168.1.102",
    deviceId: "MCH-002",
    axisType: "5-Axis",
    machineType: "CNC Milling",
    spindleSpeedRpm: 8000,
    status: "INNER_RACE_FAULT", // 1 = FIR (Inner Race)
    vibrationRms: 2.15,
    temperature: 42.1,
    vibrationN1: 2.45, // Kerusakan di Rear Bearing N1
    vibrationN2: 1.65,
    aiConfidence: 0.89,
    healthIndex: 71,
    runHours: 2310,
    lastUpdated: "Live",
    // BUFFER 24 JAM PENUH - Anomali Pelumasan Cincin Dalam di Shift 3 Malam (00:00 - 06:00)
    historyVibRms: [2.35, 2.42, 2.55, 2.48, 2.38, 2.25, 2.10, 1.85, 1.98, 2.15, 2.32, 2.48, 1.60, 2.20, 2.42, 2.25, 2.15, 2.05, 1.90, 2.10, 2.18, 2.02, 1.75, 2.15],
    historyTemp: [41.5, 42.0, 42.8, 42.5, 41.8, 41.2, 39.5, 37.4, 39.2, 41.0, 42.5, 43.8, 38.5, 41.8, 43.2, 42.0, 41.2, 40.5, 39.5, 40.8, 41.5, 40.1, 37.5, 39.5],
    telemetryLogs: [
      { timestamp: "14:21:05", timeLabel: "14:21", temp: 42.1, vibRms: 2.15, vibN1: 2.45, vibN2: 1.65 },
      { timestamp: "14:21:00", timeLabel: "14:21", temp: 42.0, vibRms: 2.14, vibN1: 2.43, vibN2: 1.64 },
      { timestamp: "14:20:55", timeLabel: "14:20", temp: 41.9, vibRms: 2.12, vibN1: 2.40, vibN2: 1.62 },
      { timestamp: "14:20:50", timeLabel: "14:20", temp: 41.8, vibRms: 2.10, vibN1: 2.38, vibN2: 1.60 },
      { timestamp: "14:20:45", timeLabel: "14:20", temp: 41.6, vibRms: 2.08, vibN1: 2.35, vibN2: 1.58 }
    ],
    anomalyMessage: "N1 rear bearing frequency peak detected (BPFI: 218 Hz). Inspection recommended next shift.",
    recommendation: "Lakukan pelumasan ulang & inspeksi clearance cincin dalam pada shift berikutnya.",
    suggestedInspection: "25 Oct 2026, 16:00 WIB"
  },
  {
    id: "CNC-003",
    name: "DMU 50 EVO_2",
    modelNumber: "DMU 50",
    location: "Bengkel Presisi YPTI - Line 2",
    deviceIp: "192.168.1.103",
    deviceId: "MCH-003",
    axisType: "5-Axis",
    machineType: "CNC Milling",
    spindleSpeedRpm: 8000,
    status: "HEALTHY", // 0 = Healthy
    vibrationRms: 0.85,
    temperature: 36.2,
    vibrationN1: 0.75,
    vibrationN2: 0.90,
    aiConfidence: 0.97,
    healthIndex: 94,
    runHours: 850,
    lastUpdated: "Live",
    // BUFFER 24 JAM PENUH - Lonjakan Overheat Termal Spindle di Shift 2 Sore (15:00 - 19:00, 49.5°C)
    historyVibRms: [0.68, 0.65, 0.65, 0.66, 0.67, 0.70, 0.72, 0.76, 0.81, 0.84, 0.87, 0.89, 0.72, 0.85, 0.88, 1.15, 1.20, 1.18, 1.10, 0.83, 0.84, 0.80, 0.74, 0.70],
    historyTemp: [32.1, 31.8, 31.5, 31.7, 31.9, 32.2, 32.8, 33.5, 34.8, 35.6, 36.2, 36.8, 33.5, 35.9, 36.5, 47.2, 48.8, 49.5, 46.8, 42.5, 38.2, 36.5, 34.8, 33.2],
    telemetryLogs: [
      { timestamp: "14:21:05", timeLabel: "14:21", temp: 36.2, vibRms: 0.85, vibN1: 0.75, vibN2: 0.90 },
      { timestamp: "14:21:00", timeLabel: "14:21", temp: 36.2, vibRms: 0.84, vibN1: 0.74, vibN2: 0.89 },
      { timestamp: "14:20:55", timeLabel: "14:20", temp: 36.1, vibRms: 0.85, vibN1: 0.75, vibN2: 0.90 },
      { timestamp: "14:20:50", timeLabel: "14:20", temp: 36.0, vibRms: 0.83, vibN1: 0.73, vibN2: 0.88 },
      { timestamp: "14:20:45", timeLabel: "14:20", temp: 36.0, vibRms: 0.84, vibN1: 0.74, vibN2: 0.89 }
    ],
    anomalyMessage: "",
    recommendation: "Kondisi sangat baik. Lanjutkan jadwal pemeliharaan preventif standar.",
    suggestedInspection: "15 Nov 2026"
  },
  {
    id: "CNC-004",
    name: "Mesin CNC Milling 3 Axis Joglo VF-500i",
    modelNumber: "Joglo VF-500i",
    location: "Inovasi PT YPTI - CNC Lab",
    deviceIp: "192.168.1.104",
    deviceId: "MCH-004",
    axisType: "3-Axis",
    machineType: "CNC Milling",
    spindleSpeedRpm: 10000,
    status: "HEALTHY", // 0 = Healthy
    vibrationRms: 0.65,
    temperature: 34.8,
    vibrationN1: 0.60,
    vibrationN2: 0.70,
    aiConfidence: 0.99,
    healthIndex: 98,
    runHours: 320,
    lastUpdated: "Live",
    // BUFFER 24 JAM PENUH - Anomali Resonansi Dinamis Uji 10.000 RPM di Shift 2 Akhir (20:00 - 22:00, 2.95 mm/s)
    historyVibRms: [0.52, 0.50, 0.49, 0.51, 0.52, 0.53, 0.55, 0.58, 0.62, 0.64, 0.66, 0.67, 0.54, 0.65, 0.67, 0.65, 0.63, 0.62, 0.60, 0.64, 2.88, 2.95, 2.70, 0.53],
    historyTemp: [31.0, 30.8, 30.5, 30.7, 30.9, 31.2, 31.8, 32.5, 33.2, 34.0, 34.5, 34.8, 32.0, 34.2, 34.7, 34.4, 33.9, 33.6, 33.0, 34.0, 39.5, 41.2, 37.8, 31.5],
    telemetryLogs: [
      { timestamp: "14:21:05", timeLabel: "14:21", temp: 34.8, vibRms: 0.65, vibN1: 0.60, vibN2: 0.70 },
      { timestamp: "14:21:00", timeLabel: "14:21", temp: 34.7, vibRms: 0.64, vibN1: 0.59, vibN2: 0.69 },
      { timestamp: "14:20:55", timeLabel: "14:20", temp: 34.7, vibRms: 0.65, vibN1: 0.60, vibN2: 0.70 },
      { timestamp: "14:20:50", timeLabel: "14:20", temp: 34.6, vibRms: 0.63, vibN1: 0.58, vibN2: 0.68 },
      { timestamp: "14:20:45", timeLabel: "14:20", temp: 34.5, vibRms: 0.64, vibN1: 0.59, vibN2: 0.69 }
    ],
    anomalyMessage: "",
    recommendation: "Kondisi unit karya anak bangsa PT YPTI sangat prima. Getaran sangat rendah (< 1.0 mm/s).",
    suggestedInspection: "30 Nov 2026"
  }
];

// ==============================================================================
// 1.1 DATABASE SIMULASI 24 JAM & PERPINDAHAN PRIORITAS FLEET MESIN
// Skenario Siklus Produksi Presisi PT YPTI (3 Shift Operasional)
// ==============================================================================
const SIMULATION_24H_LOGS = [
  // ----------------------------------------------------------------------------
  // FASE 1: 00:00 - 06:00 (Shift 3 - Malam)
  // PRIORITAS #1: DMU 50 EVO_1 (MCH-002) - Anomali Pelumasan Cincin Dalam (BPFI)
  // ----------------------------------------------------------------------------
  {
    hour: 0,
    timeStr: "00:00",
    shift: "Shift 3 (Malam)",
    topPriorityId: "CNC-002",
    topPriorityName: "DMU 50 EVO_1",
    topPriorityBadge: "Inner Race Fault",
    topPriorityReason: "Degradasi cincin dalam N1 (BPFI: 218 Hz) terdeteksi saat running batch semalam suntuk.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.82, temp: 36.2, hi: 85, status: "HEALTHY", note: "Mesin standby / idle malam" },
      "CNC-002": { rpm: 6000, vibRms: 2.35, temp: 41.5, hi: 68, status: "INNER_RACE_FAULT", note: "Running batch; getaran N1 naik karena pelumasan tipis" },
      "CNC-003": { rpm: 0, vibRms: 0.68, temp: 32.1, hi: 96, status: "HEALTHY", note: "Standby; suhu spindle normal" },
      "CNC-004": { rpm: 0, vibRms: 0.52, temp: 31.0, hi: 99, status: "HEALTHY", note: "Standby; getaran ultra-rendah" }
    }
  },
  {
    hour: 1,
    timeStr: "01:00",
    shift: "Shift 3 (Malam)",
    topPriorityId: "CNC-002",
    topPriorityName: "DMU 50 EVO_1",
    topPriorityBadge: "Inner Race Fault",
    topPriorityReason: "Amplitudo frekuensi kerusakan BPFI 218 Hz meningkat bertahap pada bantalan belakang N1.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.78, temp: 35.8, hi: 86, status: "HEALTHY", note: "Standby" },
      "CNC-002": { rpm: 6000, vibRms: 2.42, temp: 42.0, hi: 66, status: "INNER_RACE_FAULT", note: "Peningkatan getaran radial N1" },
      "CNC-003": { rpm: 0, vibRms: 0.65, temp: 31.8, hi: 96, status: "HEALTHY", note: "Standby" },
      "CNC-004": { rpm: 0, vibRms: 0.50, temp: 30.8, hi: 99, status: "HEALTHY", note: "Standby" }
    }
  },
  {
    hour: 2,
    timeStr: "02:00",
    shift: "Shift 3 (Malam)",
    topPriorityId: "CNC-002",
    topPriorityName: "DMU 50 EVO_1",
    topPriorityBadge: "Inner Race Fault",
    topPriorityReason: "Getaran RMS mencapai puncak malam 2.55 mm/s (Zona Waspada ISO). Butuh relubrikasi shift pagi.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.75, temp: 35.5, hi: 87, status: "HEALTHY", note: "Standby" },
      "CNC-002": { rpm: 6000, vibRms: 2.55, temp: 42.8, hi: 62, status: "INNER_RACE_FAULT", note: "Puncak getaran malam (2.55 mm/s); butuh relubrikasi" },
      "CNC-003": { rpm: 0, vibRms: 0.65, temp: 31.5, hi: 97, status: "HEALTHY", note: "Standby" },
      "CNC-004": { rpm: 0, vibRms: 0.49, temp: 30.5, hi: 99, status: "HEALTHY", note: "Standby" }
    }
  },
  {
    hour: 3,
    timeStr: "03:00",
    shift: "Shift 3 (Malam)",
    topPriorityId: "CNC-002",
    topPriorityName: "DMU 50 EVO_1",
    topPriorityBadge: "Inner Race Fault",
    topPriorityReason: "Fluktuasi getaran berlanjut di zona waspada. Rekomendasi inspeksi clearance cincin dalam.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.80, temp: 35.7, hi: 86, status: "HEALTHY", note: "Standby" },
      "CNC-002": { rpm: 6000, vibRms: 2.48, temp: 42.5, hi: 64, status: "INNER_RACE_FAULT", note: "Zona waspada ISO" },
      "CNC-003": { rpm: 0, vibRms: 0.66, temp: 31.7, hi: 96, status: "HEALTHY", note: "Standby" },
      "CNC-004": { rpm: 0, vibRms: 0.51, temp: 30.7, hi: 99, status: "HEALTHY", note: "Standby" }
    }
  },
  {
    hour: 4,
    timeStr: "04:00",
    shift: "Shift 3 (Malam)",
    topPriorityId: "CNC-002",
    topPriorityName: "DMU 50 EVO_1",
    topPriorityBadge: "Inner Race Fault",
    topPriorityReason: "Batch semi-finishing malam selesai; mesin transisi ke putaran rendah.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.85, temp: 36.0, hi: 85, status: "HEALTHY", note: "Standby" },
      "CNC-002": { rpm: 4000, vibRms: 2.38, temp: 41.8, hi: 67, status: "INNER_RACE_FAULT", note: "Penyelesaian batch malam" },
      "CNC-003": { rpm: 0, vibRms: 0.67, temp: 31.9, hi: 96, status: "HEALTHY", note: "Standby" },
      "CNC-004": { rpm: 0, vibRms: 0.52, temp: 30.9, hi: 99, status: "HEALTHY", note: "Standby" }
    }
  },
  {
    hour: 5,
    timeStr: "05:00",
    shift: "Shift 3 (Malam)",
    topPriorityId: "CNC-002",
    topPriorityName: "DMU 50 EVO_1",
    topPriorityBadge: "Inner Race Fault",
    topPriorityReason: "Kondisi pendinginan bertahap; teknisi shift 3 mencatat anomali pada logbook.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.92, temp: 36.5, hi: 84, status: "HEALTHY", note: "Pemanasan awal workshop" },
      "CNC-002": { rpm: 2000, vibRms: 2.25, temp: 41.2, hi: 69, status: "INNER_RACE_FAULT", note: "Pendinginan; logbook anomali" },
      "CNC-003": { rpm: 0, vibRms: 0.70, temp: 32.2, hi: 95, status: "HEALTHY", note: "Standby" },
      "CNC-004": { rpm: 0, vibRms: 0.53, temp: 31.2, hi: 99, status: "HEALTHY", note: "Standby" }
    }
  },
  {
    hour: 6,
    timeStr: "06:00",
    shift: "Shift 3 (Malam)",
    topPriorityId: "CNC-002",
    topPriorityName: "DMU 50 EVO_1",
    topPriorityBadge: "Inner Race Fault",
    topPriorityReason: "Pergantian shift (Handover Shift 3 ke Shift 1). Laporan pelumasan diserahkan ke teknisi pagi.",
    machines: {
      "CNC-001": { rpm: 3000, vibRms: 2.10, temp: 37.8, hi: 82, status: "HEALTHY", note: "Warm-up spindle shift pagi" },
      "CNC-002": { rpm: 0, vibRms: 2.10, temp: 39.5, hi: 71, status: "INNER_RACE_FAULT", note: "Handover shift; serah terima catatan BPFI" },
      "CNC-003": { rpm: 3000, vibRms: 0.72, temp: 32.8, hi: 95, status: "HEALTHY", note: "Warm-up spindle" },
      "CNC-004": { rpm: 3000, vibRms: 0.55, temp: 31.8, hi: 98, status: "HEALTHY", note: "Warm-up spindle" }
    }
  },

  // ----------------------------------------------------------------------------
  // FASE 2: 07:00 - 14:00 (Shift 1 - Pagi Puncak)
  // PRIORITAS #1: CNC Milling EVO-1 (MCH-001) - Kerusakan Kritis Outer Race (BPFO)
  // ----------------------------------------------------------------------------
  {
    hour: 7,
    timeStr: "07:00",
    shift: "Shift 1 (Pagi)",
    topPriorityId: "CNC-001",
    topPriorityName: "CNC Milling EVO-1",
    topPriorityBadge: "Outer Race Fault",
    topPriorityReason: "Spindle mulai dibebani roughing; getaran N2 melonjak mendekati batas ISO 2.80 mm/s.",
    machines: {
      "CNC-001": { rpm: 5000, vibRms: 2.65, temp: 40.2, hi: 74, status: "HEALTHY", note: "Beban kerja roughing dimulai" },
      "CNC-002": { rpm: 4000, vibRms: 1.85, temp: 37.4, hi: 78, status: "HEALTHY", note: "Telah dilumasi awal shift" },
      "CNC-003": { rpm: 6000, vibRms: 0.76, temp: 33.5, hi: 95, status: "HEALTHY", note: "Operasi milling presisi" },
      "CNC-004": { rpm: 6000, vibRms: 0.58, temp: 32.5, hi: 98, status: "HEALTHY", note: "Operasi milling presisi" }
    }
  },
  {
    hour: 8,
    timeStr: "08:00",
    shift: "Shift 1 (Pagi)",
    topPriorityId: "CNC-001",
    topPriorityName: "CNC Milling EVO-1",
    topPriorityBadge: "Outer Race Fault",
    topPriorityReason: "🚨 EXCEED ISO: Getaran menembus 3.15 mm/s (> 2.80 mm/s). Anomali frekuensi BPFO 142 Hz dominan.",
    machines: {
      "CNC-001": { rpm: 6000, vibRms: 3.15, temp: 43.5, hi: 55, status: "OUTER_RACE_FAULT", note: "Melewati batas ISO 2.80 mm/s; peringatan dini AI" },
      "CNC-002": { rpm: 5000, vibRms: 1.98, temp: 39.2, hi: 75, status: "HEALTHY", note: "Kondisi stabil terkontrol" },
      "CNC-003": { rpm: 8000, vibRms: 0.81, temp: 34.8, hi: 94, status: "HEALTHY", note: "Spindle 5-axis prima" },
      "CNC-004": { rpm: 8000, vibRms: 0.62, temp: 33.2, hi: 98, status: "HEALTHY", note: "Spindle stabil" }
    }
  },
  {
    hour: 9,
    timeStr: "09:00",
    shift: "Shift 1 (Pagi)",
    topPriorityId: "CNC-001",
    topPriorityName: "CNC Milling EVO-1",
    topPriorityBadge: "Outer Race Fault",
    topPriorityReason: "🚨 KRITIS: Suhu tembus 46.8°C dan getaran 3.62 mm/s. Cacat spalling outer race bantalan depan N2.",
    machines: {
      "CNC-001": { rpm: 6000, vibRms: 3.62, temp: 46.8, hi: 44, status: "OUTER_RACE_FAULT", note: "Getaran 3.62 mm/s & Suhu 46.8°C melampaui batas" },
      "CNC-002": { rpm: 6000, vibRms: 2.15, temp: 41.0, hi: 72, status: "INNER_RACE_FAULT", note: "Getaran stabil di zona waspada" },
      "CNC-003": { rpm: 8000, vibRms: 0.84, temp: 35.6, hi: 94, status: "HEALTHY", note: "Operasi normal" },
      "CNC-004": { rpm: 8000, vibRms: 0.64, temp: 34.0, hi: 98, status: "HEALTHY", note: "Operasi normal" }
    }
  },
  {
    hour: 10,
    timeStr: "10:00",
    shift: "Shift 1 (Pagi)",
    topPriorityId: "CNC-001",
    topPriorityName: "CNC Milling EVO-1",
    topPriorityBadge: "Outer Race Fault",
    topPriorityReason: "🚨 HIGH URGENCY: Getaran 4.18 mm/s, Suhu 49.2°C. Rekomendasi respons teknis: maksimal 4 jam.",
    machines: {
      "CNC-001": { rpm: 6000, vibRms: 4.18, temp: 49.2, hi: 36, status: "OUTER_RACE_FAULT", note: "Peringatan darurat: getaran radial N2 mencapai 4.80 mm/s" },
      "CNC-002": { rpm: 6000, vibRms: 2.32, temp: 42.5, hi: 70, status: "INNER_RACE_FAULT", note: "Operasi normal terpantau" },
      "CNC-003": { rpm: 8000, vibRms: 0.87, temp: 36.2, hi: 94, status: "HEALTHY", note: "Operasi normal" },
      "CNC-004": { rpm: 8000, vibRms: 0.66, temp: 34.5, hi: 97, status: "HEALTHY", note: "Operasi normal" }
    }
  },
  {
    hour: 11,
    timeStr: "11:00",
    shift: "Shift 1 (Pagi)",
    topPriorityId: "CNC-001",
    topPriorityName: "CNC Milling EVO-1",
    topPriorityBadge: "Outer Race Fault",
    topPriorityReason: "🚨 PEAK ANOMALY 24 JAM: Getaran 4.45 mm/s, Suhu 51.4°C. Risiko kegagalan spindle fatal jika dipaksa.",
    machines: {
      "CNC-001": { rpm: 6000, vibRms: 4.45, temp: 51.4, hi: 32, status: "OUTER_RACE_FAULT", note: "PUNCAK KERUSAKAN 24 JAM; Wajib stop operasi" },
      "CNC-002": { rpm: 6000, vibRms: 2.48, temp: 43.8, hi: 67, status: "INNER_RACE_FAULT", note: "Kondisi waspada" },
      "CNC-003": { rpm: 8000, vibRms: 0.89, temp: 36.8, hi: 93, status: "HEALTHY", note: "Operasi normal" },
      "CNC-004": { rpm: 8000, vibRms: 0.67, temp: 34.8, hi: 97, status: "HEALTHY", note: "Operasi normal" }
    }
  },
  {
    hour: 12,
    timeStr: "12:00",
    shift: "Shift 1 (Istirahat)",
    topPriorityId: "CNC-001",
    topPriorityName: "CNC Milling EVO-1",
    topPriorityBadge: "Outer Race Fault",
    topPriorityReason: "Jam istirahat bengkel; mesin dimatikan sementara untuk pendinginan spindle pasca-overheating.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 2.20, temp: 44.1, hi: 58, status: "OUTER_RACE_FAULT", note: "Pendinginan istirahat siang; suhu mulai turun" },
      "CNC-002": { rpm: 0, vibRms: 1.60, temp: 38.5, hi: 80, status: "HEALTHY", note: "Istirahat siang" },
      "CNC-003": { rpm: 0, vibRms: 0.72, temp: 33.5, hi: 95, status: "HEALTHY", note: "Istirahat siang" },
      "CNC-004": { rpm: 0, vibRms: 0.54, temp: 32.0, hi: 98, status: "HEALTHY", note: "Istirahat siang" }
    }
  },
  {
    hour: 13,
    timeStr: "13:00",
    shift: "Shift 1 (Pagi)",
    topPriorityId: "CNC-001",
    topPriorityName: "CNC Milling EVO-1",
    topPriorityBadge: "Outer Race Fault",
    topPriorityReason: "🚨 Produksi dilanjutkan; getaran langsung naik kembali ke 3.90 mm/s. Tim maintenance disiapkan.",
    machines: {
      "CNC-001": { rpm: 5000, vibRms: 3.90, temp: 48.5, hi: 40, status: "OUTER_RACE_FAULT", note: "Getaran kembali melonjak tajam" },
      "CNC-002": { rpm: 5000, vibRms: 2.20, temp: 41.8, hi: 71, status: "INNER_RACE_FAULT", note: "Operasi terkontrol" },
      "CNC-003": { rpm: 8000, vibRms: 0.85, temp: 35.9, hi: 94, status: "HEALTHY", note: "Operasi normal" },
      "CNC-004": { rpm: 8000, vibRms: 0.65, temp: 34.2, hi: 97, status: "HEALTHY", note: "Operasi normal" }
    }
  },
  {
    hour: 14,
    timeStr: "14:00",
    shift: "Shift 1 (Pagi)",
    topPriorityId: "CNC-001",
    topPriorityName: "CNC Milling EVO-1",
    topPriorityBadge: "Outer Race Fault",
    topPriorityReason: "🚨 Getaran 4.25 mm/s. Teknisi memutuskan memindahkan job finishing ke mesin CNC-002.",
    machines: {
      "CNC-001": { rpm: 5000, vibRms: 4.25, temp: 50.8, hi: 35, status: "OUTER_RACE_FAULT", note: "Penurunan kecepatan spindle untuk proteksi darurat" },
      "CNC-002": { rpm: 6000, vibRms: 2.42, temp: 43.2, hi: 68, status: "INNER_RACE_FAULT", note: "Menerima beban pengalihan job" },
      "CNC-003": { rpm: 8000, vibRms: 0.88, temp: 36.5, hi: 93, status: "HEALTHY", note: "Sirkulasi chiller mulai terhambat" },
      "CNC-004": { rpm: 8000, vibRms: 0.67, temp: 34.7, hi: 97, status: "HEALTHY", note: "Operasi normal" }
    }
  },

  // ----------------------------------------------------------------------------
  // FASE 3: 15:00 - 19:00 (Shift 2 - Sore)
  // PRIORITAS #1: DMU 50 EVO_2 (MCH-003) - Anomali Overheat Termal Spindle (49.5°C)
  // ----------------------------------------------------------------------------
  {
    hour: 15,
    timeStr: "15:00",
    shift: "Shift 2 (Sore)",
    topPriorityId: "CNC-003",
    topPriorityName: "DMU 50 EVO_2",
    topPriorityBadge: "Thermal Anomaly",
    topPriorityReason: "🚨 THERMAL SURGE: Saluran pendingin chiller tersumbat. Suhu spindle meroket cepat ke 47.2°C (> 45°C).",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.45, temp: 38.2, hi: 85, status: "HEALTHY", note: "Mesin di-offline-kan untuk proteksi & persiapan ganti bearing N2" },
      "CNC-002": { rpm: 5000, vibRms: 2.25, temp: 42.0, hi: 70, status: "INNER_RACE_FAULT", note: "Operasi stabil" },
      "CNC-003": { rpm: 8000, vibRms: 1.15, temp: 47.2, hi: 52, status: "OUTER_RACE_FAULT", note: "ALARM TERMAL SPINDLE: Suhu 47.2°C melampaui batas aman" },
      "CNC-004": { rpm: 8000, vibRms: 0.65, temp: 34.4, hi: 97, status: "HEALTHY", note: "Operasi normal" }
    }
  },
  {
    hour: 16,
    timeStr: "16:00",
    shift: "Shift 2 (Sore)",
    topPriorityId: "CNC-003",
    topPriorityName: "DMU 50 EVO_2",
    topPriorityBadge: "Thermal Anomaly",
    topPriorityReason: "🚨 PUNCAK OVERHEAT: Suhu spindle mencapai 48.8°C. Sistem otomatis memicu peringatan thermal cut-off.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.35, temp: 36.5, hi: 86, status: "HEALTHY", note: "Offline; pendinginan spindle" },
      "CNC-002": { rpm: 5000, vibRms: 2.15, temp: 41.2, hi: 72, status: "INNER_RACE_FAULT", note: "Operasi terkontrol" },
      "CNC-003": { rpm: 8000, vibRms: 1.20, temp: 48.8, hi: 48, status: "OUTER_RACE_FAULT", note: "Puncak overheat termal (48.8°C); pemeriksaan debit coolant" },
      "CNC-004": { rpm: 8000, vibRms: 0.63, temp: 33.9, hi: 98, status: "HEALTHY", note: "Operasi normal" }
    }
  },
  {
    hour: 17,
    timeStr: "17:00",
    shift: "Shift 2 (Sore)",
    topPriorityId: "CNC-003",
    topPriorityName: "DMU 50 EVO_2",
    topPriorityBadge: "Thermal Anomaly",
    topPriorityReason: "🚨 Suhu 49.5°C. Operator membersihkan strainer filter pendingin; suhu mulai tertahan.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.25, temp: 35.8, hi: 88, status: "HEALTHY", note: "Offline; inspeksi fisik outer race" },
      "CNC-002": { rpm: 4000, vibRms: 2.05, temp: 40.5, hi: 74, status: "INNER_RACE_FAULT", note: "Operasi terkontrol" },
      "CNC-003": { rpm: 6000, vibRms: 1.18, temp: 49.5, hi: 46, status: "OUTER_RACE_FAULT", note: "Tindakan perbaikan: flushing strainer filter chiller" },
      "CNC-004": { rpm: 8000, vibRms: 0.62, temp: 33.6, hi: 98, status: "HEALTHY", note: "Operasi normal" }
    }
  },
  {
    hour: 18,
    timeStr: "18:00",
    shift: "Shift 2 (Sore)",
    topPriorityId: "CNC-003",
    topPriorityName: "DMU 50 EVO_2",
    topPriorityBadge: "Thermal Anomaly",
    topPriorityReason: "Flushing chiller berhasil; sirkulasi fluida pulih dan suhu spindle turun ke 46.8°C.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.20, temp: 35.0, hi: 89, status: "HEALTHY", note: "Offline" },
      "CNC-002": { rpm: 4000, vibRms: 1.90, temp: 39.5, hi: 76, status: "HEALTHY", note: "Operasi stabil" },
      "CNC-003": { rpm: 4000, vibRms: 1.10, temp: 46.8, hi: 55, status: "OUTER_RACE_FAULT", note: "Suhu berangsur turun setelah pembersihan chiller" },
      "CNC-004": { rpm: 8000, vibRms: 0.60, temp: 33.0, hi: 98, status: "HEALTHY", note: "Persiapan uji putaran tinggi" }
    }
  },
  {
    hour: 19,
    timeStr: "19:00",
    shift: "Shift 2 (Sore)",
    topPriorityId: "CNC-003",
    topPriorityName: "DMU 50 EVO_2",
    topPriorityBadge: "Thermal Anomaly",
    topPriorityReason: "Suhu CNC-003 berangsur normal; stabilisasi temperatur chiller paska pembersihan.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.20, temp: 34.5, hi: 90, status: "HEALTHY", note: "Offline" },
      "CNC-002": { rpm: 4000, vibRms: 2.10, temp: 40.8, hi: 73, status: "INNER_RACE_FAULT", note: "Operasi stabil" },
      "CNC-003": { rpm: 6000, vibRms: 0.83, temp: 42.5, hi: 88, status: "HEALTHY", note: "Suhu spindle kembali normal (42.5°C)" },
      "CNC-004": { rpm: 9000, vibRms: 0.64, temp: 34.0, hi: 98, status: "HEALTHY", note: "Peningkatan bertahap ke 9.000 RPM" }
    }
  },

  // ----------------------------------------------------------------------------
  // FASE 4: 20:00 - 23:00 (Shift 2 Akhir & Uji Mesin)
  // PRIORITAS #1: Mesin CNC Milling Joglo VF-500i (MCH-004) - Resonansi 10k RPM
  // ----------------------------------------------------------------------------
  {
    hour: 20,
    timeStr: "20:00",
    shift: "Shift 2 (Sore)",
    topPriorityId: "CNC-004",
    topPriorityName: "Joglo VF-500i",
    topPriorityBadge: "Resonant Spike",
    topPriorityReason: "⚠️ RESONANSI DITETAPKAN: Uji coba kecepatan 10.000 RPM memicu lonjakan getaran 2.88 mm/s (> ISO).",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.15, temp: 34.2, hi: 91, status: "HEALTHY", note: "Offline" },
      "CNC-002": { rpm: 4000, vibRms: 2.18, temp: 41.5, hi: 72, status: "INNER_RACE_FAULT", note: "Operasi stabil" },
      "CNC-003": { rpm: 6000, vibRms: 0.84, temp: 38.2, hi: 92, status: "HEALTHY", note: "Operasi normal" },
      "CNC-004": { rpm: 10000, vibRms: 2.88, temp: 39.5, hi: 65, status: "INNER_RACE_FAULT", note: "Uji 10.000 RPM; getaran harmonik melampaui 2.80 mm/s" }
    }
  },
  {
    hour: 21,
    timeStr: "21:00",
    shift: "Shift 2 (Sore)",
    topPriorityId: "CNC-004",
    topPriorityName: "Joglo VF-500i",
    topPriorityBadge: "Resonant Spike",
    topPriorityReason: "⚠️ PUNCAK RESONANSI: Getaran 2.95 mm/s, Suhu 41.2°C. Rekomendasi AI: batasi kecepatan aman di 8.500 RPM.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.10, temp: 34.0, hi: 92, status: "HEALTHY", note: "Offline" },
      "CNC-002": { rpm: 3000, vibRms: 2.02, temp: 40.1, hi: 74, status: "INNER_RACE_FAULT", note: "Finishing akhir shift" },
      "CNC-003": { rpm: 4000, vibRms: 0.80, temp: 36.5, hi: 94, status: "HEALTHY", note: "Operasi normal" },
      "CNC-004": { rpm: 10000, vibRms: 2.95, temp: 41.2, hi: 63, status: "INNER_RACE_FAULT", note: "Puncak lonjakan resonansi dinamis (2.95 mm/s)" }
    }
  },
  {
    hour: 22,
    timeStr: "22:00",
    shift: "Shift 2 (Sore)",
    topPriorityId: "CNC-004",
    topPriorityName: "Joglo VF-500i",
    topPriorityBadge: "Resonant Spike",
    topPriorityReason: "Uji kecepatan selesai; RPM diturunkan ke 6.000 RPM, getaran mereda ke 2.70 mm/s.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.05, temp: 33.8, hi: 93, status: "HEALTHY", note: "Offline" },
      "CNC-002": { rpm: 0, vibRms: 1.75, temp: 37.5, hi: 80, status: "HEALTHY", note: "Pembersihan workshop" },
      "CNC-003": { rpm: 0, vibRms: 0.74, temp: 34.8, hi: 96, status: "HEALTHY", note: "Pembersihan workshop" },
      "CNC-004": { rpm: 6000, vibRms: 2.70, temp: 37.8, hi: 76, status: "HEALTHY", note: "RPM diturunkan; getaran kembali di bawah batas ISO" }
    }
  },
  {
    hour: 23,
    timeStr: "23:00",
    shift: "Shift 3 (Malam)",
    topPriorityId: "CNC-002",
    topPriorityName: "DMU 50 EVO_1",
    topPriorityBadge: "Inner Race Fault",
    topPriorityReason: "Handover Shift 2 ke Shift 3; MCH-002 kembali disiapkan untuk running batch malam berikutnya.",
    machines: {
      "CNC-001": { rpm: 0, vibRms: 1.00, temp: 33.5, hi: 94, status: "HEALTHY", note: "Standby malam" },
      "CNC-002": { rpm: 4000, vibRms: 2.15, temp: 39.5, hi: 72, status: "INNER_RACE_FAULT", note: "Handover shift 3; persiapan running batch" },
      "CNC-003": { rpm: 0, vibRms: 0.70, temp: 33.2, hi: 97, status: "HEALTHY", note: "Standby malam" },
      "CNC-004": { rpm: 0, vibRms: 0.53, temp: 31.5, hi: 99, status: "HEALTHY", note: "Standby malam" }
    }
  }
];

// 2. DATABASE LAPORAN HARIAN (Per Tanggal - Periode Operasi 24 Jam)
const INITIAL_REPORTS = [
  { id: "REP-01", title: "Laporan Harian - 24 Okt 2026", date: "24 Oktober 2026", dateRange: "24 Okt 2026 (24 Jam)", activeMachines: 4, alertsCount: 1 },
  { id: "REP-02", title: "Laporan Harian - 23 Okt 2026", date: "23 Oktober 2026", dateRange: "23 Okt 2026 (24 Jam)", activeMachines: 4, alertsCount: 0 },
  { id: "REP-03", title: "Laporan Harian - 22 Okt 2026", date: "22 Oktober 2026", dateRange: "22 Okt 2026 (24 Jam)", activeMachines: 4, alertsCount: 0 },
  { id: "REP-04", title: "Laporan Harian - 21 Okt 2026", date: "21 Oktober 2026", dateRange: "21 Okt 2026 (24 Jam)", activeMachines: 4, alertsCount: 2 }
];

// STATE APLIKASI
let state = {
  machines: JSON.parse(JSON.stringify(INITIAL_MACHINES)),
  currentView: "spindle", // 'spindle' | 'reports' | 'service'
  selectedMachineId: "CNC-001",
  isAlertResolved: false,
  searchTerm: "",
  isSimulationActive: true,
  previewReportTitle: null,
  pendingReportTitle: null,
  pendingReportDate: null,
  selectedTimeRange: "00:00 - 23:59 WIB",
  reportActiveMachineId: "CNC-001",
  // STATE SHIFT REPORT STUDIO
  reportSearchQuery: "",
  reportFilterDate: "2026-10-24",
  reportTimeStart: "00:00",
  reportTimeEnd: "23:59",
  reportStatusFilter: "ALL",
  reportSelectedMachineIds: []
};

// INITIALIZATION
window.addEventListener("DOMContentLoaded", () => {
  initClock();
  initNavigation();
  initLiveSimulation();
  renderApp();
});

// Listener cetak untuk mereset scroll container ke 0 agar tabel dicetak lengkap dari jam 00:00
window.addEventListener("beforeprint", () => {
  const modalContent = document.getElementById("report-modal-body");
  if (modalContent) modalContent.scrollTop = 0;
  document.querySelectorAll(".report-table-scroll-container").forEach((el) => {
    el.scrollTop = 0;
  });
});

// CLOCK
function initClock() {
  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    const timeStr = `${h} : ${m} : ${s}  WIB`;
    const clockEl = document.getElementById("wib-clock-pill");
    if (clockEl) clockEl.textContent = timeStr;
  }
  update();
  setInterval(update, 1000);
}

// NAVIGATION
function initNavigation() {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      switchView(view);
    });
  });

  const addBtn = document.getElementById("btn-add-machine-header");
  if (addBtn) {
    addBtn.addEventListener("click", () => switchView("add-machine"));
  }
}

function switchView(viewName, machineId = null) {
  state.currentView = viewName;
  if (machineId) {
    state.selectedMachineId = machineId;
  }
  if (viewName === "reports") {
    state.reportSelectedMachineIds = [];
  }

  // Update active state in sidebar (Spindle Diagnostic button is active for both 'spindle' and 'machine-detail')
  document.querySelectorAll(".nav-item").forEach((btn) => {
    const btnView = btn.getAttribute("data-view");
    const isSpindleActive = (viewName === "spindle" || viewName === "machine-detail") && btnView === "spindle";
    if (btnView === viewName || isSpindleActive) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderApp();
  // Scroll to top
  const main = document.getElementById("app-main");
  if (main) main.scrollTop = 0;
}

// ROUTER RENDERER
function renderApp() {
  const content = document.getElementById("view-content");
  if (!content) return;

  switch (state.currentView) {
    case "spindle":
    case "overview":
      content.innerHTML = renderSpindleSelectionHtml();
      attachOverviewEvents();
      break;
    case "machine-detail":
      content.innerHTML = renderSpindleDiagnosticHtml();
      attachSpindleEvents();
      break;
    case "registry":
      content.innerHTML = renderDeviceRegistryHtml();
      attachRegistryEvents();
      break;
    case "service":
      content.innerHTML = renderServiceLogHtml();
      attachServiceEvents();
      break;
    case "reports":
      content.innerHTML = renderShiftReportsHtml();
      attachReportsEvents();
      break;
    case "add-machine":
      content.innerHTML = renderAddMachineHtml();
      attachAddEvents();
      break;
    default:
      content.innerHTML = renderSpindleSelectionHtml();
  }
}

// HELPER: Dynamic Priority Sorting (Incident-Driven Float-to-Top)
function getSortedMachines() {
  const priorityMap = {
    OUTER_RACE_FAULT: 1, // Merah (Kritis)
    INNER_RACE_FAULT: 2, // Kuning (Waspada)
    HEALTHY: 3           // Hijau (Normal)
  };
  return [...state.machines].sort(
    (a, b) => (priorityMap[a.status] || 4) - (priorityMap[b.status] || 4)
  );
}

// HELPER: KPI Card HTML (Matches Image 1)
function renderKpiCardsHtml() {
  const total = state.machines.length;
  const normal = state.machines.filter((m) => m.status === "HEALTHY").length;
  const actionRequired = state.machines.filter((m) => m.status !== "HEALTHY").length;
  const avgHealth = Math.round(
    state.machines.reduce((acc, m) => acc + (m.healthIndex || 85), 0) / (total || 1)
  );

  return `
    <div class="kpi-row-figma">
      <div class="kpi-card-figma">
        <div class="kpi-label">Total Machines</div>
        <div class="kpi-value">${total}</div>
      </div>
      <div class="kpi-card-figma">
        <div class="kpi-label">Normal:</div>
        <div class="kpi-value">${normal}</div>
      </div>
      <div class="kpi-card-figma">
        <div class="kpi-label">Action required:</div>
        <div class="kpi-value">${actionRequired}</div>
      </div>
      <div class="kpi-card-figma">
        <div class="kpi-label">Average Spindle Health:</div>
        <div class="kpi-value">${avgHealth}%</div>
      </div>
    </div>
  `;
}

// HELPER: Generate Area Chart SVG (Matches Image 1 Dual Curves)
function generateFigmaAreaChartSvg(data, thresholdVal, thresholdLabel, color) {
  const width = 210;
  const height = 58;
  const isTemp = thresholdVal > 20;
  const dataMax = Math.max(...data);
  const dataMin = Math.min(...data);
  const minVal = isTemp ? Math.max(20, Math.floor(dataMin - 4)) : 0;
  const maxVal = Math.max(dataMax, thresholdVal * (isTemp ? 1.06 : 1.25));
  const range = maxVal - minVal || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 12) + 6;
    const y = height - 10 - ((v - minVal) / range) * (height - 22);
    return { x, y };
  });

  let pathD = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cx = (prev.x + curr.x) / 2;
    pathD += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${cx.toFixed(1)} ${((prev.y + curr.y) / 2).toFixed(1)}`;
    pathD += ` T ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }

  const areaD = `${pathD} L ${pts[pts.length - 1].x.toFixed(1)} ${height - 6} L ${pts[0].x.toFixed(1)} ${height - 6} Z`;
  const threshY = height - 10 - ((thresholdVal - minVal) / range) * (height - 22);
  const gradId = "grad-" + Math.random().toString(36).substring(2, 8);

  return `
    <svg viewBox="0 0 ${width} ${height}" class="area-chart-svg">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <!-- Threshold Line (ISO 2.80 / MAX 45°C) -->
      <line x1="4" y1="${threshY.toFixed(1)}" x2="${width - 4}" y2="${threshY.toFixed(1)}" 
            stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.8" />
      <text x="4" y="${(threshY - 3).toFixed(1)}" fill="#ef4444" font-size="7" font-family="'Poppins', sans-serif" font-weight="600">${thresholdLabel}</text>

      <!-- Shaded Gradient Area -->
      <path d="${areaD}" fill="url(#${gradId})" />

      <!-- Curve Line -->
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" />

      <!-- Active End Marker -->
      <circle cx="${pts[pts.length - 1].x.toFixed(1)}" cy="${pts[pts.length - 1].y.toFixed(1)}" r="3" fill="${color}" stroke="#ffffff" stroke-width="1" />
    </svg>
    <div class="chart-axis-labels">
      <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
    </div>
  `;
}

function renderOverviewCardsHtml(sorted) {
  return sorted
    .map((m) => {
      const isUrgent = m.status === "OUTER_RACE_FAULT";
      const isMedium = m.status === "INNER_RACE_FAULT";
      const isHealthy = m.status === "HEALTHY";

      // Color scheme matching Figma Image 1:
      // Card 1: Red (#ef4444)
      // Card 2: Amber (#f59e0b)
      // Card 3: Blue (#38bdf8)
      // Card 4: Green (#22c55e)
      let color = "#22c55e";
      let statusIcon = "✓";
      let valClass = "val-green";

      if (isUrgent) {
        color = "#ef4444";
        statusIcon = "⚠";
        valClass = "val-red";
      } else if (isMedium) {
        color = "#f59e0b";
        statusIcon = "✓";
        valClass = "val-amber";
      } else if (m.id === "CNC-003") {
        color = "#38bdf8";
        statusIcon = "✓";
        valClass = "val-blue";
      }

      const cardFaultClass = isUrgent ? "card-fault-urgent" : "";

      return `
        <div class="machine-card-figma ${cardFaultClass}" onclick="switchView('machine-detail', '${m.id}')" style="cursor: pointer;">
          <!-- Top Row: Title + RUN Pill -->
          <div class="card-top-row">
            <div class="card-title-text">${m.name}</div>
            <div class="card-run-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>RUN LIVE</span>
            </div>
          </div>

          <!-- Middle Row: Dual Charts Side-by-Side (Matches Image 1) -->
          <div class="dual-charts-grid">
            <!-- Left Chart: Tren Getaran RMS -->
            <div class="chart-box-figma">
              <div class="chart-header-figma">
                <span class="chart-label-figma">TREN GETARAN RMS</span>
                <span class="chart-val-figma ${valClass}">${m.vibrationRms.toFixed(2)} mm/s ${statusIcon}</span>
              </div>
              ${generateFigmaAreaChartSvg(m.historyVibRms, 2.80, "ISO 2.80", color)}
            </div>

            <!-- Right Chart: Tren Suhu Bantalan -->
            <div class="chart-box-figma">
              <div class="chart-header-figma">
                <span class="chart-label-figma">TREN SUHU BANTALAN</span>
                <span class="chart-val-figma ${valClass}">${m.temperature.toFixed(1)} °C ${statusIcon}</span>
              </div>
              ${generateFigmaAreaChartSvg(m.historyTemp, 45.0, "MAX 45°C", color)}
            </div>
          </div>

          <!-- Bottom Row: 3 Metric Boxes -->
          <div class="metrics-row-figma">
            <div class="metric-pill-box">
              <div class="metric-pill-label">Vibration RMS</div>
              <div class="metric-pill-val" style="color: ${color}; font-weight: 700;">${m.vibrationRms.toFixed(2)} mm/s</div>
            </div>
            <div class="metric-pill-box">
              <div class="metric-pill-label">Spindle Temp</div>
              <div class="metric-pill-val" style="color: ${m.temperature > 45 ? "#ef4444" : "#38bdf8"}; font-weight: 700;">${m.temperature.toFixed(1)} °C</div>
            </div>
            <div class="metric-pill-box">
              <div class="metric-pill-label">Health Index</div>
              <div class="metric-pill-val" style="color: ${color}; font-weight: 700;">${m.healthIndex}%</div>
            </div>
          </div>

          <!-- Bottom Action Button -->
          <div class="card-bottom-actions">
            <button class="btn-detail-diagnostik" onclick="event.stopPropagation(); switchView('machine-detail', '${m.id}')">
              Detail Diagnostik
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

// ==============================================================================
// 1. SPINDLE DIAGNOSTIC SELECTION PAGE (Grid Pemilihan Mesin & Executive KPI)
// ==============================================================================
function renderSpindleSelectionHtml() {
  const sorted = getSortedMachines();

  return `
    <div class="overview-header" style="margin-bottom: 20px;">
      <div>
        <h1 class="overview-title" style="margin-bottom: 4px;">Spindle Diagnostic</h1>
        <div class="card-location font-mono" style="font-size: 0.8rem; color: #94a3b8;">
          Pilih unit mesin untuk analisa getaran multi-sensor & diagnosa dini bearing spindle • PT YPTI
        </div>
      </div>
      <div class="header-actions">
        <div id="wib-clock-pill" class="clock-pill">21 : 12 : 30  WIB</div>
        <button class="btn-add-machine-pill" onclick="switchView('add-machine')">
          <span>+</span> Add Machine
        </button>
      </div>
    </div>

    <!-- KPI Stat Cards -->
    <div id="overview-kpi-container">${renderKpiCardsHtml()}</div>

    <div class="machine-grid-figma" id="overview-machine-grid">
      ${renderOverviewCardsHtml(sorted)}
    </div>
  `;
}

function renderOverviewHtml() {
  return renderSpindleSelectionHtml();
}

function attachOverviewEvents() {}

function renderSpindleCardsHtml() {
  return state.machines
    .map((m) => {
      const isUrgent = m.status === "OUTER_RACE_FAULT";
      const isMedium = m.status === "INNER_RACE_FAULT";
      const badgeClass = isUrgent
        ? "badge-urgent"
        : isMedium
        ? "badge-medium"
        : "badge-normal";
      const badgeText = isUrgent ? "Urgent" : isMedium ? "Medium" : "Normal";

      // Pulsing hotspot jika mengalami cacat bearing
      let hotspotHtml = "";
      if (isUrgent) {
        // Hotspot di Front Bearing (kanan)
        hotspotHtml = `<div class="pulsing-hotspot" style="right: 18%; top: 48%; transform: translateY(-50%);"></div>`;
      } else if (isMedium) {
        // Hotspot di Rear Bearing (kiri)
        hotspotHtml = `<div class="pulsing-hotspot" style="left: 20%; top: 48%; transform: translateY(-50%);"></div>`;
      }

      const vibColor = isUrgent ? "#ef4444" : isMedium ? "#f59e0b" : "#10b981";

      return `
        <div class="machine-card" style="cursor: default;">
          <div class="card-header-row">
            <div class="card-machine-name">${m.name}</div>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>

          <div class="spindle-view-container" style="margin: 12px 0;">
            <img src="./images/spindle-horizontal.png" alt="3D Spindle" class="spindle-img-horizontal" />
            ${hotspotHtml}
          </div>

          <div class="metrics-row" style="margin-bottom: 12px;">
            <div class="metric-box">
              <div class="metric-label">Vibration RMS</div>
              <div class="metric-value font-mono" style="color: ${vibColor}; font-weight: 700;">${m.vibrationRms.toFixed(2)} mm/s</div>
            </div>
            <div class="metric-box">
              <div class="metric-label">Spindle Temp</div>
              <div class="metric-value font-mono" style="color: ${m.temperature > 45 ? "#ef4444" : "#0284c7"}; font-weight: 700;">${m.temperature.toFixed(1)} °C</div>
            </div>
            <div class="metric-box">
              <div class="metric-label">Health Index</div>
              <div class="metric-value font-mono" style="color: ${vibColor}; font-weight: 700;">${m.healthIndex}%</div>
            </div>
          </div>

          <button class="btn-primary" style="width: 100%; justify-content: center;" onclick="switchView('machine-detail', '${m.id}')">
            Detail Diagnostik &rarr;
          </button>
        </div>
      `;
    })
    .join("");
}

// ==============================================================================
// 2. SPINDLE DIAGNOSTIC PAGE (Unified Master Hub: Output Sensor, 3D Locator, Rekomendasi, & 24h Chart)
// ==============================================================================
function selectSpindleMachine(machineId) {
  state.selectedMachineId = machineId;
  state.currentView = "machine-detail";
  renderApp();
}

function renderSpindleDiagnosticHtml() {
  const machine =
    state.machines.find((m) => m.id === state.selectedMachineId) ||
    state.machines[0];

  const isN2Fault = machine.status === "OUTER_RACE_FAULT";
  const isN1Fault = machine.status === "INNER_RACE_FAULT";

  // Hotspot di 3D Horizontal Spindle Locator (Gambar 2)
  let horizontalHotspotHtml = "";
  if (isN2Fault) {
    horizontalHotspotHtml = `<div class="pulsing-hotspot" style="right: 17%; top: 48%; transform: translateY(-50%);"></div>`;
  } else if (isN1Fault) {
    horizontalHotspotHtml = `<div class="pulsing-hotspot" style="left: 20%; top: 48%; transform: translateY(-50%);"></div>`;
  }

  // Hotspot di Vertical Cutaway Spindle (Gambar 4)
  let verticalHotspotHtml = "";
  if (isN2Fault) {
    verticalHotspotHtml = `<div class="pulsing-hotspot" style="left: 36%; bottom: 16%;"></div>`;
  } else if (isN1Fault) {
    verticalHotspotHtml = `<div class="pulsing-hotspot" style="left: 36%; top: 22%;"></div>`;
  }

  // Anomaly Banner configuration (Gambar 2)
  let bannerBg = "rgba(16, 185, 129, 0.1)";
  let bannerBorder = "#10b981";
  let bannerDot = "#10b981";
  let bannerTitle = "Status Operasional Normal:";
  let bannerMsg = "Getaran spindle dan suhu bearing beroperasi stabil dalam batas toleransi ISO 10816-3.";
  let badgeClass = "badge-normal";
  let badgeText = "Normal";

  if (isN2Fault) {
    bannerBg = "rgba(69, 10, 10, 0.8)";
    bannerBorder = "#ef4444";
    bannerDot = "#ef4444";
    bannerTitle = "Anomaly Detection:";
    bannerMsg = "N2 bearing vibration exceeds ISO limit (BPFO: 142 Hz). Recommended technical response: within 4 hours.";
    badgeClass = "badge-urgent";
    badgeText = "Urgent";
  } else if (isN1Fault) {
    bannerBg = "rgba(120, 53, 15, 0.7)";
    bannerBorder = "#f59e0b";
    bannerDot = "#f59e0b";
    bannerTitle = "Warning Alert:";
    bannerMsg = "N1 bearing degradation detected (BPFI: 218 Hz). Lubrication replenishment recommended.";
    badgeClass = "badge-medium";
    badgeText = "Medium";
  }

  // Baris Tabel Output Sensor Live Stream
  const tableRows = machine.telemetryLogs
    .map(
      (log) => `
    <tr>
      <td style="color: #94a3b8;">${log.timestamp}</td>
      <td style="font-weight: 700; color: #f1f5f9;">${log.temp.toFixed(1)} °C</td>
      <td style="font-weight: 700; color: #38bdf8;">${log.vibN1.toFixed(2)} mm/s</td>
      <td style="font-weight: 700; color: #f59e0b;">${log.vibN2.toFixed(2)} mm/s</td>
    </tr>
  `
    )
    .join("");

  // Machine Switcher Tabs HTML
  const machineTabsHtml = state.machines.map((m) => {
    const isSelected = m.id === machine.id;
    const dotColor = m.status === "OUTER_RACE_FAULT" ? "#ef4444" : m.status === "INNER_RACE_FAULT" ? "#f59e0b" : "#10b981";
    return `
      <button class="btn-machine-tab ${isSelected ? 'active' : ''}" onclick="selectSpindleMachine('${m.id}')" style="display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 8px ${dotColor};"></span>
        <span style="font-weight: ${isSelected ? '700' : '500'};">${escapeHtml(m.name)}</span>
        <span style="font-size: 0.68rem; opacity: 0.75;">(${m.deviceId})</span>
      </button>
    `;
  }).join("");

  // Target bearing text
  const targetBearingName = isN2Fault
    ? "Front Bearing"
    : isN1Fault
    ? "Rear Bearing"
    : "Spindle Bearing Assemblies";
  const targetBearingLocation = isN2Fault
    ? "Spindle · N2 · Front side"
    : isN1Fault
    ? "Spindle · N1 · Rear side"
    : "Spindle · N1 (Rear) & N2 (Front) Normal";

  return `
    <!-- TOP HEADER: Back Button, Machine Title, & Machine Tabs Switcher (Sesuai Gambar 2) -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <button class="btn-resolve" onclick="switchView('spindle')" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; font-size: 0.84rem; cursor: pointer; border-radius: 8px; background: rgba(51, 65, 85, 0.5); border: 1px solid rgba(148, 163, 184, 0.3); color: #f1f5f9;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span style="font-weight: 600;">Back</span>
        </button>
        <div>
          <div style="font-size: 1.35rem; font-weight: 700; color: #ffffff;">${escapeHtml(machine.name)}</div>
          <div class="card-location font-mono" style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">
            ${escapeHtml(machine.location)} · ID Perangkat: <span style="color: #38bdf8; font-weight: 600;">${machine.deviceId}</span> · Spindle Speed: <strong style="color: #ffffff;">${machine.spindleSpeedRpm} RPM</strong> · Jam Operasi: <strong style="color: #ffffff;">${machine.runHours} Jam</strong>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${machineTabsHtml}
      </div>
    </div>

    <!-- ANOMALY DETECTION BANNER FULL-WIDTH (Gambar 2) -->
    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 18px; border-radius: 12px; background: ${bannerBg}; border: 1px solid ${bannerBorder}; font-family: var(--font-mono); font-size: 0.8rem; margin-bottom: 20px;">
      <span style="width: 9px; height: 9px; border-radius: 50%; background-color: ${bannerDot}; box-shadow: 0 0 10px ${bannerDot}; flex-shrink: 0;"></span>
      <strong style="color: ${bannerBorder};">${bannerTitle}</strong>
      <span style="color: #f1f5f9;">${bannerMsg}</span>
    </div>

    <!-- ROW 1: Output Sensor Table (Left) + 3D Spindle Photo Locator (Right) (Gambar 2) -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 20px; margin-bottom: 20px;">
      <!-- Table Left: Output Sensor Live Stream -->
      <div class="machine-card" style="cursor: default;">
        <div class="card-header-row" style="margin-bottom: 12px;">
          <div style="font-family: var(--font-mono); font-weight: 700; color: #ffffff; font-size: 0.95rem;">Output Sensor</div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #64748b;">Live Stream</div>
        </div>

        <div class="industrial-table-wrapper" style="box-shadow: none;">
          <table class="industrial-table" style="font-size: 0.8rem;">
            <thead>
              <tr>
                <th>Time Stamp</th>
                <th>Temp</th>
                <th>N1 (Rear)</th>
                <th>N2 (Front)</th>
              </tr>
            </thead>
            <tbody id="machine-detail-tbody">
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Spindle Locator Right: 3D Spindle Locator -->
      <div class="machine-card" style="cursor: default;">
        <div class="card-header-row" style="margin-bottom: 12px;">
          <div style="font-family: var(--font-mono); font-weight: 700; color: #ffffff; font-size: 0.95rem;">3D Spindle Locator</div>
          <span class="badge ${badgeClass}" style="font-size: 0.7rem;">${machine.deviceId}</span>
        </div>

        <div class="spindle-view-container" style="flex: 1; min-height: 200px;">
          <img src="./images/spindle-horizontal.png" alt="3D Spindle" class="spindle-img-horizontal" />
          
          <!-- Pin N1 (Rear Bearing) -->
          <div class="locator-pin" style="left: 17%; top: 16%;">
            <div class="pin-label-n1">N1 - Rear Bearing</div>
            <div class="pin-line pin-line-n1"></div>
            <div class="pin-target-dot pin-dot-n1"></div>
          </div>

          <!-- Pin N2 (Front Bearing) -->
          <div class="locator-pin" style="right: 17%; top: 16%;">
            <div class="pin-label-n2">N2 - Front Bearing</div>
            <div class="pin-line pin-line-n2"></div>
            <div class="pin-target-dot pin-dot-n2"></div>
          </div>

          ${horizontalHotspotHtml}
        </div>
      </div>
    </div>

    <!-- ROW 2: REKOMENDASI PENANGANAN UNTUK SPINDLE YANG RUSAK (Gambar 4 - Service Log Card) -->
    <div class="machine-card" style="cursor: default; margin-bottom: 20px;">
      <div class="card-header-row" style="border-bottom: 1px solid rgba(51, 65, 85, 0.4); padding-bottom: 12px; margin-bottom: 16px;">
        <div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #ffffff; font-size: 1rem;">
            Rekomendasi Penanganan Spindle
          </div>
          <div class="card-location font-mono" style="font-size: 0.75rem; color: #94a3b8;">
            Unit: ${escapeHtml(machine.name)} · Device ID: ${machine.deviceId} · Evaluasi Presisi: 24 Oktober 2026, 15:00 WIB
          </div>
        </div>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: center;">
        <!-- Spindle Vertical Cutaway Photo with Red Glowing Hotspot -->
        <div class="spindle-view-container" style="aspect-ratio: 3 / 4; max-height: 240px; padding: 10px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px;">
          <img src="./images/spindle-cutaway.png" alt="Vertical Cutaway Spindle" style="height: 100%; object-fit: contain;" />
          ${verticalHotspotHtml}
        </div>

        <!-- Maintenance & Diagnostic Details -->
        <div style="display: flex; flex-direction: column; gap: 14px; font-family: var(--font-mono);">
          <div>
            <div style="font-weight: 700; color: #ffffff; font-size: 1rem;">${targetBearingName}</div>
            <div style="font-size: 0.75rem; color: #38bdf8;">${targetBearingLocation}</div>
          </div>

          <div>
            <div style="font-size: 0.75rem; font-weight: 600; color: #cbd5e1; margin-bottom: 2px;">Jadwal Tindakan Maintenance</div>
            <div style="font-size: 0.8rem; color: #ffffff;">Suggested: <span style="color: #fbbf24; font-weight: 600;">${machine.suggestedInspection || "Pemeriksaan Berkala"}</span></div>
          </div>

          <div>
            <div style="font-size: 0.75rem; font-weight: 600; color: #cbd5e1; margin-bottom: 4px;">Instruksi SOP Perbaikan / Penanganan:</div>
            <div style="font-size: 0.78rem; color: #94a3b8; line-height: 1.45; background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 8px; border-left: 2px solid ${bannerBorder};">
              ${escapeHtml(machine.recommendation || "Lakukan inspeksi pelumasan dan clearance spindle secara berkala.")}
            </div>
          </div>

          <div>
            <div style="font-size: 0.7rem; color: #64748b; margin-bottom: 6px;">Indikator Kondisi Real-Time</div>
            <div style="display: flex; gap: 12px;">
              <div class="metric-box" style="flex: 1; padding: 10px;">
                <div class="metric-label" style="font-size: 0.68rem;">Vibration RMS</div>
                <div id="spindle-live-vib" style="font-weight: 800; font-size: 1.05rem; color: ${machine.vibrationRms >= 2.8 ? '#ef4444' : '#34d399'};">
                  ${machine.vibrationRms.toFixed(2)} mm/s
                </div>
              </div>
              <div class="metric-box" style="flex: 1; padding: 10px;">
                <div class="metric-label" style="font-size: 0.68rem;">Spindle Temp</div>
                <div id="spindle-live-temp" style="font-weight: 800; font-size: 1.05rem; color: ${machine.temperature >= 45 ? '#ef4444' : '#38bdf8'};">
                  ${machine.temperature.toFixed(1)} °C
                </div>
              </div>
              <div class="metric-box" style="flex: 1; padding: 10px;">
                <div class="metric-label" style="font-size: 0.68rem;">Health Index</div>
                <div style="font-weight: 800; font-size: 1.05rem; color: #38bdf8;">
                  ${machine.healthIndex}%
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px;">
            <button class="btn-primary" onclick="showToast('Teknisi maintenance berhasil ditugaskan ke unit ${machine.name}!')" style="padding: 10px 20px; font-size: 0.82rem;">
              Tugaskan Teknisi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ROW 3: Temperature & Vibration Monitoring (24-Hour) (Gambar 3 - Tanpa Status Mesin & Speedometer Bawah) -->
    <div class="machine-card" style="cursor: default; margin-bottom: 20px;">
      <div class="card-header-row" style="margin-bottom: 16px;">
        <div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #ffffff; font-size: 1rem;">
            Temperature & Vibration Monitoring (24-Hour)
          </div>
          <div class="card-location font-mono">Batas Standar ISO 10816: 2.80 mm/s</div>
        </div>
        <div style="display: flex; gap: 16px; font-family: var(--font-mono); font-size: 0.75rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #00e5ff;"></span>
            <span style="color: #cbd5e1;">Vibration RMS</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #fbbf24;"></span>
            <span style="color: #cbd5e1;">Spindle Temp</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 12px; height: 2px; background: #ef4444;"></span>
            <span style="color: #ef4444;">Batas ISO (2.80 mm/s)</span>
          </div>
        </div>
      </div>

      <div style="width: 100%; height: 260px; position: relative;">
        <canvas id="dual-monitoring-canvas" style="width: 100%; height: 100%;"></canvas>
      </div>
    </div>
  `;
}

function attachSpindleEvents() {
  const machine =
    state.machines.find((m) => m.id === state.selectedMachineId) ||
    state.machines[0];
  drawDualCanvasChart("dual-monitoring-canvas", machine);
}

// ==============================================================================
// 3. DEVICE REGISTRY PAGE (Matches Mockup 3 - Direct IoT Monitoring Table)
// ==============================================================================
function renderRegistryRowHtml(m) {
  return `
    <tr>
      <td style="font-weight: 700; color: #ffffff;">${m.name}</td>
      <td style="color: #94a3b8;">${m.deviceId}</td>
      <td style="color: #38bdf8;">${m.deviceIp}</td>
      <td>
        <span class="badge badge-normal" style="padding: 2px 10px; font-size: 0.7rem;">Connected</span>
      </td>
      <td style="color: #64748b; font-size: 0.75rem;">10 Nov 2026 - 15:10:42</td>
    </tr>
  `;
}

function renderDeviceRegistryHtml() {
  const term = state.searchTerm.toLowerCase().trim();
  const filtered = state.machines.filter(
    (m) =>
      m.name.toLowerCase().includes(term) ||
      m.deviceId.toLowerCase().includes(term) ||
      m.deviceIp.toLowerCase().includes(term)
  );

  const rowsHtml = filtered.map(renderRegistryRowHtml).join("");

  return `
    <div class="top-header">
      <h2 class="page-title">Device Registry</h2>
    </div>

    <div style="margin-bottom: 20px; max-width: 400px;">
      <input type="text" id="registry-search" class="form-input" placeholder="Search machines, device ID, IP..." value="${state.searchTerm}" autocomplete="off" />
    </div>

    <div class="industrial-table-wrapper">
      <table class="industrial-table">
        <thead>
          <tr>
            <th>Machine</th>
            <th>Device ID</th>
            <th>Device IP Address</th>
            <th>Connection</th>
            <th>Last Data Received</th>
          </tr>
        </thead>
        <tbody id="registry-table-body">
          ${rowsHtml || `<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 24px;">Tidak ada mesin ditemukan</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function attachRegistryEvents() {
  const searchInput = document.getElementById("registry-search");
  const tableBody = document.getElementById("registry-table-body");
  if (searchInput && tableBody) {
    searchInput.addEventListener("input", (e) => {
      state.searchTerm = e.target.value;
      const term = state.searchTerm.toLowerCase().trim();
      const filtered = state.machines.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.deviceId.toLowerCase().includes(term) ||
          m.deviceIp.toLowerCase().includes(term)
      );

      tableBody.innerHTML =
        filtered.length > 0
          ? filtered.map(renderRegistryRowHtml).join("")
          : `<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 24px;">Tidak ada mesin ditemukan</td></tr>`;
    });
  }
}

// ==============================================================================
// 4. SERVICE LOG PAGE (Matches Mockup 4)
// ==============================================================================
function renderServiceLogHtml() {
  const faultyMachines = state.machines.filter((m) => m.status !== "HEALTHY");

  const cardsHtml = faultyMachines
    .map((m) => {
      const isUrgent = m.status === "OUTER_RACE_FAULT";
      const badgeClass = isUrgent ? "badge-urgent" : "badge-medium";
      const badgeText = isUrgent ? "Urgent" : "Medium";

      return `
        <div class="machine-card" style="cursor: default;">
          <div class="card-header-row" style="border-bottom: 1px solid rgba(51, 65, 85, 0.4); padding-bottom: 12px;">
            <div>
              <div class="card-machine-name">${m.name}</div>
              <div class="card-location font-mono">Device ID: ${m.deviceId} · 10 Nov 2026, 15:00</div>
            </div>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: center; margin: 16px 0;">
            <!-- Spindle Vertical Cutaway Photo with Red Glowing Hotspot -->
            <div class="spindle-view-container" style="aspect-ratio: 3 / 4; max-height: 240px; padding: 8px;">
              <img src="./images/spindle-cutaway.png" alt="Vertical Cutaway Spindle" style="height: 100%; object-fit: contain;" />
              <!-- Hotspot merah menyala pada bola bearing bawah -->
              <div class="pulsing-hotspot" style="left: 36%; bottom: 16%;"></div>
            </div>

            <!-- Maintenance Details -->
            <div style="display: flex; flex-direction: column; gap: 12px; font-family: var(--font-mono);">
              <div>
                <div style="font-weight: 700; color: #ffffff; font-size: 0.95rem;">Front Bearing</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Spindle · N2 · Front side</div>
              </div>

              <div>
                <div style="font-size: 0.75rem; font-weight: 600; color: #cbd5e1;">Maintenance Reminder</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Suggested: ${m.suggestedInspection}</div>
              </div>

              <div>
                <div style="font-size: 0.7rem; color: #64748b; margin-bottom: 6px;">Condition Indicators</div>
                <div style="display: flex; gap: 8px;">
                  <div class="metric-box" style="flex: 1; padding: 8px;">
                    <div class="metric-label" style="font-size: 0.65rem;">Vib RMS</div>
                    <div style="font-weight: 800; font-size: 0.95rem; color: #ef4444;">${m.vibrationRms.toFixed(2)} mm/s</div>
                  </div>
                  <div class="metric-box" style="flex: 1; padding: 8px;">
                    <div class="metric-label" style="font-size: 0.65rem;">Temp</div>
                    <div style="font-weight: 800; font-size: 0.95rem; color: #ef4444;">${m.temperature.toFixed(1)} °C</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;">
            <button class="btn-primary" onclick="showToast('Teknisi berhasil ditugaskan ke unit ${m.name}!')">
              Tugaskan Teknisi
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="top-header">
      <h2 class="page-title">Service Log</h2>
    </div>

    <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; color: #94a3b8; margin-bottom: 16px;">
      Recommended Maintenance :
    </div>

    <div class="machine-grid">
      ${cardsHtml}
    </div>
  `;
}

function attachServiceEvents() {}

// ==============================================================================
// 5. SHIFT & DAILY REPORTS STUDIO (Interactive Generator & Multi-Machine Selection)
// ==============================================================================
function formatIndonesianDate(dateStr) {
  if (!dateStr) return "24 Oktober 2026";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}

function getFilteredReportMachines() {
  const q = (state.reportSearchQuery || "").trim().toLowerCase();

  return state.machines.filter((m) => {
    if (q) {
      const nameMatch = (m.name || "").toLowerCase().includes(q);
      const idMatch = (m.id || "").toLowerCase().includes(q) || (m.deviceId || "").toLowerCase().includes(q);
      const locMatch = (m.location || "").toLowerCase().includes(q);
      const typeMatch = (m.machineType || "").toLowerCase().includes(q) || (m.axisType || "").toLowerCase().includes(q);
      return nameMatch || idMatch || locMatch || typeMatch;
    }
    return true;
  });
}

function renderReportActionButtonsHtml() {
  const filtered = getFilteredReportMachines();
  const isAllSelected = filtered.length > 0 && filtered.every((m) => state.reportSelectedMachineIds.includes(m.id));

  return `
    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
      <button type="button" class="btn-select-all ${isAllSelected ? "active-all" : ""}" onclick="selectAllReportMachines(true)" title="Pilih seluruh unit mesin">
        Pilih Semua
      </button>
      <button type="button" class="btn-deselect-all" onclick="selectAllReportMachines(false)" title="Batalkan pilihan semua unit mesin">
        Batalkan Semua
      </button>
    </div>
  `;
}

// HELPER: Konversi string jam "HH:MM" atau "HH:MM:SS" menjadi total detik dari 00:00:00
function parseTimeToSeconds(timeStr, defaultH, defaultM, defaultS) {
  if (!timeStr) return defaultH * 3600 + defaultM * 60 + defaultS;
  const parts = String(timeStr).split(":");
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const s = parseInt(parts[2], 10);
  const finalH = isNaN(h) ? defaultH : Math.max(0, Math.min(23, h));
  const finalM = isNaN(m) ? defaultM : Math.max(0, Math.min(59, m));
  const finalS = isNaN(s) ? (defaultS || 0) : Math.max(0, Math.min(59, s));
  return finalH * 3600 + finalM * 60 + finalS;
}

// HELPER: Konversi string jam "HH:MM" menjadi total menit dari 00:00
function parseTimeToMinutes(timeStr, defaultH, defaultM) {
  return Math.floor(parseTimeToSeconds(timeStr, defaultH, defaultM, 0) / 60);
}

// HELPER: Mengambil log telemetri yang difilter presisi (Otomatis: Per Detik, Per Menit, atau Per Jam)
function getFilteredReportLogs(startTimeStr, endTimeStr) {
  const startSec = parseTimeToSeconds(startTimeStr || state.reportTimeStart, 0, 0, 0);
  let endSec = parseTimeToSeconds(endTimeStr || state.reportTimeEnd, 23, 59, 59);
  if (endSec < startSec) endSec = startSec;
  const diffSec = endSec - startSec;

  // ----------------------------------------------------------------------------
  // KASUS 1: SAMPLING PER DETIK (Rentang Waktu <= 90 Detik, misal 00:00:00 s/d 00:00:30)
  // ----------------------------------------------------------------------------
  if (diffSec <= 90 && diffSec > 0) {
    const result = [];
    for (let s = startSec; s <= endSec; s++) {
      const hh = Math.floor(s / 3600);
      const mm = Math.floor((s % 3600) / 60);
      const ss = s % 60;
      const timeStr = String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0") + ":" + String(ss).padStart(2, "0");
      const baseHourLog = SIMULATION_24H_LOGS[hh] || SIMULATION_24H_LOGS[0];

      // Clone data mesin dengan getaran & suhu runut detik realistis (sinusoidal offset sensor)
      const granularMachines = {};
      Object.keys(baseHourLog.machines).forEach((machId) => {
        const mData = baseHourLog.machines[machId];
        const seed = parseInt(machId.replace(/\D/g, "") || "1", 10);
        const vibNoise = Math.sin(ss * 0.8 + seed) * 0.04 + Math.cos(ss * 1.5) * 0.02;
        const tempNoise = Math.sin(ss * 0.2 + seed) * 0.15;

        granularMachines[machId] = {
          ...mData,
          vibRms: Math.max(0.15, Number((mData.vibRms + vibNoise).toFixed(2))),
          temp: Number((mData.temp + tempNoise).toFixed(1))
        };
      });

      result.push({
        hour: hh,
        minute: mm,
        second: ss,
        timeStr: timeStr,
        resolutionMode: "per_detik",
        shift: baseHourLog.shift,
        topPriorityId: baseHourLog.topPriorityId,
        topPriorityName: baseHourLog.topPriorityName,
        topPriorityBadge: baseHourLog.topPriorityBadge,
        topPriorityReason: baseHourLog.topPriorityReason,
        machines: granularMachines
      });
    }
    return result;
  }

  // ----------------------------------------------------------------------------
  // KASUS 2: SAMPLING PER 1 MENIT PENUH (Rentang 1 Menit s/d 45 Menit, misal 00:00 s/d 00:30)
  // Menghasilkan 1 baris untuk SETIAP menit (Bukan lagi kelipatan 5!)
  // ----------------------------------------------------------------------------
  if (diffSec <= 2700) {
    const startMin = Math.floor(startSec / 60);
    const endMin = Math.floor(endSec / 60);
    const result = [];

    for (let m = startMin; m <= endMin; m++) {
      const hh = Math.floor(m / 60);
      const mm = m % 60;
      const timeStr = String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
      const baseHourLog = SIMULATION_24H_LOGS[hh] || SIMULATION_24H_LOGS[0];

      const granularMachines = {};
      Object.keys(baseHourLog.machines).forEach((machId) => {
        const mData = baseHourLog.machines[machId];
        const seed = (mm * 7 + parseInt(machId.replace(/\D/g, "") || "1", 10)) % 10;
        const vibDelta = ((seed - 4.5) / 100);
        const tempDelta = ((seed - 4.5) / 50);

        granularMachines[machId] = {
          ...mData,
          vibRms: Math.max(0.15, Number((mData.vibRms + vibDelta).toFixed(2))),
          temp: Number((mData.temp + tempDelta).toFixed(1))
        };
      });

      result.push({
        hour: hh,
        minute: mm,
        timeStr: timeStr,
        resolutionMode: "per_menit",
        shift: baseHourLog.shift,
        topPriorityId: baseHourLog.topPriorityId,
        topPriorityName: baseHourLog.topPriorityName,
        topPriorityBadge: baseHourLog.topPriorityBadge,
        topPriorityReason: baseHourLog.topPriorityReason,
        machines: granularMachines
      });
    }
    return result;
  }

  // ----------------------------------------------------------------------------
  // KASUS 3: SAMPLING PER 2 MENIT (Rentang 45 s/d 90 Menit)
  // ----------------------------------------------------------------------------
  if (diffSec <= 5400) {
    const startMin = Math.floor(startSec / 60);
    const endMin = Math.floor(endSec / 60);
    const result = [];

    for (let m = startMin; m <= endMin; m += 2) {
      const hh = Math.floor(m / 60);
      const mm = m % 60;
      const timeStr = String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
      const baseHourLog = SIMULATION_24H_LOGS[hh] || SIMULATION_24H_LOGS[0];

      const granularMachines = {};
      Object.keys(baseHourLog.machines).forEach((machId) => {
        const mData = baseHourLog.machines[machId];
        const seed = (mm * 7 + parseInt(machId.replace(/\D/g, "") || "1", 10)) % 10;
        const vibDelta = ((seed - 4.5) / 100);
        const tempDelta = ((seed - 4.5) / 50);

        granularMachines[machId] = {
          ...mData,
          vibRms: Math.max(0.15, Number((mData.vibRms + vibDelta).toFixed(2))),
          temp: Number((mData.temp + tempDelta).toFixed(1))
        };
      });

      result.push({
        hour: hh,
        minute: mm,
        timeStr: timeStr,
        resolutionMode: "per_menit",
        shift: baseHourLog.shift,
        topPriorityId: baseHourLog.topPriorityId,
        topPriorityName: baseHourLog.topPriorityName,
        topPriorityBadge: baseHourLog.topPriorityBadge,
        topPriorityReason: baseHourLog.topPriorityReason,
        machines: granularMachines
      });
    }
    return result;
  }

  // ----------------------------------------------------------------------------
  // KASUS 4: SAMPLING PER JAM (Rentang Multi-Jam > 90 Menit s/d 24 Jam Penuh)
  // ----------------------------------------------------------------------------
  const startH = Math.floor(startSec / 3600);
  const endH = Math.floor(endSec / 3600);
  const result = [];

  for (let h = startH; h <= endH; h++) {
    if (SIMULATION_24H_LOGS[h]) {
      result.push({
        ...SIMULATION_24H_LOGS[h],
        resolutionMode: "per_jam"
      });
    }
  }

  return result;
}

// HELPER: Mengambil log telemetri 24 jam yang difilter rentang waktu aktif
function getFiltered24hLogs() {
  return getFilteredReportLogs(state.reportTimeStart, state.reportTimeEnd);
}

// HELPER: Menghitung skor urgensi mesin pada rentang jam aktif untuk penentuan prioritas dinamis
function getMachineUrgencyInActiveRange(machineId) {
  const logs = getFiltered24hLogs();
  if (logs.length === 0) {
    return { peakVib: 0, peakTemp: 0, avgVib: 0, avgTemp: 0, score: 0, dominantStatus: "HEALTHY", dominantNote: "" };
  }
  
  let peakVib = 0;
  let peakTemp = 0;
  let sumVib = 0;
  let sumTemp = 0;
  let dominantStatus = "HEALTHY";
  let dominantNote = "";

  logs.forEach((l) => {
    const data = l.machines[machineId];
    if (data) {
      if (data.vibRms > peakVib) {
        peakVib = data.vibRms;
        if (data.status !== "HEALTHY") {
          dominantStatus = data.status;
          dominantNote = data.note;
        }
      }
      if (data.temp > peakTemp) {
        peakTemp = data.temp;
        if (data.temp >= 45.0) {
          dominantStatus = dominantStatus === "OUTER_RACE_FAULT" ? "OUTER_RACE_FAULT" : "OUTER_RACE_FAULT";
        }
      }
      sumVib += data.vibRms;
      sumTemp += data.temp;
    }
  });

  const avgVib = Number((sumVib / logs.length).toFixed(2));
  const avgTemp = Number((sumTemp / logs.length).toFixed(1));
  
  // Bobot evaluasi: Melebihi ISO 2.80 mm/s (bobot 4.0), Melebihi Suhu 45°C (bobot 3.0)
  const isoPenalty = peakVib >= 2.80 ? (peakVib - 2.80) * 5.0 + 4.0 : 0;
  const tempPenalty = peakTemp >= 45.0 ? (peakTemp - 45.0) * 1.5 + 3.0 : 0;
  const score = (peakVib / 2.80) * 2.0 + (peakTemp / 45.0) + isoPenalty + tempPenalty;

  return { peakVib, peakTemp, avgVib, avgTemp, score, dominantStatus, dominantNote };
}

// HELPER: Mengurutkan semua mesin berdasarkan skor urgensi pada rentang jam aktif
function getRankedMachinesForActiveRange() {
  const list = state.machines.map((m) => {
    const metrics = getMachineUrgencyInActiveRange(m.id);
    return { ...m, ...metrics };
  });

  list.sort((a, b) => b.score - a.score);

  return list.map((m, idx) => ({
    ...m,
    rank: idx + 1
  }));
}

function renderReportMachineCardsHtml() {
  const filtered = getFilteredReportMachines();
  if (filtered.length === 0) {
    return `
      <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 0.78rem; background: #0c121e; border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px;">
        Tidak ada unit mesin yang cocok dengan kriteria filter saat ini.
      </div>
    `;
  }

  return filtered.map((m) => {
    const isSelected = state.reportSelectedMachineIds.includes(m.id);

    return `
      <div class="report-machine-card ${isSelected ? "selected" : ""}" onclick="toggleReportMachineSelection('${m.id}')" title="Klik untuk ${isSelected ? 'membatalkan pilihan' : 'memilih'} unit mesin">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #131c2e; border: 1px solid ${isSelected ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.1)'}; display: flex; align-items: center; justify-content: center; color: ${isSelected ? '#38bdf8' : '#94a3b8'}; flex-shrink: 0; transition: all 0.15s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div>
            <div style="font-size: 0.88rem; font-weight: 700; color: #ffffff;">${escapeHtml(m.name)}</div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
              ID Perangkat: <span style="color: #38bdf8; font-weight: 600;">${m.deviceId}</span> · Lokasi: <span style="color: #cbd5e1;">${escapeHtml(m.location)}</span> · <span style="color: #64748b;">${m.axisType} ${m.machineType}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function openSelectedMachinesReportModal() {
  if (!state.reportSelectedMachineIds || state.reportSelectedMachineIds.length === 0) {
    showToast("Silakan pilih minimal 1 unit mesin terlebih dahulu.");
    return;
  }

  const modal = document.getElementById("report-modal");
  const modalBody = document.getElementById("report-modal-body");
  if (!modal || !modalBody) return;

  const startInput = document.getElementById("report-time-start");
  const endInput = document.getElementById("report-time-end");
  if (startInput && startInput.value) state.reportTimeStart = startInput.value;
  if (endInput && endInput.value) state.reportTimeEnd = endInput.value;

  const displayDate = formatIndonesianDate(state.reportFilterDate || "2026-10-24");
  const timeRangeStr = `${state.reportTimeStart || "00:00"} - ${state.reportTimeEnd || "23:59"} WIB`;
  
  const filteredLogs = getFilteredReportLogs(state.reportTimeStart, state.reportTimeEnd);
  const resMode = filteredLogs.length > 0 ? (filteredLogs[0].resolutionMode || "per_jam") : "per_jam";
  const samplingModeLabel = resMode === "per_detik"
    ? "• Sampling Per Detik"
    : resMode === "per_menit"
    ? "• Sampling Per Menit"
    : "• Sampling Per Jam";
  
  const selectedMachines = state.machines.filter((m) => state.reportSelectedMachineIds.includes(m.id));
  const machineListFormatted = selectedMachines.map((m) => m.deviceId || m.name).join("; ");

  // 1. Baris Tabel Rekapitulasi Kondisi Spindle Mesin Terpilih (Dinamis Sesuai Rentang Waktu Aktif - OPSI B)
  const tableSummaryRowsHtml = selectedMachines.map((m) => {
    // Ambil data telemetri mesin ini dari seluruh baris dalam rentang waktu terpilih
    const mLogs = filteredLogs.map((l) => l.machines && l.machines[m.id]).filter(Boolean);

    let vibRmsVal = m.vibrationRms;
    let tempVal = m.temperature;
    let hiVal = m.healthIndex;
    let evalStatus = m.status;
    let evalRec = m.recommendation || "Pemeriksaan berkala standar";

    if (mLogs.length > 0) {
      // Puncak getaran dan suhu dalam rentang waktu yang dipilih
      vibRmsVal = Math.max(...mLogs.map((d) => d.vibRms));
      tempVal = Math.max(...mLogs.map((d) => d.temp));

      // Health Index terendah (kondisi terburuk dalam rentang waktu terpilih)
      const hiList = mLogs.map((d) => (d.hi !== undefined ? d.hi : Math.max(20, Math.min(99, Math.round(100 - (d.vibRms / 4.5) * 65)))));
      hiVal = Math.min(...hiList);

      // Evaluasi status AI berdasarkan keparahan anomali di rentang waktu terpilih
      const hasOuter = mLogs.some((d) => d.status === "OUTER_RACE_FAULT");
      const hasInner = mLogs.some((d) => d.status === "INNER_RACE_FAULT");

      if (hasOuter) {
        evalStatus = "OUTER_RACE_FAULT";
        evalRec = "Ganti bantalan depan (N2) & periksa keausan outer race sebelum proses finishing presisi.";
      } else if (hasInner) {
        evalStatus = "INNER_RACE_FAULT";
        evalRec = "Relubrikasi pelumas sintetis VG 68 pada bantalan belakang N1 & periksa frekuensi BPFI (218 Hz).";
      } else {
        evalStatus = "HEALTHY";
        if (vibRmsVal < 2.00) {
          evalRec = "Mesin beroperasi normal / standby stabil. Parameter getaran dan suhu dalam batas aman ISO 10816-3.";
        } else {
          evalRec = "Parameter spindle berada dalam batas toleransi normal ISO 10816-3 (< 2.80 mm/s). Tidak diperlukan tindakan korektif.";
        }
      }
    }

    const isIsoExceeded = vibRmsVal >= 2.80;
    const isTempExceeded = tempVal >= 45.0;

    const isoAlert = isIsoExceeded
      ? `<span style="color: #f87171; font-weight: 700; margin-left: 4px;">⚠</span>`
      : "";
    const tempAlert = isTempExceeded
      ? `<span style="color: #f87171; font-weight: 700; margin-left: 4px;">⚠</span>`
      : "";

    const statusText = evalStatus === "OUTER_RACE_FAULT"
      ? `<span style="font-weight: 700; color: #f87171; white-space: nowrap;">Outer Race Fault</span>`
      : evalStatus === "INNER_RACE_FAULT"
      ? `<span style="font-weight: 700; color: #fbbf24; white-space: nowrap;">Inner Race Fault</span>`
      : `<span style="font-weight: 600; color: #34d399; white-space: nowrap;">Healthy</span>`;

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: #ffffff;">${escapeHtml(m.name)}</div>
          <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 1px;">ID: ${m.deviceId}</div>
        </td>
        <td style="font-size: 0.72rem; color: #cbd5e1;">${escapeHtml(m.location)}</td>
        <td style="font-weight: 700; color: ${isIsoExceeded ? '#f87171' : '#34d399'}; white-space: nowrap;">
          ${vibRmsVal.toFixed(2)} mm/s ${isoAlert}
        </td>
        <td style="font-weight: 600; color: ${isTempExceeded ? '#f87171' : '#ffffff'}; white-space: nowrap;">
          ${tempVal.toFixed(1)} °C ${tempAlert}
        </td>
        <td style="font-weight: 700; color: #38bdf8; white-space: nowrap;">
          ${hiVal}%
        </td>
        <td class="col-diagnosa-ai" style="white-space: nowrap; width: 140px; text-align: left;">
          ${statusText}
        </td>
        <td style="font-size: 0.72rem; color: #cbd5e1; line-height: 1.35;">
          ${escapeHtml(evalRec)}
        </td>
      </tr>
    `;
  }).join("");

  const isDateWithData = (state.reportFilterDate === "2026-10-24");

  if (!isDateWithData) {
    modalBody.innerHTML = `
      <div style="flex-shrink: 0;">
        <!-- KOP RESMI LAPORAN INDUSTRI -->
        <div style="border-bottom: 2px solid rgba(56, 189, 248, 0.4); padding-bottom: 12px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="./images/logo-zentra.png" alt="ZENTRA" style="height: 24px; width: auto;" />
            <span style="font-size: 0.75rem; color: #38bdf8; font-weight: 700; letter-spacing: 0.05em;">SMART CONDITION MONITORING</span>
          </div>
          <h2 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-top: 4px;">FORM REKAPITULASI PEMANTAUAN KONDISI SPINDLE CNC</h2>
          <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">Mitra Industri: PT Yogya Presisi Tehnikatama Industri (YPTI) • Kembara UNYVerse 2026</div>
          <div style="font-size: 0.72rem; color: #cbd5e1; margin-top: 4px; font-weight: 500;">
            ${displayDate}, ${timeRangeStr}, ${machineListFormatted}
          </div>
        </div>
      </div>

      <!-- EMPTY STATE KARENA DATA BELUM TERSEDIA -->
      <div style="background: rgba(15, 23, 42, 0.75); border: 1px dashed rgba(56, 189, 248, 0.35); border-radius: 12px; padding: 48px 24px; text-align: center; margin: 32px 0;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #38bdf8;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="2"/></svg>
        </div>
        <div style="font-size: 1.05rem; font-weight: 700; color: #ffffff; margin-bottom: 6px;">
          Data Telemetri Belum Tersedia
        </div>
        <div style="font-size: 0.8rem; color: #94a3b8; max-width: 520px; margin: 0 auto 16px; line-height: 1.5;">
          Belum ada rekaman transmisi sensor IoT atau inferensi AI untuk tanggal <span style="color: #38bdf8; font-weight: 600;">${displayDate}</span>. Waktu operasional mesin pada tanggal tersebut belum berjalan atau belum tercatat di server ZENTRA.
        </div>
        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 6px; font-size: 0.74rem; color: #cbd5e1;">
          <span style="color: #38bdf8; font-weight: 700;">Petunjuk:</span> Silakan pilih tanggal pemantauan operasional aktif: <span style="color: #ffffff; font-weight: 700;">24 Oktober 2026</span>.
        </div>
      </div>

      <!-- FOOTER INFORMASI & KONTROL AKSI MODAL -->
      <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; margin-top: 14px; flex-wrap: wrap; gap: 10px;">
        <div style="font-size: 0.68rem; color: #64748b;">
          Standar Evaluasi ISO 10816-3 (Batas Toleransi: 2.80 mm/s) • Ambang Batas Suhu Spindle: 45.0 °C
        </div>
        <div style="display: flex; gap: 10px;">
          <button type="button" class="btn-resolve" onclick="closeModal()">Tutup</button>
          <button type="button" class="btn-primary" style="opacity: 0.4; cursor: not-allowed; display: inline-flex; align-items: center; gap: 6px;" onclick="showToast('Dokumen tidak dapat dicetak karena data telemetri belum tersedia.')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Cetak / Simpan PDF
          </button>
        </div>
      </div>
    `;
    modal.classList.add("active");
    return;
  }

  // 2. Baris Tabel Rincian Log Telemetri Per Unit Mesin (DIPISAH PER MESIN SESUAI PERMINTAAN USER)
  const machineTelemetrySectionsHtml = selectedMachines.map((m) => {
    const rowsHtml = filteredLogs.map((l) => {
      const machData = (l.machines && l.machines[m.id]) || { rpm: 0, vibRms: 0, temp: 0, status: "HEALTHY", note: "" };
      const isIso = machData.vibRms >= 2.80;
      const isOverheat = machData.temp >= 45.0;
      const isAlert = isIso || isOverheat;

      const statusText = machData.status === "OUTER_RACE_FAULT"
        ? `<span style="font-weight: 700; color: #f87171; font-size: 0.72rem; white-space: nowrap;">Outer Race Fault</span>`
        : machData.status === "INNER_RACE_FAULT"
        ? `<span style="font-weight: 700; color: #fbbf24; font-size: 0.72rem; white-space: nowrap;">Inner Race Fault</span>`
        : `<span style="font-weight: 600; color: #34d399; font-size: 0.72rem; white-space: nowrap;">Healthy</span>`;

      const rowBg = isAlert ? "background: rgba(239, 68, 68, 0.05);" : "";

      return `
        <tr style="${rowBg}">
          <td style="font-weight: 700; color: #38bdf8; white-space: nowrap;">${l.timeStr}</td>
          <td>
            <span style="font-weight: 700; color: #ffffff;">${escapeHtml(m.name)}</span>
            <span style="font-size: 0.65rem; color: #38bdf8; margin-left: 4px;">(${m.deviceId})</span>
          </td>
          <td style="font-weight: 700; color: ${isIso ? '#f87171' : '#34d399'}; white-space: nowrap;">
            ${machData.vibRms.toFixed(2)} mm/s ${isIso ? '⚠' : ''}
          </td>
          <td style="font-weight: 600; color: ${isOverheat ? '#f87171' : '#ffffff'}; white-space: nowrap;">
            ${machData.temp.toFixed(1)} °C ${isOverheat ? '⚠' : ''}
          </td>
          <td style="white-space: nowrap;">
            ${statusText}
          </td>
          <td style="font-size: 0.7rem; color: ${isAlert ? '#fca5a5' : '#cbd5e1'};">
            ${escapeHtml(machData.note || l.topPriorityReason || "Kondisi operasi normal")}
          </td>
        </tr>
      `;
    }).join("");

    return `
      <div class="report-machine-telemetry-block" style="margin-bottom: 16px;">
        <div class="report-table-scroll-container">
          <table class="report-table-mini report-table-telemetry" style="margin: 0;">
            <thead>
              <tr>
                <th style="white-space: nowrap; width: 100px;">Waktu (WIB)</th>
                <th style="white-space: nowrap; width: 160px;">Mesin</th>
                <th style="white-space: nowrap; width: 115px;">Getaran RMS</th>
                <th style="white-space: nowrap; width: 110px;">Suhu Spindle</th>
                <th style="white-space: nowrap; width: 130px;">Status Diagnosa</th>
                <th>Catatan Evaluasi Kondisi & Rekomendasi Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join("");

  modalBody.innerHTML = `
    <!-- BAGIAN ATAS: KOP RESMI & TABEL REKAPITULASI (TETAP STAY / TIDAK BERGULIR) -->
    <div style="flex-shrink: 0;">
      <!-- KOP RESMI LAPORAN INDUSTRI -->
      <div style="border-bottom: 2px solid rgba(56, 189, 248, 0.4); padding-bottom: 12px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="./images/logo-zentra.png" alt="ZENTRA" style="height: 24px; width: auto;" />
          <span style="font-size: 0.75rem; color: #38bdf8; font-weight: 700; letter-spacing: 0.05em;">SMART CONDITION MONITORING</span>
        </div>
        <h2 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-top: 4px;">FORM REKAPITULASI PEMANTAUAN KONDISI SPINDLE CNC</h2>
        <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">Mitra Industri: PT Yogya Presisi Tehnikatama Industri (YPTI) • Kembara UNYVerse 2026</div>
        <div style="font-size: 0.72rem; color: #cbd5e1; margin-top: 4px; font-weight: 500;">
          ${displayDate}, ${timeRangeStr}, ${machineListFormatted}
        </div>
      </div>

      <!-- TABEL REKAPITULASI KONDISI SPINDLE BEARING CNC (STAY DI ATAS) -->
      <div style="margin-bottom: 14px;">
        <div style="font-size: 0.72rem; color: #ffffff; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">
          Rekapitulasi Kondisi Unit Mesin Terpilih
        </div>
        <div style="overflow-x: auto;">
          <table class="report-table-mini report-table-summary" style="margin: 0;">
            <thead>
              <tr>
                <th style="white-space: nowrap; width: 160px;">Mesin</th>
                <th style="white-space: nowrap; width: 140px;">Lokasi</th>
                <th style="white-space: nowrap; width: 125px;">Getaran RMS</th>
                <th style="white-space: nowrap; width: 115px;">Suhu Spindle</th>
                <th style="white-space: nowrap; width: 95px;">Health Index</th>
                <th class="col-diagnosa-ai-header" style="white-space: nowrap; width: 140px; text-align: center;">Diagnosa AI</th>
                <th>Tindakan atau Rekomendasi</th>
              </tr>
            </thead>
            <tbody id="report-modal-table-body">
              ${tableSummaryRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- BAGIAN LIST: TABEL LOG TELEMETRI DETAIL PER UNIT MESIN (DIPISAH PER MESIN SESUAI PERMINTAAN USER) -->
    <div style="margin-bottom: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <div style="font-size: 0.72rem; color: #ffffff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
          Log Rincian Telemetri
        </div>
      </div>
      ${machineTelemetrySectionsHtml}
    </div>

    <!-- FOOTER INFORMASI & KONTROL AKSI MODAL -->
    <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; margin-top: 14px; flex-wrap: wrap; gap: 10px;">
      <div style="font-size: 0.68rem; color: #64748b;">
        Standar Evaluasi ISO 10816-3 (Batas Toleransi: 2.80 mm/s) • Ambang Batas Suhu Spindle: 45.0 °C
      </div>
      <div style="display: flex; gap: 10px;">
        <button type="button" class="btn-resolve" onclick="closeModal()">Tutup</button>
        <button type="button" class="btn-primary" style="display: inline-flex; align-items: center; gap: 6px;" onclick="printReportDocument()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Cetak / Simpan PDF
        </button>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

function printReportDocument() {
  const modalContent = document.getElementById("report-modal-body");
  if (modalContent) modalContent.scrollTop = 0;
  document.querySelectorAll(".report-table-scroll-container").forEach((el) => {
    el.scrollTop = 0;
  });
  window.print();
}

function renderShiftReportsHtml() {
  return `
    <div class="reports-studio-wrapper">
      <!-- HEADER HALAMAN -->
      <div class="top-header no-print" style="margin-bottom: 4px;">
        <div>
          <h2 class="page-title">Shift Reports</h2>
          <p style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
            Generator Rekapitulasi Pemantauan Spindle CNC • PT Yogya Presisi Tehnikatama Industri (YPTI)
          </p>
        </div>
      </div>

      <!-- 1. BARIS ATAS: PRIMARY CONTROL BAR (SEARCH, TANGGAL, RENTANG JAM, TOMBOL LIHAT LAPORAN) -->
      <div class="reports-primary-bar no-print">
        <!-- PENCARIAN MESIN -->
        <div class="report-control-group" style="flex: 1.5; min-width: 220px;">
          <label class="report-control-label" for="report-search-input">Pencarian Unit Mesin</label>
          <div class="report-input-icon-wrapper">
            <svg class="report-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              id="report-search-input"
              class="report-control-input"
              placeholder="Cari nama, ID (MCH), atau lokasi..."
              value="${escapeHtml(state.reportSearchQuery || "")}"
              oninput="handleReportSearchChange(this.value)"
            />
            ${state.reportSearchQuery ? `<button type="button" class="report-input-clear" onclick="clearReportSearch()">✕</button>` : ""}
          </div>
        </div>

        <!-- PILIH TANGGAL (KALENDER / KETIK FORMAT) -->
        <div class="report-control-group" style="flex: 1; min-width: 175px;">
          <label class="report-control-label" for="report-filter-date">Tanggal Monitoring</label>
          <div class="report-input-icon-wrapper">
            <svg class="report-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <input
              type="date"
              id="report-filter-date"
              class="report-control-input date-input"
              value="${state.reportFilterDate || "2026-10-24"}"
              onchange="handleReportDateChange(this.value)"
            />
          </div>
        </div>

        <!-- RENTANG WAKTU (MENDUKUNG JAM, MENIT, & DETIK) -->
        <div class="report-control-group" style="flex: 1.3; min-width: 300px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <label class="report-control-label" style="margin-bottom: 0;">Rentang Waktu</label>
            <div class="info-tooltip-wrapper">
              <span class="info-tooltip-icon">i</span>
              <div class="info-tooltip-content">
                <div>• Per Jam : Rentang > 1.5 Jam (cth: 08:00 – 16:00)</div>
                <div>• Per Menit : Rentang 1 – 45 Menit (cth: 00:00 – 00:30)</div>
                <div>• Per Detik : Rentang 1 – 90 Detik (cth: 00:00:00 – 00:00:30)</div>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input
              type="time"
              step="1"
              id="report-time-start"
              class="report-control-input time-input"
              value="${state.reportTimeStart || "00:00"}"
              onchange="handleReportTimeChange('start', this.value)"
              oninput="handleReportTimeChange('start', this.value)"
              title="Waktu Mulai (HH:MM atau HH:MM:SS)"
            />
            <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">s/d</span>
            <input
              type="time"
              step="1"
              id="report-time-end"
              class="report-control-input time-input"
              value="${state.reportTimeEnd || "23:59"}"
              onchange="handleReportTimeChange('end', this.value)"
              oninput="handleReportTimeChange('end', this.value)"
              title="Waktu Selesai (HH:MM atau HH:MM:SS)"
            />
          </div>
        </div>

        <!-- TOMBOL AKSI LIHAT LAPORAN (MENGGANTIKAN CETAK / SIMPAN PDF) -->
        <div style="display: flex; align-items: flex-end; gap: 8px;">
          <button type="button" class="btn-primary" style="display: inline-flex; align-items: center; gap: 7px; padding: 9px 20px; font-size: 0.82rem; border-radius: 9px;" onclick="openSelectedMachinesReportModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Lihat Laporan
          </button>
        </div>
      </div>

      <!-- 2. SUB-BAR: AKSI PILIH SEMUA & BATALKAN SEMUA -->
      <div class="no-print" id="report-actions-bar" style="margin-bottom: 14px;">
        ${renderReportActionButtonsHtml()}
      </div>

      <!-- 3. SELEKSI KARTU MESIN INTERAKTIF MEMANJANG (TIMBUL & BERUBAH WARNA SAAT DIKLIK) -->
      <div class="no-print">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 0.7rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
            Pilih Unit Mesin (Klik kartu untuk memilih):
          </span>
          <span style="font-size: 0.68rem; color: #64748b;" id="report-selected-count-label">
            ${state.reportSelectedMachineIds.length} dari ${state.machines.length} mesin terpilih
          </span>
        </div>
        <div class="report-machines-grid" id="report-machine-cards-grid">
          ${renderReportMachineCardsHtml()}
        </div>
      </div>

      <!-- MODAL PRATINJAU DOKUMEN LAPORAN LENGKAP PDF -->
      <div id="report-modal" class="modal-overlay">
        <div class="modal-content" id="report-modal-body" style="max-width: 1080px; width: 95%;">
          <!-- Konten dokumen laporan disuntikkan secara dinamis via openSelectedMachinesReportModal() -->
        </div>
      </div>
    </div>
  `;
}

function handleReportSearchChange(val) {
  state.reportSearchQuery = val;
  updateReportCards();
}

function clearReportSearch() {
  state.reportSearchQuery = "";
  const input = document.getElementById("report-search-input");
  if (input) {
    input.value = "";
    input.focus();
  }
  updateReportCards();
}

function handleReportDateChange(val) {
  state.reportFilterDate = val;
  if (val && val !== "2026-10-24") {
    showToast(`Data telemetri tanggal ${formatIndonesianDate(val)} belum tersedia. Data operasional aktif ada pada 24 Oktober 2026.`);
  }
}

function handleReportTimeChange(type, val) {
  if (type === "start") state.reportTimeStart = val;
  if (type === "end") state.reportTimeEnd = val;
  updateReportCards();
}

function toggleReportMachineSelection(machineId) {
  const index = state.reportSelectedMachineIds.indexOf(machineId);
  if (index > -1) {
    state.reportSelectedMachineIds.splice(index, 1);
  } else {
    if (state.reportSelectedMachineIds.length >= 4) {
      showToast("Maksimal 4 unit mesin dapat dipilih sekaligus untuk menjamin performa cetak optimal.");
      return;
    }
    state.reportSelectedMachineIds.push(machineId);
  }
  updateReportCards();
}

function selectAllReportMachines(select) {
  if (select) {
    const filtered = getFilteredReportMachines();
    const newSelected = [];
    filtered.forEach((m) => {
      if (newSelected.length < 4 && !newSelected.includes(m.id)) {
        newSelected.push(m.id);
      }
    });
    state.reportSelectedMachineIds = newSelected;
  } else {
    state.reportSelectedMachineIds = [];
  }
  updateReportCards();
}

function updateReportCards() {
  const cardsGrid = document.getElementById("report-machine-cards-grid");
  if (cardsGrid) {
    cardsGrid.innerHTML = renderReportMachineCardsHtml();
  }
  const actionsBar = document.getElementById("report-actions-bar");
  if (actionsBar) {
    actionsBar.innerHTML = renderReportActionButtonsHtml();
  }
  const countLabel = document.getElementById("report-selected-count-label");
  if (countLabel) {
    countLabel.textContent = `${state.reportSelectedMachineIds.length} dari ${state.machines.length} mesin terpilih`;
  }
}

function attachReportsEvents() {}

function openTimeRangeModal(reportTitle, reportDate) {
  state.pendingReportTitle = reportTitle;
  state.pendingReportDate = reportDate;
  
  const modal = document.getElementById("time-range-modal");
  const sub = document.getElementById("time-modal-subtitle");
  if (sub) {
    sub.textContent = `Dokumen: ${reportTitle}`;
  }
  const startInput = document.getElementById("report-time-start");
  const endInput = document.getElementById("report-time-end");
  if (startInput) startInput.value = "00:00";
  if (endInput) endInput.value = "23:59";

  // Reset preset button styling
  document.querySelectorAll(".btn-time-preset").forEach((b, idx) => {
    if (idx === 0) {
      b.style.borderColor = "rgba(56,189,248,0.5)";
      b.style.color = "#38bdf8";
      b.style.background = "#172236";
    } else {
      b.style.borderColor = "rgba(255,255,255,0.1)";
      b.style.color = "#94a3b8";
      b.style.background = "#111726";
    }
  });

  if (modal) modal.classList.add("active");
}

function closeTimeModal() {
  const modal = document.getElementById("time-range-modal");
  if (modal) modal.classList.remove("active");
}

function setTimePreset(start, end, btnElem) {
  const startInput = document.getElementById("report-time-start");
  const endInput = document.getElementById("report-time-end");
  if (startInput) startInput.value = start;
  if (endInput) endInput.value = end;

  document.querySelectorAll(".btn-time-preset").forEach(b => {
    b.style.borderColor = "rgba(255,255,255,0.1)";
    b.style.color = "#94a3b8";
    b.style.background = "#111726";
  });
  if (btnElem) {
    btnElem.style.borderColor = "rgba(56,189,248,0.5)";
    btnElem.style.color = "#38bdf8";
    btnElem.style.background = "#172236";
  }
}

function confirmViewReportWithTime() {
  const startInput = document.getElementById("report-time-start");
  const endInput = document.getElementById("report-time-end");
  const startTime = startInput ? startInput.value : "00:00";
  const endTime = endInput ? endInput.value : "23:59";
  
  const timeRangeStr = `${startTime} - ${endTime} WIB`;
  state.selectedTimeRange = timeRangeStr;
  
  closeTimeModal();
  
  // Buka preview modal laporan dengan rentang waktu yang dipilih
  previewReport(state.pendingReportTitle, state.pendingReportDate, timeRangeStr);
}

function confirmDownloadPdfWithTime() {
  const startInput = document.getElementById("report-time-start");
  const endInput = document.getElementById("report-time-end");
  const startTime = startInput ? startInput.value : "00:00";
  const endTime = endInput ? endInput.value : "23:59";
  
  const timeRangeStr = `${startTime} - ${endTime} WIB`;
  state.selectedTimeRange = timeRangeStr;
  
  closeTimeModal();
  
  // Render report preview with custom time range & date
  previewReport(state.pendingReportTitle, state.pendingReportDate, timeRangeStr);
  
  // Trigger print
  setTimeout(() => {
    window.print();
  }, 250);
}

function generatePerSecondRows(machine, timeRangeStr) {
  // Ambil jam mulai dari timeRangeStr misal "08:00 - 16:00 WIB" -> jam 08:00
  let startH = 8;
  let startM = 0;
  if (timeRangeStr) {
    const match = timeRangeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      startH = parseInt(match[1], 10);
      startM = parseInt(match[2], 10);
    }
  }

  const rows = [];
  const numRows = 12; // 12 detik data runut waktu representatif yang muat dalam 1 lembar A4 landscape

  for (let s = 0; s < numRows; s++) {
    const curH = String(startH).padStart(2, "0");
    const curM = String(startM).padStart(2, "0");
    const curS = String(s).padStart(2, "0");
    const timeFormatted = `${curH}:${curM}:${curS}`;

    let vibVal, tempVal, hiVal;
    if (machine.id === "CNC-001") {
      // Outer Race Fault: ~4.40 - 4.49 mm/s, ~47.0 - 47.4 °C
      const offset = Math.sin(s * 0.7) * 0.07 + ((s % 3) * 0.02 - 0.03);
      vibVal = (4.45 + offset).toFixed(2);
      tempVal = (47.0 + Math.cos(s * 0.5) * 0.25).toFixed(1);
      hiVal = Math.round(34 - (parseFloat(vibVal) - 4.45) * 15);
    } else if (machine.id === "CNC-002") {
      // Inner Race Fault: ~2.68 - 2.74 mm/s, ~40.2 - 40.5 °C
      const offset = Math.sin(s * 0.6) * 0.04 + ((s % 2) * 0.03 - 0.01);
      vibVal = (2.71 + offset).toFixed(2);
      tempVal = (40.4 + Math.sin(s * 0.4) * 0.2).toFixed(1);
      hiVal = Math.round(65 - (parseFloat(vibVal) - 2.71) * 20);
    } else if (machine.id === "CNC-003") {
      // DMU 50 EVO_2: ~0.84 - 0.86 mm/s, ~36.1 - 36.3 °C
      const offset = ((s % 4) - 1.5) * 0.01;
      vibVal = (0.85 + offset).toFixed(2);
      tempVal = (36.2 + (s % 2) * 0.1).toFixed(1);
      hiVal = 94;
    } else {
      // Joglo VF-500i: ~0.62 - 0.64 mm/s, ~34.7 - 34.9 °C
      const offset = ((s % 3) - 1) * 0.01;
      vibVal = (0.63 + offset).toFixed(2);
      tempVal = (34.8 + (s % 2) * 0.1).toFixed(1);
      hiVal = 98;
    }

    const isIsoExceeded = parseFloat(vibVal) >= 2.8;
    const isTempWarn = parseFloat(tempVal) >= 45.0;

    const vibBadge = isIsoExceeded
      ? `<span style="color: #ef4444; font-weight: 700;">${vibVal} mm/s ⚠</span>`
      : `<span style="color: #22c55e; font-weight: 600;">${vibVal} mm/s ✓</span>`;

    const tempBadge = isTempWarn
      ? `<span style="color: #ef4444; font-weight: 700;">${tempVal} °C ⚠</span>`
      : `<span style="color: #22c55e; font-weight: 600;">${tempVal} °C ✓</span>`;

    const statusBadge = machine.status === "OUTER_RACE_FAULT"
      ? `<span class="badge badge-urgent" style="font-size: 0.68rem; padding: 2px 8px; white-space: nowrap; display: inline-block;">Outer Race Fault</span>`
      : machine.status === "INNER_RACE_FAULT"
      ? `<span class="badge badge-medium" style="font-size: 0.68rem; padding: 2px 8px; white-space: nowrap; display: inline-block;">Inner Race Fault</span>`
      : `<span class="badge badge-normal" style="font-size: 0.68rem; padding: 2px 8px; white-space: nowrap; display: inline-block;">Healthy</span>`;

    rows.push(`
      <tr>
        <td style="font-weight: 600; color: #38bdf8; font-family: var(--font-mono); font-size: 0.75rem; white-space: nowrap;">${timeFormatted}</td>
        <td style="font-size: 0.75rem; white-space: nowrap;">${vibBadge}</td>
        <td style="font-size: 0.75rem; white-space: nowrap;">${tempBadge}</td>
        <td style="font-size: 0.75rem; font-weight: 700; color: #38bdf8; white-space: nowrap;">${hiVal}%</td>
        <td class="col-diagnosa-ai" style="white-space: nowrap; width: 150px; text-align: left;">${statusBadge}</td>
        <td style="font-size: 0.74rem; color: #cbd5e1; line-height: 1.35;">${machine.recommendation || "Pemeriksaan berkala standar"}</td>
      </tr>
    `);
  }

  return rows.join("");
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function switchReportMachine(machineId) {
  state.reportActiveMachineId = machineId;
  const machine = state.machines.find((m) => m.id === machineId) || state.machines[0];

  // Update tabs active state jika tab masih ada
  document.querySelectorAll(".btn-machine-tab").forEach((btn) => {
    if (btn.getAttribute("data-machine-id") === machineId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update nilai input search bar
  const searchInput = document.getElementById("report-machine-search-input");
  if (searchInput) {
    searchInput.value = machine.name;
  }

  // Update machine information card
  const nameEl = document.getElementById("report-active-machine-name");
  const idEl = document.getElementById("report-active-machine-id");
  const typeEl = document.getElementById("report-active-machine-type");
  const locEl = document.getElementById("report-active-machine-loc");
  const tbodyEl = document.getElementById("report-detail-table-body");

  if (nameEl) nameEl.textContent = machine.name;
  if (idEl) idEl.textContent = machine.deviceId;
  if (typeEl) typeEl.textContent = `${machine.axisType} ${machine.machineType} (${machine.spindleSpeedRpm} RPM)`;
  if (locEl) locEl.textContent = machine.location;

  if (tbodyEl) {
    tbodyEl.innerHTML = generatePerSecondRows(machine, state.selectedTimeRange);
  }
}

function onMachineSearchInput(query) {
  const dropdown = document.getElementById("machine-rec-dropdown");
  if (!dropdown) return;

  const q = (query || "").trim().toLowerCase();

  // Filter mesin berdasarkan nama, ID/deviceId, lokasi, atau tipe/axis
  const filtered = state.machines.filter((m) => {
    if (!q) return true; // Tampilkan semua rekomendasi saat diklik/fokus
    const nameMatch = (m.name || "").toLowerCase().includes(q);
    const idMatch = (m.id || "").toLowerCase().includes(q) || (m.deviceId || "").toLowerCase().includes(q);
    const locMatch = (m.location || "").toLowerCase().includes(q);
    const typeMatch = (m.machineType || "").toLowerCase().includes(q) || (m.axisType || "").toLowerCase().includes(q);
    return nameMatch || idMatch || locMatch || typeMatch;
  });

  if (filtered.length === 0) {
    dropdown.innerHTML = `
      <div style="padding: 14px 16px; font-size: 0.75rem; color: #94a3b8; text-align: center;">
        Tidak ada unit mesin yang cocok dengan "<strong>${escapeHtml(query)}</strong>"
      </div>
    `;
    dropdown.classList.add("active");
    return;
  }

  dropdown.innerHTML = filtered.map((m) => {
    const isSelected = m.id === state.reportActiveMachineId;
    const statusBadge = m.status === "OUTER_RACE_FAULT"
      ? `<span class="badge badge-urgent" style="font-size: 0.65rem; padding: 2px 7px; white-space: nowrap;">Outer Race Fault</span>`
      : m.status === "INNER_RACE_FAULT"
      ? `<span class="badge badge-medium" style="font-size: 0.65rem; padding: 2px 7px; white-space: nowrap;">Inner Race Fault</span>`
      : `<span class="badge badge-normal" style="font-size: 0.65rem; padding: 2px 7px; white-space: nowrap;">Healthy</span>`;

    return `
      <div class="machine-rec-item ${isSelected ? "selected" : ""}" onclick="selectReportMachine('${m.id}')">
        <div>
          <div style="font-size: 0.8rem; font-weight: 700; color: ${isSelected ? '#38bdf8' : '#ffffff'};">
            ${escapeHtml(m.name)}
          </div>
          <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 2px;">
            <span style="color: #38bdf8; font-weight: 600;">${escapeHtml(m.deviceId)}</span> · ${escapeHtml(m.location)}
          </div>
        </div>
        <div style="text-align: right; margin-left: 12px;">
          ${statusBadge}
        </div>
      </div>
    `;
  }).join("");

  dropdown.classList.add("active");
}

function selectReportMachine(machineId) {
  const dropdown = document.getElementById("machine-rec-dropdown");
  if (dropdown) dropdown.classList.remove("active");

  switchReportMachine(machineId);
}

function clearMachineSearch() {
  const input = document.getElementById("report-machine-search-input");
  if (input) {
    input.value = "";
    input.focus();
    onMachineSearchInput("");
  }
}

// Tutup dropdown rekomendasi saat klik di luar area pencarian
document.addEventListener("click", (e) => {
  const searchWrapper = e.target.closest(".machine-search-wrapper");
  if (!searchWrapper) {
    const dropdown = document.getElementById("machine-rec-dropdown");
    if (dropdown) dropdown.classList.remove("active");
  }
});

function previewReport(title, dateParam, timeRangeParam) {
  state.previewReportTitle = title;
  const modal = document.getElementById("report-modal");
  const modalBody = document.getElementById("report-modal-body");
  if (!modal || !modalBody) return;

  const displayDate = dateParam || new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const displayTimeRange = timeRangeParam || state.selectedTimeRange || "00:00 - 23:59 WIB (24 Jam Penuh)";
  state.selectedTimeRange = displayTimeRange;

  if (!state.reportActiveMachineId) {
    state.reportActiveMachineId = "CNC-001";
  }

  const activeMachine = state.machines.find((m) => m.id === state.reportActiveMachineId) || state.machines[0];

  modalBody.innerHTML = `
    <!-- HEADER RESMI LAPORAN PDF -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid rgba(56, 189, 248, 0.4); padding-bottom: 14px; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="./images/logo-zentra.png" alt="ZENTRA" style="height: 26px; width: auto;" />
          <span style="font-size: 0.75rem; color: #38bdf8; font-weight: 700; letter-spacing: 0.05em;">SMART CONDITION MONITORING</span>
        </div>
        <h2 style="font-size: 1.15rem; font-weight: 700; color: #ffffff; margin-top: 6px;">FORM REKAPITULASI PEMANTAUAN HARIAN SPINDLE CNC</h2>
        <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">Mitra Industri: PT Yogya Presisi Tehnikatama Industri (YPTI) • Kembara UNYVerse 2026</div>
      </div>
      <div style="text-align: right; font-size: 0.72rem; color: #94a3b8; line-height: 1.6;">
        <div><strong>Dokumen:</strong> ZENTRA/REP/2026/PDF</div>
        <div><strong>Tanggal Monitoring:</strong> <span style="color: #ffffff; font-weight: 600;">${displayDate}</span></div>
        <div><strong>Rentang Waktu:</strong> <span style="color: #38bdf8; font-weight: 600;">${displayTimeRange}</span></div>
      </div>
    </div>

    <!-- PENCARIAN & SELEKSI UNIT MESIN (AUTOCOMPLETE / LIVE RECOMMENDATIONS) -->
    <div class="no-print" style="margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <label for="report-machine-search-input" style="font-size: 0.7rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          Cari & Pilih Unit Mesin CNC:
        </label>
        <span style="font-size: 0.68rem; color: #64748b;">Ketik 1 huruf untuk rekomendasi instan</span>
      </div>
      <div class="machine-search-wrapper">
        <svg class="machine-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          id="report-machine-search-input"
          class="machine-search-input"
          placeholder="Ketik nama atau ID mesin (misal: EVO, DMU, Joglo, MCH)..."
          value="${escapeHtml(activeMachine.name)}"
          autocomplete="off"
          onfocus="onMachineSearchInput(this.value)"
          oninput="onMachineSearchInput(this.value)"
        />
        <button type="button" class="machine-search-clear" onclick="clearMachineSearch()" title="Hapus pencarian">✕</button>
        <div id="machine-rec-dropdown" class="machine-recommendations-list"></div>
      </div>
    </div>

    <!-- KARTU INFORMASI & LOKASI MESIN -->
    <div class="report-machine-info-card">
      <div>
        <div style="font-size: 1rem; font-weight: 700; color: #ffffff;" id="report-active-machine-name">${activeMachine.name}</div>
        <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
          ID Perangkat: <span style="color: #38bdf8; font-weight: 600;" id="report-active-machine-id">${activeMachine.deviceId}</span> · Tipe: <span style="color: #ffffff;" id="report-active-machine-type">${activeMachine.axisType} ${activeMachine.machineType} (${activeMachine.spindleSpeedRpm} RPM)</span>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Lokasi Pemasangan Mesin:</div>
        <div style="font-size: 0.88rem; font-weight: 700; color: #38bdf8;" id="report-active-machine-loc">${activeMachine.location}</div>
      </div>
    </div>

    <!-- TABEL LOG TELEMETRI SPINDLE PER DETIK -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <h4 style="font-size: 0.8rem; font-weight: 700; color: #f1f5f9; margin: 0;">Log Telemetri Spindle Real-Time (Per Detik)</h4>
      <span style="font-size: 0.7rem; color: #94a3b8;">Interval Pencatatan: 1 Detik</span>
    </div>

    <div style="overflow-x: auto; margin-bottom: 18px;">
      <table class="report-table-mini">
        <thead>
          <tr>
            <th style="white-space: nowrap; width: 110px;">Waktu</th>
            <th style="white-space: nowrap; width: 130px;">Getaran RMS</th>
            <th style="white-space: nowrap; width: 120px;">Suhu Spindle</th>
            <th style="white-space: nowrap; width: 110px;">Health Index</th>
            <th class="col-diagnosa-ai-header" style="white-space: nowrap; width: 150px; text-align: center;">Diagnosa AI</th>
            <th>Tindakan atau Rekomendasi</th>
          </tr>
        </thead>
        <tbody id="report-detail-table-body">
          ${generatePerSecondRows(activeMachine, displayTimeRange)}
        </tbody>
      </table>
    </div>

    <!-- TOMBOL AKSI -->
    <div class="no-print" style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; margin-top: 16px; flex-wrap: wrap;">
      <button class="btn-resolve" onclick="closeModal()">Tutup</button>
      <button class="btn-primary" style="display: inline-flex; align-items: center; gap: 6px;" onclick="printReportDocument()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
        Cetak / Simpan PDF
      </button>
    </div>
  `;

  modal.classList.add("active");
}

function downloadPdf(title, date) {
  openTimeRangeModal(title, date);
}

function closeModal() {
  const modal = document.getElementById("report-modal");
  if (modal) modal.classList.remove("active");
}

function downloadCsv(reportTitle) {
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const criticalCount = state.machines.filter((m) => m.status === "OUTER_RACE_FAULT").length;
  const warnCount = state.machines.filter((m) => m.status === "INNER_RACE_FAULT").length;
  const normalCount = state.machines.filter((m) => m.status === "HEALTHY").length;

  const csvRows = [
    ["=== ZENTRA : SISTEM PEMANTAUAN KESEHATAN SPINDLE & BEARING CNC ==="],
    ["Mitra Industri", "PT Yogya Presisi Tehnikatama Industri (PT YPTI)"],
    ["Kompetisi", "Kembara UNYVerse 2026 - Smart Manufacturing"],
    ["Judul Dokumen", `LAPORAN RESMI SHIFT - ${reportTitle}`],
    ["Tanggal Laporan", dateStr],
    ["Standar Evaluasi", "ISO 10816-3 (Batas Kritis Getaran: 2.80 mm/s | Batas Suhu: 45.0 C)"],
    ["Ringkasan Kondisi", `${state.machines.length} Mesin (${criticalCount} Butuh Tindakan Segera, ${warnCount} Waspada, ${normalCount} Normal)`],
    [""],
    [
      "No",
      "Nama Mesin",
      "Device ID",
      "Lokasi Cell",
      "Vibrasi RMS (mm/s)",
      "Evaluasi Batas ISO 10816",
      "Suhu Spindle (C)",
      "Health Index (%)",
      "Status Diagnosa AI",
      "Rekomendasi Tindakan Pemeliharaan"
    ]
  ];

  state.machines.forEach((m, idx) => {
    const isIsoExceeded = m.vibrationRms >= 2.8;
    const isoStatus = isIsoExceeded ? "BAHAYA (Melebihi Batas ISO 2.80 mm/s)" : "NORMAL (Di Bawah Batas ISO)";
    const statusLabel = m.status === "OUTER_RACE_FAULT"
      ? "Outer Race Fault (Kritis)"
      : m.status === "INNER_RACE_FAULT"
      ? "Inner Race Fault (Waspada)"
      : "Healthy (Normal)";

    csvRows.push([
      idx + 1,
      `"${m.name}"`,
      m.deviceId,
      `"${m.location}"`,
      m.vibrationRms.toFixed(2),
      `"${isoStatus}"`,
      m.temperature.toFixed(1),
      `${m.healthIndex}%`,
      `"${statusLabel}"`,
      `"${m.recommendation || "Pemeriksaan rutin berkala"}"`
    ]);
  });

  csvRows.push([""]);
  csvRows.push(["Catatan Teknis", "Laporan ini dibuat otomatis berdasarkan data sensor IoT real-time dan inferensi AI ZENTRA."]);
  csvRows.push(["Supervisor Maintenance", "Ir. Haryanto (PT YPTI)"]);
  csvRows.push(["Operator Jaga", "Budi Santoso (Shift Leader)"]);

  // Tambahkan BOM \uFEFF agar Microsoft Excel otomatis mendeteksi encoding UTF-8 dengan benar
  const csvString = csvRows.map((r) => r.join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `ZENTRA_${reportTitle.replace(/[^a-zA-Z0-9]/g, "_")}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`File CSV "${reportTitle}" berhasil diunduh!`);
}

// ==============================================================================
// 6. MACHINE DETAIL PAGE (Matches Mockup 6)
// ==============================================================================
function renderMachineDetailHtml() {
  const machine =
    state.machines.find((m) => m.id === state.selectedMachineId) ||
    state.machines[0];

  const isN2Fault = machine.status === "OUTER_RACE_FAULT";
  const isN1Fault = machine.status === "INNER_RACE_FAULT";

  // Hotspot di Spindle Photo Locator
  let hotspotHtml = "";
  if (isN2Fault) {
    hotspotHtml = `<div class="pulsing-hotspot" style="right: 17%; top: 48%; transform: translateY(-50%);"></div>`;
  } else if (isN1Fault) {
    hotspotHtml = `<div class="pulsing-hotspot" style="left: 20%; top: 48%; transform: translateY(-50%);"></div>`;
  }

  // Baris Tabel Output Sensor Live
  const tableRows = machine.telemetryLogs
    .map(
      (log) => `
    <tr>
      <td style="color: #94a3b8;">${log.timestamp}</td>
      <td style="font-weight: 700; color: #f1f5f9;">${log.temp.toFixed(1)} °C</td>
      <td style="font-weight: 700; color: #38bdf8;">${log.vibN1.toFixed(2)} mm/s</td>
      <td style="font-weight: 700; color: #f59e0b;">${log.vibN2.toFixed(2)} mm/s</td>
    </tr>
  `
    )
    .join("");

  return `
    <!-- Top Back Arrow & Anomaly Banner -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <button class="btn-resolve" style="padding: 10px;" onclick="switchView('overview')">
          &larr; Back
        </button>
        <div>
          <h2 class="page-title" style="font-size: 1.4rem; margin-bottom: 2px;">${machine.name}</h2>
          <div class="card-location font-mono">${machine.location} · Device ID: ${machine.deviceId}</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 10px; padding: 10px 18px; border-radius: 12px; background: rgba(69, 10, 10, 0.8); border: 1px solid #ef4444; font-family: var(--font-mono); font-size: 0.75rem;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #ef4444; box-shadow: 0 0 10px #ef4444;"></span>
        <strong style="color: #fca5a5;">Anomaly Detection:</strong>
        <span style="color: #fecaca;">${machine.anomalyMessage || "Getaran dan suhu beroperasi dalam batas nominal."}</span>
      </div>
    </div>

    <!-- ROW 1: Output Sensor Table (Left) + 3D Spindle Photo Locator (Right) -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 20px; margin-bottom: 20px;">
      <!-- Table Left -->
      <div class="machine-card" style="cursor: default;">
        <div class="card-header-row" style="margin-bottom: 12px;">
          <div style="font-family: var(--font-mono); font-weight: 700; color: #ffffff; font-size: 0.95rem;">Output Sensor</div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #64748b;">Live Stream</div>
        </div>

        <div class="industrial-table-wrapper" style="box-shadow: none;">
          <table class="industrial-table" style="font-size: 0.8rem;">
            <thead>
              <tr>
                <th>Time Stamp</th>
                <th>Temp</th>
                <th>N1 (Rear)</th>
                <th>N2 (Front)</th>
              </tr>
            </thead>
            <tbody id="machine-detail-tbody">
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Spindle Locator Right -->
      <div class="machine-card" style="cursor: default;">
        <div class="card-header-row" style="margin-bottom: 12px;">
          <div style="font-family: var(--font-mono); font-weight: 700; color: #ffffff; font-size: 0.95rem;">3D Spindle Locator</div>
          <span class="badge badge-normal" style="font-size: 0.7rem;">${machine.id}</span>
        </div>

        <div class="spindle-view-container" style="flex: 1; min-height: 200px;">
          <img src="./images/spindle-horizontal.png" alt="3D Spindle" class="spindle-img-horizontal" />
          
          <!-- Pin N1 (Rear Bearing) -->
          <div class="locator-pin" style="left: 17%; top: 16%;">
            <div class="pin-label-n1">N1 - Rear Bearing</div>
            <div class="pin-line pin-line-n1"></div>
            <div class="pin-target-dot pin-dot-n1"></div>
          </div>

          <!-- Pin N2 (Front Bearing) -->
          <div class="locator-pin" style="right: 17%; top: 16%;">
            <div class="pin-label-n2">N2 - Front Bearing</div>
            <div class="pin-line pin-line-n2"></div>
            <div class="pin-target-dot pin-dot-n2"></div>
          </div>

          ${hotspotHtml}
        </div>
      </div>
    </div>

    <!-- ROW 2: 24-Hour Dual Monitoring Chart -->
    <div class="machine-card" style="cursor: default; margin-bottom: 20px;">
      <div class="card-header-row" style="margin-bottom: 16px;">
        <div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #ffffff; font-size: 1rem;">Temperature & Vibration Monitoring (24-Hour)</div>
          <div class="card-location font-mono">Batas Standar ISO 10816: 2.80 mm/s</div>
        </div>
        <div style="display: flex; gap: 16px; font-family: var(--font-mono); font-size: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #00e5ff;"></span>
            <span style="color: #cbd5e1;">Vibration RMS</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #fbbf24;"></span>
            <span style="color: #cbd5e1;">Spindle Temp</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 2px; background: #ef4444;"></span>
            <span style="color: #ef4444;">Batas ISO (2.80 mm/s)</span>
          </div>
        </div>
      </div>

      <div style="width: 100%; height: 260px; position: relative;">
        <canvas id="dual-monitoring-canvas" style="width: 100%; height: 100%;"></canvas>
      </div>
    </div>

    <!-- ROW 3: Machine Status Card + 3 Speedometer Radial Gauges -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
      <!-- Machine Operation Card -->
      <div class="radial-gauge-card" style="align-items: flex-start; justify-content: space-between; padding: 24px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; display: flex; align-items: center; justify-content: center; color: #10b981;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </div>
          <div>
            <div style="font-family: var(--font-mono); font-weight: 700; color: #ffffff; font-size: 0.9rem;">Status Mesin</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #10b981; font-weight: 700;">RUNNING</div>
          </div>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #94a3b8; margin-top: 12px;">
          Spindle Speed: <strong style="color: #ffffff;">${machine.spindleSpeedRpm} RPM</strong><br>
          Run Hours: <strong style="color: #ffffff;">${machine.runHours} Jam</strong>
        </div>
      </div>

      <!-- Temperature Radial Gauge -->
      <div class="radial-gauge-card">
        ${renderSpeedometerSvg("gauge-temp", machine.temperature, 0, 80, "°C", 42, 50)}
        <div class="gauge-val" style="color: ${machine.temperature > 45 ? "#ef4444" : "#00e5ff"}">${machine.temperature.toFixed(1)} °C</div>
        <div class="gauge-label">Temperature</div>
      </div>

      <!-- Vibration N1 Radial Gauge -->
      <div class="radial-gauge-card">
        ${renderSpeedometerSvg("gauge-vib1", machine.vibrationN1, 0, 6, "mm/s", 2.2, 2.8)}
        <div class="gauge-val" style="color: ${machine.vibrationN1 >= 2.8 ? "#ef4444" : machine.vibrationN1 >= 1.8 ? "#f59e0b" : "#10b981"}">${machine.vibrationN1.toFixed(2)} mm/s</div>
        <div class="gauge-label">Vibration N1 (Rear)</div>
      </div>

      <!-- Vibration N2 Radial Gauge -->
      <div class="radial-gauge-card">
        ${renderSpeedometerSvg("gauge-vib2", machine.vibrationN2, 0, 6, "mm/s", 2.2, 2.8)}
        <div class="gauge-val" style="color: ${machine.vibrationN2 >= 2.8 ? "#ef4444" : machine.vibrationN2 >= 1.8 ? "#f59e0b" : "#10b981"}">${machine.vibrationN2.toFixed(2)} mm/s</div>
        <div class="gauge-label">Vibration N2 (Front)</div>
      </div>
    </div>
  `;
}

function attachDetailEvents() {
  const machine =
    state.machines.find((m) => m.id === state.selectedMachineId) ||
    state.machines[0];
  drawDualCanvasChart("dual-monitoring-canvas", machine);
}

// HELPER: Semicircular Speedometer SVG
function renderSpeedometerSvg(id, val, min, max, unit, warnVal, dangVal) {
  const radius = 50;
  const cx = 70;
  const cy = 60;
  const pct = Math.min(1, Math.max(0, (val - min) / (max - min)));
  const angle = Math.PI + pct * Math.PI; // Dari 180 ke 360 derajat (pi ke 2pi)

  const needleX = cx + radius * Math.cos(angle);
  const needleY = cy + radius * Math.sin(angle);

  const activeColor = val >= dangVal ? "#ef4444" : val >= warnVal ? "#f59e0b" : "#00e5ff";

  return `
    <svg viewBox="0 0 140 75" class="gauge-svg">
      <!-- Background Arc -->
      <path d="M 20 60 A 50 50 0 0 1 120 60" fill="none" stroke="#1e293b" stroke-width="10" stroke-linecap="round" />
      <!-- Indicator Tick Marks -->
      <circle cx="20" cy="60" r="3" fill="#64748b" />
      <circle cx="70" cy="10" r="3" fill="#64748b" />
      <circle cx="120" cy="60" r="3" fill="#ef4444" />
      <!-- Needle Line -->
      <line x1="${cx}" y1="${cy}" x2="${needleX.toFixed(1)}" y2="${needleY.toFixed(1)}" stroke="${activeColor}" stroke-width="3" stroke-linecap="round" />
      <circle cx="${cx}" cy="${cy}" r="5" fill="#f1f5f9" />
    </svg>
  `;
}

// HELPER: 24-Hour Dual Canvas Chart
function drawDualCanvasChart(canvasId, machine) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;

  // Background Grid
  ctx.strokeStyle = "rgba(51, 65, 85, 0.3)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = 30 + (i / 4) * (h - 70);
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
  }

  // ISO 2.80 mm/s Limit Line (Dashed Red)
  const isoLimit = 2.8;
  const maxVib = 6.0;
  const isoY = 30 + (1 - isoLimit / maxVib) * (h - 70);
  ctx.save();
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(40, isoY);
  ctx.lineTo(w - 20, isoY);
  ctx.stroke();

  ctx.fillStyle = "#ef4444";
  ctx.font = "600 10px 'Poppins', sans-serif";
  ctx.fillText("BATAS ISO (2.80 mm/s)", w - 150, isoY - 6);
  ctx.restore();

  // Draw Vibration Line (Cyan)
  const vibData = machine.historyVibRms || [1.2, 1.5, 1.8, 2.2, 2.8, 3.2, 3.42];
  ctx.beginPath();
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 2.5;
  vibData.forEach((val, idx) => {
    const x = 50 + (idx / (vibData.length - 1)) * (w - 80);
    const y = 30 + (1 - val / maxVib) * (h - 70);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw Vibration Dots
  vibData.forEach((val, idx) => {
    const x = 50 + (idx / (vibData.length - 1)) * (w - 80);
    const y = 30 + (1 - val / maxVib) * (h - 70);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = val >= 2.8 ? "#ef4444" : "#00e5ff";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  });

  // Time labels
  const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];
  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 10px 'Poppins', sans-serif";
  hours.forEach((label, idx) => {
    const x = 50 + (idx / (hours.length - 1)) * (w - 80);
    ctx.fillText(label, x - 14, h - 14);
  });
}

// ==============================================================================
// 7. ADD MACHINE PAGE (Matches Mockup 7)
// ==============================================================================
function renderAddMachineHtml() {
  return `
    <div style="max-width: 820px; margin: 0 auto;">
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
        <button class="btn-resolve" style="padding: 10px;" onclick="switchView('overview')">
          &larr; Back
        </button>
        <h2 class="page-title" style="font-size: 1.5rem;">Add Machine</h2>
      </div>

      <div class="machine-card" style="cursor: default; padding: 32px;">
        <form id="form-add-machine">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: flex-end; margin-bottom: 20px;">
            <!-- Spindle Preview Card -->
            <div>
              <label class="form-label">Spindle Preview</label>
              <div class="spindle-view-container" style="aspect-ratio: 2 / 1; min-height: 120px;">
                <img src="./images/spindle-horizontal.png" alt="Spindle Preview" class="spindle-img-horizontal" style="max-height: 110px;" />
              </div>
            </div>

            <!-- IP Address -->
            <div>
              <label class="form-label">IP Address</label>
              <input type="text" id="add-ip" class="form-input" placeholder="e.g. 192.168.1.105" required value="192.168.1.105" />
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label class="form-label">Name Machine</label>
            <input type="text" id="add-name" class="form-input" placeholder="e.g. Mesin CNC Milling Joglo VF-500i Unit 2" required />
          </div>

          <div style="margin-bottom: 20px;">
            <label class="form-label">Device ID</label>
            <input type="text" id="add-devid" class="form-input" placeholder="e.g. MCH-005" required value="MCH-005" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div>
              <label class="form-label">Axis Type</label>
              <select id="add-axis" class="form-input">
                <option value="3-Axis">3-Axis</option>
                <option value="5-Axis">5-Axis</option>
              </select>
            </div>
            <div>
              <label class="form-label">Machine Type</label>
              <select id="add-type" class="form-input">
                <option value="CNC Milling">CNC Milling</option>
                <option value="CNC Turning">CNC Turning</option>
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid rgba(51, 65, 85, 0.4); padding-top: 20px;">
            <button type="button" class="btn-resolve" style="padding: 10px 24px;" onclick="switchView('overview')">
              Cancel
            </button>
            <button type="submit" class="btn-primary" style="padding: 10px 28px;">
              Register Machine
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function attachAddEvents() {
  const form = document.getElementById("form-add-machine");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("add-name").value.trim();
      const ip = document.getElementById("add-ip").value.trim();
      const devId = document.getElementById("add-devid").value.trim();
      const axis = document.getElementById("add-axis").value;
      const mtype = document.getElementById("add-type").value;

      if (!name) return;

      const newId = `CNC-${String(state.machines.length + 1).padStart(3, "0")}`;
      const newMachine = {
        id: newId,
        name: name,
        modelNumber: name,
        location: "PT YPTI Production Floor",
        deviceIp: ip,
        deviceId: devId,
        axisType: axis,
        machineType: mtype,
        spindleSpeedRpm: 6000,
        status: "HEALTHY",
        vibrationRms: 0.52,
        temperature: 31.4,
        vibrationN1: 0.48,
        vibrationN2: 0.55,
        aiConfidence: 0.98,
        healthIndex: 96,
        runHours: 0,
        lastUpdated: "Just now",
        historyVibRms: [0.5, 0.51, 0.5, 0.52, 0.51, 0.52, 0.52],
        historyTemp: [31.0, 31.1, 31.2, 31.3, 31.3, 31.4, 31.4],
        telemetryLogs: [
          { timestamp: "14:21:05", timeLabel: "14:21", temp: 31.4, vibRms: 0.52, vibN1: 0.48, vibN2: 0.55 }
        ],
        anomalyMessage: "",
        recommendation: "Unit baru terdaftar. Kondisi sangat optimal.",
        suggestedInspection: "30 Hari Kedepan"
      };

      state.machines.push(newMachine);
      showToast(`Mesin "${name}" berhasil didaftarkan ke sistem!`);
      switchView("overview");
    });
  }
}

// ==============================================================================
// 8. LIVE SIMULATION ENGINE (Ultra-Dynamic Real-time Ticker, 1s Refresh)
// ==============================================================================
let simTick = 0;

function initLiveSimulation() {
  setInterval(() => {
    if (!state.isSimulationActive) return;

    simTick++;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("id-ID", { hour12: false });
    const timeShort = timeStr.substring(0, 5);

    state.machines.forEach((m) => {
      if (m.id === "CNC-001") {
        // =====================================================================
        // MESIN 1: CNC Milling EVO-1 (Kritis - Outer Race Fault)
        // Fluktuasi DINAMIS & SIGNIFIKAN di atas Batas ISO 2.80 mm/s
        // =====================================================================
        const waveA = Math.sin(simTick * 0.42) * 0.65;
        const waveB = Math.cos(simTick * 0.85) * 0.30;
        const jitter = (Math.random() - 0.5) * 0.35;
        
        // Vibration RMS: berayun tajam antara ~3.10 hingga ~4.75 mm/s
        m.vibrationRms = Number(Math.max(2.85, Math.min(5.20, 3.75 + waveA + waveB + jitter)).toFixed(2));
        
        // Temperature: berayun antara ~47.0 °C hingga ~52.5 °C (Thermal Anomaly)
        const tempWave = Math.sin(simTick * 0.30) * 2.4;
        const tempJitter = (Math.random() - 0.5) * 0.6;
        m.temperature = Number(Math.max(46.0, Math.min(54.0, 49.5 + tempWave + tempJitter)).toFixed(1));
        
        // Cacat dominan pada bantalan depan N2
        m.vibrationN2 = Number((m.vibrationRms * 1.38 + (Math.random() - 0.5) * 0.25).toFixed(2));
        m.vibrationN1 = Number((m.vibrationRms * 0.55 + (Math.random() - 0.5) * 0.15).toFixed(2));
        
        // Health Index dinamis
        m.healthIndex = Math.max(28, Math.min(49, Math.round(42 - (m.vibrationRms - 3.4) * 8)));

      } else if (m.id === "CNC-002") {
        // =====================================================================
        // MESIN 2: DMU 50 EVO_1 (Waspada - Inner Race Fault)
        // Fluktuasi DINAMIS di zona peringatan kuning (1.80 - 2.75 mm/s)
        // =====================================================================
        const waveA = Math.sin(simTick * 0.38 + 1.2) * 0.42;
        const waveB = Math.sin(simTick * 0.90) * 0.18;
        const jitter = (Math.random() - 0.5) * 0.22;
        
        // Vibration RMS: berayun antara ~1.85 hingga ~2.72 mm/s
        m.vibrationRms = Number(Math.max(1.80, Math.min(2.78, 2.25 + waveA + waveB + jitter)).toFixed(2));
        
        // Temperature: berayun antara ~40.5 °C hingga ~44.5 °C
        const tempWave = Math.sin(simTick * 0.28 + 0.8) * 1.8;
        const tempJitter = (Math.random() - 0.5) * 0.4;
        m.temperature = Number(Math.max(39.5, Math.min(44.8, 42.2 + tempWave + tempJitter)).toFixed(1));
        
        // Cacat cincin dalam N1
        m.vibrationN1 = Number((m.vibrationRms * 1.28 + (Math.random() - 0.5) * 0.18).toFixed(2));
        m.vibrationN2 = Number((m.vibrationRms * 0.72 + (Math.random() - 0.5) * 0.12).toFixed(2));
        
        // Health Index dinamis
        m.healthIndex = Math.max(64, Math.min(79, Math.round(71 - (m.vibrationRms - 2.15) * 10)));

      } else {
        // =====================================================================
        // MESIN 3 & 4: Kondisi Sehat & Stabil (Kontras Visual terhadap Kerusakan)
        // Micro-fluctuations sangat halus (±0.02 mm/s, ±0.03 °C)
        // =====================================================================
        const dVib = (Math.random() - 0.5) * 0.04;
        const dTemp = (Math.random() - 0.5) * 0.03;
        const baseVib = m.id === "CNC-004" ? 0.65 : 0.85;
        const baseTemp = m.id === "CNC-004" ? 34.8 : 36.2;
        
        m.vibrationRms = Number(Math.max(0.4, Math.min(1.1, baseVib + dVib)).toFixed(2));
        m.temperature = Number(Math.max(30.0, Math.min(38.0, baseTemp + dTemp)).toFixed(1));
        m.vibrationN1 = Number((m.vibrationRms * 0.85).toFixed(2));
        m.vibrationN2 = Number((m.vibrationRms * 0.90).toFixed(2));
      }

      // Update history buffer (pertahankan 10 titik agar kurva bergelombang dinamis)
      m.historyVibRms.shift();
      m.historyVibRms.push(m.vibrationRms);
      m.historyTemp.shift();
      m.historyTemp.push(m.temperature);

      // Catat log telemetri terbaru
      m.telemetryLogs.unshift({
        timestamp: timeStr,
        timeLabel: timeShort,
        temp: m.temperature,
        vibRms: m.vibrationRms,
        vibN1: m.vibrationN1,
        vibN2: m.vibrationN2
      });
      if (m.telemetryLogs.length > 6) m.telemetryLogs.pop();
    });

    // Update elemen DOM yang sedang aktif secara instan & bebas kedip
    updateDynamicDom();
  }, 1000);
}

function updateDynamicDom() {
  if (state.currentView === "spindle" || state.currentView === "overview") {
    const grid = document.getElementById("overview-machine-grid");
    if (grid) {
      grid.innerHTML = renderOverviewCardsHtml(getSortedMachines());
    }
    const kpi = document.getElementById("overview-kpi-container");
    if (kpi) {
      kpi.innerHTML = renderKpiCardsHtml();
    }
  } else if (state.currentView === "machine-detail") {
    const machine = state.machines.find((m) => m.id === state.selectedMachineId) || state.machines[0];
    
    // Live update tabel sensor
    const tbody = document.getElementById("machine-detail-tbody");
    if (tbody) {
      tbody.innerHTML = machine.telemetryLogs
        .map(
          (log) => `
        <tr>
          <td style="color: #94a3b8;">${log.timestamp}</td>
          <td style="font-weight: 700; color: #f1f5f9;">${log.temp.toFixed(1)} °C</td>
          <td style="font-weight: 700; color: #38bdf8;">${log.vibN1.toFixed(2)} mm/s</td>
          <td style="font-weight: 700; color: #f59e0b;">${log.vibN2.toFixed(2)} mm/s</td>
        </tr>
      `
        )
        .join("");
    }

    // Live update indikator kotak real-time
    const liveVib = document.getElementById("spindle-live-vib");
    if (liveVib) {
      liveVib.textContent = `${machine.vibrationRms.toFixed(2)} mm/s`;
      liveVib.style.color = machine.vibrationRms >= 2.8 ? '#ef4444' : '#34d399';
    }
    const liveTemp = document.getElementById("spindle-live-temp");
    if (liveTemp) {
      liveTemp.textContent = `${machine.temperature.toFixed(1)} °C`;
      liveTemp.style.color = machine.temperature >= 45 ? '#ef4444' : '#38bdf8';
    }

    // Redraw dual monitoring canvas chart
    drawDualCanvasChart("dual-monitoring-canvas", machine);
  } else if (state.currentView === "reports") {
    // Tidak mere-render kartu setiap detik agar hover tetap mulus bebas kedut
  }
}

// TOAST NOTIFICATION
function showToast(msg) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${msg}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
