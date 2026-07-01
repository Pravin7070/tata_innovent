import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

import { Rover } from './components/Rover';
import { Terrain } from './components/Terrain';
import { Controls } from './components/Controls';

// Camera transition director
const CameraHandler = ({ mode }: { mode: string }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 5, 8));
  const targetLook = useRef(new THREE.Vector3(0, 0.4, 0));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    switch (mode) {
      case 'Chase':
        // Behind the rover (looking forward in positive Z direction)
        targetPos.current.set(0, 2.2, -4.8);
        targetLook.current.set(0, 0.35, 1.8);
        break;
      case 'POV':
        // Sits on the front nose cone looking forward
        targetPos.current.set(0, 0.72, 1.0);
        targetLook.current.set(0, 0.62, 7.0);
        break;
      case 'Suspension':
        // Zooms in on the front left suspension arms
        targetPos.current.set(1.9, 0.28, 0.7);
        targetLook.current.set(0.85, 0, 0.9);
        break;
      case 'Orbit':
      default:
        // Free control, do not override
        return;
    }

    // Smoothly lerp camera position
    camera.position.lerp(targetPos.current, dt * 4.5);
    
    // Smoothly slerp camera rotation to face targetLook point
    const dummy = new THREE.Object3D();
    dummy.position.copy(camera.position);
    dummy.lookAt(targetLook.current);
    camera.quaternion.slerp(dummy.quaternion, dt * 5.0);
  });

  return null;
};

export default function App() {
  // Telemetry Command State
  const [command, setCommand] = useState({
    terrain: 'Road',
    drive_mode: '4WD',
    ride_height: 'Standard',
    speed: 'Stop',
    steering: 'Straight'
  });

  // UI States
  const [cameraMode, setCameraMode] = useState('Chase');
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [logs, setLogs] = useState<string[]>([]);
  const [showFooter, setShowFooter] = useState(false);

  // Add line to console and HUD log
  const addLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${text}`);
    setLogs(prev => [`[${timestamp}] ${text}`, ...prev].slice(0, 50));
  };

  const clearLogs = () => setLogs([]);

  // Command sender (simulates receiving a command from backend)
  const sendCommand = (cmd: typeof command) => {
    setCommand(cmd);
    addLog(`Simulated Inbound Packet: ${JSON.stringify(cmd)}`);
  };

  // 1. WebSocket Client Hook (receives JSON from backend ws://localhost:8000/live)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: any = null;

    const connect = () => {
      setWsStatus('connecting');
      addLog('Connecting to backend WebSocket (ws://localhost:8000/live)...');
      
      ws = new WebSocket('ws://localhost:8000/live');

      ws.onopen = () => {
        setWsStatus('connected');
        addLog('WebSocket link activated. Direct control stream established.');
      };

      ws.onmessage = (event) => {
        try {
          let msg = event.data;
          // FastAPI manager sends echoing confirmation "You wrote: ...". Strip it to get raw JSON
          if (msg.startsWith('You wrote: ')) {
            msg = msg.replace('You wrote: ', '');
          }

          const parsed = JSON.parse(msg);
          
          // Verify fields belong to target rover JSON telemetry schema
          if (parsed.terrain || parsed.drive_mode || parsed.ride_height || parsed.speed || parsed.steering) {
            setCommand(prev => ({ ...prev, ...parsed }));
            addLog(`WebSocket Telemetry packet: ${JSON.stringify(parsed)}`);
          }
        } catch (err) {
          // Standard text message or ping
          if (event.data !== 'connected') {
            addLog(`WS Message: ${event.data}`);
          }
        }
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
        addLog('WebSocket link severed. Retrying in 5 seconds...');
        reconnectTimer = setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        setWsStatus('disconnected');
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, []);

  // 2. Window Message Listener (for embedding inside iframes)
  useEffect(() => {
    const handleWindowMsg = (e: MessageEvent) => {
      try {
        const payload = e.data;
        if (payload && typeof payload === 'object') {
          // Accept direct commands or standard object types
          if (payload.terrain || payload.drive_mode || payload.ride_height || payload.speed || payload.steering) {
            setCommand(prev => ({ ...prev, ...payload }));
            addLog(`Window Message Telemetry: ${JSON.stringify(payload)}`);
          } else if (payload.type === 'ROVER_COMMAND' && payload.command) {
            setCommand(prev => ({ ...prev, ...payload.command }));
            addLog(`Window Message Payload: ${JSON.stringify(payload.command)}`);
          }
        }
      } catch (err) {
        console.error('Error handling postMessage payload:', err);
      }
    };

    window.addEventListener('message', handleWindowMsg);
    addLog('Simulation system initialized. Awaiting backend telemetry packets...');

    return () => {
      window.removeEventListener('message', handleWindowMsg);
    };
  }, []);

  return (
    <div className="w-full h-full relative grid-dots">
      
      {/* 3D RENDER VIEWPORT */}
      <div className="sim-viewport">
        <Canvas 
          shadows 
          camera={{ position: [0, 5, 8], fov: 45 }}
          style={{ background: '#050608' }}
        >
          {/* Rapier Physics World */}
          <Physics gravity={[0, -9.81, 0]}>
            
            {/* Infinite scrolling active terrain environment */}
            <Terrain 
              terrain={command.terrain} 
              speed={command.speed} 
            />

            {/* AI Terrain Rover Dynamic Mesh Model */}
            <Rover 
              driveMode={command.drive_mode}
              rideHeight={command.ride_height}
              speed={command.speed}
              steering={command.steering}
              terrain={command.terrain}
            />

            {/* Static invisible physics ground box for Rapier collision validation */}
            <RigidBody type="fixed" colliders="cuboid">
              <mesh position={[0, -0.5, 0]} visible={false}>
                <boxGeometry args={[20, 0.1, 80]} />
                <meshBasicMaterial color="red" />
              </mesh>
            </RigidBody>

          </Physics>

          {/* Orbit controls enabled only in Orbit mode */}
          {cameraMode === 'Orbit' && <OrbitControls maxPolarAngle={Math.PI / 2 - 0.05} />}

          {/* Custom Camera handler */}
          <CameraHandler mode={cameraMode} />
          
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>

        </Canvas>
      </div>

      {/* INTERACTIVE HUD SYSTEM LAYER */}
      <Controls 
        currentCommand={command}
        onSendCommand={sendCommand}
        cameraMode={cameraMode}
        onChangeCamera={setCameraMode}
        wsStatus={wsStatus}
        showFooter={showFooter}
        onToggleFooter={() => setShowFooter(!showFooter)}
        logs={logs}
        onClearLogs={clearLogs}
      />

    </div>
  );
}
