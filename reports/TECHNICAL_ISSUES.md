# Technical Issues Report
**Project:** Infinite Canvas v1.0
**Date:** 2025-11-18
**Scope:** Architecture, Implementation, Functionality, Maintenance

---

## Classification System

**Priority = Impact × Urgency**
- **P0**: Blocker (system broken, security risk, data loss)
- **P1**: Critical (major functionality broken, poor UX)
- **P2**: Important (missing features, technical debt)
- **P3**: Nice-to-have (polish, optimization)

**Complexity = Time × Risk**
- **Simple**: <1 hour, low risk
- **Medium**: 1-4 hours, some risk
- **Complex**: >4 hours or high risk

---

## P0: BLOCKER ISSUES

### P0-001: File Upload Directory Missing
**Priority:** P0 | **Complexity:** Simple
**Impact:** Application crash on first file upload attempt

**Issue:**
- `server/uploads/` directory does not exist
- Upload route configured to save to `/server/uploads/` (uploadRoutes.ts:14)
- Will throw ENOENT error on first upload attempt

**Location:** `server/src/routes/uploadRoutes.ts:14`

**Fix:**
```bash
mkdir -p server/uploads
echo "server/uploads/*" >> server/.gitignore
echo "!server/uploads/.gitkeep" >> server/.gitignore
touch server/uploads/.gitkeep
```

**Risk if not fixed:** Complete failure of image upload feature, poor user experience

---

### P0-002: No Authentication/Authorization
**Priority:** P0 | **Complexity:** Complex
**Impact:** Complete exposure of all data to anyone with API access

**Issue:**
- Zero authentication system
- All API endpoints publicly accessible
- No user management or session handling
- Database operations unprotected

**Affected Files:**
- All routes: `server/src/routes/*.ts`
- All controllers: `server/src/controllers/*.ts`

**Security Implications:**
- Anyone can read all cards/canvases
- Anyone can modify/delete any data
- No data isolation between users
- Production deployment would be catastrophic

**Recommended Fix:**
- Implement JWT-based authentication
- Add auth middleware to all protected routes
- Add user_id foreign key to cards/canvases tables
- Implement proper CORS with credentials

---

### P0-003: File Upload Security Vulnerabilities
**Priority:** P0 | **Complexity:** Medium
**Impact:** Remote code execution, path traversal, malicious file uploads

**Issues:**
1. **MIME type bypass**: MIME types can be spoofed by attackers
2. **No path traversal protection**: Filename not sanitized
3. **No virus scanning**: Malicious files accepted
4. **File extension allowlist incomplete**: Missing validation for edge cases

**Location:** `server/src/routes/uploadRoutes.ts:22-38`

**Vulnerabilities:**
```typescript
// Current code only checks extension and mimetype
const allowedTypes = /jpeg|jpg|png|gif|svg|pdf|txt|md|csv|html/;
// SVG can contain JavaScript, HTML can contain XSS
// No magic number validation
```

**Fix Required:**
- Validate file magic numbers (not just extensions)
- Sanitize filenames to prevent path traversal
- Remove HTML/SVG from allowed types or sanitize content
- Add virus scanning integration
- Implement Content-Security-Policy headers

---

## P1: CRITICAL ISSUES

### P1-001: Zero Test Coverage
**Priority:** P1 | **Complexity:** Complex
**Impact:** No regression prevention, brittle codebase

**Issue:**
- No test files exist (*.test.*, *.spec.*)
- No testing framework configured
- Cannot verify functionality works
- Refactoring is extremely risky

**Recommendation:**
- Add Vitest for unit tests
- Add React Testing Library for component tests
- Add Playwright for E2E tests
- Target 70%+ coverage for critical paths

**Files to prioritize:**
- `client/src/store/canvasStore.ts` (business logic)
- `server/src/controllers/*.ts` (API logic)
- `client/src/hooks/useCanvasGestures.ts` (interaction logic)

---

### P1-002: localStorage Persistence Not Implemented
**Priority:** P1 | **Complexity:** Medium
**Impact:** Documentation claims feature exists, users expect it

**Issue:**
- README.md claims "Auto-save - Local storage + optional backend sync"
- PROJECT_SUMMARY.md lists "💾 Auto-save" as delivered feature
- Code has no localStorage persistence implementation
- Only import/export exists, no auto-save

**Location:** `client/src/App.tsx` - missing localStorage sync

**Fix:**
```typescript
// Add to canvasStore.ts
useEffect(() => {
  const saved = localStorage.getItem('infinite-canvas-state');
  if (saved) importCanvas(saved);
}, []);

// Auto-save on changes
useEffect(() => {
  const timer = setInterval(() => {
    localStorage.setItem('infinite-canvas-state', exportCanvas());
  }, 5000);
  return () => clearInterval(timer);
}, [cards, groups, viewport]);
```

---

### P1-003: Database Connection Without Authentication
**Priority:** P1 | **Complexity:** Simple
**Impact:** Production database exposed

**Issue:**
- Default DATABASE_URL has no password: `postgresql://user:password@localhost:5432/infinite_canvas`
- No SSL/TLS configuration
- Connection pooling not configured
- No connection retry logic

**Location:**
- `server/src/db/index.ts:5`
- `.env.example:6`

**Fix:**
- Update .env.example with strong password placeholder
- Add `?sslmode=require` for production
- Configure connection pool limits
- Add retry logic with exponential backoff

---

### P1-004: Error Handling Insufficient
**Priority:** P1 | **Complexity:** Medium
**Impact:** Errors only logged to console, users see generic messages

**Issue:**
- All errors logged with `console.error`
- No error aggregation or monitoring
- Error messages not user-friendly
- No error codes for debugging
- Stack traces exposed in development mode

**Locations:**
- All controllers: 10+ instances of `console.error`
- Error handler: `server/src/middlewares/errorHandler.ts`

**Fix:**
- Implement structured logging (Winston/Pino)
- Add error codes for categorization
- Return user-friendly messages
- Never expose stack traces to client
- Add monitoring integration (Sentry)

---

### P1-005: No Database Migrations
**Priority:** P1 | **Complexity:** Medium
**Impact:** Cannot safely evolve schema, no rollback capability

**Issue:**
- Drizzle Kit installed but migration scripts not configured
- No migration history
- Schema changes will require manual SQL
- No way to rollback changes

**Location:** `server/package.json:9-10` (scripts exist but unused)

**Fix:**
```bash
npm run db:generate  # Generate initial migration
npm run db:push      # Apply to database
# Add versioned migrations to repo
```

---

### P1-006: No Logging System
**Priority:** P1 | **Complexity:** Medium
**Impact:** Cannot debug production issues, no audit trail

**Issue:**
- Only `console.log` throughout codebase
- No log levels (info, warn, error)
- No structured logging
- No log persistence
- Cannot trace requests

**Location:** All server files - 15+ `console.log/error` instances

**Recommendation:**
- Add Winston or Pino
- Implement request ID tracking
- Add log rotation
- Integrate with log aggregation service

---

## P2: IMPORTANT ISSUES

### P2-001: No Input Sanitization Beyond Zod
**Priority:** P2 | **Complexity:** Medium
**Impact:** XSS vulnerabilities in stored content

**Issue:**
- Zod validates structure, not content safety
- No HTML sanitization for user input
- Markdown content not sanitized (can contain scripts)
- Code content could be malicious

**Location:**
- `server/src/models/cardModel.ts` - validation only
- Client-side renderers render unsanitized content

**Fix:**
- Add DOMPurify for HTML sanitization
- Sanitize markdown before rendering
- Implement Content-Security-Policy
- Escape user input in all contexts

---

### P2-002: CORS Hardcoded to Single Origin
**Priority:** P2 | **Complexity:** Simple
**Impact:** Cannot deploy to multiple environments

**Issue:**
- CORS origin hardcoded: `http://localhost:5173`
- No support for multiple origins
- Production deployment will break

**Location:** `server/src/app.ts:23`

**Fix:**
```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

---

### P2-003: No Rate Limiting
**Priority:** P2 | **Complexity:** Simple
**Impact:** API abuse, DoS vulnerability

**Issue:**
- No rate limiting on any endpoint
- Upload endpoint vulnerable to abuse
- Can exhaust server resources

**Fix:**
- Add express-rate-limit
- Limit uploads to 10/hour per IP
- Limit API calls to 100/minute per IP

---

### P2-004: No API Pagination
**Priority:** P2 | **Complexity:** Medium
**Impact:** Performance degrades with large datasets

**Issue:**
- `GET /api/cards` returns ALL cards
- No limit, offset, or cursor pagination
- Will timeout with thousands of cards

**Location:** `server/src/controllers/cardController.ts:6-14`

**Fix:**
```typescript
export const getAllCards = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  const cards = await db.select()
    .from(schema.cards)
    .limit(limit)
    .offset(offset);

  res.json({ cards, limit, offset });
};
```

---

### P2-005: Type Duplication Between Frontend/Backend
**Priority:** P2 | **Complexity:** Medium
**Impact:** Type drift, maintenance burden

**Issue:**
- Card types defined separately in client and server
- No shared type package
- Manual synchronization required
- Risk of schema mismatch

**Locations:**
- `client/src/types.ts`
- `server/src/models/cardModel.ts`
- `server/src/db/schema.ts`

**Fix:**
- Create shared types package
- Generate TypeScript types from Drizzle schema
- Use single source of truth

---

### P2-006: No Concurrent Edit Handling
**Priority:** P2 | **Complexity:** Complex
**Impact:** Last write wins, data loss on conflicts

**Issue:**
- No optimistic locking
- No version tracking
- Multiple users editing same card = race condition

**Location:** `server/src/controllers/cardController.ts:54-91`

**Recommendation:**
- Add version field to cards table
- Implement optimistic locking
- Return 409 Conflict on version mismatch
- Consider operational transformation for real-time

---

### P2-007: Import Validation Minimal
**Priority:** P2 | **Complexity:** Simple
**Impact:** Malformed imports can crash application

**Issue:**
- Import only checks if JSON parses
- No schema validation
- Invalid data accepted silently

**Location:** `client/src/store/canvasStore.ts:242-254`

**Fix:**
```typescript
importCanvas: (data) => {
  try {
    const parsed = JSON.parse(data);

    // Validate structure
    if (!Array.isArray(parsed.cards)) throw new Error('Invalid cards');

    // Validate each card
    parsed.cards.forEach(card => CardSchema.parse(card));

    set({
      cards: parsed.cards || [],
      groups: parsed.groups || [],
      viewport: parsed.viewport || DEFAULT_VIEWPORT,
      selectedCardIds: [],
    });
  } catch (error) {
    console.error('Failed to import canvas data:', error);
    throw error; // Don't silently fail
  }
}
```

---

### P2-008: No Performance Monitoring
**Priority:** P2 | **Complexity:** Medium
**Impact:** Cannot identify bottlenecks

**Issue:**
- No metrics collection
- No API response time tracking
- No client-side performance monitoring
- Bundle size unknown

**Recommendation:**
- Add performance.mark/measure
- Integrate Application Performance Monitoring (APM)
- Add bundle analysis to build
- Track Core Web Vitals

---

## P3: NICE-TO-HAVE

### P3-001: No CI/CD Pipeline
**Priority:** P3 | **Complexity:** Medium
**Impact:** Manual deployment, no automation

**Issue:**
- No GitHub Actions workflow
- No automated testing
- No automated builds
- No deployment automation

**Recommendation:**
- Add .github/workflows/ci.yml
- Run tests on PR
- Build on merge to main
- Auto-deploy to staging

---

### P3-002: No Code Quality Tools
**Priority:** P3 | **Complexity:** Simple
**Impact:** Code quality drift

**Issue:**
- ESLint exists but basic configuration
- No Prettier configuration
- No pre-commit hooks
- No code coverage requirements

**Fix:**
- Add Prettier
- Configure Husky for pre-commit
- Add lint-staged
- Enforce coverage thresholds

---

### P3-003: Bundle Size Unknown
**Priority:** P3 | **Complexity:** Simple
**Impact:** May ship bloated bundle

**Issue:**
- Docs claim "~180KB gzipped"
- No actual measurement
- No bundle analysis

**Fix:**
```bash
npm install -D rollup-plugin-visualizer
# Add to vite.config.ts
```

---

### P3-004: No Undo/Redo
**Priority:** P3 | **Complexity:** Complex
**Impact:** Poor UX for mistakes (acknowledged limitation)

**Issue:**
- Users cannot undo actions
- Delete is permanent
- No command history

**Recommendation:**
- Implement command pattern
- Add undo stack to Zustand store
- Keyboard shortcuts Cmd+Z / Cmd+Shift+Z

---

### P3-005: No Virtual Scrolling
**Priority:** P3 | **Complexity:** Complex
**Impact:** Performance degrades beyond 50 cards

**Issue:**
- All cards rendered at once
- No culling for off-screen cards
- Acknowledged 50-card limit

**Recommendation:**
- Implement viewport culling
- Only render visible cards
- Use react-virtual or similar

---

## Summary Statistics

| Priority | Count | Simple | Medium | Complex |
|----------|-------|--------|--------|---------|
| P0       | 3     | 1      | 1      | 1       |
| P1       | 6     | 1      | 4      | 1       |
| P2       | 8     | 2      | 5      | 1       |
| P3       | 5     | 2      | 1      | 2       |
| **Total**| **22**| **6**  | **11** | **5**   |

---

## Immediate Action Required

**Must fix before production:**
1. P0-001: Create uploads directory (5 minutes)
2. P0-002: Implement authentication (2-3 days)
3. P0-003: Fix file upload security (4 hours)
4. P1-002: Implement localStorage persistence (2 hours)
5. P1-003: Secure database connection (1 hour)

**Can defer but risky:**
- P1-001: Add test coverage (ongoing)
- P1-004: Improve error handling (1 day)
- P2-001: Add input sanitization (4 hours)
