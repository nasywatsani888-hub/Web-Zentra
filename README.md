# 🌀 ZENTRA — Predictive Bearing Health Monitoring & Early Fault Diagnosis

> **Sistem Early Detection & Diagnosa Kerusakan Bearing Spindle Mesin CNC Berbasis IoT & AI**  
> 🏆 **Kompetisi**: Kembara UNYVerse 2026 — Sub-Tema Smart Manufacturing  
> 🏭 **Mitra Industri**: PT Yogya Presisi Tehnikatama Industri (PT YPTI)  
> 👥 **Tim**: Kata Budi "Pengen Jadi Mapres" — Universitas Negeri Yogyakarta (UNY)

---

## 📌 Sekilas Tentang Proyek

**ZENTRA** adalah sistem pemantauan kondisi (*condition monitoring*) dan diagnosa prediktif untuk bantalan (*bearing*) spindle mesin CNC (khususnya CNC Milling seperti DMG MORI DMU 50 EVO dan Joglo VF-500i di lini manufaktur PT YPTI). 

Sistem ini memadukan **sensor getaran triaksial (ADXL345)**, **sensor suhu presisi (PT100 RTD MAX31865)**, **mikrokontroler ESP32-S3**, dan **algoritma klasifikasi sinyal ISO 10816-3 & Deep Learning** untuk mendeteksi kerusakan cincin luar (*outer race fault* / BPFO) dan cincin dalam (*inner race fault* / BPFI) sebelum terjadi *catastrophic breakdown*.

---

## 🚀 Cara Menjalankan Aplikasi (Quick Start)

Untuk kemudahan demonstrasi lomba dan kolaborasi tim, ZENTRA dapat dijalankan dengan **dua mode**:

### 1. Mode Standalone (Paling Cepat & Bebas Ribet — Direkomendasikan) ⭐
> **Tanpa perlu install Node.js, Python, atau database apapun!** Langsung jalan di semua browser laptop tim/juri.

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/USERNAME/REPO_NAME.git
   cd "Web zentra"
   ```
2. **Jalankan aplikasi:**
   - **Windows:** Klik ganda file **`start_zentra.bat`**  
   *(atau langsung klik kanan file **`index.html`** → Open with Google Chrome / Microsoft Edge).*
3. Web dashboard ZENTRA langsung terbuka dengan fitur lengkap:
   - ✅ Simulasi telemetri live (getaran RMS, suhu, health index) setiap 1.5 detik
   - ✅ Grafik sparkline ganda dengan garis batas ISO 2.80 mm/s & batas suhu 45°C
   - ✅ Dynamic Float-to-Top (mesin anomali otomatis naik ke atas)
   - ✅ Visualisasi 3D Spindle dengan pin locator & hotspot hazard
   - ✅ Ekspor laporan shift ke format `.csv` riil
   - ✅ Desain gelap industrial presisi Figma & font Poppins

---

### 2. Mode Pengembangan Modular (Next.js & Backend FastAPI)

Jika kamu ingin mengembangkan modul backend atau komponen React:

#### A. Backend (Python FastAPI & ESP32)
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- API Docs Swagger: `http://localhost:8000/docs`
- Firmware ESP32: Ada di folder `backend/esp32_firmware/zentra_esp32_transmitter.ino`

#### B. Frontend Modular (Next.js 15 + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
- Akses di browser: `http://localhost:3000`

---

## 📁 Struktur Folder Proyek

Biar teman-teman tim tidak bingung saat membaca kodingan, berikut peta direktori ZENTRA:

```
Web zentra/
├── index.html             # [UTAMA] Halaman web tunggal dashboard ZENTRA (Standalone)
├── styles.css             # [UTAMA] Seluruh styling CSS (Dark Theme Figma, Poppins Font, 225px Sidebar)
├── app.js                 # [UTAMA] Logika aplikasi: State, Router, Simulator Telemetri, Dual Chart SVG
├── start_zentra.bat       # Script 1-klik untuk membuka dashboard di browser
├── SPECIFICATION.md       # Spesifikasi teknis sistem, standar ISO 10816, & rincian UI
├── STRUKTUR_SISTEM.md     # Penjelasan detail arsitektur sistem, data schema, & integrasi IoT
├── .gitignore             # Mencegah node_modules, .venv, dan cache terupload ke GitHub
│
├── images/                # Aset visual resmi sistem
│   ├── logo-zentra.png        # Logo 3D ZENTRA (latar transparan)
│   ├── spindle-horizontal.png # CAD 3D Spindle horisontal (Spindle Diagnostic & Pin N1/N2)
│   └── spindle-cutaway.png    # CAD 3D Spindle potongan vertikal (Service Log)
│
├── backend/               # Kode backend & firmware hardware
│   ├── main.py                # Server FastAPI WebSocket & Telemetry Ingestion
│   ├── requirements.txt       # Daftar pustaka Python (FastAPI, NumPy, SciPy, Pandas)
│   ├── ai/                    # Model machine learning / BiLSTM classifier
│   ├── core/                  # Pemrosesan sinyal getaran (FFT, RMS, Windowing)
│   ├── services/              # Logika diagnosa dan kalkulasi health index
│   └── esp32_firmware/        # Source code Arduino / ESP32-S3 transmitter (ADXL345 + PT100)
│
└── frontend/              # Source code versi Next.js (alternatif modular berbasis React)
    ├── package.json           # Dependensi Node.js
    └── src/                   # Komponen React, hooks, dan halaman Next.js
```

---

## 🎨 Spesifikasi Desain & Antarmuka (Figma Standard)

- **Font**: 100% menggunakan font **Poppins** (Google Fonts).
- **Ukuran Judul Halaman**: **24px** (Figma Size 24, SemiBold 600) untuk *Overview*, *Spindle Diagnostic*, *Device Registry*, *Service Log*, dan *Shift Reports*.
- **Sidebar Kiri**: Lebar presisi **225px** dengan 5 menu terstruktur.
- **Warna Utama**:
  - Background Canvas: `#000000` (Deep Black)
  - Frame / Container: `#0a0d14` (radius 24px)
  - Card: `#121622` (radius 14–16px)
  - Batas Bahaya Outer Race: `#dc2626` (Red border)
  - High Urgency Banner: `rgba(67, 20, 7, 0.45)` ber-border `#ea580c`

---

## 🤝 Panduan Kolaborasi Tim (Git Workflow)

Biar kodingan tetap sinkron dan tidak bentrok (*conflict*):

1. **Selalu tarik perubahan terbaru sebelum mulai ngoding:**
   ```bash
   git pull origin main
   ```
2. **Buat branch baru untuk fitur yang sedang dikerjakan:**
   ```bash
   git checkout -b fitur-nama-kamu
   ```
3. **Commit perubahan dengan pesan yang jelas:**
   ```bash
   git add .
   git commit -m "feat: perbaiki tampilan grafik di halaman detail"
   ```
4. **Push ke GitHub & lakukan Pull Request:**
   ```bash
   git push origin fitur-nama-kamu
   ```

---

## 👥 Tim Pengembang

**Tim Kata Budi "Pengen Jadi Mapres"**  
Fakultas Teknik — Universitas Negeri Yogyakarta (UNY)  
*Kolaborasi Riset Terapan Smart Manufacturing bersama PT YPTI (2026).*
