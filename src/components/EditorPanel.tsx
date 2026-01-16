'use client';

import { useState } from 'react';
import { Eye, Settings, Bold, Italic, Underline } from 'lucide-react';
import Panel from '@/components/shared/Panel';
import Button from '@/components/shared/Button';
import { useUIStore } from '@/store/useUIStore';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
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
  return (
    <div className="p-4 space-y-6">
      {/* Text Formatting */}
      <div>
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Text Formatting
        </div>
        <div className="space-y-3">
          {/* Font Family */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Font Family</label>
            <select className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600">
              <option>Inter</option>
              <option>Helvetica</option>
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Georgia</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Font Size</label>
            <input
              type="number"
              defaultValue={16}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
          </div>

          {/* Text Style Buttons */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Style</label>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1">
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                <Italic className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                <Underline className="w-4 h-4" />
              </Button>
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
                defaultValue="#ffffff"
                className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                defaultValue="#ffffff"
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
                defaultValue="#1a1a1a"
                className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                defaultValue="#1a1a1a"
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
          <Button variant="secondary" size="sm">
            Left
          </Button>
          <Button variant="secondary" size="sm">
            Center
          </Button>
          <Button variant="secondary" size="sm">
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
            <label className="text-sm text-zinc-300 mb-2 block">Line Height</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              defaultValue="1.5"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Letter Spacing</label>
            <input
              type="range"
              min="-2"
              max="10"
              step="0.5"
              defaultValue="0"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
