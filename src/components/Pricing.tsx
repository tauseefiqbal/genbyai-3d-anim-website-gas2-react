import React, { useState } from 'react';
import { Check, Sparkles, Zap, ArrowRight, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PricingPlan } from '../types';

interface PricingProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Developer Starter',
    description: 'Ideal for independent spatial engineers and boutique studios creating interactive web prototypes.',
    monthlyPrice: 49,
    annualPrice: 39,
    ctaText: 'Start 14-Day Free Trial',
    features: [
      'Up to 5 Interactive 3D Projects',
      'Standard WebGL 2.0 PBR Pipeline',
      'Draco Mesh & Texture Compression',
      '50,000 Edge Stream Views / mo',
      'Community & Discord Support',
    ],
  },
  {
    id: 'pro',
    name: 'Studio Pro',
    description: 'For high-growth teams and studios requiring photorealistic neural rendering and real-time raytracing.',
    monthlyPrice: 189,
    annualPrice: 149,
    popular: true,
    highlightBadge: 'Most Popular',
    ctaText: 'Deploy Studio Pro',
    features: [
      'Unlimited Interactive 3D Scenes',
      'Real-Time WebGPU Path Tracing Engine',
      'Sub-Pixel Nanite Continuous LOD',
      'Generative Shader Synthesis (AI)',
      '1,000,000 Edge Stream Views / mo',
      'Custom Domain & Brand Whitelabeling',
      'Priority 4-Hour Response SLA',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Matrix',
    description: 'Custom GPU clustering, dedicated private edge nodes, and bespoke shader pipeline engineering.',
    monthlyPrice: 590,
    annualPrice: 470,
    ctaText: 'Talk to GPU Architects',
    highlightBadge: 'Dedicated GPU Clusters',
    features: [
      'Dedicated Bare-Metal GPU Edge Nodes',
      'Sub-0.2ms Custom Streaming Protocol',
      'Unlimited High-Concurrency Streams',
      'Private On-Premise Cloud Deployment',
      'Direct Slack Channel with Graphics Engineers',
      'SOC2 Type II, HIPAA & ISO 27001 Compliant',
      '99.99% Uptime Financial SLA',
    ],
  },
];

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleToggleBilling = (annual: boolean) => {
    setIsAnnual(annual);
    if (annual) {
      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.7 },
          colors: ['#6366f1', '#38bdf8', '#a855f7'],
        });
      } catch (e) {
        // Safe fallback if confetti isn't supported
      }
    }
  };

  return (
    <section id="pricing" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Transparent Computing Tiers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
          Predictable Scaling for Any Workload
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
          Switch tiers as your user base scales. No hidden egress charges, zero GPU idle billing penalties.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl">
          <button
            id="billing-toggle-monthly"
            onClick={() => handleToggleBilling(false)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              !isAnnual
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            id="billing-toggle-annual"
            onClick={() => handleToggleBilling(true)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isAnnual
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          const isPro = plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? 'bg-[#0f1424]/90 border-2 border-indigo-500/60 shadow-[0_15px_40px_-10px_rgba(99,102,241,0.3)] scale-100 lg:-translate-y-2'
                  : 'bg-[#090d16]/70 border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Badge */}
              {plan.highlightBadge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-white" />
                  {plan.highlightBadge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white font-display">{plan.name}</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px]">{plan.description}</p>

                {/* Price */}
                <div className="mt-6 mb-8 flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
                    ${price}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  {isAnnual && (
                    <span className="text-[11px] text-indigo-300 font-mono ml-2">billed yearly</span>
                  )}
                </div>

                <div className="h-[1px] w-full bg-white/10 mb-6" />

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                      <div className={`mt-0.5 p-0.5 rounded-full ${isPro ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-cyan-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                id={`btn-plan-${plan.id}`}
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-3 px-6 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  isPro
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:brightness-110 shadow-lg shadow-indigo-500/25 active:scale-[0.98]'
                    : 'bg-white/10 text-white hover:bg-white/15 border border-white/10 active:scale-[0.98]'
                }`}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
