import packageJSON from '../package.json' with { type: 'json'};
import { readdir, writeFile } from 'node:fs/promises';

const distDir = './src';
const excludeFiles = ['robots.txt', 'sw.js'];
const version = packageJSON.version;

(async function main() {
    // try {
        let files = await readdir(distDir, { recursive: true });
        files = files.filter(file => !excludeFiles.includes(file) && file.includes('.'));

        const sw = getSW(version, files);
        await writeFile('./src/sw.js', sw);

        console.log('Service worker created successfully.');

    // } catch (err) {
    //     console.error(`Failed to generate sw.js: ${err}`);
    // }
})();

function getSW(version, assets) {
    return `const cacheName = 'apphub-v${version}';

const cacheAssets = ${JSON.stringify(assets)};

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
    return new Response(\`Network error: \${error}\`, {
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
`;
}