import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { Body } from '@aproxima/ui';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <Body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </Body>
    </html>
  );
}
