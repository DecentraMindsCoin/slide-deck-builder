'use client';

import { FileText, Trash2, ChevronLeft } from 'lucide-react';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { useUIStore } from '@/store/useUIStore';
import { formatRelativeTime, truncate } from '@/lib/utils';

export default function HistoryPanel() {
  const isOpen = useUIStore((state) => state.isHistoryPanelOpen);
  const toggleHistoryPanel = useUIStore((state) => state.toggleHistoryPanel);
  const history = useSlideDeckStore((state) => state.history);
  const currentDeckId = useSlideDeckStore((state) => state.currentDeckId);
  const loadDeckFromHistory = useSlideDeckStore((state) => state.loadDeckFromHistory);
  const deleteDeckFromHistory = useSlideDeckStore((state) => state.deleteDeckFromHistory);

  if (!isOpen) return null;

  return (
    <>
      {/* History Panel */}
      <div className={`fixed left-16 top-0 h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300 z-20 ${isOpen ? 'slide-in-from-left' : 'slide-out-to-left'} duration-300`}>
        {/* Toggle Button - Right Edge */}
        <button
          onClick={toggleHistoryPanel}
          className="absolute -right-10 top-4 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors z-30"
          title="Close History"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-400" />
        </button>
        <div className="p-4 h-full flex flex-col overflow-hidden">
          <h2 className="text-white text-lg font-semibold mb-4">Generation History</h2>

          {/* History List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {history.length === 0 ? (
              <div className="text-zinc-500 text-sm text-center py-8">
                No decks generated yet
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                    currentDeckId === item.id
                      ? 'bg-blue-600/20 border border-blue-600/50'
                      : 'bg-zinc-800/50 hover:bg-zinc-800 border border-transparent'
                  }`}
                  onClick={() => loadDeckFromHistory(item.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span className="text-white text-sm font-medium truncate">
                          {item.deck.deckTitle}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs mb-1 line-clamp-2">
                        {truncate(item.prompt, 40)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>{item.deck.slides.length} slides</span>
                        <span>•</span>
                        <span>{formatRelativeTime(item.createdAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDeckFromHistory(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600/20 rounded transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
