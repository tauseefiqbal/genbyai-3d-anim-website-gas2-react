import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Activity, Maximize2, RefreshCw, Cpu, Zap, Shield, Sparkles, X } from 'lucide-react';
import { Hotspot } from '../types';

interface Showcase3DCanvasProps {
  activeHotspot: Hotspot | null;
  onSelectHotspot: (hotspot: Hotspot | null) => void;
  inspectionMode: 'standard' | 'thermal' | 'exploded' | 'wireframe';
  onModeChange: (mode: 'standard' | 'thermal' | 'exploded' | 'wireframe') => void;
}

export const SHOWCASE_HOTSPOTS: Hotspot[] = [
  {
    id: 'tensor-matrix',
    title: 'Neural Tensor Cluster',
    subtitle: '8,192 Hyper-Dimensional Processing Cores',
    description: 'Executes real-time volumetric raymarching, implicit surface calculations, and dynamic neural neural radiance rendering at 120 FPS.',
    position: [0, 0, 1.4],
    metric: '142.6 TFLOPS',
    metricLabel: 'Spatial Tensor Compute',
  },
  {
    id: 'cryo-cooling',
    title: 'Cryo-Photonic Chamber',
    subtitle: 'Sub-Kelvin Micro-Vapor Dissipation',
    description: 'Precision dielectric fluid chamber maintaining 0.002°C delta during sustained multi-million polygon procedural scene compilations.',
    position: [1.3, 0.8, -0.2],
    metric: '18.4 W/cm²',
    metricLabel: 'Heat Dissipation Flux',
  },
  {
    id: 'optical-bus',
    title: 'Quantum Optical Interconnect',
    subtitle: '10.4 Terabits/sec Photonic Bus',
    description: 'Zero-serialization memory bandwidth streaming unified scene graphs directly to client WebGL/WebGPU viewports.',
    position: [-1.4, -0.6, 0.4],
    metric: '<0.38 ms',
    metricLabel: 'Frame Streaming Latency',
  },
  {
    id: 'spatial-mesh',
    title: 'Adaptive Nanite Geometry Engine',
    subtitle: 'Continuous Level-of-Detail Tessellation',
    description: 'Dynamically clusters and culls sub-pixel geometric micro-polygons based on instantaneous viewport screen-space coverage.',
    position: [0.2, -1.3, -0.5],
    metric: '99.94%',
    metricLabel: 'Draw-Call Compression',
  },
];

export const Showcase3DCanvas: React.FC<Showcase3DCanvasProps> = ({
  activeHotspot,
  onSelectHotspot,
  inspectionMode,
  onModeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0.003, y: 0.005 });
  const targetRotation = useRef({ x: 0.3, y: 0.5 });
  const [screenHotspots, setScreenHotspots] = useState<Array<{ id: string; x: number; y: number; visible: boolean }>>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL init error in showcase', e);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // Master Container Group
    const deviceRoot = new THREE.Group();
    scene.add(deviceRoot);

    // Assembly Groups for exploded views
    const coreGroup = new THREE.Group();
    const ringUpperGroup = new THREE.Group();
    const ringLowerGroup = new THREE.Group();
    const shroudOuterGroup = new THREE.Group();
    const emitterPillarsGroup = new THREE.Group();

    deviceRoot.add(coreGroup);
    deviceRoot.add(ringUpperGroup);
    deviceRoot.add(ringLowerGroup);
    deviceRoot.add(shroudOuterGroup);
    deviceRoot.add(emitterPillarsGroup);

    // Color palettes based on inspection mode
    const getColors = (mode: string) => {
      if (mode === 'thermal') {
        return {
          primary: 0xef4444, // hot red
          secondary: 0xf59e0b, // amber
          core: 0x6366f1, // cool core
          metal: 0x221133,
        };
      }
      return {
        primary: 0x6366f1, // indigo
        secondary: 0x38bdf8, // cyan
        core: 0xa855f7, // purple
        metal: 0x0f172a,
      };
    };

    const colors = getColors(inspectionMode);

    // Materials
    const isWire = inspectionMode === 'wireframe';
    const mainMaterial = new THREE.MeshPhysicalMaterial({
      color: colors.primary,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: isWire,
      transparent: true,
      opacity: 0.92,
    });

    const darkChassisMaterial = new THREE.MeshStandardMaterial({
      color: colors.metal,
      metalness: 0.95,
      roughness: 0.35,
      wireframe: isWire,
    });

    const glowCoreMaterial = new THREE.MeshStandardMaterial({
      color: colors.core,
      emissive: new THREE.Color(colors.secondary),
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: isWire,
    });

    const glassShroudMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.8,
      ior: 1.5,
      transparent: true,
      opacity: 0.45,
      wireframe: isWire,
    });

    // 1. Central Quantum Core (Dodecahedron + nested crystalline sphere)
    const coreMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 1), glowCoreMaterial);
    coreGroup.add(coreMesh);

    const innerSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), mainMaterial);
    coreGroup.add(innerSphere);

    // 2. Upper Concentric Optical Ring
    const ringUpper = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.08, 16, 80), darkChassisMaterial);
    ringUpper.rotation.x = Math.PI / 2.2;
    ringUpperGroup.add(ringUpper);

    // Fine teeth gear ring
    const gearRing = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.15, 36, 1, true), mainMaterial);
    gearRing.rotation.x = Math.PI / 2.2;
    ringUpperGroup.add(gearRing);

    // 3. Lower Counter-rotating Ring
    const ringLower = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.07, 16, 80), darkChassisMaterial);
    ringLower.rotation.x = -Math.PI / 2.5;
    ringLowerGroup.add(ringLower);

    // 4. Outer Glass Containment Shroud
    const shroud = new THREE.Mesh(new THREE.IcosahedronGeometry(2.1, 1), glassShroudMaterial);
    shroudOuterGroup.add(shroud);

    // 5. Four Emitter Pillars
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16), darkChassisMaterial);
      pillar.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
      pillar.rotation.z = Math.cos(angle) * 0.15;
      emitterPillarsGroup.add(pillar);

      // Emitter lens bead
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), glowCoreMaterial);
      bead.position.set(Math.cos(angle) * 1.5, 1.1, Math.sin(angle) * 1.5);
      emitterPillarsGroup.add(bead);
    }

    // Floating orbital dust particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 120;
    const posArr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.2 + Math.random() * 1.8;
      const u = Math.random();
      const v = Math.random();
      const th = u * 2.0 * Math.PI;
      const ph = Math.acos(2.0 * v - 1.0);
      posArr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      posArr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      posArr[i * 3 + 2] = r * Math.cos(ph);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({
      color: colors.secondary,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 3.5);
    dirLight1.position.set(6, 6, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight2.position.set(-6, -4, -6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xa855f7, 3, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Mouse Drag Rotation
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      targetRotation.current.y += deltaX * 0.007;
      targetRotation.current.x += deltaY * 0.007;

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      targetRotation.current.y += deltaX * 0.007;
      targetRotation.current.x += deltaY * 0.007;

      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    handleResize();

    // Hotspot 3D-to-2D screen projector vector
    const tempVec = new THREE.Vector3();

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Exploded View Expansion animation (interpolated target positions)
      const isExploded = inspectionMode === 'exploded';
      const explodeFactor = isExploded ? 1.0 : 0.0;

      ringUpperGroup.position.y += ((isExploded ? 0.9 : 0.0) - ringUpperGroup.position.y) * 0.08;
      ringLowerGroup.position.y += ((isExploded ? -0.9 : 0.0) - ringLowerGroup.position.y) * 0.08;
      shroudOuterGroup.scale.lerp(new THREE.Vector3(1 + explodeFactor * 0.35, 1 + explodeFactor * 0.35, 1 + explodeFactor * 0.35), 0.08);
      emitterPillarsGroup.scale.lerp(new THREE.Vector3(1 + explodeFactor * 0.25, 1, 1 + explodeFactor * 0.25), 0.08);

      // Auto gentle idle rotation if not dragging
      if (!isDragging.current) {
        targetRotation.current.y += 0.003;
      }

      // Smooth damping
      deviceRoot.rotation.x += (targetRotation.current.x - deviceRoot.rotation.x) * 0.07;
      deviceRoot.rotation.y += (targetRotation.current.y - deviceRoot.rotation.y) * 0.07;

      // Internal piece rotations
      coreGroup.rotation.y = elapsed * 0.5;
      ringUpperGroup.rotation.z = elapsed * 0.3;
      ringLowerGroup.rotation.z = -elapsed * 0.4;
      dustParticles.rotation.y = -elapsed * 0.05;

      // Gentle vertical float
      deviceRoot.position.y = Math.sin(elapsed * 1.5) * 0.08;

      // Calculate 2D screen positions for hotspots
      const projected = SHOWCASE_HOTSPOTS.map((h) => {
        tempVec.set(h.position[0], h.position[1], h.position[2]);
        // Apply deviceRoot transformation to point
        tempVec.applyEuler(deviceRoot.rotation);
        tempVec.add(deviceRoot.position);

        const isVisible = tempVec.z > -0.5; // only visible when roughly facing camera
        tempVec.project(camera);

        const x = ((tempVec.x + 1) * container.clientWidth) / 2;
        const y = ((-tempVec.y + 1) * container.clientHeight) / 2;

        return { id: h.id, x, y, visible: isVisible };
      });

      setScreenHotspots(projected);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      particleGeo.dispose();
      particleMat.dispose();
      mainMaterial.dispose();
      darkChassisMaterial.dispose();
      glowCoreMaterial.dispose();
      glassShroudMaterial.dispose();
      renderer.dispose();
    };
  }, [inspectionMode]);

  return (
    <div
      ref={containerRef}
      id="showcase-3d-wrapper"
      className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex items-center justify-center select-none"
    >
      {/* Background Subtle Radial Nebula */}
      <div className="absolute inset-0 radial-glow opacity-40 pointer-events-none" />
      <div className="absolute inset-0 radial-glow-cyan opacity-25 pointer-events-none" />

      {/* Primary WebGL Interactive Canvas */}
      <canvas
        ref={canvasRef}
        id="showcase-webgl-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Top Floating Control Bar (Inspection Modes) */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto z-20 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 p-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
          <button
            id="mode-standard"
            onClick={() => onModeChange('standard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              inspectionMode === 'standard'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Physical
          </button>
          <button
            id="mode-exploded"
            onClick={() => onModeChange('exploded')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              inspectionMode === 'exploded'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Exploded View
          </button>
          <button
            id="mode-thermal"
            onClick={() => onModeChange('thermal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              inspectionMode === 'thermal'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Thermal Flux
          </button>
          <button
            id="mode-wireframe"
            onClick={() => onModeChange('wireframe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              inspectionMode === 'wireframe'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Lattice Mesh
          </button>
        </div>
      </div>

      {/* Floating 3D Interactive Hotspot Pins */}
      {screenHotspots.map((spot) => {
        const data = SHOWCASE_HOTSPOTS.find((h) => h.id === spot.id);
        if (!data || !spot.visible) return null;
        const isActive = activeHotspot?.id === spot.id;

        return (
          <div
            key={spot.id}
            id={`hotspot-pin-${spot.id}`}
            style={{
              transform: `translate(${spot.x}px, ${spot.y}px)`,
              left: 0,
              top: 0,
            }}
            className="absolute z-20 -ml-4 -mt-4 transition-all duration-75 pointer-events-auto"
          >
            <button
              onClick={() => onSelectHotspot(isActive ? null : data)}
              className={`relative group flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                isActive
                  ? 'bg-indigo-500 border-white text-white scale-125 shadow-lg shadow-indigo-500/50'
                  : 'bg-black/80 border-indigo-400/60 text-indigo-300 hover:scale-110 hover:border-cyan-400'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-white' : 'bg-cyan-400'} animate-ping opacity-60 absolute`} />
              <span className="w-2 h-2 rounded-full bg-cyan-300" />
            </button>
          </div>
        );
      })}

      {/* Interactive Hotspot Inspector Card Modal */}
      {activeHotspot && (
        <div
          id="hotspot-detail-card"
          className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-84 z-30 p-5 rounded-2xl bg-[#090d16]/95 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Subsystem Telemetry</span>
            </div>
            <button
              onClick={() => onSelectHotspot(null)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="mt-2.5 text-base font-bold text-white tracking-tight">{activeHotspot.title}</h4>
          <p className="text-xs text-indigo-300/90 font-medium">{activeHotspot.subtitle}</p>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">{activeHotspot.description}</p>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">{activeHotspot.metricLabel}</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {activeHotspot.metric}
            </span>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-6 z-10 hidden sm:flex items-center gap-2 text-xs text-zinc-400 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Click & drag to rotate • Click hotspots for subsystem telemetry</span>
      </div>
    </div>
  );
};
