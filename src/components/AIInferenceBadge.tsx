import React from 'react';
import { Cpu, Cloud, Sparkles } from 'lucide-react';
import { AIExecutionSource } from '../lib/firebaseAI';

interface AIInferenceBadgeProps {
  source: AIExecutionSource;
  variant?: 'dark' | 'light';
  className?: string;
}

export const AIInferenceBadge: React.FC<AIInferenceBadgeProps> = ({
  source,
  variant = 'dark',
  className = '',
}) => {
  if (source === 'on_device') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shrink-0 select-none ${
          variant === 'dark'
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
        } ${className}`}
        title="Generated locally on-device using Firebase AI Logic (InferenceMode.PREFER_ON_DEVICE)"
      >
        <Cpu className="w-2.5 h-2.5 shrink-0" />
        <span>On-Device (Local)</span>
      </span>
    );
  }

  if (source === 'cloud_fallback') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shrink-0 select-none ${
          variant === 'dark'
            ? 'bg-sky-950/90 text-sky-300 border-sky-500/50'
            : 'bg-sky-50 text-sky-800 border-sky-300'
        } ${className}`}
        title="Automatically fell back to free-tier Gemini 2.5 Flash via Firebase AI Logic (GoogleAIBackend)"
      >
        <Cloud className="w-2.5 h-2.5 shrink-0" />
        <span>Cloud Fallback</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shrink-0 select-none ${
        variant === 'dark'
          ? 'bg-slate-800/90 text-amber-200 border-slate-600'
          : 'bg-amber-50 text-amber-900 border-amber-300'
      } ${className}`}
      title="Built-in offline Tux guide (active when Firebase AI is unconfigured or offline)"
    >
      <Sparkles className="w-2.5 h-2.5 shrink-0" />
      <span>Offline Guide (Local)</span>
    </span>
  );
};
