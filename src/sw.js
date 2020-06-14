const VERSION = 'v1';
const CACHE_ID = `sw-test-${VERSION}`;

self.addEventListener('install', (ev) => {
  self.skipWaiting();
  ev.waitUntil(
    caches.open(CACHE_ID).then((cache) => {
      cache.addAll([
        '/',
        '/runtime.js',
        '/polyfills.js',
        '/styles.js',
        '/vendor.js',
        '/main.js',
      ]);
    })
  );
});

self.addEventListener('activate', ev => {
  ev.waitUntil(self.clients.claim());

  ev.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(cacheKey => {
        if (CACHE_ID !== cacheKey) {
          return caches.delete(cacheKey);
        }
      })
    )).then(() => {
      console.log(VERSION + ' now ready to handle fetches!');
    })
  );
});

self.addEventListener('fetch', ev => {
  return ev.respondWith(requestHandler(ev.request.url));
});

async function requestHandler(url) {
  const cached = await caches.match(url);
  return cached || fetch(url);
}
