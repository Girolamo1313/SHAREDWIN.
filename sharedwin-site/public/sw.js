// SharedWin service worker: makes the site installable and shows a friendly page when offline.
// It never stores pages or account data: everything else always comes from the network.
const CACHE = "sharedwin-offline-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll([OFFLINE_URL, "/icons/icon-192.png"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode !== "navigate") return;               // only page loads
  event.respondWith(
    fetch(req).catch(() => caches.match(OFFLINE_URL))
  );
});
