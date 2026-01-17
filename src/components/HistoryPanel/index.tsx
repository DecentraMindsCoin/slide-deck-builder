'use client';

import { useState } from 'react';
import { History, Plus } from 'lucide-react';
import Panel from '@/components/ui/Panel';
import Button from '@/components/ui/Button';
import ConfirmModal from './ConfirmDeleteModal';
import HistoryList from './HistoryList';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { useUIStore } from '@/store/useUIStore';

export default function HistoryPanel() {
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const activePanel = useUIStore((state) => state.activePanel);
  const togglePanel = useUIStore((state) => state.togglePanel);
  const isOpen = activePanel === 'history';
  const history = useSlideDeckStore((state) => state.history);
  const currentDeckId = useSlideDeckStore((state) => state.currentDeckId);
  const loadDeckFromHistory = useSlideDeckStore((state) => state.loadDeckFromHistory);
  const deleteDeckFromHistory = useSlideDeckStore((state) => state.deleteDeckFromHistory);
  const reset = useSlideDeckStore((state) => state.reset);

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
    <>
      <Panel
        panelType="history"
        isOpen={isOpen}
        onClose={() => togglePanel('history')}
        width="md"
      >
        <div className="flex flex-col h-full">
          {/* Fixed Header */}
          <div className="shrink-0">
            <div className="border-b border-zinc-800 p-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-bg-white/10" />
                <h2 className="font-rajdhani text-lg font-semibold text-white uppercase tracking-tight">Generation History</h2>
              </div>
            </div>

            {/* All Decks Section */}
            <div className="p-4 pb-0 border-b border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  All Decks ({history.length})
                </div>
                <Button
                  onClick={reset}
                  variant="primary"
                  icon={<Plus className="w-3 h-3" />}
                  size="sm"
                  className="text-xs"
                >
                  New Deck
                </Button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <HistoryList
              history={history}
              currentDeckId={currentDeckId}
              onLoadDeck={loadDeckFromHistory}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        </div>
      </Panel>

      {/* Delete Confirmation Modal - Rendered outside Panel for correct z-index stacking */}
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
    </>
  );
}
