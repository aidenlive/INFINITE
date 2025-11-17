# Design System

This document outlines the visual design principles and system used in the Infinite Canvas application.

---

## 🎨 Design Philosophy

### Core Principles

1. **Minimalism** - Remove everything unnecessary
2. **Clarity** - Information should be immediately understandable
3. **Fluidity** - Motion should feel natural and physics-based
4. **Depth** - Subtle layering creates spatial hierarchy
5. **Delight** - Small interactions should spark joy

### Inspiration
- **Apple Notes** - Clean, minimal interface
- **FigJam** - Spatial organization and gestures
- **Notion** - Content-first design
- **Arc Browser** - Translucent UI elements
- **iPadOS** - Touch-first interactions

---

## 🎯 Color System

### OKLCH Color Space

We use OKLCH for perceptually uniform colors that look consistent across all screens.

```css
/* Base Colors */
canvas-bg:     oklch(96% 0 0)      /* Light gray background */
canvas-card:   oklch(100% 0 0)     /* Pure white cards */
canvas-border: oklch(90% 0 0)      /* Subtle borders */
canvas-text:   oklch(20% 0 0)      /* Dark text */
canvas-muted:  oklch(60% 0 0)      /* Muted text */

/* Accent Colors */
accent-primary: oklch(60% 0.15 250) /* Blue */
accent-hover:   oklch(55% 0.15 250) /* Darker blue */
accent-light:   oklch(95% 0.05 250) /* Light blue bg */
```

### Color Usage

| Color | Usage |
|-------|-------|
| `canvas-bg` | Main canvas background |
| `canvas-card` | Card backgrounds |
| `canvas-border` | Borders and dividers |
| `canvas-text` | Primary text |
| `canvas-muted` | Secondary text, placeholders |
| `accent-primary` | Interactive elements, icons |
| `accent-hover` | Hover states |
| `accent-light` | Subtle highlights |

### Sticky Note Colors

```css
yellow:  #FFE66D
red:     #FF6B6B
teal:    #4ECDC4
mint:    #95E1D3
pink:    #F38181
green:   #A8E6CF
peach:   #FFD3B6
lime:    #DCEDC1
```

---

## 📐 Spacing System

### Base Unit: 4px

All spacing is based on multiples of 4px for consistency.

```css
0.5 unit = 2px
1 unit   = 4px
2 units  = 8px
3 units  = 12px
4 units  = 16px
6 units  = 24px
8 units  = 32px
12 units = 48px
16 units = 64px
```

### Common Spacings

| Use Case | Spacing |
|----------|---------|
| Tight gap | 8px (2 units) |
| Default gap | 12px (3 units) |
| Section spacing | 16px (4 units) |
| Large spacing | 24px (6 units) |
| Card padding | 24px (6 units) |
| Toolbar padding | 16px (4 units) |

---

## 📝 Typography

### Font Families

```css
/* Primary: Interface text */
font-sans: 'Inter', system-ui, sans-serif

/* Secondary: Code and data */
font-mono: 'JetBrains Mono', monospace
```

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Heading L | 24px | 600 | 1.2 |
| Heading M | 20px | 600 | 1.3 |
| Heading S | 18px | 600 | 1.4 |
| Body L | 16px | 400 | 1.5 |
| Body M | 14px | 400 | 1.5 |
| Body S | 12px | 400 | 1.4 |
| Code | 14px | 400 | 1.6 |

### Usage Guidelines

- **Headings**: Inter, semibold (600)
- **Body text**: Inter, regular (400)
- **Labels**: Inter, medium (500)
- **Code**: JetBrains Mono, regular (400)

---

## 🔲 Border Radius

### Radius Scale

```css
rounded-sm:      4px   /* Small elements */
rounded-md:      8px   /* Buttons, inputs */
rounded-lg:      12px  /* Panels */
rounded-card:    16px  /* Cards (standard) */
rounded-card-lg: 24px  /* Cards (large) */
rounded-full:    9999px /* Circles */
```

### Usage

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Input fields | 8px |
| Cards | 16px |
| Toolbar | 24px |
| Color picker buttons | Full |
| Tooltips | 12px |

---

## 🌑 Shadows

### Shadow System

```css
/* Card shadows with depth */
shadow-card:      0 1px 8px rgba(0, 0, 0, 0.08)
shadow-card-hover: 0 4px 16px rgba(0, 0, 0, 0.12)
shadow-card-drag:  0 8px 32px rgba(0, 0, 0, 0.16)

/* Toolbar and menus */
shadow-toolbar: 0 4px 20px rgba(0, 0, 0, 0.1)
```

### Shadow Usage

- **Idle cards**: `shadow-card` (subtle)
- **Hover state**: `shadow-card-hover` (lifted)
- **Dragging**: `shadow-card-drag` (floating)
- **Toolbar**: `shadow-toolbar` (elevated)
- **Context menu**: `shadow-card-hover` (popup)

---

## ✨ Motion Design

### Animation Principles

1. **Natural Physics** - Spring-based easing
2. **Quick Response** - <300ms for interactions
3. **Purposeful** - Every animation has meaning
4. **Subtle** - Never distracting

### Spring Configuration

```javascript
{
  type: 'spring',
  stiffness: 300,  // How bouncy
  damping: 25,     // How much resistance
  mass: 1          // Weight of object
}
```

### Timing Guidelines

| Action | Duration | Easing |
|--------|----------|--------|
| Button press | 100ms | Ease-out |
| Card hover lift | 200ms | Spring |
| Card appear | 400ms | Spring |
| Zoom/pan | 0ms | Immediate (user-controlled) |
| Menu open | 150ms | Ease-out |
| Fade in/out | 200ms | Linear |

### Animation Examples

```css
/* Card lift on hover */
.card:hover {
  transform: translateY(-2px);
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Spring animation */
@keyframes spring-in {
  0%   { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
```

---

## 🎯 Component Patterns

### Cards

**Anatomy**
```
┌─────────────────────┐
│ [Header]            │  Optional header with icon + title
├─────────────────────┤
│                     │
│   [Content Area]    │  Main content (scrollable)
│                     │
└─────────────────────┘
  └─ Resize handle
```

**Visual Properties**
- Background: `canvas-card` (white)
- Border radius: `16px`
- Shadow: `shadow-card` → `shadow-card-hover` on hover
- Padding: `24px`
- Border: None (shadow creates separation)

**States**
- **Idle**: Base shadow, no border
- **Hover**: Lift 2px, darker shadow
- **Selected**: 2px blue ring (`accent-primary`)
- **Dragging**: Deepest shadow, slight opacity

### Toolbar

**Anatomy**
```
┌────────────────────────────────┐
│ [+Add] │ [⟳] [⤢] │ [↓] [↑]    │
└────────────────────────────────┘
```

**Visual Properties**
- Background: Glass morphism (translucent white)
- Backdrop filter: `blur(20px)`
- Border radius: `24px`
- Shadow: `shadow-toolbar`
- Padding: `12px 16px`
- Gap between items: `8px`

### Context Menu

**Visual Properties**
- Background: Glass morphism
- Border radius: `12px`
- Shadow: `shadow-card-hover`
- Min width: `180px`
- Item padding: `10px 16px`
- Divider: 1px solid `canvas-border`

### Sticky Notes

**Special Properties**
- No shadow (flat aesthetic)
- Gradient overlay: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)`
- Top tape: Semi-transparent strip
- Handwritten feel: Consider custom font

---

## 🎪 Interactive States

### Button States

```css
/* Base */
background: transparent
color: canvas-text

/* Hover */
background: accent-light
color: canvas-text

/* Active (pressed) */
background: accent-light
transform: scale(0.98)

/* Focus */
outline: 2px solid accent-primary
outline-offset: 2px
```

### Card States

| State | Transform | Shadow | Border |
|-------|-----------|--------|--------|
| Idle | none | 1px blur | none |
| Hover | translateY(-2px) | 4px blur | none |
| Selected | none | 4px blur | 2px ring |
| Dragging | scale(1.02) | 8px blur | none |

---

## 📱 Responsive Behavior

### Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Adaptive Design

- **Mobile**: Single column, simplified toolbar
- **Tablet**: Touch-optimized, larger hit areas
- **Desktop**: Full feature set, keyboard shortcuts

---

## ♿ Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Body text: 4.5:1 minimum
- Large text: 3:1 minimum

### Focus Indicators

```css
:focus-visible {
  outline: 2px solid accent-primary;
  outline-offset: 2px;
}
```

### Screen Reader Support

- Semantic HTML (`<button>`, `<nav>`, etc.)
- ARIA labels for icon buttons
- Keyboard navigation support

---

## 🎭 Micro-interactions

### Examples

1. **Card Lift**
   - Hover: Lift 2px with easing
   - Click: Depress 1px instantly

2. **Button Press**
   - Hover: Background fade-in
   - Click: Scale down 2%

3. **Menu Open**
   - Scale from 95% to 100%
   - Fade from 0 to 100%
   - Duration: 150ms

4. **Card Add**
   - Scale from 90% to 100%
   - Fade from 0 to 100%
   - Spring animation
   - Duration: 400ms

---

## 🎨 Design Tokens

### CSS Variables

```css
:root {
  /* Colors */
  --color-bg: oklch(96% 0 0);
  --color-card: oklch(100% 0 0);
  --color-text: oklch(20% 0 0);
  --color-accent: oklch(60% 0.15 250);
  
  /* Spacing */
  --space-unit: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
}
```

---

## 📐 Grid System

### Layout Grid

- Base: 4px unit
- Columns: 24-column fluid grid
- Gutter: 24px (6 units)
- Max width: 1920px

### Canvas Grid

- Grid size: 40px × 40px (10 units)
- Color: `oklch(92% 0 0)` (very light)
- Line width: 1px
- Scales with zoom

---

## 🎯 Visual Hierarchy

### Z-Index Scale

```css
z-1:   Cards (base)
z-10:  Selected cards
z-50:  Toolbar
z-100: Context menus
z-200: Modals
```

### Depth Perception

1. **Background** - Canvas grid (subtle)
2. **Base layer** - Cards (shadow)
3. **Elevated** - Hover states (lifted)
4. **Floating** - Toolbar (translucent)
5. **Overlay** - Menus and dialogs

---

<div align="center">

**Design is not just what it looks like. Design is how it works.**  
— Steve Jobs

[⬆ Back to Top](#design-system)

</div>
