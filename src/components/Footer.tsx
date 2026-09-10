import React from 'react';
import { Box, Github, Twitter, Linkedin, Disc as Discord, ArrowUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040508] border-t border-white/10 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full rounded-xl bg-[#070a12] flex items-center justify-center">
                  <Box className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <span className="text-base font-extrabold tracking-wider font-display text-white">AETHER</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              The high-performance spatial graphics runtime. Accelerating real-time 3D, procedural materials, and
              hardware-accelerated WebGL across connected global experiences.
            </p>
            <div className="flex items-center gap-3 pt-2 text-zinc-400">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <Discord className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Engine */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white mb-4">Architecture</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-white transition-colors">Neural Path Tracing</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Adaptive Nanite LOD</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">Photonic Streaming</a></li>
              <li><a href="#dashboard" className="hover:text-white transition-colors">Console Telemetry</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Edge Nodes</a></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white mb-4">Developers</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">SDK Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Three.js Bindings</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WebGPU Migration</a></li>
              <li><a href="#" className="hover:text-white transition-colors">USDZ Pipeline Spec</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub Repository</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">Spatial Research</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Engineering Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security & SOC2</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press Inquiries</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-400">All 3D edge clusters operational // Latency &lt; 0.38ms</span>
          </div>

          <p>© {new Date().getFullYear()} Aether Spatial Technologies, Inc. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
