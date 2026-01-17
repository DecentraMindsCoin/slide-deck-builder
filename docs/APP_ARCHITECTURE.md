# Application Architecture

This document provides a comprehensive overview of the AI Slide Deck Builder's architecture, including folder structure, component hierarchy, data flow, and key patterns.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Hierarchy](#component-hierarchy)
3. [Data Flow](#data-flow)
4. [Routing & Navigation](#routing--navigation)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Type System](#type-system)

---

## Project Structure

```
slide-deck-builder/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout with fonts
│   │   ├── page.tsx                  # Main application page
│   │   └── globals.css               # Global styles & Tailwind
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # Reusable UI primitives
│   │   │   ├── Button.tsx            # Button component
│   │   │   ├── Panel.tsx             # Slide-out panel wrapper
│   │   │   ├── Modal.tsx             # Modal dialog wrapper
│   │   │   ├── CustomSelect.tsx      # Custom dropdown select
│   │   │   ├── EmptyState.tsx        # Empty state display
│   │   │   └── index.tsx             # UI exports
│   │   │
│   │   ├── HomeLayout/               # Main landing page
│   │   │   ├── index.tsx             # Layout container
│   │   │   └── PromptForm.tsx        # Prompt input form
│   │   │
│   │   ├── SlideViewer/              # Slide deck modal
│   │   │   ├── index.tsx             # Modal wrapper with loader
│   │   │   └── slide/                # Slide components
│   │   │       ├── SlideDeckViewer.tsx    # Main viewer
│   │   │       ├── SlideHeader.tsx        # Deck title header
│   │   │       ├── SlideToolbar.tsx       # Add/delete/export tools
│   │   │       ├── SlideTitle.tsx         # Editable slide title
│   │   │       ├── SlideContentItem.tsx   # Editable content
│   │   │       └── SlideFooter.tsx        # Navigation buttons
│   │   │
│   │   ├── EditorPanel/              # Style editor panel
│   │   │   ├── index.tsx             # Panel wrapper
│   │   │   ├── EditTab.tsx           # Main editor UI
│   │   │   ├── PreviewTab.tsx        # Slide preview list
│   │   │   └── controls/             # Style controls
│   │   │       ├── FontStyleControls.tsx
│   │   │       ├── ColorControls.tsx
│   │   │       ├── AlignmentControls.tsx
│   │   │       ├── SpacingControls.tsx
│   │   │       └── SlideBackgroundControls.tsx
│   │   │
│   │   ├── HistoryPanel/             # Deck history panel
│   │   │   ├── index.tsx             # Panel wrapper
│   │   │   ├── HistoryList.tsx       # List of saved decks
│   │   │   └── ConfirmDeleteModal.tsx # Delete confirmation
│   │   │
│   │   ├── ViewerPanel/              # Slide preview panel
│   │   │   └── index.tsx             # Thumbnail grid
│   │   │
│   │   ├── ExploreTemplates/         # Template gallery
│   │   │   └── index.tsx             # Template cards
│   │   │
│   │   ├── Sidebar.tsx               # Fixed left sidebar
│   │   ├── AppLoader.tsx             # Initial app loader
│   │   ├── ErrorDisplay.tsx          # Error message
│   │   ├── GeneratedSuccess.tsx      # Success message
│   │   └── StyleControlsPopover.tsx  # Inline style popover
│   │
│   ├── store/                        # Zustand stores
│   │   ├── useSlideDeckStore.ts      # Slide deck state
│   │   └── useUIStore.ts             # UI state
│   │
│   ├── services/                     # External services
│   │   └── api.ts                    # API client
│   │
│   ├── lib/                          # Utilities & helpers
│   │   ├── hooks/                    # Custom React hooks
│   │   │   └── useKeyboardNavigation.ts
│   │   ├── slides/                   # Slide utilities
│   │   │   ├── normalizeSlides.ts    # API response normalization
│   │   │   └── exportToPPTX.ts       # PowerPoint export
│   │   └── utils/
│   │       └── utils.ts              # General utilities
│   │
│   ├── types/                        # TypeScript types
│   │   ├── index.ts                  # Type exports
│   │   ├── slides.ts                 # Slide types
│   │   └── store.ts                  # Store types
│   │
│   └── constants/                    # App constants
│       ├── slides.ts                 # Slide defaults
│       ├── templates.ts              # Template definitions
│       └── navigation.ts             # Nav config
│
├── public/                           # Static assets
│   ├── BACKGROUND.jpg                # Landing page background
│   └── ...
│
├── docs/                             # Documentation
│   ├── README.md                     # This file
│   ├── DESIGN-DECISIONS.md           # Technical decisions
│   └── APP_ARCHITECTURE.md           # Architecture guide
│
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
└── tailwind.config.ts                # Tailwind config
```

---

## Component Hierarchy

### Application Tree

```
App (page.tsx)
├── AppLoader (3s initial load)
│
└── Main Content
    ├── Sidebar
    │   ├── Logo
    │   ├── New Deck Button
    │   ├── History Toggle
    │   ├── Viewer Toggle (when viewing)
    │   └── Editor Toggle (when viewing)
    │
    ├── HistoryPanel (slide-out)
    │   ├── Header
    │   ├── New Deck Button
    │   ├── HistoryList
    │   │   └── HistoryItem[] (click to load)
    │   └── ConfirmDeleteModal
    │
    ├── ViewerPanel (slide-out)
    │   ├── Header
    │   └── Slide Thumbnails Grid
    │       └── SlidePreview[] (click to navigate)
    │
    ├── EditorPanel (slide-out)
    │   ├── Header
    │   ├── Tabs (Edit | Preview)
    │   ├── EditTab
    │   │   ├── Element Info
    │   │   ├── Undo/Redo Buttons
    │   │   ├── FontStyleControls
    │   │   ├── ColorControls
    │   │   ├── AlignmentControls
    │   │   ├── SpacingControls
    │   │   └── SlideBackgroundControls (if slide selected)
    │   └── PreviewTab
    │       └── Slide Thumbnails List
    │
    ├── HomeLayout
    │   ├── PromptForm
    │   │   ├── Textarea (auto-focus)
    │   │   └── Generate Button
    │   └── ExploreTemplates
    │       └── TemplateCard[] (click to use)
    │
    ├── ErrorDisplay (toast notification)
    │
    ├── GeneratedSuccess (toast notification)
    │
    └── SlideDeckModal (full-screen)
        ├── Loader (2s when opening/switching)
        └── SlideDeckViewer
            ├── SlideHeader (deck title)
            ├── SlideToolbar
            │   ├── Add Paragraph/Bullet
            │   ├── Delete Element/Slide
            │   ├── Duplicate Element
            │   └── Export to PPTX
            ├── Slide Content (scrollable)
            │   ├── SlideTitle (editable)
            │   └── SlideContentItem[] (editable)
            └── SlideFooter
                ├── Previous Button
                ├── Slide Counter
                └── Next Button
```

### Component Responsibilities

| Component | Responsibility | State |
|-----------|---------------|-------|
| `page.tsx` | App orchestration, API calls | Local (loading, prompt) |
| `Sidebar` | Navigation, panel toggles | None (uses stores) |
| `HistoryPanel` | Show saved decks, load/delete | Local (delete confirm) |
| `ViewerPanel` | Thumbnail navigation | None (uses store) |
| `EditorPanel` | Style editing UI | Local (active tab) |
| `HomeLayout` | Landing page layout | Local (prompt, theme) |
| `PromptForm` | Prompt input, submission | Props (controlled) |
| `ExploreTemplates` | Template gallery | None (static) |
| `SlideDeckModal` | Modal wrapper, loader | Local (loading state) |
| `SlideDeckViewer` | Slide display, editing | None (uses store) |
| `SlideToolbar` | Slide manipulation tools | Local (menu state) |
| `SlideContentItem` | Editable content block | None (uses store) |

---

## Data Flow

### Application States

The app follows a finite state machine pattern:

```
┌─────────┐
│  input  │ ◄──────────────────┐
└────┬────┘                    │
     │ (submit prompt)         │
     ▼                         │
┌─────────┐                    │
│ loading │                    │
└────┬────┘                    │
     │ (API success)           │
     ▼                         │
┌───────────┐                  │
│ generated │                  │
└─────┬─────┘                  │
      │ (view deck)            │
      ▼                        │
┌─────────┐                    │
│ viewing │ ───────────────────┘
└─────────┘    (close/reset)

     │ (API error)
     ▼
┌─────────┐
│  error  │ ───────────────────┘
└─────────┘    (retry)
```

### Data Flow Patterns

#### 1. Slide Generation Flow

```
User Input (PromptForm)
    │
    ▼
page.tsx (handlePromptSubmit)
    │
    ├─► setAppState('loading')
    │
    ├─► API Call (generateSlides)
    │       │
    │       ▼
    │   Normalize Response
    │       │
    │       ▼
    │   Store in Zustand
    │       │
    │       ├─► setSlideDeck(deck)
    │       ├─► addToHistory(deck)
    │       └─► setAppState('generated')
    │
    └─► Show GeneratedSuccess
            │
            ▼
        User clicks "View"
            │
            ▼
        setAppState('viewing')
            │
            ▼
        SlideDeckModal opens
```

#### 2. Deck Loading from History

```
User clicks deck in HistoryPanel
    │
    ▼
loadDeckFromHistory(id)
    │
    ├─► Find deck in history
    ├─► setSlideDeck(deck)
    ├─► setCurrentDeckId(id)
    └─► setAppState('viewing')
        │
        ▼
    SlideDeckModal opens
        │
        ├─► Show loader (2s)
        │
        └─► Render SlideDeckViewer
```

#### 3. Style Editing Flow

```
User selects element in SlideDeckViewer
    │
    ▼
setSelectedElement({ slideId, contentIndex })
    │
    ▼
EditorPanel shows style controls
    │
    ▼
User changes style (e.g., font size)
    │
    ▼
updateElementStyle(slideId, contentIndex, style)
    │
    ├─► Merge with existing style
    ├─► Update slideDeck in store
    ├─► Update history if saved deck
    ├─► Add to styleHistory (for undo)
    └─► Clear redoHistory
        │
        ▼
    Component re-renders with new style
```

#### 4. Undo/Redo Flow

```
User clicks Undo
    │
    ▼
undoLastStyleChange()
    │
    ├─► Get last styleHistory entry
    ├─► Restore previous style
    ├─► Move entry to redoHistory
    └─► Update slideDeck
        │
        ▼
    Component re-renders

User clicks Redo
    │
    ▼
redoLastStyleChange()
    │
    ├─► Get last redoHistory entry
    ├─► Restore current style
    ├─► Move entry back to styleHistory
    └─► Update slideDeck
        │
        ▼
    Component re-renders
```

---

## Routing & Navigation

### Next.js App Router

**Single Page Application**: The app uses a single route (`/`) with modal-based navigation.

**Why Single Page**:
- Simpler state management (no route-based state)
- Faster navigation (no page reloads)
- Better for modal-heavy UI
- Easier to maintain shared state

**Navigation Pattern**:
```typescript
// State-based navigation instead of routes
appState: 'input' | 'loading' | 'generated' | 'viewing' | 'error'

// Modals and panels handle "pages"
{appState === 'viewing' && <SlideDeckModal />}
{activePanel === 'history' && <HistoryPanel />}
```

### Panel Navigation

**Panel System**: Panels slide in from the left, overlaying the main content.

**Panel States**:
```typescript
activePanel: 'history' | 'viewer' | 'editor' | null

// Toggle behavior
togglePanel('history')
  → If history is open: close it (set to null)
  → If history is closed: open it (set to 'history')
  → If another panel is open: close it and open history
```

**Panel Z-Index Hierarchy**:
```
Modal backdrop:     z-40
Modal content:      z-50
Panels:             z-30
Sidebar:            z-100
Confirm modals:     z-60 (above slide modal)
```

---

## State Management

### Zustand Store Architecture

#### SlideDeckStore

**Purpose**: Manages all slide deck data and operations.

**Key Actions**:

| Action | Purpose | Side Effects |
|--------|---------|--------------|
| `setAppState` | Change app state | None |
| `setSlideDeck` | Set current deck | None |
| `updateSlide` | Update slide content | Updates history if saved |
| `updateElementStyle` | Update element style | Adds to styleHistory |
| `updateTitleStyle` | Update title style | Adds to styleHistory |
| `updateSlideBackground` | Update slide bg | Adds to styleHistory |
| `undoLastStyleChange` | Undo last style | Moves to redoHistory |
| `redoLastStyleChange` | Redo last style | Moves to styleHistory |
| `addToHistory` | Save deck to history | Persists to localStorage |
| `loadDeckFromHistory` | Load saved deck | Sets appState to 'viewing' |
| `deleteDeckFromHistory` | Delete saved deck | Resets if current deck |
| `deleteSlide` | Remove slide | Adjusts currentSlideIndex |
| `addSlide` | Add new slide | Navigates to new slide |
| `reset` | Clear all state | Returns to input state |

**Persistence Strategy**:
```typescript
persist(
  // Store definition
  {
    name: 'slide-deck-storage',
    partialize: (state) => ({
      history: state.history, // Only persist history
    }),
  }
)
```

**Why Only Persist History**:
- Current deck can be regenerated
- Reduces localStorage size
- Prevents stale state issues
- History is the only irreplaceable data

#### UIStore

**Purpose**: Manages UI-only state (panels, modals).

**Key Actions**:

| Action | Purpose |
|--------|---------|
| `setActivePanel` | Set active panel directly |
| `togglePanel` | Toggle panel open/closed |

**No Persistence**: UI state resets on page reload (intentional).

---

## API Integration

### Service Layer

**Location**: `src/services/api.ts`

**Pattern**: Centralized API client with error handling.

```typescript
// Single API function
export async function generateSlides(
  prompt: string,
  model: string = "gpt-4o-2024-08-06"
): Promise<ApiResponse>

// Features:
- Timeout handling (30s default)
- AbortController for cancellation
- Type-safe responses
- Error normalization
- Environment variable validation
```

### API Flow

```
1. User submits prompt
    ↓
2. page.tsx calls generateSlides(prompt)
    ↓
3. API service makes POST request
    ↓
4. Response validated and typed
    ↓
5. normalizeSlides() transforms response
    ↓
6. Store updated with normalized deck
    ↓
7. UI re-renders with new data
```

### Response Normalization

**Purpose**: Transform API response into app's data structure.

```typescript
// API Response (from backend)
{
  deckTitle: string,
  slides: Array<{
    title: string,
    content: Array<{ type, text }>
  }>
}

// Normalized (for app)
{
  deckTitle: string,
  slides: Array<{
    id: string,              // Added
    title: string,
    titleStyle: TextStyle,   // Added
    content: Array<{
      type, 
      text,
      style: TextStyle       // Added
    }>,
    backgroundColor: string  // Added
  }>
}
```

**Why Normalize**:
- Adds unique IDs for React keys
- Applies default styles
- Applies template themes
- Ensures consistent data structure

---

## Type System

### Core Types

**Location**: `src/types/`

#### Slide Types (`slides.ts`)

```typescript
interface TextStyle {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
}

interface SlideContent {
  type: 'paragraph' | 'bullet';
  text: string;
  style?: TextStyle;
}

interface Slide {
  id: string;
  title: string;
  titleStyle?: TextStyle;
  content: SlideContent[];
  backgroundColor?: string;
}

interface SlideDeck {
  deckTitle: string;
  slides: Slide[];
}
```

#### Store Types (`store.ts`)

```typescript
type AppState = 'input' | 'loading' | 'generated' | 'viewing' | 'error';
type PanelType = 'history' | 'viewer' | 'editor' | null;

interface SelectedElement {
  slideId: string;
  contentIndex: number | 'slide' | 'title';
}

interface StyleHistoryEntry {
  timestamp: number;
  type: 'element' | 'slide' | 'title';
  slideId: string;
  contentIndex?: number | 'title';
  previousStyle?: TextStyle;
  previousBackgroundColor?: string;
  currentStyle?: TextStyle;
  currentBackgroundColor?: string;
}
```

### Type Safety Benefits

1. **Compile-Time Errors**: Catch bugs before runtime
2. **IntelliSense**: Auto-completion in IDE
3. **Refactoring Safety**: Rename with confidence
4. **Documentation**: Types serve as inline docs
5. **API Contracts**: Ensure API responses match expectations

---

## Summary

The architecture prioritizes:

1. **Modularity**: Components are small, focused, and reusable
2. **Type Safety**: TypeScript throughout for reliability
3. **State Management**: Zustand for predictable, debuggable state
4. **Performance**: Optimized re-renders and lazy loading
5. **Developer Experience**: Clear patterns and conventions
6. **User Experience**: Smooth animations and intuitive flow

This structure supports rapid feature development while maintaining code quality and performance.
