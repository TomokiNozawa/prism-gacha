// Prismaera Service Worker
// 主目的:
//   1. iOS の PWA識別を強くして Now Playing タップが Prismaera に正しく戻るようにする
//   2. BGM プリキャッシュ (M1) — install時に全曲ダウンロード、 Range request も cache から slice で対応
//   3. 場所画像オンデマンドキャッシュ (M2) — script.js から prefetch された画像を専用cacheに格納
//   4. キャッシュ上限 + LRU削除 (M3) — cache毎に上限を超えたら古い順で削除
//
// HTML/JSON/Firebase API はキャッシュせず常にネットワーク優先 (更新即反映+認証/DBの鮮度維持)。

const SW_VERSION = '1.5.1bi';  // 画像永続cache 分離 (Ver bump 時の全DL し直し問題を解消、 野沢さん指摘 2026-05-03)
const STATIC_CACHE = `prismaera-static-${SW_VERSION}`;
const BGM_CACHE    = `prismaera-bgm-${SW_VERSION}`;
const LOC_CACHE    = `prismaera-loc-${SW_VERSION}`;
// 「全アセットDL」 ボタンが直接書き込む cache (SW activate で削除されない、 SW_VERSION非依存)
const OFFLINE_SAVED = 'prismaera-offline-saved';
// キャラ画像永続 cache (SW_VERSION 非依存、 cache buster 変更でも再DL 不要、 ignoreSearch:true で query 差異許容)
// 野沢さん指摘 2026-05-03 「Ver.変わるたびに全部ダウンロードし直しなの害悪すぎ」 への対応:
// 画像は cache buster で URL が変わっても中身は同一、 activate で削除しない永続 cache に置く
const IMG_PERSIST  = 'prismaera-img-persist';

// プリキャッシュ対象 BGM — script.js BGM_LIST と同期 (新曲追加時はここも更新)
// 配列順は BGM_LIST と完全同期 (dawn/watch/tide/sands/rift/church/aquasis/crimson/sahar = 9曲)
const PRECACHE_BGM = [
  '/media/audio/bgm/home.mp3',
  '/media/audio/bgm/prism-watch.mp3',
  '/media/audio/bgm/prism-tide.mp3',
  '/media/audio/bgm/prism-sands.mp3',
  '/media/audio/bgm/Prismatic Rift Overture.mp3',
  '/media/audio/bgm/prism-church.mp3',
  '/media/audio/bgm/prism-aquasis.mp3',
  '/media/audio/bgm/prism-crimson.mp3',
  '/media/audio/bgm/prism-sahar.mp3',
  '/media/audio/bgm/prism-frost.mp3',
  '/media/audio/bgm/prism-niflheim.mp3',
  '/media/audio/bgm/prism-aether.mp3',
  '/media/audio/bgm/prism-blackmoon.mp3',  // S1C5 章テーマ
  '/media/audio/bgm/prism-cards.mp3',      // カードゲーム BGM (1曲ループ、 v1 神秘カードホール BPM 115)
  '/media/audio/bgm/prism-promise.mp3',    // S1C6 章テーマ (野沢さん側 Suno 生成予定)
  '/media/audio/bgm/prism-shrine.mp3',     // S1C6 灯篭祭シーン特化 (other)
  '/media/audio/bgm/prism-frostcrown.mp3', // S1C5 既存負債 銀霜王国 派閥 BGM (faction)
  '/media/audio/bgm/prism-lullaby.mp3',    // S1C5 銀霜の月夜祭シーン特化 (other)
  '/media/audio/bgm/prism-voidrad.mp3',    // S1C7 章テーマ (野沢さん側 Suno 生成予定、 Prism Voidrad 三層構造)
  '/media/audio/bgm/prism-zanado.mp3',     // S1C7 voidtower 派閥 BGM (faction、 Prism Zanado 千年幽閉)
];

// LRU上限 (entry数ベース、 サイズベースではない理由: Cache APIは個別sizeを取れないため)
const CACHE_LIMITS = {
  [STATIC_CACHE]: 300,
  [BGM_CACHE]:    20,    // 通常7曲、 将来拡張余地+将来削除前の世代を含めて20
  [LOC_CACHE]:    200,   // 場所画像は章追加で増えるが200で全章カバー余地あり
  [OFFLINE_SAVED]: 500,  // 「全アセットDL」 用、 全アセット (BGM+キャラ+場所) をまとめて保存
};

const STATIC_EXT = /\.(?:css|js|png|jpg|jpeg|webp|svg|woff2?|ico)(?:\?|$)/i;
const NEVER_CACHE_HOST = /(?:firebaseio|googleapis|gstatic|cloudflareinsights)\.com/i;
// 場所画像のpath判定 (images/locations/ 配下) — 専用cacheに振り分け
const LOC_PATH = /\/images\/locations\//i;
// BGM (mp3) — Range対応で専用cache
const AUDIO_PATH = /\.(?:mp3|m4a|ogg|wav)(?:\?|$)/i;

// ───── install: BGM プリキャッシュ ─────
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(BGM_CACHE);
      // 全曲を並列で fetch + put (失敗してもinstall全体は失敗にしない)
      await Promise.all(PRECACHE_BGM.map(async (url) => {
        try {
          // cache: 'reload' で必ず網経由 + ServerにRangeを要求しない (= 200 full response を受ける)
          const res = await fetch(url, { cache: 'reload', credentials: 'omit' });
          if (res && res.ok && res.status === 200) {
            await cache.put(url, res);
          }
        } catch (e) { /* オフライン or 部分失敗は無視 (起動を妨げない) */ }
      }));
    } catch (e) { /* cache open失敗も install は通す */ }
    self.skipWaiting();
  })());
});

// ───── activate: 古いcache掃除 + claim ─────
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // OFFLINE_SAVED + IMG_PERSIST は版を跨いで保持 (ユーザーが DL したもの + 画像永続cache を SW更新で消さない)
    const validNames = new Set([STATIC_CACHE, BGM_CACHE, LOC_CACHE, OFFLINE_SAVED, IMG_PERSIST]);
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k.startsWith('prismaera-') && !validNames.has(k))
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// ───── fetch ハンドラ ─────
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (NEVER_CACHE_HOST.test(url.hostname)) return;

  const path = url.pathname;

  // BGM (mp3 等) — Range対応で専用handler
  if (AUDIO_PATH.test(path + url.search)) {
    event.respondWith(handleAudio(req));
    return;
  }

  // キャラ画像 — IMG_PERSIST cache (SW_VERSION 非依存、 cache buster 変更で再DL しない)
  // 野沢さん指摘 2026-05-03 「Ver変わるたび全DL害悪」 → /images/characters/ は永続cache へ
  if (path.startsWith('/images/characters/')) {
    event.respondWith(staleWhileRevalidate(req, IMG_PERSIST));
    return;
  }
  // 場所画像 (WM 含む) — IMG_PERSIST cache (SW_VERSION 非依存、 cache buster 変更で再DL しない)
  // 野沢さん指摘 2026-05-03 「WM が毎回リロードで読込し直し」 → LOC_CACHE は SW_VERSION 連動で消えるため永続cache 統合
  if (LOC_PATH.test(path)) {
    event.respondWith(staleWhileRevalidate(req, IMG_PERSIST));
    return;
  }
  // その他静的アセット (CSS/JS/フォント等) — 既存挙動 (OFFLINE_SAVED 最優先)
  if (STATIC_EXT.test(path + url.search)) {
    event.respondWith(staleWhileRevalidate(req, STATIC_CACHE));
    return;
  }
  // それ以外 (HTML, JSON, API) はネットワーク直 (素通し)
});

// ───── audio (BGM) handler — Range request にも cache から応答 ─────
async function handleAudio(req) {
  const cache = await caches.open(BGM_CACHE);
  const range = req.headers.get('range');

  // 手動DL cache (OFFLINE_SAVED) を最優先で確認 (ignoreSearch:true で cache buster の差異許容)
  let saved = null;
  try { saved = await caches.match(req.url, { cacheName: OFFLINE_SAVED, ignoreSearch: true }); } catch (e) {}

  if (range) {
    // Range request: cache (OFFLINE_SAVED 優先 → BGM_CACHE) に full file あれば slice して 206 を作る
    // Cache APIは Vary header無視で URL ベース match するので ignoreVary不要
    const cached = saved || await cache.match(req.url);
    if (cached) {
      try {
        return await makeRangeResponse(cached, range);
      } catch (e) {
        // sliceで失敗したら network へ fallback
      }
    }
    // cache miss: network へ素通し (ServerがRange対応する想定)
    return fetch(req);
  }

  // Range なし: cache優先 (OFFLINE_SAVED 優先 → BGM_CACHE)、 cache miss なら network経由でcache充填
  if (saved) return saved;
  const cached = await cache.match(req.url);
  if (cached) return cached;
  try {
    const res = await fetch(req.url, { cache: 'reload', credentials: 'omit' });
    if (res && res.ok && res.status === 200) {
      // put を await して race condition 回避 (「全アセットDL」 直後の caches.match でも確実に hit する)
      try { await cache.put(req.url, res.clone()); } catch (e) {}
      trimCache(BGM_CACHE);  // background
    }
    return res;
  } catch (e) {
    return new Response('', { status: 504, statusText: 'Network error' });
  }
}

// cached Response (200 full) から Range header に応じた 206 partial Response を作る
async function makeRangeResponse(cached, rangeHeader) {
  const buf = await cached.arrayBuffer();
  const total = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!m) {
    // 不正な Range: そのまま 200 で full body を返す
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg',
        'Content-Length': String(total),
        'Accept-Ranges': 'bytes',
      },
    });
  }
  const start = m[1] ? parseInt(m[1], 10) : 0;
  const end = m[2] ? parseInt(m[2], 10) : total - 1;
  if (start >= total || end >= total || start > end) {
    return new Response('', {
      status: 416,
      headers: { 'Content-Range': `bytes */${total}` },
    });
  }
  const sliced = buf.slice(start, end + 1);
  return new Response(sliced, {
    status: 206,
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Length': String(sliced.byteLength),
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
    },
  });
}

// ───── staleWhileRevalidate (静的+場所画像 共通) ─────
// 2026-05-02: 「データ保存」 で OFFLINE_SAVED に手動DL したものは オンライン時も最優先で返す
// → 画像読込が体感的に遅い問題を解消 (野沢さん指摘「ダウンロードしてるのに画像読み込み遅い」)。
// OFFLINE_SAVED は手動DL なので revalidate 不要 (バージョン更新は SW_VERSION bump で全 cache 再構築)。
async function staleWhileRevalidate(req, cacheName) {
  // 手動DL cache を最優先で返す (cache hit → 即返し、 ネットワーク不要)
  // ignoreSearch:true で cache buster (?v=1.5.1bi) の差異も許容 → 「DL したのに別 buster で読まれて遅い」 事故防止
  try {
    const savedCached = await caches.match(req, { cacheName: OFFLINE_SAVED, ignoreSearch: true });
    if (savedCached) return savedCached;
  } catch (e) {}
  const cache = await caches.open(cacheName);
  // ignoreSearch:true で cache buster 差異許容 (野沢さん指摘 2026-05-03 「Ver変わるたび全DL害悪」 の根本対策)
  // 同 path で cache hit すれば再DL不要、 query (?v=1.5.1bi) は無視
  const cached = await cache.match(req, { ignoreSearch: true });
  // cached あり: 即返し、 background で **条件付き** revalidate (ETag/Last-Modified 利用)
  // 2026-05-03: 「同名ファイル名で更新があった場合だけ更新」 対応 (野沢さん指摘)
  // → If-None-Match / If-Modified-Since を付けて conditional GET、 304 Not Modified なら body 転送 0 byte
  //   サーバー側が変更を検知した時のみ 200 OK + 新 body が返り cache.put で差分更新される
  //   IMG_PERSIST も対象 (同名で内容更新があれば取り込まれる、 cache buster 不要)
  if (cached) {
    const etag = cached.headers.get('ETag');
    const lastMod = cached.headers.get('Last-Modified');
    const condInit = {};
    if (etag || lastMod) {
      const headers = new Headers();
      if (etag) headers.set('If-None-Match', etag);
      else if (lastMod) headers.set('If-Modified-Since', lastMod);
      condInit.headers = headers;
    }
    const condReq = (etag || lastMod) ? new Request(req, condInit) : req;
    fetch(condReq).then(res => {
      // 304 Not Modified: 内容変更なし → 何もしない (転送 0 byte で済む = 通信量/電池節約)
      if (res && res.status === 304) return;
      // 200 OK: 内容更新あり → cache に上書き put
      if (res && res.ok && res.type !== 'opaque') {
        cache.put(req, res.clone()).then(() => trimCache(cacheName)).catch(() => {});
      }
    }).catch(() => {});
    return cached;
  }
  // cache miss: network で取って put を await してから返す (race condition 回避)
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type !== 'opaque') {
      try { await cache.put(req, res.clone()); } catch (e) {}
      trimCache(cacheName);  // background
    }
    return res;
  } catch (e) {
    return new Response('', { status: 504, statusText: 'Network error' });
  }
}

// ───── LRU trim — entries が上限超えたら古い順で削除 ─────
// Cache API の cache.keys() は put 順 (= 古い順) で返るため、 先頭から削れば LRU 相当になる。
// (厳密な LRU は アクセス時刻が必要だが、 この用途では put 順で十分)
async function trimCache(cacheName) {
  try {
    const limit = CACHE_LIMITS[cacheName];
    if (!limit) return;
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length <= limit) return;
    const excess = keys.length - limit;
    for (let i = 0; i < excess; i++) {
      await cache.delete(keys[i]);
    }
  } catch (e) { /* trim失敗は致命ではない */ }
}

// ───── message handler — ページ側からの操作 (将来用) ─────
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || !data.type) return;
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
