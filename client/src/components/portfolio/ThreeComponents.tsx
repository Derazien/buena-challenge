'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Text, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

// Using type for better error handling
export type ThreeComponentsProps = {
    monthlyRent: number;
    targetAmount: number;
};

// Error boundary to catch any Three.js related errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback?: React.ReactNode }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || <div>Something went wrong</div>;
        }
        return this.props.children;
    }
}

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

    // Use useFrame for animation - only works client-side
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

// Simple scroll state hook
const useScrollState = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            // Calculate scroll progress (0-1) based on page scroll position
            const scrollY = window.scrollY;
            const winHeight = window.innerHeight;
            const docHeight = document.body.scrollHeight;
            const totalScrollable = docHeight - winHeight;
            const progress = Math.min(1, Math.max(0, scrollY / totalScrollable));

            setScrollProgress(progress);
        };

        handleScroll(); // Initialize
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return scrollProgress;
};

const ThreeComponentsInner: React.FC<ThreeComponentsProps> = ({ monthlyRent, targetAmount }) => {
    const scrollProgress = useScrollState();

    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
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
    );
};

// Main export with error boundary and suspense
const ThreeComponents: React.FC<ThreeComponentsProps> = (props) => {
    // Only render if we're in the browser
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <ErrorBoundary fallback={<div style={{ height: '100%', backgroundColor: '#f0f0f0' }} />}>
            <Suspense fallback={<div style={{ height: '100%', backgroundColor: '#f5f5f5' }} />}>
                <ThreeComponentsInner {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default ThreeComponents;