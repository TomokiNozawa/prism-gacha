# DESIGN: P-3 チュートリアル拡張

## 概要
- 目的: 現状 4 ステップ簡易版の `tutorial-modal` を、 PCB の実戦レベル概念 (レーン効果 / 派閥シナジー / コンボ / マリガン / BO3 / 凸数) まで初心者が一周で掴める拡張チュートリアルに格上げする。 「ルールブックは情報量が多くて怖い、 でも今のチュートリアルは浅すぎ」 のギャップを埋める。
- 規模感: **中規模** (HTML/CSS は既存パターン流用、 章構造とプログレス記録のみ新規、 実働 2-3h 想定)

## ユースケース 3-5個

| # | ユースケース | 主要操作 |
|---|---|---|
| ① | 初回起動の 新規ユーザーが 一通り読んで PvE Easy に挑む | ホーム → 初回自動表示 → 6章順送り → 「PvE Easy へ」 ボタン |
| ② | レーン効果が判らずに負け続けたユーザーが 「レーン効果」 章だけ読み直す | tutorial 開く → サイドナビで 「レーン効果」 章タップ → その章だけ読む |
| ③ | コンボを発動して気づいた中級者が 「コンボ」 章で全 trio リスト を確認 | tutorial → 「コンボ」 章 → embed された combos.json サマリ閲覧 |
| ④ | BO3 オン直後に「マリガン何回?」 と疑問を持ち 該当章を即引く | 試合中ヘッダの ❓ → tutorial 「マリガン」 章 直接 jump |
| ⑤ | 既読/未読を 進捗 % で見える化、 残章だけ流したいユーザー | tutorial 開く → ヘッダに 「6 章中 4 読了」 表示 + 未読章マーカー |

## データ構造 (Firebase RTDB / JSON)

```jsonc
// /pcbData/$uid/tutorial/  (アカウント保持、 端末跨ぎ継続)
{
  "readChapters": {
    "basics":   { "readAt": 1714915200000 },
    "lane":     { "readAt": 1714915240000 },
    "faction":  null,    // 未読
    "combo":    null,
    "mulligan": null,
    "bo3":      null,
    "ascend":   null
  },
  "lastOpenedChapter": "lane",
  "completed": false,    // 全章既読時 true、 home の ❓ バッジ消す
  "version": 1            // チュートリアル本文の世代、 大幅改稿時 ++ で全章 unread 扱い
}
```

※ memory `feedback_account_first_persistence.md` 準拠、 Firebase 主・ localStorage は読み取り専用キャッシュのみ。

### 章定義 (script.js 側 const)

```js
const TUTORIAL_CHAPTERS = [
  { id: 'basics',   title: '基本ルール',     icon: '🎴', steps: 4 }, // 既存4ステップを基本章に格納
  { id: 'lane',     title: 'レーン効果',     icon: '🏛', steps: 3 }, // 玉座/海溝/学院 等の例示
  { id: 'faction',  title: '派閥シナジー',   icon: '🌳', steps: 2 }, // 同派閥カード集積で発動
  { id: 'combo',    title: 'カードコンボ',   icon: '✨', steps: 3 }, // duo/trio + same_lane 条件
  { id: 'mulligan', title: 'マリガン',       icon: '🔄', steps: 2 }, // 初手交換タイミング
  { id: 'bo3',      title: 'BO3 モード',     icon: '🏆', steps: 2 }, // 2先勝、 +5pt ボーナス
  { id: 'ascend',   title: '凸数とパワー',   icon: '⚡', steps: 2 }, // 5凸でカード強化
];
```

## UI 設計

統合先: `cardgame/index.html` の既存 `#tutorial-modal` を置き換え (HTML 全書換、 30行 → 約 60行)。 ホームの ❓ ボタンと、 試合画面ヘッダ (将来) からも開ける。

```html
<div id="tutorial-modal" class="cg-modal" hidden>
  <div class="cg-modal-backdrop" onclick="closeTutorial()"></div>
  <div class="cg-modal-card cg-tut-card">
    <button class="cg-modal-close" onclick="closeTutorial()" aria-label="閉じる">×</button>
    <header class="cg-tut-header">
      <h2 class="cg-modal-title">📘 チュートリアル</h2>
      <div class="cg-tut-progress">
        <span id="cg-tut-progress-text">0 / 7 章</span>
        <div class="cg-tut-progress-bar"><span id="cg-tut-progress-fill"></span></div>
      </div>
    </header>
    <nav class="cg-tut-nav" id="cg-tut-nav"><!-- 章タブ (icon + title + 既読✓) --></nav>
    <div class="cg-tut-body" id="cg-tut-body"><!-- 現在章の steps レンダ --></div>
    <footer class="cg-tut-footer">
      <button class="cg-btn ghost" id="cg-tut-prev">← 前章</button>
      <span class="cg-tut-step-indicator">2 / 4</span>
      <button class="cg-btn primary" id="cg-tut-next">次章 →</button>
    </footer>
  </div>
</div>
```

### CSS (cardgame/style.css 追記、 既存 `.cg-tut-step` パターンを継承)

- `.cg-tut-card`: max-width: 720px、 max-height: 85vh、 既存 `.cg-modal-card` 拡張
- `.cg-tut-nav`: 横スクロール tab (モバイル) / グリッド (PC、 ≥720px)、 各タブに 既読✓ バッジ
- `.cg-tut-progress-bar`: width 100%, height 4px、 fill は --cg-cyan グラデ
- 既存 `.cg-tut-step` をそのまま再利用 (互換性維持)

## ロジック概要

```js
// script.js 追加 (~3000-3050 行付近、 既存 openTutorial 隣)

let _tutState = { currentChapter: 'basics', currentStep: 0 };

function openTutorial(opts = {}) {
  const startCh = opts.chapter || pcbCloud.tutorial?.lastOpenedChapter || 'basics';
  _tutState = { currentChapter: startCh, currentStep: 0 };
  $('#tutorial-modal').hidden = false;
  _renderTutNav();
  _renderTutBody();
  _setBodyModalOpen();
}

function _renderTutNav() {
  const tut = pcbCloud.tutorial || { readChapters: {} };
  const html = TUTORIAL_CHAPTERS.map(ch => {
    const read = tut.readChapters?.[ch.id];
    const active = ch.id === _tutState.currentChapter;
    return `<button class="cg-tut-tab ${active?'active':''} ${read?'read':''}"
              onclick="_jumpToTutChapter('${ch.id}')">
              ${ch.icon} ${ch.title}${read ? '<span class="cg-tut-read-mark">✓</span>' : ''}
            </button>`;
  }).join('');
  $('#cg-tut-nav').innerHTML = html;
  // progress 更新
  const readCount = TUTORIAL_CHAPTERS.filter(c => tut.readChapters?.[c.id]).length;
  $('#cg-tut-progress-text').textContent = `${readCount} / ${TUTORIAL_CHAPTERS.length} 章`;
  $('#cg-tut-progress-fill').style.width = `${(readCount / TUTORIAL_CHAPTERS.length) * 100}%`;
}

function _renderTutBody() {
  // chapter id → steps をレンダリング
  // 各 step は { title, body, illust? } の小データ構造、 章ごとに別関数で文を組み立て
  const ch = TUTORIAL_CHAPTERS.find(c => c.id === _tutState.currentChapter);
  const steps = TUT_CONTENT[_tutState.currentChapter];  // 別 const に本文格納
  $('#cg-tut-body').innerHTML = steps.map((s, i) =>
    `<div class="cg-tut-step ${i === _tutState.currentStep ? 'active' : ''}">
       <span class="cg-tut-no">${i+1}</span>
       <div><b>${s.title}</b><br><span class="cg-tut-sub">${s.body}</span></div>
     </div>`).join('');
}

function _jumpToTutChapter(chId) {
  _markChapterRead(_tutState.currentChapter);  // 離脱前に既読 mark
  _tutState = { currentChapter: chId, currentStep: 0 };
  _renderTutNav();
  _renderTutBody();
}

function _markChapterRead(chId) {
  pcbCloud.tutorial = pcbCloud.tutorial || { readChapters: {}, version: 1 };
  pcbCloud.tutorial.readChapters[chId] = { readAt: Date.now() };
  pcbCloud.tutorial.lastOpenedChapter = chId;
  _pcbSet('tutorial', pcbCloud.tutorial);
}

function closeTutorial() {
  _markChapterRead(_tutState.currentChapter);
  $('#tutorial-modal').hidden = true;
  _setBodyModalOpen();
  // 全章既読なら home の ❓ バッジ更新
  _refreshTutorialBadge();
}
```

### 既存実装との結合点

- **ホーム ❓ ボタン**: 既存 `#btn-tutorial` の click handler はそのまま、 引数なしで `openTutorial()` を呼ぶ
- **未読バッジ**: home に新規 `<span id="home-tutorial-badge">未読 ${n}</span>`、 `_refreshTutorialBadge()` で表示制御
- **試合画面からの起動 (Phase 2)**: 既存 `#btn-help-in-match` を用意し `openTutorial({ chapter: 'lane' })` 等で 該当章直接 jump
- **初回自動表示**: `pcbCloudInit()` 完了後、 `pcbCloud.tutorial?.completed !== true` かつ `pcbCloud.stats?.totalMatches === 0` (または 1 試合目終了時) なら 自動で `openTutorial({ chapter: 'basics' })`

## 機械チェック (check_repo_rules.py に追加すべきルール)

- **WARNING**: `TUTORIAL_CHAPTERS` の `id` 列が `TUT_CONTENT` のキー全列を網羅しているか (片方追加し忘れ防止)
- **WARNING**: `TUTORIAL_CHAPTERS[].steps` 数値と `TUT_CONTENT[id].length` が一致しているか
- **BLOCKER は不要** (運用ガード、 違反でもアプリ動作)

## 実装 Phase

- **Phase 1** (実働 1-1.5h): HTML/CSS 置換 + `TUTORIAL_CHAPTERS` + `TUT_CONTENT` 7 章本文 + ナビ/プログレス + Firebase 同期 + 既存ボタン繋ぎ
- **Phase 2** (実働 30-60min): 初回自動表示 + 未読バッジ + 試合画面からの直接 jump
- **Phase 3** (Phase 1 と分離): combos.json/lane_effects.json から動的に章本文を生成 (現在は静的本文、 章追加時に手で更新でも実害は小さい)

## 要決定 (野沢さん確認待ち)

- **A. 初回自動表示はオン?**: 「PCB 初回起動」 (totalMatches===0 + tutorial.readChapters 全空) で自動 open するか、 控えめに ❓ ボタン点滅だけにするか
- **B. 章順序**: 提案順 (basics → lane → faction → combo → mulligan → bo3 → ascend) でよいか、 もしくは bo3/ascend は最後に分離 (応用編タブ) すべきか
- **C. 試合中の help 起動**: 試合画面ヘッダに ❓ ボタンを追加するか (Phase 2 範囲)、 試合中はチュートリアル禁止か
- **D. 「コンボ」 章で全 combo を embed するか**: combos.json は 200+ エントリあるので、 章本文では 5 例だけ + 「全 combo はルールブックへ」 でリンクするのが現実的か

## 関連 memory / 既存実装

- `feedback_account_first_persistence.md` — Firebase 主・ localStorage 単独禁止
- `feedback_user_first_design.md` — ユースケース先行提示 + 「全件/個別/グループ」 3 階層 (本件は章単位 jump で 個別+全件 を兼ねる)
- `feedback_keyboard_first_ui.md` / `feedback_responsive_shortcuts.md` — Esc閉じ・Tab/Shift+Tabナビ・モバイル44px必須
- `feedback_modal_background_lock.md` — `body.modal-open` + MutationObserver、 `_setBodyModalOpen()` を 開閉双方で呼ぶ
- `feedback_modal_design.md` — sticky header + footer (Phase 1 で footer は ボタン3つ固定行)
- 既存実装: `cardgame/index.html` L483-522 (現 tutorial-modal)、 `cardgame/script.js` L3035-3036 (open/close)、 `#btn-tutorial` (L3206)、 `#rulebook-modal` (構造参考)

## 5点セルフチェック (実装直前 明示宣言用)

実装着手時に明示出力する 5 点:
1. Esc 閉じ — 既存 `closeTutorial` を `keydown` capture で発火 (L3291 既存処理に同居)
2. Tab フォーカストラップ — モーダルに `data-modal-trap` 付与 (既存共通 trap 適用)
3. ≥ 44×44px タップ領域 — `.cg-tut-tab` / `.cg-tut-step` に `min-height: 48px`
4. `_setBodyModalOpen()` 使用 — open/close 双方で呼ぶ (L3035-3036 既存パターン踏襲)
5. 既存デザイン揃え — `.cg-tut-step` 既存スタイル + `.cg-modal-card` の border/glass 効果踏襲、 `cg-` prefix 厳守
