const CACHE_NAME = 'rescuecards-v2'; // Verze 2

// Rychlá instalace
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Chytřejší ukládání: Cokoliv appka načte, to si uloží i pro offline použití
self.addEventListener('fetch', event => {
  // Ignorujeme složité požadavky databáze, chceme jen obrázky, skripty a styly
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Zkopírujeme odpověď a uložíme do mezipaměti
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      // Pokud nemáme internet, sáhneme do mezipaměti
      .catch(() => caches.match(event.request))
  );
});
