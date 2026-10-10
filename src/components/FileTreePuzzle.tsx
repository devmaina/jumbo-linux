import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FolderTree, Folder, FileCode, CheckCircle2, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PuzzleItem {
  id: string;
  name: string;
  type: 'file' | 'tool' | 'config';
  targetFolder: '/home' | '/bin' | '/etc';
  hint: string;
}

const INITIAL_PUZZLE_ITEMS: PuzzleItem[] = [
  { id: '1', name: 'my_story.txt', type: 'file', targetFolder: '/home', hint: 'User stories and drawings belong in /home!' },
  { id: '2', name: 'ls (command tool)', type: 'tool', targetFolder: '/bin', hint: 'Binary executable programs live in /bin!' },
  { id: '3', name: 'wifi_settings.conf', type: 'config', targetFolder: '/etc', hint: 'System-wide configurations stay in /etc!' },
  { id: '4', name: 'game_save.dat', type: 'file', targetFolder: '/home', hint: 'Personal games and save files stay in /home!' },
  { id: '5', name: 'cat (file reader tool)', type: 'tool', targetFolder: '/bin', hint: 'Command line utilities live in /bin!' },
  { id: '6', name: 'hostname.conf', type: 'config', targetFolder: '/etc', hint: 'Machine identity config is saved in /etc!' }
];

interface FileTreePuzzleProps {
  onPuzzleSolved: () => void;
}

export const FileTreePuzzle: React.FC<FileTreePuzzleProps> = ({ onPuzzleSolved }) => {
  const [unplaced, setUnplaced] = useState<PuzzleItem[]>(INITIAL_PUZZLE_ITEMS);
  const [folders, setFolders] = useState<{
    '/home': PuzzleItem[];
    '/bin': PuzzleItem[];
    '/etc': PuzzleItem[];
  }>({
    '/home': [],
    '/bin': [],
    '/etc': []
  });
  const [selectedItem, setSelectedItem] = useState<PuzzleItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const handlePlaceItem = (folderKey: '/home' | '/bin' | '/etc') => {
    if (!selectedItem) {
      setFeedback('Select an item from the unsorted basket first!');
      return;
    }

    if (selectedItem.targetFolder === folderKey) {
      // Correct!
      const newUnplaced = unplaced.filter(i => i.id !== selectedItem.id);
      const newFolderItems = [...folders[folderKey], selectedItem];
      const newFolders = { ...folders, [folderKey]: newFolderItems };

      setUnplaced(newUnplaced);
      setFolders(newFolders);
      setSelectedItem(null);
      setFeedback(`🌟 Spot on! ${selectedItem.name} belongs in ${folderKey}!`);

      if (newUnplaced.length === 0) {
        setIsSolved(true);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onPuzzleSolved();
      }
    } else {
      // Incorrect, give gentle encouraging hint
      setFeedback(`Not quite! Hint: ${selectedItem.hint}`);
    }
  };

  const handleReset = () => {
    setUnplaced(INITIAL_PUZZLE_ITEMS);
    setFolders({ '/home': [], '/bin': [], '/etc': [] });
    setSelectedItem(null);
    setFeedback(null);
    setIsSolved(false);
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4285F4] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000]">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg font-['Fredoka',sans-serif] uppercase tracking-tight">
              TREEHOUSE FOLDER SORTING PUZZLE
            </h3>
            <p className="text-xs text-slate-600 font-bold">
              Click an item from the basket, then click the matching folder branch!
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          RESET PUZZLE
        </button>
      </div>

      {feedback && (
        <div className={`p-3.5 rounded-2xl text-xs font-black uppercase tracking-wide border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-2 ${
          feedback.startsWith('🌟') ? 'bg-[#E6F4EA] text-emerald-950' : 'bg-[#FEF7E0] text-amber-950'
        }`}>
          <span>{feedback}</span>
        </div>
      )}

      {/* Unsorted Items Basket */}
      <div className="p-5 bg-slate-100 rounded-2xl border-3 border-black">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
            1. UNSORTED FILES BASKET ({unplaced.length} LEFT)
          </span>
          {selectedItem && (
            <span className="text-xs font-black text-[#4285F4] uppercase bg-blue-50 border border-black px-2 py-0.5 rounded-lg">
              SELECTED: {selectedItem.name}
            </span>
          )}
        </div>

        {unplaced.length === 0 ? (
          <div className="p-4 bg-[#E6F4EA] rounded-xl border-2 border-black text-center text-xs font-black uppercase text-emerald-950 flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#34A853]">
            <CheckCircle2 className="w-5 h-5 text-[#34A853]" />
            ALL ITEMS ORGANIZED INTO THE CORRECT LINUX FOLDERS!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {unplaced.map(item => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setFeedback(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-black uppercase transition-all flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 ${
                    isSelected
                      ? 'bg-[#4285F4] text-white scale-105'
                      : 'bg-white hover:bg-amber-100 text-slate-900'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Folders Target Slots */}
      <div>
        <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
          2. CLICK TARGET FOLDER TO PLACE
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* /home */}
          <div
            onClick={() => handlePlaceItem('/home')}
            className={`p-5 rounded-2xl border-3 border-black transition-all cursor-pointer min-h-[150px] flex flex-col justify-between ${
              selectedItem
                ? 'bg-white shadow-[4px_4px_0px_0px_#4285F4] hover:translate-x-0.5 hover:translate-y-0.5'
                : 'bg-slate-50 shadow-[4px_4px_0px_0px_#000]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-[#4285F4] font-black text-sm uppercase mb-1">
                <Folder className="w-5 h-5 fill-[#4285F4]" />
                <span>/home (USER SPACES)</span>
              </div>
              <p className="text-xs text-slate-600 font-bold">
                Personal files, documents, student projects.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {folders['/home'].map(item => (
                <span key={item.id} className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 border border-black text-blue-950 font-mono font-black text-xs shadow-[1px_1px_0px_0px_#000]">
                  ✓ {item.name}
                </span>
              ))}
            </div>
          </div>

          {/* /bin */}
          <div
            onClick={() => handlePlaceItem('/bin')}
            className={`p-5 rounded-2xl border-3 border-black transition-all cursor-pointer min-h-[150px] flex flex-col justify-between ${
              selectedItem
                ? 'bg-white shadow-[4px_4px_0px_0px_#34A853] hover:translate-x-0.5 hover:translate-y-0.5'
                : 'bg-slate-50 shadow-[4px_4px_0px_0px_#000]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-[#34A853] font-black text-sm uppercase mb-1">
                <Folder className="w-5 h-5 fill-[#34A853]" />
                <span>/bin (COMMAND BINARIES)</span>
              </div>
              <p className="text-xs text-slate-600 font-bold">
                Essential programs and executable tools (ls, cat, bash).
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {folders['/bin'].map(item => (
                <span key={item.id} className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 border border-black text-emerald-950 font-mono font-black text-xs shadow-[1px_1px_0px_0px_#000]">
                  ✓ {item.name}
                </span>
              ))}
            </div>
          </div>

          {/* /etc */}
          <div
            onClick={() => handlePlaceItem('/etc')}
            className={`p-5 rounded-2xl border-3 border-black transition-all cursor-pointer min-h-[150px] flex flex-col justify-between ${
              selectedItem
                ? 'bg-white shadow-[4px_4px_0px_0px_#FBBC05] hover:translate-x-0.5 hover:translate-y-0.5'
                : 'bg-slate-50 shadow-[4px_4px_0px_0px_#000]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-amber-700 font-black text-sm uppercase mb-1">
                <Folder className="w-5 h-5 fill-[#FBBC05]" />
                <span>/etc (CONFIGURATIONS)</span>
              </div>
              <p className="text-xs text-slate-600 font-bold">
                System configuration files and environment setups.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {folders['/etc'].map(item => (
                <span key={item.id} className="inline-block px-2.5 py-1 rounded-lg bg-amber-100 border border-black text-amber-950 font-mono font-black text-xs shadow-[1px_1px_0px_0px_#000]">
                  ✓ {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
