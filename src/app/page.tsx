'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import HistoryPanel from '@/components/HistoryPanel';
import PromptInput from '@/components/PromptInput';
import SlideDeckModal from '@/components/SlideDeckModal';
import ErrorDisplay from '@/components/ErrorDisplay';
import { generateSlides } from '@/services/api';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { useUIStore } from '@/store/useUIStore';
import type { SlideContent } from '@/types';

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  
  // UI state
  const isHistoryPanelOpen = useUIStore((state) => state.isHistoryPanelOpen);
  
  // Zustand store
  const appState = useSlideDeckStore((state) => state.appState);
  const slideDeck = useSlideDeckStore((state) => state.slideDeck);
  const error = useSlideDeckStore((state) => state.error);
  const setAppState = useSlideDeckStore((state) => state.setAppState);
  const setSlideDeck = useSlideDeckStore((state) => state.setSlideDeck);
  const setError = useSlideDeckStore((state) => state.setError);
  const updateSlide = useSlideDeckStore((state) => state.updateSlide);
  const addToHistory = useSlideDeckStore((state) => state.addToHistory);
  const reset = useSlideDeckStore((state) => state.reset);

  const handlePromptSubmit = async (prompt: string) => {
    setCurrentPrompt(prompt);
    setAppState('loading');
    setError('');

    try {
      const response = await generateSlides(prompt);
      if (response.success && response.data) {
        setSlideDeck(response.data);
        addToHistory(response.data, prompt);
        setAppState('viewing');
      } else {
        throw new Error('Failed to generate slides');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAppState('error');
    }
  };

  const handleUpdateSlide = (slideId: string, title: string, content: SlideContent[]) => {
    updateSlide(slideId, title, content);
  };

  const handleCloseModal = () => {
    setAppState('input');
  };

  const handleRetry = () => {
    setAppState('input');
    setError('');
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* History Panel */}
      <HistoryPanel />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isHistoryPanelOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        {/* Main Chat Page - Always Visible */}
        <PromptInput
          onSubmit={handlePromptSubmit}
          isLoading={appState === 'loading'}
        />

        {/* Error Display */}
        {appState === 'error' && (
          <div className="fixed top-4 right-4 z-40">
            <ErrorDisplay error={error} onRetry={handleRetry} />
          </div>
        )}

        {/* Slide Deck Modal */}
        <SlideDeckModal
          isOpen={appState === 'viewing'}
          onClose={handleCloseModal}
          slideDeck={slideDeck}
          onUpdateSlide={handleUpdateSlide}
        />
      </div>
    </>
  );
}
