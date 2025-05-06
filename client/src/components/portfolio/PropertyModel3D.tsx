'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
    const animationFrameRef = useRef<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Color palette based on German flag (black, red, gold) with modern architectural tones
    const getColors = () => {
        const palettes = {
            modern: {
                primary: 0x1e3a8a,   // Deep blue
                secondary: 0x0ea5e9,  // Sky blue
                accent: 0xf0f9ff,     // Bright white
                glass: 0x38bdf8,      // Light blue for windows
            },
            classic: {
                primary: 0x7c2d12,    // Rich brown
                secondary: 0xb45309,  // Amber brown
                accent: 0xfffbeb,     // Cream
                glass: 0x7dd3fc,      // Soft blue
            },
            german: {
                primary: 0x000000,    // Black (German flag)
                secondary: 0xff0000,  // Bright red (German flag)
                accent: 0xffce00,     // Gold (German flag)
                glass: 0x0077b6,      // Vibrant blue accent for glass
            }
        };

        return palettes[colorScheme];
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(15, 10, 15);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 10;
        controls.maxDistance = 30;
        controls.maxPolarAngle = Math.PI / 2;
        controlsRef.current = controls;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);

        // Add spot light for dramatic effect
        const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(-10, 15, -5);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.3;
        spotLight.castShadow = true;
        scene.add(spotLight);

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            roughness: 0.8,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        scene.add(ground);

        // Create property model based on type
        createPropertyModel();

        // Animation loop
        const animate = () => {
            if (controlsRef.current) controlsRef.current.update();

            if (modelRef.current) {
                // Subtle rotation of the model
                modelRef.current.rotation.y += 0.002;
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Wait a bit for the animation to start before showing
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
        };
    }, [width, height, propertyType, colorScheme]);

    // Function to create different property models
    const createPropertyModel = () => {
        if (!sceneRef.current) return;

        // Clean up existing model
        if (modelRef.current) {
            sceneRef.current.remove(modelRef.current);
        }

        const colors = getColors();
        const model = new THREE.Group();
        modelRef.current = model;

        switch (propertyType) {
            case 'apartment':
                createApartmentBuilding(model, colors);
                break;
            case 'house':
                createHouse(model, colors);
                break;
            case 'building':
            default:
                createOfficeBuilding(model, colors);
                break;
        }

        sceneRef.current.add(model);
    };

    // Create a modern apartment building
    const createApartmentBuilding = (group: THREE.Group, colors: any) => {
        // Main structure - a tall rectangular building
        const buildingGeometry = new THREE.BoxGeometry(10, 20, 10);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: colors.primary,
            roughness: 0.7,
            metalness: 0.2
        });

        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.y = 10;
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);

        // Add windows (grid pattern)
        const windowGeometry = new THREE.BoxGeometry(1.2, 1.8, 0.1);
        const windowMaterial = new THREE.MeshPhysicalMaterial({
            color: colors.glass,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.9,
            transmission: 0.5,
        });

        // Front and back windows
        for (let y = 2; y < 19; y += 3) {
            for (let x = -3.5; x <= 3.5; x += 2.5) {
                const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                windowMesh.position.set(x, y, 5.05);
                group.add(windowMesh);

                const windowBack = windowMesh.clone();
                windowBack.position.z = -5.05;
                group.add(windowBack);
            }
        }

        // Side windows
        for (let y = 2; y < 19; y += 3) {
            for (let z = -3.5; z <= 3.5; z += 2.5) {
                const windowSide = new THREE.Mesh(windowGeometry, windowMaterial);
                windowSide.rotation.y = Math.PI / 2;
                windowSide.position.set(5.05, y, z);
                group.add(windowSide);

                const windowSideBack = windowSide.clone();
                windowSideBack.position.x = -5.05;
                group.add(windowSideBack);
            }
        }

        // Add balconies on one side
        const balconyGeometry = new THREE.BoxGeometry(2.5, 0.3, 1.5);
        const balconyMaterial = new THREE.MeshStandardMaterial({
            color: colors.accent,
            roughness: 0.6
        });

        const railingGeometry = new THREE.BoxGeometry(2.5, 1, 0.1);
        const railingMaterial = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            roughness: 0.5,
            metalness: 0.5
        });

        for (let y = 2; y < 19; y += 3) {
            for (let x = -3.5; x <= 3.5; x += 2.5) {
                // Skip some balconies randomly for variety
                if (Math.random() > 0.7) continue;

                const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
                balcony.position.set(x, y - 0.9, 6);
                balcony.castShadow = true;
                group.add(balcony);

                const railing = new THREE.Mesh(railingGeometry, railingMaterial);
                railing.position.set(x, y - 0.3, 6.7);
                group.add(railing);

                const railingSide1 = new THREE.Mesh(
                    new THREE.BoxGeometry(0.1, 1, 1.5),
                    railingMaterial
                );
                railingSide1.position.set(x + 1.2, y - 0.3, 6);
                group.add(railingSide1);

                const railingSide2 = new THREE.Mesh(
                    new THREE.BoxGeometry(0.1, 1, 1.5),
                    railingMaterial
                );
                railingSide2.position.set(x - 1.2, y - 0.3, 6);
                group.add(railingSide2);
            }
        }

        // Add roof features
        const roofAccentGeometry = new THREE.BoxGeometry(11, 1, 11);
        const roofAccentMaterial = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            roughness: 0.6
        });
        const roofAccent = new THREE.Mesh(roofAccentGeometry, roofAccentMaterial);
        roofAccent.position.y = 20.5;
        group.add(roofAccent);

        // Add entrance
        const entranceGeometry = new THREE.BoxGeometry(4, 3, 2);
        const entranceMaterial = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            roughness: 0.6
        });
        const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
        entrance.position.set(0, 1.5, 6);
        group.add(entrance);

        // Add entrance door
        const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.1);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: colors.accent,
            roughness: 0.3,
            metalness: 0.7
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.25, 7.01);
        group.add(door);
    };

    // Create a modern house
    const createHouse = (group: THREE.Group, colors: any) => {
        // Main structure - house base
        const baseGeometry = new THREE.BoxGeometry(12, 5, 10);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: colors.primary,
            roughness: 0.8
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 2.5;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Roof - sloped modern
        const roofGeometry = new THREE.BoxGeometry(14, 0.5, 12);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            roughness: 0.6
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 5.25;
        roof.castShadow = true;
        group.add(roof);

        // Second floor - smaller box on top
        const secondFloorGeometry = new THREE.BoxGeometry(10, 4, 8);
        const secondFloorMaterial = new THREE.MeshStandardMaterial({
            color: colors.accent,
            roughness: 0.7
        });
        const secondFloor = new THREE.Mesh(secondFloorGeometry, secondFloorMaterial);
        secondFloor.position.y = 7.5;
        secondFloor.castShadow = true;
        group.add(secondFloor);

        // Second floor roof
        const topRoofGeometry = new THREE.BoxGeometry(11, 0.5, 9);
        const topRoof = new THREE.Mesh(topRoofGeometry, roofMaterial);
        topRoof.position.y = 9.75;
        topRoof.castShadow = true;
        group.add(topRoof);

        // Windows - ground floor
        const windowGeometry = new THREE.BoxGeometry(2.5, 3, 0.1);
        const windowMaterial = new THREE.MeshPhysicalMaterial({
            color: colors.glass,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.9,
            transmission: 0.5,
        });

        // Front windows - ground floor
        for (let x = -4; x <= 4; x += 4) {
            const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMesh.position.set(x, 2.5, 5.05);
            group.add(windowMesh);
        }

        // Front windows - second floor
        for (let x = -3; x <= 3; x += 3) {
            const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMesh.position.set(x, 7.5, 4.05);
            group.add(windowMesh);
        }

        // Side windows
        for (let z = -3; z <= 3; z += 3) {
            // Ground floor
            const sideWindow1 = new THREE.Mesh(windowGeometry, windowMaterial);
            sideWindow1.rotation.y = Math.PI / 2;
            sideWindow1.position.set(6.05, 2.5, z);
            group.add(sideWindow1);

            const sideWindow2 = new THREE.Mesh(windowGeometry, windowMaterial);
            sideWindow2.rotation.y = Math.PI / 2;
            sideWindow2.position.set(-6.05, 2.5, z);
            group.add(sideWindow2);

            // Second floor
            const sideWindow3 = new THREE.Mesh(windowGeometry, windowMaterial);
            sideWindow3.rotation.y = Math.PI / 2;
            sideWindow3.position.set(5.05, 7.5, z);
            group.add(sideWindow3);

            const sideWindow4 = new THREE.Mesh(windowGeometry, windowMaterial);
            sideWindow4.rotation.y = Math.PI / 2;
            sideWindow4.position.set(-5.05, 7.5, z);
            group.add(sideWindow4);
        }

        // Door
        const doorGeometry = new THREE.BoxGeometry(2, 4, 0.2);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            roughness: 0.3,
            metalness: 0.7
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 2, 5.1);
        group.add(door);

        // Garage
        const garageGeometry = new THREE.BoxGeometry(5, 4, 6);
        const garageMaterial = new THREE.MeshStandardMaterial({
            color: colors.primary,
            roughness: 0.8
        });
        const garage = new THREE.Mesh(garageGeometry, garageMaterial);
        garage.position.set(-8.5, 2, 0);
        group.add(garage);

        // Garage door
        const garageDoorGeometry = new THREE.BoxGeometry(4, 3, 0.1);
        const garageDoor = new THREE.Mesh(garageDoorGeometry, doorMaterial);
        garageDoor.position.set(-8.5, 1.5, 3.05);
        group.add(garageDoor);

        // Garage roof
        const garageRoofGeometry = new THREE.BoxGeometry(6, 0.5, 7);
        const garageRoof = new THREE.Mesh(garageRoofGeometry, roofMaterial);
        garageRoof.position.set(-8.5, 4.25, 0);
        group.add(garageRoof);

        // Terrace
        const terraceGeometry = new THREE.BoxGeometry(8, 0.3, 5);
        const terraceMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.9
        });
        const terrace = new THREE.Mesh(terraceGeometry, terraceMaterial);
        terrace.position.set(0, 0.15, 7.5);
        group.add(terrace);

        // Decorative elements - modern pillars
        const pillarGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
        const pillarMaterial = new THREE.MeshStandardMaterial({
            color: colors.accent,
            roughness: 0.3,
            metalness: 0.8
        });

        for (let x = -3.5; x <= 3.5; x += 7) {
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(x, 2.5, 7.5);
            group.add(pillar);
        }
    };

    // Create a modern office building
    const createOfficeBuilding = (group: THREE.Group, colors: any) => {
        // Main structure - a tall building with setbacks
        const baseGeometry = new THREE.BoxGeometry(16, 10, 16);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: colors.primary,
            roughness: 0.5,
            metalness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 5;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Middle section
        const midGeometry = new THREE.BoxGeometry(14, 15, 14);
        const midMaterial = new THREE.MeshStandardMaterial({
            color: colors.primary,
            roughness: 0.5,
            metalness: 0.3
        });
        const mid = new THREE.Mesh(midGeometry, midMaterial);
        mid.position.y = 17.5;
        mid.castShadow = true;
        group.add(mid);

        // Top section
        const topGeometry = new THREE.BoxGeometry(10, 10, 10);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: colors.primary,
            roughness: 0.5,
            metalness: 0.3
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 30;
        top.castShadow = true;
        group.add(top);

        // Windows - create a glass curtain wall effect
        createGlassCurtainWall(group, base, colors.glass);
        createGlassCurtainWall(group, mid, colors.glass);
        createGlassCurtainWall(group, top, colors.glass);

        // Add architectural details

        // Spire/antenna on top
        const spireGeometry = new THREE.CylinderGeometry(0.2, 0.4, 8, 8);
        const spireMaterial = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            roughness: 0.3,
            metalness: 0.8
        });
        const spire = new THREE.Mesh(spireGeometry, spireMaterial);
        spire.position.y = 39;
        group.add(spire);

        // Decorative horizontal bands
        const bandGeometry1 = new THREE.BoxGeometry(16.2, 0.5, 16.2);
        const bandMaterial = new THREE.MeshStandardMaterial({
            color: colors.accent,
            roughness: 0.3,
            metalness: 0.7
        });

        const band1 = new THREE.Mesh(bandGeometry1, bandMaterial);
        band1.position.y = 10.1;
        group.add(band1);

        const bandGeometry2 = new THREE.BoxGeometry(14.2, 0.5, 14.2);
        const band2 = new THREE.Mesh(bandGeometry2, bandMaterial);
        band2.position.y = 25.1;
        group.add(band2);

        // Entrance feature
        const entranceBaseGeometry = new THREE.BoxGeometry(10, 0.5, 8);
        const entranceBase = new THREE.Mesh(entranceBaseGeometry, bandMaterial);
        entranceBase.position.set(0, 0.25, 12);
        group.add(entranceBase);

        // Entrance columns
        for (let x = -4; x <= 4; x += 8) {
            const columnGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
            const column = new THREE.Mesh(columnGeometry, baseMaterial);
            column.position.set(x, 2.5, 12);
            group.add(column);
        }

        // Entrance canopy
        const canopyGeometry = new THREE.BoxGeometry(10, 0.3, 4);
        const canopy = new THREE.Mesh(canopyGeometry, bandMaterial);
        canopy.position.set(0, 5, 12);
        group.add(canopy);

        // Entrance doors - revolving glass door effect
        const doorGeometry = new THREE.CylinderGeometry(2, 2, 4, 20);
        const doorMaterial = new THREE.MeshPhysicalMaterial({
            color: colors.glass,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.8,
            transmission: 0.4
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 2, 12);
        group.add(door);

        // Add some subtle rotation to better see the model
        group.rotation.y = Math.PI / 6;
    };

    // Helper to create glass curtain wall effect
    const createGlassCurtainWall = (group: THREE.Group, buildingPart: THREE.Mesh, glassColor: number) => {
        const size = buildingPart.geometry instanceof THREE.BoxGeometry ?
            {
                width: buildingPart.geometry.parameters.width,
                height: buildingPart.geometry.parameters.height,
                depth: buildingPart.geometry.parameters.depth
            } :
            { width: 10, height: 10, depth: 10 };

        const position = buildingPart.position;

        // Grid material
        const gridMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.8
        });

        // Glass material
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: glassColor,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.7,
            transmission: 0.4
        });

        // Create window panels - front and back
        const panelWidth = 1.8;
        const panelHeight = 2.2;
        const panelGeometry = new THREE.BoxGeometry(panelWidth, panelHeight, 0.05);

        const halfWidth = size.width / 2;
        const halfDepth = size.depth / 2;
        const startHeight = position.y - size.height / 2 + 1;
        const endHeight = position.y + size.height / 2 - 1;

        // Front and back panels
        for (let y = startHeight; y < endHeight; y += panelHeight + 0.3) {
            for (let x = -halfWidth + 1.5; x < halfWidth; x += panelWidth + 0.3) {
                // Front panel
                const frontPanel = new THREE.Mesh(panelGeometry, glassMaterial);
                frontPanel.position.set(x, y, halfDepth + 0.03);
                group.add(frontPanel);

                // Back panel
                const backPanel = new THREE.Mesh(panelGeometry, glassMaterial);
                backPanel.position.set(x, y, -halfDepth - 0.03);
                group.add(backPanel);
            }
        }

        // Side panels
        for (let y = startHeight; y < endHeight; y += panelHeight + 0.3) {
            for (let z = -halfDepth + 1.5; z < halfDepth; z += panelWidth + 0.3) {
                // Left panel
                const leftPanel = new THREE.Mesh(panelGeometry, glassMaterial);
                leftPanel.rotation.y = Math.PI / 2;
                leftPanel.position.set(-halfWidth - 0.03, y, z);
                group.add(leftPanel);

                // Right panel
                const rightPanel = new THREE.Mesh(panelGeometry, glassMaterial);
                rightPanel.rotation.y = Math.PI / 2;
                rightPanel.position.set(halfWidth + 0.03, y, z);
                group.add(rightPanel);
            }
        }

        // Add vertical grid lines
        const gridVerticalGeometry = new THREE.BoxGeometry(0.2, size.height, 0.2);

        // Front and back vertical grids
        for (let x = -halfWidth + 1.5; x < halfWidth; x += panelWidth + 0.3) {
            // Front grid line
            const frontGrid = new THREE.Mesh(gridVerticalGeometry, gridMaterial);
            frontGrid.position.set(x, position.y, halfDepth + 0.1);
            group.add(frontGrid);

            // Back grid line
            const backGrid = new THREE.Mesh(gridVerticalGeometry, gridMaterial);
            backGrid.position.set(x, position.y, -halfDepth - 0.1);
            group.add(backGrid);
        }

        // Side vertical grids
        for (let z = -halfDepth + 1.5; z < halfDepth; z += panelWidth + 0.3) {
            // Left grid line
            const leftGrid = new THREE.Mesh(gridVerticalGeometry, gridMaterial);
            leftGrid.position.set(-halfWidth - 0.1, position.y, z);
            group.add(leftGrid);

            // Right grid line
            const rightGrid = new THREE.Mesh(gridVerticalGeometry, gridMaterial);
            rightGrid.position.set(halfWidth + 0.1, position.y, z);
            group.add(rightGrid);
        }

        // Add horizontal grid lines
        for (let y = startHeight; y < endHeight; y += panelHeight + 0.3) {
            // Create a horizontal grid line that goes around the building
            const frontBackGridGeometry = new THREE.BoxGeometry(size.width, 0.2, 0.2);

            // Front horizontal grid
            const frontGrid = new THREE.Mesh(frontBackGridGeometry, gridMaterial);
            frontGrid.position.set(0, y, halfDepth + 0.1);
            group.add(frontGrid);

            // Back horizontal grid
            const backGrid = new THREE.Mesh(frontBackGridGeometry, gridMaterial);
            backGrid.position.set(0, y, -halfDepth - 0.1);
            group.add(backGrid);

            // Side horizontal grids
            const sideGridGeometry = new THREE.BoxGeometry(0.2, 0.2, size.depth);

            // Left horizontal grid
            const leftGrid = new THREE.Mesh(sideGridGeometry, gridMaterial);
            leftGrid.position.set(-halfWidth - 0.1, y, 0);
            group.add(leftGrid);

            // Right horizontal grid
            const rightGrid = new THREE.Mesh(sideGridGeometry, gridMaterial);
            rightGrid.position.set(halfWidth + 0.1, y, 0);
            group.add(rightGrid);
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
            {/* Loading indicator */}
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