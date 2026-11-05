/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, RotateCcw, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/sound';
import { ArcadeDifficultySwitcher, ArcadeDifficulty } from './ArcadeDifficultySwitcher';

interface PipeMission {
  id: number;
  inputData: string[];
  targetOutput: string[];
  availablePipes: { id: string; cmd: string; label: string }[];
  correctPipeline: string[]; // pipe ids in order
  description: string;
}

const MISSIONS_BY_DIFF: Record<ArcadeDifficulty, PipeMission[]> = {
  easy: [
    {
      id: 1,
      inputData: ['apple', 'banana', 'penguin', 'orange', 'penguin'],
      targetOutput: ['penguin', 'penguin'],
      availablePipes: [
        { id: 'grep_p', cmd: 'grep penguin', label: 'Filter "penguin"' },
        { id: 'sort', cmd: 'sort', label: 'Alphabetical' }
      ],
      correctPipeline: ['grep_p'],
      description: 'Filter only the words matching "penguin"!'
    },
    {
      id: 2,
      inputData: ['zebra', 'cat', 'dog', 'ant'],
      targetOutput: ['ant', 'cat', 'dog', 'zebra'],
      availablePipes: [
        { id: 'sort', cmd: 'sort', label: 'Alphabetical A-Z' },
        { id: 'wc_l', cmd: 'wc -l', label: 'Count lines' }
      ],
      correctPipeline: ['sort'],
      description: 'Sort the animal list in alphabetical order!'
    }
  ],
  medium: [
    {
      id: 1,
      inputData: ['cat', 'dog', 'apple', 'zebra'],
      targetOutput: ['zebra', 'dog', 'cat', 'apple'],
      availablePipes: [
        { id: 'sort_r', cmd: 'sort -r', label: 'Reverse Sort' },
        { id: 'head_2', cmd: 'head -n 2', label: 'Top 2 items' },
        { id: 'grep_a', cmd: 'grep a', label: 'Filter "a"' }
      ],
      correctPipeline: ['sort_r'],
      description: 'Reverse sort the list from Z to A!'
    },
    {
      id: 2,
      inputData: ['star', 'rocket', 'tux', 'moon'],
      targetOutput: ['rocket', 'star'],
      availablePipes: [
        { id: 'sort', cmd: 'sort', label: 'Sort A-Z' },
        { id: 'head_2', cmd: 'head -n 2', label: 'Top 2 items' },
        { id: 'wc_l', cmd: 'wc -l', label: 'Count lines' }
      ],
      correctPipeline: ['sort', 'head_2'],
      description: 'Sort A-Z, then take only the top 2 items!'
    }
  ],
  hard: [
    {
      id: 1,
      inputData: ['penguin', 'elephant', 'tiger', 'cheetah', 'eagle'],
      targetOutput: ['tiger', 'penguin'],
      availablePipes: [
        { id: 'grep_i', cmd: 'grep i', label: 'Has "i"' },
        { id: 'sort_r', cmd: 'sort -r', label: 'Reverse Sort' },
        { id: 'head_2', cmd: 'head -n 2', label: 'Top 2 items' },
        { id: 'wc_l', cmd: 'wc -l', label: 'Count lines' }
      ],
      correctPipeline: ['grep_i', 'sort_r', 'head_2'],
      description: 'Filter words with "i", sort in reverse, take top 2!'
    },
    {
      id: 2,
      inputData: ['star', 'rocket', 'star', 'satellite', 'star'],
      targetOutput: ['3'],
      availablePipes: [
        { id: 'grep_star', cmd: 'grep star', label: 'Find "star"' },
        { id: 'wc_l', cmd: 'wc -l', label: 'Count lines' },
        { id: 'sort', cmd: 'sort', label: 'Alphabetical' }
      ],
      correctPipeline: ['grep_star', 'wc_l'],
      description: 'Count how many times "star" appears!'
    }
  ]
};

interface PipeConductorGameProps {
  onEarnXp?: (amount: number) => void;
}

export const PipeConductorGame: React.FC<PipeConductorGameProps> = ({
  onEarnXp
}) => {
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('medium');
  const [missionIdx, setMissionIdx] = useState(0);

  const activeMissions = MISSIONS_BY_DIFF[difficulty];
  const mission = activeMissions[missionIdx] || activeMissions[0];

  const [slottedPipes, setSlottedPipes] = useState<string[]>([]);
  const [currentOutput, setCurrentOutput] = useState<string[] | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const handleDifficultyChange = (newDiff: ArcadeDifficulty) => {
    setDifficulty(newDiff);
    setMissionIdx(0);
    setSlottedPipes([]);
    setCurrentOutput(null);
    setIsSuccess(false);
  };

  const handleAddPipe = (pipeId: string) => {
    if (slottedPipes.includes(pipeId)) return;
    soundEffects.playTabCompletion();
    setSlottedPipes(prev => [...prev, pipeId]);
    setCurrentOutput(null);
  };

  const handleRemovePipe = (pipeId: string) => {
    soundEffects.playTabCompletion();
    setSlottedPipes(prev => prev.filter(p => p !== pipeId));
    setCurrentOutput(null);
  };

  const rewardXp = difficulty === 'hard' ? 80 : difficulty === 'easy' ? 35 : 50;

  const handleRunPipeline = () => {
    soundEffects.playCommandSuccess();

    // Check if matches correctPipeline
    const isCorrect =
      slottedPipes.length === mission.correctPipeline.length &&
      slottedPipes.every((val, idx) => val === mission.correctPipeline[idx]);

    if (isCorrect) {
      setCurrentOutput(mission.targetOutput);
      setIsSuccess(true);
      setScore(s => s + rewardXp);
      soundEffects.playLevelComplete();
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      if (onEarnXp) onEarnXp(rewardXp);
      // Auto-advance to next pipeline puzzle after scoring right
      setTimeout(() => {
        handleNextMission();
      }, 1500);
    } else {
      soundEffects.playTabCompletion();
      setCurrentOutput(['(Pipeline mismatch: try different pipes!)']);
      setIsSuccess(false);
    }
  };

  const handleNextMission = () => {
    setSlottedPipes([]);
    setCurrentOutput(null);
    setIsSuccess(false);
    setMissionIdx((missionIdx + 1) % activeMissions.length);
  };

  return (
    <div className="max-w-xl mx-auto space-y-3 font-['Nunito',sans-serif]">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-['Fredoka',sans-serif]">
              Pipe Conductor • Mission {mission.id}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold">
              {mission.description}
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
              setSlottedPipes([]);
              setCurrentOutput(null);
              setIsSuccess(false);
            }}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 cursor-pointer shadow-xs active:scale-95"
            title="Clear pipeline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pipeline Stream Visual */}
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-950 shadow-xs space-y-3">
        <div className="text-[10px] font-black uppercase text-slate-400 flex items-center justify-between">
          <span>Active Pipeline:</span>
          <span>Target output: {mission.targetOutput.join(', ')}</span>
        </div>

        {/* The Pipeline Track */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-mono">
          <span className="px-2 py-1 bg-slate-800 rounded-lg text-emerald-400 font-black border border-slate-700 shrink-0">
            cat data.txt
          </span>

          <span className="text-amber-400 font-black text-sm">|</span>

          {slottedPipes.map((pId) => {
            const pipeObj = mission.availablePipes.find(p => p.id === pId);
            return (
              <React.Fragment key={pId}>
                <button
                  type="button"
                  onClick={() => handleRemovePipe(pId)}
                  className="px-2 py-1 bg-blue-600 hover:bg-rose-600 text-white rounded-lg font-black border border-blue-400 flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                  title="Click to remove"
                >
                  <span>{pipeObj?.cmd}</span>
                  <span className="text-[9px] opacity-75">✕</span>
                </button>
                <span className="text-amber-400 font-black text-sm">|</span>
              </React.Fragment>
            );
          })}

          {slottedPipes.length === 0 && (
            <span className="px-3 py-1 border border-dashed border-slate-700 rounded-lg text-slate-500 text-[11px] shrink-0">
              [ Tap pipe pieces below ]
            </span>
          )}

          <span className="px-2 py-1 bg-purple-950 text-purple-300 rounded-lg font-black border border-purple-800 shrink-0">
            output
          </span>
        </div>

        {/* Run Button */}
        <button
          type="button"
          onClick={handleRunPipeline}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Run Pipeline Stream</span>
        </button>
      </div>

      {/* Available Pipe Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2">
        <div className="text-[11px] font-black uppercase text-slate-500">
          Available Pipe Blocks (Tap to Connect):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {mission.availablePipes.map((pipe) => {
            const isSlotted = slottedPipes.includes(pipe.id);
            return (
              <button
                key={pipe.id}
                type="button"
                disabled={isSlotted}
                onClick={() => handleAddPipe(pipe.id)}
                className={`p-2 rounded-xl border text-left transition-all shadow-xs ${
                  isSlotted
                    ? 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed'
                    : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-400 cursor-pointer active:scale-95'
                }`}
              >
                <div className="font-mono font-black text-xs text-blue-700">
                  | {pipe.cmd}
                </div>
                <div className="text-[10px] text-slate-500 font-bold truncate">
                  {pipe.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Output Display */}
      {currentOutput && (
        <div className={`p-3 rounded-2xl border text-xs font-mono font-bold shadow-xs ${
          isSuccess ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-100 border-slate-300 text-slate-700'
        }`}>
          <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Result:</div>
          <div>{currentOutput.join(', ')}</div>
        </div>
      )}

      {/* Success Box */}
      {isSuccess && (
        <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-xs flex items-center justify-between gap-2 animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="text-xs font-black uppercase font-['Fredoka',sans-serif]">Pipeline Connected!</div>
              <div className="text-[11px] text-emerald-100 font-bold">+50 XP earned</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleNextMission}
            className="px-3.5 py-1.5 bg-[#FBBC05] hover:bg-yellow-300 text-black rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
          >
            <span>Next Mission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
