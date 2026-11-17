const CACHE_NAME = "phase-device-vault-v1";
const OFFLINE_FALLBACK = "/index.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResp = await cache.match(event.request, { ignoreSearch: true });
      if (cachedResp) {
        // Refresh in background when online, but return cached response immediately if offline
        fetch(event.request)
          .then((netResp) => {
            if (netResp && netResp.status === 200) {
              cache.put(event.request, netResp.clone());
            }
          })
          .catch(() => {});
        return cachedResp;
      }

      try {
        const netResp = await fetch(event.request);
        return netResp;
      } catch (err) {
        if (event.request.mode === "navigate") {
          const fallback = await cache.match(OFFLINE_FALLBACK);
          if (fallback) return fallback;
        }
        throw err;
      }
    })
  );
});
