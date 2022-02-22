const CACHE_NAME = 'sw-cache-v1';

self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
});


self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch event fired.', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if (response) {
                console.log('[ServiceWorker] Retrieving from cache...');
                return response;
            }
            console.log('[ServiceWorker] Retrieving from URL...');
            return fetch(e.request).catch(()=>
            caches
                .open(CACHE_NAME)
                .then(cache=>cache.match("https://dneifiend.github.io/LatBaHol/offline.html"))
            )
        })
    );
});