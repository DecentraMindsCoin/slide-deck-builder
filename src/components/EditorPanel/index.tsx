'use client';

import { useState } from 'react';
import { Eye, Settings } from 'lucide-react';
import Panel from '@/components/ui/Panel';
import { useUIStore } from '@/store/useUIStore';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import PreviewTab from './PreviewTab';
import EditTab from './EditTab';

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

