import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Sparkles, CheckCircle2, ArrowRight, RotateCcw, Award, Lightbulb, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TuxSvg, JumboSvg } from './Mascot';

interface KeyboardLessonProps {
  onCompleteLesson: (xp: number) => void;
  onGoToMissions?: () => void;
  onGoBackToHub?: () => void;
}

interface KeyStep {
  id: number;
  keyName: string;
  symbol: string;
  badgeTitle: string;
  kidRole: string;
  explanation: string;
  actionPrompt: string;
  testKey: string; // key identifier to detect on physical keydown or click
  sampleTyped: string;
  expectedResult: string;
}

const KEY_STEPS: KeyStep[] = [
  {
    id: 1,
    keyName: 'ENTER',
    symbol: '↵ Enter',
    badgeTitle: 'GO BUTTON',
    kidRole: 'Launch 🚀',
    explanation: 'When you type a word in Linux, press Enter when you want the computer to GO!',
    actionPrompt: 'Press ENTER on keyboard or tap button below!',
    testKey: 'Enter',
    sampleTyped: 'whoami',
    expectedResult: 'jumbo-explorer'
  },
  {
    id: 2,
    keyName: 'SPACE BAR',
    symbol: '␣ Space',
    badgeTitle: 'SPACE',
    kidRole: 'Spacer 🪐',
    explanation: 'Leaves a gap between words, just like writing in a book!',
    actionPrompt: 'Press SPACE BAR below!',
    testKey: ' ',
    sampleTyped: 'ls',
    expectedResult: 'ls /home'
  },
  {
    id: 3,
    keyName: 'TAB KEY',
    symbol: '⇥ Tab',
    badgeTitle: 'MAGIC WAND',
    kidRole: 'Auto-Finish 🪄',
    explanation: 'Type the first letters and press Tab — the computer finishes the word for you!',
    actionPrompt: 'Press TAB to finish the word "animals"!',
    testKey: 'Tab',
    sampleTyped: 'cat ani',
    expectedResult: 'cat animals.txt'
  },
  {
    id: 4,
    keyName: 'UP ARROW',
    symbol: '↑ Up',
    badgeTitle: 'TIME TRAVEL',
    kidRole: 'Memory ⏳',
    explanation: 'Brings back the last word you typed so you do not have to type it again!',
    actionPrompt: 'Press UP ARROW!',
    testKey: 'ArrowUp',
    sampleTyped: '',
    expectedResult: 'pwd'
  },
  {
    id: 5,
    keyName: 'CTRL + C',
    symbol: '🛑 Stop',
    badgeTitle: 'BRAKE',
    kidRole: 'Stop 🛑',
    explanation: 'Tells the computer to STOP right away if anything gets stuck!',
    actionPrompt: 'Press CTRL + C or tap STOP!',
    testKey: 'ControlC',
    sampleTyped: 'dancing_penguins.sh',
    expectedResult: '^C [Stopped!]'
  }
];

export const KeyboardLesson: React.FC<KeyboardLessonProps> = ({
  onCompleteLesson,
  onGoToMissions,
  onGoBackToHub
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [typedBuffer, setTypedBuffer] = useState('');
  const [isLessonFinished, setIsLessonFinished] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState(false);

  const activeStep = KEY_STEPS[currentStepIdx];

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+C
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        handleTriggerKey('ControlC');
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        handleTriggerKey('Tab');
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleTriggerKey('ArrowUp');
        return;
      }

      if (e.key === 'Enter') {
        handleTriggerKey('Enter');
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        handleTriggerKey(' ');
        return;
      }

      setLastKeyPressed(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIdx, completedSteps]);

  const handleTriggerKey = (keyIdentifier: string) => {
    setLastKeyPressed(keyIdentifier);
    setFeedbackEffect(true);
    setTimeout(() => setFeedbackEffect(false), 400);

    if (keyIdentifier === activeStep.testKey) {
      // Correct key pressed for current step!
      setTypedBuffer(activeStep.expectedResult);
      if (!completedSteps.includes(activeStep.id)) {
        const nextCompleted = [...completedSteps, activeStep.id];
        setCompletedSteps(nextCompleted);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

        if (nextCompleted.length === KEY_STEPS.length) {
          setIsLessonFinished(true);
          onCompleteLesson(100);
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        }
      }
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < KEY_STEPS.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setTypedBuffer('');
      setLastKeyPressed(null);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
      setTypedBuffer('');
      setLastKeyPressed(null);
    }
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setCompletedSteps([]);
    setTypedBuffer('');
    setIsLessonFinished(false);
    setLastKeyPressed(null);
  };

  const isCurrentStepDone = completedSteps.includes(activeStep.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4 font-['Nunito',sans-serif]">
      {onGoBackToHub && (
        <div>
          <button
            onClick={onGoBackToHub}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 border-3 border-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] cursor-pointer active:translate-y-0.5 transition-all"
          >
            ← Tasks
          </button>
        </div>
      )}

      {/* Top Banner (Compact for Mobile) */}
      <div className="bg-[#FBBC05] text-black rounded-3xl border-4 border-black p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Keyboard className="w-3.5 h-3.5 text-[#4285F4]" />
            TASK 0
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] uppercase tracking-tight leading-none">
            5 MAGIC KEYS
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-800">
            Meet the 5 magic keys you need for your computer!
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <TuxSvg size={48} mood="celebrating" />
          <JumboSvg size={48} mood="happy" />
        </div>
      </div>

      {/* Step Progress Tracker Bar */}
      <div className="flex items-center justify-between gap-1.5 bg-white p-2 sm:p-3 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_#000]">
        {KEY_STEPS.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const isCurrent = idx === currentStepIdx;
          return (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStepIdx(idx);
                setTypedBuffer('');
              }}
              className={`flex-1 py-2 px-1 sm:px-2 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                isCurrent
                  ? 'bg-[#4285F4] text-white shadow-[2px_2px_0px_0px_#000] scale-102'
                  : isDone
                  ? 'bg-[#34A853] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <span className="shrink-0">{step.id}</span>
              )}
              <span className="hidden md:inline truncate">{step.keyName.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Single-Viewport Lesson Card */}
      <div className="bg-white rounded-3xl border-4 border-black p-5 sm:p-7 shadow-[8px_8px_0px_0px_#000] space-y-5">
        {/* Header of Active Key */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-3 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4285F4] text-white border-3 border-black flex items-center justify-center font-mono font-black text-lg shadow-[3px_3px_0px_0px_#000] shrink-0">
              {activeStep.id}
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#EA4335]">
                MAGIC KEY #{activeStep.id} OF 5: {activeStep.kidRole}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase">
                {activeStep.keyName}
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF7E0] border-2 border-black text-xs font-black uppercase text-amber-950 shadow-[2px_2px_0px_0px_#FBBC05]">
            <Sparkles className="w-4 h-4 text-[#FBBC05] fill-[#FBBC05]" />
            <span>{activeStep.badgeTitle}</span>
          </div>
        </div>

        {/* Friendly Kid Explanation */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border-3 border-black flex items-start gap-3 shadow-[3px_3px_0px_0px_#FBBC05]">
          <span className="text-2xl shrink-0">💡</span>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
              {activeStep.explanation}
            </p>
            <p className="text-xs font-black text-[#4285F4] uppercase tracking-wide">
              👉 {activeStep.actionPrompt}
            </p>
          </div>
        </div>

        {/* Live Interactive Practice Screen */}
        <div className="bg-black text-white rounded-2xl border-3 border-black p-4 space-y-3 font-mono shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EA4335]" />
              <span className="w-3 h-3 rounded-full bg-[#FBBC05]" />
              <span className="w-3 h-3 rounded-full bg-[#34A853]" />
              <span className="font-bold text-slate-300 ml-1">student@chromebook:~</span>
            </div>
            <span className="text-[10px] text-[#FBBC05] uppercase">Interactive Stage</span>
          </div>

          <div className="min-h-[64px] flex flex-col justify-center text-sm sm:text-base space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[#34A853] font-black">$</span>
              <span className="text-slate-300">{activeStep.sampleTyped}</span>
              {!isCurrentStepDone && (
                <span className="w-2.5 h-5 bg-[#FBBC05] animate-pulse" />
              )}
            </div>
            {isCurrentStepDone && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[#FBBC05] font-black pl-4 flex items-center gap-2 text-xs sm:text-sm"
              >
                <span>🚀 Result: {activeStep.expectedResult}</span>
                <span className="text-[#34A853]">✓ PERFECT!</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Big On-Screen Interactive Keyboards to Tap on Mobile or PC */}
        <div className="space-y-2">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Tap the Magic Key Below:</span>
            {lastKeyPressed && (
              <span className="text-[11px] font-mono text-[#4285F4] bg-blue-50 px-2 py-0.5 rounded border border-black">
                Detected: {lastKeyPressed}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {KEY_STEPS.map((step) => {
              const isStepTarget = step.id === activeStep.id;
              const isTargetActive = isStepTarget && feedbackEffect;
              return (
                <button
                  key={step.id}
                  onClick={() => handleTriggerKey(step.testKey)}
                  className={`p-3 sm:p-4 rounded-2xl border-3 border-black font-black uppercase text-center transition-all flex flex-col items-center justify-center gap-1 select-none ${
                    isStepTarget
                      ? 'bg-[#4285F4] text-white shadow-[4px_4px_0px_0px_#000] scale-105 ring-4 ring-yellow-400 animate-pulse'
                      : 'bg-white hover:bg-slate-100 text-slate-900 shadow-[2px_2px_0px_0px_#000]'
                  } ${isTargetActive ? 'translate-y-1 shadow-none bg-emerald-500 text-white' : ''}`}
                >
                  <span className="text-base sm:text-lg font-mono">{step.symbol}</span>
                  <span className="text-[10px] sm:text-xs tracking-tight">{step.keyName.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Bouncy Next Button / Success State */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIdx === 0}
            className={`px-4 py-2.5 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all ${
              currentStepIdx === 0
                ? 'opacity-30 cursor-not-allowed bg-slate-100'
                : 'bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            ← PREVIOUS KEY
          </button>

          {/* Big Popping Next Button */}
          {isCurrentStepDone ? (
            currentStepIdx < KEY_STEPS.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleNextStep}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#FBBC05] text-black border-3 border-black font-black uppercase text-sm sm:text-base tracking-wider shadow-[4px_4px_0px_0px_#000] hover:bg-yellow-300 flex items-center justify-center gap-2 cursor-pointer animate-bounce"
              >
                <span>AWESOME! NEXT KEY POWER →</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (onGoToMissions) {
                    onGoToMissions();
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#34A853] text-white border-4 border-black font-black uppercase text-sm sm:text-base tracking-wider shadow-[5px_5px_0px_0px_#000] hover:bg-emerald-500 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                <Award className="w-6 h-6 text-[#FBBC05]" />
                <span>ALL KEYS MASTERED! GO TO LEVEL MISSIONS 🚀</span>
              </motion.button>
            )
          ) : (
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center sm:text-right py-2">
              Waiting for key press...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
