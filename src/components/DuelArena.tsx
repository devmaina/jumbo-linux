import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Swords, Trophy, Zap, Play, RotateCcw, Award, CheckCircle2, User, Bot } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TuxSvg, JumboSvg } from './Mascot';
import { playCommandSuccessSound, playLevelCompleteSound } from '../utils/sound';
import { ArcadeDifficultySwitcher, ArcadeDifficulty } from './ArcadeDifficultySwitcher';

interface DuelTask {
  question: string;
  expectedCommands: string[];
  hint: string;
}

const DUEL_TASKS: DuelTask[] = [
  { question: 'Print your current directory GPS location', expectedCommands: ['pwd'], hint: 'pwd' },
  { question: 'List all files including hidden dotfiles', expectedCommands: ['ls -a', 'ls -la', 'ls -al'], hint: 'ls -a' },
  { question: 'Search for "penguin" inside animals.txt', expectedCommands: ['grep penguin animals.txt', 'cat animals.txt | grep penguin'], hint: 'grep penguin animals.txt' },
  { question: 'Make script play.sh executable', expectedCommands: ['chmod +x play.sh', 'chmod 755 play.sh'], hint: 'chmod +x play.sh' },
  { question: 'Display who is currently logged in', expectedCommands: ['whoami'], hint: 'whoami' }
];

interface DuelArenaProps {
  onDuelWon?: () => void;
  onGoBackToHub?: () => void;
}

export const DuelArena: React.FC<DuelArenaProps> = ({ onDuelWon, onGoBackToHub }) => {
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('medium');
  const [isDueling, setIsDueling] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerProgress, setPlayerProgress] = useState(0); // 0 to 3
  const [botProgress, setBotProgress] = useState(0); // 0 to 3
  const [playerInput, setPlayerInput] = useState('');
  const [winner, setWinner] = useState<'player' | 'bot' | null>(null);
  const [opponentName, setOpponentName] = useState('Tux Penguin');

  const activeTasks = DUEL_TASKS.slice(0, 3);

  const botIntervalMs = difficulty === 'hard' ? 2000 : difficulty === 'easy' ? 5200 : 3500;

  const startDuel = (opponent: string) => {
    setOpponentName(opponent);
    setIsDueling(true);
    setCurrentRound(0);
    setPlayerProgress(0);
    setBotProgress(0);
    setPlayerInput('');
    setWinner(null);
  };

  // Bot movement simulation
  useEffect(() => {
    if (!isDueling || winner) return;

    const interval = setInterval(() => {
      setBotProgress(prev => {
        if (prev < 3) {
          const next = prev + 1;
          if (next >= 3 && playerProgress < 3) {
            setWinner('bot');
            setIsDueling(false);
          }
          return next;
        }
        return prev;
      });
    }, botIntervalMs);

    return () => clearInterval(interval);
  }, [isDueling, winner, playerProgress, botIntervalMs]);

  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDueling || winner) return;

    const currentTask = activeTasks[playerProgress];
    const cleaned = playerInput.trim().toLowerCase();

    if (currentTask.expectedCommands.some(cmd => cmd.toLowerCase() === cleaned)) {
      const nextProgress = playerProgress + 1;
      setPlayerProgress(nextProgress);
      setPlayerInput('');

      if (nextProgress >= 3) {
        setWinner('player');
        setIsDueling(false);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        playLevelCompleteSound();
        if (onDuelWon) onDuelWon();
      } else {
        playCommandSuccessSound();
      }
    } else {
      // Gentle vibration feedback
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 font-['Nunito',sans-serif]">
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

      {/* Banner */}
      <div className="bg-[#EA4335] rounded-2xl p-6 sm:p-8 text-white border border-red-600 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBC05] text-black text-xs font-bold uppercase tracking-wider shadow-xs">
            <Swords className="w-3.5 h-3.5" />
            SPEED PRACTICE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] uppercase tracking-tight">
            FRIENDLY DUELS
          </h2>
          <p className="text-white/90 text-xs sm:text-sm font-medium max-w-md">
            Go head-to-head in fun speed typing! Complete 3 quick tasks faster than your computer friend.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-red-950/70 text-white p-4 rounded-2xl border border-red-700/60 shadow-xs shrink-0">
          <JumboSvg size={44} mood="celebrating" />
          <div className="text-lg font-bold text-[#FBBC05] font-mono">VS</div>
          <TuxSvg size={44} mood="happy" />
        </div>
      </div>

      {/* Opponent Selection & Start Arena */}
      {!isDueling && !winner && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base font-black text-slate-900 font-['Fredoka',sans-serif] uppercase tracking-tight">
              SELECT A FRIENDLY RIVAL:
            </h3>
            <ArcadeDifficultySwitcher
              difficulty={difficulty}
              onChange={setDifficulty}
              size="sm"
              showLabel
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Tux Speedster */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-3.5">
              <div className="flex items-center gap-3">
                <TuxSvg size={40} mood="happy" />
                <div>
                  <h4 className="text-sm font-bold uppercase text-slate-900">Tux Penguin</h4>
                  <span className="text-xs font-bold text-[#4285F4] uppercase font-mono">Standard • Easy</span>
                </div>
              </div>
              <button
                onClick={() => startDuel('Tux Penguin')}
                className="w-full py-2 rounded-xl bg-[#4285F4] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                PLAY TUX
              </button>
            </div>

            {/* Friend Bot */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-purple-400 transition-all flex flex-col justify-between space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-slate-900">Robot Buddy</h4>
                  <span className="text-xs font-bold text-purple-700 uppercase font-mono">Medium • Steady</span>
                </div>
              </div>
              <button
                onClick={() => startDuel('Robot Buddy')}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                PLAY ROBOT
              </button>
            </div>

            {/* Explorer */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#34A853] shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-slate-900">Explorer</h4>
                  <span className="text-xs font-bold text-[#34A853] uppercase font-mono">Practice • Fun</span>
                </div>
              </div>
              <button
                onClick={() => startDuel('Explorer')}
                className="w-full py-2 rounded-xl bg-[#34A853] hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                PLAY EXPLORER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Duel Track Arena */}
      {(isDueling || winner) && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-black text-slate-900 text-base sm:text-lg font-['Fredoka',sans-serif] uppercase tracking-tight">
              SPEED TRACK
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <ArcadeDifficultySwitcher
                difficulty={difficulty}
                onChange={setDifficulty}
                size="sm"
              />
              <span className="text-xs font-bold uppercase tracking-wider bg-[#FBBC05] text-black px-2.5 py-1 rounded-xl shadow-xs">
                FIRST TO 3 WINS!
              </span>
            </div>
          </div>

          {/* Race Tracks */}
          <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Player Track */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                <span className="flex items-center gap-1.5 text-[#4285F4]">
                  <User className="w-3.5 h-3.5" /> YOU
                </span>
                <span className="font-mono text-slate-500">{playerProgress} / 3</span>
              </div>
              <div className="relative h-10 bg-white border border-slate-200 rounded-full overflow-hidden flex items-center px-2">
                <div 
                  className="h-full bg-[#4285F4] rounded-full transition-all duration-300"
                  style={{ width: `${(playerProgress / 3) * 100}%` }}
                />
                <div 
                  className="absolute transition-all duration-300 -translate-x-1/2"
                  style={{ left: `${Math.max(8, (playerProgress / 3) * 90)}%` }}
                >
                  <JumboSvg size={30} mood="happy" />
                </div>
              </div>
            </div>

            {/* Opponent Track */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                <span className="flex items-center gap-1.5 text-[#EA4335]">
                  <Bot className="w-3.5 h-3.5" /> {opponentName.toUpperCase()}
                </span>
                <span className="font-mono text-slate-500">{botProgress} / 3</span>
              </div>
              <div className="relative h-10 bg-white border border-slate-200 rounded-full overflow-hidden flex items-center px-2">
                <div 
                  className="h-full bg-[#EA4335] rounded-full transition-all duration-300"
                  style={{ width: `${(botProgress / 3) * 100}%` }}
                />
                <div 
                  className="absolute transition-all duration-300 -translate-x-1/2"
                  style={{ left: `${Math.max(8, (botProgress / 3) * 90)}%` }}
                >
                  <TuxSvg size={30} mood="happy" />
                </div>
              </div>
            </div>
          </div>

          {/* Winner Banner */}
          {winner && (
            <div className={`p-5 rounded-xl border text-center space-y-3 shadow-xs ${
              winner === 'player' ? 'bg-[#34A853] text-white border-emerald-600' : 'bg-[#EA4335] text-white border-red-600'
            }`}>
              <div className="w-12 h-12 mx-auto rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                {winner === 'player' ? '🏆' : '🐧'}
              </div>
              <h4 className="text-xl font-black font-['Fredoka',sans-serif] uppercase tracking-tight">
                {winner === 'player' ? 'GREAT JOB! YOU WON!' : 'GOOD TRY! YOUR FRIEND WAS A BIT FASTER!'}
              </h4>
              <p className="text-xs sm:text-sm font-medium">
                {winner === 'player'
                  ? 'Your typing was super fast! +150 XP awarded to your stars!'
                  : 'Keep trying in the Task terminal to get faster!'}
              </p>
              <button
                onClick={() => {
                  setWinner(null);
                  setIsDueling(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold uppercase text-xs tracking-wider shadow-xs hover:bg-slate-100 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                PLAY AGAIN
              </button>
            </div>
          )}

          {/* Active Question Prompt */}
          {!winner && playerProgress < 3 && (
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  QUESTION {playerProgress + 1} OF 3
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 font-['Fredoka',sans-serif]">
                  {activeTasks[playerProgress].question}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Type the command and press Enter!
                </p>
              </div>

              <form onSubmit={handlePlayerSubmit} className="flex items-center gap-2 font-mono">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="text"
                    autoFocus
                    value={playerInput}
                    onChange={(e) => setPlayerInput(e.target.value)}
                    placeholder={activeTasks[playerProgress].hint}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-['JetBrains_Mono',monospace] text-sm font-bold text-slate-900 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#4285F4] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs active:scale-[0.99] transition-all cursor-pointer"
                >
                  GO
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
