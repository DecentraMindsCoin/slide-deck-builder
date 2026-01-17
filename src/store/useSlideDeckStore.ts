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
        
        updateTitleStyle: (slideId, style) =>
          set(
            (state) => {
              if (!state.slideDeck) return state;

              const updatedSlides = state.slideDeck.slides.map((slide) => {
                if (slide.id !== slideId) return slide;
                return { ...slide, titleStyle: { ...slide.titleStyle, ...style } };
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

              return {
                slideDeck: updatedDeck,
                history: updatedHistory,
              };
            },
            false,
            'updateTitleStyle'
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
      
        deleteSlide: (slideId) =>
          set(
            (state) => {
              if (!state.slideDeck || state.slideDeck.slides.length <= 1) return state; // Prevent deleting last slide

              const updatedSlides = state.slideDeck.slides.filter((slide) => slide.id !== slideId);
              const deletedSlideIndex = state.slideDeck.slides.findIndex((slide) => slide.id === slideId);

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

              // Adjust current slide index if needed
              const newIndex = deletedSlideIndex >= updatedSlides.length 
                ? updatedSlides.length - 1 
                : state.currentSlideIndex;

              return {
                slideDeck: updatedDeck,
                history: updatedHistory,
                currentSlideIndex: newIndex,
                selectedElement: null, // Clear selection
              };
            },
            false,
            'deleteSlide'
          ),
      
        addSlide: () =>
          set(
            (state) => {
              if (!state.slideDeck) return state;

              const newSlide = {
                id: `slide-${Date.now()}`,
                title: 'New Slide',
                content: [],
              };

              const updatedSlides = [...state.slideDeck.slides, newSlide];

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
                currentSlideIndex: updatedSlides.length - 1, // Navigate to new slide
              };
            },
            false,
            'addSlide'
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
