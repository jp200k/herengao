const CACHE_NAME = "herengao-v1";
const ASSETS = [
  "/", "/index.html", "/works.html", "/about.html", "/cv.html", "/contact.html",
  "/manifest.webmanifest",
  "/css/site.css",
  "/js/site.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: pre-cache core pages/assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - HTML: network-first (so updates come through), fallback to cache
// - Images/CSS/JS: cache-first (fast), update by version bumps
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // only handle same-origin
  if (url.origin !== location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((m) => m || caches.match("/index.html")))
    );
    return;
  }

  // static assets
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      });
    })
  );
});
