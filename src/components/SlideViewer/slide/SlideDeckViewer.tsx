"use client";

import { useState, useEffect, useRef } from "react";
import { useSlideDeckStore } from "@/store/useSlideDeckStore";
import { exportToPPTX } from "@/lib/slides/exportToPPTX";
import { SLIDE_DEFAULTS } from "@/constants/slides";
import SlideHeader from "@/components/SlideViewer/slide/SlideHeader";
import SlideTitle from "@/components/SlideViewer/slide/SlideTitle";
import SlideContentItem from "@/components/SlideViewer/slide/SlideContentItem";
import SlideContentEditor from "@/components/SlideViewer/SlideContentEditor";
import SlideFooter from "@/components/SlideViewer/slide/SlideFooter";
import type { Slide, SlideContent } from "@/types";

export interface SlideViewerProps {
  deckTitle: string;
  slides: Slide[];
  onUpdateSlide: (slideId: string, title: string, content: SlideContent[]) => void;
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
    (state) => state.setSelectedElement
  );
  const editableRefs = useRef<{ [key: number]: HTMLElement | null }>({});

  // Use external index if provided, otherwise use internal
  const currentIndex =
    currentSlideIndex !== undefined ? currentSlideIndex : internalIndex;
  const setCurrentIndex = onSlideChange || setInternalIndex;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState<SlideContent[]>([]);

  const currentSlide = slides[currentIndex];

  // Focus and place cursor at end when element is selected
  useEffect(() => {
    if (
      selectedElement &&
      selectedElement.contentIndex !== "slide" &&
      typeof selectedElement.contentIndex === "number"
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
      idx === index ? { ...item, text: newText } : item
    );
    onUpdateSlide(currentSlide.id, currentSlide.title, updatedContent);
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
      if (isEditingTitle || isEditingContent) return;

      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < slides.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    setEditedTitle("");
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

  const addContentItem = (type: "paragraph" | "bullet") => {
    setEditedContent([...editedContent, { type, text: "" }]);
  };

  const removeContentItem = (index: number) => {
    setEditedContent(editedContent.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col">
      <SlideHeader deckTitle={deckTitle} onExport={handleExportToPPTX} />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full max-w-5xl mx-auto h-full flex items-center">
          <div
            className={`border border-zinc-800 shadow-2xl p-12 w-full min-h-[500px] flex flex-col cursor-pointer transition-all ${
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
            <SlideTitle
              title={currentSlide.title}
              isEditing={isEditingTitle}
              editedTitle={editedTitle}
              onStartEdit={startEditingTitle}
              onSave={saveTitle}
              onCancel={cancelTitleEdit}
              onChange={setEditedTitle}
            />

            <div className="flex-1">
              {isEditingContent ? (
                <SlideContentEditor
                  isEditing={isEditingContent}
                  editedContent={editedContent}
                  currentContent={currentSlide.content}
                  onStartEdit={startEditingContent}
                  onSave={saveContent}
                  onCancel={cancelContentEdit}
                  onUpdateItem={updateContentItem}
                  onRemoveItem={removeContentItem}
                  onAddItem={addContentItem}
                />
              ) : (
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
                  <SlideContentEditor
                    isEditing={false}
                    editedContent={editedContent}
                    currentContent={currentSlide.content}
                    onStartEdit={startEditingContent}
                    onSave={saveContent}
                    onCancel={cancelContentEdit}
                    onUpdateItem={updateContentItem}
                    onRemoveItem={removeContentItem}
                    onAddItem={addContentItem}
                  />
                </div>
              )}
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
