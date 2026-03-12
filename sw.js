// A basic service worker to satisfy PWA install requirements
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
});

self.addEventListener('fetch', (e) => {
  // Simple pass-through fetch
  e.respondWith(fetch(e.request).catch(() => new Response('Offline')));
});