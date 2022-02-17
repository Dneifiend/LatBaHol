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
            return fetch(e.request).catch(function (e) {
               //you might want to do more error checking here too,
               //eg, check what e is returning..
               alert('You appear to be offline, please try again when back online');
            });
        })
    );
});