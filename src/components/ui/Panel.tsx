'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { PanelType } from '@/types';

interface PanelProps {
  panelType: Exclude<PanelType, null>;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  width?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const widthClasses = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
};

export default function Panel({
  panelType,
  isOpen,
  onClose,
  title,
  width = 'md',
  children,
}: PanelProps) {
  if (!isOpen) return null;

  const zIndex = panelType === 'editor' || panelType === 'viewer' ? 'z-50' : 'z-20';

  return (
    <div
      className={`fixed left-16 top-0 h-full ${widthClasses[width]} bg-zinc-900 border-r border-zinc-800 flex flex-col ${zIndex} transition-all duration-300`}
    >
      {/* Universal Close Button - Top Right Corner */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors z-10"
        title="Close Panel"
      >
        <X className="w-4 h-4 text-zinc-400" />
      </button>

      {/* Optional Title */}
      {title && (
        <div className="p-4 border-b border-zinc-800 shrink-0">
          <h2 className="text-white text-lg font-semibold">{title}</h2>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
    </div>
  );
}
