import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../store/canvasStore';
import { Card } from '../types';
import { TextCard } from './renderers/TextCard';
import { MarkdownCard } from './renderers/MarkdownCard';
import { ImageCard } from './renderers/ImageCard';
import { CodeCard } from './renderers/CodeCard';
import { StickyCard } from './renderers/StickyCard';

interface CardNodeProps {
  card: Card;
}

export const CardNode: React.FC<CardNodeProps> = ({ card }) => {
  const { selectedCardIds, selectCard, updateCard, setDragging, viewport } = useCanvasStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 });

  const isSelected = selectedCardIds.includes(card.id);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    selectCard(card.id, e.shiftKey);
    
    setIsDragging(true);
    setDragging(true);
    dragStart.current = {
      x: e.clientX / viewport.zoom - card.position.x,
      y: e.clientY / viewport.zoom - card.position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX / viewport.zoom - dragStart.current.x;
      const newY = e.clientY / viewport.zoom - dragStart.current.y;
      
      updateCard(card.id, {
        position: { x: newX, y: newY },
      });
    } else if (isResizing) {
      const deltaX = e.clientX / viewport.zoom - resizeStart.current.x;
      const deltaY = e.clientY / viewport.zoom - resizeStart.current.y;
      
      updateCard(card.id, {
        size: {
          width: Math.max(150, resizeStart.current.width + deltaX),
          height: Math.max(100, resizeStart.current.height + deltaY),
        },
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setDragging(false);
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = {
      width: card.size.width,
      height: card.size.height,
      x: e.clientX / viewport.zoom,
      y: e.clientY / viewport.zoom,
    };
  };

  const renderCardContent = () => {
    switch (card.type) {
      case 'text':
        return <TextCard card={card} />;
      case 'markdown':
        return <MarkdownCard card={card} />;
      case 'image':
        return <ImageCard card={card} />;
      case 'code':
        return <CodeCard card={card} />;
      case 'sticky':
        return <StickyCard card={card} />;
      default:
        return <TextCard card={card} />;
    }
  };

  return (
    <motion.div
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-accent-primary' : ''
      }`}
      style={{
        left: card.position.x,
        top: card.position.y,
        width: card.size.width,
        height: card.size.height,
        zIndex: card.zIndex,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      onMouseDown={handleMouseDown}
    >
      <motion.div
        className={`w-full h-full bg-canvas-card rounded-card overflow-hidden ${
          isDragging ? 'shadow-card-drag' : isSelected ? 'shadow-card-hover' : 'shadow-card'
        }`}
        whileHover={{ y: -2 }}
      >
        {renderCardContent()}
        
        {/* Resize handle */}
        {isSelected && (
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize group"
            onMouseDown={handleResizeStart}
          >
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-canvas-border group-hover:border-accent-primary" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
