# Prioritized Task List
**Project:** Infinite Canvas v1.0
**Date:** 2025-11-18
**Total Issues:** 41 (22 Technical + 19 UI/UX)

---

## Execution Order Strategy

Tasks are ordered by:
1. **Priority** (P0 → P1 → P2 → P3)
2. **Complexity** (Simple → Medium → Complex)
3. **Dependencies** (blockers first)

---

## 🔴 P0: BLOCKERS (5 tasks)

### Immediate Fixes (< 30 minutes total)

#### 1. P0-001: Create File Upload Directory
**Time:** 5 minutes | **Risk:** None
**Impact:** Prevents application crash on file upload

```bash
mkdir -p server/uploads
touch server/uploads/.gitkeep
echo "server/uploads/*" >> server/.gitignore
echo "!server/uploads/.gitkeep" >> server/.gitignore
```

**File:** `server/uploads/` (new directory)

---

#### 2. P0-101: Install Typography Plugin
**Time:** 5 minutes | **Risk:** None
**Impact:** Fixes broken markdown rendering

```bash
cd client
npm install -D @tailwindcss/typography
```

Update `client/tailwind.config.js`:
```javascript
module.exports = {
  // ... existing config
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

**Files:**
- `client/package.json`
- `client/tailwind.config.js`

---

#### 3. P0-102: Fix Undefined Font Class
**Time:** 10 minutes | **Risk:** None
**Impact:** Fixes sticky note styling

**Option 1 (Quick Fix):**
```tsx
// client/src/nodes/renderers/StickyCard.tsx:70
// Change from:
className="... font-handwriting"
// To:
className="... font-sans"
```

**Option 2 (Proper Fix):**
Add to `client/tailwind.config.js`:
```javascript
fontFamily: {
  handwriting: ['Caveat', 'cursive'],
}
```

Add to `client/index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet">
```

**Files:**
- `client/src/nodes/renderers/StickyCard.tsx`

---

### Critical Security Fixes

#### 4. P0-003: File Upload Security Vulnerabilities
**Time:** 4 hours | **Risk:** Medium
**Impact:** Prevents RCE, XSS, path traversal attacks

**Tasks:**
1. Add file magic number validation
2. Sanitize filenames
3. Remove HTML/SVG from allowed types
4. Add file size validation
5. Implement virus scanning hook

```typescript
// server/src/routes/uploadRoutes.ts

import path from 'path';
import crypto from 'crypto';

const sanitizeFilename = (filename: string): string => {
  // Remove path traversal attempts
  const name = path.basename(filename);
  // Remove special characters
  return name.replace(/[^a-zA-Z0-9.-]/g, '_');
};

const validateFileType = (buffer: Buffer, mimetype: string): boolean => {
  // Check magic numbers
  const magicNumbers = {
    'image/jpeg': ['ffd8ff'],
    'image/png': ['89504e47'],
    'image/gif': ['474946'],
    'application/pdf': ['25504446'],
  };

  const fileHeader = buffer.toString('hex', 0, 4);
  // Validate magic number matches mimetype
  // ... implementation
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    const sanitized = sanitizeFilename(file.originalname);
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(sanitized);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Only allow safe file types - NO HTML, NO SVG
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
  },
  fileFilter,
});
```

**Files:**
- `server/src/routes/uploadRoutes.ts`

**Dependencies:** None

---

#### 5. P0-002: Implement Authentication
**Time:** 2-3 days | **Risk:** High
**Impact:** Critical security - protects all data

**Deferred:** This is complex and should be a separate feature branch.

**Recommendation:** Block production deployment until completed.

**Tasks:**
1. Design auth strategy (JWT vs Session)
2. Add users table to database
3. Implement registration/login endpoints
4. Add auth middleware to all routes
5. Update frontend with auth state management
6. Add user_id to cards/canvases tables
7. Implement row-level security

**Files:**
- `server/src/db/schema.ts` (add users table)
- `server/src/routes/authRoutes.ts` (new)
- `server/src/middlewares/authMiddleware.ts` (new)
- `server/src/controllers/authController.ts` (new)
- `client/src/store/authStore.ts` (new)
- All existing routes (add auth middleware)

**Status:** ⚠️ PRODUCTION BLOCKER - Do not deploy without this

---

## 🟠 P1: CRITICAL (10 tasks)

### Quick Wins (< 2 hours each)

#### 6. P1-104: Pin CDN Versions
**Time:** 5 minutes | **Risk:** None
**Impact:** Prevents production breakage

```html
<!-- client/index.html:15 -->
<!-- Change from: -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>

<!-- To: -->
<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
```

**Better:** Install as npm package
```bash
cd client
npm install @phosphor-icons/react
# Then replace <i> tags with React components
```

**Files:**
- `client/index.html`

---

#### 7. P1-003: Secure Database Connection
**Time:** 1 hour | **Risk:** Low
**Impact:** Production database security

**Tasks:**
1. Update .env.example with strong password
2. Add SSL configuration
3. Configure connection pooling
4. Add retry logic

```typescript
// server/src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/infinite_canvas';

// Configure with SSL and pooling
const queryClient = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : 'prefer',
  max: 10, // connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {}, // Suppress notices
});

export const db = drizzle(queryClient, { schema });
```

Update `.env.example`:
```env
# Database Configuration (PRODUCTION)
DATABASE_URL=postgresql://user:STRONG_PASSWORD_HERE@localhost:5432/infinite_canvas?sslmode=require

# Database Configuration (DEVELOPMENT)
# DATABASE_URL=postgresql://user:password@localhost:5432/infinite_canvas
```

**Files:**
- `server/src/db/index.ts`
- `.env.example`

---

#### 8. P1-002: Implement localStorage Persistence
**Time:** 2 hours | **Risk:** Low
**Impact:** Delivers promised auto-save feature

```typescript
// client/src/store/canvasStore.ts

// Add after store creation
export const useCanvasStore = create<CanvasStore>((set, get) => ({
  // ... existing store

  // Add initialization
  init: () => {
    const saved = localStorage.getItem('infinite-canvas-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        set({
          cards: parsed.cards || [],
          groups: parsed.groups || [],
          viewport: parsed.viewport || DEFAULT_VIEWPORT,
        });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  },

  // Auto-save helper
  saveToLocalStorage: () => {
    const state = get();
    const data = JSON.stringify({
      cards: state.cards,
      groups: state.groups,
      viewport: state.viewport,
    });
    localStorage.setItem('infinite-canvas-state', data);
  },
}));

// Add to App.tsx
useEffect(() => {
  // Load on mount
  useCanvasStore.getState().init();

  // Auto-save every 5 seconds
  const interval = setInterval(() => {
    useCanvasStore.getState().saveToLocalStorage();
  }, 5000);

  // Save on unmount
  return () => {
    clearInterval(interval);
    useCanvasStore.getState().saveToLocalStorage();
  };
}, []);
```

**Files:**
- `client/src/store/canvasStore.ts`
- `client/src/App.tsx`

---

### Medium Complexity Fixes

#### 9. P1-004: Improve Error Handling
**Time:** 1 day | **Risk:** Low
**Impact:** Better debugging, monitoring

**Tasks:**
1. Install Winston or Pino
2. Replace all console.log/error
3. Add structured logging
4. Add request ID tracking
5. Integrate error monitoring (Sentry)

```bash
cd server
npm install winston
```

```typescript
// server/src/utils/logger.ts (new file)
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// server/src/middlewares/logger.ts
import { logger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;

  logger.info('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  next();
};
```

**Files:**
- `server/src/utils/logger.ts` (new)
- `server/src/middlewares/logger.ts` (update)
- All controllers (replace console.error)

---

#### 10. P1-005: Setup Database Migrations
**Time:** 4 hours | **Risk:** Medium
**Impact:** Enables safe schema evolution

```bash
cd server

# Generate initial migration from schema
npm run db:generate

# This creates: drizzle/0000_initial.sql

# Apply migration
npm run db:push
```

**Update package.json scripts:**
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Create migration workflow:**
1. Make schema changes in `src/db/schema.ts`
2. Run `npm run db:generate` to create migration
3. Review generated SQL
4. Run `npm run db:migrate` to apply
5. Commit migration files to git

**Files:**
- `server/drizzle/` (new migrations directory)
- `server/package.json`

---

#### 11. P1-103: Fix Design Token Violations
**Time:** 4 hours | **Risk:** Low
**Impact:** Consistent visual design

**Tasks:**
1. Update StickyCard to use design tokens
2. Redesign CodeCard with white background
3. Add danger color to design system
4. Replace all gray-* with canvas-* tokens

```javascript
// client/tailwind.config.js
colors: {
  canvas: {
    bg: 'oklch(96% 0 0)',
    card: 'oklch(100% 0 0)',
    border: 'oklch(90% 0 0)',
    text: 'oklch(20% 0 0)',
    muted: 'oklch(50% 0 0)', // Darker for better contrast
  },
  accent: {
    primary: 'oklch(60% 0.15 250)',
    hover: 'oklch(55% 0.15 250)',
    light: 'oklch(95% 0.05 250)',
  },
  danger: {
    primary: 'oklch(60% 0.15 10)',
    hover: 'oklch(55% 0.15 10)',
    light: 'oklch(95% 0.05 10)',
  },
}
```

**Files to update:**
- `client/tailwind.config.js`
- `client/src/nodes/renderers/StickyCard.tsx`
- `client/src/nodes/renderers/CodeCard.tsx`
- `client/src/components/ContextMenu.tsx`

---

### Complex Fixes

#### 12. P1-101: Implement Accessibility
**Time:** 2-3 days | **Risk:** Medium
**Impact:** WCAG compliance, inclusive design

**Phase 1: Focus Indicators (4 hours)**
```css
/* client/src/index.css */
*:focus-visible {
  outline: 2px solid oklch(60% 0.15 250);
  outline-offset: 2px;
}

button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid oklch(60% 0.15 250);
  outline-offset: 2px;
}

/* Remove all outline-none classes */
```

**Phase 2: ARIA Labels (8 hours)**
```tsx
// Add to all icon buttons
<button
  aria-label="Reset viewport to default view"
  title="Reset View"
>
  <i className="ph ph-arrows-clockwise" aria-hidden="true"></i>
</button>

// Toolbar buttons
<button
  aria-label="Add new text note card"
  className="..."
>
  <i className="ph ph-text-aa" aria-hidden="true"></i>
  <span>Text Note</span>
</button>
```

**Phase 3: Semantic HTML (4 hours)**
```tsx
// Replace <i> with semantic icons
import { Icon } from '@phosphor-icons/react';

<Icon name="copy" aria-label="Duplicate card" />
```

**Phase 4: Color Contrast (2 hours)**
```javascript
// Increase muted text contrast
canvas-muted: 'oklch(50% 0 0)' // 4.5:1 ratio
```

**Phase 5: Keyboard Navigation (4 hours)**
- Add arrow key navigation to menus
- Add tab order management
- Test with keyboard only

**Files:**
- `client/src/index.css`
- All component files
- `client/tailwind.config.js`

**Total:** ~22 hours over 2-3 days

---

#### 13. P1-102: Add Responsive Design
**Time:** 2 days | **Risk:** Medium
**Impact:** Mobile/tablet support

**Phase 1: Responsive Toolbar (4 hours)**
```tsx
// client/src/components/Toolbar.tsx
<motion.div className="
  fixed
  bottom-4 sm:bottom-6
  left-4 right-4 sm:left-1/2 sm:-translate-x-1/2
  max-w-full sm:max-w-fit
  z-50
">
  <div className="
    glass-panel rounded-card-lg
    px-3 sm:px-4
    py-2 sm:py-3
    flex items-center gap-1 sm:gap-2
    overflow-x-auto sm:overflow-visible
  ">
    {/* Increase touch targets on mobile */}
    <button className="
      p-3 sm:p-2
      min-w-[44px] min-h-[44px]
      sm:min-w-0 sm:min-h-0
      rounded-lg hover:bg-accent-light transition-colors
    ">
```

**Phase 2: Responsive Cards (4 hours)**
```tsx
// client/src/nodes/CardNode.tsx
// Adjust minimum sizes for mobile
const minWidth = window.innerWidth < 640 ? 200 : 150;
const minHeight = window.innerWidth < 640 ? 150 : 100;
```

**Phase 3: Responsive Help Tooltip (1 hour)**
```tsx
// client/src/App.tsx
<div className="
  fixed top-4 right-4
  hidden lg:block
  glass-panel rounded-lg px-4 py-3 max-w-xs
">
```

**Phase 4: Mobile-Specific Interactions (6 hours)**
- Touch event handlers
- Pinch to zoom
- Two-finger pan
- Long-press for context menu

**Files:**
- `client/src/components/Toolbar.tsx`
- `client/src/components/ContextMenu.tsx`
- `client/src/App.tsx`
- `client/src/nodes/CardNode.tsx`
- `client/src/hooks/useCanvasGestures.ts`

**Total:** ~15 hours over 2 days

---

#### 14. P1-001: Add Test Coverage
**Time:** Ongoing | **Risk:** Low
**Impact:** Code quality, regression prevention

**Phase 1: Setup Testing Infrastructure (2 hours)**
```bash
cd client
npm install -D vitest @testing-library/react @testing-library/jest-dom

cd ../server
npm install -D vitest supertest @types/supertest
```

**Phase 2: Unit Tests (ongoing)**
- Store tests: `client/src/store/canvasStore.test.ts`
- Hook tests: `client/src/hooks/useCanvasGestures.test.ts`
- Controller tests: `server/src/controllers/*.test.ts`

**Phase 3: Component Tests (ongoing)**
- Card renderers
- Toolbar
- Context menu

**Phase 4: E2E Tests (1 week)**
```bash
npm install -D @playwright/test
```

**Target:** 70% coverage for critical paths

**Status:** Lower priority, can be done incrementally

---

#### 15. P1-006: Implement Logging System
**Time:** 1 day | **Risk:** Low
**Impact:** Production debugging

(See task #9 for implementation details)

---

## 🟡 P2: IMPORTANT (15 tasks)

### Quick Wins (< 2 hours each)

#### 16. P2-002: Fix CORS Configuration
**Time:** 30 minutes | **Risk:** None

```typescript
// server/src/app.ts
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

Update `.env.example`:
```env
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

**Files:**
- `server/src/app.ts`
- `.env.example`

---

#### 17. P2-003: Add Rate Limiting
**Time:** 1 hour | **Risk:** None

```bash
cd server
npm install express-rate-limit
```

```typescript
// server/src/app.ts
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Upload limit exceeded',
});

app.use('/api/', apiLimiter);
app.use('/api/upload', uploadLimiter);
```

**Files:**
- `server/src/app.ts`
- `server/package.json`

---

#### 18. P2-102: Fix Design Documentation
**Time:** 1 hour | **Risk:** None

Update `docs/DESIGN.md`:
- Add note about Tailwind vs CSS variables
- Mark features as implemented vs planned
- Update to reflect actual codebase

---

#### 19. P2-104: Fix Glass Morphism Consistency
**Time:** 15 minutes | **Risk:** None

```tsx
// client/src/App.tsx:84
// Add glass-panel class
<div className="fixed top-4 right-4 glass-panel rounded-lg px-4 py-3 max-w-xs">
```

---

#### 20. P2-105: Make Help Tooltip Responsive
**Time:** 15 minutes | **Risk:** None

```tsx
// client/src/App.tsx:84
<div className="fixed top-4 right-4 hidden md:block glass-panel rounded-lg px-4 py-3 max-w-xs">
```

---

#### 21. P2-107: Show Keyboard Shortcuts
**Time:** 30 minutes | **Risk:** None

```tsx
// client/src/App.tsx - update help tooltip
<ul className="text-xs text-canvas-muted space-y-1">
  <li>• Scroll to zoom</li>
  <li>• Drag to pan</li>
  <li>• Click cards to select</li>
  <li>• Shift+click for multi-select</li>
  <li>• Delete/Backspace to remove</li>
  <li>• Escape to deselect</li>
  <li>• Cmd/Ctrl+E to export</li>
</ul>
```

---

#### 22. P2-007: Improve Import Validation
**Time:** 1 hour | **Risk:** Low

```typescript
// client/src/store/canvasStore.ts
import { CardSchema } from '../types';

importCanvas: (data) => {
  try {
    const parsed = JSON.parse(data);

    if (!parsed.cards || !Array.isArray(parsed.cards)) {
      throw new Error('Invalid canvas data: missing cards array');
    }

    // Validate each card
    const validCards = parsed.cards.filter(card => {
      try {
        CardSchema.parse(card);
        return true;
      } catch {
        console.warn('Skipping invalid card:', card);
        return false;
      }
    });

    set({
      cards: validCards,
      groups: parsed.groups || [],
      viewport: parsed.viewport || DEFAULT_VIEWPORT,
      selectedCardIds: [],
    });

    return { success: true, imported: validCards.length };
  } catch (error) {
    console.error('Failed to import canvas:', error);
    throw error;
  }
}
```

---

### Medium Complexity Tasks

#### 23. P2-001: Add Input Sanitization
**Time:** 4 hours | **Risk:** Low

```bash
cd client
npm install dompurify
npm install -D @types/dompurify
```

```typescript
// client/src/utils/sanitize.ts (new file)
import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
};

export const sanitizeMarkdown = (markdown: string): string => {
  // Sanitize after rendering
  return DOMPurify.sanitize(markdown, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'a', 'strong', 'em'],
    ALLOWED_ATTR: ['href', 'class'],
  });
};

// Use in MarkdownCard
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    // Sanitize rendered HTML
    p: ({ children }) => <p>{sanitizeHTML(String(children))}</p>,
  }}
>
```

**Files:**
- `client/src/utils/sanitize.ts` (new)
- `client/src/nodes/renderers/MarkdownCard.tsx`
- `client/src/nodes/renderers/TextCard.tsx`

---

#### 24. P2-004: Add API Pagination
**Time:** 4 hours | **Risk:** Low

```typescript
// server/src/controllers/cardController.ts
export const getAllCards = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = (page - 1) * limit;

    const [cards, totalCount] = await Promise.all([
      db.select()
        .from(schema.cards)
        .limit(limit)
        .offset(offset)
        .orderBy(schema.cards.updatedAt),
      db.select({ count: sql`count(*)` }).from(schema.cards),
    ]);

    res.json({
      cards,
      pagination: {
        page,
        limit,
        total: totalCount[0].count,
        pages: Math.ceil(totalCount[0].count / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};
```

**Update client:**
```typescript
// client/src/store/canvasStore.ts
// Add pagination state and methods
```

---

#### 25. P2-005: Fix Type Duplication
**Time:** 4 hours | **Risk:** Medium

**Create shared types package:**
```bash
mkdir shared
cd shared
npm init -y
```

```typescript
// shared/types.ts
export type CardType = 'text' | 'markdown' | 'image' | 'code' | 'url' | 'file' | 'sticky';

export interface Card {
  id: string;
  type: CardType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  metadata?: Record<string, any>;
  zIndex: number;
  groupId?: string;
  createdAt: Date | number;
  updatedAt: Date | number;
}
```

**Update client and server to import from shared:**
```typescript
import { Card, CardType } from '../../shared/types';
```

---

#### 26. P2-101: Create Reusable Button Component
**Time:** 2 hours | **Risk:** Low

```tsx
// client/src/components/ui/Button.tsx (new file)
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger' | 'ghost';
  icon?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  icon,
  children,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'hover:bg-accent-light',
    danger: 'hover:bg-danger-light text-danger-primary',
    ghost: 'hover:bg-canvas-border',
  };

  return (
    <button
      className={`
        px-4 py-2.5 rounded-lg transition-colors
        flex items-center gap-3
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {icon && <i className={`ph ph-${icon}`} aria-hidden="true" />}
      {children}
    </button>
  );
};
```

**Refactor existing buttons:**
```tsx
// Before:
<button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors">
  <i className="ph ph-copy"></i>
  <span>Duplicate</span>
</button>

// After:
<Button icon="copy" onClick={handleDuplicate}>
  Duplicate
</Button>
```

**Files:**
- `client/src/components/ui/Button.tsx` (new)
- Refactor all button usages

---

#### 27. P2-103: Add Component Documentation
**Time:** 4 hours | **Risk:** None

Add JSDoc comments to all components:

```tsx
/**
 * Text card component for displaying and editing plain text notes
 *
 * @component
 * @example
 * ```tsx
 * <TextCard card={cardData} />
 * ```
 *
 * Features:
 * - Click to edit inline
 * - Auto-saves changes to store
 * - Supports optional title metadata
 *
 * @param {TextCardProps} props - Component props
 * @param {Card} props.card - Card data including position, size, content, and metadata
 */
export const TextCard: React.FC<TextCardProps> = ({ card }) => {
```

**Files:** All component files

---

#### 28. P2-106: Add Loading/Empty States
**Time:** 3 hours | **Risk:** Low

```tsx
// client/src/components/LoadingSpinner.tsx (new)
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
  </div>
);

// client/src/components/EmptyState.tsx (new)
export const EmptyState = ({ onCreateCard }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <i className="ph ph-note text-6xl text-canvas-muted"></i>
    <h2 className="text-xl font-semibold text-canvas-text">Your canvas is empty</h2>
    <p className="text-canvas-muted">Start by creating your first card</p>
    <Button icon="plus" onClick={onCreateCard}>Create Card</Button>
  </div>
);

// client/src/App.tsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Simulate loading cards from API
  setTimeout(() => setLoading(false), 100);
}, []);

{loading && <LoadingSpinner />}
{!loading && cards.length === 0 && <EmptyState onCreateCard={...} />}
```

---

#### 29. P2-008: Add Performance Monitoring
**Time:** 4 hours | **Risk:** Low

```tsx
// client/src/utils/performance.ts (new)
export const measurePerformance = (metricName: string, fn: () => void) => {
  performance.mark(`${metricName}-start`);
  fn();
  performance.mark(`${metricName}-end`);
  performance.measure(metricName, `${metricName}-start`, `${metricName}-end`);

  const measure = performance.getEntriesByName(metricName)[0];
  console.log(`${metricName}: ${measure.duration}ms`);
};

// Track Core Web Vitals
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onFCP(console.log);
onLCP(console.log);
onTTFB(console.log);
```

---

### Complex Tasks

#### 30. P2-006: Handle Concurrent Edits
**Time:** 1 week | **Risk:** High

**Phase 1: Add Version Field (2 hours)**
```sql
ALTER TABLE cards ADD COLUMN version INTEGER DEFAULT 1;
```

**Phase 2: Optimistic Locking (1 day)**
```typescript
// server/src/controllers/cardController.ts
export const updateCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { version, ...updates } = req.body;

  const current = await db.select().from(schema.cards).where(eq(schema.cards.id, id));

  if (current[0].version !== version) {
    return res.status(409).json({
      error: 'Conflict: Card was modified by another user',
      current: current[0],
    });
  }

  const updated = await db.update(schema.cards)
    .set({ ...updates, version: version + 1 })
    .where(eq(schema.cards.id, id))
    .returning();

  res.json(updated[0]);
};
```

**Phase 3: Client-Side Conflict Resolution (2 days)**
- Detect conflicts
- Show merge UI
- Allow user to choose version

**Status:** Complex, defer unless multi-user is critical

---

## 🟢 P3: NICE-TO-HAVE (11 tasks)

### Quick Polish (< 1 hour each)

#### 31. P3-001: Add CI/CD Pipeline
**Time:** 2 hours | **Risk:** Low

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm run install:all
      - run: npm run build
      - run: npm test
```

---

#### 32. P3-002: Add Code Quality Tools
**Time:** 1 hour | **Risk:** None

```bash
npm install -D prettier husky lint-staged

npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

#### 33. P3-003: Analyze Bundle Size
**Time:** 30 minutes | **Risk:** None

```bash
cd client
npm install -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
};
```

---

#### 34. P3-101: Fix Context Menu Z-Index
**Time:** 5 minutes | **Risk:** None

```tsx
// client/src/components/ContextMenu.tsx:58
className="fixed z-[9999] ..."
```

---

#### 35. P3-103: Add Reduced Motion Support
**Time:** 15 minutes | **Risk:** None

```css
/* client/src/index.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

#### 36. P3-104: Fix Color Picker Accessibility
**Time:** 30 minutes | **Risk:** None

```tsx
// client/src/nodes/renderers/StickyCard.tsx
const colorNames = {
  '#FFE66D': 'Yellow',
  '#FF6B6B': 'Red',
  // ... etc
};

{STICKY_COLORS.map((c) => (
  <button
    key={c}
    aria-label={`Change sticky note color to ${colorNames[c]}`}
    className="..."
    onClick={() => handleColorChange(c)}
  >
    <span className="sr-only">{colorNames[c]}</span>
  </button>
))}
```

---

#### 37. P3-106: Fix Grid Scaling
**Time:** 15 minutes | **Risk:** None

```tsx
// client/src/canvas/InfiniteCanvas.tsx:51
const gridSize = Math.max(20, Math.min(80, 40 * viewport.zoom));
backgroundSize: `${gridSize}px ${gridSize}px`,
```

---

### Medium Tasks

#### 38. P3-102: Add Dark Mode
**Time:** 4 hours | **Risk:** Low

```css
/* client/src/index.css */
@media (prefers-color-scheme: dark) {
  :root {
    --canvas-bg: oklch(20% 0 0);
    --canvas-card: oklch(25% 0 0);
    --canvas-border: oklch(30% 0 0);
    --canvas-text: oklch(95% 0 0);
    --canvas-muted: oklch(70% 0 0);
  }
}
```

---

#### 39. P3-105: Add Touch Gesture Support
**Time:** 1 day | **Risk:** Medium

Implement:
- Pinch to zoom
- Two-finger pan
- Long-press for context menu
- Touch target optimization

---

### Complex Features

#### 40. P3-004: Implement Undo/Redo
**Time:** 1 week | **Risk:** High

**Command Pattern Implementation:**
```typescript
// client/src/store/historyStore.ts (new)
interface Command {
  execute: () => void;
  undo: () => void;
}

const useHistoryStore = create((set, get) => ({
  undoStack: [],
  redoStack: [],

  executeCommand: (command: Command) => {
    command.execute();
    set(state => ({
      undoStack: [...state.undoStack, command],
      redoStack: [],
    }));
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    const command = undoStack[undoStack.length - 1];
    if (command) {
      command.undo();
      set({
        undoStack: undoStack.slice(0, -1),
        redoStack: [...redoStack, command],
      });
    }
  },

  redo: () => {
    // Similar to undo
  },
}));
```

---

#### 41. P3-005: Add Virtual Scrolling
**Time:** 1 week | **Risk:** High

**Viewport Culling:**
```tsx
// Only render cards visible in viewport
const visibleCards = cards.filter(card => {
  const cardBounds = {
    left: card.position.x,
    top: card.position.y,
    right: card.position.x + card.size.width,
    bottom: card.position.y + card.size.height,
  };

  const viewportBounds = {
    left: -viewport.x / viewport.zoom,
    top: -viewport.y / viewport.zoom,
    right: (window.innerWidth - viewport.x) / viewport.zoom,
    bottom: (window.innerHeight - viewport.y) / viewport.zoom,
  };

  // Check intersection
  return !(
    cardBounds.right < viewportBounds.left ||
    cardBounds.left > viewportBounds.right ||
    cardBounds.bottom < viewportBounds.top ||
    cardBounds.top > viewportBounds.bottom
  );
});
```

---

## Summary by Priority

| Priority | Total | Simple | Medium | Complex | Est. Time |
|----------|-------|--------|--------|---------|-----------|
| P0       | 5     | 3      | 1      | 1       | 1 week    |
| P1       | 10    | 3      | 5      | 2       | 3-4 weeks |
| P2       | 15    | 6      | 8      | 1       | 2-3 weeks |
| P3       | 11    | 7      | 2      | 2       | 2-3 weeks |
| **Total**| **41**| **19** | **16** | **6**   | **8-11 weeks** |

---

## Recommended Sprint Plan

### Sprint 1: Production Blockers (1 week)
- P0-001: Create uploads directory ✅
- P0-101: Install typography plugin ✅
- P0-102: Fix font class ✅
- P0-003: File upload security
- P1-104: Pin CDN versions ✅
- P1-003: Secure database ✅
- P1-002: localStorage persistence

**Outcome:** Can safely demo application

---

### Sprint 2: Critical UX (2 weeks)
- P1-103: Fix design tokens
- P1-101: Accessibility (Phase 1-3)
- P1-102: Responsive design (Phases 1-3)
- P2-101: Reusable button component
- P2-107: Show keyboard shortcuts ✅

**Outcome:** Professional, accessible UI

---

### Sprint 3: Production Readiness (2 weeks)
- P1-004: Error handling & logging
- P1-005: Database migrations
- P2-002: CORS configuration ✅
- P2-003: Rate limiting ✅
- P2-001: Input sanitization
- P2-004: API pagination

**Outcome:** Production-ready backend

---

### Sprint 4: Quality & Testing (2 weeks)
- P1-001: Test coverage (ongoing)
- P2-007: Import validation ✅
- P2-103: Component documentation
- P2-106: Loading/empty states
- P3-002: Code quality tools ✅

**Outcome:** Reliable, maintainable codebase

---

### Sprint 5: Polish & Features (2 weeks)
- P2-005: Type sharing
- P2-008: Performance monitoring
- P3-001: CI/CD ✅
- P3-003: Bundle analysis ✅
- P3-102: Dark mode
- P3-103: Reduced motion ✅

**Outcome:** Polished, optimized application

---

### Backlog (Future)
- P0-002: Authentication (separate epic)
- P2-006: Concurrent edits
- P3-004: Undo/redo
- P3-005: Virtual scrolling

---

## Quick Wins (Can do today)

These 10 tasks take < 2 hours total:

1. P0-001: Create uploads directory (5 min) ✅
2. P0-101: Install typography plugin (5 min) ✅
3. P0-102: Fix font class (10 min) ✅
4. P1-104: Pin CDN versions (5 min) ✅
5. P2-104: Glass morphism consistency (5 min) ✅
6. P2-105: Responsive help tooltip (5 min) ✅
7. P2-107: Show keyboard shortcuts (30 min) ✅
8. P3-101: Fix z-index (5 min) ✅
9. P3-103: Reduced motion (15 min) ✅
10. P3-106: Grid scaling (15 min) ✅

**Total time:** ~1.5 hours
**Impact:** Immediate bug fixes, better UX

---

## Critical Path to Production

**Must complete before launch:**
1. P0-002: Authentication ⚠️ BLOCKER
2. P0-003: File upload security
3. P1-101: Basic accessibility
4. P1-102: Mobile responsiveness
5. P1-004: Error handling/logging
6. P2-001: Input sanitization
7. P2-003: Rate limiting

**Can defer but recommended:**
- All P2 tasks
- Test coverage (P1-001)

**Nice to have:**
- All P3 tasks
