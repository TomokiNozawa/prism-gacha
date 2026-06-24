# DESIGN: P-10 ミッション (デイリー / ウィークリー / イベント)

## 概要
- 目的: 既存の PCB ポイント (`pcbCloud.stats.pcbPoints`) は AI 勝利でしか溜まらず、 「今日 2 戦したけど何も貰えない」 という日が出る。 デイリー (1 日 1 set)・ ウィークリー (週 1 set)・ 章公開連動イベント の 3 階層ミッションを置き、 ポイント獲得経路を増やしてリテンションを上げる。
- 規模感: **中規模** (Firebase スキーマ + 進捗 hook 5-7 箇所 + UI モーダル、 実働 3-4h 想定)

## ユースケース 3-5個

| # | ユースケース | 主要操作 |
|---|---|---|
| ① | 朝開いて 「今日のミッション 3つ」 を 確認、 全部達成して +10pt | ホーム → 「ミッション」 タブ → 3 件表示 → 試合で進捗 → 自動 claim or タップで claim |
| ② | 週末まとめて 5 戦、 ウィークリー 「PvE Hard 3 勝」 完了 で +20pt | ウィークリーは 1 週間 (月曜 0:00 リセット) 持続、 トースト通知で完了告知 |
| ③ | S1C5 公開 と同時に 「黒月の祭壇 レーンで 1 勝」 イベントミッション +30pt | イベントは章公開タイミングで設定、 期限は次章公開まで |
| ④ | 未達ミッションを 「あと 1 勝」 で確認 進捗バー+残り時間表示 | ミッションカードに progress bar + 「リセットまで Xh」 |
| ⑤ | 通知を 切りたい (静かにプレイしたい) | 設定で 「ミッション通知 OFF」 で トースト + バッジ非表示、 ミッション機能自体は動く |

## データ構造 (Firebase RTDB / JSON)

```jsonc
// /pcbData/$uid/missions/  (アカウント保持)
{
  "daily": {
    "date": "2026-05-07",        // 日付が変わったら全 daily リセット
    "items": [
      {
        "id": "daily_play_1",
        "type": "play_count",
        "target": 1,
        "progress": 1,
        "claimed": true,
        "reward": 2,
        "claimedAt": 1714915200000
      },
      { "id": "daily_win_easy_2", "type": "win_count_diff", "diff": "easy", "target": 2, "progress": 1, "claimed": false, "reward": 3 },
      { "id": "daily_combo_1",    "type": "combo_trigger", "target": 1, "progress": 0, "claimed": false, "reward": 5 }
    ]
  },
  "weekly": {
    "weekStart": "2026-05-05",   // 月曜 (ISO week start) 基準
    "items": [
      { "id": "weekly_win_hard_3", "type": "win_count_diff", "diff": "hard", "target": 3, "progress": 1, "claimed": false, "reward": 20 },
      { "id": "weekly_play_10",    "type": "play_count", "target": 10, "progress": 4, "claimed": false, "reward": 15 }
    ]
  },
  "events": [
    {
      "id": "event_s1c5_blackmoon",
      "title": "黒月の祭壇で 1 勝",
      "type": "win_with_lane",
      "laneId": "moon_altar",
      "target": 1,
      "progress": 0,
      "claimed": false,
      "reward": 30,
      "expiresAt": 1717002000000   // 次章公開推定日時、 過ぎたら expired (claim 不可)
    }
  ],
  "notifyEnabled": true
}

// /pcbData/$uid/missionConfigVersion  → 1 (将来 mission 種類追加時に migration 用)
```

### ミッション type 種類 (進捗 hook 対応)

| type | 進捗を増やすイベント | 例 |
|---|---|---|
| `play_count` | 1 試合終了時 +1 | デイリー: 1 試合プレイ |
| `win_count` | 勝利時 +1 | ウィークリー: 5 勝 |
| `win_count_diff` | 指定 diff 勝利時 +1 | デイリー: Easy 2 勝 |
| `combo_trigger` | コンボ発動時 +1 | デイリー: コンボ 1 回発動 |
| `win_with_lane` | 指定レーンで 勝利時 +1 | イベント: 黒月の祭壇で 1 勝 |
| `win_with_faction` | 指定派閥 ≥3 を含むデッキで 勝利 | イベント: 銀霜王国 で 1 勝 |
| `win_bo3` | BO3 シリーズ勝利時 +1 | ウィークリー: BO3 1 勝 |

### ミッションテンプレ (script.js 側 const)

```js
const MISSION_TEMPLATES = {
  daily: [
    { id: 'daily_play_1',         type: 'play_count',     target: 1, reward: 2 },
    { id: 'daily_win_2',          type: 'win_count',      target: 2, reward: 3 },
    { id: 'daily_win_normal_1',   type: 'win_count_diff', target: 1, reward: 4, diff: 'normal' },
    { id: 'daily_combo_1',        type: 'combo_trigger',  target: 1, reward: 5 },
    // 4 件から 3 件をローテで daily にロール (固定でも OK、 シンプル運用)
  ],
  weekly: [
    { id: 'weekly_play_10',       type: 'play_count',     target: 10, reward: 15 },
    { id: 'weekly_win_hard_3',    type: 'win_count_diff', target: 3,  reward: 20, diff: 'hard' },
    { id: 'weekly_bo3_1',         type: 'win_bo3',        target: 1,  reward: 25 },
  ],
  events: {
    // 章 ID → イベントミッション配列 (章公開で active)
    s1c5: [{ id: 'event_s1c5_blackmoon', type: 'win_with_lane', laneId: 'moon_altar', target: 1, reward: 30, expiresInDays: 14 }],
    s1c6: [{ id: 'event_s1c6_promise',   type: 'win_with_faction', faction: '雪月神殿', target: 1, reward: 30, expiresInDays: 14 }],
  }
};
```

## UI 設計

### 統合先

- **ホーム** (`cardgame/index.html`): 既存 `cg-stats-row` 隣に 「ミッション」 ボタン追加 → タップでモーダル open
- **モーダル**: 新規 `#cg-mission-modal`、 既存 `cg-modal` パターン踏襲
- **試合終了直後**: 結果モーダルに 「ミッション +Xpt 達成!」 サマリ追記 (既存 `showMatchResultModal()` 拡張)

### HTML スケルトン

```html
<!-- cardgame/index.html、 tutorial-modal の隣 -->
<div id="cg-mission-modal" class="cg-modal" hidden>
  <div class="cg-modal-backdrop" onclick="closeMissions()"></div>
  <div class="cg-modal-card cg-mission-card">
    <button class="cg-modal-close" onclick="closeMissions()" aria-label="閉じる">×</button>
    <h2 class="cg-modal-title">🎯 ミッション</h2>

    <div class="cg-mission-tabs">
      <button class="cg-mission-tab active" data-tab="daily">デイリー</button>
      <button class="cg-mission-tab" data-tab="weekly">ウィークリー</button>
      <button class="cg-mission-tab" data-tab="event">イベント</button>
    </div>

    <div class="cg-mission-list" id="cg-mission-list">
      <!-- カード動的レンダ:
        <div class="cg-mission-item">
          <div class="cg-mission-icon">🎴</div>
          <div class="cg-mission-body">
            <div class="cg-mission-title">1 試合プレイ</div>
            <div class="cg-mission-progress-bar"><span style="width:100%"></span></div>
            <div class="cg-mission-progress-text">1 / 1</div>
          </div>
          <button class="cg-btn primary cg-mission-claim">+2pt 受取</button>
        </div>
      -->
    </div>

    <div class="cg-mission-footer">
      <span>リセットまで <b id="cg-mission-reset-timer">5h 23m</b></span>
      <label><input type="checkbox" id="cg-mission-notify" /> 完了通知</label>
    </div>
  </div>
</div>
```

### CSS (cardgame/style.css 追記、 cg-stat / cg-mode-btn パターン継承)

```css
.cg-mission-card { max-width: 560px; max-height: 80vh; overflow-y: auto; }
.cg-mission-tabs { display: flex; gap: 6px; margin: 12px 0; }
.cg-mission-tab {
  flex: 1; padding: 10px; font-size: 13px;
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px; color: rgba(255,255,255,.7); cursor: pointer;
}
.cg-mission-tab.active {
  background: rgba(95,223,255,.18); border-color: rgba(95,223,255,.5); color: #fff;
}
.cg-mission-item {
  display: flex; gap: 12px; align-items: center;
  padding: 12px; margin-bottom: 8px;
  background: rgba(255,255,255,.04); border-radius: 10px;
  border: 1px solid rgba(255,255,255,.08);
}
.cg-mission-item.completed { border-color: rgba(255,213,107,.5); background: rgba(255,213,107,.06); }
.cg-mission-progress-bar {
  height: 4px; background: rgba(255,255,255,.1); border-radius: 2px; margin: 6px 0 4px;
}
.cg-mission-progress-bar > span {
  display: block; height: 100%; background: linear-gradient(90deg, #5fdfff, #ff8ddc);
  border-radius: 2px; transition: width .3s ease;
}
```

## ロジック概要

```js
// cardgame/script.js 追記 (~2300 付近、 _logPcbMatch の隣)

// 試合結果ロギング 拡張
function _missionTickOnMatch(result, difficulty, isBO3, ctx) {
  // ctx = { laneIdsUsed, factionsCount, comboCount }
  if (!pcbCloud.missions) pcbCloud.missions = _initMissions();
  _missionRollIfNeeded();  // 日付/週変わってたらロール

  const all = [
    ...pcbCloud.missions.daily.items,
    ...pcbCloud.missions.weekly.items,
    ...(pcbCloud.missions.events || []).filter(e => e.expiresAt > Date.now()),
  ];
  let earned = 0;
  for (const m of all) {
    if (m.claimed) continue;
    if (m.type === 'play_count') m.progress += 1;
    else if (m.type === 'win_count' && result === 'win') m.progress += 1;
    else if (m.type === 'win_count_diff' && result === 'win' && difficulty === m.diff) m.progress += 1;
    else if (m.type === 'win_bo3' && result === 'win' && isBO3) m.progress += 1;
    else if (m.type === 'win_with_lane' && result === 'win' && ctx.laneIdsUsed?.includes(m.laneId)) m.progress += 1;
    else if (m.type === 'win_with_faction' && result === 'win' && ctx.factionsCount?.[m.faction] >= 3) m.progress += 1;
    if (m.progress >= m.target && !m.claimed) {
      // 自動 claim (デフォルト) — 設定で 手動 claim も検討、 まずは自動
      m.claimed = true; m.claimedAt = Date.now();
      earned += m.reward;
    }
  }
  if (earned > 0) {
    pcbCloud.stats.pcbPoints = (pcbCloud.stats.pcbPoints || 0) + earned;
    _pcbSet('stats', pcbCloud.stats);
    _showMissionToast(earned);  // 「ミッション達成 +Npt」 トースト 2.5s
  }
  _pcbSet('missions', pcbCloud.missions);
}

function _missionTickOnCombo() {
  // _evalCombo() ヒット時に呼ぶ
  if (!pcbCloud.missions) return;
  for (const m of pcbCloud.missions.daily.items) {
    if (m.claimed || m.type !== 'combo_trigger') continue;
    m.progress += 1;
    if (m.progress >= m.target) {
      m.claimed = true; m.claimedAt = Date.now();
      pcbCloud.stats.pcbPoints += m.reward;
      _showMissionToast(m.reward);
    }
  }
  _pcbSet('missions', pcbCloud.missions);
}

function _missionRollIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  const m = pcbCloud.missions;
  if (m.daily.date !== today) {
    m.daily.date = today;
    // 4 種から 3 種をシャッフルピック (シードは today で固定 → 端末跨ぎで同じ)
    m.daily.items = _pickN(MISSION_TEMPLATES.daily, 3, today).map(t => ({ ...t, progress: 0, claimed: false }));
  }
  const weekStart = _isoMonday(new Date()).toISOString().slice(0, 10);
  if (m.weekly.weekStart !== weekStart) {
    m.weekly.weekStart = weekStart;
    m.weekly.items = MISSION_TEMPLATES.weekly.map(t => ({ ...t, progress: 0, claimed: false }));
  }
}
```

### 既存実装との結合点

- `_logPcbMatch()` (script.js L2294) 末尾に `_missionTickOnMatch(matchResult, difficulty, isBO3, _buildMissionCtx())` 追加
- `_evalCombo()` ヒット箇所に `_missionTickOnCombo()` 追加
- 章公開時に events を inject (Phase 2、 まずは手動 admin ボタン or 起動時の章 ID 比較で自動)
- ホームの `_renderHomeStats()` 後に `_renderMissionBadge()` (未受取数 を 赤丸で表示)

## 機械チェック (check_repo_rules.py に追加すべきルール)

- **WARNING**: `MISSION_TEMPLATES.events.s1cN` に 該当章の lane_effects.json id 又は POOL 派閥 が 存在しているか整合チェック
- **WARNING**: `MISSION_TEMPLATES.weekly` の `target` 値 が 現実的か (例: `play_count` weekly target が 100 とかは 過剰)
- **BLOCKER は不要**

## 実装 Phase

- **Phase 1** (実働 1.5-2h): スキーマ + 進捗 hook (`_logPcbMatch` / `_evalCombo`) + ロール処理 + 自動 claim + ホームのバッジ + トースト
- **Phase 2** (実働 1h): モーダル UI (タブ + 進捗バー + リセットタイマー + 通知トグル)
- **Phase 3** (実働 30min-1h): イベントミッション (章公開連動)、 admin 画面で手動投入 or 起動時の自動投入

## 要決定 (野沢さん確認待ち)

- **A. 自動 claim か 手動 claim か**: 自動だと UI 簡単、 手動だと 「受取」 操作の達成感あり (ソシャゲ標準は手動)
- **B. デイリー件数**: 3 件 (テンプレ 4 種からロール) で OK か、 5 件にして毎日違うパッケージにするか
- **C. ウィークリー リセット曜日**: 月曜 0:00 で 良いか (ISO week 標準)、 日曜深夜の方が プレイ動線に合うか
- **D. リワード額の相場感**: 提案 (デイリー 2-5pt / ウィークリー 15-25pt / イベント 30pt) は ショップ価格との関係で 妥当か (現状 SHOP_ITEMS の最安/最高 を 別途確認)

## 関連 memory / 既存実装

- `feedback_account_first_persistence.md` — Firebase /pcbData/$uid/missions/ 保持
- `feedback_partial_exec_first.md` — 「全件/個別/グループ」 3 階層 → ミッションは 個別 claim + 「全部受取」 ボタン (Phase 2) で 兼ねる
- `feedback_user_first_design.md` — 上記ユースケース 5 件 で承認後着手
- 既存実装:
  - `cardgame/script.js` L2291 `PCB_POINTS_BY_DIFF`
  - `cardgame/script.js` L2294 `_logPcbMatch` (進捗 tick の hook 点)
  - `cardgame/script.js` L2107 `SHOP_ITEMS` (リワード 消費先)
  - `cardgame/script.js` L143 `pcbCloudInit` (起動時に missions ロード追加)

## 5点セルフチェック (実装直前 明示宣言用)

1. Esc 閉じ — `closeMissions()` を keydown capture で発火、 既存 `if (isOpen('cg-mission-modal'))` 分岐追加
2. Tab フォーカストラップ — `data-modal-trap` 付与
3. ≥ 44×44 タップ — `.cg-mission-tab` `.cg-mission-claim` `min-height: 48px`
4. `_setBodyModalOpen()` 使用 — open/close 双方
5. 既存デザイン揃え — `cg-mission-` prefix、 `--cg-cyan/--cg-pink` 既存変数、 `.cg-modal-card` の glass パターン継承
