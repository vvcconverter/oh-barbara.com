/* Minimal service worker for oh-barbara.com */
var CACHE = "ob-static-v7";
var PRECACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/tags.js",
  "/oz-comments.js",
  "/oh-barbara-clips.html",
  "/data/clips.json",
  "/data/tags.json",
  "/assets/hero-2.jpg",
  "/assets/profile.png",
  "/assets/gallery-1.jpg",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE) return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isHtml(req) {
  var accept = req.headers.get("accept") || "";
  return req.mode === "navigate" || accept.indexOf("text/html") !== -1;
}

function isJson(url) {
  return /\.json($|\?)/.test(url.pathname);
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }

  // только свой origin
  if (url.origin !== self.location.origin) return;

  // HTML / JSON — сначала сеть, потом cache
  if (isHtml(req) || isJson(url)) {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(req, copy);
            });
          }
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (cached) {
            return cached || caches.match("/index.html");
          });
        })
    );
    return;
  }

  // CSS / JS / картинки — cache first
  if (/\.(css|js|png|jpe?g|webp|svg|ico|woff2?)($|\?)/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(function (cached) {
        if (cached) return cached;
        return fetch(req).then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(req, copy);
            });
          }
          return res;
        });
      })
    );
  }
});
