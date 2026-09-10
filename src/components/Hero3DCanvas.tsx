import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Sparkles, Eye, RotateCw, Play, Pause } from 'lucide-react';
import { SceneConfig } from '../types';

interface Hero3DCanvasProps {
  config: SceneConfig;
  onConfigChange: (newConfig: Partial<SceneConfig>) => void;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ config, onConfigChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollOffset = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Detect WebGL capability safely
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL initialization fallback', e);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Group that holds the 3D sculpture
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Root sculpture object
    let meshGroup = new THREE.Group();
    mainGroup.add(meshGroup);

    // Material with high-end physical properties
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(config.color1),
      emissive: new THREE.Color(config.color2).multiplyScalar(0.2),
      roughness: config.roughness,
      metalness: config.metalness,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      wireframe: config.wireframe,
      reflectivity: 0.95,
      transparent: true,
      opacity: 0.94,
    });

    // Inner glow material
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.color2),
      roughness: 0.3,
      metalness: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });

    function buildGeometry(type: string) {
      // Clear previous children
      while (meshGroup.children.length > 0) {
        const obj = meshGroup.children[0];
        meshGroup.remove(obj);
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      }

      if (type === 'torusKnot') {
        const geom = new THREE.TorusKnotGeometry(1.6, 0.5, 180, 32, 2, 3);
        const mesh = new THREE.Mesh(geom, material);
        meshGroup.add(mesh);

        // Core floating sphere inside
        const innerGeom = new THREE.IcosahedronGeometry(0.85, 2);
        const innerMesh = new THREE.Mesh(innerGeom, innerMaterial);
        meshGroup.add(innerMesh);
      } else if (type === 'gyroscope') {
        // Gyroscopic 3-ring system
        const rings = [
          { r: 2.1, tube: 0.08, rot: [0, 0, 0] },
          { r: 1.7, tube: 0.07, rot: [Math.PI / 3, Math.PI / 4, 0] },
          { r: 1.3, tube: 0.06, rot: [-Math.PI / 3, 0, Math.PI / 4] },
        ];
        rings.forEach((ring, i) => {
          const geom = new THREE.TorusGeometry(ring.r, ring.tube, 24, 100);
          const ringMesh = new THREE.Mesh(geom, i === 1 ? innerMaterial : material);
          ringMesh.rotation.set(ring.rot[0], ring.rot[1], ring.rot[2]);
          ringMesh.name = `ring_${i}`;
          meshGroup.add(ringMesh);
        });

        // Center levitating polyhedral core
        const coreGeom = new THREE.DodecahedronGeometry(0.9, 1);
        const coreMesh = new THREE.Mesh(coreGeom, material);
        meshGroup.add(coreMesh);
      } else {
        // Quantum Core: Faceted icosahedron with concentric orbital cages
        const geom = new THREE.IcosahedronGeometry(1.8, 1);
        const mesh = new THREE.Mesh(geom, material);
        meshGroup.add(mesh);

        const cageGeom = new THREE.IcosahedronGeometry(2.3, 0);
        const cageMesh = new THREE.Mesh(cageGeom, innerMaterial);
        meshGroup.add(cageMesh);

        const centerSphere = new THREE.SphereGeometry(0.7, 32, 32);
        const centerMesh = new THREE.Mesh(centerSphere, material);
        meshGroup.add(centerMesh);
      }
    }

    buildGeometry(config.geometry);

    // Particle Cloud
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      particleScales[i] = Math.random() * 0.04 + 0.01;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(config.color2),
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x6366f1, 2.5);
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0xa855f7, 2.0, 12);
    accentLight.position.set(0, 3, 2);
    scene.add(accentLight);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    handleResize();

    // Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = x * 0.7;
      mousePos.current.targetY = y * 0.5;
    };

    const handleScroll = () => {
      scrollOffset.current = window.scrollY * 0.0015;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth mouse lerping
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      // Vertical floating sine wave
      const floatY = Math.sin(elapsedTime * 1.2) * 0.18;
      mainGroup.position.y = floatY - scrollOffset.current * 0.5;

      // Rotation
      if (isRotating) {
        const speed = config.speed * 0.5;
        meshGroup.rotation.y += 0.008 * speed;
        meshGroup.rotation.x += 0.004 * speed;
      }

      // Parallax tilt from mouse
      mainGroup.rotation.x = mousePos.current.y * 0.45;
      mainGroup.rotation.y = mousePos.current.x * 0.65;

      // Individual ring rotation for gyroscope
      if (config.geometry === 'gyroscope') {
        const r0 = meshGroup.getObjectByName('ring_0');
        const r1 = meshGroup.getObjectByName('ring_1');
        const r2 = meshGroup.getObjectByName('ring_2');
        if (r0) r0.rotation.z += 0.015 * config.speed;
        if (r1) r1.rotation.x -= 0.012 * config.speed;
        if (r2) r2.rotation.y += 0.018 * config.speed;
      }

      // Subtle particle slow swirl
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      particleGeometry.dispose();
      particleMaterial.dispose();
      material.dispose();
      innerMaterial.dispose();
      renderer.dispose();
    };
  }, [config.geometry, config.wireframe, config.color1, config.color2, config.metalness, config.roughness, config.speed, isRotating]);

  return (
    <div
      ref={containerRef}
      id="hero-3d-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[480px] sm:h-[540px] lg:h-[640px] flex items-center justify-center select-none"
    >
      {/* Background Soft Glow Radial Halo */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.color1} 0%, ${config.color2} 40%, transparent 70%)`,
        }}
      />

      {/* Primary 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        id="hero-webgl-canvas"
        className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Floating Interactive Micro HUD Controls */}
      <div
        className={`absolute bottom-4 right-4 z-20 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-80 sm:opacity-90 translate-y-1'
        }`}
      >
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 shadow-2xl">
          {/* Geometry Selector Pills */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl">
            <button
              id="geo-btn-torus"
              onClick={() => onConfigChange({ geometry: 'torusKnot' })}
              title="Quantum Torus"
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                config.geometry === 'torusKnot'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Torus
            </button>
            <button
              id="geo-btn-gyro"
              onClick={() => onConfigChange({ geometry: 'gyroscope' })}
              title="Gyroscopic Core"
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                config.geometry === 'gyroscope'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Gyro
            </button>
            <button
              id="geo-btn-quantum"
              onClick={() => onConfigChange({ geometry: 'quantumCore' })}
              title="Neural Icosahedron"
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                config.geometry === 'quantumCore'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Core
            </button>
          </div>

          <div className="w-[1px] h-5 bg-white/10" />

          {/* Wireframe toggle */}
          <button
            id="wireframe-toggle-btn"
            onClick={() => onConfigChange({ wireframe: !config.wireframe })}
            title={config.wireframe ? 'Switch to Solid Metallic' : 'Switch to Wireframe Lattice'}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              config.wireframe
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{config.wireframe ? 'Mesh' : 'Solid'}</span>
          </button>

          {/* Pause / Play Rotation */}
          <button
            id="pause-rotation-btn"
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Subtle Status Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono uppercase tracking-wider text-[10px] text-zinc-400">Interactive 3D Engine</span>
      </div>
    </div>
  );
};
