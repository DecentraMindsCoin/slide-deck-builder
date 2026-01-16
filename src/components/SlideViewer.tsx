'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Check, X, Home } from 'lucide-react';
import type { Slide, SlideContent, SlideViewerProps } from '@/types';

export default function SlideViewer({
  deckTitle,
  slides,
  onUpdateSlide,
  onReset,
}: SlideViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState<SlideContent[]>([]);

  const currentSlide = slides[currentIndex];

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
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex flex-col">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{deckTitle}</h1>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            New Deck
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-2xl shadow-2xl p-12 min-h-[500px] flex flex-col">
            <div className="mb-8">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 text-4xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={saveTitle}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={cancelTitleEdit}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold text-gray-900">
                    {currentSlide.title}
                  </h2>
                  <button
                    onClick={startEditingTitle}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1">
              {isEditingContent ? (
                <div className="space-y-4">
                  {editedContent.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {item.type === 'bullet' && (
                        <span className="text-indigo-600 mt-2">•</span>
                      )}
                      <textarea
                        value={item.text}
                        onChange={(e) => updateContentItem(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                      <button
                        onClick={() => removeContentItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => addContentItem('bullet')}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    >
                      + Bullet
                    </button>
                    <button
                      onClick={() => addContentItem('paragraph')}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    >
                      + Paragraph
                    </button>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={saveContent}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={cancelContentEdit}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentSlide.content.map((item, index) => (
                    <div key={index}>
                      {item.type === 'bullet' ? (
                        <div className="flex items-start gap-3">
                          <span className="text-indigo-600 text-2xl mt-1">•</span>
                          <p className="text-xl text-gray-700 flex-1">{item.text}</p>
                        </div>
                      ) : (
                        <p className="text-xl text-gray-700 leading-relaxed">
                          {item.text}
                        </p>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={startEditingContent}
                    className="mt-6 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Content
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-white text-lg font-semibold">
              {currentIndex + 1} of {slides.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === slides.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 text-center text-gray-400 text-sm">
            Use arrow keys to navigate • Click edit icons to modify content
          </div>
        </div>
      </div>
    </div>
  );
}
