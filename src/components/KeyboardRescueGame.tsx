import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Play, RotateCcw, Flame, Trophy, Sparkles, Heart, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TuxSvg, JumboSvg } from './Mascot';
import { ArcadeDifficultySwitcher, ArcadeDifficulty } from './ArcadeDifficultySwitcher';

interface FallingCommand {
  id: string;
  word: string;
  x: number; // percentage across 10% to 90%
  y: number; // percentage down
  speed: number;
}

const DICTIONARY_BY_DIFF: Record<ArcadeDifficulty, string[]> = {
  easy: ['ls', 'cd', 'pwd', 'cat', 'tux', 'echo', 'date', 'root', 'help', 'top', 'exit', 'man'],
  medium: ['ls', 'cd', 'pwd', 'cat', 'grep', 'touch', 'mkdir', 'bash', 'tux', 'echo', 'clear', 'kill', 'uname', 'head', 'sudo', 'date'],
  hard: ['chmod', 'chown', 'systemctl', 'traceroute', 'whoami', 'journalctl', 'neofetch', 'crontab', 'killall', 'uptime', 'history', 'reboot', 'find', 'curl']
};

const CONFIG_BY_DIFF: Record<ArcadeDifficulty, {
  speedMin: number;
  speedMax: number;
  spawnInterval: number;
  maxConcurrent: number;
  initialLives: number;
  wordsToBonus: number;
  pointsMultiplier: number;
}> = {
  easy: {
    speedMin: 0.35,
    speedMax: 0.55,
    spawnInterval: 2500,
    maxConcurrent: 3,
    initialLives: 5,
    wordsToBonus: 4,
    pointsMultiplier: 1
  },
  medium: {
    speedMin: 0.58,
    speedMax: 0.95,
    spawnInterval: 1750,
    maxConcurrent: 5,
    initialLives: 3,
    wordsToBonus: 5,
    pointsMultiplier: 1.25
  },
  hard: {
    speedMin: 0.95,
    speedMax: 1.5,
    spawnInterval: 1200,
    maxConcurrent: 6,
    initialLives: 2,
    wordsToBonus: 7,
    pointsMultiplier: 2
  }
};

interface KeyboardRescueProps {
  onGameCompleted?: (score: number) => void;
  onGoBackToHub?: () => void;
}

export const KeyboardRescueGame: React.FC<KeyboardRescueProps> = ({ onGameCompleted, onGoBackToHub }) => {
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('medium');
  const currentConfig = CONFIG_BY_DIFF[difficulty];

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(currentConfig.initialLives);
  const [inputVal, setInputVal] = useState('');
  const [fallingItems, setFallingItems] = useState<FallingCommand[]>([]);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [wordsRescued, setWordsRescued] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  const handleDifficultyChange = (newDiff: ArcadeDifficulty) => {
    setDifficulty(newDiff);
    const newConfig = CONFIG_BY_DIFF[newDiff];
    if (!isPlaying || gameOver) {
      setLives(newConfig.initialLives);
    } else {
      // While playing, adjust max lives proportionally if needed
      setLives(prev => Math.min(newConfig.initialLives, Math.max(1, prev)));
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(currentConfig.initialLives);
    setStreak(0);
    setGameOver(false);
    setWordsRescued(0);
    setFallingItems([]);
    setInputVal('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Spawner
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    spawnTimerRef.current = window.setInterval(() => {
      setFallingItems(prev => {
        if (prev.length >= currentConfig.maxConcurrent) return prev;
        const dict = DICTIONARY_BY_DIFF[difficulty];
        const randomWord = dict[Math.floor(Math.random() * dict.length)];
        const speedRange = currentConfig.speedMax - currentConfig.speedMin;
        const newItem: FallingCommand = {
          id: `item_${Date.now()}_${Math.random()}`,
          word: randomWord,
          x: 12 + Math.random() * 76,
          y: 0,
          speed: currentConfig.speedMin + Math.random() * speedRange
        };
        return [...prev, newItem];
      });
    }, currentConfig.spawnInterval);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isPlaying, gameOver, difficulty, currentConfig]);

  // Movement loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    gameLoopRef.current = window.setInterval(() => {
      setFallingItems(prev => {
        const nextItems: FallingCommand[] = [];
        let lostLife = false;

        for (const item of prev) {
          const nextY = item.y + item.speed;
          if (nextY >= 88) {
            // Reached ground! Lost life
            lostLife = true;
          } else {
            nextItems.push({ ...item, y: nextY });
          }
        }

        if (lostLife) {
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameOver(true);
              setIsPlaying(false);
            }
            return Math.max(0, nextL);
          });
          setStreak(0);
        }

        return nextItems;
      });
    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setInputVal(e.target.value);

    // Check if input matches any falling command
    const matchedIdx = fallingItems.findIndex(item => item.word.toLowerCase() === val);
    if (matchedIdx !== -1) {
      // Success! Rescued
      setFallingItems(prev => prev.filter((_, idx) => idx !== matchedIdx));
      setInputVal('');
      const basePoints = 100 + streak * 20;
      const points = Math.round(basePoints * currentConfig.pointsMultiplier);
      setScore(s => s + points);
      setStreak(st => st + 1);
      setWordsRescued(w => {
        const nextW = w + 1;
        if (nextW >= currentConfig.wordsToBonus && onGameCompleted) {
          onGameCompleted(score + points);
        }
        return nextW;
      });

      if (streak > 0 && streak % 5 === 0) {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs max-w-4xl mx-auto space-y-5 font-['Nunito',sans-serif]">
      {onGoBackToHub && (
        <div>
          <button
            onClick={onGoBackToHub}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            ← Back to Learning
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs shrink-0">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase tracking-tight">
              FALLING WORDS ARCADE
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Type the falling words before they hit the ground!
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Difficulty Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Difficulty Switcher */}
          <ArcadeDifficultySwitcher
            difficulty={difficulty}
            onChange={handleDifficultyChange}
            size="sm"
          />

          {/* Lives */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-xs">
            {Array.from({ length: currentConfig.initialLives }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-colors ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`}
              />
            ))}
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-[#FBBC05] text-black px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-black text-black" />
            <span>{streak}X</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 bg-[#4285F4] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-[#FBBC05]" />
            <span>{score} PTS</span>
          </div>
        </div>
      </div>

      {/* Game Stage Arena */}
      <div className="relative h-[360px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between p-4">
        {/* Sky / Cloud Stars Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Falling Words */}
        {fallingItems.map(item => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, 0)'
            }}
            className="absolute transition-all duration-75"
          >
            <div className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-mono font-bold text-sm shadow-md flex items-center gap-1.5">
              <span className="text-xs">🐧</span>
              <span>{item.word}</span>
            </div>
          </div>
        ))}

        {/* Mascot cheerleaders at bottom */}
        <div className="relative z-10 flex items-end justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-blue-500/40">
            <JumboSvg size={32} mood={streak > 3 ? 'celebrating' : 'happy'} />
            <span className="text-xs font-bold uppercase tracking-wider text-[#4285F4]">
              {streak > 5 ? '🔥 SUPER SPEED!' : 'READY!'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-emerald-500/40">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FBBC05]">
              SAVED: {wordsRescued}
            </span>
            <TuxSvg size={32} mood={isPlaying ? 'happy' : 'thinking'} />
          </div>
        </div>

        {/* Overlay when game not playing or game over */}
        <AnimatePresence>
          {(!isPlaying || gameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-20"
            >
              {gameOver ? (
                <div className="space-y-3.5 max-w-sm">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-md">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-black font-['Fredoka',sans-serif] uppercase">GAME OVER</h4>
                  <p className="text-slate-200 text-xs font-medium">
                    You saved <span className="font-bold text-[#FBBC05]">{wordsRescued} words</span> and earned <span className="font-bold text-emerald-400">{score} points</span>!
                  </p>
                  <div className="py-1 flex justify-center">
                    <ArcadeDifficultySwitcher
                      difficulty={difficulty}
                      onChange={handleDifficultyChange}
                      size="sm"
                    />
                  </div>
                  <button
                    onClick={startGame}
                    className="w-full py-3 rounded-xl bg-[#FBBC05] text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-amber-400 transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    PLAY AGAIN
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5 max-w-sm">
                  <TuxSvg size={64} mood="happy" />
                  <h4 className="text-2xl font-black font-['Fredoka',sans-serif] uppercase">READY TO PLAY?</h4>
                  <p className="text-slate-200 text-xs font-medium leading-relaxed">
                    Words float down the screen. Type each word to rescue it before it lands!
                  </p>
                  <div className="py-1 flex justify-center">
                    <ArcadeDifficultySwitcher
                      difficulty={difficulty}
                      onChange={handleDifficultyChange}
                      size="md"
                    />
                  </div>
                  <button
                    onClick={startGame}
                    className="w-full py-3 rounded-xl bg-[#4285F4] hover:bg-blue-600 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    START GAME
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Typing Input Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            disabled={!isPlaying || gameOver}
            value={inputVal}
            onChange={handleInputChange}
            placeholder={isPlaying ? 'Type falling word here (e.g. ls, pwd)...' : 'Press Start button above to begin!'}
            spellCheck={false}
            autoCapitalize="none"
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-['JetBrains_Mono',monospace] text-sm font-bold text-slate-900 transition-all shadow-xs placeholder:text-slate-400 uppercase"
          />
        </div>
      </div>
    </div>
  );
};
