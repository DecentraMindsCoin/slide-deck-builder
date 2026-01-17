'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
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
  const zIndex = panelType === 'editor' || panelType === 'viewer' ? 'z-50' : 'z-20';

  return (
    <div
      className={`fixed left-16 top-0 h-full ${widthClasses[width]} bg-zinc-900 border-r border-zinc-800 flex flex-col ${zIndex} transition-all duration-500 ease-in-out ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Universal Close Button - Top Right Corner */}
      <Button
        onClick={onClose}
        variant="secondary"
        iconOnly
        size="md"
        className="absolute top-3 right-4 z-10"
        title="Close Panel"
        icon={<X className="w-4 h-4" />}
      />

      {/* Optional Title */}
      {title && (
        <div className="p-4 border-b border-zinc-800 shrink-0">
          <h2 className="font-rajdhani text-white text-lg font-semibold uppercase tracking-tight">{title}</h2>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
    </div>
  );
}
