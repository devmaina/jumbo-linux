import React from 'react';
import { Award, Trophy, Lock, CheckCircle2, Sparkles, Star, Flame } from 'lucide-react';
import { Badge, LeaderboardEntry, UserProgress, StudentProfile } from '../types';
import { RealtimeLeaderboard } from './RealtimeLeaderboard';

interface BadgesModalProps {
  badges: Badge[];
  leaderboard?: LeaderboardEntry[];
  progress: UserProgress;
  onBackToHub?: () => void;
  currentStudent?: StudentProfile | null;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  badges,
  leaderboard,
  progress,
  onBackToHub,
  currentStudent
}) => {
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'arcade' | 'curriculum'>('all');

  const filteredBadges = badges.filter(b => {
    if (selectedFilter === 'arcade') return b.category === 'arcade' || b.category === 'milestone';
    if (selectedFilter === 'curriculum') return !b.category || b.category === 'curriculum';
    return true;
  });

  const checkBadgeUnlocked = (b: Badge) => {
    if (progress.badges.includes(b.id)) return true;
    if (b.levelRequired && progress.completedLevels.includes(b.levelRequired)) return true;
    if (b.id === 'xp_century' && progress.xp >= 500) return true;
    if (b.id === 'duel_victor' && progress.duelsWon > 0) return true;
    if (b.id === 'falling_keys_ace' && progress.rescueHighScore >= 100) return true;
    if (b.id === 'streak_legend' && ((progress.streakDays || 0) >= 3 || (progress.longestStreak || 0) >= 3)) return true;
    return false;
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-['Nunito',sans-serif]">
      {onBackToHub && (
        <div>
          <button
            onClick={onBackToHub}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            ← Back to Learning
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#7E22CE] rounded-2xl p-6 sm:p-8 text-white border border-purple-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBC05] text-black text-xs font-bold uppercase tracking-wider shadow-xs">
            <Award className="w-3.5 h-3.5" />
            HALL OF LINUX CHAMPIONS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] uppercase tracking-tight">
            BADGES & LEADERBOARD
          </h2>
          <p className="text-white/90 text-xs sm:text-sm font-medium max-w-md">
            Celebrate every milestone from your first "whoami" command to conquering the Root CTF flag!
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 bg-purple-950/70 text-white p-3.5 sm:p-4 rounded-xl border border-purple-700/60 shadow-xs shrink-0">
          <div className="text-center">
            <div className="text-[11px] text-[#FBBC05] font-bold uppercase tracking-wider">Badges Earned</div>
            <div className="text-2xl font-black text-white font-mono">
              {progress.badges.length} / {badges.length}
            </div>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <div className="text-[11px] text-[#34A853] font-bold uppercase tracking-wider">Total XP</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{progress.xp}</div>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <div className="text-[11px] text-orange-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400" /> Streak
            </div>
            <div className="text-2xl font-black text-orange-400 font-mono">{progress.streakDays || 1}d</div>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase tracking-tight">
              Milestone Badges ({badges.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Arcade accomplishments, typing milestones & terminal quests!
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({badges.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('arcade')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'arcade'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Arcade & Milestones
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('curriculum')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'curriculum'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curriculum (1-12)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredBadges.map(badge => {
            const isUnlocked = checkBadgeUnlocked(badge);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${
                      isUnlocked ? badge.color : 'bg-slate-300'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>

                    <div>
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Unlocked
                        </span>
                      ) : badge.levelRequired ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 uppercase">
                          <Lock className="w-3 h-3" /> Lvl {badge.levelRequired}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 uppercase">
                          Arcade
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug uppercase">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold uppercase text-slate-400">
                  <span>
                    {badge.category === 'arcade' || badge.category === 'milestone' 
                      ? 'ARCADE MILESTONE' 
                      : `LEVEL ${badge.levelRequired} QUEST`}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#FBBC05] fill-[#FBBC05]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Cloud Leaderboard Component */}
      <RealtimeLeaderboard 
        currentStudent={currentStudent}
        compactMode={true}
      />
    </div>
  );
};
