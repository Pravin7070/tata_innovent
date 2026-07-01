import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Define Props for the Rover
interface RoverProps {
  driveMode: string;    // "4WD" | "2WD" | "AWD"
  rideHeight: string;   // "Standard" | "Raised" | "Low"
  speed: string;        // "Stop" | "Slow" | "Medium" | "Fast" | "Reverse"
  steering: string;     // "Straight" | "Left" | "Right"
  terrain: string;      // Current terrain type for physics adjustments
}

// Helper component to render a rugged tire
const Tire = ({ isRight, speed, glowColor }: { isRight: boolean, speed: string, glowColor: string }) => {
  // Generate rugged tread blocks procedurally
  const treads = [];
  const treadCount = 12;
  for (let i = 0; i < treadCount; i++) {
    const angle = (i / treadCount) * Math.PI * 2;
    treads.push(
      <mesh 
        key={i} 
        position={[0, Math.sin(angle) * 0.45, Math.cos(angle) * 0.45]}
        rotation={[angle, 0, 0]}
      >
        <boxGeometry args={[0.26, 0.06, 0.12]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
    );
  }

  return (
    <group>
      {/* Tire Main Cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.25, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Outer Wheel Hub with LEDs */}
      <mesh position={[isRight ? -0.13 : 0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 12]} />
        <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Emissive Center Cap (Active Drive Indicator) */}
      <mesh position={[isRight ? -0.16 : 0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
        <meshStandardMaterial 
          color="#090d16"
          emissive={glowColor} 
          emissiveIntensity={speed === 'Stop' ? 0.3 : 1.5} 
        />
      </mesh>

      {/* Rugged Treads */}
      {treads}
    </group>
  );
};

export const Rover = ({ driveMode, rideHeight, speed, steering, terrain }: RoverProps) => {
  // References to animate parts of the rover
  const roverGroupRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);
  const lidarRef = useRef<THREE.Mesh>(null);
  const coreMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const laserMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const antennaWhipRef = useRef<THREE.Mesh>(null);
  const antennaLedMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  // References for wheels
  const flWheelRef = useRef<THREE.Group>(null);
  const frWheelRef = useRef<THREE.Group>(null);
  const rlWheelRef = useRef<THREE.Group>(null);
  const rrWheelRef = useRef<THREE.Group>(null);

  // References for suspension wishbones (Upper and Lower arms)
  const flArmUpperRef = useRef<THREE.Mesh>(null);
  const flArmLowerRef = useRef<THREE.Mesh>(null);
  const frArmUpperRef = useRef<THREE.Mesh>(null);
  const frArmLowerRef = useRef<THREE.Mesh>(null);
  const rlArmUpperRef = useRef<THREE.Mesh>(null);
  const rlArmLowerRef = useRef<THREE.Mesh>(null);
  const rrArmUpperRef = useRef<THREE.Mesh>(null);
  const rrArmLowerRef = useRef<THREE.Mesh>(null);

  // Emissive color based on drive mode
  const getGlowColor = () => {
    switch (driveMode) {
      case '4WD': return '#00b4d8'; // Cyan
      case 'AWD': return '#06d6a0'; // Neon Green
      case '2WD': return '#7209b7'; // Purple/Indigo
      default: return '#00b4d8';
    }
  };

  // Target values to interpolate towards
  const [targetRideHeight, setTargetRideHeight] = useState(0);
  const [targetSteerAngle, setTargetSteerAngle] = useState(0);
  const [targetRotationSpeed, setTargetRotationSpeed] = useState(0);

  // Keep track of current values for animation interpolation
  const currentHeight = useRef(0);
  const currentSteer = useRef(0);
  const wheelRotation = useRef(0);
  const currentRoll = useRef(0);
  const currentPitch = useRef(0);

  // Map settings to numerical targets
  useEffect(() => {
    // 1. Ride Height target
    switch (rideHeight) {
      case 'Raised': setTargetRideHeight(0.35); break;
      case 'Low': setTargetRideHeight(-0.25); break;
      case 'Standard':
      default: setTargetRideHeight(0); break;
    }

    // 2. Steering target angle (radians)
    switch (steering) {
      case 'Left': setTargetSteerAngle(0.45); break;
      case 'Right': setTargetSteerAngle(-0.45); break;
      case 'Straight':
      default: setTargetSteerAngle(0); break;
    }

    // 3. Wheel rotation speed target (rad/s)
    switch (speed) {
      case 'Slow': setTargetRotationSpeed(2.5); break;
      case 'Medium': setTargetRotationSpeed(6.0); break;
      case 'Fast': setTargetRotationSpeed(12.0); break;
      case 'Reverse': setTargetRotationSpeed(-3.0); break;
      case 'Stop':
      default: setTargetRotationSpeed(0); break;
    }
  }, [rideHeight, steering, speed]);

  // Suspension double wishbone updater
  const updateWishbone = (
    armRef: React.RefObject<THREE.Mesh>, 
    chassisAnchor: THREE.Vector3, 
    wheelAnchor: THREE.Vector3, 
    chassisWorldPos: THREE.Vector3,
    chassisQuaternion: THREE.Quaternion
  ) => {
    if (!armRef.current) return;

    // Transform chassis anchor to world space
    const start = chassisAnchor.clone().applyQuaternion(chassisQuaternion).add(chassisWorldPos);
    const end = wheelAnchor.clone(); // Wheel anchor is already in world space (calculated below)

    // Vector from chassis anchor to wheel anchor
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();

    // Position arm at the midpoint
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    armRef.current.position.copy(midpoint);

    // Orient arm to look at the wheel anchor
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());
    armRef.current.quaternion.copy(quat);

    // Scale the arm cylinder length
    armRef.current.scale.set(1, length, 1);
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Limit delta to avoid huge jumps on frame drops
    const dt = Math.min(delta, 0.1);

    // 1. Smoothly interpolate steering, height, and wheel speed
    currentSteer.current = THREE.MathUtils.lerp(currentSteer.current, targetSteerAngle, dt * 6);
    currentHeight.current = THREE.MathUtils.lerp(currentHeight.current, targetRideHeight, dt * 4);
    
    const curSpeed = THREE.MathUtils.lerp(
      targetRotationSpeed !== 0 ? targetRotationSpeed : 0, 
      targetRotationSpeed, 
      dt * 5
    );
    wheelRotation.current += curSpeed * dt;

    // 2. Rotate LiDAR scanner
    if (lidarRef.current) {
      // Rotate faster if speed is Fast, slower if Stop
      const lidarSpeed = speed === 'Stop' ? 1.5 : 4.0;
      lidarRef.current.rotation.y += lidarSpeed * dt;
    }

    // 3. Simulating terrain physical displacement (chassis rocking & vibrations)
    // We add some procedurally generated oscillations based on the terrain type and speed
    let vibrationIntensity = 0.002;
    let bumpFrequency = 5;
    let rollIntensity = 0.02;
    let pitchIntensity = 0.02;

    switch (terrain) {
      case 'Mud':
        vibrationIntensity = 0.005;
        bumpFrequency = 3;
        rollIntensity = 0.04;
        break;
      case 'Stone':
        vibrationIntensity = 0.03;
        bumpFrequency = 12;
        rollIntensity = 0.12;
        pitchIntensity = 0.1;
        break;
      case 'Gravel':
        vibrationIntensity = 0.015;
        bumpFrequency = 18;
        rollIntensity = 0.03;
        break;
      case 'Pothole':
        vibrationIntensity = 0.025;
        bumpFrequency = 6;
        rollIntensity = 0.08;
        break;
      case 'Water':
        vibrationIntensity = 0.004;
        bumpFrequency = 2;
        rollIntensity = 0.05; // floating sloshing
        break;
      case 'Slope':
        vibrationIntensity = 0.002;
        break;
      case 'Road':
      default:
        vibrationIntensity = 0.001;
        break;
    }

    // Only rock if the rover is actually moving (except for floating in water)
    const isMoving = speed !== 'Stop';
    const movementScale = isMoving ? (speed === 'Slow' ? 0.5 : speed === 'Medium' ? 1.0 : 1.5) : (terrain === 'Water' ? 0.2 : 0);

    // Apply procedural pitch, roll, and height bounce
    const pitchNoise = Math.sin(time * bumpFrequency) * pitchIntensity * movementScale;
    const rollNoise = Math.cos(time * bumpFrequency * 0.8) * rollIntensity * movementScale;
    const verticalBounce = Math.sin(time * bumpFrequency * 1.2) * vibrationIntensity * movementScale;

    // Smoothly update pitch & roll
    currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, pitchNoise, dt * 5);
    currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, rollNoise, dt * 5);

    // Calculate slope pitch: if terrain is slope and moving, lean back or forward
    let slopePitch = 0;
    if (terrain === 'Slope') {
      slopePitch = -0.22; // Lean back (climbing slope)
    }

    // Apply transforms to chassis
    if (chassisRef.current) {
      chassisRef.current.position.y = currentHeight.current + verticalBounce;
      chassisRef.current.rotation.x = currentPitch.current + slopePitch;
      chassisRef.current.rotation.z = currentRoll.current;
    }

    // 4. Update steering of front wheels
    if (flWheelRef.current) flWheelRef.current.rotation.y = currentSteer.current;
    if (frWheelRef.current) frWheelRef.current.rotation.y = currentSteer.current;

    // 5. Rotate wheels (X-axis)
    if (flWheelRef.current) {
      const wheelMesh = flWheelRef.current.children[0] as THREE.Group;
      if (wheelMesh) wheelMesh.rotation.x = wheelRotation.current;
    }
    if (frWheelRef.current) {
      const wheelMesh = frWheelRef.current.children[0] as THREE.Group;
      if (wheelMesh) wheelMesh.rotation.x = wheelRotation.current;
    }
    if (rlWheelRef.current) {
      const wheelMesh = rlWheelRef.current.children[0] as THREE.Group;
      if (wheelMesh) wheelMesh.rotation.x = wheelRotation.current;
    }
    if (rrWheelRef.current) {
      const wheelMesh = rrWheelRef.current.children[0] as THREE.Group;
      if (wheelMesh) wheelMesh.rotation.x = wheelRotation.current;
    }

    // 6. Dynamic Suspension wishbones updates
    if (roverGroupRef.current && chassisRef.current) {
      const chassisWorldPos = new THREE.Vector3();
      chassisRef.current.getWorldPosition(chassisWorldPos);
      const chassisQuat = new THREE.Quaternion();
      chassisRef.current.getWorldQuaternion(chassisQuat);

      // Define local chassis anchors for upper and lower wishbone mounts
      // Format: Vector3(X, Y, Z)
      const flChassisAnchorUpper = new THREE.Vector3(0.45, 0.1, 0.9);
      const flChassisAnchorLower = new THREE.Vector3(0.45, -0.15, 0.9);
      const frChassisAnchorUpper = new THREE.Vector3(-0.45, 0.1, 0.9);
      const frChassisAnchorLower = new THREE.Vector3(-0.45, -0.15, 0.9);
      const rlChassisAnchorUpper = new THREE.Vector3(0.45, 0.1, -0.9);
      const rlChassisAnchorLower = new THREE.Vector3(0.45, -0.15, -0.9);
      const rrChassisAnchorUpper = new THREE.Vector3(-0.45, 0.1, -0.9);
      const rrChassisAnchorLower = new THREE.Vector3(-0.45, -0.15, -0.9);

      // Query world positions of wheel hubs
      const flWheelPos = new THREE.Vector3(); flWheelRef.current?.getWorldPosition(flWheelPos);
      const frWheelPos = new THREE.Vector3(); frWheelRef.current?.getWorldPosition(frWheelPos);
      const rlWheelPos = new THREE.Vector3(); rlWheelRef.current?.getWorldPosition(rlWheelPos);
      const rrWheelPos = new THREE.Vector3(); rrWheelRef.current?.getWorldPosition(rrWheelPos);

      // Suspension links connect to the wheel hub center (offset inwards slightly)
      const flHubAnchor = flWheelPos.clone().add(new THREE.Vector3(-0.15, 0, 0));
      const frHubAnchor = frWheelPos.clone().add(new THREE.Vector3(0.15, 0, 0));
      const rlHubAnchor = rlWheelPos.clone().add(new THREE.Vector3(-0.15, 0, 0));
      const rrHubAnchor = rrWheelPos.clone().add(new THREE.Vector3(0.15, 0, 0));

      // Draw Upper and Lower Wishbone cylinders
      updateWishbone(flArmUpperRef, flChassisAnchorUpper, flHubAnchor, chassisWorldPos, chassisQuat);
      updateWishbone(flArmLowerRef, flChassisAnchorLower, flHubAnchor, chassisWorldPos, chassisQuat);
      updateWishbone(frArmUpperRef, frChassisAnchorUpper, frHubAnchor, chassisWorldPos, chassisQuat);
      updateWishbone(frArmLowerRef, frChassisAnchorLower, frHubAnchor, chassisWorldPos, chassisQuat);
      updateWishbone(rlArmUpperRef, rlChassisAnchorUpper, rlHubAnchor, chassisWorldPos, chassisQuat);
      updateWishbone(rlArmLowerRef, rlChassisAnchorLower, rlHubAnchor, chassisWorldPos, chassisQuat);
      updateWishbone(rrArmUpperRef, rrChassisAnchorUpper, rrHubAnchor, chassisWorldPos, chassisQuat);
      updateWishbone(rrArmLowerRef, rrChassisAnchorLower, rrHubAnchor, chassisWorldPos, chassisQuat);
    }

    // 7. Update glowing materials and components that need high frequency updates
    if (coreMaterialRef.current) {
      coreMaterialRef.current.emissiveIntensity = 1.5 + Math.sin(time * 4) * 0.4;
    }
    if (laserMaterialRef.current) {
      laserMaterialRef.current.opacity = 0.15 + Math.sin(time * 30) * 0.05;
    }
    if (antennaWhipRef.current) {
      antennaWhipRef.current.rotation.x = Math.sin(time * 6) * 0.03 + (targetRotationSpeed * 0.005);
      antennaWhipRef.current.rotation.z = Math.cos(time * 5) * 0.02;
    }
    if (antennaLedMaterialRef.current) {
      antennaLedMaterialRef.current.opacity = Math.sin(time * 8) > 0 ? 1 : 0.2;
    }
  });



  return (
    <group ref={roverGroupRef} position={[0, 0.45, 0]}>
      
      {/* 1. Rover Wheels (Stable positions relative to world, independent of chassis pitch/roll) */}
      {/* Front Left Wheel */}
      <group ref={flWheelRef} position={[0.85, 0, 0.9]}>
        <group>
          <Tire isRight={false} speed={speed} glowColor={getGlowColor()} />
        </group>
        <Html position={[0, 0.6, 0]} distanceFactor={6} center>
          <div style={{
            fontFamily: 'Share Tech Mono',
            fontSize: '10px',
            color: getGlowColor(),
            background: 'rgba(5, 6, 8, 0.85)',
            border: `1px solid ${getGlowColor()}`,
            padding: '2px 4px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            FL_DRV: {driveMode === '2WD' ? 'OFF' : 'ON'}
          </div>
        </Html>
      </group>

      {/* Front Right Wheel */}
      <group ref={frWheelRef} position={[-0.85, 0, 0.9]}>
        <group>
          <Tire isRight={true} speed={speed} glowColor={getGlowColor()} />
        </group>
        <Html position={[0, 0.6, 0]} distanceFactor={6} center>
          <div style={{
            fontFamily: 'Share Tech Mono',
            fontSize: '10px',
            color: getGlowColor(),
            background: 'rgba(5, 6, 8, 0.85)',
            border: `1px solid ${getGlowColor()}`,
            padding: '2px 4px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            FR_DRV: {driveMode === '2WD' ? 'OFF' : 'ON'}
          </div>
        </Html>
      </group>

      {/* Rear Left Wheel */}
      <group ref={rlWheelRef} position={[0.85, 0, -0.9]}>
        <group>
          <Tire isRight={false} speed={speed} glowColor={getGlowColor()} />
        </group>
        <Html position={[0, -0.6, 0]} distanceFactor={6} center>
          <div style={{
            fontFamily: 'Share Tech Mono',
            fontSize: '10px',
            color: getGlowColor(),
            background: 'rgba(5, 6, 8, 0.85)',
            border: `1px solid ${getGlowColor()}`,
            padding: '2px 4px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            RL_DRV: ON
          </div>
        </Html>
      </group>

      {/* Rear Right Wheel */}
      <group ref={rrWheelRef} position={[-0.85, 0, -0.9]}>
        <group>
          <Tire isRight={true} speed={speed} glowColor={getGlowColor()} />
        </group>
        <Html position={[0, -0.6, 0]} distanceFactor={6} center>
          <div style={{
            fontFamily: 'Share Tech Mono',
            fontSize: '10px',
            color: getGlowColor(),
            background: 'rgba(5, 6, 8, 0.85)',
            border: `1px solid ${getGlowColor()}`,
            padding: '2px 4px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            RR_DRV: ON
          </div>
        </Html>
      </group>

      {/* 2. Suspension Wishbones (Rendered dynamically as cylinders linking body to wheel hubs) */}
      <group>
        {/* Cylinders inside wishbones meshes will be dynamically positioned in useFrame */}
        <mesh ref={flArmUpperRef}><cylinderGeometry args={[0.03, 0.03, 1, 8]} /><meshStandardMaterial color="#4a5568" roughness={0.4} /></mesh>
        <mesh ref={flArmLowerRef}><cylinderGeometry args={[0.04, 0.04, 1, 8]} /><meshStandardMaterial color="#2d3748" roughness={0.4} /></mesh>
        <mesh ref={frArmUpperRef}><cylinderGeometry args={[0.03, 0.03, 1, 8]} /><meshStandardMaterial color="#4a5568" roughness={0.4} /></mesh>
        <mesh ref={frArmLowerRef}><cylinderGeometry args={[0.04, 0.04, 1, 8]} /><meshStandardMaterial color="#2d3748" roughness={0.4} /></mesh>
        <mesh ref={rlArmUpperRef}><cylinderGeometry args={[0.03, 0.03, 1, 8]} /><meshStandardMaterial color="#4a5568" roughness={0.4} /></mesh>
        <mesh ref={rlArmLowerRef}><cylinderGeometry args={[0.04, 0.04, 1, 8]} /><meshStandardMaterial color="#2d3748" roughness={0.4} /></mesh>
        <mesh ref={rrArmUpperRef}><cylinderGeometry args={[0.03, 0.03, 1, 8]} /><meshStandardMaterial color="#4a5568" roughness={0.4} /></mesh>
        <mesh ref={rrArmLowerRef}><cylinderGeometry args={[0.04, 0.04, 1, 8]} /><meshStandardMaterial color="#2d3748" roughness={0.4} /></mesh>
      </group>

      {/* 3. Rover Chassis Body */}
      <group ref={chassisRef} position={[0, 0, 0]}>
        
        {/* Main Chassis Block */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.85, 0.35, 2.0]} />
          <meshStandardMaterial color="#2b2d31" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Chassis Armor Plates (Dark grey accents) */}
        <mesh castShadow position={[0, 0.1, 0.2]}>
          <boxGeometry args={[0.9, 0.22, 1.4]} />
          <meshStandardMaterial color="#1a1c1e" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Carbon Fiber Underbelly */}
        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[0.8, 0.05, 1.9]} />
          <meshStandardMaterial color="#0c0d0f" roughness={0.9} />
        </mesh>

        {/* Front Nose Cone / Bumper */}
        <mesh position={[0, -0.05, 1.08]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.7, 0.25, 0.2]} />
          <meshStandardMaterial color="#1a1c1e" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Front Headlights (Spotlights) */}
        <group position={[0, 0.05, 1.15]}>
          {/* Left Headlight */}
          <mesh position={[0.25, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
          </mesh>
          <spotLight 
            position={[0.25, 0, 0.1]} 
            angle={0.45} 
            penumbra={0.5} 
            intensity={4} 
            distance={20} 
            castShadow 
            target-position={[0, 0, 10]}
          />

          {/* Right Headlight */}
          <mesh position={[-0.25, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
          </mesh>
          <spotLight 
            position={[-0.25, 0, 0.1]} 
            angle={0.45} 
            penumbra={0.5} 
            intensity={4} 
            distance={20} 
            castShadow 
            target-position={[0, 0, 10]}
          />
        </group>

        {/* Glowing AI Energy Core (Visual feedback for system operations) */}
        <group position={[0, 0.15, -0.2]}>
          <mesh>
            <boxGeometry args={[0.5, 0.15, 0.5]} />
            <meshStandardMaterial color="#0c0d0f" roughness={0.7} />
          </mesh>
          {/* Inner pulsating core */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.35, 0.14, 0.35]} />
            <meshStandardMaterial 
              ref={coreMaterialRef}
              color="#020305" 
              emissive={getGlowColor()} 
            />
          </mesh>
          <pointLight position={[0, 0.3, 0]} color={getGlowColor()} intensity={2.0} distance={4} />
          
          <Html position={[0, 0.25, 0]} distanceFactor={6} center>
            <div style={{
              fontFamily: 'Orbitron',
              fontSize: '8px',
              fontWeight: 'bold',
              color: getGlowColor(),
              textShadow: `0 0 5px ${getGlowColor()}`,
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}>
              AI_CORE_ACTIVE
            </div>
          </Html>
        </group>

        {/* Rotating LiDAR Scanner (Dynamic Animation) */}
        <group position={[0, 0.3, 0.5]}>
          {/* Base */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.1, 16]} />
            <meshStandardMaterial color="#1a1c1e" metalness={0.8} />
          </mesh>
          {/* Spinning Head */}
          <mesh ref={lidarRef} castShadow position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
            <meshStandardMaterial color="#2d3748" metalness={0.9} />
            {/* Laser emitter lens (glowing dot) */}
            <mesh position={[0, 0, 0.11]}>
              <boxGeometry args={[0.04, 0.04, 0.02]} />
              <meshStandardMaterial color="#ef476f" emissive="#ef476f" emissiveIntensity={2.0} />
            </mesh>
          </mesh>
          {/* Thin laser scanning visualization helper */}
          {speed !== 'Stop' && (
            <mesh position={[0, 0.1, 4]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.02, 8]} />
              <meshBasicMaterial 
                ref={laserMaterialRef}
                color="#ef476f" 
                transparent 
                side={THREE.DoubleSide} 
              />
            </mesh>
          )}
        </group>

        {/* Antenna (Animates slightly with chassis inertia) */}
        <group position={[0.25, 0.25, -0.8]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <meshStandardMaterial color="#1a1c1e" />
          </mesh>
          {/* Whip Antenna */}
          <mesh 
            ref={antennaWhipRef}
            castShadow 
            position={[0, 0.45, 0]} 
          >
            <cylinderGeometry args={[0.005, 0.015, 0.8, 8]} />
            <meshStandardMaterial color="#4a5568" roughness={0.3} />
            {/* Blinking Red Status LED at tip */}
            <mesh position={[0, 0.41, 0]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial 
                ref={antennaLedMaterialRef}
                color="#ef476f" 
                transparent
              />
            </mesh>
          </mesh>
        </group>

        {/* Glowing LED chassis design strips (Indicate active states) */}
        <mesh position={[0.43, 0.05, 0]}>
          <boxGeometry args={[0.01, 0.03, 1.6]} />
          <meshStandardMaterial 
            color="#050608" 
            emissive={getGlowColor()} 
            emissiveIntensity={1.2} 
          />
        </mesh>
        <mesh position={[-0.43, 0.05, 0]}>
          <boxGeometry args={[0.01, 0.03, 1.6]} />
          <meshStandardMaterial 
            color="#050608" 
            emissive={getGlowColor()} 
            emissiveIntensity={1.2} 
          />
        </mesh>

        {/* Suspension height readout */}
        <Html position={[0, -0.4, 0]} distanceFactor={6} center>
          <div style={{
            fontFamily: 'Share Tech Mono',
            fontSize: '9px',
            color: '#a0aec0',
            background: 'rgba(5, 6, 8, 0.75)',
            padding: '2px 4px',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none'
          }}>
            SUSP: {rideHeight} ({(currentHeight.current * 100).toFixed(0)}cm)
          </div>
        </Html>

      </group>
    </group>
  );
};
