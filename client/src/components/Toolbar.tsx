import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../store/canvasStore';
import { CardType } from '../types';

export const Toolbar: React.FC = () => {
  const { addCard, resetViewport, fitToContent, viewport, exportCanvas, importCanvas } = useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddCard = (type: CardType) => {
    const centerX = (window.innerWidth / 2 - viewport.x) / viewport.zoom;
    const centerY = (window.innerHeight / 2 - viewport.y) / viewport.zoom;
    
    addCard(type, { x: centerX - 150, y: centerY - 100 });
  };

  const handleExport = () => {
    const data = exportCanvas();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvas-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      importCanvas(data);
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const centerX = (window.innerWidth / 2 - viewport.x) / viewport.zoom;
      const centerY = (window.innerHeight / 2 - viewport.y) / viewport.zoom;
      
      const card = addCard('image', { x: centerX - 200, y: centerY - 150 }, e.target?.result as string);
      card.metadata = { ...card.metadata, filename: file.name };
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-panel rounded-card-lg shadow-card-hover px-4 py-3 flex items-center gap-2">
        {/* Add card dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent-light transition-colors">
            <i className="ph ph-plus text-lg"></i>
            <span className="font-medium text-canvas-text">Add</span>
            <i className="ph ph-caret-down text-sm"></i>
          </button>
          
          <div className="absolute bottom-full mb-2 left-0 min-w-[180px] glass-panel rounded-lg shadow-card-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button
              onClick={() => handleAddCard('text')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors text-left"
            >
              <i className="ph ph-text-aa text-lg"></i>
              <span className="text-sm">Text Note</span>
            </button>
            <button
              onClick={() => handleAddCard('markdown')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors text-left"
            >
              <i className="ph ph-file-text text-lg"></i>
              <span className="text-sm">Markdown</span>
            </button>
            <button
              onClick={() => handleAddCard('code')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors text-left"
            >
              <i className="ph ph-code text-lg"></i>
              <span className="text-sm">Code Snippet</span>
            </button>
            <button
              onClick={() => handleAddCard('sticky')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors text-left"
            >
              <i className="ph ph-note text-lg"></i>
              <span className="text-sm">Sticky Note</span>
            </button>
            <div className="border-t border-canvas-border my-1"></div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors text-left"
            >
              <i className="ph ph-image text-lg"></i>
              <span className="text-sm">Upload Image</span>
            </button>
          </div>
        </div>

        <div className="w-px h-6 bg-canvas-border"></div>

        {/* View controls */}
        <button
          onClick={resetViewport}
          className="p-2 rounded-lg hover:bg-accent-light transition-colors"
          title="Reset View"
        >
          <i className="ph ph-arrows-clockwise text-lg"></i>
        </button>

        <button
          onClick={fitToContent}
          className="p-2 rounded-lg hover:bg-accent-light transition-colors"
          title="Fit to Content"
        >
          <i className="ph ph-frame-corners text-lg"></i>
        </button>

        <div className="w-px h-6 bg-canvas-border"></div>

        {/* File operations */}
        <button
          onClick={handleExport}
          className="p-2 rounded-lg hover:bg-accent-light transition-colors"
          title="Export Canvas"
        >
          <i className="ph ph-download-simple text-lg"></i>
        </button>

        <button
          onClick={() => document.getElementById('import-input')?.click()}
          className="p-2 rounded-lg hover:bg-accent-light transition-colors"
          title="Import Canvas"
        >
          <i className="ph ph-upload-simple text-lg"></i>
        </button>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          id="import-input"
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="hidden"
        />
      </div>
    </motion.div>
  );
};
