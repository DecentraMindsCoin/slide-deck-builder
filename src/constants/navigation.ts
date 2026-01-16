// src/constants/navigation.ts
import { FileText, Home, Inbox, Sparkles, Folder } from 'lucide-react';

export const NAV_BUTTONS = [
  { icon: FileText, title: 'All Slides' },
  { icon: Home, title: 'Home' },
  { icon: Inbox, title: 'AI Inbox' },
  { icon: Sparkles, title: 'Hub' },
  { icon: Folder, title: 'AI Drive' },
] as const;