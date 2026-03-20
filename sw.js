var CACHE = "tfs-publish-v45";
var urlsToCache = ["./", "./index.html", "./constants.js", "./utils.js", "./components.js", "./app.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(urlsToCache); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(function(names) {
    return Promise.all(names.filter(function(n) { return n !== CACHE; }).map(function(n) { return caches.delete(n); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  e.respondWith(fetch(e.request).catch(function() { return caches.match(e.request); }));
});
