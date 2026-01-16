// ============================================================================
// SLIDE TYPES
// ============================================================================

export interface SlideContent {
  type: 'paragraph' | 'bullet';
  text: string;
}

export interface Slide {
  id: string;
  title: string;
  content: SlideContent[];
}

export interface SlideDeck {
  deckTitle: string;
  slides: Slide[];
}

export interface SlideUpdate {
  slideId: string;
  title?: string;
  content?: SlideContent[];
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse {
  success: boolean;
  data: SlideDeck;
}

export interface ApiError {
  success: false;
  error: string;
}

export interface GenerateSlidesRequest {
  prompt: string;
  model?: string;
}

export interface ApiConfig {
  url: string;
  apiKey: string;
  timeout?: number;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export interface SlideViewerProps {
  deckTitle: string;
  slides: Slide[];
  onUpdateSlide: (slideId: string, title: string, content: SlideContent[]) => void;
  onReset: () => void;
  currentSlideIndex?: number;
  onSlideChange?: (index: number) => void;
}

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

// ============================================================================
// APPLICATION STATE TYPES
// ============================================================================

export type AppState = 'input' | 'loading' | 'viewing' | 'error';

export interface AppStateManager {
  state: AppState;
  slideDeck: SlideDeck | null;
  error: string;
  setState: (state: AppState) => void;
  setSlideDeck: (deck: SlideDeck | null) => void;
  setError: (error: string) => void;
}

// ============================================================================
// FUTURE: Add new type sections here as needed
// Examples:
// - THEME TYPES (for slide themes feature)
// - EXPORT TYPES (for PowerPoint export feature)
// - TEMPLATE TYPES (for slide templates feature)
// ============================================================================
