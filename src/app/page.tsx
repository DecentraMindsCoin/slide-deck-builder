'use client';

import { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import SlideViewer from '@/components/SlideViewer';
import ErrorDisplay from '@/components/ErrorDisplay';
import { generateSlides } from '@/services/api';
import type { SlideDeck, SlideContent, AppState } from '@/types';

export default function Home() {
  const [state, setState] = useState<AppState>('input');
  const [slideDeck, setSlideDeck] = useState<SlideDeck | null>(null);
  const [error, setError] = useState<string>('');

  const handlePromptSubmit = async (prompt: string) => {
    setState('loading');
    setError('');

    try {
      const response = await generateSlides(prompt);
      if (response.success && response.data) {
        setSlideDeck(response.data);
        setState('viewing');
      } else {
        throw new Error('Failed to generate slides');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  };

  const handleUpdateSlide = (slideId: string, title: string, content: SlideContent[]) => {
    if (!slideDeck) return;

    const updatedSlides = slideDeck.slides.map((slide) =>
      slide.id === slideId ? { ...slide, title, content } : slide
    );

    setSlideDeck({
      ...slideDeck,
      slides: updatedSlides,
    });
  };

  const handleReset = () => {
    setState('input');
    setSlideDeck(null);
    setError('');
  };

  const handleRetry = () => {
    setState('input');
    setError('');
  };

  if (state === 'error') {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  if (state === 'viewing' && slideDeck) {
    return (
      <SlideViewer
        deckTitle={slideDeck.deckTitle}
        slides={slideDeck.slides}
        onUpdateSlide={handleUpdateSlide}
        onReset={handleReset}
      />
    );
  }

  return (
    <PromptInput
      onSubmit={handlePromptSubmit}
      isLoading={state === 'loading'}
    />
  );
}
