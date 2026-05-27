/* ============================================================
   プリズムボード (Prism Board) — Phase 0 PoC
   オートチェス系: ショップ → 配置 → 3体合成 → 派閥シナジー → 自動戦闘
   全3ラウンド (テンポ確認版)。設計: DESIGN_PRISMBOARD.md
   ============================================================ */
'use strict';
(function () {

  // ===== 定数 (DESIGN §3/§4/§5/§10 準拠) =====
  const MAX_ROUND   = 3;
  const STAR_MULT   = { 1: 1.0, 2: 2.2, 3: 4.0 };
  const HP_PER_BP   = 12;
  const ATK_PER_BP  = 1.0;
  const TIERS       = ['R', 'SR', 'SSR', 'UR', 'LR'];
  // レベル別 ショップ排出率 % (R/SR/SSR/UR/LR) — §10
  const DROP_RATES = {
    2: [75, 25,  0,  0, 0],
    3: [60, 30, 10,  0, 0],
    4: [45, 33, 20,  2, 0],
    5: [35, 35, 25,  5, 0],
    6: [25, 35, 28, 11, 1],
    7: [18, 30, 32, 17, 3],
    8: [12, 25, 33, 24, 6],
  };
  // 累計XP → レベル到達閾値 (§3、 圧縮)
  const XP_THRESHOLDS = { 3: 2, 4: 8, 5: 18, 6: 34, 7: 54, 8: 80 };
  const BOARD_CELLS = 12;       // 横4 × 縦3
  const BENCH_SIZE  = 8;
  const SHOP_SIZE   = 5;
  const REROLL_COST = 2;
  const XP_BUY_COST = 4, XP_BUY_AMT = 4, XP_PER_ROUND = 2;
  const PREP_SECONDS = 30;
  // 派閥シナジー (PoC は汎用効果: 2/4/6体で全体 ATK+8/18/30%)
  const SYN_THRESHOLDS = [2, 4, 6];
  const SYN_ATK = { 2: 0.08, 4: 0.18, 6: 0.30 };

  const FACTION_COLOR = {
    genso: '#fff8d4', rulers: '#ffd97a', tower: '#a0a0c0', church: '#e3f0ff',
    forest: '#b8e0b0', wolf: '#cccccc', silver: '#cce0ff', dragon: '#d6c5ff',
    redwing: '#ffc0c0', yakai: '#ffaaaa', seventh: '#ffb070', academy: '#b0d0ff',
    aquasis: '#7dd3fc', crimson: '#ff8888', sahar: '#e8c578', niiruru: '#a8d4ff',
    zenonia: '#d4b078', darkmoon: '#7a3ca5', liora: '#9090d0', shrines: '#ffe4a0',
    voidtower: '#3a1858', none: '#8888aa',
  };

  // 敵ラウンド編成テンプレ (R1→R3、 弱→中)
  const ENEMY_ROUNDS = [
    { name: '野生の虹霊', comp: [{ tier: 'R', n: 2 }] },
    { name: '彷徨う影',   comp: [{ tier: 'R', n: 2 }, { tier: 'SR', n: 1 }] },
    { name: '古き番獣',   comp: [{ tier: 'R', n: 1 }, { tier: 'SR', n: 2 }, { tier: 'SSR', n: 1 }] },
  ];

  // ===== データ =====
  let POOL = [];
  let POOL_BY_ID = {};
  let POOL_BY_TIER = {};   // tier -> [defs]

  // ===== 状態 =====
  let S = null;
  let _uid = 0;
  const nextUid = () => ++_uid;

  function newState() {
    return {
      hp: 30, gold: 3, level: 2, xp: 0, round: 1,
      streak: 0, loss: 0, kills: 0, score: 0,
      shop: [],                               // [defId|null]
      bench: [],                              // [{uid, defId, star}]
      board: new Array(BOARD_CELLS).fill(null),
      phase: 'prep',                          // prep | battle | over
      selBench: -1,
      prep: PREP_SECONDS, _timerId: null,
    };
  }

  // ===== ユーティリティ =====
  const $ = (id) => document.getElementById(id);
  const placedCount = () => S.board.filter(Boolean).length;
  const benchHasRoom = () => S.bench.length < BENCH_SIZE;

  function levelFromXp(xp) {
    let lv = 2;
    for (let l = 3; l <= 8; l++) { if (xp >= XP_THRESHOLDS[l]) lv = l; }
    return lv;
  }
  function xpToNext() {
    const next = S.level + 1;
    if (next > 8) return null;
    return { need: XP_THRESHOLDS[next], cur: S.xp, to: next };
  }
  function income() {
    let g = 5;                                // 基本
    g += Math.min(4, Math.floor(S.gold / 10)); // 利息 (10ごと+1, 最大+4)
    if (S.streak >= 4 || S.loss >= 4) g += 2;  // 連勝/連敗 +2
    else if (S.streak >= 2 || S.loss >= 2) g += 1;
    return g;
  }

  // ===== ショップ =====
  function rollTier(level) {
    const rates = DROP_RATES[Math.min(8, level)] || DROP_RATES[2];
    let r = Math.random() * 100, acc = 0;
    for (let i = 0; i < TIERS.length; i++) {
      acc += rates[i];
      if (r < acc) return TIERS[i];
    }
    return 'R';
  }
  function rollShop() {
    S.shop = [];
    for (let i = 0; i < SHOP_SIZE; i++) {
      const tier = rollTier(S.level);
      const pool = POOL_BY_TIER[tier] || POOL_BY_TIER['R'];
      const def = pool[Math.floor(Math.random() * pool.length)];
      S.shop.push(def ? def.id : null);
    }
  }

  // ===== 操作 =====
  function buyUnit(slotIdx) {
    if (S.phase !== 'prep') return;
    const defId = S.shop[slotIdx];
    if (!defId) return;
    const def = POOL_BY_ID[defId];
    if (S.gold < def.cost) { flash('ゴールドが足りません'); return; }
    if (!benchHasRoom()) { flash('控えが満杯です (盤面に出すか合成して)'); return; }
    S.gold -= def.cost;
    S.bench.push({ uid: nextUid(), defId, star: 1 });
    S.shop[slotIdx] = null;
    tryMerge();
    renderAll();
  }

  function reroll() {
    if (S.phase !== 'prep') return;
    if (S.gold < REROLL_COST) { flash('ゴールドが足りません'); return; }
    S.gold -= REROLL_COST;
    rollShop();
    renderShop(); renderHud();
  }

  function buyXp() {
    if (S.phase !== 'prep') return;
    if (S.gold < XP_BUY_COST) { flash('ゴールドが足りません'); return; }
    const before = S.level;
    S.gold -= XP_BUY_COST;
    S.xp += XP_BUY_AMT;
    S.level = levelFromXp(S.xp);
    if (S.level > before) flash('🆙 レベル ' + S.level + ' に! 盤面 ' + S.level + ' 体まで配置可能');
    renderAll();
  }

  function selectBench(idx) {
    if (S.phase !== 'prep') return;
    S.selBench = (S.selBench === idx) ? -1 : idx;
    renderBench(); renderBoard(); renderSellButton();
    setMsg(S.selBench >= 0 ? '空きマスで配置 / 「🗑 売却」 でゴールド返却 (もう一度タップで選択解除)' : 'ショップで購入 → 盤面をタップで配置');
  }

  // 売却額: ★1=コスト / ★2=コスト×3 / ★3=コスト×9 (投入ゴールド相当を返却)
  function sellValue(u) { return POOL_BY_ID[u.defId].cost * Math.pow(3, u.star - 1); }

  function sellSelected() {
    if (S.phase !== 'prep' || S.selBench < 0) return;
    const u = S.bench[S.selBench];
    if (!u) return;
    const v = sellValue(u);
    S.gold += v;
    S.bench.splice(S.selBench, 1);
    S.selBench = -1;
    flash('🗑 ' + POOL_BY_ID[u.defId].name + ' を売却 (+' + v + 'g)');
    renderAll();
  }

  function renderSellButton() {
    const btn = $('btn-sell');
    if (!btn) return;
    const u = (S.phase === 'prep' && S.selBench >= 0) ? S.bench[S.selBench] : null;
    if (u) {
      btn.style.display = '';
      $('sell-amt').textContent = '+' + sellValue(u) + 'g';
    } else {
      btn.style.display = 'none';
    }
  }

  function onCellClick(cellIdx) {
    if (S.phase !== 'prep') return;
    if (S.selBench >= 0) {
      const u = S.bench[S.selBench];
      if (!u) { S.selBench = -1; return; }
      const occupant = S.board[cellIdx];
      if (!occupant) {
        if (placedCount() >= S.level) { flash('盤面は ' + S.level + ' 体まで (レベルUPで増える)'); return; }
        S.board[cellIdx] = u;
      } else {
        // 入替: 既存を控えへ戻し、 選択を配置 (枚数不変)
        S.board[cellIdx] = u;
        S.bench.push(occupant);
      }
      S.bench.splice(S.selBench, 1);
      S.selBench = -1;
      tryMerge();
      renderAll();
    } else if (S.board[cellIdx]) {
      // 拾い上げ → 控えへ (売却/再配置できるよう選択状態にする)
      if (!benchHasRoom()) { flash('控えが満杯です'); return; }
      const u = S.board[cellIdx];
      S.board[cellIdx] = null;
      S.bench.push(u);
      S.selBench = S.bench.indexOf(u);
      tryMerge();
      // tryMerge で合成消費された場合は選択解除
      if (!S.bench[S.selBench] || S.bench[S.selBench].uid !== u.uid) {
        S.selBench = S.bench.findIndex(x => x.uid === u.uid);
      }
      renderAll();
    }
  }

  // 3体合成 (同 defId + 同 star が3つ → star+1)。 ★3 まで
  function tryMerge() {
    let merged = true;
    while (merged) {
      merged = false;
      const groups = {};
      S.board.forEach((u, i) => { if (u) { const k = u.defId + '|' + u.star; (groups[k] = groups[k] || []).push({ loc: 'board', idx: i, u }); } });
      S.bench.forEach((u, i) => { const k = u.defId + '|' + u.star; (groups[k] = groups[k] || []).push({ loc: 'bench', idx: i, u }); });
      for (const k in groups) {
        const arr = groups[k];
        if (arr.length >= 3 && arr[0].u.star < 3) {
          const star = arr[0].u.star;
          const consume = arr.slice(0, 3);
          const boardPos = consume.find(c => c.loc === 'board');
          consume.forEach(c => { if (c.loc === 'board') S.board[c.idx] = null; });
          const benchUids = consume.filter(c => c.loc === 'bench').map(c => c.u.uid);
          S.bench = S.bench.filter(u => !benchUids.includes(u.uid));
          const up = { uid: nextUid(), defId: consume[0].u.defId, star: star + 1 };
          if (boardPos) S.board[boardPos.idx] = up; else S.bench.push(up);
          flash('⭐ ' + POOL_BY_ID[up.defId].name + ' が ★' + up.star + ' に合成!');
          merged = true;
          break;
        }
      }
    }
  }

  // ===== シナジー計算 =====
  function computeSynergy() {
    const placed = S.board.filter(Boolean);
    const facUnits = {};
    placed.forEach(u => {
      const f = POOL_BY_ID[u.defId].faction;
      (facUnits[f] = facUnits[f] || new Set()).add(u.defId);
    });
    const list = [];
    let totalAtk = 0, stages = 0;
    for (const f in facUnits) {
      const c = facUnits[f].size;
      let ach = 0;
      SYN_THRESHOLDS.forEach(t => { if (c >= t) ach = t; });
      const atk = ach ? SYN_ATK[ach] : 0;
      totalAtk += atk;
      stages += ach ? (ach / 2) : 0;
      list.push({ faction: f, count: c, ach, atk });
    }
    list.sort((a, b) => b.count - a.count);
    return { list, totalAtk, stages };
  }

  // ===== 戦闘 =====
  function buildArmy(units, synAtkMult, side) {
    return units.map(u => {
      const d = POOL_BY_ID[u.defId];
      const mult = STAR_MULT[u.star] || 1;
      const maxHp = Math.max(1, Math.round(d.basePower * HP_PER_BP * mult));
      let atk = d.basePower * ATK_PER_BP * mult;
      if (side === 'me') atk *= (1 + synAtkMult);
      return {
        defId: u.defId, name: d.name, img: d.img, tier: d.tier, faction: d.faction,
        star: u.star, maxHp, hp: maxHp, atk: Math.max(1, Math.round(atk)),
        el: null, bar: null,
      };
    });
  }

  function applyDamage(army, dmg) {
    for (const u of army) {
      if (u.hp <= 0) continue;
      if (dmg <= 0) break;
      const d = Math.min(u.hp, dmg);
      u.hp -= d; dmg -= d;
      if (u.hp > 0) break;   // 残ダメは前衛が倒れた時のみ次へ波及
    }
  }

  function simulate(playerArmy, enemyArmy) {
    const frames = [];
    const snap = () => frames.push({
      me: playerArmy.map(u => u.hp),
      opp: enemyArmy.map(u => u.hp),
    });
    snap();
    let ticks = 0;
    while (ticks < 60) {
      const pAlive = playerArmy.filter(u => u.hp > 0);
      const eAlive = enemyArmy.filter(u => u.hp > 0);
      if (!pAlive.length || !eAlive.length) break;
      const pDmg = pAlive.reduce((s, u) => s + u.atk, 0);
      const eDmg = eAlive.reduce((s, u) => s + u.atk, 0);
      applyDamage(enemyArmy, pDmg);
      applyDamage(playerArmy, eDmg);
      ticks++;
      snap();
    }
    const pLeft = playerArmy.filter(u => u.hp > 0).length;
    const eLeft = enemyArmy.filter(u => u.hp > 0).length;
    let winner;
    if (eLeft === 0 && pLeft > 0) winner = 'me';
    else if (pLeft === 0 && eLeft > 0) winner = 'opp';
    else if (pLeft > eLeft) winner = 'me';
    else if (eLeft > pLeft) winner = 'opp';
    else winner = 'draw';
    return { frames, winner, enemyKilled: enemyArmy.length - eLeft, enemySurvivors: eLeft };
  }

  function startBattle() {
    if (S.phase !== 'prep') return;
    const placed = S.board.filter(Boolean);
    if (!placed.length) { flash('盤面に1体は配置してください'); return; }
    stopTimer();
    S.phase = 'battle';
    S.selBench = -1;
    document.querySelector('.pb-phasebar').classList.add('battling');

    const syn = computeSynergy();
    const playerArmy = buildArmy(placed, syn.totalAtk, 'me');

    // 敵編成
    const tpl = ENEMY_ROUNDS[S.round - 1];
    const enemyUnits = [];
    tpl.comp.forEach(g => {
      const pool = POOL_BY_TIER[g.tier] || POOL_BY_TIER['R'];
      for (let i = 0; i < g.n; i++) {
        const def = pool[Math.floor(Math.random() * pool.length)];
        if (def) enemyUnits.push({ defId: def.id, star: 1 });
      }
    });
    const enemyArmy = buildArmy(enemyUnits, 0, 'opp');
    $('pb-opp-name').textContent = tpl.name;

    renderBattleBoards(playerArmy, enemyArmy);
    setMsg('⚔ 自動戦闘 …', true);

    const result = simulate(playerArmy, enemyArmy);
    animateBattle(result, playerArmy, enemyArmy);
  }

  function animateBattle(result, playerArmy, enemyArmy) {
    const frames = result.frames;
    let fi = 0;
    const TICK = 360;
    const timer = setInterval(() => {
      if (fi >= frames.length) {
        clearInterval(timer);
        setTimeout(() => finishBattle(result), 520);
        return;
      }
      const fr = frames[fi];
      const prev = fi > 0 ? frames[fi - 1] : fr;
      updateArmyHp(playerArmy, fr.me, prev.me);
      updateArmyHp(enemyArmy, fr.opp, prev.opp);
      fi++;
    }, TICK);
  }

  function updateArmyHp(army, hps, prevHps) {
    army.forEach((u, i) => {
      const hp = hps[i];
      if (!u.el) return;
      const pct = Math.max(0, hp / u.maxHp * 100);
      if (u.bar) u.bar.style.width = pct + '%';
      if (hp <= 0) u.el.classList.add('dead');
      else if (prevHps && hp < prevHps[i]) {
        u.el.classList.add('hit');
        setTimeout(() => u.el && u.el.classList.remove('hit'), 240);
      }
    });
  }

  function finishBattle(result) {
    const win = result.winner === 'me';
    if (win) { S.streak++; S.loss = 0; }
    else if (result.winner === 'opp') { S.loss++; S.streak = 0; }
    S.kills += result.enemyKilled;
    // PoC: R1-3 は被ダメ0 (設計 §2 導入ラウンド準拠)
    const dmg = 0;
    showRoundResult(result, dmg);
  }

  // ===== 結果 / 進行 =====
  function showRoundResult(result, dmg) {
    const win = result.winner === 'me';
    const draw = result.winner === 'draw';
    $('pb-result-icon').textContent = win ? '🏆' : (draw ? '🤝' : '💢');
    $('pb-result-title').textContent = win ? 'ラウンド勝利' : (draw ? '引き分け' : 'ラウンド敗北');
    const inc = income();
    $('pb-result-detail').innerHTML =
      '<div class="pb-res-line"><span>ラウンド</span><b>' + S.round + ' / ' + MAX_ROUND + '</b></div>' +
      '<div class="pb-res-line"><span>撃破</span><b>' + result.enemyKilled + ' 体</b> (累計 ' + S.kills + ')</div>' +
      '<div class="pb-res-line"><span>被ダメージ</span><b>' + dmg + '</b> <span style="opacity:.6;font-size:11px">(PoC導入ラウンドは0)</span></div>' +
      '<div class="pb-res-line"><span>次ラウンド収入</span><b style="color:var(--gold)">+' + inc + 'g</b></div>';
    const actions = $('pb-result-actions');
    actions.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'pb-btn primary';
    if (S.round >= MAX_ROUND) { btn.textContent = '🎉 結果を見る'; btn.onclick = () => { closeModal('pb-result-modal'); gameClear(); }; }
    else { btn.textContent = '次のラウンドへ →'; btn.onclick = () => { closeModal('pb-result-modal'); nextRound(inc); }; }
    actions.appendChild(btn);
    openModal('pb-result-modal');
  }

  function nextRound(inc) {
    S.round++;
    S.gold += inc;
    S.xp += XP_PER_ROUND;
    const before = S.level;
    S.level = levelFromXp(S.xp);
    S.phase = 'prep';
    S.prep = PREP_SECONDS;
    rollShop();
    document.querySelector('.pb-phasebar').classList.remove('battling');
    // 敵盤面クリア表示
    $('pb-opp-name').textContent = ENEMY_ROUNDS[S.round - 1].name + ' (待機中)';
    renderAll();
    setMsg('ラウンド ' + S.round + ' 準備フェーズ' + (S.level > before ? ' ─ 🆙Lv' + S.level : ''));
    startTimer();
  }

  function gameClear() {
    S.phase = 'over';
    stopTimer();
    const syn = computeSynergy();
    const score = S.round * 100 + S.hp * 10 + S.kills + syn.stages * 5 + 500;
    S.score = score;
    $('pb-result-icon').textContent = '🌌';
    $('pb-result-title').textContent = 'PoC 完走!';
    $('pb-result-detail').innerHTML =
      '<div class="pb-res-line"><span>到達ラウンド</span><b>' + S.round + ' / ' + MAX_ROUND + '</b></div>' +
      '<div class="pb-res-line"><span>残HP</span><b>' + S.hp + '</b></div>' +
      '<div class="pb-res-line"><span>累計撃破</span><b>' + S.kills + ' 体</b></div>' +
      '<div class="pb-res-line"><span>シナジー段階</span><b>' + syn.stages + '</b></div>' +
      '<div class="pb-res-line pb-res-total"><span>スコア</span><b>' + score + '</b></div>';
    const actions = $('pb-result-actions');
    actions.innerHTML = '';
    const again = document.createElement('button');
    again.className = 'pb-btn primary'; again.textContent = '🔄 もう一度';
    again.onclick = () => { closeModal('pb-result-modal'); startGame(); };
    const home = document.createElement('button');
    home.className = 'pb-btn secondary'; home.textContent = 'ホームへ';
    home.onclick = () => { closeModal('pb-result-modal'); showScreen('home-screen'); };
    actions.appendChild(again); actions.appendChild(home);
    openModal('pb-result-modal');
  }

  // ===== タイマー =====
  function startTimer() {
    stopTimer();
    renderTimer();
    S._timerId = setInterval(() => {
      S.prep--;
      renderTimer();
      if (S.prep <= 0) { stopTimer(); startBattle(); }
    }, 1000);
  }
  function stopTimer() { if (S._timerId) { clearInterval(S._timerId); S._timerId = null; } }
  function renderTimer() {
    const t = $('pb-phase-timer');
    if (!t) return;
    if (S.phase === 'prep') t.innerHTML = '準備フェーズ ─ 残り <b>' + Math.max(0, S.prep) + '</b> 秒 (「自動戦闘へ」で即開始)';
    else t.textContent = '';
  }

  // ===== 描画 =====
  function renderAll() { renderHud(); renderSynergy(); renderBoard(); renderBench(); renderShop(); renderSellButton(); }

  function renderHud() {
    $('hud-round').textContent = S.round;
    $('hud-hp').textContent = S.hp;
    $('hud-gold').textContent = S.gold;
    $('hud-level').textContent = S.level;
    $('hud-xp').textContent = S.xp;
    $('pb-board-count').textContent = placedCount();
    $('pb-board-cap').textContent = S.level;
    $('btn-buy-xp').disabled = (S.gold < XP_BUY_COST) || S.level >= 8;
    $('btn-reroll').disabled = (S.gold < REROLL_COST);
  }

  function renderSynergy() {
    const wrap = $('pb-synergy');
    const syn = computeSynergy();
    if (!syn.list.length) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = syn.list.map(s => {
      const def = POOL.find(d => d.faction === s.faction);
      const fname = def ? def.factionName : s.faction;
      const color = FACTION_COLOR[s.faction] || '#888';
      const tierTxt = s.ach ? ('+' + Math.round(s.atk * 100) + '% ATK') : ('次 ' + (SYN_THRESHOLDS.find(t => t > s.count)) + '体で発動');
      return '<span class="pb-syn-chip ' + (s.ach ? 'active' : '') + '">' +
        '<span style="width:9px;height:9px;border-radius:50%;background:' + color + ';display:inline-block"></span>' +
        fname + ' <span class="pb-syn-count">' + s.count + '</span>' +
        '<span class="pb-syn-tier">' + tierTxt + '</span></span>';
    }).join('');
  }

  function unitInner(def, star, opts) {
    opts = opts || {};
    const stars = '★'.repeat(star);
    const color = FACTION_COLOR[def.faction] || '#888';
    let h = '';
    h += '<div class="pb-unit-faction-dot" style="background:' + color + '"></div>';
    if (opts.battle) h += '<div class="pb-unit-hpbar"><i style="width:100%"></i></div>';
    h += '<div class="pb-unit-star">' + stars + '</div>';
    h += '<div class="pb-unit-name">' + def.name + '</div>';
    return h;
  }
  // 原寸PNG(~3MB) ではなく サムネ webp(768x1152, ~200KB) を使う (本体 toThumbUrl と同規約)。
  // トークンは小さい(60-96px)ため 原寸は重く読込が遅い (s1c7 で顕著、 2026-05-27 修正)。
  function toThumb(url) {
    if (!url) return url;
    return url.replace(/^(.+)\/([^/]+)\.png(\?.*)?$/i, '$1/thumb/$2_thumb.webp$3');
  }
  function unitStyle(def) {
    return def.img ? ('background-image:url(' + toThumb(def.img) + ')') : 'background:#333';
  }

  function renderBoard() {
    const wrap = $('pb-board-me');
    wrap.innerHTML = '';
    for (let i = 0; i < BOARD_CELLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'pb-cell' + (i < 4 ? ' front' : '');
      if (S.selBench >= 0 && !S.board[i] && placedCount() < S.level) cell.classList.add('placeable');
      const u = S.board[i];
      if (u) {
        const def = POOL_BY_ID[u.defId];
        const el = document.createElement('div');
        el.className = 'pb-unit t-' + def.tier;
        el.style.cssText = unitStyle(def);
        el.innerHTML = unitInner(def, u.star, {});
        cell.appendChild(el);
      } else if (S.selBench >= 0 && placedCount() < S.level) {
        cell.classList.add('empty-hint');
      }
      cell.onclick = () => onCellClick(i);
      wrap.appendChild(cell);
    }
  }

  function renderBench() {
    const wrap = $('pb-bench');
    wrap.innerHTML = '';
    for (let i = 0; i < BENCH_SIZE; i++) {
      const slot = document.createElement('div');
      slot.className = 'pb-bench-slot' + (S.selBench === i ? ' selected' : '');
      const u = S.bench[i];
      if (u) {
        const def = POOL_BY_ID[u.defId];
        const el = document.createElement('div');
        el.className = 'pb-unit t-' + def.tier;
        el.style.cssText = unitStyle(def);
        el.innerHTML = unitInner(def, u.star, {});
        slot.appendChild(el);
        slot.onclick = () => selectBench(i);
      }
      wrap.appendChild(slot);
    }
  }

  function renderShop() {
    const wrap = $('pb-shop');
    wrap.innerHTML = '';
    for (let i = 0; i < SHOP_SIZE; i++) {
      const slot = document.createElement('div');
      const defId = S.shop[i];
      if (!defId) { slot.className = 'pb-shop-slot bought'; wrap.appendChild(slot); continue; }
      const def = POOL_BY_ID[defId];
      const cant = S.gold < def.cost || !benchHasRoom();
      slot.className = 'pb-shop-slot' + (cant ? ' cant' : '');
      slot.innerHTML =
        '<div class="pb-shop-faction">' + def.factionName + '</div>' +
        '<div class="pb-shop-img" style="' + unitStyle(def) + '"></div>' +
        '<div class="pb-shop-info">' +
          '<div class="pb-shop-name">' + def.name + '</div>' +
          '<div class="pb-shop-meta"><span class="pb-shop-tier ' + def.tier + '">' + def.tier + '</span>' +
          '<span class="pb-shop-cost">' + def.cost + 'g</span></div>' +
        '</div>';
      slot.onclick = () => buyUnit(i);
      wrap.appendChild(slot);
    }
  }

  // 戦闘用 盤面描画 (HPバー付き、 ユニット el 参照を army に保持)
  function renderBattleBoards(playerArmy, enemyArmy) {
    // 自盤面: 実際のセル位置で描画
    const me = $('pb-board-me');
    me.innerHTML = '';
    let ai = 0;
    for (let i = 0; i < BOARD_CELLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'pb-cell' + (i < 4 ? ' front' : '');
      const u = S.board[i];
      if (u) {
        const army = playerArmy[ai++];
        const def = POOL_BY_ID[u.defId];
        const el = document.createElement('div');
        el.className = 'pb-unit t-' + def.tier;
        el.style.cssText = unitStyle(def);
        el.innerHTML = unitInner(def, u.star, { battle: true });
        cell.appendChild(el);
        army.el = el; army.bar = el.querySelector('.pb-unit-hpbar > i');
      }
      me.appendChild(cell);
    }
    // 敵盤面: 前列(下段)から詰めて描画
    const opp = $('pb-board-opp');
    opp.innerHTML = '';
    const cells = [];
    for (let i = 0; i < BOARD_CELLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'pb-cell' + (i >= 8 ? ' front' : '');
      opp.appendChild(cell);
      cells.push(cell);
    }
    // 配置順: 下段(8-11) → 中段(4-7) → 上段(0-3)
    const order = [8, 9, 10, 11, 4, 5, 6, 7, 0, 1, 2, 3];
    enemyArmy.forEach((army, idx) => {
      const cell = cells[order[idx] !== undefined ? order[idx] : idx];
      const def = POOL_BY_ID[army.defId];
      const el = document.createElement('div');
      el.className = 'pb-unit t-' + def.tier;
      el.style.cssText = unitStyle(def);
      el.innerHTML = unitInner(def, army.star, { battle: true });
      cell.appendChild(el);
      army.el = el; army.bar = el.querySelector('.pb-unit-hpbar > i');
    });
  }

  function setMsg(t, flashIt) {
    const m = $('pb-message');
    m.textContent = t;
    m.classList.toggle('flash', !!flashIt);
  }
  let _flashTimer = null;
  function flash(t) {
    setMsg(t, true);
    if (_flashTimer) clearTimeout(_flashTimer);
    _flashTimer = setTimeout(() => { if (S && S.phase === 'prep') setMsg(S.selBench >= 0 ? '配置先の空きマスをタップ' : 'ショップで購入 → 盤面をタップで配置'); }, 2200);
  }

  // ===== 画面切替 / ゲーム開始 =====
  function showScreen(id) {
    document.querySelectorAll('.pb-screen').forEach(s => s.classList.remove('active'));
    $(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  function startGame() {
    S = newState();
    rollShop();
    document.querySelector('.pb-phasebar').classList.remove('battling');
    $('pb-opp-name').textContent = ENEMY_ROUNDS[0].name + ' (待機中)';
    $('pb-board-opp').innerHTML = '';
    showScreen('match-screen');
    renderAll();
    setMsg('ラウンド1 準備フェーズ ─ ショップで購入して盤面に配置しよう');
    startTimer();
  }

  // ===== モーダル (scroll lock + MutationObserver + keydown capture) =====
  const _modalStack = [];
  function syncBodyLock() {
    const anyOpen = Array.from(document.querySelectorAll('.pb-modal')).some(m => !m.hidden);
    document.documentElement.classList.toggle('pb-modal-open', anyOpen);
    document.body.classList.toggle('pb-modal-open', anyOpen);
  }
  function openModal(id) {
    const m = $(id);
    m.hidden = false;
    if (!_modalStack.includes(id)) _modalStack.push(id);
    const f = m.querySelector('button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])');
    if (f) setTimeout(() => f.focus(), 30);
    syncBodyLock();
  }
  function closeModal(id) {
    const m = $(id);
    m.hidden = true;
    const i = _modalStack.indexOf(id);
    if (i >= 0) _modalStack.splice(i, 1);
    syncBodyLock();
  }
  function closeTop() {
    const id = _modalStack[_modalStack.length - 1];
    if (id) closeModal(id);
  }

  // ===== 初期化 =====
  function bindEvents() {
    $('btn-start').onclick = startGame;
    $('btn-to-battle').onclick = startBattle;
    $('btn-reroll').onclick = reroll;
    $('btn-buy-xp').onclick = buyXp;
    $('btn-sell').onclick = sellSelected;
    $('btn-pb-help').onclick = () => openModal('pb-help-modal');

    document.querySelectorAll('[data-close]').forEach(el => {
      el.onclick = () => closeModal(el.getAttribute('data-close'));
    });

    // Esc + フォーカストラップ (capture)
    document.addEventListener('keydown', (e) => {
      if (!_modalStack.length) return;
      const id = _modalStack[_modalStack.length - 1];
      const m = $(id);
      if (e.key === 'Escape') {
        if (m.classList.contains('pb-modal-result')) return; // 結果モーダルは明示操作のみ
        e.preventDefault(); closeTop();
      } else if (e.key === 'Tab') {
        const foc = Array.from(m.querySelectorAll('button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])'))
          .filter(el => el.offsetParent !== null);
        if (!foc.length) return;
        const first = foc[0], last = foc[foc.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }, true);

    // モーダルの hidden 変化を監視して body lock を常に同期
    const mo = new MutationObserver(syncBodyLock);
    document.querySelectorAll('.pb-modal').forEach(m => mo.observe(m, { attributes: true, attributeFilter: ['hidden'] }));
  }

  async function init() {
    bindEvents();
    try {
      const res = await fetch('./data/pool.json?v=1.7.0e');
      POOL = await res.json();
    } catch (e) {
      setMsg('データ読込に失敗しました'); console.error(e); return;
    }
    POOL_BY_ID = {}; POOL_BY_TIER = {};
    POOL.forEach(d => {
      POOL_BY_ID[d.id] = d;
      (POOL_BY_TIER[d.tier] = POOL_BY_TIER[d.tier] || []).push(d);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
