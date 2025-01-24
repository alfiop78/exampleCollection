const CURRENT_CACHE = 'version12';
self.addEventListener('install', (event) => {
    console.log('service worker installed', event);
    // aggiunta elenco risorse da mettere in cache
    event.waitUntil(
        caches.open(CURRENT_CACHE).then((cache) => {
            // mmtto in cache il file test-1.js
            return cache.addAll(
                [
                    '/js/test-1.js',
                    '/js/test-2.js'
                    // 'script.js',
                ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    // debugger;
    console.log('service worker activated', event);

    // aggiorno la cache
    /* event.waitUntil(
        caches.keys().then((cacheKeys) => {
            return Promise.all(
                cacheKeys.map((cacheKey) => {
                    if (cacheKey !== CURRENT_CACHE) {
                        console.log('deleting cache :', cacheKey);
                        return caches.delete(cacheKey);
                    }
                })
            )
        })
    ) */
});

self.addEventListener('fetch', (event) => {
    // restituisco quello che è stato richiesto, in questo caso il ServiceWorker è come se non esistesse
    // event.respondWith(fetch(event.request));

    // uso l'evento fetch per indicare al ServiceWorker di utilizzare quello che è stato messo in cache
    // restituisco SOLO quello che c'è nella cache
    // event.respondWith(caches.match(event.request));

    // se una risorsa non è presente nella cache la recupero dalla rete
    event.respondWith(caches.match(event.request).then((response) => {
        return response || fetch(event.request);
    }))

    // la risposta recuperata dalla rete la aggiungo alla cache
    /* event.respondWith(caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
            console.log('recupero dalla rete questa volta');
            return caches.open(CURRENT_CACHE).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
            })
        })
    })) */

    // strategia : stale-while-revalidate
    // Questa dice al serviceWorker di richiedere entrambi dalla cache e dalla rete, 
    // restituendo la versione in cache al chiamante e salvando la risposta dalla rete in cache 
    // per usarla la volta successiva. Questo consente alla cache di essere
    // aggiornata mentre viene fornito all'utente il contenuto in modo veloce che è in cache.
    /* event.respondWith(
        caches.open(CURRENT_CACHE).then((cache) => {
            return cache.match(event.request).then((response) => {
                let fetchPromise = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                event.waitUntil(fetchPromise);
                return response;
            })
        })
    ); */
});

