import { Hono } from 'hono';

export type WorkerEnvironment = {
  DB: D1Database;
  CLOUDFLARE_CORE_API_API_KEY: string;
  DEVICE_DATA_BROADCAST: DurableObjectNamespace;
};

export function createApp() {
  return new Hono<{ Bindings: WorkerEnvironment }>();
}
