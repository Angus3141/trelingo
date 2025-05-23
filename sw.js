self.addEventListener('install', e => {
  e.waitUntil(caches.open('trelingo-v1').then(cache => cache.addAll([
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
  ])));
  self.skipWaiting();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});