'use client';

import { Plus, Type, List, Trash2, Copy, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { SelectedElement } from '@/types/store';

interface SlideToolbarProps {
  onAddParagraph: () => void;
  onAddBullet: () => void;
  onAddSlide?: () => void;
  onDeleteSlide?: () => void;
  onDuplicateSlide?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  selectedElement?: SelectedElement | null;
}

export default function SlideToolbar({
  onAddParagraph,
  onAddBullet,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onDelete,
  onExport,
  selectedElement,
}: SlideToolbarProps) {
  const hasSelectedContent = selectedElement && typeof selectedElement.contentIndex === 'number';
  const hasSelectedTitle = selectedElement && selectedElement.contentIndex === 'title';
  const hasSelectedSlide = selectedElement && selectedElement.contentIndex === 'slide';
  const showDeleteButton = hasSelectedContent || hasSelectedTitle || hasSelectedSlide;

  return (
    <div className="flex items-center justify-between gap-2 py-3 px-4 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center gap-1">
        {/* Add Content Items */}
        <Button
          onClick={onAddParagraph}
          variant="icon"
          icon={<Type className="w-4 h-4" />}
          title="Add Paragraph"
          className="hover:bg-zinc-800"
        />
        <Button
          onClick={onAddBullet}
          variant="icon"
          icon={<List className="w-4 h-4" />}
          title="Add Bullet Point"
          className="hover:bg-zinc-800"
        />
        
        {/* Delete Selected Element */}
        {showDeleteButton && (
          <>
            <div className="w-px h-6 bg-zinc-700 mx-1" />
            <Button
              onClick={hasSelectedTitle ? undefined : onDelete}
              disabled={!!hasSelectedTitle || !!(hasSelectedSlide && !onDelete)}
              variant="icon"
              icon={<Trash2 className="w-4 h-4" />}
              title={
                hasSelectedTitle 
                  ? "Cannot delete slide title" 
                  : hasSelectedSlide && !onDelete
                  ? "Cannot delete last slide"
                  : hasSelectedSlide
                  ? "Delete Slide"
                  : "Delete Selected Element"
              }
              className={hasSelectedTitle || (hasSelectedSlide && !onDelete) ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-800 hover:text-red-400"}
            />
          </>
        )}
        
        {/* Slide Actions */}
        {(onAddSlide || onDuplicateSlide || onDeleteSlide) && (
          <div className="w-px h-6 bg-zinc-700 mx-1" />
        )}
        {onAddSlide && (
          <Button
            onClick={onAddSlide}
            variant="icon"
            icon={<Plus className="w-4 h-4" />}
            title="Add New Slide"
            className="hover:bg-zinc-800"
          />
        )}
        {onDuplicateSlide && (
          <Button
            onClick={onDuplicateSlide}
            variant="icon"
            icon={<Copy className="w-4 h-4" />}
            title="Duplicate Slide"
            className="hover:bg-zinc-800"
          />
        )}
        {onDeleteSlide && (
          <Button
            onClick={onDeleteSlide}
            variant="icon"
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete Slide"
            className="hover:bg-zinc-800 hover:text-red-400"
          />
        )}
      </div>

      {/* Export Button - Far Right */}
      {onExport && (
        <Button
          onClick={onExport}
          variant="primary"
          icon={<Download className="w-4 h-4" />}
          size="sm"
        >
          Export to PowerPoint
        </Button>
      )}
    </div>
  );
}
