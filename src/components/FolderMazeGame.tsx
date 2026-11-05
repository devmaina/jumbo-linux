/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, RotateCcw, Folder, FolderOpen, FileText, ArrowLeft, Trophy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/sound';
import { ArcadeDifficultySwitcher, ArcadeDifficulty } from './ArcadeDifficultySwitcher';

interface MazeNode {
  name: string;
  isFolder: boolean;
  children?: Record<string, MazeNode>;
  hasTreasure?: boolean;
}

const MAZE_TREE: Record<string, MazeNode> = {
  home: {
    name: 'home',
    isFolder: true,
    children: {
      tux: {
        name: 'tux',
        isFolder: true,
        children: {
          games: {
            name: 'games',
            isFolder: true,
            hasTreasure: true,
            children: {
              'drop_catch.sh': { name: 'drop_catch.sh', isFolder: false },
              'star_finder': { name: 'star_finder', isFolder: false }
            }
          },
          documents: {
            name: 'documents',
            isFolder: true,
            children: {
              'notes.txt': { name: 'notes.txt', isFolder: false }
            }
          }
        }
      }
    }
  },
  var: {
    name: 'var',
    isFolder: true,
    children: {
      log: {
        name: 'log',
        isFolder: true,
        children: {
          'syslog': { name: 'syslog', isFolder: false }
        }
      },
      secret: {
        name: 'secret',
        isFolder: true,
        children: {
          vault: {
            name: 'vault',
            isFolder: true,
            hasTreasure: true,
            children: {
              'golden_key.txt': { name: 'golden_key.txt', isFolder: false, hasTreasure: true }
            }
          }
        }
      }
    }
  },
  etc: {
    name: 'etc',
    isFolder: true,
    children: {
      hostname: { name: 'hostname', isFolder: false },
      'os-release': { name: 'os-release', isFolder: false },
      security: {
        name: 'security',
        isFolder: true,
        children: {
          matrix: {
            name: 'matrix',
            isFolder: true,
            hasTreasure: true,
            children: {
              'cyber_core.bin': { name: 'cyber_core.bin', isFolder: false, hasTreasure: true }
            }
          }
        }
      }
    }
  }
};

const TARGET_BY_DIFFICULTY: Record<ArcadeDifficulty, { path: string[]; targetDisplay: string; hint: string; xp: number }> = {
  easy: {
    path: ['home', 'tux', 'games'],
    targetDisplay: '/home/tux/games',
    hint: 'Quick navigation: Enter the games folder!',
    xp: 50
  },
  medium: {
    path: ['var', 'secret', 'vault'],
    targetDisplay: '/var/secret/vault',
    hint: 'Go up (cd ..) to root, then enter var → secret → vault!',
    xp: 100
  },
  hard: {
    path: ['etc', 'security', 'matrix'],
    targetDisplay: '/etc/security/matrix',
    hint: 'Deep system navigation: Reach etc → security → matrix!',
    xp: 150
  }
};

interface FolderMazeGameProps {
  onEarnXp?: (amount: number) => void;
  onBackToMissions?: () => void;
}

export const FolderMazeGame: React.FC<FolderMazeGameProps> = ({
  onEarnXp
}) => {
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('medium');
  const targetConfig = TARGET_BY_DIFFICULTY[difficulty];

  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'tux']);
  const [visitedCount, setVisitedCount] = useState(1);
  const [hasWon, setHasWon] = useState(false);
  const [score, setScore] = useState(0);

  const handleDifficultyChange = (newDiff: ArcadeDifficulty) => {
    setDifficulty(newDiff);
    setCurrentPath(['home', 'tux']);
    setHasWon(false);
  };

  // Traverse tree to get current node
  const getCurrentChildren = () => {
    let curr: Record<string, MazeNode> | undefined = MAZE_TREE;
    for (const seg of currentPath) {
      if (curr && curr[seg]?.children) {
        curr = curr[seg].children;
      } else {
        return {};
      }
    }
    return curr || {};
  };

  const children = getCurrentChildren();
  const currentPathString = '/' + currentPath.join('/');

  const handleCdInto = (folderName: string) => {
    soundEffects.playTabCompletion();
    const nextPath = [...currentPath, folderName];
    setCurrentPath(nextPath);
    setVisitedCount(v => v + 1);

    // Check if target vault
    if (nextPath.join('/') === targetConfig.path.join('/')) {
      setHasWon(true);
      setScore(prev => prev + targetConfig.xp);
      soundEffects.playLevelComplete();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      if (onEarnXp) onEarnXp(targetConfig.xp);
      // Auto-advance to next maze after reaching vault
      setTimeout(() => {
        const nextDiff: ArcadeDifficulty = difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy';
        handleDifficultyChange(nextDiff);
      }, 1500);
    }
  };

  const handleCdUp = () => {
    if (currentPath.length > 0) {
      soundEffects.playTabCompletion();
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleReset = () => {
    setCurrentPath(['home', 'tux']);
    setHasWon(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-3 font-['Nunito',sans-serif]">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📁</span>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-['Fredoka',sans-serif]">
              Folder Maze
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold">
              Target: <code className="bg-amber-100 text-amber-900 px-1 rounded font-mono">{targetConfig.targetDisplay}</code>
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
            onClick={handleReset}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 cursor-pointer shadow-xs active:scale-95"
            title="Reset maze"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Path Display */}
      <div className="bg-slate-900 text-emerald-400 p-3 rounded-2xl border border-slate-950 font-mono text-xs flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-blue-400 font-bold">tux@linux:</span>
          <span className="text-white font-bold">{currentPathString || '/'}</span>
          <span className="text-slate-400">$</span>
        </div>
        <span className="text-[10px] text-slate-400 shrink-0 uppercase font-bold">pwd</span>
      </div>

      {/* Navigation Controls & Current Contents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs space-y-3">
        {/* Tip helper */}
        <div className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
          💡 {targetConfig.hint}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-700">
            Current Directory Items:
          </span>
          {currentPath.length > 0 && (
            <button
              type="button"
              onClick={handleCdUp}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>cd .. (Go Up)</span>
            </button>
          )}
        </div>

        {/* Directory Items List */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(children).map(([name, item]) => (
            <button
              key={name}
              type="button"
              disabled={!item.isFolder}
              onClick={() => item.isFolder && handleCdInto(name)}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all shadow-xs ${
                item.isFolder
                  ? 'bg-amber-50/70 hover:bg-amber-100 border-amber-300 text-slate-900 cursor-pointer active:scale-98'
                  : 'bg-slate-50 border-slate-200 text-slate-600 cursor-default'
              }`}
            >
              <span className="text-base shrink-0">
                {item.isFolder ? '📁' : '📄'}
              </span>
              <div className="truncate">
                <div className="text-xs font-black truncate">{name}</div>
                <div className="text-[10px] text-slate-400 font-bold">
                  {item.isFolder ? 'cd ' + name : 'file'}
                </div>
              </div>
            </button>
          ))}
          {Object.keys(children).length === 0 && (
            <div className="col-span-2 text-center py-4 text-xs font-bold text-slate-400">
              Empty folder. Tap "cd .." to explore other paths!
            </div>
          )}
        </div>
      </div>

      {/* Victory Banner */}
      {hasWon && (
        <div className="p-3.5 bg-emerald-500 text-white rounded-2xl shadow-xs flex items-center justify-between gap-2 animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="text-xs font-black uppercase font-['Fredoka',sans-serif]">
                Secret Vault Discovered!
              </div>
              <div className="text-[11px] text-emerald-100 font-bold">
                You mastered cd navigation! +{targetConfig.xp} XP
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 bg-[#FBBC05] hover:bg-yellow-300 text-black rounded-xl font-black text-xs uppercase cursor-pointer shadow-xs active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
