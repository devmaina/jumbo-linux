/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Lock, X, ChevronRight, Volume2, VolumeX, RotateCcw, Flame } from 'lucide-react';
import { LevelInfo, StudentProfile } from '../types';

interface TaskSidebarProps {
  levels: LevelInfo[];
  currentLevelNumber: number;
  unlockedLevels: number[];
  completedLevels: number[];
  onSelectTask: (levelNumber: number) => void;
  onCloseMobile?: () => void;
  isMobileDrawer?: boolean;
  currentStudent?: StudentProfile | null;
  onOpenAuthModal?: () => void;
  onResetProgress?: () => void;
  onClearLevels?: () => void;
  soundOn?: boolean;
  onToggleSound?: () => void;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = ({
  levels,
  currentLevelNumber,
  unlockedLevels,
  completedLevels,
  onSelectTask,
  onCloseMobile,
  isMobileDrawer = false,
  currentStudent,
  onOpenAuthModal,
  onResetProgress,
  onClearLevels,
  soundOn,
  onToggleSound
}) => {
  return (
    <aside 
      className={`bg-white flex flex-col font-['Nunito',sans-serif] ${
        isMobileDrawer 
          ? 'h-full w-full' 
          : 'w-72 lg:w-80 rounded-2xl border border-slate-200/90 shadow-xs p-4 h-[calc(100vh-5.5rem)] sticky top-20 overflow-y-auto'
      }`}
    >
      {/* Header */}
      <div className={`border-b border-slate-100 flex items-center justify-between pb-3 ${isMobileDrawer ? 'p-4' : 'mb-3'}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🗺️</span>
          <div>
            <span className="font-black text-sm uppercase tracking-tight text-slate-900 font-['Fredoka',sans-serif] block leading-none">
              Missions
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              {completedLevels.length} of {levels.length} Completed
            </span>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 cursor-pointer"
            title="Close menu"
          >
            <X className="w-4 h-4 text-slate-700" />
          </button>
        )}
      </div>

      {/* Missions & Actions Drop Select on Left */}
      <div className={`mb-2.5 ${isMobileDrawer ? 'px-4' : ''}`}>
        <label htmlFor="sidebar-mission-select" className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
          Mission Dropdown & Actions:
        </label>
        <select
          id="sidebar-mission-select"
          value={currentLevelNumber}
          onChange={(e) => {
            if (e.target.value === 'clear_all_levels') {
              if (window.confirm('Delete level progress and restart fresh from Level 1?')) {
                onClearLevels?.();
                if (onCloseMobile) onCloseMobile();
              }
              return;
            }
            onSelectTask(Number(e.target.value));
            if (onCloseMobile) onCloseMobile();
          }}
          aria-label="Mission & Actions Dropdown"
          className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 cursor-pointer outline-none shadow-2xs"
        >
          <optgroup label="Select Mission">
            {levels.map(lvl => (
              <option key={lvl.levelNumber} value={lvl.levelNumber}>
                {completedLevels.includes(lvl.levelNumber) ? '✅' : currentLevelNumber === lvl.levelNumber ? '👉' : '🔘'} L{lvl.levelNumber}: {lvl.title}
              </option>
            ))}
          </optgroup>
          {onClearLevels && (
            <optgroup label="Danger Zone">
              <option value="clear_all_levels" className="text-rose-600 font-bold bg-rose-50">
                🔄 Clear All Levels (Restart L1)
              </option>
            </optgroup>
          )}
        </select>
      </div>

      {/* Step-by-Step Linux Missions List */}
      <div className={`space-y-1.5 flex-1 overflow-y-auto ${isMobileDrawer ? 'px-4' : ''}`}>
        {levels.map((lvl) => {
          const isCompleted = completedLevels.includes(lvl.levelNumber);
          const isUnlocked = lvl.levelNumber === 1 || isCompleted || unlockedLevels.includes(lvl.levelNumber);
          const isCurrentActive = currentLevelNumber === lvl.levelNumber;

          return (
            <button
              key={lvl.levelNumber}
              type="button"
              disabled={!isUnlocked}
              onClick={() => {
                onSelectTask(lvl.levelNumber);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all select-none ${
                isCurrentActive
                  ? 'bg-[#4285F4] text-white border-blue-600 shadow-xs ring-2 ring-blue-300'
                  : isCompleted
                  ? 'bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-200 text-slate-900 cursor-pointer'
                  : isUnlocked
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 cursor-pointer'
                  : 'bg-slate-100/50 border-slate-200/50 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : isCurrentActive ? (
                    <div className="w-5 h-5 rounded-full bg-white text-[#4285F4] flex items-center justify-center font-black text-xs shadow-xs">
                      {lvl.levelNumber}
                    </div>
                  ) : isUnlocked ? (
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center font-bold text-[11px]">
                      {lvl.levelNumber}
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="truncate">
                  <div className={`text-xs font-bold truncate leading-tight ${
                    isCurrentActive ? 'text-white' : isCompleted ? 'text-slate-900' : isUnlocked ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {lvl.levelNumber}. {lvl.title}
                  </div>
                  <div className={`text-[10px] truncate leading-tight ${
                    isCurrentActive ? 'text-blue-100' : isCompleted ? 'text-emerald-700 font-medium' : 'text-slate-400'
                  }`}>
                    {isCompleted ? 'Done ✓' : isCurrentActive ? 'Active Mission' : isUnlocked ? 'Ready' : 'Locked'}
                  </div>
                </div>
              </div>

              {isCurrentActive && (
                <ChevronRight className="w-4 h-4 shrink-0 text-white animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Profile & Settings */}
      <div className={`mt-3 pt-3 border-t border-slate-200/80 space-y-2 shrink-0 ${isMobileDrawer ? 'px-4 pb-6' : ''}`}>
        {/* Sound Toggle */}
        {onToggleSound && (
          <button
            type="button"
            onClick={onToggleSound}
            className="w-full p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>Sound Effects</span>
            </div>
            <span className={`text-[10px] uppercase px-2 py-0.5 rounded-md font-bold ${soundOn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
              {soundOn ? 'On' : 'Muted'}
            </span>
          </button>
        )}

        {/* Player Profile & Settings */}
        {currentStudent && (
          <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl shrink-0">{currentStudent.avatar || '🐘'}</span>
                <div className="truncate">
                  <div className="text-[10px] font-bold uppercase text-amber-700 leading-none">Player</div>
                  <div className="text-xs font-black uppercase text-slate-900 truncate leading-tight">{currentStudent.name}</div>
                </div>
              </div>
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    onOpenAuthModal();
                  }}
                  className="text-xs font-bold text-[#4285F4] hover:underline cursor-pointer shrink-0 ml-1"
                >
                  Settings
                </button>
              )}
            </div>

            {/* Streak & XP Pills */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-amber-200/60 text-[11px] font-bold">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-100 text-orange-800 border border-orange-300">
                <Flame className="w-3 h-3 text-orange-600 fill-orange-500" />
                <span>{currentStudent.progress.streakDays || 1}d Streak</span>
              </div>
              <div className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                <span>{currentStudent.progress.xp} XP</span>
              </div>
            </div>
          </div>
        )}

        {/* Clear Levels */}
        {onClearLevels && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Delete level progress and restart fresh from Level 1?')) {
                onClearLevels();
                if (onCloseMobile) onCloseMobile();
              }
            }}
            className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs active:scale-95 mb-1.5"
            title="Clear level progress to restart from Level 1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear Levels</span>
          </button>
        )}

        {/* Reset Progress */}
        {onResetProgress && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset mission progress?')) {
                onResetProgress();
                if (onCloseMobile) onCloseMobile();
              }
            }}
            className="w-full py-1 text-center text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        )}
      </div>
    </aside>
  );
};
