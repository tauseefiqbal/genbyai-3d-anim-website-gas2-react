import React from 'react';
import { Box, Cpu, Eye, Zap, Layers, Sparkles, Orbit, Compass, Gauge, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { TiltCard } from './TiltCard';

const FEATURES = [
  {
    id: 'feat-pathtracing',
    title: 'Real-Time Neural Path Tracing',
    category: 'Spatial Optics',
    description: 'Hardware-accelerated dielectric subsurface scattering, multi-bounce ambient occlusion, and cinematic screen-space reflections in the browser.',
    icon: Eye,
    stats: '120 FPS / 4K',
    glowColor: 'rgba(99, 102, 241, 0.3)',
    badge: 'Zero Latency',
  },
  {
    id: 'feat-lod',
    title: 'Sub-Pixel Adaptive Nanite LOD',
    category: 'Geometry Engine',
    description: 'Dynamic continuous level-of-detail tessellation that streams millions of procedural polygons without frame drop or memory spikes.',
    icon: Layers,
    stats: '10M+ Polys',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    badge: 'Patented',
  },
  {
    id: 'feat-streaming',
    title: 'Instant Photonic Streaming',
    category: 'Network Protocol',
    description: 'Sub-millisecond WebRTC binary scene graph synchronization with edge shader compilation and delta-compressed state replication.',
    icon: Zap,
    stats: '<0.4ms RTT',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    badge: 'Edge Deployed',
  },
  {
    id: 'feat-physics',
    title: 'Kinematic Quantum Physics',
    category: 'Simulation',
    description: 'Rigid body spatial collision meshes, soft-body cloth elasticity, and GPU compute particle vortices that react to user touch and cursor drag.',
    icon: Orbit,
    stats: '60K Particles',
    glowColor: 'rgba(236, 72, 153, 0.3)',
    badge: 'GPU Compute',
  },
  {
    id: 'feat-ai-shaders',
    title: 'Generative Neural Shaders',
    category: 'AI Pipeline',
    description: 'Natural language shader synthesis that converts descriptive prompts into optimized GLSL fragment code and physically based materials.',
    icon: Sparkles,
    stats: 'Auto-Compiled',
    glowColor: 'rgba(34, 197, 94, 0.3)',
    badge: 'Gemini Powered',
  },
  {
    id: 'feat-pipeline',
    title: 'Universal 3D Asset Pipeline',
    category: 'Ecosystem',
    description: 'Seamless lossless ingestion of USDZ, GLTF, FBX, and OBJ models with automatic Draco compression and PBR texture map baking.',
    icon: Box,
    stats: '1-Click Export',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    badge: 'Cross-Platform',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Spatial Computing</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
          Engineered for Extreme Fidelity & Speed
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
          Every component in the Aether architecture is purpose-built to eliminate latency, optimize WebGL rendering
          pipelines, and bring Hollywood-grade interactive 3D to any browser.
        </p>
      </div>

      {/* Feature Grid with 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <TiltCard
              key={item.id}
              id={item.id}
              glowColor={item.glowColor}
              className="p-7 flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Icon and Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 transition-all duration-300">
                    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <span className="text-xs font-mono text-cyan-400 font-medium uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5 mb-3 group-hover:text-indigo-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Meta & Metric */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Benchmark Performance</span>
                <div className="flex items-center gap-1 font-mono font-semibold text-emerald-400">
                  <span>{item.stats}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
};
