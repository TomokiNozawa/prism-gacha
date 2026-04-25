// ===== GASSHUKU GACHA (限定機能・2026-04-25 合宿用・即削除可) =====
// 削除手順:
//   1) このファイル削除
//   2) index.html から <script src="gasshuku.js?v=..."></script> と
//      .gasshuku-cta-block ブロック (3箇所:見出し+grid+4ボタン) を削除
//   3) style.css の "GASSHUKU" 関連セクションをすべて削除
//   4) images/gasshuku/ フォルダ削除
// 既存 POOL / Firebase / localStorage / state には一切手を入れていない。
// summonOne / clearStage / closeStage / stage 等の既存グローバル関数を流用して、
// 本家UR演出（虹背景/ゴッドレイ/虹噴水/MIRACLE等）をそのまま再利用する。

(function () {
  'use strict';

  const POOL = [
    { id: '01', slug: 'nozawa',   real: '野沢朝輝',
      name: '曙のオートメイター・ノザワ', faction: '星霊学院',
      role: '自動化の継承者', skill: '面倒消去のオラクル',
      voice: '面倒は、すべて私が片付ける。' },
    { id: '02', slug: 'shimano',  real: '島野耕平',
      name: '智慧の戦略家・シマノ', faction: '五大国',
      role: 'AI戦略コンサルタント', skill: '最適解を編む星詠み',
      voice: '最善の道は、常に複数ある。' },
    { id: '03', slug: 'nakata',   real: '中田元樹',
      name: '神速の創造主・ナカタ', faction: '原虹',
      role: '神速Excelの開祖', skill: '時間圧縮ショートカット',
      voice: '速さは正義だ。本気で行くぞ。' },
    { id: '04', slug: 'suzuki',   real: '鈴木正真',
      name: '弾き語りの吟遊詩人・マサシ', faction: '独立勢力',
      role: '人の心を解す調律師', skill: '梅干しハイ・セレナーデ',
      voice: 'ねえ、君の歌も聞かせてよ。' },
    { id: '05', slug: 'kanba',    real: '神波将宏',
      name: '三足のわらじ・カンバ', faction: '星霊学院',
      role: 'ブランド錬金術師', skill: '幻惑のマーケティング',
      voice: '三つの顔を持つ私を、見抜けるかな。' },
    { id: '06', slug: 'fukuda',   real: '福田凜',
      name: '七つ巻物の弟子・フクダ', faction: '独立勢力',
      role: '自動化の修行者', skill: '七巻同時詠唱',
      voice: '私、絶対に諦めないので！' },
    { id: '07', slug: 'fujii',    real: '藤井月花',
      name: '月花の物語編者・フジイ', faction: '独立勢力',
      role: '旅と書物の使い手', skill: '次章への栞',
      voice: '次のページを、めくりましょう。' },
    { id: '08', slug: 'miyamoto', real: '宮本紗良',
      name: '記憶の蒐集家・ミヤモト', faction: '星霊学院',
      role: '思い出の標本士', skill: 'シール・ティアラ',
      voice: '全部、丁寧に貼っていきます。' },
    { id: '09', slug: 'oshima',   real: '大島龍',
      name: '次元を編む者・オオシマ', faction: '星霊学院',
      role: 'フロントエンド構築術師', skill: 'リアクト・リビルド',
      voice: '二日酔いでも、コードは書ける。' },
    { id: '10', slug: 'higuchi',  real: '樋口廉',
      name: '柴の番人・ヒグチ', faction: '独立勢力',
      role: '獣使い見習い', skill: 'Wan Wan ハウンド召喚',
      voice: 'Wan! Wan! 柴犬、最高ッ！' },
    { id: '11', slug: 'horie',    real: '堀江陵太',
      name: '氷峰の建築家・ホリエ', faction: '五大国',
      role: '雪壁構築の技師', skill: 'スノーリッジ・スライド',
      voice: '白銀の上を、滑るように。' },
    { id: '12', slug: 'akai',     real: '赤井慧',
      name: '世界を旅した注ぎ手・アカイ', faction: '独立勢力',
      role: '黄金泡の伝道師', skill: 'トゥクトゥク・三度注ぎ',
      voice: 'どこでも、注ぎたての一杯を。' }
  ];

  function imgPath(c, mode) {
    return `images/gasshuku/${c.id}_${c.slug}_${mode === 'real' ? 'real' : 'fantasy'}.png`;
  }

  // ====== 合宿図鑑 (独立 localStorage) ======
  const COLLECT_KEY = 'prism-gasshuku-collected';
  function loadCollected() {
    try { return JSON.parse(localStorage.getItem(COLLECT_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveCollected(d) {
    try { localStorage.setItem(COLLECT_KEY, JSON.stringify(d)); } catch (e) {}
  }
  function recordCollected(c, mode) {
    const d = loadCollected();
    const k = `${c.id}_${mode}`;
    if (!d[k]) {
      d[k] = true;
      saveCollected(d);
    }
    renderGasshukuGallery();
  }
  function renderGasshukuGallery() {
    const grid = document.getElementById('gasshuku-gallery-grid');
    const cntEl = document.getElementById('gasshuku-gallery-count');
    if (!grid) return;
    const d = loadCollected();
    grid.innerHTML = '';
    let count = 0;
    POOL.forEach(c => {
      ['real', 'fantasy'].forEach(mode => {
        const k = `${c.id}_${mode}`;
        const got = !!d[k];
        if (got) count++;
        const cell = document.createElement('div');
        cell.className = 'gasshuku-gallery-cell' + (got ? ' got' : ' locked');
        cell.title = `${c.name} (${c.real}) — ${mode === 'real' ? '本人' : 'ファンタジー'}`;
        if (got) {
          cell.innerHTML = `
            <img src="${imgPath(c, mode)}" alt="${c.name}">
            <div class="gasshuku-cell-mode">${mode === 'real' ? '📷' : '🌈'}</div>
          `;
          cell.style.cursor = 'pointer';
          cell.addEventListener('click', () => openDetail(c, mode));
        } else {
          cell.innerHTML = `
            <div class="gasshuku-cell-silhouette">?</div>
            <div class="gasshuku-cell-mode">${mode === 'real' ? '📷' : '🌈'}</div>
          `;
        }
        grid.appendChild(cell);
      });
    });
    if (cntEl) cntEl.textContent = String(count);
  }

  // ====== 詳細モーダル (合宿用、独立) ======
  const FACTION_COLOR = {
    '星霊学院': '#7dd3fc',
    '五大国':   '#fcd34d',
    '原虹':     '#f472b6',
    '独立勢力': '#a3e635'
  };
  let currentDetail = null;
  let currentDetailMode = 'fantasy';
  function isCollected(c, mode) {
    const d = loadCollected();
    return !!d[`${c.id}_${mode}`];
  }
  function ensureDetailModal() {
    let m = document.getElementById('gasshuku-detail-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'gasshuku-detail-modal';
    m.className = 'gasshuku-detail-modal';
    m.setAttribute('hidden', '');
    m.innerHTML = `
      <div class="gasshuku-detail-backdrop"></div>
      <div class="gasshuku-detail-card">
        <button class="gasshuku-detail-close" aria-label="閉じる">×</button>
        <div class="gasshuku-detail-img-wrap" id="gasshuku-detail-img-wrap">
          <img class="gasshuku-detail-img" id="gasshuku-detail-img" alt="">
          <div class="gasshuku-detail-zoom-hint">🔍 タップで拡大</div>
        </div>
        <div class="gasshuku-detail-meta">
          <div class="gasshuku-detail-tier">UR</div>
          <div class="gasshuku-detail-name" id="gasshuku-detail-name"></div>
          <div class="gasshuku-detail-real" id="gasshuku-detail-real"></div>
          <div class="gasshuku-detail-faction" id="gasshuku-detail-faction"></div>
          <div class="gasshuku-detail-skill" id="gasshuku-detail-skill"></div>
          <div class="gasshuku-detail-voice" id="gasshuku-detail-voice"></div>
          <div class="gasshuku-detail-toggle">
            <button class="gasshuku-detail-tbtn" data-mode="fantasy">🌈 ファンタジー</button>
            <button class="gasshuku-detail-tbtn" data-mode="real">📷 本人</button>
          </div>
          <div class="gasshuku-detail-locknote" id="gasshuku-detail-locknote" hidden></div>
        </div>
      </div>
    `;
    document.body.appendChild(m);
    m.querySelector('.gasshuku-detail-close').addEventListener('click', closeDetail);
    m.querySelector('.gasshuku-detail-backdrop').addEventListener('click', closeDetail);
    m.querySelectorAll('.gasshuku-detail-tbtn').forEach(b => {
      b.addEventListener('click', () => switchDetailImage(b.dataset.mode));
    });
    m.querySelector('#gasshuku-detail-img-wrap').addEventListener('click', () => {
      if (currentDetail) openLightbox(currentDetail, currentDetailMode);
    });
    return m;
  }
  function switchDetailImage(mode) {
    if (!currentDetail) return;
    // 未獲得モードへの切替は阻止
    if (!isCollected(currentDetail, mode)) {
      const note = document.getElementById('gasshuku-detail-locknote');
      if (note) {
        note.hidden = false;
        note.textContent = `🔒 ${mode === 'fantasy' ? '🌈 ファンタジー' : '📷 本人'} 版はまだ召喚していません`;
        setTimeout(() => { note.hidden = true; }, 2200);
      }
      return;
    }
    currentDetailMode = mode;
    const img = document.getElementById('gasshuku-detail-img');
    img.src = imgPath(currentDetail, mode);
    document.querySelectorAll('.gasshuku-detail-tbtn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });
  }
  function openDetail(c, defaultMode) {
    currentDetail = c;
    const m = ensureDetailModal();
    m.removeAttribute('hidden');
    m.classList.add('active');
    document.getElementById('gasshuku-detail-name').textContent = c.name;
    document.getElementById('gasshuku-detail-real').textContent = `本人: ${c.real}（${c.role}）`;
    const fac = document.getElementById('gasshuku-detail-faction');
    fac.textContent = `所属: ${c.faction}`;
    fac.style.color = FACTION_COLOR[c.faction] || '#fff';
    document.getElementById('gasshuku-detail-skill').textContent = `🌟 ${c.skill}`;
    document.getElementById('gasshuku-detail-voice').textContent = `「${c.voice}」`;
    // トグルボタンの獲得状態を反映 (未獲得は鍵マーク+disabled風)
    document.querySelectorAll('.gasshuku-detail-tbtn').forEach(b => {
      const got = isCollected(c, b.dataset.mode);
      b.classList.toggle('locked', !got);
      const baseLabel = b.dataset.mode === 'fantasy' ? '🌈 ファンタジー' : '📷 本人';
      b.textContent = got ? baseLabel : `🔒 ${baseLabel}`;
    });
    const note = document.getElementById('gasshuku-detail-locknote');
    if (note) note.hidden = true;
    // defaultMode が未獲得なら獲得済みモードにフォールバック
    let openMode = defaultMode || 'fantasy';
    if (!isCollected(c, openMode)) {
      const alt = openMode === 'fantasy' ? 'real' : 'fantasy';
      if (isCollected(c, alt)) openMode = alt;
    }
    switchDetailImage(openMode);
  }
  function closeDetail() {
    const m = document.getElementById('gasshuku-detail-modal');
    if (m) {
      m.classList.remove('active');
      m.setAttribute('hidden', '');
    }
  }

  // ====== 画像拡大ライトボックス ======
  function ensureLightbox() {
    let lb = document.getElementById('gasshuku-lightbox');
    if (lb) return lb;
    lb = document.createElement('div');
    lb.id = 'gasshuku-lightbox';
    lb.className = 'gasshuku-lightbox';
    lb.setAttribute('hidden', '');
    lb.innerHTML = `
      <button class="gasshuku-lightbox-close" aria-label="閉じる">×</button>
      <img class="gasshuku-lightbox-img" id="gasshuku-lightbox-img" alt="">
    `;
    document.body.appendChild(lb);
    lb.addEventListener('click', closeLightbox);
    return lb;
  }
  function openLightbox(c, mode) {
    const lb = ensureLightbox();
    lb.removeAttribute('hidden');
    lb.classList.add('active');
    document.getElementById('gasshuku-lightbox-img').src = imgPath(c, mode);
  }
  function closeLightbox() {
    const lb = document.getElementById('gasshuku-lightbox');
    if (lb) {
      lb.classList.remove('active');
      lb.setAttribute('hidden', '');
    }
  }

  // ====== 結果モーダル (合宿用、独立) ======
  function ensureResultModal() {
    let m = document.getElementById('gasshuku-result-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'gasshuku-result-modal';
    m.className = 'gasshuku-result-modal';
    m.setAttribute('hidden', '');
    m.innerHTML = `
      <div class="gasshuku-result-backdrop"></div>
      <div class="gasshuku-result-stage">
        <button class="gasshuku-result-close" aria-label="閉じる">×</button>
        <div class="gasshuku-result-title">🎌 合宿ガチャ結果</div>
        <div class="gasshuku-result-summary" id="gasshuku-result-summary"></div>
        <div class="gasshuku-result-grid" id="gasshuku-result-grid"></div>
      </div>
    `;
    document.body.appendChild(m);
    m.querySelector('.gasshuku-result-close').addEventListener('click', closeResultModal);
    m.querySelector('.gasshuku-result-backdrop').addEventListener('click', closeResultModal);
    return m;
  }
  function showResultModal(results, imgMode) {
    const m = ensureResultModal();
    m.removeAttribute('hidden');
    m.classList.add('active');
    const summary = document.getElementById('gasshuku-result-summary');
    const grid = document.getElementById('gasshuku-result-grid');
    summary.textContent = `🌈 UR ×${results.length} 確定 / ${imgMode === 'real' ? '📷 本人モード' : '🌈 ファンタジーモード'}`;
    grid.innerHTML = '';
    results.forEach(r => {
      const card = document.createElement('div');
      card.className = 'gasshuku-result-card';
      card.innerHTML = `
        <img class="gasshuku-result-img" src="${r.img}" alt="${r.name}">
        <div class="gasshuku-result-tier">UR</div>
        <div class="gasshuku-result-name">${r.name}</div>
        <div class="gasshuku-result-real">${r._gasshukuReal || ''}</div>
      `;
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => openDetail(r._gasshukuChar, r._gasshukuMode));
      grid.appendChild(card);
    });
  }
  function closeResultModal() {
    const m = document.getElementById('gasshuku-result-modal');
    if (m) {
      m.classList.remove('active');
      m.setAttribute('hidden', '');
    }
  }

  function rollAll(count) {
    // 確率は一律、重複OK
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(POOL[Math.floor(Math.random() * POOL.length)]);
    }
    return out;
  }

  // 既存 summonOne 互換の result オブジェクトを構築
  // applyPull を呼ばないので state は一切更新されない（履歴/cloud にも残らない）
  function buildResult(c, imgMode) {
    const mode = imgMode === 'real' ? 'real' : 'fantasy';
    return {
      tier: 'UR',
      season: 99,
      name: c.name,
      title: `${c.faction} / ${c.role}`,
      caption: c.voice,
      desc: `本人: ${c.real}\n所属: ${c.faction}\n役割: ${c.role}\nスキル: ${c.skill}`,
      img: imgPath(c, mode),
      isNew: false,
      dupCount: 0,
      dupMax: 0,
      dupGained: null,
      _gasshuku: true,
      _gasshukuChar: c,
      _gasshukuMode: mode,
      _gasshukuReal: c.real
    };
  }

  let gasshukuBusy = false;

  function setGachaBtnsDisabled(disabled) {
    const ids = ['btn-single', 'btn-ten'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.disabled = disabled; });
    document.querySelectorAll('.gasshuku-cta-btn').forEach(b => { b.disabled = disabled; });
  }

  async function startGasshukuRoll(imgMode, count) {
    if (gasshukuBusy) return;
    // 既存ガチャ実行中なら無視
    if (typeof window.busy !== 'undefined' && window.busy) return;
    gasshukuBusy = true;
    setGachaBtnsDisabled(true);

    const cv = document.getElementById('canvas') || document.querySelector('canvas');
    const resizeCanvas = () => {
      if (cv) { cv.width = window.innerWidth; cv.height = window.innerHeight; }
    };

    try {
      if (typeof skipRequested !== 'undefined') skipRequested = false;
      const stageEl = document.getElementById('stage');
      if (stageEl) stageEl.classList.add('active');
      if (typeof clearStage === 'function') clearStage();
      resizeCanvas();

      const chars = rollAll(count);
      const results = chars.map(c => buildResult(c, imgMode));
      window.__gasshukuLastResults = results;
      window.__gasshukuLastImgMode = imgMode;
      // 図鑑記録 (重複なし keyで)
      results.forEach(r => recordCollected(r._gasshukuChar, r._gasshukuMode));

      if (count === 1 || results.length === 1) {
        // 単発: doSingle 風
        await summonOne(results[0]);
      } else {
        // 10連: doTen 風 — 各召喚で clearStage、最後にフル演出
        const bestIdx = Math.floor(Math.random() * results.length);
        const best = results[bestIdx];
        const sequenced = [
          ...results.slice(0, bestIdx),
          ...results.slice(bestIdx + 1),
          best
        ];

        // 10連イントロ「× 10」
        if (typeof setStageTier === 'function') setStageTier('UR');
        if (typeof showTenIntro === 'function') showTenIntro();
        if (typeof play === 'function') play('se-summon', 'UR');
        await new Promise(r => setTimeout(r, 1100));

        // 前9体: showLadder=false
        for (let i = 0; i < sequenced.length - 1; i++) {
          if (typeof clearStage === 'function') clearStage();
          resizeCanvas();
          await summonOne(sequenced[i], { showLadder: false });
        }

        // 最後の1体: フル演出
        if (typeof clearStage === 'function') clearStage();
        resizeCanvas();
        if (typeof skipRequested !== 'undefined') skipRequested = false;
        await new Promise(r => setTimeout(r, 250));
        await summonOne(best, { showLadder: true, forceSlow: true, tenFlag: true });

        // タップ待ち (最後の余韻)
        if (typeof showHintTap === 'function') showHintTap();
        const start = Date.now();
        while (typeof skipRequested !== 'undefined' && !skipRequested) {
          await new Promise(r => setTimeout(r, 80));
          if (Date.now() - start > 30000) break; // 安全弁
        }
        if (typeof hideHintTap === 'function') hideHintTap();
      }
    } catch (e) {
      console.error('[gasshuku] roll error:', e);
    } finally {
      if (typeof closeStage === 'function') closeStage();
      gasshukuBusy = false;
      setGachaBtnsDisabled(false);
      // 結果モーダル表示 (10連時のみ。単発はキャラ自体が画面いっぱいに見えるため不要)
      if (typeof window !== 'undefined') {
        try {
          if (window.__gasshukuLastResults && window.__gasshukuLastResults.length > 1) {
            showResultModal(window.__gasshukuLastResults, window.__gasshukuLastImgMode);
          }
        } catch (e) {}
      }
    }
  }

  // CTA ボタンに listener を bind + 図鑑初期描画
  function init() {
    document.querySelectorAll('.gasshuku-cta-btn').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const imgMode = btn.dataset.imgmode;
        const count = parseInt(btn.dataset.count, 10);
        startGasshukuRoll(imgMode, count);
      });
    });
    renderGasshukuGallery();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
