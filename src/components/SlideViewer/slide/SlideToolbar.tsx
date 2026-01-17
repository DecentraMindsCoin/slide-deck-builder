'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Copy, Download, Undo, Redo, Palette } from 'lucide-react';
import Button from '@/components/ui/Button';
import AddElementPopover from '@/components/AddElementPopover';
import StyleControlsPopover from '@/components/StyleControlsPopover';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { SLIDE_DEFAULTS } from '@/constants/slides';
import type { SelectedElement } from '@/types/store';

interface SlideToolbarProps {
  onAddParagraph: () => void;
  onAddBullet: () => void;
  onAddSlide?: () => void;
  onDeleteSlide?: () => void;
  onDuplicateSlide?: () => void;
  onDelete?: () => void;
  onDuplicateElement?: () => void;
  onExport?: () => void;
  selectedElement?: SelectedElement | null;
}

export default function SlideToolbar({
  onAddParagraph,
  onAddBullet,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onDelete,
  onDuplicateElement,
  onExport,
  selectedElement,
}: SlideToolbarProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const styleMenuRef = useRef<HTMLDivElement>(null);
  
  // Get store state and actions
  const slideDeck = useSlideDeckStore((state) => state.slideDeck);
  const currentSlideIndex = useSlideDeckStore((state) => state.currentSlideIndex);
  const updateElementStyle = useSlideDeckStore((state) => state.updateElementStyle);
  const updateTitleStyle = useSlideDeckStore((state) => state.updateTitleStyle);
  const updateSlideBackground = useSlideDeckStore((state) => state.updateSlideBackground);
  const styleHistory = useSlideDeckStore((state) => state.styleHistory);
  const redoHistory = useSlideDeckStore((state) => state.redoHistory);
  const undoLastStyleChange = useSlideDeckStore((state) => state.undoLastStyleChange);
  const redoLastStyleChange = useSlideDeckStore((state) => state.redoLastStyleChange);

  const hasSelectedContent = selectedElement && typeof selectedElement.contentIndex === 'number';
  const hasSelectedTitle = selectedElement && selectedElement.contentIndex === 'title';
  const hasSelectedSlide = selectedElement && selectedElement.contentIndex === 'slide';
  const showDeleteButton = hasSelectedContent || hasSelectedTitle || hasSelectedSlide;
  const showFormatButton = hasSelectedContent || hasSelectedTitle || hasSelectedSlide;
  const showUndoRedo = (styleHistory && styleHistory.length > 0) || (redoHistory && redoHistory.length > 0);

  // Get selected element's current style
  const getSelectedElementStyle = () => {
    if (!selectedElement || !slideDeck) return null;
    const slide = slideDeck.slides[currentSlideIndex];
    if (!slide) return null;
    
    if (selectedElement.contentIndex === 'slide') return {};
    if (selectedElement.contentIndex === 'title') return slide.titleStyle || {};
    
    const content = slide.content[selectedElement.contentIndex as number];
    return content?.style || {};
  };

  const currentStyle = getSelectedElementStyle();
  
  // Style state management
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
  
  const getCurrentSlide = () => {
    if (!slideDeck) return null;
    return slideDeck.slides[currentSlideIndex];
  };
  const [slideBackgroundColor, setSlideBackgroundColor] = useState(
    getCurrentSlide()?.backgroundColor || SLIDE_DEFAULTS.BACKGROUND_COLOR
  );

  // Update local state when selection changes
  const isInitialLoad = useRef(true);
  const skipNextUpdate = useRef(false);
  
  useEffect(() => {
    // Set flag to skip the next auto-apply update
    skipNextUpdate.current = true;
    
    if (selectedElement?.contentIndex === 'slide') {
      const slide = getCurrentSlide();
      setSlideBackgroundColor(slide?.backgroundColor || SLIDE_DEFAULTS.BACKGROUND_COLOR);
    } else {
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

  // Auto-apply element styles
  useEffect(() => {
    if (!selectedElement || selectedElement.contentIndex === 'slide') return;
    
    // Skip the first update after loading styles to prevent creating history
    if (skipNextUpdate.current) {
      skipNextUpdate.current = false;
      return;
    }
    
    const style = {
      fontSize, fontFamily, fontWeight, fontStyle, textDecoration,
      color, backgroundColor, textAlign, lineHeight, letterSpacing,
    };
    
    if (selectedElement.contentIndex === 'title') {
      updateTitleStyle(selectedElement.slideId, style);
    } else if (typeof selectedElement.contentIndex === 'number') {
      updateElementStyle(selectedElement.slideId, selectedElement.contentIndex, style);
    }
  }, [fontSize, fontFamily, fontWeight, fontStyle, textDecoration, color, backgroundColor, textAlign, lineHeight, letterSpacing]);

  // Auto-apply slide background
  useEffect(() => {
    if (!selectedElement || selectedElement.contentIndex !== 'slide') return;
    updateSlideBackground(selectedElement.slideId, slideBackgroundColor);
  }, [slideBackgroundColor]);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
      if (styleMenuRef.current && !styleMenuRef.current.contains(event.target as Node)) {
        setShowStyleMenu(false);
      }
    };

    if (showAddMenu || showStyleMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAddMenu, showStyleMenu]);

  const handleAddParagraph = () => {
    onAddParagraph();
    setShowAddMenu(false);
  };

  const handleAddBullet = () => {
    onAddBullet();
    setShowAddMenu(false);
  };

  return (
    <div className="flex items-center justify-between gap-2 py-3 px-6 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center gap-1">
        {/* Add Element Button with Popover */}
        <div className="relative" ref={addMenuRef}>
          <Button
            onClick={() => setShowAddMenu(!showAddMenu)}
            variant="icon"
            icon={<Plus className="w-4 h-4" />}
            title="Add Element"
            className="hover:bg-zinc-800"
          />
          
          {/* Add Element Popover */}
          {showAddMenu && (
            <AddElementPopover
              onAddParagraph={handleAddParagraph}
              onAddBullet={handleAddBullet}
            />
          )}
        </div>
        
        {/* Format Button with Style Controls */}
        {showFormatButton && (
          <>
            <div className="w-px h-6 bg-zinc-700 mx-1" />
            <div className="relative" ref={styleMenuRef}>
              <Button
                onClick={() => setShowStyleMenu(!showStyleMenu)}
                variant="icon"
                icon={<Palette className="w-4 h-4" />}
                title="Format"
                className="hover:bg-zinc-800"
              />
              
              {showStyleMenu && (
                <StyleControlsPopover
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
                  color={color}
                  setColor={setColor}
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                  textAlign={textAlign}
                  setTextAlign={setTextAlign}
                  lineHeight={lineHeight}
                  setLineHeight={setLineHeight}
                  letterSpacing={letterSpacing}
                  setLetterSpacing={setLetterSpacing}
                  slideBackgroundColor={slideBackgroundColor}
                  setSlideBackgroundColor={setSlideBackgroundColor}
                  isSlideSelected={!!hasSelectedSlide}
                />
              )}
            </div>
          </>
        )}
        
        {/* Duplicate & Delete Selected Element */}
        {showDeleteButton && (
          <>
            <div className="w-px h-6 bg-zinc-700 mx-1" />
            
            {/* Duplicate Element Button - Only for content elements */}
            {hasSelectedContent && onDuplicateElement && (
              <Button
                onClick={onDuplicateElement}
                variant="icon"
                icon={<Copy className="w-4 h-4" />}
                title="Duplicate Element"
                className="hover:bg-zinc-800"
              />
            )}
            
            {/* Delete Button */}
            <Button
              onClick={hasSelectedTitle ? undefined : onDelete}
              disabled={!!hasSelectedTitle || !!(hasSelectedSlide && !onDelete)}
              variant="icon"
              icon={<Trash2 className="w-4 h-4" />}
              title={
                hasSelectedTitle 
                  ? "Cannot delete slide title" 
                  : hasSelectedSlide && !onDelete
                  ? "Cannot delete last slide"
                  : hasSelectedSlide
                  ? "Delete Slide"
                  : "Delete Selected Element"
              }
              className={hasSelectedTitle || (hasSelectedSlide && !onDelete) ? "opacity-50 cursor-not-allowed" : "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"}
            />
          </>
        )}
        
        {/* Slide Actions */}
        {(onAddSlide || onDuplicateSlide || onDeleteSlide) && (
          <div className="w-px h-6 bg-zinc-700 mx-1" />
        )}
        {onAddSlide && (
          <Button
            onClick={onAddSlide}
            variant="icon"
            icon={<Plus className="w-4 h-4" />}
            title="Add New Slide"
            className="hover:bg-zinc-800"
          />
        )}
        {onDuplicateSlide && (
          <Button
            onClick={onDuplicateSlide}
            variant="icon"
            icon={<Copy className="w-4 h-4" />}
            title="Duplicate Slide"
            className="hover:bg-zinc-800"
          />
        )}
        {onDeleteSlide && (
          <Button
            onClick={onDeleteSlide}
            variant="icon"
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete Slide"
            className="text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
          />
        )}
        
        {/* Undo/Redo Buttons */}
        {showUndoRedo && (
          <>
            <div className="w-px h-6 bg-zinc-700 mx-1" />
            <Button
              onClick={undoLastStyleChange}
              disabled={!styleHistory || styleHistory.length === 0}
              variant="icon"
              icon={<Undo className="w-4 h-4" />}
              title="Undo Last Change"
              className="hover:bg-zinc-800"
            />
            <Button
              onClick={redoLastStyleChange}
              disabled={!redoHistory || redoHistory.length === 0}
              variant="icon"
              icon={<Redo className="w-4 h-4" />}
              title="Redo Last Change"
              className="hover:bg-zinc-800"
            />
          </>
        )}
      </div>

      {/* Export Button - Far Right */}
      <div className="flex items-center gap-1">
        
        {/* Export Button - Far Right */}
        {onExport && (
          <Button
            onClick={onExport}
            variant="primary"
            icon={<Download className="w-4 h-4" />}
            size="sm"
          >
            Export
          </Button>
        )}
      </div>
    </div>
  );
}
