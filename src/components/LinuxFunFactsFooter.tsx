import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Award, CheckCircle2, BookOpen, Lightbulb, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LINUX_FACTS, LINUX_QUIZ_QUESTIONS } from '../data/linuxFacts';
import { TuxSvg } from './Mascot';
import { DifficultyLevel } from '../types';

interface LinuxFunFactsFooterProps {
  onEarnBonusXp?: (amount: number) => void;
  difficulty?: DifficultyLevel;
  onChangeDifficulty?: (diff: DifficultyLevel) => void;
}

export const LinuxFunFactsFooter: React.FC<LinuxFunFactsFooterProps> = ({ 
  onEarnBonusXp,
  difficulty = 'beginner',
  onChangeDifficulty
}) => {
  // Start with a random fact index
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * LINUX_FACTS.length));
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Auto-rotate fact interval depending on difficulty
  // Beginner = frequent (~25s), Intermediate = (~45s), Advanced = (~75s)
  useEffect(() => {
    const seconds = difficulty === 'advanced' ? 75 : difficulty === 'intermediate' ? 45 : 25;
    const timer = setInterval(() => {
      setFactIndex(prev => (prev + 1) % LINUX_FACTS.length);
    }, seconds * 1000);
    return () => clearInterval(timer);
  }, [difficulty]);

  const currentFact = LINUX_FACTS[factIndex % LINUX_FACTS.length];
  const currentQuiz = LINUX_QUIZ_QUESTIONS[currentQuestionIdx % LINUX_QUIZ_QUESTIONS.length];

  const handleNextRandomFact = () => {
    let nextIdx: number;
    do {
      nextIdx = Math.floor(Math.random() * LINUX_FACTS.length);
    } while (nextIdx === factIndex && LINUX_FACTS.length > 1);
    setFactIndex(nextIdx);
  };

  const handleSelectQuizAnswer = (idx: number) => {
    if (quizAnswered) return;
    setSelectedOption(idx);
    setQuizAnswered(true);

    if (idx === currentQuiz.correctIndex) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.85 } });
      if (onEarnBonusXp) {
        onEarnBonusXp(25);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setQuizAnswered(false);
    setCurrentQuestionIdx(prev => (prev + 1) % LINUX_QUIZ_QUESTIONS.length);
  };

  return (
    <div className="bg-[#FEF7E0] border-t-2 border-black text-slate-900 font-['Nunito',sans-serif] relative select-none py-2 sm:py-3">
      <div className="w-full max-w-[92vw] sm:max-w-[70vw] lg:max-w-[50vw] mx-auto px-2 sm:px-3">
        {/* Tux Speech Bubble Row */}
        <div className="flex items-start gap-2.5 sm:gap-3">
          {/* Tux Mascot */}
          <div className="flex flex-col items-center shrink-0 cursor-pointer pt-1" onClick={handleNextRandomFact} title="Tap Tux for another fact!">
            <div className="hover:scale-110 active:scale-95 transition-transform duration-200">
              <TuxSvg size={38} mood="happy" />
            </div>
            <span className="text-[9px] font-black uppercase text-slate-700 bg-white px-1.5 py-0.2 rounded-full border border-black mt-0.5 shadow-[1px_1px_0px_0px_#000]">
              Tux
            </span>
          </div>

          {/* Comic Speech Bubble */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border-2 border-black p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_#000] relative">
            {/* Triangle pointer for speech bubble */}
            <div className="hidden sm:block absolute -left-2.5 top-3.5 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-black border-b-6 border-b-transparent" />
            <div className="hidden sm:block absolute -left-1.5 top-3.5 w-0 h-0 border-t-5 border-t-transparent border-r-7 border-r-white border-b-5 border-b-transparent" />

            <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-1.5 mb-1.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{currentFact.funIcon}</span>
                <span className="text-xs font-black font-['Fredoka',sans-serif] uppercase tracking-wider text-[#4285F4]">
                  Tux Fact
                </span>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded hidden sm:inline">
                  {currentFact.source}
                </span>

                {/* Difficulty & Fact Frequency Indicator */}
                <button
                  type="button"
                  onClick={() => {
                    if (onChangeDifficulty) {
                      const nextDiff = difficulty === 'beginner' ? 'intermediate' : difficulty === 'intermediate' ? 'advanced' : 'beginner';
                      onChangeDifficulty(nextDiff);
                    }
                  }}
                  title={`Difficulty Mode: ${difficulty}. Facts rotate every ${difficulty === 'beginner' ? '25s' : difficulty === 'intermediate' ? '45s' : '75s'}. Click to toggle!`}
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border cursor-pointer transition-transform active:scale-95 ${
                    difficulty === 'advanced'
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : difficulty === 'intermediate'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  }`}
                >
                  {difficulty === 'advanced' ? '🔴 Adv (~75s)' : difficulty === 'intermediate' ? '🟡 Mid (~45s)' : '🟢 Easy (~25s)'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleNextRandomFact}
                  className="px-2 py-0.5 rounded-lg bg-[#FBBC05] hover:bg-yellow-300 text-black border border-black font-black text-[10px] uppercase tracking-wider shadow-[1px_1px_0px_0px_#000] active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                  title="Show another fact"
                >
                  <Dices className="w-3 h-3" />
                  <span>Next</span>
                </button>

                <button
                  onClick={() => setIsQuizOpen(!isQuizOpen)}
                  className={`px-2 py-0.5 rounded-lg border border-black font-black text-[10px] uppercase tracking-wider shadow-[1px_1px_0px_0px_#000] active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer ${
                    isQuizOpen ? 'bg-black text-white' : 'bg-white text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#34A853]" />
                  <span>{isQuizOpen ? 'Close' : 'Quiz'}</span>
                </button>
              </div>
            </div>

            {/* Fact Content */}
            <p className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
              "{currentFact.fact}"
            </p>

            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
              <Lightbulb className="w-3.5 h-3.5 text-[#FBBC05] shrink-0 fill-[#FBBC05]" />
              <span className="truncate">{currentFact.kidTakeaway}</span>
            </div>
          </div>
        </div>

        {/* Optional Riddle/Quiz Drawer */}
        <AnimatePresence>
          {isQuizOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className="bg-white rounded-2xl border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-[#EA4335]">
                    <BookOpen className="w-4 h-4" />
                    <span>Tux's Fun Quiz Riddle</span>
                  </div>
                  <span className="text-[10px] font-black bg-[#34A853] text-white px-2 py-0.5 rounded-full border border-black">
                    +25 XP Reward
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-black text-slate-900 font-['Fredoka',sans-serif]">
                  {currentQuiz.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQuiz.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuiz.correctIndex;
                    let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-2 border-black';

                    if (quizAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-[#34A853] text-white border-2 border-black font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-500 text-white border-2 border-black';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizAnswered}
                        onClick={() => handleSelectQuizAnswer(idx)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-slate-50 rounded-xl border-2 border-black flex items-center justify-between flex-wrap gap-2 text-xs font-bold"
                  >
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <span>💡 <strong>Tux says:</strong> {currentQuiz.explanation}</span>
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="px-3 py-1.5 bg-[#4285F4] text-white rounded-lg border-2 border-black font-black uppercase text-[11px] hover:bg-blue-600 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                    >
                      Next Riddle →
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
