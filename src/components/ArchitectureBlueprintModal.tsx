import React, { useState } from 'react';
import { BookOpen, Layers, Code, CheckCircle2, Copy, Check, Terminal, Shield, Sparkles } from 'lucide-react';
import { LEVELS } from '../data/curriculum';

export const ArchitectureBlueprintModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'architecture' | 'snippets' | 'journey'>('curriculum');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copySnippet = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const dashboardSnippet = `// Jumbo-Linux-Kids Dashboard Component (React / Tailwind)
import React from 'react';
import { Sparkles, Flame, Award, Map, Terminal } from 'lucide-react';

export function KidsDashboard({ progress, currentLevel }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      {/* Chrome-inspired Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black font-['Fredoka'] text-slate-900">
          Jumbo<span className="text-[#4285F4]">-</span>Linux<span className="text-[#34A853]">-</span>Kids
        </h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-xl font-bold text-xs">
            🌟 {progress.xp} XP
          </span>
          <span className="px-3 py-1 bg-rose-50 text-rose-800 rounded-xl font-bold text-xs">
            🔥 {progress.streakDays} Day Streak
          </span>
        </div>
      </div>
      {/* Current Level Quest Tracker */}
      <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-200">
        <span className="text-xs font-bold text-blue-700 uppercase">Current Quest</span>
        <h3 className="text-lg font-black text-slate-900">Level {currentLevel}: First Footsteps (pwd & ls)</h3>
      </div>
    </div>
  );
}`;

  const levelMapSnippet = `// Level Selection Map with Locked/Unlocked States
export function LevelCard({ level, isUnlocked, isCompleted, onSelect }) {
  return (
    <div className={\`p-5 rounded-2xl border transition-all \${
      isCompleted 
        ? 'bg-emerald-50/70 border-emerald-300'
        : isUnlocked 
        ? 'bg-white border-blue-200 hover:border-blue-400 ring-2 ring-blue-50 shadow-sm' 
        : 'bg-slate-50 border-slate-200 opacity-60'
    }\`}>
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-slate-400">{level.grade}</span>
        {isCompleted ? (
          <span className="text-xs text-emerald-600 font-black">✓ Completed</span>
        ) : isUnlocked ? (
          <span className="text-xs text-blue-600 font-black">Open</span>
        ) : (
          <span className="text-xs text-slate-400 font-bold">🔒 Locked</span>
        )}
      </div>
      <h4 className="text-base font-black text-slate-900 mt-1">{level.title}</h4>
      <p className="text-xs text-slate-600 mt-1">{level.subtitle}</p>
      {isUnlocked && (
        <button onClick={() => onSelect(level)} className="mt-4 w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Start Challenge
        </button>
      )}
    </div>
  );
}`;

  const terminalChallengeSnippet = `// Real-Time Linux Terminal Challenge Widget
import React, { useState } from 'react';

export function TerminalChallengeWidget({ vfs, onCommandExecuted }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(['Welcome to Chromebook Linux Terminal VM']);

  const handleRun = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Execute command against in-memory Virtual File System (VFS)
    const result = vfs.execute(input);
    setOutput(prev => [...prev, \`$ \${input}\`, result.text]);
    onCommandExecuted(input, result.events);
    setInput('');
  };

  return (
    <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-sm border border-slate-700">
      <div className="h-64 overflow-y-auto space-y-1">
        {output.map((line, i) => <div key={i}>{line}</div>)}
      </div>
      <form onSubmit={handleRun} className="flex gap-2 mt-2 pt-2 border-t border-slate-800">
        <span className="text-emerald-400">jumbo@chromebook:~$</span>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="flex-1 bg-transparent border-none outline-none text-white"
          placeholder="type command (e.g. ls, pwd)..."
        />
      </form>
    </div>
  );
}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider text-amber-200">
          <BookOpen className="w-3.5 h-3.5" />
          Engineering Specification & Curriculum
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-['Fredoka',sans-serif]">
          Jumbo-Linux-Kids Architectural Blueprint
        </h2>
        <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Comprehensive K-12 pedagogical framework, software architecture breakdown, user journey, and sample React/Tailwind code snippets.
        </p>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'curriculum' ? 'bg-white text-slate-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            📚 K–12 Curriculum (Lvl 0–12)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'architecture' ? 'bg-white text-slate-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            🏛️ Architecture Blueprint
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'journey' ? 'bg-white text-slate-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            🚀 User Journey & Pedagogy
          </button>
          <button
            onClick={() => setActiveTab('snippets')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'snippets' ? 'bg-white text-slate-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            💻 Sample Code Snippets
          </button>
        </div>
      </div>

      {/* Tab 1: K-12 Curriculum */}
      {activeTab === 'curriculum' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 font-['Fredoka',sans-serif]">
                Full K–12 Linux Curriculum Outline (Levels 0 through 12)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Structured pedagogical progression from early childhood computing to high-school cybersecurity.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              100% Linux Only
            </span>
          </div>

          <div className="space-y-4">
            {LEVELS.map(lvl => (
              <div key={lvl.levelNumber} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                      {lvl.levelNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Level {lvl.levelNumber}: {lvl.title}
                      </h4>
                      <span className="text-[11px] font-bold text-slate-500">{lvl.subtitle}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-blue-700 self-start sm:self-center">
                    {lvl.grade}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-700">Concepts Taught:</span>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      {lvl.theory.slice(0, 2).map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Hands-on Objectives:</span>
                    <ul className="list-disc list-inside space-y-1 mt-1 text-slate-700 font-medium">
                      {lvl.objectives.map((o, idx) => <li key={idx}>{o.description}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Architecture Blueprint */}
      {activeTab === 'architecture' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 font-['Fredoka',sans-serif]">
            Software Architecture & System Blueprint
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 font-black text-sm uppercase">
                <Layers className="w-4 h-4" />
                <span>1. Virtual File System (VFS) Engine</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                In-memory hierarchical tree representation conforming to Filesystem Hierarchy Standard (FHS): <code className="font-mono bg-blue-100 px-1 rounded">/</code>, <code className="font-mono bg-blue-100 px-1 rounded">/bin</code>, <code className="font-mono bg-blue-100 px-1 rounded">/home/jumbo</code>, <code className="font-mono bg-blue-100 px-1 rounded">/etc</code>, <code className="font-mono bg-blue-100 px-1 rounded">/secret</code>.
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                <li>Deterministic path resolver supporting relative, absolute, <code className="font-mono">~</code>, and <code className="font-mono">..</code></li>
                <li>POSIX-compatible permission simulation (<code className="font-mono">rwx</code>, 755, 644)</li>
                <li>Pipe chaining engine for stdout ➔ stdin (<code className="font-mono">|</code>)</li>
                <li>Output redirection (<code className="font-mono">&gt;</code>) writing to virtual inodes</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-sm uppercase">
                <Terminal className="w-4 h-4" />
                <span>2. Terminal Simulator & Interaction</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Chromebook & web-optimized pseudo-terminal built for low input latency and touch/keyboard accessibility.
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                <li>History navigation via Up/Down arrow buffers</li>
                <li>Tab auto-completion for common binary names & paths</li>
                <li>Ctrl+C cancel and Ctrl+L screen clear hotkeys</li>
                <li>Quick-command block chips for younger K-2 learners</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-black text-sm uppercase">
                <Sparkles className="w-4 h-4" />
                <span>3. Gamification State Engine</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Reactive progression tracker managing unlocked levels, completed missions, XP accumulation, daily streaks, and celebratory micro-animations.
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                <li>Progressive gating: Level N unlocks only upon passing Level N-1</li>
                <li>Confetti particle bursts upon mission objective completion</li>
                <li>Badge allocation system mapped to educational competencies</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
              <div className="flex items-center gap-2 text-purple-800 font-black text-sm uppercase">
                <Shield className="w-4 h-4" />
                <span>4. Mascot Educational Guidance</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Paired mascots (Jumbo the Elephant & Tux the Penguin) provide positive scaffolding, typo recovery suggestions, and story context.
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                <li>Context-sensitive speech bubbles matching active missions</li>
                <li>Friendly recovery suggestions (e.g. typing "sl" spawns train animation)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: User Journey */}
      {activeTab === 'journey' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 font-['Fredoka',sans-serif]">
            K–12 Student User Journey
          </h3>

          <div className="relative pl-6 border-l-2 border-blue-300 space-y-6">
            <div className="space-y-1.5 relative">
              <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
              <h4 className="text-sm font-black text-slate-900">Onboarding & First Shell Command (Level 0)</h4>
              <p className="text-xs text-slate-600">
                The student meets Tux the Penguin and Jumbo the Elephant. They learn what an OS is and type "whoami" to experience the thrill of the command prompt.
              </p>
            </div>

            <div className="space-y-1.5 relative">
              <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">2</div>
              <h4 className="text-sm font-black text-slate-900">Visual Puzzles & Keyboard Agility (Levels 1–2)</h4>
              <p className="text-xs text-slate-600">
                Students sort digital items into /home, /bin, and /etc, then play "Keyboard Rescue" to build finger memory on Chromebook keyboards.
              </p>
            </div>

            <div className="space-y-1.5 relative">
              <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">3</div>
              <h4 className="text-sm font-black text-slate-900">Terminal Navigation & File Crafting (Levels 3–6)</h4>
              <p className="text-xs text-slate-600">
                Middle school students explore directory trees with pwd and cd, build directories with mkdir and touch, and learn chmod permissions.
              </p>
            </div>

            <div className="space-y-1.5 relative">
              <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">4</div>
              <h4 className="text-sm font-black text-slate-900">Text Pipelines & Process Management (Levels 7–10)</h4>
              <p className="text-xs text-slate-600">
                Early high-school students dissect files with cat, head, and tail, search regex with grep, snap pipelines together with "|", and terminate runaway processes.
              </p>
            </div>

            <div className="space-y-1.5 relative">
              <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">5</div>
              <h4 className="text-sm font-black text-slate-900">Bash Automation & Capstone CTF (Levels 11–12)</h4>
              <p className="text-xs text-slate-600">
                Advanced students write bash automation loops, inspect root environments, and capture the hidden flag to earn the Grand Tux CTF Legend badge!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sample Code Snippets */}
      {activeTab === 'snippets' && (
        <div className="space-y-6">
          {/* Snippet 1 */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300">1. Dashboard Component (React / Tailwind)</span>
              <button
                onClick={() => copySnippet(dashboardSnippet, 'dash')}
                className="flex items-center gap-1 text-xs font-mono font-bold text-blue-400 hover:text-blue-300"
              >
                {copiedKey === 'dash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'dash' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto">
              <code>{dashboardSnippet}</code>
            </pre>
          </div>

          {/* Snippet 2 */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300">2. Level Selection Map (Locked/Unlocked States)</span>
              <button
                onClick={() => copySnippet(levelMapSnippet, 'map')}
                className="flex items-center gap-1 text-xs font-mono font-bold text-blue-400 hover:text-blue-300"
              >
                {copiedKey === 'map' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'map' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-blue-300 overflow-x-auto">
              <code>{levelMapSnippet}</code>
            </pre>
          </div>

          {/* Snippet 3 */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300">3. Interactive Terminal Challenge Widget</span>
              <button
                onClick={() => copySnippet(terminalChallengeSnippet, 'term')}
                className="flex items-center gap-1 text-xs font-mono font-bold text-blue-400 hover:text-blue-300"
              >
                {copiedKey === 'term' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'term' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-amber-300 overflow-x-auto">
              <code>{terminalChallengeSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
