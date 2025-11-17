import { Request, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';

export const getAllCanvases = async (req: Request, res: Response) => {
  try {
    const allCanvases = await db.select().from(schema.canvases);
    res.json(allCanvases);
  } catch (error) {
    console.error('Error fetching canvases:', error);
    res.status(500).json({ error: 'Failed to fetch canvases' });
  }
};

export const getCanvasById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const canvas = await db.select().from(schema.canvases).where(eq(schema.canvases.id, id));
    
    if (canvas.length === 0) {
      return res.status(404).json({ error: 'Canvas not found' });
    }
    
    res.json(canvas[0]);
  } catch (error) {
    console.error('Error fetching canvas:', error);
    res.status(500).json({ error: 'Failed to fetch canvas' });
  }
};

export const createCanvas = async (req: Request, res: Response) => {
  try {
    const { name, data } = req.body;
    
    if (!name || !data) {
      return res.status(400).json({ error: 'Name and data are required' });
    }
    
    const newCanvas = await db.insert(schema.canvases).values({
      name,
      data,
    }).returning();
    
    res.status(201).json(newCanvas[0]);
  } catch (error) {
    console.error('Error creating canvas:', error);
    res.status(400).json({ error: 'Failed to create canvas' });
  }
};

export const updateCanvas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, data } = req.body;
    
    const updates: any = { updatedAt: new Date() };
    if (name) updates.name = name;
    if (data) updates.data = data;
    
    const updatedCanvas = await db
      .update(schema.canvases)
      .set(updates)
      .where(eq(schema.canvases.id, id))
      .returning();
    
    if (updatedCanvas.length === 0) {
      return res.status(404).json({ error: 'Canvas not found' });
    }
    
    res.json(updatedCanvas[0]);
  } catch (error) {
    console.error('Error updating canvas:', error);
    res.status(400).json({ error: 'Failed to update canvas' });
  }
};

export const deleteCanvas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await db
      .delete(schema.canvases)
      .where(eq(schema.canvases.id, id))
      .returning();
    
    if (deleted.length === 0) {
      return res.status(404).json({ error: 'Canvas not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting canvas:', error);
    res.status(500).json({ error: 'Failed to delete canvas' });
  }
};
