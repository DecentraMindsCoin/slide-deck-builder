import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { SlideDeck, SlideContent, AppState } from '@/types';

interface DeckHistoryItem {
  id: string;
  deck: SlideDeck;
  createdAt: number;
  prompt: string;
}

interface SlideDeckState {
  // State
  appState: AppState;
  slideDeck: SlideDeck | null;
  error: string;
  history: DeckHistoryItem[];
  currentDeckId: string | null;
  
  // Actions
  setAppState: (state: AppState) => void;
  setSlideDeck: (deck: SlideDeck | null) => void;
  setError: (error: string) => void;
  updateSlide: (slideId: string, title: string, content: SlideContent[]) => void;
  addToHistory: (deck: SlideDeck, prompt: string) => void;
  loadDeckFromHistory: (id: string) => void;
  deleteDeckFromHistory: (id: string) => void;
  reset: () => void;
}

export const useSlideDeckStore = create<SlideDeckState>()(
  persist(
    devtools(
      (set) => ({
        // Initial state
        appState: 'input',
        slideDeck: null,
        error: '',
        history: [],
        currentDeckId: null,

        // Actions
        setAppState: (appState) => set({ appState }, false, 'setAppState'),
        
        setSlideDeck: (slideDeck) => set({ slideDeck }, false, 'setSlideDeck'),
        
        setError: (error) => set({ error }, false, 'setError'),
        
        addToHistory: (deck, prompt) =>
          set(
            (state) => {
              const id = `deck-${Date.now()}`;
              const newItem: DeckHistoryItem = {
                id,
                deck,
                createdAt: Date.now(),
                prompt,
              };
              return {
                history: [newItem, ...state.history],
                currentDeckId: id,
              };
            },
            false,
            'addToHistory'
          ),
        
        loadDeckFromHistory: (id) =>
          set(
            (state) => {
              const item = state.history.find((h) => h.id === id);
              if (!item) return state;
              return {
                slideDeck: item.deck,
                currentDeckId: id,
                appState: 'viewing' as AppState,
              };
            },
            false,
            'loadDeckFromHistory'
          ),
        
        deleteDeckFromHistory: (id) =>
          set(
            (state) => ({
              history: state.history.filter((h) => h.id !== id),
              ...(state.currentDeckId === id
                ? { slideDeck: null, currentDeckId: null, appState: 'input' as AppState }
                : {}),
            }),
            false,
            'deleteDeckFromHistory'
          ),
      
        updateSlide: (slideId, title, content) =>
          set(
            (state) => {
              if (!state.slideDeck) return state;

              const updatedSlides = state.slideDeck.slides.map((slide) =>
                slide.id === slideId ? { ...slide, title, content } : slide
              );

              const updatedDeck = {
                ...state.slideDeck,
                slides: updatedSlides,
              };

              // Also update in history if this is a saved deck
              const updatedHistory = state.currentDeckId
                ? state.history.map((item) =>
                    item.id === state.currentDeckId
                      ? { ...item, deck: updatedDeck }
                      : item
                  )
                : state.history;

              return {
                slideDeck: updatedDeck,
                history: updatedHistory,
              };
            },
            false,
            'updateSlide'
          ),
      
        reset: () =>
          set(
            { appState: 'input', slideDeck: null, error: '', currentDeckId: null },
            false,
            'reset'
          ),
      }),
      { name: 'SlideDeckStore' }
    ),
    {
      name: 'slide-deck-storage',
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);
