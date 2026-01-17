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
  zIndex?: number;
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
  zIndex = 40,
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
  const backdropLeftClass = activePanel ? 'left-96' : 'left-0';

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center py-[5vh] px-4 sm:px-12 transition-all duration-300 ${modalLeftClass}`}
      style={{ zIndex }}
    >
      {/* Left side backdrop - Covers sidebar and panel area */}
      {activePanel && (
        <div
          className="absolute top-0 left-0 bottom-0 w-96 bg-black/70 backdrop-blur-sm pointer-events-none"
        />
      )}
      
      {/* Main backdrop - Starts after panel area to not cover panel close buttons */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${backdropLeftClass}`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 ${maxWidthClasses[maxWidth]} w-full ${
          height === 'full' ? 'h-[90vh]' : 'max-h-[90vh]'
        } flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-tight">{title}</h2>
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

        {/* Body - Separated with padding and subtle background */}
        <div className="overflow-y-auto flex-1 bg-zinc-950/30 m-4 rounded-2xl border border-zinc-800">{children}</div>
      </div>
    </div>
  );
}