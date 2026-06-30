export const dashboardMockData = {
  video: {
    url: "https://example.com/stream",
    status: "Live",
    fps: 30,
    resolution: "1080p",
    source: "Front Bumper Cam"
  },
  terrain: {
    type: "Rocky",
    confidence: 87,
    friction: 0.45,
    incline: 12
  },
  driveMode: {
    currentMode: "Off-Road Plus",
    activeAssist: ["Diff Lock", "Hill Descent"]
  },
  suspension: {
    frontLeft: 65, // mm travel
    frontRight: 62,
    rearLeft: 70,
    rearRight: 68,
    mode: "Raised",
    status: "Active"
  },
  severity: {
    level: "High",
    score: 8.5,
    maxScore: 10
  },
  vehicleStatus: {
    speed: 45,
    rpm: 2500,
    gear: "3",
    battery: 84,
    temp: 92
  },
  commands: [
    { id: 1, time: "10:42:15", command: "ENGAGE_DIFF_LOCK", status: "Success" },
    { id: 2, time: "10:41:02", command: "SUSPENSION_RAISE", status: "Success" },
    { id: 3, time: "10:35:19", command: "MODE_SWITCH_OFFROAD", status: "Success" }
  ],
  alerts: [
    { id: 1, time: "10:44:00", type: "Warning", message: "High tire slip detected on FL" },
    { id: 2, time: "10:38:22", type: "Info", message: "Approaching steep incline" }
  ],
  overview: {
    vin: "TATA1234567890XYZ",
    model: "Safari Dark Edition",
    firmware: "v2.4.1-beta",
    uptime: "14h 22m"
  },
  apiStatus: {
    latency: "24ms",
    status: "Healthy",
    requests: 1245
  },
  connectionStatus: {
    signal: "Strong",
    network: "5G",
    packetLoss: "0.01%"
  }
};
