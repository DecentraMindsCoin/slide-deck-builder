'use client';

import { useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import Panel from '@/components/shared/Panel';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { useUIStore } from '@/store/useUIStore';
import { formatRelativeTime, truncate } from '@/lib/utils';

export default function HistoryPanel() {
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const activePanel = useUIStore((state) => state.activePanel);
  const togglePanel = useUIStore((state) => state.togglePanel);
  const isOpen = activePanel === 'history';
  const history = useSlideDeckStore((state) => state.history);
  const currentDeckId = useSlideDeckStore((state) => state.currentDeckId);
  const loadDeckFromHistory = useSlideDeckStore((state) => state.loadDeckFromHistory);
  const deleteDeckFromHistory = useSlideDeckStore((state) => state.deleteDeckFromHistory);

  const handleDeleteClick = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setDeleteConfirm({ id, title });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteDeckFromHistory(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <Panel
      panelType="history"
      isOpen={isOpen}
      onClose={() => togglePanel('history')}
      title="Generation History"
      width="md"
    >
      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
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
                      onClick={(e) => handleDeleteClick(e, item.id, item.deck.deckTitle)}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Slide Deck"
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        activePanel={activePanel}
      />
    </Panel>
  );
}
