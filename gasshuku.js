// ===== GASSHUKU GACHA (限定機能・2026-04-25 合宿用・即削除可) =====
// 削除手順:
//   1) このファイル削除
//   2) index.html から <script src="gasshuku.js?v=..."></script> と #gasshuku-btn の <button> 1行削除
//   3) style.css の "GASSHUKU START" ～ "GASSHUKU END" ブロック削除
//   4) images/gasshuku/ フォルダ削除
// 既存の POOL / Firebase / localStorage には一切手を入れていない。

(function () {
  'use strict';

  const POOL = [
    {
      id: '01', slug: 'nozawa', real: '野沢朝輝',
      name: '曙のオートメイター・ノザワ',
      faction: '星霊学院',
      role: '自動化の継承者',
      skill: '面倒消去のオラクル',
      voice: '面倒は、すべて私が片付ける。'
    },
    {
      id: '02', slug: 'shimano', real: '島野耕平',
      name: '智慧の戦略家・シマノ',
      faction: '五大国',
      role: 'AI戦略コンサルタント',
      skill: '最適解を編む星詠み',
      voice: '最善の道は、常に複数ある。'
    },
    {
      id: '03', slug: 'nakata', real: '中田元樹',
      name: '神速の創造主・ナカタ',
      faction: '原虹',
      role: '神速Excelの開祖',
      skill: '時間圧縮ショートカット',
      voice: '速さは正義だ。本気で行くぞ。'
    },
    {
      id: '04', slug: 'suzuki', real: '鈴木正真',
      name: '弾き語りの吟遊詩人・マサシ',
      faction: '独立勢力',
      role: '人の心を解す調律師',
      skill: '梅干しハイ・セレナーデ',
      voice: 'ねえ、君の歌も聞かせてよ。'
    },
    {
      id: '05', slug: 'kanba', real: '神波将宏',
      name: '三足のわらじ・カンバ',
      faction: '星霊学院',
      role: 'ブランド錬金術師',
      skill: '幻惑のマーケティング',
      voice: '三つの顔を持つ私を、見抜けるかな。'
    },
    {
      id: '06', slug: 'fukuda', real: '福田凜',
      name: '七つ巻物の弟子・フクダ',
      faction: '独立勢力',
      role: '自動化の修行者',
      skill: '七巻同時詠唱',
      voice: '私、絶対に諦めないので！'
    },
    {
      id: '07', slug: 'fujii', real: '藤井月花',
      name: '月花の物語編者・フジイ',
      faction: '独立勢力',
      role: '旅と書物の使い手',
      skill: '次章への栞',
      voice: '次のページを、めくりましょう。'
    },
    {
      id: '08', slug: 'miyamoto', real: '宮本紗良',
      name: '記憶の蒐集家・ミヤモト',
      faction: '星霊学院',
      role: '思い出の標本士',
      skill: 'シール・ティアラ',
      voice: '全部、丁寧に貼っていきます。'
    },
    {
      id: '09', slug: 'oshima', real: '大島龍',
      name: '次元を編む者・オオシマ',
      faction: '星霊学院',
      role: 'フロントエンド構築術師',
      skill: 'リアクト・リビルド',
      voice: '二日酔いでも、コードは書ける。'
    },
    {
      id: '10', slug: 'higuchi', real: '樋口廉',
      name: '柴の番人・ヒグチ',
      faction: '独立勢力',
      role: '獣使い見習い',
      skill: 'Wan Wan ハウンド召喚',
      voice: 'Wan! Wan! 柴犬、最高ッ！'
    },
    {
      id: '11', slug: 'horie', real: '堀江陵太',
      name: '氷峰の建築家・ホリエ',
      faction: '五大国',
      role: '雪壁構築の技師',
      skill: 'スノーリッジ・スライド',
      voice: '白銀の上を、滑るように。'
    },
    {
      id: '12', slug: 'akai', real: '赤井慧',
      name: '世界を旅した注ぎ手・アカイ',
      faction: '独立勢力',
      role: '黄金泡の伝道師',
      skill: 'トゥクトゥク・三度注ぎ',
      voice: 'どこでも、注ぎたての一杯を。'
    }
  ];

  const FACTION_COLOR = {
    '星霊学院': '#7dd3fc',
    '五大国':   '#fcd34d',
    '原虹':     '#f472b6',
    '独立勢力': '#a3e635'
  };

  // ガチャ実行: 12人を全員1回ずつ、シャッフル順で
  function rollAll() {
    return [...POOL].sort(() => Math.random() - 0.5);
  }

  // ===== UI =====
  function ensureModal() {
    let m = document.getElementById('gasshuku-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'gasshuku-modal';
    m.className = 'gasshuku-modal';
    m.innerHTML = `
      <div class="gasshuku-backdrop"></div>
      <div class="gasshuku-stage">
        <button class="gasshuku-close" aria-label="閉じる">×</button>
        <div class="gasshuku-title">🎌 DIK合宿ガチャ 2026.04.25</div>
        <div class="gasshuku-subtitle">全員UR確定・12連 / Prismaera 期間限定</div>
        <div class="gasshuku-cutscene" id="gasshuku-cutscene"></div>
        <div class="gasshuku-grid" id="gasshuku-grid"></div>
        <div class="gasshuku-footer">
          <button class="gasshuku-replay" id="gasshuku-replay">🎲 もう一度引く</button>
        </div>
      </div>
      <div class="gasshuku-detail" id="gasshuku-detail" hidden>
        <div class="gasshuku-detail-card">
          <button class="gasshuku-detail-close" aria-label="閉じる">×</button>
          <div class="gasshuku-detail-img-wrap">
            <img class="gasshuku-detail-img" id="gasshuku-detail-img" alt="">
          </div>
          <div class="gasshuku-detail-meta">
            <div class="gasshuku-tier">UR</div>
            <div class="gasshuku-detail-name" id="gasshuku-detail-name"></div>
            <div class="gasshuku-detail-real" id="gasshuku-detail-real"></div>
            <div class="gasshuku-detail-faction" id="gasshuku-detail-faction"></div>
            <div class="gasshuku-detail-skill" id="gasshuku-detail-skill"></div>
            <div class="gasshuku-detail-voice" id="gasshuku-detail-voice"></div>
            <div class="gasshuku-toggle">
              <button class="gasshuku-toggle-btn" data-mode="fantasy">🌈 ファンタジー</button>
              <button class="gasshuku-toggle-btn" data-mode="real">📷 本人</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(m);

    // close handlers
    m.querySelector('.gasshuku-close').addEventListener('click', closeModal);
    m.querySelector('.gasshuku-backdrop').addEventListener('click', closeModal);
    m.querySelector('#gasshuku-replay').addEventListener('click', startRoll);
    m.querySelector('.gasshuku-detail-close').addEventListener('click', closeDetail);
    m.querySelector('#gasshuku-detail').addEventListener('click', (e) => {
      if (e.target.id === 'gasshuku-detail') closeDetail();
    });
    m.querySelectorAll('.gasshuku-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => switchImage(btn.dataset.mode));
    });
    return m;
  }

  function openModal() {
    const m = ensureModal();
    m.classList.add('active');
    document.body.classList.add('gasshuku-modal-open');
    startRoll();
  }
  function closeModal() {
    const m = document.getElementById('gasshuku-modal');
    if (m) m.classList.remove('active');
    document.body.classList.remove('gasshuku-modal-open');
  }
  function closeDetail() {
    const d = document.getElementById('gasshuku-detail');
    if (d) d.hidden = true;
  }

  let currentDetail = null; // {char}
  function imgPath(c, mode) {
    return `images/gasshuku/${c.id}_${c.slug}_${mode === 'fantasy' ? 'fantasy' : 'real'}.png`;
  }
  function imgPathWithFallback(c, mode) {
    // try fantasy first, fallback to real if missing handled by onerror
    return imgPath(c, mode);
  }
  function switchImage(mode) {
    if (!currentDetail) return;
    const img = document.getElementById('gasshuku-detail-img');
    img.dataset.mode = mode;
    img.src = imgPath(currentDetail, mode) + '?v=' + Date.now();
    img.onerror = () => {
      // fallback if fantasy missing
      if (mode === 'fantasy') {
        img.onerror = null;
        img.src = imgPath(currentDetail, 'real');
      }
    };
    document.querySelectorAll('.gasshuku-toggle-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });
  }
  function openDetail(c) {
    currentDetail = c;
    const d = document.getElementById('gasshuku-detail');
    document.getElementById('gasshuku-detail-name').textContent = c.name;
    document.getElementById('gasshuku-detail-real').textContent = `本人: ${c.real}（${c.role}）`;
    const fac = document.getElementById('gasshuku-detail-faction');
    fac.textContent = `所属: ${c.faction}`;
    fac.style.color = FACTION_COLOR[c.faction] || '#fff';
    document.getElementById('gasshuku-detail-skill').textContent = `🌟 ${c.skill}`;
    document.getElementById('gasshuku-detail-voice').textContent = `「${c.voice}」`;
    d.hidden = false;
    switchImage('fantasy');
  }

  async function startRoll() {
    const result = rollAll();
    const cutscene = document.getElementById('gasshuku-cutscene');
    const grid = document.getElementById('gasshuku-grid');
    cutscene.innerHTML = '';
    grid.innerHTML = '';
    cutscene.classList.remove('done');
    cutscene.style.display = '';
    grid.style.display = 'none';
    document.getElementById('gasshuku-replay').disabled = true;

    // simple cutscene: each char fade-in 1.4s, 12 = ~17s; user can skip
    const skipBtn = document.createElement('button');
    skipBtn.textContent = '⏩ スキップ';
    skipBtn.className = 'gasshuku-skip';
    cutscene.appendChild(skipBtn);
    let skipped = false;
    skipBtn.addEventListener('click', () => { skipped = true; });

    for (let i = 0; i < result.length; i++) {
      if (skipped) break;
      const c = result[i];
      const slot = document.createElement('div');
      slot.className = 'gasshuku-slot';
      slot.innerHTML = `
        <div class="gasshuku-slot-glow" style="background: radial-gradient(circle, ${FACTION_COLOR[c.faction]}88 0%, transparent 70%)"></div>
        <img class="gasshuku-slot-img" src="${imgPath(c, 'fantasy')}" onerror="this.onerror=null;this.src='${imgPath(c, 'real')}'" alt="${c.name}">
        <div class="gasshuku-slot-info">
          <div class="gasshuku-slot-tier">UR</div>
          <div class="gasshuku-slot-name">${c.name}</div>
          <div class="gasshuku-slot-real">${c.real}</div>
          <div class="gasshuku-slot-voice">「${c.voice}」</div>
        </div>
      `;
      cutscene.appendChild(slot);
      // wait 1.2s
      await new Promise(r => setTimeout(r, 1200));
      slot.classList.add('exit');
      await new Promise(r => setTimeout(r, 200));
      slot.remove();
    }
    skipBtn.remove();

    cutscene.classList.add('done');
    cutscene.style.display = 'none';
    grid.style.display = '';

    // grid display: 12 thumbnails
    result.forEach(c => {
      const card = document.createElement('div');
      card.className = 'gasshuku-card';
      card.innerHTML = `
        <div class="gasshuku-card-glow" style="background: radial-gradient(ellipse at top, ${FACTION_COLOR[c.faction]}55 0%, transparent 60%)"></div>
        <img class="gasshuku-card-img" src="${imgPath(c, 'fantasy')}" onerror="this.onerror=null;this.src='${imgPath(c, 'real')}'" alt="${c.name}">
        <div class="gasshuku-card-tier">UR</div>
        <div class="gasshuku-card-name">${c.name}</div>
        <div class="gasshuku-card-real">${c.real}</div>
      `;
      card.addEventListener('click', () => openDetail(c));
      grid.appendChild(card);
    });
    document.getElementById('gasshuku-replay').disabled = false;
  }

  // Hook up button on DOM ready
  function init() {
    const btn = document.getElementById('gasshuku-btn');
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', openModal);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
