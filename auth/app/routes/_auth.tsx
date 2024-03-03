import { PageTransitionProgressBar } from '@aproxima/ui';
import type { HeadersFunction } from '@remix-run/cloudflare';
import { NavLink, Outlet } from '@remix-run/react';

export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': 'public, max-age=3600',
  };
};

export default function Component() {
  return (
    <>
      <PageTransitionProgressBar />
      <header className="mb-4 lg:mb-10">
        <nav className="p-4">
          <ul className="w-full flex flex-row gap-5 text-lg lg:text-2xl font-bold">
            <li className="ml-auto">
              <NavLink to="/login" prefetch="intent">
                Log in
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" prefetch="intent">
                Sign up
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main className="p-4 w-full flex justify-center items-center">
        <Outlet />
      </main>
    </>
  );
}
