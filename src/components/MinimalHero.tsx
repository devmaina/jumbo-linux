/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudentProfile, LevelInfo } from '../types';
import { TuxSvg } from './Mascot';
import { Menu } from 'lucide-react';

interface MinimalHeroProps {
  student: StudentProfile;
  activeLevel: LevelInfo;
  onOpenTasksDrawer?: () => void;
}

export const MinimalHero: React.FC<MinimalHeroProps> = ({
  student,
  activeLevel,
  onOpenTasksDrawer
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex items-center justify-between gap-3 font-['Nunito',sans-serif]">
      {/* Left Mascot & Mission Focus */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 p-1 bg-amber-50 rounded-xl border border-amber-200/70 shadow-xs">
          <TuxSvg size={36} mood="happy" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black text-slate-900 font-['Fredoka',sans-serif]">
              Hi, {student.name}!
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-black uppercase">
              Mission {activeLevel.levelNumber}
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-black text-slate-900 truncate leading-tight">
            {activeLevel.title}
          </h2>
          <p className="text-[11px] text-slate-500 font-medium truncate max-w-sm sm:max-w-md">
            {activeLevel.subtitle || activeLevel.mascotTip}
          </p>
        </div>
      </div>

      {/* Mobile Drawer Button (only shown on small screens) */}
      {onOpenTasksDrawer && (
        <button
          type="button"
          onClick={onOpenTasksDrawer}
          className="lg:hidden shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 shadow-xs cursor-pointer active:scale-95"
          title="Open missions drawer"
        >
          <Menu className="w-3.5 h-3.5 text-[#4285F4]" />
          <span>Missions</span>
        </button>
      )}
    </div>
  );
};
