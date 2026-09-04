const CACHE_NAME = 'personal-vault-preview-v1';
const APP_SHELL = [
    './',
    './index.html',
    './login.html',
    './signup.html',
    './home.html',
    './accounts.html',
    './important-files.html',
    './notes.html',
    './savings.html',
    './style.css',
    './signupstyle.css',
    './homestyle.css',
    './login.js',
    './signup.js',
    './sidebar.js',
    './logout.js',
    './accounts.js',
    './important-files.js',
    './notes.js',
    './savings.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(APP_SHELL);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys
                .filter(function (key) { return key !== CACHE_NAME; })
                .map(function (key) { return caches.delete(key); }));
        })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});
