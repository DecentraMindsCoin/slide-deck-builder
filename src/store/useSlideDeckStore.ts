import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SlideDeck, SlideContent, AppState } from '@/types';

interface SlideDeckState {
  // State
  appState: AppState;
  slideDeck: SlideDeck | null;
  error: string;
  
  // Actions
  setAppState: (state: AppState) => void;
  setSlideDeck: (deck: SlideDeck | null) => void;
  setError: (error: string) => void;
  updateSlide: (slideId: string, title: string, content: SlideContent[]) => void;
  reset: () => void;
}

export const useSlideDeckStore = create<SlideDeckState>()(
  devtools(
    (set) => ({
      // Initial state
      appState: 'input',
      slideDeck: null,
      error: '',

      // Actions
      setAppState: (appState) => set({ appState }, false, 'setAppState'),
      
      setSlideDeck: (slideDeck) => set({ slideDeck }, false, 'setSlideDeck'),
      
      setError: (error) => set({ error }, false, 'setError'),
      
      updateSlide: (slideId, title, content) =>
        set(
          (state) => {
            if (!state.slideDeck) return state;

            const updatedSlides = state.slideDeck.slides.map((slide) =>
              slide.id === slideId ? { ...slide, title, content } : slide
            );

            return {
              slideDeck: {
                ...state.slideDeck,
                slides: updatedSlides,
              },
            };
          },
          false,
          'updateSlide'
        ),
      
      reset: () =>
        set(
          { appState: 'input', slideDeck: null, error: '' },
          false,
          'reset'
        ),
    }),
    { name: 'SlideDeckStore' }
  )
);
