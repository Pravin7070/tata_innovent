import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerrainProps {
  terrain: string;      // "Road" | "Mud" | "Stone" | "Gravel" | "Bush" | "Water" | "Slope" | "Pothole"
  speed: string;        // "Stop" | "Slow" | "Medium" | "Fast" | "Reverse"
}

interface Obstacle {
  id: number;
  x: number;
  z: number;
  scale: number;
  rotY: number;
  type: string;
}

// Particle helper class for wheel spray
class SprayParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;

  constructor(origin: THREE.Vector3, type: string) {
    this.position = origin.clone();
    
    // Random velocity spraying backwards and upwards
    const speedScale = type === 'Water' ? 3 : 2;
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.4,
      Math.random() * 1.5 + 0.5,
      -(Math.random() * speedScale + 1) // spray backwards
    );

    this.maxLife = Math.random() * 0.5 + 0.3; // seconds
    this.life = this.maxLife;
  }

  update(dt: number) {
    // Apply gravity
    this.velocity.y -= 9.8 * dt;
    this.position.addScaledVector(this.velocity, dt);
    this.life -= dt;
  }
}

export const Terrain = ({ terrain, speed }: TerrainProps) => {
  const groundRef = useRef<THREE.Mesh>(null);
  const scrollOffset = useRef(0);
  
  // Track material texture scroll offset
  const textureRef = useRef<THREE.Texture | null>(null);

  // Speed value for movement
  const speedVal = useMemo(() => {
    switch (speed) {
      case 'Slow': return 1.8;
      case 'Medium': return 4.5;
      case 'Fast': return 9.0;
      case 'Reverse': return -2.2;
      case 'Stop':
      default: return 0;
    }
  }, [speed]);

  // Materials & Colors configuration for terrains
  const terrainConfig = useMemo(() => {
    switch (terrain) {
      case 'Mud':
        return {
          color: '#4e3629',
          roughness: 0.95,
          metalness: 0.05,
          wireframe: false,
          bumpScale: 0.08,
          ambientColor: '#2b1b11'
        };
      case 'Stone':
        return {
          color: '#55585d',
          roughness: 0.85,
          metalness: 0.2,
          wireframe: false,
          bumpScale: 0.15,
          ambientColor: '#1d1e20'
        };
      case 'Gravel':
        return {
          color: '#6e6d6c',
          roughness: 0.9,
          metalness: 0.1,
          wireframe: false,
          bumpScale: 0.05,
          ambientColor: '#2d2c2b'
        };
      case 'Bush':
        return {
          color: '#2a4d2a',
          roughness: 0.9,
          metalness: 0.02,
          wireframe: false,
          bumpScale: 0.03,
          ambientColor: '#0f1f0f'
        };
      case 'Water':
        return {
          color: '#1a4c6e',
          roughness: 0.1,
          metalness: 0.9,
          wireframe: false,
          bumpScale: 0.02,
          ambientColor: '#071624'
        };
      case 'Slope':
        return {
          color: '#3d4045',
          roughness: 0.7,
          metalness: 0.3,
          wireframe: false,
          bumpScale: 0.01,
          ambientColor: '#151619'
        };
      case 'Pothole':
        return {
          color: '#343a40',
          roughness: 0.8,
          metalness: 0.1,
          wireframe: false,
          bumpScale: 0.06,
          ambientColor: '#121416'
        };
      case 'Road':
      default:
        return {
          color: '#1c1f22',
          roughness: 0.6,
          metalness: 0.25,
          wireframe: false,
          bumpScale: 0.01,
          ambientColor: '#0a0c0e'
        };
    }
  }, [terrain]);

  // Static items positions for infinite scrolling (Rocks, Bushes)
  const obstaclePositions = useMemo<Obstacle[]>(() => {
    const items: Obstacle[] = [];
    // Spawn 15 items randomly along a 50m track
    for (let i = 0; i < 15; i++) {
      items.push({
        id: i,
        x: (Math.random() - 0.5) * 5.0, // track width is ~6m
        z: Math.random() * 50 - 25,
        scale: Math.random() * 0.4 + 0.2,
        rotY: Math.random() * Math.PI,
        type: i % 2 === 0 ? 'A' : 'B' // Variants
      });
    }
    return items;
  }, []);

  const [activeObstacles, setActiveObstacles] = useState<Obstacle[]>(obstaclePositions);

  // Wheel spray particle state
  const particlesRef = useRef<SprayParticle[]>([]);
  const pointsRef = useRef<THREE.Points>(null);

  // Setup texture loader (draw procedural canvas texture to simulate ground grit/road lines)
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Background base
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 512);

    // Noise/Grit
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 512;
      const opacity = Math.random() * 0.15;
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw road markings (only visible on Road terrain)
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 8;
    ctx.setLineDash([40, 40]);
    ctx.beginPath();
    ctx.moveTo(128, 0);
    ctx.lineTo(128, 512);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    textureRef.current = tex;
    return tex;
  }, []);

  // Update textures and scrolling logic inside useFrame
  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.1);

    // 1. Calculate ground scroll
    scrollOffset.current += speedVal * dt;

    // Apply offset to texture repeat coordinates
    if (textureRef.current) {
      // Divide by length of ground plane to sync speed
      textureRef.current.offset.y = -scrollOffset.current / 40;
    }

    // Tilt the terrain plane if we are on the slope terrain
    if (groundRef.current) {
      const targetRotationX = terrain === 'Slope' ? 0.22 : 0; // ~12 degrees incline
      const targetPositionY = terrain === 'Slope' ? -0.8 : -0.45; // lower the pivot
      
      groundRef.current.rotation.x = THREE.MathUtils.lerp(groundRef.current.rotation.x, targetRotationX, dt * 4);
      groundRef.current.position.y = THREE.MathUtils.lerp(groundRef.current.position.y, targetPositionY, dt * 4);
    }

    // 2. Animate scrolling obstacles (Rocks and Bushes)
    // Update local obstacle Z coordinate relative to scrollOffset
    setActiveObstacles((prev: Obstacle[]) => {
      return prev.map((obs: Obstacle) => {
        // Translate world Z position based on scrolling speed
        let zWorld = obs.z - speedVal * dt;
        
        // Wrap-around: if obstacle goes past the rear view (-25m), reset to front (+25m)
        if (zWorld < -25) {
          zWorld = 25 + (zWorld + 25);
        } else if (zWorld > 25) {
          zWorld = -25 + (zWorld - 25);
        }

        return { ...obs, z: zWorld };
      });
    });

    // 3. Wheel Particle Spray Generation
    // Only spray if rover is moving and terrain supports particles
    const shouldSpray = speedVal !== 0 && ['Mud', 'Gravel', 'Water', 'Stone'].includes(terrain);
    
    if (shouldSpray) {
      // Spray from all 4 wheels
      // Wheel contact points in world coords roughly
      const wheelOffsets = [
        new THREE.Vector3(0.85, 0.05, 0.9),  // FL
        new THREE.Vector3(-0.85, 0.05, 0.9), // FR
        new THREE.Vector3(0.85, 0.05, -0.9), // RL
        new THREE.Vector3(-0.85, 0.05, -0.9) // RR
      ];

      // Spawn 1 particle per wheel per frame at high speeds, less at slow
      const spawnChance = speed === 'Fast' ? 0.9 : speed === 'Medium' ? 0.6 : 0.2;
      
      wheelOffsets.forEach(offset => {
        if (Math.random() < spawnChance) {
          particlesRef.current.push(new SprayParticle(offset, terrain));
        }
      });
    }

    // Update existing particles
    particlesRef.current.forEach(p => p.update(dt));
    
    // Filter dead particles
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    // Update geometry buffers for THREE.Points
    if (pointsRef.current) {
      const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const colorAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;
      
      const count = particlesRef.current.length;
      
      // Limit to max 400 active particles to protect performance
      const maxCount = 400;
      const drawCount = Math.min(count, maxCount);

      const positions = new Float32Array(maxCount * 3);
      const colors = new Float32Array(maxCount * 3);

      const particleColor = new THREE.Color(
        terrain === 'Water' ? '#e0f2fe' : 
        terrain === 'Mud' ? '#3d2516' : 
        terrain === 'Gravel' ? '#8a8b8c' : '#718096'
      );

      for (let i = 0; i < drawCount; i++) {
        const p = particlesRef.current[i];
        positions[i * 3] = p.position.x;
        positions[i * 3 + 1] = p.position.y;
        positions[i * 3 + 2] = p.position.z;

        // Fade colors as particles age
        const fade = p.life / p.maxLife;
        const colorVal = particleColor.clone().multiplyScalar(fade);
        
        colors[i * 3] = colorVal.r;
        colors[i * 3 + 1] = colorVal.g;
        colors[i * 3 + 2] = colorVal.b;
      }

      positionAttr.copyArray(positions);
      colorAttr.copyArray(colors);
      
      positionAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
      
      pointsRef.current.geometry.setDrawRange(0, drawCount);
    }
  });

  // Decide if we should render scrolling rocks/obstacles based on terrain type
  const renderObstacles = ['Stone', 'Bush', 'Mud', 'Gravel'].includes(terrain);

  return (
    <group>
      {/* Lights tailored to terrain type */}
      <directionalLight
        castShadow
        position={[8, 12, 5]}
        intensity={terrain === 'Water' ? 1.5 : 1.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={45}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ambientLight intensity={0.4} color={terrainConfig.ambientColor} />

      {/* Main Ground Plane */}
      <mesh 
        ref={groundRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.45, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 60, 1, 1]} />
        <meshStandardMaterial 
          color={terrainConfig.color}
          roughness={terrainConfig.roughness}
          metalness={terrainConfig.metalness}
          wireframe={terrainConfig.wireframe}
          map={null} // Removed texture for debugging
          bumpScale={terrainConfig.bumpScale}
        />
      </mesh>

      {/* Water Overlay (Only active for Water terrain) */}
      {terrain === 'Water' && (
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.32, 0]} // wheels submerge slightly
        >
          <planeGeometry args={[12, 60]} />
          <meshStandardMaterial 
            color="#2a75a0" 
            transparent 
            opacity={0.65} 
            roughness={0.05} 
            metalness={0.9} 
          />
        </mesh>
      )}

      {/* Grid lines to make it feel like a virtual sim */}
      <gridHelper 
        args={[60, 30, '#00b4d8', 'rgba(0, 180, 216, 0.05)']} 
        position={[0, -0.44, 0]} 
        rotation={[0, 0, 0]}
      />

      {/* Infinite scrolling props (Rocks / Plants) */}
      {renderObstacles && activeObstacles.map((obs: Obstacle) => {
        // Draw stones/rocks
        if (terrain === 'Stone' || (terrain === 'Mud' && obs.id % 3 === 0)) {
          return (
            <mesh
              key={obs.id}
              position={[obs.x, -0.35 + (obs.scale * 0.1), obs.z]}
              rotation={[0, obs.rotY, 0]}
              scale={[obs.scale, obs.scale * 0.8, obs.scale]}
              castShadow
              receiveShadow
            >
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#4a5568" roughness={0.9} metalness={0.1} />
            </mesh>
          );
        }

        // Draw bushes/grass
        if (terrain === 'Bush') {
          return (
            <group key={obs.id} position={[obs.x, -0.42, obs.z]} scale={[obs.scale * 0.8, obs.scale, obs.scale * 0.8]}>
              {/* Central Bush Ball */}
              <mesh castShadow>
                <sphereGeometry args={[0.5, 8, 8]} />
                <meshStandardMaterial color="#1e3f20" roughness={0.95} />
              </mesh>
              {/* Secondary leaves */}
              <mesh castShadow position={[0.2, 0.2, 0.1]} scale={0.7}>
                <sphereGeometry args={[0.5, 8, 8]} />
                <meshStandardMaterial color="#2d5a27" roughness={0.95} />
              </mesh>
              <mesh castShadow position={[-0.25, 0.15, -0.2]} scale={0.8}>
                <sphereGeometry args={[0.5, 8, 8]} />
                <meshStandardMaterial color="#2f6630" roughness={0.95} />
              </mesh>
            </group>
          );
        }

        return null;
      })}

      {/* Particle System for wheel spray */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(400 * 3), 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[new Float32Array(400 * 3), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.NormalBlending}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};
