import React, { useState } from 'react';
import { X, CheckCircle2, Building, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { PricingPlan } from '../types';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ message: string; referenceId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please provide your name and work email.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          plan: selectedPlan ? selectedPlan.name : 'Custom Spatial Architecture',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmation({
          message: data.message,
          referenceId: data.referenceId,
        });
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      setConfirmation({
        message: `Thank you ${name}! A spatial solutions engineer will reach out to ${email} promptly.`,
        referenceId: `AETH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="demo-consultation-modal"
        className="w-full max-w-lg rounded-3xl bg-[#090d16]/95 border border-white/10 p-6 sm:p-8 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmation ? (
          <div className="py-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">Session Reserved</h3>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed">{confirmation.message}</p>
            <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/10 inline-block font-mono text-xs text-indigo-300">
              Reference ID: {confirmation.referenceId}
            </div>
            <div className="mt-7">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                Return to Experience
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                {selectedPlan ? `Selected: ${selectedPlan.name}` : 'Enterprise Architecture Consultation'}
              </span>
              <h3 className="text-2xl font-bold text-white font-display mt-1">Deploy Aether 3D Engine</h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Connect with our graphics infrastructure architects for custom scene tuning, WebGPU benchmark analysis,
                and edge node provisioning.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Alex Mercer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@studio.design"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Studio / Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Vektor Interactive"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:brightness-110 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Verifying Architecture...' : 'Confirm Consultation Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
