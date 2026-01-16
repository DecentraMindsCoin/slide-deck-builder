import { useState, useEffect, useRef } from 'react';
import { Undo } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { SLIDE_DEFAULTS } from '@/constants/slides';
import FontStyleControls from './controls/FontStyleControls';
import ColorControls from './controls/ColorControls';
import AlignmentControls from './controls/AlignmentControls';
import SpacingControls from './controls/SpacingControls';
import SlideBackgroundControls from './controls/SlideBackgroundControls';

export default function EditTab() {
  const selectedElement = useSlideDeckStore((state) => state.selectedElement);
  const slideDeck = useSlideDeckStore((state) => state.slideDeck);
  const updateElementStyle = useSlideDeckStore((state) => state.updateElementStyle);
  const currentSlideIndex = useSlideDeckStore((state) => state.currentSlideIndex);

  // Get the selected element's current style
  const getSelectedElementStyle = () => {
    if (!selectedElement || !slideDeck) return null;
    const slide = slideDeck.slides[currentSlideIndex];
    if (!slide) return null;
    
    // If slide is selected, return empty style object
    if (selectedElement.contentIndex === 'slide') return {};
    
    const content = slide.content[selectedElement.contentIndex as number];
    return content?.style || {};
  };

  const currentStyle = getSelectedElementStyle();
  const [fontSize, setFontSize] = useState(currentStyle?.fontSize || SLIDE_DEFAULTS.FONT_SIZE);
  const [fontFamily, setFontFamily] = useState(currentStyle?.fontFamily || SLIDE_DEFAULTS.FONT_FAMILY);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>(currentStyle?.fontWeight || SLIDE_DEFAULTS.FONT_WEIGHT);
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>(currentStyle?.fontStyle || SLIDE_DEFAULTS.FONT_STYLE);
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>(currentStyle?.textDecoration || SLIDE_DEFAULTS.TEXT_DECORATION);
  const [color, setColor] = useState(currentStyle?.color || SLIDE_DEFAULTS.TEXT_COLOR);
  const [backgroundColor, setBackgroundColor] = useState(currentStyle?.backgroundColor || SLIDE_DEFAULTS.TRANSPARENT);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(currentStyle?.textAlign || SLIDE_DEFAULTS.TEXT_ALIGN);
  const [lineHeight, setLineHeight] = useState(currentStyle?.lineHeight || SLIDE_DEFAULTS.LINE_HEIGHT);
  const [letterSpacing, setLetterSpacing] = useState(currentStyle?.letterSpacing || SLIDE_DEFAULTS.LETTER_SPACING);
  
  // Slide-level styling
  const updateSlideBackground = useSlideDeckStore((state) => state.updateSlideBackground);
  const styleHistory = useSlideDeckStore((state) => state.styleHistory);
  const undoLastStyleChange = useSlideDeckStore((state) => state.undoLastStyleChange);
  const getCurrentSlide = () => {
    if (!slideDeck) return null;
    return slideDeck.slides[currentSlideIndex];
  };
  const [slideBackgroundColor, setSlideBackgroundColor] = useState(
    getCurrentSlide()?.backgroundColor || SLIDE_DEFAULTS.BACKGROUND_COLOR
  );

  // Update local state when selection changes
  useEffect(() => {
    isInitialLoad.current = true; // Reset flag when selection changes
    if (selectedElement?.contentIndex === 'slide') {
      // Load slide background color
      const currentSlide = getCurrentSlide();
      setSlideBackgroundColor(currentSlide?.backgroundColor || SLIDE_DEFAULTS.BACKGROUND_COLOR);
    } else {
      // Load element styles
      const style = getSelectedElementStyle();
      if (style) {
        setFontSize(style.fontSize || SLIDE_DEFAULTS.FONT_SIZE);
        setFontFamily(style.fontFamily || SLIDE_DEFAULTS.FONT_FAMILY);
        setFontWeight(style.fontWeight || SLIDE_DEFAULTS.FONT_WEIGHT);
        setFontStyle(style.fontStyle || SLIDE_DEFAULTS.FONT_STYLE);
        setTextDecoration(style.textDecoration || SLIDE_DEFAULTS.TEXT_DECORATION);
        setColor(style.color || SLIDE_DEFAULTS.TEXT_COLOR);
        setBackgroundColor(style.backgroundColor || SLIDE_DEFAULTS.TRANSPARENT);
        setTextAlign(style.textAlign || SLIDE_DEFAULTS.TEXT_ALIGN);
        setLineHeight(style.lineHeight || SLIDE_DEFAULTS.LINE_HEIGHT);
        setLetterSpacing(style.letterSpacing || SLIDE_DEFAULTS.LETTER_SPACING);
      }
    }
  }, [selectedElement, currentSlideIndex]);

  // Track if this is the initial load to prevent auto-apply on selection
  const isInitialLoad = useRef(true);

  // Auto-apply element styles whenever they change
  useEffect(() => {
    if (!selectedElement || selectedElement.contentIndex === 'slide') return;
    
    // Skip auto-apply on initial selection (when styles are loaded from store)
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    
    updateElementStyle(selectedElement.slideId, selectedElement.contentIndex as number, {
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      textDecoration,
      color,
      backgroundColor,
      textAlign,
      lineHeight,
      letterSpacing,
    });
  }, [selectedElement, fontSize, fontFamily, fontWeight, fontStyle, textDecoration, color, backgroundColor, textAlign, lineHeight, letterSpacing, updateElementStyle]);

  // Auto-apply slide background when it changes
  useEffect(() => {
    if (!selectedElement || selectedElement.contentIndex !== 'slide') return;
    
    updateSlideBackground(selectedElement.slideId, slideBackgroundColor);
  }, [slideBackgroundColor]);

  if (!selectedElement) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <div className="text-center text-zinc-500">
          <p className="text-sm">Select an element or the slide background to edit</p>
        </div>
      </div>
    );
  }

  // If slide is selected, show slide-level controls
  if (selectedElement.contentIndex === 'slide') {
    return (
      <>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
          <SlideBackgroundControls
            slideBackgroundColor={slideBackgroundColor}
            setSlideBackgroundColor={setSlideBackgroundColor}
          />
        </div>

        {/* Fixed Footer with Undo Button */}
        {styleHistory.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800">
            <Button 
              onClick={undoLastStyleChange}
              variant="secondary"
              icon={<Undo className="w-4 h-4" />}
              fullWidth
            >
              Undo
            </Button>
          </div>
        )}
      </>
    );
  }

  // Element-level controls
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        <FontStyleControls
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontWeight={fontWeight}
          setFontWeight={setFontWeight}
          fontStyle={fontStyle}
          setFontStyle={setFontStyle}
          textDecoration={textDecoration}
          setTextDecoration={setTextDecoration}
        />

        <ColorControls
          color={color}
          setColor={setColor}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
        />

        <AlignmentControls
          textAlign={textAlign}
          setTextAlign={setTextAlign}
        />

        <SpacingControls
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
          letterSpacing={letterSpacing}
          setLetterSpacing={setLetterSpacing}
        />
      </div>

      {/* Fixed Footer with Undo Button */}
      {styleHistory.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800">
          <Button 
            onClick={undoLastStyleChange}
            variant="secondary"
            icon={<Undo className="w-4 h-4" />}
            fullWidth
          >
            Undo
          </Button>
        </div>
      )}
    </>
  );
}
