import { FileText, Trash2, FolderOpen } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { formatRelativeTime, truncate } from '@/lib/utils/utils';
import type { SlideDeck } from '@/types';

interface HistoryItem {
  id: string;
  deck: SlideDeck;
  prompt: string;
  createdAt: number;
}

interface HistoryListProps {
  history: HistoryItem[];
  currentDeckId: string | null;
  onLoadDeck: (id: string) => void;
  onDeleteClick: (e: React.MouseEvent, id: string, title: string) => void;
}

export default function HistoryList({
  history,
  currentDeckId,
  onLoadDeck,
  onDeleteClick,
}: HistoryListProps) {
  if (history.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        heading="No Decks Yet"
        message="Generate your first slide deck to see it appear here"
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-2 p-4">
      {history.map((item) => (
        <div
          key={item.id}
          className={`group p-3 rounded-lg cursor-pointer transition-colors ${
            currentDeckId === item.id
              ? 'bg-blue-600/20 border border-blue-600/50'
              : 'bg-zinc-800/50 hover:bg-zinc-800 border border-transparent'
          }`}
          onClick={() => onLoadDeck(item.id)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="text-white text-sm font-medium truncate">
                  {item.deck.deckTitle}
                </span>
              </div>
              <p className="text-zinc-400 text-xs mb-1 line-clamp-2">
                {truncate(item.prompt, 40)}
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>{item.deck.slides.length} slides</span>
                <span>•</span>
                <span>{formatRelativeTime(item.createdAt)}</span>
              </div>
            </div>
            <button
              onClick={(e) => onDeleteClick(e, item.id, item.deck.deckTitle)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600/20 rounded transition-all"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
