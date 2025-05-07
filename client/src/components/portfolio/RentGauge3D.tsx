'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Torus, Text, PerspectiveCamera, useScroll } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';

// Define props for RentGauge
type RentGauge3DProps = {
  monthlyRent?: number;
  targetAmount?: number;
  height?: number;
  className?: string;
};

// Animated torus component that responds to scroll
function AnimatedDonut({ monthlyRent = 12500, targetAmount = 18000 }) {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Calculate percentage for visual indication
  const percentageFilled = Math.min(1, monthlyRent / targetAmount);

  // Get color based on percentage
  const getColor = () => {
    if (percentageFilled > 0.8) return '#10b981'; // Emerald
    if (percentageFilled > 0.5) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  // Create animated props with react-spring
  const { scale, rotation, emissive } = useSpring({
    scale: 1,
    rotation: 0,
    emissive: getColor(),
    config: config.molasses
  });

  // Handle animation on scroll
  useFrame(() => {
    if (!groupRef.current) return;

    // Get current scroll position from useScroll
    const scrollOffset = scroll.offset;

    // Update scale and rotation
    scale.start(1 + scrollOffset * 0.5);
    rotation.start(scrollOffset * Math.PI * 2);

    // Gentle continuous rotation
    groupRef.current.rotation.z += 0.001;
    groupRef.current.rotation.x = Math.PI / 2; // Keep it flat
  });

  // Percentage for display
  const percentage = Math.round(percentageFilled * 100);

  // Create the AnimatedTorus component
  const AnimatedTorus = animated(Torus);

  return (
    <group ref={groupRef}>
      {/* Background gray ring */}
      <Torus args={[3, 0.3, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.3} />
      </Torus>

      {/* Animated progress ring */}
      <AnimatedTorus
        args={[3, 0.35, 32, 100, Math.PI * 2 * percentageFilled]}
        rotation-x={Math.PI / 2}
        rotation-y={rotation}
        rotation-z={0}
        scale={scale}
      >
        <animated.meshStandardMaterial
          color={getColor()}
          roughness={0.2}
          metalness={0.8}
          emissive={emissive}
          emissiveIntensity={0.2}
        />
      </AnimatedTorus>

      {/* Text elements */}
      <group position={[0, 0, 0.2]}>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.5}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          Rent Collection
        </Text>

        <Text
          position={[0, 0, 0]}
          fontSize={1}
          color={getColor()}
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          {percentage}%
        </Text>

        <Text
          position={[0, -1, 0]}
          fontSize={0.5}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
        >
          €{monthlyRent.toLocaleString()} of €{targetAmount.toLocaleString()}
        </Text>
      </group>
    </group>
  );
}

// Scene setup with lighting
function SceneSetup() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, 3]} intensity={0.4} />
      <spotLight position={[0, -5, 5]} intensity={0.3} angle={0.3} color="#3b82f6" />
    </>
  );
}

const RentGauge3D: React.FC<RentGauge3DProps> = ({
  monthlyRent = 12500,
  targetAmount = 18000,
  height = 400,
  className
}) => {
  return (
    <div
      className={className}
      style={{
        height,
        width: '100%',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f1f5f9 100%)'
      }}
    >
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 8], fov: 45 }}
      >
        <SceneSetup />
        <AnimatedDonut
          monthlyRent={monthlyRent}
          targetAmount={targetAmount}
        />
      </Canvas>
    </div>
  );
};

export default RentGauge3D;