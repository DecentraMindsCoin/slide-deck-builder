import { Type, List } from 'lucide-react';

interface AddElementPopoverProps {
  onAddParagraph: () => void;
  onAddBullet: () => void;
}

export default function AddElementPopover({ onAddParagraph, onAddBullet }: AddElementPopoverProps) {
  return (
    <div className="absolute top-full left-0 mt-2 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50">
      <button
        onClick={onAddParagraph}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-zinc-700 transition-colors rounded-t-lg"
      >
        <Type className="w-4 h-4" />
        Text
      </button>
      <button
        onClick={onAddBullet}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-zinc-700 transition-colors rounded-b-lg"
      >
        <List className="w-4 h-4" />
        Bullet
      </button>
    </div>
  );
}
