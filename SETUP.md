# 🚀 Setup Guide

Follow these steps to get Infinite Canvas up and running on your machine.

---

## ✅ Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Node.js 20 or higher** - [Download](https://nodejs.org/)
- [ ] **npm 9 or higher** (comes with Node.js)
- [ ] **PostgreSQL 14+** (optional, only for backend features) - [Download](https://www.postgresql.org/download/)
- [ ] **Git** - [Download](https://git-scm.com/)

Check your versions:
```bash
node --version   # Should be v20.x.x or higher
npm --version    # Should be 9.x.x or higher
psql --version   # Optional, for backend features
```

---

## 📦 Installation Steps

### Step 1: Navigate to the Project

```bash
cd infinite-canvas
```

### Step 2: Install Dependencies

Install all dependencies for root, client, and server:

```bash
npm run install:all
```

This command will:
- Install root dependencies (concurrently)
- Install client dependencies (React, Vite, etc.)
- Install server dependencies (Express, Drizzle, etc.)

**Expected time:** 2-5 minutes depending on internet speed

---

## 🎯 Choose Your Setup

### Option A: Frontend Only (Quick Start) ⚡

**Best for:** Testing the app, learning, no backend needed

```bash
cd client
npm run dev
```

✅ **What you get:**
- Full canvas functionality
- All card types work
- Local storage persistence
- No database setup required

🌐 **Open:** http://localhost:5173

---

### Option B: Full Stack (Complete Experience) 🎨

**Best for:** Production use, multi-device sync, file uploads

#### 1. Database Setup (if using backend)

**Create a PostgreSQL database:**

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE infinite_canvas;

# Exit
\q
```

#### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your favorite editor
```

**Update these values in `.env`:**
```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/infinite_canvas
PORT=3001
CLIENT_URL=http://localhost:5173
```

#### 3. Run Database Migrations

```bash
cd server
npm run db:push
```

This creates the necessary database tables.

#### 4. Start Both Servers

From the root directory:

```bash
npm run dev
```

This starts:
- **Frontend** at http://localhost:5173
- **Backend API** at http://localhost:3001

---

## 🧪 Verify Installation

### Frontend Verification

1. Open http://localhost:5173
2. You should see:
   - A light gray canvas background
   - Sample cards (welcome message, markdown, sticky note, code)
   - A floating toolbar at the bottom
   - A help panel in the top-right

3. Try these actions:
   - Click and drag the canvas (should pan)
   - Scroll (should zoom)
   - Click on a card (should select it)
   - Click inside a text card (should be editable)

### Backend Verification (if using full stack)

1. Check API health:
   ```bash
   curl http://localhost:3001/api/health
   ```
   
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-15T10:30:00.000Z"
   }
   ```

2. Check database connection:
   ```bash
   cd server
   npm run dev
   ```
   
   You should see:
   ```
   ╔════════════════════════════════════════╗
   ║   Infinite Canvas Server Running       ║
   ╠════════════════════════════════════════╣
   ║   Port: 3001                           ║
   ║   Environment: development             ║
   ║   API: http://localhost:3001/api       ║
   ╚════════════════════════════════════════╝
   ```

---

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill the process using the port
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Database Connection Issues

**Error:** `Connection refused to localhost:5432`

**Solutions:**
1. Make sure PostgreSQL is running:
   ```bash
   # Mac (Homebrew)
   brew services start postgresql@14
   
   # Linux
   sudo systemctl start postgresql
   
   # Windows
   # Start PostgreSQL from Services
   ```

2. Check your credentials in `.env`

3. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

### Module Not Found Errors

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

### TypeScript Errors

**Error:** Various TypeScript compilation errors

**Solution:**
```bash
# Rebuild TypeScript
cd client && npm run build
cd ../server && npm run build
```

---

## 🎨 First Steps

### 1. Create Your First Card

1. Click the **"+ Add"** button in the toolbar
2. Select **"Text Note"**
3. A new card appears in the center
4. Click inside and start typing!

### 2. Add an Image

1. Click **"+ Add"** → **"Upload Image"**
2. Select an image from your computer
3. The image appears as a card
4. Drag it around, resize from the corner

### 3. Try Markdown

1. Click **"+ Add"** → **"Markdown"**
2. Click **"Edit"** in the card header
3. Write some markdown:
   ```markdown
   # Hello World
   
   - This is a list
   - With **bold** text
   - And [links](https://example.com)
   ```
4. Click **"Preview"** to see it rendered

### 4. Organize Your Space

- **Pan**: Click and drag the canvas
- **Zoom**: Scroll with mouse or pinch trackpad
- **Select multiple**: Shift + Click cards
- **Move cards**: Drag them around
- **Resize**: Drag the bottom-right corner
- **Delete**: Select and press Delete/Backspace

---

## 📖 Next Steps

Now that you're set up:

1. **Explore Features**: Try all card types and interactions
2. **Read Docs**: Check out `/docs/README.md` for detailed guides
3. **Customize**: Edit colors in `client/tailwind.config.js`
4. **Extend**: Add new card types in `client/src/nodes/renderers/`
5. **Contribute**: See [ROADMAP.md](./docs/ROADMAP.md) for ideas

---

## 🆘 Getting Help

Still stuck? Try these resources:

- **Documentation**: `/docs/README.md` - Complete user guide
- **API Reference**: `/docs/API.md` - Backend API docs
- **Design Guide**: `/docs/DESIGN.md` - Visual design system
- **Roadmap**: `/docs/ROADMAP.md` - Future features

**Need more help?**
- Check GitHub Issues
- Open a Discussion
- Report bugs with details

---

## 🎉 Success!

If you've made it here, congratulations! You now have a beautiful infinite canvas ready to organize your ideas.

**Enjoy your spatial thinking journey! 🚀**

---

<div align="center">

[← Back to README](./README.md) | [View Documentation →](./docs/README.md)

</div>
