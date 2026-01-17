# Design Decisions

This document explains the key technical decisions made during the development of the AI Slide Deck Builder, including the reasoning behind technology choices, architectural patterns, and implementation strategies.

---

## Table of Contents

1. [State Management](#state-management)
2. [UI Architecture](#ui-architecture)
3. [Component Design](#component-design)
4. [Styling Approach](#styling-approach)
5. [User Experience](#user-experience)
6. [Performance Optimizations](#performance-optimizations)

---

## State Management

### Why Zustand?

**Decision**: Use Zustand for global state management instead of React Context, Redux, or other alternatives.

**Reasoning**:
- **Minimal Boilerplate**: Zustand requires significantly less code than Redux while providing similar capabilities
- **No Provider Hell**: Unlike Context API, Zustand doesn't require wrapping components in providers
- **TypeScript Support**: First-class TypeScript support with excellent type inference
- **DevTools Integration**: Built-in Redux DevTools support for debugging
- **Persistence**: Easy integration with localStorage via middleware
- **Performance**: Only re-renders components that subscribe to changed state slices

**Implementation**:
```typescript
// Two separate stores for separation of concerns
- useSlideDeckStore: Manages slide deck data, history, and editing state
- useUIStore: Manages UI state (active panels, modals)
```

### Store Architecture

#### SlideDeckStore (`src/store/useSlideDeckStore.ts`)

**Purpose**: Central source of truth for all slide deck data and operations.

**Key Features**:
- **Persistence**: Only `history` is persisted to localStorage to maintain deck history across sessions
- **Undo/Redo**: Style history tracking (last 10 changes) for undo/redo functionality
- **Immutable Updates**: All state updates create new objects to ensure React re-renders
- **Devtools**: Enabled for debugging with named actions

**State Structure**:
```typescript
{
  appState: 'input' | 'loading' | 'generated' | 'viewing' | 'error',
  slideDeck: SlideDeck | null,
  error: string,
  history: DeckHistoryItem[],
  currentDeckId: string | null,
  currentSlideIndex: number,
  selectedElement: SelectedElement | null,
  styleHistory: StyleHistoryEntry[],
  redoHistory: StyleHistoryEntry[]
}
```

**Why This Structure**:
- `appState`: Single source of truth for application flow (prevents state conflicts)
- `history`: Persistent deck storage without backend dependency
- `selectedElement`: Tracks which element is being edited for style panel
- `styleHistory/redoHistory`: Enables undo/redo without complex state snapshots

#### UIStore (`src/store/useUIStore.ts`)

**Purpose**: Manage UI-only state that doesn't need persistence.

**Why Separate**:
- UI state (panel visibility) doesn't need to persist across sessions
- Keeps SlideDeckStore focused on data management
- Prevents unnecessary re-renders when UI state changes
- Simpler to reason about and test

**State Structure**:
```typescript
{
  activePanel: 'history' | 'viewer' | 'editor' | null
}
```

**Panel Management Pattern**:
- Only one panel can be active at a time
- Clicking the same panel icon toggles it closed
- Opening a new panel automatically closes the previous one
- Null state = all panels closed

---

## UI Architecture

### Panel System

**Decision**: Use a fixed sidebar with slide-out panels instead of tabs or separate pages.

**Reasoning**:
- **Persistent Navigation**: Sidebar always visible for quick access
- **Context Preservation**: Panels slide over content without losing main view
- **Professional Feel**: Common pattern in design tools (Figma, Canva)
- **Space Efficiency**: Panels only take space when needed

**Panel Types**:

1. **HistoryPanel** (`src/components/HistoryPanel`)
   - Shows all previously generated decks
   - Persisted via Zustand localStorage
   - Click to load, delete with confirmation
   - Auto-opens when new deck is generated

2. **ViewerPanel** (`src/components/ViewerPanel`)
   - Preview all slides in a deck
   - Thumbnail view for quick navigation
   - Click to jump to specific slide
   - Only visible when viewing a deck

3. **EditorPanel** (`src/components/EditorPanel`)
   - Style controls for selected element
   - Font, color, alignment, spacing controls
   - Undo/redo buttons
   - Auto-opens when deck modal opens

**Panel Component Pattern**:
```typescript
// Reusable Panel wrapper with consistent behavior
<Panel
  panelType="history"
  isOpen={isOpen}
  onClose={() => togglePanel('history')}
  width="md"
>
  {/* Panel content */}
</Panel>
```

**Benefits**:
- Consistent animations and transitions
- Unified z-index management
- Responsive width handling
- Backdrop click-to-close

### Modal System

**Decision**: Use a custom Modal component instead of native dialogs or third-party libraries.

**Reasoning**:
- **Full Control**: Custom animations, styling, and behavior
- **Panel Integration**: Modals work seamlessly with panel system
- **Accessibility**: Built-in focus trap and escape key handling
- **Responsive**: Adapts to different screen sizes and panel states

**Modal Features**:
- Backdrop with blur effect
- Click outside to close (optional)
- Escape key to close
- Adjusts width when panels are open
- Smooth fade-in/out animations
- Portal rendering for proper z-index stacking

**Implementation**:
```typescript
// Modal automatically adjusts for active panels
<Modal 
  isOpen={isOpen} 
  onClose={onClose} 
  maxWidth="full"
  activePanel={activePanel}
>
  {/* Modal content */}
</Modal>
```

---

## Component Design

### Reusable UI Components (`src/components/ui`)

**Decision**: Build a custom component library instead of using a UI framework (Material-UI, Chakra, etc.).

**Reasoning**:
- **Bundle Size**: Only include what we need
- **Customization**: Full control over styling and behavior
- **Learning**: No framework-specific patterns to learn
- **Performance**: No unnecessary abstractions
- **Consistency**: Unified design language

**Core Components**:

1. **Button** (`Button.tsx`)
   - Variants: primary, secondary, danger, icon
   - Sizes: sm, md, lg
   - Icon support with flexible positioning
   - Disabled states
   - Loading states

2. **Panel** (`Panel.tsx`)
   - Slide-in animation from left
   - Configurable width (sm, md, lg)
   - Close button
   - Backdrop overlay
   - Scroll handling

3. **Modal** (`Modal.tsx`)
   - Full-screen overlay
   - Centered content
   - Responsive sizing
   - Panel-aware positioning
   - Focus management

4. **CustomSelect** (`CustomSelect.tsx`)
   - Dropdown with custom styling
   - Keyboard navigation
   - Click-outside to close
   - Matches app design language
   - Replaces native `<select>` for consistency

5. **EmptyState** (`EmptyState.tsx`)
   - Consistent empty state messaging
   - Icon support
   - Call-to-action button
   - Used in HistoryPanel, ViewerPanel

**Component Patterns**:
```typescript
// Consistent prop interfaces
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconOnly?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}
```

### Composition Over Configuration

**Pattern**: Components compose together rather than accepting dozens of props.

**Example**:
```typescript
// Instead of: <SlideViewer showHeader showFooter showToolbar />
// We compose:
<div>
  <SlideHeader />
  <SlideToolbar />
  <SlideContent />
  <SlideFooter />
</div>
```

**Benefits**:
- More flexible and maintainable
- Easier to understand component structure
- Can reorder or conditionally render parts
- Each component has single responsibility

---

## Styling Approach

### Tailwind CSS

**Decision**: Use Tailwind CSS v4 for all styling.

**Reasoning**:
- **Rapid Development**: Utility classes speed up development
- **Consistency**: Design tokens enforce consistent spacing, colors, sizing
- **Performance**: Purges unused CSS in production
- **Responsive**: Mobile-first responsive utilities
- **No CSS Files**: Styles colocated with components

**Custom Configuration**:
```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      fontFamily: {
        rajdhani: ['var(--font-rajdhani)'], // Military-style headings
      },
      animation: {
        'loading-bar': 'loading-bar 2.5s ease-out forwards',
      }
    }
  }
}
```

**Design System**:
- **Colors**: Zinc scale for dark theme (zinc-950, zinc-900, zinc-800, etc.)
- **Spacing**: Tailwind's default scale (4px increments)
- **Typography**: Rajdhani for headings, system fonts for body
- **Shadows**: Layered shadows for depth (shadow-xl, shadow-2xl)
- **Borders**: Subtle borders with zinc-800 for separation

### Animation Strategy

**Decision**: Use Tailwind's built-in animations plus custom CSS for complex animations.

**Animations Used**:
1. **Fade In**: `animate-in fade-in duration-500`
2. **Slide In**: `animate-in slide-in-from-bottom-4`
3. **Pulse**: `animate-pulse` for loading states
4. **Spin**: `animate-spin` for loaders
5. **Custom**: Loading bar with keyframes

**Why This Approach**:
- No JavaScript animation libraries needed
- CSS animations are performant (GPU-accelerated)
- Tailwind utilities for common patterns
- Custom keyframes for unique animations

---

## User Experience

### Auto-Focus Pattern

**Decision**: Automatically focus the prompt input when creating a new deck.

**Implementation**:
```typescript
// Using forwardRef and useImperativeHandle
const PromptForm = forwardRef<PromptFormRef>((props, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus()
  }));
});

// Triggered from Sidebar "+" button or HistoryPanel "New Deck"
const handleNewDeck = () => {
  reset();
  onFocusPrompt?.(); // Calls focus method
};
```

**Benefits**:
- User can immediately start typing
- Reduces clicks needed to create deck
- Familiar pattern from other apps

### Loading States

**Decision**: Show loading animations for all async operations.

**Loading Patterns**:

1. **App Loader** (3 seconds on initial load)
   - Full-screen branded loader
   - Pulsing logo
   - Progress bar animation
   - "Configuring workspace..." message

2. **Deck Loader** (2 seconds when opening/switching decks)
   - Modal-based loader
   - Spinning icon
   - "Loading Slide Deck" message
   - Prevents flicker when switching decks

3. **Generate Loader** (during AI generation)
   - Disabled submit button
   - Loading spinner in button
   - Prevents duplicate submissions

**Why Multiple Loaders**:
- Different contexts need different feedback
- Prevents user confusion about what's loading
- Professional feel with intentional delays

### Keyboard Navigation

**Decision**: Support arrow keys for slide navigation.

**Implementation**:
```typescript
useKeyboardNavigation({
  enabled: isOpen && !!slideDeck,
  loop: true, // Arrow left on first slide goes to last
  onPrevious: () => setCurrentSlideIndex(prev - 1),
  onNext: () => setCurrentSlideIndex(next + 1),
});
```

**Benefits**:
- Power users can navigate quickly
- Common pattern in presentation software
- Accessibility improvement

---

## Performance Optimizations

### Lazy Loading

**Decision**: Lazy load template cards with staggered animation.

**Implementation**:
```typescript
// ExploreTemplates component
templates.map((template, index) => (
  <div
    key={template.id}
    className="animate-in fade-in slide-in-from-bottom-4"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Template card */}
  </div>
))
```

**Benefits**:
- Smooth visual appearance
- Reduces perceived load time
- Professional polish

### Memoization Strategy

**Decision**: Minimal use of `useMemo` and `useCallback`.

**Reasoning**:
- Premature optimization is avoided
- Most components are small and fast
- Zustand handles re-render optimization
- Only memoize expensive computations

**Where We Do Memoize**:
- Slide normalization (transforms API response)
- Export to PPTX (heavy computation)
- Large list rendering (if needed in future)

### State Updates

**Decision**: Batch related state updates.

**Pattern**:
```typescript
// Instead of multiple setState calls
setIsLoading(true);
setError('');
setAppState('loading');

// Zustand batches automatically
set({ 
  isLoading: true, 
  error: '', 
  appState: 'loading' 
});
```

**Benefits**:
- Fewer re-renders
- More predictable state transitions
- Better performance

---

## Summary

These design decisions prioritize:
1. **Developer Experience**: Easy to understand and maintain
2. **User Experience**: Fast, intuitive, and polished
3. **Performance**: Optimized without over-engineering
4. **Scalability**: Can grow with new features
5. **Type Safety**: TypeScript throughout for reliability

The architecture balances simplicity with flexibility, allowing the app to evolve while maintaining a solid foundation.
