# Changelog

## 0.0.1

Added Vitest and `vitest-environment-miniflare` for API testing. Note that `vitest-environment-miniflare` is currently on v2, while miniflare and wrangler are already on v3. I followed the instructions for [miniflare v2](https://legacy.miniflare.dev/testing/vitest), as recommended in the miniflare v3 docs.

- [Miniflare docs](https://miniflare.dev/)
- [Hono Cloudflare Workers testing guide](https://hono.dev/getting-started/cloudflare-workers#testing)

## 0.0.0

Decided to use Hono for the core API, as it is lightweight, runs on Cloudflare Workers, and seems to have good performance.

Initialized a new Hono app, using the starter for Cloudflare Workers:

```bash
bunx create-hono .
```


