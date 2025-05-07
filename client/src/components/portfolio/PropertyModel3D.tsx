'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { MeshPhysicalMaterial } from 'three';

type PropertyModel3DProps = {
    propertyType?: 'apartment' | 'house' | 'building';
    colorScheme?: 'modern' | 'classic' | 'german';
    height?: number;
    width?: number;
    className?: string;
};

const PropertyModel3D: React.FC<PropertyModel3DProps> = ({
    propertyType = 'building',
    colorScheme = 'german',
    height = 400,
    width = 500,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Enhanced color palettes with more realistic tones
    const getColors = () => {
        const palettes = {
            modern: {
                primary: 0x2c3e50,    // Deep slate blue
                secondary: 0x3498db,   // Bright blue
                accent: 0xecf0f1,     // Light gray
                glass: 0x7f8c8d,      // Dark gray for glass
                metal: 0x95a5a6,      // Steel gray
                concrete: 0xbdc3c7,   // Light concrete
                wood: 0x8B4513,       // Saddle brown
                stone: 0x808080,      // Gray
                trim: 0x34495e,       // Dark blue-gray
            },
            classic: {
                primary: 0x8b4513,    // Saddle brown
                secondary: 0xcd853f,   // Peru
                accent: 0xf5f5dc,     // Beige
                glass: 0x708090,      // Slate gray
                metal: 0x696969,      // Dim gray
                concrete: 0xd3d3d3,   // Light gray
                wood: 0x654321,       // Dark brown
                stone: 0x708090,      // Slate gray
                trim: 0x8B4513,       // Saddle brown
            },
            german: {
                primary: 0x1a1a1a,    // Rich black
                secondary: 0xcc0000,   // Deep red
                accent: 0xffd700,     // Gold
                glass: 0x4a4a4a,      // Dark gray
                metal: 0x404040,      // Dark metal
                concrete: 0xe0e0e0,   // Light concrete
                wood: 0x4a2f1b,       // Dark wood
                stone: 0x696969,      // Dark gray
                trim: 0xcc0000,       // Deep red
            }
        };

        return palettes[colorScheme];
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup with enhanced environment
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);
        scene.fog = new THREE.FogExp2(0x87CEEB, 0.008);
        sceneRef.current = scene;

        // Enhanced renderer with better quality settings
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Enhanced camera setup
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
        camera.position.set(35, 30, 35);
        cameraRef.current = camera;

        // Enhanced lighting setup with area lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Main sun light with better shadows
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
        sunLight.position.set(50, 50, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 150;
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        sunLight.shadow.bias = -0.0001;
        sunLight.shadow.normalBias = 0.02;
        scene.add(sunLight);

        // Add area lights for softer shadows
        const areaLight1 = new THREE.RectAreaLight(0xffffff, 2, 20, 20);
        areaLight1.position.set(30, 20, 30);
        areaLight1.lookAt(0, 0, 0);
        scene.add(areaLight1);

        const areaLight2 = new THREE.RectAreaLight(0xffffff, 2, 20, 20);
        areaLight2.position.set(-30, 20, -30);
        areaLight2.lookAt(0, 0, 0);
        scene.add(areaLight2);

        // Enhanced ground plane with PBR materials
        const groundGeometry = new THREE.PlaneGeometry(300, 300, 128, 128);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a472a,
            roughness: 0.9,
            metalness: 0.1,
            envMapIntensity: 1.0,
            displacementScale: 0.5,
            displacementBias: -0.2,
            normalScale: new THREE.Vector2(1, 1)
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        scene.add(ground);

        // Add soft shadow plane for better ground interaction
        const shadowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(300, 300),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.3,
                depthWrite: false
            })
        );
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -0.49;
        shadowPlane.receiveShadow = true;
        scene.add(shadowPlane);

        // Add environment elements
        addEnvironmentElements(scene);

        // Create property model
        createPropertyModel();

        // Enhanced controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 20;
        controls.maxDistance = 80;
        controls.maxPolarAngle = Math.PI / 2.1;
        controls.target.set(0, 8, 0);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.2;
        controlsRef.current = controls;

        // Enhanced post-processing setup
        const composer = new EffectComposer(renderer);

        // Render pass
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Enhanced bloom pass
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            0.5,
            0.4,
            0.85
        );
        composer.addPass(bloomPass);

        // Add SSAO pass for ambient occlusion
        const ssaoPass = new SSAOPass(scene, camera, width, height);
        ssaoPass.kernelRadius = 16;
        ssaoPass.minDistance = 0.005;
        ssaoPass.maxDistance = 0.1;
        composer.addPass(ssaoPass);

        // Enhanced anti-aliasing pass
        const smaaPass = new SMAAPass(width * renderer.getPixelRatio(), height * renderer.getPixelRatio());
        composer.addPass(smaaPass);

        composerRef.current = composer;

        // Animation loop
        const animate = () => {
            if (controlsRef.current) {
                controlsRef.current.update();
            }

            if (modelRef.current) {
                modelRef.current.rotation.y += 0.0003;
            }

            // Update shadow plane opacity based on camera position
            if (shadowPlane && cameraRef.current) {
                const distance = cameraRef.current.position.distanceTo(new THREE.Vector3(0, 0, 0));
                shadowPlane.material.opacity = Math.max(0.1, Math.min(0.3, 0.3 - (distance - 20) * 0.01));
            }

            if (composerRef.current) {
                composerRef.current.render();
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Wait for initial render
        setTimeout(() => setIsLoaded(true), 100);

        // Cleanup
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }
            if (composerRef.current) {
                composerRef.current.dispose();
            }
        };
    }, [width, height, propertyType]);

    // Function to add environment elements
    const addEnvironmentElements = (scene: THREE.Scene) => {
        // Add trees with better materials
        for (let i = 0; i < 30; i++) {
            const tree = createTree();
            tree.position.set(
                (Math.random() - 0.5) * 80,
                0,
                (Math.random() - 0.5) * 80
            );
            tree.scale.set(
                0.8 + Math.random() * 0.4,
                0.8 + Math.random() * 0.4,
                0.8 + Math.random() * 0.4
            );
            scene.add(tree);
        }

        // Add street lamps with better lighting
        for (let i = 0; i < 12; i++) {
            const lamp = createStreetLamp();
            lamp.position.set(
                (Math.random() - 0.5) * 60,
                0,
                (Math.random() - 0.5) * 60
            );
            scene.add(lamp);
        }

        // Add decorative elements
        addDecorativeEnvironmentElements(scene);
    };

    // Function to create a tree with better materials
    const createTree = () => {
        const tree = new THREE.Group();

        // Trunk with better material
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2.5, 12);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a2f1b,
            roughness: 0.9,
            metalness: 0.1,
            displacementScale: 0.2,
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        tree.add(trunk);

        // Foliage with better material
        const foliageGeometry = new THREE.ConeGeometry(1.2, 2.5, 12);
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a472a,
            roughness: 0.8,
            metalness: 0.1,
            displacementScale: 0.3,
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 3;
        foliage.castShadow = true;
        tree.add(foliage);

        return tree;
    };

    // Function to create a street lamp with better materials and lighting
    const createStreetLamp = () => {
        const lamp = new THREE.Group();

        // Pole with better material
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 12);
        const poleMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.8,
            displacementScale: 0.1,
        });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 3;
        pole.castShadow = true;
        lamp.add(pole);

        // Lamp head with better material
        const headGeometry = new THREE.SphereGeometry(0.4, 24, 24);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: 0.8,
            roughness: 0.2,
            metalness: 0.8,
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 6;
        lamp.add(head);

        // Add point light with better parameters
        const light = new THREE.PointLight(0xffffcc, 1.5, 20);
        light.position.y = 6;
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 30;
        lamp.add(light);

        return lamp;
    };

    // Function to add decorative environment elements
    const addDecorativeEnvironmentElements = (scene: THREE.Scene) => {
        // Add rocks
        for (let i = 0; i < 20; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.3, 0);
            const rockMaterial = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.9,
                metalness: 0.1,
                displacementScale: 0.2,
            });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.position.set(
                (Math.random() - 0.5) * 70,
                0,
                (Math.random() - 0.5) * 70
            );
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            rock.scale.set(
                0.5 + Math.random() * 0.5,
                0.5 + Math.random() * 0.5,
                0.5 + Math.random() * 0.5
            );
            rock.castShadow = true;
            rock.receiveShadow = true;
            scene.add(rock);
        }

        // Add bushes
        for (let i = 0; i < 25; i++) {
            const bushGeometry = new THREE.SphereGeometry(0.5 + Math.random() * 0.3, 8, 8);
            const bushMaterial = new THREE.MeshStandardMaterial({
                color: 0x2d5a27,
                roughness: 0.9,
                metalness: 0.1,
                displacementScale: 0.3,
            });
            const bush = new THREE.Mesh(bushGeometry, bushMaterial);
            bush.position.set(
                (Math.random() - 0.5) * 75,
                0,
                (Math.random() - 0.5) * 75
            );
            bush.scale.set(
                0.8 + Math.random() * 0.4,
                0.8 + Math.random() * 0.4,
                0.8 + Math.random() * 0.4
            );
            bush.castShadow = true;
            bush.receiveShadow = true;
            scene.add(bush);
        }
    };

    // Function to create different property models
    const createPropertyModel = () => {
        const model = new THREE.Group();
        modelRef.current = model;

        switch (propertyType) {
            case 'apartment':
                createApartmentBuilding(model);
                break;
            case 'house':
                createHouse(model);
                break;
            case 'building':
            default:
                createOfficeBuilding(model);
                break;
        }

        sceneRef.current?.add(model);
    };

    // Function to create an apartment building with enhanced details
    const createApartmentBuilding = (model: THREE.Group) => {
        // Main structure with better proportions
        const buildingGeometry = new THREE.BoxGeometry(20, 25, 15);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: getColors().primary,
            roughness: 0.3,
            metalness: 0.2,
            displacementScale: 0.2,
            envMapIntensity: 1.2
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.y = 12.5;
        building.castShadow = true;
        building.receiveShadow = true;
        model.add(building);

        // Enhanced facade with better materials
        const facadeGeometry = new THREE.BoxGeometry(20.1, 25.1, 15.1);
        const facadeMaterial = new THREE.MeshStandardMaterial({
            color: getColors().metal,
            roughness: 0.4,
            metalness: 0.3,
            displacementScale: 0.1,
            envMapIntensity: 1.5
        });
        const facade = new THREE.Mesh(facadeGeometry, facadeMaterial);
        facade.position.y = 12.5;
        facade.castShadow = true;
        facade.receiveShadow = true;
        model.add(facade);

        // Add windows with better materials and spacing
        const windowRows = 8;
        const windowCols = 5;
        const windowWidth = 1.2;
        const windowHeight = 1.8;
        const windowDepth = 0.1;
        const windowSpacing = 2.5;

        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                // Front windows
                const frontWindow = createWindow(windowWidth, windowHeight, windowDepth);
                frontWindow.position.set(
                    (col - 2) * windowSpacing,
                    3 + row * 3,
                    7.6
                );
                model.add(frontWindow);

                // Back windows
                const backWindow = createWindow(windowWidth, windowHeight, windowDepth);
                backWindow.position.set(
                    (col - 2) * windowSpacing,
                    3 + row * 3,
                    -7.6
                );
                backWindow.rotation.y = Math.PI;
                model.add(backWindow);

                // Side windows (alternating)
                if (col === 0 || col === windowCols - 1) {
                    const sideWindow = createWindow(windowHeight, windowWidth, windowDepth);
                    sideWindow.position.set(
                        col === 0 ? -10.1 : 10.1,
                        3 + row * 3,
                        (col - 2) * windowSpacing
                    );
                    sideWindow.rotation.y = Math.PI / 2;
                    model.add(sideWindow);
                }
            }
        }

        // Add balconies with better materials
        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                if (row > 0 && row < windowRows - 1) {
                    const balcony = createBalcony(2, 1, 2);
                    balcony.position.set(
                        (col - 2) * windowSpacing,
                        2 + row * 3,
                        7.6
                    );
                    model.add(balcony);
                }
            }
        }

        // Add entrance with better materials
        const entrance = createEntrance(4, 3, 2);
        entrance.position.set(0, 1.5, 7.6);
        model.add(entrance);

        // Add decorative elements
        addDecorativeElements(model);
    };

    // Function to create a window with better materials
    const createWindow = (width: number, height: number, depth: number) => {
        const windowGroup = new THREE.Group();

        // Window frame with PBR material
        const frameGeometry = new THREE.BoxGeometry(width + 0.2, height + 0.2, depth);
        const frameMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.8,
            displacementScale: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1.5,
            normalScale: new THREE.Vector2(1, 1)
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        windowGroup.add(frame);

        // Window glass with enhanced PBR material
        const glassGeometry = new THREE.BoxGeometry(width, height, depth * 0.1);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.1,
            metalness: 0.9,
            transmission: 0.9,
            thickness: 0.5,
            envMapIntensity: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            ior: 1.5,
            reflectivity: 1.0,
            normalScale: new THREE.Vector2(1, 1)
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        windowGroup.add(glass);

        return windowGroup;
    };

    // Function to create a balcony with better materials
    const createBalcony = (width: number, height: number, depth: number) => {
        const balconyGroup = new THREE.Group();

        // Balcony floor
        const floorGeometry = new THREE.BoxGeometry(width, 0.2, depth);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.7,
            metalness: 0.3,
            displacementScale: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.1;
        balconyGroup.add(floor);

        // Balcony railing
        const railingGeometry = new THREE.BoxGeometry(width, height, 0.1);
        const railingMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.4,
            metalness: 0.6,
            displacementScale: 0.1
        });
        const railing = new THREE.Mesh(railingGeometry, railingMaterial);
        railing.position.y = height / 2;
        railing.position.z = -depth / 2;
        balconyGroup.add(railing);

        // Balcony posts
        const postGeometry = new THREE.BoxGeometry(0.1, height, 0.1);
        const postMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.4,
            metalness: 0.6,
            displacementScale: 0.1
        });

        const leftPost = new THREE.Mesh(postGeometry, postMaterial);
        leftPost.position.set(-width / 2 + 0.1, height / 2, -depth / 2);
        balconyGroup.add(leftPost);

        const rightPost = new THREE.Mesh(postGeometry, postMaterial);
        rightPost.position.set(width / 2 - 0.1, height / 2, -depth / 2);
        balconyGroup.add(rightPost);

        return balconyGroup;
    };

    // Function to create an entrance with better materials
    const createEntrance = (width: number, height: number, depth: number) => {
        const entranceGroup = new THREE.Group();

        // Entrance frame
        const frameGeometry = new THREE.BoxGeometry(width, height, depth);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.8,
            displacementScale: 0.1
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        entranceGroup.add(frame);

        // Entrance door
        const doorGeometry = new THREE.BoxGeometry(width - 0.4, height - 0.4, depth * 0.1);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.4,
            metalness: 0.6,
            displacementScale: 0.2
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        entranceGroup.add(door);

        // Entrance canopy
        const canopyGeometry = new THREE.BoxGeometry(width + 1, 0.3, depth + 1);
        const canopyMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.4,
            metalness: 0.6,
            displacementScale: 0.1
        });
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.position.y = height / 2 + 0.15;
        entranceGroup.add(canopy);

        // Entrance steps
        const stepsGeometry = new THREE.BoxGeometry(width + 2, 0.2, depth + 2);
        const stepsMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.7,
            metalness: 0.3,
            displacementScale: 0.2
        });
        const steps = new THREE.Mesh(stepsGeometry, stepsMaterial);
        steps.position.y = -0.1;
        entranceGroup.add(steps);

        return entranceGroup;
    };

    // Function to add decorative elements
    const addDecorativeElements = (model: THREE.Group) => {
        // Add corner trims
        const trimGeometry = new THREE.BoxGeometry(0.3, 25.2, 0.3);
        const trimMaterial = new THREE.MeshStandardMaterial({
            color: getColors().trim,
            roughness: 0.3,
            metalness: 0.8,
            displacementScale: 0.1
        });

        const positions = [
            [10.1, 12.5, 7.6],
            [10.1, 12.5, -7.6],
            [-10.1, 12.5, 7.6],
            [-10.1, 12.5, -7.6]
        ];

        positions.forEach(pos => {
            const trim = new THREE.Mesh(trimGeometry, trimMaterial);
            trim.position.set(pos[0], pos[1], pos[2]);
            model.add(trim);
        });

        // Add horizontal bands
        for (let i = 0; i < 5; i++) {
            const bandGeometry = new THREE.BoxGeometry(20.2, 0.2, 15.2);
            const bandMaterial = new THREE.MeshStandardMaterial({
                color: getColors().trim,
                roughness: 0.3,
                metalness: 0.8,
                displacementScale: 0.1
            });
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            band.position.y = 5 + i * 5;
            model.add(band);
        }
    };

    // Function to create a house with enhanced details
    const createHouse = (model: THREE.Group) => {
        // Main structure with better proportions
        const houseGeometry = new THREE.BoxGeometry(10, 6, 8);
        const houseMaterial = new THREE.MeshStandardMaterial({
            color: getColors().primary,
            roughness: 0.7,
            metalness: 0.2,
            displacementScale: 0.3,
            envMapIntensity: 1.2
        });
        const house = new THREE.Mesh(houseGeometry, houseMaterial);
        house.position.y = 3;
        house.castShadow = true;
        house.receiveShadow = true;
        model.add(house);

        // Enhanced roof with better materials
        const roofGeometry = new THREE.ConeGeometry(8, 4, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: getColors().secondary,
            roughness: 0.8,
            metalness: 0.1,
            displacementScale: 0.4,
            envMapIntensity: 1.0
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 8;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        model.add(roof);

        // Add windows with better materials and spacing
        const windowPositions = [
            { x: -3, z: 4.1, rotation: 0 },
            { x: 3, z: 4.1, rotation: 0 },
            { x: -3, z: -4.1, rotation: Math.PI },
            { x: 3, z: -4.1, rotation: Math.PI },
            { x: 5.1, z: -2, rotation: Math.PI / 2 },
            { x: 5.1, z: 2, rotation: Math.PI / 2 },
            { x: -5.1, z: -2, rotation: -Math.PI / 2 },
            { x: -5.1, z: 2, rotation: -Math.PI / 2 }
        ];

        windowPositions.forEach(pos => {
            const window = createWindow(1.2, 1.8, 0.1);
            window.position.set(pos.x, 3, pos.z);
            window.rotation.y = pos.rotation;
            model.add(window);
        });

        // Add entrance with better materials
        const entrance = createEntrance(2, 3, 2);
        entrance.position.set(0, 1.5, 4.1);
        model.add(entrance);

        // Add porch with better materials
        const porch = createPorch(4, 2, 3);
        porch.position.set(0, 0, 5);
        model.add(porch);

        // Add decorative elements
        addHouseDecorativeElements(model);
    };

    // Function to create a porch with better materials
    const createPorch = (width: number, height: number, depth: number) => {
        const porchGroup = new THREE.Group();

        // Porch floor
        const floorGeometry = new THREE.BoxGeometry(width, 0.2, depth);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.7,
            metalness: 0.3,
            displacementScale: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.1;
        porchGroup.add(floor);

        // Porch roof
        const roofGeometry = new THREE.BoxGeometry(width + 0.5, 0.2, depth + 0.5);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: getColors().secondary,
            roughness: 0.8,
            metalness: 0.1,
            displacementScale: 0.3
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = height;
        porchGroup.add(roof);

        // Porch columns
        const columnGeometry = new THREE.CylinderGeometry(0.15, 0.15, height, 8);
        const columnMaterial = new THREE.MeshStandardMaterial({
            color: getColors().stone,
            roughness: 0.6,
            metalness: 0.3,
            displacementScale: 0.2
        });

        const positions = [
            [-width / 2 + 0.3, 0, -depth / 2 + 0.3],
            [width / 2 - 0.3, 0, -depth / 2 + 0.3],
            [-width / 2 + 0.3, 0, depth / 2 - 0.3],
            [width / 2 - 0.3, 0, depth / 2 - 0.3]
        ];

        positions.forEach(pos => {
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set(pos[0], height / 2, pos[1]);
            porchGroup.add(column);
        });

        // Porch railing
        const railingGeometry = new THREE.BoxGeometry(width, 0.8, 0.1);
        const railingMaterial = new THREE.MeshStandardMaterial({
            color: getColors().trim,
            roughness: 0.4,
            metalness: 0.6,
            displacementScale: 0.1
        });

        const frontRailing = new THREE.Mesh(railingGeometry, railingMaterial);
        frontRailing.position.set(0, 0.4, -depth / 2);
        porchGroup.add(frontRailing);

        const sideRailingGeometry = new THREE.BoxGeometry(0.1, 0.8, depth);
        const leftRailing = new THREE.Mesh(sideRailingGeometry, railingMaterial);
        leftRailing.position.set(-width / 2, 0.4, 0);
        porchGroup.add(leftRailing);

        const rightRailing = new THREE.Mesh(sideRailingGeometry, railingMaterial);
        rightRailing.position.set(width / 2, 0.4, 0);
        porchGroup.add(rightRailing);

        return porchGroup;
    };

    // Function to add decorative elements to house
    const addHouseDecorativeElements = (group: THREE.Group) => {
        // Add window frames
        const frameGeometry = new THREE.BoxGeometry(1.4, 2, 0.15);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: getColors().trim,
            roughness: 0.4,
            metalness: 0.6,
            envMapIntensity: 1.2
        });

        // Front window frames
        for (let x = -3; x <= 3; x += 3) {
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(x, 3, 4.05);
            group.add(frame);
        }

        // Add door frame
        const doorFrameGeometry = new THREE.BoxGeometry(1.7, 2.7, 0.15);
        const doorFrame = new THREE.Mesh(doorFrameGeometry, frameMaterial);
        doorFrame.position.set(0, 1.35, 4.05);
        group.add(doorFrame);

        // Add decorative trim around the house
        const trimGeometry = new THREE.BoxGeometry(10.2, 0.2, 8.2);
        const trimMaterial = new THREE.MeshStandardMaterial({
            color: getColors().accent,
            roughness: 0.4,
            metalness: 0.6,
            envMapIntensity: 1.2
        });

        // Add trim at different heights
        for (let y of [1, 3, 5]) {
            const trim = new THREE.Mesh(trimGeometry, trimMaterial);
            trim.position.y = y;
            group.add(trim);
        }

        // Add corner trim
        const cornerTrimGeometry = new THREE.BoxGeometry(0.3, 6.2, 0.3);
        const cornerTrimMaterial = new THREE.MeshStandardMaterial({
            color: getColors().trim,
            roughness: 0.4,
            metalness: 0.6,
            envMapIntensity: 1.2
        });

        for (let x = -5; x <= 5; x += 10) {
            for (let z = -4; z <= 4; z += 8) {
                const cornerTrim = new THREE.Mesh(cornerTrimGeometry, cornerTrimMaterial);
                cornerTrim.position.set(x, 3, z);
                group.add(cornerTrim);
            }
        }
    };

    // Function to create an office building with enhanced details
    const createOfficeBuilding = (model: THREE.Group) => {
        // Main structure with better proportions
        const buildingGeometry = new THREE.BoxGeometry(15, 30, 15);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: getColors().primary,
            roughness: 0.7,
            metalness: 0.3,
            displacementScale: 0.2,
            envMapIntensity: 1.2
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.y = 15;
        building.castShadow = true;
        building.receiveShadow = true;
        model.add(building);

        // Enhanced facade with better materials
        const facadeGeometry = new THREE.BoxGeometry(15.1, 30.1, 15.1);
        const facadeMaterial = new THREE.MeshStandardMaterial({
            color: getColors().metal,
            roughness: 0.4,
            metalness: 0.3,
            displacementScale: 0.1,
            envMapIntensity: 1.5
        });
        const facade = new THREE.Mesh(facadeGeometry, facadeMaterial);
        facade.position.y = 15;
        facade.castShadow = true;
        facade.receiveShadow = true;
        model.add(facade);

        // Add windows with better materials and spacing
        const windowRows = 12;
        const windowCols = 5;
        const windowWidth = 1.8;
        const windowHeight = 2.2;
        const windowDepth = 0.1;
        const windowSpacing = 3;

        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                // Front windows
                const frontWindow = createWindow(windowWidth, windowHeight, windowDepth);
                frontWindow.position.set(
                    (col - 2) * windowSpacing,
                    3 + row * 2.5,
                    7.6
                );
                model.add(frontWindow);

                // Back windows
                const backWindow = createWindow(windowWidth, windowHeight, windowDepth);
                backWindow.position.set(
                    (col - 2) * windowSpacing,
                    3 + row * 2.5,
                    -7.6
                );
                backWindow.rotation.y = Math.PI;
                model.add(backWindow);

                // Side windows (alternating)
                if (col === 0 || col === windowCols - 1) {
                    const sideWindow = createWindow(windowHeight, windowWidth, windowDepth);
                    sideWindow.position.set(
                        col === 0 ? -7.6 : 7.6,
                        3 + row * 2.5,
                        (col - 2) * windowSpacing
                    );
                    sideWindow.rotation.y = Math.PI / 2;
                    model.add(sideWindow);
                }
            }
        }

        // Add entrance with better materials
        const entrance = createEntrance(6, 4, 3);
        entrance.position.set(0, 2, 7.6);
        model.add(entrance);

        // Add decorative elements
        addOfficeDecorativeElements(model);
    };

    // Function to add decorative elements to office building
    const addOfficeDecorativeElements = (group: THREE.Group) => {
        // Add corner trim
        const trimGeometry = new THREE.BoxGeometry(0.3, 30.1, 0.3);
        const trimMaterial = new THREE.MeshStandardMaterial({
            color: getColors().trim,
            roughness: 0.4,
            metalness: 0.6,
            envMapIntensity: 1.2
        });

        for (let x = -7.5; x <= 7.5; x += 15) {
            for (let z = -7.5; z <= 7.5; z += 15) {
                const trim = new THREE.Mesh(trimGeometry, trimMaterial);
                trim.position.set(x, 15, z);
                group.add(trim);
            }
        }

        // Add horizontal bands
        const bandGeometry = new THREE.BoxGeometry(15.2, 0.2, 15.2);
        const bandMaterial = new THREE.MeshStandardMaterial({
            color: getColors().accent,
            roughness: 0.4,
            metalness: 0.6,
            envMapIntensity: 1.2
        });

        // Add bands at different heights
        for (let y of [5, 10, 15, 20, 25]) {
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            band.position.y = y;
            group.add(band);
        }

        // Add entrance columns with better materials
        const columnGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 8);
        const columnMaterial = new THREE.MeshStandardMaterial({
            color: getColors().stone,
            roughness: 0.6,
            metalness: 0.3,
            envMapIntensity: 1.0
        });

        for (let x = -2.5; x <= 2.5; x += 5) {
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set(x, 2, 7.6);
            column.castShadow = true;
            group.add(column);
        }

        // Add entrance steps with better materials
        const stepsGeometry = new THREE.BoxGeometry(8, 0.2, 1);
        const stepsMaterial = new THREE.MeshStandardMaterial({
            color: getColors().concrete,
            roughness: 0.8,
            metalness: 0.2,
            envMapIntensity: 1.0
        });

        for (let z = 8.6; z <= 9.6; z += 0.2) {
            const step = new THREE.Mesh(stepsGeometry, stepsMaterial);
            step.position.set(0, 0.1, z);
            step.castShadow = true;
            group.add(step);
        }
    };

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                height,
                width,
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'opacity 0.5s ease-in-out',
                opacity: isLoaded ? 1 : 0
            }}
        >
            {!isLoaded && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    color: '#000'
                }}>
                    Loading 3D Model...
                </div>
            )}
        </div>
    );
};

export default PropertyModel3D;