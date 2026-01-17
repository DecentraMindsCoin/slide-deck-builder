import { Bold, Italic, Underline, Plus, Minus } from 'lucide-react';
import Button from '@/components/ui/Button';
import CustomSelect from '@/components/ui/CustomSelect';
import { FONT_FAMILIES, FONT_SIZE_LIMITS, TEXT_STYLES } from '@/constants';


interface FontStyleControlsProps {
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
}

export default function FontStyleControls({
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
}: FontStyleControlsProps) {
  return (
    <div>
      <div className="font-rajdhani text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        Text Formatting
      </div>
      <div className="space-y-3">
        {/* Font Family */}
        <CustomSelect
          label="Font Family"
          options={FONT_FAMILIES}
          value={fontFamily}
          onChange={setFontFamily}
        />

        {/* Font Size */}
        <div>
          <label className="text-sm text-zinc-300 mb-2 block">Font Size (px)</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFontSize(Math.max(FONT_SIZE_LIMITS.MIN, fontSize - 1))}
              className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-colors flex items-center justify-center text-white"
              title="Decrease font size"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min={FONT_SIZE_LIMITS.MIN}
              max={FONT_SIZE_LIMITS.MAX}
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
            <button
              type="button"
              onClick={() => setFontSize(Math.min(FONT_SIZE_LIMITS.MAX, fontSize + 1))}
              className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-colors flex items-center justify-center text-white"
              title="Increase font size"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Text Style Buttons */}
        <div>
          <label className="text-sm text-zinc-300 mb-2 block">Text Style</label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={fontWeight === TEXT_STYLES.FONT_WEIGHT.BOLD ? 'primary' : 'secondary'}
              icon={<Bold className="w-4 h-4" />}
              iconOnly
              onClick={() => setFontWeight(
                fontWeight === TEXT_STYLES.FONT_WEIGHT.BOLD 
                  ? TEXT_STYLES.FONT_WEIGHT.NORMAL 
                  : TEXT_STYLES.FONT_WEIGHT.BOLD
              )}
              className="w-full"
            />
            <Button
              type="button"
              variant={fontStyle === TEXT_STYLES.FONT_STYLE.ITALIC ? 'primary' : 'secondary'}
              icon={<Italic className="w-4 h-4" />}
              iconOnly
              onClick={() => setFontStyle(
                fontStyle === TEXT_STYLES.FONT_STYLE.ITALIC 
                  ? TEXT_STYLES.FONT_STYLE.NORMAL 
                  : TEXT_STYLES.FONT_STYLE.ITALIC
              )}
              className="w-full"
            />
            <Button
              type="button"
              variant={textDecoration === TEXT_STYLES.TEXT_DECORATION.UNDERLINE ? 'primary' : 'secondary'}
              icon={<Underline className="w-4 h-4" />}
              iconOnly
              onClick={() => setTextDecoration(
                textDecoration === TEXT_STYLES.TEXT_DECORATION.UNDERLINE 
                  ? TEXT_STYLES.TEXT_DECORATION.NONE 
                  : TEXT_STYLES.TEXT_DECORATION.UNDERLINE
              )}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}