import Button from '@/components/ui/Button';

interface AlignmentControlsProps {
  textAlign: 'left' | 'center' | 'right';
  setTextAlign: (value: 'left' | 'center' | 'right') => void;
}

export default function AlignmentControls({
  textAlign,
  setTextAlign,
}: AlignmentControlsProps) {
  return (
    <div>
      <div className="font-rajdhani text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        Alignment
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="secondary" 
          size="sm"
          className={textAlign === 'left' ? 'bg-white/10 hover:bg-blue-700' : ''}
          onClick={() => setTextAlign('left')}
        >
          Left
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          className={textAlign === 'center' ? 'bg-white/10 hover:bg-blue-700' : ''}
          onClick={() => setTextAlign('center')}
        >
          Center
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          className={textAlign === 'right' ? 'bg-white/10 hover:bg-blue-700' : ''}
          onClick={() => setTextAlign('right')}
        >
          Right
        </Button>
      </div>
    </div>
  );
}
