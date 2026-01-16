# Zustand State Management Migration Guide

## Why Zustand?

### Current Issues with useState
- State scattered across multiple components
- Prop drilling for slide updates
- Difficult to add features like undo/redo, persistence
- No centralized state management

### Zustand Benefits
✅ **Minimal boilerplate** - No providers, no context  
✅ **Better performance** - Selective re-renders  
✅ **DevTools support** - Redux DevTools integration  
✅ **Small bundle** - Only ~1KB  
✅ **TypeScript friendly** - Excellent type inference  
✅ **Easy testing** - No provider mocking  

---

## Installation

```bash
npm install zustand
# or
yarn add zustand
```

---

## Migration Steps

### 1. Store Created (`src/store/useSlideDeckStore.ts`)

The store centralizes all slide deck state:
- `appState` - Current app state (input/loading/viewing/error)
- `slideDeck` - Current slide deck data
- `error` - Error message
- Actions for updating state

### 2. Update `page.tsx`

**Before (useState):**
```typescript
const [state, setState] = useState<AppState>('input');
const [slideDeck, setSlideDeck] = useState<SlideDeck | null>(null);
const [error, setError] = useState<string>('');

const handleUpdateSlide = (slideId: string, title: string, content: SlideContent[]) => {
  if (!slideDeck) return;
  const updatedSlides = slideDeck.slides.map((slide) =>
    slide.id === slideId ? { ...slide, title, content } : slide
  );
  setSlideDeck({ ...slideDeck, slides: updatedSlides });
};
```

**After (Zustand):**
```typescript
const appState = useSlideDeckStore((state) => state.appState);
const slideDeck = useSlideDeckStore((state) => state.slideDeck);
const error = useSlideDeckStore((state) => state.error);
const setAppState = useSlideDeckStore((state) => state.setAppState);
const setSlideDeck = useSlideDeckStore((state) => state.setSlideDeck);
const setError = useSlideDeckStore((state) => state.setError);
const updateSlide = useSlideDeckStore((state) => state.updateSlide);
const reset = useSlideDeckStore((state) => state.reset);

// handleUpdateSlide becomes:
const handleUpdateSlide = updateSlide; // Direct reference!
```

### 3. Update Components

Components can now access state directly without props:

```typescript
// SlideViewer.tsx - Could access store directly if needed
import { useSlideDeckStore } from '@/store/useSlideDeckStore';

// Access only what you need (prevents unnecessary re-renders)
const deckTitle = useSlideDeckStore((state) => state.slideDeck?.deckTitle);
const updateSlide = useSlideDeckStore((state) => state.updateSlide);
```

---

## Performance Benefits

### Selective Re-renders

**With useState:**
- Entire component re-renders on any state change
- All children re-render

**With Zustand:**
```typescript
// Only re-renders when appState changes
const appState = useSlideDeckStore((state) => state.appState);

// Only re-renders when slideDeck changes
const slideDeck = useSlideDeckStore((state) => state.slideDeck);
```

---

## Future Features Enabled

### 1. Undo/Redo
```typescript
interface SlideDeckState {
  history: SlideDeck[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
}
```

### 2. LocalStorage Persistence
```typescript
import { persist } from 'zustand/middleware';

export const useSlideDeckStore = create<SlideDeckState>()(
  persist(
    devtools((set) => ({ /* ... */ })),
    { name: 'slide-deck-storage' }
  )
);
```

### 3. Multiple Decks
```typescript
interface SlideDeckState {
  decks: SlideDeck[];
  currentDeckId: string;
  switchDeck: (id: string) => void;
}
```

---

## Comparison: Context API vs Zustand

| Feature | Context API | Zustand |
|---------|------------|---------|
| **Boilerplate** | ❌ High (Provider, Context, hooks) | ✅ Minimal |
| **Performance** | ❌ All consumers re-render | ✅ Selective re-renders |
| **DevTools** | ❌ No built-in support | ✅ Redux DevTools |
| **Bundle Size** | ✅ 0KB (built-in) | ✅ ~1KB |
| **TypeScript** | ⚠️ Manual typing | ✅ Auto-inferred |
| **Testing** | ❌ Need provider mocking | ✅ Direct store access |
| **Middleware** | ❌ Manual implementation | ✅ Built-in (persist, devtools) |

---

## Code Comparison

### Context API Approach (NOT Recommended)

```typescript
// 1. Create context
const SlideDeckContext = createContext<SlideDeckContextType | undefined>(undefined);

// 2. Create provider
export function SlideDeckProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>('input');
  const [slideDeck, setSlideDeck] = useState<SlideDeck | null>(null);
  // ... more state and functions
  
  return (
    <SlideDeckContext.Provider value={{ state, setState, slideDeck, setSlideDeck }}>
      {children}
    </SlideDeckContext.Provider>
  );
}

// 3. Create hook
export function useSlideDeck() {
  const context = useContext(SlideDeckContext);
  if (!context) throw new Error('Must be used within SlideDeckProvider');
  return context;
}

// 4. Wrap app in provider
<SlideDeckProvider>
  <App />
</SlideDeckProvider>

// 5. Use in components
const { state, setState } = useSlideDeck();
```

**Issues:**
- ❌ 50+ lines of boilerplate
- ❌ All consumers re-render on any state change
- ❌ Need to wrap app in provider
- ❌ Complex to split into multiple contexts

### Zustand Approach (Recommended)

```typescript
// 1. Create store (done!)
export const useSlideDeckStore = create<SlideDeckState>()(/* ... */);

// 2. Use in components
const appState = useSlideDeckStore((state) => state.appState);
const setAppState = useSlideDeckStore((state) => state.setAppState);
```

**Benefits:**
- ✅ 10 lines vs 50+ lines
- ✅ No provider needed
- ✅ Selective re-renders
- ✅ Simpler to use

---

## Migration Checklist

- [ ] Install Zustand: `npm install zustand`
- [ ] Store created: `src/store/useSlideDeckStore.ts` ✅
- [ ] Update `page.tsx` to use store
- [ ] Update `SlideViewer.tsx` if needed
- [ ] Remove unused useState hooks
- [ ] Test all functionality works
- [ ] Enable Redux DevTools for debugging
- [ ] Update documentation

---

## Testing the Migration

After migration, test:
1. ✅ Generate slides from prompt
2. ✅ Navigate between slides
3. ✅ Edit slide titles
4. ✅ Edit slide content
5. ✅ Add/remove content items
6. ✅ Reset to new deck
7. ✅ Error handling
8. ✅ Loading states

---

## Recommendation

**For your current app:** Zustand is the right choice because:
- You're adding more features (undo, persistence, etc.)
- Better performance than Context API
- Minimal migration effort
- Industry standard for React state management
- Better developer experience

**Next.js + Zustand is a proven, production-ready pattern used by many companies.**

---

## Next Steps

1. Run: `npm install zustand`
2. The store is already created in `src/store/useSlideDeckStore.ts`
3. Update `page.tsx` to use the store
4. Test functionality
5. Enjoy better state management! 🚀
