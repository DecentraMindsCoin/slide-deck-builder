'use client';

import { Eye } from 'lucide-react';
import Panel from '@/components/ui/Panel';
import { useUIStore } from '@/store/useUIStore';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import PreviewTab from '@/components/EditorPanel/PreviewTab';

export default function ViewerPanel() {
  const activePanel = useUIStore((state) => state.activePanel);
  const togglePanel = useUIStore((state) => state.togglePanel);
  const isOpen = activePanel === 'viewer';
  const slideDeck = useSlideDeckStore((state) => state.slideDeck);
  const currentSlideIndex = useSlideDeckStore((state) => state.currentSlideIndex);
  const setCurrentSlideIndex = useSlideDeckStore((state) => state.setCurrentSlideIndex);

  if (!slideDeck) return null;

  const slides = slideDeck.slides;

  return (
    <Panel
      panelType="viewer"
      isOpen={isOpen}
      onClose={() => togglePanel('viewer')}
      width="md"
    >
      {/* Header */}
      <div className="border-b border-zinc-800 shrink-0 p-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-white">Slide Viewer</h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <PreviewTab slides={slides} currentSlideIndex={currentSlideIndex} onSlideSelect={setCurrentSlideIndex} />
      </div>
    </Panel>
  );
}
