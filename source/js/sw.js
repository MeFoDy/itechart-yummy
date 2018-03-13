const cacheName = 'v1';

const assetsToCache = [
    '/itechart-yummy/',
    '/itechart-yummy/index.html',
    '/itechart-yummy/css/style.css',
    '/itechart-yummy/js/script.js',
    '/itechart-yummy/fonts/BebasNeueRegular.woff',
    '/itechart-yummy/images/yummy.svg',
    '/itechart-yummy/images/coffee.png',
    '/itechart-yummy/images/danger.png',
    '/itechart-yummy/images/success.png',
    '/itechart-yummy/images/warning.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => cache.addAll(assetsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', () =>
    self.clients.claim()
);

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || (!/https:/.test(event.request.url))) {
        return;
    }
    event.respondWith(
        caches.open(cacheName)
            .then(cache =>
                fromNetwork(cache, event).catch(() => fromCache(cache, event))
            )
    );
});

function fromNetwork(cache, event) {
    return fetch(event.request)
        .then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
        });
}

function fromCache(cache, event) {
    return cache.match(event.request).then((matching) =>
        matching || Promise.reject('no-match')
    );
}
