import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Torus, Text, OrbitControls, PerspectiveCamera, useScroll } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

type RentGauge3DProps = {
  monthlyRent: number;
  targetAmount: number;
  /** Height in pixels */
  height?: number;
};

const AnimatedTorus = animated(Torus);

function RentGaugeScene({ 
  monthlyRent, 
  targetAmount, 
  scrollProgress = 0
}: { 
  monthlyRent: number; 
  targetAmount: number;
  scrollProgress?: number;
}) {
  const percentageFilled = Math.min(1, monthlyRent / targetAmount);
  
  // Reference to the group containing all meshes
  const groupRef = useRef<THREE.Group>(null);
  
  // Create animated props for the torus
  const { scale, color } = useSpring({
    scale: 1 + scrollProgress * 0.2,
    color: percentageFilled > 0.8 
      ? '#22c55e' // Green for high percentage
      : percentageFilled > 0.5 
        ? '#eab308' // Yellow for medium percentage
        : '#ef4444', // Red for low percentage
    config: { tension: 120, friction: 14 },
  });
  
  // Rotate the torus slightly on each frame
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Gray background ring */}
      <Torus 
        args={[3, 0.4, 16, 100, Math.PI * 2]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#e5e7eb" />
      </Torus>
      
      {/* Colored progress ring */}
      <AnimatedTorus 
        args={[3, 0.4, 16, 100, Math.PI * 2 * percentageFilled]} 
        rotation={[Math.PI / 2, 0, 0]}
        scale={scale}
      >
        <animated.meshStandardMaterial color={color} />
      </AnimatedTorus>
      
      {/* Center text elements */}
      <group position={[0, 0, 0]}>
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.5}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          Rent Collection
        </Text>
        
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.7}
          color="#000"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          ${monthlyRent.toLocaleString()}
        </Text>
        
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.4}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          of ${targetAmount.toLocaleString()}
        </Text>
        
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.6}
          color={
            percentageFilled > 0.8 
              ? '#22c55e' 
              : percentageFilled > 0.5 
                ? '#eab308' 
                : '#ef4444'
          }
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {Math.round(percentageFilled * 100)}%
        </Text>
      </group>
    </group>
  );
}

function ScrollTracker({ setScrollProgress }: { setScrollProgress: (progress: number) => void }) {
  const scroll = useScroll();
  
  useFrame(() => {
    setScrollProgress(scroll.offset);
  });
  
  return null;
}

const RentGauge3D: React.FC<RentGauge3DProps> = ({ 
  monthlyRent, 
  targetAmount,
  height = 400
}) => {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  
  return (
    <div style={{ height, position: 'relative' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <ScrollTracker setScrollProgress={setScrollProgress} />
        <RentGaugeScene 
          monthlyRent={monthlyRent} 
          targetAmount={targetAmount} 
          scrollProgress={scrollProgress} 
        />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default RentGauge3D; 