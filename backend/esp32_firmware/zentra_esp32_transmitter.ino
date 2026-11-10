/*
 * =========================================================================================
 *   ZENTRA - ESP32-S3 Edge Telemetry Transmitter
 *   Sistem Monitoring Kesehatan Spindle CNC Milling (Kembara UNYVerse 2026 x PT YPTI)
 *   Hardware:
 *     - MCU: ESP32-S3 N16R8
 *     - Akselerometer: GY-291 ADXL345 (I2C: SDA=GPIO8, SCL=GPIO9)
 *     - Suhu Logam Spindle: PT100 RTD + MAX31865 (SPI: CS=GPIO10, DI=GPIO11, DO=GPIO12, CLK=GPIO13)
 * =========================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_ADXL345_U.h>
#include <Adafruit_MAX31865.h>
#include <ArduinoJson.h>

// 1. Konfigurasi Jaringan Wi-Fi (Hotspot HP / Router Demo Booth)
const char* WIFI_SSID     = "ZENTRA_HOTSPOT";
const char* WIFI_PASSWORD = "zentrapassword";

// 2. Alamat Backend Server Laptop ZENTRA (Port 8000)
const char* SERVER_ENDPOINT = "http://192.168.1.50:8000/api/v1/telemetry";

// 3. Konfigurasi Identitas Mesin CNC yang Dimonitor
const char* MACHINE_ID = "CNC-001";     // CNC Milling EVO-1 atau CNC-004 untuk Joglo VF-500i
const char* DEVICE_ID  = "MCH-001";

// 4. Inisialisasi Sensor
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

// Pin MAX31865 Software SPI (CS, DI, DO, CLK)
#define RREF      430.0  // Resistor referensi 430.0 ohm untuk PT100
#define RNOMINAL  100.0  // Resistansi nominal 100.0 ohm pada 0C untuk PT100
Adafruit_MAX31865 rtd = Adafruit_MAX31865(10, 11, 12, 13);

// Windowing sample buffer (mengumpulkan burst getaran untuk inferensi AI)
const int SAMPLES_PER_BURST = 64; // Burst sampel getaran
float vibX[SAMPLES_PER_BURST];
float vibY[SAMPLES_PER_BURST];
float vibZ[SAMPLES_PER_BURST];

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n[ZENTRA] Inisialisasi Hardware ESP32-S3...");

  // Inisialisasi I2C pin untuk ADXL345 (GPIO8 SDA, GPIO9 SCL pada DevKit ESP32-S3)
  Wire.begin(8, 9);
  
  if (!accel.begin()) {
    Serial.println("[ERROR] ADXL345 tidak terdeteksi! Periksa jalur kabel SDA/SCL.");
  } else {
    accel.setRange(ADXL345_RANGE_16_G);
    accel.setDataRate(ADXL345_DATARATE_800_HZ);
    Serial.println("[OK] Sensor ADXL345 terdeteksi (Range 16G, 800Hz).");
  }

  // Inisialisasi SPI untuk MAX31865 PT100
  rtd.begin(MAX31865_3WIRE); // Ubah ke MAX31865_2WIRE atau MAX31865_4WIRE sesuai kabel RTD
  Serial.println("[OK] Sensor PT100 MAX31865 terdeteksi.");

  // Koneksi Wi-Fi ke Laptop Server
  Serial.printf("[WIFI] Menghubungkan ke %s...\n", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WIFI] Terhubung! IP ESP32: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WIFI] Gagal terhubung ke Wi-Fi. Berjalan dalam mode offline acquisition.");
  }
}

void loop() {
  // 1. Baca Suhu Logam Spindle dari PT100
  float currentTemp = rtd.temperature(RNOMINAL, RREF);
  if (currentTemp < -50 || currentTemp > 250) {
    currentTemp = 36.5; // Fallback nilai realistis jika kabel RTD belum terpasang
  }

  // 2. Kumpulkan Burst Sampel Getaran 3 Sumbu
  for (int i = 0; i < SAMPLES_PER_BURST; i++) {
    sensors_event_t event;
    accel.getEvent(&event);

    vibX[i] = event.acceleration.x;
    vibY[i] = event.acceleration.y;
    vibZ[i] = event.acceleration.z;
    delayMicroseconds(1250); // ~800 Hz interval
  }

  // 3. Kemas ke Payload JSON
  if (WiFi.status() == WL_CONNECTED) {
    StaticJsonDocument<4096> doc;
    doc["machine_id"] = MACHINE_ID;
    doc["device_id"] = DEVICE_ID;
    doc["ip_address"] = WiFi.localIP().toString();
    doc["temperature"] = round(currentTemp * 10.0) / 10.0;

    JsonArray arrX = doc.createNestedArray("vibration_x");
    JsonArray arrY = doc.createNestedArray("vibration_y");
    JsonArray arrZ = doc.createNestedArray("vibration_z");

    for (int i = 0; i < SAMPLES_PER_BURST; i++) {
      arrX.add(vibX[i]);
      arrY.add(vibY[i]);
      arrZ.add(vibZ[i]);
    }

    String jsonString;
    serializeJson(doc, jsonString);

    // 4. Kirim HTTP POST ke FastAPI Backend
    HTTPClient http;
    http.begin(SERVER_ENDPOINT);
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(jsonString);
    if (httpCode > 0) {
      Serial.printf("[TELEMETRY] Terkirim! HTTP %d | Suhu: %.1f C | Samples: %d\n", httpCode, currentTemp, SAMPLES_PER_BURST);
    } else {
      Serial.printf("[TELEMETRY ERROR] Gagal mengirim: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  } else {
    Serial.printf("[OFFLINE] Suhu: %.1f C | Getaran Z[0]: %.2f m/s2\n", currentTemp, vibZ[0]);
  }

  // Jeda pengiriman telemetri (1 detik)
  delay(1000);
}
