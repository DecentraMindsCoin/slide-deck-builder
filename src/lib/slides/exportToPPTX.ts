import pptxgen from 'pptxgenjs';
import type { SlideDeck, SlideContent } from '@/types';
import { SLIDE_DEFAULTS } from '@/constants';

/**
 * Converts hex color to PptxGenJS color format (removes #)
 */
function formatColor(color?: string): string {
  if (!color || color === 'transparent') return '';
  // Handle rgb() format
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]).toString(16).padStart(2, '0');
      const g = parseInt(match[1]).toString(16).padStart(2, '0');
      const b = parseInt(match[2]).toString(16).padStart(2, '0');
      return `${r}${g}${b}`.toUpperCase();
    }
  }
  // Handle hex format
  return color.replace('#', '').toUpperCase();
}

/**
 * Converts pixel font size to points (PowerPoint uses points)
 */
function pxToPoints(px?: number): number {
  if (!px) return 20;
  return Math.round(px * 0.75); // 1px ≈ 0.75pt
}

/**
 * Converts pixel spacing to inches (PowerPoint uses inches)
 */
function pxToInches(px?: number): number {
  if (!px) return 0;
  return px / 96; // 96 DPI standard
}

/**
 * Exports a slide deck to PowerPoint (.pptx) format
 */
export async function exportToPPTX(deck: SlideDeck): Promise<void> {
  console.log('Exporting deck:', deck);
  const pres = new pptxgen();

  // Set presentation properties
  pres.author = 'Slide Deck Builder';
  pres.title = deck.deckTitle;
  pres.subject = 'Generated Presentation';

  // Process each slide
  deck.slides.forEach((slide) => {
    const pptxSlide = pres.addSlide();

    // Set slide background color (default to white for PowerPoint compatibility)
    const bgColor = formatColor(slide.backgroundColor || SLIDE_DEFAULTS.BACKGROUND_COLOR);
    if (bgColor) {
      pptxSlide.background = { color: bgColor };
    }

    // Add slide title with custom styles
    const titleStyle = slide.titleStyle || {};
    console.log('Exporting title:', slide.title, 'with titleStyle:', titleStyle);
    
    const titleOptions: any = {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.75,
      fontSize: pxToPoints(titleStyle.fontSize) || SLIDE_DEFAULTS.TITLE_FONT_SIZE,
      fontFace: titleStyle.fontFamily || SLIDE_DEFAULTS.FONT_FAMILY,
      color: formatColor(titleStyle.color) || formatColor(SLIDE_DEFAULTS.TITLE_COLOR),
      align: titleStyle.textAlign || 'left',
    };

    // Apply title text styling
    if (titleStyle.fontWeight === 'bold' || !titleStyle.fontWeight) {
      titleOptions.bold = true;
    }
    if (titleStyle.fontStyle === 'italic') {
      titleOptions.italic = true;
    }
    if (titleStyle.textDecoration === 'underline') {
      titleOptions.underline = true;
    }
    if (titleStyle.backgroundColor && titleStyle.backgroundColor !== 'transparent') {
      const bgColor = formatColor(titleStyle.backgroundColor);
      if (bgColor) {
        titleOptions.fill = { color: bgColor };
      }
    }
    if (titleStyle.lineHeight) {
      titleOptions.lineSpacing = Math.round(titleStyle.lineHeight * 100);
    }
    if (titleStyle.letterSpacing) {
      titleOptions.charSpacing = pxToInches(titleStyle.letterSpacing);
    }

    console.log('Title export options:', titleOptions);
    pptxSlide.addText(slide.title, titleOptions);

    // Add content items
    let yPosition = 1.5; // Start below title

    slide.content.forEach((item: SlideContent) => {
      const style = item.style || {};
      console.log('Processing item:', item.text, 'with style:', style);
      
      // Build text options from style
      const textOptions: any = {
        x: item.type === 'bullet' ? 1.0 : 0.5,
        y: yPosition,
        w: item.type === 'bullet' ? 8.5 : 9,
        h: 1.0,
        fontSize: pxToPoints(style.fontSize) || pxToPoints(SLIDE_DEFAULTS.FONT_SIZE),
        fontFace: style.fontFamily || SLIDE_DEFAULTS.FONT_FAMILY,
        color: formatColor(style.color) || formatColor(SLIDE_DEFAULTS.TEXT_COLOR),
        align: style.textAlign || 'left',
        valign: 'top',
      };

      // Apply text styling
      if (style.fontWeight === 'bold') {
        textOptions.bold = true;
      }
      if (style.fontStyle === 'italic') {
        textOptions.italic = true;
      }
      if (style.textDecoration === 'underline') {
        textOptions.underline = true;
      }
      if (style.backgroundColor && style.backgroundColor !== 'transparent') {
        const bgColor = formatColor(style.backgroundColor);
        if (bgColor) {
          textOptions.fill = { color: bgColor };
        }
      }
      // need to fix this giving line spacing 150 on export
      if (style.lineHeight) {
        textOptions.lineSpacing = Math.round(style.lineHeight * 100);
      }
      if (style.letterSpacing) {
        textOptions.charSpacing = pxToInches(style.letterSpacing);
      }

      // Add bullet point or paragraph
      if (item.type === 'bullet') {
        textOptions.bullet = true;
      }

      console.log('Adding text with options:', textOptions);
      pptxSlide.addText(item.text, textOptions);

      // Increment Y position for next item (approximate height based on font size)
      const lineHeight = style.lineHeight || 1.5;
      const estimatedHeight = (pxToPoints(style.fontSize) || 20) / 72 * lineHeight;
      yPosition += estimatedHeight + 0.2; // Add some spacing between items
    });
  });

  // Generate and download the file
  const fileName = `${deck.deckTitle.replace(/[^a-z0-9]/gi, '_')}.pptx`;
  await pres.writeFile({ fileName });
}
