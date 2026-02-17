const CACHE_NAME = 'rescuecards-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// CHYTRÁ STRATEGIE: Nejdřív zkusí internet. Když to nejde, ukáže zálohu.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Máme internet! Uložíme si novou kopii pro případ výpadku.
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        return response;
      })
      .catch(() => {
        // Nemáme internet (nebo GitHub neodpovídá)! Sáhneme do batohu.
        return caches.match(e.request);
      })
  );
});
