import type { SlideDeck, Slide, SlideContent } from '@/types';
import { SLIDE_DEFAULTS } from '@/constants/slides';

/**
 * Normalizes slide deck data with default styles for PowerPoint compatibility
 * - Default slide background: white (#FFFFFF)
 * - Default text color: black (#000000)
 */
export function normalizeSlides(deck: SlideDeck): SlideDeck {
  return {
    ...deck,
    slides: deck.slides.map((slide) => normalizeSlide(slide)),
  };
}

/**
 * Normalizes a single slide with default styles
 */
function normalizeSlide(slide: Slide): Slide {
  return {
    ...slide,
    // Set default white background if not specified
    backgroundColor: slide.backgroundColor || SLIDE_DEFAULTS.BACKGROUND_COLOR,
    // Normalize content with default black text
    content: slide.content.map((item) => normalizeContent(item)),
  };
}

/**
 * Normalizes slide content with default text styles
 */
function normalizeContent(item: SlideContent): SlideContent {
  return {
    ...item,
    style: {
      // Default text styles from config
      color: SLIDE_DEFAULTS.TEXT_COLOR,
      fontSize: SLIDE_DEFAULTS.FONT_SIZE,
      fontFamily: SLIDE_DEFAULTS.FONT_FAMILY,
      fontWeight: SLIDE_DEFAULTS.FONT_WEIGHT,
      fontStyle: SLIDE_DEFAULTS.FONT_STYLE,
      textDecoration: SLIDE_DEFAULTS.TEXT_DECORATION,
      backgroundColor: SLIDE_DEFAULTS.TRANSPARENT,
      textAlign: SLIDE_DEFAULTS.TEXT_ALIGN,
      lineHeight: SLIDE_DEFAULTS.LINE_HEIGHT,
      letterSpacing: SLIDE_DEFAULTS.LETTER_SPACING,
      // Merge with existing styles (user styles override defaults)
      ...item.style,
    },
  };
}
