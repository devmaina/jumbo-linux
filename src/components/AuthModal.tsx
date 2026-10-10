import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserPlus, Check, Sparkles, X, Shield, Award, LogIn } from 'lucide-react';
import { CadetProfile, UserProgress } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: CadetProfile[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string, avatar: string, grade: string) => void;
}

const AVATAR_OPTIONS = ['🐘', '🐧', '🚀', '🦊', '🦁', '🐼', '🦄', '🤖', '⭐', '⚡'];
const GRADE_OPTIONS = [
  'Kindergarten - 1st Grade',
  '2nd - 3rd Grade',
  '4th - 5th Grade',
  'Middle School (6th - 8th)',
  'High School (9th - 12th)'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('🐘');
  const [newGrade, setNewGrade] = useState(GRADE_OPTIONS[1]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setErrorMsg('Please give your cadet a cool name!');
      return;
    }
    onCreateProfile(newName.trim(), newAvatar, newGrade);
    setNewName('');
    setIsCreating(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-['Nunito',sans-serif]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl bg-white border-2 border-black hover:bg-slate-100 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-slate-700"
          title="Close Cadet Login"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBC05] text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Shield className="w-3.5 h-3.5" />
            STUDENT CADET PASS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Fredoka',sans-serif] uppercase tracking-tight">
            {isCreating ? 'CREATE NEW CADET' : 'WHO IS EXPLORING TODAY?'}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Switch between students or create your own profile to save your XP and badges!
          </p>
        </div>

        {/* Mode Selector Tab */}
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border-2 border-black">
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              !isCreating
                ? 'bg-[#4285F4] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            <span>SWITCH CADET ({profiles.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isCreating
                ? 'bg-[#34A853] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>+ NEW STUDENT</span>
          </button>
        </div>

        {/* View 1: Cadet Profiles List */}
        {!isCreating ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2.5">
              {profiles.map((profile) => {
                const isActive = profile.id === activeProfileId;
                return (
                  <button
                    key={profile.id}
                    onClick={() => {
                      onSelectProfile(profile.id);
                      onClose();
                    }}
                    className={`w-full p-4 rounded-2xl border-3 border-black text-left transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-[#E6F4EA] shadow-[4px_4px_0px_0px_#34A853] ring-2 ring-emerald-500'
                        : 'bg-white hover:bg-amber-50 shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border-2 border-black flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000] shrink-0">
                        {profile.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900 font-['Fredoka',sans-serif] uppercase">
                            {profile.name}
                          </h4>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-md bg-[#34A853] text-white text-[10px] font-black uppercase">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-bold">
                          {profile.grade}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-[#FBBC05] bg-black px-2.5 py-1 rounded-lg border border-black font-mono">
                        {profile.progress.xp} XP
                      </div>
                      <div className="text-[11px] font-bold text-slate-500 mt-1">
                        LVL {profile.progress.currentLevel}/12
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="text-xs font-black uppercase text-[#4285F4] hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add another student cadet to this Chromebook
              </button>
            </div>
          </div>
        ) : (
          /* View 2: Create Cadet Form */
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-black uppercase">
                {errorMsg}
              </div>
            )}

            {/* Avatar Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Choose Your Cadet Mascot Avatar:
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setNewAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 border-black transition-all ${
                      newAvatar === av
                        ? 'bg-[#FBBC05] scale-110 shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-white hover:bg-slate-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Cadet Nickname:
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Captain Maya, Pixel Leo, Code Cadet"
                maxLength={24}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-3 border-black text-slate-900 font-black text-sm focus:bg-white outline-none shadow-[3px_3px_0px_0px_#000]"
              />
            </div>

            {/* Grade Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                School Grade Level:
              </label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border-3 border-black text-slate-900 font-bold text-sm outline-none shadow-[3px_3px_0px_0px_#000] cursor-pointer"
              >
                {GRADE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#34A853] hover:bg-emerald-600 text-white font-black uppercase tracking-wider text-sm border-3 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              <span>SAVE & START EXPLORING!</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
