# AI 101

A free, installable Progressive Web App that teaches AI and LLM basics to
non-technical adults, finishable in one ~40-minute sitting. Trilingual: English
(source), Korean, and Spanish (Latin America).

See [`CONTEXT.md`](./CONTEXT.md) for the domain glossary and
[`docs/adr/`](./docs/adr/) for architecture decisions. The v1 spec lives in
GitHub issue #1.

## Stack

- **[Astro](https://astro.build)** — static output, prerendered.
- **[Preact](https://preactjs.com)** islands for the few interactive pieces
  (knowledge checks, language switcher, progress). Chosen over React-DOM for a
  ~4 kB runtime. See [ADR-0003](./docs/adr/0003-preact-islands.md).
- **Cloudflare Pages** — free tier, `*.pages.dev` subdomain.
- **Cloudflare Web Analytics** — cookieless aggregate pageviews.

## Develop

```sh
npm install
npm run dev        # serve locally at http://localhost:4321
npm run build      # static build to dist/
npm run preview    # serve the built site
npm run typecheck  # astro check
npm test           # vitest
```

## Deploy (Cloudflare Pages)

Connecting the repo to a Pages project is a one-time dashboard step:

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to
   Git**, pick this repo.
2. Build command `npm run build`, output directory `dist`, framework preset
   **Astro**.
3. After the first deploy, enable **Web Analytics** for the `*.pages.dev`
   hostname, copy the beacon token, and set it as a build environment variable
   named `PUBLIC_CF_BEACON_TOKEN`. The beacon script renders only when this is
   set, so local and preview builds stay analytics-free.

Every push to `main` then deploys automatically.

## Licensing

- **Code** — [MIT](./LICENSE).
- **Course content** — [CC BY-SA 4.0](./LICENSE-content).
