/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Medal, 
  ArrowLeft, 
  RefreshCw, 
  Radio, 
  Star, 
  Award, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { StudentProfile } from '../types';
import { subscribeToLeaderboard, STARTER_STUDENTS } from '../lib/firebase';

interface RealtimeLeaderboardProps {
  currentStudent?: StudentProfile | null;
  onBackToLearning?: () => void;
  compactMode?: boolean;
}

export const RealtimeLeaderboard: React.FC<RealtimeLeaderboardProps> = ({
  currentStudent,
  onBackToLearning,
  compactMode = false
}) => {
  const [leaderboard, setLeaderboard] = useState<StudentProfile[]>(() => STARTER_STUDENTS);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [sortBy, setSortBy] = useState<'xp' | 'streak'>('xp');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Subscribe to real-time Firestore changes
    const unsubscribe = subscribeToLeaderboard(
      (topStudents, isConnected) => {
        // Always ensure other hardcoded leaders are present so other leaders are visibly showcased
        const combined = [...topStudents];
        if (combined.length < 10) {
          STARTER_STUDENTS.forEach(starter => {
            if (!combined.some(s => s.id === starter.id || s.email === starter.email)) {
              combined.push(starter);
            }
          });
        }
        setLeaderboard(combined.slice(0, 10));
        setIsLiveConnected(isConnected);
      },
      10,
      sortBy
    );

    return () => {
      unsubscribe();
    };
  }, [sortBy]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    const unsubscribe = subscribeToLeaderboard(
      (topStudents, isConnected) => {
        const combined = [...topStudents];
        if (combined.length < 10) {
          STARTER_STUDENTS.forEach(starter => {
            if (!combined.some(s => s.id === starter.id || s.email === starter.email)) {
              combined.push(starter);
            }
          });
        }
        setLeaderboard(combined.slice(0, 10));
        setIsLiveConnected(isConnected);
        setIsRefreshing(false);
      },
      10,
      sortBy
    );

    setTimeout(() => {
      setIsRefreshing(false);
      unsubscribe();
    }, 1200);
  };

  // Find if current student is in the top 10
  const currentStudentId = currentStudent?.id;
  const currentStudentRankIndex = leaderboard.findIndex(
    s => s.id === currentStudentId || (currentStudent?.email && s.email === currentStudent.email)
  );
  const isInTop10 = currentStudentRankIndex >= 0;

  // 10th place student's XP to show XP gap
  const tenthStudentXp = leaderboard.length >= 10 
    ? (leaderboard[9].progress?.xp ?? 0) 
    : 0;
  const userXp = currentStudent?.progress?.xp ?? 0;
  const xpNeededForTop10 = Math.max(0, tenthStudentXp - userXp + 50);

  return (
    <div className={`space-y-4 font-['Nunito',sans-serif] ${compactMode ? '' : 'max-w-5xl mx-auto'}`}>
      {!compactMode && onBackToLearning && (
        <div>
          <button
            type="button"
            onClick={onBackToLearning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-700 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Learning</span>
          </button>
        </div>
      )}

      {/* Main Card Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-orange-400/40 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-2 text-6xl opacity-15 select-none pointer-events-none">
          🏆
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 text-amber-200 text-[10px] font-black uppercase tracking-wider mb-2 border border-white/20">
              <Trophy className="w-3 h-3 text-amber-300" />
              <span>Real-Time Cloud Leaderboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] uppercase tracking-tight text-white leading-tight">
              Top 10 Jumbo Linux Explorers
            </h2>
            <p className="text-white/90 text-xs sm:text-sm font-medium max-w-lg mt-0.5">
              Live standings across classrooms & physical terminal installations worldwide!
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Live Status indicator */}
            <div 
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-xs shadow-xs ${
                isLiveConnected 
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-400/50' 
                  : 'bg-black/30 text-amber-200 border-amber-300/40'
              }`}
              title={isLiveConnected ? 'Connected to live Firestore sync' : 'Using cached records; syncing with cloud'}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
              <span className="font-mono text-[11px] uppercase tracking-wider font-extrabold">
                {isLiveConnected ? 'Firestore Live' : 'Syncing'}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all border border-white/25 cursor-pointer active:scale-95 disabled:opacity-50 shadow-xs"
              title="Refresh Leaderboard from Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs: XP vs Streak */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-1">
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl border border-slate-300/60 shadow-xs">
          <button
            type="button"
            onClick={() => setSortBy('xp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              sortBy === 'xp'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Top XP Champions</span>
          </button>
          <button
            type="button"
            onClick={() => setSortBy('streak')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              sortBy === 'streak'
                ? 'bg-white text-orange-600 shadow-xs ring-1 ring-orange-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>Daily Streak Legends</span>
          </button>
        </div>

        <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>Auto-updates in real-time</span>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider bg-slate-50/90">
                <th className="py-3 px-3 sm:px-4 text-center w-14">Rank</th>
                <th className="py-3 px-3 sm:px-4">Student Explorer</th>
                <th className="py-3 px-3 sm:px-4 text-center">Mission</th>
                <th className="py-3 px-3 sm:px-4 text-center">Daily Streak</th>
                <th className="py-3 px-3 sm:px-4 text-center hidden md:table-cell">Badges</th>
                <th className="py-3 px-3 sm:px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {leaderboard.map((student, index) => {
                const rank = index + 1;
                const isCurrentUser = 
                  student.id === currentStudentId || 
                  (currentStudent?.email && student.email === currentStudent.email);
                const streakDays = student.progress?.streakDays ?? (student as any).streakDays ?? 1;
                const xp = student.progress?.xp ?? (student as any).xp ?? 0;
                const level = student.progress?.currentLevel ?? 1;
                const badgeCount = (student.progress?.badges || []).length;

                return (
                  <tr
                    key={student.id || `student_${index}`}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-amber-50/90 hover:bg-amber-100/80 font-bold border-l-4 border-l-amber-500'
                        : rank === 1
                        ? 'bg-yellow-50/40 hover:bg-yellow-50/80'
                        : rank === 2
                        ? 'bg-slate-50/60 hover:bg-slate-100/60'
                        : rank === 3
                        ? 'bg-amber-50/30 hover:bg-amber-100/40'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-950 font-black text-xs shadow-xs">
                          🥇 1
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 font-black text-xs shadow-xs">
                          🥈 2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black text-xs shadow-xs">
                          🥉 3
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-slate-600 text-xs">
                          #{rank}
                        </span>
                      )}
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                          {student.avatar || '🐘'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-black text-slate-900 font-['Fredoka',sans-serif] tracking-tight truncate max-w-[150px] sm:max-w-[200px]">
                              {student.name.toLowerCase() === 'mainadev' ? 'mainadev' : student.name.slice(0, 7)}
                            </span>
                            {isCurrentUser && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                                <Star className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium truncate max-w-[160px] sm:max-w-[240px]">
                            {student.school || student.dreamCareer || student.grade || 'Jumbo Academy'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Mission Level */}
                    <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                        Lvl {level}
                      </span>
                    </td>

                    {/* Daily Streak */}
                    <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-mono text-[11px] font-black">
                        <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                        {streakDays}d
                      </span>
                    </td>

                    {/* Badges count */}
                    <td className="py-3 px-3 sm:px-4 text-center hidden md:table-cell whitespace-nowrap">
                      <span className="text-slate-600 font-bold text-xs">
                        🎖️ {badgeCount}
                      </span>
                    </td>

                    {/* Total XP */}
                    <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                      <span className="font-mono font-black text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {xp.toLocaleString()} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pinned "Your Standing" card if the current student is not in the Top 10 */}
        {currentStudent && !isInTop10 && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 border-t-2 border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                {currentStudent.avatar || '🐘'}
              </div>
              <div>
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <span className="text-xs font-black uppercase text-indigo-950">Your Standing:</span>
                  <span className="font-black text-slate-900">{currentStudent.name.toLowerCase() === 'mainadev' ? 'mainadev' : currentStudent.name.slice(0, 7)}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Currently at <span className="font-bold text-indigo-700 font-mono">{userXp} XP</span> • Streak: <span className="font-bold text-orange-600">{currentStudent.progress.streakDays || 1}d</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold bg-white px-3.5 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-700">
                Earn <strong className="text-emerald-700 font-mono">+{xpNeededForTop10} XP</strong> to break into the Top 10!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Motivational Bottom Tip */}
      <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 text-slate-600 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Scores update live whenever you solve terminal missions, practice typing, or win speed duels!
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider hidden sm:inline">
          Firestore Cloud Sync Active
        </span>
      </div>
    </div>
  );
};

export default RealtimeLeaderboard;
