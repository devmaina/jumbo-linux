/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sliders } from 'lucide-react';

export type ArcadeDifficulty = 'easy' | 'medium' | 'hard';

interface ArcadeDifficultySwitcherProps {
  difficulty: ArcadeDifficulty;
  onChange: (diff: ArcadeDifficulty) => void;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const ArcadeDifficultySwitcher: React.FC<ArcadeDifficultySwitcherProps> = ({
  difficulty,
  onChange,
  size = 'sm',
  showLabel = false
}) => {
  const options: { id: ArcadeDifficulty; label: string; icon: string; activeClass: string; tip: string }[] = [
    {
      id: 'easy',
      label: 'Easy',
      icon: '🟢',
      activeClass: 'bg-emerald-500 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-200',
      tip: 'Relaxed speed & simpler commands'
    },
    {
      id: 'medium',
      label: 'Medium',
      icon: '🟡',
      activeClass: 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-200',
      tip: 'Balanced speed & standard commands'
    },
    {
      id: 'hard',
      label: 'Hard',
      icon: '🔴',
      activeClass: 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200',
      tip: 'Fast speed, advanced commands & extra XP'
    }
  ];

  return (
    <div className="flex items-center gap-1.5 select-none">
      {showLabel && (
        <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 hidden sm:flex">
          <Sliders className="w-3 h-3" />
          <span>Difficulty:</span>
        </span>
      )}
      <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200/80 shadow-2xs">
        {options.map((opt) => {
          const isActive = difficulty === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              title={`${opt.label}: ${opt.tip}`}
              className={`flex items-center gap-1 font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer active:scale-95 ${
                size === 'sm'
                  ? 'px-2 py-1 text-[11px]'
                  : 'px-2.5 py-1.5 text-xs'
              } ${
                isActive
                  ? opt.activeClass
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent'
              }`}
            >
              <span className="text-[10px] leading-none">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
