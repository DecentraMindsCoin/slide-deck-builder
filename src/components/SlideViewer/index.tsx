'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import SlideViewer from '@/components/SlideViewer/slide/SlideDeckViewer';
import { useUIStore } from '@/store/useUIStore';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { useKeyboardNavigation } from '@/lib/hooks/useKeyboardNavigation';
import type { SlideDeck, SlideContent } from '@/types';
import { Modal } from '../ui';

interface SlideDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  slideDeck: SlideDeck | null;
  onUpdateSlide: (slideId: string, title: string, content: SlideContent[]) => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export default function SlideDeckModal({
  isOpen,
  onClose,
  slideDeck,
  onUpdateSlide,
  onRegenerate,
  isRegenerating = false,
}: SlideDeckModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const currentSlideIndex = useSlideDeckStore((state) => state.currentSlideIndex);
  const setCurrentSlideIndex = useSlideDeckStore((state) => state.setCurrentSlideIndex);
  const isLoadingDeck = useSlideDeckStore((state) => state.isLoadingDeck);
  const activePanel = useUIStore((state) => state.activePanel);
  const setActivePanel = useUIStore((state) => state.setActivePanel);

  // Show loader for 2 seconds when modal opens or when deck changes
  useEffect(() => {
    if (isOpen && slideDeck) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [isOpen, slideDeck?.deckTitle]);

  // Show loader during regeneration
  useEffect(() => {
    if (isRegenerating) {
      setIsLoading(true);
    } else {
      // Clear loading when regeneration completes
      setIsLoading(false);
    }
  }, [isRegenerating]);

  // Auto-open EditorPanel when modal opens, close when modal closes
  useEffect(() => {
    if (isOpen) {
      setActivePanel('editor');
    } else {
      setActivePanel(null);
      setCurrentSlideIndex(0); // Reset slide index when closing
    }
  }, [isOpen, setActivePanel, setCurrentSlideIndex]);

  // Keyboard navigation for slides with looping
  useKeyboardNavigation({
    enabled: isOpen && !!slideDeck,
    loop: true,
    onPrevious: () => {
      if (!slideDeck) return;
      if (currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      } else {
        // Loop to last slide
        setCurrentSlideIndex(slideDeck.slides.length - 1);
      }
    },
    onNext: () => {
      if (!slideDeck) return;
      if (currentSlideIndex < slideDeck.slides.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      } else {
        // Loop to first slide
        setCurrentSlideIndex(0);
      }
    },
  });

  // Don't close modal if regenerating
  if (!slideDeck && !isRegenerating) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="full" activePanel={activePanel}>
      {isLoading || isRegenerating || isLoadingDeck ? (
        <div className="flex items-center justify-center h-[80vh] bg-zinc-950">
          <div className="flex flex-col items-center gap-6">
            {/* Animated loader */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="relative w-16 h-16 text-white animate-spin" />
            </div>
            
            {/* Loading text */}
            <div className="flex flex-col items-center gap-2">
              <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-tight">
                {isRegenerating ? 'Regenerating Slide Deck' : 'Loading Slide Deck'}
              </h3>
              <p className="text-zinc-400 text-sm animate-pulse">
                {isRegenerating ? 'Creating fresh content...' : 'Preparing your presentation...'}
              </p>
            </div>
          </div>
        </div>
      ) : slideDeck ? (
        <div className="animate-in fade-in duration-500">
          <SlideViewer
            deckTitle={slideDeck.deckTitle}
            slides={slideDeck.slides}
            onUpdateSlide={onUpdateSlide}
            onReset={onClose}
            onRegenerate={onRegenerate}
            currentSlideIndex={currentSlideIndex}
            onSlideChange={setCurrentSlideIndex}
          />
        </div>
      ) : null}
    </Modal>
  );
}
