import { Download } from 'lucide-react';
import Button from '@/components/ui/Button';

interface SlideHeaderProps {
  deckTitle: string;
  onExport: () => void;
}

export default function SlideHeader({ deckTitle, onExport }: SlideHeaderProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 shrink-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{deckTitle}</h1>
        <Button 
          onClick={onExport} 
          variant="primary" 
          icon={<Download className="w-4 h-4" />}
        >
          Export to PowerPoint
        </Button>
      </div>
    </header>
  );
}
