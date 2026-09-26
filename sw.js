var CACHE = "ob-static-v27";
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
  "/assets/Oh-barbara.webp"
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

function isStaticAsset(url) {
  return /\.(css|js|png|jpe?g|webp|svg|ico|woff2?|mp4|webm|avif)($|\?)/i.test(url.pathname);
}

function withCacheControl(res, maxAge, immutable) {
  if (!res) return res;
  var headers = new Headers(res.headers);
  var value = "public, max-age=" + maxAge;
  if (immutable) value += ", immutable";
  headers.set("Cache-Control", value);
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: headers
  });
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

  if (url.origin !== self.location.origin) return;

  if (isHtml(req) || isJson(url)) {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          if (res && res.ok) {
            var cached = withCacheControl(res.clone(), 300, false);
            caches.open(CACHE).then(function (cache) {
              cache.put(req, cached);
            });
            return withCacheControl(res, 300, false);
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

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(req).then(function (cached) {
        if (cached) return withCacheControl(cached, 31536000, true);
        return fetch(req).then(function (res) {
          if (res && res.ok) {
            var out = withCacheControl(res.clone(), 31536000, true);
            caches.open(CACHE).then(function (cache) {
              cache.put(req, out.clone());
            });
            return withCacheControl(res, 31536000, true);
          }
          return res;
        });
      })
    );
  }
});