/* ============================================================
   Prismaera Cards — Phase 1 ロジック (v0.2)
   - 6ターン × 3レーン × 4枠、 vs AI (Easy / Normal)
   - onPlay 効果 6種 + 派閥シナジー + ストーリーコンボ + レーン効果 + 凸数強化
   - 配置取消 (個別カードクリック) + コンボ確認ボタン + リザルト後 場確認
   ============================================================ */
"use strict";

// ===== State =====
const state = {
  cards: [],
  combos: [],
  laneEffectsAll: [],
  difficulty: 'easy',
  turn: 1,
  maxTurn: 6,
  cost: 1,
  costUsed: 0,
  hand: [],
  deck: [],
  oppHand: [],
  oppDeck: [],
  board: { me: [[], [], []], opp: [[], [], []] },
  laneEffects: [null, null, null],
  selectedCardIdx: -1,
  busy: false,
  scoreMe: 0,
  scoreOpp: 0,
  ended: false,
  thisTurnPlacements: [],
  // Phase 1+ 拡張
  mulliganAvailable: false,           // ターン1 で1回のみ使用可
  firstMover: 'me',                   // 'me' | 'opp' (先行/後攻)
  thisTurnAiDone: false,              // 後攻時、 ターン頭の AI 配置を済ませたか
  series: { isBO3: false, wins: { me: 0, opp: 0 }, matchNo: 1, results: [] },
};

// ===== 公開済章 判定 (本体 STORY_OUTLINE と同期、 リリース時刻自動切替) =====
const CHAPTER_RELEASE = {
  's1c1': 0,  // 既公開
  's1c2': 0,
  's1c3': 0,
  's1c4': 0,
  's1c5': new Date('2026-05-06T12:00:00+09:00').getTime(),
  's1c6': new Date('2026-05-10T12:00:00+09:00').getTime(),  // s1c6 公開 (既存負債、 cardgame gating追加)
  's1c7': new Date('2026-05-18T00:00:00+09:00').getTime(),  // s1c7 scheduledRelease (= version.json と同期)
};
function isChapterReleased(ch) {
  if (!ch || !CHAPTER_RELEASE.hasOwnProperty(ch)) return true;
  // dev preview (dev.prismaera.pages.dev) では releaseDate を bypass、 全章キャラ + コンボ + レーン効果 解放
  // 野沢さん要望 2026-05-06: dev で実物見ながら s1c5 PCB のフィードバックを送れるように
  if (typeof location !== 'undefined' && location.hostname &&
      (location.hostname.startsWith('dev.') || location.hostname === 'localhost' ||
       location.hostname === '127.0.0.1')) {
    return true;
  }
  return Date.now() >= CHAPTER_RELEASE[ch];
}

// ===== 派閥カラー マッピング =====
// 派閥カラー (CHAR_FACTION 公式 19派閥に揃え)
const FACTION_COLORS = {
  '原虹':              '#ff8ddc',  // genso (観測者三柱)
  '十国の覇者':        '#ffb84a',  // rulers
  '白焔教会':          '#ffd56b',  // church
  '紫竜王国':          '#a06eff',  // dragon
  '紅翼皇家':          '#ff8a3a',  // redwing
  '夜焔郷':            '#d83a4a',  // yakai
  '月牙狼族':          '#a3a3a3',  // wolf
  '深緑樹海':          '#7aff8a',  // forest
  '銀霜王国':          '#c8d4ff',  // silver
  '黒曜塔':            '#5a5a8a',  // tower
  '第七天':            '#ff5050',  // seventh
  '星霊学院':          '#7a9bff',  // academy
  '海淵都市アクアシス': '#5fdfff',  // aquasis (PoC では「アクアシス」 短縮)
  'アクアシス':        '#5fdfff',  // alias
  '紅玉海賊団':        '#ff6b6b',  // crimson
  '古龍砂漠サハール':   '#e8c980',  // sahar
  '氷霊王国ニーヴル':   '#a8e8ff',  // niiruru
  '空挺城ゼノニア':     '#c8a878',  // zenonia
  '黒月衆ノクトス':     '#5a3070',  // darkmoon
  '地底市リオラ':       '#9a78c8',  // liora
};
function factionColor(f) { return FACTION_COLORS[f] || '#aaa'; }

// ============================================================
// Firebase Cloud Sync (PCB データを アカウント依存化、 野沢さん指示 2026-05-06
// 「PCBでアカウント依存で良いものは1つもありません」)
// 全 PCB データ (stats / decks / activeSlot / history / paused / bo3Toggle / bgmMute)
// を Firebase RTDB の pcbData/{uid}/ に保存。 localStorage は migration + offline fallback のみ。
// ============================================================
const PCB_FB_CONFIG = {
  apiKey: "AIzaSyBFSjOheMb_epwOXCjviAA_FLQFPNiED6g",
  authDomain: "task-board-fbf1e.firebaseapp.com",
  databaseURL: "https://task-board-fbf1e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "task-board-fbf1e",
  storageBucket: "task-board-fbf1e.firebasestorage.app",
  messagingSenderId: "174442724697",
  appId: "1:174442724697:web:06ac83b275780717c06048"
};
let cgFbApp = null, cgFbAuth = null, cgFbDb = null, cgUid = null;
const pcbCloud = {
  loaded: false,
  stats: {},
  decks: {},          // { 1: [ids], 2: [ids], 3: [ids] }
  activeSlot: 1,
  history: [],
  paused: null,
  bo3Toggle: false,
  bgmMute: false,
};

function pcbInitFirebase() {
  try {
    if (typeof firebase === 'undefined') return;
    // 本体 (script.js) と同じ instance 名 'prism-gacha' を 使用、 同 origin で
    // Firebase Auth state を共有 (indexedDB persistence は apiKey 単位だが 念のため統一)
    cgFbApp = firebase.initializeApp(PCB_FB_CONFIG, 'prism-gacha');
    cgFbAuth = cgFbApp.auth();
    cgFbDb = cgFbApp.database();
    cgFbAuth.onAuthStateChanged(user => {
      cgUid = user ? user.uid : null;
      if (cgUid) {
        pcbCloudInit();
      } else {
        pcbCloud.loaded = false;
      }
      _refreshAccountGate();
    });
  } catch (e) { console.warn('PCB Firebase init failed:', e); }
}

async function _pcbGet(path) {
  if (!cgUid || !cgFbDb) return null;
  try {
    const snap = await cgFbDb.ref(`pcbData/${cgUid}/${path}`).once('value');
    return snap.val();
  } catch (e) { return null; }
}
function _pcbSet(path, value) {
  if (!cgUid || !cgFbDb) return;
  try { cgFbDb.ref(`pcbData/${cgUid}/${path}`).set(value); } catch (e) {}
}

async function pcbCloudInit() {
  // Cloud から全データロード
  const [stats, decks, activeSlot, history, paused, bo3Toggle, bgmMute, shopData] = await Promise.all([
    _pcbGet('stats'), _pcbGet('decks'), _pcbGet('activeSlot'),
    _pcbGet('history'), _pcbGet('paused'), _pcbGet('bo3Toggle'), _pcbGet('bgmMute'),
    _pcbGet('shopData'),
  ]);
  pcbCloud.stats      = stats || {};
  pcbCloud.decks      = decks || {};
  pcbCloud.activeSlot = activeSlot || 1;
  pcbCloud.history    = Array.isArray(history) ? history : [];
  pcbCloud.paused     = paused || null;
  pcbCloud.bo3Toggle  = bo3Toggle === true;
  pcbCloud.bgmMute    = bgmMute === true;
  pcbCloud.shopData   = shopData || { owned: {}, equipped: { mat: null, costumes: {} } };
  pcbCloud.loaded     = true;
  // 衣装+マットを 起動時に適用
  if (typeof _applyShopEquips === 'function') {
    _loadShopItems().then(() => _applyShopEquips());
  }
  // localStorage の既存データ migration (Cloud が空 + localStorage に既存データ → Cloud に移行)
  pcbMigrateFromLocalStorage();
  // UI 再描画
  if (cgBgm) cgBgm.muted = pcbCloud.bgmMute;
  updateMuteUI();
  if (typeof _renderHomeStats === 'function') _renderHomeStats();
  if (typeof _renderHomeStreaks === 'function') _renderHomeStreaks();
  if (typeof _renderHomeDeckPreview === 'function') _renderHomeDeckPreview();
  // BO3 toggle UI
  const bo3El = document.getElementById('bo3-toggle');
  if (bo3El) bo3El.checked = pcbCloud.bo3Toggle;
}

function pcbMigrateFromLocalStorage() {
  try {
    // stats
    const lsStatsRaw = localStorage.getItem('prism-pcb-stats');
    if (lsStatsRaw && !pcbCloud.stats.totalMatches) {
      const lsStats = JSON.parse(lsStatsRaw);
      if (lsStats && lsStats.totalMatches) {
        pcbCloud.stats = lsStats;
        _pcbSet('stats', lsStats);
      }
    }
    // history
    const lsHistRaw = localStorage.getItem('prism-pcb-history');
    if (lsHistRaw && pcbCloud.history.length === 0) {
      const lsHist = JSON.parse(lsHistRaw);
      if (Array.isArray(lsHist) && lsHist.length) {
        pcbCloud.history = lsHist;
        _pcbSet('history', lsHist);
      }
    }
    // decks (3 slots)
    for (const n of [1, 2, 3]) {
      if (pcbCloud.decks[n]) continue;
      const raw = localStorage.getItem(`cg_deck_v2_slot${n}`);
      if (raw) {
        try {
          const ids = JSON.parse(raw);
          if (Array.isArray(ids)) {
            pcbCloud.decks[n] = ids;
            _pcbSet(`decks/${n}`, ids);
          }
        } catch (e) {}
      }
    }
    // activeSlot
    const lsActive = parseInt(localStorage.getItem('cg_deck_active_slot') || '1', 10);
    if (lsActive >= 1 && lsActive <= 3 && pcbCloud.activeSlot === 1 && lsActive !== 1) {
      pcbCloud.activeSlot = lsActive;
      _pcbSet('activeSlot', lsActive);
    }
    // paused
    const lsPaused = localStorage.getItem('prism-pcb-paused');
    if (lsPaused && !pcbCloud.paused) {
      try { pcbCloud.paused = JSON.parse(lsPaused); _pcbSet('paused', pcbCloud.paused); } catch (e) {}
    }
    // bo3 toggle (旧 lsKey 'cg_bo3' or 'cg_bo3_mode')
    const lsBo3 = localStorage.getItem('cg_bo3') || localStorage.getItem('cg_bo3_mode');
    if (lsBo3 === '1' && !pcbCloud.bo3Toggle) {
      pcbCloud.bo3Toggle = true;
      _pcbSet('bo3Toggle', true);
    }
    // bgmMute
    const lsMute = localStorage.getItem('cg_bgm_muted');
    if (lsMute === '1' && !pcbCloud.bgmMute) {
      pcbCloud.bgmMute = true;
      _pcbSet('bgmMute', true);
    }
  } catch (e) {}
}

// アカウント未ログイン時のゲート (PCB はアカウント登録者限定 — 野沢さん方針)
function _refreshAccountGate() {
  const screen = document.getElementById('home-screen');
  if (!screen) return;
  // ログイン済みなら gate 表示なし、 未ログインなら 警告 + ボタン無効化
  let gate = document.getElementById('cg-account-gate');
  if (cgUid) {
    if (gate) gate.hidden = true;
    screen.querySelectorAll('.cg-mode-btn').forEach(b => b.disabled = false);
    return;
  }
  if (!gate) {
    gate = document.createElement('div');
    gate.id = 'cg-account-gate';
    gate.className = 'cg-account-gate';
    gate.innerHTML = `
      <div class="cg-gate-icon">🔒</div>
      <div class="cg-gate-title">アカウント登録が必要です</div>
      <div class="cg-gate-sub">PCB の戦績・デッキ編成は アカウント に紐づいて保存されます。<br>本体 (Prismaera) でアカウント登録 (nickname + 合言葉) してから プレイしてください。</div>
      <a class="cg-gate-link" href="/">← 本体に戻ってログイン</a>
    `;
    screen.insertBefore(gate, screen.firstChild);
  }
  gate.hidden = false;
  screen.querySelectorAll('.cg-mode-btn').forEach(b => b.disabled = true);
}

// ===== BGM (1曲ループ、 ミュート Cloud 保存) =====
const BGM_URL = '/media/audio/bgm/prism-cards.mp3';
let cgBgm = null;

// スマホ電池対策: タブ非アクティブ時に BGM 停止 (visibilitychange)
function _initVisibilityHandler() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (cgBgm && !cgBgm.paused) cgBgm.pause();
    } else {
      if (cgBgm && cgBgm.paused && !cgBgm.muted) cgBgm.play().catch(() => {});
    }
  });
}

function initBgm() {
  cgBgm = new Audio(BGM_URL);
  cgBgm.loop = true;
  cgBgm.volume = 0.4;
  cgBgm.preload = 'auto';
  // 初回 load エラーは握り潰す (BGM ファイル未配備時のフォールバック)
  cgBgm.addEventListener('error', () => { /* BGM ファイル無し時の silent fail */ });
  // mute 初期値: pcbCloud (ロード済なら) → デフォルト false
  cgBgm.muted = pcbCloud.loaded ? pcbCloud.bgmMute : false;
  updateMuteUI();
  // ブラウザ自動再生規制対策: 最初のユーザー interact で play 試行
  const tryPlay = () => {
    if (cgBgm && cgBgm.paused) {
      cgBgm.play().catch(() => { /* user gesture 必要 or ファイル無し */ });
    }
  };
  document.addEventListener('click', tryPlay, { once: true });
  document.addEventListener('keydown', tryPlay, { once: true });
  document.addEventListener('touchstart', tryPlay, { once: true });
}

function toggleBgmMute() {
  if (!cgBgm) return;
  cgBgm.muted = !cgBgm.muted;
  pcbCloud.bgmMute = cgBgm.muted;
  _pcbSet('bgmMute', cgBgm.muted);
  updateMuteUI();
  if (!cgBgm.muted && cgBgm.paused) {
    cgBgm.play().catch(() => {});
  }
}

function updateMuteUI() {
  const btn = document.getElementById('btn-cg-mute');
  if (!btn || !cgBgm) return;
  if (cgBgm.muted) {
    btn.textContent = '🔇';
    btn.title = 'BGM ミュート中 (タップで ON)';
    btn.classList.add('muted');
  } else {
    btn.textContent = '🔊';
    btn.title = 'BGM 再生中 (タップでミュート)';
    btn.classList.remove('muted');
  }
}

// ===== Master データロード (公開済章のみ filter、 cards.json + pool.json + effects_override.json 統合) =====
// P-6: pool.json は本体 POOL から自動生成 (scripts/export_pool_for_cardgame.py)
// B-1: effects_override.json で効果データを 90キャラ全件カスタム
// 優先順位: cards.json (手書き完全override) > effects_override.json (effect+effectText のみ) > pool.json (default)
async function loadMasters() {
  const [c, k, l, p, eo] = await Promise.all([
    fetch('./cards.json?v=1.7.0f').then(r => r.json()),
    fetch('./combos.json?v=1.7.0f').then(r => r.json()),
    fetch('./lane_effects.json?v=1.7.0f').then(r => r.json()),
    fetch('./data/pool.json?v=1.7.0f').then(r => r.json()).catch(() => []),
    fetch('./effects_override.json?v=1.7.0f').then(r => r.json()).catch(() => ({})),
  ]);
  // pool 全カード ← effects_override で effect/effectText を上書き ← cards.json で完全 override
  const cardsByName = new Map();
  p.forEach(card => {
    const merged = { ...card };
    const ov = eo[card.name];
    if (ov) {
      merged.effect = ov.effect;
      merged.effectText = ov.effectText;
    }
    cardsByName.set(card.name, merged);
  });
  c.forEach(card => {
    // shallow merge: cards.json は指定フィールドのみ上書き (effect 未指定なら effects_override が残る)
    const existing = cardsByName.get(card.name) || {};
    cardsByName.set(card.name, { ...existing, ...card });
  });
  state.allCards = Array.from(cardsByName.values()).filter(card => isChapterReleased(card.chapter));
  // 後方互換: state.cards は state.allCards のフルセット (デフォルトデッキ用、 デッキ編集で絞られる時もある)
  state.cards = state.allCards;
  state.laneEffectsAll = l.filter(e => isChapterReleased(e.chapter));
  const cardNames = new Set(state.allCards.map(card => card.name));
  state.combos = k.filter(combo => combo.chars.every(name => cardNames.has(name)));
  // ユーザー所持・凸数を反映 (本体 prism-gacha localStorage)
  applyUserDupes();
}

// ===== P-5: デッキ管理 (3スロット、 Firebase Cloud 永続化、 12枚) =====
const DECK_SIZE = 12;
const DECK_SLOT_COUNT = 3;
// 本体 Prismaera の MAX_DUPS と同期 (script.js 692)
const MAX_DUPS = { R: 1, SR: 2, SSR: 3, UR: 4, LR: 4 };
// 野沢さん指示 2026-05-05: LR/UR デッキ枚数制限 (高 tier 偏重を防ぐ)
const TIER_LIMIT = { LR: 1, UR: 3 };

function _tierLimit(tier) { return TIER_LIMIT[tier]; }
function _countByTier(deckIds, targetTier) {
  let n = 0;
  for (const id of deckIds) {
    const c = state.allCards.find(x => x.id === id);
    if (c && c.tier === targetTier) n++;
  }
  return n;
}

function getActiveSlot() {
  const v = pcbCloud.activeSlot || 1;
  return v >= 1 && v <= DECK_SLOT_COUNT ? v : 1;
}
function setActiveSlot(n) {
  if (n >= 1 && n <= DECK_SLOT_COUNT) {
    pcbCloud.activeSlot = n;
    _pcbSet('activeSlot', n);
  }
}
function loadDeckSlot(n) {
  const ids = pcbCloud.decks ? pcbCloud.decks[n] : null;
  return Array.isArray(ids) ? ids : null;
}
function saveDeckSlot(n, ids) {
  if (!pcbCloud.decks) pcbCloud.decks = {};
  pcbCloud.decks[n] = ids;
  _pcbSet(`decks/${n}`, ids);
}

// 現在使用するデッキ (= active slot)
function getCurrentDeck() {
  const ids = loadDeckSlot(getActiveSlot());
  if (ids && ids.length === DECK_SIZE) {
    const byId = new Map(state.allCards.map(c => [c.id, c]));
    const cards = ids.map(id => byId.get(id)).filter(Boolean);
    if (cards.length === DECK_SIZE) return cards;
  }
  // フォールバック: cards.json (手書き 12 枚)
  const defaultIds = ['lr_1_prisma','ur_1_seraph','ur_2_kaguya','ssr_1_linae','ssr_2_chanty','ssr_3_glaciel','sr_1_lumina','sr_2_tsuki','sr_3_coralia','r_1_chisato','r_2_kai','r_3_viola'];
  return defaultIds.map(id => state.allCards.find(c => c.id === id)).filter(Boolean).slice(0, DECK_SIZE);
}

// ===== 凸数: 本体 Prismaera の dupCounts を反映 =====
function getUserDupCounts() {
  try {
    const raw = JSON.parse(localStorage.getItem('prism-gacha') || '{}');
    return raw.dupCounts || {};
  } catch (e) { return {}; }
}
function getUserOwnedSet() {
  try {
    const raw = JSON.parse(localStorage.getItem('prism-gacha') || '{}');
    return raw.unlockedSet || {};
  } catch (e) { return {}; }
}

// 本体の dupCounts から allCards の dupes を上書き、 所持判定も付与
function applyUserDupes() {
  const dc = getUserDupCounts();
  const owned = getUserOwnedSet();
  state.allCards.forEach(c => {
    const key = `${c.tier}_${c.name}`;
    if (key in dc) {
      c.dupes = dc[key];
      c._owned = true;
    } else if (owned[key]) {
      c.dupes = 0;
      c._owned = true;
    } else {
      c.dupes = 0;
      c._owned = false;
    }
    c._maxDupes = MAX_DUPS[c.tier] || 0;
  });
}

// ===== 凸数 効果影響 (DESIGN 4.3 簡易実装) =====
// 凸 = 半分以上 → 数値 +1
// 凸 = MAX → 効果範囲拡大 (self_lane → adjacent_lanes 等) + cost -1
function effectiveCost(card) {
  if (isMaxDup(card)) return Math.max(1, card.cost - 1);
  return card.cost;
}
function isHalfDup(card) {
  const max = MAX_DUPS[card.tier] || 0;
  return max > 0 && (card.dupes || 0) >= Math.ceil(max / 2);
}
function isMaxDup(card) {
  const max = MAX_DUPS[card.tier] || 0;
  return max > 0 && (card.dupes || 0) >= max;
}
// onPlay 効果を凸数で動的拡張
function effectiveEffect(card) {
  const base = card.effect || {};
  if (!base.trigger) return base;
  const e = { ...base };
  if (isHalfDup(card) && e.power != null) e.power += 1;  // 数値 +1
  if (isMaxDup(card)) {
    // 効果範囲を 1 段拡大
    const expand = {
      'self_lane': 'adjacent_lanes',
      'adjacent_lanes': 'all_lanes',
      'opp_self_lane': 'all_opp_lanes',
    };
    if (expand[e.target]) e.target = expand[e.target];
  }
  return e;
}

// AI 用デッキ: ランダムに 12 枚 (公開済章 + tier バランス考慮)
function getAiDeck() {
  const byTier = { LR: [], UR: [], SSR: [], SR: [], R: [] };
  state.allCards.forEach(c => { if (byTier[c.tier]) byTier[c.tier].push(c); });
  // tier バランス: LR 0-1 / UR 1-2 / SSR 2-3 / SR 3-4 / R 3-4
  const pick = (arr, n) => shuffle([...arr]).slice(0, Math.min(n, arr.length));
  const ai = [
    ...pick(byTier.LR, 1),
    ...pick(byTier.UR, 2),
    ...pick(byTier.SSR, 3),
    ...pick(byTier.SR, 3),
    ...pick(byTier.R, 3),
  ];
  while (ai.length < DECK_SIZE) {
    const fallback = pick(state.allCards.filter(c => !ai.some(a => a.id === c.id)), DECK_SIZE - ai.length);
    ai.push(...fallback);
  }
  return ai.slice(0, DECK_SIZE);
}

// おまかせデッキ生成 (派閥シナジー優先 = 同派閥多めで自動構築、 野沢さん指示 2026-05-05 LR/UR 制限を遵守)
function generateAutoDeck() {
  const byFaction = {};
  state.allCards.forEach(c => {
    if (!byFaction[c.faction]) byFaction[c.faction] = [];
    byFaction[c.faction].push(c);
  });
  const factions = Object.entries(byFaction)
    .filter(([f, arr]) => arr.length >= 3)
    .sort((a, b) => b[1].length - a[1].length);
  const picked = [];
  const tierCount = { LR: 0, UR: 0, SSR: 0, SR: 0, R: 0 };
  const canAdd = (c) => {
    const limit = _tierLimit(c.tier);
    return limit === undefined || tierCount[c.tier] < limit;
  };
  for (const [, arr] of factions) {
    const need = DECK_SIZE - picked.length;
    if (need <= 0) break;
    const sorted = [...arr].sort((a, b) => {
      const order = { LR: 5, UR: 4, SSR: 3, SR: 2, R: 1 };
      return order[b.tier] - order[a.tier];
    });
    for (const c of sorted) {
      if (picked.length >= DECK_SIZE) break;
      if (picked.some(p => p.id === c.id)) continue;
      if (!canAdd(c)) continue;
      picked.push(c);
      tierCount[c.tier] = (tierCount[c.tier] || 0) + 1;
      if (picked.filter(p => p.faction === c.faction).length >= 4) break;  // 同派閥は最大4まで
    }
  }
  while (picked.length < DECK_SIZE) {
    const remaining = state.allCards.filter(c => !picked.some(p => p.id === c.id) && canAdd(c));
    if (remaining.length === 0) break;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    picked.push(pick);
    tierCount[pick.tier] = (tierCount[pick.tier] || 0) + 1;
  }
  return picked.slice(0, DECK_SIZE).map(c => c.id);
}

// ===== Utility =====
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return Array.from(document.querySelectorAll(sel)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function setMessage(text, kind = '') {
  const el = $('#match-message');
  el.textContent = text;
  el.className = 'cg-message' + (kind ? ' ' + kind : '');
}

// ===== 試合開始 (BO3 series 開始 or 単発) =====
function startMatch(difficulty, isBO3) {
  state.difficulty = difficulty;
  // series 初期化 (BO3 開始時のみ、 既に series 進行中なら継続)
  const startingNewSeries = !state.series.isBO3 || state.series.matchNo > 3 || (state.series.wins.me + state.series.wins.opp === 0 && !state._continueSeries);
  if (startingNewSeries) {
    state.series = { isBO3: !!isBO3, wins: { me: 0, opp: 0 }, matchNo: 1, results: [] };
  }
  // 先行/後攻決定 (BO3: 1試合目=ユーザー先行 / 2試合目=ユーザー後攻 / 3試合目=ランダム / 単発: ユーザー先行)
  if (state.series.isBO3) {
    if (state.series.matchNo === 1) state.firstMover = 'me';
    else if (state.series.matchNo === 2) state.firstMover = 'opp';
    else state.firstMover = Math.random() < 0.5 ? 'me' : 'opp';
  } else {
    state.firstMover = 'me';
  }
  state._continueSeries = false;

  _initMatchState();

  $('#home-screen').classList.remove('active');
  $('#match-screen').classList.add('active');
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = true;

  // BO3 表示更新
  updateSeriesHud();

  drawTurnStart();
  // 野沢さん指示 2026-05-04: 中央メッセージ短縮 (BO3詳細 / 先攻表示は You/AI 横アイコンに移動済)
  setMessage(`ターン 1 — マリガン可`);
}

function _initMatchState() {
  state.turn = 1;
  state.cost = 1;
  state.costUsed = 0;
  state.scoreMe = 0;
  state.scoreOpp = 0;
  state.ended = false;
  state.selectedCardIdx = -1;
  state.thisTurnPlacements = [];
  state.mulliganAvailable = true;
  state.thisTurnAiDone = false;
  state._comboBonusGlobal = 0;
  // 野沢さん指示 2026-05-05: cost_reduce_hand は 1試合 1回限定
  state._costReduceUsedMe = false;
  state._costReduceUsedOpp = false;

  // P-5: ユーザーデッキ (localStorage) + AI デッキ (ランダム tier バランス)
  const myDeckCards = getCurrentDeck().map(c => ({ ...c }));
  const aiDeckCards = getAiDeck().map(c => ({ ...c }));
  state.deck = shuffle(myDeckCards);
  state.oppDeck = shuffle(aiDeckCards);
  state.hand = state.deck.splice(0, 4);
  state.oppHand = state.oppDeck.splice(0, 4);
  state.board = { me: [[], [], []], opp: [[], [], []] };
  const shuffled = shuffle(state.laneEffectsAll);
  state.laneEffects = [shuffled[0], shuffled[1], shuffled[2]];
}

// マリガン: 全手札 deck に戻して shuffle、 再 draw 5枚 (ターン1 で 1回のみ)
function mulligan() {
  if (!state.mulliganAvailable || state.turn !== 1 || state.thisTurnPlacements.length > 0) return;
  const handSize = state.hand.length;
  state.deck.push(...state.hand);
  state.hand = [];
  state.deck = shuffle(state.deck);
  state.hand = state.deck.splice(0, handSize);
  state.mulliganAvailable = false;
  setMessage('🔄 マリガン: 手札を引き直しました', 'success');
  renderAll();
}

async function drawTurnStart() {
  if (state.deck.length > 0 && state.hand.length < 7) state.hand.push(state.deck.shift());
  if (state.oppDeck.length > 0 && state.oppHand.length < 7) state.oppHand.push(state.oppDeck.shift());
  state.cost = state.turn;
  state.costUsed = 0;
  state.thisTurnPlacements = [];
  state.thisTurnAiDone = false;
  // B-1.A: ターン開始時の状態更新 — growth +1, frozen -1, stealth -1
  ['me', 'opp'].forEach(side => {
    [0, 1, 2].forEach(L => {
      state.board[side][L].forEach(c => {
        if (c._growthEnabled) c._growthCount = (c._growthCount || 0) + 1;
        if (c._frozenTurns > 0) c._frozenTurns -= 1;
        if (c._stealthTurns > 0) c._stealthTurns -= 1;
      });
    });
  });
  // 後攻時はターン頭で AI が先に配置 (ユーザーは AI の手を見てから配置可能)
  if (state.firstMover === 'opp' && !state.ended) {
    state.busy = true;
    renderAll();
    setMessage(`T${state.turn} — AI 配置中…`);
    await sleep(400);
    await aiTurn();
    state.thisTurnAiDone = true;
    state.busy = false;
    setMessage(`T${state.turn} — あなたの番`);
  }
  renderAll();
}

// ===== Power 計算 (派閥シナジー / レーン効果 / コンボ / 凸数 を毎回動的) =====
// 凸数毎に +1 ﾊﾟﾜｰ加算 (野沢さん指示 2026-05-06、 各凸段階で +1 ずつ強化)
// 高レアほど max 凸数が多い (R=1, SR=2, SSR=3, UR=4, LR=4) → MAX 凸時のボーナスも大きい:
//   R MAX = +1 / SR MAX = +2 / SSR MAX = +3 / UR/LR MAX = +4
// 旧仕様 (0凸/half/MAX = +0/+1/+2) では SSR 以上で 1凸/3凸 が 前段階と同じで段階雑だった事故対策
function dupeBonusOf(card) {
  const max = MAX_DUPS[card.tier] || 0;
  return Math.min(card.dupes || 0, max);
}
function laneEffectFor(card, lane) {
  const e = state.laneEffects[lane];
  if (!e) return 0;
  switch (e.rule) {
    case 'cost_ge': return card.cost >= e.threshold ? e.value : 0;
    case 'cost_le': return card.cost <= e.threshold ? e.value : 0;
    case 'all_self': return e.value;       // 自分側のみ (呼び元で判定する)
    case 'all_opp':  return e.value;       // 相手側のみ (呼び元で判定する)
    case 'faction':  return card.faction === e.faction ? e.value : 0;
  }
  return 0;
}
function factionSynergyFor(card, side, lane) {
  const same = state.board[side][lane].filter(c => c.faction === card.faction).length;
  // 同レーンに同派閥 ≥ 2 → そのレーンの同派閥カード全員に +1 (1枚ごとに +1 追加)
  return same >= 2 ? same : 0;
}
// 旧 comboBonusFor (per-card 加算): combo の power が members 数 × power になり過剰加算 → 廃止 (2026-05-04 全体点検)
// 新仕様: comboLaneBonus(side, lane) でレーン単位 1 回だけ加算 (target='self_lane' or 'all_lanes')
function comboBonusFor(card, side, lane) { return 0; /* 後方互換のため空関数残し */ }

// プリズマ等の comboBonus 加算 (board 上の自軍 全カードを集計、 silenced は除外)
function getGlobalComboBonus(side) {
  let bonus = 0;
  state.board[side].flat().forEach(c => {
    if (c._silenced) return;
    const eff = effectiveEffect(c);
    if (eff && eff.comboBonus) bonus += eff.comboBonus;
  });
  return bonus;
}

function comboLaneBonus(side, lane) {
  let bonus = 0;
  const allBoardCards = [].concat(...state.board[side]);
  const sameLaneCards = state.board[side][lane];
  const hasInLane = (n) => sameLaneCards.some(c => c.name === n);
  const hasOnBoard = (n) => allBoardCards.some(c => c.name === n);
  const globalBonus = getGlobalComboBonus(side);  // プリズマ等の comboBonus 加算
  for (const combo of state.combos) {
    let triggered = false;
    if (combo.condition === 'same_lane') triggered = combo.chars.every(hasInLane);
    else if (combo.condition === 'any_lane') triggered = combo.chars.every(hasOnBoard);
    if (!triggered) continue;
    const t = combo.effect.target;
    // self_lane: 同レーンに揃った時のみ、 そのレーンに +power
    // all_lanes: 任意レーンに揃った時、 全レーンに +power (3レーン × power)
    if (t === 'self_lane' || t === 'all_lanes') {
      bonus += combo.effect.power + globalBonus;
    }
  }
  return bonus;
}
function getCardPower(card, side, lane) {
  // B-1.A: freeze 状態は power 0 で固定 (1ターン無効化)
  if ((card._frozenTurns || 0) > 0) return 0;
  // バグ修正 2026-05-04 (野沢さん指摘 全体数字計算点検): _currentPower は配置時に既に base+dupe を含むので、
  // 再度 dupeBonusOf を加算すると dupe が 2 倍カウントされる (例: 配置直後 6 のはずが 7 と表示)。
  // _currentPower がセット済 = 配置済カード = そのまま使用、 未セット = 手札 = base + dupe で初期化
  let p = (card._currentPower != null) ? card._currentPower : (card.basePower + dupeBonusOf(card));
  // B-1.A: growth (累計、 自身のみに毎ターン +1)
  if (card._growthCount) p += card._growthCount;
  // B-1.A: immediate (配置ターンのみの 一時 buff、 endTurn でリセット)
  if (card._immediateBonus) p += card._immediateBonus;
  // B-1.A: 黄金化 (リオラエル等、 退場まで持続する固定 buff)
  if (card._goldenBuff) p += card._goldenBuff;
  // レーン効果
  const le = state.laneEffects[lane];
  if (le) {
    if (le.rule === 'all_self' && side === 'me') p += le.value;
    else if (le.rule === 'all_opp' && side === 'opp') p += le.value;
    else if (le.rule === 'faction' || le.rule === 'cost_ge' || le.rule === 'cost_le') {
      p += laneEffectFor(card, lane);
    }
  }
  // 派閥シナジー
  p += factionSynergyFor(card, side, lane);
  // 野沢さん指示 2026-05-05 「もっと良い効果」: オーラ (常時発動、 永続)
  // auraSelfLane: 自レーン同盟全員に +N (発生源含む)
  // auraOppLane: 相手レーンの自軍 同レーンに -N (威圧、 silence/frozen で発生せず)
  p += _auraBonusFor(card, side, lane);
  // ストーリーコンボ
  p += comboBonusFor(card, side, lane);
  return p;
}

// オーラ計算 (永続効果、 場の状態で動的)
function _auraBonusFor(card, side, lane) {
  let bonus = 0;
  // 自レーンの auraSelfLane 持ちカード合計
  state.board[side][lane].forEach(c => {
    if (c._silenced || (c._frozenTurns || 0) > 0) return;
    const eff = effectiveEffect(c);
    if (eff && eff.auraSelfLane) bonus += eff.auraSelfLane;
  });
  // 相手レーンの auraOppLane 持ちカード合計 (相手 → 自軍 への威圧、 通常 負の値)
  const oppSide = side === 'me' ? 'opp' : 'me';
  state.board[oppSide][lane].forEach(c => {
    if (c._silenced || (c._frozenTurns || 0) > 0) return;
    const eff = effectiveEffect(c);
    if (eff && eff.auraOppLane) bonus += eff.auraOppLane;
  });
  return bonus;
}

function getLanePower(side, lane) {
  // 各カードの power 合計 + コンボボーナス (レーン単位 1回)
  const cardSum = state.board[side][lane].reduce((s, c) => s + getCardPower(c, side, lane), 0);
  return cardSum + comboLaneBonus(side, lane);
}

// ===== 描画 =====
function renderAll() {
  $('#hud-turn').textContent = state.turn;
  $('#hud-cost').textContent = (state.cost - state.costUsed) + ' / ' + state.cost;
  $('#hand-count').textContent = state.hand.length;
  // 野沢さん指示 2026-05-05: 先攻/後攻 を絵文字 → 言葉表示
  const meIcon = $('#mover-icon-me');
  const oppIcon = $('#mover-icon-opp');
  if (meIcon && oppIcon) {
    if (state.firstMover === 'me') {
      meIcon.textContent = '先攻';
      meIcon.className = 'cg-mover-icon mover-first';
      oppIcon.textContent = '後攻';
      oppIcon.className = 'cg-mover-icon mover-second';
    } else {
      meIcon.textContent = '後攻';
      meIcon.className = 'cg-mover-icon mover-second';
      oppIcon.textContent = '先攻';
      oppIcon.className = 'cg-mover-icon mover-first';
    }
  }
  $('#btn-end-turn').disabled = state.busy || state.ended;
  $('#btn-undo').disabled = state.busy || state.ended || state.thisTurnPlacements.length === 0;
  // マリガンボタン: ターン1 で 配置前のみ有効
  const mulBtn = document.getElementById('btn-mulligan');
  if (mulBtn) {
    const canMul = state.mulliganAvailable && state.turn === 1 && state.thisTurnPlacements.length === 0 && !state.busy && !state.ended;
    mulBtn.style.display = (state.turn === 1 && state.mulliganAvailable) ? '' : 'none';
    mulBtn.disabled = !canMul;
  }
  updateSeriesHud();

  renderLaneEffects();
  renderHand();
  renderBoard();
  updateLanePowers();
  renderCombosPanel();
}

// PC 用 コンボ常時パネル
function renderCombosPanel() {
  const body = document.getElementById('cg-combos-panel-body');
  if (!body) return;
  const list = collectAvailableCombos();
  if (list.length === 0) {
    body.innerHTML = '<p class="cg-combos-panel-empty">手札+場 にコンボパーツなし</p>';
    return;
  }
  body.innerHTML = list.map(c => `
    <div class="cg-combos-panel-item ${c.triggered ? 'triggered' : ''}">
      <div class="cg-combos-panel-head">
        <span class="cg-combos-panel-icon">${c.triggered ? '✨' : '🔍'}</span>
        <span class="cg-combos-panel-name">${c.name}</span>
        <span class="cg-combos-panel-status">${c.triggered ? `+${c.power}` : `${c.collected.length}/${c.chars.length}`}</span>
      </div>
      <div class="cg-combos-panel-chars">
        ${c.chars.map(name => {
          const has = c.collected.includes(name);
          return `<span class="cg-combos-panel-chip ${has ? 'has' : 'miss'}">${has ? '✓' : '○'}${name}</span>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function renderLaneEffects() {
  const isMobile = window.innerWidth <= 480;
  [0, 1, 2].forEach(lane => {
    const e = state.laneEffects[lane];
    const labelMe = $(`#lanes-me .cg-lane[data-lane="${lane}"] .cg-lane-name`);
    const labelOpp = $(`#lanes-opp .cg-lane[data-lane="${lane}"] .cg-lane-name`);
    if (!e) return;
    // スマホ: 「L1 🌊 ⓘ」 (タップで popover)、 PC: フル表示 + title hover
    const txt = isMobile
      ? `L${lane + 1} ${e.icon} <span class="cg-lane-info-hint">ⓘ</span>`
      : `L${lane + 1} ${e.icon} ${e.name}`;
    const titleTxt = `${e.name} — ${e.description}`;
    if (labelMe) { labelMe.innerHTML = txt; labelMe.title = titleTxt; }
    if (labelOpp) { labelOpp.innerHTML = txt; labelOpp.title = titleTxt; }
    [`#lanes-me .cg-lane[data-lane="${lane}"]`, `#lanes-opp .cg-lane[data-lane="${lane}"]`].forEach(s => {
      const el = $(s); if (el) el.title = titleTxt;
    });
  });
}

// A-5: レーン効果 popover (スマホで詳細表示できない問題への対応、 タップで開閉)
function _initLaneEffectPopover() {
  const showPopover = (lane, anchor) => {
    const e = state.laneEffects[lane];
    if (!e) return;
    let pop = document.getElementById('cg-lane-popover');
    if (!pop) {
      pop = document.createElement('div');
      pop.id = 'cg-lane-popover';
      pop.className = 'cg-lane-popover';
      pop.addEventListener('click', () => pop.classList.remove('open'));
      document.body.appendChild(pop);
    }
    pop.innerHTML = `
      <div class="cg-lane-popover-head">
        <span class="cg-lane-popover-icon">${e.icon}</span>
        <span class="cg-lane-popover-name">${e.name}</span>
        <span class="cg-lane-popover-chapter">${(e.chapter || '').toUpperCase()}</span>
      </div>
      <div class="cg-lane-popover-desc">${e.description}</div>
      <div class="cg-lane-popover-hint">タップで閉じる</div>
    `;
    const rect = anchor.getBoundingClientRect();
    pop.style.left = Math.max(8, Math.min(window.innerWidth - 240, rect.left + rect.width / 2 - 120)) + 'px';
    pop.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    pop.classList.add('open');
    // 外側クリックで閉じる (1度だけ捕捉)
    setTimeout(() => {
      const close = (ev) => {
        if (!pop.contains(ev.target) && !ev.target.closest('.cg-lane-header')) {
          pop.classList.remove('open');
          document.removeEventListener('click', close, true);
        }
      };
      document.addEventListener('click', close, true);
    }, 50);
  };
  // me/opp 両方の lane header にイベント (delegation)
  ['lanes-me', 'lanes-opp'].forEach(parentId => {
    const parent = document.getElementById(parentId);
    if (!parent) return;
    parent.addEventListener('click', (ev) => {
      const header = ev.target.closest('.cg-lane-header');
      if (!header) return;
      const laneEl = header.closest('.cg-lane');
      if (!laneEl) return;
      const lane = Number(laneEl.dataset.lane);
      ev.stopPropagation();
      showPopover(lane, header);
    });
  });
}

function renderHand() {
  const handEl = $('#hand');
  handEl.innerHTML = '';
  state.hand.forEach((card, idx) => {
    const cardEl = makeCardElement(card, true);
    if (state.selectedCardIdx === idx) cardEl.classList.add('selected');
    // バグ修正 2026-05-04: 元 cost ではなく 凸後 + 手札 cost_reduce 反映後で unaffordable 判定
    const finalCost = Math.max(1, effectiveCost(card) - (card._costReduced || 0));
    if (finalCost > state.cost - state.costUsed) cardEl.classList.add('unaffordable');
    cardEl.addEventListener('click', () => onHandCardClick(idx));
    handEl.appendChild(cardEl);
  });
}

function renderBoard() {
  ['me', 'opp'].forEach(side => {
    [0, 1, 2].forEach(lane => {
      const slotsEl = $(`#${side}-slots-${lane}`);
      slotsEl.innerHTML = '';
      state.board[side][lane].forEach((card, boardIdx) => {
        const el = makeCardElement(card, true);
        if (side === 'opp') el.classList.add('opp');
        // 自分のカードかつ ターン内 配置済 → undo 可能 (クリックで取消、 ℹ ボタンは stopPropagation 済)
        if (side === 'me' && state.thisTurnPlacements.some(p => p.cardId === card.id && p.lane === lane)) {
          el.classList.add('undoable');
          el.title = 'タップで手札に戻す (ℹ で詳細)';
          el.addEventListener('click', () => undoMyCard(lane, boardIdx));
        }
        // 場の他カードはタップ動作なし (ℹ ボタンで詳細閲覧のみ)
        // 動的 power を表示用に上書き
        const dynPower = getCardPower(card, side, lane);
        const pEl = el.querySelector('.cg-card-power');
        if (pEl) pEl.textContent = '⚔' + dynPower;
        slotsEl.appendChild(el);
      });
    });
  });
}

function makeCardElement(card, showEffect) {
  const el = document.createElement('div');
  el.className = 'cg-card';
  // B-1.A: トークン (召喚兵) は見た目区別 + 効果無し
  if (card._isToken) el.classList.add('cg-card-token');
  // B-1.A: freeze 状態は灰色オーバーレイ
  if ((card._frozenTurns || 0) > 0) el.classList.add('cg-card-frozen');
  if (card._silenced) el.classList.add('cg-card-silenced');
  if ((card._stealthTurns || 0) > 0) el.classList.add('cg-card-stealth');
  el.style.setProperty('--faction-color', factionColor(card.faction));
  const imgUrl = card.img ? '..' + card.img : '';
  const imgStyle = imgUrl ? `background-image: url('${imgUrl}')` : '';
  const imgClass = imgUrl ? '' : 'no-img';
  const dupesBadge = card.dupes > 0 ? `<span class="cg-card-dupes" title="凸 ${card.dupes}">+${card.dupes}</span>` : '';
  // power 計算: _currentPower (onPlay 適用済) + dupe + immediate + growth + golden、 frozen は 0 表示
  let displayPower;
  if ((card._frozenTurns || 0) > 0) {
    displayPower = 0;
  } else {
    displayPower = card._currentPower != null ? card._currentPower : (card.basePower + dupeBonusOf(card));
    if (card._immediateBonus) displayPower += card._immediateBonus;
    if (card._growthCount) displayPower += card._growthCount;
    if (card._goldenBuff) displayPower += card._goldenBuff;
  }
  // A-2: 凸後コスト反映 (MAX凸で cost-1 が適用されたら 元cost 打消線 + 凸後cost を gold で表示)
  const effCost = effectiveCost(card);
  const handCostReduce = card._costReduced || 0;
  const finalCost = Math.max(1, effCost - handCostReduce);
  let costHtml;
  if (handCostReduce > 0) {
    // cost_reduce_hand バフ適用済 (💴 マーク)
    costHtml = `<span class="cg-card-cost cg-cost-reduced" title="cost_reduce_hand: -${handCostReduce}"><s class="cg-cost-orig">${card.cost}</s>💴${finalCost}</span>`;
  } else if (effCost !== card.cost) {
    costHtml = `<span class="cg-card-cost cg-cost-reduced" title="MAX凸でコスト-1"><s class="cg-cost-orig">${card.cost}</s>⚡${finalCost}</span>`;
  } else {
    costHtml = `<span class="cg-card-cost">⚡${effCost}</span>`;
  }
  // B-1.B: 状態 badge (frozen/silenced/stealth/immediate/growth/golden) スマホ最適化済
  const statusBadges = _renderStatusBadges(card);
  el.innerHTML = `
    <div class="cg-card-tier ${card.tier}">${card.tier}${dupesBadge}</div>
    <div class="cg-card-faction" style="background:${factionColor(card.faction)}">${card.faction}</div>
    <div class="cg-card-img ${imgClass}" style="${imgStyle}"></div>
    <button class="cg-card-info-btn" type="button" aria-label="詳細" title="詳細を見る">i</button>
    ${statusBadges}
    <div class="cg-card-name">${card.name}</div>
    ${showEffect && card.effectText ? `<div class="cg-card-effect">${card.effectText}</div>` : ''}
    <div class="cg-card-stats">
      ${costHtml}
      <span class="cg-card-power">⚔${displayPower}</span>
    </div>
  `;
  // ℹ ボタン (stopPropagation で配置選択と分離)
  const infoBtn = el.querySelector('.cg-card-info-btn');
  if (infoBtn) {
    infoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showCardDetail(card, null, null);
    });
  }
  if (imgUrl) {
    const probe = new Image();
    probe.src = imgUrl;
    probe.onerror = () => {
      const imgEl = el.querySelector('.cg-card-img');
      if (imgEl) {
        imgEl.style.backgroundImage = '';
        imgEl.classList.add('no-img');
      }
    };
  }
  return el;
}

function updateLanePowers() {
  [0, 1, 2].forEach(lane => {
    const mePow = getLanePower('me', lane);
    const oppPow = getLanePower('opp', lane);
    $(`#me-power-${lane}`).textContent = mePow;
    $(`#opp-power-${lane}`).textContent = oppPow;

    const meLaneEl = $(`#lanes-me .cg-lane[data-lane="${lane}"]`);
    const oppLaneEl = $(`#lanes-opp .cg-lane[data-lane="${lane}"]`);
    meLaneEl.classList.remove('lane-win-me', 'lane-win-opp');
    oppLaneEl.classList.remove('lane-win-me', 'lane-win-opp');
    if (mePow > oppPow) { meLaneEl.classList.add('lane-win-me'); oppLaneEl.classList.add('lane-win-me'); }
    else if (oppPow > mePow) { meLaneEl.classList.add('lane-win-opp'); oppLaneEl.classList.add('lane-win-opp'); }
  });
}

// ===== 手札カード選択 (タップ = 配置モード、 ℹ ボタンで詳細) =====
// 野沢さん指示 2026-05-04 「キャラ押した時はそのまま配置したい場合もある」 → 詳細はポップアップやめて配置直結。
// PC は hover でも詳細表示、 スマホは ℹ アイコンタップで詳細モーダル。
function onHandCardClick(idx) {
  if (state.busy || state.ended) return;
  const card = state.hand[idx];
  // B-1.A: cost_reduce_hand の効果を反映 (手札時点で cost -1)
  const cost = Math.max(1, effectiveCost(card) - (card._costReduced || 0));
  if (cost > state.cost - state.costUsed) {
    setMessage(`コスト不足: ${card.name} (⚡${cost} 必要、 残${state.cost - state.costUsed})`, 'alert');
    return;
  }
  // 同カード再タップで選択解除
  if (state.selectedCardIdx === idx) {
    state.selectedCardIdx = -1;
    $$('.lane-target').forEach(el => el.classList.remove('lane-target'));
    setMessage('選択解除');
  } else {
    state.selectedCardIdx = idx;
    $$('#lanes-me .cg-lane').forEach(el => {
      if (state.board.me[Number(el.dataset.lane)].length < 4) el.classList.add('lane-target');
    });
    setMessage(`配置先レーン (L1/L2/L3) をタップ: ${card.name}`);
  }
  renderHand();
}

// ===== P-1: キャラ詳細モーダル =====
function showCardDetail(card, context, handIdx) {
  if (!card) return;
  $('#char-detail-img').style.backgroundImage = card.img ? `url('..${card.img}')` : '';
  const tierEl = $('#char-detail-tier');
  tierEl.textContent = card.tier;
  tierEl.className = 'cg-char-detail-tier ' + card.tier;
  const facEl = $('#char-detail-faction');
  facEl.textContent = card.faction || '無所属';
  facEl.style.background = factionColor(card.faction);
  $('#char-detail-dupes').textContent = card.dupes > 0 ? `+${card.dupes} 凸` : '凸 0';
  $('#char-detail-name').textContent = card.name;
  // A-2: 凸後 cost 反映 (MAX 凸なら 元cost 打消線 + 凸後cost)
  const detailEffCost = effectiveCost(card);
  const costEl = $('#char-detail-cost');
  if (detailEffCost !== card.cost) {
    costEl.innerHTML = `<s class="cg-cost-orig">${card.cost}</s>${detailEffCost}`;
    costEl.classList.add('cg-cost-reduced');
  } else {
    costEl.textContent = card.cost;
    costEl.classList.remove('cg-cost-reduced');
  }
  $('#char-detail-base').textContent = card.basePower;
  // dupe bonus は dupeBonusOf (段階式: 0 / +1 / +2)
  const dupeBonus = dupeBonusOf(card);
  $('#char-detail-bonus').textContent = '+' + dupeBonus;
  $('#char-detail-total').textContent = card.basePower + dupeBonus;
  $('#char-detail-effect').textContent = card.effectText || '効果なし';
  // A-3: 凸毎効果 段階表 (現在の凸数を強調)
  _renderDupeStageTable(card);
  // 野沢さん指示 2026-05-05: power 計算 内訳表示 (「-2 が -1 にしか反映されない」 等の調査用)
  _renderPowerBreakdown(card);
  // 関連コンボ
  const related = state.combos.filter(c => c.chars.includes(card.name));
  const listEl = $('#char-detail-combo-list');
  if (related.length === 0) {
    listEl.innerHTML = '<p class="cg-char-combo-empty">このキャラを含むコンボなし</p>';
  } else {
    listEl.innerHTML = related.map(c => {
      const otherChars = c.chars.filter(n => n !== card.name);
      const condLabel = c.condition === 'same_lane' ? '同レーンに揃える' : 'いずれかの場に揃える';
      const targetLabel = c.effect.target === 'all_lanes' ? '全レーン' : '自レーン';
      return `<div class="cg-char-combo-item">
        <div class="cg-char-combo-name">✨ ${c.name}</div>
        <div class="cg-char-combo-cond">${condLabel}: ${otherChars.join(' + ') || '(単独)'}</div>
        <div class="cg-char-combo-effect">→ ${targetLabel} +${c.effect.power} power</div>
        <div class="cg-char-combo-flavor">${c.flavor}</div>
      </div>`;
    }).join('');
  }
  // ボタン制御: context によって 配置ボタン / デッキ追加・削除ボタンを切替
  const placeBtn = $('#char-detail-place-btn');
  const deckAddBtn = $('#char-detail-deck-add-btn');
  const deckRemoveBtn = $('#char-detail-deck-remove-btn');
  if (placeBtn) placeBtn.style.display = 'none';
  if (deckAddBtn) deckAddBtn.style.display = 'none';
  if (deckRemoveBtn) deckRemoveBtn.style.display = 'none';
  if (context === 'deck-builder' && card.id) {
    const isInDeck = _deckBuilderState.selected.includes(card.id);
    if (isInDeck) {
      if (deckRemoveBtn) {
        deckRemoveBtn.style.display = '';
        deckRemoveBtn.onclick = () => {
          toggleDeckCard(card.id);
          closeCharDetail();
        };
      }
    } else {
      if (deckAddBtn) {
        const full = _deckBuilderState.selected.length >= DECK_SIZE;
        deckAddBtn.style.display = '';
        deckAddBtn.disabled = full;
        deckAddBtn.textContent = full ? '⚠️ デッキは満員 (12/12)' : '📥 デッキに加える';
        deckAddBtn.onclick = () => {
          toggleDeckCard(card.id);
          closeCharDetail();
        };
      }
    }
  }
  $('#char-detail-modal').hidden = false;
  _setBodyModalOpen();
}
function closeCharDetail() { $('#char-detail-modal').hidden = true; _setBodyModalOpen(); }

// ===== 📗 ルールブック (野沢さん指示 2026-05-06、 ホーム/バトル両方からアクセス) =====
let _rulebookTab = 'basic';
function openRulebook() {
  const m = document.getElementById('rulebook-modal');
  if (!m) return;
  m.hidden = false;
  _setBodyModalOpen();
  _rulebookTab = 'basic';
  _renderRulebook();
}
function closeRulebook() {
  const m = document.getElementById('rulebook-modal');
  if (!m) return;
  m.hidden = true;
  _setBodyModalOpen();
}
function _renderRulebook() {
  const tabs = document.querySelectorAll('#rulebook-modal .cg-rulebook-tab');
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === _rulebookTab));
  tabs.forEach(t => t.addEventListener('click', () => {
    _rulebookTab = t.dataset.tab; _renderRulebook();
  }, { once: true }));  // 1度だけ bind (再呼出で再 register)
  const body = document.getElementById('rulebook-body');
  if (!body) return;
  if (_rulebookTab === 'basic') {
    body.innerHTML = `
      <div class="cg-rb-section">
        <h3>📜 基本ルール</h3>
        <ul class="cg-rb-list">
          <li><b>盤面</b>: 3レーン × 各最大4枠、 自陣 / 敵陣 の 2段</li>
          <li><b>ターン</b>: 全 6 ターン、 各ターン コスト=ターン数 (T1=1, T6=6) を消費して カードを配置</li>
          <li><b>勝敗</b>: ターン6 終了時、 各レーンの power 合計を比較 → 勝ったレーン数で勝敗を決定</li>
          <li><b>引分</b>: 勝ちレーン数が同じ場合は引分</li>
          <li><b>マリガン</b>: T1 で 1度だけ手札を引き直し可能</li>
          <li><b>BO3</b>: 先攻 → 後攻 → ランダム の 3本勝負、 2本先取で勝利</li>
          <li><b>デッキ</b>: 12枚、 LR 1枚 / UR 3枚まで、 同名禁止</li>
        </ul>
      </div>`;
  } else if (_rulebookTab === 'lane') {
    const lanes = (state && state.laneEffectsAll) || [];
    const allLanes = lanes.length > 0 ? lanes : [];
    body.innerHTML = `
      <div class="cg-rb-section">
        <h3>🌟 フィールド効果一覧 (${allLanes.length}種)</h3>
        <div class="cg-rb-detail">毎試合、 3レーン に ランダムで 1つずつ配置されます。 配置中のフィールドはバトル画面の レーン上部に表示。</div>
        <ul class="cg-rb-list">
          ${allLanes.map(e => `<li><span class="cg-rb-lane-icon">${e.icon}</span> <b>${e.name}</b> — ${e.description}</li>`).join('')}
        </ul>
      </div>`;
  } else if (_rulebookTab === 'buff') {
    body.innerHTML = `
      <div class="cg-rb-section">
        <h3>🔮 バフ・デバフ効果一覧</h3>
        <div class="cg-rb-detail">カード固有効果で 自軍/敵軍 の状態を変える。 効果は 各カードの 効果文 に明記。</div>
        <ul class="cg-rb-list">
          <li><span class="cg-rb-tag tag-buff">+1〜N</span> <b>パワー強化</b>: 対象レーンの power を 一定値 加算 (永続)</li>
          <li><span class="cg-rb-tag tag-buff">🌱 成長</span> <b>毎T +1</b>: 自身の power が 毎ターン +1 累積、 退場まで持続</li>
          <li><span class="cg-rb-tag tag-buff">✨ 黄金化</span> <b>パワー倍化</b>: 自レーンの自軍 power 1.5倍 に強化</li>
          <li><span class="cg-rb-tag tag-buff">🌀 常時オーラ</span> <b>レーン全体に効果</b>: 自レーン全員 +N (例: ヒノオウ「焔王の威光」)</li>
          <li><span class="cg-rb-tag tag-buff">💴 コスト減</span> <b>手札の最高 Cost を -N</b>: 1試合 1回限定 (例: ネプテア「青の祈り」)</li>
          <li><span class="cg-rb-tag tag-buff">📞 トークン召喚</span> <b>使い捨ての小型ユニット</b>: 自レーンに 基礎パワーのみのトークン1枚生成</li>
          <li><span class="cg-rb-tag tag-debuff">-1〜N</span> <b>パワー減衰</b>: 対象レーンの power を 一定値 減算 (永続)</li>
          <li><span class="cg-rb-tag tag-debuff">❄️ 凍結</span> <b>1Tパワー0</b>: 1ターン パワー0 で 固定、 効果も無効</li>
          <li><span class="cg-rb-tag tag-debuff">🔇 沈黙</span> <b>効果無効</b>: 対象カードの onPlay 効果 / オーラ / 成長を 完全無効化 (永続)</li>
          <li><span class="cg-rb-tag tag-debuff">🌫 ステルス</span> <b>1T 指定不可</b>: 1ターン 相手のデバフ対象に選ばれない (自身付与)</li>
          <li><span class="cg-rb-tag tag-debuff">🌑 威圧オーラ</span> <b>相手レーンに -N</b>: 相手 同レーン全員 -N (例: グレイル「凍土の威圧」)</li>
        </ul>
      </div>`;
  } else if (_rulebookTab === 'dupe') {
    body.innerHTML = `
      <div class="cg-rb-section">
        <h3>🃏 凸システム (各凸 +1 ﾊﾟﾜｰ)</h3>
        <div class="cg-rb-detail">同名キャラを ガチャで重複入手すると 凸数が 1ずつ増える。 高レアほど MAX 凸数が多く、 ﾎﾞｰﾅｽも大きい。</div>
        <table class="cg-rb-dupe-table">
          <thead><tr><th>レア度</th><th>0凸</th><th>1凸</th><th>2凸</th><th>3凸</th><th>4凸 (MAX)</th></tr></thead>
          <tbody>
            <tr><td><b>R</b></td><td>+0</td><td>+1 (MAX)</td><td>—</td><td>—</td><td>—</td></tr>
            <tr><td><b>SR</b></td><td>+0</td><td>+1</td><td>+2 (MAX)</td><td>—</td><td>—</td></tr>
            <tr><td><b>SSR</b></td><td>+0</td><td>+1</td><td>+2</td><td>+3 (MAX)</td><td>—</td></tr>
            <tr><td><b>UR</b></td><td>+0</td><td>+1</td><td>+2</td><td>+3</td><td>+4 (MAX)</td></tr>
            <tr><td><b>LR</b></td><td>+0</td><td>+1</td><td>+2</td><td>+3</td><td>+4 (MAX)</td></tr>
          </tbody>
        </table>
        <ul class="cg-rb-list" style="margin-top:14px">
          <li><b>半分凸以上</b>: onPlay 効果値 +1 (例: 元 +2 → +3)</li>
          <li><b>MAX 凸</b>: コスト -1 + 効果範囲拡大 (self_lane → adjacent_lanes 等)</li>
        </ul>
      </div>`;
  }
}

// B-1.B: 状態 badge レンダラ (スマホでも見えるよう カード右側に縦積み、 タップで詳細)
function _renderStatusBadges(card) {
  const badges = [];
  if ((card._frozenTurns || 0) > 0) {
    badges.push(`<span class="cg-state-badge state-frozen" data-state="frozen" title="❄ 凍結 ${card._frozenTurns}ターン: power 0">❄${card._frozenTurns > 1 ? card._frozenTurns : ''}</span>`);
  }
  if ((card._stealthTurns || 0) > 0) {
    badges.push(`<span class="cg-state-badge state-stealth" data-state="stealth" title="🌫 ステルス ${card._stealthTurns}ターン: 相手効果対象外">🌫${card._stealthTurns > 1 ? card._stealthTurns : ''}</span>`);
  }
  if (card._silenced) {
    badges.push(`<span class="cg-state-badge state-silenced" data-state="silenced" title="🔇 沈黙: onPlay効果無効化">🔇</span>`);
  }
  if (card._immediateBonus) {
    badges.push(`<span class="cg-state-badge state-immediate" data-state="immediate" title="⚡ 即時 +${card._immediateBonus}: 配置ターンのみ">⚡+${card._immediateBonus}</span>`);
  }
  if (card._growthCount) {
    badges.push(`<span class="cg-state-badge state-growth" data-state="growth" title="🌱 成長 +${card._growthCount}: ターン毎+1蓄積">🌱+${card._growthCount}</span>`);
  }
  if (card._goldenBuff) {
    badges.push(`<span class="cg-state-badge state-golden" data-state="golden" title="✨ 黄金化 +${card._goldenBuff}: 退場まで持続">✨+${card._goldenBuff}</span>`);
  }
  return badges.length > 0 ? `<div class="cg-state-badges">${badges.join('')}</div>` : '';
}

// A-3: 凸毎効果 段階表 (凸0 / +half / MAX、 各段で 基礎pow / cost / 効果文 を表示)
function _renderDupeStageTable(card) {
  const wrap = $('#char-detail-dupe-stages');
  if (!wrap) return;
  const max = MAX_DUPS[card.tier] || 0;
  if (max === 0) {
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = '';
  // 全段階表示 (野沢さん指示 2026-05-06、 0凸〜MAX 凸の各段階で ﾊﾟﾜｰ +1 を見やすく)
  const stages = [];
  for (let d = 0; d <= max; d++) {
    const isMax = d === max;
    const isHalf = !isMax && d >= Math.ceil(max / 2);
    let suffix = '';
    if (isMax) suffix = ' (MAX)';
    else if (isHalf) suffix = ' (効果+1)';
    stages.push({ label: `${d}凸${suffix}`, dupes: d });
  }
  const curDupes = card.dupes || 0;
  const fakeCardAt = (d) => ({ ...card, dupes: d });
  wrap.innerHTML = `<h3 class="cg-dupe-stage-title">📊 凸毎の効果</h3>
    <table class="cg-dupe-stage-table">
      <colgroup>
        <col class="col-stage"><col class="col-power"><col class="col-cost"><col class="col-eff">
      </colgroup>
      <thead><tr><th>段階</th><th>ﾊﾟﾜｰ</th><th>ｺｽﾄ</th><th>効果</th></tr></thead>
      <tbody>
        ${stages.map(s => {
          const fc = fakeCardAt(s.dupes);
          const bonus = dupeBonusOf(fc);
          const tp = card.basePower + bonus;
          const ec = effectiveCost(fc);
          const effDesc = _describeEffect(fc);
          const isCur = curDupes === s.dupes;
          return `<tr class="${isCur ? 'cg-dupe-stage-current' : ''}">
            <td>${s.label}${isCur ? ' <span class="cg-dupe-stage-cur-mark">◀現在</span>' : ''}</td>
            <td>${bonus > 0 ? `${card.basePower}+${bonus}=<b>${tp}</b>` : `<b>${tp}</b>`}</td>
            <td>${ec !== card.cost ? `<s class="cg-cost-orig">${card.cost}</s><b>${ec}</b>` : `<b>${ec}</b>`}</td>
            <td class="cg-dupe-effect-cell">${effDesc}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// 野沢さん指示 2026-05-05: power 計算の内訳表示 (場のカードのみ、 手札では非表示)
function _renderPowerBreakdown(card) {
  const wrap = document.getElementById('char-detail-power-breakdown');
  if (!wrap) return;
  // カードが場にあるか検索 (board ref で見つかれば 内訳出す)
  let foundSide = null, foundLane = null, foundCard = null;
  ['me', 'opp'].forEach(side => {
    state.board[side].forEach((lane, L) => {
      lane.forEach(c => { if (c.id === card.id) { foundSide = side; foundLane = L; foundCard = c; } });
    });
  });
  if (!foundCard) {
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = '';
  const c = foundCard;
  const isFrozen = (c._frozenTurns || 0) > 0;
  const base = c.basePower;
  const dupe = dupeBonusOf(c);
  // _currentPower にすでに base+dupe + 累積 buff/debuff が入っている
  const cpBase = c._currentPower != null ? c._currentPower : (base + dupe);
  // _currentPower 内訳 (delta = cpBase - base - dupe = 累積 buff/debuff)
  const buffDelta = cpBase - base - dupe;
  const immediate = c._immediateBonus || 0;
  const growth = c._growthCount || 0;
  const golden = c._goldenBuff || 0;
  // lane 効果
  let laneFx = 0;
  const e = state.laneEffects[foundLane];
  if (e) {
    if (e.rule === 'all_self' && foundSide === 'me') laneFx = e.value;
    else if (e.rule === 'all_opp' && foundSide === 'opp') laneFx = e.value;
    else laneFx = laneEffectFor(c, foundLane);
  }
  // 派閥シナジー
  const synergy = factionSynergyFor(c, foundSide, foundLane);
  // コンボ (このカード単体には付かないが、 lane bonus として表示)
  const laneCombo = comboLaneBonus(foundSide, foundLane);
  const total = isFrozen ? 0 : (cpBase + immediate + growth + golden + laneFx + synergy);
  const rows = [];
  rows.push(['基礎パワー', base]);
  if (dupe) rows.push([`凸ボーナス (${c.tier}凸${c.dupes||0})`, `+${dupe}`]);
  if (buffDelta) rows.push([`onPlay 累積 (相手効果含む)`, `${buffDelta >= 0 ? '+' : ''}${buffDelta}`]);
  if (immediate) rows.push([`即時 (このターンのみ)`, `+${immediate}`]);
  if (growth) rows.push([`成長 (毎ターン+1 蓄積)`, `+${growth}`]);
  if (golden) rows.push([`黄金化 (永続)`, `+${golden}`]);
  if (laneFx) rows.push([`レーン効果 ${e?e.icon:''} ${e?e.name:''}`, `${laneFx >= 0 ? '+' : ''}${laneFx}`]);
  if (synergy) rows.push([`派閥シナジー (同レーン同派閥 ${state.board[foundSide][foundLane].filter(x => x.faction === c.faction).length}人)`, `+${synergy}`]);
  if (isFrozen) rows.push([`❄ 凍結 (${c._frozenTurns}T) — power 0`, `→0`]);
  rows.push([`このカードの最終 power`, total]);
  if (laneCombo) rows.push([`レーン全体のコンボボーナス`, `+${laneCombo}`]);
  wrap.innerHTML = `
    <h3 class="cg-pwbreak-title">⚙ Power 計算 内訳 (場)</h3>
    <table class="cg-pwbreak-table">
      <tbody>
        ${rows.map(([k, v], i) => `<tr class="${i === rows.length - 1 || (i === rows.length - 2 && laneCombo) ? 'cg-pwbreak-total' : ''}"><td>${k}</td><td><b>${v}</b></td></tr>`).join('')}
      </tbody>
    </table>
    <div class="cg-pwbreak-note">※ コンボはレーン単位で 1 回適用 (各カードには分配されない)</div>
  `;
}

// 効果を凸数段階に応じて自然言語化 (effectiveEffect で動的に target/power が変わる)
function _describeEffect(card) {
  const e = effectiveEffect(card);
  if (!e || !e.trigger || e.trigger === 'none') return '<span class="cg-dupe-effect-none">効果なし</span>';
  const targetMap = {
    'self_lane': '自レーン',
    'adjacent_lanes': '両隣レーン',
    'all_lanes': '全レーン',
    'opp_self_lane': '相手の同レーン',
    'all_opp_lanes': '全相手レーン',
    'self_lane_attack': '自レーン+相手同レーン',
  };
  const power = e.power != null ? e.power : 0;
  // B-1.A 新メカニクス自然言語化
  switch (e.target) {
    case 'buff_faction_lane':
      return `自レーン 同派閥 +${power}`;
    case 'buff_faction_all':
      return `自軍 全レーン 同派閥 +${power}`;
    case 'freeze_opp_lane_top':
      return `相手 同レーン 最高Pwを ❄凍結${e.duration || 1}T${power ? ` / 自レーン +${power}` : ''}`;
    case 'freeze_opp_lane_all':
      return `相手 同レーン全員を ❄凍結${e.duration || 1}T${power ? ` / 自レーン +${power}` : ''}`;
    case 'silence_opp_lane_top':
      return `相手 同レーン 最高Pwの効果を 🔇沈黙${power ? ` / 自レーン +${power}` : ''}`;
    case 'immediate_self':
      return `⚡自身 +${power} (配置ターンのみ)${e.alsoSelfLane ? ` / 自レーン +${e.alsoSelfLane}` : ''}`;
    case 'stealth_self':
      return `🌫自身 ステルス ${e.duration || 1}T${power ? ` / 自レーン +${power}` : ''}`;
    case 'growth_self':
      return `🌱自身 成長 +1/T (毎ターン蓄積)${power ? ` / 自レーン +${power}` : ''}`;
    case 'cost_reduce_hand':
      return `💴手札 最高Costを -1${power ? ` / 自レーン +${power}` : ''}`;
    case 'summon_token':
      const tok = TOKEN_TEMPLATES[card.faction];
      const tname = tok ? tok.name : 'トークン';
      return `自レーンに ${tname} (Pw${tok ? tok.basePower : 2}) 召喚${power ? ` / 自レーン +${power}` : ''}`;
    case 'chain_lane_self':
      return `自身 += 自レーン自軍数 ×${e.multiplier || 1}${e.alsoSelfLane ? ` / 自レーン +${e.alsoSelfLane}` : ''}`;
    case 'golden_self_lane':
      return `自レーン 1体に ✨黄金化 +${e.goldPower}${power ? ` / 自レーン +${power}` : ''}`;
  }
  // 既存6種
  const tlabel = targetMap[e.target] || e.target;
  if (e.target === 'self_lane_attack') {
    return `${tlabel} (自軍 +${power}, 相手 ${e.oppPower || 0})`;
  }
  const sign = power >= 0 ? '+' : '';
  let txt = `${tlabel} ${sign}${power}`;
  if (e.selfBonus) txt += ` / 自身 +${e.selfBonus}`;
  if (e.comboBonus) txt += ` / コンボ +${e.comboBonus}`;
  if (e.auraSelfLane) txt += ` / 常時オーラ 自レーン +${e.auraSelfLane}`;
  if (e.auraOppLane) txt += ` / 常時オーラ 相手レーン ${e.auraOppLane}`;
  if (e.goldPower) txt += ` / ✨黄金化 +${e.goldPower}`;
  return txt;
}

// ===== レーン選択 (配置) =====
$$('#lanes-me .cg-lane').forEach(el => {
  el.addEventListener('click', (e) => {
    if (state.selectedCardIdx === -1 || state.busy || state.ended) return;
    // 子要素 (配置済カードの undo クリック) と競合しないように
    if (e.target.closest('.cg-card.undoable')) return;
    const lane = Number(el.dataset.lane);
    if (state.board.me[lane].length >= 4) {
      setMessage('そのレーンは満員 (4枚まで)', 'alert');
      return;
    }
    placeMyCard(state.selectedCardIdx, lane);
  });
});

function placeMyCard(handIdx, lane) {
  const card = { ...state.hand[handIdx] };
  card._currentPower = card.basePower + dupeBonusOf(card);
  card._appliedTo = [];
  // B-1.A: cost_reduce 反映 (handCard で適用された -1 を使用、 配置時に消費)
  const reducedCost = Math.max(1, effectiveCost(card) - (card._costReduced || 0));
  state.hand.splice(handIdx, 1);
  state.board.me[lane].push(card);
  state.costUsed += reducedCost;
  state.thisTurnPlacements.push({ cardId: card.id, lane });
  state.selectedCardIdx = -1;
  applyEffect(card, lane, 'me');
  $$('.lane-target').forEach(el => el.classList.remove('lane-target'));
  setMessage(`${card.name} を L${lane + 1} に配置 (${card.effectText || '効果なし'})`, 'success');
  state.busy = false; // 配置中に何かで残らないよう明示
  renderAll();
  setTimeout(() => {
    const slotsEl = $(`#me-slots-${lane}`);
    const last = slotsEl.lastElementChild;
    if (last) last.classList.add('placed-anim');
  }, 10);
}

// ===== B-1.A: トークン サモン (派閥別世界観反映) =====
const TOKEN_TEMPLATES = {
  '古龍砂漠サハール':   { name: '砂兵',     img: '', basePower: 2, faction: '古龍砂漠サハール' },
  '空挺城ゼノニア':     { name: '空挺兵',   img: '', basePower: 2, faction: '空挺城ゼノニア' },
  '夜焔郷':            { name: '影衆',     img: '', basePower: 2, faction: '夜焔郷' },
  '白焔教会':          { name: '詠唱兵',   img: '', basePower: 2, faction: '白焔教会' },
  '原虹':              { name: '虹片',     img: '', basePower: 3, faction: '原虹' },
  '紫竜王国':          { name: '竜兵',     img: '', basePower: 2, faction: '紫竜王国' },
  '紅玉海賊団':        { name: '海賊兵',   img: '', basePower: 2, faction: '紅玉海賊団' },
  'アクアシス':        { name: '海騎',     img: '', basePower: 2, faction: 'アクアシス' },
  '海淵都市アクアシス': { name: '海騎',     img: '', basePower: 2, faction: 'アクアシス' },
  '銀霜王国':          { name: '霜兵',     img: '', basePower: 2, faction: '銀霜王国' },
  '氷霊王国ニーヴル':   { name: '氷兵',     img: '', basePower: 2, faction: '氷霊王国ニーヴル' },
  '紅翼皇家':          { name: '紅羽',     img: '', basePower: 2, faction: '紅翼皇家' },
  '黒月衆ノクトス':     { name: '影刀',     img: '', basePower: 2, faction: '黒月衆ノクトス' },
};
function _makeToken(faction) {
  const t = TOKEN_TEMPLATES[faction] || { name: '召喚兵', basePower: 2, faction: faction };
  return {
    id: 'token_' + Math.random().toString(36).slice(2, 10),
    name: t.name,
    tier: 'TOKEN',
    cost: 0,
    basePower: t.basePower,
    faction: t.faction,
    role: 'token',
    chapter: 'token',
    img: '',
    dupes: 0,
    dupeBonus: 0,
    effectText: 'トークン (基礎パワーのみ)',
    effect: { trigger: 'none', target: 'none', power: 0 },
    _isToken: true,
  };
}

// ===== 効果発動 (onPlay、 凸数で範囲拡大 + power +1、 B-1.A 9 新メカニクス) =====
function applyEffect(card, lane, side) {
  const eff = effectiveEffect(card);
  if (!eff || eff.trigger !== 'onPlay') return;
  const myBoard = state.board[side];
  const oppSide = side === 'me' ? 'opp' : 'me';
  const oppBoard = state.board[oppSide];

  // B-1.A: stealth 状態のカードは effect 対象外 (相手 onPlay の target にしない)
  const isOppTargetable = (c) => !(c._stealthTurns > 0);

  const add = (target, delta) => {
    if (target === card) return; // 自身への onPlay 加算は selfBonus 別経路
    target._currentPower = (target._currentPower != null ? target._currentPower : (target.basePower + dupeBonusOf(target))) + delta;
    if (!card._appliedTo) card._appliedTo = [];
    card._appliedTo.push({ target, delta });
  };

  switch (eff.target) {
    case 'self_lane':
      myBoard[lane].forEach(c => add(c, eff.power));
      break;
    case 'adjacent_lanes':
      [lane - 1, lane + 1].filter(L => L >= 0 && L <= 2).forEach(L => {
        myBoard[L].forEach(c => add(c, eff.power));
      });
      break;
    case 'all_lanes':
      [0, 1, 2].forEach(L => myBoard[L].forEach(c => add(c, eff.power)));
      break;
    case 'opp_self_lane':
      oppBoard[lane].filter(isOppTargetable).forEach(c => add(c, eff.power));
      break;
    case 'all_opp_lanes':
      [0, 1, 2].forEach(L => oppBoard[L].filter(isOppTargetable).forEach(c => add(c, eff.power)));
      break;
    case 'self_lane_attack':
      myBoard[lane].forEach(c => add(c, eff.power));
      oppBoard[lane].filter(isOppTargetable).forEach(c => add(c, eff.oppPower || 0));
      break;

    // ===== B-1.A 新メカニクス =====
    case 'buff_faction_lane': {
      // 自レーン 同派閥のみ +N
      const fac = eff.faction || card.faction;
      myBoard[lane].forEach(c => { if (c.faction === fac) add(c, eff.power); });
      break;
    }
    case 'buff_faction_all': {
      // 自軍 全レーン 同派閥 +N (ヴィオラ growth と組合せ)
      const fac = eff.faction || card.faction;
      [0, 1, 2].forEach(L => myBoard[L].forEach(c => { if (c.faction === fac) add(c, eff.power); }));
      break;
    }
    case 'freeze_opp_lane_top': {
      // 相手 同レーン 最高 power カードを 1ターン freeze
      const cands = oppBoard[lane].filter(isOppTargetable);
      if (cands.length === 0) break;
      cands.sort((a, b) => getCardPower(b, oppSide, lane) - getCardPower(a, oppSide, lane));
      const dur = eff.duration || 1;
      cands[0]._frozenTurns = (cands[0]._frozenTurns || 0) + dur;
      card._sideEffects = card._sideEffects || [];
      card._sideEffects.push({ type: 'freeze', target: cands[0], delta: dur });
      if (eff.power) myBoard[lane].forEach(c => add(c, eff.power));
      break;
    }
    case 'freeze_opp_lane_all': {
      const dur = eff.duration || 1;
      oppBoard[lane].filter(isOppTargetable).forEach(c => {
        c._frozenTurns = (c._frozenTurns || 0) + dur;
        card._sideEffects = card._sideEffects || [];
        card._sideEffects.push({ type: 'freeze', target: c, delta: dur });
      });
      if (eff.power) myBoard[lane].forEach(c => add(c, eff.power));
      break;
    }
    case 'silence_opp_lane_top': {
      const cands = oppBoard[lane].filter(isOppTargetable);
      if (cands.length === 0) break;
      cands.sort((a, b) => getCardPower(b, oppSide, lane) - getCardPower(a, oppSide, lane));
      const tgt = cands[0];
      const prevSilenced = !!tgt._silenced;
      _silenceCard(tgt);
      card._sideEffects = card._sideEffects || [];
      card._sideEffects.push({ type: 'silence', target: tgt, prevSilenced });
      if (eff.power) myBoard[lane].forEach(c => add(c, eff.power));
      break;
    }
    case 'immediate_self': {
      // 野沢さん指示 2026-05-05 「このターンのみ効果はゲーム性に合わない」 → 廃止
      // 後方互換: もし古い save data に残っていたら 永続 selfBonus に置き換える
      card._currentPower = (card._currentPower != null ? card._currentPower : (card.basePower + dupeBonusOf(card))) + eff.power;
      if (eff.alsoSelfLane) myBoard[lane].forEach(c => { if (c !== card) add(c, eff.alsoSelfLane); });
      break;
    }
    case 'stealth_self': {
      // 自身に stealth 1ターン (相手の効果対象外、 endTurn 時に decrement)
      card._stealthTurns = (card._stealthTurns || 0) + (eff.duration || 1);
      if (eff.power) myBoard[lane].forEach(c => add(c, eff.power));
      break;
    }
    case 'growth_self': {
      // 自身に毎ターン +1 蓄積 (drawTurnStart で _growthCount++)
      card._growthCount = card._growthCount || 0;
      card._growthEnabled = true;
      if (eff.power) myBoard[lane].forEach(c => add(c, eff.power));
      break;
    }
    case 'cost_reduce_hand': {
      // 野沢さん指示 2026-05-05: 1試合 1回限定 (アクアシス過剰強化対策)
      const usedKey = side === 'me' ? '_costReduceUsedMe' : '_costReduceUsedOpp';
      if (state[usedKey]) {
        // 既使用、 power 補助のみ適用 (cost reduce はスキップ)
        if (eff.power) myBoard[lane].forEach(c => add(c, eff.power));
        break;
      }
      const hand = side === 'me' ? state.hand : state.oppHand;
      if (hand.length === 0) {
        if (eff.power) myBoard[lane].forEach(c => add(c, eff.power));
        break;
      }
      const candidates = hand.filter(h => !h._costReduced);
      if (candidates.length === 0) {
        if (eff.power) myBoard[lane].forEach(c => add(c, eff.power));
        break;
      }
      candidates.sort((a, b) => b.cost - a.cost);
      const tgtHand = candidates[0];
      tgtHand._costReduced = (tgtHand._costReduced || 0) + 1;
      state[usedKey] = true;
      card._sideEffects = card._sideEffects || [];
      card._sideEffects.push({ type: 'cost_reduce', handCard: tgtHand, delta: 1, usedKey });
      if (eff.power) myBoard[lane].forEach(c => add(c, eff.power));
      break;
    }
    case 'summon_token': {
      if (myBoard[lane].length >= 4) break;
      const tok = _makeToken(card.faction);
      tok._currentPower = tok.basePower;
      myBoard[lane].push(tok);
      card._sideEffects = card._sideEffects || [];
      card._sideEffects.push({ type: 'token', tokenId: tok.id, lane });
      if (eff.power) myBoard[lane].forEach(c => { if (c !== tok) add(c, eff.power); });
      break;
    }
    case 'chain_lane_self': {
      // 自身 += 自レーン 自軍カード数 (即時、 chain)
      const allyCount = myBoard[lane].length;  // card 本人含む
      const bonus = allyCount * (eff.multiplier || 1);
      card._currentPower = (card._currentPower != null ? card._currentPower : (card.basePower + dupeBonusOf(card))) + bonus;
      if (eff.alsoSelfLane) myBoard[lane].forEach(c => { if (c !== card) add(c, eff.alsoSelfLane); });
      break;
    }
    case 'golden_self_lane': {
      const cands = myBoard[lane].filter(c => c !== card);
      if (cands.length > 0) {
        cands.sort((a, b) => getCardPower(a, side, lane) - getCardPower(b, side, lane));
        const tgt = cands[0];
        tgt._goldenBuff = (tgt._goldenBuff || 0) + eff.goldPower;
        card._sideEffects = card._sideEffects || [];
        card._sideEffects.push({ type: 'golden', target: tgt, delta: eff.goldPower });
      }
      if (eff.power) myBoard[lane].forEach(c => { if (c !== card) add(c, eff.power); });
      break;
    }
  }
  if (eff.selfBonus) {
    card._currentPower = (card._currentPower != null ? card._currentPower : (card.basePower + dupeBonusOf(card))) + eff.selfBonus;
  }
  // B-1.A: コンボパワー強化 (プリズマの「観測の祝福」 等) は getGlobalComboBonus(side) で動的計算 (board 上のカードから自動集計)
}

// B-1.D: snapshot/restore helper (master AI sim の完全復元用)
const _STATE_FIELDS = ['_currentPower', '_appliedTo', '_frozenTurns', '_stealthTurns', '_silenced',
  '_immediateBonus', '_immediateAppliedTurn', '_growthCount', '_growthEnabled', '_goldenBuff', '_costReduced'];
function _snapshotCard(card) {
  const snap = {};
  _STATE_FIELDS.forEach(f => {
    if (f === '_appliedTo' && Array.isArray(card[f])) snap[f] = [...card[f]];
    else snap[f] = card[f];
  });
  return snap;
}
function _restoreCard(card, snap) {
  _STATE_FIELDS.forEach(f => {
    if (snap[f] === undefined) delete card[f];
    else card[f] = snap[f];
  });
}

// B-1.A: silence helper — 対象カードの _appliedTo を全 revert (与えていた buff/debuff を消す)
function _silenceCard(target) {
  if (!target || target._silenced) return;
  if (target._appliedTo) {
    target._appliedTo.forEach(({ target: t, delta }) => {
      if (!t) return;
      t._currentPower = (t._currentPower != null ? t._currentPower : (t.basePower + dupeBonusOf(t))) - delta;
    });
    target._appliedTo = [];
  }
  // 自身の selfBonus も revert (effectiveEffect から再計算)
  const eff = effectiveEffect(target);
  if (eff && eff.selfBonus) {
    target._currentPower = (target._currentPower != null ? target._currentPower : (target.basePower + dupeBonusOf(target))) - eff.selfBonus;
  }
  target._silenced = true;
}

// ===== 配置取消 (個別カード undo) =====
function undoMyCard(lane, boardIdx) {
  if (state.busy || state.ended) return;
  const card = state.board.me[lane][boardIdx];
  if (!card) return;
  // ターン内に配置したカードかチェック
  const placementIdx = state.thisTurnPlacements.findIndex(p => p.cardId === card.id && p.lane === lane);
  if (placementIdx === -1) {
    setMessage('前のターンに配置したカードは手札に戻せません', 'alert');
    return;
  }
  // バグ修正 2026-05-04: 新メカニクスの side effect も revert
  if (card._sideEffects) {
    [...card._sideEffects].reverse().forEach(se => {
      switch (se.type) {
        case 'freeze': se.target._frozenTurns = Math.max(0, (se.target._frozenTurns || 0) - se.delta); break;
        case 'silence': se.target._silenced = !!se.prevSilenced; break;
        case 'token': {
          for (let L = 0; L < 3; L++) {
            const idx = state.board.me[L].findIndex(c => c.id === se.tokenId);
            if (idx >= 0) { state.board.me[L].splice(idx, 1); break; }
          }
          break;
        }
        case 'golden': se.target._goldenBuff = (se.target._goldenBuff || 0) - se.delta; break;
        case 'cost_reduce':
          se.handCard._costReduced = Math.max(0, (se.handCard._costReduced || 0) - se.delta);
          if (se.usedKey) state[se.usedKey] = false;  // 1試合1回フラグも解除
          break;
      }
    });
    card._sideEffects = [];
  }
  // 効果を逆適用
  if (card._appliedTo) {
    card._appliedTo.forEach(({ target, delta }) => {
      target._currentPower = (target._currentPower != null ? target._currentPower : (target.basePower + dupeBonusOf(target))) - delta;
    });
  }
  state.board.me[lane].splice(boardIdx, 1);
  // B-1.A: cost_reduce 適用後の cost で返却 (二重計算防止)
  const refundCost = Math.max(1, effectiveCost(card) - (card._costReduced || 0));
  state.costUsed -= refundCost;
  state.thisTurnPlacements.splice(placementIdx, 1);
  // hand に戻す (state を綺麗に)
  delete card._appliedTo;
  delete card._currentPower;
  delete card._immediateBonus;
  delete card._immediateAppliedTurn;
  delete card._frozenTurns;
  delete card._stealthTurns;
  delete card._growthCount;
  delete card._growthEnabled;
  delete card._silenced;
  delete card._goldenBuff;
  delete card._sideEffects;
  state.hand.push(card);
  setMessage(`${card.name} を手札に戻した (⚡${card.cost} 返却)`, 'success');
  renderAll();
}

// ===== 配置リセット (ターン中の全 undo) =====
function resetThisTurn() {
  if (state.busy || state.ended) return;
  if (state.thisTurnPlacements.length === 0) return;
  // 後ろから順に undo
  while (state.thisTurnPlacements.length > 0) {
    const p = state.thisTurnPlacements[state.thisTurnPlacements.length - 1];
    let found = -1, foundLane = -1;
    for (let L = 0; L < 3; L++) {
      const idx = state.board.me[L].findIndex(c => c.id === p.cardId);
      if (idx !== -1) { found = idx; foundLane = L; break; }
    }
    if (found === -1) {
      state.thisTurnPlacements.pop();
      continue;
    }
    undoMyCard(foundLane, found);
  }
  setMessage('ターン中の配置を全てリセット', 'success');
}

// ===== ターン終了 =====
$('#btn-end-turn').addEventListener('click', endTurn);

async function endTurn() {
  if (state.busy || state.ended) return;
  state.busy = true;
  $('#btn-end-turn').disabled = true;
  $('#btn-undo').disabled = true;
  $$('.lane-target').forEach(el => el.classList.remove('lane-target'));

  // 後攻時、 ターン頭で AI 既に配置済 → このターンで AI 動作スキップ
  if (!state.thisTurnAiDone) {
    setMessage('AIの手番...');
    await sleep(400);
    await aiTurn();
  }

  // B-1.A: ターン終了時 — immediate buff の有効期限 (配置ターン終わり) を切る
  ['me', 'opp'].forEach(side => {
    [0, 1, 2].forEach(L => {
      state.board[side][L].forEach(c => {
        if (c._immediateAppliedTurn === state.turn && c._immediateBonus) {
          c._immediateBonus = 0;
          c._immediateAppliedTurn = null;
        }
      });
    });
  });

  if (state.turn >= state.maxTurn) {
    state.busy = false;
    finishMatch();
    return;
  }
  state.turn += 1;
  await drawTurnStart();
  if (state.firstMover === 'me') {
    setMessage(`T${state.turn}`);
  }
  state.busy = false;
  renderAll();
}

// ===== AI 手番 (4段階: easy / normal / hard / master) =====
async function aiTurn() {
  let aiCost = state.turn;
  let aiCostUsed = 0;
  let attempts = 0;
  const diff = state.difficulty;
  while (aiCostUsed < aiCost && attempts < 8) {
    attempts++;
    const remaining = aiCost - aiCostUsed;
    // B-1.A: AI も effectiveCost (MAX凸 / cost_reduce 反映) を使う
    const aiEffCost = (c) => Math.max(1, effectiveCost(c) - (c._costReduced || 0));
    const playable = state.oppHand.map((c, i) => ({ c, i })).filter(x => aiEffCost(x.c) <= remaining);
    if (playable.length === 0) break;
    const openLanes = [0, 1, 2].filter(L => state.board.opp[L].length < 4);
    if (openLanes.length === 0) break;

    let pickIdx, lane;

    if (diff === 'easy') {
      // ランダム、 50% 早期終了 (温存気味)
      const p = playable[Math.floor(Math.random() * playable.length)];
      pickIdx = p.i;
      lane = openLanes[Math.floor(Math.random() * openLanes.length)];
      if (Math.random() < 0.4) break;
    } else if (diff === 'normal') {
      // コスト最大 + 最劣勢レーン補強
      playable.sort((a, b) => b.c.cost - a.c.cost);
      pickIdx = playable[0].i;
      const lanes = openLanes.map(L => ({L, d: getLanePower('opp', L) - getLanePower('me', L)}));
      lanes.sort((a, b) => a.d - b.d);
      lane = lanes[0].L;
    } else if (diff === 'hard') {
      // (card, lane) 評価: コスト価値 + 同派閥シナジー + 劣勢補強 + 高コストカードは終盤温存 + 新メカニクス
      let best = null;
      for (const p of playable) {
        for (const L of openLanes) {
          let score = p.c.cost * 1.5;
          // 同派閥 シナジー (同派閥 既に N人 → +N*2)
          const sameFac = state.board.opp[L].filter(c => c.faction === p.c.faction).length;
          score += sameFac * 2;
          // 劣勢補強
          const myDiff = getLanePower('me', L) - getLanePower('opp', L);
          if (myDiff > 0) score += myDiff * 0.6;
          // レーン効果と一致するカードを優先
          const e = state.laneEffects[L];
          if (e) {
            if (e.rule === 'cost_ge' && p.c.cost >= e.threshold) score += e.value * 1.5;
            if (e.rule === 'cost_le' && p.c.cost <= e.threshold) score += e.value * 1.5;
            if (e.rule === 'faction' && p.c.faction === e.faction) score += e.value * 2;
          }
          // B-1.D: 新メカニクス評価 (effect.target に応じて bonus)
          const eff = effectiveEffect(p.c) || {};
          const power = eff.power || 0;
          switch (eff.target) {
            case 'freeze_opp_lane_top': score += 4 + power; break;  // 高価値 (相手最高pow無効化)
            case 'freeze_opp_lane_all': score += state.board.me[L].length * 2 + power; break;
            case 'silence_opp_lane_top': score += 3 + power; break;
            case 'summon_token': score += 2 + power; break;  // 余分 body
            case 'chain_lane_self': score += state.board.opp[L].length * (eff.multiplier || 1); break;
            case 'buff_faction_lane': score += sameFac * (power || 1); break;
            case 'growth_self': score += (state.maxTurn - state.turn + 1) * 1; break;  // 残ターン数で価値変動
            case 'immediate_self': score += power; break;  // この turn のみ
            case 'cost_reduce_hand': score += 1.5; break;
            case 'golden_self_lane': score += 3; break;
            case 'all_lanes': score += power * 3; break;
            case 'all_opp_lanes': score += Math.abs(power) * 2; break;
            case 'self_lane_attack': score += power + Math.abs(eff.oppPower || 0); break;
          }
          if (eff.comboBonus) score += 2;
          // 高コストは終盤温存 (残ターン数考慮)
          const remainingTurns = state.maxTurn - state.turn + 1;
          if (p.c.cost > remainingTurns * 1.5) score -= 1;
          if (!best || score > best.score) best = { i: p.i, L, score };
        }
      }
      if (!best) break;
      pickIdx = best.i; lane = best.L;
    } else if (diff === 'master') {
      // 1-ply look-ahead: 配置 simulate → power gain (自) - power loss (相手) を最大化 + コンボ評価 + 派閥シナジー累積
      // B-1.D: 新メカニクス対応 — 全カード状態を snapshot/restore で完全復元
      let best = null;
      for (const p of playable) {
        for (const L of openLanes) {
          // === snapshot (全カード + 全 hand の状態) ===
          const allBoardCards = [].concat(...state.board.opp, ...state.board.me);
          const cardSnaps = allBoardCards.map(c => _snapshotCard(c));
          const handSnaps = state.oppHand.map(h => _snapshotCard(h));
          const oppLaneLengthsBefore = [0, 1, 2].map(LL => state.board.opp[LL].length);

          // === simulate ===
          const card = { ...p.c, _currentPower: p.c.basePower + dupeBonusOf(p.c), _appliedTo: [] };
          state.board.opp[L].push(card);
          applyEffect(card, L, 'opp');

          // === score ===
          let score = 0;
          for (let LL = 0; LL < 3; LL++) {
            const oppP = getLanePower('opp', LL);
            const meP = getLanePower('me', LL);
            score += oppP - meP;
            if (oppP > meP) score += 5;
          }
          for (const combo of state.combos) {
            const oppCardsAll = [].concat(...state.board.opp);
            const inLane = state.board.opp[L];
            let trig = false;
            if (combo.condition === 'same_lane') trig = combo.chars.every(c => inLane.some(x => x.name === c));
            else if (combo.condition === 'any_lane') trig = combo.chars.every(c => oppCardsAll.some(x => x.name === c));
            if (trig) score += combo.effect.power * 1.5;
          }

          // === restore (snapshot から完全復元、 token 追加分も削除) ===
          // 1. simulate で追加した card + token を board から削除
          [0, 1, 2].forEach(LL => {
            const expected = oppLaneLengthsBefore[LL];
            while (state.board.opp[LL].length > expected) state.board.opp[LL].pop();
          });
          // 2. allBoardCards (snap対象) の状態を restore
          allBoardCards.forEach((c, i) => _restoreCard(c, cardSnaps[i]));
          // 3. hand の _costReduced 等も restore
          state.oppHand.forEach((h, i) => { if (handSnaps[i]) _restoreCard(h, handSnaps[i]); });

          if (!best || score > best.score) best = { i: p.i, L, score };
        }
      }
      if (!best) break;
      pickIdx = best.i; lane = best.L;
    }

    const pickedCard = playable.find(x => x.i === pickIdx)?.c;
    const cardCost = pickedCard ? aiEffCost(pickedCard) : 0;
    placeAICard(pickIdx, lane);
    aiCostUsed += cardCost;
    await sleep(diff === 'easy' ? 350 : 250);
  }
  setMessage(`AI が ${aiCostUsed} コスト分配置`, 'success');
}

function placeAICard(handIdx, lane) {
  const card = { ...state.oppHand[handIdx] };
  card._currentPower = card.basePower + dupeBonusOf(card);
  card._appliedTo = [];
  state.oppHand.splice(handIdx, 1);
  state.board.opp[lane].push(card);
  applyEffect(card, lane, 'opp');
  renderAll();
  setTimeout(() => {
    const slotsEl = $(`#opp-slots-${lane}`);
    const last = slotsEl.lastElementChild;
    if (last) last.classList.add('placed-anim');
  }, 10);
}

// ===== PCB プレイ履歴 (Firebase Cloud 蓄積、 アカウント依存) =====
const PCB_HISTORY_MAX = 50;

// AI レベル別 連勝数 (ホームの各 AI モードボタンに表示)
function _streakForDiff(diff) {
  const hist = pcbCloud.history || [];
  let streak = 0;
  for (const h of hist) {
    if (h.difficulty !== diff) continue;
    if (h.result === 'win') streak++;
    else break;
  }
  return streak;
}
function _renderHomeStreaks() {
  const screen = document.getElementById('home-screen');
  if (!screen) return;
  ['easy', 'normal', 'hard', 'master'].forEach(diff => {
    const el = screen.querySelector(`[data-streak="${diff}"]`);
    if (!el) return;
    const n = _streakForDiff(diff);
    if (n >= 2) {
      el.textContent = `🔥 ${n}連勝中`;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });
}

// ホーム 使用中デッキプレビュー + 性能ヒント (野沢さん指示 2026-05-06、 案2 + 案4)
function _renderHomeDeckPreview() {
  const previewEl = document.getElementById('cg-deck-preview');
  const hintEl = document.getElementById('cg-deck-hint');
  if (!previewEl || !hintEl) return;
  if (!state || !state.allCards || state.allCards.length === 0) {
    hintEl.textContent = '読込中…';
    previewEl.innerHTML = '';
    return;
  }
  let deck;
  try { deck = getCurrentDeck(); } catch (e) { deck = []; }
  if (!deck || deck.length === 0) {
    hintEl.textContent = 'デッキ未設定';
    previewEl.innerHTML = '';
    return;
  }
  // 12 サムネ表示 (tier クラス + 凸マーク)
  const dups = (typeof getUserDupCounts === 'function') ? getUserDupCounts() : {};
  previewEl.innerHTML = deck.map(c => {
    const dup = dups[c.name] || 0;
    const dupBadge = dup > 0 ? `<span class="cg-preview-dup">+${dup}</span>` : '';
    const img = c.img ? `..${c.img}` : '';
    return `<div class="cg-preview-card cg-tier-${(c.tier || '').toLowerCase()}" title="${c.name} (${c.tier} ${c.cost}/${c.basePower})">
      <img src="${img}" alt="${c.name}" loading="lazy">
      ${dupBadge}
    </div>`;
  }).join('');
  // 性能ヒント計算
  const facCount = {};
  deck.forEach(c => {
    const f = c.faction || '無所属';
    facCount[f] = (facCount[f] || 0) + 1;
  });
  const sortedFac = Object.entries(facCount).sort((a, b) => b[1] - a[1]);
  const topFac = sortedFac[0];
  const topFacName = topFac ? topFac[0] : '無所属';
  const topFacCount = topFac ? topFac[1] : 0;
  // コンボ数 (デッキ12枚で揃うコンボ)
  const deckNames = new Set(deck.map(c => c.name));
  const combos = (state && state.combos) || [];
  const matchedCombos = combos.filter(co =>
    Array.isArray(co.chars) && co.chars.every(n => deckNames.has(n))
  ).length;
  // 派閥数
  const facCountTotal = Object.keys(facCount).length;
  // ヒント文 組み立て
  let typeLabel;
  if (topFacCount >= 6) typeLabel = `${topFacName} 特化型`;
  else if (topFacCount >= 4) typeLabel = `${topFacName} 主軸型`;
  else if (facCountTotal >= 5) typeLabel = `多派閥バランス型`;
  else typeLabel = `${topFacName} 寄り混合型`;
  hintEl.textContent = `🎯 ${typeLabel} / コンボ ${matchedCombos}個 / 派閥 ${facCountTotal}種`;
}

// ホーム 戦績ダッシュボード + 🏆 ポイント (Cloud)
function _renderHomeStats() {
  const stats = pcbCloud.stats || {};
  const m = document.getElementById('cg-stat-matches');
  const w = document.getElementById('cg-stat-winrate');
  const p = document.getElementById('cg-stat-points');
  const total = stats.totalMatches || 0;
  const wins = stats.wins || 0;
  const wr = total > 0 ? Math.round(wins / total * 100) : 0;
  if (m) m.textContent = String(total);
  if (w) w.textContent = total > 0 ? `${wr}%` : '-%';
  if (p) p.textContent = String(stats.pcbPoints || 0);
}

// ショップ Phase 2: 衣装+マット販売、 アカウント保持 (Firebase /shopData/$uid/)
let SHOP_ITEMS = { mats: [], costumes: [] };
let _currentShopTab = 'mat';

async function _loadShopItems() {
  if (SHOP_ITEMS.mats.length > 0) return SHOP_ITEMS;
  try {
    const res = await fetch('./data/shop_items.json');
    SHOP_ITEMS = await res.json();
  } catch (e) {
    console.error('shop items load failed', e);
  }
  return SHOP_ITEMS;
}

function openShop() {
  const m = document.getElementById('shop-modal');
  if (!m) return;
  m.hidden = false;
  _setBodyModalOpen();
  const stats = pcbCloud.stats || {};
  const el = document.getElementById('shop-points');
  if (el) el.textContent = String(stats.pcbPoints || 0);
  _loadShopItems().then(() => _renderShopList());
}
function closeShop() {
  const m = document.getElementById('shop-modal');
  if (!m) return;
  m.hidden = true;
  _setBodyModalOpen();
}

function switchShopTab(tab) {
  _currentShopTab = tab;
  document.querySelectorAll('.cg-shop-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  _renderShopList();
}

function _shopOwned() {
  const sd = (pcbCloud.shopData || {});
  return sd.owned || {};
}
function _shopEquipped() {
  const sd = (pcbCloud.shopData || {});
  return sd.equipped || { mat: null, costumes: {} };
}

function _renderShopList() {
  const list = document.getElementById('shop-list');
  if (!list) return;
  const tab = _currentShopTab;
  const owned = _shopOwned();
  const equipped = _shopEquipped();
  const points = (pcbCloud.stats || {}).pcbPoints || 0;
  let items = [];
  if (tab === 'mat') items = SHOP_ITEMS.mats || [];
  else if (tab === 'costume') items = SHOP_ITEMS.costumes || [];
  else if (tab === 'owned') {
    items = [
      ...((SHOP_ITEMS.mats || []).filter(i => owned[i.id])),
      ...((SHOP_ITEMS.costumes || []).filter(i => owned[i.id])),
    ];
  }
  if (items.length === 0) {
    list.innerHTML = '<div class="cg-shop-empty">' + (tab === 'owned' ? '所持アイテムなし。 マット/衣装タブで購入してください。' : '商品がありません。') + '</div>';
    return;
  }
  list.innerHTML = items.map(item => {
    const isOwned = !!owned[item.id];
    const isEquipped = (item.id.startsWith('mat_') && equipped.mat === item.id) ||
                       (item.id.startsWith('cos_') && equipped.costumes && equipped.costumes[item.char] === item.id);
    const canBuy = !isOwned && points >= item.price;
    const btnLabel = isEquipped ? '✓ 適用中' : isOwned ? '🎯 適用' : `${item.price} pts で購入`;
    const btnClass = isEquipped ? 'cg-shop-btn-equipped' : isOwned ? 'cg-shop-btn-apply' : (canBuy ? 'cg-shop-btn-buy' : 'cg-shop-btn-disabled');
    const btnAction = isEquipped ? `unequipShopItem('${item.id}')` : isOwned ? `equipShopItem('${item.id}')` : `buyShopItem('${item.id}')`;
    const previewBtn = `<button type="button" class="cg-shop-btn-preview" onclick="event.stopPropagation(); previewShopItem('${item.id}')">プレビュー</button>`;
    return `
      <div class="cg-shop-item ${isOwned ? 'cg-shop-item-owned' : ''}">
        <div class="cg-shop-item-icon" style="${item.color ? `background:${item.color};` : ''}">${item.icon || '🎁'}</div>
        <div class="cg-shop-item-body">
          <div class="cg-shop-item-name">${item.name}${item.char ? ` <span class="cg-shop-item-char">(${item.char})</span>` : ''}</div>
          <div class="cg-shop-item-desc">${item.desc || ''}</div>
        </div>
        <div class="cg-shop-item-actions">
          ${previewBtn}
          <button type="button" class="cg-shop-btn ${btnClass}" ${canBuy || isOwned ? '' : 'disabled'} onclick="${btnAction}">${btnLabel}</button>
        </div>
      </div>`;
  }).join('');
}

function previewShopItem(itemId) {
  const all = [...(SHOP_ITEMS.mats || []), ...(SHOP_ITEMS.costumes || [])];
  const item = all.find(i => i.id === itemId);
  if (!item) return;
  const m = document.getElementById('shop-preview-modal');
  const body = document.getElementById('shop-preview-body');
  if (!m || !body) return;
  const isMat = item.id.startsWith('mat_');
  body.innerHTML = `
    <h3 class="cg-modal-title">${item.icon || '🎁'} ${item.name}</h3>
    ${item.char ? `<div class="cg-shop-preview-char">対象キャラ: ${item.char}</div>` : ''}
    <div class="cg-shop-preview-desc">${item.desc || ''}</div>
    <div class="cg-shop-preview-visual" style="${isMat ? `background:${item.color}; height:140px;` : 'height:140px; display:flex; align-items:center; justify-content:center; font-size:64px;'}">
      ${isMat ? '' : (item.icon || '🎁')}
    </div>
    <div class="cg-shop-preview-note">※ 画像は順次差し替え予定 (野沢さん側生成中)</div>
    <div class="cg-shop-preview-price">${item.price} pts</div>`;
  m.hidden = false;
  _setBodyModalOpen();
}
function closeShopPreview() {
  const m = document.getElementById('shop-preview-modal');
  if (!m) return;
  m.hidden = true;
  _setBodyModalOpen();
}

async function buyShopItem(itemId) {
  const all = [...(SHOP_ITEMS.mats || []), ...(SHOP_ITEMS.costumes || [])];
  const item = all.find(i => i.id === itemId);
  if (!item) return;
  const stats = pcbCloud.stats || {};
  const points = stats.pcbPoints || 0;
  if (points < item.price) {
    alert(`ポイント不足です (所持 ${points} pts、 必要 ${item.price} pts)`);
    return;
  }
  if (!confirm(`「${item.name}」 を ${item.price} pts で 購入しますか?`)) return;
  // ポイント減算 + owned 追加 (Firebase 同期)
  pcbCloud.stats.pcbPoints = points - item.price;
  pcbCloud.shopData = pcbCloud.shopData || { owned: {}, equipped: { mat: null, costumes: {} } };
  pcbCloud.shopData.owned = pcbCloud.shopData.owned || {};
  pcbCloud.shopData.owned[itemId] = { boughtAt: Date.now() };
  _pcbSet('stats', pcbCloud.stats);
  _pcbSet('shopData', pcbCloud.shopData);
  document.getElementById('shop-points').textContent = String(pcbCloud.stats.pcbPoints);
  _renderHomeStats();
  _renderShopList();
}

function equipShopItem(itemId) {
  const all = [...(SHOP_ITEMS.mats || []), ...(SHOP_ITEMS.costumes || [])];
  const item = all.find(i => i.id === itemId);
  if (!item) return;
  pcbCloud.shopData = pcbCloud.shopData || { owned: {}, equipped: { mat: null, costumes: {} } };
  pcbCloud.shopData.equipped = pcbCloud.shopData.equipped || { mat: null, costumes: {} };
  if (item.id.startsWith('mat_')) {
    pcbCloud.shopData.equipped.mat = item.id;
  } else if (item.id.startsWith('cos_')) {
    pcbCloud.shopData.equipped.costumes = pcbCloud.shopData.equipped.costumes || {};
    pcbCloud.shopData.equipped.costumes[item.char] = item.id;
  }
  _pcbSet('shopData', pcbCloud.shopData);
  _applyShopEquips();
  _renderShopList();
}

function unequipShopItem(itemId) {
  const all = [...(SHOP_ITEMS.mats || []), ...(SHOP_ITEMS.costumes || [])];
  const item = all.find(i => i.id === itemId);
  if (!item) return;
  pcbCloud.shopData = pcbCloud.shopData || { owned: {}, equipped: { mat: null, costumes: {} } };
  if (item.id.startsWith('mat_')) {
    pcbCloud.shopData.equipped.mat = null;
  } else if (item.id.startsWith('cos_')) {
    if (pcbCloud.shopData.equipped.costumes) delete pcbCloud.shopData.equipped.costumes[item.char];
  }
  _pcbSet('shopData', pcbCloud.shopData);
  _applyShopEquips();
  _renderShopList();
}

function _applyShopEquips() {
  // マット適用 (盤面背景 CSS)
  const equipped = _shopEquipped();
  const mat = (SHOP_ITEMS.mats || []).find(m => m.id === equipped.mat);
  document.documentElement.style.setProperty('--cg-mat-color', mat ? mat.color : '');
  document.body.classList.toggle('cg-mat-active', !!mat);
  // 衣装適用は キャラ image差替で _renderHand 等で 適用 (TODO Phase 2.1)
}

// AI レベル別 ポイント (野沢さん指示 2026-05-06、 アカウント単位累積、 ショップで使用)
const PCB_POINTS_BY_DIFF = { easy: 1, normal: 2, hard: 4, master: 8 };
const PCB_POINTS_BO3_BONUS = 5;

function _logPcbMatch(result, difficulty, isBO3, scoreMe, scoreOpp) {
  // result: 'win' | 'loss' | 'draw' | 'pause' (PvE 中断は記録しない)
  if (result === 'pause') return;
  const stats = pcbCloud.stats || (pcbCloud.stats = {});
  stats.totalMatches = (stats.totalMatches || 0) + 1;
  stats.wins = (stats.wins || 0) + (result === 'win' ? 1 : 0);
  stats.losses = (stats.losses || 0) + (result === 'loss' ? 1 : 0);
  stats.draws = (stats.draws || 0) + (result === 'draw' ? 1 : 0);
  stats.byDifficulty = stats.byDifficulty || {};
  stats.byDifficulty[difficulty] = stats.byDifficulty[difficulty] || { matches: 0, wins: 0, losses: 0, draws: 0 };
  stats.byDifficulty[difficulty].matches += 1;
  stats.byDifficulty[difficulty][result === 'win' ? 'wins' : (result === 'loss' ? 'losses' : 'draws')] += 1;
  if (isBO3) stats.bo3Matches = (stats.bo3Matches || 0) + 1;
  stats.lastPlayedAt = Date.now();
  if (result === 'win') {
    const baseFor = PCB_POINTS_BY_DIFF[difficulty] || 0;
    const bonus = isBO3 ? PCB_POINTS_BO3_BONUS : 0;
    stats.pcbPoints = (stats.pcbPoints || 0) + baseFor + bonus;
  }
  _pcbSet('stats', stats);
  // 直近 50 試合の履歴
  const history = pcbCloud.history || (pcbCloud.history = []);
  history.unshift({
    ts: Date.now(), result, difficulty, isBO3,
    scoreMe, scoreOpp,
    firstMover: state.firstMover,
  });
  if (history.length > PCB_HISTORY_MAX) history.length = PCB_HISTORY_MAX;
  _pcbSet('history', history);
}

// ===== 試合終了 (BO3 series 累積 / 単発リザルト) =====
function finishMatch() {
  state.ended = true;
  let me = 0, opp = 0;
  for (let L = 0; L < 3; L++) {
    const meP = getLanePower('me', L);
    const oppP = getLanePower('opp', L);
    if (meP > oppP) me++;
    else if (oppP > meP) opp++;
  }
  state.scoreMe = me;
  state.scoreOpp = opp;
  renderAll();

  // 試合結果の判定
  const matchResult = me > opp ? 'win' : (opp > me ? 'loss' : 'draw');

  // PCB プレイ履歴 logging (localStorage、 本体起動時に Firebase 同期)
  _logPcbMatch(matchResult, state.difficulty, state.series.isBO3, me, opp);

  // BO3 累積
  if (state.series.isBO3) {
    if (matchResult === 'win') state.series.wins.me += 1;
    else if (matchResult === 'loss') state.series.wins.opp += 1;
    state.series.results.push(matchResult);
  }

  // BO3 シリーズ判定
  const seriesEnded = !state.series.isBO3
    || state.series.wins.me >= 2
    || state.series.wins.opp >= 2
    || state.series.matchNo >= 3;

  let icon, title, detail;
  if (state.series.isBO3 && !seriesEnded) {
    // 次の試合へ
    icon = matchResult === 'win' ? '🎯' : (matchResult === 'loss' ? '💧' : '⚖️');
    const r = matchResult === 'win' ? '勝利' : (matchResult === 'loss' ? '敗北' : '引き分け');
    title = `第${state.series.matchNo}試合 ${r}`;
    detail = `BO3モード 累積 — あなた ${state.series.wins.me} 勝 / AI ${state.series.wins.opp} 勝<br>次は第${state.series.matchNo + 1}試合へ。`;
    showMatchResultModal(icon, title, detail, true);
    return;
  }

  // シリーズ終了 (単発 or BO3 完了)
  if (state.series.isBO3) {
    const winner = state.series.wins.me > state.series.wins.opp ? 'me' :
                   state.series.wins.opp > state.series.wins.me ? 'opp' : 'draw';
    if (winner === 'me') { title = 'BO3モード 勝利!'; icon = '🏆'; }
    else if (winner === 'opp') { title = 'BO3モード 敗北'; icon = '💧'; }
    else { title = 'BO3モード 引き分け'; icon = '⚖️'; }
    const resultsLine = state.series.results.map((r, i) => {
      const m = r === 'win' ? '○' : r === 'loss' ? '×' : '△';
      return `第${i+1}: ${m}`;
    }).join(' / ');
    detail = `${resultsLine}<br>最終 — あなた ${state.series.wins.me} 勝 / AI ${state.series.wins.opp} 勝`;
  } else {
    if (matchResult === 'win') {
      title = '勝利'; icon = '🏆';
      detail = `3レーン中 ${me} レーン勝利。 おめでとう、 虹意の祝福を。`;
    } else if (matchResult === 'loss') {
      title = '敗北'; icon = '💧';
      detail = `AIに ${opp} レーン取られた。 派閥シナジーやコンボを狙って リトライ。`;
    } else {
      title = '引き分け'; icon = '⚖️';
      detail = `${me} : ${opp} の互角。 もう一度挑戦しよう。`;
    }
  }
  showMatchResultModal(icon, title, detail, false);
}

function showMatchResultModal(icon, title, detailHtml, hasNext) {
  $('#result-icon').textContent = icon;
  $('#result-title').textContent = title;
  $('#result-detail').innerHTML = detailHtml;
  const nextBtn = $('#result-next-btn');
  if (nextBtn) nextBtn.style.display = hasNext ? '' : 'none';
  $('#result-modal').hidden = false;
  _setBodyModalOpen();
}

function nextMatch() {
  if (!state.series.isBO3) return;
  state.series.matchNo += 1;
  state._continueSeries = true;
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = true;
  _setBodyModalOpen();
  startMatch(state.difficulty, true);
}

function rematch() {
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = true;
  _setBodyModalOpen();
  // BO3 終了後 rematch なら新シリーズ
  state.series = { isBO3: state.series.isBO3, wins: { me: 0, opp: 0 }, matchNo: 1, results: [] };
  startMatch(state.difficulty, state.series.isBO3);
}

function updateSeriesHud() {
  // 野沢さん指示 2026-05-04 「試合の詳細は消す、 先攻/後攻 は You/AI ラベルに」 → series-info 行 簡略化
  const el = document.getElementById('series-info');
  if (!el) return;
  const diffMap = { easy: '🌱 Easy', normal: '⚔️ Normal', hard: '🔥 Hard', master: '👑 Master' };
  const diffLabel = diffMap[state.difficulty] || '?';
  if (state.series.isBO3) {
    el.style.display = '';
    el.innerHTML = `<span class="cg-diff-tag">${diffLabel}</span><span class="cg-series-progress">BO3 第${state.series.matchNo}/3</span>`;
  } else {
    el.style.display = '';
    el.innerHTML = `<span class="cg-diff-tag">${diffLabel}</span>`;
  }
}

function backToCardgameHome() {
  // cardgame ホーム (難易度選択)
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = true;
  $('#match-screen').classList.remove('active');
  $('#home-screen').classList.add('active');
  _setBodyModalOpen();
  // AI レベル別 連勝数 + 戦績ダッシュボード (野沢さん指示 2026-05-06)
  if (typeof _renderHomeStreaks === 'function') _renderHomeStreaks();
  if (typeof _renderHomeStats === 'function') _renderHomeStats();
  if (typeof _renderHomeDeckPreview === 'function') _renderHomeDeckPreview();
}

function backToPrismaeraHome() {
  location.href = '/';
}

// 結果モーダルから「場を見る」 押下 → モーダル一時クローズ + floating「結果に戻る」
// A-6: peekBoard 時に body.cg-modal-open が残ってスクロール不能になるバグ → _setBodyModalOpen() 呼出
function peekBoard() {
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = false;
  _setBodyModalOpen();
}
function reopenResult() {
  $('#result-modal').hidden = false;
  $('#result-peek-btn').hidden = true;
  _setBodyModalOpen();
}

// C-4: PvE 中断 → 復帰 機能 (Cloud 保存)

// _appliedTo は循環参照 (target が card refs) なので id-based に変換して serialize 可能化
function _serializeBoardState() {
  const idMap = new Map();  // card id → card 全フィールド
  const collect = (c) => idMap.set(c.id, { ...c, _appliedTo: undefined });
  ['me', 'opp'].forEach(s => state.board[s].flat().forEach(collect));
  state.hand.forEach(collect);
  state.oppHand.forEach(collect);
  state.deck.forEach(collect);
  state.oppDeck.forEach(collect);
  // _appliedTo 関係のみ id ペアで保存
  const appliedRels = [];
  ['me', 'opp'].forEach(s => state.board[s].flat().forEach(c => {
    if (c._appliedTo) c._appliedTo.forEach(({ target, delta }) => {
      if (target && target.id) appliedRels.push({ from: c.id, to: target.id, delta });
    });
  }));
  // _sideEffects も target を id 化
  const sideEffectsByCard = {};
  ['me', 'opp'].forEach(s => state.board[s].flat().forEach(c => {
    if (c._sideEffects && c._sideEffects.length > 0) {
      sideEffectsByCard[c.id] = c._sideEffects.map(se => {
        const out = { type: se.type, delta: se.delta };
        if (se.target && se.target.id) out.targetId = se.target.id;
        if (se.handCard && se.handCard.id) out.handCardId = se.handCard.id;
        if (se.tokenId) out.tokenId = se.tokenId;
        if ('prevSilenced' in se) out.prevSilenced = se.prevSilenced;
        if ('lane' in se) out.lane = se.lane;
        return out;
      });
    }
  }));
  return {
    cards: Array.from(idMap.entries()),
    boardLayout: {
      me: state.board.me.map(lane => lane.map(c => c.id)),
      opp: state.board.opp.map(lane => lane.map(c => c.id)),
    },
    handIds: { me: state.hand.map(c => c.id), opp: state.oppHand.map(c => c.id) },
    deckIds: { me: state.deck.map(c => c.id), opp: state.oppDeck.map(c => c.id) },
    appliedRels,
    sideEffectsByCard,
    turn: state.turn,
    cost: state.cost,
    costUsed: state.costUsed,
    scoreMe: state.scoreMe,
    scoreOpp: state.scoreOpp,
    selectedCardIdx: state.selectedCardIdx,
    thisTurnPlacements: state.thisTurnPlacements,
    mulliganAvailable: state.mulliganAvailable,
    thisTurnAiDone: state.thisTurnAiDone,
    laneEffects: state.laneEffects,
    difficulty: state.difficulty,
    firstMover: state.firstMover,
    series: state.series,
  };
}

function _deserializeBoardState(snap) {
  if (!snap || !snap.cards) return false;
  const idMap = new Map(snap.cards);
  const lookup = (id) => idMap.get(id);
  state.board = {
    me: snap.boardLayout.me.map(lane => lane.map(lookup).filter(Boolean)),
    opp: snap.boardLayout.opp.map(lane => lane.map(lookup).filter(Boolean)),
  };
  state.hand = snap.handIds.me.map(lookup).filter(Boolean);
  state.oppHand = snap.handIds.opp.map(lookup).filter(Boolean);
  state.deck = snap.deckIds.me.map(lookup).filter(Boolean);
  state.oppDeck = snap.deckIds.opp.map(lookup).filter(Boolean);
  ['me', 'opp'].forEach(s => state.board[s].flat().forEach(c => { c._appliedTo = []; }));
  for (const rel of snap.appliedRels) {
    const fromCard = lookup(rel.from);
    const toCard = lookup(rel.to);
    if (fromCard && toCard) {
      fromCard._appliedTo = fromCard._appliedTo || [];
      fromCard._appliedTo.push({ target: toCard, delta: rel.delta });
    }
  }
  for (const cardId in snap.sideEffectsByCard) {
    const card = lookup(cardId);
    if (!card) continue;
    card._sideEffects = snap.sideEffectsByCard[cardId].map(se => {
      const out = { type: se.type, delta: se.delta };
      if (se.targetId) out.target = lookup(se.targetId);
      if (se.handCardId) out.handCard = lookup(se.handCardId);
      if ('tokenId' in se) out.tokenId = se.tokenId;
      if ('prevSilenced' in se) out.prevSilenced = se.prevSilenced;
      if ('lane' in se) out.lane = se.lane;
      return out;
    });
  }
  state.turn = snap.turn;
  state.cost = snap.cost;
  state.costUsed = snap.costUsed;
  state.scoreMe = snap.scoreMe;
  state.scoreOpp = snap.scoreOpp;
  state.selectedCardIdx = snap.selectedCardIdx;
  state.thisTurnPlacements = snap.thisTurnPlacements || [];
  state.mulliganAvailable = snap.mulliganAvailable;
  state.thisTurnAiDone = snap.thisTurnAiDone;
  state.laneEffects = snap.laneEffects;
  state.difficulty = snap.difficulty;
  state.firstMover = snap.firstMover;
  state.series = snap.series;
  state.ended = false;
  state.busy = false;
  return true;
}

function pauseMatch() {
  if (state.busy || state.ended) return;
  if (!confirm('試合を中断してホームへ戻りますか? (後で続きから再開できます)')) return;
  try {
    const snap = _serializeBoardState();
    snap.savedAt = Date.now();
    pcbCloud.paused = snap;
    _pcbSet('paused', snap);
  } catch (e) {
    console.warn('[pcb] pause save failed', e);
    if (!confirm('保存に失敗しました。 中断データなしで戻りますか?')) return;
  }
  state.ended = true;
  state.busy = false;
  backToCardgameHome();
  _refreshHomeResumeButton();
}

function _hasPausedMatch() {
  const snap = pcbCloud.paused;
  if (!snap) return false;
  if (Date.now() - (snap.savedAt || 0) > 24 * 60 * 60 * 1000) {
    pcbCloud.paused = null;
    _pcbSet('paused', null);
    return false;
  }
  return true;
}

function _getPausedMatchInfo() {
  const snap = pcbCloud.paused;
  if (!snap) return null;
  return {
    turn: snap.turn, maxTurn: 6,
    difficulty: snap.difficulty,
    isBO3: snap.series && snap.series.isBO3,
    matchNo: snap.series && snap.series.matchNo,
    savedAt: snap.savedAt,
  };
}

async function resumePausedMatch() {
  const snap = pcbCloud.paused;
  if (!snap) return;
  if (!state.allCards || state.allCards.length === 0) await loadMasters();
  if (!_deserializeBoardState(snap)) {
    setMessage('中断データの復元に失敗しました', 'alert');
    return;
  }
  pcbCloud.paused = null;
  _pcbSet('paused', null);
  $('#home-screen').classList.remove('active');
  $('#match-screen').classList.add('active');
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = true;
  state.maxTurn = 6;
  updateSeriesHud();
  renderAll();
  setMessage(`T${state.turn} — 中断から復帰`);
  _refreshHomeResumeButton();
}

function _refreshHomeResumeButton() {
  const homeScreen = $('#home-screen');
  if (!homeScreen) return;
  let resumeRow = document.getElementById('cg-resume-row');
  if (!_hasPausedMatch()) {
    if (resumeRow) resumeRow.remove();
    return;
  }
  const info = _getPausedMatchInfo();
  if (!info) return;
  const diffMap = { easy: '🌱 Easy', normal: '⚔️ Normal', hard: '🔥 Hard', master: '👑 Master' };
  const sub = `${diffMap[info.difficulty] || '?'} / T${info.turn}/${info.maxTurn}${info.isBO3 ? ` / BO3 第${info.matchNo}` : ''}`;
  if (!resumeRow) {
    resumeRow = document.createElement('div');
    resumeRow.id = 'cg-resume-row';
    resumeRow.className = 'cg-resume-row';
    const modesEl = homeScreen.querySelector('.cg-modes');
    if (modesEl) homeScreen.insertBefore(resumeRow, modesEl);
    else homeScreen.appendChild(resumeRow);
  }
  const dt = new Date(info.savedAt);
  const tstr = `${dt.getMonth()+1}/${dt.getDate()} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
  resumeRow.innerHTML = `
    <button type="button" class="cg-resume-btn" id="btn-resume-paused">
      <span class="cg-resume-icon">▶</span>
      <span class="cg-resume-text">
        <span class="cg-resume-title">中断中の試合 を再開</span>
        <span class="cg-resume-sub">${sub}  <small>(${tstr} 保存)</small></span>
      </span>
      <span class="cg-resume-arrow">→</span>
    </button>
    <button type="button" class="cg-resume-discard" id="btn-resume-discard" title="中断データを破棄">✕</button>
  `;
  document.getElementById('btn-resume-paused').addEventListener('click', resumePausedMatch);
  document.getElementById('btn-resume-discard').addEventListener('click', () => {
    if (!confirm('中断データを破棄しますか? (再開できなくなります)')) return;
    pcbCloud.paused = null;
    _pcbSet('paused', null);
    _refreshHomeResumeButton();
  });
}

// ===== P-5: デッキ編集 UI (3 スロット + フィルター強化) =====
let _deckBuilderState = {
  selected: [],
  editSlot: 1,
  tierFilter: 'all',
  chapterFilter: 'all',
  factionFilter: 'all',
  search: '',
  ownedOnly: false,
};

// ホーム「デッキ編集」 → スロット選択 → 編集モード (野沢さん指示 2026-05-04)
function openDeckSlotPicker() {
  _renderDeckSlotPicker();
  $('#deck-slot-picker-modal').hidden = false;
  _setBodyModalOpen();
}
function closeDeckSlotPicker() {
  $('#deck-slot-picker-modal').hidden = true;
  _setBodyModalOpen();
}
function _renderDeckSlotPicker() {
  const list = $('#deck-slot-picker-list');
  if (!list) return;
  const active = getActiveSlot();
  list.innerHTML = '';
  for (let n = 1; n <= DECK_SLOT_COUNT; n++) {
    const ids = loadDeckSlot(n);
    const cnt = ids ? ids.length : 0;
    const isActive = n === active;
    const status = cnt > 0 ? `${cnt} 枚` : '未設定';
    const item = document.createElement('div');
    item.className = 'cg-deck-slot-pick' + (isActive ? ' active' : '');
    item.innerHTML = `
      <div class="cg-deck-slot-pick-num">Slot ${n}</div>
      <div class="cg-deck-slot-pick-status">${status}${isActive ? ' <span class="cg-active-mark">⭐使用中</span>' : ''}</div>
      <button type="button" class="cg-btn primary cg-deck-slot-pick-btn" data-slot="${n}">編集 →</button>
    `;
    list.appendChild(item);
  }
  list.querySelectorAll('.cg-deck-slot-pick-btn').forEach(b => {
    b.addEventListener('click', () => {
      const n = parseInt(b.dataset.slot, 10);
      closeDeckSlotPicker();
      openDeckBuilder(n);
    });
  });
}

// 編集モードへ (slot 引数で対象スロット指定)
function openDeckBuilder(slot) {
  _deckBuilderState.browseMode = false;
  _deckBuilderState.editSlot = slot || getActiveSlot();
  _loadEditingSlot();
  _deckBuilderState.tierFilter = 'all';
  _deckBuilderState.chapterFilter = 'all';
  _deckBuilderState.factionFilter = 'all';
  _deckBuilderState.search = '';
  _deckBuilderState.ownedOnly = false;
  $$('#deck-builder-tabs .cg-deck-tab').forEach(t => t.classList.toggle('active', t.dataset.tier === 'all'));
  $$('#deck-builder-chapter-tabs .cg-deck-tab').forEach(t => t.classList.toggle('active', t.dataset.chapter === 'all'));
  const search = $('#deck-search-input'); if (search) search.value = '';
  const fac = $('#deck-faction-filter'); if (fac) fac.value = 'all';
  const owned = $('#deck-owned-only'); if (owned) owned.checked = false;
  _populateFactionFilter();
  $('#deck-builder-slot-num').textContent = _deckBuilderState.editSlot;
  _updateActiveToggleUI();
  renderDeckBuilderGrid();
  $('#deck-builder-modal').hidden = false;
  document.body.classList.remove('cg-browse-mode');
  _setBodyModalOpen();
}

// キャラ確認モード (野沢さん指示 2026-05-06): 既存 deck-builder-modal を 閲覧専用で開く。
// +/-ボタン非表示、 「使用中に」 トグル非表示、 タイトル「キャラ一覧」、 カード tap で showCardDetail で能力詳細。
function openCharBrowse() {
  _deckBuilderState.browseMode = true;
  _deckBuilderState.editSlot = 0;  // 0 = 閲覧モード sentinel
  _deckBuilderState.selected = [];
  _deckBuilderState.tierFilter = 'all';
  _deckBuilderState.chapterFilter = 'all';
  _deckBuilderState.factionFilter = 'all';
  _deckBuilderState.search = '';
  _deckBuilderState.ownedOnly = false;
  $$('#deck-builder-tabs .cg-deck-tab').forEach(t => t.classList.toggle('active', t.dataset.tier === 'all'));
  $$('#deck-builder-chapter-tabs .cg-deck-tab').forEach(t => t.classList.toggle('active', t.dataset.chapter === 'all'));
  const search = $('#deck-search-input'); if (search) search.value = '';
  const fac = $('#deck-faction-filter'); if (fac) fac.value = 'all';
  const owned = $('#deck-owned-only'); if (owned) owned.checked = false;
  _populateFactionFilter();
  // タイトル/header を 閲覧モード表示に
  const slotNum = $('#deck-builder-slot-num');
  if (slotNum && slotNum.parentElement) slotNum.parentElement.firstChild.textContent = '📚 キャラ一覧 ';
  if (slotNum) slotNum.textContent = '';
  renderDeckBuilderGrid();
  $('#deck-builder-modal').hidden = false;
  // body class で +/- ボタン群 + 使用中トグル を CSS で 一括 hide
  document.body.classList.add('cg-browse-mode');
  _setBodyModalOpen();
}

function backToSlotPicker() {
  $('#deck-builder-modal').hidden = true;
  _setBodyModalOpen();
  setTimeout(() => openDeckSlotPicker(), 50);
}

function _loadEditingSlot() {
  const ids = loadDeckSlot(_deckBuilderState.editSlot);
  if (ids && ids.length > 0) {
    _deckBuilderState.selected = [...ids];
  } else {
    // 該当 slot 未設定 → デフォルトデッキで開始
    _deckBuilderState.selected = getCurrentDeck().map(c => c.id);
  }
}

function _populateFactionFilter() {
  const sel = $('#deck-faction-filter');
  if (!sel) return;
  const factions = new Set(state.allCards.map(c => c.faction).filter(Boolean));
  // 既存 option をリセット (最初の「全派閥」 だけ残す)
  while (sel.options.length > 1) sel.remove(1);
  Array.from(factions).sort().forEach(f => {
    const opt = document.createElement('option');
    opt.value = f; opt.textContent = f;
    sel.appendChild(opt);
  });
}

function _updateActiveToggleUI() {
  const setActiveBtn = $('#btn-deck-set-active');
  if (!setActiveBtn) return;
  const editingIsActive = _deckBuilderState.editSlot === getActiveSlot();
  setActiveBtn.disabled = editingIsActive;
  setActiveBtn.textContent = editingIsActive ? '✅ Slot ' + _deckBuilderState.editSlot + ' を使用中' : `⭐ Slot ${_deckBuilderState.editSlot} を使用中に`;
}

function setEditingAsActive() {
  setActiveSlot(_deckBuilderState.editSlot);
  _updateActiveToggleUI();
  updateDeckBuilderSubText();
}

function closeDeckBuilder() {
  $('#deck-builder-modal').hidden = true;
  _setBodyModalOpen(false);
}

// body + html スクロールロック (モーダル open/close で呼ぶ、 PC でも有効)
function _setBodyModalOpen() {
  setTimeout(() => {
    const anyOpen = !!document.querySelector('.cg-modal:not([hidden])');
    document.body.classList.toggle('cg-modal-open', anyOpen);
    document.documentElement.classList.toggle('cg-modal-open', anyOpen);
  }, 10);
}

function renderDeckBuilderGrid() {
  const grid = $('#deck-builder-grid');
  if (!grid) return;
  const s = _deckBuilderState;
  let cards = state.allCards.slice();
  if (s.tierFilter !== 'all') cards = cards.filter(c => c.tier === s.tierFilter);
  if (s.chapterFilter !== 'all') cards = cards.filter(c => c.chapter === s.chapterFilter);
  if (s.factionFilter !== 'all') cards = cards.filter(c => c.faction === s.factionFilter);
  if (s.search) {
    const q = s.search.toLowerCase();
    cards = cards.filter(c => c.name.toLowerCase().includes(q));
  }
  if (s.ownedOnly) cards = cards.filter(c => c._owned);
  // tier 順 sort (LR → R)、 同 tier は cost 降順
  const order = { LR: 5, UR: 4, SSR: 3, SR: 2, R: 1 };
  cards.sort((a, b) => (order[b.tier] - order[a.tier]) || (b.cost - a.cost));
  // status 表示 (○件中 / フィルター適用中)
  const statusEl = $('#deck-list-status');
  if (statusEl) {
    const filterCount = _activeFilterCount();
    statusEl.innerHTML = `${cards.length} 件 / 全 ${state.allCards.length} 件 ${filterCount > 0 ? `<span class="cg-filter-badge">フィルター ${filterCount}件 適用中</span>` : ''}`;
  }
  if (cards.length === 0) {
    grid.innerHTML = '<p class="cg-deck-empty">条件に一致するカードがありません</p>';
  } else {
    // list 形式 (横並び: 画像 + 情報 + 操作) で 絵 + 詳細 を確実に表示
    grid.innerHTML = cards.map(card => {
      const isSelected = s.selected.includes(card.id);
      const imgUrl = card.img ? '..' + card.img : '';
      const dupesText = card.dupes > 0 ? `+${card.dupes}` : '';
      const max = MAX_DUPS[card.tier] || 0;
      const dupesBadge = max > 0 ? `<span class="cg-list-dupes">凸 ${card.dupes||0}/${max}</span>` : '';
      const totalPower = card.basePower + dupeBonusOf(card);
      const cost = effectiveCost(card);
      const costMod = isMaxDup(card) ? '<span class="cg-list-cost-mod">▼</span>' : '';
      const ownedClass = card._owned ? '' : 'unowned';
      return `<div class="cg-deck-list-item ${isSelected ? 'selected' : ''} ${ownedClass}" data-id="${card.id}">
        <div class="cg-deck-list-img" style="background-image:url('${imgUrl}')">
          <div class="cg-deck-list-tier ${card.tier}">${card.tier} ${dupesText}</div>
        </div>
        <div class="cg-deck-list-info">
          <div class="cg-deck-list-name">${card.name}</div>
          <div class="cg-deck-list-faction" style="background:${factionColor(card.faction)}">${card.faction}</div>
          <div class="cg-deck-list-meta">${dupesBadge} ${card._owned ? '' : '<span class="cg-list-unowned-tag">未所持</span>'}</div>
          <div class="cg-deck-list-effect">${card.effectText || '効果なし'}</div>
        </div>
        <div class="cg-deck-list-stats">
          <div class="cg-deck-list-cost">⚡${cost}${costMod}</div>
          <div class="cg-deck-list-power">⚔${totalPower}</div>
          <div class="cg-deck-list-check ${isSelected ? 'on' : ''}">${isSelected ? '✓' : '＋'}</div>
        </div>
      </div>`;
    }).join('');
    grid.querySelectorAll('.cg-deck-list-item').forEach(el => {
      el.addEventListener('click', () => {
        const card = state.allCards.find(c => c.id === el.dataset.id);
        if (card) showCardDetail(card, 'deck-builder', null);
      });
    });
  }
  $('#deck-builder-count').textContent = s.selected.length;
  $('#deck-builder-count').className = s.selected.length === DECK_SIZE ? 'cg-deck-count-full' : '';
  _updateFilterCountBadge();
}

function _activeFilterCount() {
  const s = _deckBuilderState;
  let n = 0;
  if (s.tierFilter !== 'all') n++;
  if (s.chapterFilter !== 'all') n++;
  if (s.factionFilter !== 'all') n++;
  if (s.search) n++;
  if (s.ownedOnly) n++;
  return n;
}

function _updateFilterCountBadge() {
  const badge = $('#filter-count-badge');
  if (!badge) return;
  const n = _activeFilterCount();
  badge.textContent = n > 0 ? `(${n})` : '';
  badge.style.color = n > 0 ? 'var(--gold)' : '';
}

function openDeckFilter() {
  $('#deck-filter-modal').hidden = false;
  _setBodyModalOpen();
}
function closeDeckFilter() {
  $('#deck-filter-modal').hidden = true;
  _setBodyModalOpen();
  renderDeckBuilderGrid();
}
function resetDeckFilter() {
  _deckBuilderState.tierFilter = 'all';
  _deckBuilderState.chapterFilter = 'all';
  _deckBuilderState.factionFilter = 'all';
  _deckBuilderState.search = '';
  _deckBuilderState.ownedOnly = false;
  $$('#deck-builder-tabs .cg-deck-tab').forEach(t => t.classList.toggle('active', t.dataset.tier === 'all'));
  $$('#deck-builder-chapter-tabs .cg-deck-tab').forEach(t => t.classList.toggle('active', t.dataset.chapter === 'all'));
  const search = $('#deck-search-input'); if (search) search.value = '';
  const fac = $('#deck-faction-filter'); if (fac) fac.value = 'all';
  const owned = $('#deck-owned-only'); if (owned) owned.checked = false;
  renderDeckBuilderGrid();
}

function toggleDeckCard(id) {
  const idx = _deckBuilderState.selected.indexOf(id);
  if (idx !== -1) {
    _deckBuilderState.selected.splice(idx, 1);
  } else {
    if (_deckBuilderState.selected.length >= DECK_SIZE) {
      const counter = $('.cg-deck-builder-counter');
      if (counter) {
        counter.classList.add('flash-alert');
        setTimeout(() => counter.classList.remove('flash-alert'), 600);
      }
      return;
    }
    // 野沢さん指示 2026-05-05: LR/UR 枚数制限 (LR=1, UR=3)
    const card = state.allCards.find(c => c.id === id);
    if (card) {
      const limit = _tierLimit(card.tier);
      if (limit !== undefined) {
        const cur = _countByTier(_deckBuilderState.selected, card.tier);
        if (cur >= limit) {
          // 上限超え: warning toast
          const status = $('#deck-list-status');
          if (status) {
            status.innerHTML = `<span class="cg-deck-tier-limit-warn">⚠️ ${card.tier} は最大 ${limit}枚 までです (高tier偏重防止)</span>`;
            setTimeout(() => renderDeckBuilderGrid(), 1500);
          }
          return;
        }
      }
    }
    _deckBuilderState.selected.push(id);
  }
  renderDeckBuilderGrid();
}

function clearBuilderDeck() {
  _deckBuilderState.selected = [];
  renderDeckBuilderGrid();
}

function setBuilderToAuto() {
  _deckBuilderState.selected = generateAutoDeck();
  renderDeckBuilderGrid();
}

function setBuilderToDefault() {
  // cards.json の手書き 12 枚を id で取得
  const defaultIds = ['lr_1_prisma','ur_1_seraph','ur_2_kaguya','ssr_1_linae','ssr_2_chanty','ssr_3_glaciel','sr_1_lumina','sr_2_tsuki','sr_3_coralia','r_1_chisato','r_2_kai','r_3_viola'];
  _deckBuilderState.selected = defaultIds.filter(id => state.allCards.some(c => c.id === id));
  renderDeckBuilderGrid();
}

function saveBuilderDeck() {
  if (_deckBuilderState.selected.length !== DECK_SIZE) {
    const counter = $('.cg-deck-builder-counter');
    if (counter) {
      counter.classList.add('flash-alert');
      setTimeout(() => counter.classList.remove('flash-alert'), 600);
    }
    return;
  }
  saveDeckSlot(_deckBuilderState.editSlot, _deckBuilderState.selected);
  _updateActiveToggleUI();
  updateDeckBuilderSubText();
  closeDeckBuilder();
}

function updateDeckBuilderSubText() {
  const sub = $('#deck-builder-sub');
  if (!sub) return;
  const slot = getActiveSlot();
  const ids = loadDeckSlot(slot);
  if (ids && ids.length === DECK_SIZE) {
    sub.textContent = `Slot ${slot} 使用中 — カスタム 12 枚`;
    sub.style.color = 'var(--gold)';
  } else {
    sub.textContent = `Slot ${slot} 使用中 — デフォルト 12 枚`;
    sub.style.color = '';
  }
}

// ===== モーダル (全 open/close で body スクロールロック) =====
function closeResult() { $('#result-modal').hidden = true; _setBodyModalOpen(); }
function openHelp() { $('#help-modal').hidden = false; _setBodyModalOpen(); }
function closeHelp() { $('#help-modal').hidden = true; _setBodyModalOpen(); }
function openTutorial() { $('#tutorial-modal').hidden = false; _setBodyModalOpen(); }
function closeTutorial() { $('#tutorial-modal').hidden = true; _setBodyModalOpen(); }

// ===== コンボ確認モーダル =====
function openCombosModal() {
  if (state.busy) return;
  const list = collectAvailableCombos();
  const body = $('#combos-body');
  if (list.length === 0) {
    body.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:20px">現在の手札+場で発動可能なコンボなし。<br>手札にコンボパーツが揃っていない、 または条件未達。</p>';
  } else {
    body.innerHTML = list.map(c => `
      <button type="button" class="cg-combo-item ${c.triggered ? 'triggered' : 'pending'}" data-combo-name="${escapeAttr(c.name)}">
        <div class="cg-combo-head">
          <span class="cg-combo-icon">${c.triggered ? '✨' : '🔍'}</span>
          <span class="cg-combo-name">${c.name}</span>
          <span class="cg-combo-status">${c.triggered ? '発動中' : 'あと' + c.missing.length + '枚'}</span>
        </div>
        <div class="cg-combo-cond">${c.conditionLabel}</div>
        <div class="cg-combo-chars">
          ${c.chars.map(name => {
            const has = c.collected.includes(name);
            return `<span class="cg-combo-chip ${has ? 'has' : 'miss'}">${has ? '✓' : '○'} ${name}</span>`;
          }).join('')}
        </div>
        <div class="cg-combo-flavor">${c.flavor}</div>
        <div class="cg-combo-effect">効果: 自レーン +${c.power} power</div>
        <div class="cg-combo-tap-hint">タップで詳細 →</div>
      </button>
    `).join('');
    body.querySelectorAll('.cg-combo-item').forEach(el => {
      el.addEventListener('click', () => openComboDetailModal(el.dataset.comboName));
    });
  }
  $('#combos-modal').hidden = false;
  _setBodyModalOpen();
}
function closeCombosModal() { $('#combos-modal').hidden = true; _setBodyModalOpen(); }

// ===== P-2 コンボ詳細 sub-modal =====
function escapeAttr(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function openComboDetailModal(comboName) {
  const combo = (state.combos || []).find(c => c.name === comboName);
  if (!combo) return;
  const myBoardAll = [].concat(...(state.board?.me || [[],[],[]]));
  const myAll = myBoardAll.concat(state.hand || []);
  const myAllNames = myAll.map(c => c.name);
  $('#combo-detail-name').textContent = `✨ ${combo.name}`;
  const condLabel = combo.condition === 'same_lane' ? '同レーンに揃える' : 'いずれかの場に揃える';
  $('#combo-detail-cond').textContent = condLabel;
  const tgt = combo.effect.target === 'all_lanes' ? '全レーン' : '自レーン';
  $('#combo-detail-effect').textContent = `→ ${tgt} +${combo.effect.power} power`;
  $('#combo-detail-flavor').textContent = combo.flavor || '';
  // 関連キャラ chips
  const charsEl = $('#combo-detail-chars');
  charsEl.innerHTML = combo.chars.map(name => {
    const card = (state.allCards || []).find(c => c.name === name);
    if (!card) {
      // 未公開章 / pool 未登録: 名前のみ
      return `<div class="cg-combo-detail-char missing">
        <div class="cg-combo-detail-char-name">${escapeAttr(name)}</div>
        <div class="cg-combo-detail-char-meta">未取得</div>
      </div>`;
    }
    const has = myAllNames.includes(name);
    const dupes = (typeof getUserDupCounts === 'function') ? (getUserDupCounts()[card.tier + '_' + card.name] || 0) : 0;
    const factionLabel = card.faction || '';
    const role = card.role || '';
    const effShort = (card.effectText || '').slice(0, 36);
    const imgUrl = card.img || '';
    const imgStyle = imgUrl ? `background-image:url('${escapeAttr(imgUrl)}')` : '';
    return `<button type="button" class="cg-combo-detail-char ${has ? 'collected' : ''}" data-char-id="${escapeAttr(card.id || '')}">
      <div class="cg-combo-detail-char-img" style="${imgStyle}"></div>
      <div class="cg-combo-detail-char-info">
        <div class="cg-combo-detail-char-tier-row">
          <span class="cg-combo-detail-char-tier tier-${card.tier}">${card.tier}</span>
          ${factionLabel ? `<span class="cg-combo-detail-char-faction">${escapeAttr(factionLabel)}</span>` : ''}
          ${dupes > 0 ? `<span class="cg-combo-detail-char-dupes">+${dupes}凸</span>` : ''}
          ${has ? `<span class="cg-combo-detail-char-flag">✓ 場にある</span>` : ''}
        </div>
        <div class="cg-combo-detail-char-name">${escapeAttr(card.name)}</div>
        ${role ? `<div class="cg-combo-detail-char-role">${escapeAttr(role)}</div>` : ''}
        <div class="cg-combo-detail-char-stats">⚡${card.cost} ⚔${card.basePower}</div>
        ${effShort ? `<div class="cg-combo-detail-char-effect">${escapeAttr(effShort)}${card.effectText && card.effectText.length > 36 ? '…' : ''}</div>` : ''}
      </div>
    </button>`;
  }).join('');
  charsEl.querySelectorAll('.cg-combo-detail-char[data-char-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.charId;
      const card = (state.allCards || []).find(c => c.id === id);
      if (card && typeof openCharDetail === 'function') {
        // sub-sub-modal: combo-detail を閉じずに char-detail を上に開く
        openCharDetail(card, 'combo-detail');
      }
    });
  });
  $('#combo-detail-modal').hidden = false;
  _setBodyModalOpen();
}
function closeComboDetailModal() { $('#combo-detail-modal').hidden = true; _setBodyModalOpen(); }

function collectAvailableCombos() {
  const myBoardAll = [].concat(...state.board.me);
  const myAll = myBoardAll.concat(state.hand);
  const myAllNames = myAll.map(c => c.name);
  return state.combos.map(combo => {
    const collected = combo.chars.filter(c => myAllNames.includes(c));
    const missing = combo.chars.filter(c => !myAllNames.includes(c));
    // 発動チェック (場に揃っている場合)
    let triggered = false;
    if (combo.condition === 'same_lane') {
      for (let L = 0; L < 3; L++) {
        const laneNames = state.board.me[L].map(c => c.name);
        if (combo.chars.every(c => laneNames.includes(c))) { triggered = true; break; }
      }
    } else if (combo.condition === 'any_lane') {
      const boardNames = myBoardAll.map(c => c.name);
      triggered = combo.chars.every(c => boardNames.includes(c));
    }
    return {
      name: combo.name,
      chars: combo.chars,
      flavor: combo.flavor,
      power: combo.effect.power,
      conditionLabel: combo.condition === 'same_lane' ? '同じレーンに揃える' : 'どの場でも揃える',
      collected, missing, triggered,
    };
  }).filter(x => x.collected.length > 0); // 1 枚も持っていないコンボは非表示
}

// ===== ヘッダ戻る =====
function onBackClick(e) {
  e.preventDefault();
  if ($('#match-screen').classList.contains('active')) {
    if (!state.ended && state.thisTurnPlacements.length > 0) {
      if (!confirm('試合を放棄して カードゲームのホームへ戻りますか?')) return;
    }
    backToCardgameHome();
  } else {
    backToPrismaeraHome();
  }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
  pcbInitFirebase();  // Firebase 初期化 (auth state 変化で pcbCloudInit が走る)
  _refreshAccountGate();  // 未ログイン時の警告 (auth state 確定までは仮表示)
  initBgm();
  _initVisibilityHandler();
  _initLaneEffectPopover();
  await loadMasters();
  _refreshHomeResumeButton();  // 中断中の試合があれば「再開」 ボタンを home に表示
  if (typeof _renderHomeStreaks === 'function') _renderHomeStreaks();  // AI レベル別 連勝数
  if (typeof _renderHomeStats === 'function') _renderHomeStats();
  if (typeof _renderHomeDeckPreview === 'function') _renderHomeDeckPreview();  // 戦績ダッシュボード + ポイント (野沢さん指示 2026-05-06)
  // BO3 toggle (Cloud 永続化、 アカウント依存)
  const bo3Toggle = document.getElementById('bo3-toggle');
  if (bo3Toggle) {
    bo3Toggle.checked = pcbCloud.bo3Toggle === true;
    bo3Toggle.addEventListener('change', () => {
      pcbCloud.bo3Toggle = bo3Toggle.checked;
      _pcbSet('bo3Toggle', bo3Toggle.checked);
    });
  }
  const getBo3 = () => bo3Toggle && bo3Toggle.checked;
  $('#btn-start-easy').addEventListener('click', () => startMatch('easy', getBo3()));
  $('#btn-start-normal').addEventListener('click', () => startMatch('normal', getBo3()));
  $('#btn-start-hard').addEventListener('click', () => startMatch('hard', getBo3()));
  $('#btn-start-master').addEventListener('click', () => startMatch('master', getBo3()));
  $('#btn-tutorial').addEventListener('click', openTutorial);
  $('#btn-help').addEventListener('click', openHelp);
  // 📗 ルールブック (バトル中 ヘッダー + ホーム mode-btn の 両方からアクセス、 野沢さん指示 2026-05-06)
  document.getElementById('btn-rulebook')?.addEventListener('click', openRulebook);
  document.getElementById('btn-rulebook-home')?.addEventListener('click', openRulebook);
  // 🛒 ショップ (野沢さん指示 2026-05-06、 Phase 1 = 近日公開 modal)
  document.getElementById('btn-shop')?.addEventListener('click', openShop);
  $('#btn-undo').addEventListener('click', resetThisTurn);
  $('#btn-combos').addEventListener('click', openCombosModal);
  $('#btn-mulligan').addEventListener('click', mulligan);
  $('#btn-cg-mute').addEventListener('click', toggleBgmMute);
  const pauseBtn = document.getElementById('btn-pause');
  if (pauseBtn) pauseBtn.addEventListener('click', pauseMatch);
  $('.cg-back').addEventListener('click', onBackClick);
  // P-5: デッキ編集 (ホームの「デッキ編集」 ボタン → スロット選択)
  const openDeckBtn = document.getElementById('btn-open-deck-builder');
  if (openDeckBtn) openDeckBtn.addEventListener('click', openDeckSlotPicker);
  // キャラ確認 ボタン (slot-picker-modal の 一番上、 野沢さん指示 2026-05-06)
  const browseBtn = document.getElementById('btn-open-char-browse');
  if (browseBtn) browseBtn.addEventListener('click', () => {
    closeDeckSlotPicker();
    openCharBrowse();
  });
  const tabsEl = document.getElementById('deck-builder-tabs');
  if (tabsEl) {
    tabsEl.addEventListener('click', (e) => {
      const t = e.target.closest('.cg-deck-tab');
      if (!t) return;
      _deckBuilderState.tierFilter = t.dataset.tier;
      $$('#deck-builder-tabs .cg-deck-tab').forEach(x => x.classList.toggle('active', x === t));
      renderDeckBuilderGrid();
    });
  }
  const chTabsEl = document.getElementById('deck-builder-chapter-tabs');
  if (chTabsEl) {
    chTabsEl.addEventListener('click', (e) => {
      const t = e.target.closest('.cg-deck-tab');
      if (!t) return;
      _deckBuilderState.chapterFilter = t.dataset.chapter;
      $$('#deck-builder-chapter-tabs .cg-deck-tab').forEach(x => x.classList.toggle('active', x === t));
      renderDeckBuilderGrid();
    });
  }
  const searchEl = document.getElementById('deck-search-input');
  if (searchEl) searchEl.addEventListener('input', (e) => {
    _deckBuilderState.search = e.target.value;
    renderDeckBuilderGrid();
  });
  const facEl = document.getElementById('deck-faction-filter');
  if (facEl) facEl.addEventListener('change', (e) => {
    _deckBuilderState.factionFilter = e.target.value;
    renderDeckBuilderGrid();
  });
  const ownedEl = document.getElementById('deck-owned-only');
  if (ownedEl) ownedEl.addEventListener('change', (e) => {
    _deckBuilderState.ownedOnly = e.target.checked;
    renderDeckBuilderGrid();
  });
  const setActiveBtn = document.getElementById('btn-deck-set-active');
  if (setActiveBtn) setActiveBtn.addEventListener('click', setEditingAsActive);
  // フィルター ポップアップ
  const filterBtn = document.getElementById('btn-deck-filter');
  if (filterBtn) filterBtn.addEventListener('click', openDeckFilter);
  const filterResetBtn = document.getElementById('btn-filter-reset');
  if (filterResetBtn) filterResetBtn.addEventListener('click', resetDeckFilter);
  const clearBtn = document.getElementById('btn-deck-clear');
  if (clearBtn) clearBtn.addEventListener('click', clearBuilderDeck);
  const autoBtn = document.getElementById('btn-deck-auto');
  if (autoBtn) autoBtn.addEventListener('click', setBuilderToAuto);
  const defaultBtn = document.getElementById('btn-deck-default');
  if (defaultBtn) defaultBtn.addEventListener('click', setBuilderToDefault);
  const saveBtn = document.getElementById('btn-deck-save');
  if (saveBtn) saveBtn.addEventListener('click', saveBuilderDeck);
  updateDeckBuilderSubText();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // 最上位 modal を 1つだけ close (野沢さん指示 2026-05-06、 「char-detail Esc で deck-builder
      // (キャラ一覧) に戻る、 ホームには戻らない」 仕様。 旧実装は全 modal 連鎖 close で バグだった)
      const isOpen = (id) => {
        const el = document.getElementById(id);
        return el && !el.hidden && el.style.display !== 'none';
      };
      if (isOpen('result-modal'))         { closeResult(); return; }
      if (isOpen('cg-help-modal'))        { closeHelp(); return; }
      if (isOpen('tutorial-modal'))       { closeTutorial(); return; }
      if (isOpen('rulebook-modal'))       { closeRulebook(); return; }
      if (isOpen('shop-modal'))           { closeShop(); return; }
      if (isOpen('combo-detail-modal'))   { closeComboDetailModal(); return; }
      if (isOpen('combos-modal'))         { closeCombosModal(); return; }
      if (isOpen('char-detail-modal'))    { closeCharDetail(); return; }
      if (isOpen('deck-filter-modal'))    { closeDeckFilter(); return; }
      if (isOpen('deck-builder-modal'))   { closeDeckBuilder(); return; }
      if (isOpen('deck-slot-picker-modal')) { closeDeckSlotPicker(); return; }
    }
  });
});

// ============================================================
// P-11: AI vs AI sim mode (URL params で起動、 PCB バランス測定用)
// ?simAuto=<diffMe>-vs-<diffOpp>&n=<count>  例: ?simAuto=hard-vs-master&n=100
// player 側を Easy/Normal/Hard AI logic で自動操作、 opp 側は既存 aiTurn 動作
// 結果を <pre id="sim-result"> + localStorage に出力 (Playwright wrapper で取得)
// ============================================================

async function simulatePlayerTurn(diff) {
  // aiTurn の me 側版、 既存 aiTurn ロジックを mirror (state.hand → state.board.me)
  let costRemain = state.turn;
  let attempts = 0;
  const aiEffCost = (c) => Math.max(1, effectiveCost(c) - (c._costReduced || 0));

  while (costRemain > 0 && attempts < 8) {
    attempts++;
    const playable = state.hand.map((c, i) => ({ c, i })).filter(x => aiEffCost(x.c) <= costRemain);
    if (playable.length === 0) break;
    const openLanes = [0, 1, 2].filter(L => state.board.me[L].length < 4);
    if (openLanes.length === 0) break;

    let pickIdx, lane;

    if (diff === 'easy') {
      const p = playable[Math.floor(Math.random() * playable.length)];
      pickIdx = p.i;
      lane = openLanes[Math.floor(Math.random() * openLanes.length)];
      if (Math.random() < 0.4) break;
    } else if (diff === 'normal') {
      playable.sort((a, b) => b.c.cost - a.c.cost);
      pickIdx = playable[0].i;
      const lanes = openLanes.map(L => ({ L, d: getLanePower('me', L) - getLanePower('opp', L) }));
      lanes.sort((a, b) => a.d - b.d);
      lane = lanes[0].L;
    } else if (diff === 'hard' || diff === 'master') {
      // hard 評価ロジック (master 1-ply lookahead は Phase 2 で実装、 今は hard 同等で代替)
      let best = null;
      for (const p of playable) {
        for (const L of openLanes) {
          let score = p.c.cost * 1.5;
          const sameFac = state.board.me[L].filter(c => c.faction === p.c.faction).length;
          score += sameFac * 2;
          const oppDiff = getLanePower('opp', L) - getLanePower('me', L);
          if (oppDiff > 0) score += oppDiff * 0.6;
          const e = state.laneEffects[L];
          if (e) {
            if (e.rule === 'cost_ge' && p.c.cost >= e.threshold) score += e.value * 1.5;
            if (e.rule === 'cost_le' && p.c.cost <= e.threshold) score += e.value * 1.5;
            if (e.rule === 'faction' && p.c.faction === e.faction) score += e.value * 2;
          }
          const eff = effectiveEffect(p.c) || {};
          const power = eff.power || 0;
          switch (eff.target) {
            case 'freeze_opp_lane_top': score += 4 + power; break;
            case 'freeze_opp_lane_all': score += state.board.opp[L].length * 2 + power; break;
            case 'silence_opp_lane_top': score += 3 + power; break;
            case 'summon_token': score += 2 + power; break;
            case 'chain_lane_self': score += state.board.me[L].length * (eff.multiplier || 1); break;
            case 'buff_faction_lane': score += sameFac * (power || 1); break;
            case 'growth_self': score += (state.maxTurn - state.turn + 1) * 1; break;
            case 'immediate_self': score += power; break;
            case 'cost_reduce_hand': score += 1.5; break;
            case 'golden_self_lane': score += 3; break;
            case 'all_lanes': score += power * 3; break;
            case 'all_opp_lanes': score += Math.abs(power) * 2; break;
            case 'self_lane_attack': score += power + Math.abs(eff.oppPower || 0); break;
          }
          if (eff.comboBonus) score += 2;
          const remainingTurns = state.maxTurn - state.turn + 1;
          if (p.c.cost > remainingTurns * 1.5) score -= 1;
          if (!best || score > best.score) best = { i: p.i, L, score };
        }
      }
      if (!best) break;
      pickIdx = best.i; lane = best.L;
    } else {
      break;
    }

    const pickedCard = playable.find(x => x.i === pickIdx)?.c;
    const cardCost = pickedCard ? aiEffCost(pickedCard) : 0;

    // 配置 (placeAICard の me 側 mirror、 アニメ無し)
    const card = { ...state.hand[pickIdx] };
    card._currentPower = card.basePower + dupeBonusOf(card);
    card._appliedTo = [];
    state.hand.splice(pickIdx, 1);
    state.board.me[lane].push(card);
    applyEffect(card, lane, 'me');

    costRemain -= cardCost;
  }
}

function _summarizeSimResults(results) {
  const total = results.length;
  const wins = results.filter(r => r.result === 'win').length;
  const losses = results.filter(r => r.result === 'loss').length;
  const draws = results.filter(r => r.result === 'draw').length;
  const winRate = total > 0 ? Math.round(wins / total * 1000) / 10 : 0;
  const avgScoreMe = total > 0 ? results.reduce((s, r) => s + r.scoreMe, 0) / total : 0;
  const avgScoreOpp = total > 0 ? results.reduce((s, r) => s + r.scoreOpp, 0) / total : 0;
  const avgScoreDiff = avgScoreMe - avgScoreOpp;
  return {
    total, wins, losses, draws,
    winRate: winRate + '%',
    avgScoreMe: Math.round(avgScoreMe * 100) / 100,
    avgScoreOpp: Math.round(avgScoreOpp * 100) / 100,
    avgScoreDiff: Math.round(avgScoreDiff * 100) / 100,
  };
}

async function runSim(diffMe, diffOpp, n) {
  const results = [];
  console.log(`[sim] start ${diffMe} vs ${diffOpp}, n=${n}`);
  const startTime = Date.now();

  for (let i = 0; i < n; i++) {
    // 既存の startMatch を呼ぶ (opp の difficulty)
    startMatch(diffOpp, false);
    // startMatch は内部で sleep + ターン開始を行う、 setTimeout 待ち
    await new Promise(r => setTimeout(r, 50));

    let safety = 50;
    while (!state.ended && safety > 0) {
      safety--;
      // player 側を simulate
      await simulatePlayerTurn(diffMe);
      // 既存 endTurn を呼ぶ (内部で aiTurn + state.turn++ + finishMatch)
      try {
        await endTurn();
      } catch (e) {
        console.warn('[sim] endTurn error', e);
        break;
      }
      // 再生成画面が出る (showMatchResultModal) ので強制スキップ
      const resultModal = document.getElementById('result-modal');
      if (resultModal && !resultModal.hidden) {
        resultModal.hidden = true;
      }
    }

    const result = state.scoreMe > state.scoreOpp ? 'win' :
                   (state.scoreOpp > state.scoreMe ? 'loss' : 'draw');
    results.push({
      result,
      scoreMe: state.scoreMe || 0,
      scoreOpp: state.scoreOpp || 0,
      turn: state.turn,
    });

    if ((i + 1) % 10 === 0) {
      console.log(`[sim] progress ${i + 1}/${n}`);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const summary = _summarizeSimResults(results);
  const output = {
    diffMe, diffOpp, n,
    elapsed: elapsed + 's',
    ...summary,
    rawResults: results,
  };
  console.log('[sim] done', output);

  // 出力
  let resultEl = document.getElementById('sim-result');
  if (!resultEl) {
    resultEl = document.createElement('pre');
    resultEl.id = 'sim-result';
    resultEl.style.cssText = 'position:fixed;top:10px;right:10px;background:#000;color:#0f0;padding:12px;font-size:11px;z-index:9999;max-height:80vh;overflow:auto;border:1px solid #0f0;';
    document.body.appendChild(resultEl);
  }
  resultEl.textContent = JSON.stringify(output, null, 2);
  try {
    localStorage.setItem('pcb-sim-result', JSON.stringify(output));
  } catch (e) {}
  return output;
}

// URL params で sim 起動 (DOMContentLoaded 後に検出)
function _initSimMode() {
  const sp = new URLSearchParams(location.search);
  const simAuto = sp.get('simAuto');
  if (!simAuto) return;

  const m = simAuto.match(/^(easy|normal|hard|master)-vs-(easy|normal|hard|master)$/);
  if (!m) {
    console.warn('[sim] invalid simAuto format, expected: easy-vs-master');
    return;
  }
  const [, diffMe, diffOpp] = m;
  const n = Math.max(1, Math.min(500, parseInt(sp.get('n') || '10')));

  console.log(`[sim] auto-starting ${diffMe} vs ${diffOpp}, n=${n}`);
  // loadMasters 完了を待つ (Cloud auth は未ログインでも sim 動作可なので外す)
  const waitReady = setInterval(() => {
    if (state.allCards && state.allCards.length > 0) {
      clearInterval(waitReady);
      runSim(diffMe, diffOpp, n).catch(e => console.error('[sim] error', e));
    }
  }, 200);
}
window.addEventListener('load', () => setTimeout(_initSimMode, 1500));

window.runSim = runSim;
window.simulatePlayerTurn = simulatePlayerTurn;

// ===== Globals =====
window.startMatch = startMatch;
window.rematch = rematch;
window.nextMatch = nextMatch;
window.mulligan = mulligan;
window.backToCardgameHome = backToCardgameHome;
window.backToPrismaeraHome = backToPrismaeraHome;
window.closeResult = closeResult;
window.closeHelp = closeHelp;
window.closeTutorial = closeTutorial;
window.closeCombosModal = closeCombosModal;
window.closeCharDetail = closeCharDetail;
window.openComboDetailModal = openComboDetailModal;
window.closeComboDetailModal = closeComboDetailModal;
window.openRulebook = openRulebook;
window.closeRulebook = closeRulebook;
window.openShop = openShop;
window.closeShop = closeShop;
window.closeDeckBuilder = closeDeckBuilder;
window.closeDeckFilter = closeDeckFilter;
window.closeDeckSlotPicker = closeDeckSlotPicker;
window.backToSlotPicker = backToSlotPicker;
window.peekBoard = peekBoard;
window.reopenResult = reopenResult;
