self.addEventListener('install', (event) => {
    console.log('service worker installed', event);
    // aggiunta elenco risorse da mettere in cache
    event.waitUntil(
        caches.open('version1').then((cache) => {
            // mmtto in cache il file test-1.js
            return cache.addAll(
                [
                    // '/js/test-1.js',
                    'script.js',
                    // '/js/test-2.js'
                ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('service worker activated', event);
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
    // uso l'evento fetch per indicare al ServiceWorker di utilizzare quello che è stato messo in cache
    // restituisco SOLO quello che c'è nella cache
    // event.respondWith(caches.match(event.request));

    // se una risorsa non è presente nella cache la recupero dalla rete
    /* event.respondWith(caches.match(event.request).then((response) => {
        return response || fetch(event.request);
    })) */
});
