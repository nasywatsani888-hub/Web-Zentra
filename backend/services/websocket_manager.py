from fastapi import WebSocket
from typing import List
import json

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[WebSocket] Klien baru terhubung. Total klien: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"[WebSocket] Klien terputus. Sisa klien: {len(self.active_connections)}")

    async def broadcast(self, data: dict):
        message = json.dumps(data)
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception as e:
                print(f"[WebSocket] Error kirim data: {e}")
                self.disconnect(connection)
