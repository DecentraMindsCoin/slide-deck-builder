import FontStyleControls from '@/components/EditorPanel/controls/FontStyleControls';
import ColorControls from '@/components/EditorPanel/controls/ColorControls';
import AlignmentControls from '@/components/EditorPanel/controls/AlignmentControls';
import SpacingControls from '@/components/EditorPanel/controls/SpacingControls';
import SlideBackgroundControls from '@/components/EditorPanel/controls/SlideBackgroundControls';

interface StyleControlsPopoverProps {
  // Font controls
  fontFamily: string;
  setFontFamily: (value: string) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  fontWeight: 'normal' | 'bold';
  setFontWeight: (value: 'normal' | 'bold') => void;
  fontStyle: 'normal' | 'italic';
  setFontStyle: (value: 'normal' | 'italic') => void;
  textDecoration: 'none' | 'underline';
  setTextDecoration: (value: 'none' | 'underline') => void;
  
  // Color controls
  color: string;
  setColor: (value: string) => void;
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
  
  // Alignment controls
  textAlign: 'left' | 'center' | 'right';
  setTextAlign: (value: 'left' | 'center' | 'right') => void;
  
  // Spacing controls
  lineHeight: number;
  setLineHeight: (value: number) => void;
  letterSpacing: number;
  setLetterSpacing: (value: number) => void;
  
  // Slide background (optional - only shown when slide is selected)
  slideBackgroundColor?: string;
  setSlideBackgroundColor?: (value: string) => void;
  isSlideSelected?: boolean;
}

export default function StyleControlsPopover({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  fontWeight,
  setFontWeight,
  fontStyle,
  setFontStyle,
  textDecoration,
  setTextDecoration,
  color,
  setColor,
  backgroundColor,
  setBackgroundColor,
  textAlign,
  setTextAlign,
  lineHeight,
  setLineHeight,
  letterSpacing,
  setLetterSpacing,
  slideBackgroundColor,
  setSlideBackgroundColor,
  isSlideSelected,
}: StyleControlsPopoverProps) {
  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-[70vh] overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Slide Background - Only show when slide is selected */}
        {isSlideSelected && slideBackgroundColor && setSlideBackgroundColor && (
          <SlideBackgroundControls
            slideBackgroundColor={slideBackgroundColor}
            setSlideBackgroundColor={setSlideBackgroundColor}
          />
        )}
        
        {/* Font Style Controls */}
        {!isSlideSelected && (
          <>
            <FontStyleControls
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              fontSize={fontSize}
              setFontSize={setFontSize}
              fontWeight={fontWeight}
              setFontWeight={setFontWeight}
              fontStyle={fontStyle}
              setFontStyle={setFontStyle}
              textDecoration={textDecoration}
              setTextDecoration={setTextDecoration}
            />
            
            <div className="border-t border-zinc-700" />
            
            <ColorControls
              color={color}
              setColor={setColor}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
            />
            
            <div className="border-t border-zinc-700" />
            
            <AlignmentControls
              textAlign={textAlign}
              setTextAlign={setTextAlign}
            />
            
            <div className="border-t border-zinc-700" />
            
            <SpacingControls
              lineHeight={lineHeight}
              setLineHeight={setLineHeight}
              letterSpacing={letterSpacing}
              setLetterSpacing={setLetterSpacing}
            />
          </>
        )}
      </div>
    </div>
  );
}
