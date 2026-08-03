const CACHE_NAME = 'wako-smartweb-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png'
];

// Install Event - Simpan Asset Utama ke Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Caching Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Hapus Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Mengabaikan Request ke Google Apps Script (Sangat Penting untuk HP!)
self.addEventListener('fetch', (event) => {
  // Jika request menuju Google Apps Script, langsung lewatkan ke jaringan (Jangan dicache/intercept)
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  // Untuk request lainnya, gunakan strategi Network First / Cache Fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
