/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, DifficultyLevel } from '../types';
import { saveStudentToFirestore, findStudentByLogin, loadStudents } from '../lib/firebase';
import { Lock, LogOut, X, AlertCircle, Sparkles, Settings, Key, UserPlus, Check, Flame, Trophy, Award, Calendar } from 'lucide-react';
import { Mascot } from './Mascot';
import { getStreakDetails, recordActiveDayStreak, getLocalDateString } from '../utils/streak';

const FRIENDS = [
  { emoji: '🐘', label: 'Jumbo' },
  { emoji: '🐧', label: 'Tux' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '🤖', label: 'Robot' },
  { emoji: '🐼', label: 'Panda' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '⭐', label: 'Star' },
  { emoji: '⚡', label: 'Bolt' }
];

interface StudentAuthProps {
  currentStudent: StudentProfile | null;
  onLoginSuccess: (student: StudentProfile) => void;
  onLogout?: () => void;
  isModalMode?: boolean;
  onCloseModal?: () => void;
  onUpdateDifficulty?: (diff: DifficultyLevel) => void;
}

export const StudentAuth: React.FC<StudentAuthProps> = ({
  currentStudent,
  onLoginSuccess,
  onLogout,
  isModalMode = false,
  onCloseModal
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'signup' | 'login'>(() => {
    return currentStudent ? 'settings' : 'login';
  });
  const [recentStudents, setRecentStudents] = useState<StudentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Profile Settings fields (change name, mascot, PIN)
  const [settingsName, setSettingsName] = useState(currentStudent?.name || '');
  const [settingsPin, setSettingsPin] = useState(currentStudent?.pin || '1234');
  const [settingsAvatar, setSettingsAvatar] = useState(currentStudent?.avatar || '🐘');

  // Sign up fields
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐘');

  // Log in fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Sync settings when currentStudent changes
  useEffect(() => {
    if (currentStudent) {
      setSettingsName(currentStudent.name);
      setSettingsPin(currentStudent.pin || '1234');
      setSettingsAvatar(currentStudent.avatar || '🐘');
    }
  }, [currentStudent]);

  useEffect(() => {
    loadStudents().then(list => {
      setRecentStudents(list);
      if (list.length > 0 && !currentStudent) {
        setActiveTab('login');
      }
    }).catch(err => {
      console.warn('Failed to load accounts:', err);
    });
  }, [currentStudent]);

  useEffect(() => {
    if (activeTab === 'signup' && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [activeTab]);

  const cleanEmailUser = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'explorer';
  const jumboEmailPreview = `${cleanEmailUser}@jumbolinux.kids`;

  // Save Settings (Change PIN, Name, Mascot)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanName = settingsName.trim();
    if (!cleanName) {
      setErrorMsg('Please enter your name');
      return;
    }

    if (settingsPin.length !== 4) {
      setErrorMsg('PIN must be 4 characters');
      return;
    }

    if (!currentStudent) return;

    setIsLoading(true);

    try {
      const updatedStudent: StudentProfile = {
        ...currentStudent,
        name: cleanName,
        avatar: settingsAvatar,
        pin: settingsPin.trim(),
        lastActiveAt: new Date().toISOString()
      };

      await saveStudentToFirestore(updatedStudent);
      onLoginSuccess(updatedStudent);
      setSuccessMsg('Settings saved!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save settings';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg('Enter your name');
      return;
    }

    if (pin.length !== 4) {
      setErrorMsg('PIN must be 4 characters');
      return;
    }

    setIsLoading(true);

    try {
      const studentId = `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const todayStr = getLocalDateString();
      const initialProgress = recordActiveDayStreak({
        currentLevel: 1,
        unlockedLevels: [1],
        completedLevels: [],
        xp: 0,
        streakDays: 1,
        lastActiveDate: todayStr,
        longestStreak: 1,
        activeDates: [todayStr],
        badges: [],
        commandsRunCount: 0,
        rescueHighScore: 0,
        duelsWon: 0
      });

      const newStudent: StudentProfile = {
        id: studentId,
        name: cleanName,
        authType: 'built_in_email',
        email: jumboEmailPreview,
        pin: pin.trim(),
        school: 'Linux Academy',
        dreamCareer: '🚀 Terminal Explorer',
        grade: 'Elementary',
        avatar: selectedAvatar,
        difficulty: 'beginner',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        progress: initialProgress
      };

      await saveStudentToFirestore(newStudent);
      onLoginSuccess(newStudent);
      if (onCloseModal) onCloseModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not create account';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Log in
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanId = loginIdentifier.trim();
    if (!cleanId) {
      setErrorMsg('Enter your name or email');
      return;
    }

    if (loginPin.length !== 4) {
      setErrorMsg('Enter 4-character PIN');
      return;
    }

    setIsLoading(true);

    try {
      const student = await findStudentByLogin(cleanId, loginPin.trim());
      if (student) {
        const updatedProgress = recordActiveDayStreak(student.progress || {
          currentLevel: 1,
          unlockedLevels: [1],
          completedLevels: [],
          xp: 0,
          streakDays: 1,
          badges: [],
          commandsRunCount: 0,
          rescueHighScore: 0,
          duelsWon: 0
        });
        const withStreak: StudentProfile = {
          ...student,
          lastActiveAt: new Date().toISOString(),
          progress: updatedProgress
        };
        await saveStudentToFirestore(withStreak);
        onLoginSuccess(withStreak);
        if (onCloseModal) onCloseModal();
      } else {
        setErrorMsg('Name, email, or PIN did not match.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const cardContent = (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-5 max-w-sm sm:max-w-md w-full mx-auto font-['Nunito',sans-serif] max-h-[88vh] flex flex-col">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <Mascot type="tux" size="sm" mood="happy" />
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Fredoka',sans-serif] tracking-tight leading-none uppercase">
              {currentStudent ? 'Profile & Settings' : 'Account Login'}
            </h2>
            <p className="text-[11px] text-slate-500 font-bold mt-0.5">
              {currentStudent ? `${currentStudent.avatar} ${currentStudent.name}` : 'Log in or create your profile'}
            </p>
          </div>
        </div>

        {isModalMode && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="p-1.5 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs Switcher: Settings / Log In / Sign Up */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 mt-3">
        {currentStudent && (
          <button
            type="button"
            onClick={() => { setActiveTab('settings'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'settings'
                ? 'bg-[#4285F4] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3 h-3" />
            <span>Settings</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
          className={`flex-1 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'login'
              ? 'bg-[#34A853] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Key className="w-3 h-3" />
          <span>{currentStudent ? 'Switch' : 'Log In'}</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('signup'); setErrorMsg(null); setSuccessMsg(null); }}
          className={`flex-1 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'signup'
              ? 'bg-[#FBBC05] text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-3 h-3" />
          <span>New</span>
        </button>
      </div>

      {/* Feedback Messages */}
      {errorMsg && (
        <div className="mt-2 p-2 bg-rose-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
          <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Scrollable Form Content */}
      <div className="overflow-y-auto pr-1 py-3 flex-1 space-y-3">
        {/* TAB 1: SETTINGS (Change PIN, Name, Mascot) */}
        {activeTab === 'settings' && currentStudent && (
          <form onSubmit={handleSaveSettings} className="space-y-3.5">
            {/* DAILY STREAK DISPLAY CARD */}
            {(() => {
              const streak = getStreakDetails(currentStudent.progress || { streakDays: 1 } as any);
              return (
                <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 rounded-2xl p-3.5 text-white shadow-md space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-xs ring-1 ring-white/30">
                        🔥
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-amber-200 leading-none flex items-center gap-1">
                          <span>Daily Streak</span>
                          <span>•</span>
                          <span className="text-white">{streak.flameLevelName}</span>
                        </div>
                        <div className="text-xl font-black font-['Fredoka',sans-serif] leading-tight mt-0.5">
                          {streak.currentStreak} {streak.currentStreak === 1 ? 'Day' : 'Days'} Active
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${
                        streak.isActiveToday 
                          ? 'bg-emerald-400 text-emerald-950 font-black' 
                          : 'bg-white/25 text-white border border-white/40 animate-pulse'
                      }`}>
                        {streak.isActiveToday ? '✓ Active Today' : '⏳ Today Pending'}
                      </span>
                      <div className="text-[10px] text-amber-100 font-bold mt-1">
                        🏆 Best: {streak.longestStreak}d Record
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Consecutive Days Strip */}
                  <div className="bg-black/25 rounded-xl p-2 backdrop-blur-xs border border-white/15">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-amber-200 mb-1 px-0.5">
                      <span>Last 7 Days</span>
                      <span>{streak.daysThisWeek.filter(d => d.isActive).length} / 7 Active</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {streak.daysThisWeek.map((day) => (
                        <div
                          key={day.dateStr}
                          className={`py-1 rounded-lg flex flex-col items-center justify-center transition-all ${
                            day.isToday
                              ? 'ring-2 ring-white bg-white/30 shadow-xs'
                              : day.isActive
                              ? 'bg-white/15'
                              : 'bg-white/5 opacity-60'
                          }`}
                          title={`${day.dateStr}: ${day.isActive ? 'Active' : 'No activity'}`}
                        >
                          <span className="text-[9px] font-bold text-white/90 leading-none">
                            {day.dayName}
                          </span>
                          <span className="text-xs my-0.5">
                            {day.isActive ? '🔥' : '·'}
                          </span>
                          <span className="text-[8px] text-white/70 font-mono leading-none">
                            {day.dayNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-[11px] font-semibold text-amber-100 leading-snug">
                    {streak.statusMessage}
                  </p>
                </div>
              );
            })()}

            {/* Quick Stats Badges Strip */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div className="text-[9px] font-black uppercase text-slate-400">Total XP</div>
                <div className="text-sm font-black text-emerald-600 font-mono">{currentStudent.progress.xp}</div>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div className="text-[9px] font-black uppercase text-slate-400">Mission</div>
                <div className="text-sm font-black text-blue-600 font-mono">#{currentStudent.progress.currentLevel || 1}</div>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div className="text-[9px] font-black uppercase text-slate-400">Badges</div>
                <div className="text-sm font-black text-amber-600 font-mono">{(currentStudent.progress.badges || []).length}</div>
              </div>
            </div>

            {/* Mascot Selector */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                Change Mascot:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {FRIENDS.map(f => (
                  <button
                    type="button"
                    key={f.emoji}
                    onClick={() => setSettingsAvatar(f.emoji)}
                    className={`py-1.5 text-xl rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      settingsAvatar === f.emoji
                        ? 'bg-amber-100 border-amber-400 scale-105 shadow-xs font-bold ring-2 ring-amber-400/50'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={f.label}
                  >
                    <span>{f.emoji}</span>
                    <span className="text-[9px] font-bold text-slate-500 leading-none mt-0.5">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Change Name */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                Change Name:
              </label>
              <input
                type="text"
                value={settingsName}
                onChange={(e) => setSettingsName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* Change PIN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-black uppercase text-slate-600">
                  Change 4-Digit PIN:
                </label>
                <span className="text-[10px] font-mono text-slate-400">4 characters</span>
              </div>
              <input
                type="text"
                value={settingsPin}
                onChange={(e) => setSettingsPin(e.target.value.slice(0, 4))}
                maxLength={4}
                placeholder="1234"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-widest text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#4285F4] hover:bg-[#3367d6] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-xs cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>

            {/* Log Out Option */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <LogOut className="w-3 h-3" />
                <span>Log Out</span>
              </button>
            )}
          </form>
        )}

        {/* TAB 2: LOG IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            {/* Quick account list */}
            {recentStudents.length > 0 && (
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Saved Accounts:
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto">
                  {recentStudents.slice(0, 6).map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setLoginIdentifier(s.name);
                        setLoginPin(s.pin || '');
                      }}
                      className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <span className="text-base shrink-0">{s.avatar}</span>
                      <span className="text-xs font-black text-slate-900 truncate uppercase">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Name or Email */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                Name or Email:
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. Alex"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* PIN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-black uppercase text-slate-600">
                  4-Digit PIN:
                </label>
                <span className="text-[10px] font-mono text-slate-400">4 characters</span>
              </div>
              <input
                type="password"
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value.slice(0, 4))}
                maxLength={4}
                placeholder="••••"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-widest text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#34A853] hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-xs cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <span>Logging In...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Log In →</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            {/* Pick Mascot */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                Choose Mascot:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {FRIENDS.map(f => (
                  <button
                    type="button"
                    key={f.emoji}
                    onClick={() => setSelectedAvatar(f.emoji)}
                    className={`py-1.5 text-xl rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedAvatar === f.emoji
                        ? 'bg-amber-100 border-amber-400 scale-105 shadow-xs font-bold ring-2 ring-amber-400/50'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={f.label}
                  >
                    <span>{f.emoji}</span>
                    <span className="text-[9px] font-bold text-slate-500 leading-none mt-0.5">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                Your Name:
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* PIN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-black uppercase text-slate-600">
                  Secret 4-Digit PIN:
                </label>
                <span className="text-[10px] font-mono text-slate-400">4 characters</span>
              </div>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                maxLength={4}
                placeholder="1234"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-widest text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#4285F4] hover:bg-[#3367d6] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-xs cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Account 🚀</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  if (isModalMode) {
    return (
      <div 
        onClick={() => onCloseModal?.()}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs cursor-pointer overflow-y-auto"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm sm:max-w-md cursor-default flex items-center justify-center my-auto"
        >
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-3 sm:p-4">
      {cardContent}
    </div>
  );
};
