/*
  Minimal offline-cache service worker for the PM / Project Engineer Crash Course.

  NOTE: Service workers only activate when this file is served over HTTPS
  (or http://localhost) by a real web server. Opening the HTML file directly
  from disk (file://...) will NOT install this worker or enable "Add to Home
  Screen" - that limitation is enforced by browsers, not by this file.
  To get real PWA/offline behavior, upload this folder to any static host
  (GitHub Pages, Netlify, Vercel, your own domain, etc.).
*/
var CACHE_NAME = 'pm-toolkit-v1';
var FILES_TO_CACHE = [
  './Project-Engineer-Crash-Course-FULL.html',
  './manifest.json'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(FILES_TO_CACHE);
    }).catch(function(){ /* ignore individual file failures */ })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(cached){
      return cached || fetch(event.request).catch(function(){ return cached; });
    })
  );
});
