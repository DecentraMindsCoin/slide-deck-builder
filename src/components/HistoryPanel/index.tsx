'use client';

import { useState } from 'react';
import Panel from '@/components/ui/Panel';
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
      <HistoryList
        history={history}
        currentDeckId={currentDeckId}
        onLoadDeck={loadDeckFromHistory}
        onDeleteClick={handleDeleteClick}
      />

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
