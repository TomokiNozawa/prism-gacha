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
};
function isChapterReleased(ch) {
  if (!ch || !CHAPTER_RELEASE.hasOwnProperty(ch)) return true;
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

// ===== BGM (1曲ループ、 ミュート localStorage 保存) =====
const BGM_URL = '/assets/bgm/prism-cards.mp3';
const BGM_MUTE_KEY = 'cg_bgm_muted';
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
  const muted = localStorage.getItem(BGM_MUTE_KEY) === '1';
  cgBgm.muted = muted;
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
  localStorage.setItem(BGM_MUTE_KEY, cgBgm.muted ? '1' : '0');
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

// ===== Master データロード (公開済章のみ filter、 cards.json + pool.json 統合) =====
// P-6: pool.json は本体 POOL から自動生成 (scripts/export_pool_for_cardgame.py)
// cards.json は手書き override (同名なら cards.json 優先)
async function loadMasters() {
  const [c, k, l, p] = await Promise.all([
    fetch('./cards.json?v=20260504n').then(r => r.json()),
    fetch('./combos.json?v=20260504n').then(r => r.json()),
    fetch('./lane_effects.json?v=20260504n').then(r => r.json()),
    fetch('./data/pool.json?v=20260504n').then(r => r.json()).catch(() => []),
  ]);
  // pool 全カード ← cards.json で override
  const cardsByName = new Map();
  p.forEach(card => cardsByName.set(card.name, card));
  c.forEach(card => cardsByName.set(card.name, card));  // override
  state.allCards = Array.from(cardsByName.values()).filter(card => isChapterReleased(card.chapter));
  // 後方互換: state.cards は state.allCards のフルセット (デフォルトデッキ用、 デッキ編集で絞られる時もある)
  state.cards = state.allCards;
  state.laneEffectsAll = l.filter(e => isChapterReleased(e.chapter));
  const cardNames = new Set(state.allCards.map(card => card.name));
  state.combos = k.filter(combo => combo.chars.every(name => cardNames.has(name)));
  // ユーザー所持・凸数を反映 (本体 prism-gacha localStorage)
  applyUserDupes();
}

// ===== P-5: デッキ管理 (3スロット、 localStorage 永続化、 12枚) =====
const DECK_SIZE = 12;
const DECK_SLOT_COUNT = 3;
const DECK_SLOT_KEY = (n) => `cg_deck_v2_slot${n}`;
const ACTIVE_SLOT_KEY = 'cg_deck_active_slot';
// 本体 Prismaera の MAX_DUPS と同期 (script.js 692)
const MAX_DUPS = { R: 1, SR: 2, SSR: 3, UR: 4, LR: 4 };

function getActiveSlot() {
  const v = parseInt(localStorage.getItem(ACTIVE_SLOT_KEY) || '1', 10);
  return v >= 1 && v <= DECK_SLOT_COUNT ? v : 1;
}
function setActiveSlot(n) {
  if (n >= 1 && n <= DECK_SLOT_COUNT) localStorage.setItem(ACTIVE_SLOT_KEY, String(n));
}
function loadDeckSlot(n) {
  try {
    const raw = localStorage.getItem(DECK_SLOT_KEY(n));
    if (!raw) return null;
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids : null;
  } catch (e) { return null; }
}
function saveDeckSlot(n, ids) {
  localStorage.setItem(DECK_SLOT_KEY(n), JSON.stringify(ids));
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
  if (isMaxDup(card)) return Math.max(0, card.cost - 1);
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

// おまかせデッキ生成 (派閥シナジー優先 = 同派閥多めで自動構築)
function generateAutoDeck() {
  const byFaction = {};
  state.allCards.forEach(c => {
    if (!byFaction[c.faction]) byFaction[c.faction] = [];
    byFaction[c.faction].push(c);
  });
  // 同派閥 ≥ 3 の派閥を優先選択
  const factions = Object.entries(byFaction)
    .filter(([f, arr]) => arr.length >= 3)
    .sort((a, b) => b[1].length - a[1].length);
  const picked = [];
  for (const [, arr] of factions) {
    const need = DECK_SIZE - picked.length;
    if (need <= 0) break;
    const sorted = [...arr].sort((a, b) => {
      const order = { LR: 5, UR: 4, SSR: 3, SR: 2, R: 1 };
      return order[b.tier] - order[a.tier];
    });
    picked.push(...sorted.slice(0, Math.min(4, need)));
  }
  // 足りない分はランダム fill
  while (picked.length < DECK_SIZE) {
    const remaining = state.allCards.filter(c => !picked.some(p => p.id === c.id));
    if (remaining.length === 0) break;
    picked.push(remaining[Math.floor(Math.random() * remaining.length)]);
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
  const moverLabel = state.firstMover === 'me' ? '先行' : '後攻';
  const seriesLabel = state.series.isBO3 ? `BO3モード 第${state.series.matchNo}試合 (${moverLabel}) ` : '';
  setMessage(`${seriesLabel}ターン 1 — レーン効果決定。 マリガン (引き直し1回) 可。`);
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
  // 後攻時はターン頭で AI が先に配置 (ユーザーは AI の手を見てから配置可能)
  if (state.firstMover === 'opp' && !state.ended) {
    state.busy = true;
    renderAll();
    setMessage(`ターン ${state.turn} (後攻) — AI が先に配置中...`);
    await sleep(400);
    await aiTurn();
    state.thisTurnAiDone = true;
    state.busy = false;
    setMessage(`ターン ${state.turn} (後攻) — あなたの番です`);
  }
  renderAll();
}

// ===== Power 計算 (派閥シナジー / レーン効果 / コンボ / 凸数 を毎回動的) =====
// 凸 0 = +0、 凸 半分以上 = +1、 凸 MAX = +2 (DESIGN 4.3 段階パターン簡易版)
function dupeBonusOf(card) {
  const max = MAX_DUPS[card.tier] || 0;
  if (max === 0 || (card.dupes || 0) === 0) return 0;
  if (card.dupes >= max) return 2;
  if (card.dupes >= Math.ceil(max / 2)) return 1;
  return 0;
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
function comboBonusFor(card, side, lane) {
  let bonus = 0;
  for (const combo of state.combos) {
    if (!combo.chars.includes(card.name)) continue;
    const allCardsAnyLane = [].concat(...state.board[side]);
    const sameLaneCards = state.board[side][lane];
    const has = (charName, cards) => cards.some(c => c.name === charName);
    let triggered = false;
    if (combo.condition === 'same_lane') {
      triggered = combo.chars.every(c => has(c, sameLaneCards));
    } else if (combo.condition === 'any_lane') {
      triggered = combo.chars.every(c => has(c, allCardsAnyLane));
    }
    if (triggered) bonus += combo.effect.power;
  }
  return bonus;
}
function getCardPower(card, side, lane) {
  let p = card.basePower + dupeBonusOf(card);
  // onPlay の固定 delta (相手カードからの -2 等) は _currentPower 経由 (累積)
  if (card._currentPower != null) p = card._currentPower + dupeBonusOf(card);
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
  // ストーリーコンボ
  p += comboBonusFor(card, side, lane);
  return p;
}
function getLanePower(side, lane) {
  return state.board[side][lane].reduce((s, c) => s + getCardPower(c, side, lane), 0);
}

// ===== 描画 =====
function renderAll() {
  $('#hud-turn').textContent = state.turn;
  $('#hud-cost').textContent = (state.cost - state.costUsed) + ' / ' + state.cost;
  $('#hand-count').textContent = state.hand.length;
  $('.cg-score-me').textContent = state.scoreMe;
  $('.cg-score-ai').textContent = state.scoreOpp;
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
    // スマホ: 「L1 🌊」 だけ (名前 + 効果は title で確認)、 PC: フル表示
    const txt = isMobile ? `L${lane + 1} ${e.icon}` : `L${lane + 1} ${e.icon} ${e.name}`;
    const titleTxt = `${e.name} — ${e.description}`;
    if (labelMe) { labelMe.textContent = txt; labelMe.title = titleTxt; }
    if (labelOpp) { labelOpp.textContent = txt; labelOpp.title = titleTxt; }
    [`#lanes-me .cg-lane[data-lane="${lane}"]`, `#lanes-opp .cg-lane[data-lane="${lane}"]`].forEach(s => {
      const el = $(s); if (el) el.title = titleTxt;
    });
  });
}

function renderHand() {
  const handEl = $('#hand');
  handEl.innerHTML = '';
  state.hand.forEach((card, idx) => {
    const cardEl = makeCardElement(card, true);
    if (state.selectedCardIdx === idx) cardEl.classList.add('selected');
    if (card.cost > state.cost - state.costUsed) cardEl.classList.add('unaffordable');
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
  el.style.setProperty('--faction-color', factionColor(card.faction));
  const imgUrl = card.img ? '..' + card.img : '';
  const imgStyle = imgUrl ? `background-image: url('${imgUrl}')` : '';
  const imgClass = imgUrl ? '' : 'no-img';
  const dupesBadge = card.dupes > 0 ? `<span class="cg-card-dupes" title="凸 ${card.dupes}">+${card.dupes}</span>` : '';
  const displayPower = card._currentPower != null ? card._currentPower : (card.basePower + dupeBonusOf(card));
  el.innerHTML = `
    <div class="cg-card-tier ${card.tier}">${card.tier}${dupesBadge}</div>
    <div class="cg-card-faction" style="background:${factionColor(card.faction)}">${card.faction}</div>
    <div class="cg-card-img ${imgClass}" style="${imgStyle}"></div>
    <button class="cg-card-info-btn" type="button" aria-label="詳細" title="詳細を見る">i</button>
    <div class="cg-card-name">${card.name}</div>
    ${showEffect && card.effectText ? `<div class="cg-card-effect">${card.effectText}</div>` : ''}
    <div class="cg-card-stats">
      <span class="cg-card-cost">⚡${card.cost}</span>
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
  const cost = effectiveCost(card);
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
  $('#char-detail-cost').textContent = card.cost;
  $('#char-detail-base').textContent = card.basePower;
  const dupeBonus = (card.dupes || 0) * (card.dupeBonus || 0);
  $('#char-detail-bonus').textContent = '+' + dupeBonus;
  $('#char-detail-total').textContent = card.basePower + dupeBonus;
  $('#char-detail-effect').textContent = card.effectText || '効果なし';
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
  state.hand.splice(handIdx, 1);
  state.board.me[lane].push(card);
  state.costUsed += effectiveCost(card);
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

// ===== 効果発動 (onPlay、 凸数で範囲拡大 + power +1) =====
function applyEffect(card, lane, side) {
  const eff = effectiveEffect(card);
  if (!eff || eff.trigger !== 'onPlay') return;
  const myBoard = state.board[side];
  const oppSide = side === 'me' ? 'opp' : 'me';
  const oppBoard = state.board[oppSide];

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
      oppBoard[lane].forEach(c => add(c, eff.power));
      break;
    case 'all_opp_lanes':
      [0, 1, 2].forEach(L => oppBoard[L].forEach(c => add(c, eff.power)));
      break;
    case 'self_lane_attack':
      myBoard[lane].forEach(c => add(c, eff.power));
      oppBoard[lane].forEach(c => add(c, eff.oppPower || 0));
      break;
  }
  if (eff.selfBonus) {
    card._currentPower = (card._currentPower != null ? card._currentPower : (card.basePower + dupeBonusOf(card))) + eff.selfBonus;
  }
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
  // 効果を逆適用
  if (card._appliedTo) {
    card._appliedTo.forEach(({ target, delta }) => {
      target._currentPower = (target._currentPower != null ? target._currentPower : (target.basePower + dupeBonusOf(target))) - delta;
    });
  }
  state.board.me[lane].splice(boardIdx, 1);
  state.costUsed -= effectiveCost(card);
  state.thisTurnPlacements.splice(placementIdx, 1);
  // hand に戻す (state を綺麗に)
  delete card._appliedTo;
  delete card._currentPower;
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

  if (state.turn >= state.maxTurn) {
    state.busy = false;
    finishMatch();
    return;
  }
  state.turn += 1;
  await drawTurnStart();
  if (state.firstMover === 'me') {
    setMessage(`ターン ${state.turn} — ⚡コスト ${state.cost}`);
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
    const playable = state.oppHand.map((c, i) => ({ c, i })).filter(x => x.c.cost <= remaining);
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
      // (card, lane) 評価: コスト価値 + 同派閥シナジー + 劣勢補強 + 高コストカードは終盤温存
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
      let best = null;
      for (const p of playable) {
        for (const L of openLanes) {
          // simulate
          const card = { ...p.c, _currentPower: p.c.basePower + dupeBonusOf(p.c), _appliedTo: [] };
          state.board.opp[L].push(card);
          applyEffect(card, L, 'opp');
          // 配置後の評価: 自軍3レーン total + 「自軍勝ちレーン数」 +5 each
          let score = 0;
          for (let LL = 0; LL < 3; LL++) {
            const oppP = getLanePower('opp', LL);
            const meP = getLanePower('me', LL);
            score += oppP - meP;
            if (oppP > meP) score += 5;
          }
          // コンボ判定 (簡易)
          for (const combo of state.combos) {
            const oppCardsAll = [].concat(...state.board.opp);
            const inLane = state.board.opp[L];
            let trig = false;
            if (combo.condition === 'same_lane') trig = combo.chars.every(c => inLane.some(x => x.name === c));
            else if (combo.condition === 'any_lane') trig = combo.chars.every(c => oppCardsAll.some(x => x.name === c));
            if (trig) score += combo.effect.power * 1.5;
          }
          // revert
          if (card._appliedTo) {
            card._appliedTo.forEach(({target, delta}) => {
              target._currentPower = (target._currentPower != null ? target._currentPower : (target.basePower + dupeBonusOf(target))) - delta;
            });
          }
          state.board.opp[L].pop();
          if (!best || score > best.score) best = { i: p.i, L, score };
        }
      }
      if (!best) break;
      pickIdx = best.i; lane = best.L;
    }

    const cardCost = playable.find(x => x.i === pickIdx)?.c.cost || 0;
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
  startMatch(state.difficulty, true);
}

function rematch() {
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = true;
  // BO3 終了後 rematch なら新シリーズ
  state.series = { isBO3: state.series.isBO3, wins: { me: 0, opp: 0 }, matchNo: 1, results: [] };
  startMatch(state.difficulty, state.series.isBO3);
}

function updateSeriesHud() {
  const el = document.getElementById('series-info');
  if (!el) return;
  const diffMap = { easy: '🌱 Easy', normal: '⚔️ Normal', hard: '🔥 Hard', master: '👑 Master' };
  const diffLabel = diffMap[state.difficulty] || '?';
  if (state.series.isBO3) {
    el.style.display = '';
    el.innerHTML = `<span class="cg-diff-tag">${diffLabel}</span><span class="cg-mode-tag bo3">🏆 BO3モード</span><span class="cg-series-progress">第<b>${state.series.matchNo}</b>/3 — ${state.series.wins.me}<span class="cg-score-vs">:</span>${state.series.wins.opp}</span><span class="cg-mover-tag">${state.firstMover === 'me' ? '先攻' : '後攻'}</span>`;
  } else {
    el.style.display = '';
    el.innerHTML = `<span class="cg-diff-tag">${diffLabel}</span><span class="cg-mode-tag">単発</span>`;
  }
}

function backToCardgameHome() {
  // cardgame ホーム (難易度選択)
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = true;
  $('#match-screen').classList.remove('active');
  $('#home-screen').classList.add('active');
}

function backToPrismaeraHome() {
  location.href = '/';
}

// 結果モーダルから「場を見る」 押下 → モーダル一時クローズ + floating「結果に戻る」
function peekBoard() {
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = false;
}
function reopenResult() {
  $('#result-modal').hidden = false;
  $('#result-peek-btn').hidden = true;
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
      // 上限超え: 警告表示
      const counter = $('.cg-deck-builder-counter');
      if (counter) {
        counter.classList.add('flash-alert');
        setTimeout(() => counter.classList.remove('flash-alert'), 600);
      }
      return;
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
      <div class="cg-combo-item ${c.triggered ? 'triggered' : 'pending'}">
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
      </div>
    `).join('');
  }
  $('#combos-modal').hidden = false;
  _setBodyModalOpen();
}
function closeCombosModal() { $('#combos-modal').hidden = true; _setBodyModalOpen(); }

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
  initBgm();
  _initVisibilityHandler();
  await loadMasters();
  // BO3 toggle (localStorage 永続化)
  const bo3Toggle = document.getElementById('bo3-toggle');
  if (bo3Toggle) {
    bo3Toggle.checked = localStorage.getItem('cg_bo3') === '1';
    bo3Toggle.addEventListener('change', () => {
      localStorage.setItem('cg_bo3', bo3Toggle.checked ? '1' : '0');
    });
  }
  const getBo3 = () => bo3Toggle && bo3Toggle.checked;
  $('#btn-start-easy').addEventListener('click', () => startMatch('easy', getBo3()));
  $('#btn-start-normal').addEventListener('click', () => startMatch('normal', getBo3()));
  $('#btn-start-hard').addEventListener('click', () => startMatch('hard', getBo3()));
  $('#btn-start-master').addEventListener('click', () => startMatch('master', getBo3()));
  $('#btn-tutorial').addEventListener('click', openTutorial);
  $('#btn-help').addEventListener('click', openHelp);
  $('#btn-undo').addEventListener('click', resetThisTurn);
  $('#btn-combos').addEventListener('click', openCombosModal);
  $('#btn-mulligan').addEventListener('click', mulligan);
  $('#btn-cg-mute').addEventListener('click', toggleBgmMute);
  $('.cg-back').addEventListener('click', onBackClick);
  // P-5: デッキ編集 (ホームの「デッキ編集」 ボタン → スロット選択)
  const openDeckBtn = document.getElementById('btn-open-deck-builder');
  if (openDeckBtn) openDeckBtn.addEventListener('click', openDeckSlotPicker);
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
      closeResult(); closeHelp(); closeTutorial(); closeCombosModal(); closeCharDetail(); closeDeckFilter(); closeDeckBuilder();
    }
  });
});

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
window.closeDeckBuilder = closeDeckBuilder;
window.closeDeckFilter = closeDeckFilter;
window.closeDeckSlotPicker = closeDeckSlotPicker;
window.backToSlotPicker = backToSlotPicker;
window.peekBoard = peekBoard;
window.reopenResult = reopenResult;
