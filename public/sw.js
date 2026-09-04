/*
 * Dev-only service worker.
 *
 * `astro dev` serves this file as-is: a harmless pass-through that registers,
 * activates, and does NOT intercept fetches. The production build REPLACES it
 * with a full offline-precache worker (see src/lib/precache-integration.ts and
 * src/lib/service-worker.ts). Edit those, not this file.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
