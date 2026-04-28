// Prismaera Service Worker (v1)
// 主目的: iOS の PWA識別 を強くして Now Playing タップが Prismaera に正しく戻るようにする。
// 副目的: 静的アセットの stale-while-revalidate (体感速度向上、 オフライン耐性は最低限)。
// HTML/JSON/Firebase API はキャッシュせず常にネットワーク優先 (更新即反映+認証/DB の鮮度維持)。

const SW_VERSION = '20260429a';
const CACHE_NAME = `prismaera-static-${SW_VERSION}`;

// アセット拡張子だけキャッシュ対象。 .html/.json/firebase 系は除外
const STATIC_EXT = /\.(?:css|js|png|jpg|jpeg|webp|svg|mp3|woff2?|ico)(?:\?|$)/i;
const NEVER_CACHE_HOST = /(?:firebaseio|googleapis|gstatic|cloudflareinsights)\.com/i;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME && k.startsWith('prismaera-static-')).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (NEVER_CACHE_HOST.test(url.hostname)) return;
  if (!STATIC_EXT.test(url.pathname + url.search)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    const networkPromise = fetch(req).then(res => {
      if (res && res.ok && res.type !== 'opaque') cache.put(req, res.clone()).catch(() => {});
      return res;
    }).catch(() => cached);
    return cached || networkPromise;
  })());
});
