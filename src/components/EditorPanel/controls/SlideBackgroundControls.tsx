interface SlideBackgroundControlsProps {
  slideBackgroundColor: string;
  setSlideBackgroundColor: (value: string) => void;
}

export default function SlideBackgroundControls({
  slideBackgroundColor,
  setSlideBackgroundColor,
}: SlideBackgroundControlsProps) {
  return (
    <div>
      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        Slide Background
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-zinc-300 mb-2 block">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={slideBackgroundColor}
              onChange={(e) => setSlideBackgroundColor(e.target.value)}
              className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={slideBackgroundColor}
              onChange={(e) => setSlideBackgroundColor(e.target.value)}
              placeholder="#18181b"
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
