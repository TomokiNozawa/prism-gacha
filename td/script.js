/* ============================================================
   Prism Defense — Tower Defense for 虹霊界
   ============================================================
   世界観:
     虹霊界(こうれいかい)の中心にある「原虹(げんこう)」の光が、
     闇の裂け目から現れた「影喰い(シェイドーヴァ)」に喰われはじめた。
     五大国と独立勢力の戦士たちが結集し、影を押し戻す。

     プレイヤーは「司配(しはい)」と呼ばれる戦士の指揮官。
     原虹の祭壇を守り、影喰いを祓え。
   ============================================================ */
"use strict";

// ─────────────────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────────────────
const COLS = 3;
const ROWS = 6;
const IMG_BASE = "../images/characters/season1";

const BASE_HP = 3;
const START_RESOURCE = 250;
const RESOURCE_REGEN = 5.2; // per second
const DEPLOY_COOLDOWN = 5500; // ms before same unit can be redeployed
const UNIT_DEPLOY_ROWS_ALLOWED = [0, 1, 2, 3, 4, 5]; // all rows

// ─────────────────────────────────────────────────────────────
//  Factions (lore)
// ─────────────────────────────────────────────────────────────
const FACTIONS = {
  kohou:   { name: "紅翼皇家",   color: "#ff6b6b", blurb: "虹霊界東方の皇家。桜花と剣舞の国。" },
  ginsou:  { name: "銀霜王国",   color: "#b0d4ff", blurb: "北方の銀鎧の国。沈黙の盾を重んじる。" },
  shiryu:  { name: "紫竜王国",   color: "#c36dff", blurb: "南方の竜人の国。誇り高き王族。" },
  getsuga: { name: "月牙狼族",   color: "#d0d0d0", blurb: "西方の獣人氏族。群れを命と同じに扱う。" },
  shinryoku:{ name: "深緑樹海",  color: "#6ef3c0", blurb: "エルフと精霊の森。千年樹の守り手。" },
  yaen:    { name: "夜焔郷",     color: "#ff8c3b", blurb: "夜の花街。遊芸と暗殺が隣り合う。" },
  kokuyou: { name: "黒曜塔",     color: "#7a5dff", blurb: "禁書庫の魔導塔。召喚師の学府。" },
  hakuen:  { name: "白焔教会",   color: "#ffeb8c", blurb: "治癒と聖光の教団。原虹を祀る。" },
  seigyou: { name: "星暁峰",     color: "#ffd35c", blurb: "東の霊峰。龍人の修行の地。" },
  kokyou:  { name: "虚境",       color: "#9e8cff", blurb: "星海の彼方に在る観測者の領域。" },
  dainana: { name: "第七天",     color: "#ff9e3b", blurb: "炎の女神帝が統べる最高天。" },
  amagumo: { name: "天の雲",     color: "#e0f2ff", blurb: "原虹の真上にある天使の都。" },
  tsukigami:{ name: "月影宮",    color: "#c9a2ff", blurb: "最古の賢者が住まう月夜の宮殿。" },
  seireig: { name: "星霊学院",   color: "#7cc4ff", blurb: "若き戦士を育てる見習いの学び舎。" },
  origin:  { name: "原虹",       color: "#ff5eab", blurb: "全ての光の源。世界の中心。" },
};

// ─────────────────────────────────────────────────────────────
//  Units (30 warriors, stat + lore)
// ─────────────────────────────────────────────────────────────
/*
 role:
   melee   - 近接 (range 1, target nearest in same column 0-1 above)
   ranged  - 射撃 (target nearest in same column within range)
   mage    - 魔法 (same column, full length, slower)
   aoe     - 範囲攻撃 (damage splash)
   burst   - 超強力近接AoE (one column 2-tile)
   line    - 縦一列攻撃 (hit all in same column within range)
   heal    - 回復 (heal lowest-HP ally nearby)
   buff    - バフ (周囲unitのATK+%)
   tank    - 盾 (high HP, low atk)
   nuke    - LR専用 (全画面)
 img: file path under IMG_BASE
 atkColMode: 'single'(col only) | 'splash'(3 cols) | 'line'(all rows in col)
 proj: 'arrow'|'magic'|'fire'|'ice'|'holy'|'prism' (visual only)
 aoeRadius: cells (for 'aoe' role)
*/
const UNITS = [
  // ─── LR (1) ───
  {
    id: "prisma", tier: "LR", name: "虹意 プリズマ", title: "原虹の意志・唯一の伝説",
    faction: "origin", img: `${IMG_BASE}/lr/prisma.png`,
    cost: 1200, hp: 300, atk: 80, range: 6, atkInterval: 800,
    role: "line", atkColMode: "line", proj: "prism",
    quote: "我は光の源。終わりにして、始まり。",
    skill: "【原虹解放】 縦一列の全敵に虹光斬を貫通させる。回避不能。",
    desc: "原虹の最初の光から生まれた自意識。性別という概念の外にいる、虹霊界そのものの『人格』。影喰いの誕生は、この存在の無意識下の『迷い』から生じたとも語られる。",
    rel: "セラフィエルは体の一部、カグヤは最古の記憶の番人、他の全ての戦士は『プリズマの指先』と呼ばれる。",
  },

  // ─── UR (5) ───
  {
    id: "seraph", tier: "UR", name: "セラフィエル", title: "至天の聖騎士",
    faction: "amagumo", img: `${IMG_BASE}/ur/seraph_paladin.png`,
    cost: 520, hp: 160, atk: 32, range: 2, atkInterval: 1000,
    role: "aoe", atkColMode: "splash", proj: "holy", aoeRadius: 1.1,
    quote: "貴方の祈り、我が光となる。",
    skill: "【聖光】 着弾点の周囲1マスに聖光波。影系には +30% 追加ダメージ。",
    desc: "原虹の中心で生まれた六翼の天使。ハルバード『虹天』は原虹の結晶そのもの。世界が闇に呑まれる時のみ顕現する神霊だが、今は司配の直属として地上に留まる。",
    rel: "プリズマの分身とも言われる。カグヤとは古くからの友人で、互いに名を呼ぶのは彼女だけ。イザベルは地上における『代理』と認めている。",
  },
  {
    id: "dragon", tier: "UR", name: "龍帝 アルテミス", title: "虹霊界の覇王",
    faction: "seigyou", img: `${IMG_BASE}/ur/dragon_emperor.png`,
    cost: 560, hp: 200, atk: 48, range: 1, atkInterval: 950,
    role: "burst", atkColMode: "splash", proj: null, aoeRadius: 1.0,
    quote: "我が背の龍が、世界の終わりを告げる。",
    skill: "【双剣陰陽】 近接1マスを強烈に切り裂き、隣接する左右の敵にも80%のダメージ。",
    desc: "星暁峰で千年修行した竜人の皇帝。背の龍影は竜魂の実体化。双大剣『陰陽』は光と闇を同時に振るう。虹霊界十国すべてが彼に頭を垂れる。",
    rel: "紫竜王国のヴィルは遠縁(竜の血を分ける)。ピンク竜人リリムを『小さき妹』と呼び可愛がる。ヒノオウとは戦友。",
  },
  {
    id: "nox", tier: "UR", name: "星海のノクス", title: "虚空の星辰魔女",
    faction: "kokyou", img: `${IMG_BASE}/ur/cosmic_witch.png`,
    cost: 540, hp: 95, atk: 38, range: 8, atkInterval: 1200,
    role: "mage", atkColMode: "single", proj: "magic",
    quote: "宇宙は私の中にある。貴方も、この瞬間も。",
    skill: "【虚境の星杖】 全列を貫く超長射程。射線上の敵の弱点を見抜き、常に10%のクリ率で2倍ダメージ。",
    desc: "人か神かも定かではない謎の魔女。髪には銀河を、従者に惑星を宿す。星杖『虚境』で時間と因果を織る。影喰いとの初戦で世界を救った伝説の存在。",
    rel: "黒曜塔の最古の卒業生。カグヤ、セラフィエルと並ぶ『観測者の三姉妹』の一角。ノアの憧れの師。",
  },
  {
    id: "kaguya", tier: "UR", name: "千夜姫 カグヤ", title: "虹霊界最古の賢者",
    faction: "tsukigami", img: `${IMG_BASE}/ur/ancient_sage.png`,
    cost: 550, hp: 120, atk: 42, range: 3, atkInterval: 1500,
    role: "aoe", atkColMode: "splash", proj: "magic", aoeRadius: 1.5,
    quote: "幼く見えるか？ うむ、千年やっとるでな。",
    skill: "【月影圏】 着弾点を中心に広範囲AoE。影喰いの霊体に25%追加ダメージ。",
    desc: "原虹誕生より前から在る月の化身。小柄な少女の姿で顕現しているが実齢は計り知れぬ。九尾の天狐を従え、杖『月影』に全魔術の原典を宿す。",
    rel: "プリズマの記憶の番人。九尾の朱音とは遠い血縁。セラフィエル、ノクスと『観測者の三姉妹』と呼ばれる。",
  },
  {
    id: "hinoou", tier: "UR", name: "焔帝 ヒノオウ", title: "虹霊界第七天の女神帝",
    faction: "dainana", img: `${IMG_BASE}/ur/flame_empress.png`,
    cost: 580, hp: 150, atk: 40, range: 5, atkInterval: 1000,
    role: "line", atkColMode: "line", proj: "fire",
    quote: "すべての闇を、この火で照らしてやろう。",
    skill: "【日輪月輪】 双大剣から朱鳳が発射され、同じ列の敵全員を貫通して燃やす。",
    desc: "七天の最高天を統べる炎の女神帝。背に巨大な朱の鳳凰を従える戦闘神。焔と虹を同時に纏う稀有な存在。影喰いとの戦いでは常に前衛に立つ。",
    rel: "龍帝アルテミスとは戦友。焔舞ヒナカを『愛弟子』として認めている。朱音の焔術の源流を辿ると彼女に繋がる。",
  },

  // ─── SSR (8) ───
  {
    id: "rinae", tier: "SSR", name: "森の射手 リナエ", title: "深緑樹海の守り手",
    faction: "shinryoku", img: `${IMG_BASE}/ssr/elf_archer.png`,
    cost: 280, hp: 50, atk: 20, range: 6, atkInterval: 900,
    role: "ranged", atkColMode: "single", proj: "arrow",
    quote: "葉音が消えた瞬間、狙いは定まっている。",
    skill: "【祖木の弓】 超長射程。矢は外さない。",
    desc: "エルフ狩人氏族の末裔。樹齢千年の祖木から作られた『生きた弓』の継承者。葉擦れだけで敵の位置を読む。樹海の異変をいち早く察知する斥候。",
    rel: "深緑樹海からの斥候として派遣された。ヴィオラは混血エルフの後輩で弓の弟子。影刃シンとは互いに『一番目の斥候』の座を競う。",
  },
  {
    id: "garud", tier: "SSR", name: "獣牙 ガルド", title: "月牙狼族の戦士団長",
    faction: "getsuga", img: `${IMG_BASE}/ssr/wolf_warrior.png`,
    cost: 300, hp: 95, atk: 22, range: 1, atkInterval: 1100,
    role: "burst", atkColMode: "splash", proj: null, aoeRadius: 1.0,
    quote: "群れのために斧を振るう。それだけだ。",
    skill: "【月牙一閃】 目の前と左右の影を一度に薙ぎ払う。",
    desc: "狼獣人の誇り高き戦士族。両手斧『月牙』は代々の団長が受け継ぐ英雄の遺物。寡黙で粗野に見えて、仲間のためには命を惜しまない。",
    rel: "月牙狼族の若き団長。紫竜ヴィルとは以前、領地問題で斬り合った仲だが今は背中を預ける戦友。",
  },
  {
    id: "vil", tier: "SSR", name: "竜爵 ヴィル", title: "紫竜王国の第三王女",
    faction: "shiryu", img: `${IMG_BASE}/ssr/draco_lancer.png`,
    cost: 290, hp: 78, atk: 24, range: 1, atkInterval: 1000,
    role: "burst", atkColMode: "splash", proj: null, aoeRadius: 1.0,
    quote: "竜の血を甘く見るな、死ぬぞ。",
    skill: "【紫雷の三叉】 三叉槍から紫電を放ち、隣接3マスの敵を感電させる。",
    desc: "紫竜王の三女にして、生まれながらの竜人。三叉槍『紫雷』は彼女自身の竜気を解放する。王位継承権を弟に譲り、戦場を己の居場所と決めた。",
    rel: "龍帝アルテミスとは遠縁(竜の血筋)。リリムは実の従妹で、ヴィルを姉のように慕う。",
  },
  {
    id: "shion", tier: "SSR", name: "仮面騎士 シオン", title: "銀霜王国の沈黙の盾",
    faction: "ginsou", img: `${IMG_BASE}/ssr/masked_knight.png`,
    cost: 250, hp: 200, atk: 5, range: 1, atkInterval: 1400,
    role: "tank", atkColMode: "single", proj: null,
    quote: "騎士に名は要らぬ。仮面と誓いがあれば。",
    skill: "【誓盾】 極めて高いHP。影喰いの侵攻を身体で止める壁。",
    desc: "素顔も声も伏せた謎の聖騎士。王族暗殺の陰謀から主君を守るため、名と顔を捨てた。盾『誓盾』とメイス『裁罰』は神器級。",
    rel: "仮面の下の素顔を知る者は三人だけ(王族、イザベル、そしてセラフィエル)。イザベルとは古い幼馴染。",
  },
  {
    id: "noa", tier: "SSR", name: "黒猫 ノア", title: "黒曜塔の若き司書官",
    faction: "kokuyou", img: `${IMG_BASE}/ssr/cat_librarian.png`,
    cost: 290, hp: 55, atk: 16, range: 4, atkInterval: 580,
    role: "mage", atkColMode: "single", proj: "magic",
    quote: "本なら任せて♪ 読むのも書くのも、ぶっ壊すのも。",
    skill: "【夜導召喚】 浮遊魔導書から短い詠唱で魔弾を連射。",
    desc: "黒曜塔の禁書庫を預かる猫獣人の天才。浮遊魔導書『夜導』で召喚魔術を操る。自由奔放で人懐っこいが、禁書の扱いだけは絶対に譲らない。",
    rel: "ノクスを憧れ、論文を投稿しては『まだ甘い』と返されるのを楽しんでいる。こはねは同じ獣人として妹分。",
  },
  {
    id: "akane", tier: "SSR", name: "朱音", title: "夜焔郷の遊芸師",
    faction: "yaen", img: `${IMG_BASE}/ssr/kitsune_lady.png`,
    cost: 310, hp: 55, atk: 18, range: 4, atkInterval: 1000,
    role: "ranged", atkColMode: "single", proj: "fire",
    quote: "逃げたいなら今のうち。逃げなかったら、もう遅いわ。",
    skill: "【紅月灼火】 扇から灼火の矢。命中した敵は短時間焼け続ける(DoT)。",
    desc: "夜焔郷の花街で一等と謳われる遊芸師。表の顔は舞い手、裏の顔は暗殺者。九尾の黒狐の血を引き、金の扇『紅月』から放つ灼火の術で標的を焼き尽くす。",
    rel: "遠い血縁にカグヤ(九尾の天狐系)がいる。紫竜ヴィルとは酒の飲み仲間。こはねは妹分の狐獣人。",
    dot: { dmg: 4, ticks: 3, interval: 500 },
  },
  {
    id: "isabel", tier: "SSR", name: "イザベル", title: "白焔教会の聖巫騎士",
    faction: "hakuen", img: `${IMG_BASE}/ssr/paladin_lady.png`,
    cost: 330, hp: 90, atk: 16, range: 2, atkInterval: 1100,
    role: "heal", atkColMode: "single", proj: "holy",
    quote: "あなたの傷、すべてこの手で癒してあげる。",
    skill: "【天穹の癒】 攻撃しつつ、2マス以内の味方を一定間隔で回復する。",
    desc: "白焔教会の聖域を守る聖巫騎士。聖槍『天穹』は虹霊界十英雄の一人から受け継がれし神器。癒しの聖光と戦場の剛力を両立する、稀有な『戦う治癒者』。",
    rel: "シオンの幼馴染(素顔を知る三人の一人)。メイリは教会の後輩で彼女を姉と呼ぶ。セラフィエルを『我が神』と仰ぐ。",
    healPulse: { range: 2, amount: 10, interval: 1400 },
  },
  {
    id: "hinata", tier: "SSR", name: "ひなた", title: "皇家の末妹・見習い剣士",
    faction: "kohou", img: `${IMG_BASE}/ssr/little_sister.png`,
    cost: 240, hp: 65, atk: 11, range: 1, atkInterval: 480,
    role: "melee", atkColMode: "single", proj: null,
    quote: "ね、わたしも連れてって！修行したんだから！",
    skill: "【桜散連打】 超高速の小太刀連撃。単体DPS特化。",
    desc: "紅翼皇家の末妹、齢十三。兄姉たちの背を追って剣の道へ。小太刀『桜散』で舞うように戦う。屈託のない笑顔の奥に、家を守る強い意志を秘める。",
    rel: "紅翼ツキは実姉。薫音は紅翼皇家の剣師範。龍帝アルテミスを『おにーさま！』と呼び慕っている(一方的)。",
  },

  // ─── SR (10) ───
  {
    id: "lumina", tier: "SR", name: "ルミナ", title: "銀霜の巫女",
    faction: "ginsou", img: `${IMG_BASE}/sr/silver_girl.png`,
    cost: 140, hp: 40, atk: 7, range: 2, atkInterval: 1100,
    role: "buff", atkColMode: "single", proj: "holy",
    quote: "……みんな、頑張って。わたし、ここにいるから。",
    skill: "【銀霜加護】 周囲2マスの味方の攻撃力が +15%。控えめな姉ポジ。",
    desc: "銀霜王国の雪月神殿の巫女。吹雪の中でも光を絶やさない灯籠のような存在。戦場では後方に立ち、味方の武運を祈る。",
    rel: "シオンの国の巫女。イザベルとは治療の情報交換をする間柄。",
    buff: { range: 2, atkMul: 1.15 },
  },
  {
    id: "kuroha", tier: "SR", name: "黒刃 玄", title: "浪人剣士",
    faction: "kohou", img: `${IMG_BASE}/sr/swordsman.png`,
    cost: 150, hp: 75, atk: 12, range: 1, atkInterval: 880,
    role: "melee", atkColMode: "single", proj: null,
    quote: "斬る。それ以外は知らん。",
    skill: "【鉄の太刀】 安定した近接火力。前線を長く支える。",
    desc: "紅翼皇家から破門された元剣術師範代。今は放浪し、金で依頼を受ける浪人剣士。無口だが、子供と犬には弱い。",
    rel: "ミレイアの剣の師(非公式)。薫音の兄弟子。皇家を追放された原因は、ひなたの兄(長兄)の暗殺未遂に巻き込まれたため。",
  },
  {
    id: "serafi", tier: "SR", name: "セラフィ", title: "白焔教会の見習い魔導士",
    faction: "hakuen", img: `${IMG_BASE}/sr/mage.png`,
    cost: 160, hp: 38, atk: 15, range: 4, atkInterval: 1150,
    role: "mage", atkColMode: "single", proj: "magic",
    quote: "呪文、ちゃんと覚えたんだから……！",
    skill: "【詠唱魔弾】 中射程の魔法弾。安定した魔法DPS。",
    desc: "白焔教会の若き見習い魔導士。名前がセラフィエルに似ていることを気にしているが、同一人物ではない(本人はそれが密かな誇り)。",
    rel: "イザベルの教会の後輩。詠聖ベルとは合唱魔法の相方。いつかセラフィエル様にお会いするのが夢。",
  },
  {
    id: "tsuki", tier: "SR", name: "紅翼 ツキ", title: "紅翼皇家の次姫",
    faction: "kohou", img: `${IMG_BASE}/sr/red_twintail.png`,
    cost: 170, hp: 42, atk: 11, range: 5, atkInterval: 780,
    role: "ranged", atkColMode: "single", proj: "arrow",
    quote: "妹の分まで、ちゃんと守るから。",
    skill: "【紅翼の速射】 速い連射の弓。手数で敵を削る。",
    desc: "紅翼皇家の次女。ひなたの姉で、家を守るのは自分の役目だと自任している。ツインテールは紅翼皇家の女子の伝統装束。",
    rel: "ひなたの実姉(めちゃめちゃ妹を甘やかす)。薫音を『姐さん』と呼び慕う。",
  },
  {
    id: "kanon", tier: "SR", name: "薫音", title: "紅翼皇家の剣師範",
    faction: "kohou", img: `${IMG_BASE}/sr/katana_miko.png`,
    cost: 180, hp: 85, atk: 13, range: 1, atkInterval: 760,
    role: "melee", atkColMode: "single", proj: null,
    quote: "お稽古の時間。さあ、構えなさい。",
    skill: "【剣舞】 軽やかな連続斬り。安定した近接。",
    desc: "紅翼皇家に仕える剣の師範。舞のような太刀筋から『剣舞の薫音』と呼ばれる。清廉で厳しく、弟子思い。",
    rel: "ひなた・ツキの剣の師匠。黒刃玄の妹弟子。プライベートではお酒に弱い(秘密)。",
  },
  {
    id: "lilim", tier: "SR", name: "リリム", title: "紫竜の若竜人",
    faction: "shiryu", img: `${IMG_BASE}/sr/pink_dragon_girl.png`,
    cost: 190, hp: 50, atk: 17, range: 3, atkInterval: 1350,
    role: "aoe", atkColMode: "single", proj: "fire", aoeRadius: 0.7,
    quote: "えへへ、ヴィル姉さまみたいになりたい！",
    skill: "【幼竜の息吹】 ピンクの竜息。着弾点の周囲にも少しダメージ。",
    desc: "紫竜王国の若き竜人。まだ成竜ではないため、竜化は部分的。ピンク色の鱗が特徴の珍しい突然変異種で、本人は少し気にしている。",
    rel: "ヴィルは実の従姉で師匠。龍帝アルテミスを『おじうえ』と呼ぶ(正式には遠縁だが)。",
  },
  {
    id: "meiri", tier: "SR", name: "メイリ", title: "白焔教会の見習い巫女",
    faction: "hakuen", img: `${IMG_BASE}/sr/white_priestess.png`,
    cost: 190, hp: 42, atk: 0, range: 2, atkInterval: 1500,
    role: "heal", atkColMode: "single", proj: "holy",
    quote: "大丈夫、傷はすぐに塞がります……ね？",
    skill: "【治癒の祈り】 攻撃はしないが、一定間隔で2マス以内の味方を回復。",
    desc: "白焔教会の見習い巫女。臆病だが治癒の才能は一級。戦場では後衛に徹する。",
    rel: "イザベルを実の姉のように慕う。セラフィは同期で親友。",
    healPulse: { range: 2, amount: 14, interval: 1500, noAtk: true },
  },
  {
    id: "bell", tier: "SR", name: "詠聖 ベル", title: "白焔教会の歌巫女",
    faction: "hakuen", img: `${IMG_BASE}/sr/songstress.png`,
    cost: 210, hp: 32, atk: 0, range: 0, atkInterval: 2000,
    role: "buff", atkColMode: "single", proj: null,
    quote: "光よ、この戦場に集え。",
    skill: "【聖歌】 場に出ている間、💎虹晶の回復速度を少し上げる。",
    desc: "白焔教会の歌巫女。戦闘能力はないが、彼女の歌声は原虹の波動を増幅させ、戦士たちの力となる。",
    rel: "セラフィと合唱のコンビ。メイリとも仲良し。『三姉妹会』の末っ子的立ち位置。",
    resourceBuff: { rate: 1.0 }, // +1.0 virtual regen while alive
  },
  {
    id: "shin", tier: "SR", name: "影刃 シン", title: "影衆の若頭",
    faction: "yaen", img: `${IMG_BASE}/sr/shadow_ninja.png`,
    cost: 180, hp: 45, atk: 15, range: 1, atkInterval: 540,
    role: "melee", atkColMode: "single", proj: null,
    quote: "一撃、一瞬、一切。",
    skill: "【影衆の短刀】 目にも止まらぬ連続刺突。",
    desc: "夜焔郷の裏側、影衆と呼ばれる情報衆の若頭。朱音とは別組織だが、協力関係にある。",
    rel: "こはねは影衆の妹分(エージェント見習い)。リナエとは情報戦の速さで争う好敵手。",
  },
  {
    id: "hinaka", tier: "SR", name: "焔舞 ヒナカ", title: "第七天の踊り子",
    faction: "dainana", img: `${IMG_BASE}/sr/flame_dancer.png`,
    cost: 200, hp: 42, atk: 11, range: 2, atkInterval: 1150,
    role: "aoe", atkColMode: "splash", proj: "fire", aoeRadius: 1.2,
    quote: "この踊り、あなたの為に。",
    skill: "【焔華舞】 扇の焔が弧を描き、隣接列にも火の粉が飛ぶ。",
    desc: "第七天の祭祀を務める炎の踊り子。ヒノオウの焔術を舞に昇華させた独自の流派を創始した。",
    rel: "焔帝ヒノオウ直属の愛弟子。朱音とは『焔術を競う妹分』として友好関係。",
  },

  // ─── R (6) ───
  {
    id: "chisato", tier: "R", name: "ちさと", title: "星霊学院の剣見習い",
    faction: "seireig", img: `${IMG_BASE}/r/student.png`,
    cost: 60, hp: 50, atk: 6, range: 1, atkInterval: 1000,
    role: "melee", atkColMode: "single", proj: null,
    quote: "こわいけど、がんばるっ！",
    skill: "【学院の剣】 最も廉価な前衛。壁役に。",
    desc: "星霊学院の剣術科一年生。まだ新人だが、勇気だけは一人前。",
    rel: "カイ・こはね・アルス・ミレイアとは同期の『星霊学院四人組＋α』(ミレイアが五人目)。寮では常にカイと押しくらまんじゅう状態。",
  },
  {
    id: "kai", tier: "R", name: "カイ", title: "星霊学院の弓見習い",
    faction: "seireig", img: `${IMG_BASE}/r/boy_scout.png`,
    cost: 70, hp: 24, atk: 7, range: 4, atkInterval: 1000,
    role: "ranged", atkColMode: "single", proj: "arrow",
    quote: "遠くから、です……！",
    skill: "【試作の弓】 安い射撃ユニット。序盤の要。",
    desc: "星霊学院の弓術科。気弱だが目だけはいい。斥候として将来を嘱望されている。",
    rel: "ちさとを密かに想っている。いつかリナエのように森で射ちたい。",
  },
  {
    id: "kohane", tier: "R", name: "こはね", title: "影衆見習い",
    faction: "yaen", img: `${IMG_BASE}/r/fox_girl.png`,
    cost: 80, hp: 30, atk: 9, range: 3, atkInterval: 1450,
    role: "mage", atkColMode: "single", proj: "magic",
    quote: "朱音さまの、足手まといには、なりません！",
    skill: "【狐火】 小さな狐火の魔弾。",
    desc: "夜焔郷の狐獣人の少女。朱音に拾われて影衆見習いとして働いている。実は魔術の才能もある。",
    rel: "朱音を姉のように慕う。ノアとは同じ獣人として姉妹のよう。シンとは先輩後輩。",
  },
  {
    id: "viola", tier: "R", name: "ヴィオラ", title: "半エルフの弓使い",
    faction: "shinryoku", img: `${IMG_BASE}/r/archer.png`,
    cost: 65, hp: 25, atk: 6, range: 5, atkInterval: 1050,
    role: "ranged", atkColMode: "single", proj: "arrow",
    quote: "矢は、外さない。たぶん。",
    skill: "【半エルフの弓】 より長い射程、やや火力控えめ。",
    desc: "深緑樹海の外れに住む半エルフ。純血ではないため、樹海の中では肩身が狭い。戦場でなら実力が認められると信じている。",
    rel: "リナエを憧れの先輩として慕う(リナエは気まぐれに指導してくれる)。",
  },
  {
    id: "arusu", tier: "R", name: "アルス", title: "星霊学院の魔導見習い",
    faction: "seireig", img: `${IMG_BASE}/r/young_mage.png`,
    cost: 80, hp: 28, atk: 10, range: 3, atkInterval: 1450,
    role: "mage", atkColMode: "single", proj: "magic",
    quote: "魔法の本、ちゃんと読んだ！",
    skill: "【初級魔法】 R帯最強の魔法火力。",
    desc: "星霊学院の魔術科首席。眼鏡の奥に秘めた野心は、いつか黒曜塔で学ぶこと。",
    rel: "ノアを憧れの先輩として崇拝。ちさと・カイ・こはねと同期の『四人組』。",
  },
  {
    id: "mireia", tier: "R", name: "ミレイア", title: "星霊学院の剣見習い",
    faction: "seireig", img: `${IMG_BASE}/r/warrior.png`,
    cost: 60, hp: 60, atk: 5, range: 1, atkInterval: 1100,
    role: "melee", atkColMode: "single", proj: null,
    quote: "壁なら、任せて。",
    skill: "【重厚の構え】 R帯で最も硬い前衛。壁役。",
    desc: "星霊学院の剣術科、ちさとの同期で親友。体格は学年一。面倒見がよく、四人組の姉的存在。",
    rel: "ちさとの親友。非公式に黒刃玄から剣を習っている。",
  },
];

// Map for quick id lookup
const UNIT_BY_ID = {};
for (const u of UNITS) UNIT_BY_ID[u.id] = u;

// ─────────────────────────────────────────────────────────────
//  Enemy types
// ─────────────────────────────────────────────────────────────
/*
 speed = cells per second (moving down)
 atk   = damage per hit to unit
 atkInterval = ms between hits when blocked by unit
 hp    = base HP (scaled by stage)
 shape = emoji / letter displayed
 reward = shards per kill
 armor = flat damage reduction
 atkRange = 0 (melee, only blocks & hits unit in same cell) or N (ranged: hunter)
*/
const ENEMY_TYPES = {
  walker: { name:"影歩み", hp:28, atk:5, atkInterval:1000, speed:0.45, shape:"👻", reward:6, armor:0 },
  runner: { name:"影駆け", hp:20, atk:6, atkInterval:900,  speed:1.00, shape:"💨", reward:7, armor:0 },
  brute:  { name:"影巨塊", hp:160, atk:12, atkInterval:1200, speed:0.28, shape:"🧿", reward:22, armor:2 },
  hunter: { name:"影狩人", hp:60, atk:9, atkInterval:1600, speed:0.38, shape:"🏹", reward:14, armor:0, atkRange:2, atkProj:"magic" },
  wraith: { name:"影霊",   hp:90, atk:7, atkInterval:1100, speed:0.32, shape:"🌫", reward:16, armor:3 },
  swarm:  { name:"影群",   hp:10, atk:3, atkInterval:700,  speed:1.15, shape:"🕷", reward:4, armor:0 },
  knight: { name:"影騎士", hp:130, atk:13, atkInterval:1000, speed:0.42, shape:"⚔",  reward:20, armor:2 },
  lord:   { name:"影領公", hp:800, atk:22, atkInterval:1000, speed:0.28, shape:"👹", reward:150, armor:4, boss:true },
  king:   { name:"影帝",   hp:1800, atk:32, atkInterval:900, speed:0.25, shape:"👿", reward:280, armor:5, boss:true },
  origin: { name:"原影",   hp:4800, atk:44, atkInterval:800, speed:0.22, shape:"☠",  reward:500, armor:6, boss:true },
};

// ─────────────────────────────────────────────────────────────
//  Stages (1-30) — rich story and waves
// ─────────────────────────────────────────────────────────────
/*
 Wave spawn format:
   [time_ms, lane(0-2), type]
 time_ms from wave start.
 Use helper gen() to DRY sparse waves.
*/
function wave(spawns) { return { spawns }; }

function lineup(type, count, gap, lane, offset=0) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const l = (lane === "any") ? (i % COLS) : (lane === "alt" ? (i % 2) * 2 : lane);
    arr.push([offset + i * gap, l, type]);
  }
  return arr;
}

function mix(...groups) {
  return [].concat(...groups).sort((a,b) => a[0] - b[0]);
}

const STAGES = [
  // ── 第一章 影の始まり (1-5) ──
  {
    num: 1, chap: "第一章 影の始まり", title: "最初の影",
    story: "虹霊界の辺境、星霊学院の演習場に黒い靄が現れた。学院の新人ちさとたちが、初めて影喰いと対峙する。",
    winStory: "ちさと「やった……倒せたよ、みんな！」カイ「僕、正直チビりそうだった……」新人たちは歓声を上げた。だが、これは始まりに過ぎなかった。",
    baseHp: BASE_HP,
    startRes: 200,
    waves: [
      wave(lineup("walker", 3, 1800, "any", 1000)),
      wave(lineup("walker", 5, 1500, "any", 500)),
    ],
  },
  {
    num: 2, chap: "第一章 影の始まり", title: "影の群れ",
    story: "影喰いは一体ではなかった。学院の警報が鳴り響き、増援が駆けつける。",
    winStory: "ミレイア「前線は、わたしが持つ！」壁役となったミレイアが最後の影を盾で打ち砕いた。",
    baseHp: BASE_HP, startRes: 220,
    waves: [
      wave(mix(
        lineup("walker", 4, 1500, "any", 800),
        lineup("runner", 2, 2000, "any", 3000),
      )),
      wave(mix(
        lineup("walker", 3, 1200, 0, 500),
        lineup("walker", 3, 1200, 2, 500),
        lineup("runner", 3, 1800, "any", 3000),
      )),
    ],
  },
  {
    num: 3, chap: "第一章 影の始まり", title: "深緑からの報せ",
    story: "深緑樹海からリナエの先触れとして、半エルフの斥候ヴィオラが学院に到着。『影喰いは今、五大国の全てに現れています』。",
    winStory: "ヴィオラ「……皆さん、強い。わたしも、もっと強くならないと」リナエ姉さまに報告する顔が、少し誇らしげだった。",
    baseHp: BASE_HP, startRes: 260,
    waves: [
      wave(mix(
        lineup("walker", 4, 1400, "any", 500),
        lineup("runner", 3, 1600, "any", 2500),
      )),
      wave(mix(
        lineup("runner", 4, 1000, "any", 500),
        lineup("walker", 3, 1500, 1, 2000),
      )),
      wave(mix(
        lineup("walker", 2, 1000, 0, 500),
        lineup("walker", 2, 1000, 2, 500),
        lineup("brute", 1, 0, 1, 3500),
        lineup("runner", 3, 1400, "any", 5000),
      )),
    ],
  },
  {
    num: 4, chap: "第一章 影の始まり", title: "夜焔の警鐘",
    story: "夜焔郷からこはねが影衆の見習いとして派遣された。『朱音ねえさまが、まだ来れぬからって……私が繋ぎに！』",
    winStory: "こはね「…ふぅ、間に合いました。朱音ねえさまに、ちゃんと報告できる」",
    baseHp: BASE_HP, startRes: 280,
    waves: [
      wave(mix(
        lineup("walker", 3, 1300, "any", 500),
        lineup("runner", 4, 1200, "any", 3000),
        lineup("brute", 1, 0, 1, 6500),
      )),
      wave(mix(
        lineup("runner", 5, 900, "any", 500),
        lineup("walker", 3, 1500, "any", 4500),
        lineup("brute", 1, 0, 0, 6000),
        lineup("brute", 1, 0, 2, 8000),
      )),
    ],
  },
  {
    num: 5, chap: "第一章 影の始まり", title: "若き星霊たち",
    story: "学院襲撃の首謀者『影の騎士』が現れる。学院の全員で立ち向かえ。",
    winStory: "アルス「やった！騎士級を倒した！」四人組が拳を突き合わせる。薫音師範が静かに頷いた。「……皆、立派になった」",
    baseHp: BASE_HP, startRes: 320, miniBoss: true,
    waves: [
      wave(mix(
        lineup("walker", 4, 1200, "any", 500),
        lineup("runner", 4, 1200, "any", 3500),
      )),
      wave(mix(
        lineup("brute", 2, 3000, "alt", 500),
        lineup("runner", 4, 1000, "any", 2500),
      )),
      wave(mix(
        lineup("walker", 3, 1000, "any", 500),
        lineup("knight", 1, 0, 1, 3000),
        lineup("runner", 4, 1200, "any", 5500),
      )),
    ],
  },

  // ── 第二章 五大国の召集 (6-10) ──
  {
    num: 6, chap: "第二章 五大国の召集", title: "皇家の旗下",
    story: "紅翼皇家が召集令を発した。ひなたとツキ姉妹が駆けつける。桜の花びらと共に、影喰いの狩人型が現れた。",
    winStory: "ツキ「妹の分まで、守ったよ」ひなた「わたしもやったよ！ねえさま、見てた！？」",
    baseHp: BASE_HP, startRes: 340,
    waves: [
      wave(mix(
        lineup("walker", 4, 1200, "any", 500),
        lineup("hunter", 2, 2500, "alt", 3500),
      )),
      wave(mix(
        lineup("runner", 5, 900, "any", 500),
        lineup("hunter", 3, 1800, "any", 4000),
        lineup("brute", 1, 0, 1, 7000),
      )),
    ],
  },
  {
    num: 7, chap: "第二章 五大国の召集", title: "銀霜の盾",
    story: "銀霜王国からシオンとルミナが到着。『盾は音を立てぬが、命は守る』",
    winStory: "シオン「……」ルミナ「シオン様、皆さんを守ってくださってありがとう」無言のまま騎士は頷く。",
    baseHp: BASE_HP, startRes: 360,
    waves: [
      wave(mix(
        lineup("walker", 3, 1300, "any", 500),
        lineup("wraith", 2, 2500, "alt", 3000),
      )),
      wave(mix(
        lineup("runner", 5, 900, "any", 500),
        lineup("wraith", 3, 1600, "any", 4500),
        lineup("brute", 1, 0, 1, 6500),
      )),
      wave(mix(
        lineup("walker", 4, 1000, "any", 500),
        lineup("wraith", 2, 1600, "alt", 3500),
        lineup("knight", 1, 0, 1, 6000),
      )),
    ],
  },
  {
    num: 8, chap: "第二章 五大国の召集", title: "月牙族の参戦",
    story: "西方、月牙狼族からガルドが到着。小さな影がうじゃうじゃと押し寄せてくる。",
    winStory: "ガルド「……群れというものは、こうして潰す」両手斧が闇を切り裂いた。",
    baseHp: BASE_HP, startRes: 380,
    waves: [
      wave(mix(
        lineup("swarm", 10, 400, "any", 500),
        lineup("runner", 4, 1200, "any", 5500),
      )),
      wave(mix(
        lineup("swarm", 12, 350, "any", 500),
        lineup("hunter", 2, 2000, "alt", 5500),
        lineup("brute", 1, 0, 1, 7500),
      )),
    ],
  },
  {
    num: 9, chap: "第二章 五大国の召集", title: "紫竜の威",
    story: "紫竜王国の王女ヴィルと、若竜リリムが参戦。『竜の血を甘く見るな、死ぬぞ』",
    winStory: "リリム「ヴィル姉さま、わたしちゃんと戦えた！」ヴィル「うむ。…稽古は倍だがな」",
    baseHp: BASE_HP, startRes: 420,
    waves: [
      wave(mix(
        lineup("walker", 3, 1100, "any", 500),
        lineup("brute", 3, 3500, "any", 3000),
      )),
      wave(mix(
        lineup("brute", 3, 3000, "any", 500),
        lineup("wraith", 2, 2500, "alt", 5000),
        lineup("runner", 4, 1000, "any", 9000),
      )),
      wave(mix(
        lineup("brute", 2, 3500, "alt", 500),
        lineup("knight", 2, 4000, "alt", 4500),
        lineup("hunter", 3, 1800, "any", 7500),
      )),
    ],
  },
  {
    num: 10, chap: "第二章 五大国の召集", title: "影領公 シャドー公爵",
    story: "大陸の境界に『影領公』が降臨。その背後で、虹霊界の七つの色のうち一つが、完全に消えた。",
    winStory: "影領公の首が地に落ちる。その瞬間、失われていた七色のうち一つがわずかに戻った——薄い紫の光が、夜空に流れた。",
    baseHp: BASE_HP, startRes: 500, boss: true,
    waves: [
      wave(mix(
        lineup("runner", 6, 800, "any", 500),
        lineup("knight", 2, 3500, "alt", 4500),
      )),
      wave(mix(
        lineup("brute", 2, 3000, "alt", 500),
        lineup("wraith", 2, 3000, "alt", 2500),
        lineup("swarm", 12, 400, "any", 6000),
      )),
      wave(mix(
        lineup("lord", 1, 0, 1, 500),
        lineup("swarm", 14, 500, "any", 3000),
        lineup("knight", 2, 3500, "alt", 10000),
      )),
    ],
  },

  // ── 第三章 黒曜塔の秘密 (11-15) ──
  {
    num: 11, chap: "第三章 黒曜塔の秘密", title: "禁書の警告",
    story: "黒曜塔の若き司書官ノアが、禁書の中に影喰い誕生の記述を発見。『原虹の迷い、影として具現す』",
    winStory: "ノア「……この記述、ノクス様に見てもらわないと。でも、なんで禁書に最初から書かれてるんだろ？」",
    baseHp: BASE_HP, startRes: 460,
    waves: [
      wave(mix(
        lineup("hunter", 3, 2000, "any", 500),
        lineup("runner", 5, 900, "any", 3500),
      )),
      wave(mix(
        lineup("wraith", 3, 2200, "any", 500),
        lineup("knight", 2, 3500, "alt", 4500),
        lineup("brute", 1, 0, 1, 8500),
      )),
      wave(mix(
        lineup("swarm", 15, 350, "any", 500),
        lineup("hunter", 3, 1800, "any", 6500),
        lineup("knight", 2, 3500, "alt", 10000),
      )),
    ],
  },
  {
    num: 12, chap: "第三章 黒曜塔の秘密", title: "黒曜塔の異変",
    story: "黒曜塔の地下、禁書の一冊が勝手に開き、影喰いの生成装置と化していた。塔を守れ。",
    winStory: "ノア「……この本、燃やせないし、閉じないし、困った猫だよ。いったん封印しとこ」",
    baseHp: BASE_HP, startRes: 480,
    waves: [
      wave(mix(
        lineup("wraith", 4, 1800, "any", 500),
        lineup("hunter", 3, 2000, "any", 4500),
      )),
      wave(mix(
        lineup("knight", 3, 2800, "any", 500),
        lineup("wraith", 3, 2200, "any", 4500),
      )),
      wave(mix(
        lineup("brute", 3, 3000, "any", 500),
        lineup("swarm", 16, 350, "any", 4500),
        lineup("knight", 2, 3500, "alt", 10500),
      )),
    ],
  },
  {
    num: 13, chap: "第三章 黒曜塔の秘密", title: "月影宮の助言",
    story: "千夜姫カグヤが月影宮から姿を現した。『……千年ぶりじゃ。原虹の迷い、鎮めに参った』",
    winStory: "カグヤ「ふむ。わらわの杖、まだ鈍っておらぬな」天狐たちが戯れる。",
    baseHp: BASE_HP, startRes: 520,
    waves: [
      wave(mix(
        lineup("runner", 6, 800, "any", 500),
        lineup("hunter", 4, 1800, "any", 4500),
        lineup("brute", 2, 3000, "alt", 9000),
      )),
      wave(mix(
        lineup("knight", 3, 2500, "any", 500),
        lineup("wraith", 4, 1800, "any", 4500),
        lineup("swarm", 14, 400, "any", 9000),
      )),
      wave(mix(
        lineup("brute", 3, 2500, "any", 500),
        lineup("hunter", 4, 1500, "any", 4500),
        lineup("knight", 3, 3000, "any", 9500),
      )),
    ],
  },
  {
    num: 14, chap: "第三章 黒曜塔の秘密", title: "白焔の奇跡",
    story: "白焔教会のイザベルと巫女メイリ、ベルが到着。『あなたの傷、すべてこの手で癒してあげる』",
    winStory: "ベルの歌声が戦場に響く。傷ついた戦士たちの体から、淡い虹色の光が滲んだ。",
    baseHp: BASE_HP, startRes: 540,
    waves: [
      wave(mix(
        lineup("wraith", 5, 1500, "any", 500),
        lineup("knight", 3, 2500, "any", 4500),
      )),
      wave(mix(
        lineup("runner", 8, 700, "any", 500),
        lineup("brute", 2, 3000, "alt", 6000),
        lineup("hunter", 4, 1500, "any", 9500),
      )),
      wave(mix(
        lineup("knight", 4, 2500, "any", 500),
        lineup("swarm", 18, 300, "any", 4500),
        lineup("brute", 2, 3500, "alt", 10500),
      )),
    ],
  },
  {
    num: 15, chap: "第三章 黒曜塔の秘密", title: "影蛛の巣",
    story: "黒曜塔地下の禁書室で、巨大な『影蛛(カゲグモ)』の巣が見つかった。虫の群れが地上に溢れる。",
    winStory: "小さな影が全て払われ、塔の地下に静けさが戻る。だが、禁書の奥にはまだ何かが眠っている気配が……",
    baseHp: BASE_HP, startRes: 560, miniBoss: true,
    waves: [
      wave(mix(
        lineup("swarm", 24, 250, "any", 500),
        lineup("knight", 2, 3500, "alt", 7500),
      )),
      wave(mix(
        lineup("swarm", 28, 220, "any", 500),
        lineup("hunter", 4, 1500, "any", 6500),
      )),
      wave(mix(
        lineup("swarm", 20, 250, "any", 500),
        lineup("knight", 3, 2500, "any", 5500),
        lineup("brute", 2, 3500, "alt", 9500),
        lineup("lord", 1, 0, 1, 14000),
      )),
    ],
  },

  // ── 第四章 深淵への道 (16-20) ──
  {
    num: 16, chap: "第四章 深淵への道", title: "星の揺らぎ",
    story: "星海のノクスが虚境から降臨。『……宇宙が、一つ欠けている。原虹の奥深くに、何か』",
    winStory: "ノクス「……見えた、けれど触れられない。もう一度、星杖を研がねば」",
    baseHp: BASE_HP, startRes: 560,
    waves: [
      wave(mix(
        lineup("hunter", 5, 1500, "any", 500),
        lineup("knight", 3, 2800, "any", 5000),
        lineup("brute", 2, 3000, "alt", 10000),
      )),
      wave(mix(
        lineup("wraith", 5, 1500, "any", 500),
        lineup("runner", 8, 700, "any", 5000),
        lineup("knight", 3, 2500, "any", 9500),
      )),
      wave(mix(
        lineup("brute", 3, 2500, "any", 500),
        lineup("knight", 3, 2500, "any", 5500),
        lineup("hunter", 5, 1500, "any", 9500),
      )),
    ],
  },
  {
    num: 17, chap: "第四章 深淵への道", title: "虹光の涸れ",
    story: "原虹の第二の色が失われる。前線は連戦で疲弊。夜焔郷から朱音が到着、戦線を焔で押し返す。",
    winStory: "朱音「あら、思ったよりしぶといのね。でも、火には弱いみたいよ」扇の焔が闇を舐めた。",
    baseHp: BASE_HP, startRes: 580,
    waves: [
      wave(mix(
        lineup("knight", 4, 2500, "any", 500),
        lineup("wraith", 4, 2000, "any", 5500),
        lineup("swarm", 15, 350, "any", 10500),
      )),
      wave(mix(
        lineup("runner", 10, 600, "any", 500),
        lineup("knight", 4, 2500, "any", 7000),
        lineup("brute", 2, 3000, "alt", 12000),
      )),
      wave(mix(
        lineup("hunter", 6, 1200, "any", 500),
        lineup("brute", 3, 2500, "any", 8500),
        lineup("knight", 4, 2500, "any", 12500),
      )),
    ],
  },
  {
    num: 18, chap: "第四章 深淵への道", title: "夜焔の犠牲",
    story: "夜焔郷の花街が影喰いに呑まれた。朱音は歯を噛みしめ『もう、演じるのはやめるわ』と扇を開く。",
    winStory: "朱音「……うちの街、取り戻すからね。覚悟なさいな」金の扇から放たれた焔が夜空を染めた。",
    baseHp: BASE_HP, startRes: 620,
    waves: [
      wave(mix(
        lineup("runner", 12, 550, "any", 500),
        lineup("knight", 4, 2500, "any", 8000),
      )),
      wave(mix(
        lineup("wraith", 6, 1500, "any", 500),
        lineup("brute", 3, 2500, "any", 7500),
        lineup("swarm", 18, 300, "any", 12000),
      )),
      wave(mix(
        lineup("knight", 5, 2000, "any", 500),
        lineup("hunter", 6, 1200, "any", 6500),
        lineup("brute", 3, 2500, "any", 12500),
      )),
    ],
  },
  {
    num: 19, chap: "第四章 深淵への道", title: "天使の羽音",
    story: "天の雲からセラフィエルが降臨。白と虹の翼が戦場に大空の影を落とした。",
    winStory: "セラフィエル「司配よ、君の指揮は、プリズマの意志に届いている」六枚の翼が静かに畳まれた。",
    baseHp: BASE_HP, startRes: 680,
    waves: [
      wave(mix(
        lineup("knight", 5, 2200, "any", 500),
        lineup("wraith", 5, 1800, "any", 6500),
        lineup("brute", 3, 2500, "any", 11000),
      )),
      wave(mix(
        lineup("hunter", 7, 1100, "any", 500),
        lineup("knight", 5, 2000, "any", 8500),
        lineup("brute", 3, 2500, "any", 13500),
      )),
      wave(mix(
        lineup("swarm", 22, 250, "any", 500),
        lineup("knight", 6, 1800, "any", 6500),
        lineup("brute", 3, 2500, "any", 12500),
        lineup("wraith", 4, 2000, "any", 18500),
      )),
    ],
  },
  {
    num: 20, chap: "第四章 深淵への道", title: "影王 シェイド・キング",
    story: "原虹の境界で『影王』が顕現。膨大な影喰いを従え、虹霊界の第三の色を喰らわんとしている。",
    winStory: "影王の体が崩れ落ちる。『…我、は…プリズマの…迷い…』その言葉を残して闇が晴れた。戦士たちは言葉を失った。",
    baseHp: BASE_HP, startRes: 780, boss: true,
    waves: [
      wave(mix(
        lineup("runner", 10, 600, "any", 500),
        lineup("brute", 3, 2500, "any", 7000),
        lineup("knight", 4, 2200, "any", 12000),
      )),
      wave(mix(
        lineup("knight", 6, 1800, "any", 500),
        lineup("hunter", 6, 1200, "any", 6500),
        lineup("wraith", 5, 1800, "any", 12500),
      )),
      wave(mix(
        lineup("king", 1, 0, 1, 500),
        lineup("knight", 4, 2500, "any", 5500),
        lineup("swarm", 24, 250, "any", 11500),
        lineup("brute", 3, 2500, "any", 16500),
      )),
    ],
  },

  // ── 第五章 天界の戦 (21-25) ──
  {
    num: 21, chap: "第五章 天界の戦", title: "第七天への反攻",
    story: "第七天の焔帝ヒノオウが参戦。『我が炎で、影を照らし尽くす』",
    winStory: "ヒノオウ「司配よ、感謝は不要。光は、戦う者のためにあるのだ」朱鳳が夜空に羽ばたいた。",
    baseHp: BASE_HP, startRes: 720,
    waves: [
      wave(mix(
        lineup("knight", 6, 1800, "any", 500),
        lineup("brute", 4, 2200, "any", 7500),
        lineup("wraith", 5, 1800, "any", 13500),
      )),
      wave(mix(
        lineup("runner", 12, 500, "any", 500),
        lineup("knight", 5, 2000, "any", 7500),
        lineup("brute", 4, 2200, "any", 13000),
      )),
      wave(mix(
        lineup("hunter", 8, 1000, "any", 500),
        lineup("knight", 6, 1800, "any", 8500),
        lineup("brute", 4, 2200, "any", 14500),
      )),
    ],
  },
  {
    num: 22, chap: "第五章 天界の戦", title: "焔と虹の誓い",
    story: "ヒノオウがセラフィエルに、戦友として誓いを交わす。『もし、我が焔が虹を喰らえば、お主が斬れ』",
    winStory: "二人の女帝が並び立ち、戦場の闇が一度に晴れた。",
    baseHp: BASE_HP, startRes: 740,
    waves: [
      wave(mix(
        lineup("wraith", 7, 1400, "any", 500),
        lineup("knight", 5, 2000, "any", 7000),
        lineup("brute", 4, 2200, "any", 12500),
      )),
      wave(mix(
        lineup("swarm", 22, 280, "any", 500),
        lineup("knight", 6, 1800, "any", 6500),
        lineup("hunter", 6, 1300, "any", 12500),
      )),
      wave(mix(
        lineup("brute", 5, 2000, "any", 500),
        lineup("knight", 6, 1800, "any", 6000),
        lineup("wraith", 5, 1800, "any", 12500),
      )),
    ],
  },
  {
    num: 23, chap: "第五章 天界の戦", title: "千夜の霧",
    story: "カグヤが月影宮の封印を解き、古い記憶を呼び起こす。『原虹の迷いを、最初に見たのは…わらわじゃった』",
    winStory: "カグヤ「千年前、わらわは気づいておった。だが止められなんだ。今度こそ……」",
    baseHp: BASE_HP, startRes: 780,
    waves: [
      wave(mix(
        lineup("knight", 7, 1500, "any", 500),
        lineup("hunter", 7, 1100, "any", 8000),
        lineup("brute", 4, 2200, "any", 15000),
      )),
      wave(mix(
        lineup("wraith", 8, 1200, "any", 500),
        lineup("knight", 6, 1800, "any", 7500),
        lineup("swarm", 24, 250, "any", 14000),
      )),
      wave(mix(
        lineup("brute", 5, 2000, "any", 500),
        lineup("knight", 7, 1600, "any", 7000),
        lineup("hunter", 7, 1100, "any", 13500),
      )),
    ],
  },
  {
    num: 24, chap: "第五章 天界の戦", title: "龍帝の目覚め",
    story: "星暁峰の龍帝アルテミスが千年の眠りから覚める。『……影よ、遅いぞ。もう一度だけ舞おう』",
    winStory: "龍帝の双大剣が影を両断する。『光と闇、両方振るうのが、覇王というものだ』",
    baseHp: BASE_HP, startRes: 840,
    waves: [
      wave(mix(
        lineup("brute", 5, 2000, "any", 500),
        lineup("knight", 7, 1500, "any", 7500),
        lineup("wraith", 6, 1600, "any", 14500),
      )),
      wave(mix(
        lineup("runner", 14, 450, "any", 500),
        lineup("knight", 6, 1800, "any", 7000),
        lineup("brute", 5, 2000, "any", 13000),
      )),
      wave(mix(
        lineup("hunter", 9, 900, "any", 500),
        lineup("knight", 7, 1600, "any", 9000),
        lineup("brute", 6, 1800, "any", 16500),
      )),
    ],
  },
  {
    num: 25, chap: "第五章 天界の戦", title: "七英の結集",
    story: "五大国の戦士、天界の使者、最古の賢者——全員が集った。だが、原虹の中心から、不穏な鼓動が響いてきた。",
    winStory: "戦士たちは黙した。原虹の内側で、何かが目覚めている。光ではない。影でもない。もっと古い、『始まり』のようなものが——。",
    baseHp: BASE_HP, startRes: 900, miniBoss: true,
    waves: [
      wave(mix(
        lineup("knight", 8, 1300, "any", 500),
        lineup("brute", 5, 2000, "any", 7500),
        lineup("hunter", 7, 1100, "any", 13500),
      )),
      wave(mix(
        lineup("wraith", 8, 1200, "any", 500),
        lineup("knight", 7, 1500, "any", 7500),
        lineup("swarm", 28, 220, "any", 14000),
      )),
      wave(mix(
        lineup("brute", 6, 1800, "any", 500),
        lineup("knight", 8, 1300, "any", 7000),
        lineup("lord", 1, 0, 1, 11500),
        lineup("hunter", 7, 1100, "any", 14500),
      )),
    ],
  },

  // ── 第六章 原虹の咆哮 (26-30) ──
  {
    num: 26, chap: "第六章 原虹の咆哮", title: "原虹の鼓動",
    story: "原虹の結晶が脈打ちはじめた。その内側から、声のような音が漏れる。『……助けて……助けて……』",
    winStory: "戦士たちは首を傾げた。影喰いの声ではない。あれは……もしかして、原虹自身の？",
    baseHp: BASE_HP, startRes: 880,
    waves: [
      wave(mix(
        lineup("knight", 9, 1200, "any", 500),
        lineup("brute", 6, 1800, "any", 7500),
        lineup("hunter", 8, 1000, "any", 14500),
      )),
      wave(mix(
        lineup("runner", 16, 400, "any", 500),
        lineup("knight", 7, 1500, "any", 7500),
        lineup("brute", 6, 1800, "any", 13500),
      )),
      wave(mix(
        lineup("wraith", 10, 1000, "any", 500),
        lineup("knight", 9, 1200, "any", 8000),
        lineup("brute", 6, 1800, "any", 15000),
      )),
    ],
  },
  {
    num: 27, chap: "第六章 原虹の咆哮", title: "記憶の迷宮",
    story: "原虹の中、時空がねじれた迷宮に戦士たちは迷い込む。過去の影喰いと、未来の自分が襲ってきた。",
    winStory: "迷宮を抜けると、プリズマの姿が一瞬だけ見えた。だが、すぐに消えた。『……まだ、だ』",
    baseHp: BASE_HP, startRes: 920,
    waves: [
      wave(mix(
        lineup("brute", 7, 1600, "any", 500),
        lineup("knight", 8, 1300, "any", 7500),
        lineup("wraith", 8, 1200, "any", 14000),
      )),
      wave(mix(
        lineup("knight", 10, 1100, "any", 500),
        lineup("hunter", 9, 900, "any", 7500),
        lineup("brute", 6, 1800, "any", 15000),
      )),
      wave(mix(
        lineup("swarm", 32, 200, "any", 500),
        lineup("knight", 9, 1200, "any", 7500),
        lineup("brute", 7, 1600, "any", 15000),
      )),
    ],
  },
  {
    num: 28, chap: "第六章 原虹の咆哮", title: "最古の賢者",
    story: "原虹の最奥、カグヤだけが知る間に到達。『お主ら、もう少し、耐えてくれ。わらわが最後の封印を解く』",
    winStory: "カグヤ「…解いた。もう戻せぬ。司配よ、ここからは覚悟を決めよ」月の光が、これまでにないほど強く差した。",
    baseHp: BASE_HP, startRes: 960,
    waves: [
      wave(mix(
        lineup("knight", 10, 1100, "any", 500),
        lineup("brute", 7, 1600, "any", 7500),
        lineup("hunter", 9, 900, "any", 14500),
      )),
      wave(mix(
        lineup("wraith", 10, 1000, "any", 500),
        lineup("knight", 10, 1100, "any", 7500),
        lineup("brute", 7, 1600, "any", 15000),
      )),
      wave(mix(
        lineup("brute", 8, 1500, "any", 500),
        lineup("knight", 10, 1100, "any", 8000),
        lineup("hunter", 9, 900, "any", 15000),
      )),
    ],
  },
  {
    num: 29, chap: "第六章 原虹の咆哮", title: "虹意顕現",
    story: "原虹の中心から、虹色の髪を持つ中性的な『何か』が現れた。『……私は、プリズマ。そして、私は——影喰いでもある』",
    winStory: "プリズマが初めて地に降り立った。戦士たちの全員が膝をつき、次なる戦いの覚悟を固めた。",
    baseHp: BASE_HP, startRes: 1100, miniBoss: true,
    waves: [
      wave(mix(
        lineup("knight", 11, 1000, "any", 500),
        lineup("brute", 7, 1600, "any", 7500),
        lineup("hunter", 9, 900, "any", 14000),
      )),
      wave(mix(
        lineup("wraith", 11, 900, "any", 500),
        lineup("knight", 10, 1100, "any", 7500),
        lineup("brute", 8, 1500, "any", 14500),
      )),
      wave(mix(
        lineup("swarm", 36, 180, "any", 500),
        lineup("knight", 11, 1000, "any", 8000),
        lineup("brute", 8, 1500, "any", 15500),
        lineup("lord", 1, 0, 1, 22500),
      )),
    ],
  },
  {
    num: 30, chap: "第六章 原虹の咆哮", title: "原影 シェイド・オリジン",
    story: "ついに真の敵が姿を現す。プリズマの負の側面、忘却されたもう一つの意志——『原影』。世界の終わりが、ここで決まる。",
    winStory: "原影が崩れ落ちる瞬間、プリズマは目を伏せて笑った。『……ありがとう、司配。私の影を、祓ってくれて』虹霊界に、七つの色が、全て、戻った。",
    baseHp: BASE_HP, startRes: 1400, final: true,
    waves: [
      wave(mix(
        lineup("knight", 10, 1100, "any", 500),
        lineup("brute", 8, 1500, "any", 7000),
        lineup("wraith", 10, 1000, "any", 13000),
      )),
      wave(mix(
        lineup("king", 1, 0, 1, 500),
        lineup("knight", 12, 1000, "any", 4500),
        lineup("brute", 8, 1500, "any", 13000),
        lineup("hunter", 10, 850, "any", 20000),
      )),
      wave(mix(
        lineup("origin", 1, 0, 1, 500),
        lineup("knight", 14, 950, "any", 4500),
        lineup("brute", 10, 1400, "any", 13000),
        lineup("wraith", 12, 900, "any", 20000),
        lineup("swarm", 40, 160, "any", 25000),
      )),
    ],
  },
];

// ─────────────────────────────────────────────────────────────
//  State
// ─────────────────────────────────────────────────────────────
const state = {
  screen: "title",
  currentStage: 1,
  deck: [],         // selected unit ids (max 6)
  // battle runtime
  battle: null,
  // persistence
  clearedStages: {},
  totalShards: 0,
  speedMul: 1,
  paused: false,
};

function loadSave() {
  try {
    const raw = JSON.parse(localStorage.getItem("prism-defense") || "{}");
    state.clearedStages = raw.clearedStages || {};
    state.totalShards = raw.totalShards || 0;
    state.deck = raw.deck || [];
  } catch {}
}
function saveSave() {
  localStorage.setItem("prism-defense", JSON.stringify({
    clearedStages: state.clearedStages,
    totalShards: state.totalShards,
    deck: state.deck,
  }));
}

// ─────────────────────────────────────────────────────────────
//  Audio (Web Audio API synth - no external files)
// ─────────────────────────────────────────────────────────────
let audioCtx = null;
let soundEnabled = localStorage.getItem("prism-defense-sound") !== "0";
function getAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {}
  }
  return audioCtx;
}
function playTone(opts) {
  if (!soundEnabled) return;
  const ctx = getAudio();
  if (!ctx) return;
  const { freq = 440, dur = 0.12, type = "sine", vol = 0.08, slide = 0, delay = 0 } = opts;
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(freq + slide, 40), now + dur);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}
function playNoise(opts) {
  if (!soundEnabled) return;
  const ctx = getAudio();
  if (!ctx) return;
  const { dur = 0.12, vol = 0.06, cut = 4000 } = opts;
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * 0.6;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const biq = ctx.createBiquadFilter();
  biq.type = "lowpass";
  biq.frequency.value = cut;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  src.connect(biq).connect(gain).connect(ctx.destination);
  src.start();
}

const SE = {
  tap:        () => playTone({freq: 880, dur: 0.06, type: "triangle", vol: 0.05 }),
  place:      () => { playTone({freq: 440, dur: 0.08, type: "sine", vol: 0.08 }); playTone({freq: 660, dur: 0.1, type: "sine", vol: 0.08, delay: 0.04 }); },
  cant:       () => playTone({freq: 180, dur: 0.12, type: "square", vol: 0.07, slide: -60 }),
  shoot:      () => playTone({freq: 1100, dur: 0.04, type: "square", vol: 0.04 }),
  hit:        () => playNoise({dur: 0.05, vol: 0.06, cut: 3500 }),
  enemyDie:   () => { playTone({freq: 260, dur: 0.14, type: "sawtooth", vol: 0.05, slide: -120 }); playNoise({dur: 0.08, vol: 0.04, cut: 2000 }); },
  unitDie:    () => { playTone({freq: 160, dur: 0.3, type: "triangle", vol: 0.08, slide: -80 }); playNoise({dur: 0.2, vol: 0.05, cut: 1500 }); },
  baseHit:    () => { playTone({freq: 90, dur: 0.35, type: "square", vol: 0.1, slide: -30 }); playNoise({dur: 0.2, vol: 0.08, cut: 600 }); },
  waveStart:  () => { playTone({freq: 440, dur: 0.15, type: "sine", vol: 0.08 }); playTone({freq: 660, dur: 0.15, type: "sine", vol: 0.07, delay: 0.1 }); playTone({freq: 880, dur: 0.2, type: "sine", vol: 0.08, delay: 0.2 }); },
  win:        () => { const notes = [523, 659, 784, 1047]; notes.forEach((f, i) => playTone({freq: f, dur: 0.18, type: "sine", vol: 0.09, delay: i * 0.1 })); },
  lose:       () => { const notes = [523, 440, 370, 294]; notes.forEach((f, i) => playTone({freq: f, dur: 0.22, type: "triangle", vol: 0.09, delay: i * 0.15 })); },
  critical:   () => { playTone({freq: 1320, dur: 0.08, type: "sine", vol: 0.1 }); playTone({freq: 1760, dur: 0.08, type: "sine", vol: 0.08, delay: 0.04 }); },
  heal:       () => { playTone({freq: 780, dur: 0.12, type: "sine", vol: 0.06 }); playTone({freq: 1050, dur: 0.14, type: "sine", vol: 0.06, delay: 0.07 }); },
  boss:       () => { playNoise({dur: 0.5, vol: 0.1, cut: 300 }); playTone({freq: 110, dur: 0.6, type: "sawtooth", vol: 0.1, slide: -40 }); },
};

// ─────────────────────────────────────────────────────────────
//  UI Navigation
// ─────────────────────────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === "screen-" + name));
  state.screen = name;
  SE.tap();
}

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

// ─────────────────────────────────────────────────────────────
//  Render: Stage select
// ─────────────────────────────────────────────────────────────
function renderStageGrid() {
  const grid = $("#stage-grid");
  grid.innerHTML = "";
  let lastCleared = 0;
  for (const n of Object.keys(state.clearedStages)) {
    lastCleared = Math.max(lastCleared, parseInt(n));
  }
  const unlockedUntil = Math.max(1, lastCleared + 1);

  for (const s of STAGES) {
    const card = document.createElement("div");
    card.className = "stage-card";
    const cleared = !!state.clearedStages[s.num];
    const locked = s.num > unlockedUntil;
    if (cleared) card.classList.add("cleared");
    if (s.boss) card.classList.add("boss");
    if (s.final) card.classList.add("final");
    if (locked) card.classList.add("locked");

    card.innerHTML = `
      <div class="stage-num">${s.num}</div>
      <div class="stage-title">${s.title}</div>
      <div class="stage-chap">${s.chap.replace("第", "").replace("章", "").split(" ")[0]}章</div>
    `;

    if (!locked) {
      card.addEventListener("click", () => {
        state.currentStage = s.num;
        openDeckBuilder();
      });
    }
    grid.appendChild(card);
  }

  // Chapter story preview (current next stage)
  const next = STAGES.find(s => !state.clearedStages[s.num]) || STAGES[STAGES.length - 1];
  $("#chap-story").textContent = `『${next.chap}』— ${next.story}`;
}

// ─────────────────────────────────────────────────────────────
//  Render: Deck builder
// ─────────────────────────────────────────────────────────────
let deckTierFilter = "ALL";

function openDeckBuilder() {
  showScreen("deck");
  const stage = STAGES[state.currentStage - 1];
  $("#deck-intro").textContent = `第${stage.num}話 「${stage.title}」 ― 最大6体まで編成できます。タップで選択・解除。`;
  renderUnitGrid();
  renderDeckPreview();
}

function renderUnitGrid() {
  const grid = $("#unit-grid");
  grid.innerHTML = "";
  const tierOrder = { LR: 0, UR: 1, SSR: 2, SR: 3, R: 4 };
  const sorted = UNITS.slice().sort((a,b) => (tierOrder[a.tier] - tierOrder[b.tier]) || (a.cost - b.cost));
  for (const u of sorted) {
    if (deckTierFilter !== "ALL" && u.tier !== deckTierFilter) continue;
    const card = document.createElement("div");
    card.className = `unit-card tier-${u.tier}`;
    if (state.deck.includes(u.id)) card.classList.add("sel");
    card.innerHTML = `
      <div class="tier-stripe tier-${u.tier}"></div>
      <img src="${u.img}" alt="${u.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="uc-body">
        <div class="uc-name">${u.name}</div>
        <div class="uc-role">
          <span>${roleLabel(u.role)}</span>
          <span class="uc-cost">💎${u.cost}</span>
        </div>
      </div>
    `;
    card.addEventListener("click", (e) => {
      // Long-press or tap shows detail; single click toggles selection
      toggleDeck(u.id);
    });
    // Info modal via long press
    let pressTimer = null;
    card.addEventListener("pointerdown", () => {
      pressTimer = setTimeout(() => {
        pressTimer = null;
        openUnitModal(u);
      }, 400);
    });
    card.addEventListener("pointerup", () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } });
    card.addEventListener("pointerleave", () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } });

    grid.appendChild(card);
  }
}

function roleLabel(role) {
  return {
    melee: "近接", ranged: "射手", mage: "魔法", aoe: "範囲",
    burst: "爆斬", line: "貫通", heal: "癒し", buff: "支援",
    tank: "盾", nuke: "極",
  }[role] || role;
}

function toggleDeck(id) {
  const idx = state.deck.indexOf(id);
  if (idx >= 0) {
    state.deck.splice(idx, 1);
    SE.tap();
  } else {
    if (state.deck.length >= 6) {
      SE.cant();
      return;
    }
    state.deck.push(id);
    SE.place();
  }
  saveSave();
  renderUnitGrid();
  renderDeckPreview();
}

function renderDeckPreview() {
  const wrap = $("#deck-preview");
  wrap.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement("div");
    slot.className = "deck-slot";
    const id = state.deck[i];
    if (id) {
      const u = UNIT_BY_ID[id];
      slot.classList.add("filled");
      slot.innerHTML = `<img src="${u.img}"><div class="cost">💎${u.cost}</div>`;
    } else {
      slot.textContent = "+";
    }
    wrap.appendChild(slot);
  }
  $("#deck-current").textContent = state.deck.length;
  $("#btn-battle-start").disabled = state.deck.length === 0;
}

// ─────────────────────────────────────────────────────────────
//  Unit modal
// ─────────────────────────────────────────────────────────────
function openUnitModal(u) {
  $("#um-img").src = u.img;
  $("#um-tier").textContent = u.tier;
  $("#um-tier").className = "um-tier tier-" + u.tier;
  $("#um-name").textContent = u.name;
  $("#um-title").textContent = u.title || "";
  const fac = FACTIONS[u.faction];
  $("#um-faction").textContent = fac ? `所属: ${fac.name} — ${fac.blurb}` : "";
  $("#um-stats").innerHTML = `
    <span class="k">コスト</span><span class="v">💎 ${u.cost}</span>
    <span class="k">HP</span><span class="v">${u.hp}</span>
    <span class="k">攻撃力</span><span class="v">${u.atk}</span>
    <span class="k">射程</span><span class="v">${u.range} マス</span>
    <span class="k">攻撃間隔</span><span class="v">${u.atkInterval} ms</span>
    <span class="k">役割</span><span class="v">${roleLabel(u.role)}</span>
  `;
  $("#um-skill").innerHTML = `<b>${u.skill ? u.skill.split("】")[0] + "】" : "特性"}</b>${u.skill ? u.skill.split("】")[1] || "" : ""}`;
  $("#um-quote").textContent = u.quote ? `「${u.quote}」` : "";
  $("#um-desc").textContent = u.desc || "";
  $("#um-relations").innerHTML = u.rel ? `<b>関係</b> ${u.rel}` : "";
  $("#unit-modal").classList.add("show");
  document.body.classList.add("modal-open");
  SE.tap();
}
function closeUnitModal() {
  $("#unit-modal").classList.remove("show");
  document.body.classList.remove("modal-open");
}

// ─────────────────────────────────────────────────────────────
//  Dex
// ─────────────────────────────────────────────────────────────
function renderDex() {
  const list = $("#dex-list");
  list.innerHTML = "";
  const tierOrder = { LR: 0, UR: 1, SSR: 2, SR: 3, R: 4 };
  const sorted = UNITS.slice().sort((a,b) => (tierOrder[a.tier] - tierOrder[b.tier]) || a.cost - b.cost);
  for (const u of sorted) {
    const card = document.createElement("div");
    card.className = `unit-card tier-${u.tier}`;
    card.innerHTML = `
      <div class="tier-stripe tier-${u.tier}"></div>
      <img src="${u.img}" alt="${u.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="uc-body">
        <div class="uc-name">${u.name}</div>
        <div class="uc-role"><span>${u.title || ""}</span></div>
      </div>
    `;
    card.addEventListener("click", () => openUnitModal(u));
    list.appendChild(card);
  }
}

// ─────────────────────────────────────────────────────────────
//  Battle: Setup
// ─────────────────────────────────────────────────────────────
function startBattle() {
  const stage = STAGES[state.currentStage - 1];
  state.battle = {
    stage,
    baseHp: stage.baseHp || BASE_HP,
    resource: stage.startRes || START_RESOURCE,
    resourceF: 0,
    currentWave: 0,
    waveSpawnIdx: 0,
    waveStartTime: 0,
    waveEndedAt: 0,
    allSpawned: false,
    units: [],
    enemies: [],
    projectiles: [],
    damageNums: [],
    cells: {},        // "col,row" -> unit
    palette: {},      // unitId -> { cooldownUntil }
    selectedUnit: null,
    lastTick: performance.now(),
    elapsed: 0,
    ended: false,
  };
  for (const id of state.deck) {
    state.battle.palette[id] = { cooldownUntil: 0 };
  }

  showScreen("battle");
  renderBattlefield();
  renderPalette();
  renderHUD();
  requestAnimationFrame(gameLoop);

  setTimeout(() => showMsg(`STAGE ${stage.num}`, stage.title, 1400), 100);
  setTimeout(() => startNextWave(), 1600);

  // First-time tutorial
  if (stage.num === 1 && !localStorage.getItem("prism-defense-tut")) {
    setTimeout(() => {
      const t = $("#tutorial-hint");
      t.innerHTML = `<b>操作</b>: 下の戦士カードをタップ → マスをタップで配置。<br>💎虹晶は時間で回復＋敵撃破で獲得。`;
      t.classList.add("show");
      setTimeout(() => {
        t.classList.remove("show");
        localStorage.setItem("prism-defense-tut", "1");
      }, 7500);
    }, 1800);
  }
}

function renderBattlefield() {
  const bf = $("#battlefield");
  bf.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.col = c;
      cell.dataset.row = r;
      cell.addEventListener("click", () => onCellClick(c, r));
      bf.appendChild(cell);
    }
  }
  // Compute layout-dependent offsets
  requestAnimationFrame(() => updateLayoutCache());
}

function updateLayoutCache() {
  const b = state.battle;
  if (!b) return;
  const bf = $("#battlefield");
  const fx = $("#battle-fx");
  const c = bf.querySelector(".cell");
  if (!c) return;
  const rect = c.getBoundingClientRect();
  const bfRect = bf.getBoundingClientRect();
  const fxRect = fx.getBoundingClientRect();
  b.cellW = rect.width;
  b.cellH = rect.height;
  b.bfOffsetX = bfRect.left - fxRect.left + 3;  // 3 = battlefield padding
  b.bfOffsetY = bfRect.top - fxRect.top + 3;
  bf.style.setProperty("--cell-w", rect.width + "px");
}

function renderPalette() {
  const pal = $("#palette");
  pal.innerHTML = "";
  for (const id of state.deck) {
    const u = UNIT_BY_ID[id];
    const btn = document.createElement("button");
    btn.className = `pal-btn tier-${u.tier}`;
    btn.dataset.id = id;
    btn.innerHTML = `
      <div class="tier-stripe tier-${u.tier}"></div>
      <img src="${u.img}" alt="${u.name}">
      <div class="pal-cd"></div>
      <div class="pal-cost">💎${u.cost}</div>
    `;
    btn.addEventListener("click", () => selectUnit(id));
    pal.appendChild(btn);
  }
}

function selectUnit(id) {
  const b = state.battle;
  if (b.selectedUnit === id) {
    b.selectedUnit = null;
    SE.tap();
  } else {
    // Check if deployable
    const u = UNIT_BY_ID[id];
    const pal = b.palette[id];
    if (pal.cooldownUntil > b.elapsed) {
      SE.cant();
      return;
    }
    if (b.resource < u.cost) {
      SE.cant();
      return;
    }
    b.selectedUnit = id;
    SE.tap();
  }
  updateSelectionUI();
}

function updateSelectionUI() {
  const b = state.battle;
  $$(".pal-btn").forEach(btn => {
    btn.classList.toggle("sel", btn.dataset.id === b.selectedUnit);
  });
  // Placeable cells
  $$(".cell").forEach(cell => {
    cell.classList.remove("placeable", "pulse");
    if (b.selectedUnit) {
      const c = +cell.dataset.col;
      const r = +cell.dataset.row;
      const key = `${c},${r}`;
      if (!b.cells[key] && UNIT_DEPLOY_ROWS_ALLOWED.includes(r)) {
        cell.classList.add("placeable", "pulse");
      }
    }
  });
}

function onCellClick(c, r) {
  const b = state.battle;
  if (!b.selectedUnit) return;
  const key = `${c},${r}`;
  if (b.cells[key]) return;
  if (!UNIT_DEPLOY_ROWS_ALLOWED.includes(r)) return;
  const u = UNIT_BY_ID[b.selectedUnit];
  if (b.resource < u.cost) { SE.cant(); return; }

  b.resource -= u.cost;
  b.palette[u.id].cooldownUntil = b.elapsed + DEPLOY_COOLDOWN;
  const unit = {
    id: u.id, def: u, col: c, row: r, hp: u.hp, cd: 400,
    lastHealPulse: 0, atkState: 0,
  };
  b.cells[key] = unit;
  b.units.push(unit);
  renderUnitInCell(unit);
  b.selectedUnit = null;
  updateSelectionUI();
  renderHUD();
  renderPaletteState();
  SE.place();
}

function renderUnitInCell(unit) {
  const bf = $("#battlefield");
  const cell = bf.querySelector(`.cell[data-col="${unit.col}"][data-row="${unit.row}"]`);
  if (!cell) return;
  const el = document.createElement("div");
  el.className = `unit tier-${unit.def.tier}`;
  el.dataset.uid = unit.id + "_" + unit.col + "_" + unit.row;
  el.style.color = unit.def.tier === "UR" ? "#ff8cf0"
                 : unit.def.tier === "LR" ? "#ff5eab"
                 : unit.def.tier === "SSR" ? "#ffd35c"
                 : unit.def.tier === "SR" ? "#c9a2ff" : "#7cc4ff";
  el.innerHTML = `
    <img class="u-img" src="${unit.def.img}">
    <div class="u-hp"><div class="u-hp-fill" style="width:100%"></div></div>
    <div class="u-cd"></div>
  `;
  cell.appendChild(el);
  unit.el = el;
}

function renderHUD() {
  const b = state.battle;
  const s = b.stage;
  $("#hud-stage").textContent = s.num;
  $("#hud-wave").textContent = b.currentWave;
  $("#hud-wave-total").textContent = s.waves.length;
  $("#hud-res").textContent = Math.floor(b.resource);
  const hearts = $$(".hud-hp .heart");
  hearts.forEach((h, i) => {
    h.classList.toggle("lost", i >= b.baseHp);
  });
  // Boss HP
  const boss = b.enemies.find(e => e.isBoss);
  const bossWrap = $("#boss-hp-wrap");
  if (boss) {
    bossWrap.classList.add("show");
    $("#boss-hp-label").textContent = boss.def.name.toUpperCase();
    $("#boss-hp-fill").style.width = `${Math.max(0, (boss.hp / boss.maxHp) * 100)}%`;
  } else {
    bossWrap.classList.remove("show");
  }
}

function renderPaletteState() {
  const b = state.battle;
  $$(".pal-btn").forEach(btn => {
    const id = btn.dataset.id;
    const u = UNIT_BY_ID[id];
    const pal = b.palette[id];
    const onCd = pal.cooldownUntil > b.elapsed;
    const affordable = b.resource >= u.cost;
    btn.classList.toggle("cd", onCd);
    btn.classList.toggle("disabled", !affordable && !onCd);
    if (onCd) {
      const rem = Math.ceil((pal.cooldownUntil - b.elapsed) / 1000);
      btn.querySelector(".pal-cd").textContent = rem;
    }
  });
}

// ─────────────────────────────────────────────────────────────
//  Battle: Waves
// ─────────────────────────────────────────────────────────────
function startNextWave() {
  const b = state.battle;
  if (b.currentWave >= b.stage.waves.length) return;
  b.currentWave++;
  b.waveSpawnIdx = 0;
  b.waveStartTime = b.elapsed;
  b.allSpawned = false;
  renderHUD();
  showMsg(`WAVE ${b.currentWave}`, "", 900);
  SE.waveStart();
}

function updateWaveSpawn() {
  const b = state.battle;
  if (b.ended) return;
  if (b.currentWave === 0) return;
  const wave = b.stage.waves[b.currentWave - 1];
  const since = b.elapsed - b.waveStartTime;
  while (b.waveSpawnIdx < wave.spawns.length) {
    const [t, lane, type] = wave.spawns[b.waveSpawnIdx];
    if (t > since) break;
    spawnEnemy(type, lane);
    b.waveSpawnIdx++;
  }
  if (b.waveSpawnIdx >= wave.spawns.length) b.allSpawned = true;

  // Check wave cleared
  if (b.allSpawned && b.enemies.length === 0) {
    if (b.currentWave < b.stage.waves.length) {
      if (!b.waveEndedAt) {
        b.waveEndedAt = b.elapsed;
      }
      if (b.elapsed - b.waveEndedAt > 2500) {
        b.waveEndedAt = 0;
        startNextWave();
      }
    } else {
      // Final wave cleared
      if (!b.ended) winBattle();
    }
  }
}

function spawnEnemy(type, lane) {
  const b = state.battle;
  const def = ENEMY_TYPES[type];
  if (!def) return;
  const scale = 1 + (b.stage.num - 1) * 0.065;
  const atkScale = 1 + (b.stage.num - 1) * 0.045;
  const enemy = {
    type,
    def,
    col: lane,
    row: -1,
    y: -1,
    hp: Math.round(def.hp * (def.boss ? 1 : scale)),
    maxHp: Math.round(def.hp * (def.boss ? 1 : scale)),
    atk: Math.round(def.atk * atkScale),
    speed: def.speed,
    atkCd: 0,
    dot: null,
    isBoss: !!def.boss,
  };
  b.enemies.push(enemy);
  renderEnemy(enemy);
  if (enemy.isBoss) SE.boss();
}

function renderEnemy(e) {
  const fx = $("#battle-fx");
  const el = document.createElement("div");
  el.className = `enemy e-${e.type}${e.isBoss ? " boss" : ""}`;
  el.innerHTML = `
    <div class="e-shape">${e.def.shape}
      <div class="e-hp"><div class="e-hp-fill" style="width:100%"></div></div>
    </div>
  `;
  fx.appendChild(el);
  e.el = el;
  updateEnemyPosition(e);
}

function updateEnemyPosition(e) {
  if (!e.el) return;
  const b = state.battle;
  const cw = b.cellW || 88;
  const ch = b.cellH || 88;
  const offsetX = (b.bfOffsetX || 0);
  const offsetY = (b.bfOffsetY || 0);
  const size = cw * (e.isBoss ? 1.5 : 0.82);
  const cx = offsetX + e.col * (cw + 2) + cw / 2;
  const cy = offsetY + e.y * (ch + 2) + ch / 2;
  e.el.style.width = size + "px";
  e.el.style.height = size + "px";
  e.el.style.transform = `translate(${cx - size/2}px, ${cy - size/2}px)`;
  e.cx = cx;
  e.cy = cy;
}

// ─────────────────────────────────────────────────────────────
//  Game loop
// ─────────────────────────────────────────────────────────────
let rafId = null;
function gameLoop(now) {
  const b = state.battle;
  if (!b || b.ended) { rafId = null; return; }
  if (state.paused) {
    b.lastTick = now;
    rafId = requestAnimationFrame(gameLoop);
    return;
  }
  const rawDt = Math.min(50, now - b.lastTick);
  const dt = rawDt * state.speedMul;
  b.lastTick = now;
  b.elapsed += dt;

  tickResource(dt);
  tickUnits(dt);
  tickEnemies(dt);
  tickProjectiles(dt);
  updateWaveSpawn();
  renderPaletteState();

  if (!b.ended) rafId = requestAnimationFrame(gameLoop);
}

function tickResource(dt) {
  const b = state.battle;
  let regen = RESOURCE_REGEN;
  // Bell buff: per active ベル unit
  for (const u of b.units) {
    if (u.def.resourceBuff) regen += u.def.resourceBuff.rate;
  }
  b.resourceF += regen * dt / 1000;
  if (b.resourceF >= 1) {
    const add = Math.floor(b.resourceF);
    b.resource += add;
    b.resourceF -= add;
    renderHUD();
  }
}

function tickUnits(dt) {
  const b = state.battle;
  for (let i = b.units.length - 1; i >= 0; i--) {
    const u = b.units[i];
    u.cd -= dt;
    // Heal pulse (passive)
    if (u.def.healPulse) {
      if (!u.lastHealPulse) u.lastHealPulse = 0;
      u.lastHealPulse += dt;
      if (u.lastHealPulse >= u.def.healPulse.interval) {
        u.lastHealPulse = 0;
        healPulse(u);
      }
    }
    // Non-attacking heal/buff ignore attack loop
    if (u.def.healPulse && u.def.healPulse.noAtk) continue;
    if (u.def.role === "buff" && u.def.atk === 0) continue; // bell-like

    if (u.cd <= 0) {
      const target = findTarget(u);
      if (target) {
        performAttack(u, target);
        u.cd = u.def.atkInterval;
      }
    }
  }
}

function findTarget(u) {
  const b = state.battle;
  const def = u.def;
  // cols to scan
  let cols;
  if (def.atkColMode === "splash" && def.role !== "aoe") {
    cols = [u.col];   // splash = primary col target; AoE applied on impact
  } else if (def.atkColMode === "line") {
    cols = [u.col];
  } else {
    cols = [u.col];
  }
  let best = null;
  let bestRow = -1;
  for (const e of b.enemies) {
    if (!cols.includes(e.col)) continue;
    // target only enemies above the unit or at same row
    if (e.y > u.row + 0.2) continue;
    // range check: distance in rows
    const dist = u.row - e.y;
    if (def.atkColMode === "line") {
      // whole column no range limit
    } else {
      if (dist > def.range) continue;
      if (dist < -0.1) continue;
    }
    // pick the one farthest along (lowest y = highest up still in range; but actually we want closest to base = largest y)
    if (e.y > bestRow) {
      bestRow = e.y;
      best = e;
    }
  }
  return best;
}

function performAttack(u, target) {
  const b = state.battle;
  const def = u.def;
  u.atkState = 1;
  if (u.el) {
    u.el.classList.add("atk");
    setTimeout(() => u.el && u.el.classList.remove("atk"), 180);
  }

  // Crit
  const crit = (def.id === "nox") ? (Math.random() < 0.1) : false;
  const dmg = Math.max(1, (def.atk - (target.def.armor || 0)) * (crit ? 2 : 1));

  // Projectile visuals
  if (def.proj) spawnProjectile(u, target, def.proj);

  // Damage application
  if (def.role === "line") {
    // Hit all in column
    for (const e of b.enemies) {
      if (e.col === u.col && e.y <= u.row + 0.2) {
        damageEnemy(e, dmg, crit);
      }
    }
  } else if (def.role === "aoe") {
    damageEnemy(target, dmg, crit);
    // splash
    const radius = def.aoeRadius || 1;
    for (const e of b.enemies) {
      if (e === target) continue;
      const dx = e.col - target.col;
      const dy = e.y - target.y;
      const distCells = Math.hypot(dx, dy);
      if (distCells <= radius + 0.01) damageEnemy(e, Math.round(dmg * 0.6), false);
    }
    spawnAoeRing(target.cx, target.cy, radius * (b.cellW || 88), def.proj);
  } else if (def.role === "burst") {
    // Melee splash: hit target + adjacent cols same row
    damageEnemy(target, dmg, crit);
    for (const e of b.enemies) {
      if (e === target) continue;
      const dx = e.col - u.col;
      if (Math.abs(dx) <= 1 && Math.abs(e.y - target.y) < 1.2) {
        damageEnemy(e, Math.round(dmg * 0.7), false);
      }
    }
  } else {
    damageEnemy(target, dmg, crit);
    if (def.dot) applyDot(target, def.dot);
  }

  SE.shoot();
  if (crit) SE.critical();
}

function damageEnemy(e, dmg, crit) {
  if (!e || e.hp <= 0) return;
  e.hp -= dmg;
  if (e.el) {
    e.el.classList.add("hit");
    setTimeout(() => e.el && e.el.classList.remove("hit"), 180);
    const hpEl = e.el.querySelector(".e-hp-fill");
    if (hpEl) hpEl.style.width = `${Math.max(0, (e.hp / e.maxHp) * 100)}%`;
  }
  showDamageNum(e.cx, e.cy, dmg, crit);
  SE.hit();
  if (e.isBoss) {
    const fill = $("#boss-hp-fill");
    if (fill) fill.style.width = `${Math.max(0, (e.hp / e.maxHp) * 100)}%`;
  }
  if (e.hp <= 0) killEnemy(e);
}

function applyDot(e, dot) {
  e.dot = { ...dot, tickTimer: 0, left: dot.ticks };
}

function tickEnemies(dt) {
  const b = state.battle;
  for (let i = b.enemies.length - 1; i >= 0; i--) {
    const e = b.enemies[i];

    // DoT tick
    if (e.dot && e.dot.left > 0) {
      e.dot.tickTimer += dt;
      if (e.dot.tickTimer >= e.dot.interval) {
        e.dot.tickTimer = 0;
        e.dot.left--;
        damageEnemy(e, e.dot.dmg, false);
        if (e.hp <= 0) continue;
      }
    }

    // Check if blocked by a unit in same column in engagement window
    // If multiple candidates, pick the one closest to enemy (smallest positive gap)
    let blocker = null;
    let blockerGap = Infinity;
    for (const u of b.units) {
      if (u.col !== e.col) continue;
      const gap = u.row - e.y;
      if (gap >= -0.1 && gap <= 0.55 && gap < blockerGap) {
        blocker = u;
        blockerGap = gap;
      }
    }
    if (blocker) {
      // Attack blocker
      e.atkCd -= dt;
      if (e.atkCd <= 0) {
        damageUnit(blocker, e.atk);
        e.atkCd = e.def.atkInterval;
      }
      updateEnemyPosition(e);
      continue;
    }

    // Hunter ranged attack
    if (e.def.atkRange) {
      const t = findUnitInColumn(e.col, e.def.atkRange, e.y);
      if (t) {
        e.atkCd -= dt;
        if (e.atkCd <= 0) {
          damageUnit(t, e.atk);
          e.atkCd = e.def.atkInterval;
          spawnEnemyProjectile(e, t);
        }
      }
    }

    // Move
    e.y += e.speed * dt / 1000;
    e.row = Math.floor(e.y + 0.51);
    updateEnemyPosition(e);

    if (e.y >= ROWS - 0.1) {
      // Reached base
      damageBase(1);
      removeEnemy(e);
    }
  }
}

function findUnitInColumn(col, range, fromY) {
  const b = state.battle;
  let best = null;
  let bestDist = Infinity;
  for (const u of b.units) {
    if (u.col !== col) continue;
    const d = u.row - fromY;
    if (d < 0 || d > range) continue;
    if (d < bestDist) { bestDist = d; best = u; }
  }
  return best;
}

function damageUnit(u, dmg) {
  u.hp -= dmg;
  if (u.el) {
    const hpEl = u.el.querySelector(".u-hp-fill");
    if (hpEl) hpEl.style.width = `${Math.max(0, (u.hp / u.def.hp) * 100)}%`;
  }
  if (u.hp <= 0) killUnit(u);
}

function killUnit(u) {
  const b = state.battle;
  b.units = b.units.filter(x => x !== u);
  delete b.cells[`${u.col},${u.row}`];
  if (u.el) u.el.remove();
  SE.unitDie();
}

function killEnemy(e) {
  const b = state.battle;
  b.enemies = b.enemies.filter(x => x !== e);
  if (e.el) {
    e.el.style.transition = "opacity .25s ease, transform .25s ease";
    e.el.style.opacity = "0";
    e.el.style.transform += " scale(1.3)";
    setTimeout(() => e.el && e.el.remove(), 260);
  }
  // Sparkles
  for (let i = 0; i < (e.isBoss ? 12 : 4); i++) {
    spawnSparkle(e.cx + (Math.random() - 0.5) * 30, e.cy + (Math.random() - 0.5) * 30);
  }
  const reward = e.def.reward;
  b.resource += reward;
  // Reward float
  showDamageNum(e.cx, e.cy + 16, reward, false, true);
  renderHUD();
  flashCrystal();
  SE.enemyDie();
  if (e.isBoss) {
    // Big victory flash on boss death
    SE.win();
    showMsg("討伐！", e.def.name, 1200);
  }
}

function spawnSparkle(cx, cy) {
  const fx = $("#battle-fx");
  const el = document.createElement("div");
  el.className = "sparkle";
  el.style.left = cx + "px";
  el.style.top = cy + "px";
  fx.appendChild(el);
  setTimeout(() => el.remove(), 750);
}

function flashCrystal() {
  const el = $(".hud-crystal");
  if (!el) return;
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}

function removeEnemy(e) {
  const b = state.battle;
  b.enemies = b.enemies.filter(x => x !== e);
  if (e.el) e.el.remove();
}

function damageBase(n) {
  const b = state.battle;
  b.baseHp -= n;
  renderHUD();
  const bf = $("#battlefield");
  bf.classList.add("shake");
  setTimeout(() => bf.classList.remove("shake"), 320);
  SE.baseHit();
  if (b.baseHp <= 0 && !b.ended) loseBattle();
}

function healPulse(u) {
  const b = state.battle;
  const def = u.def.healPulse;
  const r = def.range;
  // Heal lowest-HP ally within range
  let best = null, bestRatio = 1;
  for (const ally of b.units) {
    if (ally === u) continue;
    const d = Math.hypot(ally.col - u.col, ally.row - u.row);
    if (d > r + 0.01) continue;
    const ratio = ally.hp / ally.def.hp;
    if (ratio < 1 && ratio < bestRatio) { bestRatio = ratio; best = ally; }
  }
  if (best) {
    best.hp = Math.min(best.def.hp, best.hp + def.amount);
    if (best.el) {
      const hpEl = best.el.querySelector(".u-hp-fill");
      if (hpEl) hpEl.style.width = `${(best.hp / best.def.hp) * 100}%`;
    }
    const cx = cellCenterX(best.col);
    const cy = cellCenterY(best.row);
    showDamageNum(cx, cy - 14, def.amount, false, true);
    SE.heal();
  }
}

// ─────────────────────────────────────────────────────────────
//  Projectiles (cosmetic)
// ─────────────────────────────────────────────────────────────
function spawnProjectile(u, target, kind) {
  const b = state.battle;
  const fx = $("#battle-fx");
  const el = document.createElement("div");
  el.className = `proj ${kind}`;
  fx.appendChild(el);
  const cx0 = cellCenterX(u.col);
  const cy0 = cellCenterY(u.row) - 10;
  const p = {
    el, x: cx0, y: cy0,
    tx: target.cx, ty: target.cy,
    speed: 900 + (kind === "arrow" ? 300 : 0),
    life: 700,
  };
  const dx = p.tx - p.x;
  const dy = p.ty - p.y;
  const d = Math.hypot(dx, dy) || 1;
  p.vx = dx / d * p.speed;
  p.vy = dy / d * p.speed;
  el.style.transform = `translate(${p.x - 5}px, ${p.y - 5}px)`;
  b.projectiles.push(p);
}

function spawnEnemyProjectile(e, target) {
  const b = state.battle;
  const fx = $("#battle-fx");
  const el = document.createElement("div");
  el.className = "proj magic";
  el.style.background = "radial-gradient(circle, #ff6b6b, #5a1010 70%)";
  el.style.boxShadow = "0 0 12px #ff6b6b";
  fx.appendChild(el);
  const p = {
    el, x: e.cx, y: e.cy,
    tx: cellCenterX(target.col), ty: cellCenterY(target.row),
    speed: 500,
    life: 800,
    enemy: true,
  };
  const dx = p.tx - p.x;
  const dy = p.ty - p.y;
  const d = Math.hypot(dx, dy) || 1;
  p.vx = dx / d * p.speed;
  p.vy = dy / d * p.speed;
  b.projectiles.push(p);
}

function tickProjectiles(dt) {
  const b = state.battle;
  for (let i = b.projectiles.length - 1; i >= 0; i--) {
    const p = b.projectiles[i];
    p.x += p.vx * dt / 1000;
    p.y += p.vy * dt / 1000;
    p.life -= dt;
    const reached = Math.hypot(p.x - p.tx, p.y - p.ty) < 10;
    if (p.el) p.el.style.transform = `translate(${p.x - 5}px, ${p.y - 5}px)`;
    if (reached || p.life <= 0) {
      if (p.el) p.el.remove();
      b.projectiles.splice(i, 1);
    }
  }
}

function spawnAoeRing(cx, cy, radiusPx, kind) {
  const fx = $("#battle-fx");
  const el = document.createElement("div");
  el.className = "aoe-ring";
  el.style.left = cx + "px";
  el.style.top = cy + "px";
  el.style.width = (radiusPx * 2) + "px";
  el.style.height = (radiusPx * 2) + "px";
  el.style.color = kind === "fire" ? "#ff8c3b"
                 : kind === "holy" ? "#ffd35c"
                 : kind === "prism" ? "#ff8cf0"
                 : "#c9a2ff";
  fx.appendChild(el);
  setTimeout(() => el.remove(), 600);
}

function showDamageNum(cx, cy, n, crit, heal) {
  const fx = $("#battle-fx");
  const el = document.createElement("div");
  el.className = "dmg-num" + (crit ? " crit" : "") + (heal ? " heal" : "");
  el.textContent = (heal ? "+" : "") + n;
  el.style.left = cx + "px";
  el.style.top = (cy - 10) + "px";
  fx.appendChild(el);
  setTimeout(() => el.remove(), 850);
}

function cellCenterX(col) {
  const b = state.battle;
  const cw = b.cellW || 88;
  return (b.bfOffsetX || 0) + col * (cw + 2) + cw / 2;
}
function cellCenterY(row) {
  const b = state.battle;
  const ch = b.cellH || 88;
  return (b.bfOffsetY || 0) + row * (ch + 2) + ch / 2;
}

// ─────────────────────────────────────────────────────────────
//  Battle end
// ─────────────────────────────────────────────────────────────
function winBattle() {
  const b = state.battle;
  b.ended = true;
  cancelAnimationFrame(rafId);
  state.clearedStages[b.stage.num] = {
    clearedAt: Date.now(),
    baseHp: b.baseHp,
  };
  const isFirst = !state.clearedStages[b.stage.num]?.clearedAt || (state.clearedStages[b.stage.num].clearedAt === Date.now());
  state.totalShards += 30 + b.stage.num * 10;
  saveSave();
  SE.win();
  setTimeout(() => {
    $("#result-overlay").classList.add("show");
    const isBoss = b.stage.boss || b.stage.final;
    $("#result-title").textContent = b.stage.final ? "🌈 虹霊界、救われし" : (isBoss ? "討伐！" : "勝利");
    $("#result-subtitle").textContent = `第${b.stage.num}話 「${b.stage.title}」 クリア`;
    $("#result-story").textContent = b.stage.winStory || "";
    $("#reward-shards").textContent = `+${30 + b.stage.num * 10}`;
    $("#reward-first-clear").style.display = "none";
    const rInner = $("#result-overlay .overlay-inner");
    rInner.classList.remove("defeat");
    // Next button: go to next stage if exists
    const hasNext = state.currentStage < STAGES.length;
    $("#btn-result-next").style.display = hasNext ? "" : "none";
  }, 700);
}

function loseBattle() {
  const b = state.battle;
  b.ended = true;
  cancelAnimationFrame(rafId);
  SE.lose();
  setTimeout(() => {
    $("#result-overlay").classList.add("show");
    $("#result-title").textContent = "敗北";
    $("#result-subtitle").textContent = "虹光が、消えた";
    $("#result-story").textContent = "影喰いが祭壇を呑み込んだ。祈りは届かなかった。もう一度、戦士たちを呼び戻そう。";
    $("#reward-shards").textContent = `+0`;
    const rInner = $("#result-overlay .overlay-inner");
    rInner.classList.add("defeat");
    $("#btn-result-next").style.display = "none";
  }, 700);
}

function showMsg(main, sub, dur = 1200) {
  const el = $("#battle-msg");
  el.innerHTML = main + (sub ? `<div class="sub">${sub}</div>` : "");
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), dur);
}

function exitBattle() {
  const b = state.battle;
  if (b) {
    b.ended = true;
    cancelAnimationFrame(rafId);
  }
  cleanupBattle();
  showScreen("stages");
  renderStageGrid();
}

function cleanupBattle() {
  $("#battle-fx").innerHTML = "";
  $("#battle-msg").innerHTML = "";
  $("#battlefield").innerHTML = "";
  $("#palette").innerHTML = "";
  $("#pause-overlay").classList.remove("show");
  $("#result-overlay").classList.remove("show");
}

// ─────────────────────────────────────────────────────────────
//  Event bindings
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadSave();

  $("#btn-start").addEventListener("click", () => {
    showScreen("stages");
    renderStageGrid();
  });
  $("#btn-dex").addEventListener("click", () => {
    showScreen("dex");
    renderDex();
  });
  $("#btn-reset-progress").addEventListener("click", () => {
    if (confirm("進行度・編成をリセットしますか？")) {
      localStorage.removeItem("prism-defense");
      localStorage.removeItem("prism-defense-tut");
      state.clearedStages = {};
      state.deck = [];
      state.totalShards = 0;
      alert("リセットしました");
    }
  });

  const soundBtn = $("#btn-sound-toggle");
  const updateSoundBtn = () => soundBtn.innerHTML = soundEnabled ? "🔊 音 ON" : "🔇 音 OFF";
  updateSoundBtn();
  soundBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("prism-defense-sound", soundEnabled ? "1" : "0");
    updateSoundBtn();
    if (soundEnabled) SE.tap();
  });

  // Back buttons
  $$(".back").forEach(b => {
    b.addEventListener("click", () => {
      const target = b.dataset.back;
      showScreen(target);
      if (target === "stages") renderStageGrid();
    });
  });

  // Deck tabs
  $$(".deck-tabs .tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".deck-tabs .tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      deckTierFilter = tab.dataset.tier;
      renderUnitGrid();
    });
  });

  $("#btn-battle-start").addEventListener("click", () => {
    if (state.deck.length === 0) return;
    startBattle();
  });

  // Battle HUD
  $("#btn-pause").addEventListener("click", () => {
    state.paused = !state.paused;
    $("#pause-overlay").classList.toggle("show", state.paused);
    $("#btn-pause").textContent = state.paused ? "▶" : "⏸";
  });
  $("#btn-resume").addEventListener("click", () => {
    state.paused = false;
    $("#pause-overlay").classList.remove("show");
    $("#btn-pause").textContent = "⏸";
  });
  $("#btn-retry").addEventListener("click", () => {
    $("#pause-overlay").classList.remove("show");
    state.paused = false;
    $("#btn-pause").textContent = "⏸";
    cleanupBattle();
    startBattle();
  });
  $("#btn-exit-battle").addEventListener("click", exitBattle);

  $("#btn-speed").addEventListener("click", () => {
    const levels = [1, 1.5, 2];
    const i = levels.indexOf(state.speedMul);
    state.speedMul = levels[(i + 1) % levels.length];
    const el = $("#btn-speed");
    el.textContent = state.speedMul === 1 ? "▶" : (state.speedMul === 1.5 ? "▶▶" : "▶▶▶");
    el.classList.toggle("active", state.speedMul > 1);
  });

  // Result buttons
  $("#btn-result-next").addEventListener("click", () => {
    const nextNum = state.battle.stage.num + 1;
    $("#result-overlay").classList.remove("show");
    cleanupBattle();
    if (nextNum <= STAGES.length) {
      state.currentStage = nextNum;
      openDeckBuilder();
    } else {
      exitBattle();
    }
  });
  $("#btn-result-retry").addEventListener("click", () => {
    $("#result-overlay").classList.remove("show");
    cleanupBattle();
    startBattle();
  });
  $("#btn-result-home").addEventListener("click", () => {
    $("#result-overlay").classList.remove("show");
    exitBattle();
  });

  // Modal close
  $$("[data-close-modal]").forEach(el => el.addEventListener("click", closeUnitModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if ($("#unit-modal").classList.contains("show")) closeUnitModal();
      else if ($("#pause-overlay").classList.contains("show")) $("#btn-resume").click();
    }
    if (state.screen === "battle" && !state.battle?.ended) {
      if (e.key === " " || e.key === "p") $("#btn-pause").click();
    }
  });

  // Cancel zone (when unit selected)
  $("#cancel-zone").addEventListener("click", () => {
    if (state.battle?.selectedUnit) {
      state.battle.selectedUnit = null;
      updateSelectionUI();
      SE.tap();
    }
  });

  // Show cancel zone when selected
  setInterval(() => {
    if (state.battle?.selectedUnit) {
      $("#cancel-zone").classList.add("show");
    } else {
      $("#cancel-zone").classList.remove("show");
    }
  }, 150);

  // Reposition enemies on resize
  window.addEventListener("resize", () => {
    if (state.battle) {
      updateLayoutCache();
      for (const e of state.battle.enemies) updateEnemyPosition(e);
    }
  });

  // Prime audio on first interaction
  const primeAudio = () => { getAudio()?.resume(); document.removeEventListener("pointerdown", primeAudio); };
  document.addEventListener("pointerdown", primeAudio);
});
