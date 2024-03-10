import { vitePlugin as remix, cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 3003,
  },
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      ignoredRouteFiles: ['**/*.css'],
    }),
    tsconfigPaths(),
  ],
});
