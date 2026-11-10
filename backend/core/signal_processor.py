import numpy as np

def calculate_rms(signal: np.ndarray) -> float:
    """
    Menghitung Root Mean Square (RMS) dari sinyal getaran akselerasi.
    """
    if len(signal) == 0:
        return 0.0
    return float(np.sqrt(np.mean(np.square(signal))))

def evaluate_iso_10816(vibration_rms: float, temperature: float) -> dict:
    """
    Mengevaluasi kondisi getaran berdasarkan Standar ISO 10816 untuk Mesin Perkakas (CNC Spindle):
    - Zona A/B: RMS < 1.80 mm/s (Normal / Sehat)
    - Zona C: 1.80 <= RMS < 2.80 mm/s (Warning / Restricted Operation)
    - Zona D: RMS >= 2.80 mm/s (Urgent / Danger / Tindakan Segera)
    """
    is_iso_exceeded = vibration_rms >= 2.80
    is_temp_exceeded = temperature >= 45.0

    if is_iso_exceeded or temperature > 50.0:
        urgency = "URGENT"
        health_index = max(35, int(100 - (vibration_rms / 3.5) * 60))
        recommendation = "Batas ISO 10816 (2.80 mm/s) terlampaui. Risiko kerusakan fatal. Segera jadwalkan inspeksi teknisi < 4 jam."
    elif vibration_rms >= 1.80 or is_temp_exceeded:
        urgency = "MEDIUM"
        health_index = max(65, int(90 - (vibration_rms / 2.8) * 25))
        recommendation = "Getaran berada pada zona perhatian (Zona C ISO 10816). Periksa pelumasan dan kondisi bantalan pada shift berikutnya."
    else:
        urgency = "NORMAL"
        health_index = min(98, max(85, int(100 - vibration_rms * 8)))
        recommendation = "Kondisi getaran dan temperatur stabil dalam batas aman normal."

    return {
        "urgency": urgency,
        "is_iso_exceeded": is_iso_exceeded,
        "is_temp_exceeded": is_temp_exceeded,
        "health_index": health_index,
        "recommendation": recommendation,
    }

def analyze_fft_frequencies(signal_1d: np.ndarray, fs: int = 1000) -> dict:
    """
    Menghitung spektrum frekuensi FFT untuk mendeteksi frekuensi cacat karakteristik:
    - BPFO (Ball Pass Frequency Outer Race): kisaran ~135 - 150 Hz (umumnya 142 Hz)
    - BPFI (Ball Pass Frequency Inner Race): kisaran ~200 - 230 Hz (umumnya 218 Hz)
    """
    if len(signal_1d) < 128:
        return {"dominant_freq": 0.0, "is_bpfo": False, "is_bpfi": False}

    n = len(signal_1d)
    fft_vals = np.abs(np.fft.rfft(signal_1d))
    freqs = np.fft.rfftfreq(n, d=1.0 / fs)

    # Hilangkan komponen DC (0 Hz)
    fft_vals[0] = 0.0

    peak_idx = np.argmax(fft_vals)
    dominant_freq = float(freqs[peak_idx])

    is_bpfo = 135.0 <= dominant_freq <= 150.0
    is_bpfi = 205.0 <= dominant_freq <= 230.0

    return {
        "dominant_freq": round(dominant_freq, 1),
        "is_bpfo": is_bpfo,
        "is_bpfi": is_bpfi,
    }
