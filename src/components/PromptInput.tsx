'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4">
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
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                title="Voice input"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors"
                title="Generate slides"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
