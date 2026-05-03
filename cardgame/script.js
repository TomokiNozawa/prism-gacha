/* ============================================================
   Prismaera Cards — PoC Phase 0 ロジック (v0.1)
   - 6ターン固定、 3レーン × 4枠、 vs AI (Easy/Normal)
   - 効果は onPlay 単純パターン (self_lane / adjacent_lanes / all_lanes / opp_self_lane / all_opp_lanes / self_lane_attack)
   - 派閥シナジー / 凸数効果 / コンボは Phase 1 で実装
   ============================================================ */
"use strict";

// ===== State =====
const state = {
  cards: [],          // マスタ (cards.json)
  difficulty: 'easy', // easy / normal
  turn: 1,
  maxTurn: 6,
  cost: 1,
  costUsed: 0,
  hand: [],           // [{...card}]
  deck: [],           // 残りデッキ
  oppHand: [],
  oppDeck: [],
  board: { me: [[], [], []], opp: [[], [], []] },
  selectedCardIdx: -1,
  busy: false,
  scoreMe: 0,
  scoreOpp: 0,
  ended: false,
};

// ===== カードロード =====
async function loadCards() {
  const res = await fetch('./cards.json?v=20260504a');
  state.cards = await res.json();
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

  // デッキ = 全 12 枚 (PoC ではデッキ構築なし、 全カード使用)
  const baseDeck = [...state.cards];
  state.deck = shuffle(baseDeck);
  state.oppDeck = shuffle(baseDeck);
  state.hand = state.deck.splice(0, 4);
  state.oppHand = state.oppDeck.splice(0, 4);

  state.board = { me: [[], [], []], opp: [[], [], []] };

  // 画面切替
  $('#home-screen').classList.remove('active');
  $('#match-screen').classList.add('active');

  // 初期描画
  drawTurnStart();
  setMessage(`ターン 1 開始 — コスト ${state.cost}`);
}

function drawTurnStart() {
  // ターン開始時 1 枚 draw (ターン1 は既に 4 枚配ったので追加 1 枚で 5 枚スタート)
  if (state.deck.length > 0) state.hand.push(state.deck.shift());
  if (state.oppDeck.length > 0) state.oppHand.push(state.oppDeck.shift());
  state.cost = state.turn;
  state.costUsed = 0;
  renderAll();
}

// ===== 描画 =====
function renderAll() {
  $('#hud-turn').textContent = state.turn;
  $('#hud-cost').textContent = (state.cost - state.costUsed) + ' / ' + state.cost;
  $('#hand-count').textContent = state.hand.length;
  $('.cg-score-me').textContent = state.scoreMe;
  $('.cg-score-ai').textContent = state.scoreOpp;

  renderHand();
  renderBoard();
  updateLanePowers();
}

function renderHand() {
  const handEl = $('#hand');
  handEl.innerHTML = '';
  state.hand.forEach((card, idx) => {
    const cardEl = makeCardElement(card, /*showEffect*/ true);
    if (state.selectedCardIdx === idx) cardEl.classList.add('selected');
    if (card.cost > state.cost - state.costUsed) cardEl.classList.add('unaffordable');
    cardEl.addEventListener('click', () => onHandCardClick(idx));
    handEl.appendChild(cardEl);
  });
}

function renderBoard() {
  ['me', 'opp'].forEach(side => {
    [0, 1, 2].forEach(lane => {
      const slotsEl = $(`#${side === 'opp' ? 'opp' : 'me'}-slots-${lane}`);
      slotsEl.innerHTML = '';
      state.board[side][lane].forEach(card => {
        const el = makeCardElement(card, /*showEffect*/ false);
        if (side === 'opp') el.classList.add('opp');
        slotsEl.appendChild(el);
      });
    });
  });
}

function makeCardElement(card, showEffect) {
  const el = document.createElement('div');
  el.className = 'cg-card';
  el.innerHTML = `
    <div class="cg-card-tier ${card.tier}">${card.tier}</div>
    <div class="cg-card-name">${card.name}</div>
    <div class="cg-card-stats">
      <span class="cg-card-cost">⚡${card.cost}</span>
      <span class="cg-card-power">⚔${card._currentPower != null ? card._currentPower : card.basePower}</span>
    </div>
    ${showEffect && card.effectText ? `<div class="cg-card-effect">${card.effectText}</div>` : ''}
  `;
  return el;
}

function updateLanePowers() {
  [0, 1, 2].forEach(lane => {
    const mePow = state.board.me[lane].reduce((s, c) => s + (c._currentPower != null ? c._currentPower : c.basePower), 0);
    const oppPow = state.board.opp[lane].reduce((s, c) => s + (c._currentPower != null ? c._currentPower : c.basePower), 0);
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
  state.selectedCardIdx = idx;
  // レーンをハイライト
  $$('#lanes-me .cg-lane').forEach(el => {
    if (state.board.me[Number(el.dataset.lane)].length < 4) el.classList.add('lane-target');
  });
  setMessage(`配置先レーンを選択: ${card.name}`);
  renderHand();
}

// ===== レーン選択 (配置) =====
$$('#lanes-me .cg-lane').forEach(el => {
  el.addEventListener('click', () => {
    if (state.selectedCardIdx === -1 || state.busy || state.ended) return;
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
  card._currentPower = card.basePower;
  state.hand.splice(handIdx, 1);
  state.board.me[lane].push(card);
  state.costUsed += card.cost;
  state.selectedCardIdx = -1;
  // 効果発動
  applyEffect(card, lane, 'me');
  // ハイライト解除
  $$('.lane-target').forEach(el => el.classList.remove('lane-target'));
  setMessage(`${card.name} を L${lane + 1} に配置 (${card.effectText || '効果なし'})`, 'success');
  renderAll();

  // アニメ
  setTimeout(() => {
    const slotsEl = $(`#me-slots-${lane}`);
    const last = slotsEl.lastElementChild;
    if (last) last.classList.add('placed-anim');
  }, 10);
}

// ===== 効果発動 (PoC: onPlay のみ、 簡素) =====
function applyEffect(card, lane, side) {
  const eff = card.effect;
  if (!eff || eff.trigger !== 'onPlay') return;
  const myBoard = state.board[side];
  const oppSide = side === 'me' ? 'opp' : 'me';
  const oppBoard = state.board[oppSide];

  switch (eff.target) {
    case 'self_lane':
      myBoard[lane].forEach(c => { c._currentPower = (c._currentPower || c.basePower) + eff.power; });
      break;
    case 'adjacent_lanes':
      [lane - 1, lane + 1].filter(L => L >= 0 && L <= 2).forEach(L => {
        myBoard[L].forEach(c => { c._currentPower = (c._currentPower || c.basePower) + eff.power; });
      });
      break;
    case 'all_lanes':
      [0, 1, 2].forEach(L => {
        myBoard[L].forEach(c => { c._currentPower = (c._currentPower || c.basePower) + eff.power; });
      });
      break;
    case 'opp_self_lane':
      oppBoard[lane].forEach(c => { c._currentPower = (c._currentPower || c.basePower) + eff.power; });
      break;
    case 'all_opp_lanes':
      [0, 1, 2].forEach(L => {
        oppBoard[L].forEach(c => { c._currentPower = (c._currentPower || c.basePower) + eff.power; });
      });
      break;
    case 'self_lane_attack':
      myBoard[lane].forEach(c => { c._currentPower = (c._currentPower || c.basePower) + eff.power; });
      oppBoard[lane].forEach(c => { c._currentPower = (c._currentPower || c.basePower) + (eff.oppPower || 0); });
      break;
  }
  if (eff.selfBonus) {
    card._currentPower = (card._currentPower || card.basePower) + eff.selfBonus;
  }
}

// ===== ターン終了 =====
$('#btn-end-turn').addEventListener('click', endTurn);

async function endTurn() {
  if (state.busy || state.ended) return;
  state.busy = true;
  $('#btn-end-turn').disabled = true;

  setMessage('AIの手番...');
  await sleep(500);
  await aiTurn();

  // ターン進行
  if (state.turn >= state.maxTurn) {
    state.busy = false;
    finishMatch();
    return;
  }
  state.turn += 1;
  drawTurnStart();
  setMessage(`ターン ${state.turn} 開始 — コスト ${state.cost}`);
  state.busy = false;
  $('#btn-end-turn').disabled = false;
}

// ===== AI 手番 =====
async function aiTurn() {
  let aiCost = state.turn;
  let aiCostUsed = 0;
  // Easy: ランダムにカード選択 → 1〜複数枚配置
  // Normal: コスト最大化 (使えるコストを目一杯使う)
  let attempts = 0;
  while (aiCostUsed < aiCost && attempts < 8) {
    attempts++;
    const remaining = aiCost - aiCostUsed;
    const playable = state.oppHand
      .map((c, i) => ({ c, i }))
      .filter(x => x.c.cost <= remaining);
    if (playable.length === 0) break;

    let pick;
    if (state.difficulty === 'easy') {
      pick = playable[Math.floor(Math.random() * playable.length)];
      // Easy は 50% で配置スキップ
      if (Math.random() < 0.4) break;
    } else {
      // Normal: 最大コストカード優先
      playable.sort((a, b) => b.c.cost - a.c.cost);
      pick = playable[0];
    }

    // レーン選択: 空いているレーンの中で「自軍が劣勢のレーン」 を補強 (Normal) / ランダム (Easy)
    let lane;
    if (state.difficulty === 'easy') {
      const openLanes = [0, 1, 2].filter(L => state.board.opp[L].length < 4);
      if (openLanes.length === 0) break;
      lane = openLanes[Math.floor(Math.random() * openLanes.length)];
    } else {
      const lanes = [0, 1, 2].map(L => ({
        L,
        diff: laneDiff(L, 'opp'),
        full: state.board.opp[L].length >= 4,
      })).filter(x => !x.full);
      if (lanes.length === 0) break;
      lanes.sort((a, b) => a.diff - b.diff);
      lane = lanes[0].L;
    }

    placeAICard(pick.i, lane);
    aiCostUsed += pick.c.cost;
    await sleep(350);
  }
  setMessage(`AIが ${aiCostUsed} コスト分配置`, 'success');
}

function laneDiff(lane, side) {
  const my = state.board[side][lane].reduce((s, c) => s + (c._currentPower || c.basePower), 0);
  const opp = state.board[side === 'me' ? 'opp' : 'me'][lane].reduce((s, c) => s + (c._currentPower || c.basePower), 0);
  return my - opp;
}

function placeAICard(handIdx, lane) {
  const card = { ...state.oppHand[handIdx] };
  card._currentPower = card.basePower;
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ===== 試合終了 =====
function finishMatch() {
  state.ended = true;
  let me = 0, opp = 0;
  for (let L = 0; L < 3; L++) {
    const meP = state.board.me[L].reduce((s, c) => s + (c._currentPower || c.basePower), 0);
    const oppP = state.board.opp[L].reduce((s, c) => s + (c._currentPower || c.basePower), 0);
    if (meP > oppP) me++;
    else if (oppP > meP) opp++;
  }
  state.scoreMe = me;
  state.scoreOpp = opp;
  renderAll();

  let title, icon, detail;
  if (me > opp) {
    title = '勝利'; icon = '🏆';
    detail = `3レーンのうち ${me} レーンで勝利。 おめでとう、 虹意の祝福を。`;
  } else if (opp > me) {
    title = '敗北'; icon = '💧';
    detail = `AIに ${opp} レーン取られた。 別のデッキ構築や配置を試そう。`;
  } else {
    title = '引き分け'; icon = '⚖️';
    detail = `${me} : ${opp} の互角。 もう一度挑戦してみよう。`;
  }
  $('#result-icon').textContent = icon;
  $('#result-title').textContent = title;
  $('#result-detail').textContent = detail;
  $('#result-modal').hidden = false;
}

function rematch() {
  $('#result-modal').hidden = true;
  startMatch(state.difficulty);
}

function backToHome() {
  $('#result-modal').hidden = true;
  $('#match-screen').classList.remove('active');
  $('#home-screen').classList.add('active');
}

// ===== モーダル =====
function closeResult() { $('#result-modal').hidden = true; }
function openHelp() { $('#help-modal').hidden = false; }
function closeHelp() { $('#help-modal').hidden = true; }
function openTutorial() { $('#tutorial-modal').hidden = false; }
function closeTutorial() { $('#tutorial-modal').hidden = true; }

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadCards();
  $('#btn-start-easy').addEventListener('click', () => startMatch('easy'));
  $('#btn-start-normal').addEventListener('click', () => startMatch('normal'));
  $('#btn-tutorial').addEventListener('click', openTutorial);
  $('#btn-help').addEventListener('click', openHelp);

  // Esc で閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResult(); closeHelp(); closeTutorial();
    }
  });
});

// ===== Globals (HTML から呼ばれる) =====
window.startMatch = startMatch;
window.rematch = rematch;
window.backToHome = backToHome;
window.closeResult = closeResult;
window.closeHelp = closeHelp;
window.closeTutorial = closeTutorial;
