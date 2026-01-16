'use client';

import { Plus, FileText, Home, Inbox, Sparkles, Folder, History } from 'lucide-react';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { useUIStore } from '@/store/useUIStore';

export default function Sidebar() {
  const history = useSlideDeckStore((state) => state.history);
  const reset = useSlideDeckStore((state) => state.reset);
  const isHistoryPanelOpen = useUIStore((state) => state.isHistoryPanelOpen);
  const toggleHistoryPanel = useUIStore((state) => state.toggleHistoryPanel);

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 space-y-2 z-10">
      {/* Logo */}
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-black" />
      </div>

      {/* New Deck Button */}
      <button
        onClick={reset}
        className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors group relative"
        title="New Deck"
      >
        <Plus className="w-5 h-5 text-gray-400 group-hover:text-white" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          New
        </span>
      </button>

      {/* Divider */}
      <div className="w-8 h-px bg-zinc-800 my-2" />

      {/* Navigation Icons */}
      <button
        onClick={toggleHistoryPanel}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors group relative ${
          isHistoryPanelOpen ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800 text-zinc-400'
        }`}
        title="History"
      >
        <History className={`w-5 h-5 group-hover:text-white ${
          isHistoryPanelOpen ? 'text-white' : 'text-zinc-400'
        }`} />
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-semibold">
            {history.length}
          </span>
        )}
        <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          History
        </span>
      </button>

      <button
        className="w-10 h-10 hover:bg-zinc-800 rounded-lg flex items-center justify-center transition-colors group relative"
        title="All Slides"
      >
        <FileText className="w-5 h-5 text-zinc-400 group-hover:text-white" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          All Slides
        </span>
      </button>

      <button
        className="w-10 h-10 hover:bg-zinc-800 rounded-lg flex items-center justify-center transition-colors group relative"
        title="Home"
      >
        <Home className="w-5 h-5 text-zinc-400 group-hover:text-white" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Home
        </span>
      </button>

      <button
        className="w-10 h-10 hover:bg-zinc-800 rounded-lg flex items-center justify-center transition-colors group relative"
        title="AI Inbox"
      >
        <Inbox className="w-5 h-5 text-zinc-400 group-hover:text-white" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          AI Inbox
        </span>
      </button>

      <button
        className="w-10 h-10 hover:bg-zinc-800 rounded-lg flex items-center justify-center transition-colors group relative"
        title="Hub"
      >
        <Sparkles className="w-5 h-5 text-zinc-400 group-hover:text-white" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Hub
        </span>
      </button>

      <button
        className="w-10 h-10 hover:bg-zinc-800 rounded-lg flex items-center justify-center transition-colors group relative"
        title="AI Drive"
      >
        <Folder className="w-5 h-5 text-zinc-400 group-hover:text-white" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          AI Drive
        </span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  );
}
