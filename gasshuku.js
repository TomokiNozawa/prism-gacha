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

  function rollAll(count) {
    const shuffled = [...POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.max(1, Math.min(count, POOL.length)));
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
      _gasshuku: true
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
    // 既存ガチャ実行中なら待たせる
    if (typeof window.busy !== 'undefined' && window.busy) return;
    gasshukuBusy = true;
    setGachaBtnsDisabled(true);

    try {
      // 既存と同じ stage 起動シーケンス
      if (typeof skipRequested !== 'undefined') skipRequested = false;
      const stageEl = document.getElementById('stage');
      if (stageEl) stageEl.classList.add('active');
      if (typeof clearStage === 'function') clearStage();
      const cv = document.getElementById('canvas') || document.querySelector('canvas');
      if (cv) { cv.width = window.innerWidth; cv.height = window.innerHeight; }

      const chars = rollAll(count);
      for (const c of chars) {
        const result = buildResult(c, imgMode);
        if (typeof summonOne === 'function') {
          await summonOne(result);
        } else {
          console.warn('[gasshuku] summonOne not found, abort');
          break;
        }
      }
    } catch (e) {
      console.error('[gasshuku] roll error:', e);
    } finally {
      if (typeof closeStage === 'function') closeStage();
      gasshukuBusy = false;
      setGachaBtnsDisabled(false);
    }
  }

  // CTA ボタンに listener を bind
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
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
