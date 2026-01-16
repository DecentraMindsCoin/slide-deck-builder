'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, Settings, Bold, Italic, Underline, Undo, Check } from 'lucide-react';
import Panel from '@/components/shared/Panel';
import Button from '@/components/shared/Button';
import { useUIStore } from '@/store/useUIStore';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import { SLIDE_DEFAULTS } from '@/lib/config';
import type { Slide } from '@/types';

type TabType = 'preview' | 'edit';

export default function EditorPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const activePanel = useUIStore((state) => state.activePanel);
  const togglePanel = useUIStore((state) => state.togglePanel);
  const isOpen = activePanel === 'editor';
  const slideDeck = useSlideDeckStore((state) => state.slideDeck);
  const currentSlideIndex = useSlideDeckStore((state) => state.currentSlideIndex);
  const setCurrentSlideIndex = useSlideDeckStore((state) => state.setCurrentSlideIndex);

  if (!slideDeck) return null;

  const slides = slideDeck.slides;

  return (
    <Panel
      panelType="editor"
      isOpen={isOpen}
      onClose={() => togglePanel('editor')}
      width="md"
    >
      {/* Header with Tabs */}
      <div className="border-b border-zinc-800 shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-zinc-800 text-white border-b-2 border-blue-500'
                : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-medium transition-colors ${
              activeTab === 'edit'
                ? 'bg-zinc-800 text-white border-b-2 border-blue-500'
                : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'preview' ? (
          <PreviewTab slides={slides} currentSlideIndex={currentSlideIndex} onSlideSelect={setCurrentSlideIndex} />
        ) : (
          <EditTab />
        )}
      </div>
    </Panel>
  );
}

// Preview Tab - Slide Thumbnails
function PreviewTab({ slides, currentSlideIndex, onSlideSelect }: { slides: Slide[]; currentSlideIndex: number; onSlideSelect: (index: number) => void }) {
  return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
        All Slides ({slides.length})
      </div>
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          onClick={() => onSlideSelect(index)}
          className={`w-full text-left rounded-lg border transition-all group ${
            index === currentSlideIndex
              ? 'bg-blue-600/20 border-blue-500'
              : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800'
          }`}
        >
          {/* Slide Number Badge */}
          <div className="flex items-start gap-3 p-3">
            <div className={`shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
              index === currentSlideIndex
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-700 text-zinc-400 group-hover:bg-zinc-600'
            }`}>
              {index + 1}
            </div>
            
            {/* Slide Preview */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm mb-1 truncate">
                {slide.title}
              </div>
              <div className="text-xs text-zinc-400 line-clamp-2">
                {slide.content.map(c => c.text).join(' • ')}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// Edit Tab - Formatting Controls
function EditTab() {
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
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Slide Background
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-zinc-300 mb-2 block">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={slideBackgroundColor}
                    onChange={(e) => setSlideBackgroundColor(e.target.value)}
                    className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={slideBackgroundColor}
                    onChange={(e) => setSlideBackgroundColor(e.target.value)}
                    placeholder="#18181b"
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
                  />
                </div>
              </div>
            </div>
          </div>
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
      {/* Text Formatting */}
      <div>
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Text Formatting
        </div>
        <div className="space-y-3">
          {/* Font Family */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Font Family</label>
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
            >
              <option value="inherit">Default</option>
              <option value="Inter">Inter</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Font Size (px)</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min="8"
              max="72"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
          </div>

          {/* Text Style Buttons */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Style</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 px-3 py-2 rounded-lg border transition-colors flex items-center justify-center ${
                  fontWeight === 'bold'
                    ? 'bg-blue-600 border-blue-500 hover:bg-blue-700'
                    : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                }`}
                onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                className={`flex-1 px-3 py-2 rounded-lg border transition-colors flex items-center justify-center ${
                  fontStyle === 'italic'
                    ? 'bg-blue-600 border-blue-500 hover:bg-blue-700'
                    : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                }`}
                onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                className={`flex-1 px-3 py-2 rounded-lg border transition-colors flex items-center justify-center ${
                  textDecoration === 'underline'
                    ? 'bg-blue-600 border-blue-500 hover:bg-blue-700'
                    : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                }`}
                onClick={() => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div>
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Colors
        </div>
        <div className="space-y-3">
          {/* Text Color */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={backgroundColor === 'transparent' ? '#000000' : backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="transparent"
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alignment */}
      <div>
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Alignment
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            className={textAlign === 'left' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            onClick={() => setTextAlign('left')}
          >
            Left
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            className={textAlign === 'center' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            onClick={() => setTextAlign('center')}
          >
            Center
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            className={textAlign === 'right' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            onClick={() => setTextAlign('right')}
          >
            Right
          </Button>
        </div>
      </div>

      {/* Spacing */}
      <div>
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Spacing
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Line Height: {lineHeight.toFixed(1)}</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Letter Spacing: {letterSpacing}px</label>
            <input
              type="range"
              min="-2"
              max="10"
              step="0.5"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
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
