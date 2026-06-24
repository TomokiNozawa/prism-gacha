# DESIGN: P-14 SE (効果音システム)

## 概要
- 目的: 現状 PCB の音は BGM のみで、 操作音 (配置 / コンボ / 結果) が無く 「ヌルッと進む」 感覚。 短い SE (50-300ms) を 配置 / コンボ発動 / 派閥シナジー / 試合結果 に当てて 操作の手応えを上げる。 BGM 既存資産 (`media/audio/bgm/` 18 曲 + sw.js PRECACHE_BGM) と同じ流れで SE 専用ディレクトリと cache を整備。
- 規模感: **中規模** (再生インフラ + sw.js cache + 設定 UI、 SE アセット自体は野沢さん側 Suno or DALL-E で生成、 実働 1.5-2h 想定)

## ユースケース 3-5個

| # | ユースケース | 主要操作 |
|---|---|---|
| ① | カード配置時に「コトッ」 という置き音が鳴る | `placeCard()` 内で `_playSE('place_card')` |
| ② | コンボ発動時に「キィン」 高音 + 余韻、 LR 配置時に 「ジャラララン」 派手音 | `_evalCombo()` ヒット → `_playSE('combo_trigger')`、 LR 配置 → `_playSE('lr_cutin')` |
| ③ | 試合勝利で 「ファンファーレ」、 敗北で 「下降音」、 引分で 中立音 | `finishMatch()` 結果別に `_playSE('win'|'loss'|'draw')` |
| ④ | BGM ミュート と SE ミュート は別操作で、 BGM 切っても SE は残せる | 設定 → 「BGM」 「SE」 各トグル、 `pcbCloud.bgmMute` 隣に `seMute` 追加 |
| ⑤ | 何度も同じ SE が連打されても 音が割れない (重複再生制御) | AudioBuffer の clone 再生 (Web Audio API)、 同 SE 同フレームでも被らない |

## データ構造 (Firebase RTDB / JSON)

```jsonc
// /pcbData/$uid/seMute  (アカウント保持、 BGM mute と同階層)
false   // true ならミュート

// /pcbData/$uid/seVolume (Phase 3、 0-1 float)
0.7
```

※ memory `feedback_account_first_persistence.md` 準拠、 端末跨ぎで設定継承。

### SE アセット仕様 (野沢さん側生成)

```
media/audio/se/
├── place_card.mp3        # 50-100ms、 木の駒置き音
├── combo_trigger.mp3     # 200-300ms、 キィン+余韻
├── lr_cutin.mp3          # 400-600ms、 派手なドンジャラ
├── faction_glow.mp3      # 150-200ms、 ふわっと包まれる音
├── win.mp3               # 800-1200ms、 ファンファーレ短め
├── loss.mp3              # 600ms、 下降音
├── draw.mp3              # 500ms、 中立的なチャイム
├── btn_tap.mp3           # 30-50ms、 ボタン tap (Phase 2)
└── card_hover.mp3        # 30ms、 hover 微音 (Phase 2、 PC 限定)
```

ファイル形式: **mp3 128kbps mono**、 1 ファイル ≤ 50KB を目安 (合計 ≤ 500KB、 BGM 1 曲分以下)

## UI 設計

### 統合先

- **設定モーダル**: 既存の BGM mute トグルの隣に 「SE」 トグル + 音量スライダ (Phase 3)
- **HTML 追記なし** (audio 要素は不要、 Web Audio API で動的)

### 設定 UI スケルトン (既存設定モーダル内)

```html
<!-- cardgame/index.html、 settings-modal の audio セクション -->
<div class="cg-setting-row">
  <label class="cg-setting-label">🎵 BGM</label>
  <input type="checkbox" id="cg-bgm-mute-toggle" />
</div>
<div class="cg-setting-row">
  <label class="cg-setting-label">🔔 効果音 (SE)</label>
  <input type="checkbox" id="cg-se-mute-toggle" />
</div>
```

## ロジック概要

```js
// cardgame/script.js 追記 (~280 付近、 cgBgm 隣)

const SE_FILES = {
  place_card:    '/media/audio/se/place_card.mp3',
  combo_trigger: '/media/audio/se/combo_trigger.mp3',
  lr_cutin:      '/media/audio/se/lr_cutin.mp3',
  faction_glow:  '/media/audio/se/faction_glow.mp3',
  win:           '/media/audio/se/win.mp3',
  loss:          '/media/audio/se/loss.mp3',
  draw:          '/media/audio/se/draw.mp3',
};

// AudioContext は遅延初期化 (initial autoplay block 回避、 user gesture 後)
let _seCtx = null;
const _seBufferCache = new Map();   // url → AudioBuffer

function _ensureSeCtx() {
  if (_seCtx) return _seCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  _seCtx = new Ctx();
  return _seCtx;
}

async function _loadSe(url) {
  if (_seBufferCache.has(url)) return _seBufferCache.get(url);
  const ctx = _ensureSeCtx(); if (!ctx) return null;
  try {
    const res = await fetch(url, { credentials: 'omit' });
    const ab  = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(ab);
    _seBufferCache.set(url, buf);
    return buf;
  } catch (e) { return null; }
}

async function _playSE(id) {
  if (pcbCloud.seMute === true) return;
  const url = SE_FILES[id]; if (!url) return;
  const ctx = _ensureSeCtx(); if (!ctx) return;
  const buf = await _loadSe(url); if (!buf) return;
  // 重複再生 OK (BufferSource は使い捨て、 連打されても割れない)
  const src  = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.value = (pcbCloud.seVolume ?? 0.7);
  src.connect(gain).connect(ctx.destination);
  src.start(0);
}

// 起動時に主要 SE をプリロード (起動から 500ms 後、 idle に)
function _prefetchSeAssets() {
  setTimeout(() => {
    Object.values(SE_FILES).forEach(url => _loadSe(url));
  }, 500);
}
```

### 既存実装との結合点

- `placeCard()` 末尾に `_playSE('place_card')` (LR なら 加えて `_playSE('lr_cutin')`)
- `_evalCombo()` ヒット時に `_playSE('combo_trigger')`
- 派閥 glow start (P-4 と統合) で `_playSE('faction_glow')`
- `finishMatch()` 結果判定後 `_playSE(matchResult)` (`win`/`loss`/`draw`)
- 設定 UI 連動: SE トグル `change` で `pcbCloud.seMute = e.target.checked; _pcbSet('seMute', pcbCloud.seMute)`
- `pcbCloudInit()` で `seMute = await _pcbGet('seMute')` 追加 + 起動末尾で `_prefetchSeAssets()`

### sw.js への追加 (起動時 cache)

```js
// sw.js L23 PRECACHE_BGM の隣に PRECACHE_SE 追加
const PRECACHE_SE = [
  '/media/audio/se/place_card.mp3',
  '/media/audio/se/combo_trigger.mp3',
  '/media/audio/se/lr_cutin.mp3',
  '/media/audio/se/faction_glow.mp3',
  '/media/audio/se/win.mp3',
  '/media/audio/se/loss.mp3',
  '/media/audio/se/draw.mp3',
];
// install handler 内で BGM cache と同じパターンで cache.put
```

新しい `SE_CACHE = 'prismaera-se-${SW_VERSION}'` を作るか、 BGM_CACHE に同居させるか は要決定 (推奨: 別 cache、 BGM と SE で 上限管理を分けるため、 SE は CACHE_LIMITS に 30 程度)

## 機械チェック (check_repo_rules.py に追加すべきルール)

- **WARNING**: `SE_FILES` のキー全てに 対応する `media/audio/se/*.mp3` ファイルが存在するか
- **WARNING**: `SE_FILES` の キー が `sw.js PRECACHE_SE` に 全て登録されているか (BGM 既存ルール 7-13/7-14 と同型)
- **WARNING**: 各 SE mp3 ファイルサイズ ≤ 100KB (画面操作の即時応答性のため、 大きすぎは load 遅延)
- **BLOCKER**: SE_FILES エントリ追加 + sw.js 未追加 → BLOCKER (PRECACHE 漏れは致命的)

## 実装 Phase

- **Phase 1** (実働 1h): `_playSE` インフラ (Web Audio API + キャッシュ + mute 連動) + `place_card` / `win` / `loss` / `draw` 4 種だけ繋ぎ
- **Phase 2** (実働 30-45min): `combo_trigger` / `lr_cutin` / `faction_glow` 追加 (P-4 演出と同期発火)、 設定 UI に SE トグル
- **Phase 3** (実働 30min): 音量スライダ + ボタン tap 音 + sw.js PRECACHE_SE + check_repo_rules.py ルール追加

## 要決定 (野沢さん確認待ち)

- **A. SE アセット 生成元**: 野沢さん側 Suno で生成 か、 フリー素材サイト (効果音ラボ等) で代用 か
- **B. ボタン tap 音 を 入れるか**: PWA は ネイティブアプリ感が出るが、 押すたび鳴ると 鬱陶しい意見もあり (デフォルト OFF / オプション)
- **C. SE / BGM mute は 統合トグル か 個別 トグル か**: 個別推奨だが、 設定 UI が縦に伸びるなら 統合 「サウンド mute」 1 つでも可
- **D. PC でのみ hover 音**: モバイルは hover が tap 直前に鳴って二重音、 PC 限定が安全。 そもそも入れるか?

## 関連 memory / 既存実装

- `feedback_account_first_persistence.md` — `seMute` `seVolume` は Firebase 保持
- `feedback_master_data_over_runtime_fetch.md` — SE のサイズ/長さ等は実行時測定でなく、 ファイル名・配置で固定 (野沢さん 2026-04-28 指摘)
- `feedback_asset_scene_mapping.md` — `media/audio/se/README.md` 隣に 用途・対応シーン・コード参照位置を必ず記載
- 既存実装:
  - `cardgame/script.js` L280-303 (`cgBgm` audio 要素、 mute 制御パターン)
  - `cardgame/script.js` L100-110 (pcbCloud に `bgmMute` 既存)
  - `sw.js` L23-44 (PRECACHE_BGM、 同型で PRECACHE_SE 追加)
  - `media/audio/bgm/` (BGM 既存 18 曲、 隣に `se/` ディレクトリ新設)

## 5点セルフチェック (実装直前 明示宣言用)

1. Esc 閉じ — 不要 (UI 追加は設定モーダル内のトグル 2 つだけ、 別途モーダルなし)
2. Tab フォーカストラップ — 不要 (上記同)
3. ≥ 44×44 タップ — `.cg-setting-row` の checkbox は 既存パターンで 確保済 (再確認のみ)
4. `_setBodyModalOpen()` 使用 — 不要
5. 既存デザイン揃え — `cg-setting-row` 既存パターン、 BGM mute トグルの 真下に SE mute トグルを 同形式で並べる
