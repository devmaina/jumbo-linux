/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProgress } from '../types';

/**
 * Returns YYYY-MM-DD string according to local time zone.
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes calendar day difference between two YYYY-MM-DD date strings.
 */
export function getDayDifference(dateA: string, dateB: string): number {
  try {
    const [y1, m1, d1] = dateA.split('-').map(Number);
    const [y2, m2, d2] = dateB.split('-').map(Number);
    const utc1 = Date.UTC(y1, m1 - 1, d1);
    const utc2 = Date.UTC(y2, m2 - 1, d2);
    return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * Evaluates and updates the consecutive days active streak.
 */
export function recordActiveDayStreak(progress: UserProgress, now: Date = new Date()): UserProgress {
  const todayStr = getLocalDateString(now);
  const lastActiveStr = progress.lastActiveDate;

  const currentStreak = typeof progress.streakDays === 'number' && progress.streakDays > 0 
    ? progress.streakDays 
    : 1;
  const currentLongest = typeof progress.longestStreak === 'number' && progress.longestStreak > 0 
    ? progress.longestStreak 
    : currentStreak;
  const activeDates = Array.isArray(progress.activeDates) ? [...progress.activeDates] : [];

  // Add today to activeDates if not present
  if (!activeDates.includes(todayStr)) {
    activeDates.push(todayStr);
  }

  // If no previous record, start today as day 1
  if (!lastActiveStr) {
    const newStreak = Math.max(1, currentStreak);
    return {
      ...progress,
      streakDays: newStreak,
      lastActiveDate: todayStr,
      longestStreak: Math.max(newStreak, currentLongest),
      activeDates
    };
  }

  // Already logged active today
  if (lastActiveStr === todayStr) {
    return {
      ...progress,
      streakDays: currentStreak,
      lastActiveDate: todayStr,
      longestStreak: Math.max(currentStreak, currentLongest),
      activeDates
    };
  }

  const daysPassed = getDayDifference(lastActiveStr, todayStr);

  let newStreak = currentStreak;
  if (daysPassed === 1) {
    // Exactly consecutive day (yesterday -> today)
    newStreak = currentStreak + 1;
  } else if (daysPassed > 1) {
    // Missed one or more days -> streak resets to 1
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, currentLongest);

  // Check milestone badge for streak
  let badges = Array.isArray(progress.badges) ? [...progress.badges] : [];
  if (newStreak >= 3 && !badges.includes('streak_legend')) {
    badges.push('streak_legend');
  }

  return {
    ...progress,
    streakDays: newStreak,
    lastActiveDate: todayStr,
    longestStreak: newLongest,
    activeDates,
    badges
  };
}

export interface DayActivity {
  dayName: string; // e.g. "Mon"
  dayNumber: number; // e.g. 8
  dateStr: string; // "2026-10-08"
  isActive: boolean;
  isToday: boolean;
}

export interface StreakDetails {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
  statusMessage: string;
  flameEmoji: string;
  flameLevelName: string;
  daysThisWeek: DayActivity[];
}

/**
 * Generates formatted streak display details including a 7-day activity strip.
 */
export function getStreakDetails(progress: UserProgress, now: Date = new Date()): StreakDetails {
  const todayStr = getLocalDateString(now);
  const isActiveToday = progress.lastActiveDate === todayStr;
  const currentStreak = progress.streakDays || 1;
  const longestStreak = Math.max(currentStreak, progress.longestStreak || currentStreak);

  let flameEmoji = '🔥';
  let flameLevelName = 'Warm Spark';
  if (currentStreak >= 7) {
    flameEmoji = '⚡🔥';
    flameLevelName = 'Inferno Legend!';
  } else if (currentStreak >= 5) {
    flameEmoji = '🔥🔥';
    flameLevelName = 'Blazing Coder!';
  } else if (currentStreak >= 3) {
    flameEmoji = '🔥';
    flameLevelName = 'Steady Flame!';
  }

  const statusMessage = isActiveToday
    ? 'Streak logged for today! Keep the flame alive tomorrow.'
    : 'Complete a command or mission today to keep your streak!';

  // Build last 7 days window
  const activeDatesSet = new Set(progress.activeDates || []);
  if (isActiveToday) {
    activeDatesSet.add(todayStr);
  }

  const daysThisWeek: DayActivity[] = [];
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let offset = 6; offset >= 0; offset--) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - offset);
    const dateStr = getLocalDateString(targetDate);
    const dayName = DAY_NAMES[targetDate.getDay()];
    const isToday = offset === 0;

    daysThisWeek.push({
      dayName,
      dayNumber: targetDate.getDate(),
      dateStr,
      isActive: activeDatesSet.has(dateStr),
      isToday
    });
  }

  return {
    currentStreak,
    longestStreak,
    isActiveToday,
    statusMessage,
    flameEmoji,
    flameLevelName,
    daysThisWeek
  };
}
