import React from 'react';
import { motion } from 'motion/react';

interface MascotProps {
  type: 'jumbo' | 'tux' | 'both';
  mood?: 'happy' | 'thinking' | 'celebrating' | 'explaining';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const JumboSvg: React.FC<{ size?: number; mood?: string }> = ({ size = 64, mood = 'happy' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
      {/* Elephant Ears */}
      <circle cx="28" cy="46" r="22" fill="#93C5FD" stroke="#3B82F6" strokeWidth="3" />
      <circle cx="28" cy="46" r="14" fill="#BFDBFE" />
      <circle cx="72" cy="46" r="22" fill="#93C5FD" stroke="#3B82F6" strokeWidth="3" />
      <circle cx="72" cy="46" r="14" fill="#BFDBFE" />

      {/* Head */}
      <ellipse cx="50" cy="52" rx="28" ry="26" fill="#60A5FA" stroke="#2563EB" strokeWidth="3" />

      {/* Tech Headband / Visor (Chrome style) */}
      <path d="M 32 36 Q 50 30 68 36" stroke="#FBBC05" strokeWidth="6" strokeLinecap="round" />
      <rect x="44" y="27" width="12" height="7" rx="3.5" fill="#EA4335" />
      <circle cx="50" cy="30.5" r="2" fill="#FFFFFF" />

      {/* Eyes */}
      <ellipse cx="40" cy="48" rx="4" ry="5.5" fill="#1E293B" />
      <circle cx="38.5" cy="46.5" r="1.5" fill="#FFFFFF" />
      <ellipse cx="60" cy="48" rx="4" ry="5.5" fill="#1E293B" />
      <circle cx="58.5" cy="46.5" r="1.5" fill="#FFFFFF" />

      {/* Cheeks */}
      <ellipse cx="33" cy="56" rx="3.5" ry="2" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="67" cy="56" rx="3.5" ry="2" fill="#F43F5E" opacity="0.6" />

      {/* Trunk */}
      {mood === 'celebrating' ? (
        <path d="M 50 56 Q 50 72 62 66 Q 66 62 60 58" stroke="#3B82F6" strokeWidth="7" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M 50 56 Q 50 76 56 74 Q 60 72 58 66" stroke="#3B82F6" strokeWidth="7" strokeLinecap="round" fill="none" />
      )}

      {/* Little Tusks */}
      <path d="M 44 60 Q 42 66 38 64" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 56 60 Q 58 66 62 64" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
};

export const TuxSvg: React.FC<{ size?: number; mood?: string }> = ({ size = 64, mood = 'happy' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
      {/* Tux Penguin Body */}
      <ellipse cx="50" cy="56" rx="28" ry="32" fill="#1E293B" />

      {/* Flippers */}
      <ellipse cx="20" cy="60" rx="9" ry="18" fill="#0F172A" transform="rotate(15 20 60)" />
      <ellipse cx="80" cy="60" rx="9" ry="18" fill="#0F172A" transform="rotate(-15 80 60)" />

      {/* Big White Belly */}
      <ellipse cx="50" cy="60" rx="20" ry="24" fill="#FFFFFF" />

      {/* Feet */}
      <ellipse cx="38" cy="88" rx="10" ry="5" fill="#F59E0B" />
      <ellipse cx="62" cy="88" rx="10" ry="5" fill="#F59E0B" />

      {/* Eyes */}
      <circle cx="41" cy="38" r="6" fill="#FFFFFF" />
      <circle cx="42" cy="38" r="3" fill="#0F172A" />
      <circle cx="43" cy="36.5" r="1" fill="#FFFFFF" />

      <circle cx="59" cy="38" r="6" fill="#FFFFFF" />
      <circle cx="58" cy="38" r="3" fill="#0F172A" />
      <circle cx="59" cy="36.5" r="1" fill="#FFFFFF" />

      {/* Yellow Beak */}
      <path d="M 44 44 Q 50 49 56 44 Q 50 54 44 44 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />

      {/* Friendly Bandana (Google Green) */}
      <path d="M 32 48 Q 50 54 68 48 Q 50 62 32 48 Z" fill="#34A853" />
      <circle cx="50" cy="54" r="2.5" fill="#FFFFFF" />
    </svg>
  );
};

export const Mascot: React.FC<MascotProps> = ({
  type = 'jumbo',
  mood = 'happy',
  message,
  size = 'md',
  className = ''
}) => {
  const pixelSize = size === 'sm' ? 44 : size === 'md' ? 64 : 88;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.06, rotate: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
        className="relative shrink-0"
      >
        {type === 'jumbo' && <JumboSvg size={pixelSize} mood={mood} />}
        {type === 'tux' && <TuxSvg size={pixelSize} mood={mood} />}
        {type === 'both' && (
          <div className="flex -space-x-4">
            <JumboSvg size={pixelSize * 0.9} mood={mood} />
            <TuxSvg size={pixelSize * 0.85} mood={mood} />
          </div>
        )}
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white border-3 border-black rounded-2xl px-4 py-3 shadow-[4px_4px_0px_0px_#000] text-sm text-slate-900 font-bold max-w-sm"
        >
          {/* Speech Bubble Arrow */}
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-black" />
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-white" />
          <div className="flex items-start gap-1.5">
            <span className="font-black uppercase tracking-wider text-[#4285F4] shrink-0 font-['Fredoka',sans-serif]">
              {type === 'tux' ? '🐧 TUX:' : type === 'jumbo' ? '🐘 JUMBO:' : '✨ GUIDES:'}
            </span>
            <span className="leading-snug text-slate-800 font-bold">{message}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
