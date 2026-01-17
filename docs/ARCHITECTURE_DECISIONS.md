# Architecture Decisions & Best Practices

This document explains the architectural choices made in the AI Slide Deck Builder and why they represent current best practices for Next.js applications.

---

## Table of Contents

1. [Next.js App Router vs React Router](#nextjs-app-router-vs-react-router)
2. [Client Components with 'use client'](#client-components-with-use-client)
3. [State Management with useState](#state-management-with-usestate)
4. [Environment Variable Management](#environment-variable-management)
5. [Type System Organization](#type-system-organization)
6. [Utility Functions in lib/](#utility-functions-in-lib)
7. [Component Architecture](#component-architecture)

---

## Next.js App Router vs React Router

### Decision
We use **Next.js App Router** (file-based routing) instead of React Router.

### Why This is Best Practice

#### 1. **Built-in Routing**
Next.js provides automatic routing based on file structure:
```
app/
├── page.tsx              # Route: /
├── about/
│   └── page.tsx         # Route: /about
└── slides/[id]/
    └── page.tsx         # Route: /slides/123
```

No manual route configuration needed. This is:
- ✅ Less code to maintain
- ✅ More intuitive for developers
- ✅ Follows Next.js conventions
- ✅ Automatically code-splits by route

#### 2. **Server Components by Default**
Next.js App Router enables React Server Components:
- Better performance (less JavaScript sent to client)
- Direct database access without API routes
- Automatic data fetching optimization
- Better SEO out of the box

#### 3. **Modern React Patterns**
The App Router is built for React 18+ features:
- Streaming SSR
- Suspense boundaries
- Server Actions
- Parallel routes

#### 4. **Single Page App Pattern**
For our application, we use state-based view switching:
```typescript
if (state === 'error') return <ErrorDisplay />
if (state === 'viewing') return <SlideViewer />
return <PromptInput />
```

This is appropriate because:
- ✅ No need for URL-based navigation
- ✅ Simpler state management
- ✅ Faster transitions (no route changes)
- ✅ Better for wizard-like flows

### When to Use React Router Instead
- Standalone React app (not Next.js)
- Need client-side only routing
- Migrating from Create React App

### Conclusion
**Next.js App Router is the modern standard** for Next.js applications. It provides better performance, SEO, and developer experience than React Router.

---

## Client Components with 'use client'

### Decision
All interactive components use the `'use client'` directive.

### Why This is Best Practice

#### 1. **Required for Interactivity**
Client Components are necessary when using:
```typescript
// React Hooks
const [state, setState] = useState();
useEffect(() => { ... });

// Browser APIs
window.addEventListener('keydown', handler);

// Event Handlers
onClick={handleClick}
onChange={handleChange}
```

#### 2. **Next.js 13+ Default is Server Components**
Without `'use client'`, components are Server Components by default:
- ❌ Cannot use hooks
- ❌ Cannot use browser APIs
- ❌ Cannot have event handlers
- ✅ Can fetch data directly
- ✅ Better for SEO

#### 3. **Our App is Fully Interactive**
Every component in our app needs interactivity:
- `PromptInput` - Form state, event handlers
- `SlideViewer` - Multiple state variables, keyboard events
- `ErrorDisplay` - Click handlers
- `page.tsx` - State management, API calls

Therefore, `'use client'` is **required and correct**.

#### 4. **Performance Considerations**
While Server Components are more performant, they're not suitable for:
- Real-time interactions
- Complex state management
- Browser-dependent features

Our app prioritizes **user experience** over server-side rendering benefits.

### Best Practice Pattern
```typescript
'use client';  // At the top of interactive components

import { useState } from 'react';

export default function Component() {
  const [state, setState] = useState();
  // ... interactive logic
}
```

### Conclusion
**Using `'use client'` for interactive components is the correct Next.js pattern.** It's not a workaround—it's the intended architecture for client-side interactivity.

---

## State Management with useState

### Decision
We use React's built-in `useState` hook instead of external state management libraries (Redux, Zustand, etc.).

### Why This is Best Practice

#### 1. **Appropriate Complexity**
Our app's state is:
- Contained within a single page
- Not shared across many components
- Simple parent-to-child prop passing

```typescript
// page.tsx - Single source of truth
const [state, setState] = useState<AppState>('input');
const [slideDeck, setSlideDeck] = useState<SlideDeck | null>(null);
const [error, setError] = useState<string>('');
```

#### 2. **No Prop Drilling Issues**
Component hierarchy is shallow:
```
page.tsx (state)
  ├─ PromptInput (props: onSubmit, isLoading)
  ├─ SlideViewer (props: deck, onUpdate, onReset)
  └─ ErrorDisplay (props: error, onRetry)
```

Only 1-2 levels deep = no prop drilling problem.

#### 3. **Performance is Sufficient**
- Small component tree
- Minimal re-renders
- No performance bottlenecks
- Fast state updates

#### 4. **Easier to Understand**
```typescript
// Clear and simple
const [prompt, setPrompt] = useState('');

// vs Zustand
const prompt = useStore(state => state.prompt);
const setPrompt = useStore(state => state.setPrompt);
```

### When to Upgrade to Zustand/Redux
Consider external state management when:
- ❌ State shared across 5+ components
- ❌ Deep prop drilling (3+ levels)
- ❌ Complex state logic
- ❌ Need middleware (persistence, devtools)
- ❌ Performance issues from re-renders

### Scalability Path
If the app grows, migration is straightforward:
```typescript
// Current
const [slideDeck, setSlideDeck] = useState<SlideDeck | null>(null);

// Future with Zustand
const slideDeck = useSlideDeckStore(state => state.deck);
const setSlideDeck = useSlideDeckStore(state => state.setDeck);
```

### Conclusion
**useState is the right choice for this app's complexity.** Following the principle of "use the simplest solution that works," we avoid over-engineering while maintaining clean, maintainable code.

---

## Environment Variable Management

### Decision
We use `process.env` with `NEXT_PUBLIC_` prefix and a utility helper function.

### Why This is Best Practice

#### 1. **Next.js Environment Variable Rules**
```typescript
// ❌ Won't work in client components
const API_KEY = process.env.API_KEY;

// ✅ Works in client components
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
```

Next.js requires `NEXT_PUBLIC_` prefix for variables accessed in client-side code.

#### 2. **Type-Safe Helper Function**
```typescript
// lib/env.ts
export const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
```

Benefits:
- ✅ Clear error messages
- ✅ Type safety (returns string, not string | undefined)
- ✅ Reusable across the app
- ✅ Fails fast if misconfigured

#### 3. **No Hardcoded Values**
```typescript
// ❌ Bad - hardcoded
const API_KEY = '8CB1636C-9CD3-4020-8939-8C44B44B4670';

// ✅ Good - from environment
const API_KEY = getEnvVar('NEXT_PUBLIC_API_KEY');
```

#### 4. **Security Considerations**
**Important**: `NEXT_PUBLIC_` variables are **exposed to the browser**.

For this app:
- ✅ Acceptable for demo/assessment
- ✅ API key is already in requirements
- ⚠️ For production, use API routes to hide keys

Production pattern:
```typescript
// app/api/generate-slides/route.ts (server-side)
const API_KEY = process.env.API_KEY; // No NEXT_PUBLIC_ prefix
```

#### 5. **Documentation with env.example**
```bash
# env.example
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_API_KEY=your-key-here
```

Developers can:
```bash
cp env.example .env.local
# Edit .env.local with actual values
```

### Conclusion
**Using `NEXT_PUBLIC_` with a helper function is the correct Next.js pattern** for client-side environment variables. It's explicit, type-safe, and follows framework conventions.

---

## Type System Organization

### Decision
All TypeScript types are consolidated in a single `src/types/index.ts` file.

### Why This is Best Practice

#### 1. **Appropriate for Project Size**
```
src/types/
└── index.ts    # ~95 lines, 4 sections
```

For a project with:
- 3 components
- 1 API service
- 1 main page

A single file is **simpler and more maintainable** than multiple files.

#### 2. **Clear Organization with Sections**
```typescript
// ============================================================================
// SLIDE TYPES
// ============================================================================
export interface Slide { ... }

// ============================================================================
// API TYPES
// ============================================================================
export interface ApiResponse { ... }
```

Benefits:
- ✅ Easy to navigate
- ✅ Clear categorization
- ✅ No circular dependencies
- ✅ Single import path

#### 3. **Simple Imports**
```typescript
// One import for all types
import type { Slide, SlideDeck, ApiResponse, AppState } from '@/types';

// vs multiple files
import type { Slide } from '@/types/slide';
import type { ApiResponse } from '@/types/api';
import type { AppState } from '@/types/state';
```

#### 4. **When to Split**
Consider splitting when:
- File exceeds 500+ lines
- Types become domain-specific
- Multiple teams working on different domains
- Need to share types across packages

### Conclusion
**A single consolidated types file is the pragmatic choice** for projects of this size. It reduces complexity while maintaining clear organization.

---

## Utility Functions in lib/

### Decision
Reusable utility functions are organized in `src/lib/` directory.

### Why This is Best Practice

#### 1. **Separation of Concerns**
```
src/
├── lib/
│   ├── env.ts       # Environment utilities
│   ├── utils.ts     # Common utilities
│   └── index.ts     # Central export
├── services/
│   └── api.ts       # API calls
└── components/
    └── ...          # UI components
```

Each directory has a clear purpose:
- `lib/` - Pure utility functions
- `services/` - External integrations
- `components/` - UI components

#### 2. **Reusability**
```typescript
// Used in api.ts
import { getEnvVar } from '@/lib';

// Can be used anywhere else
import { getEnvVar, cn, delay } from '@/lib';
```

#### 3. **Testability**
Pure functions in `lib/` are easy to unit test:
```typescript
describe('getEnvVar', () => {
  it('should throw error if variable is missing', () => {
    expect(() => getEnvVar('MISSING_VAR')).toThrow();
  });
});
```

#### 4. **Common Utilities Included**
```typescript
// lib/utils.ts
export const cn = (...classes) => classes.filter(Boolean).join(' ');
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const truncate = (text: string, length: number) => ...;
export const generateId = () => `${Date.now()}-${Math.random()}`;
```

These are commonly needed across applications.

#### 5. **Follows Next.js Conventions**
Many Next.js projects use `lib/` for utilities:
- shadcn/ui uses `lib/utils.ts`
- Next.js examples use `lib/`
- Community standard pattern

### Conclusion
**Organizing utilities in `lib/` is a Next.js best practice** that promotes code reuse, testability, and maintainability.

---

## Component Architecture

### Decision
We use functional components with hooks and props-based communication.

### Why This is Best Practice

#### 1. **Modern React Pattern**
```typescript
// ✅ Functional component with hooks
export default function Component({ prop }: Props) {
  const [state, setState] = useState();
  return <div>...</div>;
}

// ❌ Class component (legacy)
class Component extends React.Component {
  state = { ... };
  render() { return <div>...</div>; }
}
```

Functional components are:
- Simpler syntax
- Better performance
- Easier to test
- Support hooks
- React team's recommendation

#### 2. **Props-Based Communication**
```typescript
// Parent (page.tsx)
<SlideViewer
  deckTitle={slideDeck.deckTitle}
  slides={slideDeck.slides}
  onUpdateSlide={handleUpdateSlide}
  onReset={handleReset}
/>

// Child (SlideViewer.tsx)
export default function SlideViewer({
  deckTitle,
  slides,
  onUpdateSlide,
  onReset,
}: SlideViewerProps) {
  // Use props
}
```

Benefits:
- ✅ Clear data flow (top-down)
- ✅ Easy to trace state changes
- ✅ Type-safe with TypeScript
- ✅ Testable in isolation

#### 3. **Single Responsibility**
Each component has one job:
- `PromptInput` - Collect user input
- `SlideViewer` - Display and edit slides
- `ErrorDisplay` - Show errors
- `page.tsx` - Orchestrate state

#### 4. **Composition Over Inheritance**
```typescript
// ✅ Composition
<SlideViewer>
  <SlideContent />
  <SlideNavigation />
</SlideViewer>

// ❌ Inheritance (not used in React)
class SlideViewer extends BaseViewer { ... }
```

#### 5. **TypeScript Props Interfaces**
```typescript
export interface SlideViewerProps {
  deckTitle: string;
  slides: Slide[];
  onUpdateSlide: (id: string, title: string, content: SlideContent[]) => void;
  onReset: () => void;
}
```

Provides:
- Autocomplete in IDE
- Type checking
- Documentation
- Refactoring safety

### Conclusion
**Functional components with props and hooks are the React standard.** This architecture is simple, performant, and follows React best practices.

---

## Summary

### Key Architectural Decisions

| Decision | Rationale | Best Practice |
|----------|-----------|---------------|
| **Next.js App Router** | Built-in routing, better performance, modern React features | ✅ Yes |
| **'use client' directive** | Required for interactive components with hooks | ✅ Yes |
| **useState for state** | Appropriate complexity, no prop drilling | ✅ Yes |
| **NEXT_PUBLIC_ env vars** | Required for client-side access in Next.js | ✅ Yes |
| **Single types file** | Simple, maintainable for project size | ✅ Yes |
| **lib/ for utilities** | Reusable, testable, follows conventions | ✅ Yes |
| **Functional components** | Modern React, better performance, hooks support | ✅ Yes |

### Principles Applied

1. **Use the simplest solution that works** - No over-engineering
2. **Follow framework conventions** - Next.js patterns
3. **Type safety** - TypeScript throughout
4. **Separation of concerns** - Clear directory structure
5. **Maintainability** - Clean, documented code

### Future Scalability

This architecture can easily scale:
- Add Zustand if state becomes complex
- Split types file if it grows beyond 500 lines
- Add API routes to hide sensitive keys
- Implement file-based routing for multiple pages
- Add testing with current structure

---

**Last Updated**: January 15, 2026  
**Next.js Version**: 16.1.2  
**React Version**: 19.2.3
