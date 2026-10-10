import React, { useState } from 'react';
import { Blocks, Play, RotateCcw, Plus, Check } from 'lucide-react';

interface CommandBuilderProps {
  availableBlocks: string[];
  targetDescription: string;
  onRunAssembledCommand: (assembledCommand: string) => void;
}

export const CommandBuilder: React.FC<CommandBuilderProps> = ({
  availableBlocks,
  targetDescription,
  onRunAssembledCommand
}) => {
  const [assembledTokens, setAssembledTokens] = useState<string[]>([]);

  const addToken = (token: string) => {
    setAssembledTokens(prev => [...prev, token]);
  };

  const removeToken = (index: number) => {
    setAssembledTokens(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setAssembledTokens([]);
  };

  const assembledString = assembledTokens.join(' ');

  return (
    <div className="bg-white rounded-3xl border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FBBC05] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]">
            <Blocks className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              VISUAL COMMAND BUILDER (NO-TYPO BRICKS)
            </h4>
            <p className="text-[11px] text-slate-600 font-bold">
              Click command blocks to assemble commands like digital Lego!
            </p>
          </div>
        </div>

        {assembledTokens.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-black uppercase text-slate-700 hover:text-red-600 border-2 border-black px-2.5 py-1 rounded-xl bg-white shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <RotateCcw className="w-3 h-3" />
            CLEAR
          </button>
        )}
      </div>

      {/* Assembly Work Area */}
      <div className="min-h-[56px] p-3 bg-slate-100 rounded-2xl border-3 border-dashed border-black flex items-center flex-wrap gap-2 shadow-inner">
        {assembledTokens.length === 0 ? (
          <span className="text-xs text-slate-500 font-mono font-bold italic px-2">
            Click available blocks below to assemble your pipeline...
          </span>
        ) : (
          assembledTokens.map((tok, idx) => (
            <button
              key={idx}
              onClick={() => removeToken(idx)}
              title="Click to remove block"
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_#000] border-2 border-black transition-all flex items-center gap-1.5 active:translate-y-0.5 ${
                tok === '|'
                  ? 'bg-purple-600 text-white'
                  : tok.startsWith('-')
                  ? 'bg-[#FBBC05] text-black'
                  : 'bg-[#4285F4] text-white hover:bg-red-500'
              }`}
            >
              <span>{tok}</span>
              <span className="text-[10px] font-black opacity-75">✕</span>
            </button>
          ))
        )}
      </div>

      {/* Available Blocks Pool */}
      <div className="space-y-2">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
          AVAILABLE COMMAND BRICKS:
        </span>
        <div className="flex flex-wrap gap-2">
          {availableBlocks.map((block, i) => (
            <button
              key={i}
              onClick={() => addToken(block)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 border-2 border-black text-slate-900 font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5 active:translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#4285F4] stroke-[3]" />
              <span>{block}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Execute Button */}
      {assembledTokens.length > 0 && (
        <div className="flex items-center justify-between pt-2 border-t-2 border-slate-200 flex-wrap gap-2">
          <div className="text-xs font-mono text-slate-700 font-bold truncate max-w-[280px]">
            PREVIEW: <span className="text-[#4285F4] font-black bg-blue-50 border border-black px-2 py-0.5 rounded-md">{assembledString}</span>
          </div>
          <button
            onClick={() => onRunAssembledCommand(assembledString)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#34A853] hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            SEND TO TERMINAL
          </button>
        </div>
      )}
    </div>
  );
};
