# DESIGN: P-4 カード演出 (LRカットイン / コンボ光線 / 派閥シナジー光)

## 概要
- 目的: 現状 PCB の配置演出は `placeCard` keyframe (0.4s スケール+グロー) のみで地味。 LR 配置 / コンボ発動 / 派閥シナジー 3 シーンに 派手な演出を入れて、 「決まった瞬間の気持ちよさ」 を上げる。 既に本体 (`script.js`) のガチャは godrays/MIRACLE/cutin で派手なので、 PCB の演出格差を縮める。
- 規模感: **中規模** (CSS keyframes + JS フック追加、 SE は P-14 と並走で別設計、 実働 2-3h 想定)

## ユースケース 3-5個

| # | ユースケース | 主要操作 |
|---|---|---|
| ① | 終盤 T6 で LR を ドンと置いた瞬間に カットイン演出が走り 気持ちよく勝ち確 | `placeCard()` で tier==='LR' なら 全画面カットイン (1.2s) + 既存 placeCard アニメ |
| ② | 同レーンで コンボ duo が成立した時 2 枚を結ぶ虹色光線が走る | `_evalCombo()` ヒット時に 2 カード DOM の getBoundingClientRect で SVG 光線描画 (1s) |
| ③ | 同レーンに同派閥3枚以上揃った時 レーン背景に色対応の glow 流し | `_renderLane()` 後に派閥カウント >=3 で `.cg-lane.faction-glow` クラス付与 |
| ④ | 演出が長くてプレイテンポが落ちると感じたら 設定で 軽量モード ON で時間半減 | 設定モーダル → 「演出: 標準/軽量」 → 軽量で全演出 0.3s 以下 + カットイン スキップ |
| ⑤ | prefers-reduced-motion の OS 設定を尊重し 自動軽量化 (2025 年標準対応) | CSS で `@media (prefers-reduced-motion: reduce)` 既存パターン (style.css L846+ ) に追加 |

## データ構造 (Firebase RTDB / JSON)

```jsonc
// /pcbData/$uid/settings/effects  (アカウント保持)
{
  "effects": "standard"     // "standard" | "light" — 軽量モード切替
}
```

※ 演出オン/オフは ユーザー好みで端末跨ぎ継承するべき → アカウント保持。 OS の reduced-motion は CSS 側で別途吸収。

## UI 設計

### 統合先
- `cardgame/index.html`: 全画面オーバーレイ用 `<div id="cg-fx-layer">` を `<body>` 直下に追加 (z-index: 250、 既存モーダル 280 より下)
- `cardgame/style.css`: keyframes 5 つ追加 (L1130 `placeCard` 隣)
- `cardgame/script.js`: `_fxCutin(card)` `_fxComboBeam(cardA, cardB)` `_fxFactionGlow(laneIdx, faction)` 関数

### HTML スケルトン

```html
<!-- cardgame/index.html (body 直下、 既存 tutorial-modal の隣) -->
<div id="cg-fx-layer" class="cg-fx-layer" aria-hidden="true">
  <!-- カットイン本体: img + ribbon、 動的に innerHTML 差替 -->
  <div id="cg-fx-cutin" class="cg-fx-cutin" hidden>
    <img class="cg-fx-cutin-img" alt="" />
    <div class="cg-fx-cutin-ribbon"></div>
    <div class="cg-fx-cutin-name"></div>
  </div>
  <!-- コンボ光線用 SVG (動的に line を 1 本ずつ append) -->
  <svg id="cg-fx-svg" class="cg-fx-svg" xmlns="http://www.w3.org/2000/svg"></svg>
</div>
```

### CSS 主要 keyframes

```css
/* cardgame/style.css 追記 */
.cg-fx-layer { position: fixed; inset: 0; pointer-events: none; z-index: 250; }
.cg-fx-cutin {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  animation: cgCutinShow 1.2s ease-out forwards;
}
.cg-fx-cutin-img {
  width: 70%; max-width: 480px;
  filter: drop-shadow(0 0 24px rgba(255, 213, 107, .9));
}
@keyframes cgCutinShow {
  0%   { opacity: 0; transform: scale(.4) rotate(-8deg); }
  20%  { opacity: 1; transform: scale(1.1) rotate(0deg); }
  85%  { opacity: 1; transform: scale(1.0); }
  100% { opacity: 0; transform: scale(1.05); }
}
.cg-fx-cutin-ribbon {
  position: absolute; inset: 40% 0 auto 0;
  height: 80px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255,213,107,.8) 30%,
    rgba(255,141,220,.9) 50%,
    rgba(124,93,255,.8) 70%,
    transparent 100%);
  animation: cgCutinRibbon 1.2s ease-out forwards;
}
@keyframes cgCutinRibbon {
  0%   { transform: translateX(-100%) skewX(-12deg); }
  60%  { transform: translateX(10%)   skewX(-12deg); }
  100% { transform: translateX(120%)  skewX(-12deg); opacity: 0; }
}

/* コンボ光線 SVG */
.cg-fx-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.cg-fx-combo-beam {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: cgComboBeam 1s ease-out forwards;
}
@keyframes cgComboBeam {
  0%   { stroke-dashoffset: 600; opacity: 1; }
  60%  { stroke-dashoffset: 0;   opacity: 1; }
  100% { stroke-dashoffset: 0;   opacity: 0; }
}

/* 派閥シナジー (lane 背景 glow) */
.cg-lane.cg-faction-glow::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(circle, var(--faction-color, rgba(124,93,255,.5)) 0%, transparent 70%);
  animation: cgFactionPulse 1.6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes cgFactionPulse {
  0%, 100% { opacity: .25; transform: scale(.95); }
  50%      { opacity: .55; transform: scale(1.05); }
}

/* 軽量モード — 全演出 半減 */
body.cg-fx-light .cg-fx-cutin { animation-duration: .5s; }
body.cg-fx-light .cg-fx-cutin-ribbon { display: none; }
body.cg-fx-light .cg-fx-combo-beam { animation-duration: .4s; }
body.cg-fx-light .cg-faction-glow::before { animation: none; opacity: .35; }

@media (prefers-reduced-motion: reduce) {
  .cg-fx-cutin { animation: none; opacity: 0; display: none; }
  .cg-fx-combo-beam { animation: none; opacity: .6; stroke-dashoffset: 0; }
  .cg-lane.cg-faction-glow::before { animation: none; }
}
```

## ロジック概要

```js
// cardgame/script.js 追記 (~3050 付近、 placeCard 演出隣)

const FACTION_COLOR_MAP = {
  '深緑樹海':   'rgba(76, 175, 80, .55)',
  '白焔教会':   'rgba(255, 138, 58, .55)',
  '銀霜王国':   'rgba(176, 224, 255, .55)',
  '海溝アクアシス': 'rgba(95, 223, 255, .55)',
  '黒月の祭壇': 'rgba(124, 93, 255, .55)',
  '雪月神殿':   'rgba(220, 200, 255, .55)',
  // 章追加で拡張 (新派閥 BLOCKER ルール 7-22 と同期)
};

function _fxCutin(cardData) {
  // LR 配置時のみ呼ばれる、 1.2s 待つ
  const layer = $('#cg-fx-cutin');
  layer.querySelector('.cg-fx-cutin-img').src = cardData.imgPath || '';
  layer.querySelector('.cg-fx-cutin-name').textContent = cardData.name;
  layer.hidden = false;
  setTimeout(() => { layer.hidden = true; }, 1200);
}

function _fxComboBeam(cardElA, cardElB) {
  // duo combo 発動時、 2 カード中心点を結ぶ光線を 1s 描画
  const svg = $('#cg-fx-svg');
  const a = cardElA.getBoundingClientRect();
  const b = cardElB.getBoundingClientRect();
  const ns = 'http://www.w3.org/2000/svg';
  const line = document.createElementNS(ns, 'line');
  line.setAttribute('x1', a.left + a.width/2);
  line.setAttribute('y1', a.top + a.height/2);
  line.setAttribute('x2', b.left + b.width/2);
  line.setAttribute('y2', b.top + b.height/2);
  line.setAttribute('stroke', 'url(#cgRainbow)');  // gradient defs を svg 内に持つ
  line.setAttribute('stroke-width', '4');
  line.setAttribute('class', 'cg-fx-combo-beam');
  svg.appendChild(line);
  setTimeout(() => svg.removeChild(line), 1000);
}

function _fxFactionGlow(laneIdx, faction) {
  // レーン要素に色付き pulse、 同派閥 3 枚以上集まった時に開始、 解除されたら remove
  const laneEl = $$(`.cg-lane[data-side="me"][data-lane="${laneIdx}"]`)[0];
  if (!laneEl) return;
  laneEl.style.setProperty('--faction-color', FACTION_COLOR_MAP[faction] || 'rgba(124,93,255,.5)');
  laneEl.classList.add('cg-faction-glow');
}
function _fxFactionGlowClear(laneIdx) {
  const laneEl = $$(`.cg-lane[data-side="me"][data-lane="${laneIdx}"]`)[0];
  if (laneEl) laneEl.classList.remove('cg-faction-glow');
}
```

### 既存実装との結合点

- **配置時呼出**: 既存 `placeCard()` 関数 (cardgame/script.js) に LR 判定追加。 tier==='LR' なら `_fxCutin(cardData)` を呼ぶ
- **コンボ判定後**: 既存 `_evalCombo()` または combo 発動 logging 箇所で、 ヒットした 2 カードの DOM 要素を引き当てて `_fxComboBeam()`
- **レーン再描画後**: 既存 `_renderLane(side, laneIdx)` の 末尾で `_countFactionInLane('me', laneIdx)` → 3 以上なら `_fxFactionGlow(laneIdx, faction)`、 そうでなければ `_fxFactionGlowClear(laneIdx)`
- **設定 UI**: 既存設定モーダルに 「演出: 標準 / 軽量」 セレクト追加、 切替で `document.body.classList.toggle('cg-fx-light', value === 'light')` + `_pcbSet('settings/effects', value)`

## 機械チェック (check_repo_rules.py に追加すべきルール)

- **WARNING**: `FACTION_COLOR_MAP` のキーが POOL の派閥全列を網羅しているか (新派閥追加時の漏れ防止、 既存ルール 7-22 と相補)
- **BLOCKER は不要**

## 実装 Phase

- **Phase 1** (実働 1-1.5h): カットイン (LR 配置時) + ribbon + svg レイヤ + cg-fx-light モード + reduced-motion 対応
- **Phase 2** (実働 1h): コンボ光線 (duo/trio 両方) + 派閥シナジー pulse + 設定 UI 連動
- **Phase 3** (実働 30min、 P-14 と統合): 演出に SE (cutin sound + combo chime) を 重ねる

## 要決定 (野沢さん確認待ち)

- **A. カットインの強さ**: 1.2s 全画面 ribbon 路線 OK か、 もう少し控えめ (左下スワイプ 0.6s) か
- **B. 派閥 glow の閾値**: 同レーン 3 枚以上 で良いか、 2 枚 + 同 chapter で発動か (combos.json と被らない閾値)
- **C. デフォルト設定**: 新規ユーザーは 標準 / 軽量 どちらか (モバイル安定性考慮で軽量デフォルトもアリ)
- **D. UR の演出は?**: LR だけがカットインか、 UR も 0.6s 軽カットインを入れるか (頻度多すぎだと冗長になる懸念)

## 関連 memory / 既存実装

- `feedback_keyboard_first_ui.md` / `feedback_responsive_shortcuts.md` — 演出は 操作ブロックしない (pointer-events: none)、 reduced-motion 自動吸収
- `feedback_account_first_persistence.md` — `effects` 設定は Firebase 保持
- 既存実装:
  - `cardgame/style.css` L1127-1134 (`placeCard` keyframe)
  - `cardgame/style.css` L846+ (`prefers-reduced-motion` 既存パターン、 これに追加)
  - `script.js` L2538 (`fx-godrays`)、 L2600+ (MIRACLE)、 L2965-2976 (cutin 既存実装、 構造参考)
  - `_legacy/gasshuku.js` L10 コメント (UR演出再利用方針、 PCB は別レイヤ動作で干渉しない)

## 5点セルフチェック (実装直前 明示宣言用)

1. Esc 閉じ — 演出中は何も入力可ではない (オーバーレイ pointer-events: none)、 強制閉じは不要
2. Tab フォーカストラップ — 不要 (focusable 要素なし)
3. ≥ 44×44 タップ — 不要 (操作なし、 設定モーダルの セレクトは別件で 44px 厳守)
4. `_setBodyModalOpen()` 使用 — 不要 (モーダルでない、 オーバーレイレイヤ)
5. 既存デザイン揃え — `cg-fx-` prefix 厳守、 アニメーションカーブは `placeCard` の `cubic-bezier(.34,1.56,.64,1)` ノリ + `auroraFlow` の柔らかさを継承、 色は `--cg-cyan` `--cg-pink` `--cg-purple` 既存変数使用
