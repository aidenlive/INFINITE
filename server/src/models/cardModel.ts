import { z } from 'zod';

export const CardTypeSchema = z.enum(['text', 'markdown', 'image', 'code', 'url', 'file', 'sticky']);

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const SizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const CardMetadataSchema = z.object({
  title: z.string().optional(),
  language: z.string().optional(),
  filename: z.string().optional(),
  url: z.string().optional(),
  color: z.string().optional(),
  mimeType: z.string().optional(),
}).optional();

export const CardSchema = z.object({
  id: z.string(),
  type: CardTypeSchema,
  position: PositionSchema,
  size: SizeSchema,
  content: z.string(),
  metadata: CardMetadataSchema,
  zIndex: z.number(),
  groupId: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const CreateCardSchema = z.object({
  type: CardTypeSchema,
  position: PositionSchema,
  size: SizeSchema,
  content: z.string().default(''),
  metadata: CardMetadataSchema,
});

export const UpdateCardSchema = z.object({
  type: CardTypeSchema.optional(),
  position: PositionSchema.optional(),
  size: SizeSchema.optional(),
  content: z.string().optional(),
  metadata: CardMetadataSchema,
  zIndex: z.number().optional(),
  groupId: z.string().optional(),
});

export type CardType = z.infer<typeof CardTypeSchema>;
export type Card = z.infer<typeof CardSchema>;
export type CreateCard = z.infer<typeof CreateCardSchema>;
export type UpdateCard = z.infer<typeof UpdateCardSchema>;
