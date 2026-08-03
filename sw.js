// === sw.js (Service Worker untuk Wako SmartWeb) ===
const CACHE_NAME = 'wako-smartweb-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9SUhJlQQxIKOKDgxq7HMq2_tIWllUd-xNWWD7Ma4fTdpVT6xoYctsWCA6eJp1FZOTfRQZy-wV9_ElbodWKoHxv9cV0poHDSkkG324Zzw_BidUcfmX8-KnTvIIMPgsA_g4UvIlrCd8Sm6WGlnChpRUr4bbJDQfHc5mLo5jKU5GMSyXQ3qyDr_9JtYprW_N/w400-h400/Logo_WAKO_SMARTWEB.png'
];

// Install SW dan Cache Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate SW dan Hapus Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategi Fetch: Cache First, then Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
