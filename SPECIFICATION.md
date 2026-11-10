# ZENTRA: Sistem Early Detection dan Diagnosa Kerusakan Komponen Bearing Mesin CNC
> **Dokumen Spesifikasi Teknis, Desain Antarmuka (UI/UX Figma), & Arsitektur Sistem**  
> **Kompetisi**: Kembara UNYVerse 2026 — Sub-Tema Smart Manufacturing (Mitra Industri: PT Yogya Presisi Tehnikatama Industri / PT YPTI)  
> **Tim**: Kata Budi "Pengen Jadi Mapres" — Universitas Negeri Yogyakarta (UNY)  
> **Versi Dokumen**: 2.2 (Revisi Desain Figma, Tipografi Poppins, & Standalone Architecture)

---

## 1. Ringkasan Eksekutif & Desain Visual Resmi

Sistem **ZENTRA** (*Zero-downtime Predictive Maintenance for Spindle Bearings*) dikembangkan sebagai solusi *smart condition monitoring* berbasis IoT dan kecerdasan buatan (AI) untuk mendeteksi anomali bearing spindle CNC secara dini, mencegah *catastrophic failure*, serta meminimalkan *unplanned downtime* pada lini produksi presisi tinggi PT YPTI.

### Karakteristik Visual & Desain Antarmuka (Presisi Figma):
1. **Identitas Merek Resmi (Official Brand Identity)**:
   - **Logo 3D ZENTRA (`logo-zentra.png`)**: Logo pita ribbon 3D biru-cyan dengan aksen waveform getaran hijau-mint di tengah dan teks "ZENTRA", berlatar belakang transparan (alpha channel) di pojok kiri atas sidebar.
2. **Tipografi Terstandarisasi (Typography System)**:
   - **Font Family Utama**: **Poppins** (Google Fonts, bobot 300, 400, 500, 600, 700, 800) diterapkan 100% pada seluruh teks, angka, tombol, form input, tabel, SVG sparklines, dan canvas chart.
   - **Ukuran Judul Halaman (Page Titles)**: Menggunakan ukuran **24px (Figma Size 24, SemiBold 600)** untuk semua 5 tampilan utama (*Overview*, *Spindle Diagnostic*, *Device Registry*, *Service Log*, dan *Shift Reports*).
3. **Sidebar Navigasi (Left Sidebar)**:
   - Lebar presisi **`225px`** dengan sudut membulat `border-radius: 24px` dan latar belakang `#0a0d14`.
   - Terdiri dari **5 menu navigasi terstruktur**:
     1. `Overview` (Ikon Grid)
     2. `Spindle Diagnostic` (Ikon Bearing Spindle)
     3. `Device Registry` (Ikon List & Status ID)
     4. `Service Log` (Ikon Dokumen Pemeliharaan)
     5. `Shift Reports` (Ikon Laporan)
4. **Palet Warna Industrial Dark Mode (Figma Gambar 1)**:
   - **Canvas / Body**: `#000000` (Pure Deep Black).
   - **Frames (Sidebar & Main Container)**: `#0a0d14` dengan border halus `rgba(255, 255, 255, 0.08)`.
   - **Cards (Stat Cards & Machine Cards)**: `#121622` (Industrial Dark Navy) dengan border `rgba(255, 255, 255, 0.07)`.
   - **Outer Race Fault Alert (Card EVO-1)**: Border merah menyala `#dc2626` dan glow hazard.
   - **High Urgency Banner**: Radial/linear gelap `rgba(67, 20, 7, 0.45)` dengan aksen oranye `#ea580c` dan tombol *Resolve* oranye solid.
5. **Aset Visual 3D Spindle**:
   - **Foto 3D Spindle Horisontal (`spindle-horizontal.png`)**: Diterapkan pada *Spindle Diagnostic*, *Machine Detail* (pin penunjuk `N1 Rear Bearing` biru dan `N2 Front Bearing` oranye), serta *Add Machine*.
   - **Foto 3D Spindle Potongan Vertikal (`spindle-cutaway.png`)**: Diterapkan pada kartu *Service Log* (*Recommended Maintenance*), memperlihatkan bola bearing bagian depan bawah dengan efek pendar merah menyala (*pulsing glow hotspot*).

---

## 2. Arsitektur Sistem Menyeluruh (End-to-End)

```mermaid
flowchart TD
    subgraph HW["1. Hardware Prototipe (CNC Spindle Housing)"]
        S_VIB["Sensor Getaran: GY-291 ADXL345 (3-Axis X, Y, Z)"] --> ESP["ESP32-S3 N16R8 Microcontroller"]
        S_TMP["Sensor Suhu: PT100 RTD + MAX31865 (SPI)"] --> ESP
    end

    subgraph NET["2. Jaringan Industri On-Premise / LAN (100% Offline Capable)"]
        ESP -- "Wi-Fi LAN / Hotspot (HTTP / WebSocket Telemetry)" --> SRV["Server / Laptop Monitoring"]
    end

    subgraph ENGINE["3. Engine Telemetri & Kecerdasan Buatan (Dual-Mode)"]
        SRV --> RUN_MODE{"Mode Operasional"}
        
        RUN_MODE -- "Mode Standalone (Zero Dependency)" --> CLIENT_ENG["Client Simulation & Processing Engine (app.js)\n- Ticker Telemetri Live 1.5 Detik\n- Evaluasi ISO 10816 (2.80 mm/s) & Suhu (45°C)\n- Perhitungan Health Index & FFT Spektrum\n- Dynamic Priority Float-to-Top\n- Ekspor CSV Riil"]
        
        RUN_MODE -- "Mode Backend Server" --> FASTAPI["FastAPI Telemetry Ingestion (Python)"]
        FASTAPI --> SIGNAL["Signal Processor (FFT, RMS Sumbu X/Y/Z, 784 Sampel)"]
        SIGNAL --> AI["Deep Learning BiLSTM (ai-model-1.0.pt)"]
        AI --> EVAL["Evaluasi Diagnosa 3 Kelas Sesuai Dataset SUBF"]
    end

    subgraph UI["4. Frontend Dashboard (Zero Dependency Standalone)"]
        CLIENT_ENG --> VIEW["Antarmuka ZENTRA Dashboard (index.html, styles.css, app.js)"]
        FASTAPI -.-> VIEW
        
        VIEW --> P1["Overview (2x2 Dual Line Sparklines + Dynamic Float-to-Top)"]
        VIEW --> P2["Spindle Diagnostic (3D Horisontal + Glowing Hazard Pin)"]
        VIEW --> P3["Device Registry (Pencarian Responsif + Tabel IoT Status)"]
        VIEW --> P4["Service Log (3D Cutaway + Rekomendasi Pemeliharaan)"]
        VIEW --> P5["Shift Reports (Log Riwayat + Unduh File CSV Riil)"]
        VIEW --> P6["Machine Detail (3D Spindle Pin N1/N2 + Dual Chart 24H)"]
        VIEW --> P7["Add Machine (Form Registrasi Mesin Baru)"]
    end
```

---

## 3. Komponen Hardware Prototipe

- **Mikrokontroler Utama**: ESP32-S3 N16R8 (Xtensa 32-bit Dual-Core 240 MHz, 16MB Quad SPI Flash, 8MB Octal PSRAM, Wi-Fi 802.11 b/g/n, BLE 5.0).
- **Sensor Getaran Triaksial**: GY-291 ADXL345 (Digital Triaxial Accelerometer I2C/SPI, resolusi 13-bit hingga ±16g, noise density rendah).
- **Sensor Suhu Presisi Tinggi**: Sensor PT100 RTD Kabel Tahan Minyak Panas/Coolant + Converter Modul MAX31865 (SPI Platinum RTD Amplifier 15-bit ADC).
- **Enclosure & Mounting**: Magnetic mount housing berspesifikasi industrial grade untuk penempatan langsung pada bearing casing spindle CNC milling.

---

## 4. Klasifikasi AI & Standar Evaluasi Diagnosa (Dataset SUBF)

Sistem mengadopsi 3 kelas kondisi presisi tinggi sesuai standar getaran mesin ISO 10816-3 (Group 1 Rigid: Batas Waspada/Action Limit = **2.80 mm/s**) dan batas termal bearing (**45.0 °C**):

| ID Kelas | Label Kondisi | Indikator Visual | Karakteristik Sinyal | Rekomendasi Tindakan |
| :---: | :--- | :---: | :--- | :--- |
| **0** | **Healthy / Normal** | **Hijau (`#22c55e`)** | $\text{RMS} < 1.80\text{ mm/s}$, suhu $\le 40^\circ\text{C}$, Health Index $> 90\%$. | Operasi normal; pemantauan berkala shift reguler. |
| **1** | **Inner Race Fault (FIR)** | **Kuning / Amber (`#f59e0b`)** | Frekuensi cacat cincin dalam (BPFI 218 Hz), $\text{RMS} = 1.80 - 2.80\text{ mm/s}$, Health Index $70 - 89\%$. | **Peringatan (Medium)**: Jadwalkan inspeksi pelumasan dan clearance bantalan pada shift berikutnya. |
| **2** | **Outer Race Fault (FOR)** | **Merah (`#ef4444`)** | Frekuensi cacat cincin luar (BPFO 142 Hz), $\text{RMS} \ge 2.80\text{ mm/s}$ (melewati batas ISO), suhu $> 45^\circ\text{C}$, Health Index $< 70\%$. | **Tindakan Segera (< 4 jam)**: Hentikan beban potong berlebih, tugaskan teknisi penggantian bantalan N2. |

---

## 5. Rincian Spesifikasi Antarmuka Pengguna (5+2 Tampilan)

### 5.1. Overview (Tampilan Utama — Gambar 1 Figma)
- **Header**:
  - Judul `Overview` (Font Poppins SemiBold, ukuran **24px**).
  - Pill Jam Digital format `HH : MM : SS  WIB` dengan font monospaced Poppins.
  - Tombol aksi `+ Add Machine` (pill hitam ber-border putih).
- **High Urgency Alert Banner**:
  - Badge hazard: `⚠ HIGH URGENCY` (oranye).
  - Target mesin: `CNC Milling 01` (atau unit mesin dalam status kritis).
  - Deskripsi: *"N2 bearing vibration exceeds ISO limit (BPFO: 142 Hz). Recommended technical response: within 4 hours."*
  - Tombol interaktif: `Resolve` (oranye pekat `#ea580c`).
- **4 Kartu KPI Statistik**:
  1. `Total Machines`: Nilai **4** (atau sesuai jumlah unit terdaftar).
  2. `Normal:`: Nilai **3** (hijau/putih).
  3. `Action required:`: Nilai **1** (oranye/merah).
  4. `Average Spindle Health:`: Nilai persentase rata-rata kesehatan spindle (misal **79%**).
- **Grid Kartu Mesin CNC 2x2**:
  - Mengimplementasikan **Dynamic Priority Float-to-Top**: unit mesin berstatus *High Urgency* secara otomatis berada di posisi kiri atas.
  - Setiap kartu menampilkan:
    - Nama mesin dan pill durasi `RUN 05:42:18`.
    - **Dual Area Line Chart (SVG Sparkline)**:
      - Kiri: *TREN GETARAN RMS* dilengkapi garis putus-putus merah `ISO 2.80` dan titik nilai terkini.
      - Kanan: *TREN SUHU BANTALAN* dilengkapi garis putus-putus merah `MAX 45°C`.
      - Sumbu waktu bawah: `00`, `06`, `12`, `18`, `24`.
    - **3 Kotak Metrik**: `Vibration RMS` (mm/s), `Spindle Temp` (°C), dan `Health Index` (%).
    - Tombol navigasi cepat: `Detail Diagnostik`.

### 5.2. Spindle Diagnostic
- Judul halaman: `Spindle Diagnostic` (Poppins SemiBold, **24px**).
- 4 Kartu KPI Statistik ringkasan kondisi pabrik.
- Grid kartu diagnostik per mesin dengan pratinjau foto 3D horisontal (`spindle-horizontal.png`), animasi pendaran bahaya (*pulsing glow hotspot*), pembacaan parameter telemetri, dan tautan ke halaman detail mesin.

### 5.3. Device Registry
- Judul halaman: `Device Registry` (Poppins SemiBold, **24px**).
- Kolom pencarian dinamis (*search input*) dengan *live filtering* tanpa kehilangan fokus cursor.
- Tabel konektivitas perangkat IoT:
  - Kolom: *Machine Name*, *Device ID*, *IP Address*, *Status Koneksi* (`Connected` hijau), dan *Last Data Received*.

### 5.4. Service Log
- Judul halaman: `Service Log` (Poppins SemiBold, **24px**).
- Subjudul: *Recommended Maintenance :*.
- Kartu jadwal pemeliharaan spindle dengan visualisasi foto 3D potongan melintang vertikal (`spindle-cutaway.png`), titik kerusakan bantalan bawah menyala merah, estimasi batas waktu perbaikan (*SLA*), serta tombol penugasan `Tugaskan Teknisi`.

### 5.5. Shift Reports
- Judul halaman: `Shift Reports` (Poppins SemiBold, **24px**).
- Filter interaktif pemilihan mesin (*All Machines*) dan periode shift kerja.
- Daftar riwayat berkas *Daily Machine Reports* per shift.
- Aksi: Tombol `View` untuk modal pratinjau ringkasan dan tombol `Download` untuk mengunduh berkas `.csv` riil langsung ke komputer pengguna.

### 5.6. Machine Detail (Sub-Halaman)
- Navigasi kembali `← Back` dan nama mesin.
- Banner deteksi anomali real-time.
- Visualisasi 3D Spindle dengan pin koordinat:
  - **Pin N1 Rear Bearing** (Biru).
  - **Pin N2 Front Bearing** (Oranye).
- Grafik 24 jam interaktif *Temperature & Vibration Monitoring* dengan garis referensi ISO.
- Speedometer digital (*Gauges*) untuk Suhu, Vibrasi N1, dan Vibrasi N2.

### 5.7. Add Machine (Form Pendaftaran)
- Navigasi kembali `← Back` dan judul *Add Machine*.
- Form pendaftaran unit baru: IP Address, Nama Mesin, Device ID, Axis Type (3-Axis / 5-Axis), dan Tipe Mesin (CNC Milling / Turning).
- Pratinjau 3D spindle live dan tombol simpan *Register Machine*.

---

## 6. Struktur Berkas & Panduan Menjalankan Sistem

```
Web zentra/
├── index.html             # Entry point web utama (Standalone Single-Page Architecture)
├── styles.css             # Stylesheet resmi: Dark theme Figma, Poppins font, 225px sidebar
├── app.js                 # Router, engine simulasi telemetri live, data store, SVG renderer
├── start_zentra.bat       # Launcher 1-klik untuk membuka dashboard langsung di browser default
├── SPECIFICATION.md       # Dokumen spesifikasi teknis resmi ini (v2.2)
├── STRUKTUR_SISTEM.md     # Rincian struktur data, skema objek JavaScript, & integrasi IoT
├── images/
│   ├── logo-zentra.png    # Logo 3D ZENTRA resmi (latar belakang transparan)
│   ├── spindle-horizontal.png  # Render 3D Spindle horisontal untuk diagnostik
│   └── spindle-cutaway.png     # Render 3D Spindle potongan vertikal untuk service log
└── backend/               # Kode opsional untuk integrasi server penuh (FastAPI, PyTorch, ESP32)
    ├── main.py
    └── esp32_firmware/
        └── zentra_esp32_transmitter.ino
```

### Cara Menjalankan untuk Presentasi/Demo Lomba:
1. **Mode Standalone (Direkomendasikan — Bebas Error & Dependensi)**:
   - Cukup klik ganda file [start_zentra.bat](file:///d:/KULIAH/lomba/UNYVERSE%202026/Web%20zentra/start_zentra.bat) atau buka [index.html](file:///d:/KULIAH/lomba/UNYVERSE%202026/Web%20zentra/index.html) di browser apapun (Edge, Chrome, Firefox).
   - Seluruh visualisasi, grafik sparkline, telemetri live, pemindaian fault, dan ekspor CSV langsung berjalan aktif secara lokal tanpa membutuhkan koneksi internet maupun instalasi software tambahan.
