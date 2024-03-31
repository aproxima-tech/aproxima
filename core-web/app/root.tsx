import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/cloudflare';
import { Body } from '@aproxima/ui';
import tailwindStyles from '@aproxima/ui/tailwind.css?url';

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

      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
