import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import { TestimonialItem } from '../types';
import { TiltCard } from './TiltCard';

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "Aether completely redefined how we render spatial product configurators. Delivering photorealistic 120 FPS raytraced 3D across iOS Safari and low-end laptops seemed impossible until we integrated their engine.",
    author: 'Elena Rostova',
    role: 'VP of Spatial Experience',
    company: 'Hyperion Interactive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    quote:
      "The sub-millisecond nanite-style LOD pipeline allowed our design team to drop uncompressed 15-million polygon CAD assemblies straight onto the web. Client engagement skyrocketed by 340%.",
    author: 'Marcus Vance',
    role: 'Chief Technology Officer',
    company: 'Vektor Mobility Systems',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    quote:
      "Their generative shader engine and hotspot telemetry transformed our product showcases. The 3D interactions feel cinematic, responsive, and completely lag-free.",
    author: 'Dr. Sarah Chen',
    role: 'Head of Graphics & Simulation',
    company: 'Nexus Quantum Labs',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
          <Quote className="w-3.5 h-3.5 text-indigo-400" />
          <span>Industry Validation</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
          Trusted by Pioneers in Real-Time 3D
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
          See how leading creative engineering teams leverage Aether to deploy state-of-the-art interactive spatial web
          applications.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((item, idx) => (
          <TiltCard
            key={idx}
            className="p-7 flex flex-col justify-between"
            glowColor="rgba(99, 102, 241, 0.2)"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400 mb-5">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                "{item.quote}"
              </p>
            </div>

            {/* Author details */}
            <div className="mt-8 pt-5 border-t border-white/10 flex items-center gap-3.5">
              <img
                src={item.avatar}
                alt={item.author}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-white/20 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{item.author}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xs text-zinc-400">
                  {item.role}, <span className="text-indigo-300 font-medium">{item.company}</span>
                </div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
};
