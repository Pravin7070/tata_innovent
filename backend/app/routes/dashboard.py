from fastapi import APIRouter
import json
import os
import random

router = APIRouter()

# Define the mock data structure locally as a base
DASHBOARD_BASE = {
  "video": {
    "url": "https://example.com/stream",
    "status": "Live",
    "fps": 30,
    "resolution": "1080p",
    "source": "Front Bumper Cam"
  },
  "terrain": {
    "type": "Rocky",
    "confidence": 87,
    "friction": 0.45,
    "incline": 12
  },
  "driveMode": {
    "currentMode": "Off-Road Plus",
    "activeAssist": ["Diff Lock", "Hill Descent"]
  },
  "suspension": {
    "frontLeft": 65,
    "frontRight": 62,
    "rearLeft": 70,
    "rearRight": 68,
    "mode": "Raised",
    "status": "Active"
  },
  "severity": {
    "level": "High",
    "score": 8.5,
    "maxScore": 10
  },
  "vehicleStatus": {
    "speed": 45,
    "rpm": 2500,
    "gear": "3",
    "battery": 84,
    "temp": 92
  },
  "commands": [
    { "id": 1, "time": "10:42:15", "command": "ENGAGE_DIFF_LOCK", "status": "Success" },
    { "id": 2, "time": "10:41:02", "command": "SUSPENSION_RAISE", "status": "Success" },
    { "id": 3, "time": "10:35:19", "command": "MODE_SWITCH_OFFROAD", "status": "Success" }
  ],
  "alerts": [
    { "id": 1, "time": "10:44:00", "type": "Warning", "message": "High tire slip detected on FL" },
    { "id": 2, "time": "10:38:22", "type": "Info", "message": "Approaching steep incline" }
  ],
  "overview": {
    "vin": "TATA1234567890XYZ",
    "model": "Safari Dark Edition",
    "firmware": "v2.4.1-beta",
    "uptime": "14h 22m"
  },
  "apiStatus": {
    "latency": "24ms",
    "status": "Healthy",
    "requests": 1245
  },
  "connectionStatus": {
    "signal": "Strong",
    "network": "5G",
    "packetLoss": "0.01%"
  }
}

@router.get("/dashboard", tags=["Dashboard"])
async def get_dashboard():
    """
    Returns the aggregated dashboard data.
    Attempts to merge with real analytics data if available.
    """
    data = DASHBOARD_BASE.copy()
    
    # Try to read analytics metrics summary
    metrics_path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), "..", "..", "..", "analytics", "output", "metrics_summary.json"
    ))
    
    if os.path.exists(metrics_path):
        try:
            with open(metrics_path, 'r') as f:
                metrics = json.load(f)
                
            # Update data based on metrics
            data["terrain"]["type"] = metrics.get("most_common_terrain", data["terrain"]["type"])
            data["terrain"]["confidence"] = int(metrics.get("avg_confidence", 0.87) * 100)
            data["severity"]["score"] = round(metrics.get("avg_severity", 0.5) * 10, 1)
            data["driveMode"]["currentMode"] = metrics.get("most_used_drive_mode", data["driveMode"]["currentMode"])
            
            # Simulate slight data variance so frontend looks alive
            data["vehicleStatus"]["speed"] += random.randint(-2, 2)
            data["vehicleStatus"]["rpm"] += random.randint(-50, 50)
            
        except Exception as e:
            print(f"Failed to read metrics: {e}")
            
    return data
