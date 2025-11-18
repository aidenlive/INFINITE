# UI/UX Issues Report
**Project:** Infinite Canvas v1.0
**Date:** 2025-11-18
**Scope:** Consistency, Accessibility, Responsiveness, Performance, Organization

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

### P0-101: Missing Typography Plugin
**Priority:** P0 | **Complexity:** Simple
**Impact:** Markdown rendering broken, production build will fail

**Issue:**
- `prose` classes used in MarkdownCard.tsx:45
- `@tailwindcss/typography` plugin NOT installed
- Classes will not work, markdown will render unstyled

**Location:** `client/src/nodes/renderers/MarkdownCard.tsx:45`

**Error:**
```tsx
<div className="prose prose-sm max-w-none">
  <ReactMarkdown>...</ReactMarkdown>
</div>
// prose classes don't exist!
```

**Fix:**
```bash
cd client
npm install -D @tailwindcss/typography
```

Then update `tailwind.config.js`:
```javascript
plugins: [
  require('@tailwindcss/typography'),
],
```

---

### P0-102: Undefined Font Class
**Priority:** P0 | **Complexity:** Simple
**Impact:** Sticky notes will use fallback font, broken design

**Issue:**
- `font-handwriting` class used but never defined
- Not in Tailwind config
- Not loaded from Google Fonts

**Location:** `client/src/nodes/renderers/StickyCard.tsx:70`

**Fix (Option 1 - Remove):**
```tsx
// Change to regular font
className="... font-sans"
```

**Fix (Option 2 - Add font):**
```javascript
// tailwind.config.js
fontFamily: {
  handwriting: ['Caveat', 'cursive'],
}
```

```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet">
```

---

## P1: CRITICAL ISSUES

### P1-101: Complete Accessibility Failure
**Priority:** P1 | **Complexity:** Complex
**Impact:** Violates WCAG 2.1, excludes users with disabilities

**Critical Issues:**

1. **No Focus Indicators** (WCAG 2.4.7 Failure)
   - All textareas use `outline-none` removing focus rings
   - Buttons have no visible focus state
   - Keyboard users cannot see where focus is
   - Location: All card renderers

2. **No ARIA Labels** (WCAG 4.1.2 Failure)
   - 15+ icon-only buttons without labels
   - Screen readers announce "button" with no context
   - Example: Toolbar buttons, context menu items
   - Location: `client/src/components/Toolbar.tsx`, `ContextMenu.tsx`

3. **Non-Semantic Icons** (WCAG 1.3.1 Failure)
   - Uses `<i>` tags for icons (non-semantic)
   - Should use proper ARIA roles
   - 19 instances across codebase

4. **Color Contrast Violations** (WCAG 1.4.3 Likely Failure)
   - `canvas-muted` (60% lightness) on white background = ~3:1 contrast
   - Requires 4.5:1 for AA compliance
   - Location: All placeholder text, secondary labels

5. **Keyboard Trap** (WCAG 2.1.2 Potential)
   - Modal/context menu may trap focus
   - No escape handling in some components

**Locations:**
- All components: `client/src/components/*.tsx`
- All card renderers: `client/src/nodes/renderers/*.tsx`

**Complexity:** Complex (requires systematic fixes across all components)

**Recommended Fixes:**

```tsx
// 1. Add focus-visible styles globally
// index.css
button:focus-visible, input:focus-visible, textarea:focus-visible {
  outline: 2px solid oklch(60% 0.15 250);
  outline-offset: 2px;
}

// 2. Add ARIA labels to all icon buttons
<button
  aria-label="Reset viewport to default view"
  title="Reset View"
>
  <i className="ph ph-arrows-clockwise" aria-hidden="true"></i>
</button>

// 3. Fix color contrast
canvas-muted: 'oklch(50% 0 0)' // Darker for better contrast

// 4. Add keyboard navigation
const [focusIndex, setFocusIndex] = useState(0);
useEffect(() => {
  const handleKeyboard = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setFocusIndex(prev => Math.min(prev + 1, items.length - 1));
    }
    // ... handle arrow navigation
  };
}, []);
```

---

### P1-102: Zero Responsive Design
**Priority:** P1 | **Complexity:** Complex
**Impact:** Unusable on mobile/tablet despite docs claiming responsive

**Issue:**
- No responsive breakpoints used anywhere
- Fixed sizes don't adapt to viewport
- Touch targets below iOS 44px guideline
- Toolbar too wide for mobile
- Documentation claims responsive but code isn't

**Evidence:**
- 0 occurrences of `sm:`, `md:`, `lg:`, `xl:` in codebase
- Design doc defines breakpoints but none used
- App.tsx has help tooltip that overlaps on small screens

**Locations:**
- All components need responsive variants
- Toolbar: `client/src/components/Toolbar.tsx`
- Help tooltip: `client/src/App.tsx:84-96`

**Impact by Device:**
- **Mobile (< 640px)**: Toolbar overflows, cards too small to manipulate
- **Tablet (640-1024px)**: Suboptimal touch targets, wasted space
- **Desktop (> 1024px)**: Works as intended

**Fix Required:**
```tsx
// Toolbar.tsx - make responsive
<div className="
  fixed bottom-4 md:bottom-6
  left-4 right-4 md:left-1/2 md:-translate-x-1/2
  max-w-full md:max-w-fit
  overflow-x-auto md:overflow-visible
">
  <div className="glass-panel rounded-card-lg px-2 md:px-4 py-2 md:py-3 flex gap-1 md:gap-2">
    {/* Buttons with touch-friendly sizes */}
    <button className="p-3 md:p-2 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0">
```

---

### P1-103: Design Token Violations
**Priority:** P1 | **Complexity:** Medium
**Impact:** Inconsistent visual language, maintenance nightmare

**Issues:**

1. **Hardcoded Colors Breaking Token System**
   - StickyCard: Uses `text-gray-800`, `text-gray-600` instead of design tokens
   - CodeCard: Uses `bg-canvas-text`, `text-gray-100`, `text-gray-400`
   - ContextMenu: Uses `text-red-600`, `bg-red-50` (not in design system)
   - Location: All card renderers

2. **Inconsistent Border Radius**
   - Both `rounded-lg` (12px) and `rounded-card` (16px) used
   - Should standardize on design tokens
   - 5 instances of inconsistency

3. **Shadow System Incomplete**
   - Uses `shadow-lg` (not in design system)
   - Should use `shadow-card`, `shadow-card-hover`, `shadow-card-drag`
   - Location: `StickyCard.tsx:37`

4. **Ad-hoc Spacing Values**
   - Uses `gap-1`, `gap-2`, `gap-3` instead of semantic tokens
   - Should use design system spacing (8px, 12px, 16px, 24px)

**Locations:**
- `client/src/nodes/renderers/StickyCard.tsx:23-91`
- `client/src/nodes/renderers/CodeCard.tsx:20-44`
- `client/src/components/ContextMenu.tsx:93`

**Fix:**
```tsx
// StickyCard - use design tokens
className="text-canvas-text"  // instead of text-gray-800
className="text-canvas-muted" // instead of text-gray-600

// CodeCard - redesign to use white background like other cards
<div className="w-full h-full flex flex-col bg-canvas-card">
  <div className="flex items-center justify-between px-4 py-2 border-b border-canvas-border bg-canvas-bg">
    <span className="text-sm font-medium text-canvas-text">

// ContextMenu - add danger color to design system
// tailwind.config.js
danger: {
  primary: 'oklch(60% 0.15 10)',  // Red
  light: 'oklch(95% 0.05 10)',
}
```

---

### P1-104: Missing CDN Version Pinning
**Priority:** P1 | **Complexity:** Simple
**Impact:** Production breakage risk, cache busting issues

**Issue:**
- Phosphor Icons loaded from unpkg without version: `@phosphor-icons/web`
- Will load latest version, breaking changes possible
- Cache invalidation issues in production

**Location:** `client/index.html:15`

**Current:**
```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
```

**Fix:**
```html
<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
```

**Better Fix:**
- Install as npm package instead of CDN
- Bundle with application for better performance

```bash
npm install @phosphor-icons/react
```

---

## P2: IMPORTANT ISSUES

### P2-101: Zero Component Reusability
**Priority:** P2 | **Complexity:** Medium
**Impact:** High maintenance burden, code duplication

**Issue:**
- 25+ inline button definitions with duplicate styling
- Pattern `px-4 py-2.5 hover:bg-accent-light transition-colors` repeated 13 times
- 4 textarea implementations with same styling
- No shared UI primitives

**Evidence:**
```tsx
// This pattern appears 13 times:
<button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors text-left">

// Textareas duplicated across 4 files with same classes:
<textarea className="w-full h-full resize-none bg-transparent border-none outline-none text-canvas-text font-sans">
```

**Locations:**
- Toolbar: 10+ button variants
- ContextMenu: 3+ button variants
- Card renderers: 4 textarea implementations

**Fix - Create Shared Components:**

```tsx
// client/src/components/ui/Button.tsx
interface ButtonProps {
  variant?: 'default' | 'danger' | 'ghost';
  icon?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  icon,
  children,
  ...props
}) => {
  const variants = {
    default: 'hover:bg-accent-light',
    danger: 'hover:bg-danger-light text-danger-primary',
    ghost: 'hover:bg-canvas-border',
  };

  return (
    <button
      className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${variants[variant]}`}
      {...props}
    >
      {icon && <i className={`ph ph-${icon}`} aria-hidden="true" />}
      {children}
    </button>
  );
};

// Usage:
<Button icon="copy" onClick={handleDuplicate}>Duplicate</Button>
<Button variant="danger" icon="trash" onClick={handleDelete}>Delete</Button>
```

---

### P2-102: Design Documentation Mismatch
**Priority:** P2 | **Complexity:** Simple
**Impact:** Confusing for developers, unreliable docs

**Issues:**

1. **CSS Variables Documented But Not Used**
   - DESIGN.md shows `:root` CSS variables (lines 408-436)
   - Actual code uses Tailwind classes
   - Developers may try to use CSS vars that don't exist

2. **Typography Plugin Documented**
   - Design doc references prose classes
   - Plugin not installed (see P0-101)

3. **Handwriting Font Documented**
   - Design mentions "custom font" for sticky notes
   - Not configured anywhere (see P0-102)

**Location:** `docs/DESIGN.md`

**Fix:**
- Update DESIGN.md to reflect actual Tailwind implementation
- OR implement CSS variables as documented
- Add note about what's planned vs implemented

---

### P2-103: No Component Documentation
**Priority:** P2 | **Complexity:** Medium
**Impact:** Poor developer experience, hard to maintain

**Issue:**
- Zero JSDoc comments
- No prop descriptions
- No usage examples
- No Storybook or component playground

**Example - Current:**
```tsx
interface TextCardProps {
  card: Card;
}

export const TextCard: React.FC<TextCardProps> = ({ card }) => {
```

**Example - Should Be:**
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
 * @param {Card} card - Card data object containing content and metadata
 */
interface TextCardProps {
  /** Card data including position, size, content, and metadata */
  card: Card;
}

export const TextCard: React.FC<TextCardProps> = ({ card }) => {
```

**Recommendation:**
- Add JSDoc to all components
- Consider Storybook for component documentation
- Add usage examples to README

---

### P2-104: Inconsistent Glass Morphism
**Priority:** P2 | **Complexity:** Simple
**Impact:** Visual inconsistency

**Issue:**
- `.glass-panel` utility defined in `index.css:51-55`
- Used correctly in Toolbar and ContextMenu
- NOT used in help tooltip (App.tsx:84)
- CardNode has custom blur that differs

**Location:**
- Correct: `client/src/components/Toolbar.tsx:62`
- Missing: `client/src/App.tsx:84`

**Fix:**
```tsx
// App.tsx:84 - Add glass-panel class
<div className="fixed top-4 right-4 glass-panel rounded-lg px-4 py-3 max-w-xs">
```

---

### P2-105: Help Tooltip Not Responsive
**Priority:** P2 | **Complexity:** Simple
**Impact:** Overlaps content on mobile

**Issue:**
- Fixed position `top-4 right-4`
- No mobile hide/collapse
- Blocks canvas on small screens
- `max-w-xs` not enough for narrow viewports

**Location:** `client/src/App.tsx:84-96`

**Fix:**
```tsx
<div className="
  fixed top-4 right-4
  hidden md:block
  glass-panel rounded-lg px-4 py-3
  max-w-xs
">
  {/* Or make collapsible on mobile */}
</div>
```

---

### P2-106: No Loading/Empty States
**Priority:** P2 | **Complexity:** Simple
**Impact:** Poor UX during data fetching

**Issue:**
- No loading spinner while fetching cards from API
- No empty state message when canvas is empty
- No error state when API fails
- Canvas just appears blank

**Recommendation:**
```tsx
// Add to App.tsx
{loading && <LoadingSpinner />}
{!loading && cards.length === 0 && (
  <EmptyState>
    <p>Your canvas is empty</p>
    <Button onClick={() => addCard('text', ...)}>Create First Card</Button>
  </EmptyState>
)}
```

---

### P2-107: Keyboard Shortcuts Not Discoverable
**Priority:** P2 | **Complexity:** Simple
**Impact:** Users don't know shortcuts exist

**Issue:**
- Shortcuts implemented in App.tsx:31-57
- No in-app help menu
- Not shown in help tooltip
- Users won't discover Delete, Escape, Cmd+E

**Fix:**
```tsx
// Update help tooltip to show shortcuts
<ul className="text-xs text-canvas-muted space-y-1">
  <li>• Scroll to zoom</li>
  <li>• Drag to pan</li>
  <li>• Click cards to select</li>
  <li>• Shift+click for multi-select</li>
  <li>• Delete/Backspace to remove</li>
  <li>• Escape to deselect all</li>
  <li>• Cmd+E to export</li>
</ul>
```

---

## P3: NICE-TO-HAVE

### P3-101: Context Menu Z-Index Conflict
**Priority:** P3 | **Complexity:** Simple
**Impact:** Visual glitch if cards have high z-index

**Issue:**
- Context menu z-index: 100
- Cards can have any z-index value
- Potential for cards to render above menu

**Location:** `client/src/components/ContextMenu.tsx:58`

**Fix:**
```tsx
// Ensure context menu always on top
className="fixed z-[9999] ..." // instead of z-[100]
```

---

### P3-102: No Dark Mode
**Priority:** P3 | **Complexity:** Medium
**Impact:** Missing expected feature

**Issue:**
- Design system only defines light mode
- No dark mode toggle
- OKLCH colors would adapt well to dark mode

**Recommendation:**
```css
/* Add dark mode colors */
@media (prefers-color-scheme: dark) {
  :root {
    --canvas-bg: oklch(20% 0 0);
    --canvas-card: oklch(25% 0 0);
    --canvas-text: oklch(95% 0 0);
  }
}
```

---

### P3-103: No Card Animation Preferences
**Priority:** P3 | **Complexity:** Simple
**Impact:** Accessibility - some users prefer reduced motion

**Issue:**
- No `prefers-reduced-motion` support
- Animations always play
- Can cause motion sickness for some users

**Fix:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### P3-104: Color Picker Accessibility
**Priority:** P3 | **Complexity:** Simple
**Impact:** Sticky note colors hard to select for keyboard users

**Issue:**
- Color buttons in StickyCard are visual only
- No keyboard navigation
- No labels for screen readers

**Location:** `client/src/nodes/renderers/StickyCard.tsx:44-55`

**Fix:**
```tsx
<button
  aria-label={`Change color to ${colorName}`}
  className="..."
  onClick={() => handleColorChange(c)}
  onKeyDown={(e) => e.key === 'Enter' && handleColorChange(c)}
>
```

---

### P3-105: No Touch Gesture Support
**Priority:** P3 | **Complexity:** Medium
**Impact:** Poor tablet experience

**Issue:**
- Pinch-to-zoom not implemented
- Two-finger pan not optimized
- Touch targets mentioned but not properly sized
- `touch-action: pan-x pan-y` set globally may conflict

**Recommendation:**
- Add proper touch event handlers
- Implement pinch zoom gesture
- Increase touch target sizes to 44x44px minimum

---

### P3-106: Grid Visibility at High Zoom
**Priority:** P3 | **Complexity:** Simple
**Impact:** Grid becomes too dense when zoomed in

**Issue:**
- Grid scales linearly with zoom
- At 5x zoom, grid is 200px spacing (too large)
- At 0.1x zoom, grid is 4px spacing (too dense)

**Location:** `client/src/canvas/InfiniteCanvas.tsx:51`

**Fix:**
```tsx
// Clamp grid size to reasonable range
const gridSize = Math.max(20, Math.min(80, 40 * viewport.zoom));
backgroundSize: `${gridSize}px ${gridSize}px`,
```

---

## Summary Statistics

| Priority | Count | Simple | Medium | Complex |
|----------|-------|--------|--------|---------|
| P0       | 2     | 2      | 0      | 0       |
| P1       | 4     | 1      | 1      | 2       |
| P2       | 7     | 4      | 3      | 0       |
| P3       | 6     | 4      | 2      | 0       |
| **Total**| **19**| **11** | **6**  | **2**   |

---

## Accessibility Audit Summary

**WCAG 2.1 Level AA Compliance: FAIL**

| Criterion | Status | Issues |
|-----------|--------|--------|
| 1.3.1 Info and Relationships | ❌ FAIL | Non-semantic icons |
| 1.4.3 Contrast (Minimum) | ❌ FAIL | Muted text insufficient contrast |
| 2.1.1 Keyboard | ⚠️ PARTIAL | Some keyboard support |
| 2.1.2 No Keyboard Trap | ⚠️ UNKNOWN | Needs testing |
| 2.4.7 Focus Visible | ❌ FAIL | No focus indicators |
| 3.2.1 On Focus | ✅ PASS | No unexpected changes |
| 4.1.2 Name, Role, Value | ❌ FAIL | Missing ARIA labels |

**Critical Accessibility Fixes Required:**
1. Add focus indicators to all interactive elements
2. Add ARIA labels to all icon buttons
3. Fix color contrast ratios
4. Use semantic HTML/ARIA roles
5. Test with screen readers

---

## Immediate Action Required

**Must fix before production:**
1. P0-101: Install typography plugin (5 minutes)
2. P0-102: Fix undefined font class (10 minutes)
3. P1-101: Implement basic accessibility (2-3 days)
4. P1-102: Add responsive breakpoints (1-2 days)
5. P1-104: Pin CDN versions (5 minutes)

**High-value improvements:**
- P1-103: Fix design token violations (4 hours)
- P2-101: Create reusable button component (2 hours)
- P2-105: Make help tooltip responsive (30 minutes)
- P2-107: Show keyboard shortcuts in UI (30 minutes)
