/**
 * Application configuration and constants
 */

import type { SlideContent } from '@/types';

// API Configuration
export const API_CONFIG = {
  REQUEST_TIMEOUT: 30000, // 30 seconds
  DEFAULT_MODEL: 'gpt-4o-2024-08-06',
  MAX_RETRIES: 3,
} as const;

// UI Configuration
export const UI_CONFIG = {
  MAX_SLIDES: 50,
  MIN_PROMPT_LENGTH: 10,
  MAX_PROMPT_LENGTH: 1000,
} as const;

// Animation/Timing
export const TIMING = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
} as const;

// Slide Style Defaults
export const SLIDE_DEFAULTS = {
  // Slide background
  BACKGROUND_COLOR: '#FFFFFF',
  
  // Text styles
  TEXT_COLOR: '#000000',
  FONT_SIZE: 20,
  FONT_FAMILY: 'Arial',
  FONT_WEIGHT: 'normal' as const,
  FONT_STYLE: 'normal' as const,
  TEXT_DECORATION: 'none' as const,
  TEXT_ALIGN: 'left' as const,
  LINE_HEIGHT: 1.5,
  LETTER_SPACING: 0,
  
  // Title styles
  TITLE_FONT_SIZE: 32,
  TITLE_COLOR: '#000000',
  
  // Other
  TRANSPARENT: 'transparent',
} as const;
