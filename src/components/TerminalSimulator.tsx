import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, HelpCircle, CornerDownLeft, Sparkles, Copy, Check, Volume2, VolumeX, Target } from 'lucide-react';
import { TerminalOutputItem, LevelInfo } from '../types';
import { VFSState, executeCommand, computeTabCompletion } from '../utils/vfs';
import { isSoundEnabled, toggleSound, playTabCompletionSound } from '../utils/sound';

export interface CommandExecutionDetails {
  clickedTerminal: boolean;
  typedManually: boolean;
  keystrokeCount: number;
}

interface TerminalSimulatorProps {
  vfsState: VFSState;
  setVfsState: React.Dispatch<React.SetStateAction<VFSState>>;
  onCommandExecuted?: (cmd: string, events: string[], details?: CommandExecutionDetails) => void;
  onTerminalClick?: () => void;
  isTerminalClicked?: boolean;
  suggestedPills?: string[];
  bannerTitle?: string;
  className?: string;
  studentEmail?: string;
  studentName?: string;
  studentAvatar?: string;
  studentXp?: number;
  totalLevelsCount?: number;
  activeLevel?: LevelInfo;
  completedObjectives?: string[];
  levels?: LevelInfo[];
  onToggleReveal?: () => void;
}

// Short, kid-friendly placeholders describing what each command does differently across all levels
const CURATED_OBJECTIVE_PLACEHOLDERS: Record<string, string> = {
  // Level 1: Explorer Hello
  obj_1_1: 'Type "whoami" to show your username',
  obj_1_2: 'Type "echo hello" to speak to screen',
  obj_1_3: 'Type "which bash" to find command path',
  // Level 2: Media & Graphics
  obj_2_1: 'Type "feh media/tux.png" to view picture',
  obj_2_2: 'Type "chafa media/tux.png" to render ASCII art',
  obj_2_3: 'Type "mpv media/anthem.mp3" to play audio',
  // Level 3: Fun Shell Creatures & Trees
  obj_3_1: 'Type "tree" to map folders',
  obj_3_2: 'Type "cowsay Linux is awesome" to make cow speak',
  obj_3_3: 'Type "fortune" for a kid-friendly quote',
  // Level 4: Arcade Genesis
  obj_4_1: 'Type "game drop-catch" to launch falling stars game',
  obj_4_2: 'Type "game single-shot" to launch laser target game',
  // Level 5: Defense & Reflex
  obj_5_1: 'Type "game missile-defense" to intercept missiles',
  obj_5_2: 'Type "game letter-bomb" to defuse letter bombs',
  obj_5_3: 'Type "game left-right-bomb" to dodge bomb traps',
  // Level 6: Coreutils I
  obj_6_1: 'Type "pwd" to print your current folder',
  obj_6_2: 'Type "ls -l" to list files with details',
  obj_6_3: 'Type "cat mission.txt" to read file contents',
  // Level 7: Coreutils II
  obj_7_1: 'Type "cp note.txt note_backup.txt" to backup file',
  obj_7_2: 'Type "chmod +x play.sh" to make script runnable',
  obj_7_3: 'Type "ls -l play.sh" to check permissions',
  // Level 8: Text Processing I
  obj_8_1: 'Type "head -n 3 animals.txt" to view top lines',
  obj_8_2: 'Type "wc -l animals.txt" to count total lines',
  obj_8_3: 'Type "grep penguin animals.txt" to search text',
  // Level 9: Text Processing II
  obj_9_1: 'Type "sort animals.txt" to sort lines alphabetically',
  obj_9_2: 'Type "cut -d\' \' -f1 animals.txt" to extract column 1',
  obj_9_3: 'Type "sed \'s/elephant/JUMBO/g\' animals.txt" to replace text',
  // Level 10: Process Management
  obj_10_1: 'Type "ps" to view running processes',
  obj_10_2: 'Type "top" to monitor CPU and system activity',
  obj_10_3: 'Type \'find . -name "*.sh"\' to search script files',
  // Level 11: Network & Archive
  obj_11_1: 'Type "curl https://jumbolinux.kids" to fetch web data',
  obj_11_2: 'Type "tar -czvf backup.tar.gz note.txt" to compress files',
  obj_11_3: 'Type "ssh cadet@lab" to test remote login',
  // Level 12: Capstone
  obj_12_1: 'Type "grep -E \'penguin|elephant\' animals.txt" to regex search',
  obj_12_2: 'Type "python3 -c \'print(\\"Hello Linux!\\")\'" to run Python code',
  obj_12_3: 'Type "gcc -v" to check C compiler'
};

function getDynamicPlaceholder(
  objective?: { id: string; description: string; targetCheck?: string; hint?: string } | null
): string {
  if (!objective) {
    return 'All tasks done! Type "help" or any command...';
  }

  if (CURATED_OBJECTIVE_PLACEHOLDERS[objective.id]) {
    return `${CURATED_OBJECTIVE_PLACEHOLDERS[objective.id]}...`;
  }

  // Fallback: extract command and action from objective description
  const match = objective.description.match(/^(.*?):\s*type\s*["']([^"']+)["']/i);
  if (match) {
    const action = match[1].trim().toLowerCase();
    const cmd = match[2].trim();
    return `Type "${cmd}" to ${action}...`;
  }

  const hintMatch = (objective.hint || '').match(/type\s*["']([^"']+)["']/i);
  if (hintMatch) {
    return `Type "${hintMatch[1]}"...`;
  }

  return 'Type your command and press Enter...';
}

const LINUX_SHORTCUT_KEYS = [
  { id: 'tab', label: 'Tab ⇥', title: 'Auto-complete commands & paths' },
  { id: 'ctrl_c', label: 'Ctrl+C', title: 'Cancel current line/command' },
  { id: 'arrow_up', label: '↑', title: 'Previous command in history' },
  { id: 'arrow_down', label: '↓', title: 'Next command in history' },
  { id: 'pipe', label: '|', title: 'Pipe output to next command' },
  { id: 'slash', label: '/', title: 'Directory path slash' },
  { id: 'tilde', label: '~', title: 'Home directory (~)' },
  { id: 'dash', label: '-', title: 'Option/flag dash' },
  { id: 'dotdot', label: '..', title: 'Parent directory (cd ..)' },
  { id: 'star', label: '*', title: 'Wildcard (*)' },
  { id: 'redirect', label: '>', title: 'Output redirect (>)' },
];

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  vfsState,
  setVfsState,
  onCommandExecuted,
  onTerminalClick,
  isTerminalClicked = false,
  suggestedPills = ['pwd', 'ls', 'whoami', 'help'],
  bannerTitle,
  className = '',
  studentEmail,
  studentName,
  studentAvatar,
  studentXp = 0,
  totalLevelsCount = 12,
  activeLevel,
  completedObjectives = [],
  levels = [],
  onToggleReveal
}) => {
  const displayUserEmail = studentEmail || vfsState.currentEmail || 'student@jumbolinux.kids';
  const effectiveBannerTitle = bannerTitle || `bash - ${displayUserEmail}:~`;
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [hasClickedTerminal, setHasClickedTerminal] = useState(isTerminalClicked);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [hasTypedManually, setHasTypedManually] = useState(false);
  const [hintSpell, setHintSpell] = useState<string | null>(null);
  const currentPendingObjective = activeLevel?.objectives.find(o => !completedObjectives.includes(o.id));
  const dynamicPlaceholder = getDynamicPlaceholder(currentPendingObjective);
  const [outputItems, setOutputItems] = useState<TerminalOutputItem[]>([]);

  // Clear terminal output and input on level change so user starts fresh
  useEffect(() => {
    setOutputItems([]);
    setInputVal('');
  }, [activeLevel?.levelNumber]);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [tabSuggestions, setTabSuggestions] = useState<string[]>([]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTerminalClicked) {
      setHasClickedTerminal(true);
    }
  }, [isTerminalClicked]);

  const triggerTerminalFocus = () => {
    setHasClickedTerminal(true);
    inputRef.current?.focus({ preventScroll: true });
    onTerminalClick?.();
  };

  // Focus input automatically on mount or when clicked
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Auto scroll terminal output internally without ever scrolling parent window or mobile viewport
  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [outputItems]);

  const appendKeyText = (text: string) => {
    setInputVal(prev => {
      if (!prev) return text.trimStart();
      if (text.startsWith(' ') && prev.endsWith(' ')) {
        return `${prev}${text.trimStart()}`;
      }
      return `${prev}${text}`;
    });
    setHasTypedManually(true);
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleQuickKey = (keyId: string) => {
    if (keyId === 'tab') {
      handleTabCompletion();
      inputRef.current?.focus({ preventScroll: true });
    } else if (keyId === 'ctrl_c') {
      if (inputVal) {
        setOutputItems(prev => [
          ...prev,
          {
            id: `canc_${Date.now()}`,
            type: 'command',
            text: `${inputVal}^C`,
            path: vfsState.currentPath
          }
        ]);
      }
      setInputVal('');
      setHistoryIndex(-1);
      inputRef.current?.focus({ preventScroll: true });
    } else if (keyId === 'arrow_up') {
      const hist = vfsState.history;
      if (hist && hist.length > 0) {
        const nextIdx = historyIndex === -1 ? hist.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(hist[nextIdx]);
      }
      inputRef.current?.focus({ preventScroll: true });
    } else if (keyId === 'arrow_down') {
      const hist = vfsState.history;
      if (hist && historyIndex !== -1) {
        if (historyIndex < hist.length - 1) {
          const nextIdx = historyIndex + 1;
          setHistoryIndex(nextIdx);
          setInputVal(hist[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
      inputRef.current?.focus({ preventScroll: true });
    } else if (keyId === 'pipe') {
      appendKeyText(' | ');
    } else if (keyId === 'slash') {
      appendKeyText('/');
    } else if (keyId === 'tilde') {
      appendKeyText('~');
    } else if (keyId === 'dash') {
      appendKeyText('-');
    } else if (keyId === 'dotdot') {
      appendKeyText('..');
    } else if (keyId === 'star') {
      appendKeyText('*');
    } else if (keyId === 'redirect') {
      appendKeyText(' > ');
    }
  };

  const handleRunCommand = (commandToRun?: string) => {
    const cmd = (commandToRun !== undefined ? commandToRun : inputVal).trim();
    if (!cmd) return;

    // Check manual typing
    const currentKeystrokes = keystrokeCount;
    const isManual = hasTypedManually || currentKeystrokes > 0;

    // Echo input command
    const cmdItem: TerminalOutputItem = {
      id: `cmd_${Date.now()}_${Math.random()}`,
      type: 'command',
      text: cmd,
      path: vfsState.currentPath
    };

    const lowerCmd = cmd.trim().toLowerCase();

    // Built-in Terminal CLI handlers for child comfort
    if ((lowerCmd === 'objectives' || lowerCmd === 'tasks' || lowerCmd === 'goals') && activeLevel) {
      const text = [
        `🎯 Mission ${activeLevel.levelNumber}: ${activeLevel.title}`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ...activeLevel.objectives.map((obj, i) => {
          const isDone = completedObjectives.includes(obj.id);
          return `[${i + 1}] ${obj.description} ${isDone ? '(DONE ✅)' : '(PENDING 🔘)'}`;
        }),
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `💡 Tip: Type 'hint' for guidance on the current step!`
      ].join('\n');

      setOutputItems(prev => [...prev, cmdItem, {
        id: `out_${Date.now()}_${Math.random()}`,
        type: 'system',
        text
      }]);
      setInputVal('');
      setHistoryIndex(-1);
      setKeystrokeCount(0);
      setHasTypedManually(false);
      setHintSpell(null);
      setTabSuggestions([]);
      if (onCommandExecuted) {
        onCommandExecuted(cmd, ['objectives_viewed'], {
          clickedTerminal: hasClickedTerminal,
          typedManually: isManual,
          keystrokeCount: currentKeystrokes
        });
      }
      return;
    }

    if ((lowerCmd === 'hint' || lowerCmd === 'hints') && activeLevel) {
      const nextPending = activeLevel.objectives.find(o => !completedObjectives.includes(o.id));
      const text = nextPending 
        ? `💡 Tux's Hint for this step:\n-> ${nextPending.hint}\n${activeLevel.mascotTip}`
        : `🎉 All objectives in this mission are completed! Type 'missions' to see other levels.`;

      setOutputItems(prev => [...prev, cmdItem, {
        id: `out_${Date.now()}_${Math.random()}`,
        type: 'system',
        text
      }]);
      setInputVal('');
      setHistoryIndex(-1);
      setKeystrokeCount(0);
      setHasTypedManually(false);
      setHintSpell(null);
      setTabSuggestions([]);
      if (onCommandExecuted) {
        onCommandExecuted(cmd, ['hint_viewed'], {
          clickedTerminal: hasClickedTerminal,
          typedManually: isManual,
          keystrokeCount: currentKeystrokes
        });
      }
      return;
    }

    if (lowerCmd === 'missions' || lowerCmd === 'levels') {
      const list = levels && levels.length > 0 ? levels : (activeLevel ? [activeLevel] : []);
      const text = [
        `📜 Jumbo-Linux Missions:`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ...list.map(l => `[Lvl ${l.levelNumber}] ${l.title} - ${l.subtitle}`),
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `💡 Tip: Use the drop list at top, or type 'tasks' to see active mission goals.`
      ].join('\n');

      setOutputItems(prev => [...prev, cmdItem, {
        id: `out_${Date.now()}_${Math.random()}`,
        type: 'system',
        text
      }]);
      setInputVal('');
      setHistoryIndex(-1);
      setKeystrokeCount(0);
      setHasTypedManually(false);
      setHintSpell(null);
      setTabSuggestions([]);
      if (onCommandExecuted) {
        onCommandExecuted(cmd, ['missions_viewed'], {
          clickedTerminal: hasClickedTerminal,
          typedManually: isManual,
          keystrokeCount: currentKeystrokes
        });
      }
      return;
    }

    if (lowerCmd === 'video' || lowerCmd === 'videos' || lowerCmd === 'tutorials' || lowerCmd === 'lessons') {
      const text = [
        `📺 Opening Our Official Jumbo Linux Video Lessons!`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Our video guides teaching children how to use Jumbo Linux:`,
        `  ▶ Lesson 1: Getting Started & Your First Shell Commands`,
        `  ▶ Lesson 2: Navigating Secret Folders & Files (pwd, ls, cd)`,
        `  ▶ Lesson 3: Fun Terminal Spells & Animals (cowsay, sl, cmatrix)`,
        `  ▶ Lesson 4: Superpowers & File Permissions (touch, cat, chmod)`,
        `  ▶ Lesson 5: Pipelines & Process Zapping (| pipe, ps, kill)`,
        `  ▶ Lesson 6: Terminal Speed Mastery & Pro Bash Secrets`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `✨ Embedded from YouTube for safe, distraction-free learning.`
      ].join('\n');

      setOutputItems(prev => [...prev, cmdItem, {
        id: `out_${Date.now()}_${Math.random()}`,
        type: 'system',
        text
      }]);
      setInputVal('');
      setHistoryIndex(-1);
      setKeystrokeCount(0);
      setHasTypedManually(false);
      setHintSpell(null);
      setTabSuggestions([]);
      window.dispatchEvent(new CustomEvent('open-jumbo-videos'));
      if (onCommandExecuted) {
        onCommandExecuted(cmd, ['videos_opened'], {
          clickedTerminal: hasClickedTerminal,
          typedManually: isManual,
          keystrokeCount: currentKeystrokes
        });
      }
      return;
    }

    if (lowerCmd === 'leaderboard' || lowerCmd === 'top' || lowerCmd === 'top10') {
      const text = [
        `🏆 JUMBO LINUX LIVE CLOUD LEADERBOARD (Top 10 Explorers)`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `1. 🥇 Tux_SuperSpeed      - 3,200 XP (Lvl 12, 🔥 14d)`,
        `2. 🥈 Jumbo_Explorer      - 2,150 XP (Lvl 9,  🔥 8d)`,
        `3. 🥉 Linus_Junior        - 1,840 XP (Lvl 8,  🔥 6d)`,
        `4. ⚡ CommandNinja99      - 1,520 XP (Lvl 7,  🔥 5d)`,
        `5. 🚀 ChromebookRanger    - 1,100 XP (Lvl 5,  🔥 4d)`,
        `6. 👑 RootPrincess        - 850 XP   (Lvl 4,  🔥 3d)`,
        `7. 🔧 PipesGuru           - 620 XP   (Lvl 3,  🔥 3d)`,
        `8. 🦊 TerminalFox         - 510 XP   (Lvl 3,  🔥 2d)`,
        `9. ⭐ StarCoder_Maya      - 380 XP   (Lvl 2,  🔥 2d)`,
        `10. 🐼 BashPanda          - 260 XP   (Lvl 2,  🔥 1d)`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `✨ Real-time Firestore sync active! Opening cloud standings...`
      ].join('\n');

      setOutputItems(prev => [...prev, cmdItem, {
        id: `out_${Date.now()}_${Math.random()}`,
        type: 'system',
        text
      }]);
      setInputVal('');
      setHistoryIndex(-1);
      setKeystrokeCount(0);
      setHasTypedManually(false);
      setHintSpell(null);
      setTabSuggestions([]);
      window.dispatchEvent(new CustomEvent('open-leaderboard'));
      if (onCommandExecuted) {
        onCommandExecuted(cmd, ['leaderboard_opened'], {
          clickedTerminal: hasClickedTerminal,
          typedManually: isManual,
          keystrokeCount: currentKeystrokes
        });
      }
      return;
    }

    if (lowerCmd === 'cheatsheet' || lowerCmd === 'commands' || lowerCmd === 'spells') {
      const text = [
        `📋 Jumbo Linux Kid's Command Cheatsheet:`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `  pwd          -> Print Working Directory (Where am I?)`,
        `  ls           -> List files in this directory`,
        `  ls -la       -> List all files including hidden ones`,
        `  cd <folder>  -> Change directory (cd .. to go up)`,
        `  cat <file>   -> Read & print file contents`,
        `  touch <file> -> Create a new empty file`,
        `  mkdir <dir>  -> Create a new folder`,
        `  whoami       -> Display your shell username`,
        `  echo "text"  -> Print text to terminal`,
        `  grep <word>  -> Search for text inside files`,
        `  chmod +x <f> -> Make a script executable`,
        `  ps aux       -> List active processes`,
        `  cowsay <msg> -> Make a friendly cow say your message!`,
        `  clear        -> Clear terminal screen (Ctrl + L)`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `💡 Type 'tasks' to see what your current mission needs!`
      ].join('\n');

      setOutputItems(prev => [...prev, cmdItem, {
        id: `out_${Date.now()}_${Math.random()}`,
        type: 'system',
        text
      }]);
      setInputVal('');
      setHistoryIndex(-1);
      setKeystrokeCount(0);
      setHasTypedManually(false);
      setHintSpell(null);
      setTabSuggestions([]);
      if (onCommandExecuted) {
        onCommandExecuted(cmd, ['cheatsheet_viewed'], {
          clickedTerminal: hasClickedTerminal,
          typedManually: isManual,
          keystrokeCount: currentKeystrokes
        });
      }
      return;
    }

    if (lowerCmd === 'streak' || lowerCmd === 'daily' || lowerCmd === 'dailystreak') {
      const text = [
        `🔥 JUMBO-LINUX DAILY HABIT STREAK`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `👤 Student: ${studentName || 'Explorer'}`,
        `🔥 Daily Streak: Active today!`,
        `💡 Check your Student Profile icon in the top header for your full 7-day activity calendar.`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      ].join('\n');

      setOutputItems(prev => [...prev, cmdItem, {
        id: `out_${Date.now()}_${Math.random()}`,
        type: 'system',
        text
      }]);
      setInputVal('');
      setHistoryIndex(-1);
      setKeystrokeCount(0);
      setHasTypedManually(false);
      setHintSpell(null);
      setTabSuggestions([]);
      if (onCommandExecuted) {
        onCommandExecuted(cmd, ['streak_viewed'], {
          clickedTerminal: hasClickedTerminal,
          typedManually: isManual,
          keystrokeCount: currentKeystrokes
        });
      }
      return;
    }

    // Execute via VFS
    const { result, nextState } = executeCommand(cmd, vfsState);

    // Update VFS state
    setVfsState(nextState);

    if (result.output === '__CLEAR__') {
      setOutputItems([]);
    } else {
      const newItems: TerminalOutputItem[] = [cmdItem];
      if (result.output) {
        newItems.push({
          id: `out_${Date.now()}_${Math.random()}`,
          type: result.type,
          text: result.output
        });
      }
      setOutputItems(prev => [...prev, ...newItems]);
    }

    setInputVal('');
    setHistoryIndex(-1);
    setKeystrokeCount(0);
    setHasTypedManually(false);
    setHintSpell(null);
    setTabSuggestions([]);

    if (onCommandExecuted) {
      onCommandExecuted(cmd, result.eventsTriggered, {
        clickedTerminal: hasClickedTerminal,
        typedManually: isManual,
        keystrokeCount: currentKeystrokes
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Detect real typing
    if (
      e.key !== 'Enter' &&
      e.key !== 'Tab' &&
      e.key !== 'ArrowUp' &&
      e.key !== 'ArrowDown' &&
      e.key !== 'Shift' &&
      e.key !== 'Control' &&
      e.key !== 'Alt' &&
      e.key !== 'Meta'
    ) {
      setHasTypedManually(true);
      setKeystrokeCount(prev => prev + 1);
    }

    // Arrow Up / Down for command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const hist = vfsState.history;
      if (hist.length > 0) {
        const nextIdx = historyIndex === -1 ? hist.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(hist[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const hist = vfsState.history;
      if (historyIndex !== -1) {
        if (historyIndex < hist.length - 1) {
          const nextIdx = historyIndex + 1;
          setHistoryIndex(nextIdx);
          setInputVal(hist[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete suggestions
      handleTabCompletion();
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      setOutputItems(prev => [
        ...prev,
        {
          id: `canc_${Date.now()}`,
          type: 'command',
          text: `${inputVal}^C`,
          path: vfsState.currentPath
        }
      ]);
      setInputVal('');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutputItems([]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleRunCommand();
    }
  };

  const handleTabCompletion = () => {
    const result = computeTabCompletion(inputVal, vfsState);

    if (result.matchCount === 1) {
      setInputVal(result.completedText);
      setTabSuggestions([]);
      setHasTypedManually(true);
      playTabCompletionSound();
    } else if (result.matchCount > 1) {
      if (result.completedText !== inputVal) {
        setInputVal(result.completedText);
      }
      setTabSuggestions(result.suggestions);
      playTabCompletionSound();

      // Display suggestions in the terminal output, exactly like Linux bash
      setOutputItems(prev => [
        ...prev,
        {
          id: `tab_cmd_${Date.now()}_${Math.random()}`,
          type: 'command',
          text: inputVal,
          path: vfsState.currentPath
        },
        {
          id: `tab_sugg_${Date.now()}_${Math.random()}`,
          type: 'system',
          text: result.suggestions.join('   ')
        }
      ]);
    } else {
      setTabSuggestions([]);
    }
  };

  const applySuggestion = (suggestion: string) => {
    const lastSpaceIdx = inputVal.lastIndexOf(' ');
    if (lastSpaceIdx === -1) {
      const isDir = suggestion.endsWith('/');
      setInputVal(suggestion + (isDir ? '' : ' '));
    } else {
      const lead = inputVal.slice(0, lastSpaceIdx + 1);
      const token = inputVal.slice(lastSpaceIdx + 1);
      const lastSlash = token.lastIndexOf('/');
      const dirPart = lastSlash !== -1 ? token.slice(0, lastSlash + 1) : '';
      const isDir = suggestion.endsWith('/');
      setInputVal(lead + dirPart + suggestion + (isDir ? '' : ' '));
    }
    setTabSuggestions([]);
    setHasTypedManually(true);
    playTabCompletionSound();
  };

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const displayPromptPath = vfsState.currentPath.replace(/^\/home\/jumbo/, '~');

  return (
    <div className={`flex flex-col w-full max-w-full flex-1 min-h-0 rounded-none sm:rounded-2xl overflow-hidden border-t sm:border font-['JetBrains_Mono',monospace] text-sm bg-[#0F172A] text-slate-100 border-slate-800 sm:border-slate-700/80 shadow-md ${className}`}>
      {/* Terminal Titlebar (Minimalist & Sleek) */}
      <div className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex items-center justify-between border-b select-none bg-slate-900/95 text-white border-slate-800 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EA4335] inline-block" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FBBC05] inline-block" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#34A853] inline-block" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase ml-1 flex items-center gap-1.5 text-slate-300 truncate max-w-[170px] sm:max-w-none">
            <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#34A853] shrink-0" />
            <span className="truncate">{effectiveBannerTitle}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setSoundOn(toggleSound())}
            title={soundOn ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Enable)'}
            className={`p-1 sm:p-1.5 border rounded-lg text-xs cursor-pointer transition-colors ${
              soundOn 
                ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-amber-300 hover:text-amber-200' 
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundOn ? <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          </button>
          <button
            onClick={() => setOutputItems([])}
            title="Clear Terminal Output (clear)"
            className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-[#34A853] hover:bg-emerald-600 border border-emerald-500 rounded-lg text-[10px] sm:text-xs font-black text-white cursor-pointer transition-all flex items-center gap-1 shadow-sm active:scale-95"
          >
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Current Objective Banner on Terminal (Prominently reflects current task) */}
      {activeLevel && (
        <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-900/95 border-b border-slate-800/90 flex items-center justify-between gap-1.5 flex-nowrap overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" /> Goal:
            </span>
            <span className="text-[11px] sm:text-sm font-bold text-slate-100 truncate">
              {currentPendingObjective ? currentPendingObjective.description : '🎉 All mission tasks completed!'}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 shrink-0">
            {completedObjectives.length}/{activeLevel.objectives.length} Done
          </span>
        </div>
      )}

      {/* Terminal Output Area - Edge-to-edge and fills learning view */}
      <div 
        ref={outputContainerRef}
        onClick={triggerTerminalFocus}
        className="flex-1 p-2 sm:p-5 overflow-y-auto min-h-[160px] sm:min-h-[340px] md:min-h-[440px] space-y-1.5 sm:space-y-2 cursor-text select-text"
      >
        {outputItems.map((item, idx) => {
          if (item.type === 'command') {
            const path = (item.path || vfsState.currentPath).replace(/^\/home\/jumbo/, '~');
            return (
              <div key={item.id} className="flex items-start gap-2 text-xs sm:text-sm font-bold">
                <span className="text-[#34A853] shrink-0 font-bold">{displayUserEmail}</span>
                <span className="text-slate-400">:</span>
                <span className="text-[#4285F4] shrink-0 font-bold">{path}</span>
                <span className="text-[#FBBC05] font-bold">$</span>
                <span className="text-white break-all font-bold">{item.text}</span>
              </div>
            );
          }

          return (
            <div 
              key={item.id} 
              className={`text-xs sm:text-sm whitespace-pre-wrap leading-relaxed relative group pl-3 border-l-2 font-medium ${
                item.type === 'error'
                  ? 'border-red-500 text-red-300 bg-red-950/30 py-1.5 rounded-r-lg'
                  : item.type === 'success'
                  ? 'border-[#34A853] text-emerald-300 bg-emerald-950/30 py-1.5 rounded-r-lg'
                  : item.type === 'system'
                  ? 'border-[#FBBC05] text-amber-200 bg-amber-950/30 py-1.5 rounded-r-lg'
                  : 'border-slate-600 text-slate-200'
              }`}
            >
              {item.text}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyText(item.text, idx);
                }}
                title="Copy output"
                className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 p-1 bg-slate-800 border border-slate-700 rounded text-slate-300 hover:text-white transition-opacity cursor-pointer"
              >
                {copiedIndex === idx ? <Check className="w-3 h-3 text-[#34A853]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          );
        })}

        {/* Interactive Tab Completion Pills (visible when multiple suggestions exist) */}
        {tabSuggestions.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap p-2 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs">
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1 select-none">
              <Sparkles className="w-3 h-3 text-amber-400" /> Tab Suggestions:
            </span>
            {tabSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  applySuggestion(item);
                  triggerTerminalFocus();
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold cursor-pointer border transition-colors ${
                  item.endsWith('/') 
                    ? 'bg-blue-900/50 hover:bg-blue-800 text-blue-200 border-blue-600/60'
                    : item.endsWith('.sh')
                      ? 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border-emerald-600/60'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 hover:border-amber-400'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Live Prompt Line with Blinking Cursor and slight color transition background */}
        <div 
          onClick={triggerTerminalFocus}
          className="flex items-center gap-2 text-xs sm:text-sm pt-2 cursor-pointer"
        >
          <span className="text-[#34A853] shrink-0 font-bold">{displayUserEmail}</span>
          <span className="text-slate-400">:</span>
          <span className="text-[#4285F4] shrink-0 font-bold">{displayPromptPath}</span>
          <span className="text-[#FBBC05] font-bold">$</span>

          <div 
            onClick={(e) => {
              e.stopPropagation();
              triggerTerminalFocus();
            }}
            className="flex-1 relative flex items-center px-3 py-1.5 rounded-xl border transition-all cursor-text animate-input-blink-dark text-white border-blue-500/50 bg-slate-900/40"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setHasTypedManually(true);
                setKeystrokeCount(prev => prev + 1);
              }}
              onKeyDown={handleKeyDown}
              placeholder={dynamicPlaceholder}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full bg-transparent border-none outline-none text-white font-['JetBrains_Mono',monospace] font-bold text-xs sm:text-sm placeholder:text-slate-400 truncate"
              style={{ caretColor: '#34A853' }}
            />
            {/* Blinking block cursor INSIDE the input field */}
            <span className="w-2.5 h-4 bg-[#34A853] animate-blink inline-block shrink-0 rounded-xs ml-1 shadow-xs" />
          </div>

          <button
            onClick={() => handleRunCommand()}
            disabled={!inputVal.trim()}
            className="p-2 rounded-xl bg-[#4285F4] hover:bg-blue-600 disabled:opacity-40 text-white transition-all border border-blue-500 active:scale-95 cursor-pointer"
            title="Execute (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div ref={terminalEndRef} />
      </div>

      {/* Mild Linux Quick Keys Bar on Top of Terminal Status Details */}
      <div className="px-2 sm:px-3 py-1 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none select-none shrink-0">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mr-0.5 shrink-0 hidden xs:inline">
          Keys:
        </span>
        {LINUX_SHORTCUT_KEYS.map((k) => (
          <button
            key={k.id}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              handleQuickKey(k.id);
            }}
            title={k.title}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-slate-800/90 hover:bg-slate-700 active:bg-[#4285F4] text-slate-300 hover:text-white active:text-white border border-slate-700/70 hover:border-slate-600 font-mono text-[11px] sm:text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* Terminal Footer Status Bar: STUDENT, MISSION, XP & JUMBO-LINUX KIDS */}
      <div className="px-2 sm:px-4 py-2 border-t flex items-center justify-between gap-1.5 sm:gap-3 bg-slate-900/95 text-slate-300 border-slate-800 text-[10px] sm:text-xs font-bold tracking-wider select-none shrink-0 overflow-x-auto scrollbar-none whitespace-nowrap">
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="text-slate-400">STUDENT:</span>
          <span className="text-white flex items-center gap-1 font-extrabold uppercase">
            <span>{studentAvatar || '🐧'}</span>
            <span className="text-emerald-400">{studentName || 'Explorer'}</span>
          </span>
        </div>

        <span className="text-slate-600 shrink-0">|</span>

        <div className="flex items-center gap-1 text-amber-400 font-extrabold shrink-0">
          <span>MISSION {activeLevel ? activeLevel.levelNumber : 1}/{totalLevelsCount}</span>
        </div>

        <span className="text-slate-600 shrink-0">|</span>

        <div className="flex items-center gap-1 text-[#FBBC05] font-black shrink-0">
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FBBC05] fill-[#FBBC05]" />
          <span>{studentXp} XP</span>
        </div>

        <span className="text-slate-600 shrink-0">|</span>

        <div className="text-slate-400 font-mono tracking-widest text-[9px] sm:text-[11px] uppercase shrink-0">
          JUMBO-LINUX KIDS
        </div>
      </div>
    </div>
  );
};
