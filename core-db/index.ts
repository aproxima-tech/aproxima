import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';

export type CoreDb = DrizzleD1Database<typeof schema>;
export { schema };
export * from './schema';
