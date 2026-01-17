import { SLIDE_DEFAULTS } from '@/constants';
import type { SlideContent } from '@/types';

interface SlideTitleProps {
  title: string;
  titleStyle?: SlideContent['style'];
  isSelected: boolean;
  onSelect: () => void;
  onTextEdit: (element: HTMLElement) => void;
  editableRef: (el: HTMLElement | null) => void;
}

export default function SlideTitle({
  title,
  titleStyle,
  isSelected,
  onSelect,
  onTextEdit,
  editableRef,
}: SlideTitleProps) {
  const style = titleStyle || {};
  
  const titleTextStyle = {
    fontSize: style.fontSize ? `${style.fontSize}px` : '36px',
    fontFamily: style.fontFamily || SLIDE_DEFAULTS.FONT_FAMILY,
    fontWeight: style.fontWeight || 'bold',
    fontStyle: style.fontStyle || SLIDE_DEFAULTS.FONT_STYLE,
    textDecoration: style.textDecoration || SLIDE_DEFAULTS.TEXT_DECORATION,
    color: style.color || SLIDE_DEFAULTS.TITLE_COLOR,
    backgroundColor: style.backgroundColor || SLIDE_DEFAULTS.TRANSPARENT,
    textAlign: style.textAlign || SLIDE_DEFAULTS.TEXT_ALIGN,
    lineHeight: style.lineHeight || SLIDE_DEFAULTS.LINE_HEIGHT,
    letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : `${SLIDE_DEFAULTS.LETTER_SPACING}px`,
  };

  return (
    <div className="mb-8">
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`cursor-text transition-all rounded p-2 -m-2 ${
          isSelected ? 'border-2 border-dashed border-blue-500 bg-blue-500/5' : 'hover:bg-zinc-800/30'
        }`}
      >
        <h2 
          ref={(el) => {
            if (isSelected) editableRef(el);
          }}
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={(e) => onTextEdit(e.currentTarget)}
          className={`text-4xl outline-none ${isSelected ? 'cursor-text' : ''}`}
          style={titleTextStyle}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
