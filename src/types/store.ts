// src/types/store.ts

import type { SlideDeck, SlideContent } from './slides';

// ============================================================================
// STORE STATE TYPES
// ============================================================================

export type AppState = 'input' | 'loading' | 'generated' | 'viewing' | 'error';

export type PanelType = 'history' | 'viewer' | 'editor' | null;

// Slide Deck Store Types
export interface DeckHistoryItem {
  id: string;
  deck: SlideDeck;
  createdAt: number;
  prompt: string;
}

export interface SelectedElement {
  slideId: string;
  contentIndex: number | 'slide' | 'title';
}

export interface StyleHistoryEntry {
  timestamp: number;
  type: 'element' | 'slide';
  slideId: string;
  contentIndex?: number;
  previousStyle?: SlideContent['style'];
  previousBackgroundColor?: string;
  currentStyle?: SlideContent['style'];
  currentBackgroundColor?: string;
}

export interface SlideDeckState {
  // State
  appState: AppState;
  slideDeck: SlideDeck | null;
  error: string;
  history: DeckHistoryItem[];
  currentDeckId: string | null;
  currentSlideIndex: number;
  selectedElement: SelectedElement | null;
  styleHistory: StyleHistoryEntry[];
  
  // Actions
  setAppState: (state: AppState) => void;
  setSlideDeck: (deck: SlideDeck | null) => void;
  setError: (error: string) => void;
  setCurrentSlideIndex: (index: number) => void;
  setSelectedElement: (element: SelectedElement | null) => void;
  updateElementStyle: (slideId: string, contentIndex: number, style: SlideContent['style']) => void;
  updateTitleStyle: (slideId: string, style: SlideContent['style']) => void;
  updateSlideBackground: (slideId: string, backgroundColor: string) => void;
  updateSlide: (slideId: string, title: string, content: SlideContent[]) => void;
  deleteSlide: (slideId: string) => void;
  addSlide: () => void;
  undoLastStyleChange: () => void;
  clearStyleHistory: () => void;
  addToHistory: (deck: SlideDeck, prompt: string) => void;
  loadDeckFromHistory: (id: string) => void;
  deleteDeckFromHistory: (id: string) => void;
  reset: () => void;
}

// UI Store Types
export interface UIState {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  togglePanel: (panel: Exclude<PanelType, null>) => void;
  // Legacy getters for backward compatibility
  isHistoryPanelOpen: boolean;
  isEditorPanelOpen: boolean;
}