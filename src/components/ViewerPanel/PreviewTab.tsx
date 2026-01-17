import { Plus, Trash2, Presentation } from 'lucide-react';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import type { Slide } from '@/types';

interface PreviewTabProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideSelect: (index: number) => void;
  isRegenerating?: boolean;
}

export default function PreviewTab({ slides, currentSlideIndex, onSlideSelect, isRegenerating = false }: PreviewTabProps) {
  const addSlide = useSlideDeckStore((state) => state.addSlide);
  const deleteSlide = useSlideDeckStore((state) => state.deleteSlide);

  const handleDeleteSlide = (e: React.MouseEvent, slideId: string) => {
    e.stopPropagation();
    if (slides.length > 1) {
      deleteSlide(slideId);
    }
  };

  if (slides.length === 0) {
    return (
      <>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              All Slides (0)
            </div>
            <Button
              onClick={addSlide}
              variant="primary"
              icon={<Plus className="w-3 h-3" />}
              size="sm"
              className="text-xs"
            >
              Add Slide
            </Button>
          </div>
        </div>
        <EmptyState
          icon={Presentation}
          heading="No Slides"
          message="Click 'Add Slide' to create your first slide"
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Regeneration Overlay */}
      {isRegenerating && (
        <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-zinc-400 text-sm font-medium">
              Regenerating slides...
            </div>
          </div>
        </div>
      )}
      
      {/* Fixed Header */}
      <div className="shrink-0 p-4 pb-0 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            All Slides ({slides.length})
          </div>
          <Button
            onClick={addSlide}
            variant="primary"
            icon={<Plus className="w-3 h-3" />}
            size="sm"
            className="text-xs"
          >
            Add Slide
          </Button>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          onClick={() => onSlideSelect(index)}
          className={`w-full text-left rounded-lg border transition-all group relative cursor-pointer ${
            index === currentSlideIndex
              ? 'bg-white/10 border-white/50'
              : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800'
          }`}
        >
          {/* Slide Number Badge */}
          <div className="flex items-start gap-3 p-3">
            <div className={`shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
              index === currentSlideIndex
                ? 'bg-white/10 text-white'
                : 'bg-zinc-700 text-zinc-400 group-hover:bg-zinc-600'
            }`}>
              {index + 1}
            </div>
            
            {/* Slide Preview */}
            <div className="flex-1 min-w-0">
              <div className="font-rajdhani font-medium text-white text-sm mb-1 truncate uppercase">
                {slide.title}
              </div>
              <div className="text-xs text-zinc-400 line-clamp-2">
                {slide.content.map(c => c.text).join(' • ')}
              </div>
            </div>

            {/* Delete Button - Shows on hover */}
            {slides.length > 1 && (
              <Button
                onClick={(e) => handleDeleteSlide(e, slide.id)}
                variant="ghost"
                iconOnly
                size="sm"
                className="opacity-0 group-hover:opacity-100 hover:bg-red-600/20 shrink-0"
                title="Delete Slide"
                icon={<Trash2 className="w-4 h-4 text-red-400" />}
              />
            )}
          </div>
        </div>
      ))}

      {/* Add New Slide Button */}
      <Button
        onClick={addSlide}
        variant="ghost"
        iconOnly
        className="w-full py-3 border-2 border-dashed border-zinc-700 rounded-lg hover:border-zinc-600 hover:bg-zinc-800/30"
        title="Add New Slide"
        icon={<Plus className="w-5 h-5 text-zinc-600" strokeWidth={2.5} />}
      />
      </div>
    </div>
  );
}
