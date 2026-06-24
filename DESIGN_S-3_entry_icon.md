# DESIGN: S-3 カードゲーム入口アイコン視認性向上

## 概要
- 目的: ホーム画面の `.home-cardgame-row` (本体 `index.html` L174-191) は 既に aurora グラデ + 静的 β バッジで存在感はあるが、 「新規ユーザーが PCB の存在に気づかない」 「タップして良い場所と気づかない」 という導線弱さが残る。 動的演出 (蛍光 / 浮遊 / 揺れ) で 一目で 「ここを押せ」 と分からせる。
- 規模感: **軽量** (CSS keyframes 追加 + JS で初回ホバー誘導 だけ、 実働 30-60min 想定)

## ユースケース 3-5個

| # | ユースケース | 主要操作 |
|---|---|---|
| ① | 初回 PCB 未プレイ ユーザーは アイコンが 浮遊 + 蛍光 で 「新発見」 を演出 | `home-cardgame-row.is-fresh` クラス 付与時に 強い演出、 1 戦終了後 自動で off |
| ② | 既プレイ ユーザーは 控えめな pulse のみ (邪魔にならない) | デフォルト軽演出、 hover 時のみ強化 |
| ③ | 「NEW!」 バッジ表示中は 全体に 微小揺れ (新規アップデート告知時) | 既存 `.home-cardgame-new` の隣に 揺れアニメ追加 |
| ④ | reduced-motion 設定の OS では 全演出 OFF (アクセシビリティ) | `@media (prefers-reduced-motion: reduce)` で animation: none |
| ⑤ | モバイルで タップしやすい高さ + 「▶」 矢印が 横スライド (タップ可示唆) | 既存 `.home-cardgame-row-arrow` の hover 時 translateX を 常時微小往復 |

## データ構造 (Firebase RTDB / JSON)

```jsonc
// 既存の /pcbData/$uid/stats を流用、 新規 schema 追加なし
// 「初回未プレイ」 判定: stats.totalMatches === 0 (or undefined)
// → home 側で `home-cardgame-row.is-fresh` クラス付与
```

※ 端末跨ぎで初回判定が継承されるべき (新 PC で「新発見」 演出が出るのは違和感) → 既存 stats 経由で問題なし。

## UI 設計

### 統合先

- `index.html` L174-191 の `.home-cardgame-row` 既存 DOM 流用、 `is-fresh` クラスを `script.js` 側で動的付与
- `style.css` L3387 隣に keyframes 3 つ + クラス追加 (40-60 行追記)

### 追記 CSS スケルトン

```css
/* style.css に追記、 既存 .home-cardgame-row ブロックの末尾 */

/* デフォルト pulse (常時、 控えめ) */
.home-cardgame-row {
  animation: cardgameRowPulse 4s ease-in-out infinite;
}
@keyframes cardgameRowPulse {
  0%, 100% { box-shadow: 0 2px 14px rgba(124,93,255,0.20), 0 1px 6px rgba(255,213,107,0.15); }
  50%      { box-shadow: 0 4px 22px rgba(124,93,255,0.35), 0 2px 10px rgba(255,213,107,0.30); }
}

/* 新規未プレイ ユーザー向け 強演出 (浮遊 + 蛍光) */
.home-cardgame-row.is-fresh {
  animation: cardgameRowPulse 4s ease-in-out infinite,
             cardgameRowFloat 3.2s ease-in-out infinite alternate;
}
.home-cardgame-row.is-fresh::after {
  content: ""; position: absolute; inset: -2px; border-radius: 20px;
  background: linear-gradient(45deg, #ffd56b, #ff8ddc, #5fdfff, #7c5dff, #ffd56b);
  background-size: 300% 300%;
  animation: cardgameRowFreshBorder 3.5s ease-in-out infinite;
  z-index: -1; filter: blur(8px); opacity: .65;
}
@keyframes cardgameRowFloat {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-3px); }
}
@keyframes cardgameRowFreshBorder {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* アイコン 揺れ (常時微小、 fresh 時 強化) */
.home-cardgame-row-icon {
  animation: cardgameIconBob 2.8s ease-in-out infinite;
}
.home-cardgame-row.is-fresh .home-cardgame-row-icon {
  animation: cardgameIconBob 2.0s ease-in-out infinite;
  filter: drop-shadow(0 0 18px rgba(255, 213, 107, 0.95));
}
@keyframes cardgameIconBob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-2px) rotate(-2deg); }
}

/* 矢印 横スライド誘導 */
.home-cardgame-row-arrow {
  animation: cardgameArrowNudge 2.5s ease-in-out infinite;
}
@keyframes cardgameArrowNudge {
  0%, 70%, 100% { transform: translateX(0); }
  85%           { transform: translateX(4px); }
}

/* reduced-motion 尊重 */
@media (prefers-reduced-motion: reduce) {
  .home-cardgame-row,
  .home-cardgame-row.is-fresh,
  .home-cardgame-row-icon,
  .home-cardgame-row-arrow {
    animation: none !important;
  }
  .home-cardgame-row.is-fresh::after { display: none; }
}
```

## ロジック概要

```js
// script.js の home 描画箇所 (要検索: 'home-cardgame-row' 表示判定)、
// 既存 totalMatches 取得後に追加

function _refreshCardgameRowFresh() {
  const row = document.getElementById('home-cardgame-row');
  if (!row) return;
  // PCB 未プレイ: pcbCloud.stats.totalMatches が 0 or undefined
  const stats = (window.pcbCloud && pcbCloud.stats) || {};
  const isFresh = !stats.totalMatches || stats.totalMatches === 0;
  row.classList.toggle('is-fresh', isFresh);
}

// 既存の home 描画 callback (account state 変化 / pcbCloudInit 完了時) で呼び出し
// 例: pcbCloudInit() の末尾、 _renderHomeStats() の隣
```

### 既存実装との結合点

- `script.js` 側 (本体): home 描画 hook 内で `_refreshCardgameRowFresh()` を 呼ぶ
- 本体と cardgame/script.js は別 instance だが、 `pcbCloud` は cardgame 内のみ → **本体側からは Firebase 直接読み (`cgFbDb.ref(\`pcbData/${uid}/stats\`).once('value')`) で `totalMatches` を 取得** が シンプル
- 既存 `home-cardgame-new` バッジ表示判定 (NEW! バッジ) は そのまま流用、 `is-fresh` とは独立

## 機械チェック (check_repo_rules.py に追加すべきルール)

- **WARNING**: `.home-cardgame-row` を style.css で grep し、 `prefers-reduced-motion` セクションで該当セレクタが必ず animation: none になっているか
- **不要** (運用ガード、 違反でも UX 劣化のみ)

## 実装 Phase

- **Phase 1** (実働 30min): CSS のみ追加 (常時 pulse + アイコン揺れ + 矢印 nudge + reduced-motion 対応)、 `is-fresh` 判定は 一旦保留 (HTML 側で常時 fresh 表示)
- **Phase 2** (実働 30min): `_refreshCardgameRowFresh()` 実装 + Firebase 経由で `totalMatches` 読み + 1 戦終了後 自動 off

## 要決定 (野沢さん確認待ち)

- **A. is-fresh の解除条件**: 1 戦終了 で off か、 3 戦経過 で off か (1 戦だと「お試しで終わった人」 にも off になる)
- **B. 演出の強さ**: 提案 (pulse + 浮遊 + 蛍光ボーダー) で 過剰でないか、 「派手すぎ」 なら 浮遊だけ + 蛍光ボーダー OFF に絞る
- **C. NEW! バッジ表示時の追加演出**: 大型アップデート時 (新章公開連動) に `is-fresh` を 強制 ON すべきか
- **D. モバイル での 揺れ強さ**: 提案では PC/モバイル 同等、 モバイルは少し控えめ ( 振幅半分) にすべきか

## 関連 memory / 既存実装

- `feedback_responsive_shortcuts.md` — reduced-motion 自動吸収必須
- `feedback_ui_consistency.md` — 既存 `.home-cardgame-row` のデザインを 壊さず追加 (cg- prefix ではなく home- prefix 既存に合わせる)
- 既存実装:
  - `index.html` L174-191 (DOM 既存)
  - `style.css` L3387-3490 (既存スタイル群、 ここに追加)
  - `cardgame/style.css` L2494 `cg-mode-badge-soon` (バッジ参考)
  - 既存 `auroraFlow` keyframe (style.css L122-) はトーン参考に

## 5点セルフチェック (実装直前 明示宣言用)

1. Esc 閉じ — 不要 (モーダル化なし、 row のみ)
2. Tab フォーカストラップ — 不要 (`<a>` 1 個、 既存タブ順維持)
3. ≥ 44×44 タップ — 既存 `padding: 22px 26px` で 確保済、 モバイル `padding: 16px 18px` も最低 60px 高さ満たす
4. `_setBodyModalOpen()` 使用 — 不要
5. 既存デザイン揃え — `home-cardgame-` prefix、 既存色変数 `rgba(124,93,255,...)` `rgba(255,213,107,...)` を そのまま継承、 既存 `auroraFlow` のスローテンポを踏襲
