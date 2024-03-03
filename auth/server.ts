import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import type { AppLoadContext } from '@remix-run/cloudflare';
import { createRequestHandler, logDevReady } from '@remix-run/cloudflare';
import * as build from '@remix-run/dev/server-build';
import __STATIC_CONTENT_MANIFEST from '__STATIC_CONTENT_MANIFEST';
import type { CoreDb } from '@aproxima/core-db';
import { schema } from '@aproxima/core-db';
import { drizzle } from 'drizzle-orm/d1';
import { createUserSessionStorage, type UserSessionStorage } from '~/modules/user-session/session-cookie.server';
import invariant from 'tiny-invariant';

type WorkerEnvironment = {
  __STATIC_CONTENT: Fetcher;
  DB: D1Database;
  AUTH_SESSION_COOKIE_SECRET_ONE: string;
  APEX_DOMAIN: string;
  HOME_HOST: string;
  PROTOCOL: string;
};

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    env: WorkerEnvironment;
    db: CoreDb;
    userSessionStorage: UserSessionStorage;
  }
}

const MANIFEST = JSON.parse(__STATIC_CONTENT_MANIFEST);
const handleRemixRequest = createRequestHandler(build, process.env?.['NODE_ENV']);

if (process.env?.['NODE_ENV'] === 'development') {
  logDevReady(build);
}

export default {
  async fetch(request: Request, env: WorkerEnvironment, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const ttl = url.pathname.startsWith('/build/')
        ? 60 * 60 * 24 * 365 // 1 year
        : 60 * 5; // 5 minutes
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        } as FetchEvent,
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: MANIFEST,
          cacheControl: {
            browserTTL: ttl,
            edgeTTL: ttl,
          },
        },
      );
    } catch (error) {
      // No-op
    }

    try {
      invariant(env.PROTOCOL === 'http:' || env.PROTOCOL === 'https:', 'Invalid protocol');
      const db = drizzle(env.DB, { schema });
      const userSessionStorage = createUserSessionStorage({
        sessionCookieSecrets: [env.AUTH_SESSION_COOKIE_SECRET_ONE],
        domain: env.APEX_DOMAIN,
        protocol: env.PROTOCOL,
      });
      const loadContext: AppLoadContext = {
        env,
        db,
        userSessionStorage,
      };
      return await handleRemixRequest(request, loadContext);
    } catch (error) {
      console.log(error);
      return new Response(`An unexpected error occurred: ${error}`, { status: 500 });
    }
  },
};
