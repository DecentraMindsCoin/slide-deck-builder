import { useState, useEffect, useRef } from 'react';
import { Undo, Redo, Plus, MousePointerClick } from 'lucide-react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import AddElementPopover from '@/components/AddElementPopover';
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
  const updateTitleStyle = useSlideDeckStore((state) => state.updateTitleStyle);
  const updateSlide = useSlideDeckStore((state) => state.updateSlide);
  const currentSlideIndex = useSlideDeckStore((state) => state.currentSlideIndex);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    if (showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAddMenu]);

  // Get the selected element's current style
  const getSelectedElementStyle = () => {
    if (!selectedElement || !slideDeck) return null;
    const slide = slideDeck.slides[currentSlideIndex];
    if (!slide) return null;
    
    // If slide is selected, return empty style object
    if (selectedElement.contentIndex === 'slide') return {};
    
    // If title is selected, return title style
    if (selectedElement.contentIndex === 'title') return slide.titleStyle || {};
    
    const content = slide.content[selectedElement.contentIndex as number];
    return content?.style || {};
  };

  const handleAddParagraph = () => {
    if (!slideDeck) return;
    const slide = slideDeck.slides[currentSlideIndex];
    const newContent = [...slide.content, { type: "paragraph" as const, text: "" }];
    updateSlide(slide.id, slide.title, newContent);
    setShowAddMenu(false);
  };

  const handleAddBullet = () => {
    if (!slideDeck) return;
    const slide = slideDeck.slides[currentSlideIndex];
    const newContent = [...slide.content, { type: "bullet" as const, text: "" }];
    updateSlide(slide.id, slide.title, newContent);
    setShowAddMenu(false);
  };

  // Get current style from store
  const currentStyle = getSelectedElementStyle();
  
  // Slide-level styling
  const updateSlideBackground = useSlideDeckStore((state) => state.updateSlideBackground);
  const styleHistory = useSlideDeckStore((state) => state.styleHistory);
  const redoHistory = useSlideDeckStore((state) => state.redoHistory);
  const undoLastStyleChange = useSlideDeckStore((state) => state.undoLastStyleChange);
  const redoLastStyleChange = useSlideDeckStore((state) => state.redoLastStyleChange);
  
  const getCurrentSlide = () => {
    if (!slideDeck) return null;
    return slideDeck.slides[currentSlideIndex];
  };
  
  // Helper functions to update styles directly in store
  const handleStyleChange = (styleUpdate: Partial<any>) => {
    if (!selectedElement) return;
    
    if (selectedElement.contentIndex === 'title') {
      updateTitleStyle(selectedElement.slideId, styleUpdate);
    } else if (typeof selectedElement.contentIndex === 'number') {
      updateElementStyle(selectedElement.slideId, selectedElement.contentIndex, styleUpdate);
    }
  };
  
  const handleSlideBackgroundChange = (backgroundColor: string) => {
    if (!selectedElement || selectedElement.contentIndex !== 'slide') return;
    updateSlideBackground(selectedElement.slideId, backgroundColor);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="shrink-0 p-4 pb-0 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            All Controls
          </div>
          <div className="relative" ref={addMenuRef}>
            <Button
              onClick={() => setShowAddMenu(!showAddMenu)}
              variant="primary"
              icon={<Plus className="w-3 h-3" />}
              size="sm"
              className="text-xs"
            >
              Add Element
            </Button>
            
            {/* Add Element Popover */}
            {showAddMenu && (
              <AddElementPopover
                onAddParagraph={handleAddParagraph}
                onAddBullet={handleAddBullet}
              />
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      {!selectedElement ? (
        <EmptyState
          icon={MousePointerClick}
          heading="No Selection"
          message="Select an element or the slide background to edit its properties"
        />
      ) : selectedElement.contentIndex === 'slide' ? (
        // Slide-level controls
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
          <SlideBackgroundControls
            slideBackgroundColor={getCurrentSlide()?.backgroundColor || SLIDE_DEFAULTS.BACKGROUND_COLOR}
            setSlideBackgroundColor={handleSlideBackgroundChange}
          />
        </div>
      ) : (
        // Element-level controls
        <div className="flex-1 overflow-y-auto p-4 pb-20">
        <FontStyleControls
          fontFamily={currentStyle?.fontFamily || SLIDE_DEFAULTS.FONT_FAMILY}
          setFontFamily={(fontFamily) => handleStyleChange({ fontFamily })}
          fontSize={currentStyle?.fontSize || SLIDE_DEFAULTS.FONT_SIZE}
          setFontSize={(fontSize) => handleStyleChange({ fontSize })}
          fontWeight={currentStyle?.fontWeight || SLIDE_DEFAULTS.FONT_WEIGHT}
          setFontWeight={(fontWeight) => handleStyleChange({ fontWeight })}
          fontStyle={currentStyle?.fontStyle || SLIDE_DEFAULTS.FONT_STYLE}
          setFontStyle={(fontStyle) => handleStyleChange({ fontStyle })}
          textDecoration={currentStyle?.textDecoration || SLIDE_DEFAULTS.TEXT_DECORATION}
          setTextDecoration={(textDecoration) => handleStyleChange({ textDecoration })}
        />

        <div className="border-t border-zinc-800/50 my-6" />

        <ColorControls
          color={currentStyle?.color || SLIDE_DEFAULTS.TEXT_COLOR}
          setColor={(color) => handleStyleChange({ color })}
          backgroundColor={currentStyle?.backgroundColor || SLIDE_DEFAULTS.TRANSPARENT}
          setBackgroundColor={(backgroundColor) => handleStyleChange({ backgroundColor })}
        />

        <div className="border-t border-zinc-800/50 my-6" />

        <AlignmentControls
          textAlign={currentStyle?.textAlign || SLIDE_DEFAULTS.TEXT_ALIGN}
          setTextAlign={(textAlign) => handleStyleChange({ textAlign })}
        />

        <div className="border-t border-zinc-800/50 my-6" />

        <SpacingControls
          lineHeight={currentStyle?.lineHeight || SLIDE_DEFAULTS.LINE_HEIGHT}
          setLineHeight={(lineHeight) => handleStyleChange({ lineHeight })}
          letterSpacing={currentStyle?.letterSpacing || SLIDE_DEFAULTS.LETTER_SPACING}
          setLetterSpacing={(letterSpacing) => handleStyleChange({ letterSpacing })}
        />
        </div>
      )}

      {/* Fixed Footer with Undo/Redo Buttons */}
      {(styleHistory.length > 0 || redoHistory.length > 0) && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-zinc-900 border-t border-zinc-800">
          <div className="flex gap-2">
            <Button 
              onClick={undoLastStyleChange}
              disabled={styleHistory.length === 0}
              variant="secondary"
              icon={<Undo className="w-4 h-4" />}
              className="flex-1 py-2"
            >
              Undo
            </Button>
            <Button 
              onClick={redoLastStyleChange}
              disabled={redoHistory.length === 0}
              variant="secondary"
              icon={<Redo className="w-4 h-4" />}
              className="flex-1 py-2"
            >
              Redo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
