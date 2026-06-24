# DESIGN: M-89 ホーム常駐マスコット

## 概要
- 目的: ユーザーが選んだお気に入りキャラを ホーム画面の片隅に SD (デフォルメ) 立ち絵で常駐させ、 タップで セリフを喋り、 滞在時間と愛着を上げる。 既存ガチャ/PCB/Story とは独立した 「居る感」 演出。 凸数 5 のキャラだけ選択可など 報酬性も持たせる。
- 規模感: **大物** (キャラ選択 UI + SD 画像生成枠 + セリフライブラリ + 配置 + アニメ + Firebase 保持、 実働 4-6h 想定。 SD 画像アセット生成 (DALL-E 3 で SD 風) は 野沢さん側 + Claude プロンプト提案で 別計画)

## ユースケース 3-5個

| # | ユースケース | 主要操作 |
|---|---|---|
| ① | 凸 5 達成キャラを ホームに常駐 表示、 タップで そのキャラの台詞 (10 種ローテ) | 図鑑 → 凸 5 キャラ → 「マスコットに設定」 ボタン → 即時ホーム反映 |
| ② | 時間帯別セリフ (朝/昼/夜) で 「おはよう」 「お疲れ様」 が変わる | 起動時の時刻で セリフセット切替 |
| ③ | キャラを切り替えたい (今日は別の子の気分) | 図鑑から 別キャラ選択、 もしくは ホームの マスコット長押しで 「変更」 メニュー |
| ④ | マスコット非表示にしたい (集中モード) | 設定 → 「マスコット表示 OFF」 → ホームから消える |
| ⑤ | 章公開連動の特別セリフ (S1C5 公開直後 1 週間 「黒月だね」 等) | セリフライブラリに `chapterEvent` 区分、 期間限定セリフ表示 |

## データ構造 (Firebase RTDB / JSON)

```jsonc
// /pcbData/$uid/mascot/  (アカウント保持)
// pcbData ではなく /userData/$uid/mascot/ の方が 命名整合は良いが、
// 既存の prism-gacha 側 schema と被らないよう要確認。 まずは pcbData 隣で運用、
// 別 path 採用は要決定 A 参照。
{
  "selectedCharId": "ur_07",         // POOL の id
  "enabled": true,                    // 表示 ON/OFF
  "lastSpokenAt": 1714915200000,
  "spokenLineIndex": 3,               // 同セリフ連発防止のラウンドロビン index
  "version": 1
}
```

### セリフライブラリ (script.js or 別 JSON)

```jsonc
// content/data/mascot_lines.json  新規
// キャラ別 + 区分別、 各セリフは 30-60 文字、 タップで吹き出し 3s 表示
{
  "ur_07": {
    "name": "アルテミス",
    "morning":   ["朝だ。 今日も虹霊が騒がしい。", "おはよう。 紅玉の刻、 始めようか。"],
    "afternoon": ["陽が昇った。 何か始めようか。", "鞘鳴りの時刻。 整える。"],
    "night":     ["月だな。 今宵も眠らない者へ。", "黒月よ、 今宵も騒がしい。"],
    "tap":       ["ふむ。", "用か。", "鞘から響く音がする。", "我が剣は、 たまに語る。"],
    "chapterEvent": {
      "s1c5": "黒月の祭壇で、 何かが目を覚ました。"
    }
  },
  "ssr_03": {
    "name": "ノエラ",
    "morning":   ["おはよ! 今日もキラキラ!", "ねえ、 私のおにぎり食べる?"],
    // ...
  }
}
```

各キャラ最低 morning 2 / afternoon 2 / night 2 / tap 4 = 10 ライン (まずは 凸 5 候補 5-10 キャラで先行実装、 順次拡大)。

### SD 画像アセット仕様

```
images/characters/s1/sd/   (B-3 リネーム後の path 想定、 旧: season1/sd/)
├── lr/akkesia_sd.webp     # 200x200、 透過 PNG → webp 変換、 ≤30KB
├── ur/aoyama_sd.webp
├── ssr/...
└── ...
```

DALL-E 3 でSD化 (「2-head SD chibi style, transparent background, full body, simple shading」) → 透過 PNG 生成 → webp 変換。 pool.json 既存 `img` 隣に `sdImg` フィールド追加。

## UI 設計

### 統合先

- `index.html`: ホーム画面の `<body>` 直下に `<div id="mascot-container">` 追加 (z-index: 90、 モーダル 280 より下、 hero/cardgame-row より上 = 70 の上)
- `style.css`: 専用セクション (~50 行)
- `script.js`: マスコット制御モジュール

### HTML スケルトン

```html
<!-- index.html、 home-screen 内 (or body 末尾) -->
<div id="mascot-container" class="mascot-container" hidden>
  <div class="mascot-bubble" id="mascot-bubble" hidden>
    <span id="mascot-bubble-text"></span>
    <div class="mascot-bubble-tail"></div>
  </div>
  <button class="mascot-img-btn" id="mascot-img-btn" aria-label="マスコットと話す">
    <img class="mascot-img" id="mascot-img" alt="" />
  </button>
</div>

<!-- 図鑑のキャラ詳細モーダル内に「マスコット設定」 ボタン追加 -->
<button class="char-detail-action" id="char-detail-mascot-set">
  ⭐ ホームのマスコットに設定
</button>
```

### CSS

```css
.mascot-container {
  position: fixed; z-index: 90;
  right: 16px; bottom: 80px;       /* モバイル: ボトムナビ 56px の上 */
  pointer-events: none;             /* 子要素のみ pointer-events: auto */
}
@media (min-width: 720px) {
  .mascot-container { right: 24px; bottom: 24px; }
}

.mascot-img-btn {
  pointer-events: auto;
  width: 90px; height: 90px;
  background: transparent; border: none; padding: 0; cursor: pointer;
  filter: drop-shadow(0 4px 12px rgba(124,93,255,.45));
  animation: mascotFloat 3.6s ease-in-out infinite alternate;
}
.mascot-img { width: 100%; height: 100%; object-fit: contain; }

@keyframes mascotFloat {
  0%   { transform: translateY(0) rotate(-1deg); }
  100% { transform: translateY(-6px) rotate(1deg); }
}

.mascot-bubble {
  pointer-events: auto;
  position: absolute;
  right: 100%; bottom: 60px;       /* 画像の左上に出る */
  margin-right: 8px;
  background: rgba(20,15,40,.92);
  color: #fff; font-size: 13px; line-height: 1.4;
  padding: 10px 14px; border-radius: 12px;
  border: 1px solid rgba(255,213,107,.45);
  max-width: 220px;
  animation: mascotBubbleShow .25s ease-out;
}
.mascot-bubble-tail {
  position: absolute; right: -6px; bottom: 14px;
  width: 0; height: 0;
  border-left: 8px solid rgba(20,15,40,.92);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}
@keyframes mascotBubbleShow {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .mascot-img-btn { animation: none; }
  .mascot-bubble { animation: none; }
}
```

## ロジック概要

```js
// script.js or 別ファイル mascot.js (新規) → script.js で import (PWA で module 不可なら ベタ書き)

const MASCOT_LINES_URL = '/content/data/mascot_lines.json';
let MASCOT_LINES = null;
let _mascotState = { selectedCharId: null, enabled: false, lastSpoken: 0 };

async function _loadMascotLines() {
  if (MASCOT_LINES) return MASCOT_LINES;
  try {
    const res = await fetch(MASCOT_LINES_URL);
    MASCOT_LINES = await res.json();
  } catch (e) { MASCOT_LINES = {}; }
  return MASCOT_LINES;
}

async function loadMascotConfig() {
  if (!cgUid || !cgFbDb) return;
  const snap = await cgFbDb.ref(`pcbData/${cgUid}/mascot`).once('value');
  const cfg  = snap.val() || {};
  _mascotState.selectedCharId = cfg.selectedCharId || null;
  _mascotState.enabled        = cfg.enabled !== false;
  await _renderMascot();
}

async function _renderMascot() {
  const cont = document.getElementById('mascot-container'); if (!cont) return;
  if (!_mascotState.enabled || !_mascotState.selectedCharId) {
    cont.hidden = true; return;
  }
  cont.hidden = false;
  const char = POOL.find(c => c.id === _mascotState.selectedCharId);
  if (!char) { cont.hidden = true; return; }
  const sdPath = char.sdImg || _deriveSdPath(char.img);  // POOL 既存 img から SD path 推測
  document.getElementById('mascot-img').src = sdPath;
  // タップで喋らせる
  const btn = document.getElementById('mascot-img-btn');
  btn.onclick = () => _mascotSpeak();
  // 起動時の時間帯セリフを 1 回だけ自動表示
  _mascotSpeak({ kind: _timeKind() });
}

async function _mascotSpeak(opts = {}) {
  const lines = (await _loadMascotLines())[_mascotState.selectedCharId];
  if (!lines) return;
  const kind = opts.kind || 'tap';
  const set  = lines[kind] || lines.tap;
  if (!Array.isArray(set) || set.length === 0) return;
  // ラウンドロビン (連発防止)
  const idx  = (Date.now() / 1000 | 0) % set.length;
  const text = set[idx];
  const bub  = document.getElementById('mascot-bubble');
  document.getElementById('mascot-bubble-text').textContent = text;
  bub.hidden = false;
  setTimeout(() => { bub.hidden = true; }, 3000);
  _mascotState.lastSpoken = Date.now();
}

function _timeKind() {
  const h = new Date().getHours();
  if (h < 11) return 'morning';
  if (h < 18) return 'afternoon';
  return 'night';
}

// 図鑑からの設定 hook
async function setMascotChar(charId) {
  _mascotState.selectedCharId = charId;
  _mascotState.enabled = true;
  await cgFbDb.ref(`pcbData/${cgUid}/mascot`).set({
    selectedCharId: charId, enabled: true, version: 1, lastSpokenAt: Date.now()
  });
  await _renderMascot();
  // トースト 「アルテミスをマスコットに設定しました」
  showToast(`${POOL.find(c=>c.id===charId)?.name}をマスコットに設定しました`);
}
```

### 既存実装との結合点

- 図鑑モーダル (`char-detail` モーダル、 既存 `data-tab="pcb"` 隣) に 「マスコットに設定」 ボタン追加。 凸数 5 達成チェックは 既存 `getAscendCount(char)` を使う
- 起動時 `pcbCloudInit()` 完了後、 `loadMascotConfig()` を 呼ぶ
- 設定モーダルに 「マスコット表示 ON/OFF」 トグル追加
- `index.html` の `home-screen` 内に container 配置 (他画面では z-index 都合で 一旦非表示)

## 機械チェック (check_repo_rules.py に追加すべきルール)

- **WARNING**: `mascot_lines.json` の キーが POOL の id 全てを網羅 — 不要 (一部キャラのみで OK、 段階拡大方針)
- **WARNING**: `mascot_lines.json` の 各キャラに `morning`/`afternoon`/`night`/`tap` 4 区分 全て 1 ライン以上あるか
- **BLOCKER**: `pool.json` で `sdImg` フィールド 指定キャラに対し 該当 webp ファイル 存在確認
- **WARNING**: 「マスコット設定可」 と 表示する キャラ (凸 5) の SD 画像が 全て揃っているか

## 実装 Phase

- **Phase 1** (実働 1.5h): HTML/CSS 配置 + Firebase schema + 図鑑からの設定 hook + 設定 ON/OFF トグル — まずは **アルテミス 1 キャラ + 既存立ち絵流用** で動く版
- **Phase 2** (実働 1-2h): セリフライブラリ JSON + 時間帯切替 + ローテ index + 章 event セリフ
- **Phase 3** (実働 1-2h、 アセット 待ち): SD 画像生成 (DALL-E 3 プロンプト 5-10 キャラ、 野沢さん生成 → repo 取込) + sdImg path 整備 + 凸 5 ゲート + 拡大デプロイ

## 要決定 (野沢さん確認待ち)

- **A. データ保存 path**: `/pcbData/$uid/mascot` か、 別 path `/userData/$uid/mascot` に分離するか (PCB 機能と独立した方が綺麗、 だが Firebase Rules 1 entry 増える)
- **B. 凸 5 ゲート**: マスコットに設定可は 「凸 5 達成キャラのみ」 とするか、 「所持済キャラ全員」 で OK か (野沢さん方針で報酬性入れる/入れない)
- **C. SD 画像生成戦略**: DALL-E 3 で 既存立ち絵を SD 化 (毎回別テイスト リスク) か、 既存立ち絵を そのまま 縮小 (品質無難だが SD 感は弱い)
- **D. 初期キャラ数**: Phase 1 で 1 キャラ動作確認 → Phase 3 で 何キャラ拡大 (5-10? 全 LR/UR で 約 30 体?)
- **E. セリフ生成**: Claude が キャラ凸秘話 + POOL.desc を read して セリフ案 提案 → 野沢さん承認 で確定 (この設計書承認後の 別タスク)

## 関連 memory / 既存実装

- `feedback_account_first_persistence.md` — Firebase 保持
- `feedback_keyboard_first_ui.md` — Esc で 吹き出し 閉じ可、 マスコット自体は閉じない
- `feedback_responsive_shortcuts.md` — モバイルで `bottom: 80px` でボトムナビ重複なし
- `feedback_dalle_disabled_feature_preservation.md` — SD 化時に 隻眼/scar 等 欠損部位 自動補正 防止 プロンプト
- `feedback_char_age_youth_first.md` — SD でも 老け化 NG (10-20 代見た目)
- 既存実装:
  - `index.html` `home-screen` セクション (container 配置先)
  - `script.js` `POOL` (キャラ DB)
  - `script.js` 図鑑/char-detail モーダル (設定 hook 点)
  - `script.js` `pcbCloudInit()` (起動時ロード hook)
  - `cardgame/script.js` L100 `pcbCloud` schema (既存 path 隣に mascot 追加)

## 5点セルフチェック (実装直前 明示宣言用)

1. Esc 閉じ — 吹き出しのみ Esc で 閉じる、 マスコット本体は 常駐 (閉じる動線は 設定 OFF または 長押しメニュー)
2. Tab フォーカストラップ — マスコットボタンが Tab 順に入る、 設定モーダル時のみ trap
3. ≥ 44×44 タップ — `mascot-img-btn` は 90×90、 余裕で達成
4. `_setBodyModalOpen()` 使用 — マスコットはモーダルでない、 不要
5. 既存デザイン揃え — `mascot-` prefix、 既存吹き出し色 `rgba(20,15,40,.92)` (どこか CSS で 使ってるか要確認)、 既存 hero の bottom margin と重複しない位置
