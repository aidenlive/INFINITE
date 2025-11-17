import { pgTable, uuid, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

export const cards = pgTable('cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull(),
  positionX: integer('position_x').notNull(),
  positionY: integer('position_y').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  content: text('content').notNull().default(''),
  metadata: jsonb('metadata').default({}),
  zIndex: integer('z_index').notNull().default(0),
  groupId: uuid('group_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  positionX: integer('position_x').notNull(),
  positionY: integer('position_y').notNull(),
  collapsed: integer('collapsed').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const canvases = pgTable('canvases', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type Canvas = typeof canvases.$inferSelect;
export type NewCanvas = typeof canvases.$inferInsert;
