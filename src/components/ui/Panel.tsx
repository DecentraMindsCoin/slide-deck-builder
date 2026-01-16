'use client';

import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  const zIndex = panelType === 'editor' ? 'z-50' : 'z-20';
  const closeIcon = panelType === 'editor' ? ChevronRight : ChevronLeft;
  const CloseIcon = closeIcon;

  return (
    <div
      className={`fixed left-16 top-0 h-full ${widthClasses[width]} bg-zinc-900 border-r border-zinc-800 flex flex-col ${zIndex} transition-all duration-300`}
    >
      {/* Toggle Button - Right Edge */}
      <button
        onClick={onClose}
        className="absolute -right-10 top-4 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors z-30"
        title={`Close ${panelType === 'editor' ? 'Editor' : 'History'}`}
      >
        <CloseIcon className="w-4 h-4 text-zinc-400" />
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
