var CACHE = 'wizzy-v3';
var urls = ['/home.html', '/files/projects.html', '/files/about.html', '/files/blog.html', '/files/project-detail.html', '/404.html', '/style/main.css', '/manifest.json', '/files/data-loader.js', '/files/settings-loader.js', '/files/firebase-config.js', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(urls);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(resp) {
      return resp || fetch(e.request).then(function(fetchResp) {
        return caches.open(CACHE).then(function(cache) {
          cache.put(e.request, fetchResp.clone());
          return fetchResp;
        });
      }).catch(function() {
        return caches.match('/404.html');
      });
    })
  );
});
