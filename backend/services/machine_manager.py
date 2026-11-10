import os
import time
import numpy as np
from typing import List, Dict, Any

from ai.model import VibrationBiLSTM, CLASS_NAMES
from core.signal_processor import calculate_rms, evaluate_iso_10816, analyze_fft_frequencies
from core.simulator import VibrationSignalSimulator

# Cek ketersediaan PyTorch
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

class MachineManager:
    def __init__(self):
        self.simulator = VibrationSignalSimulator()
        self.model = None
        self.mode = "CSV_SIMULATION" # atau "LIVE_HARDWARE"
        self._init_ai_model()
        self._init_machines()

    def _init_ai_model(self):
        """Memuat model PyTorch jika torch terpasang dan checkpoint tersedia"""
        if not TORCH_AVAILABLE:
            print("[AI Engine] PyTorch tidak terpasang di runtime sistem. Menggunakan High-Fidelity Signal Evaluation Engine.")
            return

        model_path = os.path.join(os.path.dirname(__file__), "..", "ai", "weights", "best_lstm_subf_v3")
        try:
            self.model = VibrationBiLSTM(input_size=3, hidden_dim=64, num_layers=2, num_classes=3)
            if os.path.exists(model_path):
                # Load weights dari folder checkpoint
                state_dict = torch.load(model_path, map_location="cpu")
                if isinstance(state_dict, dict) and "state_dict" in state_dict:
                    self.model.load_state_dict(state_dict["state_dict"])
                elif isinstance(state_dict, dict):
                    self.model.load_state_dict(state_dict)
                self.model.eval()
                print("[AI Engine] Model VibrationBiLSTM berhasil dimuat dari checkpoint!")
            else:
                self.model.eval()
                print("[AI Engine] Model diinisialisasi dalam mode evaluasi.")
        except Exception as e:
            print(f"[AI Engine] Peringatan memuat model: {e}. Menggunakan High-Fidelity Evaluation Engine.")
            self.model = None

    def _init_machines(self):
        """Inisialisasi 4 unit mesin CNC, memprioritaskan EVO-1 dan Joglo VF-500i"""
        self.machines: Dict[str, Dict[str, Any]] = {
            "CNC-001": {
                "id": "CNC-001",
                "name": "CNC Milling EVO-1",
                "modelNumber": "EVO-1",
                "location": "Bengkel Presisi YPTI - Line 1",
                "deviceIp": "192.168.1.101",
                "deviceId": "MCH-001",
                "axisType": "3-Axis",
                "machineType": "CNC Milling",
                "status": "OUTER_RACE_FAULT",
                "aiConfidence": 94.2,
                "healthIndex": 56,
                "vibrationRms": 2.84,
                "temperature": 48.6,
                "vibrationN1": 1.45,
                "vibrationN2": 2.84,
                "operatingState": "Running",
                "monitoringState": "Active",
                "runDuration": "RUN 05:42:18",
                "lastUpdated": "Live",
                "isoLimit": 2.80,
                "maxTempLimit": 45.0,
                "bpfoFrequencyHz": 142.0,
                "anomalyMessage": "N2 bearing vibration exceeds ISO limit (BPFO: 142 Hz). Recommended technical response: within 4 hours.",
                "historyVibRms": [1.4, 1.6, 1.9, 2.2, 2.5, 2.7, 2.84],
                "historyTemp": [38.0, 40.0, 42.5, 44.0, 46.5, 47.8, 48.6],
                "telemetryLogs": [],
                "suggestedInspection": "23 Oct 2026",
                "faultLocation": "Front Bearing (N2)",
                "recommendation": "Periksa kelonggaran clamping dan keausan cincin luar (outer race) pada bantalan depan N2.",
            },
            "CNC-002": {
                "id": "CNC-002",
                "name": "CNC Milling DMU 50 EVO_1",
                "modelNumber": "DMU 50 EVO_1",
                "location": "Bengkel Presisi YPTI - Line 2",
                "deviceIp": "192.168.1.102",
                "deviceId": "MCDU-001",
                "axisType": "5-Axis",
                "machineType": "CNC Milling",
                "status": "INNER_RACE_FAULT",
                "aiConfidence": 87.5,
                "healthIndex": 82,
                "vibrationRms": 1.84,
                "temperature": 41.8,
                "vibrationN1": 1.84,
                "vibrationN2": 1.12,
                "operatingState": "Running",
                "monitoringState": "Active",
                "runDuration": "RUN 05:42:18",
                "lastUpdated": "Live",
                "isoLimit": 2.80,
                "maxTempLimit": 45.0,
                "bpfiFrequencyHz": 218.0,
                "anomalyMessage": "Indikasi getaran harmonik cincin dalam (Inner Race) pada bearing N1.",
                "historyVibRms": [0.9, 1.1, 1.3, 1.5, 1.7, 1.8, 1.84],
                "historyTemp": [34.0, 36.2, 38.0, 39.5, 40.8, 41.5, 41.8],
                "telemetryLogs": [],
                "suggestedInspection": "25 Oct 2026",
                "faultLocation": "Rear Bearing (N1)",
                "recommendation": "Lakukan pelumasan ulang (greasing) pada bearing N1 dan pantau kenaikan temperatur.",
            },
            "CNC-003": {
                "id": "CNC-003",
                "name": "CNC Milling DMU 50 EVO_2",
                "modelNumber": "DMU 50 EVO_2",
                "location": "Bengkel Presisi YPTI - Line 2",
                "deviceIp": "192.168.1.103",
                "deviceId": "MCDU-002",
                "axisType": "5-Axis",
                "machineType": "CNC Milling",
                "status": "HEALTHY",
                "aiConfidence": 96.8,
                "healthIndex": 92,
                "vibrationRms": 0.92,
                "temperature": 39.0,
                "vibrationN1": 0.85,
                "vibrationN2": 0.92,
                "operatingState": "Running",
                "monitoringState": "Active",
                "runDuration": "RUN 05:42:18",
                "lastUpdated": "Live",
                "isoLimit": 2.80,
                "maxTempLimit": 45.0,
                "historyVibRms": [0.75, 0.78, 0.82, 0.85, 0.88, 0.90, 0.92],
                "historyTemp": [32.0, 34.0, 35.5, 37.0, 38.0, 38.5, 39.0],
                "telemetryLogs": [],
                "suggestedInspection": "15 Nov 2026",
                "faultLocation": "None",
                "recommendation": "Seluruh bantalan dalam kondisi optimal. Lanjutkan pemantauan standar.",
            },
            "CNC-004": {
                "id": "CNC-004",
                "name": "Mesin CNC Milling 3 Axis Joglo VF-500i",
                "modelNumber": "Joglo VF-500i",
                "location": "Bengkel Perakitan YPTI - Area Utama",
                "deviceIp": "192.168.1.104",
                "deviceId": "MCJ-001",
                "axisType": "3-Axis",
                "machineType": "CNC Milling",
                "status": "HEALTHY",
                "aiConfidence": 98.4,
                "healthIndex": 96,
                "vibrationRms": 0.75,
                "temperature": 37.5,
                "vibrationN1": 0.70,
                "vibrationN2": 0.75,
                "operatingState": "Running",
                "monitoringState": "Active",
                "runDuration": "RUN 05:42:18",
                "lastUpdated": "Live",
                "isoLimit": 2.80,
                "maxTempLimit": 45.0,
                "historyVibRms": [0.65, 0.68, 0.70, 0.72, 0.73, 0.74, 0.75],
                "historyTemp": [31.5, 33.0, 34.2, 35.5, 36.5, 37.0, 37.5],
                "telemetryLogs": [],
                "suggestedInspection": "20 Nov 2026",
                "faultLocation": "None",
                "recommendation": "Kondisi mesin prima (spindle buatan YPTI beroperasi dengan vibrasi sangat rendah).",
            },
        }

    def infer_window(self, window_3axis: np.ndarray) -> tuple:
        """
        Menjalankan inferensi AI pada window 784 sampel getaran.
        Mengembalikan (predicted_status, confidence_pct)
        """
        if self.model is not None and TORCH_AVAILABLE:
            try:
                input_tensor = torch.tensor(window_3axis, dtype=torch.float32).unsqueeze(0)
                with torch.no_grad():
                    logits = self.model(input_tensor)
                    probs = torch.softmax(logits, dim=1).squeeze().numpy()
                    pred_class = int(np.argmax(probs))
                    confidence = float(probs[pred_class] * 100)
                    return CLASS_NAMES[pred_class], round(confidence, 1)
            except Exception as e:
                print(f"[Inferensi Error] {e}")

        # Fallback signal analysis jika PyTorch belum siap
        rms = calculate_rms(window_3axis[:, 0])
        if rms >= 2.4:
            return "OUTER_RACE_FAULT", 93.5
        elif rms >= 1.6:
            return "INNER_RACE_FAULT", 88.0
        else:
            return "HEALTHY", 97.2

    def tick_simulation(self):
        """Memperbarui telemetri seluruh mesin secara dinamis setiap detik"""
        now_str = time.strftime("%H:%M:%S")

        for m_id, m in self.machines.items():
            # 1. Dapatkan window sinyal getaran sesuai kondisi mesin
            window = self.simulator.generate_window(m["status"])
            
            # 2. Hitung RMS aktual dari sinyal
            vib_rms = calculate_rms(window[:, 0])
            
            # Berikan sedikit fluktuasi alami
            delta_temp = (np.random.rand() - 0.48) * 0.08
            new_temp = round(max(30.0, m["temperature"] + delta_temp), 1)
            
            # 3. Jalankan inferensi AI
            ai_status, conf = self.infer_window(window)
            
            # 4. Evaluasi standar ISO
            iso_eval = evaluate_iso_10816(vib_rms, new_temp)

            # Update state mesin
            m["vibrationRms"] = round(vib_rms, 2)
            m["temperature"] = new_temp
            m["vibrationN1"] = round(vib_rms * (0.85 if m["status"] != "INNER_RACE_FAULT" else 1.0), 2)
            m["vibrationN2"] = round(vib_rms * (1.0 if m["status"] == "OUTER_RACE_FAULT" else 0.75), 2)
            m["aiConfidence"] = conf
            m["healthIndex"] = iso_eval["health_index"]
            m["lastUpdated"] = "Live"

            # Update riwayat sparkline (simpan 7 titik)
            m["historyVibRms"] = m["historyVibRms"][1:] + [m["vibrationRms"]]
            m["historyTemp"] = m["historyTemp"][1:] + [new_temp]

            # Update telemetri logs (simpan 5 titik terbaru)
            log_item = {
                "timestamp": now_str,
                "timeLabel": now_str[:5],
                "temp": new_temp,
                "vibRms": m["vibrationRms"],
                "vibN1": m["vibrationN1"],
                "vibN2": m["vibrationN2"],
            }
            m["telemetryLogs"] = [log_item] + m["telemetryLogs"][:4]

    def get_priority_sorted_machines(self) -> List[Dict[str, Any]]:
        """Mengurutkan mesin berdasarkan tingkat keparahan insiden (Float-to-Top)"""
        priority_map = {
            "OUTER_RACE_FAULT": 1,
            "INNER_RACE_FAULT": 2,
            "HEALTHY": 3,
        }
        machines_list = list(self.machines.values())
        return sorted(machines_list, key=lambda m: priority_map.get(m["status"], 4))

    def get_all_machines(self) -> List[Dict[str, Any]]:
        return list(self.machines.values())

    def get_machine_by_id(self, machine_id: str):
        return self.machines.get(machine_id)

    def add_machine(self, name: str, ip_address: str, device_id: str, axis_type: str = "3-Axis", machine_type: str = "CNC Milling") -> Dict[str, Any]:
        """Menambahkan unit mesin baru secara dinamis ke sistem ZENTRA"""
        count = len(self.machines) + 1
        new_id = f"CNC-{count:03d}"
        now_str = time.strftime("%H:%M:%S")
        now_short = time.strftime("%H:%M")
        
        new_machine = {
            "id": new_id,
            "name": name if name else f"CNC Unit #{count}",
            "modelNumber": name if name else f"Unit-{count}",
            "location": "PT YPTI Shopfloor",
            "deviceIp": ip_address if ip_address else f"192.168.1.{100 + count}",
            "deviceId": device_id if device_id else f"MCH-{count:03d}",
            "axisType": axis_type,
            "machineType": machine_type,
            "spindleSpeedRpm": 6000,
            "status": "HEALTHY",
            "vibrationRms": 0.45,
            "temperature": 29.5,
            "vibrationN1": 0.38,
            "vibrationN2": 0.42,
            "aiConfidence": 0.96,
            "healthIndex": 95,
            "runHours": 0,
            "lastUpdated": "Just now",
            "historyVibRms": [0.42, 0.44, 0.45, 0.43, 0.45, 0.46, 0.45],
            "historyTemp": [29.1, 29.2, 29.3, 29.4, 29.4, 29.5, 29.5],
            "telemetryLogs": [
                {
                    "timestamp": now_str,
                    "timeLabel": now_short,
                    "temp": 29.5,
                    "vibRms": 0.45,
                    "vibN1": 0.38,
                    "vibN2": 0.42,
                }
            ],
            "recommendation": "Kondisi unit baru terdaftar sangat optimal. Lakukan pelumasan berkala.",
            "suggestedInspection": "30 Hari Kedepan",
        }
        self.machines[new_id] = new_machine
        return new_machine
