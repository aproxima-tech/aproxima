import { createCookieSessionStorage, type SessionStorage } from '@remix-run/cloudflare';

export type UserSession = {
  userId: string;
  email: string;
  displayName: string;
  sessionToken: string;
};

export type UserSessionStorage = SessionStorage<UserSession, UserSession>;

export type UserSessionStorageContext = {
  sessionCookieSecrets: string[];
  domain: string;
  protocol: 'https:' | 'http:';
};

export function createUserSessionStorage(context: UserSessionStorageContext): UserSessionStorage {
  return createCookieSessionStorage<UserSession, UserSession>({
    cookie: {
      name: '__session',
      secure: context.protocol === 'https:',
      secrets: context.sessionCookieSecrets,
      sameSite: 'lax',
      path: '/',
      domain: context.domain,
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  });
}
