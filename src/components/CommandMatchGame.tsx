/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/sound';
import { ArcadeDifficultySwitcher, ArcadeDifficulty } from './ArcadeDifficultySwitcher';

interface CommandItem {
  id: string;
  command: string;
  label: string; // concise 2-4 words
  hint: string;
}

interface RoundData {
  id: number;
  title: string;
  items: CommandItem[];
}

const ROUNDS_BY_DIFFICULTY: Record<ArcadeDifficulty, RoundData[]> = {
  easy: [
    {
      id: 1,
      title: 'Basics 1',
      items: [
        { id: 'pwd', command: 'pwd', label: 'Folder GPS path', hint: 'Print working directory' },
        { id: 'ls', command: 'ls', label: 'List files', hint: 'List folder contents' },
        { id: 'clear', command: 'clear', label: 'Clean screen', hint: 'Wipe the terminal' }
      ]
    },
    {
      id: 2,
      title: 'Basics 2',
      items: [
        { id: 'cat', command: 'cat', label: 'Read file text', hint: 'View file content' },
        { id: 'mkdir', command: 'mkdir', label: 'Make folder', hint: 'Create new directory' },
        { id: 'echo', command: 'echo', label: 'Say hello', hint: 'Print text to screen' }
      ]
    },
    {
      id: 3,
      title: 'Basics 3',
      items: [
        { id: 'whoami', command: 'whoami', label: 'Current user', hint: 'Show username' },
        { id: 'date', command: 'date', label: 'Clock & date', hint: 'Show current time' },
        { id: 'touch', command: 'touch', label: 'Create file', hint: 'Make new blank file' }
      ]
    }
  ],
  medium: [
    {
      id: 1,
      title: 'Round 1: Basics',
      items: [
        { id: 'pwd', command: 'pwd', label: 'Current folder path', hint: 'Print working directory' },
        { id: 'ls', command: 'ls', label: 'List all files', hint: 'List folder contents' },
        { id: 'cat', command: 'cat', label: 'Read file text', hint: 'Concatenate and view text' },
        { id: 'mkdir', command: 'mkdir', label: 'Create new folder', hint: 'Make directory' },
        { id: 'clear', command: 'clear', label: 'Clean screen', hint: 'Wipe the terminal' }
      ]
    },
    {
      id: 2,
      title: 'Round 2: Files',
      items: [
        { id: 'touch', command: 'touch', label: 'Create empty file', hint: 'Make a blank file' },
        { id: 'cp', command: 'cp', label: 'Duplicate a file', hint: 'Copy file' },
        { id: 'mv', command: 'mv', label: 'Move or rename', hint: 'Relocate file' },
        { id: 'rm', command: 'rm', label: 'Delete a file', hint: 'Remove file' },
        { id: 'chmod', command: 'chmod', label: 'Change file access', hint: 'Change permissions' }
      ]
    },
    {
      id: 3,
      title: 'Round 3: Detective',
      items: [
        { id: 'grep', command: 'grep', label: 'Search text pattern', hint: 'Find matching words' },
        { id: 'whoami', command: 'whoami', label: 'Current user name', hint: 'Show my account' },
        { id: 'echo', command: 'echo', label: 'Print text output', hint: 'Echo words to screen' },
        { id: 'tree', command: 'tree', label: 'Show folder tree', hint: 'Visual tree of files' },
        { id: 'head', command: 'head', label: 'View top lines', hint: 'First lines of a file' }
      ]
    }
  ],
  hard: [
    {
      id: 1,
      title: 'Expert 1: Power Ops',
      items: [
        { id: 'grep', command: 'grep', label: 'Search text pattern', hint: 'Find regex matches' },
        { id: 'chmod', command: 'chmod', label: 'Change permissions', hint: 'Modify read/write access' },
        { id: 'sudo', command: 'sudo', label: 'Superuser admin', hint: 'Execute with root powers' },
        { id: 'chown', command: 'chown', label: 'Change file owner', hint: 'Alter user ownership' },
        { id: 'find', command: 'find', label: 'Deep search files', hint: 'Locate files in tree' },
        { id: 'kill', command: 'kill', label: 'Stop running process', hint: 'Send SIGTERM to PID' }
      ]
    },
    {
      id: 2,
      title: 'Expert 2: SysAdmin',
      items: [
        { id: 'ps', command: 'ps', label: 'Active process list', hint: 'Process status snapshot' },
        { id: 'top', command: 'top', label: 'Live task manager', hint: 'Realtime CPU & RAM monitor' },
        { id: 'df', command: 'df', label: 'Check disk free space', hint: 'Disk filesystem usage' },
        { id: 'uname', command: 'uname', label: 'Linux kernel info', hint: 'Operating system details' },
        { id: 'tar', command: 'tar', label: 'Archive files', hint: 'Tape archive compress' },
        { id: 'ping', command: 'ping', label: 'Test network connection', hint: 'ICMP echo request' }
      ]
    },
    {
      id: 3,
      title: 'Expert 3: Pipes & Tools',
      items: [
        { id: 'curl', command: 'curl', label: 'Download web URL', hint: 'Fetch network endpoint' },
        { id: 'ssh', command: 'ssh', label: 'Remote secure shell', hint: 'Connect to remote server' },
        { id: 'wc', command: 'wc', label: 'Count words and lines', hint: 'Word & line counter' },
        { id: 'history', command: 'history', label: 'Past command log', hint: 'Show terminal command history' },
        { id: 'ln', command: 'ln', label: 'Create file link', hint: 'Make symbolic or hard link' },
        { id: 'sort', command: 'sort', label: 'Sort lines in order', hint: 'Alphabetical line ordering' }
      ]
    }
  ]
};

interface CommandMatchGameProps {
  onEarnXp?: (amount: number) => void;
  onBackToMissions?: () => void;
}

export const CommandMatchGame: React.FC<CommandMatchGameProps> = ({
  onEarnXp,
  onBackToMissions
}) => {
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('medium');
  const [roundIdx, setRoundIdx] = useState(0);

  const activeRounds = ROUNDS_BY_DIFFICULTY[difficulty];
  const round = activeRounds[roundIdx] || activeRounds[0];

  // Matched pairs: commandId -> true
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  
  // Selected command on the left (for tap-to-match on mobile & PC)
  const [selectedCmd, setSelectedCmd] = useState<string | null>(null);
  const [draggedCmd, setDraggedCmd] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [wrongTarget, setWrongTarget] = useState<string | null>(null);
  const [roundScore, setRoundScore] = useState(0);
  const [shuffledTargets, setShuffledTargets] = useState<CommandItem[]>([]);

  const handleDifficultyChange = (newDiff: ArcadeDifficulty) => {
    setDifficulty(newDiff);
    setRoundIdx(0);
    setMatched({});
    setSelectedCmd(null);
    setDraggedCmd(null);
    setWrongTarget(null);
  };

  // Setup round
  useEffect(() => {
    setMatched({});
    setSelectedCmd(null);
    setDraggedCmd(null);
    setWrongTarget(null);
    // Shuffle right-side target definitions
    const shuffled = [...round.items].sort(() => Math.random() - 0.5);
    setShuffledTargets(shuffled);
  }, [roundIdx, difficulty]);

  const allMatched = round.items.length > 0 && Object.keys(matched).length === round.items.length;

  const pointsPerMatch = difficulty === 'hard' ? 40 : difficulty === 'easy' ? 20 : 25;
  const bonusReward = difficulty === 'hard' ? 80 : difficulty === 'easy' ? 40 : 50;

  const handleMatchAttempt = (cmdId: string, targetId: string) => {
    if (cmdId === targetId) {
      // Correct!
      soundEffects.playCommandSuccess();
      setMatched(prev => ({ ...prev, [cmdId]: true }));
      setSelectedCmd(null);
      setDraggedCmd(null);
      setDragOverTarget(null);
      setWrongTarget(null);
      setRoundScore(prev => prev + pointsPerMatch);
      if (onEarnXp) onEarnXp(pointsPerMatch);

      if (Object.keys(matched).length + 1 === round.items.length) {
        soundEffects.playLevelComplete();
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        if (onEarnXp) onEarnXp(bonusReward);
      }
    } else {
      // Wrong match
      soundEffects.playTabCompletion();
      setWrongTarget(targetId);
      setTimeout(() => setWrongTarget(null), 1200);
    }
  };

  // Drag handlers
  const onDragStart = (e: React.DragEvent, cmdId: string) => {
    e.dataTransfer.setData('text/plain', cmdId);
    setDraggedCmd(cmdId);
    setSelectedCmd(cmdId);
  };

  const onDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (dragOverTarget !== targetId) setDragOverTarget(targetId);
  };

  const onDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverTarget(null);
    const cmdId = e.dataTransfer.getData('text/plain') || draggedCmd;
    if (cmdId) handleMatchAttempt(cmdId, targetId);
  };

  // Tap handler
  const handleCmdClick = (cmdId: string) => {
    if (matched[cmdId]) return;
    setSelectedCmd(prev => (prev === cmdId ? null : cmdId));
  };

  const handleTargetClick = (targetId: string) => {
    if (matched[targetId]) return;
    if (selectedCmd) {
      handleMatchAttempt(selectedCmd, targetId);
    }
  };

  const handleReset = () => {
    setMatched({});
    setSelectedCmd(null);
    setDraggedCmd(null);
    const shuffled = [...round.items].sort(() => Math.random() - 0.5);
    setShuffledTargets(shuffled);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3 font-['Nunito',sans-serif]">
      {/* Top Bar: Round, Difficulty & Score */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧩</span>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-['Fredoka',sans-serif] leading-tight">
              Command Matcher • {round.title}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold">
              {difficulty === 'easy' ? 'Match commands with easy hints!' : difficulty === 'hard' ? 'Hard mode: match advanced commands!' : 'Drag or tap cards side-by-side to connect!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Difficulty Switcher */}
          <ArcadeDifficultySwitcher
            difficulty={difficulty}
            onChange={handleDifficultyChange}
            size="sm"
          />

          <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-black flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>+{roundScore} XP</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 cursor-pointer shadow-xs active:scale-95"
            title="Reset round"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Selected Helper Pill */}
      {selectedCmd && !allMatched && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>
            Selected: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-300 font-mono font-black">{selectedCmd}</code>. Tap matching card on right!
          </span>
          <button
            type="button"
            onClick={() => setSelectedCmd(null)}
            className="text-[11px] underline uppercase font-black cursor-pointer text-blue-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Side-by-Side Cards Grid (Fits perfectly on mobile & PC) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Left Column: Command Cards */}
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase text-slate-400 px-1 tracking-wider">
            Commands
          </div>
          {round.items.map(item => {
            const isDone = !!matched[item.id];
            const isSelected = selectedCmd === item.id;

            return (
              <div
                key={`cmd-${item.id}`}
                draggable={!isDone}
                onDragStart={(e) => onDragStart(e, item.id)}
                onClick={() => handleCmdClick(item.id)}
                className={`p-2.5 sm:p-3 rounded-xl border font-mono font-black text-xs sm:text-sm select-none transition-all flex items-center justify-between shadow-xs ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-80 cursor-default'
                    : isSelected
                    ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300 scale-102 cursor-pointer'
                    : 'bg-slate-900 text-emerald-400 border-slate-950 hover:border-blue-400 cursor-grab active:cursor-grabbing hover:scale-101'
                }`}
                title={`$ ${item.command} (${item.hint})`}
              >
                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400 text-xs">$</span>
                    <span className="truncate">{item.command}</span>
                  </div>
                  {difficulty === 'easy' && (
                    <span className="text-[10px] text-slate-400 font-sans font-normal truncate mt-0.5">
                      💡 {item.hint}
                    </span>
                  )}
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                ) : (
                  <span className="text-[10px] opacity-60 font-sans font-bold ml-1">⠿</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Target Meanings */}
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase text-slate-400 px-1 tracking-wider">
            Actions
          </div>
          {shuffledTargets.map(target => {
            const isDone = !!matched[target.id];
            const isHover = dragOverTarget === target.id;
            const isWrong = wrongTarget === target.id;

            return (
              <div
                key={`target-${target.id}`}
                onDragOver={(e) => onDragOver(e, target.id)}
                onDragLeave={() => setDragOverTarget(null)}
                onDrop={(e) => onDrop(e, target.id)}
                onClick={() => handleTargetClick(target.id)}
                className={`p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm font-bold select-none transition-all flex items-center justify-between shadow-xs ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : isWrong
                    ? 'bg-rose-50 border-rose-400 text-rose-800 animate-pulse'
                    : isHover
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                    : selectedCmd
                    ? 'bg-white border-dashed border-blue-400 hover:bg-blue-50/50 cursor-pointer'
                    : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                }`}
              >
                <span className="truncate leading-tight">{target.label}</span>
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Round Finished Bar */}
      {allMatched && (
        <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-xs flex items-center justify-between gap-2 animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="text-xs font-black uppercase font-['Fredoka',sans-serif]">Round Cleared!</div>
              <div className="text-[11px] text-emerald-100 font-bold">+{bonusReward} XP earned</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRoundIdx(prev => (prev + 1) % activeRounds.length)}
            className="px-3.5 py-1.5 bg-[#FBBC05] hover:bg-yellow-300 text-black rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
          >
            <span>Next Round</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
