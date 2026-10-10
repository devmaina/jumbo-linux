/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Menu, X, ChevronDown, RotateCcw, User, BookOpen, Key, Volume2, VolumeX, Flame, Trophy } from 'lucide-react';
import { TuxSvg } from './Mascot';
import { UserProgress, StudentProfile } from '../types';
import { isSoundEnabled, toggleSound } from '../utils/sound';

export type MainViewTab = 'learning' | 'keyboard' | 'terminal' | 'rescue' | 'duels' | 'badges' | 'gui_compare' | 'leaderboard';

interface HeaderProps {
  currentTab: MainViewTab;
  setCurrentTab: (tab: MainViewTab) => void;
  progress: UserProgress;
  onResetProgress?: () => void;
  currentStudent?: StudentProfile | null;
  onOpenAuthModal: () => void;
  onToggleSidebar?: () => void;
  activeLevelNumber?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  progress,
  currentStudent,
  onOpenAuthModal,
  onToggleSidebar,
  activeLevelNumber = 0
}) => {
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const handleNavClick = (tab: MainViewTab) => {
    setCurrentTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200/70 shadow-xs w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-1.5 sm:px-4 md:px-6 h-11 sm:h-14 flex items-center justify-between gap-1 sm:gap-2">
        {/* Left: Brand Logo & Mobile Missions Toggle */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {onToggleSidebar && currentTab === 'learning' && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1 sm:p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg sm:rounded-xl text-slate-900 shadow-xs active:translate-y-0.5 cursor-pointer flex items-center gap-1 shrink-0"
              title="Open Missions Menu"
            >
              <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4285F4]" />
            </button>
          )}

          <div 
            onClick={() => handleNavClick('learning')}
            className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#4285F4] rounded-lg sm:rounded-xl border border-blue-600 flex items-center justify-center text-white font-black text-xs sm:text-base shadow-xs group-hover:scale-105 transition-all shrink-0">
              J
            </div>

            <div className="hidden lg:flex items-center -space-x-2">
              <TuxSvg size={22} mood="happy" />
            </div>

            <div className="hidden sm:flex flex-col justify-center">
              <h1 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 font-['Fredoka',sans-serif] uppercase leading-none truncate">
                JUMBO-LINUX <span className="text-[#EA4335]">KIDS</span>
              </h1>
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider hidden md:block">
                Shell Quest
              </span>
            </div>
          </div>
        </div>

        {/* Center: Simplified Nav Tabs (LEARN & ARCADE) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={() => handleNavClick('learning')}
            title={`Learn - Shell Quests Level ${activeLevelNumber}`}
            className={`px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-0.5 sm:gap-1 shrink-0 ${
              currentTab === 'learning' || currentTab === 'terminal'
                ? 'bg-[#4285F4] text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-[11px] sm:text-sm leading-none">💻</span>
            <span className="font-extrabold tracking-wide">Learn</span>
          </button>

          <button
            onClick={() => handleNavClick('rescue')}
            title="Arcade: 7 Games & Milestones"
            className={`px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-0.5 sm:gap-1 shrink-0 ${
              currentTab === 'rescue' || currentTab === 'duels' || currentTab === 'badges'
                ? 'bg-[#EA4335] text-white border-red-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-[11px] sm:text-sm leading-none">🎮</span>
            <span className="font-extrabold tracking-wide">Arcade</span>
          </button>
        </div>

        {/* Right: Student Profile & Settings, Sound & XP */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Sound Toggle (Desktop/Tablet) */}
          <button
            onClick={() => setSoundOn(toggleSound())}
            title={soundOn ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
            className={`p-1 sm:px-2 sm:py-1.5 border rounded-lg sm:rounded-xl hidden md:flex items-center gap-1 text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
              soundOn 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* XP Pill */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-[#FBBC05] px-1.5 sm:px-2 py-0.5 sm:py-1 border border-amber-500/50 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs text-black shadow-xs shrink-0">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black shrink-0 fill-black" />
            <span>{progress.xp}</span>
            <span className="hidden sm:inline">XP</span>
          </div>

          {/* Trophy Leaderboard combined with Streak Pill */}
          <button
            onClick={() => handleNavClick('leaderboard')}
            title={`Real-Time Cloud Leaderboard - Top 10 Explorers | Streak: ${progress.streakDays || 1}d`}
            className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 border rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs transition-all shadow-xs cursor-pointer shrink-0 ${
              currentTab === 'leaderboard'
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-1 ring-amber-400'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
            }`}
          >
            <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 fill-amber-500 shrink-0" />
            <span className="hidden xs:inline">Top 10</span>
            <span className="flex items-center gap-0.5 text-orange-600 font-extrabold text-[9px] sm:text-[10px] bg-orange-100/90 px-1 py-0.2 rounded-md">
              <Flame className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-orange-500 text-orange-500 shrink-0" />
              <span>{progress.streakDays || 1}d</span>
            </span>
          </button>

          {/* User Account Profile Pic Icon Button */}
          <button
            onClick={onOpenAuthModal}
            title={currentStudent ? `${currentStudent.name} • Profile & Settings` : "Profile & Login"}
            className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-200 to-amber-100 border-2 border-amber-400 hover:border-amber-500 shadow-xs hover:shadow active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Profile and Settings"
          >
            {currentStudent?.avatar ? (
              <span className="text-xs sm:text-sm select-none leading-none">{currentStudent.avatar}</span>
            ) : (
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800" />
            )}
            {/* Green active status indicator if logged in */}
            {currentStudent && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border border-white rounded-full" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
