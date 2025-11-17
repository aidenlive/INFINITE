import React, { useState } from 'react';
import { Card } from '../../types';
import { useCanvasStore } from '../../store/canvasStore';

interface StickyCardProps {
  card: Card;
}

const STICKY_COLORS = [
  '#FFE66D', // Yellow
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#95E1D3', // Mint
  '#F38181', // Pink
  '#A8E6CF', // Green
  '#FFD3B6', // Peach
  '#DCEDC1', // Light Green
];

export const StickyCard: React.FC<StickyCardProps> = ({ card }) => {
  const { updateCard } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(false);
  const color = card.metadata?.color || '#FFE66D';

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCard(card.id, { content: e.target.value });
  };

  const handleColorChange = (newColor: string) => {
    updateCard(card.id, {
      metadata: { ...card.metadata, color: newColor },
    });
  };

  return (
    <div
      className="w-full h-full p-4 flex flex-col relative shadow-lg"
      style={{
        backgroundColor: color,
        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
      }}
    >
      {/* Color picker */}
      <div className="absolute top-2 right-2 flex gap-1">
        {STICKY_COLORS.map((c) => (
          <button
            key={c}
            className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-110 ${
              c === color ? 'border-gray-800 scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: c }}
            onClick={() => handleColorChange(c)}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 mt-8">
        {isEditing ? (
          <textarea
            className="w-full h-full resize-none bg-transparent border-none outline-none text-gray-800 font-sans text-base"
            value={card.content}
            onChange={handleContentChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
            placeholder="Write a note..."
          />
        ) : (
          <div
            className="w-full h-full text-gray-800 whitespace-pre-wrap cursor-text font-handwriting"
            onClick={() => setIsEditing(true)}
          >
            {card.content || (
              <span className="text-gray-600 italic">Click to write...</span>
            )}
          </div>
        )}
      </div>

      {/* Sticky note effect */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-3 opacity-30"
        style={{
          backgroundColor: color,
          filter: 'brightness(0.8)',
        }}
      />
    </div>
  );
};
