import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from services.machine_manager import MachineManager
from services.websocket_manager import WebSocketManager

app = FastAPI(
    title="ZENTRA Smart CNC Monitoring & Fault Diagnosis API",
    description="Backend Server untuk Pemantauan Spindle Mesin CNC Berbasis AI & ISO 10816 (Kembara UNYVerse 2026)",
    version="1.0.0",
)

# Konfigurasi CORS agar frontend Next.js dapat mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

machine_manager = MachineManager()
ws_manager = WebSocketManager()

# Background task untuk streaming telemetri
async def telemetry_broadcaster():
    """Loop background yang memperbarui data getaran dan menyiarkan via WebSocket tiap 1.5 detik"""
    while True:
        try:
            # Perbarui kondisi simulasi
            machine_manager.tick_simulation()
            
            # Siapkan payload telemetri
            payload = {
                "type": "TELEMETRY_UPDATE",
                "timestamp": asyncio.get_event_loop().time(),
                "machines": machine_manager.get_priority_sorted_machines(),
                "mode": machine_manager.mode,
            }
            
            # Broadcast ke seluruh browser web yang terhubung
            await ws_manager.broadcast(payload)
        except Exception as e:
            print(f"[Broadcaster Error] {e}")
            
        await asyncio.sleep(1.5)

@app.on_event("startup")
async def startup_event():
    print("[ZENTRA Server] Memulai backend server dan background telemetri loop...")
    asyncio.create_task(telemetry_broadcaster())

@app.get("/")
def read_root():
    return {
        "system": "ZENTRA Smart CNC Diagnostics",
        "competition": "Kembara UNYVerse 2026",
        "partner": "PT Yogya Presisi Tehnikatama Industri (YPTI)",
        "status": "Online",
        "mode": machine_manager.mode,
        "classes": ["HEALTHY", "INNER_RACE_FAULT", "OUTER_RACE_FAULT"],
    }

@app.get("/api/v1/machines")
def get_machines():
    """Mengembalikan daftar seluruh mesin dengan urutan prioritas keparahan (Float-to-top)"""
    return {
        "status": "success",
        "total": len(machine_manager.machines),
        "data": machine_manager.get_priority_sorted_machines(),
    }

@app.get("/api/v1/machines/{machine_id}")
def get_machine_detail(machine_id: str):
    """Mengembalikan data detail satu mesin tertentu"""
    machine = machine_manager.get_machine_by_id(machine_id)
    if not machine:
        return {"status": "error", "message": f"Mesin {machine_id} tidak ditemukan"}
    return {"status": "success", "data": machine}

class AddMachineRequest(BaseModel):
    name: str
    ip_address: str
    device_id: str
    axis_type: str = "3-Axis"
    machine_type: str = "CNC Milling"

@app.post("/api/v1/machines")
def register_machine(req: AddMachineRequest):
    """Mendaftarkan unit mesin baru ke sistem secara live"""
    new_machine = machine_manager.add_machine(
        name=req.name,
        ip_address=req.ip_address,
        device_id=req.device_id,
        axis_type=req.axis_type,
        machine_type=req.machine_type,
    )
    return {"status": "success", "message": "Mesin berhasil didaftarkan", "data": new_machine}

# Model request dari ESP32 fisik
class ESP32TelemetryRequest(BaseModel):
    machine_id: str
    vibration_x: List[float]
    vibration_y: List[float]
    vibration_z: List[float]
    temperature: float
    device_id: Optional[str] = None
    ip_address: Optional[str] = None

@app.post("/api/v1/telemetry")
def receive_hardware_telemetry(req: ESP32TelemetryRequest):
    """
    Endpoint untuk menerima data streaming langsung dari mikrokontroler ESP32-S3 di lapangan.
    """
    machine = machine_manager.get_machine_by_id(req.machine_id)
    if not machine:
        return {"status": "error", "message": f"Mesin {req.machine_id} belum terdaftar"}

    machine["temperature"] = req.temperature
    if req.device_id:
        machine["deviceId"] = req.device_id
    if req.ip_address:
        machine["deviceIp"] = req.ip_address

    return {
        "status": "received",
        "machine_id": req.machine_id,
        "samples_received": len(req.vibration_x),
    }

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """Endpoint WebSocket untuk koneksi real-time ke web Next.js"""
    await ws_manager.connect(websocket)
    try:
        # Kirim data awal begitu terhubung
        init_payload = {
            "type": "INITIAL_STATE",
            "machines": machine_manager.get_priority_sorted_machines(),
        }
        await websocket.send_json(init_payload)
        
        while True:
            # Terima pesan dari client jika ada (misal resolve alert atau ganti mode)
            data = await websocket.receive_text()
            print(f"[WebSocket Inbound] {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        print(f"[WebSocket Exception] {e}")
        ws_manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
