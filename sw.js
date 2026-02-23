const FONT_CACHE_NAME = 'font-cache-v1';
const FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('font-cache-') && name !== FONT_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  const isFontPath = url.pathname.startsWith('/fonts/');
  const isFontExt = FONT_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));

  if (!isFontPath || !isFontExt) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(FONT_CACHE_NAME);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      const networkResponse = await fetch(request);
      if (networkResponse && networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })()
  );
});
