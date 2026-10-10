/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/sound';
import { ArcadeDifficultySwitcher, ArcadeDifficulty } from './ArcadeDifficultySwitcher';

interface RogueProcess {
  pid: number;
  name: string;
  icon: string;
  cpu: number;
  isZapped: boolean;
}

const PROCESS_TEMPLATES = [
  { name: 'ram_hog', icon: '🐷', cpu: 35 },
  { name: 'loop_leak', icon: '🌀', cpu: 40 },
  { name: 'bug_crawler', icon: '🐛', cpu: 25 },
  { name: 'crypto_rat', icon: '🐀', cpu: 50 },
  { name: 'zombie_ghost', icon: '👻', cpu: 20 },
  { name: 'space_invader', icon: '👾', cpu: 30 }
];

const CONFIG_BY_DIFF: Record<ArcadeDifficulty, { batchCount: number; heatRate: number; coolDown: number; xp: number }> = {
  easy: { batchCount: 3, heatRate: 0.8, coolDown: 25, xp: 20 },
  medium: { batchCount: 4, heatRate: 1.5, coolDown: 20, xp: 25 },
  hard: { batchCount: 6, heatRate: 2.3, coolDown: 15, xp: 40 }
};

interface ProcessZapperGameProps {
  onEarnXp?: (amount: number) => void;
}

export const ProcessZapperGame: React.FC<ProcessZapperGameProps> = ({
  onEarnXp
}) => {
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('medium');
  const config = CONFIG_BY_DIFF[difficulty];

  const [processes, setProcesses] = useState<RogueProcess[]>([]);
  const [serverHeat, setServerHeat] = useState(25);
  const [zappedCount, setZappedCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Spawn initial processes
  const spawnBatch = (count = config.batchCount) => {
    const list: RogueProcess[] = [];
    for (let i = 0; i < count; i++) {
      const template = PROCESS_TEMPLATES[Math.floor(Math.random() * PROCESS_TEMPLATES.length)];
      list.push({
        pid: Math.floor(1000 + Math.random() * 8999),
        name: template.name,
        icon: template.icon,
        cpu: template.cpu,
        isZapped: false
      });
    }
    setProcesses(list);
    setServerHeat(25);
    setIsGameOver(false);
  };

  const handleDifficultyChange = (newDiff: ArcadeDifficulty) => {
    setDifficulty(newDiff);
    const newCfg = CONFIG_BY_DIFF[newDiff];
    spawnBatch(newCfg.batchCount);
  };

  useEffect(() => {
    spawnBatch();
  }, [difficulty]);

  // Server heat ticker
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setServerHeat(prev => {
        const activeCount = processes.filter(p => !p.isZapped).length;
        const next = prev + activeCount * config.heatRate;
        if (next >= 100) {
          setIsGameOver(true);
          return 100;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [processes, isGameOver, config.heatRate]);

  const handleZap = (pid: number) => {
    soundEffects.playCommandSuccess();
    setProcesses(prev =>
      prev.map(p => (p.pid === pid ? { ...p, isZapped: true } : p))
    );
    setServerHeat(h => Math.max(10, h - config.coolDown));
    setZappedCount(c => c + 1);
    setScore(s => s + config.xp);
    if (onEarnXp) onEarnXp(config.xp);

    // If all current zapped, spawn new round
    const remaining = processes.filter(p => p.pid !== pid && !p.isZapped);
    if (remaining.length === 0) {
      soundEffects.playLevelComplete();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => {
        spawnBatch();
      }, 500);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-3 font-['Nunito',sans-serif]">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦝</span>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-['Fredoka',sans-serif]">
              Process Zapper
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold">
              Tap <code className="bg-slate-100 text-rose-700 px-1 rounded font-mono">kill [PID]</code> to stop rogue tasks!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <ArcadeDifficultySwitcher
            difficulty={difficulty}
            onChange={handleDifficultyChange}
            size="sm"
          />

          <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-black flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>+{score} XP</span>
          </div>

          <button
            type="button"
            onClick={() => spawnBatch()}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 cursor-pointer shadow-xs active:scale-95"
            title="Restart server monitor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Server Heat Meter */}
      <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-950 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold font-mono">
          <span className="flex items-center gap-1 text-slate-300">
            <span>🔥</span>
            <span>SERVER CPU HEAT</span>
          </span>
          <span className={serverHeat > 75 ? 'text-rose-400 font-black animate-pulse' : 'text-emerald-400 font-black'}>
            {Math.round(serverHeat)}% {serverHeat > 75 ? 'OVERHEATING!' : 'NORMAL'}
          </span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              serverHeat > 75 ? 'bg-rose-500' : serverHeat > 50 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(100, serverHeat)}%` }}
          />
        </div>
      </div>

      {/* Rogue Processes Grid */}
      <div className="grid grid-cols-2 gap-2">
        {processes.map(proc => (
          <div
            key={proc.pid}
            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2 shadow-xs ${
              proc.isZapped
                ? 'bg-slate-50 border-slate-200 opacity-50'
                : 'bg-white border-rose-200 hover:border-rose-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{proc.icon}</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                PID {proc.pid}
              </span>
            </div>

            <div>
              <div className="text-xs font-mono font-black text-slate-900 truncate">
                {proc.name}
              </div>
              <div className="text-[10px] text-rose-600 font-bold">
                CPU: +{proc.cpu}%
              </div>
            </div>

            {proc.isZapped ? (
              <div className="py-1 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terminated</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleZap(proc.pid)}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-mono font-black text-xs uppercase flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95"
              >
                <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                <span>kill {proc.pid}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Game Over Bar */}
      {isGameOver && (
        <div className="p-3.5 bg-rose-600 text-white rounded-2xl shadow-xs flex items-center justify-between gap-2 animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="text-xs font-black uppercase font-['Fredoka',sans-serif]">Server Overheated!</div>
              <div className="text-[11px] text-rose-100 font-bold">You zapped {zappedCount} rogue tasks!</div>
            </div>
          </div>
          <button
            type="button"
            onClick={spawnBatch}
            className="px-3.5 py-1.5 bg-white text-rose-900 rounded-xl font-black text-xs uppercase cursor-pointer shadow-xs active:scale-95"
          >
            Cool Down & Retry
          </button>
        </div>
      )}
    </div>
  );
};
