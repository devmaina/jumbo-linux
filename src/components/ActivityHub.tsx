import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Keyboard, Swords, Sparkles, Trophy, Award, Mouse, ArrowRight, CheckCircle2, Lock, BookOpen } from 'lucide-react';
import { UserProgress, StudentProfile, LevelInfo } from '../types';
import { TuxSvg, JumboSvg } from './Mascot';

interface ActivityHubProps {
  progress: UserProgress;
  activeCadet?: StudentProfile;
  activeStudent?: StudentProfile;
  levels: LevelInfo[];
  isKeyboardCompleted: boolean;
  onSelectActivity: (tab: 'learning' | 'keyboard' | 'rescue' | 'duels' | 'terminal' | 'gui_compare' | 'badges') => void;
  onOpenAuthModal: () => void;
}

export const ActivityHub: React.FC<ActivityHubProps> = ({
  progress,
  activeCadet,
  activeStudent,
  levels,
  isKeyboardCompleted,
  onSelectActivity,
  onOpenAuthModal
}) => {
  const currentStudent = activeStudent || activeCadet || { name: 'Explorer', avatar: '🐘' };
  const completedLevelsCount = progress.completedLevels.length;
  const currentLevelInfo = levels.find(l => l.levelNumber === progress.currentLevel) || levels[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 font-['Nunito',sans-serif]">
      {/* Friendly, Breathing Hero Welcome */}
      <div className="bg-white rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF7E0] border-2 border-black text-xs font-black uppercase text-slate-800 shadow-[2px_2px_0px_0px_#000]">
            <span>{currentStudent.avatar}</span>
            <span>PLAYER: {currentStudent.name}</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#34A853] font-black">{progress.xp} XP</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase tracking-tight leading-tight">
            Ready to Explore Linux?
          </h1>

          <p className="text-sm sm:text-base font-bold text-slate-600 max-w-xl">
            Choose an activity below to learn terminal commands, practice fast keyboard navigation, play arcade games, and earn badges.
          </p>
        </div>

        <div className="flex items-center -space-x-4 shrink-0 hover:scale-105 transition-transform duration-200">
          <JumboSvg size={64} mood="happy" />
          <TuxSvg size={68} mood="celebrating" />
        </div>
      </div>

      {/* Primary Cards Grid (Spacious & Clean for Kids) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: CORE - START LEARNING LINUX */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="md:col-span-2 bg-[#4285F4] rounded-3xl border-4 border-black p-6 sm:p-8 text-white shadow-[8px_8px_0px_0px_#000] flex flex-col justify-between space-y-5 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBC05] text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                CORE ADVENTURE • LEVELS 0 TO 12
              </div>

              <h2 className="text-3xl sm:text-4xl font-black font-['Fredoka',sans-serif] uppercase tracking-tight">
                Start Learning Linux
              </h2>

              <p className="text-white/95 text-sm sm:text-base font-bold leading-relaxed">
                Your main journey: master shell commands, navigate directories, complete quests, and earn badges.
              </p>
            </div>

            {/* Status box */}
            <div className="bg-black text-white p-4 rounded-2xl border-3 border-white shadow-[4px_4px_0px_0px_#000] shrink-0 text-center sm:text-left min-w-[170px]">
              <div className="text-[10px] font-black uppercase text-[#34A853]">LEVEL PROGRESS</div>
              <div className="text-2xl font-black font-mono text-[#FBBC05]">{completedLevelsCount}/13 CLEARED</div>
              <div className="text-xs font-bold text-slate-300 truncate max-w-[150px]">
                Current: {currentLevelInfo.title}
              </div>
            </div>
          </div>

          {/* Helper hint if keyboard not finished */}
          {!isKeyboardCompleted && (
            <div className="p-3 bg-amber-300 text-black border-2 border-black rounded-xl text-xs font-black flex items-center justify-between gap-2 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center gap-2">
                <span>💡</span>
                <span>Complete "Learn to Type Faster" below to speed up your terminal commands!</span>
              </div>
              <button
                onClick={() => onSelectActivity('keyboard')}
                className="underline uppercase shrink-0 text-slate-900 cursor-pointer"
              >
                Go to Typing →
              </button>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={() => onSelectActivity('badges')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border-2 border-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer w-fit"
            >
              <Trophy className="w-4 h-4 text-[#FBBC05]" />
              <span>Leaderboard & Badges</span>
            </button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectActivity('learning')}
              className="px-8 py-3.5 bg-[#34A853] hover:bg-emerald-400 text-white border-3 border-black rounded-2xl font-black text-base uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2 cursor-pointer animate-bounce"
            >
              <span>{completedLevelsCount === 0 ? 'START LEARNING LINUX →' : 'CONTINUE LEARNING LINUX →'}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* CARD 2: LEARN HOW TO TYPE FASTER */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="bg-white rounded-3xl border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBC05] text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
              <Keyboard className="w-3.5 h-3.5" />
              <span>KEYBOARD SUPER-KEYS • 5 STEPS</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase">
              Learn How to Type Faster
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600">
              Master the 5 super-keys on your keyboard: <strong>[Enter]</strong>, <strong>[Space]</strong>, <strong>[Tab]</strong>, <strong>[Up Arrow]</strong>, and <strong>[Ctrl+C]</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border-2 border-black rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {isKeyboardCompleted ? '✅ Typing License Earned!' : '⏳ 5 Easy Steps to Complete'}
            </span>
            <span className="text-xs font-black text-[#34A853]">+150 XP</span>
          </div>

          <button
            onClick={() => onSelectActivity('keyboard')}
            className="w-full py-3 bg-[#FBBC05] hover:bg-yellow-300 text-black border-3 border-black rounded-2xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] cursor-pointer active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>{isKeyboardCompleted ? 'PRACTICE TYPING STEPS AGAIN →' : 'LEARN HOW TO TYPE FASTER →'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* CARD 3: LINUX ARCADE (COMMAND MATCHER & KEYBOARD RESCUE) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="bg-white rounded-3xl border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA4335] text-white border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
              <span>🎮</span>
              <span>ARCADE GAMES • COMMAND MATCHER & RESCUE</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase">
              Linux Arcade Games
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600">
              Drag commands like <code>pwd</code> and <code>ls</code> to placeholders showing what they do, or save falling penguins!
            </p>
          </div>

          <div className="p-3 bg-slate-50 border-2 border-black rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Drag & Drop Matcher + Rescue Game
            </span>
            <span className="text-xs font-black text-[#34A853]">+100 XP</span>
          </div>

          <button
            onClick={() => onSelectActivity('rescue')}
            className="w-full py-3 bg-[#EA4335] hover:bg-rose-600 text-white border-3 border-black rounded-2xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] cursor-pointer active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>PLAY COMMAND MATCHER & RESCUE →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* CARD 4: TUX SPEED DUELS */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="bg-white rounded-3xl border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500 text-white border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
              <Swords className="w-3.5 h-3.5" />
              <span>SPEED RACE • 3 STEPS</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase">
              Tux Friendly Duels
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600">
              Race against friendly computer penguins to see who can type words faster across 3 difficulty steps!
            </p>
          </div>

          <div className="p-3 bg-slate-50 border-2 border-black rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Duels Won: <strong>{progress.duelsWon} victories</strong>
            </span>
            <span className="text-xs font-black text-[#34A853]">+150 XP</span>
          </div>

          <button
            onClick={() => onSelectActivity('duels')}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white border-3 border-black rounded-2xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] cursor-pointer active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>START DUEL STEPS →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* CARD 5: FREE SHELL PLAYGROUND */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="bg-white rounded-3xl border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34A853] text-white border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
              <Terminal className="w-3.5 h-3.5" />
              <span>PRACTICE SANDBOX</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase">
              Free Shell Playground
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600">
              Your own open toybox! Type any command you want with no test, no timers, and explore freely.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border-2 border-black rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Unlimited practice & command pills
            </span>
            <span className="text-xs font-black text-blue-600">Open Shell</span>
          </div>

          <button
            onClick={() => onSelectActivity('terminal')}
            className="w-full py-3 bg-[#34A853] hover:bg-emerald-600 text-white border-3 border-black rounded-2xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] cursor-pointer active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>OPEN SHELL PLAYGROUND →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* CARD 6: MOUSE VS TYPING COMPARISON */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="md:col-span-2 bg-[#FEF7E0] rounded-3xl border-4 border-black p-6 sm:p-7 shadow-[6px_6px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#FBBC05]">
              <Mouse className="w-3.5 h-3.5 text-[#FBBC05]" />
              <span>FUN COMPARISON • 3 STEPS</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase">
              Mouse Clicking vs Tux Typing
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-xl">
              See why typing magic commands is 10 times faster than clicking through folders with a mouse!
            </p>
          </div>

          <button
            onClick={() => onSelectActivity('gui_compare')}
            className="px-6 py-3.5 bg-[#4285F4] hover:bg-blue-600 text-white border-3 border-black rounded-2xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] cursor-pointer active:translate-y-0.5 shrink-0 flex items-center gap-2"
          >
            <span>TRY THE COMPARISON →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
