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
      <div className="flex flex-col h-full">
        {/* Fixed Header */}
        <div className="shrink-0 border-b border-zinc-800 p-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-bg-white/10" />
            <h2 className="font-rajdhani text-lg font-semibold text-white uppercase tracking-tight">Slide Viewer</h2>
          </div>
        </div>

        {/* PreviewTab with its own header and scrollable content */}
        <div className="flex-1 overflow-hidden">
          <PreviewTab slides={slides} currentSlideIndex={currentSlideIndex} onSlideSelect={setCurrentSlideIndex} />
        </div>
      </div>
    </Panel>
  );
}
