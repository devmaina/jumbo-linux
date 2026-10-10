/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, X, Share2, Plus, ExternalLink, Tv, Check, Sparkles } from 'lucide-react';

export interface VideoLesson {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
  tag: string;
  description: string;
  isCustom?: boolean;
}

const DEFAULT_VIDEOS: VideoLesson[] = [
  {
    id: 'vid_1',
    youtubeId: 'rrB13utjYV4', // Kid-friendly Linux explanation
    title: 'Jumbo Linux 1: Getting Started & Your First Shell Commands',
    duration: '4:20',
    tag: 'Lesson 1',
    description: 'Our official video guide teaching children what Jumbo Linux is, why the terminal is exciting, and how to type your first commands.'
  },
  {
    id: 'vid_2',
    youtubeId: 'yVpbFMhOAwE', // Linux terminal commands
    title: 'Jumbo Linux 2: Navigating Secret Folders & Files (pwd, ls, cd)',
    duration: '6:15',
    tag: 'Lesson 2',
    description: 'Our guide teaching children how to explore directory paths, reveal hidden files, and navigate through Jumbo Linux like a pro.'
  },
  {
    id: 'vid_3',
    youtubeId: 'bL34ZpB-iJ8', // Fun Linux commands
    title: 'Jumbo Linux 3: Cool Terminal Spells & Animals (cowsay, sl, cmatrix)',
    duration: '5:45',
    tag: 'Lesson 3',
    description: 'Learn how to run silly animations, talking animals, and matrix rain inside your Jumbo Linux terminal!'
  },
  {
    id: 'vid_4',
    youtubeId: 'ROjZy1WbCIA', // Linux in space
    title: 'Jumbo Linux 4: Superpowers & File Permissions (touch, cat, chmod)',
    duration: '3:50',
    tag: 'Lesson 4',
    description: 'Our tutorial on creating files, unlocking permissions, and discovering how NASA astronauts and Linux penguins protect their code.'
  },
  {
    id: 'vid_5',
    youtubeId: '6U1q9F_Fv8w', // Process & pipelines
    title: 'Jumbo Linux 5: Pipelines & Process Zapping (| pipe, ps, kill)',
    duration: '5:10',
    tag: 'Lesson 5',
    description: 'Master pipe conductors (|), process management (ps, kill), and terminal speed typing duels in Jumbo Linux.'
  },
  {
    id: 'vid_6',
    youtubeId: 'WmsTeBhnvvg', // Terminal tips & tricks
    title: 'Jumbo Linux 6: Terminal Speed Mastery & Pro Bash Secrets',
    duration: '4:45',
    tag: 'Lesson 6',
    description: 'Keyboard shortcuts, Tab auto-completion, history navigation, and speed tricks for young Jumbo Linux coders.'
  }
];

const STORAGE_KEY = 'jumbo_linux_shared_videos_v2';

export const FloatingVideoModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [videos, setVideos] = useState<VideoLesson[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_VIDEOS;
  });

  const [selectedVideo, setSelectedVideo] = useState<VideoLesson>(videos[0] || DEFAULT_VIDEOS[0]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [addError, setAddError] = useState('');

  // Listen for open events triggered from anywhere in the app (e.g. Learn drop list or terminal)
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail === 'string') {
        const matching = videos.find(v => v.id === customEvent.detail || v.youtubeId === customEvent.detail);
        if (matching) setSelectedVideo(matching);
      }
      setIsOpen(true);
    };
    window.addEventListener('open-jumbo-videos', handleOpen);
    return () => window.removeEventListener('open-jumbo-videos', handleOpen);
  }, [videos]);

  // Save custom videos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    } catch {
      // ignore
    }
  }, [videos]);

  // Extract YouTube ID from standard formats
  const extractYouTubeId = (urlOrId: string): string | null => {
    const trimmed = urlOrId.trim();
    if (!trimmed) return null;
    
    // Direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    // youtu.be/<id>
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    // youtube.com/watch?v=<id>
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    // youtube.com/embed/<id>
    const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    return null;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    const ytId = extractYouTubeId(newVideoUrl);
    if (!ytId) {
      setAddError('Please enter a valid YouTube URL or 11-character video ID.');
      return;
    }

    const title = newVideoTitle.trim() || `Shared YouTube Lesson (${videos.length + 1})`;
    const newVid: VideoLesson = {
      id: `vid_custom_${Date.now()}`,
      youtubeId: ytId,
      title,
      duration: 'Lesson',
      tag: 'Class Share',
      description: 'Shared video tutorial for Linux learners.',
      isCustom: true
    };

    const updated = [newVid, ...videos];
    setVideos(updated);
    setSelectedVideo(newVid);
    setNewVideoUrl('');
    setNewVideoTitle('');
    setIsAddingMode(false);
  };

  const handleCopyShareLink = () => {
    const shareUrl = `https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      {/* Floating Small Video Button - Available throughout the app (Hidden on mobile; on mobile access via Objectives / Learn Menu) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Jumbo Linux Video Lessons"
        title="Watch Our Jumbo Linux Video Tutorials (Embedded from YouTube)"
        className="hidden sm:flex fixed bottom-6 right-6 z-40 items-center gap-2 bg-red-600 hover:bg-red-700 text-white pl-2.5 pr-3.5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer font-['Nunito',sans-serif] border-2 border-white/80"
      >
        <span className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center font-bold shrink-0">
          <Play className="w-3.5 h-3.5 fill-red-600 ml-0.5" />
        </span>
        <span className="text-xs font-black tracking-wide font-['Fredoka',sans-serif] uppercase">
          Our Jumbo Videos
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping shrink-0" />
      </button>

      {/* Video Modal - Closes when clicking outside */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 cursor-pointer font-['Nunito',sans-serif]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] cursor-default"
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-red-600 rounded-lg text-white">
                  <Tv className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs uppercase font-bold text-red-400 tracking-wider flex items-center gap-1.5">
                    <span>Jumbo Linux Academy</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">Embedded from YouTube</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-['Fredoka',sans-serif] text-white">
                    Our Video Lessons for Kids
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMode(!isAddingMode)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Add YouTube Lesson</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Informational Sub-Banner */}
            <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 text-[11px] font-bold text-amber-900 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <span>🐧</span>
                <span>Our official video guides teaching children how to use Jumbo Linux (embedded directly from YouTube).</span>
              </span>
              <span className="text-[10px] text-amber-700 font-mono hidden sm:inline">YouTube Embed Player</span>
            </div>

            {/* Optional "Add YouTube Link" Bar */}
            {isAddingMode && (
              <form onSubmit={handleAddVideo} className="bg-red-50 border-b border-red-200 p-3 sm:p-4 space-y-2">
                <div className="text-xs font-bold text-red-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>Share a YouTube Video with Students:</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Paste YouTube Link or Video ID (e.g. https://youtu.be/...)"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-red-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Lesson Title (optional)"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="sm:w-48 px-3 py-2 text-xs rounded-xl border border-red-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer shadow-xs"
                  >
                    Add & Watch
                  </button>
                </div>
                {addError && <p className="text-xs text-red-600 font-bold">{addError}</p>}
              </form>
            )}

            {/* Modal Body: Active Video Player + Playlist */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Responsive YouTube Embed Player */}
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Video Info & Share Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold text-[10px] uppercase">
                      {selectedVideo.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Duration: {selectedVideo.duration}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">
                    {selectedVideo.title}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xl">
                    {selectedVideo.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs cursor-pointer transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Share Video</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Watch on YouTube</span>
                  </a>
                </div>
              </div>

              {/* Video Playlist Selector */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select a Lesson to Watch:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {videos.map((vid) => {
                    const isSelected = vid.id === selectedVideo.id;
                    return (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => setSelectedVideo(vid)}
                        className={`p-3 rounded-xl border text-left flex items-start justify-between gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-50/80 border-red-300 ring-2 ring-red-400/30 shadow-xs'
                            : 'bg-white border-slate-200/90 hover:bg-slate-50 shadow-xs'
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                              {vid.tag}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {vid.duration}
                            </span>
                          </div>
                          <div className={`text-xs font-bold truncate ${isSelected ? 'text-red-950' : 'text-slate-800'}`}>
                            {vid.title}
                          </div>
                        </div>

                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-slate-500">
              <span>Click outside to close</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
