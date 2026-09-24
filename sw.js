const CACHE_NAME = 'cementspeak-v1';
const FILES_TO_CACHE = ['./CementSpeak-Offline.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request)
        .then((resp) => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
