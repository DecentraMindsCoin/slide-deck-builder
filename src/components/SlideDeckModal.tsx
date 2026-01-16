'use client';

import { useEffect } from 'react';
import Modal from '@/components/shared/Modal';
import SlideViewer from '@/components/SlideViewer';
import { useUIStore } from '@/store/useUIStore';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import type { SlideDeck, SlideContent } from '@/types';

interface SlideDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  slideDeck: SlideDeck | null;
  onUpdateSlide: (slideId: string, title: string, content: SlideContent[]) => void;
}

export default function SlideDeckModal({
  isOpen,
  onClose,
  slideDeck,
  onUpdateSlide,
}: SlideDeckModalProps) {
  const currentSlideIndex = useSlideDeckStore((state) => state.currentSlideIndex);
  const setCurrentSlideIndex = useSlideDeckStore((state) => state.setCurrentSlideIndex);
  const activePanel = useUIStore((state) => state.activePanel);
  const setActivePanel = useUIStore((state) => state.setActivePanel);

  // Auto-open EditorPanel when modal opens, close when modal closes
  useEffect(() => {
    if (isOpen) {
      setActivePanel('editor');
    } else {
      setActivePanel(null);
      setCurrentSlideIndex(0); // Reset slide index when closing
    }
  }, [isOpen, setActivePanel, setCurrentSlideIndex]);

  if (!slideDeck) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="full" activePanel={activePanel}>
      <SlideViewer
        deckTitle={slideDeck.deckTitle}
        slides={slideDeck.slides}
        onUpdateSlide={onUpdateSlide}
        onReset={onClose}
        currentSlideIndex={currentSlideIndex}
        onSlideChange={setCurrentSlideIndex}
      />
    </Modal>
  );
}
