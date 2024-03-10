import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import tailwindStyles from '@aproxima/ui/tailwind.css?url';
import type { LinksFunction } from '@remix-run/cloudflare';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindStyles }];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className="min-h-[100vh] w-[100vw] overflow-x-hidden bg-background dark:bg-backgroundDark text-lg text-text dark:text-textDark">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
