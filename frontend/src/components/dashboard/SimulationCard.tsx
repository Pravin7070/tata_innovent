import { useRef } from 'react';
import { Box, Maximize2, Play } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';

export interface SimulationCardProps {
  status: string;
  suspension: string;
  driveMode: string;
  terrain: string;
  severity: string;
  animation?: string;
}

const VehicleModel = ({ suspension, severity, animation = 'normal' }: { suspension: string, severity: string, animation?: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const targetY = suspension === 'MAXIMUM' ? 1.5 : (suspension === 'HIGH' ? 1.0 : (suspension === 'MEDIUM' ? 0.7 : 0.5));
  const shakeIntensity = severity === 'Critical' ? 0.1 : (severity === 'High' ? 0.05 : (severity === 'Medium' ? 0.02 : 0));

  useFrame((state) => {
    if (groupRef.current) {
      // Smoothly interpolate to target height
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
      
      // Add simulated vibration/shaking based on severity
      if (shakeIntensity > 0) {
        groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 20) * shakeIntensity;
        groupRef.current.position.z = Math.cos(state.clock.elapsedTime * 25) * shakeIntensity;
      } else {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.1);
      }
      
      // Special animations
      if (animation === 'lift_front') {
         groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.2, 0.1);
      } else if (animation === 'medium_bounce') {
         groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 15) * 0.03;
         groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      } else {
         groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Chassis */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial color="#00B4D8" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 1.0, -0.5]}>
        <boxGeometry args={[1.8, 0.6, 2]} />
        <meshStandardMaterial color="#0b0f19" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[-1.2, 0, 1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#39FF14" />
      </mesh>
      <mesh position={[1.2, 0, 1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#39FF14" />
      </mesh>
      <mesh position={[-1.2, 0, -1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#39FF14" />
      </mesh>
      <mesh position={[1.2, 0, -1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#39FF14" />
      </mesh>
    </group>
  );
};

export const SimulationCard = ({ status, suspension, driveMode, terrain, severity }: SimulationCardProps) => (
  <BaseCard title="DIGITAL TWIN" icon={Box} className="h-full flex flex-col">
    {/* Top: Simulation Status */}
    <div className="flex items-center gap-2 mb-4 text-xs tracking-wider uppercase font-mono mt-2">
      <span className="w-2 h-2 rounded-full bg-automotive-green animate-pulse"></span>
      <span className="text-automotive-green font-bold">{status}</span>
    </div>

    {/* Center: Large simulation viewport */}
    <div className="flex-1 bg-automotive-black rounded-lg border border-automotive-gray/30 relative flex flex-col min-h-[200px] overflow-hidden">
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <color attach="background" args={['#050810']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        
        <VehicleModel suspension={suspension} severity={severity} />
        
        <Grid 
          renderOrder={-1} 
          position={[0, 0, 0]} 
          infiniteGrid 
          cellSize={1} 
          cellThickness={0.5} 
          sectionSize={3} 
          sectionThickness={1} 
          sectionColor="#00b4d8" 
          cellColor="#00667a"
          fadeDistance={30} 
        />
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2 - 0.05} />
      </Canvas>
      
      {/* Centered label */}
      <div className="absolute top-2 left-2 z-10 bg-black/50 px-2 py-1 rounded text-automotive-gray text-[10px] uppercase tracking-widest font-mono font-bold">
        3D Simulation Preview
      </div>
    </div>

    {/* Bottom: Vehicle State */}
    <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider font-mono">
      <div className="bg-automotive-dark p-2 rounded border border-automotive-gray/20">
        <div className="text-automotive-gray/60 mb-1">Suspension</div>
        <div className="text-automotive-blue font-bold">{suspension}</div>
      </div>
      <div className="bg-automotive-dark p-2 rounded border border-automotive-gray/20">
        <div className="text-automotive-gray/60 mb-1">Drive Mode</div>
        <div className="text-automotive-blue font-bold">{driveMode}</div>
      </div>
      <div className="bg-automotive-dark p-2 rounded border border-automotive-gray/20">
        <div className="text-automotive-gray/60 mb-1">Terrain</div>
        <div className="text-automotive-blue font-bold">{terrain}</div>
      </div>
      <div className="bg-automotive-dark p-2 rounded border border-automotive-gray/20">
        <div className="text-automotive-gray/60 mb-1">Severity</div>
        <div className="text-automotive-blue font-bold">{severity}</div>
      </div>
    </div>

    {/* Bottom Buttons */}
    <div className="mt-4 flex gap-3">
      <button className="flex-1 flex items-center justify-center gap-2 bg-automotive-dark hover:bg-automotive-gray/20 text-automotive-white border border-automotive-gray/30 py-2.5 rounded text-xs tracking-widest uppercase transition-colors font-bold">
        <Play className="w-3 h-3" /> Open Simulation
      </button>
      <button className="bg-automotive-dark hover:bg-automotive-gray/20 text-automotive-white border border-automotive-gray/30 p-2.5 rounded transition-colors">
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  </BaseCard>
);
