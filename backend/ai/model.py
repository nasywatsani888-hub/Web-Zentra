try:
    import torch
    import torch.nn as nn
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    torch = None
    nn = None

if TORCH_AVAILABLE:
    class VibrationBiLSTM(nn.Module):
        """
        Arsitektur Deep Learning BiLSTM untuk Klasifikasi Kerusakan Bearing 3-Axis.
        Sesuai checkpoint 'best_lstm_subf_v3' (ai-model-1.0.pt).
        Input: [Batch, 784, 3] (Sumbu X, Y, Z getaran)
        Output: 3 Kelas:
          - 0: Healthy / Normal
          - 1: Inner Race Fault (FIR)
          - 2: Outer Race Fault (FOR)
        """
        def __init__(self, input_size=3, hidden_dim=64, num_layers=2, num_classes=3, dropout=0.2):
            super().__init__()
            self.lstm = nn.LSTM(
                input_size=input_size,
                hidden_size=hidden_dim,
                num_layers=num_layers,
                batch_first=True,
                bidirectional=True,
                dropout=dropout if num_layers > 1 else 0.0,
            )
            self.fc = nn.Sequential(
                nn.Dropout(dropout),
                nn.Linear(hidden_dim * 2, 32),
                nn.ReLU(),
                nn.Linear(32, num_classes),
            )

        def forward(self, x):
            out, _ = self.lstm(x)
            pooled = out.mean(dim=1)
            return self.fc(pooled)
else:
    class VibrationBiLSTM:
        def __init__(self, *args, **kwargs):
            pass

CLASS_NAMES = {
    0: "HEALTHY",
    1: "INNER_RACE_FAULT",
    2: "OUTER_RACE_FAULT",
}

CLASS_DESCRIPTIONS = {
    "HEALTHY": "Bantalan dalam kondisi normal dan sehat.",
    "INNER_RACE_FAULT": "Kerusakan/keausan pada cincin dalam (Inner Race) bantalan.",
    "OUTER_RACE_FAULT": "Kerusakan/cacat pada cincin luar (Outer Race) bantalan.",
}
