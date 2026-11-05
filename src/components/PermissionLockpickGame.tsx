/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Lock, Unlock, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/sound';
import { ArcadeDifficultySwitcher, ArcadeDifficulty } from './ArcadeDifficultySwitcher';

interface LockLevel {
  id: number;
  filename: string;
  targetStr: string; // e.g. 'rwxr-xr-x'
  targetOctal: string; // '755'
  description: string;
}

const LOCKS_BY_DIFF: Record<ArcadeDifficulty, LockLevel[]> = {
  easy: [
    {
      id: 1,
      filename: 'public_sandbox.txt',
      targetStr: 'rwxrwxrwx',
      targetOctal: '777',
      description: 'Free for all! Turn ON every permission switch.'
    },
    {
      id: 2,
      filename: 'story_notes.txt',
      targetStr: 'rw-r--r--',
      targetOctal: '644',
      description: 'Owner can Read & Write. Others can only Read.'
    }
  ],
  medium: [
    {
      id: 1,
      filename: 'launch_rocket.sh',
      targetStr: 'rwxr-xr-x',
      targetOctal: '755',
      description: 'Owner can Read, Write, Execute. Others can Read & Execute.'
    },
    {
      id: 2,
      filename: 'story_notes.txt',
      targetStr: 'rw-r--r--',
      targetOctal: '644',
      description: 'Owner can Read & Write. Others can only Read.'
    },
    {
      id: 3,
      filename: 'secret_diary.gpg',
      targetStr: 'rwx------',
      targetOctal: '700',
      description: 'Private! Only the owner has full Read, Write & Execute.'
    },
    {
      id: 4,
      filename: 'public_playground.tmp',
      targetStr: 'rwxrwxrwx',
      targetOctal: '777',
      description: 'Free for everyone! Full Read, Write, and Execute for all.'
    }
  ],
  hard: [
    {
      id: 1,
      filename: 'private_key.pem',
      targetStr: 'rw-------',
      targetOctal: '600',
      description: 'Top Secret: Only Owner can Read and Write. Zero access for others.'
    },
    {
      id: 2,
      filename: 'shared_app.sh',
      targetStr: 'rwxr-x---',
      targetOctal: '750',
      description: 'Team App: Owner has 7, Group has 5 (Read+Exec), Others have none.'
    },
    {
      id: 3,
      filename: 'readonly_vault.db',
      targetStr: 'r--------',
      targetOctal: '400',
      description: 'Read-only archive: Only Owner has Read bit enabled.'
    },
    {
      id: 4,
      filename: 'daemon_task.sh',
      targetStr: 'rwx--x--x',
      targetOctal: '711',
      description: 'Owner has full control; everyone else can only Execute.'
    }
  ]
};

interface PermissionLockpickGameProps {
  onEarnXp?: (amount: number) => void;
}

export const PermissionLockpickGame: React.FC<PermissionLockpickGameProps> = ({
  onEarnXp
}) => {
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('medium');
  const [levelIdx, setLevelIdx] = useState(0);

  const activeLocks = LOCKS_BY_DIFF[difficulty];
  const level = activeLocks[levelIdx] || activeLocks[0];

  // 9 permission bits:
  // Owner: r, w, x
  // Group: r, w, x
  // Other: r, w, x
  const [perms, setPerms] = useState<boolean[]>([true, true, false, true, false, false, true, false, false]);
  const [unlocked, setUnlocked] = useState(false);
  const [score, setScore] = useState(0);

  const handleDifficultyChange = (newDiff: ArcadeDifficulty) => {
    setDifficulty(newDiff);
    setLevelIdx(0);
    setUnlocked(false);
    setPerms([true, false, false, true, false, false, false, false, false]);
  };

  // Convert bits to string
  const currentStr = [
    perms[0] ? 'r' : '-',
    perms[1] ? 'w' : '-',
    perms[2] ? 'x' : '-',
    perms[3] ? 'r' : '-',
    perms[4] ? 'w' : '-',
    perms[5] ? 'x' : '-',
    perms[6] ? 'r' : '-',
    perms[7] ? 'w' : '-',
    perms[8] ? 'x' : '-'
  ].join('');

  // Calculate octal
  const oVal = (perms[0] ? 4 : 0) + (perms[1] ? 2 : 0) + (perms[2] ? 1 : 0);
  const gVal = (perms[3] ? 4 : 0) + (perms[4] ? 2 : 0) + (perms[5] ? 1 : 0);
  const uVal = (perms[6] ? 4 : 0) + (perms[7] ? 2 : 0) + (perms[8] ? 1 : 0);
  const currentOctal = `${oVal}${gVal}${uVal}`;

  const toggleBit = (idx: number) => {
    soundEffects.playTabCompletion();
    const next = [...perms];
    next[idx] = !next[idx];
    setPerms(next);

    // Check if match
    const newStr = [
      next[0] ? 'r' : '-', next[1] ? 'w' : '-', next[2] ? 'x' : '-',
      next[3] ? 'r' : '-', next[4] ? 'w' : '-', next[5] ? 'x' : '-',
      next[6] ? 'r' : '-', next[7] ? 'w' : '-', next[8] ? 'x' : '-'
    ].join('');

    if (newStr === level.targetStr) {
      handleSuccess();
    }
  };

  const applyShortcut = (targetBits: boolean[]) => {
    soundEffects.playTabCompletion();
    setPerms(targetBits);
    const newStr = [
      targetBits[0] ? 'r' : '-', targetBits[1] ? 'w' : '-', targetBits[2] ? 'x' : '-',
      targetBits[3] ? 'r' : '-', targetBits[4] ? 'w' : '-', targetBits[5] ? 'x' : '-',
      targetBits[6] ? 'r' : '-', targetBits[7] ? 'w' : '-', targetBits[8] ? 'x' : '-'
    ].join('');

    if (newStr === level.targetStr) {
      handleSuccess();
    }
  };

  const handleSuccess = () => {
    setUnlocked(true);
    setScore(s => s + 40);
    soundEffects.playLevelComplete();
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    if (onEarnXp) onEarnXp(40);
    // Auto-advance to next lock after scoring right
    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleNext = () => {
    setUnlocked(false);
    setLevelIdx((levelIdx + 1) % activeLocks.length);
    setPerms([true, false, false, true, false, false, false, false, false]);
  };

  return (
    <div className="max-w-xl mx-auto space-y-3 font-['Nunito',sans-serif]">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-['Fredoka',sans-serif]">
              Permission Lockpick
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold truncate max-w-xs">
              File: <code className="bg-slate-100 px-1 rounded text-blue-700 font-mono">{level.filename}</code>
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
            onClick={() => {
              setUnlocked(false);
              setPerms([false, false, false, false, false, false, false, false, false]);
            }}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 cursor-pointer shadow-xs active:scale-95"
            title="Clear switches"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vault Card */}
      <div className={`p-4 rounded-2xl border transition-all text-center space-y-3 shadow-xs ${
        unlocked ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-center gap-2">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs transition-transform ${
            unlocked ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-900 text-amber-400'
          }`}>
            {unlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-black uppercase text-slate-400">Target Permission:</div>
          <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 flex items-center justify-center gap-2">
            <span>chmod {level.targetOctal}</span>
            <span className="text-sm font-bold text-slate-400">({level.targetStr})</span>
          </div>
          <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto mt-1">
            {level.description}
          </p>
        </div>

        {/* Current State Gauge */}
        <div className="bg-slate-900 text-white p-2.5 rounded-xl font-mono text-xs flex items-center justify-between">
          <span className="text-slate-400">CURRENT:</span>
          <span className="text-emerald-400 font-black text-sm">chmod {currentOctal}</span>
          <span className="text-amber-300 font-bold">{currentStr}</span>
        </div>

        {/* 9 Interactive Bit Switches: Owner | Group | Others */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Owner Bits */}
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-500">Owner (User)</div>
            <div className="grid grid-cols-3 gap-1">
              {['r', 'w', 'x'].map((bit, i) => (
                <button
                  key={`u-${bit}`}
                  type="button"
                  onClick={() => toggleBit(i)}
                  className={`py-1.5 rounded-lg font-mono font-black text-xs uppercase cursor-pointer transition-all ${
                    perms[i] ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  {bit}
                </button>
              ))}
            </div>
          </div>

          {/* Group Bits */}
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-500">Group</div>
            <div className="grid grid-cols-3 gap-1">
              {['r', 'w', 'x'].map((bit, i) => (
                <button
                  key={`g-${bit}`}
                  type="button"
                  onClick={() => toggleBit(i + 3)}
                  className={`py-1.5 rounded-lg font-mono font-black text-xs uppercase cursor-pointer transition-all ${
                    perms[i + 3] ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  {bit}
                </button>
              ))}
            </div>
          </div>

          {/* Other Bits */}
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-500">Others</div>
            <div className="grid grid-cols-3 gap-1">
              {['r', 'w', 'x'].map((bit, i) => (
                <button
                  key={`o-${bit}`}
                  type="button"
                  onClick={() => toggleBit(i + 6)}
                  className={`py-1.5 rounded-lg font-mono font-black text-xs uppercase cursor-pointer transition-all ${
                    perms[i + 6] ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  {bit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex items-center justify-center gap-1.5 pt-1 flex-wrap">
          <span className="text-[10px] font-black text-slate-400 uppercase">Quick:</span>
          <button
            type="button"
            onClick={() => applyShortcut([true, true, true, true, false, true, true, false, true])}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-700 cursor-pointer"
          >
            755
          </button>
          <button
            type="button"
            onClick={() => applyShortcut([true, true, false, true, false, false, true, false, false])}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-700 cursor-pointer"
          >
            644
          </button>
          <button
            type="button"
            onClick={() => applyShortcut([true, true, true, false, false, false, false, false, false])}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-700 cursor-pointer"
          >
            700
          </button>
          <button
            type="button"
            onClick={() => applyShortcut([true, true, true, true, true, true, true, true, true])}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-700 cursor-pointer"
          >
            777
          </button>
        </div>
      </div>

      {/* Success Box */}
      {unlocked && (
        <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-xs flex items-center justify-between gap-2 animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="text-xs font-black uppercase font-['Fredoka',sans-serif]">Vault Picked!</div>
              <div className="text-[11px] text-emerald-100 font-bold">+40 XP earned</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="px-3.5 py-1.5 bg-[#FBBC05] hover:bg-yellow-300 text-black rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
          >
            <span>Next Lock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
