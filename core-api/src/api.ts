import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

export function createApp() {
  return new Hono<{ Bindings: Bindings }>();
}
