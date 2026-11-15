import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, CheckCircle2, Circle, Sparkles, HelpCircle, BookOpen, Award, ArrowRight, 
  Play, Lightbulb, Zap, Rocket, Sliders, ChevronDown, ChevronUp, Target, Tv, 
  Terminal, FileText, RotateCcw, Keyboard, Layers, Trophy, ExternalLink, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LevelInfo, UserProgress, StudentProfile, DifficultyLevel } from '../types';
import { Mascot, TuxSvg, JumboSvg } from './Mascot';
import { TerminalSimulator, CommandExecutionDetails } from './TerminalSimulator';
import { VFSState } from '../utils/vfs';
import { playCommandSuccessSound, playLevelCompleteSound } from '../utils/sound';

interface ChallengeViewProps {
  level: LevelInfo;
  levels?: LevelInfo[];
  progress: UserProgress;
  vfsState: VFSState;
  setVfsState: React.Dispatch<React.SetStateAction<VFSState>>;
  onBackToMap?: () => void;
  onCompleteLevel: (levelNumber: number, xpGained: number) => void;
  onGoToNextLevel: () => void;
  student?: StudentProfile | null;
  difficulty?: DifficultyLevel;
  onChangeDifficulty?: (diff: DifficultyLevel) => void;
  onSelectLevel?: (levelNumber: number) => void;
  onResetMissionFiles?: () => void;
  onOpenVideos?: () => void;
  onNavigateTab?: (tab: 'keyboard' | 'gui_compare' | 'badges' | 'leaderboard') => void;
  onClearLevels?: () => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  level,
  levels = [],
  progress,
  vfsState,
  setVfsState,
  onBackToMap,
  onCompleteLevel,
  onGoToNextLevel,
  student,
  difficulty = student?.difficulty || 'beginner',
  onChangeDifficulty,
  onSelectLevel,
  onResetMissionFiles,
  onOpenVideos,
  onNavigateTab,
  onClearLevels
}) => {
  // Step flow state: 'task' | 'victory'
  const isAlreadyFinished = progress.completedLevels.includes(level.levelNumber);
  const [activeStepTab, setActiveStepTab] = useState<'task' | 'victory'>('task');
  const [isRevealOpen, setIsRevealOpen] = useState(false);
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isLearnMenuOpen, setIsLearnMenuOpen] = useState(false);
  const learnMenuRef = useRef<HTMLDivElement>(null);

  // Close Learn Menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (learnMenuRef.current && !learnMenuRef.current.contains(event.target as Node)) {
        setIsLearnMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track objective completion
  const [completedObjs, setCompletedObjs] = useState<string[]>(
    isAlreadyFinished ? level.objectives.map(o => o.id) : []
  );
  const [levelFinished, setLevelFinished] = useState(isAlreadyFinished);
  const [hasClickedTerminal, setHasClickedTerminal] = useState(false);
  const [hasTypedCommand, setHasTypedCommand] = useState(false);
  const [taskPopup, setTaskPopup] = useState<{
    open: boolean;
    title: string;
    description: string;
    completedTaskName?: string;
    nextCommand?: string;
    hint?: string;
    isMissionComplete?: boolean;
  } | null>(null);
  const [terminalClearSignal, setTerminalClearSignal] = useState(0);
  const [terminalFocusSignal, setTerminalFocusSignal] = useState(0);
  const taskPopupTimerRef = useRef<NodeJS.Timeout | null>(null);

  const allLevelsList = levels && levels.length > 0 ? levels : [level];

  const dismissPopup = () => {
    if (taskPopupTimerRef.current) {
      clearTimeout(taskPopupTimerRef.current);
      taskPopupTimerRef.current = null;
    }
    setTaskPopup(null);
    setTerminalFocusSignal(prev => prev + 1);
  };

  const handleNextFromPopup = () => {
    const isComplete = Boolean(taskPopup?.isMissionComplete);
    if (taskPopupTimerRef.current) {
      clearTimeout(taskPopupTimerRef.current);
      taskPopupTimerRef.current = null;
    }
    setTaskPopup(null);
    setTerminalClearSignal(prev => prev + 1);
    if (isComplete) {
      if (level.levelNumber < 12) {
        onGoToNextLevel();
      } else if (onBackToMap) {
        onBackToMap();
      }
    }
    setTerminalFocusSignal(prev => prev + 1);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (taskPopupTimerRef.current) {
        clearTimeout(taskPopupTimerRef.current);
      }
    };
  }, []);

  // Reset states when changing level
  useEffect(() => {
    if (taskPopupTimerRef.current) {
      clearTimeout(taskPopupTimerRef.current);
      taskPopupTimerRef.current = null;
    }
    const isFinished = progress.completedLevels.includes(level.levelNumber);
    setHasClickedTerminal(false);
    setHasTypedCommand(false);
    setCompletedObjs(isFinished ? level.objectives.map(o => o.id) : []);
    setLevelFinished(isFinished);
    setIsRevealOpen(false); // keep closed by default so children start directly in the terminal!
    setIsCheatsheetOpen(false);
    setIsLearnMenuOpen(false);
    setActiveStepTab('task');
    setTaskPopup(null);
    setTerminalFocusSignal(prev => prev + 1);
  }, [level.levelNumber]);

  // Sync if levels were cleared externally (without wiping celebration popup on normal level completion)
  useEffect(() => {
    const isFinished = progress.completedLevels.includes(level.levelNumber);
    if (!isFinished && levelFinished) {
      setCompletedObjs([]);
      setLevelFinished(false);
      setTaskPopup(null);
      setTerminalClearSignal(prev => prev + 1);
      setTerminalFocusSignal(prev => prev + 1);
    } else if (isFinished && !levelFinished) {
      setLevelFinished(true);
      setCompletedObjs(level.objectives.map(o => o.id));
    }
  }, [progress.completedLevels, level.levelNumber]);

  const handleCommandExecuted = (
    cmd: string, 
    events: string[], 
    details?: CommandExecutionDetails
  ) => {
    setHasClickedTerminal(true);
    setHasTypedCommand(true);

    const newlyCompleted: string[] = [];
    const normalizedCmd = cmd.trim().toLowerCase().replace(/\s+/g, ' ');

    level.objectives.forEach(obj => {
      if (completedObjs.includes(obj.id)) return;

      const matchesWhoami = (obj.targetCheck === 'whoami' || obj.id.includes('whoami')) &&
        (normalizedCmd === 'whoami' || normalizedCmd === 'who am i' || normalizedCmd.startsWith('who am i') || events.includes('whoami'));

      if (events.includes(obj.targetCheck) || cmd.includes(obj.targetCheck) || matchesWhoami) {
        newlyCompleted.push(obj.id);
      }
    });

    if (newlyCompleted.length > 0) {
      const updated = [...completedObjs, ...newlyCompleted];
      setCompletedObjs(updated);

      const completedNames = newlyCompleted
        .map(id => level.objectives.find(o => o.id === id)?.description)
        .filter(Boolean) as string[];

      if (updated.length >= level.objectives.length) {
        if (!levelFinished) {
          setLevelFinished(true);
          onCompleteLevel(level.levelNumber, level.xpReward);
        }
        confetti({
          particleCount: 38,
          spread: 55,
          startVelocity: 26,
          scalar: 0.8,
          ticks: 100,
          origin: { y: 0.68 },
          colors: ['#34A853', '#4285F4', '#FBBC05', '#EA4335']
        });
        playLevelCompleteSound();

        if (taskPopupTimerRef.current) {
          clearTimeout(taskPopupTimerRef.current);
        }
        const nextLevel = allLevelsList.find(l => l.levelNumber === level.levelNumber + 1);
        const firstNextTask = nextLevel?.objectives?.[0]?.instruction || nextLevel?.objectives?.[0]?.description;
        const nextBrief = nextLevel
          ? `Mission ${nextLevel.levelNumber}: ${nextLevel.title}${firstNextTask ? ` (${firstNextTask})` : ''}`
          : 'All 12 missions completed! Open the Mission Map or keep exploring.';

        setTaskPopup({
          open: true,
          title: `Mission ${level.levelNumber} Complete!`,
          description: nextBrief,
          completedTaskName: `All tasks finished (+${level.xpReward} XP)`,
          nextCommand: nextLevel?.objectives?.[0]?.commandToType,
          isMissionComplete: true
        });
      } else {
        // Minimalist confetti burst after every successful question
        confetti({
          particleCount: 24,
          spread: 48,
          startVelocity: 24,
          scalar: 0.72,
          ticks: 90,
          origin: { y: 0.7 },
          colors: ['#34A853', '#4285F4', '#FBBC05']
        });
        playCommandSuccessSound();

        const finishedObj = newlyCompleted
          .map(id => level.objectives.find(o => o.id === id))
          .filter(Boolean)[0];

        const nextObj = level.objectives.find(o => !updated.includes(o.id));
        if (nextObj) {
          if (taskPopupTimerRef.current) {
            clearTimeout(taskPopupTimerRef.current);
          }
          setTaskPopup({
            open: true,
            title: 'Great Job! Step Complete',
            description: nextObj.instruction || nextObj.description,
            completedTaskName: finishedObj?.followUpDone || finishedObj?.instruction || completedNames[0] || 'Question answered!',
            nextCommand: nextObj.commandToType,
            hint: nextObj.why,
            isMissionComplete: false
          });
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-0 space-y-1 sm:space-y-2.5 font-['Nunito',sans-serif]">
      {/* Sleek Top Control Bar: Compact Single-Line on Mobile with Icons, Full Labels on Desktop */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs mx-1.5 sm:mx-0 mt-1 sm:mt-0">
        {/* Left: Current Level (Icon on mobile, full label on desktop) */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 hover:bg-slate-200/90 rounded-lg sm:rounded-xl px-1.5 sm:px-3 py-1 sm:py-1.5 border border-slate-200 shadow-2xs transition-all shrink-0">
          <span className="text-xs sm:text-sm shrink-0">🎯</span>
          <span className="text-[10px] sm:text-xs font-black text-slate-900 uppercase hidden xs:inline">
            Lvl {level.levelNumber}:
          </span>
          <select
            value={level.levelNumber}
            onChange={(e) => {
              if (e.target.value === 'clear_all_levels') {
                if (window.confirm('Delete level progress and restart fresh from Level 1?')) {
                  onClearLevels?.();
                }
                return;
              }
              onSelectLevel?.(Number(e.target.value));
            }}
            aria-label="Current Level & Actions"
            className="bg-transparent border-none outline-none font-bold text-slate-800 cursor-pointer text-[10px] sm:text-xs max-w-[80px] xs:max-w-[140px] sm:max-w-[240px] truncate"
          >
            <optgroup label="Select Mission">
              {allLevelsList.map((lvl) => {
                const isDone = progress.completedLevels.includes(lvl.levelNumber);
                const isCurrent = lvl.levelNumber === level.levelNumber;
                return (
                  <option key={lvl.levelNumber} value={lvl.levelNumber} className="text-slate-900 font-bold bg-white">
                    {isDone ? '✅' : isCurrent ? '👉' : '🔘'} L{lvl.levelNumber}: {lvl.title}
                  </option>
                );
              })}
            </optgroup>
            {onClearLevels && (
              <optgroup label="Actions">
                <option value="clear_all_levels" className="text-rose-600 font-bold bg-rose-50">
                  🔄 Clear All Levels (Restart L1)
                </option>
              </optgroup>
            )}
          </select>
        </div>

        {/* Center / Right: Objectives Bulb Icon, Learn Menu Drop List & Next Button (All on one line) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Objectives & Hints Bulb Button (Bulb icon on mobile, full label on tablet/desktop) */}
          <button
            type="button"
            onClick={() => {
              setIsRevealOpen(!isRevealOpen);
              if (isCheatsheetOpen) setIsCheatsheetOpen(false);
            }}
            className={`flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
              isRevealOpen
                ? 'bg-[#4285F4] text-white border-blue-600 shadow-xs'
                : completedObjs.length === level.objectives.length
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50/90 text-amber-950 border-amber-300 hover:bg-amber-100'
            }`}
            title="Reveal Mission Objectives, Hints & Video Tutorials"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            <span className="hidden sm:inline">Objectives</span>
            <span className="text-[10px] font-mono font-bold">
              {completedObjs.length}/{level.objectives.length}
            </span>
            {isRevealOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Learn Resources Drop List / Menu */}
          <div className="relative shrink-0" ref={learnMenuRef}>
            <button
              type="button"
              onClick={() => setIsLearnMenuOpen(!isLearnMenuOpen)}
              className="flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] sm:text-xs font-black text-slate-700 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Open Learn Resources & Tools"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#4285F4] shrink-0" />
              <span className="hidden md:inline">Learn</span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500" />
            </button>

            {/* Drop List Popup Menu */}
            {isLearnMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Learn Resources
                </div>

                {/* 1. Watch Our Jumbo Linux Videos (Embedded from YouTube) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLearnMenuOpen(false);
                    if (onOpenVideos) {
                      onOpenVideos();
                    } else {
                      window.dispatchEvent(new CustomEvent('open-jumbo-videos'));
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-slate-800 hover:text-red-700 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-lg bg-red-100 text-red-600">
                    <Tv className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="font-black text-red-950 text-xs">Our Jumbo Linux Videos</div>
                    <div className="text-[10px] text-slate-500 font-medium">Embedded lessons from YouTube</div>
                  </div>
                </button>

                {/* 2. Commands Cheatsheet */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLearnMenuOpen(false);
                    setIsCheatsheetOpen(!isCheatsheetOpen);
                    if (isRevealOpen) setIsRevealOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-lg bg-blue-100 text-blue-600">
                    <FileText className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="font-black text-slate-900 text-xs">Command Cheatsheet</div>
                    <div className="text-[10px] text-slate-500 font-medium">Quick reference & spellbook</div>
                  </div>
                </button>

                {/* 3. Keyboard Practice */}
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLearnMenuOpen(false);
                      onNavigateTab('keyboard');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-amber-800 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
                      <Keyboard className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-black text-slate-900 text-xs">Keyboard Practice</div>
                      <div className="text-[10px] text-slate-500 font-medium">Learn keys & touch typing</div>
                    </div>
                  </button>
                )}

                {/* 4. GUI vs Terminal Comparison */}
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLearnMenuOpen(false);
                      onNavigateTab('gui_compare');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 text-slate-800 hover:text-purple-700 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="p-1 rounded-lg bg-purple-100 text-purple-600">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-black text-slate-900 text-xs">GUI vs Terminal</div>
                      <div className="text-[10px] text-slate-500 font-medium">Why the CLI is faster</div>
                    </div>
                  </button>
                )}

                {/* 5. Top 10 Real-Time Leaderboard */}
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLearnMenuOpen(false);
                      onNavigateTab('leaderboard');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-amber-900 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
                      <Trophy className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-black text-slate-900 text-xs">Global Leaderboard</div>
                      <div className="text-[10px] text-slate-500 font-medium">Top 10 explorers & live sync</div>
                    </div>
                  </button>
                )}

                {/* 5. Full Mission Map Drawer */}
                {onBackToMap && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLearnMenuOpen(false);
                      onBackToMap();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="p-1 rounded-lg bg-emerald-100 text-emerald-600">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-black text-slate-900 text-xs">All Missions Drawer</div>
                      <div className="text-[10px] text-slate-500 font-medium">Browse all 12 shell quests</div>
                    </div>
                  </button>
                )}

                {/* 6. Reset Mission Files */}
                {onResetMissionFiles && (
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLearnMenuOpen(false);
                        onResetMissionFiles();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-amber-50 text-amber-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reset Shell Virtual Drive</span>
                    </button>
                  </div>
                )}

                {/* 7. Clear All Levels Option in Drop List */}
                {onClearLevels && (
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLearnMenuOpen(false);
                        if (window.confirm('Delete level progress and restart fresh from Level 1?')) {
                          onClearLevels();
                        }
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                      <span>Clear All Levels (Restart L1)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Difficulty mode tag (Hidden on smallest mobile, shown as dot/icon on mobile, full on desktop) */}
          <button
            type="button"
            onClick={() => {
              if (onChangeDifficulty) {
                const next = difficulty === 'beginner' ? 'intermediate' : difficulty === 'intermediate' ? 'advanced' : 'beginner';
                onChangeDifficulty(next);
              }
            }}
            title={`Mode: ${difficulty}. Click to toggle difficulty!`}
            className={`px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-black uppercase hidden xs:flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
              difficulty === 'advanced'
                ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                : difficulty === 'intermediate'
                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{difficulty === 'advanced' ? '🔴 Adv' : difficulty === 'intermediate' ? '🟡 Mid' : '🟢 Easy'}</span>
          </button>

          {/* Next Button on the Right of the Screen */}
          <button
            type="button"
            onClick={() => {
              if (levelFinished || completedObjs.length >= level.objectives.length) {
                setTerminalClearSignal(prev => prev + 1);
                if (level.levelNumber < 12) {
                  onGoToNextLevel();
                } else if (onBackToMap) {
                  onBackToMap();
                }
                setTerminalFocusSignal(prev => prev + 1);
              } else {
                const nextPending = level.objectives.find(o => !completedObjs.includes(o.id));
                if (nextPending) {
                  setTaskPopup({
                    open: true,
                    title: '🎯 Current Goal:',
                    description: nextPending.instruction || nextPending.description,
                    nextCommand: nextPending.commandToType,
                    hint: nextPending.why || nextPending.hint,
                    isMissionComplete: false
                  });
                }
              }
            }}
            className={`flex items-center gap-1 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
              levelFinished || completedObjs.length >= level.objectives.length
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-600 hover:from-emerald-600 hover:to-green-700 shadow-md ring-2 ring-emerald-400/50 animate-pulse'
                : 'bg-[#FBBC05] hover:bg-yellow-400 text-slate-950 border-amber-500'
            }`}
            title="Next Task / Next Mission"
          >
            <span>{levelFinished || completedObjs.length >= level.objectives.length ? 'Next →' : 'Next >'}</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* Trophy / Level Finished Button */}
          {levelFinished && (
            <button
              onClick={() => setActiveStepTab(activeStepTab === 'victory' ? 'task' : 'victory')}
              className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <span>{activeStepTab === 'victory' ? '← Shell' : '🏆 Trophy'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-bar below levels: Active Capstone project status */}
      {level.capstone && (
        <div className="flex items-center justify-end px-2 sm:px-1 py-0.5 mx-1.5 sm:mx-0">
          <button
            type="button"
            onClick={() => setIsRevealOpen(prev => !prev)}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-lg truncate cursor-pointer transition-colors"
            title="Click to view Capstone Project & relative learning guide"
          >
            <span>🎓 Capstone:</span>
            <span className="truncate max-w-[150px] xs:max-w-[220px] sm:max-w-[340px] font-black">{level.capstone.title}</span>
          </button>
        </div>
      )}

      {/* Minimalist Celebration Popup with Next Button (clears terminal & states next task briefly) */}
      <AnimatePresence>
        {taskPopup?.open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md rounded-2xl shadow-xl p-3.5 sm:p-4 font-['Nunito',sans-serif] border ${
              taskPopup.isMissionComplete
                ? 'bg-white/95 backdrop-blur-md border-emerald-300 shadow-emerald-500/15'
                : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-slate-900/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                taskPopup.isMissionComplete
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                🎉
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-black uppercase tracking-wider ${
                    taskPopup.isMissionComplete ? 'text-emerald-700' : 'text-slate-800'
                  }`}>
                    {taskPopup.title}
                  </span>
                  <button
                    type="button"
                    onClick={dismissPopup}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                    title="Dismiss (keep typing)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {taskPopup.completedTaskName && (
                  <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{taskPopup.completedTaskName}</span>
                  </p>
                )}

                <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-200/80 space-y-0.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                    {taskPopup.isMissionComplete ? 'Up Next:' : 'Next Task:'}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {taskPopup.description}
                  </div>
                  {taskPopup.nextCommand && (
                    <div className="text-[11px] font-mono text-slate-500 pt-0.5">
                      Command: <code className="text-slate-900 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">{taskPopup.nextCommand}</code>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={handleNextFromPopup}
                    className={`w-full py-2 px-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-98 ${
                      taskPopup.isMissionComplete
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#4285F4] hover:bg-blue-600 text-white'
                    }`}
                  >
                    <span>{taskPopup.isMissionComplete ? 'Next Mission & Clear Terminal' : 'Next & Clear Terminal'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVEAL PANEL: Objectives & Tux Guide (Collapsible, closed by default for direct terminal immersion) */}
      <AnimatePresence>
        {isRevealOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-sm space-y-3 mx-1.5 sm:mx-0">
              {/* Mission Summary & Mascot Tip */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 bg-amber-50 border border-amber-200 rounded-xl">
                    <TuxSvg size={28} mood="happy" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase font-['Fredoka',sans-serif]">
                      Mission {level.levelNumber}: {level.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {level.subtitle || level.mascotTip}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-[11px] font-mono text-slate-400 font-bold hidden md:inline">
                    💡 Tip: You can also type 'tasks', 'hint', or 'videos' directly in the shell!
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRevealOpen(false)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    ▲ Hide
                  </button>
                </div>
              </div>

              {/* Objectives Checklist */}
              <div className="space-y-1.5">
                <div className="text-[11px] uppercase font-black tracking-wider text-slate-400">
                  Target Objectives:
                </div>
                {level.objectives.map((obj, idx) => {
                  const isDone = completedObjs.includes(obj.id);
                  const isNext = !isDone && completedObjs.length === idx;
                  return (
                    <div
                      key={obj.id}
                      className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between gap-3 transition-all ${
                        isDone
                          ? 'bg-emerald-50/70 text-emerald-900 border border-emerald-200/80'
                          : isNext
                          ? 'bg-amber-50/90 text-slate-900 border border-amber-300 ring-2 ring-amber-400/30'
                          : 'bg-slate-50/80 text-slate-700 border border-slate-200/70'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <span className="shrink-0 text-base mt-0.5">
                          {isDone ? '✅' : isNext ? '👉' : '🔘'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className={isDone ? 'text-emerald-800 font-bold truncate text-xs sm:text-sm' : 'text-slate-900 font-bold truncate text-xs sm:text-sm'}>
                            {isDone && obj.followUpDone ? `Done: ${obj.followUpDone}` : (obj.instruction || obj.description)}
                          </div>
                          {!isDone && obj.why && (
                            <div className="text-[11px] text-amber-800/90 font-medium truncate mt-0.5">
                              💡 Why: {obj.why}
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md shrink-0 ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : isNext
                            ? 'bg-amber-400 text-amber-950 animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isDone ? 'Done' : isNext ? 'Current' : 'Next'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dedicated Mission Capstone Project Card with Relative Learning Content */}
              {level.capstone && (
                <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white p-3.5 sm:p-4 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎓</span>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 font-mono">
                          Mission {level.levelNumber} Capstone Project
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 font-['Fredoka',sans-serif]">
                          {level.capstone.title}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-100 border border-indigo-300 text-indigo-900 text-xs font-black shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-400" />
                      <span>+{level.capstone.bonusXp} XP</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 font-bold leading-relaxed bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                    <span className="text-indigo-950 font-black">Mission Scenario: </span>
                    {level.capstone.scenario}
                  </div>

                  {/* Relative Learning Content: How Commands Connect Together */}
                  <div className="bg-indigo-950 text-indigo-100 rounded-xl p-3 text-xs leading-relaxed space-y-1 shadow-inner">
                    <div className="font-black text-amber-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>How These Commands Connect Together:</span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium">
                      {level.capstone.learningTakeaway}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                    <div className="text-[11px] font-mono font-bold text-slate-600 flex items-center gap-1">
                      <span>Target:</span>
                      <code className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded-lg border border-slate-300 font-black">
                        {level.capstone.command}
                      </code>
                    </div>
                    <div className="text-xs font-black">
                      {completedObjs.includes(`obj_${level.levelNumber}_capstone`) ? (
                        <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Capstone Complete!</span>
                        </span>
                      ) : (
                        <span className="text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-lg border border-indigo-300">
                          ⏳ In Progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tux Hint Callout & Embedded Video Button */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2.5 text-xs text-blue-900 flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <span className="text-base shrink-0">💡</span>
                  <div className="space-y-0.5">
                    <span className="font-bold">Tux Guide: </span>
                    <span>{level.mascotTip}</span>
                  </div>
                </div>

                {/* Embedded Video Quick Launch Button in Objective Dropdown */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenVideos) {
                      onOpenVideos();
                    } else {
                      window.dispatchEvent(new CustomEvent('open-jumbo-videos'));
                    }
                  }}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0 self-end sm:self-center"
                  title="Watch YouTube video tutorial for this mission"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Watch Video Lesson</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVEAL PANEL: Cheatsheet (Collapsible) */}
      <AnimatePresence>
        {isCheatsheetOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-['Fredoka',sans-serif]">
                    Jumbo Linux Kid's Command Cheatsheet
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCheatsheetOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {[
                  { cmd: 'pwd', desc: 'Print working directory (Where am I?)' },
                  { cmd: 'ls', desc: 'List files and folders in directory' },
                  { cmd: 'cd <folder>', desc: 'Change folder (cd .. goes back)' },
                  { cmd: 'cat <file>', desc: 'Read and display file contents' },
                  { cmd: 'touch <file>', desc: 'Create a new blank file' },
                  { cmd: 'mkdir <dir>', desc: 'Make a new folder' },
                  { cmd: 'whoami', desc: 'Display your user identity' },
                  { cmd: 'grep <word> <f>', desc: 'Search for words in files' },
                  { cmd: 'cowsay <msg>', desc: 'Talking animal terminal spell!' },
                  { cmd: 'chmod +x <f>', desc: 'Unlock permissions to run script' },
                  { cmd: 'ps aux', desc: 'List active running processes' },
                  { cmd: 'clear', desc: 'Clear the terminal screen (Ctrl+L)' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                    <span className="font-mono font-black text-blue-600">{item.cmd}</span>
                    <span className="text-[11px] text-slate-600 font-medium">{item.desc}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>💡 You can also type <code>help</code> or <code>cheatsheet</code> inside the terminal!</span>
                <button
                  type="button"
                  onClick={() => setIsCheatsheetOpen(false)}
                  className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Close Cheatsheet ▲
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN STAGE: Live Terminal Simulator (100vw on mobile, perfectly framed for screen) */}
      {activeStepTab === 'task' && (
        <div className="w-full flex-1 min-h-0 flex flex-col">
          <TerminalSimulator
            vfsState={vfsState}
            setVfsState={setVfsState}
            onCommandExecuted={handleCommandExecuted}
            onTerminalClick={() => {
              setHasClickedTerminal(true);
            }}
            isTerminalClicked={hasClickedTerminal}
            activeLevel={level}
            completedObjectives={completedObjs}
            levels={allLevelsList}
            onToggleReveal={() => setIsRevealOpen(prev => !prev)}
            suggestedPills={
              difficulty === 'advanced'
                ? []
                : difficulty === 'intermediate'
                ? Array.from(new Set(level.suggestedPills.map(p => p.split(' ')[0])))
                : level.suggestedPills
            }
            bannerTitle={`Jumbo-Linux Shell - Mission ${level.levelNumber}: ${level.title}`}
            studentEmail={student?.email}
            studentName={student?.name}
            studentAvatar={student?.avatar}
            studentXp={progress.xp}
            totalLevelsCount={allLevelsList.length || 12}
            clearSignal={terminalClearSignal}
            focusSignal={terminalFocusSignal}
            className="w-full flex-1 rounded-none sm:rounded-2xl"
          />
        </div>
      )}

      {/* STEP 3: Victory & Trophy Screen */}
      {activeStepTab === 'victory' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-3xl shadow-xs">
            🏆
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
              Mission {level.levelNumber} Mastered!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase tracking-tight">
              Congratulations!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
              You completed all objectives for <strong>{level.title}</strong>!
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center min-w-[120px]">
              <div className="text-[10px] font-bold uppercase text-slate-500">XP Gained</div>
              <div className="text-2xl sm:text-3xl font-black text-[#34A853] font-mono">
                +{level.xpReward}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-center min-w-[120px]">
              <div className="text-[10px] font-bold uppercase text-slate-500">Mission Status</div>
              <div className="text-2xl sm:text-3xl font-black text-[#4285F4] font-mono">
                100%
              </div>
            </div>
          </div>

          {/* Clean NEXT LEVEL Button */}
          <div className="pt-2 max-w-md mx-auto space-y-2">
            {level.levelNumber < 12 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGoToNextLevel}
                className="w-full py-3.5 px-6 rounded-xl bg-[#FBBC05] hover:bg-yellow-300 text-black border border-amber-500 font-bold uppercase text-sm sm:text-base tracking-wider shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Next Mission →</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <button
                onClick={onBackToMap}
                className="w-full py-3.5 px-6 rounded-xl bg-[#34A853] text-white border border-emerald-600 font-bold uppercase text-sm sm:text-base tracking-wider shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5" />
                <span>All Missions Completed! 🌟</span>
              </button>
            )}

            <button
              onClick={() => setActiveStepTab('task')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Practice more in this terminal
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};


