'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Mic, ArrowRight } from 'lucide-react';
import Button from '@/components/shared/Button';
import ExploreTemplates from '@/components/ExploreTemplates';
import type { PromptInputProps } from '@/types';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const appState = useSlideDeckStore((state) => state.appState);

  // Clear prompt when returning to input state (after reset or closing modal)
  useEffect(() => {
    if (appState === 'input' && !isLoading) {
      setPrompt('');
    }
  }, [appState, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleTemplateSelect = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    if (!isLoading) {
      onSubmit(templatePrompt);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-zinc-950">
      {/* Chat Area - Positioned Higher */}
      <div className="h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Dunedain AI Slides
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your presentation topic and requirements..."
              className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 resize-none transition-all"
              rows={3}
              disabled={isLoading}
            />
            <div className="absolute right-4 bottom-4 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-300"
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                variant="secondary"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600"
                title="Generate slides"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                )}
              </Button>
            </div>
          </div>

          </form>
        </div>
      </div>

      {/* Explore Templates Section - Visible Below Chat */}
      <div className="pb-12 -mt-8">
        <ExploreTemplates onSelectTemplate={handleTemplateSelect} />
      </div>
    </div>
  );
}
