const cacheName = 'apphub-v0.1.0';

const cacheAssets = ["favicon.png","index.html","lib.js","main.css","manifest.json","styles.css","unit-convert/index.html","unit-convert/main.js","unit-convert/styles.css","notes/index.html","notes/main.js","notes/qrcode.js","notes/qrcode.min.js","notes/styles.css","info/index.html","info/main.js","info/styles.css","icons/apple-touch-icon.png","icons/covert_shortcut.png","icons/favicon.png","icons/icon-128x128.png","icons/icon-144x144.png","icons/icon-152x152.png","icons/icon-192x192.png","icons/icon-384x384.png","icons/icon-512x512.png","icons/icon-72x72.png","icons/icon-96x96.png","icons/notes_shortcut.png","geometry-game/game.js","geometry-game/index.html","geometry-game/assets/cube.png","geometry-game/assets/floor.png","fitnes/index.html","fitnes/main.js","fitnes/styles.css","counter/index.html","counter/main.js","counter/styles.css"];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(cacheAssets);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys
      .filter((key) => key !== cacheName)
      .map((key) => caches.delete(key))))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(cacheFirst(event.request, event));
});

async function cacheFirst(request, event) {
  const cache = await caches.open(cacheName);
  const cacheResponse = await cache.match(request);

  if (cacheResponse) {
    return cacheResponse;
  }

  try {
    const networkResponse = await fetch(request);

    event.waitUntil(await cache.put(request, networkResponse.clone()));

    return networkResponse;
  } catch (error) {
    return new Response(`Network error: ${error}`, {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

self.addEventListener('message', event => {
  if (event.data === 'clear-cache') {
    caches.keys().then(keys => Promise.all(keys
      .filter((key) => key !== cacheName)
      .map((key) => caches.delete(key))))
      .then(() => {
        event.source.postMessage('cache-clear-success');
      });
  }
});
