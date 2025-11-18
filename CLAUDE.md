# Claude AI Assistant Guide

**Project:** Infinite Canvas v1.0
**Last Updated:** 2025-11-18
**Purpose:** Guide for AI assistants working on this codebase

---

## Quick Context

You are working on **Infinite Canvas**, a React/TypeScript spatial notebook application with an Express/PostgreSQL backend. The project is **feature-complete but not production-ready** - there are 41 identified issues across security, accessibility, testing, and mobile support.

**Key Facts:**
- **Status:** 🟡 In Development (56% production-ready)
- **Architecture:** Monorepo with separate client/server
- **Tech Stack:** React 18, TypeScript 5.4, Vite, Zustand, Express, Drizzle ORM, PostgreSQL
- **Issues:** 5 P0 (blockers), 10 P1 (critical), 15 P2 (important), 11 P3 (nice-to-have)
- **Timeline:** 8-11 weeks to production

---

## Essential Reading

**Before making any changes, read:**

1. **[STATUS.md](./STATUS.md)** - Current project state, health scores, known issues
2. **[reports/PRIORITIZED_TASKS.md](./reports/PRIORITIZED_TASKS.md)** - All 41 issues with implementation guidance
3. **[reports/TECHNICAL_ISSUES.md](./reports/TECHNICAL_ISSUES.md)** - Technical debt and architecture
4. **[reports/UI_UX_ISSUES.md](./reports/UI_UX_ISSUES.md)** - UI/UX problems and fixes

**For context:**
- **[README.md](./README.md)** - Project overview and features
- **[docs/DESIGN.md](./docs/DESIGN.md)** - Design system (note: some design-code mismatches exist)
- **[docs/API.md](./docs/API.md)** - Backend API reference

---

## Project Structure

```
/home/user/INFINITE/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── App.tsx        # Main app component
│   │   ├── canvas/        # Canvas rendering logic
│   │   ├── components/    # UI components (only 2 files: Toolbar, ContextMenu)
│   │   ├── nodes/         # Card types and renderers
│   │   │   ├── CardNode.tsx
│   │   │   └── renderers/ # TextCard, MarkdownCard, CodeCard, ImageCard, StickyCard
│   │   ├── hooks/         # Custom hooks (only useCanvasGestures)
│   │   ├── store/         # Zustand state management
│   │   │   └── canvasStore.ts
│   │   └── types.ts       # TypeScript types
│   ├── index.html         # Entry point (loads fonts and Phosphor icons from CDN)
│   ├── tailwind.config.js # Tailwind with custom OKLCH colors
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── app.ts         # Express app setup
│   │   ├── index.ts       # Server entry point
│   │   ├── routes/        # API routes (cardRoutes, canvasRoutes, uploadRoutes)
│   │   ├── controllers/   # Business logic
│   │   ├── db/            # Database (Drizzle ORM)
│   │   │   ├── schema.ts  # Database schema
│   │   │   └── index.ts   # DB connection
│   │   ├── models/        # Zod validation schemas
│   │   └── middlewares/   # Express middleware
│   ├── uploads/           # File upload directory (MUST EXIST - create if missing)
│   └── package.json
│
├── docs/                  # User documentation
├── reports/               # Health assessment reports (NEW)
├── STATUS.md              # Current project status (NEW)
├── README.md              # Project overview
└── package.json           # Root monorepo scripts
```

---

## Critical Gotchas & Known Issues

### 🔴 Must Know Before Coding

1. **No Authentication System** (P0-002)
   - All API endpoints are public
   - No user management exists
   - Do NOT deploy to production without auth
   - See reports/TECHNICAL_ISSUES.md for implementation plan

2. **File Upload Directory Missing** (P0-001)
   - `server/uploads/` does not exist
   - Will crash on first upload
   - **FIX:** `mkdir -p server/uploads`

3. **Missing Typography Plugin** (P0-101)
   - `prose` classes used in MarkdownCard but plugin not installed
   - **FIX:** `cd client && npm install -D @tailwindcss/typography`
   - Then add to `tailwind.config.js` plugins array

4. **Undefined Font Class** (P0-102)
   - `font-handwriting` used in StickyCard.tsx but never defined
   - **FIX:** Either remove or add Caveat font

5. **localStorage Not Implemented** (P1-002)
   - Docs claim "auto-save with localStorage"
   - Code does NOT save to localStorage
   - Only import/export exists

6. **Zero Test Coverage** (P1-001)
   - No test files exist
   - No testing framework configured
   - Be careful with refactoring

7. **Accessibility Violations** (P1-101)
   - All textareas use `outline-none` (removes focus indicators)
   - No ARIA labels on icon buttons
   - Color contrast issues
   - Not WCAG compliant

8. **Not Responsive** (P1-102)
   - Zero breakpoints (no `sm:`, `md:`, `lg:` anywhere)
   - Docs claim responsive but code isn't
   - Desktop-only implementation

---

## Design System Notes

### Colors (OKLCH)
```javascript
// Defined in client/tailwind.config.js
canvas: {
  bg: 'oklch(96% 0 0)',      // Light gray background
  card: 'oklch(100% 0 0)',   // Pure white cards
  border: 'oklch(90% 0 0)',  // Subtle borders
  text: 'oklch(20% 0 0)',    // Dark text
  muted: 'oklch(60% 0 0)',   // Muted text (needs darker for contrast)
}
accent: {
  primary: 'oklch(60% 0.15 250)', // Blue
  hover: 'oklch(55% 0.15 250)',
  light: 'oklch(95% 0.05 250)',
}
```

### Design Token Violations
⚠️ **Known inconsistencies:**
- StickyCard uses `text-gray-800` instead of `text-canvas-text`
- CodeCard uses dark background (breaks white card pattern)
- ContextMenu uses `text-red-600` (not in design system)
- See P1-103 in reports for full list

### Component Reusability
⚠️ **Major issue:** No shared UI components
- Button pattern repeated 25+ times
- 4 duplicate textarea implementations
- See P2-101 for refactoring plan

---

## Development Workflow

### First Time Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Create missing directories
mkdir -p server/uploads
touch server/uploads/.gitkeep

# 3. Install missing dependencies
cd client && npm install -D @tailwindcss/typography
cd ..

# 4. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 5. Setup database (if using backend)
cd server
npm run db:generate
npm run db:push
cd ..
```

### Running the App

```bash
# Full stack (frontend + backend)
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3001

# Frontend only (no database needed)
cd client && npm run dev

# Backend only
cd server && npm run dev
```

### Common Tasks

**Add a new card type:**
1. Update `client/src/types.ts` - Add to `CardType` union
2. Create renderer in `client/src/nodes/renderers/YourCard.tsx`
3. Add case in `client/src/nodes/CardNode.tsx` renderCardContent()
4. Add default size in `client/src/store/canvasStore.ts` addCard()
5. Add button to `client/src/components/Toolbar.tsx`
6. Update server schema if needed: `server/src/db/schema.ts`

**Add a new API endpoint:**
1. Define route in `server/src/routes/yourRoutes.ts`
2. Create controller in `server/src/controllers/yourController.ts`
3. Add Zod validation in `server/src/models/yourModel.ts`
4. Register route in `server/src/app.ts`
5. Update `docs/API.md`

**Fix accessibility:**
1. Add ARIA labels to all buttons: `aria-label="..."`
2. Make icons decorative: `aria-hidden="true"`
3. Remove `outline-none` from textareas
4. Add `:focus-visible` styles globally
5. Test with keyboard navigation

**Make responsive:**
1. Add breakpoints to Tailwind classes: `md:`, `lg:`, etc.
2. Increase touch targets to 44px minimum on mobile
3. Make toolbar scrollable on small screens
4. Hide help tooltip on mobile: `hidden md:block`

---

## Testing Strategy

### Current State
- ⚠️ **No tests exist**
- No testing framework configured
- No CI/CD pipeline

### Recommended Approach

**Phase 1: Setup**
```bash
# Frontend tests
cd client
npm install -D vitest @testing-library/react @testing-library/jest-dom happy-dom

# Backend tests
cd server
npm install -D vitest supertest @types/supertest
```

**Phase 2: Priority**
1. Test `canvasStore.ts` (all actions)
2. Test `useCanvasGestures.ts` (pan/zoom logic)
3. Test API controllers (all CRUD operations)
4. Test card renderers (component tests)
5. Add E2E tests with Playwright

**Phase 3: Target**
- 70%+ coverage for critical paths
- All state management tested
- All API endpoints tested
- Key user flows tested (E2E)

---

## Security Guidelines

### Current Vulnerabilities

**P0 - Fix immediately:**
1. **No authentication** - All data public
2. **File upload RCE** - No magic number validation
3. **Path traversal** - Filenames not sanitized
4. **XSS via uploads** - SVG/HTML allowed

**When implementing features:**
- ✅ Use Zod for input validation
- ✅ Use Drizzle ORM (prevents SQL injection)
- ❌ Never trust user input
- ❌ Never expose stack traces to client
- ❌ Never commit secrets to git

### Best Practices

```typescript
// GOOD - Validate and sanitize
const validatedData = CreateCardSchema.parse(req.body);
const sanitizedContent = DOMPurify.sanitize(validatedData.content);

// BAD - Direct use of user input
const card = req.body;
await db.insert(schema.cards).values(card);

// GOOD - Parameterized queries (Drizzle does this)
await db.select().from(schema.cards).where(eq(schema.cards.id, id));

// BAD - String concatenation (SQL injection risk)
await db.execute(`SELECT * FROM cards WHERE id = '${id}'`);

// GOOD - Sanitize filenames
const sanitized = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '_');

// BAD - Use filename directly
const filepath = path.join(uploadDir, req.file.originalname);
```

---

## Code Style & Conventions

### TypeScript
- ✅ Strict mode enabled
- ✅ Use interfaces for props: `interface ComponentProps { ... }`
- ✅ Avoid `any` - use `unknown` if truly unknown
- ✅ Export types alongside functions

### React Components
```tsx
// Preferred structure
interface CardProps {
  card: Card;
  onUpdate?: (card: Card) => void;
}

export const MyCard: React.FC<CardProps> = ({ card, onUpdate }) => {
  // State
  const [isEditing, setIsEditing] = useState(false);

  // Zustand store
  const { updateCard } = useCanvasStore();

  // Handlers
  const handleEdit = () => {
    // ...
  };

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

### Styling
- ✅ Use Tailwind utility classes
- ✅ Use design tokens from config (`canvas-*`, `accent-*`)
- ❌ Avoid hardcoded colors (use design system)
- ❌ Avoid inline styles unless necessary
- ⚠️ Note: Some existing code violates this (see P1-103)

### File Naming
- Components: `PascalCase.tsx` (e.g., `TextCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useCanvasGestures.ts`)
- Utils: `camelCase.ts` (e.g., `sanitize.ts`)
- Types: `types.ts` or `YourFeature.types.ts`

---

## Database Schema

### Main Tables

**cards**
```sql
id: uuid (primary key)
type: text ('text' | 'markdown' | 'code' | 'image' | 'sticky' | 'url' | 'file')
position_x: integer
position_y: integer
width: integer
height: integer
content: text
metadata: jsonb
z_index: integer
group_id: uuid (nullable)
created_at: timestamp
updated_at: timestamp
```

**groups**
```sql
id: uuid (primary key)
name: text
position_x: integer
position_y: integer
collapsed: integer (0 or 1, SQLite-style boolean)
created_at: timestamp
updated_at: timestamp
```

**canvases**
```sql
id: uuid (primary key)
name: text
data: jsonb (full canvas state)
created_at: timestamp
updated_at: timestamp
```

### Migrations

**Current state:**
- No migrations exist (clean slate)
- Schema defined in `server/src/db/schema.ts`

**To create initial migration:**
```bash
cd server
npm run db:generate  # Creates migration
npm run db:push      # Applies to database
```

**Future changes:**
1. Modify `schema.ts`
2. Run `npm run db:generate`
3. Review generated SQL
4. Run `npm run db:push`
5. Commit migration files

---

## API Endpoints

### Cards
- `GET /api/cards` - List all cards (⚠️ no pagination)
- `GET /api/cards/:id` - Get card by ID
- `POST /api/cards` - Create new card (Zod validated)
- `PUT /api/cards/:id` - Update card (Zod validated)
- `DELETE /api/cards/:id` - Delete card

### Canvases
- `GET /api/canvases` - List saved canvases
- `GET /api/canvases/:id` - Get canvas by ID
- `POST /api/canvases` - Save canvas snapshot
- `PUT /api/canvases/:id` - Update canvas
- `DELETE /api/canvases/:id` - Delete canvas

### Upload
- `POST /api/upload` - Upload file (⚠️ has security issues)
  - Accepts: jpeg, jpg, png, gif, svg, pdf, txt, md, csv, html
  - Max size: 10MB
  - Returns: `{ success, file: { filename, url, mimetype, size } }`

### Health
- `GET /api/health` - Health check endpoint

**See [docs/API.md](./docs/API.md) for detailed documentation.**

---

## State Management

### Zustand Store (client/src/store/canvasStore.ts)

**Store structure:**
```typescript
{
  // State
  cards: Card[]
  groups: CardGroup[]
  viewport: ViewportState
  selectedCardIds: string[]
  isDragging: boolean
  isPanning: boolean

  // Card actions
  addCard(type, position, content?) => Card
  updateCard(id, updates) => void
  deleteCard(id) => void
  duplicateCard(id) => void

  // Selection actions
  selectCard(id, multi?) => void
  deselectCard(id) => void
  clearSelection() => void

  // Viewport actions
  setViewport(viewport) => void
  resetViewport() => void
  fitToContent() => void

  // Group actions
  createGroup(cardIds, name?) => void
  ungroupCards(groupId) => void

  // State actions
  setDragging(isDragging) => void
  setPanning(isPanning) => void

  // Persistence
  exportCanvas() => string
  importCanvas(data) => void
}
```

**Usage:**
```typescript
// In components
const { cards, addCard, updateCard } = useCanvasStore();

// Outside components
useCanvasStore.getState().addCard('text', { x: 0, y: 0 });
```

**⚠️ Known issues:**
- No undo/redo
- No optimistic updates
- No localStorage persistence (despite docs claiming it)
- Import validation minimal

---

## Common Debugging

### Frontend Issues

**Canvas not rendering:**
- Check browser console for errors
- Verify `viewport` state is initialized
- Check if `cards` array is empty

**Cards not draggable:**
- Verify `viewport.zoom` is correct (affects coordinate transforms)
- Check `isDragging` state in CardNode
- Ensure mouse event handlers attached

**Styles not applying:**
- Run `npm run dev` to rebuild Tailwind
- Check if class names exist in `tailwind.config.js`
- Look for typos in color names

**Framer Motion not animating:**
- Check if `initial`, `animate`, `exit` props set
- Verify `AnimatePresence` wraps components
- Check if `motion.div` used instead of `div`

### Backend Issues

**Database connection fails:**
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify credentials are correct
- Check if database exists

**File upload fails:**
- Ensure `server/uploads/` directory exists
- Check disk space
- Verify file type is in allowed list
- Check file size under 10MB

**CORS errors:**
- Verify `CLIENT_URL` in `.env` matches frontend URL
- Check CORS middleware in `app.ts`
- Ensure credentials are enabled if using cookies

---

## Performance Considerations

### Known Limitations

1. **50-card performance limit**
   - Canvas slows down beyond ~50 cards
   - No virtual scrolling implemented
   - All cards rendered at once
   - See P3-005 for virtualization plan

2. **No pagination**
   - `GET /api/cards` returns all cards
   - Will timeout with thousands of cards
   - See P2-004 for pagination implementation

3. **Bundle size**
   - Docs claim ~180KB gzipped
   - Not verified (no bundle analysis)
   - Phosphor icons loaded from CDN (not bundled)

### Optimization Tips

**When adding features:**
- Use `React.memo()` for expensive components
- Debounce frequent updates (pan/zoom)
- Lazy load card renderers if needed
- Consider virtualization for lists

**Backend:**
- Add database indexes for common queries
- Implement pagination (limit 50 per page)
- Use connection pooling (already configured)
- Cache static assets

---

## Git Workflow

### Branch Strategy
- **main** - Protected, production-ready code
- **claude/*** - AI assistant feature branches
- **feature/*** - Developer feature branches

### Commit Messages
```bash
# Good
git commit -m "Fix file upload security vulnerability

- Add magic number validation
- Sanitize filenames to prevent path traversal
- Remove HTML/SVG from allowed types

Fixes: P0-003"

# Bad
git commit -m "fix bug"
```

### Before Committing

**Checklist:**
- [ ] Code follows style guide
- [ ] No console.log left in code (use proper logging)
- [ ] No secrets in code (.env only)
- [ ] TypeScript compiles without errors
- [ ] Prettier formatted (if configured)
- [ ] Related documentation updated

### Creating PRs

**Good PR description:**
```markdown
## Summary
Implements authentication system using JWT tokens

## Changes
- Add users table to database schema
- Create auth routes and controllers
- Add auth middleware to protect endpoints
- Update client with login/register forms

## Testing
- Manually tested all auth flows
- Added unit tests for auth controller
- Verified protected endpoints return 401

## Resolves
- P0-002: No authentication system

## Screenshots
[If UI changes]
```

---

## Deployment

### Current Status
- ⚠️ **Not production ready**
- No staging environment
- No CI/CD pipeline
- No deployment documentation

### Before Deploying

**Must complete:**
1. All P0 issues fixed (5 total)
2. 90%+ P1 issues fixed (10 total)
3. Authentication implemented
4. Security audit passed
5. WCAG compliance achieved
6. Mobile support working
7. Test coverage >70%
8. Error monitoring setup

**See STATUS.md deployment checklist for full requirements.**

### Environment Variables

**Required for production:**
```env
# Server
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require

# CORS
CLIENT_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Secrets
JWT_SECRET=your-secret-key-here

# Monitoring (future)
SENTRY_DSN=...
LOG_LEVEL=info
```

---

## When to Escalate

**Contact human developers if:**
1. Authentication system needs design decisions
2. Database migration fails or corrupts data
3. Security vulnerability discovered (high severity)
4. Major architectural change needed
5. Breaking changes to API required
6. User data at risk
7. Production incident occurs

**Can proceed independently if:**
- Fixing UI/UX issues from reports
- Adding new card types
- Improving accessibility
- Adding tests
- Refactoring components
- Updating documentation
- Performance optimizations

---

## Quick Reference

### File Locations

| What | Where |
|------|-------|
| Main app | `client/src/App.tsx` |
| Canvas rendering | `client/src/canvas/InfiniteCanvas.tsx` |
| State management | `client/src/store/canvasStore.ts` |
| Card renderers | `client/src/nodes/renderers/*.tsx` |
| API routes | `server/src/routes/*.ts` |
| Database schema | `server/src/db/schema.ts` |
| Validation | `server/src/models/*.ts` |
| Design tokens | `client/tailwind.config.js` |
| Types | `client/src/types.ts` |

### Commands

```bash
# Development
npm run dev              # Start both client and server
npm run dev:client       # Frontend only
npm run dev:server       # Backend only

# Build
npm run build            # Build both
npm run build:client     # Build frontend
npm run build:server     # Build backend

# Database
cd server
npm run db:generate      # Generate migration
npm run db:push          # Apply migration
npm run db:studio        # Open Drizzle Studio

# Install
npm run install:all      # Install all dependencies
```

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI library |
| typescript | 5.4.3 | Type safety |
| vite | 5.2.8 | Build tool |
| zustand | 4.5.2 | State management |
| framer-motion | 11.0.8 | Animations |
| tailwindcss | 3.4.3 | Styling |
| express | 4.19.2 | Backend framework |
| drizzle-orm | 0.30.8 | Database ORM |
| zod | 3.23.5 | Validation |

---

## Learning Resources

### Project-Specific
- [Status & Health](./STATUS.md) - Start here
- [All Issues](./reports/PRIORITIZED_TASKS.md) - Implementation guide
- [Design System](./docs/DESIGN.md) - Visual guidelines
- [API Docs](./docs/API.md) - Backend reference

### External
- **React 18**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/
- **Zustand**: https://github.com/pmndrs/zustand
- **Framer Motion**: https://www.framer.com/motion/
- **TailwindCSS**: https://tailwindcss.com/
- **Drizzle ORM**: https://orm.drizzle.team/
- **Express**: https://expressjs.com/

---

## Version History

### 2025-11-18: Health Assessment Complete
- Identified 41 issues across all domains
- Created comprehensive health reports
- Established priority and timeline
- Fixed 3 immediate blockers
- **Next:** Begin Sprint 1 (production blockers)

### 2025-10-11: Initial Project Complete
- Full-stack application built
- All core features implemented
- Comprehensive documentation written
- **Status:** Feature-complete but not production-ready

---

## Summary for AI Assistants

**When starting work on this project:**

1. ✅ Read STATUS.md for current state
2. ✅ Check reports/PRIORITIZED_TASKS.md for issues
3. ✅ Identify which issue you're working on (P0-001, P1-101, etc.)
4. ✅ Follow implementation guidance in the reports
5. ✅ Test your changes thoroughly (even without automated tests)
6. ✅ Update documentation if needed
7. ✅ Commit with clear message referencing issue ID

**Remember:**
- This is a real project with real users (eventually)
- Security is critical (no auth = blocker)
- Accessibility matters (WCAG compliance required)
- Mobile support needed (currently broken)
- Test your code (no automated tests exist yet)

**Priority order:**
1. P0 issues (5) - Production blockers
2. P1 issues (10) - Critical functionality
3. P2 issues (15) - Important improvements
4. P3 issues (11) - Nice-to-have polish

**You've got this! The codebase is clean and well-structured. The issues are well-documented. Happy coding! 🚀**

---

**Last Updated:** 2025-11-18
**Next Review:** After Sprint 1 completion (estimated 2025-11-25)
