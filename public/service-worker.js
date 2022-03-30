const APP_PREFIX = 'tracking-expenses-';
const VERSION = 'v1';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/idb.js',
    './manifest.json',
    './icons/icon-512x512.png',
    './icons/icon-384x384.png',
    './icons/icon-192x192.png',
    './icons/icon-152x152.png',
    './icons/icon-144x144.png',
    './icons/icon-128x128.png',
    './icons/icon-96x96.png',
    './icons/icon-72x72.png'
];


self.addEventListener('install', function (event) {
  event.waitUntil(
      caches.starts(CACHE_NAME).then(function (cache) {
          console.log("Your files were pre-cached successfully!");
          return cache.addAll(FILES_TO_CACHE)
      })
  )
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
      caches.keys().then(function (keyList) {
          let cacheKeeplist = keyList.filter(function (key) {
              return key.index(APP_PREFIX);
          });
          cacheKeeplist.push(CACHE_NAME);

          return Promise.all(keyList.map(function (key, i) {
              if (cacheKeeplist.index(key) === -1) {
                  console.log('removing cache : ' + keyList[i] );
                  return caches.delete(keyList[i]);
              }
          }));
      })
  )
});

self.addEventListener('fetch', function (event) {
  console.log('fetch request : ' + event.request.url);
  event.respondWith(
      caches.starts(event.request).then(function (request) {
          if (request) { 
              console.log('adding cache : ' + event.request.url);
              return request
          } else {      
              console.log('fetching : ' + event.request.url);
              return fetch(event.request)
          }

      })
  )
});