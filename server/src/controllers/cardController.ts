import { Request, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { CreateCardSchema, UpdateCardSchema } from '../models/cardModel.js';

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const allCards = await db.select().from(schema.cards);
    res.json(allCards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await db.select().from(schema.cards).where(eq(schema.cards.id, id));
    
    if (card.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json(card[0]);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateCardSchema.parse(req.body);
    
    const newCard = await db.insert(schema.cards).values({
      type: validatedData.type,
      positionX: validatedData.position.x,
      positionY: validatedData.position.y,
      width: validatedData.size.width,
      height: validatedData.size.height,
      content: validatedData.content,
      metadata: validatedData.metadata || {},
      zIndex: 0,
    }).returning();
    
    res.status(201).json(newCard[0]);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(400).json({ error: 'Failed to create card' });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateCardSchema.parse(req.body);
    
    const updates: any = {};
    if (validatedData.type) updates.type = validatedData.type;
    if (validatedData.position) {
      updates.positionX = validatedData.position.x;
      updates.positionY = validatedData.position.y;
    }
    if (validatedData.size) {
      updates.width = validatedData.size.width;
      updates.height = validatedData.size.height;
    }
    if (validatedData.content !== undefined) updates.content = validatedData.content;
    if (validatedData.metadata) updates.metadata = validatedData.metadata;
    if (validatedData.zIndex !== undefined) updates.zIndex = validatedData.zIndex;
    if (validatedData.groupId !== undefined) updates.groupId = validatedData.groupId;
    
    updates.updatedAt = new Date();
    
    const updatedCard = await db
      .update(schema.cards)
      .set(updates)
      .where(eq(schema.cards.id, id))
      .returning();
    
    if (updatedCard.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json(updatedCard[0]);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(400).json({ error: 'Failed to update card' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await db
      .delete(schema.cards)
      .where(eq(schema.cards.id, id))
      .returning();
    
    if (deleted.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
};
