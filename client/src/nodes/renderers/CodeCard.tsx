import React, { useState } from 'react';
import { Card } from '../../types';
import { useCanvasStore } from '../../store/canvasStore';

interface CodeCardProps {
  card: Card;
}

export const CodeCard: React.FC<CodeCardProps> = ({ card }) => {
  const { updateCard } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(true);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCard(card.id, { content: e.target.value });
  };

  const language = card.metadata?.language || 'javascript';

  return (
    <div className="w-full h-full flex flex-col bg-canvas-text">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <i className="ph ph-code text-accent-primary"></i>
          <span className="text-sm font-medium text-gray-300">
            {card.metadata?.filename || `code.${language}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase">{language}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <textarea
          className="w-full h-full resize-none bg-transparent border-none outline-none text-gray-100 font-mono text-sm p-4 leading-relaxed"
          value={card.content}
          onChange={handleContentChange}
          placeholder={`// Write ${language} code here...`}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
