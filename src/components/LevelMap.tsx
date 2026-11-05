import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, CheckCircle2, Play, Sparkles, ArrowRight, ArrowLeft, Trophy, Keyboard, AlertCircle, RotateCcw } from 'lucide-react';
import { LevelInfo, UserProgress, GradeBand } from '../types';
import { Mascot, TuxSvg } from './Mascot';

interface LevelMapProps {
  levels: LevelInfo[];
  progress: UserProgress;
  isKeyboardCompleted: boolean;
  onSelectLevel: (level: LevelInfo) => void;
  onGoBackToHub: () => void;
  onGoToKeyboard: () => void;
  onOpenLeaderboard: () => void;
  onClearLevels?: () => void;
}

const BAND_META: Record<GradeBand, { title: string; subtitle: string; badge: string; color: string }> = {
  elementary: {
    title: 'Beginner Explorers (Levels 0–2)',
    subtitle: 'What is a Computer, Treehouse Folders & Keyboard Super-Powers',
    badge: 'Step 1: The Basics',
    color: 'text-emerald-700'
  },
  middle: {
    title: 'Junior Navigators (Levels 3–6)',
    subtitle: 'Where Am I, Exploring Rooms, Making Folders & Secret Passwords',
    badge: 'Step 2: Exploring',
    color: 'text-blue-700'
  },
  high_early: {
    title: 'Detective Sleuths (Levels 7–10)',
    subtitle: 'Reading Books, Finding Hidden Clues & Stopping Stuck Tasks',
    badge: 'Step 3: Detective Tools',
    color: 'text-purple-700'
  },
  high_advanced: {
    title: 'Master Coders (Levels 11–12)',
    subtitle: 'Magic Automation Scripts & The Secret Treasure Castle',
    badge: 'Step 4: Master Quest',
    color: 'text-amber-700'
  }
};

export const LevelMap: React.FC<LevelMapProps> = ({
  levels,
  progress,
  isKeyboardCompleted,
  onSelectLevel,
  onGoBackToHub,
  onGoToKeyboard,
  onOpenLeaderboard,
  onClearLevels
}) => {
  const bands: GradeBand[] = ['elementary', 'middle', 'high_early', 'high_advanced'];

  const completedCount = progress.completedLevels.length;
  const totalLevels = levels.length;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);

  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Strictly check if a level is unlocked:
  // Level 0 requires keyboard completion (or at least let them know)
  // Level N requires level N-1 to be completed!
  const isLevelUnlocked = (levelNum: number): boolean => {
    if (levelNum === 0) {
      return true; // Level 0 can be played, but we show keyboard tip if not done
    }
    return progress.completedLevels.includes(levelNum - 1);
  };

  const handleLevelClick = (level: LevelInfo) => {
    if (!isLevelUnlocked(level.levelNumber)) {
      setLockedNotice(`🔒 Level ${level.levelNumber} is locked! Complete Level ${level.levelNumber - 1} first to open this door.`);
      return;
    }
    onSelectLevel(level);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 font-['Nunito',sans-serif]">
      {/* Top Breadcrumb / Return to Hub Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onGoBackToHub}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 border-3 border-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] cursor-pointer active:translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to All Activities</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="flex items-center gap-2 px-4 py-2 bg-[#FBBC05] hover:bg-yellow-300 text-black border-3 border-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] cursor-pointer active:translate-y-0.5 transition-all"
        >
          <Trophy className="w-4 h-4" />
          <span>Hall of Champions</span>
        </button>
      </div>

      {/* Hero Banner: Start Learning Linux */}
      <div className="bg-[#4285F4] border-4 border-black rounded-3xl p-6 sm:p-8 text-white shadow-[8px_8px_0px_0px_#000] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBC05] text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            CORE JOURNEY • 13 LEVELS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Fredoka',sans-serif] tracking-tight uppercase text-white leading-none">
            Start Learning Linux
          </h1>
          <p className="text-white/95 text-sm sm:text-base font-bold leading-relaxed">
            Step by step from your very first command all the way to solving the grand treasure castle! Finish each level to unlock the next room.
          </p>
        </div>

        {/* Aside box: Mastery Tracker */}
        <div className="w-full lg:w-auto bg-black text-white p-5 rounded-3xl border-4 border-[#34A853] shadow-[6px_6px_0px_0px_#000] flex items-center gap-4 shrink-0">
          <TuxSvg size={54} mood="happy" />
          <div>
            <p className="text-xs font-black text-[#34A853] uppercase tracking-wider mb-0.5">LEARNING PROGRESS</p>
            <div className="text-2xl font-black font-mono text-[#FBBC05]">{progressPercent}% COMPLETED</div>
            <div className="text-xs font-bold text-slate-300">{completedCount} of {totalLevels} Levels Conquered</div>
            <div className="w-40 h-3 bg-slate-800 border-2 border-black rounded-full overflow-hidden mt-1.5">
              <div 
                className="h-full bg-[#34A853] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard First Reminder Banner (if not completed) */}
      {!isKeyboardCompleted && (
        <div className="p-4 rounded-2xl bg-[#FEF7E0] border-3 border-black shadow-[4px_4px_0px_0px_#FBBC05] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBBC05] border-2 border-black flex items-center justify-center shrink-0">
              <Keyboard className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-amber-950">RECOMMENDED FIRST STEP:</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">
                Complete "Learn to Type Faster" to boost your terminal typing speed!
              </div>
            </div>
          </div>

          <button
            onClick={onGoToKeyboard}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-y-0.5 shrink-0"
          >
            Go to Keyboard Lesson →
          </button>
        </div>
      )}

      {/* Locked Notice Pop-up Banner */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-2xl bg-rose-100 border-3 border-black text-rose-950 font-bold text-xs sm:text-sm flex items-center justify-between shadow-[4px_4px_0px_0px_#000]"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{lockedNotice}</span>
            </div>
            <button
              onClick={() => setLockedNotice(null)}
              className="text-xs font-black uppercase underline ml-2 cursor-pointer"
            >
              OK, Got it!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grade Bands & Sequential Level Cards */}
      <div className="space-y-10">
        {bands.map(bandKey => {
          const meta = BAND_META[bandKey];
          const bandLevels = levels.filter(l => l.gradeBand === bandKey);

          return (
            <section key={bandKey} className="space-y-4">
              {/* Band Header */}
              <div className="p-4 sm:p-5 rounded-3xl border-3 border-black bg-white shadow-[5px_5px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FBBC05] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      {meta.badge}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase">
                      {meta.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-bold">
                    {meta.subtitle}
                  </p>
                </div>
                <div className="text-xs font-black font-mono uppercase bg-slate-100 border-2 border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000] shrink-0 self-start sm:self-auto">
                  {bandLevels.filter(l => progress.completedLevels.includes(l.levelNumber)).length} / {bandLevels.length} COMPLETED
                </div>
              </div>

              {/* Level Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {bandLevels.map(level => {
                  const isUnlocked = isLevelUnlocked(level.levelNumber);
                  const isCompleted = progress.completedLevels.includes(level.levelNumber);
                  const isCurrent = isUnlocked && !isCompleted;

                  return (
                    <motion.div
                      key={level.levelNumber}
                      whileHover={isUnlocked ? { scale: 1.02 } : {}}
                      onClick={() => handleLevelClick(level)}
                      className={`relative rounded-3xl p-5 flex flex-col justify-between transition-all cursor-pointer select-none ${
                        isCompleted
                          ? 'bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(52,168,83,1)]'
                          : isCurrent
                          ? 'bg-[#FBBC05] border-4 border-black shadow-[6px_6px_0px_0px_#000] text-black'
                          : isUnlocked
                          ? 'bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(66,133,244,1)]'
                          : 'bg-slate-200 border-4 border-dashed border-slate-400 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Top status */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? 'text-black' : 'text-slate-500'}`}>
                            {level.grade}
                          </span>

                          {isCompleted ? (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]">
                              <CheckCircle2 className="w-3 h-3 text-[#34A853]" />
                              <span>CLEARED</span>
                            </span>
                          ) : isUnlocked ? (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-black bg-white px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]">
                              <span>READY</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-600 bg-slate-300 px-2 py-0.5 rounded-full border border-slate-400">
                              <Lock className="w-3 h-3" />
                              <span>LOCKED</span>
                            </span>
                          )}
                        </div>

                        {/* Title & Level Number */}
                        <div className="flex items-start gap-2.5">
                          <div className={`w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center font-mono font-black text-base shrink-0 ${
                            isCompleted ? 'bg-[#34A853] text-white' : isCurrent ? 'bg-black text-white' : isUnlocked ? 'bg-[#4285F4] text-white' : 'bg-slate-400 text-white'
                          }`}>
                            {level.levelNumber}
                          </div>

                          <div>
                            <h4 className="text-base font-black uppercase font-['Fredoka',sans-serif] leading-tight">
                              {level.title}
                            </h4>
                            <p className={`text-xs font-bold mt-0.5 ${isCurrent ? 'text-slate-800' : 'text-slate-600'}`}>
                              {level.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Button */}
                      <div className="pt-4 mt-3 border-t-2 border-black/10 flex items-center justify-between">
                        <span className="font-mono text-xs font-black">
                          +{level.xpReward} XP
                        </span>

                        {isUnlocked ? (
                          <div className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] ${
                            isCurrent ? 'bg-black text-white' : 'bg-white text-black hover:bg-slate-100'
                          }`}>
                            <span>{isCompleted ? 'REPLAY' : 'PLAY'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Unlock Lvl {level.levelNumber - 1}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
