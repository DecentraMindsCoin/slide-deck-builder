/**
 * Application configuration
 */

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
