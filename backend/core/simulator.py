import numpy as np
import time

class VibrationSignalSimulator:
    """
    Generator sinyal getaran fisik 3-Axis (X, Y, Z) realistis untuk simulasi inferensi AI.
    Menghasilkan 784 sampel per window @ 1000 Hz sesuai 3 kondisi:
    1. HEALTHY: getaran rendah, harmonik normal
    2. INNER_RACE_FAULT: modulasi amplitudo pada frekuensi BPFI (~218 Hz)
    3. OUTER_RACE_FAULT: impuls getaran kuat pada frekuensi BPFO (~142 Hz)
    """
    def __init__(self, fs: int = 1000, window_size: int = 784):
        self.fs = fs
        self.window_size = window_size
        self.t = np.linspace(0, window_size / fs, window_size, endpoint=False)

    def generate_window(self, fault_type: str = "HEALTHY") -> np.ndarray:
        """
        Menghasilkan array numpy 2D berbentuk [784, 3] (Sumbu X, Y, Z).
        """
        t = self.t

        # 1. Base Machine Running Vibration (RPM ~ 2500 -> ~41.6 Hz)
        base_hz = 41.6
        carrier = 0.45 * np.sin(2 * np.pi * base_hz * t)

        if fault_type == "OUTER_RACE_FAULT":
            # Puncak kuat di BPFO 142 Hz + harmonik + noise getaran tinggi (RMS ~ 2.84 mm/s)
            bpfo_hz = 142.0
            impacts = 2.1 * np.sin(2 * np.pi * bpfo_hz * t) * np.exp(-((t % (1 / bpfo_hz)) * 80))
            noise_x = np.random.normal(0, 0.45, self.window_size)
            noise_y = np.random.normal(0, 0.40, self.window_size)
            noise_z = np.random.normal(0, 0.50, self.window_size)

            x = carrier + impacts + noise_x
            y = carrier * 0.7 + impacts * 0.8 + noise_y
            z = carrier * 0.5 + impacts * 1.1 + noise_z

        elif fault_type == "INNER_RACE_FAULT":
            # Modulasi frekuensi BPFI 218 Hz (RMS ~ 1.84 mm/s)
            bpfi_hz = 218.0
            modulation = (1 + 0.6 * np.sin(2 * np.pi * base_hz * t)) * np.sin(2 * np.pi * bpfi_hz * t)
            noise_x = np.random.normal(0, 0.30, self.window_size)
            noise_y = np.random.normal(0, 0.28, self.window_size)
            noise_z = np.random.normal(0, 0.35, self.window_size)

            x = carrier + 1.2 * modulation + noise_x
            y = carrier * 0.8 + 0.9 * modulation + noise_y
            z = carrier * 0.6 + 1.3 * modulation + noise_z

        else: # HEALTHY
            # Getaran halus normal (RMS ~ 0.75 mm/s)
            noise_x = np.random.normal(0, 0.15, self.window_size)
            noise_y = np.random.normal(0, 0.14, self.window_size)
            noise_z = np.random.normal(0, 0.16, self.window_size)

            x = carrier * 0.8 + noise_x
            y = carrier * 0.6 + noise_y
            z = carrier * 0.7 + noise_z

        # Stack ke format [784, 3]
        window_3axis = np.column_stack((x, y, z)).astype(np.float32)
        return window_3axis
