import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Layers,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Play,
  RotateCw,
  Eye,
  Maximize2,
  HardDrive,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

export const DashboardPreview: React.FC = () => {
  const [fps, setFps] = useState(120);
  const [drawCalls, setDrawCalls] = useState(18);
  const [activeTab, setActiveTab] = useState<'metrics' | 'shaders' | 'clusters'>('metrics');
  const [isSimulating, setIsSimulating] = useState(true);

  // Live telemetry pulse
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setFps(Math.floor(118 + Math.random() * 4));
      setDrawCalls(Math.floor(16 + Math.random() * 5));
    }, 1200);
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <section id="dashboard" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-4">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-Time Engine Telemetry</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
          Full Command Over Every Photon
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
          Monitor frame times, memory allocations, and continuous LOD tessellation directly through the Aether Spatial
          Console.
        </p>
      </div>

      {/* 3D Perspective Floating Dashboard Container */}
      <div className="relative mx-auto max-w-5xl [perspective:1400px]">
        <div
          className="relative transition-transform duration-700 ease-out hover:[transform:rotateX(2deg)_translateY(-8px)] [transform:rotateX(6deg)] rounded-3xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(99,102,241,0.15)]"
        >
          <div className="rounded-[22px] bg-[#090d16]/90 backdrop-blur-2xl border border-white/10 p-4 sm:p-6 lg:p-8">
            {/* Console Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-[1px] bg-white/15 mx-1" />
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  cluster-us-east // aether-v3.8.4
                </span>
              </div>

              {/* Action Tabs */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'metrics'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Live Telemetry
                </button>
                <button
                  onClick={() => setActiveTab('shaders')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'shaders'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Shader Pipeline
                </button>
                <button
                  onClick={() => setActiveTab('clusters')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'clusters'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Node Mesh
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-xs font-medium">Viewport FPS</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1.5">
                  <span>{fps}</span>
                  <span className="text-xs font-normal text-emerald-400">Stable</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full w-[98%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-xs font-medium">Draw Calls</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1.5">
                  <span>{drawCalls}</span>
                  <span className="text-xs font-normal text-cyan-400">Batch Culling</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full w-[22%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-xs font-medium">GPU VRAM</span>
                  <HardDrive className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1.5">
                  <span>1.42 GB</span>
                  <span className="text-xs font-normal text-zinc-400">/ 16 GB</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full w-[14%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-xs font-medium">Mesh Polygons</span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1.5">
                  <span>1.84M</span>
                  <span className="text-xs font-normal text-purple-400">Adaptive</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full w-[65%]" />
                </div>
              </div>
            </div>

            {/* Simulated Live Frame Time SVG Chart */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-white">Sub-Frame Latency Distribution (ms)</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Target: 8.33ms (120Hz)
                </span>
              </div>

              {/* Dynamic SVG Waveform */}
              <div className="h-28 w-full">
                <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="latencyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="25" x2="500" y2="25" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />

                  {/* Latency polygon fill */}
                  <path
                    d="M 0 65 Q 40 55, 80 62 T 160 58 T 240 60 T 320 54 T 400 63 T 500 58 L 500 100 L 0 100 Z"
                    fill="url(#latencyGrad)"
                  />
                  {/* Latency stroke line */}
                  <path
                    d="M 0 65 Q 40 55, 80 62 T 160 58 T 240 60 T 320 54 T 400 63 T 500 58"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                  />
                  {/* Pulse dot on the line */}
                  <circle cx="500" cy="58" r="4" fill="#38bdf8" className="animate-ping" />
                  <circle cx="500" cy="58" r="3" fill="#ffffff" />
                </svg>
              </div>

              {/* Bottom Console Event Log */}
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2 font-mono">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  draco-geometry-worker: 0 dropouts detected
                </span>
                <span className="text-zinc-500">Render cycle: 8.21ms • BVH Depth: 14</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Side Satellite Card 1 (Top Right) */}
        <div className="hidden lg:flex absolute -top-8 -right-8 z-20 p-4 rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl items-center gap-3 animate-pulse duration-1000 pointer-events-none">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400">WebGPU Enabled</div>
            <div className="text-sm font-bold text-white">4.2x Faster Compilation</div>
          </div>
        </div>

        {/* Floating Side Satellite Card 2 (Bottom Left) */}
        <div className="hidden lg:flex absolute -bottom-6 -left-8 z-20 p-4 rounded-2xl glass-panel border border-indigo-500/30 shadow-2xl items-center gap-3 pointer-events-none">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-indigo-300">Neural Raymarching</div>
            <div className="text-sm font-bold text-white">Sub-Millisecond Pathing</div>
          </div>
        </div>
      </div>
    </section>
  );
};
