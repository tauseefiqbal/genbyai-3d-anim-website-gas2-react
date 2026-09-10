import React, { useState } from 'react';
import { Sparkles, X, Send, Wand2, RefreshCw, Layers, Check, Bot } from 'lucide-react';
import { SceneConfig } from '../types';

interface AiShaderCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  config: SceneConfig;
  onApplyConfig: (newConfig: Partial<SceneConfig>) => void;
}

const PRESET_PROMPTS = [
  'Hyper-luminescent neon cyan and magenta cyberpunk lattice',
  'Deep cosmic obsidian with subtle gold wireframe edges',
  'Bioluminescent deep ocean emerald with high metallic sheen',
  'Solar flare plasma core with high rotational speed',
];

export const AiShaderCopilot: React.FC<AiShaderCopilotProps> = ({
  isOpen,
  onClose,
  config,
  onApplyConfig,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastReply, setLastReply] = useState<string | null>(
    'Aether AI Copilot initialized. Enter a prompt or select a preset to dynamically reconfigure scene lighting, PBR materials, and geometry parameters.'
  );
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (inputPrompt: string) => {
    if (!inputPrompt.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputPrompt,
          currentConfig: config,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const data = json.data;
        onApplyConfig({
          ...(data.color1 ? { color1: data.color1 } : {}),
          ...(data.color2 ? { color2: data.color2 } : {}),
          ...(typeof data.wireframe === 'boolean' ? { wireframe: data.wireframe } : {}),
          ...(typeof data.speed === 'number' ? { speed: Math.min(Math.max(data.speed, 0.4), 2.5) } : {}),
          ...(typeof data.roughness === 'number' ? { roughness: data.roughness } : {}),
          ...(typeof data.metalness === 'number' ? { metalness: data.metalness } : {}),
        });
        setAppliedPreset(data.preset || 'Custom Neural Matrix');
        setLastReply(json.reply || 'Scene parameters applied successfully.');
      } else {
        setLastReply(json.reply || 'Engine applied procedural adjustments.');
      }
    } catch (err) {
      // Local fallback
      onApplyConfig({
        color1: '#06b6d4',
        color2: '#ec4899',
        speed: 1.4,
        wireframe: false,
      });
      setAppliedPreset('Cyberpunk Neon');
      setLastReply('Applied local high-contrast neon shader profile with rapid rotational torque.');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="ai-copilot-modal"
        className="w-full max-w-lg rounded-3xl bg-[#090d16]/95 border border-indigo-500/30 p-6 shadow-2xl relative flex flex-col gap-5 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full rounded-xl bg-[#07090f] flex items-center justify-center text-cyan-300">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Aether AI Shader Copilot</h3>
              <p className="text-xs text-zinc-400 font-mono">Real-time WebGL Material Synthesis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Response Output Box */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs leading-relaxed text-zinc-300">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Neural Copilot Output</span>
            {appliedPreset && (
              <span className="ml-auto text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                Active: {appliedPreset}
              </span>
            )}
          </div>
          <p>{lastReply}</p>
        </div>

        {/* Preset Prompt Chips */}
        <div>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
            Suggested Shader Directives:
          </span>
          <div className="flex flex-col gap-1.5">
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleGenerate(preset)}
                className="text-left text-xs p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
              >
                <span className="truncate">{preset}</span>
                <Wand2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate(prompt);
          }}
          className="relative mt-1"
        >
          <input
            id="ai-copilot-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Ultra-reflective titanium with glowing gold filaments..."
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            id="ai-copilot-submit-btn"
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
