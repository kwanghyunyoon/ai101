/*
 * Service worker — v1 scaffold.
 *
 * Deliberately a pass-through: it registers, activates immediately, and does NOT
 * intercept fetches. Precaching the whole Course for offline use is a later
 * ticket (#3+). Keeping the file here means install/activate wiring is proven
 * now and only the fetch strategy changes later.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
