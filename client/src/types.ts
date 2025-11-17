export type CardType = 'text' | 'markdown' | 'image' | 'code' | 'url' | 'file' | 'sticky';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Card {
  id: string;
  type: CardType;
  position: Position;
  size: Size;
  content: string;
  metadata?: {
    title?: string;
    language?: string;
    filename?: string;
    url?: string;
    color?: string;
    mimeType?: string;
  };
  zIndex: number;
  groupId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CardGroup {
  id: string;
  name: string;
  cardIds: string[];
  position: Position;
  collapsed: boolean;
}

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasState {
  cards: Card[];
  groups: CardGroup[];
  viewport: ViewportState;
  selectedCardIds: string[];
  isDragging: boolean;
  isPanning: boolean;
}
