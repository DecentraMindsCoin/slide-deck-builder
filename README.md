# AI Slide Deck Builder

A Next.js application that generates professional slide decks using AI based on user prompts. Built for the Dunedain Frontend Engineer Coding Assessment.

## Features

- 🎨 **AI-Powered Generation**: Create complete slide decks from simple text prompts
- ✏️ **Editable Content**: Edit slide titles and content inline with immediate state updates
- ⌨️ **Keyboard Navigation**: Use arrow keys to navigate between slides
- 📱 **Responsive Design**: Modern, clean UI built with Tailwind CSS
- 🎯 **Error Handling**: Comprehensive error states with retry functionality
- 🔄 **Loading States**: Visual feedback during API calls

## Getting Started

### Prerequisites

- Node.js 18+ or Yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DecentraMindsCoin/slide-deck-builder.git
cd slide-deck-builder
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```
Then edit `.env.local` and add your API credentials:
```env
NEXT_PUBLIC_API_URL=https://warmind-take-home-e61921e38114.herokuapp.com/api/generate-slides
NEXT_PUBLIC_API_KEY=your-actual-api-key-here
```

4. Run the development server:
```bash
yarn dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter a Prompt**: Type a description of the presentation you want to create
2. **Generate**: Click "Generate Slides" to create your deck
3. **Navigate**: Use the Previous/Next buttons or arrow keys to move between slides
4. **Edit**: Click the edit icon on any slide title or content to make changes
5. **Start Over**: Click "New Deck" to create another presentation

### Example Prompts

- "Build a presentation for an upcoming 4 vehicle convoy from Austin, TX to Fort Hood, TX"
- "Create a slide deck about planning a dinner party in Austin"
- "Make a presentation on best practices for React development"

## Architecture

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application component
│   └── globals.css         # Global styles
├── components/
│   ├── PromptInput.tsx     # Input form for user prompts
│   ├── SlideViewer.tsx     # Slide display and navigation
│   └── ErrorDisplay.tsx    # Error state component
├── services/
│   └── api.ts              # API integration layer
└── types/
    └── slide.ts            # TypeScript interfaces
```

### State Management

The application uses **React useState** for state management, following a simple and effective pattern:

- **AppState**: Tracks current view (`input` | `loading` | `viewing` | `error`)
- **SlideDeck**: Stores the generated slide deck data
- **Local Component State**: Each component manages its own editing states

This approach was chosen because:
- The state is relatively simple and doesn't need to be shared across many components
- useState provides immediate updates and is easy to reason about
- No need for Context API or Zustand for this scope
- Can easily scale to Zustand if additional features require global state

### Key Design Decisions

1. **Component Architecture**
   - Separation of concerns: Each component has a single responsibility
   - Props-based communication for clean data flow
   - Client-side rendering for interactive features

2. **API Integration**
   - Dedicated service layer (`services/api.ts`) for API calls
   - Type-safe responses with TypeScript interfaces
   - Centralized error handling

3. **User Experience**
   - Loading states with animated spinners
   - Error boundaries with retry functionality
   - Keyboard shortcuts for power users
   - Inline editing with save/cancel actions

4. **Styling**
   - Tailwind CSS for rapid, consistent styling
   - Modern gradient backgrounds and shadows
   - Responsive design principles
   - Lucide React for consistent iconography

5. **Type Safety**
   - Full TypeScript implementation
   - Strict type checking enabled
   - Interface definitions for all data structures

## API Integration

The app integrates with the Warmind Heroku API:

- **Endpoint**: `https://warmind-take-home-e61921e38114.herokuapp.com/api/generate-slides`
- **Method**: POST
- **Authentication**: API key via `x-api-key` header
- **Model**: GPT-4o (gpt-4o-2024-08-06)

### Response Format

```typescript
{
  success: boolean;
  data: {
    deckTitle: string;
    slides: Array<{
      id: string;
      title: string;
      content: Array<{
        type: 'paragraph' | 'bullet';
        text: string;
      }>;
    }>;
  };
}
```

## Technology Stack

- **Framework**: Next.js 16.1.2 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Runtime**: React 19

## Development Notes

### Code Quality

- Functional components with hooks
- TypeScript for type safety
- Clean, modular component structure
- Consistent naming conventions
- Comprehensive error handling

### Future Enhancements

Potential features that could be added:
- Export to .pptx format
- Slide regeneration with chat history
- Slide reordering via drag-and-drop
- Theme customization
- Slide templates
- Multi-deck management with Zustand

## Time Investment

Estimated development time: 5-7 hours

## License

This project was created as part of a coding assessment for Dunedain.
