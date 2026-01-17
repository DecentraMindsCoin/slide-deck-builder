import { Edit2, Check, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SLIDE_DEFAULTS } from '@/constants';

interface SlideTitleProps {
  title: string;
  isEditing: boolean;
  editedTitle: string;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

export default function SlideTitle({
  title,
  isEditing,
  editedTitle,
  onStartEdit,
  onSave,
  onCancel,
  onChange,
}: SlideTitleProps) {
  return (
    <div className="mb-8">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-4xl font-bold bg-transparent border-b-2 border-zinc-400 focus:border-zinc-500 focus:outline-none"
            style={{ color: SLIDE_DEFAULTS.TITLE_COLOR }}
            autoFocus
          />
          <Button onClick={onSave} size="sm" variant="primary" className="bg-green-600 hover:bg-green-700">
            <Check className="w-5 h-5" />
          </Button>
          <Button onClick={onCancel} size="sm" variant="secondary">
            <X className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold" style={{ color: SLIDE_DEFAULTS.TITLE_COLOR }}>
            {title}
          </h2>
          <Button onClick={onStartEdit} variant="ghost" size="sm">
            <Edit2 className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
