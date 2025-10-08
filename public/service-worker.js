let CACHE_NAME = "default";
const OFFLINE_URL = "/offline.html";

self.addEventListener("message", (event) => {
  if (event.data.type === "SET_CACHE_KEY" && event.data.cacheName) {
    CACHE_NAME = event.data.cacheName;
  }
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    }),
  );
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      }),
    );
  } else {
    event?.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request)
            .then((response) => {
              return response;
            })
            .catch(
              () =>
                new Response("Network error", {
                  status: 408,
                  headers: { "Content-Type": "text/plain" },
                }),
            )
        );
      }),
    );
  }
});
