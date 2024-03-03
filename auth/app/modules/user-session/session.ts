import { useRouteLoaderData } from '@remix-run/react';
import type { UserSession } from './session-cookie.server';

export type SessionLoader = {
  userSession: UserSession;
};

export function useUserSession<Loader extends SessionLoader>(routeId: string): UserSession | null {
  const data = useRouteLoaderData<Loader>(routeId);
  if (!data || !data.userSession) return null;
  return data.userSession;
}
