'use client';

import { Settings } from 'lucide-react';
import Panel from '@/components/ui/Panel';
import { useUIStore } from '@/store/useUIStore';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import EditTab from './EditTab';

export default function EditorPanel() {
  const activePanel = useUIStore((state) => state.activePanel);
  const togglePanel = useUIStore((state) => state.togglePanel);
  const isOpen = activePanel === 'editor';
  const slideDeck = useSlideDeckStore((state) => state.slideDeck);

  if (!slideDeck) return null;

  return (
    <Panel
      panelType="editor"
      isOpen={isOpen}
      onClose={() => togglePanel('editor')}
      width="md"
    >
      {/* Header */}
      <div className="border-b border-zinc-800 shrink-0 p-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-bg-white/10" />
          <h2 className="font-rajdhani text-lg font-semibold text-white uppercase tracking-tight">Style Editor</h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <EditTab />
      </div>
    </Panel>
  );
}

