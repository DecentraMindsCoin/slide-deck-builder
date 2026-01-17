import type { SlideDeck, Slide, SlideContent } from '@/types';
import { SLIDE_DEFAULTS } from '@/constants/slides';
import type { TemplateTheme } from '@/constants/templates';

/**
 * Normalizes slide deck data with template theme or default styles
 * - If theme provided: applies template theme styles
 * - Otherwise: default slide background white (#FFFFFF), text black (#000000)
 */
export function normalizeSlides(deck: SlideDeck, theme?: TemplateTheme): SlideDeck {
  return {
    ...deck,
    slides: deck.slides.map((slide) => normalizeSlide(slide, theme)),
  };
}

/**
 * Normalizes a single slide with template theme or default styles
 */
function normalizeSlide(slide: Slide, theme?: TemplateTheme): Slide {
  return {
    ...slide,
    // Apply theme background or default white background
    backgroundColor: slide.backgroundColor || theme?.slideBackground || SLIDE_DEFAULTS.BACKGROUND_COLOR,
    // Apply theme title style if not already set
    titleStyle: slide.titleStyle || theme?.titleStyle,
    // Normalize content with theme or default styles
    content: slide.content.map((item) => normalizeContent(item, theme)),
  };
}

/**
 * Normalizes slide content with template theme or default text styles
 */
function normalizeContent(item: SlideContent, theme?: TemplateTheme): SlideContent {
  // Use theme content style or fallback to defaults
  const baseStyle = theme?.contentStyle || {
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
  };

  return {
    ...item,
    style: {
      ...baseStyle,
      // Merge with existing styles (user styles override theme/defaults)
      ...item.style,
    },
  };
}
