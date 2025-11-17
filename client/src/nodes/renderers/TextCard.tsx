import React, { useState } from 'react';
import { Card } from '../../types';
import { useCanvasStore } from '../../store/canvasStore';

interface TextCardProps {
  card: Card;
}

export const TextCard: React.FC<TextCardProps> = ({ card }) => {
  const { updateCard } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCard(card.id, { content: e.target.value });
  };

  return (
    <div className="w-full h-full p-6 flex flex-col">
      {card.metadata?.title && (
        <h3 className="text-lg font-semibold text-canvas-text mb-3">
          {card.metadata.title}
        </h3>
      )}
      
      {isEditing ? (
        <textarea
          className="flex-1 w-full resize-none bg-transparent border-none outline-none text-canvas-text font-sans"
          value={card.content}
          onChange={handleContentChange}
          onBlur={() => setIsEditing(false)}
          autoFocus
          placeholder="Start typing..."
        />
      ) : (
        <div
          className="flex-1 w-full text-canvas-text whitespace-pre-wrap cursor-text"
          onClick={() => setIsEditing(true)}
        >
          {card.content || (
            <span className="text-canvas-muted italic">Click to edit...</span>
          )}
        </div>
      )}
    </div>
  );
};
