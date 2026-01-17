import { useEffect } from 'react';

interface UseKeyboardNavigationOptions {
  enabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  preventDefaultKeys?: boolean;
  loop?: boolean;
}

/**
 * Custom hook for keyboard navigation using arrow keys
 * Supports ArrowLeft/ArrowUp for previous and ArrowRight/ArrowDown for next
 * Automatically prevents navigation when user is typing in inputs/textareas/contenteditable
 * 
 * @param options - Configuration options
 * @param options.enabled - Whether keyboard navigation is enabled (default: true)
 * @param options.onPrevious - Callback for previous action (ArrowLeft/ArrowUp)
 * @param options.onNext - Callback for next action (ArrowRight/ArrowDown)
 * @param options.preventDefaultKeys - Whether to prevent default browser behavior for arrow keys (default: true)
 * @param options.loop - Whether to loop from end to start and vice versa (default: false)
 * 
 * @example
 * ```tsx
 * useKeyboardNavigation({
 *   enabled: isModalOpen,
 *   onPrevious: () => setIndex(prev => Math.max(0, prev - 1)),
 *   onNext: () => setIndex(prev => Math.min(maxIndex, prev + 1)),
 *   loop: true, // Wrap around from end to start
 * });
 * ```
 */
export function useKeyboardNavigation({
  enabled = true,
  onPrevious,
  onNext,
  preventDefaultKeys = true,
  loop = false,
}: UseKeyboardNavigationOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent navigation if user is typing in an input/textarea/contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          if (preventDefaultKeys) {
            e.preventDefault();
          }
          onPrevious();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          if (preventDefaultKeys) {
            e.preventDefault();
          }
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onPrevious, onNext, preventDefaultKeys, loop]);
}
