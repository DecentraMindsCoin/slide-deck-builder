# Quick Start Guide - Feature Development

Fast reference for developing and tracking features in the AI Slide Deck Builder.

---

## 🚀 Getting Started

### Run the Application
```bash
yarn dev
# Open http://localhost:3000
```

### View Documentation
- **README.md** - Full project documentation
- **FEATURE_TRACKER.md** - Feature status and priorities
- **PROJECT_ROADMAP.md** - Visual development timeline
- **IMPLEMENTATION_GUIDE.md** - Detailed implementation steps
- **GIT_COMMIT_HISTORY.md** - Git workflow and commands

---

## 📝 Adding a New Feature

### Step 1: Create Feature Branch
```bash
# Use the helper script
./scripts/create-feature-branch.sh

# Or manually
git checkout -b feature/XX-feature-name
```

### Step 2: Update Feature Tracker
Edit `FEATURE_TRACKER.md`:
```markdown
**Status**: 🚧 In Progress
```

### Step 3: Implement Feature
- Write code following existing patterns
- Use TypeScript for type safety
- Follow component structure in `src/components/`
- Add services to `src/services/`
- Update types in `src/types/`

### Step 4: Test Thoroughly
```bash
# Run dev server
yarn dev

# Test manually:
# - Feature works as expected
# - No console errors
# - Responsive on different screens
# - Keyboard navigation still works
# - Editing still works
```

### Step 5: Commit Changes
```bash
git add .
git commit -m "feat: description of feature

- Detail 1
- Detail 2
- Detail 3"
```

### Step 6: Merge to Main
```bash
git checkout main
git merge feature/XX-feature-name
git tag vX.X.X
git push origin main --tags
```

### Step 7: Update Documentation
- Mark feature as complete in `FEATURE_TRACKER.md`
- Update `PROJECT_ROADMAP.md` progress
- Add to `README.md` if user-facing

---

## 🎯 Priority Features to Implement

### 1. PowerPoint Export (Highest Value)
```bash
# Install dependencies
yarn add pptxgenjs
yarn add -D @types/pptxgenjs

# Create files
touch src/services/export.ts

# Add export button to SlideViewer
# Implement conversion logic
# Test with various slide types
```

**Expected Time**: 2-3 hours  
**User Value**: High - enables actual presentation use

---

### 2. Deck Regeneration (Quick Win)
```bash
# No new dependencies needed

# Modify src/app/page.tsx to store prompt
# Add regenerate button to SlideViewer
# Implement regeneration logic
# Test with different prompts
```

**Expected Time**: 1-2 hours  
**User Value**: Medium - convenience feature

---

### 3. Slide Themes (Visual Enhancement)
```bash
# Create theme configuration
touch src/config/themes.ts
touch src/components/ThemeSelector.tsx

# Define theme interfaces
# Implement theme switching
# Add localStorage persistence
```

**Expected Time**: 3-4 hours  
**User Value**: Medium - customization

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main app logic (STATE MANAGEMENT HERE)
│   └── globals.css         # Global styles
├── components/
│   ├── PromptInput.tsx     # Input form
│   ├── SlideViewer.tsx     # Slide display (MOST COMPLEX)
│   └── ErrorDisplay.tsx    # Error states
├── services/
│   └── api.ts              # API calls
└── types/
    └── slide.ts            # TypeScript types
```

---

## 🔧 Common Tasks

### Add a New Component
```bash
# Create component file
touch src/components/ComponentName.tsx

# Template:
'use client';

import { useState } from 'react';

interface ComponentNameProps {
  // props
}

export default function ComponentName({ }: ComponentNameProps) {
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Add a New Service
```bash
# Create service file
touch src/services/serviceName.ts

# Template:
export async function functionName(params: Type): Promise<ReturnType> {
  // implementation
}
```

### Add New Types
```typescript
// In src/types/slide.ts or new file
export interface NewType {
  property: string;
}
```

### Update State Management
```typescript
// In src/app/page.tsx
const [newState, setNewState] = useState<Type>(initialValue);

// Pass to components via props
<Component state={newState} onUpdate={setNewState} />
```

---

## 🐛 Debugging Tips

### Check Console
```bash
# Open browser DevTools
# Look for errors in Console tab
# Check Network tab for API calls
```

### Common Issues

**API not working?**
- Check API key in `src/services/api.ts`
- Verify endpoint URL
- Check network tab for response

**Styles not applying?**
- Ensure Tailwind classes are correct
- Check `globals.css` imports
- Verify component is using className

**State not updating?**
- Check if setState is called correctly
- Verify props are passed properly
- Use React DevTools to inspect state

**TypeScript errors?**
- Check type definitions in `src/types/`
- Ensure imports are correct
- Run `yarn build` to see all errors

---

## 📊 Testing Checklist

Before committing:
- [ ] Feature works in dev mode
- [ ] No console errors
- [ ] No TypeScript errors (`yarn build`)
- [ ] Responsive on mobile
- [ ] Keyboard navigation works
- [ ] Existing features still work
- [ ] Code follows existing patterns
- [ ] Comments added for complex logic

---

## 🎨 Styling Guidelines

### Use Tailwind Classes
```tsx
<div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
```

### Common Patterns
- **Buttons**: `px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700`
- **Cards**: `bg-white rounded-xl shadow-lg p-6`
- **Inputs**: `px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500`
- **Gradients**: `bg-linear-to-br from-blue-50 to-indigo-100`

### Icons (Lucide React)
```tsx
import { IconName } from 'lucide-react';

<IconName className="w-5 h-5" />
```

---

## 📦 Dependencies

### Current
- `next`: 16.1.2
- `react`: 19.2.3
- `tailwindcss`: 4
- `lucide-react`: 0.562.0
- `typescript`: 5

### To Add for Bonus Features
```bash
# PowerPoint export
yarn add pptxgenjs @types/pptxgenjs

# State management
yarn add zustand

# Drag and drop
yarn add @dnd-kit/core @dnd-kit/sortable

# Testing
yarn add -D jest @testing-library/react @testing-library/jest-dom
```

---

## 🔄 Git Workflow

### Daily Workflow
```bash
# Start of day
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/XX-name

# Work on feature
# ... make changes ...

# Commit frequently
git add .
git commit -m "feat: description"

# Push to remote
git push origin feature/XX-name

# When done, merge to main
git checkout main
git merge feature/XX-name
git push origin main
```

### Commit Message Format
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

---

## 📞 Need Help?

### Documentation
1. Check `README.md` for architecture
2. Review `IMPLEMENTATION_GUIDE.md` for detailed steps
3. Look at `FEATURE_TRACKER.md` for feature status
4. See `PROJECT_ROADMAP.md` for big picture

### Code Examples
- Look at existing components in `src/components/`
- Check how state is managed in `src/app/page.tsx`
- Review API integration in `src/services/api.ts`

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Lucide Icons](https://lucide.dev)

---

## ✅ Current Status

**Version**: v1.0.0  
**Core Features**: ✅ Complete  
**Ready For**: Bonus feature development  
**Next Priority**: PowerPoint export

---

**Last Updated**: January 15, 2026
