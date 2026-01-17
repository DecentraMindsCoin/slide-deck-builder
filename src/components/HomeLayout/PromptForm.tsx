import { Loader2, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PromptFormProps { 
  prompt: string;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PromptForm({ 
  prompt, 
  isLoading, 
  onPromptChange, 
  onSubmit 
}: PromptFormProps) {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Dunedain AI Slides
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Textarea with buttons */}
          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Enter your presentation topic and requirements..."
              className="w-full px-6 py-4 pb-16 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 resize-none transition-all"
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
                className="shadow-lg hover:shadow-xl transition-shadow"
              />
            </div>
          </div>
          
          {/* Loading message */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-zinc-400 mt-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Generating your perfect slide deck...</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
