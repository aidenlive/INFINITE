import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/infinite_canvas';

// For query purposes
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

export { schema };
