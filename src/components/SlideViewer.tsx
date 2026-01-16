'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Check, X, Home } from 'lucide-react';
import Button from '@/components/shared/Button';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import type { Slide, SlideContent, SlideViewerProps } from '@/types';

export default function SlideViewer({
  deckTitle,
  slides,
  onUpdateSlide,
  onReset,
  currentSlideIndex,
  onSlideChange,
}: SlideViewerProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const selectedElement = useSlideDeckStore((state) => state.selectedElement);
  const setSelectedElement = useSlideDeckStore((state) => state.setSelectedElement);
  const editableRefs = useRef<{ [key: number]: HTMLElement | null }>({});
  
  // Use external index if provided, otherwise use internal
  const currentIndex = currentSlideIndex !== undefined ? currentSlideIndex : internalIndex;
  const setCurrentIndex = onSlideChange || setInternalIndex;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState<SlideContent[]>([]);

  const currentSlide = slides[currentIndex];

  // Focus and place cursor at end when element is selected
  useEffect(() => {
    if (selectedElement && selectedElement.contentIndex !== 'slide' && typeof selectedElement.contentIndex === 'number') {
      const element = editableRefs.current[selectedElement.contentIndex];
      if (element) {
        element.focus();
        // Place cursor at end
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [selectedElement]);

  // Handle inline text editing - only on blur to preserve cursor position
  const handleTextEdit = (index: number, element: HTMLElement) => {
    const newText = element.textContent || '';
    const updatedContent = currentSlide.content.map((item, idx) => 
      idx === index ? { ...item, text: newText } : item
    );
    onUpdateSlide(currentSlide.id, currentSlide.title, updatedContent);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingTitle || isEditingContent) return;

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < slides.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length, isEditingTitle, isEditingContent]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Sync internal index with external when it changes
  useEffect(() => {
    if (currentSlideIndex !== undefined) {
      setInternalIndex(currentSlideIndex);
    }
  }, [currentSlideIndex]);

  const startEditingTitle = () => {
    setEditedTitle(currentSlide.title);
    setIsEditingTitle(true);
  };

  const saveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateSlide(currentSlide.id, editedTitle.trim(), currentSlide.content);
      setIsEditingTitle(false);
    }
  };

  const cancelTitleEdit = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  const startEditingContent = () => {
    setEditedContent([...currentSlide.content]);
    setIsEditingContent(true);
  };

  const saveContent = () => {
    onUpdateSlide(currentSlide.id, currentSlide.title, editedContent);
    setIsEditingContent(false);
  };

  const cancelContentEdit = () => {
    setIsEditingContent(false);
    setEditedContent([]);
  };

  const updateContentItem = (index: number, text: string) => {
    const newContent = [...editedContent];
    newContent[index] = { ...newContent[index], text };
    setEditedContent(newContent);
  };

  const addContentItem = (type: 'paragraph' | 'bullet') => {
    setEditedContent([...editedContent, { type, text: '' }]);
  };

  const removeContentItem = (index: number) => {
    setEditedContent(editedContent.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{deckTitle}</h1>
          {/* <Button onClick={onReset} variant="ghost" icon={<X className="w-4 h-4" />}>
            Close
          </Button> */}
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full max-w-5xl mx-auto h-full flex items-center">
          <div 
            className={`border border-zinc-800 rounded-2xl shadow-2xl p-12 w-full min-h-[500px] flex flex-col cursor-pointer transition-all ${
              selectedElement?.contentIndex === 'slide' && selectedElement?.slideId === currentSlide.id
                ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950'
                : 'hover:ring-1 hover:ring-zinc-700'
            }`}
            style={{
              backgroundColor: currentSlide.backgroundColor || '#18181b',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedElement({ slideId: currentSlide.id, contentIndex: 'slide' });
              }
            }}
          >
            <div className="mb-8">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 text-4xl font-bold text-white bg-transparent border-b-2 border-zinc-600 focus:border-zinc-500 focus:outline-none"
                    autoFocus
                  />
                  <Button onClick={saveTitle} size="sm" variant="primary" className="bg-green-600 hover:bg-green-700">
                    <Check className="w-5 h-5" />
                  </Button>
                  <Button onClick={cancelTitleEdit} size="sm" variant="secondary">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold text-white">
                    {currentSlide.title}
                  </h2>
                  <Button onClick={startEditingTitle} variant="ghost" size="sm">
                    <Edit2 className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1">
              {isEditingContent ? (
                <div className="space-y-4">
                  {editedContent.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {item.type === 'bullet' && (
                        <span className="text-zinc-400 mt-2">•</span>
                      )}
                      <textarea
                        value={item.text}
                        onChange={(e) => updateContentItem(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 resize-none"
                        rows={2}
                      />
                      <Button
                        onClick={() => removeContentItem(index)}
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => addContentItem('bullet')} variant="secondary" size="sm">
                      + Bullet
                    </Button>
                    <Button onClick={() => addContentItem('paragraph')} variant="secondary" size="sm">
                      + Paragraph
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button
                      onClick={saveContent}
                      variant="primary"
                      icon={<Check className="w-4 h-4" />}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={cancelContentEdit}
                      variant="secondary"
                      icon={<X className="w-4 h-4" />}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="space-y-4"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setSelectedElement({ slideId: currentSlide.id, contentIndex: 'slide' });
                    }
                  }}
                >
                  {currentSlide.content.map((item, index) => {
                    const isSelected = selectedElement?.slideId === currentSlide.id && selectedElement?.contentIndex === index;
                    const style = item.style || {};
                    
                    return (
                      <div 
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement({ slideId: currentSlide.id, contentIndex: index });
                        }}
                        className={`cursor-text transition-all rounded p-2 -m-2 ${
                          isSelected ? 'border-2 border-dashed border-blue-500 bg-blue-500/5' : 'hover:bg-zinc-800/30'
                        }`}
                      >
                        {item.type === 'bullet' ? (
                          <div className="flex items-start gap-3">
                            <span className="text-zinc-400 text-2xl mt-1">•</span>
                            <p 
                              ref={(el) => {
                                if (isSelected) editableRefs.current[index] = el;
                              }}
                              contentEditable={isSelected}
                              suppressContentEditableWarning
                              onBlur={(e) => handleTextEdit(index, e.currentTarget)}
                              className={`flex-1 outline-none ${isSelected ? 'cursor-text' : ''}`}
                              style={{
                                fontSize: style.fontSize ? `${style.fontSize}px` : '20px',
                                fontFamily: style.fontFamily || 'inherit',
                                fontWeight: style.fontWeight || 'normal',
                                fontStyle: style.fontStyle || 'normal',
                                textDecoration: style.textDecoration || 'none',
                                color: style.color || 'rgb(212, 212, 216)',
                                backgroundColor: style.backgroundColor || 'transparent',
                                textAlign: style.textAlign || 'left',
                                lineHeight: style.lineHeight || 1.5,
                                letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : '0px',
                              }}
                            >
                              {item.text}
                            </p>
                          </div>
                        ) : (
                          <p 
                            ref={(el) => {
                              if (isSelected) editableRefs.current[index] = el;
                            }}
                            contentEditable={isSelected}
                            suppressContentEditableWarning
                            onBlur={(e) => handleTextEdit(index, e.currentTarget)}
                            className={`leading-relaxed outline-none ${isSelected ? 'cursor-text' : ''}`}
                            style={{
                              fontSize: style.fontSize ? `${style.fontSize}px` : '20px',
                              fontFamily: style.fontFamily || 'inherit',
                              fontWeight: style.fontWeight || 'normal',
                              fontStyle: style.fontStyle || 'normal',
                              textDecoration: style.textDecoration || 'none',
                              color: style.color || 'rgb(212, 212, 216)',
                              backgroundColor: style.backgroundColor || 'transparent',
                              textAlign: style.textAlign || 'left',
                              lineHeight: style.lineHeight || 1.5,
                              letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : '0px',
                            }}
                          >
                            {item.text}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <Button
                    onClick={startEditingContent}
                    variant="ghost"
                    icon={<Edit2 className="w-4 h-4" />}
                    className="mt-6"
                  >
                    Edit Content
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 px-6 py-4 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="secondary"
            size="lg"
            icon={<ChevronLeft className="w-5 h-5" />}
            className="rounded-xl"
          >
            Previous
          </Button>

          <div className="flex flex-col items-center gap-1">
            <div className="text-white text-lg font-semibold">
              {currentIndex + 1} of {slides.length}
            </div>
            <div className="text-zinc-400 text-xs">
              Use arrow keys to navigate
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === slides.length - 1}
            variant="secondary"
            size="lg"
            icon={<ChevronRight className="w-5 h-5" />}
            className="rounded-xl flex-row-reverse"
          >
            Next
          </Button>
        </div>
      </footer>
    </div>
  );
}
