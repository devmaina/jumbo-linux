import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mouse, Terminal, ArrowRight, CheckCircle2, RotateCcw, Sparkles, Zap, Timer, Folder, FileText, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TuxSvg } from './Mascot';

interface GuiVsTerminalComparisonProps {
  onEarnXp?: (xp: number) => void;
  onGoBackToHub?: () => void;
}

interface CompareStep {
  id: number;
  title: string;
  missionDescription: string;
  guiActionName: string;
  terminalCommand: string;
  terminalExplanation: string;
}

const STEPS: CompareStep[] = [
  {
    id: 1,
    title: 'Step 1: Open a Deeply Buried File',
    missionDescription: 'We need to read the secret note hidden inside the treehouse folders!',
    guiActionName: 'Click 4 folders one by one with your mouse',
    terminalCommand: 'cat ~/games/secret.txt',
    terminalExplanation: 'One short magic line opens the file instantly without clicking through folders!'
  },
  {
    id: 2,
    title: 'Step 2: Create 3 Folders at Once',
    missionDescription: 'Tux wants 3 separate rooms for: dogs, cats, and penguins!',
    guiActionName: 'Right-click, click "New Folder", type name, repeat 3 times!',
    terminalCommand: 'mkdir dogs cats penguins',
    terminalExplanation: 'With Linux, you can make 1, 10, or 100 folders in half a second!'
  },
  {
    id: 3,
    title: 'Step 3: Search for One Word in a Long Book',
    missionDescription: 'Find where the word "treasure" is written inside a huge 100-page book!',
    guiActionName: 'Scroll forever with your mouse wheel reading line by line',
    terminalCommand: 'grep "treasure" island.txt',
    terminalExplanation: 'The detective command "grep" spots the exact sentence in a blink!'
  }
];

export const GuiVsTerminalComparison: React.FC<GuiVsTerminalComparisonProps> = ({
  onEarnXp,
  onGoBackToHub
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Step 1 GUI simulator state
  const [guiDepth, setGuiDepth] = useState(0);
  const [guiClicks, setGuiClicks] = useState(0);
  const [terminalExecuted, setTerminalExecuted] = useState(false);

  const currentStep = STEPS[currentStepIdx];
  const isFinished = completedSteps.length === STEPS.length;

  const handleGuiClick = () => {
    setGuiClicks(prev => prev + 1);
    if (guiDepth < 3) {
      setGuiDepth(prev => prev + 1);
    }
  };

  const handleTerminalClick = () => {
    if (terminalExecuted) return;
    setTerminalExecuted(true);

    if (!completedSteps.includes(currentStep.id)) {
      const updated = [...completedSteps, currentStep.id];
      setCompletedSteps(updated);
      if (onEarnXp) onEarnXp(30);

      if (updated.length === STEPS.length) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const handleNextStep = () => {
    setGuiDepth(0);
    setGuiClicks(0);
    setTerminalExecuted(false);
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleResetStep = () => {
    setGuiDepth(0);
    setGuiClicks(0);
    setTerminalExecuted(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-['Nunito',sans-serif]">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border-4 border-black p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBC05] text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            FUN COMPARISON • 3 EASY STEPS
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase tracking-tight">
            Mouse Clicking vs Tux Typing
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-xl">
            Ever wonder why real computer coders love typing instead of clicking? See the difference side-by-side!
          </p>
        </div>

        {onGoBackToHub && (
          <button
            onClick={onGoBackToHub}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-y-0.5"
          >
            ← Back to Activities
          </button>
        )}
      </div>

      {/* 3 Step Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map((s, idx) => {
          const isDone = completedSteps.includes(s.id);
          const isCurrent = idx === currentStepIdx;

          return (
            <button
              key={s.id}
              onClick={() => {
                setCurrentStepIdx(idx);
                handleResetStep();
              }}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-2xl border-3 border-black text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isCurrent
                  ? 'bg-[#4285F4] text-white shadow-[3px_3px_0px_0px_#000]'
                  : isDone
                  ? 'bg-emerald-100 text-emerald-900 shadow-[2px_2px_0px_0px_#34A853]'
                  : 'bg-white text-slate-700 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" /> : <span>{idx + 1}.</span>}
              <span className="truncate">Step {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Mission Banner */}
      <div className="bg-[#FEF7E0] border-3 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_#FBBC05] flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
            {currentStep.title}
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900">
            🎯 {currentStep.missionDescription}
          </div>
        </div>

        <button
          onClick={handleResetStep}
          title="Try again"
          className="p-2 bg-white rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_#000] hover:bg-slate-50 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Side-by-Side Comparison Arena */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Side: The Mouse GUI Way */}
        <div className="bg-white rounded-3xl border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 border-2 border-black flex items-center justify-center">
                <Mouse className="w-4 h-4 text-slate-700" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase font-['Fredoka',sans-serif]">
                  Way 1: Using Mouse Clicks
                </h3>
                <span className="text-[10px] font-bold text-slate-500">Regular Window Clicking</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-rose-50 border-2 border-rose-300 font-mono text-xs font-black text-rose-700">
              {guiClicks} Clicks
            </div>
          </div>

          {/* Interactive GUI Folder Box */}
          <div className="bg-slate-50 rounded-2xl border-2 border-black p-4 min-h-[160px] flex flex-col justify-center items-center text-center space-y-3">
            {currentStepIdx === 0 && (
              <>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                  <span>/</span>
                  {guiDepth >= 1 && <span>home /</span>}
                  {guiDepth >= 2 && <span>student /</span>}
                  {guiDepth >= 3 && <span>games /</span>}
                </div>

                {guiDepth === 0 && (
                  <button
                    onClick={handleGuiClick}
                    className="p-3 bg-amber-100 hover:bg-amber-200 border-2 border-black rounded-xl text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-y-0.5"
                  >
                    <Folder className="w-5 h-5 text-amber-600 fill-amber-500" />
                    <span>Click 1: Open "home"</span>
                  </button>
                )}

                {guiDepth === 1 && (
                  <button
                    onClick={handleGuiClick}
                    className="p-3 bg-blue-100 hover:bg-blue-200 border-2 border-black rounded-xl text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-y-0.5"
                  >
                    <Folder className="w-5 h-5 text-blue-600 fill-blue-500" />
                    <span>Click 2: Open "student"</span>
                  </button>
                )}

                {guiDepth === 2 && (
                  <button
                    onClick={handleGuiClick}
                    className="p-3 bg-purple-100 hover:bg-purple-200 border-2 border-black rounded-xl text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-y-0.5"
                  >
                    <Folder className="w-5 h-5 text-purple-600 fill-purple-500" />
                    <span>Click 3: Open "games"</span>
                  </button>
                )}

                {guiDepth === 3 && (
                  <div className="p-3 bg-emerald-50 border-2 border-black rounded-xl text-xs font-bold text-emerald-950 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#34A853]" />
                    <span>Finally reached secret.txt! (Took 4 clicks)</span>
                  </div>
                )}
              </>
            )}

            {currentStepIdx === 1 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Right click screen → New Folder → Type "dogs" → Repeat for "cats" and "penguins"!</p>
                <button
                  onClick={handleGuiClick}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  Click to make 1 folder ({guiClicks}/3 made)
                </button>
              </div>
            )}

            {currentStepIdx === 2 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Manually scrolling through 100 lines looking for the word with your eyes...</p>
                <button
                  onClick={handleGuiClick}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  Scroll down page ({guiClicks} scrolls)
                </button>
              </div>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500 text-center">
            Lots of mouse movement, clicking, and waiting!
          </div>
        </div>

        {/* Right Side: The Tux Terminal Way */}
        <div className="bg-black text-white rounded-3xl border-4 border-[#34A853] p-5 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#34A853] border-2 border-white flex items-center justify-center">
                <Terminal className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase font-['Fredoka',sans-serif] text-emerald-400">
                  Way 2: Tux Magic Command
                </h3>
                <span className="text-[10px] font-bold text-slate-400">The Super-Fast Linux Way!</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-[#34A853] text-black font-mono text-xs font-black">
              1 Fast Line!
            </span>
          </div>

          {/* Terminal Command Execution Box */}
          <div className="bg-slate-900 rounded-2xl border-2 border-slate-700 p-4 min-h-[160px] flex flex-col justify-center items-center text-center space-y-3 font-mono">
            <div className="text-xs text-slate-400">
              student@chromebook:~$ <span className="text-[#FBBC05] font-bold">{currentStep.terminalCommand}</span>
            </div>

            {!terminalExecuted ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTerminalClick}
                className="px-4 py-2.5 rounded-xl bg-[#34A853] hover:bg-emerald-400 text-black border-2 border-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#fff] cursor-pointer flex items-center gap-2 animate-bounce"
              >
                <Zap className="w-4 h-4" />
                <span>TAP TO RUN IN 1 SECOND! 🚀</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="p-3 bg-emerald-950/80 border-2 border-[#34A853] rounded-xl text-xs text-emerald-300 space-y-1 w-full"
              >
                <div className="font-bold flex items-center justify-center gap-1 text-[#34A853]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>INSTANT SUCCESS! (0.1 SECONDS)</span>
                </div>
                <div className="text-[11px] text-slate-300">{currentStep.terminalExplanation}</div>
              </motion.div>
            )}
          </div>

          <div className="text-xs font-bold text-emerald-400 text-center">
            {terminalExecuted ? '⚡ Done in a flash!' : '👉 Click the green button to see the magic!'}
          </div>
        </div>
      </div>

      {/* Bottom Step Forward Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleResetStep}
          className="text-xs font-black uppercase text-slate-600 hover:text-black underline"
        >
          Reset this step
        </button>

        {currentStepIdx < STEPS.length - 1 ? (
          <button
            onClick={handleNextStep}
            disabled={!terminalExecuted}
            className={`px-6 py-3 rounded-2xl border-3 border-black text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              terminalExecuted
                ? 'bg-[#FBBC05] text-black shadow-[4px_4px_0px_0px_#000] hover:bg-yellow-300 cursor-pointer animate-pulse'
                : 'bg-slate-200 text-slate-400 border-slate-400 cursor-not-allowed'
            }`}
          >
            <span>NEXT COMPARISON STEP →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onGoBackToHub && onGoBackToHub()}
            className="px-6 py-3 rounded-2xl bg-[#34A853] text-white border-3 border-black text-xs sm:text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] hover:bg-emerald-500 cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>YOU TESTED ALL 3 COMPARISONS! BACK TO HUB 🎉</span>
          </button>
        )}
      </div>
    </div>
  );
};
