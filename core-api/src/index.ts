import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import { createApp } from './api';
import * as schema from '@aproxima/core-db';

declare module 'hono' {
  interface ContextVariableMap {
    db: DrizzleD1Database<typeof schema>;
  }
}

const app = createApp();

app.use(async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  c.res.headers.set('X-Response-Time', `${end - start}`);
});

app.use(async (c, next) => {
  const db = drizzle(c.env.DB, { schema });
  c.set('db', db);
  await next();
});

app.get('/', (c) => {
  return c.json({ status: 'ok ' });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.get('/db-check', async (c) => {
  const db = c.get('db');
  const result = await db.select({ id: schema.userPasswordsTable.id }).from(schema.userPasswordsTable);
  return c.json({ userCount: result.length });
});

export default app;
