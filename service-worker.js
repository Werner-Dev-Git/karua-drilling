// Karua Drilling Service Worker
// Version 1.0.0

const CACHE_NAME = 'karua-drilling-v1';
const STATIC_CACHE = 'karua-static-v1';
const DYNAMIC_CACHE = 'karua-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    './',
    './index.html',
    './about.html',
    './services.html',
    './styles.css',
    './about.css',
    './services.css',
    './main.js',
    './about.js',
    './services.js',
    './manifest.json',
    './images/logo.png'
];

// External assets to cache
const EXTERNAL_ASSETS = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                return caches.open(DYNAMIC_CACHE);
            })
            .then((cache) => {
                console.log('[Service Worker] Caching external assets');
                // Cache external assets individually to handle failures gracefully
                return Promise.allSettled(
                    EXTERNAL_ASSETS.map(url => 
                        fetch(url).then(response => {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                        }).catch(() => {
                            console.log('[Service Worker] Failed to cache:', url);
                        })
                    )
                );
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => {
                            return name !== STATIC_CACHE && 
                                   name !== DYNAMIC_CACHE && 
                                   name !== CACHE_NAME;
                        })
                        .map((name) => {
                            console.log('[Service Worker] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip Chrome extension requests
    if (event.request.url.startsWith('chrome-extension://')) return;

    // Handle requests
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    // Fetch update in background (stale-while-revalidate)
                    event.waitUntil(
                        fetch(event.request)
                            .then((networkResponse) => {
                                if (networkResponse && networkResponse.ok) {
                                    caches.open(DYNAMIC_CACHE)
                                        .then((cache) => {
                                            cache.put(event.request, networkResponse);
                                        });
                                }
                            })
                            .catch(() => {})
                    );
                    return cachedResponse;
                }

                // Fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Don't cache non-ok responses or opaque responses
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        // Clone the response
                        const responseClone = networkResponse.clone();

                        // Cache the fetched response
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });

                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        return null;
                    });
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
