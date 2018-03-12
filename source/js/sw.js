const CACHE = 'v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) =>
            cache.addAll([
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
            ]))
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }
    event.respondWith(fromCache(event.request));
    event.waitUntil(update(event.request));
});

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}

function update(request) {
    return caches.open(CACHE).then((cache) =>
        fetch(request).then((response) =>
            cache.put(request, response)
        )
    );
}
