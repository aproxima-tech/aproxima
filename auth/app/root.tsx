import type { LinksFunction } from '@remix-run/cloudflare';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import tailwindStyles from '@aproxima/ui/tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindStyles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-[100vh] w-[100vw] overflow-x-hidden bg-background dark:bg-backgroundDark text-lg text-text dark:text-textDark">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
