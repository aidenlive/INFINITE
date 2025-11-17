import React, { useEffect } from 'react';
import { InfiniteCanvas } from './canvas/InfiniteCanvas';
import { Toolbar } from './components/Toolbar';
import { ContextMenu, useContextMenu } from './components/ContextMenu';
import { useCanvasStore } from './store/canvasStore';

function App() {
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();
  const { addCard } = useCanvasStore();

  // Add some sample cards on first load
  useEffect(() => {
    const hasCards = localStorage.getItem('infinite-canvas-initialized');
    if (!hasCards) {
      // Welcome text card
      addCard('text', { x: 100, y: 100 }, 'Welcome to Infinite Canvas!\n\nClick and drag to move cards around.\nScroll to zoom in and out.\nRight-click for more options.');
      
      // Sample markdown card
      addCard('markdown', { x: 500, y: 100 }, '# Getting Started\n\n- Create new cards from the toolbar\n- Double-click to edit content\n- Drag cards to arrange them\n- Group multiple cards together\n\n**Enjoy your spatial notebook!**');
      
      // Sample sticky note
      addCard('sticky', { x: 100, y: 400 }, 'Quick idea: Build something amazing! 🚀');
      
      // Sample code card
      addCard('code', { x: 950, y: 100 }, 'function hello() {\n  console.log("Hello, Infinite Canvas!");\n  return "Start coding...";\n}\n\nhello();');

      localStorage.setItem('infinite-canvas-initialized', 'true');
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected cards
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedCardIds = useCanvasStore.getState().selectedCardIds;
        selectedCardIds.forEach((id) => {
          useCanvasStore.getState().deleteCard(id);
        });
      }

      // Deselect all
      if (e.key === 'Escape') {
        useCanvasStore.getState().clearSelection();
      }

      // Export (Cmd/Ctrl + E)
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        const data = useCanvasStore.getState().exportCanvas();
        console.log('Canvas exported:', data);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle right-click context menu
  useEffect(() => {
    const handleContextMenuEvent = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenuEvent);
    return () => document.removeEventListener('contextmenu', handleContextMenuEvent);
  }, []);

  return (
    <div className="w-full h-full relative" onContextMenu={(e) => openContextMenu(e)}>
      <InfiniteCanvas />
      <Toolbar />
      
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          cardId={contextMenu.cardId}
          onClose={closeContextMenu}
        />
      )}

      {/* Help tooltip */}
      <div className="fixed top-4 right-4 glass-panel rounded-lg px-4 py-3 max-w-xs">
        <h3 className="text-sm font-semibold text-canvas-text mb-2 flex items-center gap-2">
          <i className="ph ph-info"></i>
          Quick Tips
        </h3>
        <ul className="text-xs text-canvas-muted space-y-1">
          <li>• Scroll to zoom</li>
          <li>• Drag to pan</li>
          <li>• Click cards to select</li>
          <li>• Shift+click for multi-select</li>
          <li>• Delete/Backspace to remove</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
