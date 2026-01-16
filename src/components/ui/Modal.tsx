'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { PanelType } from '@/types/store';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  activePanel?: PanelType;
  height?: 'full' | 'auto';
}

const maxWidthClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[95vw]',
};

export default function Modal({
  children,
  isOpen,
  onClose,
  title,
  maxWidth = 'xl',
  activePanel = null,
  height = 'full',
}: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate modal positioning based on active panel
  const modalLeftClass = activePanel ? 'left-96' : 'left-16';

  return (
    <div 
      className={`fixed inset-0 z-40 flex items-center justify-center py-[5vh] px-4 sm:px-12 transition-all duration-300 ${modalLeftClass}`}
    >
      {/* Backdrop - Covers full screen */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        style={{ left: 0 }}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-zinc-900 rounded-lg shadow-2xl border border-zinc-800 ${maxWidthClasses[maxWidth]} w-full ${
          height === 'full' ? 'h-[90vh]' : 'max-h-[90vh]'
        } flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <Button
              onClick={onClose}
              variant="icon"
              icon={<X className="w-5 h-5" />}
              aria-label="Close modal"
            />
          </div>
        )}

        {/* Close button (when no title) */}
        {!title && (
          <Button
            onClick={onClose}
            variant="icon"
            icon={<X className="w-5 h-5" />}
            className="absolute top-4 right-4 z-10"
            aria-label="Close modal"
          />
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}