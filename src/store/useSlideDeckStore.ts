import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { DeckHistoryItem, SlideDeckState, StyleHistoryEntry, AppState } from '@/types/store';


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
        currentSlideIndex: 0,
        selectedElement: null,
        styleHistory: [],

        // Actions
        setAppState: (appState) => set({ appState }, false, 'setAppState'),
        
        setSlideDeck: (slideDeck) => set({ slideDeck }, false, 'setSlideDeck'),
        
        setError: (error) => set({ error }, false, 'setError'),
        
        setCurrentSlideIndex: (currentSlideIndex) => set({ currentSlideIndex }, false, 'setCurrentSlideIndex'),
        
        setSelectedElement: (selectedElement) => set({ selectedElement }, false, 'setSelectedElement'),
        
        updateElementStyle: (slideId, contentIndex, style) =>
          set(
            (state) => {
              if (!state.slideDeck) return state;

              // Capture previous state for undo
              const slide = state.slideDeck.slides.find((s) => s.id === slideId);
              const previousStyle = slide?.content[contentIndex]?.style;

              const updatedSlides = state.slideDeck.slides.map((slide) => {
                if (slide.id !== slideId) return slide;
                
                const updatedContent = slide.content.map((item, idx) => {
                  if (idx !== contentIndex) return item;
                  return { ...item, style: { ...item.style, ...style } };
                });
                
                return { ...slide, content: updatedContent };
              });

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

              // Add to style history (keep last 10)
              const newStyleHistory: StyleHistoryEntry[] = [
                ...state.styleHistory.slice(-9),
                {
                  timestamp: Date.now(),
                  type: 'element' as const,
                  slideId,
                  contentIndex,
                  previousStyle,
                  currentStyle: style,
                },
              ];

              return {
                slideDeck: updatedDeck,
                history: updatedHistory,
                styleHistory: newStyleHistory,
              };
            },
            false,
            'updateElementStyle'
          ),
        
        updateSlideBackground: (slideId, backgroundColor) =>
          set(
            (state) => {
              if (!state.slideDeck) return state;

              // Capture previous state for undo
              const slide = state.slideDeck.slides.find((s) => s.id === slideId);
              const previousBackgroundColor = slide?.backgroundColor;

              const updatedSlides = state.slideDeck.slides.map((slide) =>
                slide.id === slideId ? { ...slide, backgroundColor } : slide
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

              // Add to style history (keep last 10)
              const newStyleHistory: StyleHistoryEntry[] = [
                ...state.styleHistory.slice(-9),
                {
                  timestamp: Date.now(),
                  type: 'slide' as const,
                  slideId,
                  previousBackgroundColor,
                  currentBackgroundColor: backgroundColor,
                },
              ];

              return {
                slideDeck: updatedDeck,
                history: updatedHistory,
                styleHistory: newStyleHistory,
              };
            },
            false,
            'updateSlideBackground'
          ),
        
        undoLastStyleChange: () =>
          set(
            (state) => {
              if (!state.slideDeck || state.styleHistory.length === 0) return state;

              const lastChange = state.styleHistory[state.styleHistory.length - 1];
              
              let updatedSlides = state.slideDeck.slides;

              if (lastChange.type === 'element' && lastChange.contentIndex !== undefined) {
                // Restore previous element style
                updatedSlides = state.slideDeck.slides.map((slide) => {
                  if (slide.id !== lastChange.slideId) return slide;
                  
                  const updatedContent = slide.content.map((item, idx) => {
                    if (idx !== lastChange.contentIndex) return item;
                    return { ...item, style: lastChange.previousStyle || {} };
                  });
                  
                  return { ...slide, content: updatedContent };
                });
              } else if (lastChange.type === 'slide') {
                // Restore previous slide background
                updatedSlides = state.slideDeck.slides.map((slide) =>
                  slide.id === lastChange.slideId
                    ? { ...slide, backgroundColor: lastChange.previousBackgroundColor }
                    : slide
                );
              }

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
                styleHistory: state.styleHistory.slice(0, -1),
              };
            },
            false,
            'undoLastStyleChange'
          ),
        
        clearStyleHistory: () => set({ styleHistory: [] }, false, 'clearStyleHistory'),
        
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
            { appState: 'input', slideDeck: null, error: '', currentDeckId: null, currentSlideIndex: 0, selectedElement: null, styleHistory: [] },
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
