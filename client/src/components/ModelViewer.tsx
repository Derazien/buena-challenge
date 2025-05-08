'use client';

import React from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModelViewerProps {
    modelPath?: string;
    cameraPosition?: [number, number, number];
    autoRotate?: boolean;
}

export function ModelViewer({ modelPath, cameraPosition = [0, 5, 10], autoRotate = false }: ModelViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);
        sceneRef.current = scene;

        // Initialize camera
        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(...cameraPosition);
        cameraRef.current = camera;

        // Initialize renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Add controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 2;
        controlsRef.current = controls;

        if (modelPath) {
            // Load model if provided
            const loader = new GLTFLoader();
            loader.load(
                modelPath,
                (gltf: GLTF) => {
                    scene.add(gltf.scene);

                    // Center and scale the model
                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 5 / maxDim;
                    gltf.scene.scale.setScalar(scale);
                    gltf.scene.position.sub(center.multiplyScalar(scale));
                },
                undefined,
                (error: unknown) => {
                    console.error('Error loading model:', error);
                }
            );
        } else {
            // Create a simple house model
            const house = new THREE.Group();

            // Base
            const baseGeometry = new THREE.BoxGeometry(4, 0.2, 4);
            const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = -0.1;
            house.add(base);

            // Walls
            const wallGeometry = new THREE.BoxGeometry(4, 2, 4);
            const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
            const walls = new THREE.Mesh(wallGeometry, wallMaterial);
            walls.position.y = 1;
            house.add(walls);

            // Roof
            const roofGeometry = new THREE.ConeGeometry(3, 2, 4);
            const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.y = 3;
            roof.rotation.y = Math.PI / 4;
            house.add(roof);

            // Door
            const doorGeometry = new THREE.PlaneGeometry(1, 2);
            const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f1b });
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(0, 1, 2.01);
            house.add(door);

            // Windows
            const windowGeometry = new THREE.PlaneGeometry(0.8, 0.8);
            const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x87ceeb });
            const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
            window1.position.set(-1.5, 1.5, 2.01);
            house.add(window1);

            const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
            window2.position.set(1.5, 1.5, 2.01);
            house.add(window2);

            const window3 = new THREE.Mesh(windowGeometry, windowMaterial);
            window3.position.set(-1.5, 1.5, -2.01);
            window3.rotation.y = Math.PI;
            house.add(window3);

            const window4 = new THREE.Mesh(windowGeometry, windowMaterial);
            window4.position.set(1.5, 1.5, -2.01);
            window4.rotation.y = Math.PI;
            house.add(window4);

            scene.add(house);
        }

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controlsRef.current?.update();
            rendererRef.current?.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && rendererRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
            rendererRef.current?.dispose();
        };
    }, [modelPath, cameraPosition, autoRotate]);

    return <div ref={containerRef} className="w-full h-full" />;
} 