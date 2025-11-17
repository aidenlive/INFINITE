# Infinite Canvas - Spatial Notebook Application

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A beautiful, modern infinite canvas web application for spatial note-taking and visual organization.

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Tech Stack](#tech-stack)

</div>

---

## ✨ Features

### 🎨 Beautiful Design
- **Minimalist Interface** - Clean, Apple-inspired aesthetic with OKLCH color system
- **Smooth Animations** - Physics-based motion with Framer Motion
- **Glass Morphism** - Translucent floating toolbar and controls
- **Dark Mode Ready** - Elegant color palette optimized for extended use

### 🚀 Core Capabilities
- **Infinite Canvas** - Limitless 2D workspace with smooth pan and zoom
- **Multiple Card Types**
  - 📝 Text Notes - Simple rich text editing
  - 📄 Markdown Documents - Full GFM support with live preview
  - 💻 Code Snippets - Syntax-aware with language detection
  - 🖼️ Images - Visual cards with zoom preview
  - 📌 Sticky Notes - Colorful quick notes
  - 🔗 URL Previews - Sandboxed iframe embeds

### 🎯 Interaction
- **Intuitive Gestures**
  - Trackpad pinch to zoom
  - Drag to pan with inertial scrolling
  - Click and drag cards
  - Multi-select with Shift+Click
  - Right-click context menus

### 💾 Data Management
- **Real-time Auto-save** - Local storage persistence
- **Export/Import** - JSON-based canvas snapshots
- **Backend Sync** - Optional PostgreSQL persistence
- **File Upload** - Drag & drop image support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- PostgreSQL 14+ (optional, for backend persistence)
- npm or yarn

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd infinite-canvas
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials (if using backend):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/infinite_canvas
   PORT=3001
   CLIENT_URL=http://localhost:5173
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001

### Using Frontend Only (No Database)

The frontend works perfectly standalone with localStorage persistence:

```bash
cd client
npm install
npm run dev
```

---

## 📖 Documentation

- **[API Reference](./API.md)** - Complete backend API documentation
- **[Design System](./DESIGN.md)** - Visual design guidelines and principles
- **[Roadmap](./ROADMAP.md)** - Future features and improvements

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations
- **TailwindCSS** - Utility-first styling
- **React Markdown** - Document rendering
- **Phosphor Icons** - Beautiful icon set

### Backend
- **Node.js 20** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Relational database
- **Zod** - Schema validation
- **Multer** - File uploads

### DevOps
- **tsx** - TypeScript execution
- **Concurrently** - Parallel script execution
- **Drizzle Kit** - Database migrations

---

## 📂 Project Structure

```
infinite-canvas/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── canvas/        # Canvas rendering logic
│   │   ├── components/    # UI components
│   │   ├── nodes/         # Card node components
│   │   ├── store/         # Zustand state management
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                # Backend API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── db/          # Database configuration
│   │   ├── models/      # Data models & validation
│   │   └── middlewares/ # Express middlewares
│   └── drizzle.config.ts
│
├── docs/                 # Documentation
│   ├── README.md        # This file
│   ├── API.md           # API documentation
│   ├── DESIGN.md        # Design system
│   └── ROADMAP.md       # Future plans
│
├── package.json         # Root scripts
└── .env.example         # Environment template
```

---

## 🎮 Usage

### Basic Controls

| Action | Gesture |
|--------|---------|
| **Pan canvas** | Click and drag background |
| **Zoom** | Scroll or pinch (trackpad) |
| **Select card** | Click on card |
| **Multi-select** | Shift + Click |
| **Move card** | Drag card |
| **Resize card** | Drag bottom-right corner |
| **Edit content** | Click inside card |
| **Delete card** | Select and press Delete/Backspace |
| **Context menu** | Right-click on card |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Escape` | Deselect all |
| `Delete` / `Backspace` | Delete selected cards |
| `Cmd/Ctrl + E` | Export canvas (logs to console) |

---

## 🌟 Highlights

### 1. Smooth Physics-Based Motion
Every interaction feels natural with spring animations and inertial scrolling. Cards float with subtle depth, responding to hover and drag states.

### 2. Modular Card System
Easily extensible card types with dedicated renderers. Add new content types by creating a new renderer component.

### 3. Production-Ready Architecture
- Type-safe from database to UI
- Comprehensive error handling
- Optimized bundle with code splitting
- Security headers and CORS protection

### 4. Designer-Friendly
Built with design tokens and a 4px base unit system. OKLCH color space ensures perceptual uniformity across all elements.

---

## 🧪 Development

### Frontend Development
```bash
cd client
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend Development
```bash
cd server
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
```

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 💬 Support

For questions and support, please open an issue in the repository.

---

<div align="center">

**Built with ❤️ for creative thinkers**

[⬆ Back to Top](#infinite-canvas---spatial-notebook-application)

</div>
