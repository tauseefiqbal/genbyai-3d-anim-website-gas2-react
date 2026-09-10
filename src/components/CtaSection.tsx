import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { CtaOrbCanvas } from './CtaOrbCanvas';

interface CtaSectionProps {
  onRequestDemo: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onRequestDemo }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ message: string; queueNumber?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid work email.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({
          message: data.message || 'Priority access reserved!',
          queueNumber: data.queueNumber || 142,
        });
        setEmail('');
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      // Offline / fallback simulation
      setResult({
        message: 'Priority access reserved! Welcome to the Aether early access roster.',
        queueNumber: Math.floor(Math.random() * 300) + 110,
      });
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="relative rounded-3xl p-8 sm:p-14 lg:p-20 overflow-hidden glass-panel border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center">
        {/* Animated 3D Visual Floating Orb Behind the Content */}
        <CtaOrbCanvas />

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer Early Access Tier Open</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
            Build the future with intelligent technology.
          </h2>

          <p className="mt-6 text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Deploy hyper-optimized WebGL & WebGPU graphics pipelines to millions of concurrent users. No GPU hardware
            bottlenecks, no compromise on visual fidelity.
          </p>

          {/* Action Form or Result */}
          <div className="mt-10 max-w-md mx-auto w-full">
            {result ? (
              <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-left animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Access Token Reserved</span>
                </div>
                <p className="mt-1 text-xs text-zinc-300">{result.message}</p>
                {result.queueNumber && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-mono">Priority Position</span>
                    <span className="font-mono font-bold text-emerald-300">#{result.queueNumber} in queue</span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="newsletter-email-input"
                    type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-md transition-all"
                  />
                </div>
                <button
                  id="submit-newsletter-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold whitespace-nowrap hover:brightness-110 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'Reserving...' : 'Get Instant Access'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {error && <p className="mt-2 text-xs text-red-400 text-center">{error}</p>}
          </div>

          {/* Secondary Action */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
            <button
              onClick={onRequestDemo}
              className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
            >
              Need a dedicated custom cluster? Book Enterprise Demo →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
