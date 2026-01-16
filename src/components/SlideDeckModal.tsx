'use client';

import Modal from '@/components/shared/Modal';
import SlideViewer from '@/components/SlideViewer';
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
  if (!slideDeck) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="full">
      <SlideViewer
        deckTitle={slideDeck.deckTitle}
        slides={slideDeck.slides}
        onUpdateSlide={onUpdateSlide}
        onReset={onClose}
      />
    </Modal>
  );
}
