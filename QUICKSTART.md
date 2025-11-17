# ⚡ Quick Start Guide

Get Infinite Canvas running in 5 minutes!

---

## 🎯 Choose Your Path

### Path A: Frontend Only (Fastest) 🏃

**No database needed. Perfect for trying it out!**

```bash
cd infinite-canvas/client
npm install
npm run dev
```

🌐 **Open:** http://localhost:5173

**That's it!** You now have a fully functional infinite canvas with:
- All card types working
- Local storage persistence
- Full UI/UX features

---

### Path B: Full Stack (Complete) 🚀

**With backend API and database sync**

#### 1. Install Everything
```bash
cd infinite-canvas
npm run install:all
```

#### 2. Setup Database (Optional)
```bash
# Create PostgreSQL database
createdb infinite_canvas

# Or using psql
psql -U postgres -c "CREATE DATABASE infinite_canvas;"
```

#### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env if needed (defaults work for local PostgreSQL)
```

#### 4. Run Both Servers
```bash
npm run dev
```

🌐 **Frontend:** http://localhost:5173  
🔧 **Backend API:** http://localhost:3001/api/health

---

## 🎮 First Actions

Once the app is running:

1. **Pan the Canvas**
   - Click and drag the background

2. **Add Your First Card**
   - Click the **"+ Add"** button at the bottom
   - Choose **"Text Note"**
   - Start typing!

3. **Try Different Cards**
   - Add a **Sticky Note** (colorful quick notes)
   - Add a **Markdown** card (for rich documents)
   - Add a **Code** card (for code snippets)

4. **Explore Interactions**
   - **Zoom:** Scroll or pinch trackpad
   - **Select:** Click on cards
   - **Multi-select:** Shift + Click
   - **Move:** Drag cards around
   - **Resize:** Drag bottom-right corner
   - **Delete:** Select and press Delete key

---

## 📚 What's Next?

### Learn More
- 📖 [Complete Setup Guide](./SETUP.md) - Detailed installation
- 📘 [User Documentation](./docs/README.md) - Full feature guide
- 🎨 [Design System](./docs/DESIGN.md) - Visual guidelines
- 🔧 [API Reference](./docs/API.md) - Backend API docs

### Customize
- Edit colors in `client/tailwind.config.js`
- Add new card types in `client/src/nodes/renderers/`
- Modify animations in card components

### Contribute
- Check [ROADMAP.md](./docs/ROADMAP.md) for planned features
- Open issues for bugs or suggestions
- Submit PRs for improvements

---

## 🆘 Troubleshooting

### Port 5173 Already in Use?
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9
```

### Dependencies Not Installing?
```bash
# Clean install
rm -rf node_modules */node_modules
npm run install:all
```

### PostgreSQL Connection Issues?
```bash
# Check if PostgreSQL is running
pg_isready

# Or just use frontend-only mode!
cd client && npm run dev
```

---

## ✅ You're Ready!

Enjoy your infinite canvas! 🎨

Questions? Check the [docs](./docs/) or open an issue.

---

<div align="center">

[📖 Full Documentation](./docs/README.md) • [🛠️ Setup Guide](./SETUP.md) • [📊 Project Summary](./PROJECT_SUMMARY.md)

</div>
