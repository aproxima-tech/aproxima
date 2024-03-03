import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';

import { logout } from '~/modules/user-session/session.server';

export function action({ request, context }: ActionFunctionArgs) {
  return logout(request, context.userSessionStorage);
}

export function loader() {
  return redirect('/login');
}
