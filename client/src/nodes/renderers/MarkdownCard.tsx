import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '../../types';
import { useCanvasStore } from '../../store/canvasStore';

interface MarkdownCardProps {
  card: Card;
}

export const MarkdownCard: React.FC<MarkdownCardProps> = ({ card }) => {
  const { updateCard } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCard(card.id, { content: e.target.value });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-canvas-border">
        <div className="flex items-center gap-2">
          <i className="ph ph-file-text text-accent-primary"></i>
          <span className="text-sm font-medium text-canvas-text">
            {card.metadata?.filename || 'Untitled.md'}
          </span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-2 py-1 text-xs rounded hover:bg-accent-light transition-colors"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isEditing ? (
          <textarea
            className="w-full h-full resize-none bg-transparent border-none outline-none text-canvas-text font-mono text-sm"
            value={card.content}
            onChange={handleContentChange}
            placeholder="# Start writing markdown..."
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {card.content || '# Empty Document\n\nClick edit to start writing...'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
