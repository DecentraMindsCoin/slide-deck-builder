'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import HistoryPanel from '@/components/HistoryPanel';
import ViewerPanel from '@/components/ViewerPanel';
import EditorPanel from '@/components/EditorPanel';
import HomeLayout from '@/components/HomeLayout';
import SlideDeckModal from '@/components/SlideViewer';
import ErrorDisplay from '@/components/ErrorDisplay';
import GeneratedSuccess from '@/components/GeneratedSuccess';
import { generateSlides } from '@/services/api';
import { normalizeSlides } from '@/lib/slides/normalizeSlides';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { useUIStore } from '@/store/useUIStore';
import type { SlideContent } from '@/types';
import type { TemplateTheme } from '@/constants/templates';

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  
  // UI state
  const activePanel = useUIStore((state) => state.activePanel);
  
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

  const handlePromptSubmit = async (prompt: string, theme?: TemplateTheme) => {
    setCurrentPrompt(prompt);
    setAppState('loading');
    setError('');

    try {
      const response = await generateSlides(prompt);
      if (response.success) {
        // Normalize slides with template theme or default styles
        const normalizedDeck = normalizeSlides(response.data, theme);
        setSlideDeck(normalizedDeck);
        addToHistory(normalizedDeck, prompt);
        setAppState('generated');
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

  const handleViewDeck = () => {
    setAppState('viewing');
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* History Panel */}
      <HistoryPanel />

      {/* Viewer Panel */}
      <ViewerPanel />

      {/* Editor Panel */}
      <EditorPanel />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          activePanel ? 'ml-96' : 'ml-16'
        }`}
      >
        {/* Main Chat Page */}
        <HomeLayout
          onSubmit={handlePromptSubmit}
          isLoading={appState === 'loading'}
        />

        {/* Error Display */}
        {appState === 'error' && (
          <div className="fixed top-4 right-4 z-40">
            <ErrorDisplay error={error} onRetry={handleRetry} />
          </div>
        )}

        {/* Generated Success Message */}
        {appState === 'generated' && slideDeck && (
          <GeneratedSuccess
            onView={handleViewDeck}
            slideCount={slideDeck.slides.length}
          />
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
