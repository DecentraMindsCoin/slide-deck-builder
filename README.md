# Dunedain AI Slides

An AI-powered slide deck builder that generates professional presentations from text prompts. Built with Next.js, TypeScript, Zustand, and Tailwind CSS.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DecentraMindsCoin/slide-deck-builder.git
cd slide-deck-builder
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```
Edit `.env.local` with your API credentials:
```env
NEXT_PUBLIC_API_URL=https://warmind-take-home-e61921e38114.herokuapp.com/api/generate-slides
NEXT_PUBLIC_API_KEY=your-api-key-here
```

4. **Run the development server**
```bash
yarn dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

---

## ✨ What This App Does

### Core Features

- **🎨 AI Generation**: Create complete slide decks from text prompts using GPT-4o
- **✏️ Live Editing**: Edit slide titles, content, and styles in real-time
- **🎯 Style Editor**: Comprehensive styling controls (fonts, colors, alignment, spacing)
- **📚 Deck History**: Auto-saves all generated decks to localStorage
- **🔄 Undo/Redo**: Full undo/redo support for style changes
- **📤 Export**: Export decks to PowerPoint (.pptx) format
- **⌨️ Keyboard Nav**: Arrow keys for slide navigation, Cmd+Z/Cmd+Shift+Z for undo/redo
- **🎭 Templates**: Pre-built templates with themed styling

### User Flow

1. **Enter a prompt** or select a template
2. **AI generates** a complete slide deck (title, slides, content)
3. **View and edit** slides with inline editing and style controls
4. **Navigate** using arrow keys or Previous/Next buttons
5. **Export** to PowerPoint or save to history
6. **Load** previously generated decks from history panel

---

## 🏗️ Architecture Overview

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16.1.2 (App Router) | React framework with SSR support |
| **Language** | TypeScript 5 | Type safety and developer experience |
| **State** | Zustand | Global state management |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Icons** | Lucide React | Consistent iconography |
| **Export** | PptxGenJS | PowerPoint generation |

### Key Design Decisions

#### 1. **Zustand for State Management**
- **Why**: Minimal boilerplate, no provider hell, excellent TypeScript support
- **Stores**: 
  - `useSlideDeckStore`: Slide deck data, history, editing state
  - `useUIStore`: UI state (active panels, modals)
- **Persistence**: Only history persisted to localStorage (reduces storage, prevents stale state)

#### 2. **Panel-Based UI Architecture**
- **Why**: Professional design tool pattern (Figma, Canva), context preservation
- **Panels**:
  - **HistoryPanel**: View and load saved decks
  - **ViewerPanel**: Thumbnail navigation
  - **EditorPanel**: Style controls for selected elements
- **Pattern**: Fixed sidebar + slide-out panels (only one active at a time)

#### 3. **Modal System**
- **Why**: Full control over animations, styling, and panel integration
- **Features**: Backdrop blur, click-outside to close, escape key, responsive sizing
- **Loading States**: 2-second loader when opening/switching decks (prevents flicker)

#### 4. **Reusable UI Components**
- **Why**: Consistency, bundle size control, no framework lock-in
- **Components**: Button, Panel, Modal, CustomSelect, EmptyState
- **Pattern**: Composition over configuration (flexible, maintainable)

#### 5. **Type-Safe API Integration**
- **Service Layer**: Centralized API client (`services/api.ts`)
- **Normalization**: Transform API responses into app data structure
- **Error Handling**: Timeout handling, AbortController, type-safe errors

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Main application page
│   └── layout.tsx            # Root layout
│
├── components/
│   ├── ui/                   # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Panel.tsx
│   │   ├── Modal.tsx
│   │   └── CustomSelect.tsx
│   │
│   ├── HomeLayout/           # Landing page
│   ├── SlideViewer/          # Slide deck modal
│   ├── EditorPanel/          # Style editor
│   ├── HistoryPanel/         # Deck history
│   ├── ViewerPanel/          # Slide thumbnails
│   └── Sidebar.tsx           # Fixed navigation
│
├── store/                    # Zustand stores
│   ├── useSlideDeckStore.ts  # Slide deck state
│   └── useUIStore.ts         # UI state
│
├── services/
│   └── api.ts                # API client
│
├── lib/
│   ├── hooks/                # Custom React hooks
│   └── slides/               # Slide utilities
│
├── types/                    # TypeScript types
│   ├── slides.ts
│   └── store.ts
│
└── constants/                # App constants
    ├── slides.ts
    └── templates.ts
```

---

## 📚 Documentation

For detailed technical information, see:

- **[DESIGN-DECISIONS.md](docs/DESIGN-DECISIONS.md)**: Technical choices and reasoning
  - State management strategy
  - UI architecture patterns
  - Component design philosophy
  - Performance optimizations

- **[APP_ARCHITECTURE.md](docs/APP_ARCHITECTURE.md)**: Application structure
  - Component hierarchy
  - Data flow patterns
  - Type system
  - API integration

---

## 🎯 Key Features Explained

### State Management with Zustand

**Two stores for separation of concerns:**

```typescript
// Slide deck data and operations
useSlideDeckStore: {
  slideDeck, history, currentDeckId,
  selectedElement, styleHistory, redoHistory,
  updateSlide, updateElementStyle, undo, redo, ...
}

// UI state (not persisted)
useUIStore: {
  activePanel: 'history' | 'viewer' | 'editor' | null
}
```

**Benefits:**
- Only history persisted (reduces localStorage size)
- Undo/redo for style changes (last 10 actions)
- DevTools integration for debugging
- Type-safe throughout

### Panel System

**Pattern**: Fixed sidebar + slide-out panels

```typescript
// Only one panel active at a time
activePanel: 'history' | 'viewer' | 'editor' | null

// Toggle behavior
togglePanel('history')
  → If open: close it
  → If closed: open it
  → If another panel open: switch to this one
```

**Panels:**
- **HistoryPanel**: Load/delete saved decks
- **ViewerPanel**: Navigate via thumbnails
- **EditorPanel**: Style selected elements

### Reusable UI Components

**Custom component library** (`src/components/ui/`):
- **Button**: Variants (primary, secondary, danger, icon), sizes, loading states
- **Panel**: Slide-in animation, configurable width, backdrop
- **Modal**: Full-screen overlay, responsive, panel-aware
- **CustomSelect**: Dropdown with custom styling (replaces native `<select>`)

**Why custom**: Bundle size, full control, no framework lock-in

---

## 🔧 Development

### Code Quality
- Functional components with hooks
- TypeScript strict mode
- Consistent naming conventions
- Comprehensive error handling
- Component composition pattern

### Performance
- Lazy loading with staggered animations
- Minimal memoization (only where needed)
- Zustand handles re-render optimization
- CSS animations (GPU-accelerated)

---

## 📝 License

Created for the Dunedain Frontend Engineer Coding Assessment.
