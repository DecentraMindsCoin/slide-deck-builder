'use client';

import { useState, useEffect, useRef } from 'react';
import PromptForm from './PromptForm';
import ExploreTemplates from '@/components/ExploreTemplates';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import type { Template, TemplateTheme } from '@/constants/templates';

interface HomeLayoutProps { 
  onSubmit: (prompt: string, theme?: TemplateTheme) => void;
  isLoading: boolean;
}

export default function HomeLayout({ onSubmit, isLoading }: HomeLayoutProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<TemplateTheme | undefined>(undefined);
  const appState = useSlideDeckStore((state) => state.appState);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clear prompt when returning to input state (after reset or closing modal)
  useEffect(() => {
    if (appState === 'input' && !isLoading) {
      setPrompt('');
    }
  }, [appState, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim(), selectedTheme);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setPrompt(template.prompt);
    setSelectedTheme(template.theme);
    
    // Scroll to top to show prompt and loading state
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (!isLoading) {
      onSubmit(template.prompt, template.theme);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="h-screen overflow-y-auto bg-zinc-950 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/BACKGROUND.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
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
