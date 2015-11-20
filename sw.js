'use strict';

/* based on @adactio's ServiceWorker, see https://adactio.com/journal/9814 */

(function() {

    var version = '1.0.0';
    var staticCacheName = version + 'static';
    var pagesCacheName = version + 'pages';
    var imagesCacheName = version + 'images';

    var updateStaticCache = function() {
        return caches.open(staticCacheName)
            .then(function (cache) {
                // These items won't block the installation of the Service Worker
                cache.addAll([
                    '/images/icon32.jpg',
                    '/images/icon48.jpg',
                    '/images/icon64.jpg',
                    '/images/icon256.jpg',
                    '/CONTRIBUTING',
                    '/ERR_CALL_TIME',
                    '/ERR_INSUFFICIENT_INPUT',
                    '/ERR_J',
                    '/ERR_MISSING_RETURN',
                    '/ERR_NEGATION',
                    '/ERR_NO_FILE',
                    '/ERR_PARSE_FAILURE',
                    '/ERR_TIMEOUT',
                    '/README.md',
                ]);
                // These items must be cached for the Service Worker to complete installation
                return cache.addAll([
                    '/dict.css',
                    '/images/icon16.png',
                    '/images/icon128.png',
                    '/',
                    '/offline',
                ]);
            });
    };

    var stashInCache = function(cacheName, maxItems, request, response) {
        caches.open(cacheName)
            .then(function (cache) {
                cache.keys()
                    .then(function (keys) {
                        if (keys.length < maxItems) {
                            cache.put(request, response);
                        } else {
                            cache.delete(keys[0])
                                .then(function() {
                                    cache.put(request, response);
                                });
                        }
                    })
            });
    };

    var clearOldCaches = function() {
        return caches.keys()
            .then(function (keys) {
                // Remove caches whose name is no longer valid
                return Promise.all(keys
                    .filter(function (key) {
                      return key.indexOf(version) !== 0;
                    })
                    .map(function (key) {
                      return caches.delete(key);
                    })
                );
            })
    };

    self.addEventListener('install', function (event) {
        event.waitUntil(updateStaticCache()
            .then(function () {
                return self.skipWaiting();
            })
        );
    });

    self.addEventListener('activate', function (event) {
        event.waitUntil(clearOldCaches()
            .then(function () {
                return self.clients.claim();
            })
        );
    });

    self.addEventListener('fetch', function (event) {
        var request = event.request;
        // For non-GET requests, try the network first, fall back to the offline page
        if (request.method !== 'GET') {
            event.respondWith(
                fetch(request)
                    .catch(function () {
                        return caches.match('/offline');
                    })
            );
            return;
        }

        // For HTML requests, try the network first, fall back to the cache, finally the offline page
        if (request.headers.get('Accept').indexOf('text/html') !== -1) {
            event.respondWith(
                fetch(request)
                    .then(function (response) {
                        // NETWORK
                        // Stash a copy of this page in the pages cache
                        var copy = response.clone();
                        stashInCache(pagesCacheName, 35, request, copy);
                        return response;
                    })
                    .catch(function () {
                        // CACHE or FALLBACK
                        return caches.match(request)
                            .then(function (response) {
                                return response || caches.match('/offline');
                            })
                    })
            );
            return;
        }

        // For non-HTML requests, look in the cache first, fall back to the network
        event.respondWith(
            caches.match(request)
                .then(function (response) {
                    // CACHE
                    return response || fetch(request)
                        .then(function (response) {
                            // NETWORK
                            // If the request is for an image, stash a copy of this image in the images cache
                            if (request.headers.get('Accept').indexOf('image') !== -1) {
                                var copy = response.clone();
                                stashInCache(imagesCacheName, 20, request, copy);
                            }
                            return response;
                        })
                        .catch(function () {
                            // OFFLINE
                            // If the request is for an image, show an offline placeholder
                            if (request.headers.get('Accept').indexOf('image') !== -1) {
                                return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
                            }
                        });
                })
        );
    });

})();
