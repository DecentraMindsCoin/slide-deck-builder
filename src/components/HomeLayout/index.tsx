'use client';

import { useState, useEffect } from 'react';
import PromptForm from './PromptForm';
import ExploreTemplates from '@/components/ExploreTemplates';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';

interface HomeLayoutProps { 
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export default function HomeLayout({ onSubmit, isLoading }: HomeLayoutProps) {
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
      <PromptForm
        prompt={prompt}
        isLoading={isLoading}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
      />
      <div className="pb-12 -mt-8">
        <ExploreTemplates onSelectTemplate={handleTemplateSelect} />
      </div>
    </div>
  );
}
