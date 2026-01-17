import { SLIDE_DEFAULTS } from '@/constants/slides';
import type { SlideContent } from '@/types';

interface SlideContentItemProps {
  item: SlideContent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onTextEdit: (index: number, element: HTMLElement) => void;
  editableRef: (el: HTMLElement | null) => void;
}

export default function SlideContentItem({
  item,
  index,
  isSelected,
  onSelect,
  onTextEdit,
  editableRef,
}: SlideContentItemProps) {
  const style = item.style || {};

  const textStyle = {
    fontSize: style.fontSize ? `${style.fontSize}px` : `${SLIDE_DEFAULTS.FONT_SIZE}px`,
    fontFamily: style.fontFamily || SLIDE_DEFAULTS.FONT_FAMILY,
    fontWeight: style.fontWeight || SLIDE_DEFAULTS.FONT_WEIGHT,
    fontStyle: style.fontStyle || SLIDE_DEFAULTS.FONT_STYLE,
    textDecoration: style.textDecoration || SLIDE_DEFAULTS.TEXT_DECORATION,
    color: style.color || SLIDE_DEFAULTS.TEXT_COLOR,
    backgroundColor: style.backgroundColor || SLIDE_DEFAULTS.TRANSPARENT,
    textAlign: style.textAlign || SLIDE_DEFAULTS.TEXT_ALIGN,
    lineHeight: style.lineHeight || SLIDE_DEFAULTS.LINE_HEIGHT,
    letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : `${SLIDE_DEFAULTS.LETTER_SPACING}px`,
  };

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`cursor-text transition-all rounded p-2 -m-2 ${
        isSelected ? 'border-2 border-dashed border-blue-500 bg-blue-500/5' : 'hover:bg-zinc-800/30'
      }`}
    >
      {item.type === 'bullet' ? (
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-1" style={{ color: style.color || SLIDE_DEFAULTS.TEXT_COLOR }}>•</span>
          <p 
            ref={(el) => {
              if (isSelected) editableRef(el);
            }}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => onTextEdit(index, e.currentTarget)}
            className={`flex-1 outline-none ${isSelected ? 'cursor-text' : ''}`}
            style={textStyle}
          >
            {item.text}
          </p>
        </div>
      ) : (
        <p 
          ref={(el) => {
            if (isSelected) editableRef(el);
          }}
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={(e) => onTextEdit(index, e.currentTarget)}
          className={`leading-relaxed outline-none ${isSelected ? 'cursor-text' : ''}`}
          style={textStyle}
        >
          {item.text}
        </p>
      )}
    </div>
  );
}
