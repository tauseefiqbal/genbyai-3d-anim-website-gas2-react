import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CtaOrbCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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
      console.warn('WebGL init CTA error', e);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Glowing core sphere
    const coreGeo = new THREE.SphereGeometry(1.25, 48, 48);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.88,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Dynamic Lattice Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.7, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    masterGroup.add(cageMesh);

    // Concentric Energy Halo
    const haloGeo = new THREE.TorusGeometry(2.1, 0.04, 16, 100);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 3;
    masterGroup.add(haloMesh);

    const halo2 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.03, 16, 100), haloMat);
    halo2.rotation.x = -Math.PI / 4;
    halo2.rotation.y = Math.PI / 6;
    masterGroup.add(halo2);

    // Sparkling Swarm
    const starCount = 90;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 2.0 + Math.random() * 1.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      starPos[i * 3 + 2] = r * Math.cos(ph);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x6366f1, 4);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const backLight = new THREE.DirectionalLight(0x38bdf8, 3);
    backLight.position.set(-5, -5, -4);
    scene.add(backLight);

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

    // Mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.current.targetX = x * 0.5;
      mouse.current.targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

      masterGroup.rotation.y = elapsed * 0.2 + mouse.current.x * 0.8;
      masterGroup.rotation.x = elapsed * 0.15 + mouse.current.y * 0.6;

      cageMesh.rotation.y = -elapsed * 0.25;
      haloMesh.rotation.z = elapsed * 0.4;
      halo2.rotation.z = -elapsed * 0.35;

      starField.rotation.y = elapsed * 0.05;

      // Pulsating breath scale
      const breath = 1 + Math.sin(elapsed * 2) * 0.04;
      coreMesh.scale.set(breath, breath, breath);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      coreGeo.dispose();
      cageGeo.dispose();
      haloGeo.dispose();
      starGeo.dispose();
      coreMat.dispose();
      cageMat.dispose();
      haloMat.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      <div className="absolute inset-0 radial-glow opacity-30" />
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
