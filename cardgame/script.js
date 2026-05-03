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
  laneEffects: [null, null, null], // 試合開始時 ランダム 3 つ
  selectedCardIdx: -1,
  busy: false,
  scoreMe: 0,
  scoreOpp: 0,
  ended: false,
  thisTurnPlacements: [], // [{ cardId, lane }] 自軍のみ、 ターン中の配置履歴
};

// ===== 派閥カラー マッピング =====
const FACTION_COLORS = {
  '原虹':         '#ff8ddc',
  '白焔教会':     '#ffd56b',
  '月光':         '#c8b8ff',
  '雪月神殿':     '#e8e8f8',
  '紅翼':         '#ff8a3a',
  '深緑樹海':     '#7aff8a',
  '紅玉海賊団':   '#ff6b6b',
  'アクアシス':   '#5fdfff',
  '学院':         '#7a9bff',
  '見習い':       '#7afff5',
};
function factionColor(f) { return FACTION_COLORS[f] || '#aaa'; }

// ===== BGM (1曲ループ、 ミュート localStorage 保存) =====
const BGM_URL = '/assets/bgm/prism-cards.mp3';
const BGM_MUTE_KEY = 'cg_bgm_muted';
let cgBgm = null;

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

// ===== Master データロード =====
async function loadMasters() {
  const [c, k, l] = await Promise.all([
    fetch('./cards.json?v=20260504f').then(r => r.json()),
    fetch('./combos.json?v=20260504f').then(r => r.json()),
    fetch('./lane_effects.json?v=20260504f').then(r => r.json()),
  ]);
  state.cards = c;
  state.combos = k;
  state.laneEffectsAll = l;
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

// ===== 試合開始 =====
function startMatch(difficulty) {
  state.difficulty = difficulty;
  state.turn = 1;
  state.cost = 1;
  state.costUsed = 0;
  state.scoreMe = 0;
  state.scoreOpp = 0;
  state.ended = false;
  state.selectedCardIdx = -1;
  state.thisTurnPlacements = [];

  const baseDeck = state.cards.map(c => ({ ...c }));
  state.deck = shuffle(baseDeck);
  state.oppDeck = shuffle(state.cards.map(c => ({ ...c })));
  state.hand = state.deck.splice(0, 4);
  state.oppHand = state.oppDeck.splice(0, 4);

  state.board = { me: [[], [], []], opp: [[], [], []] };

  // レーン効果: ランダム 3 つ重複なし
  const shuffled = shuffle(state.laneEffectsAll);
  state.laneEffects = [shuffled[0], shuffled[1], shuffled[2]];

  $('#home-screen').classList.remove('active');
  $('#match-screen').classList.add('active');
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = true;

  drawTurnStart();
  setMessage(`ターン 1 — レーン効果が決まりました。 ⚡コスト ${state.cost}`);
}

function drawTurnStart() {
  if (state.deck.length > 0 && state.hand.length < 7) state.hand.push(state.deck.shift());
  if (state.oppDeck.length > 0 && state.oppHand.length < 7) state.oppHand.push(state.oppDeck.shift());
  state.cost = state.turn;
  state.costUsed = 0;
  state.thisTurnPlacements = [];
  // 配置済カードの onPlay 一時 buff (_appliedTo) はターンを跨いでも保持する設計 (恒久 buff)
  renderAll();
}

// ===== Power 計算 (派閥シナジー / レーン効果 / コンボ / 凸数 を毎回動的) =====
function dupeBonusOf(card) {
  return (card.dupes || 0) * (card.dupeBonus || 0);
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
  [0, 1, 2].forEach(lane => {
    const e = state.laneEffects[lane];
    const labelMe = $(`#lanes-me .cg-lane[data-lane="${lane}"] .cg-lane-name`);
    const labelOpp = $(`#lanes-opp .cg-lane[data-lane="${lane}"] .cg-lane-name`);
    if (!e) return;
    const txt = `L${lane + 1} ${e.icon} ${e.name}`;
    if (labelMe) labelMe.textContent = txt;
    if (labelOpp) labelOpp.textContent = txt;
    [`#lanes-me .cg-lane[data-lane="${lane}"]`, `#lanes-opp .cg-lane[data-lane="${lane}"]`].forEach(s => {
      const el = $(s); if (el) el.title = e.description;
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
        // 自分のカードかつ ターン内 配置済 → undo 可能 (クリックで取消)
        if (side === 'me' && state.thisTurnPlacements.some(p => p.cardId === card.id && p.lane === lane)) {
          el.classList.add('undoable');
          el.title = 'タップで手札に戻す';
          el.addEventListener('click', () => undoMyCard(lane, boardIdx));
        }
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
    <div class="cg-card-name">${card.name}</div>
    ${showEffect && card.effectText ? `<div class="cg-card-effect">${card.effectText}</div>` : ''}
    <div class="cg-card-stats">
      <span class="cg-card-cost">⚡${card.cost}</span>
      <span class="cg-card-power">⚔${displayPower}</span>
    </div>
  `;
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

// ===== 手札カード選択 =====
function onHandCardClick(idx) {
  if (state.busy || state.ended) return;
  const card = state.hand[idx];
  if (card.cost > state.cost - state.costUsed) {
    setMessage(`コスト不足: ${card.name} (⚡${card.cost} 必要、 残${state.cost - state.costUsed})`, 'alert');
    return;
  }
  if (state.selectedCardIdx === idx) {
    state.selectedCardIdx = -1;
    $$('.lane-target').forEach(el => el.classList.remove('lane-target'));
    setMessage('選択解除');
  } else {
    state.selectedCardIdx = idx;
    $$('#lanes-me .cg-lane').forEach(el => {
      if (state.board.me[Number(el.dataset.lane)].length < 4) el.classList.add('lane-target');
    });
    setMessage(`配置先レーンを選択: ${card.name}`);
  }
  renderHand();
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
  state.hand.splice(handIdx, 1);
  state.board.me[lane].push(card);
  state.costUsed += card.cost;
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

// ===== 効果発動 (onPlay) =====
function applyEffect(card, lane, side) {
  const eff = card.effect;
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
  state.costUsed -= card.cost;
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

  setMessage('AIの手番...');
  await sleep(400);
  await aiTurn();

  if (state.turn >= state.maxTurn) {
    state.busy = false;
    finishMatch();
    return;
  }
  state.turn += 1;
  drawTurnStart();
  setMessage(`ターン ${state.turn} — ⚡コスト ${state.cost}`);
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

// ===== 試合終了 =====
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

  let title, icon, detail;
  if (me > opp) {
    title = '勝利'; icon = '🏆';
    detail = `3レーン中 ${me} レーン勝利。 おめでとう、 虹意の祝福を。`;
  } else if (opp > me) {
    title = '敗北'; icon = '💧';
    detail = `AIに ${opp} レーン取られた。 派閥シナジーやコンボを狙って リトライ。`;
  } else {
    title = '引き分け'; icon = '⚖️';
    detail = `${me} : ${opp} の互角。 もう一度挑戦しよう。`;
  }
  $('#result-icon').textContent = icon;
  $('#result-title').textContent = title;
  $('#result-detail').textContent = detail;
  $('#result-modal').hidden = false;
}

function rematch() {
  $('#result-modal').hidden = true;
  $('#result-peek-btn').hidden = true;
  startMatch(state.difficulty);
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

// ===== モーダル =====
function closeResult() { $('#result-modal').hidden = true; }
function openHelp() { $('#help-modal').hidden = false; }
function closeHelp() { $('#help-modal').hidden = true; }
function openTutorial() { $('#tutorial-modal').hidden = false; }
function closeTutorial() { $('#tutorial-modal').hidden = true; }

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
}
function closeCombosModal() { $('#combos-modal').hidden = true; }

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
  await loadMasters();
  $('#btn-start-easy').addEventListener('click', () => startMatch('easy'));
  $('#btn-start-normal').addEventListener('click', () => startMatch('normal'));
  $('#btn-start-hard').addEventListener('click', () => startMatch('hard'));
  $('#btn-start-master').addEventListener('click', () => startMatch('master'));
  $('#btn-tutorial').addEventListener('click', openTutorial);
  $('#btn-help').addEventListener('click', openHelp);
  $('#btn-undo').addEventListener('click', resetThisTurn);
  $('#btn-combos').addEventListener('click', openCombosModal);
  $('#btn-cg-mute').addEventListener('click', toggleBgmMute);
  $('.cg-back').addEventListener('click', onBackClick);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResult(); closeHelp(); closeTutorial(); closeCombosModal();
    }
  });
});

// ===== Globals =====
window.startMatch = startMatch;
window.rematch = rematch;
window.backToCardgameHome = backToCardgameHome;
window.backToPrismaeraHome = backToPrismaeraHome;
window.closeResult = closeResult;
window.closeHelp = closeHelp;
window.closeTutorial = closeTutorial;
window.closeCombosModal = closeCombosModal;
window.peekBoard = peekBoard;
window.reopenResult = reopenResult;
