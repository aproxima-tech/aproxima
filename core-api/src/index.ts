import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@aproxima/core-db';
import type { WorkerEnvironment } from './api';
import { createApp } from './api';

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

// TODO: Replace with user authentication
app.post(async (c, next) => {
  const apiKey = c.req.header('X-API-KEY');
  if (apiKey !== c.env.CLOUDFLARE_CORE_API_API_KEY) {
    return c.json({ error: 'Invalid API key' }, { status: 401 });
  }
  await next();
});

app.use(async (c, next) => {
  const db = drizzle(c.env.DB, { schema });
  c.set('db', db);
  await next();
});

app.get('/', (c) => {
  return c.json({ status: 'ok ' });
});

app.get('/db-check', async (c) => {
  const db = c.get('db');
  const result = await db.select({ id: schema.userPasswordsTable.id }).from(schema.userPasswordsTable);
  return c.json({ userCount: result.length });
});

app.post('/devices/:id/data', async (c) => {
  const deviceId = c.req.param('id');
  // TODO: Make sure deviceId is a valid device ID
  const id = c.env.DEVICE_DATA_BROADCAST.idFromName(deviceId);
  const obj = c.env.DEVICE_DATA_BROADCAST.get(id);
  obj.fetch(c.req.raw);
  return c.json({ status: 'ok' });
});

export { DeviceDataFeed } from './device-data-feed';

export default {
  ...app,
  fetch: (request: Request, env: WorkerEnvironment, ctx: ExecutionContext) => {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return app.fetch(request, env, ctx);
    }

    const url = new URL(request.url);
    const deviceId = url.searchParams.get('device_id');
    if (!deviceId) {
      return new Response('Missing device_id query parameter', { status: 400 });
    }

    const id = env.DEVICE_DATA_BROADCAST.idFromName(deviceId);
    const obj = env.DEVICE_DATA_BROADCAST.get(id);
    return obj.fetch(request);
  },
};
