import { create } from 'zustand';
import { Card, CardGroup, ViewportState, CardType } from '../types';

interface CanvasStore {
  cards: Card[];
  groups: CardGroup[];
  viewport: ViewportState;
  selectedCardIds: string[];
  isDragging: boolean;
  isPanning: boolean;
  
  // Card actions
  addCard: (type: CardType, position: { x: number; y: number }, content?: string) => Card;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  duplicateCard: (id: string) => void;
  
  // Selection actions
  selectCard: (id: string, multi?: boolean) => void;
  deselectCard: (id: string) => void;
  clearSelection: () => void;
  
  // Viewport actions
  setViewport: (viewport: Partial<ViewportState>) => void;
  resetViewport: () => void;
  fitToContent: () => void;
  
  // Group actions
  createGroup: (cardIds: string[], name?: string) => void;
  ungroupCards: (groupId: string) => void;
  
  // State actions
  setDragging: (isDragging: boolean) => void;
  setPanning: (isPanning: boolean) => void;
  
  // Persistence
  exportCanvas: () => string;
  importCanvas: (data: string) => void;
}

const DEFAULT_VIEWPORT: ViewportState = {
  x: 0,
  y: 0,
  zoom: 1,
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  cards: [],
  groups: [],
  viewport: DEFAULT_VIEWPORT,
  selectedCardIds: [],
  isDragging: false,
  isPanning: false,

  addCard: (type, position, content = '') => {
    const defaultSizes: Record<CardType, { width: number; height: number }> = {
      text: { width: 300, height: 200 },
      markdown: { width: 400, height: 300 },
      image: { width: 400, height: 300 },
      code: { width: 500, height: 400 },
      url: { width: 600, height: 400 },
      file: { width: 350, height: 250 },
      sticky: { width: 200, height: 200 },
    };

    const newCard: Card = {
      id: generateId(),
      type,
      position,
      size: defaultSizes[type],
      content,
      metadata: type === 'sticky' ? { color: '#FFE66D' } : {},
      zIndex: get().cards.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => ({
      cards: [...state.cards, newCard],
    }));

    return newCard;
  },

  updateCard: (id, updates) => {
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id
          ? { ...card, ...updates, updatedAt: Date.now() }
          : card
      ),
    }));
  },

  deleteCard: (id) => {
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
      selectedCardIds: state.selectedCardIds.filter((cardId) => cardId !== id),
    }));
  },

  duplicateCard: (id) => {
    const card = get().cards.find((c) => c.id === id);
    if (!card) return;

    const newCard: Card = {
      ...card,
      id: generateId(),
      position: {
        x: card.position.x + 20,
        y: card.position.y + 20,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => ({
      cards: [...state.cards, newCard],
    }));
  },

  selectCard: (id, multi = false) => {
    set((state) => {
      if (multi) {
        return {
          selectedCardIds: state.selectedCardIds.includes(id)
            ? state.selectedCardIds
            : [...state.selectedCardIds, id],
        };
      }
      return { selectedCardIds: [id] };
    });
  },

  deselectCard: (id) => {
    set((state) => ({
      selectedCardIds: state.selectedCardIds.filter((cardId) => cardId !== id),
    }));
  },

  clearSelection: () => {
    set({ selectedCardIds: [] });
  },

  setViewport: (viewport) => {
    set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    }));
  },

  resetViewport: () => {
    set({ viewport: DEFAULT_VIEWPORT });
  },

  fitToContent: () => {
    const cards = get().cards;
    if (cards.length === 0) {
      set({ viewport: DEFAULT_VIEWPORT });
      return;
    }

    const padding = 100;
    const bounds = cards.reduce(
      (acc, card) => ({
        minX: Math.min(acc.minX, card.position.x),
        minY: Math.min(acc.minY, card.position.y),
        maxX: Math.max(acc.maxX, card.position.x + card.size.width),
        maxY: Math.max(acc.maxY, card.position.y + card.size.height),
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const zoom = Math.min(
      (windowWidth - padding * 2) / contentWidth,
      (windowHeight - padding * 2) / contentHeight,
      1
    );

    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    set({
      viewport: {
        x: windowWidth / 2 - centerX * zoom,
        y: windowHeight / 2 - centerY * zoom,
        zoom,
      },
    });
  },

  createGroup: (cardIds, name = 'Group') => {
    const cards = get().cards.filter((c) => cardIds.includes(c.id));
    if (cards.length === 0) return;

    const avgX = cards.reduce((sum, c) => sum + c.position.x, 0) / cards.length;
    const avgY = cards.reduce((sum, c) => sum + c.position.y, 0) / cards.length;

    const newGroup: CardGroup = {
      id: generateId(),
      name,
      cardIds,
      position: { x: avgX, y: avgY },
      collapsed: false,
    };

    set((state) => ({
      groups: [...state.groups, newGroup],
      cards: state.cards.map((card) =>
        cardIds.includes(card.id) ? { ...card, groupId: newGroup.id } : card
      ),
    }));
  },

  ungroupCards: (groupId) => {
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
      cards: state.cards.map((card) =>
        card.groupId === groupId ? { ...card, groupId: undefined } : card
      ),
    }));
  },

  setDragging: (isDragging) => set({ isDragging }),
  setPanning: (isPanning) => set({ isPanning }),

  exportCanvas: () => {
    const state = get();
    return JSON.stringify({
      cards: state.cards,
      groups: state.groups,
      viewport: state.viewport,
    });
  },

  importCanvas: (data) => {
    try {
      const parsed = JSON.parse(data);
      set({
        cards: parsed.cards || [],
        groups: parsed.groups || [],
        viewport: parsed.viewport || DEFAULT_VIEWPORT,
        selectedCardIds: [],
      });
    } catch (error) {
      console.error('Failed to import canvas data:', error);
    }
  },
}));
