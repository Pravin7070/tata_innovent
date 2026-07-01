import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of our mock state
export type TerrainType = 'Road' | 'Mud' | 'Gravel' | 'Stone' | 'Bush' | 'Water' | 'Slope' | 'Pothole';
export type DriveModeType = '4WD' | '2WD' | 'AWD';
export type RideHeightType = 'Standard' | 'Raised' | 'Low';
export type SpeedType = 'Stop' | 'Slow' | 'Medium' | 'Fast' | 'Reverse';
export type SteeringType = 'Straight' | 'Left' | 'Right';

export interface CommandState {
  terrain: TerrainType;
  drive_mode: DriveModeType;
  ride_height: RideHeightType;
  speed: SpeedType;
  steering: SteeringType;
}

export interface SystemHealth {
  fps: number;
  latency: number;
  cpu: number;
  ram: number;
  temp: number;
  ping: number;
  battery: number;
  backendConnected: boolean;
  wsConnected: boolean;
  yoloStatus: 'Active' | 'Inactive';
}

export interface DetectionEvent {
  id: string;
  time: string;
  terrain: string;
  confidence: number;
  command: string;
  status: 'Executed' | 'Pending' | 'Failed';
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
}

interface SimulationContextProps {
  command: CommandState;
  health: SystemHealth;
  history: DetectionEvent[];
  notifications: Notification[];
  cameraMode: string;
  lastJsonSent: string;
  
  // Actions
  setCommand: (cmd: Partial<CommandState>) => void;
  sendJsonPayload: (payload: any) => void;
  setCameraMode: (mode: string) => void;
  addNotification: (message: string, type?: Notification['type']) => void;
  clearHistory: () => void;
}

const defaultCommand: CommandState = {
  terrain: 'Road',
  drive_mode: '4WD',
  ride_height: 'Standard',
  speed: 'Stop',
  steering: 'Straight',
};

const SimulationContext = createContext<SimulationContextProps | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [command, setCommandState] = useState<CommandState>(defaultCommand);
  const [cameraMode, setCameraMode] = useState('Chase');
  const [history, setHistory] = useState<DetectionEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastJsonSent, setLastJsonSent] = useState<string>('{}');

  const [health, setHealth] = useState<SystemHealth>({
    fps: 60,
    latency: 12,
    cpu: 34,
    ram: 45,
    temp: 34.6,
    ping: 24,
    battery: 88,
    backendConnected: true,
    wsConnected: true,
    yoloStatus: 'Active'
  });

  // Mock health fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(prev => ({
        ...prev,
        fps: Math.max(30, Math.min(144, prev.fps + (Math.random() * 4 - 2))),
        cpu: Math.max(10, Math.min(100, prev.cpu + (Math.random() * 6 - 3))),
        ram: Math.max(20, Math.min(90, prev.ram + (Math.random() * 2 - 1))),
        temp: Math.max(25, Math.min(80, prev.temp + (Math.random() * 1 - 0.5))),
        ping: Math.max(10, Math.min(100, prev.ping + (Math.random() * 4 - 2))),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const newNotif = { id: Math.random().toString(), message, type, time: new Date().toLocaleTimeString() };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10)); // Keep last 10
  };

  const setCommand = (cmd: Partial<CommandState>) => {
    setCommandState(prev => ({ ...prev, ...cmd }));
  };

  const sendJsonPayload = (payload: any) => {
    const jsonStr = JSON.stringify(payload, null, 2);
    setLastJsonSent(jsonStr);
    
    // If it contains valid command fields, update state
    if (payload.terrain || payload.drive_mode || payload.ride_height || payload.speed || payload.steering) {
      setCommand(payload);
    }

    addNotification('JSON Payload Sent', 'success');
    
    // Add to history
    const newEvent: DetectionEvent = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString(),
      terrain: payload.terrain || command.terrain,
      confidence: Math.floor(Math.random() * 15 + 85), // 85-99%
      command: payload.speed || command.speed,
      status: 'Executed'
    };
    setHistory(prev => [newEvent, ...prev].slice(0, 50));
  };

  const clearHistory = () => {
    setHistory([]);
    addNotification('History Cleared', 'info');
  };

  return (
    <SimulationContext.Provider value={{
      command,
      health,
      history,
      notifications,
      cameraMode,
      lastJsonSent,
      setCommand,
      sendJsonPayload,
      setCameraMode,
      addNotification,
      clearHistory
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
