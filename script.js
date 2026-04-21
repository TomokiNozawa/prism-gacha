/* ============================================================
   Prism Gacha v0.1 — 脳汁ロジック
   ============================================================ */
"use strict";

// ────────────── Character Pool ──────────────
// 世界観「虹霊界(こうれいかい)」:
//   世界の中心にある原虹(げんこう)の結晶がすべての光と生命の源。
//   影喰い(シェイドーヴァ)が虹光を喰らい始め、色が失われつつある世界。
//   選ばれし戦士が「虹因子」を宿し、光を取り戻すために集う。
//
// UR: 専用3体(星暁峰で修行した最高位)／SSR: 5体(各地の精鋭)
const POOL = {
  UR: [
    {
      name: "セラフィエル",
      title: "至天の聖騎士",
      caption: "貴方の祈り、我が光となる",
      desc: "原虹の中心で生まれた六翼の天使。人の姿を借りて降臨する神霊。ハルバード『虹天』は原虹そのものの結晶。世界が完全な闇に呑まれる時のみ顕現し、光を取り戻す。",
      img: "images/ur_01_seraph_paladin.png",
    },
    {
      name: "龍帝 アルテミス",
      title: "虹霊界の覇王",
      caption: "我が背の龍が、世界の終わりを告げる",
      desc: "星暁峰で千年修行した竜人の皇帝。背に映る巨大な龍影は竜魂の実体化。双大剣『陰陽』は光と闇を同時に振るう。虹霊界十国すべてが彼に頭を垂れる。",
      img: "images/ur_02_dragon_emperor.png",
    },
    {
      name: "星海のノクス",
      title: "虚空の星辰魔女",
      caption: "宇宙は私の中にある。貴方も、この瞬間も",
      desc: "人か神かも定かではない謎の魔女。髪には銀河を、従者に惑星を宿す。星杖『虚境』で時間と因果を織る。影喰いとの初戦で世界を救った伝説の存在。",
      img: "images/ur_03_cosmic_witch.png",
    },
    {
      name: "千夜姫 カグヤ",
      title: "虹霊界最古の賢者",
      caption: "幼く見えるか？ うむ、千年やっとるでな",
      desc: "原虹の誕生より前から在る月の化身。小柄な少女の姿で顕現しているが、実齢は計り知れぬ。九尾の天狐を従え、杖『月影(つきかげ)』に全魔術の原典を宿す。気まぐれに人前へ現れ、助言を残して消える。",
      img: "images/ur_04_ancient_sage.png",
    },
  ],
  SSR: [
    {
      name: "森の射手 リナエ",
      title: "深緑樹海の守り手",
      caption: "葉音が消えた瞬間、狙いは定まっている",
      desc: "エルフ狩人氏族の末裔。樹齢千年の祖木から作られた『生きた弓』の継承者。葉擦れだけで敵の位置を読み、矢は外さない。樹海の異変をいち早く察知する斥候。",
      img: "images/ssr_08_elf_archer.png",
    },
    {
      name: "獣牙 ガルド",
      title: "月牙狼族の戦士団長",
      caption: "群れのために斧を振るう。それだけだ",
      desc: "狼獣人の誇り高き戦士族。両手斧『月牙』は代々の団長が受け継ぐ英雄の遺物。寡黙で粗野に見えて、仲間のためには命を惜しまない。",
      img: "images/ssr_09_wolf_warrior.png",
    },
    {
      name: "竜爵 ヴィル",
      title: "紫竜王国の第三王女",
      caption: "竜の血を甘く見るな、死ぬぞ",
      desc: "紫竜王の三女にして、生まれながらの竜人。三叉槍『紫雷』は彼女自身の竜気を解放する。王位継承権を弟に譲り、戦場を己の居場所と決めた。",
      img: "images/ssr_10_draco_lancer.png",
    },
    {
      name: "仮面騎士 シオン",
      title: "銀霜王国の沈黙の盾",
      caption: "騎士に名は要らぬ。仮面と誓いがあれば",
      desc: "素顔も声も伏せた謎の聖騎士。王族暗殺の陰謀から主君を守るため、名と顔を捨てた。盾『誓盾』とメイス『裁罰』は神器級。無言の剛力が恐怖を呼ぶ。",
      img: "images/ssr_11_masked_knight.png",
    },
    {
      name: "黒猫 ノア",
      title: "黒曜塔の若き司書官",
      caption: "本なら任せて♪ 読むのも書くのも、ぶっ壊すのも",
      desc: "黒曜塔の禁書庫を預かる猫獣人の天才。浮遊魔導書『夜導』で召喚魔術を操る。自由奔放で人懐っこいが、禁書の扱いだけは絶対に譲らない。",
      img: "images/ssr_12_cat_librarian.png",
    },
    {
      name: "朱音",
      title: "夜焔郷の遊芸師",
      caption: "逃げたいなら今のうち。逃げなかったら、もう遅いわ",
      desc: "夜焔郷の花街で一等と謳われる遊芸師。表の顔は舞い手、裏の顔は暗殺者。九尾の黒狐の血を引き、金の扇『紅月』から放つ灼火の術で標的を焼き尽くす。",
      img: "images/ssr_13_kitsune_lady.png",
    },
    {
      name: "イザベル",
      title: "白焔教会の聖巫騎士",
      caption: "あなたの傷、すべてこの手で癒してあげる",
      desc: "白焔教会の聖域を守る聖巫騎士。聖槍『天穹(てんきゅう)』は虹霊界十英雄の一人から受け継がれし神器。癒しの聖光と戦場の剛力を両立する、稀有な『戦う治癒者』。",
      img: "images/ssr_14_paladin_lady.png",
    },
    {
      name: "ひなた",
      title: "皇家の末妹・見習い剣士",
      caption: "ね、わたしも連れてって！修行したんだから！",
      desc: "紅翼皇家の末妹、齢十三。兄姉たちの背を追って剣の道へ。小太刀『桜散(さくらちらし)』で舞うように戦う。屈託のない笑顔の奥に、家を守る強い意志を秘める。",
      img: "images/ssr_15_little_sister.png",
    },
  ],
  SR: [
    // 旧SSR初期7体を SR に降格（推しキャラ風含む）
    { name: "ルミナ",         img: "images/ssr_01_silver_girl.png" },
    { name: "黒刃 玄",        img: "images/ssr_02_swordsman.png" },
    { name: "セラフィ",       img: "images/ssr_03_mage.png" },
    { name: "紅翼 ツキ",      img: "images/ssr_04_red_twintail.png" },
    { name: "薫音",           img: "images/ssr_05_katana_miko.png" },
    { name: "リリム",         img: "images/ssr_06_pink_dragon_girl.png" },
    { name: "メイリ",         img: "images/ssr_07_white_priestess.png" },
  ],
  R: [
    // 旧R 3体
    { name: "ちさと",   img: "images/r_01_student.png" },
    { name: "カイ",     img: "images/r_02_boy_scout.png" },
    { name: "こはね",   img: "images/r_03_fox_girl.png" },
    // 旧SR 3体を R に降格してマージ
    { name: "ヴィオラ", img: "images/sr_01_archer.png" },
    { name: "アルス",   img: "images/sr_02_young_mage.png" },
    { name: "ミレイア", img: "images/sr_03_warrior.png" },
  ],
};

// ────────────── Settings ──────────────
const PRICE_PER_ROLL = 300;
const PITY = 180;            // 天井
const RATES = { R: 0.65, SR: 0.25, SSR: 0.07, UR: 0.03 };

// ────────────── State ──────────────
const state = loadState();

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem("prism-gacha") || "{}");
    return {
      total: raw.total || 0,
      ur: raw.ur || 0,
      pity: raw.pity || 0,
      god: raw.god || false,
      history: raw.history || [],
      galleryViewed: raw.galleryViewed || {},  // 図鑑で詳細を開いたキャラ{"UR_セラフィエル": true}
    };
  } catch { return { total:0, ur:0, pity:0, god:false, history:[], galleryViewed:{} }; }
}
function saveState() {
  localStorage.setItem("prism-gacha", JSON.stringify(state));
}

// ────────────── Rolling ──────────────
function rollOne() {
  // 神モード: 全部 UR
  if (state.god) return pickTier("UR");
  // 天井
  if (state.pity >= PITY - 1) return pickTier("UR");
  const r = Math.random();
  let acc = 0;
  for (const tier of ["UR", "SSR", "SR", "R"]) {
    acc += RATES[tier];
    if (r < acc) return pickTier(tier);
  }
  return pickTier("R");
}
function pickTier(tier) {
  const pool = POOL[tier];
  const ch = pool[Math.floor(Math.random() * pool.length)];
  return { tier, ...ch };
}

function applyPull(result) {
  // 初回獲得判定(履歴に追加する前に確認)
  result.isNew = !state.history.some(h => h.name === result.name && h.tier === result.tier);
  state.total += 1;
  if (result.tier === "UR") { state.ur += 1; state.pity = 0; }
  else state.pity += 1;
  state.history.unshift({ ...result, at: Date.now() });
  if (state.history.length > 120) state.history.length = 120;
  saveState();
  updateHUD();
}

// ────────────── 10連希少度計算 (多項分布) ──────────────
function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function multinomialProb(nR, nSR, nSSR, nUR) {
  const total = nR + nSR + nSSR + nUR;
  const coef = factorial(total) / (factorial(nR) * factorial(nSR) * factorial(nSSR) * factorial(nUR));
  return coef *
    Math.pow(RATES.R, nR) *
    Math.pow(RATES.SR, nSR) *
    Math.pow(RATES.SSR, nSSR) *
    Math.pow(RATES.UR, nUR);
}

function computeTenRollRarity(results) {
  const counts = { R: 0, SR: 0, SSR: 0, UR: 0 };
  for (const r of results) counts[r.tier]++;
  const thisP = multinomialProb(counts.R, counts.SR, counts.SSR, counts.UR);
  // 今回と同等以下の確率を持つ組み合わせの合計（=「同等以上の珍しさ」確率）
  let rarerOrEqualProb = 0;
  for (let nUR = 0; nUR <= 10; nUR++) {
    for (let nSSR = 0; nSSR <= 10 - nUR; nSSR++) {
      for (let nSR = 0; nSR <= 10 - nUR - nSSR; nSR++) {
        const nR = 10 - nUR - nSSR - nSR;
        const p = multinomialProb(nR, nSR, nSSR, nUR);
        if (p <= thisP + 1e-15) rarerOrEqualProb += p;
      }
    }
  }
  const oneInN = thisP > 0 ? Math.round(1 / thisP) : Infinity;
  // ランク判定: UR数が多いほど上位、細かくは rarerOrEqualProb で区別
  let rank, rankClass;
  if (counts.UR >= 3) { rank = "SSS"; rankClass = "sss"; }
  else if (counts.UR >= 2) { rank = "SS"; rankClass = "ss"; }
  else if (counts.UR >= 1 && counts.SSR >= 2) { rank = "SS"; rankClass = "ss"; }
  else if (counts.UR >= 1) { rank = "S+"; rankClass = "splus"; }
  else if (counts.SSR >= 3) { rank = "S"; rankClass = "s"; }
  else if (counts.SSR >= 2) { rank = "A+"; rankClass = "aplus"; }
  else if (counts.SSR >= 1) { rank = "A"; rankClass = "a"; }
  else if (counts.SR >= 4) { rank = "B+"; rankClass = "bplus"; }
  else if (counts.SR >= 2) { rank = "B"; rankClass = "b"; }
  else { rank = "C"; rankClass = "c"; }
  return { thisP, rarerOrEqualProb, oneInN, rank, rankClass, counts };
}

// ────────────── HUD ──────────────
const $ = s => document.querySelector(s);

function updateHUD() {
  $("#stat-total").textContent = state.total.toLocaleString();
  $("#stat-ur").textContent = state.ur.toLocaleString();
  $("#stat-pity").textContent = Math.max(0, PITY - state.pity);
  $("#btn-god").classList.toggle("on", state.god);
  $("#btn-god").textContent = "神モード " + (state.god ? "ON" : "OFF");

  // background tier
  document.body.classList.remove("t-100", "t-500", "t-1000");
  if (state.total >= 1000) document.body.classList.add("t-1000");
  else if (state.total >= 500) document.body.classList.add("t-500");
  else if (state.total >= 100) document.body.classList.add("t-100");

  renderHistory();
}

function renderHistory() {
  const grid = $("#history");
  grid.innerHTML = "";
  state.history.slice(0, 30).forEach(h => {
    const c = document.createElement("div");
    c.className = "hcard " + h.tier.toLowerCase();
    const img = document.createElement("div");
    img.className = "hcard-img";
    img.style.backgroundImage = `url('${h.img}')`;
    c.appendChild(img);
    const nm = document.createElement("div");
    nm.className = "hcard-name"; nm.textContent = h.name;
    c.appendChild(nm);
    grid.appendChild(c);
  });
}

// ────────────── Stage / VFX ──────────────
const stage = $("#stage");
const stageVfx = $("#stage-vfx");
const stageChars = $("#stage-chars");
const canvas = $("#stage-canvas");
const ctx = canvas.getContext("2d");

let skipRequested = false;
function waitKeyOrClick() { skipRequested = false; }
function checkSkip() { return skipRequested; }

stage.addEventListener("click", () => { skipRequested = true; });

// SSR/UR 演出後の「任意キーで進行」待機
function waitForKey() {
  return new Promise(resolve => {
    let done = false;
    const onEvt = (e) => {
      if (done) return;
      done = true;
      // Enter連打 → 後続の結果モーダルまで連鎖伝播して即閉じる問題を防止
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();
      if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
      document.removeEventListener("keydown", onEvt, true);
      stage.removeEventListener("click", onEvt, true);
      const h = document.getElementById("continue-hint");
      if (h) h.remove();
      resolve();
    };
    document.addEventListener("keydown", onEvt, true);
    stage.addEventListener("click", onEvt, true);
  });
}

// 結果モーダル開いた直後はキー入力を無視するガード
let resultOpenedAt = 0;
const RESULT_KEY_GUARD_MS = 350;

// 続行ヒントを画面下部に表示
function showContinueHint() {
  const el = document.createElement("div");
  el.id = "continue-hint";
  el.className = "fx-continue-hint";
  el.textContent = "▶  CLICK  or  ANY KEY  ▶";
  stageVfx.appendChild(el);
}

function setStageTier(tier) {
  stage.className = "stage active tier-" + tier.toLowerCase();
}
function clearStage() {
  stageVfx.innerHTML = "";
  stageChars.innerHTML = "";
  stage.classList.remove("shake");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function closeStage() {
  stage.classList.remove("active");
  clearStage();
  skipRequested = false;  // 次回に持ち越さない
}

function sleep(ms) {
  return new Promise(res => {
    const start = Date.now();
    const tick = () => {
      if (skipRequested || Date.now() - start >= ms) res();
      else requestAnimationFrame(tick);
    };
    tick();
  });
}

// ────────────── Particles on canvas (統合ループ) ──────────────
let particles = [];
let particleLoopRunning = false;

function particleBurst(colors, opts = {}) {
  const n = opts.n || 80;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 4 + Math.random() * (opts.speed || 12);
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life: 60 + Math.random() * 40,
      col: colors[Math.floor(Math.random() * colors.length)],
      r: 2 + Math.random() * 3,
    });
  }
  if (!particleLoopRunning) startParticleLoop();
}

function startParticleLoop() {
  particleLoopRunning = true;
  function loop() {
    // 残像を薄く (重なり過ぎないよう alphaを下げ、さらに fill 面積を抑えるため一度だけ)
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.08; p.life -= 1;
      ctx.fillStyle = p.col;
      ctx.shadowColor = p.col; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.shadowBlur = 0;
    particles = particles.filter(p => p.life > 0);
    if (particles.length > 0 && !skipRequested) {
      requestAnimationFrame(loop);
    } else {
      particleLoopRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  loop();
}

const TIER_COLORS = {
  R:   ["#6fa8ff", "#aad4ff"],
  SR:  ["#c87dff", "#e0a0ff"],
  SSR: ["#ffd96a", "#ffb347"],
  UR:  ["#ff5faa", "#ffd84d", "#5fffd4", "#7ea8ff", "#c87dff"],
};
const TIER_PILLAR = {
  R:   "images/fx_pillar_blue.png",
  SR:  "images/fx_pillar_purple.png",
  SSR: "images/fx_pillar_gold.png",
  UR:  "images/rainbow_pillar_effect.png",
};

// フラッシュ強度: "soft"(R/SR段階用), "mid"(SSR用), "hard"(UR用)
let lastFlashAt = 0;
function flash(strength = "soft") {
  // 連続発動防止: 直近200ms以内なら抑制
  const now = Date.now();
  if (now - lastFlashAt < 200) return;
  lastFlashAt = now;
  const f = document.createElement("div");
  f.className = "fx-flash " + strength;
  stageVfx.appendChild(f);
  setTimeout(() => f.remove(), 600);
}

function showPillar(tier) {
  // 前の pillar を即時削除して重ね合わせによる白飛びを防止
  stageVfx.querySelectorAll(".fx-pillar").forEach(e => e.remove());
  const p = document.createElement("div");
  p.className = "fx-pillar show";
  p.style.backgroundImage = `url('${TIER_PILLAR[tier]}')`;
  stageVfx.appendChild(p);
}
function showCrack() {
  const c = document.createElement("div");
  c.className = "fx-crack show";
  c.style.backgroundImage = "url('images/fx_crack_burst.png')";
  stageVfx.appendChild(c);
  setTimeout(() => c.remove(), 700);
}
function showText(txt, color) {
  const t = document.createElement("div");
  t.className = "fx-text pop";
  t.textContent = txt;
  if (color) t.style.color = color;
  stageVfx.appendChild(t);
  setTimeout(() => t.remove(), 800);
}

// フェイク破壊の煽りテキスト (「SR確定...？」)
function showTaunt(txt) {
  const t = document.createElement("div");
  t.className = "fx-taunt show";
  t.textContent = txt;
  stageVfx.appendChild(t);
  setTimeout(() => t.remove(), 3000);
  return t;
}

// UR時の確率ポップ
function showRate() {
  const r = document.createElement("div");
  r.className = "fx-rate";
  r.textContent = "出現率 3.0 %";
  stageVfx.appendChild(r);
  setTimeout(() => r.remove(), 3500);
}

// UR時の波紋
function showRing() {
  const r = document.createElement("div");
  r.className = "fx-ring go";
  stageVfx.appendChild(r);
  setTimeout(() => r.remove(), 1300);
}

// 星屑降下 (UR時にキャラ背景へ)
function startStars(ms = 3000) {
  const wrap = document.createElement("div");
  wrap.className = "fx-stars";
  stageVfx.appendChild(wrap);
  const colors = ["#fff", "#ffd84d", "#5fffd4", "#c87dff", "#ff5faa"];
  let stopped = false;
  const spawn = () => {
    if (stopped) return;
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    s.style.background = s.style.color;
    s.style.animationDuration = 2 + Math.random() * 2 + "s";
    s.style.width = s.style.height = 2 + Math.random() * 3 + "px";
    wrap.appendChild(s);
    setTimeout(() => s.remove(), 4500);
  };
  const iv = setInterval(spawn, 40);
  setTimeout(() => {
    stopped = true;
    clearInterval(iv);
    setTimeout(() => wrap.remove(), 4500);
  }, ms);
}

// 獲得テロップ
function showWin(tier) {
  const w = document.createElement("div");
  w.className = "fx-win go " + tier.toLowerCase();
  w.textContent = tier === "UR" ? "🌈  U  R   O B T A I N E D  🌈" : "✨  S S R   G E T  ✨";
  stageVfx.appendChild(w);
  setTimeout(() => w.remove(), 2500);
}

function revealChar(result) {
  const img = document.createElement("img");
  // SSR/URはズームバースト付きで登場
  const burstClass = (result.tier === "SSR" || result.tier === "UR") ? " burst-in" : "";
  const auraClass = result.tier === "UR" ? " ur-aura" : "";
  img.className = "char-reveal" + auraClass + burstClass;
  img.src = result.img;
  img.alt = result.name;
  stageChars.appendChild(img);
}

// ────────────── 高レア専用装飾 ──────────────

// 全面虹背景 (UR限定)
function showRainbowBg(ms = 4000) {
  const el = document.createElement("div");
  el.className = "fx-rainbow-bg on";
  stageVfx.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity 0.5s";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 500);
  }, ms);
}

// 放射状ゴッドレイ (SSR=金 / UR=虹)
function showGodRays(isUR, ms = 4000) {
  const el = document.createElement("div");
  el.className = "fx-godrays on" + (isUR ? " ur" : "");
  stageVfx.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity 0.6s";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 600);
  }, ms);
}

// 虹色/金色粒子噴水 (下から上)
function showFountain(colors, count = 60, dur = 3000) {
  const wrap = document.createElement("div");
  wrap.className = "fx-fountain";
  stageVfx.appendChild(wrap);
  let stopped = false;
  const spawn = () => {
    if (stopped) return;
    const d = document.createElement("div");
    d.className = "drop";
    d.style.left = (Math.random() * 100) + "%";
    d.style.color = colors[Math.floor(Math.random() * colors.length)];
    d.style.setProperty("--dur", (1.2 + Math.random() * 1.2) + "s");
    d.style.animationDelay = (Math.random() * 0.3) + "s";
    wrap.appendChild(d);
    setTimeout(() => d.remove(), 3000);
  };
  const n = count;
  for (let i = 0; i < n; i++) setTimeout(spawn, i * (dur / n));
  setTimeout(() => {
    stopped = true;
    setTimeout(() => wrap.remove(), 3200);
  }, dur);
}

// 紙吹雪 (UR用)
function showConfetti(count = 70, ms = 4500) {
  const wrap = document.createElement("div");
  wrap.className = "fx-confetti";
  stageVfx.appendChild(wrap);
  const colors = ["#ff5faa", "#ffd84d", "#5fffd4", "#7ea8ff", "#c87dff", "#ffffff"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "piece";
    p.style.left = (Math.random() * 100) + "%";
    p.style.color = colors[Math.floor(Math.random() * colors.length)];
    p.style.setProperty("--dur", (2.5 + Math.random() * 2.5) + "s");
    p.style.animationDelay = (Math.random() * 0.6) + "s";
    p.style.width = (5 + Math.random() * 8) + "px";
    p.style.height = (10 + Math.random() * 8) + "px";
    wrap.appendChild(p);
  }
  setTimeout(() => wrap.remove(), ms + 1500);
}

// 虹大円環 (UR時キャラ背景に)
function showHalo() {
  const h = document.createElement("div");
  h.className = "fx-halo go";
  stageVfx.appendChild(h);
  setTimeout(() => h.remove(), 5000);
}

// MIRACLEテロップ (UR時)
function showMiracle() {
  const m = document.createElement("div");
  m.className = "fx-miracle go";
  m.textContent = "🌈  M I R A C L E  🌈";
  stageVfx.appendChild(m);
  setTimeout(() => m.remove(), 2200);
}

// 上からの光条 (UR用)
function showRaysDown(color = "rgba(255,216,77,0.6)", beams = 7, ms = 3500) {
  const wrap = document.createElement("div");
  wrap.className = "fx-rays-down on";
  stageVfx.appendChild(wrap);
  for (let i = 0; i < beams; i++) {
    const b = document.createElement("div");
    b.className = "beam";
    b.style.color = color;
    b.style.left = ((i / beams) * 100 + (Math.random() - 0.5) * 8) + "%";
    b.style.width = (60 + Math.random() * 60) + "px";
    b.style.animationDelay = (Math.random() * 1) + "s";
    b.style.transform = `rotate(${(Math.random() - 0.5) * 10}deg)`;
    wrap.appendChild(b);
  }
  setTimeout(() => {
    wrap.style.transition = "opacity 0.5s";
    wrap.style.opacity = "0";
    setTimeout(() => wrap.remove(), 500);
  }, ms);
}

// キャラ名プレート（降臨後に表示）
// SSR/UR は title + caption も出す、R/SR は名前のみ
function showCharName(result) {
  const wrap = document.createElement("div");
  wrap.className = "fx-charname go " + result.tier.toLowerCase();

  // 1行目: [tierバッジ] + 名前 + (NEW)
  const top = document.createElement("div");
  top.className = "fx-charname-top";
  const badge = document.createElement("span");
  badge.className = "fx-charname-tier";
  badge.textContent = result.tier;
  top.appendChild(badge);
  const nameEl = document.createElement("span");
  nameEl.className = "fx-charname-main";
  nameEl.textContent = result.name;
  top.appendChild(nameEl);
  if (result.isNew) {
    const newBadge = document.createElement("span");
    newBadge.className = "fx-charname-new";
    newBadge.textContent = "NEW";
    top.appendChild(newBadge);
  }
  wrap.appendChild(top);

  // 2行目: 肩書き (SSR/URのみ)
  if (result.title && (result.tier === "SSR" || result.tier === "UR")) {
    const sub = document.createElement("div");
    sub.className = "fx-charname-sub";
    sub.textContent = result.title;
    wrap.appendChild(sub);
  }

  // 3行目: キャッチコピー (SSR/URのみ)
  if (result.caption && (result.tier === "SSR" || result.tier === "UR")) {
    const cap = document.createElement("div");
    cap.className = "fx-charname-caption";
    cap.textContent = "「" + result.caption + "」";
    wrap.appendChild(cap);
  }

  stageVfx.appendChild(wrap);
  // SSR/URは余韻中も表示し続けるため、キー押下でクリアされるまで残す
  if (result.tier !== "UR" && result.tier !== "SSR") {
    setTimeout(() => wrap.remove(), 4000);
  }
}

// ────────────── Sound (Web Audio API 合成) ──────────────
let actx = null;
function getCtx() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === "suspended") actx.resume();
  return actx;
}

function envGain(ctx, dest, attack, release, peak = 0.6) {
  const g = ctx.createGain();
  g.gain.value = 0;
  g.connect(dest);
  const t0 = ctx.currentTime;
  g.gain.linearRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + attack + release);
  return g;
}

// 低音→中音のドンっ(summon)
function seSummon() {
  const ctx = getCtx();
  const out = ctx.destination;
  // bass drop
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.value = 80;
  o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
  const g = envGain(ctx, out, 0.01, 0.35, 0.55);
  o.connect(g);
  o.start();
  o.stop(ctx.currentTime + 0.4);
  // shimmer on top
  const o2 = ctx.createOscillator();
  o2.type = "triangle";
  o2.frequency.value = 880;
  o2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.2);
  const g2 = envGain(ctx, out, 0.01, 0.25, 0.15);
  o2.connect(g2);
  o2.start();
  o2.stop(ctx.currentTime + 0.3);
}

// 高音キラ＋和音(fanfare for SSR/UR)
function seFanfare() {
  const ctx = getCtx();
  const out = ctx.destination;
  // 明るい4度＋5度の和音 (C5 E5 G5 C6)
  const freqs = [523, 659, 784, 1047];
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = f;
    const g = envGain(ctx, out, 0.02 + i * 0.03, 0.8, 0.15);
    o.connect(g);
    o.start(ctx.currentTime + i * 0.03);
    o.stop(ctx.currentTime + 1.2);
  });
  // 上昇スイープの装飾
  const sweep = ctx.createOscillator();
  sweep.type = "sawtooth";
  sweep.frequency.value = 400;
  sweep.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.35);
  const sg = envGain(ctx, out, 0.01, 0.35, 0.08);
  sweep.connect(sg);
  sweep.start();
  sweep.stop(ctx.currentTime + 0.5);
}

// ガラス破砕(crack)
function seCrack() {
  const ctx = getCtx();
  const out = ctx.destination;
  // ホワイトノイズを短く
  const dur = 0.5;
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  // ハイパス気味にしてガラス感
  const filt = ctx.createBiquadFilter();
  filt.type = "highpass";
  filt.frequency.value = 2000;
  const g = envGain(ctx, out, 0.002, 0.45, 0.4);
  src.connect(filt).connect(g);
  src.start();
  // 下降チャープで「パリン」感
  const o = ctx.createOscillator();
  o.type = "square";
  o.frequency.value = 1800;
  o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
  const og = envGain(ctx, out, 0.005, 0.3, 0.12);
  o.connect(og);
  o.start();
  o.stop(ctx.currentTime + 0.3);
}

function play(kind) {
  try {
    if (kind === "se-summon") seSummon();
    else if (kind === "se-fanfare") seFanfare();
    else if (kind === "se-crack") seCrack();
  } catch (e) { console.warn("sound err", e); }
}

// ────────────── 追加演出パーツ ──────────────

// 中央の結晶オーブ(Type A用)
function showOrb() {
  stageVfx.querySelectorAll(".fx-orb").forEach(e => e.remove());
  const o = document.createElement("div");
  o.className = "fx-orb orb-r";
  stageVfx.appendChild(o);
  return o;
}
function orbTier(orb, tier) {
  orb.className = "fx-orb orb-" + tier.toLowerCase();
}
function orbBurst(orb) {
  orb.classList.add("burst");
  setTimeout(() => orb.remove(), 500);
}

// 流星群 (Type D)
function showMeteors(count, color) {
  const w = window.innerWidth, h = window.innerHeight;
  for (let i = 0; i < count; i++) {
    const m = document.createElement("div");
    m.className = "fx-meteor";
    const side = Math.floor(Math.random() * 4);
    let fromX, fromY, angle;
    if (side === 0) { fromX = (Math.random() - 0.5) * w; fromY = -h * 0.8 - Math.random() * 200; angle = 150 + (Math.random() - 0.5) * 60; }
    else if (side === 1) { fromX = -w * 0.8 - Math.random() * 200; fromY = (Math.random() - 0.5) * h; angle = -120 + (Math.random() - 0.5) * 60; }
    else if (side === 2) { fromX = (Math.random() - 0.5) * w; fromY = h * 0.8 + Math.random() * 200; angle = -30 + (Math.random() - 0.5) * 60; }
    else { fromX = w * 0.8 + Math.random() * 200; fromY = (Math.random() - 0.5) * h; angle = 60 + (Math.random() - 0.5) * 60; }
    m.style.setProperty("--from-x", fromX + "px");
    m.style.setProperty("--from-y", fromY + "px");
    m.style.setProperty("--angle", angle + "deg");
    m.style.setProperty("--dur", (0.55 + Math.random() * 0.3) + "s");
    m.style.color = color;
    m.style.top = "50%";
    m.style.left = "50%";
    m.style.animationDelay = (Math.random() * 0.25) + "s";
    m.classList.add("go");
    stageVfx.appendChild(m);
    setTimeout(() => m.remove(), 1400);
  }
}

// ポータル開扉 (Type E)
function showPortal() {
  const p = document.createElement("div");
  p.className = "fx-portal go";
  stageVfx.appendChild(p);
  const r = document.createElement("div");
  r.className = "fx-portal-ring go";
  stageVfx.appendChild(r);
  setTimeout(() => { p.remove(); r.remove(); }, 1800);
}

// カットイン (Type F)
function showCutin(c1, c2) {
  const t = document.createElement("div");
  t.className = "fx-cutin top go";
  t.style.setProperty("--c1", c1);
  t.style.setProperty("--c2", c2);
  const b = document.createElement("div");
  b.className = "fx-cutin bottom go";
  b.style.setProperty("--c1", c2);
  b.style.setProperty("--c2", c1);
  stageVfx.appendChild(t); stageVfx.appendChild(b);
  // exit 予約は呼び元で
  return { top: t, bottom: b };
}
function cutinExit(bars) {
  bars.top.classList.remove("top", "go"); bars.top.classList.add("exit-top", "top");
  bars.bottom.classList.remove("bottom", "go"); bars.bottom.classList.add("exit-bottom", "bottom");
  setTimeout(() => { bars.top.remove(); bars.bottom.remove(); }, 350);
}

// 10連イントロ「× 10」
function showTenIntro() {
  const w = document.createElement("div");
  w.className = "fx-ten-intro go";
  w.textContent = "× 10";
  stageVfx.appendChild(w);
  setTimeout(() => w.remove(), 1200);
}

const ORB_COLOR = { R: "#6fa8ff", SR: "#c87dff", SSR: "#ffd96a", UR: "#ff5faa" };

// ────────────── Summon 各タイプ ──────────────

// Type Z: R/SR専用 直接登場 (脳汁演出なし、粒子少量 + 軽flash)
async function summonTypeZ(result, tier) {
  setStageTier(tier);
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], {
    n: tier === "SR" ? 35 : 18,
    speed: tier === "SR" ? 8 : 6,
  });
  if (tier === "SR") flash("soft");
  await sleep(450);
}

// Type A: オーブ昇格 (シンプル・テンポ良)
async function summonTypeA(result, tier) {
  const ladder = ["R", "SR", "SSR", "UR"];
  const stopIdx = ladder.indexOf(tier);
  const orb = showOrb();
  for (let i = 0; i <= stopIdx; i++) {
    const t = ladder[i];
    orbTier(orb, t);
    setStageTier(t);
    await sleep(i === stopIdx ? 550 : 380);
    if (checkSkip()) { orbBurst(orb); return; }
  }
  // 爆発
  orbBurst(orb);
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], { n: 110, speed: 13 });
  flash(tier === "UR" ? "hard" : tier === "SSR" ? "mid" : "soft");
  await sleep(500);
}

// Type B: フェイク破壊
async function summonTypeB(result, tier) {
  const ladder = ["R", "SR", "SSR", "UR"];
  const stopIdx = ladder.indexOf(tier);
  const fakeIdx = Math.max(1, stopIdx - 1);
  const orb = showOrb();
  for (let i = 0; i <= fakeIdx; i++) {
    const t = ladder[i];
    orbTier(orb, t);
    setStageTier(t);
    await sleep(420);
    if (checkSkip()) { orbBurst(orb); return; }
  }
  // 停滞音 + 煽り
  const tauntMap = {
    UR: ["SSR確定...?", "おや、SSRか...", "紫止まり...", "SR止まり... ?"],
    SSR: ["紫止まり...", "SR確定...?"],
  };
  const arr = tauntMap[tier] || ["SR確定...?"];
  showTaunt(arr[Math.floor(Math.random() * arr.length)]);
  await sleep(1400);
  if (checkSkip()) { orbBurst(orb); return; }
  // 破壊
  play("se-crack");
  showCrack();
  stage.classList.add("shake");
  orb.remove();
  await sleep(500);
  stage.classList.remove("shake");
  // 本tier爆発
  setStageTier(tier);
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], { n: 160, speed: 17 });
  flash(tier === "UR" ? "hard" : "mid");
  await sleep(600);
}

// Type C: スロー溜め (オーブが各色で脈動)
async function summonTypeC(result, tier) {
  const ladder = ["R", "SR", "SSR", "UR"];
  const stopIdx = ladder.indexOf(tier);
  const orb = showOrb();
  for (let i = 0; i <= stopIdx; i++) {
    const t = ladder[i];
    orbTier(orb, t);
    setStageTier(t);
    particleBurst(TIER_COLORS[t], { n: 15, speed: 3 });
    await sleep(i === stopIdx ? 850 : 720);
    if (checkSkip()) { orbBurst(orb); return; }
  }
  orbBurst(orb);
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], { n: 140, speed: 15 });
  flash(tier === "UR" ? "hard" : "mid");
  await sleep(650);
}

// Type D: 流星群
async function summonTypeD(result, tier) {
  setStageTier(tier === "UR" ? "SR" : "R"); // 前半は抑えめ背景
  // 1wave目: ランダム流星3本
  showMeteors(3, TIER_COLORS[tier][0]);
  await sleep(500);
  if (checkSkip()) return;
  // 2wave目: tier色で多め
  setStageTier(tier);
  showMeteors(tier === "UR" ? 12 : tier === "SSR" ? 8 : 5, TIER_COLORS[tier][0]);
  await sleep(650);
  if (checkSkip()) return;
  // 中央衝突
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], { n: 160, speed: 16 });
  flash(tier === "UR" ? "hard" : "mid");
  stage.classList.add("shake");
  await sleep(400);
  stage.classList.remove("shake");
  await sleep(300);
}

// Type E: ポータル開扉
async function summonTypeE(result, tier) {
  setStageTier(tier);
  showPortal();
  // ポータルが広がる間に粒子を吸い込むように
  await sleep(700);
  if (checkSkip()) return;
  particleBurst(TIER_COLORS[tier], { n: 60, speed: 6 });
  await sleep(500);
  if (checkSkip()) return;
  // ポータルから光が溢れる → 爆発
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], { n: 160, speed: 16 });
  flash(tier === "UR" ? "hard" : "mid");
  await sleep(500);
}

// Type F: カットイン
async function summonTypeF(result, tier) {
  setStageTier(tier);
  const [c1, c2] = TIER_COLORS[tier];
  const bars = showCutin(c1, c2 || c1);
  await sleep(520);
  if (checkSkip()) { cutinExit(bars); return; }
  // 衝突 flash
  flash(tier === "UR" ? "hard" : "mid");
  stage.classList.add("shake");
  await sleep(250);
  stage.classList.remove("shake");
  cutinExit(bars);
  // 本tier昇格
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], { n: 150, speed: 15 });
  await sleep(500);
}

// ────────────── Router ──────────────

function pickWeighted(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [k, w] of Object.entries(weights)) {
    r -= w;
    if (r <= 0) return k;
  }
  return Object.keys(weights)[0];
}

function pickSummonType(tier, opts) {
  // 10連のforceSlow時は C 必須 (SSR以上)
  if (opts.forceSlow && (tier === "UR" || tier === "SSR")) return "C";
  // R/SR は脳汁演出なし、直接登場タイプ
  if (tier === "R") return "Z";
  if (tier === "SR") return "Z";
  // SSRは脳汁（6種ランダム）
  if (tier === "SSR") return pickWeighted({ A: 1, B: 1, C: 1, D: 2, E: 2, F: 2 });
  // URは超脳汁（派手系のみ、AとF除外）
  if (tier === "UR") return pickWeighted({ B: 3, C: 3, D: 3, E: 4 });
  return "Z";
}

async function summonOne(result, opts = {}) {
  const tier = result.tier;
  const isHigh = tier === "UR" || tier === "SSR";
  // 10連中途キャラは showLadder=false で昇格演出スキップ（装飾だけ出す）
  const showLadder = opts.showLadder !== false;
  setStageTier(tier);

  // ─ 溜め: SSR/URは長めの沈黙で期待感 ─
  if (isHigh) {
    stage.classList.add("charge-up");
    play("se-summon");
    await sleep(tier === "UR" ? 850 : 600);
    stage.classList.remove("charge-up");
    if (checkSkip()) return finalize(result);
  } else {
    play("se-summon");
    await sleep(200);
    if (checkSkip()) return finalize(result);
  }

  // ─ 昇格演出 (showLadder=trueの時のみ、SSR以上) ─
  if (showLadder && isHigh) {
    const type = pickSummonType(tier, opts);
    console.log(`[Summon] tier=${tier} type=${type} ladder=on`);
    const fn = { A: summonTypeA, B: summonTypeB, C: summonTypeC, D: summonTypeD, E: summonTypeE, F: summonTypeF }[type] || summonTypeA;
    await fn(result, tier);
    if (checkSkip()) return finalize(result);
  } else if (!showLadder && isHigh) {
    // 10連中途のSSR/UR: 装飾のみ発火 (昇格なし)
    setStageTier(tier);
    showPillar(tier);
    particleBurst(TIER_COLORS[tier], { n: tier === "UR" ? 120 : 80, speed: tier === "UR" ? 15 : 12 });
    flash(tier === "UR" ? "hard" : "mid");
    await sleep(400);
  } else {
    // R/SR: Type Z (シンプル登場)
    await summonTypeZ(result, tier);
  }
  if (checkSkip()) return finalize(result);

  // ────────── レア度別の追加派手演出 ──────────
  if (tier === "UR") {
    // ━━━ 超脳汁フルコース ━━━
    // 1. 全面虹背景 + 虹ゴッドレイ（長め）
    showRainbowBg(5500);
    showGodRays(true, 5500);
    // 2. 上からの白い光条 (10本、多めで豪華)
    showRaysDown("rgba(255,255,255,0.8)", 10, 5000);
    // 3. 虹噴水 (100個、長尺)
    showFountain(["#ff5faa", "#ffd84d", "#5fffd4", "#7ea8ff", "#c87dff"], 100, 4500);
    // 4. 星屑降下 (5秒)
    startStars(5000);
    // 5. 紙吹雪 (70片、4.5秒)
    showConfetti(70, 4500);
    // 6. 虹大円環 (キャラ背景で回転)
    showHalo();
    // 7. MIRACLEテロップ (早めに出して存在感)
    setTimeout(() => showMiracle(), 80);
    // 8. 5連波紋 (0.15秒間隔で連射)
    for (let i = 0; i < 5; i++) {
      setTimeout(() => showRing(), i * 160);
    }
    // 9. fanfareを2重ね (片方を少し遅延)
    play("se-fanfare");
    setTimeout(() => play("se-fanfare"), 180);
    // 10. 強flash + 3連シェイク
    flash("hard");
    stage.classList.add("shake");
    setTimeout(() => stage.classList.remove("shake"), 400);
    setTimeout(() => stage.classList.add("shake"), 600);
    setTimeout(() => stage.classList.remove("shake"), 1000);
    setTimeout(() => stage.classList.add("shake"), 1200);
    setTimeout(() => stage.classList.remove("shake"), 1600);
    // 11. 軽いズームイン (画面全体が中央に寄る)
    stage.classList.add("zoom-in");
    setTimeout(() => stage.classList.remove("zoom-in"), 600);
    // (確率ポップは演出中不要のため非表示)
    await sleep(500);
  } else if (tier === "SSR") {
    // 金色ゴッドレイ + 金噴水 + 2重波紋 + fanfare + シェイク
    showGodRays(false, 3500);
    showFountain(["#ffd96a", "#ffb347", "#fff6c0"], 45, 2800);
    showRing();
    setTimeout(() => showRing(), 220);
    play("se-fanfare");
    flash("mid");
    stage.classList.add("shake");
    setTimeout(() => stage.classList.remove("shake"), 350);
    await sleep(250);
  }

  return finalize(result);
}

async function finalize(result) {
  const isHigh = result.tier === "UR" || result.tier === "SSR";
  revealChar(result);
  // キャラ名プレートを少し遅れて (burst-inとタイミング合わせる)
  await sleep(isHigh ? 550 : 300);
  showCharName(result);
  // 獲得テロップ
  if (result.tier === "UR") {
    await sleep(300);
    showWin("UR");
  } else if (result.tier === "SSR") {
    await sleep(200);
    showWin("SSR");
  }
  // 余韻: SSR/URは表示しっぱなし→キー押下で進行
  if (isHigh) {
    // 最低限の余韻は確保（テロップ類が落ち着くまで）
    await sleep(result.tier === "UR" ? 1400 : 1000);
    showContinueHint();
    await waitForKey();
  } else {
    await sleep(900);
  }
}

// ────────────── Public: single / ten ──────────────
let busy = false;

async function doSingle() {
  if (busy) return;
  busy = true;
  skipRequested = false;  // 開始時リセット
  const result = rollOne();
  applyPull(result);
  stage.classList.add("active");
  clearStage();
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  await summonOne(result);
  closeStage();
  busy = false;
}

async function doTen() {
  if (busy) return;
  busy = true;
  skipRequested = false;  // 開始時リセット
  const results = [];
  for (let i = 0; i < 10; i++) { const r = rollOne(); applyPull(r); results.push(r); }

  // 最高レアの位置を特定
  const order = { R: 0, SR: 1, SSR: 2, UR: 3 };
  let bestIdx = 0;
  for (let i = 1; i < results.length; i++) {
    if (order[results[i].tier] > order[results[bestIdx].tier]) bestIdx = i;
  }
  const best = results[bestIdx];
  const sequenced = [
    ...results.slice(0, bestIdx),
    ...results.slice(bestIdx + 1),
    best,
  ];

  stage.classList.add("active");
  clearStage();
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;

  // 10連イントロ「× 10」
  setStageTier(best.tier);
  showTenIntro();
  play("se-summon");
  await sleep(1100);
  if (checkSkip()) { closeStage(); showResult(results, best); busy = false; return; }

  // 前9体: showLadder=false (昇格演出なし、装飾のみ)
  //   R/SR は自動進行 / SSR/UR はキャラ登場後キー待機
  for (let i = 0; i < sequenced.length - 1; i++) {
    clearStage();
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    await summonOne(sequenced[i], { showLadder: false });
    if (checkSkip() && sequenced[i].tier !== "UR" && sequenced[i].tier !== "SSR") break;
    skipRequested = false;  // 次キャラに持ち越さない
  }

  // 最後の1体（最高レア）: showLadder=true + 段階昇格フル演出
  clearStage();
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  skipRequested = false;  // 前キャラのskipを最終演出に持ち越さない
  await sleep(250);  // 一拍の溜め

  await summonOne(best, {
    showLadder: true,
    forceSlow: order[best.tier] >= 2,
    tenFlag: true,
  });

  closeStage();
  showResult(results, best);
  busy = false;
}

function showResult(results, best) {
  const grid = $("#result-grid");
  grid.innerHTML = "";
  // 最高レアを最後にソート(結果確認しやすい)
  const order = { R: 0, SR: 1, SSR: 2, UR: 3 };
  const sorted = [...results].sort((a, b) => order[a.tier] - order[b.tier]);
  sorted.forEach(r => {
    const c = document.createElement("div");
    c.className = "rcard " + r.tier.toLowerCase();
    c.style.backgroundImage = `url('${r.img}')`;
    if (r.isNew) {
      const nb = document.createElement("div");
      nb.className = "rcard-new";
      nb.textContent = "NEW";
      c.appendChild(nb);
    }
    const nm = document.createElement("div");
    nm.className = "rcard-name"; nm.textContent = r.name;
    c.appendChild(nm);
    grid.appendChild(c);
  });
  const hasUR = results.some(r => r.tier === "UR");
  const hasSSR = results.some(r => r.tier === "SSR");
  const nUR = results.filter(r => r.tier === "UR").length;
  const nSSR = results.filter(r => r.tier === "SSR").length;
  const nNew = results.filter(r => r.isNew).length;
  let title = hasUR ? `🌈 UR ×${nUR} 確定!!` :
              hasSSR ? `✨ SSR ×${nSSR} 獲得!` : "10連結果";
  if (nNew > 0) title += `  /  NEW ×${nNew}`;
  $("#result-title").textContent = title;

  // 希少度表示
  const rar = computeTenRollRarity(results);
  const rarBox = $("#result-rarity");
  rarBox.innerHTML = "";
  const rankEl = document.createElement("div");
  rankEl.className = "rarity-rank rank-" + rar.rankClass;
  rankEl.textContent = "RANK  " + rar.rank;
  rarBox.appendChild(rankEl);
  const lineEl = document.createElement("div");
  lineEl.className = "rarity-line";
  const oneInNStr = rar.oneInN >= 1e6 ? "100万回以上に1回" :
                    rar.oneInN >= 1000 ? `約 ${(rar.oneInN/1000).toFixed(1)} 万回に1回`.replace(/\.0 万/, "万") :
                    `約 ${rar.oneInN.toLocaleString()} 回に1回`;
  lineEl.innerHTML =
    `<span>出現率 <b>${(rar.thisP * 100).toFixed(4)}%</b></span>` +
    `<span class="dot">·</span>` +
    `<span>${oneInNStr}</span>` +
    `<span class="dot">·</span>` +
    `<span>希少度 上位 <b>${(rar.rarerOrEqualProb * 100).toFixed(2)}%</b></span>`;
  rarBox.appendChild(lineEl);

  $("#result").classList.add("active");
  resultOpenedAt = Date.now();
}

function closeResult() {
  $("#result").classList.remove("active");
}

// ────────────── 🎴 Character Gallery ──────────────

function getAllCharactersWithTier() {
  const all = [];
  for (const tier of ["UR", "SSR", "SR", "R"]) {
    for (const c of POOL[tier]) {
      all.push({ ...c, tier });
    }
  }
  return all;
}

function isUnlocked(c) {
  return state.history.some(h => h.name === c.name && h.tier === c.tier);
}

function galleryKey(c) { return c.tier + "_" + c.name; }
function isNewUnlocked(c) {
  if (!isUnlocked(c)) return false;
  return !state.galleryViewed[galleryKey(c)];
}

function openGallery() {
  const grid = $("#gallery-grid");
  grid.innerHTML = "";
  const all = getAllCharactersWithTier();
  const unlockedByTier = { UR: 0, SSR: 0, SR: 0, R: 0 };
  const totalByTier = { UR: POOL.UR.length, SSR: POOL.SSR.length, SR: POOL.SR.length, R: POOL.R.length };
  for (const c of all) {
    const unlocked = isUnlocked(c);
    if (unlocked) unlockedByTier[c.tier]++;
    const card = document.createElement("div");
    card.className = "gallery-card " + c.tier.toLowerCase() + (unlocked ? "" : " locked");
    if (unlocked) {
      card.style.backgroundImage = `url('${c.img}')`;
      card.addEventListener("click", () => showCharDetail(c));
    }
    const tierBadge = document.createElement("div");
    tierBadge.className = "card-tier";
    tierBadge.textContent = c.tier;
    card.appendChild(tierBadge);
    if (unlocked && isNewUnlocked(c)) {
      const newB = document.createElement("div");
      newB.className = "card-new";
      newB.textContent = "NEW";
      card.appendChild(newB);
    }
    if (unlocked) {
      const nm = document.createElement("div");
      nm.className = "card-name";
      nm.textContent = c.name;
      card.appendChild(nm);
    }
    grid.appendChild(card);
  }
  const unlockedTotal = Object.values(unlockedByTier).reduce((a, b) => a + b, 0);
  const total = Object.values(totalByTier).reduce((a, b) => a + b, 0);
  $("#gallery-unlocked-count").textContent = unlockedTotal;
  $("#gallery-total-count").textContent = total;
  $("#gallery-ur-count").textContent = `${unlockedByTier.UR}/${totalByTier.UR}`;
  $("#gallery-ssr-count").textContent = `${unlockedByTier.SSR}/${totalByTier.SSR}`;
  $("#gallery-sr-count").textContent = `${unlockedByTier.SR}/${totalByTier.SR}`;
  $("#gallery-r-count").textContent = `${unlockedByTier.R}/${totalByTier.R}`;
  $("#gallery").classList.add("active");
}

function closeGallery() {
  $("#gallery").classList.remove("active");
}

function showCharDetail(c) {
  $("#char-detail-img").src = c.img;
  $("#char-detail-img").alt = c.name;
  const tierEl = $("#char-detail-tier");
  tierEl.textContent = c.tier;
  tierEl.className = "char-detail-tier " + c.tier.toLowerCase();
  $("#char-detail-name").textContent = c.name;
  $("#char-detail-title").textContent = c.title || "";
  $("#char-detail-title").style.display = c.title ? "" : "none";
  const cap = c.caption ? "「" + c.caption + "」" : "";
  $("#char-detail-caption").textContent = cap;
  $("#char-detail-caption").style.display = cap ? "" : "none";
  const desc = c.desc || "（ストーリーはまだ記されていない…）";
  $("#char-detail-desc").textContent = desc;
  $("#char-detail").classList.add("active");
  // 閲覧マーク(NEWを消す)
  state.galleryViewed[galleryKey(c)] = true;
  saveState();
}

function closeCharDetail() {
  $("#char-detail").classList.remove("active");
}

// ────────────── Bindings ──────────────
$("#btn-single").addEventListener("click", doSingle);
$("#btn-ten").addEventListener("click", doTen);
$("#btn-god").addEventListener("click", () => { state.god = !state.god; saveState(); updateHUD(); });
$("#btn-reset").addEventListener("click", () => {
  if (!confirm("累計・履歴をリセットしますか?")) return;
  Object.assign(state, { total:0, ur:0, pity:0, history:[] });
  saveState(); updateHUD();
});
$("#result-close").addEventListener("click", closeResult);
$("#result").addEventListener("click", e => { if (e.target.id === "result") closeResult(); });
$("#btn-gallery").addEventListener("click", openGallery);
$("#gallery").addEventListener("click", e => { if (e.target.id === "gallery") closeGallery(); });
$("#char-detail").addEventListener("click", e => { if (e.target.id === "char-detail") closeCharDetail(); });

document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  // キャラ詳細 > 図鑑 > 結果 > ステージ の優先順で Esc処理
  if ($("#char-detail").classList.contains("active")) {
    if (e.key === "Escape") { e.preventDefault(); closeCharDetail(); }
    return;
  }
  if ($("#gallery").classList.contains("active")) {
    if (e.key === "Escape") { e.preventDefault(); closeGallery(); }
    return;
  }
  if (stage.classList.contains("active") && (e.key === " " || e.key === "Escape")) {
    e.preventDefault(); skipRequested = true; return;
  }
  if ($("#result").classList.contains("active")) {
    if (Date.now() - resultOpenedAt < RESULT_KEY_GUARD_MS) return;
    if (e.key === "Enter" || e.key === "Escape") { e.preventDefault(); closeResult(); }
    return;
  }
  if (busy) return;
  if (e.key === " ") { e.preventDefault(); doSingle(); }
  else if (e.key === "Enter") { e.preventDefault(); doTen(); }
  else if (e.key === "s" || e.key === "S") { state.god = !state.god; saveState(); updateHUD(); }
  else if (e.key === "g" || e.key === "G") { e.preventDefault(); openGallery(); }
});

// Init
updateHUD();
