import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '../store/canvasStore';

interface ContextMenuProps {
  x: number;
  y: number;
  cardId?: string;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, cardId, onClose }) => {
  const { deleteCard, duplicateCard, selectedCardIds, createGroup } = useCanvasStore();

  useEffect(() => {
    const handleClick = () => onClose();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleDuplicate = () => {
    if (cardId) {
      duplicateCard(cardId);
    }
    onClose();
  };

  const handleDelete = () => {
    if (cardId) {
      deleteCard(cardId);
    }
    onClose();
  };

  const handleGroup = () => {
    if (selectedCardIds.length > 1) {
      createGroup(selectedCardIds);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-[100] min-w-[180px] glass-panel rounded-lg shadow-card-hover overflow-hidden"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
      >
        {cardId && (
          <>
            <button
              onClick={handleDuplicate}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors text-left"
            >
              <i className="ph ph-copy text-lg"></i>
              <span className="text-sm">Duplicate</span>
            </button>

            <div className="border-t border-canvas-border"></div>
          </>
        )}

        {selectedCardIds.length > 1 && (
          <>
            <button
              onClick={handleGroup}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors text-left"
            >
              <i className="ph ph-stack text-lg"></i>
              <span className="text-sm">Group Selected</span>
            </button>

            <div className="border-t border-canvas-border"></div>
          </>
        )}

        {cardId && (
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors text-left"
          >
            <i className="ph ph-trash text-lg"></i>
            <span className="text-sm">Delete</span>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    cardId?: string;
  } | null>(null);

  const openContextMenu = (e: React.MouseEvent, cardId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, cardId });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return { contextMenu, openContextMenu, closeContextMenu };
};
