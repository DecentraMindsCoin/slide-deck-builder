interface SpacingControlsProps {
  lineHeight: number;
  setLineHeight: (value: number) => void;
  letterSpacing: number;
  setLetterSpacing: (value: number) => void;
}

export default function SpacingControls({
  lineHeight,
  setLineHeight,
  letterSpacing,
  setLetterSpacing,
}: SpacingControlsProps) {
  return (
    <div>
      <div className="font-rajdhani text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        Spacing
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-zinc-300 mb-2 block">Line Height: {lineHeight.toFixed(1)}</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={lineHeight}
            onChange={(e) => setLineHeight(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-300 mb-2 block">Letter Spacing: {letterSpacing}px</label>
          <input
            type="range"
            min="-2"
            max="10"
            step="0.5"
            value={letterSpacing}
            onChange={(e) => setLetterSpacing(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
