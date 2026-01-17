"use client";

import { useState, useEffect, useRef } from "react";
import { useSlideDeckStore } from "@/store/useSlideDeckStore";
import { exportToPPTX } from "@/lib/slides/exportToPPTX";
import { SLIDE_DEFAULTS } from "@/constants/slides";
import SlideHeader from "@/components/SlideViewer/slide/SlideHeader";
import SlideTitle from "@/components/SlideViewer/slide/SlideTitle";
import SlideContentItem from "@/components/SlideViewer/slide/SlideContentItem";
import SlideFooter from "@/components/SlideViewer/slide/SlideFooter";
import SlideToolbar from "@/components/SlideViewer/slide/SlideToolbar";
import type { Slide, SlideContent } from "@/types";

export interface SlideViewerProps {
  deckTitle: string;
  slides: Slide[];
  onUpdateSlide: (
    slideId: string,
    title: string,
    content: SlideContent[],
  ) => void;
  onReset: () => void;
  currentSlideIndex?: number;
  onSlideChange?: (index: number) => void;
}

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
  const setSelectedElement = useSlideDeckStore(
    (state) => state.setSelectedElement,
  );
  const deleteSlide = useSlideDeckStore((state) => state.deleteSlide);
  const editableRefs = useRef<Record<number | 'title', HTMLElement | null>>({} as Record<number | 'title', HTMLElement | null>);

  // Use external index if provided, otherwise use internal
  const currentIndex =
    currentSlideIndex !== undefined ? currentSlideIndex : internalIndex;
  const setCurrentIndex = onSlideChange || setInternalIndex;

  const currentSlide = slides[currentIndex];

  // Focus and place cursor at end when element is selected
  useEffect(() => {
    if (
      selectedElement &&
      selectedElement.contentIndex !== "slide" &&
      (typeof selectedElement.contentIndex === "number" || selectedElement.contentIndex === 'title')
    ) {
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
    const newText = element.textContent || "";
    const updatedContent = currentSlide.content.map((item, idx) =>
      idx === index ? { ...item, text: newText } : item,
    );
    onUpdateSlide(currentSlide.id, currentSlide.title, updatedContent);
  };

  const handleTitleEdit = (element: HTMLElement) => {
    const newTitle = element.textContent || "";
    if (newTitle.trim()) {
      onUpdateSlide(currentSlide.id, newTitle.trim(), currentSlide.content);
    }
  };

  const handleExportToPPTX = async () => {
    try {
      await exportToPPTX({ deckTitle, slides });
    } catch (error) {
      console.error("Failed to export PowerPoint:", error);
      alert("Failed to export PowerPoint. Please try again.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in a contenteditable field
      const target = e.target as HTMLElement;
      const isEditingText = target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < slides.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedElement && typeof selectedElement.contentIndex === 'number' && !isEditingText) {
        // Only delete element if NOT actively editing text
        e.preventDefault();
        handleDeleteContentItem();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, slides.length, selectedElement]);

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


  const handleAddParagraph = () => {
    const newContent = [...currentSlide.content, { type: "paragraph" as const, text: "" }];
    onUpdateSlide(currentSlide.id, currentSlide.title, newContent);
  };

  const handleAddBullet = () => {
    const newContent = [...currentSlide.content, { type: "bullet" as const, text: "" }];
    onUpdateSlide(currentSlide.id, currentSlide.title, newContent);
  };

  const handleDeleteContentItem = () => {
    if (selectedElement && typeof selectedElement.contentIndex === 'number') {
      const newContent = currentSlide.content.filter((_, idx) => idx !== selectedElement.contentIndex);
      onUpdateSlide(currentSlide.id, currentSlide.title, newContent);
      setSelectedElement(null);
    }
  };

  const handleDeleteSlide = () => {
    if (selectedElement && selectedElement.contentIndex === 'slide' && slides.length > 1) {
      deleteSlide(currentSlide.id);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <SlideHeader deckTitle={deckTitle} />

      {/* Slide Toolbar */}
      <SlideToolbar
        onAddParagraph={handleAddParagraph}
        onAddBullet={handleAddBullet}
        onDelete={
          selectedElement && typeof selectedElement.contentIndex === 'number' 
            ? handleDeleteContentItem 
            : selectedElement && selectedElement.contentIndex === 'slide' && slides.length > 1
            ? handleDeleteSlide
            : undefined
        }
        onExport={handleExportToPPTX}
        selectedElement={selectedElement}
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full max-w-5xl mx-auto h-full flex items-center flex-col">
          <div
            className={`relative border border-zinc-800 shadow-2xl p-12 w-full min-h-[500px] flex flex-col cursor-pointer transition-all ${
              selectedElement?.contentIndex === "slide" &&
              selectedElement?.slideId === currentSlide.id
                ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950"
                : "hover:ring-1 hover:ring-zinc-700"
            }`}
            style={{
              backgroundColor:
                currentSlide.backgroundColor || SLIDE_DEFAULTS.BACKGROUND_COLOR,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedElement({
                  slideId: currentSlide.id,
                  contentIndex: "slide",
                });
              }
            }}
          >
            {/* Slide Counter - Absolute positioned at bottom center */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              {currentIndex + 1} of {slides.length}
            </div>
            <SlideTitle
              title={currentSlide.title}
              titleStyle={currentSlide.titleStyle}
              isSelected={selectedElement?.slideId === currentSlide.id && selectedElement?.contentIndex === 'title'}
              onSelect={() => setSelectedElement({ slideId: currentSlide.id, contentIndex: 'title' })}
              onTextEdit={handleTitleEdit}
              editableRef={(el) => {
                if (el) editableRefs.current['title'] = el;
              }}
            />

            <div className="flex-1">
              <div
                className="space-y-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setSelectedElement({
                      slideId: currentSlide.id,
                      contentIndex: "slide",
                    });
                  }
                }}
              >
                {currentSlide.content.map((item, index) => {
                  const isSelected =
                    selectedElement?.slideId === currentSlide.id &&
                    selectedElement?.contentIndex === index;

                  return (
                    <SlideContentItem
                      key={index}
                      item={item}
                      index={index}
                      isSelected={isSelected}
                      onSelect={() =>
                        setSelectedElement({
                          slideId: currentSlide.id,
                          contentIndex: index,
                        })
                      }
                      onTextEdit={handleTextEdit}
                      editableRef={(el) => {
                        if (el) editableRefs.current[index] = el;
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter
        currentIndex={currentIndex}
        totalSlides={slides.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}
