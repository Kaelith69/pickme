// PickMe service worker. All paths are scoped to the GitHub Pages project URL.
const CACHE_NAME = 'pickme-v3';
const BASE_URL = new URL(self.registration.scope);
const STATIC_ASSETS = [
    './',
    'index.html',
    'styles.css',
    'script.js',
    'manifest.json',
    'public_letter.html',
    'valentine.html'
].map(path => new URL(path, BASE_URL).href);

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .catch(error => console.warn('PickMe cache warmup skipped:', error))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key.startsWith('pickme-') && key !== CACHE_NAME)
                .map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // Never intercept writes, cross-origin Firebase calls, or other APIs.
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    // Prefer fresh HTML, then fall back to the matching cached page offline.
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).then(response => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                }
                return response;
            }).catch(async () => {
                const cached = await caches.match(request);
                return cached || caches.match(new URL('index.html', BASE_URL).href);
            })
        );
        return;
    }

    // Cache-first for same-origin static assets, with network fallback.
    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request).then(response => {
            if (response.ok) {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            }
            return response;
        }))
    );
});
