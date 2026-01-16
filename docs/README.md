# Types Structure

All TypeScript types and interfaces are consolidated in a single `index.ts` file for simplicity and ease of maintenance.

## File Structure

```
src/types/
└── index.ts          # Single source of truth for all types
```

## Usage

Import types from the centralized location:

```typescript
// Import specific types
import type { Slide, SlideDeck, SlideContent } from '@/types';

// Import multiple types
import type { 
  ApiResponse, 
  ApiError, 
  PromptInputProps 
} from '@/types';
```

## Type Categories

### 1. Slide Types
Core data structures for slides and slide content:
- `SlideContent` - Individual content items (paragraph or bullet)
- `Slide` - Single slide with title and content
- `SlideDeck` - Complete deck with title and slides array
- `SlideUpdate` - Partial update structure for editing

### 2. API Types
Types for API requests and responses:
- `ApiResponse` - Successful API response structure
- `ApiError` - Error response structure
- `GenerateSlidesRequest` - Request payload structure
- `ApiConfig` - API configuration options

### 3. Component Props Types
Props interfaces for React components:
- `PromptInputProps` - Props for PromptInput component
- `SlideViewerProps` - Props for SlideViewer component
- `ErrorDisplayProps` - Props for ErrorDisplay component

### 4. Application State Types
State management types:
- `AppState` - Application state machine states
- `AppStateManager` - State manager interface (for future Zustand integration)

## Adding New Types

When adding new features, simply add new type sections to `index.ts`:

```typescript
// ============================================================================
// YOUR NEW SECTION (e.g., THEME TYPES)
// ============================================================================

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export type ThemePreset = 'light' | 'dark' | 'blue' | 'green';
```

## Benefits of Single File Approach

✅ **Simple** - One place to find all types  
✅ **No circular dependencies** - All types in one file  
✅ **Easy imports** - Single import path `@/types`  
✅ **Clear organization** - Sections with comments  
✅ **Scalable** - Easy to add new sections as needed  
✅ **No overhead** - No need to manage multiple files for small projects

## When to Split

Consider splitting into multiple files when:
- File exceeds 500+ lines
- Types become domain-specific and complex
- Multiple teams working on different domains
- Need to share types across multiple packages

For this project size, a single file is optimal.
