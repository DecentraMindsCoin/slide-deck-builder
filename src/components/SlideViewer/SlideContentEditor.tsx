import { X, Check, Edit2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { SlideContent } from '@/types';

interface SlideContentEditorProps {
  isEditing: boolean;
  editedContent: SlideContent[];
  currentContent: SlideContent[];
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdateItem: (index: number, text: string) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: (type: 'paragraph' | 'bullet') => void;
}

export default function SlideContentEditor({
  isEditing,
  editedContent,
  currentContent,
  onStartEdit,
  onSave,
  onCancel,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}: SlideContentEditorProps) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        {editedContent.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            {item.type === 'bullet' && (
              <span className="text-zinc-400 mt-2">•</span>
            )}
            <textarea
              value={item.text}
              onChange={(e) => onUpdateItem(index, e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 resize-none"
              rows={2}
            />
            <Button
              onClick={() => onRemoveItem(index)}
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <Button onClick={() => onAddItem('bullet')} variant="secondary" size="sm">
            + Bullet
          </Button>
          <Button onClick={() => onAddItem('paragraph')} variant="secondary" size="sm">
            + Paragraph
          </Button>
        </div>
        <div className="flex gap-2 mt-6">
          <Button
            onClick={onSave}
            variant="primary"
            icon={<Check className="w-4 h-4" />}
            className="bg-green-600 hover:bg-green-700"
          >
            Save Changes
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            icon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentContent.length > 0 && (
        <Button
          onClick={onStartEdit}
          variant="ghost"
          icon={<Edit2 className="w-4 h-4" />}
          className="mt-6"
        >
          Edit Content
        </Button>
      )}
    </>
  );
}
