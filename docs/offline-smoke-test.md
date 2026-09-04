# Manual smoke test: full offline + install

Covers issue #7. Run after any change to the service worker
(`src/lib/service-worker.ts`, `src/lib/precache-integration.ts`) or the app
shell. ~5 minutes.

## Setup

```bash
npm run build
npm run preview   # serves dist/ at http://localhost:4321
```

Use Chrome (it is the browser that fires `beforeinstallprompt`).

## 1. First load precaches the Course

1. Open an Incognito window at `http://localhost:4321/`.
2. DevTools → Application → Service Workers: the worker is **activated and
   running**, its source is `ai101-<version>`.
3. Application → Cache Storage → `ai101-<version>`: it holds `/`, `/en/`,
   `/en/lessons/…` for **every** Lesson, `/en/privacy/`, `/en/done/`, the
   `_astro/*` JS + CSS, `/manifest.webmanifest`, `/icon.svg`.

## 2. Walk the whole Course offline

1. DevTools → Network → set to **Offline** (or turn off Wi-Fi).
2. Reload `/`. The home screen renders, table of contents intact.
3. Click **Start Lesson 1**. Read through; the Knowledge Check renders.
4. Answer a Knowledge Check question — the explanation appears. Answer the
   rest.
5. **Mark complete → next Lesson.** Repeat for all six Lessons.
6. On the last Lesson, **Finish the Course** → the completion screen loads and
   shows 6 of 6.
7. Visit the footer's **What we store** link → the privacy note loads.
8. Deep-link test: type a Lesson URL you have *not* visited this session
   directly into the bar. It still loads (precached).
9. Nothing in the walk shows the browser's offline error page.

## 3. A new deploy refreshes cached content

1. Go back **online**.
2. Edit any Lesson's MDX (e.g. add a sentence), `npm run build`, restart
   `npm run preview`.
3. Reload the app twice. DevTools → Application → Cache Storage: a **new**
   `ai101-<version>` cache exists and the **old one is gone**.
4. The edited sentence is visible. Go offline and confirm it persists.

## 4. Install prompt

1. Online, in a normal (non-Incognito) Chrome window, load `/`.
2. The **"Install AI 101 …"** banner appears below the content.
3. Click **Not now** → banner disappears; reload → it stays gone
   (`localStorage` `ai101:install-dismissed`).
4. Clear that key, reload, click **Install** → Chrome's install dialog opens.
   Accept → AI 101 opens as a standalone window and has a home-screen /
   app-launcher icon.
5. Launch the installed app with the network off → the Course works, per §2.
