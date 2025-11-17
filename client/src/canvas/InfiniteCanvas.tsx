import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../store/canvasStore';
import { useCanvasGestures } from '../hooks/useCanvasGestures';
import { CardNode } from '../nodes/CardNode';

export const InfiniteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { cards, viewport, clearSelection, isPanning } = useCanvasStore();
  
  const { handleWheel, handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasGestures();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-canvas-bg overflow-hidden relative"
      onClick={handleCanvasClick}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
    >
      {/* Grid background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(92% 0 0) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(92% 0 0) 1px, transparent 1px)
          `,
          backgroundSize: `${40 * viewport.zoom}px ${40 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        }}
      />

      {/* Canvas content */}
      <motion.div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {cards.map((card) => (
          <CardNode key={card.id} card={card} />
        ))}
      </motion.div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 glass-panel rounded-lg text-sm text-canvas-muted font-mono">
        {Math.round(viewport.zoom * 100)}%
      </div>
    </div>
  );
};
