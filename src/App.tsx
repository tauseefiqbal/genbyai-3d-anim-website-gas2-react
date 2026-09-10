import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  Layers,
  ChevronDown,
  ShieldCheck,
  Zap,
  Globe2,
  Maximize2,
  Terminal,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero3DCanvas } from './components/Hero3DCanvas';
import { Showcase3DCanvas, SHOWCASE_HOTSPOTS } from './components/Showcase3DCanvas';
import { Features } from './components/Features';
import { Stats } from './components/Stats';
import { DashboardPreview } from './components/DashboardPreview';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { AiShaderCopilot } from './components/AiShaderCopilot';
import { DemoModal } from './components/DemoModal';
import { Hotspot, PricingPlan, SceneConfig } from './types';

export default function App() {
  // Global 3D Scene Config for Hero
  const [heroConfig, setHeroConfig] = useState<SceneConfig>({
    geometry: 'torusKnot',
    color1: '#6366f1', // Indigo
    color2: '#38bdf8', // Cyan
    wireframe: false,
    roughness: 0.15,
    metalness: 0.88,
    speed: 1.0,
    particleDensity: 180,
  });

  // Showcase state
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(SHOWCASE_HOTSPOTS[0]);
  const [inspectionMode, setInspectionMode] = useState<'standard' | 'thermal' | 'exploded' | 'wireframe'>('standard');

  // Modals
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const handleHeroConfigChange = (newConfig: Partial<SceneConfig>) => {
    setHeroConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsDemoModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#05060b] text-[#f1f4f9] selection:bg-indigo-500/30 selection:text-white">
      {/* Dynamic Ambient Background Nebulas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[15%] w-[650px] h-[650px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] right-[5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Modern Sticky Navigation */}
      <Navbar
        onOpenDemo={() => {
          setSelectedPlan(null);
          setIsDemoModalOpen(true);
        }}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* ================= HERO SECTION ================= */}
        <section
          id="hero"
          className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[90vh] flex items-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
              {/* Release Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-zinc-300 font-mono">Aether Spatial 3.8</span>
                <span className="text-zinc-500">•</span>
                <span className="text-cyan-400 font-medium">Real-time WebGL Engine</span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.08]">
                Intelligent 3D computing for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-white">next generation.</span>
              </h1>

              {/* Supporting Subheading */}
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Render cinematic, physically based 3D worlds directly in the browser at 120 FPS. Powered by sub-pixel
                adaptive LOD, neural shaders, and instant edge streaming.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-primary-cta"
                  onClick={() => {
                    setSelectedPlan(null);
                    setIsDemoModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Launch Interactive Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  id="hero-secondary-cta"
                  href="#showcase"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white font-semibold text-sm backdrop-blur-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Explore 3D Showcase</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>WebGPU & WebGL 2.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Sub-0.4ms Latency</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-indigo-400" />
                  <span>Universal USDZ / GLTF</span>
                </div>
              </div>
            </div>

            {/* Right Interactive 3D Hero Object Column */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <Hero3DCanvas config={heroConfig} onConfigChange={handleHeroConfigChange} />
            </div>
          </div>
        </section>

        {/* ================= STATISTICS SECTION ================= */}
        <Stats />

        {/* ================= DEDICATED 3D SHOWCASE SECTION ================= */}
        <section id="showcase" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-4">
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Architecture Inspection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
              Aether Neural Core Architecture
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
              Rotate, expand, and inspect each hardware subsystem in real-time 3D space. Click any hotspot to stream live
              telemetry metrics.
            </p>
          </div>

          {/* 3D Showcase with Hotspots and Exploded View */}
          <Showcase3DCanvas
            activeHotspot={activeHotspot}
            onSelectHotspot={setActiveHotspot}
            inspectionMode={inspectionMode}
            onModeChange={setInspectionMode}
          />

          {/* Surrounding Hotspot Telemetry Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {SHOWCASE_HOTSPOTS.map((h) => {
              const isSelected = activeHotspot?.id === h.id;
              return (
                <button
                  key={h.id}
                  id={`card-hotspot-${h.id}`}
                  onClick={() => setActiveHotspot(isSelected ? null : h)}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/60 shadow-lg shadow-indigo-500/10 border'
                      : 'bg-[#090d16]/70 border border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">{h.metricLabel}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{h.metric}</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">{h.title}</div>
                  <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{h.description}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <Features />

        {/* ================= DASHBOARD & CONSOLE SECTION ================= */}
        <DashboardPreview />

        {/* ================= TESTIMONIALS SECTION ================= */}
        <Testimonials />

        {/* ================= PRICING SECTION ================= */}
        <Pricing onSelectPlan={handleSelectPlan} />

        {/* ================= FINAL CTA SECTION WITH 3D ORB ================= */}
        <CtaSection
          onRequestDemo={() => {
            setSelectedPlan(null);
            setIsDemoModalOpen(true);
          }}
        />
      </main>

      {/* Modern Footer */}
      <Footer />

      {/* Floating Action Button for AI Shader Copilot */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="fab-ai-copilot"
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-2xl shadow-indigo-500/40 border border-indigo-400/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>AI Shader Copilot</span>
        </button>
      </div>

      {/* AI Shader Copilot Modal */}
      <AiShaderCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        config={heroConfig}
        onApplyConfig={handleHeroConfigChange}
      />

      {/* Enterprise Consultation / Demo Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
