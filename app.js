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
    historyVibRms: [2.8, 3.4, 3.1, 4.2, 3.6, 4.5, 3.3, 4.1, 3.7, 3.42],
    historyTemp: [45.8, 47.2, 48.9, 47.5, 50.8, 48.9, 51.5, 49.8, 51.0, 48.5],
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
    historyVibRms: [1.8, 2.1, 1.9, 2.4, 2.0, 2.6, 2.2, 2.5, 2.1, 2.15],
    historyTemp: [39.8, 41.2, 40.5, 42.6, 41.8, 43.4, 42.1, 43.8, 42.5, 42.1],
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
    historyVibRms: [0.81, 0.84, 0.83, 0.86, 0.84, 0.85, 0.83, 0.86, 0.84, 0.85],
    historyTemp: [35.8, 36.1, 36.0, 36.3, 36.1, 36.2, 36.1, 36.3, 36.2, 36.2],
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
    historyVibRms: [0.62, 0.65, 0.64, 0.66, 0.63, 0.66, 0.64, 0.65, 0.64, 0.65],
    historyTemp: [34.3, 34.6, 34.5, 34.8, 34.6, 34.8, 34.5, 34.8, 34.7, 34.8],
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

const INITIAL_REPORTS = [
  { id: "REP-01", title: "Shift Pagi (07:00 - 15:00)", dateRange: "24 Oct 2026", activeMachines: 4, alertsCount: 1 },
  { id: "REP-02", title: "Shift Siang (15:00 - 23:00)", dateRange: "23 Oct 2026", activeMachines: 4, alertsCount: 0 },
  { id: "REP-03", title: "Shift Malam (23:00 - 07:00)", dateRange: "23 Oct 2026", activeMachines: 4, alertsCount: 0 },
  { id: "REP-04", title: "Weekly Machine Health Summary", dateRange: "17 - 24 Oct 2026", activeMachines: 4, alertsCount: 2 }
];

// STATE APLIKASI
let state = {
  machines: JSON.parse(JSON.stringify(INITIAL_MACHINES)),
  currentView: "overview", // 'overview' | 'spindle' | 'registry' | 'service' | 'reports' | 'machine-detail' | 'add-machine'
  selectedMachineId: "CNC-001",
  isAlertResolved: false,
  searchTerm: "",
  isSimulationActive: true,
  previewReportTitle: null
};

// INITIALIZATION
window.addEventListener("DOMContentLoaded", () => {
  initClock();
  initNavigation();
  initLiveSimulation();
  renderApp();
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

  // Update active state in sidebar
  document.querySelectorAll(".nav-item").forEach((btn) => {
    const btnView = btn.getAttribute("data-view");
    if (btnView === viewName) {
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
    case "overview":
      content.innerHTML = renderOverviewHtml();
      attachOverviewEvents();
      break;
    case "spindle":
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
    case "machine-detail":
      content.innerHTML = renderMachineDetailHtml();
      attachDetailEvents();
      break;
    case "add-machine":
      content.innerHTML = renderAddMachineHtml();
      attachAddEvents();
      break;
    default:
      content.innerHTML = renderOverviewHtml();
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
        <div class="machine-card-figma ${cardFaultClass}">
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
            <button class="btn-detail-diagnostik" onclick="switchView('machine-detail', '${m.id}')">
              Detail Diagnostik
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

// ==============================================================================
// 1. OVERVIEW PAGE (Matches Image 1 Exactly)
// ==============================================================================
function renderOverviewHtml() {
  const sorted = getSortedMachines();
  const critical = sorted.find((m) => m.status === "OUTER_RACE_FAULT");

  let alertBannerHtml = "";
  if (!state.isAlertResolved && critical) {
    alertBannerHtml = `
      <div class="alert-banner-figma">
        <div class="alert-figma-left">
          <span class="alert-figma-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            HIGH URGENCY
          </span>
          <span class="alert-figma-machine">CNC Milling 01</span>
          <span class="alert-figma-msg">N2 bearing vibration exceeds ISO limit (BPFO: 142 Hz). Recommended technical response: within 4 hours.</span>
        </div>
        <button class="btn-figma-resolve" id="btn-resolve-alert">Resolve</button>
      </div>
    `;
  }

  return `
    <div class="overview-header">
      <h1 class="overview-title">Overview</h1>
      <div class="header-actions">
        <div id="wib-clock-pill" class="clock-pill">13 : 58 : 22  WIB</div>
        <button class="btn-add-machine-pill" onclick="switchView('add-machine')">
          <span>+</span> Add Machine
        </button>
      </div>
    </div>

    ${alertBannerHtml}
    <div id="overview-kpi-container">${renderKpiCardsHtml()}</div>

    <div class="machine-grid-figma" id="overview-machine-grid">
      ${renderOverviewCardsHtml(sorted)}
    </div>
  `;
}

function attachOverviewEvents() {
  const resolveBtn = document.getElementById("btn-resolve-alert");
  if (resolveBtn) {
    resolveBtn.addEventListener("click", () => {
      state.isAlertResolved = true;
      renderApp();
      showToast("Peringatan berhasil diselesaikan.");
    });
  }
}

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
// 2. SPINDLE DIAGNOSTIC PAGE (Matches Mockup 2)
// ==============================================================================
function renderSpindleDiagnosticHtml() {
  const sorted = getSortedMachines();
  const critical = sorted.find((m) => m.status === "OUTER_RACE_FAULT");

  let alertBannerHtml = "";
  if (!state.isAlertResolved && critical) {
    alertBannerHtml = `
      <div class="alert-banner">
        <div class="alert-left">
          <span class="alert-pill">HIGH URGENCY</span>
          <span class="alert-text">
            <strong>${critical.name}</strong> — ${critical.anomalyMessage}
          </span>
        </div>
        <button class="btn-resolve" onclick="state.isAlertResolved=true; renderApp();">Resolve</button>
      </div>
    `;
  }

  return `
    <div class="top-header">
      <h2 class="page-title">Spindle Diagnostic</h2>
    </div>

    ${alertBannerHtml}
    <div id="spindle-kpi-container">${renderKpiCardsHtml()}</div>

    <div class="machine-grid" id="spindle-machine-grid">
      ${renderSpindleCardsHtml()}
    </div>
  `;
}

function attachSpindleEvents() {}

// ==============================================================================
// 3. DEVICE REGISTRY PAGE (Matches Mockup 3)
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

    ${renderKpiCardsHtml()}

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
// 5. SHIFT REPORTS PAGE (Matches Mockup 5)
// ==============================================================================
function renderShiftReportsHtml() {
  const reportsHtml = INITIAL_REPORTS.map(
    (rep) => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-radius: 16px; background: #0b1b30; border: 1px solid rgba(56, 189, 248, 0.3); margin-bottom: 12px; flex-wrap: wrap; gap: 16px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 46px; height: 46px; border-radius: 12px; background: #122b4d; border: 1px solid rgba(56, 189, 248, 0.5); display: flex; align-items: center; justify-content: center; color: #38bdf8;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #ffffff; font-size: 0.95rem;">${rep.title}</div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Periode: ${rep.dateRange} · 4 Unit Mesin Aktif</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <button class="btn-resolve" style="background-color: #122b4d; border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;" onclick="previewReport('${rep.title}')">
          View
        </button>
        <button class="btn-primary" style="padding: 8px 16px; font-size: 0.75rem;" onclick="downloadCsv('${rep.title}')">
          Download CSV
        </button>
      </div>
    </div>
  `
  ).join("");

  return `
    <div class="top-header">
      <h2 class="page-title">Shift Reports</h2>
    </div>

    <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
      <div style="padding: 10px 16px; border-radius: 12px; background: #1e2533; border: 1px solid #334155; font-family: var(--font-mono); font-size: 0.8rem; color: #f1f5f9;">
        Machine: <strong>All Machines</strong>
      </div>
      <div style="padding: 10px 16px; border-radius: 12px; background: #1e2533; border: 1px solid #334155; font-family: var(--font-mono); font-size: 0.8rem; color: #f1f5f9;">
        Period: <strong>Last 24 Hours</strong>
      </div>
    </div>

    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; font-family: var(--font-mono);">
      <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff;">Machine Data Log</h3>
      <span style="font-size: 0.75rem; color: #94a3b8;">${state.machines.length} Machines Recorded</span>
    </div>

    ${reportsHtml}

    <!-- Modal Preview -->
    <div id="report-modal" class="modal-overlay">
      <div class="modal-content">
        <h3 id="modal-title" style="font-family: var(--font-mono); font-weight: 800; color: #ffffff; font-size: 1.1rem; margin-bottom: 12px;"></h3>
        <p style="font-family: var(--font-mono); font-size: 0.8rem; color: #94a3b8; line-height: 1.6; margin-bottom: 20px;">
          Ringkasan kondisi mesin CNC selama shift: Seluruh 4 mesin terpantau secara real-time. Ditemukan 1 anomali Outer Race Fault pada CNC Milling EVO-1 (Vibrasi N2 mencapai 4.80 mm/s) dan 1 anomali cincin dalam pada DMU 50 EVO_1. Mesin Joglo VF-500i beroperasi dengan tingkat kestabilan getaran optimal (0.65 mm/s).
        </p>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn-resolve" onclick="closeModal()">Tutup</button>
          <button class="btn-primary" id="modal-download-btn">Download CSV</button>
        </div>
      </div>
    </div>
  `;
}

function attachReportsEvents() {}

function previewReport(title) {
  state.previewReportTitle = title;
  const modal = document.getElementById("report-modal");
  const modalTitle = document.getElementById("modal-title");
  const downloadBtn = document.getElementById("modal-download-btn");
  if (modal && modalTitle) {
    modalTitle.textContent = title;
    modal.classList.add("active");
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        closeModal();
        downloadCsv(title);
      };
    }
  }
}

function closeModal() {
  const modal = document.getElementById("report-modal");
  if (modal) modal.classList.remove("active");
}

function downloadCsv(reportTitle) {
  const headers = [
    "Machine ID",
    "Machine Name",
    "Device ID",
    "Location",
    "Status Diagnosa AI",
    "Vibration RMS (mm/s)",
    "Spindle Temp (C)",
    "Health Index (%)",
    "Batas ISO 10816",
    "Rekomendasi Pemeliharaan"
  ];

  const rows = state.machines.map((m) => [
    m.id,
    `"${m.name}"`,
    m.deviceId,
    `"${m.location}"`,
    m.status,
    m.vibrationRms.toFixed(2),
    m.temperature.toFixed(1),
    m.healthIndex,
    m.vibrationRms >= 2.8 ? "MELEBIHI BATAS (ISO Class II 2.80)" : "NORMAL",
    `"${m.recommendation || "Rutin Standar"}"`
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `ZENTRA_${reportTitle.replace(/[^a-zA-Z0-9]/g, "_")}_2026.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  if (state.currentView === "overview") {
    const grid = document.getElementById("overview-machine-grid");
    if (grid) {
      grid.innerHTML = renderOverviewCardsHtml(getSortedMachines());
    }
    const kpi = document.getElementById("overview-kpi-container");
    if (kpi) {
      kpi.innerHTML = renderKpiCardsHtml();
    }
  } else if (state.currentView === "spindle") {
    const grid = document.getElementById("spindle-machine-grid");
    if (grid) {
      grid.innerHTML = renderSpindleCardsHtml();
    }
    const kpi = document.getElementById("spindle-kpi-container");
    if (kpi) {
      kpi.innerHTML = renderKpiCardsHtml();
    }
  } else if (state.currentView === "machine-detail") {
    const machine = state.machines.find((m) => m.id === state.selectedMachineId) || state.machines[0];
    drawDualCanvasChart("dual-monitoring-canvas", machine);
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
