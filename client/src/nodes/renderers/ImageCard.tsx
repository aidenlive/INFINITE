import React from 'react';
import { Card } from '../../types';

interface ImageCardProps {
  card: Card;
}

export const ImageCard: React.FC<ImageCardProps> = ({ card }) => {
  return (
    <div className="w-full h-full flex flex-col bg-canvas-bg">
      {card.metadata?.filename && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-canvas-border bg-canvas-card">
          <i className="ph ph-image text-accent-primary"></i>
          <span className="text-sm font-medium text-canvas-text truncate">
            {card.metadata.filename}
          </span>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden flex items-center justify-center p-2">
        {card.content ? (
          <img
            src={card.content}
            alt={card.metadata?.filename || 'Image'}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-canvas-muted">
            <i className="ph ph-image text-4xl"></i>
            <span className="text-sm">No image loaded</span>
          </div>
        )}
      </div>
    </div>
  );
};
