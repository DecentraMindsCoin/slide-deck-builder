'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PromptForm, { type PromptFormRef } from './PromptForm';
import ExploreTemplates from '@/components/ExploreTemplates';
import { useSlideDeckStore } from '@/store/useSlideDeckStore';
import type { Template, TemplateTheme } from '@/constants/templates';

interface HomeLayoutProps { 
  onSubmit: (prompt: string, theme?: TemplateTheme) => void;
  isLoading: boolean;
}

export interface HomeLayoutRef {
  focusPrompt: () => void;
}

const HomeLayout = forwardRef<HomeLayoutRef, HomeLayoutProps>(({ onSubmit, isLoading }, ref) => {
  const [prompt, setPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<TemplateTheme | undefined>(undefined);
  const appState = useSlideDeckStore((state) => state.appState);
  const containerRef = useRef<HTMLDivElement>(null);
  const promptFormRef = useRef<PromptFormRef>(null);

  useImperativeHandle(ref, () => ({
    focusPrompt: () => {
      promptFormRef.current?.focus();
    }
  }));

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
      className="h-screen overflow-y-auto relative"
    >
      <PromptForm
        ref={promptFormRef}
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
});

HomeLayout.displayName = 'HomeLayout';

export default HomeLayout;
