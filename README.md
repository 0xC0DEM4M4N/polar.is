# polar.is

A Next.js dashboard for Polar (polar.com) fitness data, deployed to Cloudflare Workers via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`). Authentication is a Polar OAuth flow backed by a Cloudflare KV session store.

## Prerequisites

- Node.js 20.3+ (wrangler is pinned to `4.80.0`, the last line supporting Node 20 — upgrade to Node 22+ and unpin wrangler if you want the latest version)
- A [Polar](https://www.polar.com/accesslink-api/) AccessLink API application (for `POLAR_CLIENT_ID` / `POLAR_CLIENT_SECRET`)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (installed as a dev dependency) if you want to deploy or run against real KV

## Setup

Install dependencies:

```bash
npm install
```

Create the local env files (both are gitignored):

`.env.local` — public/non-secret local vars:

```bash
POLAR_CLIENT_ID=your-polar-client-id
REDIRECT_URI=http://localhost:3001/en-gb/api/auth/callback
```

`.dev.vars` — secrets, used by `wrangler`/local Cloudflare runtime:

```bash
POLAR_CLIENT_SECRET=your-polar-client-secret
REDIRECT_URI=http://localhost:3001/en-gb/api/auth/callback
```

`REDIRECT_URI` must exactly match a redirect URI registered on your Polar application, and must include the locale prefix (e.g. `/en-gb/`).

## Development

```bash
npm run dev
```

Runs the Next.js dev server on [http://localhost:3001](http://localhost:3001) (not the default 3000). Routes are locale-prefixed, e.g. `http://localhost:3001/en-gb`.

Supported locales live in `src/lib/i18n/routing.ts` and `src/messages/*.json`: `en-gb` (default), `en-us`, `fr-fr`.

`next.config.ts` calls `initOpenNextCloudflareForDev()`, which wires up local Cloudflare bindings (KV, etc.) for `next dev`. Outside that, `src/lib/kv.ts` also falls back to a no-op mock for the `POLAR_SESSIONS` KV binding so the app renders without crashing even if bindings aren't available.

## Linting

```bash
npm run lint
```

## Deploying to Cloudflare Workers

Build and deploy from the CLI:

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build` (producing `.open-next/worker.js` and `.open-next/assets`) followed by `opennextjs-cloudflare deploy`.

To build and run a local preview against the Workers runtime without deploying:

```bash
npm run preview
```

Cloudflare project configuration (KV binding, assets, compatibility flags, vars) lives in `wrangler.toml`. Set `POLAR_CLIENT_SECRET` as an encrypted secret via `npx wrangler secret put POLAR_CLIENT_SECRET` (do not add it to `wrangler.toml`).

### Custom domain

This Worker is currently only reachable at its `*.workers.dev` URL. To keep a stable domain (and avoid updating the Polar OAuth redirect URI every time you redeploy):

1. In the Cloudflare dashboard: **Workers & Pages → polaris-next → Settings → Domains & Routes**, add a custom domain.
2. Uncomment and fill in the `[[routes]]` block in `wrangler.toml` to match.
3. Update `REDIRECT_URI` in `wrangler.toml` (and in the Polar developer portal) to use that domain.

### Migration note

This project previously deployed to Cloudflare Pages via `@cloudflare/next-on-pages` (now deprecated in favor of OpenNext). If you see a Pages project still live at the old `*.pages.dev` URL, it's stale once the Worker deployment above takes over — decommission it once the new deployment and domain/redirect URI are confirmed working.
