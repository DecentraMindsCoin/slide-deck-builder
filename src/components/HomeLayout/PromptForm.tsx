import { Loader2, ArrowRight } from 'lucide-react';
import { useRef, useImperativeHandle, forwardRef } from 'react';
import Button from '@/components/ui/Button';

interface PromptFormProps { 
  prompt: string;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface PromptFormRef {
  focus: () => void;
}

const PromptForm = forwardRef<PromptFormRef, PromptFormProps>(({ 
  prompt, 
  isLoading, 
  onPromptChange, 
  onSubmit 
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    }
  }));
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span className="font-rajdhani text-white font-black tracking-tight uppercase">
              Dunedain AI Slides
            </span>
          </h1>
          <p className="text-lg text-white/70 font-medium max-w-2xl mx-auto">
            Transform your ideas into stunning presentations instantly. 
            Powered by AI to create professional slide decks in seconds.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Textarea with glassmorphism */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="prompt"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Enter your presentation topic and requirements..."
              className="w-full px-6 py-4 pb-16 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 resize-none transition-all backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              rows={6}
              disabled={isLoading}
            />
            
            {/* Submit button at bottom-right */}
            <div className="absolute right-4 bottom-4">
              <Button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                variant="primary"
                size="sm"
                iconOnly
                icon={isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
                title="Generate slides"
                className="shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              />
            </div>
          </div>
          
          {/* Loading message with glassmorphism */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-white/80 mt-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-3 px-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-semibold">Generating your custom slide deck...</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
});

PromptForm.displayName = 'PromptForm';

export default PromptForm;
