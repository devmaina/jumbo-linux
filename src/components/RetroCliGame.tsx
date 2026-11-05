import React, { useState } from 'react';
import { Gamepad2, Play, Sparkles, RotateCcw, ArrowLeft, Shield, Bomb, Target, Zap } from 'lucide-react';
import { playCommandSuccessSound, playLevelCompleteSound } from '../utils/sound';

interface RetroCliGameProps {
  onEarnXp: (amount: number) => void;
  onBackToMissions?: () => void;
}

type MiniGameKey = 'drop-catch' | 'single-shot' | 'missile-defense' | 'letter-bomb' | 'bomb-dodge';

export const RetroCliGame: React.FC<RetroCliGameProps> = ({ onEarnXp, onBackToMissions }) => {
  const [activeGame, setActiveGame] = useState<MiniGameKey>('drop-catch');
  const [score, setScore] = useState(120);
  const [basketPos, setBasketPos] = useState(5); // 1 to 9
  const [laserFired, setLaserFired] = useState(false);
  const [missileCount, setMissileCount] = useState(3);
  const [defusedWire, setDefusedWire] = useState(false);
  const [dodgeSide, setDodgeSide] = useState<'left' | 'center' | 'right'>('center');
  const [feedback, setFeedback] = useState<string>('Select an action or control below!');

  const handleAction = (game: MiniGameKey, action: string) => {
    playCommandSuccessSound();
    if (game === 'drop-catch') {
      if (action === 'left') {
        setBasketPos(prev => Math.max(1, prev - 2));
        setFeedback('🧺 Basket moved LEFT! Star caught cleanly! +30 XP');
        setScore(s => s + 30);
        onEarnXp(30);
      } else if (action === 'right') {
        setBasketPos(prev => Math.min(9, prev + 2));
        setFeedback('🧺 Basket moved RIGHT! Star caught cleanly! +30 XP');
        setScore(s => s + 30);
        onEarnXp(30);
      }
    } else if (game === 'single-shot') {
      setLaserFired(true);
      setFeedback('🎯 DIRECT HIT! Laser cannon destroyed rogue glitch PID:404! +50 XP');
      setScore(s => s + 50);
      onEarnXp(50);
      setTimeout(() => setLaserFired(false), 1200);
    } else if (game === 'missile-defense') {
      setMissileCount(prev => (prev > 0 ? prev - 1 : 3));
      setFeedback('🛡️ COUNTER-MEASURE DEPLOYED! Asteroids neutralized by Linux Firewall! +45 XP');
      setScore(s => s + 45);
      onEarnXp(45);
    } else if (game === 'letter-bomb') {
      setDefusedWire(true);
      setFeedback('✂️ SNIP! You cut the TUX-HERO wire with code! Bomb safely defused! +60 XP');
      playLevelCompleteSound();
      setScore(s => s + 60);
      onEarnXp(60);
      setTimeout(() => {
        setActiveGame('bomb-dodge');
        resetGame();
      }, 1500);
    } else if (game === 'bomb-dodge') {
      const side = action as 'left' | 'right' | 'center';
      setDodgeSide(side);
      setFeedback(`🏃 TUX DASHED ${side.toUpperCase()}! The bomb exploded harmlessly in the ditch! +40 XP`);
      setScore(s => s + 40);
      onEarnXp(40);
      setTimeout(() => {
        setActiveGame('drop-catch');
        resetGame();
      }, 1500);
    }
  };

  const resetGame = () => {
    setDefusedWire(false);
    setLaserFired(false);
    setBasketPos(5);
    setDodgeSide('center');
    setFeedback('Game reset! Ready for action.');
  };

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden font-['JetBrains_Mono',monospace] shadow-xl text-slate-100 flex flex-col">
      {/* Top Banner */}
      <div className="bg-slate-950 px-3 sm:px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-xs sm:text-sm text-emerald-400 uppercase tracking-wide">
            Terminal Retro Arcade
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Score: {score}</span>
          </span>
          {onBackToMissions && (
            <button
              onClick={onBackToMissions}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Back
            </button>
          )}
        </div>
      </div>

      {/* Mini Game Selector Pills */}
      <div className="bg-slate-900/90 px-2 sm:px-3 py-1.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Game:</span>
        <button
          onClick={() => { setActiveGame('drop-catch'); resetGame(); }}
          className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeGame === 'drop-catch' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🧺 Drop Catch
        </button>
        <button
          onClick={() => { setActiveGame('single-shot'); resetGame(); }}
          className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeGame === 'single-shot' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🎯 Single Shot
        </button>
        <button
          onClick={() => { setActiveGame('missile-defense'); resetGame(); }}
          className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeGame === 'missile-defense' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🛡️ Missile Base
        </button>
        <button
          onClick={() => { setActiveGame('letter-bomb'); resetGame(); }}
          className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeGame === 'letter-bomb' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          💣 Letter Bomb
        </button>
        <button
          onClick={() => { setActiveGame('bomb-dodge'); resetGame(); }}
          className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeGame === 'bomb-dodge' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          💥 Bomb Dodge
        </button>
      </div>

      {/* Screen Canvas (CRT Style) */}
      <div className="p-4 sm:p-6 bg-slate-950 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[220px] flex flex-col justify-between select-none">
        {activeGame === 'drop-catch' && (
          <div className="space-y-2">
            <div className="text-emerald-400 font-bold border-b border-emerald-900 pb-1">
              =====================================================
              <br />
              🧺 DROP CATCH ARCADE - TERMINAL MINI-GAME 🧺
              <br />
              =====================================================
            </div>
            <div className="text-slate-400">Catch falling star with your shell basket!</div>
            <div className="py-2">
              <div className="text-amber-300 font-bold pl-12 animate-bounce">⭐ (Falling Star!)</div>
              <div className="text-slate-600 pl-14">|</div>
              <div className="text-slate-600 pl-14">v</div>
              <div className="text-emerald-400 font-black" style={{ paddingLeft: `${basketPos * 14}px` }}>
                \_____/ &nbsp; &lt;-- [Your Shell Basket]
              </div>
            </div>
          </div>
        )}

        {activeGame === 'single-shot' && (
          <div className="space-y-2">
            <div className="text-sky-400 font-bold border-b border-sky-900 pb-1">
              =====================================================
              <br />
              🎯 SINGLE SHOT SNIPER - TARGET ARCADE 🎯
              <br />
              =====================================================
            </div>
            <div className="text-slate-400">Target: [ 👾 ROGUE GLITCH (PID: 404) ]</div>
            <div className="py-2 text-center">
              <div className="text-red-400 font-bold text-base">👾 [ROGUE GLITCH PID:404]</div>
              {laserFired ? (
                <div className="text-cyan-300 font-black py-1 animate-pulse">
                  |||||||||||| [⚡ TUX HIGH-POWER LASER BLAST!] ||||||||||||
                </div>
              ) : (
                <div className="text-slate-600 py-1">| | | [Laser Standby] | | |</div>
              )}
              <div className="text-emerald-400 font-bold">[🚀 CANNON READY]</div>
            </div>
          </div>
        )}

        {activeGame === 'missile-defense' && (
          <div className="space-y-2">
            <div className="text-teal-400 font-bold border-b border-teal-900 pb-1">
              =====================================================
              <br />
              🛡️ MISSILE DEFENSE BASE - COMMAND TERMINAL 🛡️
              <br />
              =====================================================
            </div>
            <div className="text-slate-400">Threat: ☄️ ASTEROID CLUSTER DETECTED AT SECTOR 7!</div>
            <div className="py-2 text-center space-y-1">
              <div className="text-amber-400 font-bold">☄️ &nbsp; &nbsp; &nbsp; &nbsp; ☄️ &nbsp; &nbsp; &nbsp; &nbsp; ☄️</div>
              <div className="text-slate-500">\ &nbsp; &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp; &nbsp; /</div>
              <div className="text-emerald-400 font-black">💥 LINUX FIREWALL COUNTER-MEASURE ACTIVE!</div>
              <div className="text-teal-300 font-bold">[🏰 JUMBO LINUX COMMAND BASE]</div>
            </div>
          </div>
        )}

        {activeGame === 'letter-bomb' && (
          <div className="space-y-2">
            <div className="text-amber-400 font-bold border-b border-amber-900 pb-1">
              =====================================================
              <br />
              💣 LETTER BOMB DEFUSAL UNIT - RAPID TYPING ⏱️
              <br />
              =====================================================
            </div>
            <div className="text-slate-400">Bomb Clock: [ 00:08s ] | Wire code: "TUX-HERO"</div>
            <div className="py-3 text-center">
              <div className="text-rose-400 font-black text-lg animate-pulse">💣 [TICK... TICK... TICK...]</div>
              {defusedWire ? (
                <div className="text-emerald-400 font-bold mt-2">
                  ✂️ WIRE CUT SUCCESSFULLY! BOMB DEFUSED!
                </div>
              ) : (
                <div className="text-amber-300 font-mono mt-2">
                  Cut wire "TUX-HERO" before detonator triggers!
                </div>
              )}
            </div>
          </div>
        )}

        {activeGame === 'bomb-dodge' && (
          <div className="space-y-2">
            <div className="text-purple-400 font-bold border-b border-purple-900 pb-1">
              =====================================================
              <br />
              💥 LEFT / RIGHT BOMB DODGE RUNNER 🏃
              <br />
              =====================================================
            </div>
            <div className="py-2">
              <div className="flex justify-between px-6 text-rose-400 font-bold">
                <span>[💣 BOMB LEFT]</span>
                <span>[💣 BOMB RIGHT]</span>
              </div>
              <div className="text-center py-2">
                <span className="text-emerald-400 font-black px-3 py-1 bg-emerald-950/60 border border-emerald-700 rounded">
                  🐧 TUX DASHED {dodgeSide.toUpperCase()}!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status Line */}
        <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] sm:text-xs text-emerald-400 font-bold flex items-center justify-between">
          <span>{feedback}</span>
          <button
            onClick={resetGame}
            title="Reset Game"
            className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="bg-slate-900 p-2 sm:p-3 border-t border-slate-800 flex items-center justify-center gap-2 flex-wrap">
        {activeGame === 'drop-catch' && (
          <>
            <button
              onClick={() => handleAction('drop-catch', 'left')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              ⬅️ Move Basket Left
            </button>
            <button
              onClick={() => handleAction('drop-catch', 'right')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              Move Basket Right ➡️
            </button>
          </>
        )}

        {activeGame === 'single-shot' && (
          <button
            onClick={() => handleAction('single-shot', 'fire')}
            className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Zap className="w-4 h-4" />
            <span>FIRE LASER CANNON!</span>
          </button>
        )}

        {activeGame === 'missile-defense' && (
          <button
            onClick={() => handleAction('missile-defense', 'launch')}
            className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Shield className="w-4 h-4" />
            <span>DEPLOY FIREWALL COUNTER-MEASURE</span>
          </button>
        )}

        {activeGame === 'letter-bomb' && (
          <button
            onClick={() => handleAction('letter-bomb', 'cut')}
            disabled={defusedWire}
            className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 active:scale-95 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Bomb className="w-4 h-4" />
            <span>{defusedWire ? 'DEFUSED ✓' : 'SNIP TUX-HERO WIRE!'}</span>
          </button>
        )}

        {activeGame === 'bomb-dodge' && (
          <>
            <button
              onClick={() => handleAction('bomb-dodge', 'left')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              🏃 Dodge Left
            </button>
            <button
              onClick={() => handleAction('bomb-dodge', 'center')}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 active:scale-95 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Center Shield
            </button>
            <button
              onClick={() => handleAction('bomb-dodge', 'right')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Dodge Right 🏃
            </button>
          </>
        )}
      </div>
    </div>
  );
};
