/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, MainViewTab } from './components/Header';
import { TaskSidebar } from './components/TaskSidebar';
import { ChallengeView } from './components/ChallengeView';
import { TerminalSimulator } from './components/TerminalSimulator';
import { KeyboardRescueGame } from './components/KeyboardRescueGame';
import { CommandMatchGame } from './components/CommandMatchGame';
import { DuelArena } from './components/DuelArena';
import { FolderMazeGame } from './components/FolderMazeGame';
import { PermissionLockpickGame } from './components/PermissionLockpickGame';
import { ProcessZapperGame } from './components/ProcessZapperGame';
import { PipeConductorGame } from './components/PipeConductorGame';
import { RetroCliGame } from './components/RetroCliGame';
import { BadgesModal } from './components/BadgesModal';
import { RealtimeLeaderboard } from './components/RealtimeLeaderboard';
import { KeyboardLesson } from './components/KeyboardLesson';
import { GuiVsTerminalComparison } from './components/GuiVsTerminalComparison';
import { StudentAuth } from './components/StudentAuth';
import { LinuxFunFactsFooter } from './components/LinuxFunFactsFooter';
import { LEVELS, BADGES, INITIAL_LEADERBOARD } from './data/curriculum';
import { UserProgress, LevelInfo, StudentProfile, DifficultyLevel } from './types';
import { createInitialVFS, VFSState } from './utils/vfs';
import { Terminal, ArrowLeft, Download } from 'lucide-react';
import { saveStudentToFirestore } from './lib/firebase';
import { FloatingVideoModal } from './components/FloatingVideoModal';
import { isSoundEnabled, toggleSound } from './utils/sound';
import { downloadBashAgent } from './utils/bashAgent';
import { recordActiveDayStreak, getLocalDateString } from './utils/streak';

const ACTIVE_STUDENT_STORAGE_KEY = 'jumbo_linux_kids_active_student_v3';

const DEFAULT_STUDENT: StudentProfile = {
  id: 'student_default',
  name: 'mainadev',
  authType: 'built_in_email',
  email: 'mainadev@jumbolinux.kids',
  avatar: '🐧',
  pin: '1234',
  school: 'Junior Academy',
  dreamCareer: '🚀 Terminal Hacker',
  grade: 'Elementary',
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
  progress: {
    currentLevel: 1,
    unlockedLevels: [1],
    completedLevels: [],
    xp: 0,
    streakDays: 1,
    lastActiveDate: getLocalDateString(),
    longestStreak: 1,
    activeDates: [getLocalDateString()],
    badges: [],
    commandsRunCount: 0,
    rescueHighScore: 0,
    duelsWon: 0
  },
  difficulty: 'beginner'
};

export type ArcadeGame = 'match' | 'falling' | 'duels' | 'maze' | 'lockpick' | 'zapper' | 'pipe' | 'retro';

const ARCADE_GAMES: { id: ArcadeGame; name: string; icon: string }[] = [
  { id: 'match', name: 'Matcher', icon: '🧩' },
  { id: 'falling', name: 'Falling', icon: '🐧' },
  { id: 'duels', name: 'Duels', icon: '⚔️' },
  { id: 'maze', name: 'Maze', icon: '📁' },
  { id: 'lockpick', name: 'Lockpick', icon: '⚡' },
  { id: 'zapper', name: 'Zapper', icon: '🦝' },
  { id: 'pipe', name: 'Pipes', icon: '🎯' },
  { id: 'retro', name: 'Retro', icon: '🕹️' }
];

export function App() {
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_STUDENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          const formattedName = parsed.name.toLowerCase() === 'mainadev' ? 'mainadev' : parsed.name.slice(0, 7);
          return {
            ...parsed,
            name: formattedName,
            progress: recordActiveDayStreak(parsed.progress || DEFAULT_STUDENT.progress)
          };
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_STUDENT;
  });

  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileTaskDrawerOpen, setIsMobileTaskDrawerOpen] = useState(false);

  // Active navigation tab ('learning' is primary workspace, 'rescue' is arcade)
  const [currentTab, setCurrentTab] = useState<MainViewTab>('learning');

  // Active game in Arcade (7 games)
  const [arcadeGameTab, setArcadeGameTab] = useState<ArcadeGame>('match');

  // Currently active single task number (1 to 12)
  const [activeTaskNumber, setActiveTaskNumber] = useState<number>(() => {
    if (currentStudent?.progress?.currentLevel) {
      return currentStudent.progress.currentLevel;
    }
    return 1;
  });

  // VFS state for simulated bash environment
  const [vfsState, setVfsState] = useState<VFSState>(() =>
    createInitialVFS(currentStudent?.name, currentStudent?.email)
  );

  // Keep VFS updated when student identity changes
  useEffect(() => {
    setVfsState(createInitialVFS(currentStudent?.name, currentStudent?.email));
  }, [currentStudent?.id, currentStudent?.name, currentStudent?.email]);

  // Evaluate consecutive daily streak on mount or student change
  useEffect(() => {
    if (currentStudent) {
      const updatedProg = recordActiveDayStreak(currentStudent.progress || DEFAULT_STUDENT.progress);
      if (
        updatedProg.streakDays !== currentStudent.progress?.streakDays ||
        updatedProg.lastActiveDate !== currentStudent.progress?.lastActiveDate ||
        updatedProg.longestStreak !== currentStudent.progress?.longestStreak
      ) {
        persistStudent({
          ...currentStudent,
          lastActiveAt: new Date().toISOString(),
          progress: updatedProg
        });
      }
    }
  }, [currentStudent?.id]);

  // Listen for open-leaderboard custom event
  useEffect(() => {
    const handleOpenLeaderboard = () => {
      setCurrentTab('leaderboard');
    };
    window.addEventListener('open-leaderboard', handleOpenLeaderboard);
    return () => window.removeEventListener('open-leaderboard', handleOpenLeaderboard);
  }, []);

  const progress: UserProgress = currentStudent.progress || DEFAULT_STUDENT.progress;

  // Active level info
  const activeLevel: LevelInfo =
    LEVELS.find((l) => l.levelNumber === activeTaskNumber) || LEVELS[0];

  // Helper to persist updated student
  const persistStudent = async (updated: StudentProfile) => {
    setCurrentStudent(updated);
    try {
      localStorage.setItem(ACTIVE_STUDENT_STORAGE_KEY, JSON.stringify(updated));
      await saveStudentToFirestore(updated);
    } catch {
      // local backup maintained
    }
  };

  const updateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    const rawProg = updater(progress);
    const nextProg = recordActiveDayStreak(rawProg);
    const updated: StudentProfile = {
      ...currentStudent,
      lastActiveAt: new Date().toISOString(),
      progress: nextProg
    };
    persistStudent(updated);
  };

  const handleLoginSuccess = (student: StudentProfile) => {
    const withStreak: StudentProfile = {
      ...student,
      lastActiveAt: new Date().toISOString(),
      progress: recordActiveDayStreak(student.progress || DEFAULT_STUDENT.progress)
    };
    persistStudent(withStreak);
    if (withStreak.progress?.currentLevel) {
      setActiveTaskNumber(withStreak.progress.currentLevel);
    }
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACTIVE_STUDENT_STORAGE_KEY);
    setCurrentStudent(DEFAULT_STUDENT);
    setActiveTaskNumber(1);
    setIsAuthModalOpen(false);
  };

  const handleUpdateDifficulty = (diff: DifficultyLevel) => {
    const updated: StudentProfile = {
      ...currentStudent,
      difficulty: diff
    };
    persistStudent(updated);
  };

  const handleCompleteLevel = (levelNumber: number, xpGained: number) => {
    updateProgress((prev) => {
      const isAlreadyDone = prev.completedLevels.includes(levelNumber);
      const newCompleted = isAlreadyDone
        ? prev.completedLevels
        : [...prev.completedLevels, levelNumber];

      const nextLevelNum = levelNumber + 1;
      const newUnlocked =
        nextLevelNum <= LEVELS.length && !prev.unlockedLevels.includes(nextLevelNum)
          ? [...prev.unlockedLevels, nextLevelNum]
          : prev.unlockedLevels;

      const matchingBadge = BADGES.find(b => b.levelRequired === levelNumber);
      const newBadges = matchingBadge && !prev.badges.includes(matchingBadge.id)
        ? [...prev.badges, matchingBadge.id]
        : prev.badges;

      return {
        ...prev,
        completedLevels: newCompleted,
        unlockedLevels: newUnlocked,
        currentLevel: Math.min(LEVELS.length, Math.max(prev.currentLevel, nextLevelNum)),
        xp: prev.xp + (isAlreadyDone ? Math.floor(xpGained / 2) : xpGained),
        badges: newBadges
      };
    });
  };

  const handleGoToNextTask = () => {
    if (activeTaskNumber < LEVELS.length) {
      setActiveTaskNumber(activeTaskNumber + 1);
    }
  };

  const handleResetProgress = () => {
    const todayStr = getLocalDateString();
    const currentStreakDays = progress.streakDays || 1;
    const currentLongest = progress.longestStreak || currentStreakDays;
    const activeDates = progress.activeDates || [todayStr];

    const resetStudent: StudentProfile = {
      ...currentStudent,
      progress: {
        currentLevel: 1,
        unlockedLevels: [1],
        completedLevels: [],
        xp: 0,
        streakDays: currentStreakDays,
        lastActiveDate: todayStr,
        longestStreak: currentLongest,
        activeDates,
        badges: [],
        commandsRunCount: 0,
        rescueHighScore: 0,
        duelsWon: 0
      }
    };
    setActiveTaskNumber(1);
    persistStudent(resetStudent);
  };

  // Prevent mobile window viewport jump or shift on keyboard / enter
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 sm:relative sm:inset-auto h-full sm:h-auto sm:min-h-screen overflow-hidden sm:overflow-auto bg-slate-50 flex flex-col font-['Nunito',sans-serif] text-slate-800 antialiased selection:bg-[#4285F4] selection:text-white overscroll-none">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        progress={progress}
        currentStudent={currentStudent}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onToggleSidebar={() => setIsMobileTaskDrawerOpen(prev => !prev)}
        activeLevelNumber={activeTaskNumber}
      />

      {/* Auth / Profile & Settings Modal */}
      {isAuthModalOpen && (
        <StudentAuth
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          isModalMode={true}
          onCloseModal={() => setIsAuthModalOpen(false)}
          onUpdateDifficulty={handleUpdateDifficulty}
        />
      )}

      {/* Main Container */}
      <main className={`flex-1 max-w-7xl mx-auto px-0 sm:px-6 py-0 sm:py-4 w-full flex flex-col min-h-0 ${currentTab === 'learning' ? 'overflow-hidden' : 'overflow-y-auto sm:overflow-visible'}`}>
        {/* LEARN VIEW: Terminal-First Shell Workspace */}
        {currentTab === 'learning' && (
          <div className="w-full flex-1 flex flex-col min-h-0">
            {/* Optional Missions Slide-over Drawer (Only when explicitly opened from Learn Menu) */}
            {isMobileTaskDrawerOpen && (
              <div 
                onClick={() => setIsMobileTaskDrawerOpen(false)}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-start cursor-pointer animate-in fade-in duration-200"
              >
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="w-80 max-w-[85vw] h-full bg-white shadow-2xl overflow-y-auto cursor-default animate-in slide-in-from-left duration-200"
                >
                  <TaskSidebar
                    levels={LEVELS}
                    currentLevelNumber={activeTaskNumber}
                    unlockedLevels={progress.unlockedLevels}
                    completedLevels={progress.completedLevels}
                    onSelectTask={(num) => {
                      setActiveTaskNumber(num);
                      setIsMobileTaskDrawerOpen(false);
                    }}
                    onCloseMobile={() => setIsMobileTaskDrawerOpen(false)}
                    isMobileDrawer={true}
                    currentStudent={currentStudent}
                    onOpenAuthModal={() => {
                      setIsMobileTaskDrawerOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    onResetProgress={handleResetProgress}
                    soundOn={soundOn}
                    onToggleSound={() => setSoundOn(toggleSound())}
                  />
                </div>
              </div>
            )}

            {/* Direct Terminal-First Experience: Drop List & Reveal Top Bar + Live Shell */}
            <ChallengeView
              level={activeLevel}
              levels={LEVELS}
              progress={progress}
              vfsState={vfsState}
              setVfsState={setVfsState}
              student={currentStudent}
              difficulty={currentStudent.difficulty || 'beginner'}
              onChangeDifficulty={handleUpdateDifficulty}
              onSelectLevel={(num) => setActiveTaskNumber(num)}
              onBackToMap={() => setIsMobileTaskDrawerOpen(true)}
              onCompleteLevel={handleCompleteLevel}
              onGoToNextLevel={handleGoToNextTask}
              onResetMissionFiles={() => {
                setVfsState(createInitialVFS(currentStudent?.name, currentStudent?.email));
              }}
              onOpenVideos={() => window.dispatchEvent(new CustomEvent('open-jumbo-videos'))}
              onNavigateTab={(tab) => setCurrentTab(tab as MainViewTab)}
            />
          </div>
        )}

        {/* ARCADE VIEW: 7 Standalone Games */}
        {currentTab === 'rescue' && (
          <div className="max-w-4xl mx-auto space-y-2 sm:space-y-4 px-2 sm:px-0 py-2 sm:py-0 w-full">
            {/* Top Navigation & Game Selector */}
            <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-row items-center justify-between gap-2 overflow-hidden">
              <button
                onClick={() => setCurrentTab('learning')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold uppercase text-slate-700 cursor-pointer shadow-xs shrink-0"
              >
                <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Shell</span>
              </button>

              {/* 7 Game Selector Bar (Scrollable from left to right with icon and short name) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1 justify-start">
                {ARCADE_GAMES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setArcadeGameTab(g.id)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      arcadeGameTab === g.id
                        ? 'bg-slate-900 text-white shadow-xs scale-102 ring-2 ring-slate-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-sm leading-none">{g.icon}</span>
                    <span className="truncate whitespace-nowrap">{g.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Game Display */}
            {arcadeGameTab === 'match' && (
              <CommandMatchGame
                onEarnXp={(earned) => updateProgress(p => ({ ...p, xp: p.xp + earned }))}
                onBackToMissions={() => setCurrentTab('learning')}
              />
            )}

            {arcadeGameTab === 'falling' && (
              <KeyboardRescueGame
                onGameCompleted={(score) => {
                  updateProgress(p => ({
                    ...p,
                    xp: p.xp + 80,
                    rescueHighScore: Math.max(p.rescueHighScore, score)
                  }));
                }}
                onGoBackToHub={() => setCurrentTab('learning')}
              />
            )}

            {arcadeGameTab === 'duels' && (
              <DuelArena
                onDuelWon={() => {
                  updateProgress(p => ({
                    ...p,
                    xp: p.xp + 150,
                    duelsWon: p.duelsWon + 1
                  }));
                }}
                onGoBackToHub={() => setCurrentTab('learning')}
              />
            )}

            {arcadeGameTab === 'maze' && (
              <FolderMazeGame
                onEarnXp={(earned) => updateProgress(p => ({ ...p, xp: p.xp + earned }))}
                onBackToMissions={() => setCurrentTab('learning')}
              />
            )}

            {arcadeGameTab === 'lockpick' && (
              <PermissionLockpickGame
                onEarnXp={(earned) => updateProgress(p => ({ ...p, xp: p.xp + earned }))}
              />
            )}

            {arcadeGameTab === 'zapper' && (
              <ProcessZapperGame
                onEarnXp={(earned) => updateProgress(p => ({ ...p, xp: p.xp + earned }))}
              />
            )}

            {arcadeGameTab === 'pipe' && (
              <PipeConductorGame
                onEarnXp={(earned) => updateProgress(p => ({ ...p, xp: p.xp + earned }))}
              />
            )}

            {arcadeGameTab === 'retro' && (
              <RetroCliGame
                onEarnXp={(earned) => updateProgress(p => ({ ...p, xp: p.xp + earned }))}
                onBackToMissions={() => setCurrentTab('learning')}
              />
            )}
          </div>
        )}

        {/* FREE COMMAND SANDBOX */}
        {currentTab === 'terminal' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#34A853]" />
                <h3 className="text-base font-black uppercase text-slate-900 font-['Fredoka',sans-serif]">
                  Free Command Sandbox
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('learning')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-700 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Shell</span>
              </button>
            </div>

            <TerminalSimulator
              vfsState={vfsState}
              setVfsState={setVfsState}
              studentEmail={currentStudent.email}
              studentName={currentStudent.name}
              bannerTitle={`Playground - ${currentStudent.email}:~`}
              suggestedPills={['pwd', 'ls -la', 'cat animals.txt', 'ps aux', 'uname -a', 'whoami', 'help']}
            />
          </div>
        )}

        {/* KEYBOARD LESSON */}
        {currentTab === 'keyboard' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">⌨️</span>
                <h3 className="text-base font-black uppercase text-slate-900 font-['Fredoka',sans-serif]">
                  Keyboard Practice
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('learning')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-700 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Shell</span>
              </button>
            </div>
            <KeyboardLesson
              onCompleteLesson={(xp) => {
                updateProgress(p => ({
                  ...p,
                  xp: p.xp + xp,
                  badges: p.badges.includes('keyboard_hero') ? p.badges : [...p.badges, 'keyboard_hero']
                }));
              }}
              onGoToMissions={() => setCurrentTab('learning')}
            />
          </div>
        )}

        {/* BADGES & ACHIEVEMENTS */}
        {currentTab === 'badges' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <button
              onClick={() => setCurrentTab('learning')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-700 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shell</span>
            </button>
            <BadgesModal
              badges={BADGES}
              leaderboard={INITIAL_LEADERBOARD}
              progress={progress}
              currentStudent={currentStudent}
              onBackToHub={() => setCurrentTab('learning')}
            />
          </div>
        )}

        {/* REAL-TIME CLOUD LEADERBOARD */}
        {currentTab === 'leaderboard' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <RealtimeLeaderboard
              currentStudent={currentStudent}
              onBackToLearning={() => setCurrentTab('learning')}
            />
          </div>
        )}

        {/* GUI VS TERMINAL */}
        {currentTab === 'gui_compare' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <button
              onClick={() => setCurrentTab('learning')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-700 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shell</span>
            </button>
            <GuiVsTerminalComparison
              onEarnXp={(xp) => updateProgress(p => ({ ...p, xp: p.xp + xp }))}
              onGoBackToHub={() => setCurrentTab('learning')}
            />
          </div>
        )}
      </main>

      {/* Linux CLI (.sh) Download Package Banner on Footer (Hidden on mobile) */}
      <div className="hidden sm:flex bg-slate-900 border-t border-slate-800 text-slate-200 px-4 sm:px-8 py-2.5 flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="p-1.5 bg-indigo-950 border border-indigo-700/60 rounded-lg text-indigo-400">
            <Download className="w-3.5 h-3.5 text-indigo-300" />
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
            <span className="font-black text-white text-xs sm:text-sm">Download Linux CLI (.sh)</span>
            <span className="text-[11px] text-slate-400 font-medium">Draft package for Ubuntu / Pi</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => downloadBashAgent(currentStudent?.name, currentStudent?.id)}
          className="w-full sm:w-auto px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95 shrink-0"
          title="Download the draft Bash script agent to practice locally in Ubuntu, Debian, or Raspberry Pi!"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download .sh</span>
        </button>
      </div>

      {/* Clean Status Footer (Hidden on mobile) */}
      <footer className="hidden sm:flex bg-slate-950 text-white flex-col sm:flex-row items-center px-4 sm:px-8 py-2.5 justify-between shrink-0 font-mono text-xs uppercase tracking-wider gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#34A853] rounded-full animate-pulse" />
          <span className="font-bold">
            STUDENT: {currentStudent.avatar} {currentStudent.name}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">MISSION {activeTaskNumber}/12</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#FBBC05] font-black">{progress.xp} XP</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">JUMBO-LINUX KIDS</span>
        </div>
      </footer>

      {/* Tux Speech Bubble Footer (Hidden on mobile) */}
      <div className="hidden sm:block">
        <LinuxFunFactsFooter
          onEarnBonusXp={(amt) => {
            updateProgress(p => ({ ...p, xp: p.xp + amt }));
          }}
          difficulty={currentStudent.difficulty || 'beginner'}
          onChangeDifficulty={handleUpdateDifficulty}
        />
      </div>

      {/* Floating Video Helper (Only floating on desktop/tablet, hidden on mobile) */}
      <FloatingVideoModal />
    </div>
  );
}

export default App;
