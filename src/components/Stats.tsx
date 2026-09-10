import React, { useEffect, useRef, useState } from 'react';
import { Users, ShieldCheck, Zap, Headphones, Globe2, Sparkles } from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  target: number;
  suffix: string;
  decimals?: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATS_DATA: StatItem[] = [
  {
    id: 'users',
    label: 'Spatial Engineers & Studios',
    target: 14200,
    suffix: '+',
    description: 'Active creators deploying interactive 3D in production',
    icon: Users,
  },
  {
    id: 'reliability',
    label: 'Streaming Uptime SLA',
    target: 99.99,
    decimals: 2,
    suffix: '%',
    description: 'Distributed low-latency WebGL edge node clusters',
    icon: ShieldCheck,
  },
  {
    id: 'requests',
    label: 'Shaders & Mesh Renders',
    target: 58.4,
    decimals: 1,
    suffix: 'M+',
    description: 'Dynamic procedural invocations processed monthly',
    icon: Zap,
  },
  {
    id: 'support',
    label: 'Global Technical Support',
    target: 24,
    suffix: '/7',
    description: 'Dedicated GPU graphics engineers on standby',
    icon: Headphones,
  },
];

export const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    users: 0,
    reliability: 0,
    requests: 0,
    support: 0,
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;

    const duration = 1800; // ms
    const startTime = performance.now();

    const updateCounters = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const nextCounts: { [key: string]: number } = {};
      STATS_DATA.forEach((stat) => {
        nextCounts[stat.id] = stat.target * ease;
      });

      setCounts(nextCounts);

      if (progress < 1) {
        requestAnimationFrame(updateCounters);
      }
    };

    requestAnimationFrame(updateCounters);
  }, [hasTriggered]);

  return (
    <section ref={sectionRef} className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_DATA.map((stat) => {
          const Icon = stat.icon;
          const value = counts[stat.id] || 0;
          const displayValue = stat.decimals
            ? value.toFixed(stat.decimals)
            : Math.floor(value).toLocaleString();

          return (
            <div
              key={stat.id}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Subtle hover backlight */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400 group-hover:text-cyan-300 group-hover:bg-indigo-500/10 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{stat.label}</span>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight flex items-baseline gap-1">
                <span>{displayValue}</span>
                <span className="text-xl sm:text-2xl text-indigo-400 font-sans">{stat.suffix}</span>
              </div>

              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{stat.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
