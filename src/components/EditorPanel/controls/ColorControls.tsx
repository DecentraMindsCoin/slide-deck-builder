interface ColorControlsProps {
  color: string;
  setColor: (value: string) => void;
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
}

export default function ColorControls({
  color,
  setColor,
  backgroundColor,
  setBackgroundColor,
}: ColorControlsProps) {
  return (
    <div>
      <div className="font-rajdhani text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        Colors
      </div>
      <div className="space-y-3">
        {/* Text Color */}
        <div>
          <label className="text-sm text-zinc-300 mb-2 block">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="text-sm text-zinc-300 mb-2 block">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={backgroundColor === 'transparent' ? '#000000' : backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              placeholder="transparent"
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
