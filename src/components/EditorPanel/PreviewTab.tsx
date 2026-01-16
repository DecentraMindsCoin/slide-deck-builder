import type { Slide } from '@/types';

interface PreviewTabProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideSelect: (index: number) => void;
}

export default function PreviewTab({ slides, currentSlideIndex, onSlideSelect }: PreviewTabProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
        All Slides ({slides.length})
      </div>
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          onClick={() => onSlideSelect(index)}
          className={`w-full text-left rounded-lg border transition-all group ${
            index === currentSlideIndex
              ? 'bg-blue-600/20 border-blue-500'
              : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800'
          }`}
        >
          {/* Slide Number Badge */}
          <div className="flex items-start gap-3 p-3">
            <div className={`shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
              index === currentSlideIndex
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-700 text-zinc-400 group-hover:bg-zinc-600'
            }`}>
              {index + 1}
            </div>
            
            {/* Slide Preview */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm mb-1 truncate">
                {slide.title}
              </div>
              <div className="text-xs text-zinc-400 line-clamp-2">
                {slide.content.map(c => c.text).join(' • ')}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
