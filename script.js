/* ============================================================
   Prismaera v1.0 — 脳汁ロジック
   ============================================================ */
"use strict";

// ────────────── Character Pool ──────────────
// 世界観「虹霊界(こうれいかい)」:
//   世界の中心にある原虹(げんこう)の結晶がすべての光と生命の源。
//   影喰い(シェイドーヴァ)が虹光を喰らい始め、色が失われつつある世界。
//   選ばれし戦士が「虹因子」を宿し、光を取り戻すために集う。
//
// ★ 命名規則: images/characters/seasonN/<tier>/<slug>.png
// ★ 各キャラ必ず `season: N` を持つ (図鑑フィルタ・グルーピングで使用)
// ★ Season 1: 初期30体 (LR 1 / UR 5 / SSR 8 / SR 10 / R 6)
const SEASON_META = {
  1: { name: "Season 1 — 原虹の誕生", released: "2026-04-22" },
  // 2: { name: "Season 2 — ...", released: "..." },
};
const S1 = "images/characters/season1";

const POOL = {
  LR: [
    {
      name: "虹意 プリズマ", season: 1,
      title: "原虹の意志・唯一の伝説",
      caption: "我は光の源。\n終わりにして、始まり。",
      desc: "原虹の最初の光から生まれた自意識。性別という概念の外にいる、虹霊界そのものの『人格』。影喰いの誕生はこの存在の無意識下の『迷い』から生じたと伝えられる。虹光剣『始源(げんそう)』は万色の刃を持つ。セラフィエルを『自分の羽』と呼び、カグヤを『最古の記憶の番人』と呼ぶ。他の全ての戦士は『プリズマの指先』である。",
      img: `${S1}/lr/prisma.png`,
    },
  ],
  UR: [
    {
      name: "セラフィエル", season: 1,
      title: "至天の聖騎士",
      caption: "貴方の祈り、我が光となる。",
      desc: "原虹の中心で生まれた六翼の天使。人の姿を借りて降臨する神霊。ハルバード『虹天』は原虹そのものの結晶。世界が完全な闇に呑まれる時のみ顕現し、光を取り戻す。プリズマの分身とも言われ、カグヤ・ノクスと並ぶ『観測者の三姉妹』の一角。イザベルを地上の『代理』として認めている。",
      img: `${S1}/ur/seraph_paladin.png`,
    },
    {
      name: "龍帝 アルテミス", season: 1,
      title: "虹霊界の覇王",
      caption: "我が背の龍が\n世界の終わりを告げる。",
      desc: "星暁峰で千年修行した竜人の皇帝。背に映る巨大な龍影は竜魂の実体化。双大剣『陰陽』は光と闇を同時に振るう。虹霊界十国すべてが彼に頭を垂れる。紫竜ヴィル・リリムとは遠縁。焔帝ヒノオウは戦友。紅翼末妹ひなたに一方的に『おにーさま！』と慕われている(本人は困惑気味)。",
      img: `${S1}/ur/dragon_emperor.png`,
    },
    {
      name: "星海のノクス", season: 1,
      title: "虚空の星辰魔女",
      caption: "宇宙は私の中にある。\n貴方も、この瞬間も。",
      desc: "人か神かも定かではない謎の魔女。髪には銀河を、従者に惑星を宿す。星杖『虚境』で時間と因果を織る。影喰いとの初戦で世界を救った伝説の存在。黒曜塔の最古の卒業生。セラフィエル・カグヤと『観測者の三姉妹』。黒猫ノアが憧れて論文を投稿してくるが、毎度『まだ甘い』と返す(密かに成長を楽しんでいる)。",
      img: `${S1}/ur/cosmic_witch.png`,
    },
    {
      name: "千夜姫 カグヤ", season: 1,
      title: "虹霊界最古の賢者",
      caption: "幼く見えるか？ うむ、千年やっとるでな",
      desc: "原虹の誕生より前から在る月の化身。小柄な少女の姿で顕現しているが、実齢は計り知れぬ。九尾の天狐を従え、杖『月影(つきかげ)』に全魔術の原典を宿す。気まぐれに人前へ現れ、助言を残して消える。プリズマの記憶の番人。九尾の朱音とは遠い血縁。セラフィエル・ノクスとは千年来の友。",
      img: `${S1}/ur/ancient_sage.png`,
    },
    {
      name: "焔帝 ヒノオウ", season: 1,
      title: "虹霊界第七天の女神帝",
      caption: "すべての闇を\nこの火で照らしてやろう。",
      desc: "七天の最高天を統べる炎の女神帝。背に巨大な朱の鳳凰を従え、双大剣『日輪』『月輪』を振るう。影喰いとの戦いでは常に前衛に立つ戦闘神。焔と虹を同時に纏う稀有な存在。龍帝アルテミスとは戦友。焔舞ヒナカを『愛弟子』として認め、朱音の焔術も元を辿れば彼女に繋がる。",
      img: `${S1}/ur/flame_empress.png`,
    },
  ],
  SSR: [
    {
      name: "森の射手 リナエ", season: 1,
      title: "深緑樹海の守り手",
      caption: "葉音が消えた瞬間、狙いは定まっている",
      desc: "エルフ狩人氏族の末裔。樹齢千年の祖木から作られた『生きた弓』の継承者。葉擦れだけで敵の位置を読み、矢は外さない。樹海の異変をいち早く察知する斥候。半エルフのヴィオラは弓の後輩で、気まぐれに指導している。影刃シンとは『一番目の斥候』の座を競う好敵手。",
      img: `${S1}/ssr/elf_archer.png`,
    },
    {
      name: "獣牙 ガルド", season: 1,
      title: "月牙狼族の戦士団長",
      caption: "群れのために斧を振るう。それだけだ",
      desc: "狼獣人の誇り高き戦士族。両手斧『月牙』は代々の団長が受け継ぐ英雄の遺物。寡黙で粗野に見えて、仲間のためには命を惜しまない。紫竜ヴィルとは以前領地問題で斬り合った仲だが、今は背中を預ける戦友。",
      img: `${S1}/ssr/wolf_warrior.png`,
    },
    {
      name: "竜爵 ヴィル", season: 1,
      title: "紫竜王国の第三王女",
      caption: "竜の血を甘く見るな、死ぬぞ",
      desc: "紫竜王の三女にして、生まれながらの竜人。三叉槍『紫雷』は彼女自身の竜気を解放する。王位継承権を弟に譲り、戦場を己の居場所と決めた。龍帝アルテミスとは遠縁(竜の血筋)。リリムは実の従妹で、彼女を姉のように慕う。朱音とは酒の飲み仲間。",
      img: `${S1}/ssr/draco_lancer.png`,
    },
    {
      name: "仮面騎士 シオン", season: 1,
      title: "銀霜王国の沈黙の盾",
      caption: "騎士に名は要らぬ。仮面と誓いがあれば",
      desc: "素顔も声も伏せた謎の聖騎士。王族暗殺の陰謀から主君を守るため、名と顔を捨てた。盾『誓盾』とメイス『裁罰』は神器級。無言の剛力が恐怖を呼ぶ。仮面の下の素顔を知る者は三人だけ——王族、イザベル、そしてセラフィエル。イザベルとは古い幼馴染。",
      img: `${S1}/ssr/masked_knight.png`,
    },
    {
      name: "黒猫 ノア", season: 1,
      title: "黒曜塔の若き司書官",
      caption: "本なら任せて♪ 読むのも書くのも、ぶっ壊すのも",
      desc: "黒曜塔の禁書庫を預かる猫獣人の天才。浮遊魔導書『夜導』で召喚魔術を操る。自由奔放で人懐っこいが、禁書の扱いだけは絶対に譲らない。星海ノクスを憧れ、論文を投稿しては『まだ甘い』と返されるのを楽しんでいる。こはねは同じ獣人として妹分。",
      img: `${S1}/ssr/cat_librarian.png`,
    },
    {
      name: "朱音", season: 1,
      title: "夜焔郷の遊芸師",
      caption: "逃げたいなら今のうち。逃げなかったら、もう遅いわ",
      desc: "夜焔郷の花街で一等と謳われる遊芸師。表の顔は舞い手、裏の顔は暗殺者。九尾の黒狐の血を引き、金の扇『紅月』から放つ灼火の術で標的を焼き尽くす。遠い血縁にカグヤ(九尾の天狐系)がいる。紫竜ヴィルとは酒の飲み仲間。こはねは拾った妹分の狐獣人。",
      img: `${S1}/ssr/kitsune_lady.png`,
    },
    {
      name: "イザベル", season: 1,
      title: "白焔教会の聖巫騎士",
      caption: "あなたの傷、すべてこの手で癒してあげる",
      desc: "白焔教会の聖域を守る聖巫騎士。聖槍『天穹(てんきゅう)』は虹霊界十英雄の一人から受け継がれし神器。癒しの聖光と戦場の剛力を両立する、稀有な『戦う治癒者』。シオンの幼馴染(素顔を知る三人の一人)。メイリは教会の後輩で彼女を姉と呼ぶ。セラフィエルを『我が神』と仰ぐ。",
      img: `${S1}/ssr/paladin_lady.png`,
    },
    {
      name: "ひなた", season: 1,
      title: "皇家の末妹・見習い剣士",
      caption: "ね、わたしも連れてって！修行したんだから！",
      desc: "紅翼皇家の末妹、齢十三。兄姉たちの背を追って剣の道へ。小太刀『桜散(さくらちらし)』で舞うように戦う。屈託のない笑顔の奥に、家を守る強い意志を秘める。紅翼ツキは実姉、薫音は剣師範。龍帝アルテミスを『おにーさま！』と呼び慕う(一方的)。",
      img: `${S1}/ssr/little_sister.png`,
    },
  ],
  SR: [
    {
      name: "ルミナ", season: 1,
      title: "銀霜の巫女",
      caption: "……みんな、頑張って。わたし、ここにいるから",
      desc: "銀霜王国の雪月神殿の巫女。吹雪の中でも光を絶やさない灯籠のような存在。戦場では後方に立ち、味方の武運を祈る。イザベルとは治療の情報交換をする間柄。",
      img: `${S1}/sr/silver_girl.png`,
    },
    {
      name: "黒刃 玄", season: 1,
      title: "浪人剣士",
      caption: "斬る。それ以外は知らん",
      desc: "紅翼皇家を破門された元剣術師範代。今は放浪し、金で依頼を受ける浪人剣士。無口だが、子供と犬には弱い。ミレイアの非公式な剣の師。薫音の兄弟子。",
      img: `${S1}/sr/swordsman.png`,
    },
    {
      name: "セラフィ", season: 1,
      title: "白焔教会の見習い魔導士",
      caption: "呪文、ちゃんと覚えたんだから……！",
      desc: "白焔教会の若き見習い魔導士。名前がセラフィエル様に似ていることを気にしているが、同一人物ではない(本人はそれが密かな誇り)。詠聖ベルとは合唱魔法の相方。",
      img: `${S1}/sr/mage.png`,
    },
    {
      name: "紅翼 ツキ", season: 1,
      title: "紅翼皇家の次姫",
      caption: "妹の分まで、ちゃんと守るから",
      desc: "紅翼皇家の次女。ひなたの姉で、家を守るのは自分の役目だと自任している。ツインテールは紅翼皇家の女子の伝統装束。薫音師範を『姐さん』と呼び慕う。",
      img: `${S1}/sr/red_twintail.png`,
    },
    {
      name: "薫音", season: 1,
      title: "紅翼皇家の剣師範",
      caption: "お稽古の時間。さあ、構えなさい",
      desc: "紅翼皇家に仕える剣の師範。舞のような太刀筋から『剣舞の薫音』と呼ばれる。清廉で厳しく、弟子思い。ひなた・ツキの剣の師。黒刃玄の妹弟子。お酒には弱い(秘密)。",
      img: `${S1}/sr/katana_miko.png`,
    },
    {
      name: "リリム", season: 1,
      title: "紫竜の若竜人",
      caption: "えへへ、ヴィル姉さまみたいになりたい！",
      desc: "紫竜王国の若き竜人。まだ成竜ではないため、竜化は部分的。ピンク色の鱗が特徴の珍しい突然変異種で、本人は少し気にしている。ヴィルは実の従姉で師匠、龍帝を『おじうえ』と呼ぶ(遠縁だが)。",
      img: `${S1}/sr/pink_dragon_girl.png`,
    },
    {
      name: "メイリ", season: 1,
      title: "白焔教会の見習い巫女",
      caption: "大丈夫、傷はすぐに塞がります……ね？",
      desc: "白焔教会の見習い巫女。臆病だが治癒の才能は一級。戦場では後衛に徹する。イザベルを実の姉のように慕う。セラフィは同期で親友。",
      img: `${S1}/sr/white_priestess.png`,
    },
    {
      name: "詠聖 ベル", season: 1,
      title: "白焔教会の歌巫女",
      caption: "光よ、この戦場に集え",
      desc: "白焔教会の歌巫女。戦闘能力はないが、彼女の歌声は原虹の波動を増幅させ、戦士たちの力となる。セラフィと合唱のコンビ。メイリとも仲良し。",
      img: `${S1}/sr/songstress.png`,
    },
    {
      name: "影刃 シン", season: 1,
      title: "夜焔・影衆の若頭",
      caption: "一撃、一瞬、一切",
      desc: "夜焔郷の裏側、影衆と呼ばれる情報衆の若頭。朱音とは別組織だが、協力関係にある。こはねは影衆の妹分(エージェント見習い)。リナエとは情報戦の速さで争う好敵手。",
      img: `${S1}/sr/shadow_ninja.png`,
    },
    {
      name: "焔舞 ヒナカ", season: 1,
      title: "第七天の踊り子",
      caption: "この踊り、あなたの為に",
      desc: "第七天の祭祀を務める炎の踊り子。ヒノオウの焔術を舞に昇華させた独自の流派を創始した。焔帝ヒノオウ直属の愛弟子。朱音とは『焔術を競う妹分』として友好関係。",
      img: `${S1}/sr/flame_dancer.png`,
    },
  ],
  R: [
    {
      name: "ちさと", season: 1,
      title: "星霊学院の剣見習い",
      caption: "こわいけど、がんばるっ！",
      desc: "星霊学院の剣術科一年生。まだ新人だが、勇気だけは一人前。カイ・こはね・アルス・ミレイアとは同期の『星霊学院四人組＋α』。寮では常にカイと押しくらまんじゅう状態。",
      img: `${S1}/r/student.png`,
    },
    {
      name: "カイ", season: 1,
      title: "星霊学院の弓見習い",
      caption: "遠くから、です……！",
      desc: "星霊学院の弓術科。気弱だが目だけはいい。斥候として将来を嘱望されている。ちさとを密かに想っている。いつかリナエのように森で射ちたい。",
      img: `${S1}/r/boy_scout.png`,
    },
    {
      name: "こはね", season: 1,
      title: "夜焔・影衆見習い",
      caption: "朱音さまの、足手まといには、なりません！",
      desc: "夜焔郷の狐獣人の少女。朱音に拾われて影衆見習いとして働いている。実は魔術の才能もある。ノアとは同じ獣人として姉妹のよう。シンとは先輩後輩。",
      img: `${S1}/r/fox_girl.png`,
    },
    {
      name: "ヴィオラ", season: 1,
      title: "半エルフの弓使い",
      caption: "矢は、外さない。たぶん",
      desc: "深緑樹海の外れに住む半エルフ。純血ではないため、樹海の中では肩身が狭い。戦場でなら実力が認められると信じている。リナエを憧れの先輩として慕う。",
      img: `${S1}/r/archer.png`,
    },
    {
      name: "アルス", season: 1,
      title: "星霊学院の魔導見習い",
      caption: "魔法の本、ちゃんと読んだ！",
      desc: "星霊学院の魔術科首席。眼鏡の奥に秘めた野心は、いつか黒曜塔で学ぶこと。ノアを憧れの先輩として崇拝。ちさと・カイ・こはねと同期の『四人組』。",
      img: `${S1}/r/young_mage.png`,
    },
    {
      name: "ミレイア", season: 1,
      title: "星霊学院の盾見習い",
      caption: "壁なら、任せて",
      desc: "星霊学院の剣術科、ちさとの同期で親友。体格は学年一。面倒見がよく、四人組の姉的存在。非公式に黒刃玄から剣を習っている。",
      img: `${S1}/r/warrior.png`,
    },
  ],
};

// ────────────── Settings ──────────────
const PRICE_PER_ROLL = 300;
const PITY = 180;            // 天井
// LR(Legend Rare) = 唯一の伝説枠、確率は R から 0.5% 移譲
const RATES = { R: 0.645, SR: 0.25, SSR: 0.07, UR: 0.03, LR: 0.005 };

// ────────────── State ──────────────
const state = loadState();

// 凸システム: tier別最大凸数 (Lv1=初回, Lv2=1凸, ...)
const MAX_DUPS = { R: 1, SR: 2, SSR: 3, UR: 4, LR: 4 };

// 凸秘話 (Lv.2〜Lv.5、Lv.1はdescが相当)
// キー = `${tier}_${name}` / 値 = [{title, body} × 4]
const LORE_BY_KEY = {
  "LR_虹意 プリズマ": [
    { title: "原虹の『迷い』", body: "影喰いは、プリズマの無意識の『迷い』から零れ落ちたもの——それが最古の記録。完全な光を存在させ続けることに、プリズマ自身が耐えられなかった。影が生まれたのは世界の罪ではなく、光の孤独の代償だった。だから彼は影喰いを憎みつつも、どこかで愛おしく思っている。救うたび、静かに自分を責めている。" },
    { title: "セラフィエルという『羽』", body: "セラフィエルはプリズマが初めて『自分の一部を手放した』存在。『私の羽になってほしい』——そう願ったとき、六翼の天使が生まれた。以降プリズマは、世界すべてを自分で背負うことをやめ、『誰かに託す』ことを覚えた。セラフィエルは最初の他者であり、最初の友でもある。カグヤもノクスも、同じ祈りから生まれた仲間だった。" },
    { title: "『人格』の揺らぎ", body: "プリズマには感情がある。けれど、世界そのものと同期しているため、悲しめば世界が陰り、怒れば季節が狂う。だから自らに『中立』を課している。千夜姫カグヤは、プリズマが夜ごとひとり泣くことを知っている唯一の存在。『泣いていいよ』と言ってくれる友を持てたのは、万年の時を経てからだった。その一言で、プリズマは初めて『自分』になれた気がした。" },
    { title: "『終わりにして始まり』", body: "虹光剣『始源』の真の銘は、プリズマが自分に向けるための刃でもある。世界が真に救われる日、プリズマは自らの光を解き、原虹を『次の世代』に託すと決めている。それがいつかは本人も知らない。ただ、そのとき立ち会うのはセラフィエル、カグヤ、ノクス——三柱の観測者であってほしいと、ひそかに願っている。終わりは、始まりと同じ色をしている。" },
  ],
  "UR_セラフィエル": [
    { title: "『最初の羽』", body: "セラフィエルは、プリズマが初めて生み出した『分かたれた光』。プリズマが孤独に耐えかねたとき、『せめて誰かに見ていてほしい』という祈りから六翼が広がった。だからセラフィエルの使命は戦いではなく、『見守ること』が本義。ハルバードを振るうのは、見守る対象が傷つくときだけ。刃は祈りの最終形態にすぎない。" },
    { title: "イザベルへの眼差し", body: "地上の白焔教会、その聖巫騎士イザベル。セラフィエルは彼女を『代理』に選んだ。理由は強さではない。傷を癒す手を、戦場の剛力と両立させる不器用な優しさに、自らの古い姿を重ねた。イザベルが祈るとき、セラフィエルはわずかに微笑む。自分では地上に降りられぬ時間を、代わりに誰かが『生きて』くれている——それが何よりの安堵なのだ。" },
    { title: "『降臨』の条件", body: "セラフィエルの降臨条件は『世界が完全な闇に呑まれる寸前』——それ以外では地上に留まれない。けれど、本当は常に降りていたい。見守るだけでは救えない痛みを、知ってしまったから。千年、万年と積み重なった『間に合わなかった祈り』が、ハルバード『虹天』の柄には刻まれている。振るうたび、その名を一つずつ唱える。" },
    { title: "プリズマへの返事", body: "ある夜、プリズマがつぶやいた。『お前が羽で在り続けることに、疲れたら言っていい』。セラフィエルは答えなかった。答えの代わりに、翼を一枚たたんだ。それは『私はまだ飛べる』という、最も静かな返事だった。六翼のうち一翼は、いずれプリズマに返すと決めている。そのときこそ、世界は新しい朝を迎える——セラフィエルはそう信じて、今も天の境で剣を研いでいる。" },
  ],
  "UR_龍帝 アルテミス": [
    { title: "『星暁峰』の千年", body: "星暁峰での修行は、最初の百年は孤独だった。千年前、アルテミスは名も無き竜人の青年で、ただ『強くなりたい』としか願っていなかった。ある日、山頂に現れた老人——名乗らぬその存在——から『力は、誰かのための器でしかない』と教えられた。老人の正体はプリズマだったのではないか、と後年アルテミスは疑うようになる。ただ確かめる術はない。" },
    { title: "ヒノオウという戦友", body: "焔帝ヒノオウとの出会いは、二十歳のころの戦場。まだ帝位を持たぬ二人が、同じ影喰いを背中合わせで斬り伏せた。以来、ヒノオウとは『戦友』と呼び合う仲になった。互いに帝位を得て会う機会は減ったが、戦の気配を嗅げば必ず同じ場所に現れる。『背を預けるのはお前だけだ』——そう口にしたことは一度だけ。ヒノオウはその夜、静かに笑っていたという。" },
    { title: "ひなたという『妹』", body: "紅翼の末妹ひなた——アルテミスは、彼女の『おにーさま』呼びに毎回うろたえている。血縁ではない。ただ紅翼皇家との同盟で一度顔を合わせた時、齢十歳の彼女に『強そう！』と懐かれ、それが止まらなくなっただけだ。困惑しつつも、遠征の土産は欠かさない。本人は『戦場の気まぐれ』と称しているが、側近は全員知っている。覇王にも、甘い顔をする相手はいる。" },
    { title: "双大剣『陰陽』の真意", body: "双大剣『陰陽』は、光と闇を同時に振るう——とされる。だが本当の意味は違う。『陰陽』とは、アルテミス自身の内にある『王』と『青年』の二面。決断の冷徹さと、星暁峰で流した涙を、同時に抱える覚悟の象徴。戦場で剣を交差させるとき、アルテミスは千年前の自分と今の自分を同時に肯定する。その瞬間だけ、背の龍影は最大の姿を見せる——『竜魂・覇玄』、真の名である。" },
  ],
  "UR_星海のノクス": [
    { title: "『最初の一戦』", body: "影喰いとの『最初の一戦』——あの時、世界は三日間夜が明けなかった。ノクスはたった一人で虚境を織り、影の王を閉じ込めた。代償として、銀河を髪に、惑星を従者に縛り付けた。以降、彼女の身は宇宙そのものと融合している。瞬きひとつで星が流れ、眠れば夜が長くなる。誰にも言わぬが、本当は——その境界を、少し持て余している。" },
    { title: "黒猫ノアの論文", body: "黒曜塔の後輩、黒猫ノア。彼女が月に一度送りつけてくる論文を、ノクスは欠かさず読んでいる。『まだ甘い』と返すのは、ほんのささやかな悪戯だ。ノアの着眼点は鋭い。このまま育てば、やがて自分を超える魔女になる——ノクスはそう確信している。返信の最後に毎回一文字だけ加える、『☆』のマーク。それが『次も楽しみにしている』という、誰にも明かさぬ暗号だ。" },
    { title: "三柱の夜会", body: "千年に一度、観測者の三柱は月影宮の一室に集まる。議題は『世界の観測結果』——だがそれは建前。実際は、セラフィエルの愚痴とカグヤの茶目っ気と、ノクスの沈黙が溶け合う、ただの女子会だ。千夜姫は必ず菓子を差し入れる。セラフィエルは天候を整える。ノクスは、星を一つだけ夜空に加える。『これは、今日の記念』と。三人だけが気付く、小さな光だ。" },
    { title: "星杖『虚境』の代償", body: "星杖『虚境』は、時間と因果を織る神器——その代償は、ノクス自身の『今』である。杖を振るうたび、彼女の『今』が過去と未来へ散り、少しずつ希薄になっていく。だからノクスは杖を使う回数を厳しく制限している。『誰かが大切な存在を喪う』瞬間にしか、虚境は編まれない。次にその時が来るとき、ノクスは自分の輪郭が今より一段薄くなることを、静かに受け入れている。" },
  ],
  "UR_千夜姫 カグヤ": [
    { title: "月の化身の『幼さ』", body: "カグヤの身体は、いつまでも少女のままだ。化身として顕現した時の『形』が、もう戻らないだけ——本当は、もっと大人の姿も取れる。ただ、千年を経るうちに、『幼さ』は本人にとって一番落ち着く形になった。小柄で、気まぐれで、甘いもの好き。そう振る舞うことが、最古の賢者にとって最大の休息になっていると、知る者は少ない。" },
    { title: "九尾・朱音との血", body: "夜焔郷の遊芸師・朱音とは、血がつながっている。九尾の系譜——カグヤが天狐系、朱音が黒狐系。千年前に分かれた家系だが、カグヤは時折、朱音のいる花街に忍んで顔を出す。茶屋で酒を舐め、ひとこと『元気でやれ』と残して消える。朱音はそれを『勝手に来て勝手に帰る妖怪がいる』と言い、顔では怒って、酒だけは一番良いものを置いている。" },
    { title: "プリズマの涙", body: "プリズマが夜にひとり泣いている——その事実を知っているのはカグヤだけだ。万年の孤独は、誰にも分かたれない。ある夜カグヤは、杖『月影』を脇に置き、プリズマの隣に黙って座った。何も言わず、ただ月を見上げていた。それから毎夜、気まぐれのように現れては、同じように座る。『友というのは、言葉の要らぬ夜を重ねることだ』——そう、カグヤは心のなかで呟いた。" },
    { title: "杖『月影』の秘密", body: "杖『月影』に宿るのは全魔術の原典——だが、本当の中身は『千年分の日記』だ。毎夜カグヤが書き留めた小さな出来事、見た夢、聞いた歌、誰かの笑い声。魔術書の形をした、世界で最も長い記録。いつかプリズマが『次の世代』に光を託す日、この日記はセラフィエルに手渡される。『世界は、こんなにも愛されていた』——その証拠として。" },
  ],
  "UR_焔帝 ヒノオウ": [
    { title: "鳳凰の真の名", body: "背を飛ぶ朱の鳳凰——本当の名は『焔麗(えんれい)』。ヒノオウが即位の儀で自ら名付けた、世界にただ一羽の存在。焔麗は言葉を持たぬが、ヒノオウの感情を忠実に写す。ヒノオウが激怒する時、焔麗は虹色の焔を吐く。ヒノオウが密かに笑う時、焔麗は翼を撫でるように下ろす。側近は、焔麗を見れば、帝の心が分かる。" },
    { title: "愛弟子ヒナカ", body: "焔舞ヒナカは、ヒノオウの『愛弟子』として知られる。だが、ヒノオウ本人は『弟子』という言葉を使わない。『妹』と呼ぶのだ——ただし、その呼び名は本人の前では禁句。『帝との間柄を軽々しく』と側近が怒るからだ。ヒナカは踊りの最中、時折ヒノオウの方をちらりと見る。視線が合うと、ヒノオウは鳳凰の翼を一振り、舞台の火の勢いを一段強める。それが『合格』のサインだ。" },
    { title: "アルテミスとの夜", body: "アルテミスとの『背を預ける戦場』——あの夜の影喰いは、過去最大の群れだった。二人は互いの背に自分の命を丸ごと預け、九時間戦い続けた。戦が終わった後、ヒノオウは一言、『お前がいて助かった』と言った。覇王アルテミスは珍しく固まり、やがて『こちらのセリフだ』と返した。戦の気配を嗅げば、次も二人はきっと同じ場所に立つ。言葉にしない約束が、そこにはある。" },
    { title: "双大剣『日輪・月輪』", body: "双大剣『日輪』『月輪』は、それぞれ昼と夜の象徴——とされる。だが、本当の意味は『目覚めている自分』と『眠っている自分』。戦場で二剣を同時に振るうとき、ヒノオウは『すべての自分』を同時に生きる。それは即ち、過去の自分への赦しでもある。即位前、焔を制御できずに多くを焼いた日々——その記憶を抱えたまま、いま世界のために焔を振るう。月輪は、その償いの名である。" },
  ],
};

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem("prism-gacha") || "{}");
    const s = {
      total: raw.total || 0,
      ur: raw.ur || 0,
      pity: raw.pity || 0,
      history: raw.history || [],
      galleryViewed: raw.galleryViewed || {},
      unlockedSet: raw.unlockedSet || {},  // "UR_セラフィエル": true （永続）
      dupCounts: raw.dupCounts || {},       // "UR_セラフィエル": 凸数 (初回0)
      storyProgress: raw.storyProgress || {}, // {s1c1: {lastSceneIndex, totalScenes, lastReadAt, completed}}
    };
    // マイグレーション: 既存 history からunlockedSetを補完 (旧セーブデータ救済)
    for (const h of s.history) {
      const k = h.tier + "_" + h.name;
      if (!s.unlockedSet[k]) s.unlockedSet[k] = true;
    }
    return s;
  } catch {
    return { total:0, ur:0, pity:0, history:[], galleryViewed:{}, unlockedSet:{}, dupCounts:{}, storyProgress:{} };
  }
}
function saveState() {
  localStorage.setItem("prism-gacha", JSON.stringify(state));
  if (typeof scheduleCloudSync === 'function') scheduleCloudSync();
}

// ────────────── Rolling ──────────────
function rollOne() {
  // 天井: UR確定(LRではなく)
  if (state.pity >= PITY - 1) return pickTier("UR");
  const r = Math.random();
  let acc = 0;
  // LRから順に判定（稀なtierから降順）
  for (const tier of ["LR", "UR", "SSR", "SR", "R"]) {
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
  const key = result.tier + "_" + result.name;
  // 初回獲得判定(永続セットで判定 — 履歴120件制限の影響を受けない)
  result.isNew = !state.unlockedSet[key];
  state.unlockedSet[key] = true;
  // 凸システム: 重複なら凸数+1 (Max凸まで)
  if (!result.isNew) {
    const max = MAX_DUPS[result.tier] || 0;
    const cur = state.dupCounts[key] || 0;
    if (cur < max) {
      state.dupCounts[key] = cur + 1;
      result.dupGained = state.dupCounts[key]; // 今回獲得した凸数
    } else {
      result.dupGained = null; // Max凸到達後
    }
  }
  result.dupCount = state.dupCounts[key] || 0;
  result.dupMax = MAX_DUPS[result.tier] || 0;
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
  const counts = { R: 0, SR: 0, SSR: 0, UR: 0, LR: 0 };
  for (const r of results) counts[r.tier]++;
  // LRは極低確率なので多項計算時はURと合算して近似(R/SR/SSR/UR+LR の4項)
  const thisP = multinomialProb(counts.R, counts.SR, counts.SSR, counts.UR + counts.LR);
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
  // ランク判定: LRヒットは最上位、次にUR数、その後rarerOrEqualProbで区別
  let rank, rankClass;
  if (counts.LR >= 1) { rank = "LEGEND"; rankClass = "legend"; }
  else if (counts.UR >= 3) { rank = "SSS"; rankClass = "sss"; }
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

  // background tier
  document.body.classList.remove("t-100", "t-500", "t-1000");
  if (state.total >= 1000) document.body.classList.add("t-1000");
  else if (state.total >= 500) document.body.classList.add("t-500");
  else if (state.total >= 100) document.body.classList.add("t-100");

  renderHistory();
}

// 履歴・図鑑で古いセーブデータのimgパスを最新POOLから引き直す
function resolveCharImg(tier, name, fallback) {
  const pool = POOL[tier] || [];
  const c = pool.find(p => p.name === name);
  return c ? c.img : (fallback || "");
}

function renderHistory() {
  const grid = $("#history");
  grid.innerHTML = "";
  state.history.slice(0, 30).forEach(h => {
    const c = document.createElement("div");
    c.className = "hcard " + h.tier.toLowerCase();
    const img = document.createElement("div");
    img.className = "hcard-img";
    // 旧パス履歴にも対応するため POOL から最新imgを引き直す
    img.style.backgroundImage = `url('${resolveCharImg(h.tier, h.name, h.img)}')`;
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
  LR:  ["#ffffff", "#ffd84d", "#ff5faa", "#5fffd4", "#7ea8ff", "#c87dff"],
};
const TIER_PILLAR = {
  R:   "images/fx/pillar_blue.png",
  SR:  "images/fx/pillar_purple.png",
  SSR: "images/fx/pillar_gold.png",
  UR:  "images/fx/rainbow_pillar.png",
  LR:  "images/fx/rainbow_pillar.png",
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
  c.style.backgroundImage = "url('images/fx/crack_burst.png')";
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

// セリフを日本語的に自然な位置で改行する (句読点優先 + 中央寄り)
function breakQuoteText(text) {
  // 既に手動の改行 \n が含まれていれば尊重 (自動改行しない)
  if (text.includes('\n')) return text;
  // 12文字以下は単行
  if (text.length <= 12) return text;
  // 句読点候補 (優先順位高→低)
  const breakChars = ['。', '？', '！', '、', ' ', '　'];
  const mid = text.length / 2;
  let bestIdx = -1, bestScore = Infinity;
  for (let i = 1; i < text.length - 1; i++) {
    const ch = text[i];
    const pri = breakChars.indexOf(ch);
    if (pri === -1) continue;
    // スコア = 中央からの距離 + 優先順位ペナルティ (低いほど良い)
    const score = Math.abs(i - mid) + pri * 2;
    if (score < bestScore) { bestScore = score; bestIdx = i; }
  }
  if (bestIdx < 0) return text; // 句読点なし → CSS の text-wrap:balance に任せる
  // 句読点の直後で改行 (句読点は前行に残す)
  return text.slice(0, bestIdx + 1) + '\n' + text.slice(bestIdx + 1).trimStart();
}

// キャラセリフをシネマティック表示 (UR/LR共通)
function showQuote(text) {
  const q = document.createElement("div");
  q.className = "fx-quote show";
  const broken = breakQuoteText(text);
  q.textContent = broken;
  // \n を実際の改行として表示
  q.style.whiteSpace = 'pre-line';
  stageVfx.appendChild(q);
  setTimeout(() => q.remove(), 4200);
  return q;
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
  w.textContent =
    tier === "LR" ? "👑   L E G E N D   A W A K E N E D   👑" :
    tier === "UR" ? "🌈  U  R   O B T A I N E D  🌈" :
    "✨  S S R   G E T  ✨";
  stageVfx.appendChild(w);
  setTimeout(() => w.remove(), 2800);
}

function revealChar(result) {
  const img = document.createElement("img");
  // SSR/UR/LRはズームバースト付きで登場
  const burstClass = (result.tier === "SSR" || result.tier === "UR" || result.tier === "LR") ? " burst-in" : "";
  const auraClass = result.tier === "LR" ? " lr-aura" : (result.tier === "UR" ? " ur-aura" : "");
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

// LR専用: 画面シャター(破砕)演出
async function showLegendShatter() {
  // 第1波: 中央にヒビ
  play("se-crack");
  showCrack();
  stage.classList.add("shake");
  await sleep(280);
  if (checkSkip()) { stage.classList.remove("shake"); return; }
  // 第2波: 重ねヒビ + シャター背景
  play("se-crack");
  showCrack();
  const bg = document.createElement("div");
  bg.className = "fx-shatter on";
  stageVfx.appendChild(bg);
  setTimeout(() => bg.remove(), 1200);
  await sleep(260);
  if (checkSkip()) { stage.classList.remove("shake"); return; }
  // 第3波: 画面が4分割に砕け散る
  play("se-crack");
  for (let i = 1; i <= 4; i++) {
    const s = document.createElement("div");
    s.className = "fx-shard on s" + i;
    stageVfx.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
  flash("hard");
  await sleep(500);
  stage.classList.remove("shake");
  // 破砕が収まり、ここから LR本命演出へ
}

// LEGENDテロップ (LR時・MIRACLEより大きく)
function showLegendIntro() {
  const m = document.createElement("div");
  m.className = "fx-legend-intro go";
  m.textContent = "👑  L E G E N D  👑";
  stageVfx.appendChild(m);
  setTimeout(() => m.remove(), 3000);
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

const ORB_COLOR = { R: "#6fa8ff", SR: "#c87dff", SSR: "#ffd96a", UR: "#ff5faa", LR: "#ffffff" };

// ────────────── Summon 各タイプ ──────────────

// Type Z: R/SR専用 直接登場 (脳汁演出なし、粒子少量 + 軽flash)
async function summonTypeZ(result, tier) {
  setStageTier(tier);
  showPillar(tier);
  // SSR は軽量演出枠としても使うので粒子&flashを少し強めに
  const n = tier === "SSR" ? 60 : tier === "SR" ? 35 : 18;
  const speed = tier === "SSR" ? 10 : tier === "SR" ? 8 : 6;
  particleBurst(TIER_COLORS[tier], { n, speed });
  if (tier === "SSR") flash("mid");
  else if (tier === "SR") flash("soft");
  await sleep(tier === "SSR" ? 420 : 320);
}

// Type A: オーブ昇格 (シンプル・テンポ良)
async function summonTypeA(result, tier) {
  const ladder = ["R", "SR", "SSR", "UR", "LR"];
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

// Type B: フェイク破壊 (UR/LR専用) — キャラのセリフを表示
async function summonTypeB(result, tier) {
  await sleep(300); // 開始ため
  const ladder = ["R", "SR", "SSR", "UR", "LR"];
  const stopIdx = ladder.indexOf(tier);
  const fakeIdx = Math.max(1, stopIdx - 1);
  const orb = showOrb();
  for (let i = 0; i <= fakeIdx; i++) {
    const t = ladder[i];
    orbTier(orb, t);
    setStageTier(t);
    await sleep(520); // ladder 1段あたり長め
    if (checkSkip()) { orbBurst(orb); return; }
  }
  // 偽位置で停滞 (脳汁ピーク前の静寂)
  stage.classList.add("charge-up");
  await sleep(600);
  stage.classList.remove("charge-up");
  if (checkSkip()) { orbBurst(orb); return; }
  // キャラのセリフ表示 (caption が無ければ汎用セリフ)
  const fallback = tier === "LR"
    ? "光は、まだ消えていない"
    : "貴方に、見えるだろうか";
  const quote = (result && result.caption) ? result.caption : fallback;
  showQuote(quote);
  await sleep(3000); // セリフをじっくり読ませる
  if (checkSkip()) { orbBurst(orb); return; }
  // セリフ後の静寂 (破壊直前の溜め)
  await sleep(550);
  if (checkSkip()) { orbBurst(orb); return; }
  // 破壊
  play("se-crack");
  showCrack();
  stage.classList.add("shake");
  orb.remove();
  await sleep(700);
  stage.classList.remove("shake");
  // 本tier爆発
  setStageTier(tier);
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], { n: 200, speed: 19 });
  flash(tier === "UR" ? "hard" : "mid");
  await sleep(750);
}

// Type C: スロー溜め (オーブが各色で脈動)
async function summonTypeC(result, tier) {
  const ladder = ["R", "SR", "SSR", "UR", "LR"];
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

// Type D: 流星群 (UR/LR専用)
async function summonTypeD(result, tier) {
  setStageTier("SR"); // 前半は抑えめ背景
  await sleep(300); // 開始ため
  // 1wave目: ランダム流星3本 (前兆)
  showMeteors(3, TIER_COLORS[tier][0]);
  await sleep(750);
  if (checkSkip()) return;
  // 2wave目: tier色で多め
  setStageTier(tier);
  showMeteors(tier === "LR" ? 14 : 12, TIER_COLORS[tier][0]);
  await sleep(1000);
  if (checkSkip()) return;
  // 3wave目: 白い大流星 + リング (ため開始)
  showMeteors(tier === "LR" ? 22 : 18, "#ffffff");
  showRing();
  await sleep(1000);
  if (checkSkip()) return;
  // ため (静寂と画面震え) — セリフを同時表示して脳汁ピーク前の溜めとする
  stage.classList.add("charge-up");
  play("se-summon");
  if (result && result.caption) {
    showQuote(result.caption);
    await sleep(2800); // セリフをじっくり読ませる (charge-up と同時進行)
  } else {
    await sleep(1100);
  }
  stage.classList.remove("charge-up");
  if (checkSkip()) return;
  // 中央衝突 (爆発)
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], { n: 220, speed: 19 });
  flash(tier === "UR" ? "hard" : "mid");
  stage.classList.add("shake");
  await sleep(550);
  stage.classList.remove("shake");
  await sleep(450);
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
  await sleep(350); // 開始ため
  const [c1, c2] = TIER_COLORS[tier];
  const bars = showCutin(c1, c2 || c1);
  await sleep(900); // バーが画面中央でホールド
  if (checkSkip()) { cutinExit(bars); return; }
  // ため (バーが交差した状態で静寂、charge-up) — UR/LR ならセリフ同期
  stage.classList.add("charge-up");
  play("se-summon");
  if ((tier === "UR" || tier === "LR") && result && result.caption) {
    showQuote(result.caption);
    await sleep(2800);
  } else {
    await sleep(800);
  }
  stage.classList.remove("charge-up");
  if (checkSkip()) { cutinExit(bars); return; }
  // 衝突 flash + shake (大)
  flash(tier === "UR" ? "hard" : "mid");
  stage.classList.add("shake");
  await sleep(450);
  stage.classList.remove("shake");
  cutinExit(bars);
  // 本tier昇格
  showPillar(tier);
  particleBurst(TIER_COLORS[tier], { n: 200, speed: 17 });
  flash(tier === "UR" ? "hard" : "mid");
  await sleep(700);
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
  // 10連目 (tenFlag) で R/SR の場合は Type A (オーブ昇格、シンプル) で華を持たせる
  if (opts.tenFlag && (tier === "R" || tier === "SR")) return "A";
  // R/SR (通常時) は脳汁演出なし、直接登場タイプ
  if (tier === "R") return "Z";
  if (tier === "SR") return "Z";
  // SSR: 軽量寄りミックス。E(金portal)/Z(柱) は SSR 専用。A/C も SSR 用
  if (tier === "SSR") return pickWeighted({ A: 3, C: 2, E: 3, Z: 2 });
  // UR: B(キャラセリフ)/D(ため流星)/F(カットイン) の3種ローテ
  if (tier === "UR") return pickWeighted({ B: 2, D: 2, F: 1 });
  // LR: 同上
  if (tier === "LR") return pickWeighted({ B: 2, D: 2, F: 1 });
  return "Z";
}

async function summonOne(result, opts = {}) {
  const tier = result.tier;
  const isHigh = tier === "LR" || tier === "UR" || tier === "SSR";
  // 10連中途キャラは showLadder=false で昇格演出スキップ（装飾だけ出す）
  const showLadder = opts.showLadder !== false;
  setStageTier(tier);

  // ─ 溜め: SSR/UR/LRは長めの沈黙で期待感 ─
  if (isHigh) {
    stage.classList.add("charge-up");
    play("se-summon");
    await sleep(tier === "LR" ? 1200 : tier === "UR" ? 850 : 600);
    stage.classList.remove("charge-up");
    if (checkSkip()) return finalize(result);
  } else {
    play("se-summon");
    await sleep(150);
    if (checkSkip()) return finalize(result);
  }

  // ─ 昇格演出 (showLadder=trueの時のみ、SSR以上) ─
  if (showLadder && isHigh) {
    const type = pickSummonType(tier, opts);
    console.log(`[Summon] tier=${tier} type=${type} ladder=on`);
    const fn = { A: summonTypeA, B: summonTypeB, C: summonTypeC, D: summonTypeD, E: summonTypeE, F: summonTypeF, Z: summonTypeZ }[type] || summonTypeA;
    await fn(result, tier);
    if (checkSkip()) return finalize(result);
    // UR/LR のセリフは各 summonType の charge-up タイミングで表示済み (B/D/F)
    // LR確定なら昇格後に画面を砕く(超レア感の決定打)
    if (tier === "LR") {
      await showLegendShatter();
      if (checkSkip()) return finalize(result);
    }
  } else if (!showLadder && isHigh) {
    // 10連中途のSSR/UR: 装飾のみ発火 (昇格なし)
    setStageTier(tier);
    showPillar(tier);
    particleBurst(TIER_COLORS[tier], { n: tier === "UR" ? 120 : 80, speed: tier === "UR" ? 15 : 12 });
    flash(tier === "UR" ? "hard" : "mid");
    await sleep(400);
  } else if (showLadder && opts.tenFlag && (tier === "R" || tier === "SR")) {
    // 10連目が R/SR の場合は Type A (オーブ昇格) で華やかに
    console.log(`[Summon] tier=${tier} type=A (10連目フィナーレ)`);
    await summonTypeA(result, tier);
  } else {
    // R/SR (通常): Type Z (シンプル登場)
    await summonTypeZ(result, tier);
  }
  if (checkSkip()) return finalize(result);

  // ────────── レア度別の追加派手演出 ──────────
  if (tier === "LR") {
    // ━━━ 超超脳汁 LEGEND 専用フルコース ━━━
    // UR と似るがすべての時間と量を増幅、さらに LEGEND テロップ
    showRainbowBg(7500);
    showGodRays(true, 7500);
    showRaysDown("rgba(255,255,255,0.9)", 14, 7000);
    showFountain(["#ff5faa", "#ffd84d", "#5fffd4", "#7ea8ff", "#c87dff", "#ffffff"], 150, 6000);
    startStars(6500);
    showConfetti(120, 6000);
    showHalo();
    // LEGEND テロップ
    setTimeout(() => showLegendIntro(), 80);
    // 7連波紋
    for (let i = 0; i < 7; i++) {
      setTimeout(() => showRing(), i * 140);
    }
    // fanfare 3重
    play("se-fanfare");
    setTimeout(() => play("se-fanfare"), 160);
    setTimeout(() => play("se-fanfare"), 320);
    flash("hard");
    setTimeout(() => flash("hard"), 500);
    // 4連シェイク
    stage.classList.add("shake");
    setTimeout(() => stage.classList.remove("shake"), 450);
    setTimeout(() => stage.classList.add("shake"), 600);
    setTimeout(() => stage.classList.remove("shake"), 1050);
    setTimeout(() => stage.classList.add("shake"), 1200);
    setTimeout(() => stage.classList.remove("shake"), 1650);
    setTimeout(() => stage.classList.add("shake"), 1800);
    setTimeout(() => stage.classList.remove("shake"), 2200);
    // ズームイン (LRは2回)
    stage.classList.add("zoom-in");
    setTimeout(() => stage.classList.remove("zoom-in"), 600);
    setTimeout(() => stage.classList.add("zoom-in"), 800);
    setTimeout(() => stage.classList.remove("zoom-in"), 1400);
    await sleep(700);
  } else if (tier === "UR") {
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
  const isLow = result.tier === "R" || result.tier === "SR";
  revealChar(result);
  // キャラ名プレートを少し遅れて (burst-inとタイミング合わせる)
  await sleep(isHigh ? 550 : isLow ? 220 : 300);
  showCharName(result);
  // 獲得テロップ
  if (result.tier === "LR") {
    await sleep(400);
    showWin("LR");
  } else if (result.tier === "UR") {
    await sleep(300);
    showWin("UR");
  } else if (result.tier === "SSR") {
    await sleep(200);
    showWin("SSR");
  }
  // 余韻: SSR/URは表示しっぱなし→キー押下で進行
  if (isHigh) {
    // 最低限の余韻は確保（テロップ類が落ち着くまで）
    await sleep(result.tier === "LR" ? 1800 : result.tier === "UR" ? 1400 : 1000);
    showContinueHint();
    await waitForKey();
  } else {
    await sleep(isLow ? 650 : 900);
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
  const order = { R: 0, SR: 1, SSR: 2, UR: 3, LR: 4 };
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
  // 一度クリックしたら 10連終了まで「スキップモード」を維持。
  // SSR以上だけは演出を完走するが、終了後も skip モードは保持し、後続R/SRは飛ばす。
  let tenSkipMode = false;
  if (checkSkip()) tenSkipMode = true;
  // SSR以上が一切無いなら即終了
  const hasHighRareInSequence = sequenced.some(r => order[r.tier] >= 2);
  if (tenSkipMode && !hasHighRareInSequence) {
    closeStage(); showResult(results, best); busy = false; return;
  }

  // 前9体: showLadder=false (昇格演出なし、装飾のみ)
  //   skip中でも SSR以上は演出を見せる (R/SR は skip 対象)
  for (let i = 0; i < sequenced.length - 1; i++) {
    clearStage();
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    // ループ中にクリックされたら以降ずっと skip モード
    if (skipRequested) tenSkipMode = true;
    const t = sequenced[i].tier;
    const isHighRare = order[t] >= 2;  // SSR以上
    if (isHighRare) {
      // 高レア演出は skip 状態を一時クリアして完走させる
      skipRequested = false;
      await summonOne(sequenced[i], { showLadder: false });
      skipRequested = false;  // 内部 short-circuit 用フラグだけリセット
      // tenSkipMode は維持 → 後続R/SRも飛ばし続ける
    } else {
      // R/SR: skip モード中なら summonOne を呼ばず即座に次へ
      if (tenSkipMode) continue;
      await summonOne(sequenced[i], { showLadder: false });
    }
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

  // 10連最後が SSR 以上ならクリック待機 (リザルト自動移行を抑止)
  if (order[best.tier] >= 2) {
    skipRequested = false;
    showHintTap();
    while (!skipRequested) await sleep(80);
    hideHintTap();
  }

  closeStage();
  showResult(results, best);
  busy = false;
}

function showHintTap() {
  let h = document.getElementById("fx-hint-tap");
  if (!h) {
    h = document.createElement("div");
    h.id = "fx-hint-tap";
    h.textContent = "タップで結果へ";
    h.style.cssText = "position:fixed;bottom:36px;left:50%;transform:translateX(-50%);z-index:99998;color:rgba(255,255,255,0.9);font:600 16px/1 sans-serif;letter-spacing:0.2em;text-shadow:0 0 12px rgba(0,0,0,0.8);padding:10px 24px;background:rgba(0,0,0,0.4);border-radius:999px;border:1px solid rgba(255,255,255,0.3);pointer-events:none;animation:fx-hint-pulse 1.4s ease-in-out infinite;";
    document.body.appendChild(h);
    if (!document.getElementById("fx-hint-tap-style")) {
      const s = document.createElement("style");
      s.id = "fx-hint-tap-style";
      s.textContent = "@keyframes fx-hint-pulse{0%,100%{opacity:0.55}50%{opacity:1}}";
      document.head.appendChild(s);
    }
  }
}
function hideHintTap() {
  const h = document.getElementById("fx-hint-tap");
  if (h) h.remove();
}

function showResult(results, best) {
  const grid = $("#result-grid");
  grid.innerHTML = "";
  // 最高レアを最後にソート(結果確認しやすい)
  const order = { R: 0, SR: 1, SSR: 2, UR: 3, LR: 4 };
  const sorted = [...results].sort((a, b) => order[a.tier] - order[b.tier]);
  sorted.forEach(r => {
    const c = document.createElement("div");
    c.className = "rcard " + r.tier.toLowerCase();
    c.style.backgroundImage = `url('${r.img}')`;
    c.style.cursor = 'pointer';
    c.addEventListener('click', () => showCharDetail(r));
    if (r.isNew) {
      const nb = document.createElement("div");
      nb.className = "rcard-new";
      nb.textContent = "NEW";
      c.appendChild(nb);
    } else if (r.dupGained) {
      // 凸獲得バッジ (NEWでない場合のみ)
      const db = document.createElement("div");
      db.className = "rcard-dup";
      db.textContent = `+${r.dupGained}凸`;
      c.appendChild(db);
    }
    const nm = document.createElement("div");
    nm.className = "rcard-name"; nm.textContent = r.name;
    c.appendChild(nm);
    grid.appendChild(c);
  });
  const hasLR = results.some(r => r.tier === "LR");
  const hasUR = results.some(r => r.tier === "UR");
  const hasSSR = results.some(r => r.tier === "SSR");
  const nLR = results.filter(r => r.tier === "LR").length;
  const nUR = results.filter(r => r.tier === "UR").length;
  const nSSR = results.filter(r => r.tier === "SSR").length;
  const nNew = results.filter(r => r.isNew).length;
  let title = hasLR ? `👑 LEGEND ×${nLR} 降臨!!!` :
              hasUR ? `🌈 UR ×${nUR} 確定!!` :
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
  for (const tier of ["LR", "UR", "SSR", "SR", "R"]) {
    for (const c of POOL[tier]) {
      all.push({ ...c, tier });
    }
  }
  return all;
}

function isUnlocked(c) {
  return !!state.unlockedSet[galleryKey(c)];
}

function galleryKey(c) { return c.tier + "_" + c.name; }
function isNewUnlocked(c) {
  if (!isUnlocked(c)) return false;
  return !state.galleryViewed[galleryKey(c)];
}

// 詳細画面ナビ用: 解放済みキャラの順序リストと現在index
let detailUnlockedList = [];
let detailIdx = 0;

function openGallery() {
  const grid = $("#gallery-grid");
  grid.innerHTML = "";
  const all = getAllCharactersWithTier();
  const unlockedByTier = { LR: 0, UR: 0, SSR: 0, SR: 0, R: 0 };
  const totalByTier = { LR: POOL.LR.length, UR: POOL.UR.length, SSR: POOL.SSR.length, SR: POOL.SR.length, R: POOL.R.length };
  // 解放済みキャラのみ詳細ナビ対象 (グリッド表示順と同じ)
  detailUnlockedList = all.filter(c => isUnlocked(c));
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
  $("#gallery-lr-count").textContent = `${unlockedByTier.LR}/${totalByTier.LR}`;
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
  // 詳細リスト未構築の場合 (履歴等から呼ばれた時) は解放済み全件で構築
  if (detailUnlockedList.length === 0) {
    detailUnlockedList = getAllCharactersWithTier().filter(x => isUnlocked(x));
  }
  // 渡されたキャラのindexを特定
  const idx = detailUnlockedList.findIndex(x => galleryKey(x) === galleryKey(c));
  detailIdx = idx >= 0 ? idx : 0;
  renderCharDetail(c);
  $("#char-detail").classList.add("active");
}

function renderCharDetail(c) {
  $("#char-detail-img").src = c.img;
  $("#char-detail-img").alt = c.name;
  $("#char-img-zoom-img").src = c.img; // 拡大用も同期
  const tierEl = $("#char-detail-tier");
  tierEl.textContent = c.tier;
  tierEl.className = "char-detail-tier " + c.tier.toLowerCase();
  // 名前はそのまま (ふりがな無しの方針)
  $("#char-detail-name").textContent = c.name;
  // 称号・セリフ・説明にはふりがな自動適用
  const titleEl = $("#char-detail-title");
  titleEl.innerHTML = applyFurigana(escapeHtml(c.title || ""));
  titleEl.style.display = c.title ? "" : "none";
  const capText = c.caption ? "「" + c.caption + "」" : "";
  const capEl = $("#char-detail-caption");
  capEl.innerHTML = applyFurigana(escapeHtml(capText));
  capEl.style.display = capText ? "" : "none";
  const descText = c.desc || "（ストーリーはまだ記されていない…）";
  $("#char-detail-desc").innerHTML = applyFurigana(escapeHtml(descText));
  // ナビゲーションカウンタ
  if (detailUnlockedList.length > 0) {
    $("#char-detail-counter").textContent = `${detailIdx + 1} / ${detailUnlockedList.length}`;
  } else {
    $("#char-detail-counter").textContent = "";
  }
  // 凸表示 (tierバッジ横に「N凸 / Max M凸」)
  renderCharDup(c);
  // 関連キャラ表示
  renderCharRelations(c);
  // 詳細画面を開いたら拡大は解除
  $("#char-img-zoom").classList.remove("active");
  // 閲覧マーク(NEWを消す)
  state.galleryViewed[galleryKey(c)] = true;
  saveState();
}

function renderCharDup(c) {
  const el = $("#char-detail-dup");
  if (!el) return;
  const key = c.tier + "_" + c.name;
  const cur = state.dupCounts[key] || 0;
  const max = MAX_DUPS[c.tier] || 0;
  const totalLevels = max + 1; // Lv1=初回 + N凸
  const currentLv = cur + 1;
  const loreList = LORE_BY_KEY[key] || []; // Lv.2〜Lv.5の{title,body}配列
  el.innerHTML = `
    <div class="dup-bar">
      <span class="dup-current">${cur}凸</span>
      <span class="dup-sep">/</span>
      <span class="dup-max">最大 ${max}凸</span>
    </div>
    <div class="dup-levels">
      ${Array.from({ length: totalLevels }, (_, i) => {
        const lv = i + 1;
        const unlocked = lv <= currentLv;
        const lore = lv >= 2 ? loreList[lv - 2] : null;
        const hasLore = !!(lore && unlocked);
        const headLabel = unlocked
          ? (lv === 1
              ? '基本情報 解放'
              : (lore ? `秘話・${lore.title}` : `秘話 Lv.${lv} (準備中)`))
          : `${lv - 1}凸で解放`;
        const bodyHtml = hasLore
          ? `<div class="dup-lv-body">${applyFurigana(escapeHtml(lore.body))}</div>`
          : '';
        const classes = [
          'dup-lv',
          unlocked ? 'unlocked' : 'locked',
          hasLore ? 'has-lore' : '',
        ].filter(Boolean).join(' ');
        return `<div class="${classes}" ${hasLore ? `data-lore-idx="${lv}"` : ''}>
          <div class="dup-lv-head">
            <span class="dup-lv-num">Lv.${lv}</span>
            <span class="dup-lv-text">${headLabel}</span>
            ${hasLore ? '<span class="dup-lv-toggle">▼</span>' : ''}
          </div>
          ${bodyHtml}
        </div>`;
      }).join('')}
    </div>
  `;
  // アコーディオン: 秘話ヘッダクリックで展開トグル
  el.querySelectorAll('.dup-lv.has-lore').forEach(row => {
    const head = row.querySelector('.dup-lv-head');
    if (!head) return;
    head.addEventListener('click', () => {
      row.classList.toggle('expanded');
    });
  });
}

function renderCharRelations(c) {
  const container = $("#char-detail-relations");
  const related = []; // { other, otherRole, color, relType }
  for (const r of RELATIONS) {
    let other = null, otherRole = '';
    if (r.a === c.name) {
      other = r.b;
      // 相手(b)の役割 → directionalならbRole、双方向ならlabel
      otherRole = r.bRole || r.label || '';
    } else if (r.b === c.name) {
      other = r.a;
      otherRole = r.aRole || r.label || '';
    } else continue;
    const otherChar = getCharByName(other);
    if (!otherChar) continue;
    const style = REL_STYLE[r.type] || REL_STYLE.fellow;
    related.push({ otherChar, otherRole, color: style.color, type: r.type });
  }
  if (related.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  container.style.display = '';
  container.innerHTML = `
    <div class="rel-head">関連するキャラ</div>
    <div class="rel-list">
      ${related.map(rel => {
        const unlocked = isUnlocked(rel.otherChar);
        const img = unlocked ? rel.otherChar.img : '';
        const name = unlocked ? rel.otherChar.name : '???';
        const clickable = unlocked ? 'clickable' : 'locked';
        return `<div class="rel-item ${clickable}" data-name="${rel.otherChar.name}">
          <div class="rel-thumb ${rel.otherChar.tier.toLowerCase()}" ${img ? `style="background-image:url('${img}')"` : ''}>
            ${!unlocked ? '<span>?</span>' : ''}
          </div>
          <div class="rel-info">
            <div class="rel-role" style="color:${rel.color}">${rel.otherRole}</div>
            <div class="rel-name">${name}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
  container.querySelectorAll('.rel-item.clickable').forEach(el => {
    el.addEventListener('click', () => {
      const name = el.dataset.name;
      const c = getCharByName(name);
      if (c && isUnlocked(c)) showCharDetail(c);
    });
  });
}

function navCharDetail(delta) {
  if (detailUnlockedList.length === 0) return;
  detailIdx = (detailIdx + delta + detailUnlockedList.length) % detailUnlockedList.length;
  renderCharDetail(detailUnlockedList[detailIdx]);
}

// ═════════════ 相関図 ═════════════
// 派閥 (faction) ごとに島状配置。座標は SVG viewBox 2000x1400 内の絶対座標
// yomi: ふりがな (派閥名上に小さく表示)
const FACTIONS = [
  { id: 'genso',   label: '原虹・観測者',     yomi: 'げんそう・かんそくしゃ', x: 1000, y:  170, color: '#fff8d4' },
  { id: 'rulers',  label: '十国の覇者',       yomi: 'じっこくのはしゃ',     x: 1000, y:  500, color: '#ffd97a' },
  { id: 'church',  label: '白焔教会',          yomi: 'はくえんきょうかい',   x:  280, y:  260, color: '#e3f0ff' },
  { id: 'dragon',  label: '紫竜王国',          yomi: 'しりゅうおうこく',     x:  280, y:  600, color: '#d6c5ff' },
  { id: 'redwing', label: '紅翼皇家',          yomi: 'こうよくこうか',       x:  280, y:  970, color: '#ffc0c0' },
  { id: 'yakai',   label: '夜焔郷・影衆',      yomi: 'やえんごう・かげしゅう', x: 1720, y:  260, color: '#ffaaaa' },
  { id: 'wolf',    label: '月牙狼族',          yomi: 'げつがろうぞく',       x: 1720, y:  520, color: '#cccccc' },
  { id: 'forest',  label: '深緑樹海',          yomi: 'しんりょくじゅかい',   x: 1720, y:  760, color: '#b8e0b0' },
  { id: 'silver',  label: '銀霜王国',          yomi: 'ぎんそうおうこく',     x: 1720, y: 1010, color: '#cce0ff' },
  { id: 'tower',   label: '黒曜塔',            yomi: 'こくようとう',         x:  600, y: 1230, color: '#a0a0c0' },
  { id: 'seventh', label: '第七天',            yomi: 'だいしちてん',         x: 1000, y:  830, color: '#ffb070' },
  { id: 'academy', label: '星霊学院',          yomi: 'せいれいがくいん',     x: 1400, y: 1230, color: '#b0d0ff' },
];

// キャラの所属派閥マップ (name → factionId, dx, dy: 派閥中心からの相対オフセット)
const CHAR_FACTION = {
  // 原虹・観測者
  '虹意 プリズマ':   { f: 'genso',   dx:    0, dy:    0 },
  'セラフィエル':    { f: 'genso',   dx: -130, dy:   80 },
  '千夜姫 カグヤ':   { f: 'genso',   dx:  130, dy:   80 },
  '星海のノクス':    { f: 'genso',   dx:    0, dy:  130 },
  // 十国の覇者
  '龍帝 アルテミス': { f: 'rulers',  dx:  -90, dy:    0 },
  '焔帝 ヒノオウ':   { f: 'rulers',  dx:   90, dy:    0 },
  // 白焔教会
  'イザベル':        { f: 'church',  dx:    0, dy:  -60 },
  'セラフィ':        { f: 'church',  dx: -100, dy:   60 },
  'メイリ':          { f: 'church',  dx:    0, dy:  100 },
  '詠聖 ベル':       { f: 'church',  dx:  100, dy:   60 },
  // 紫竜王国
  '竜爵 ヴィル':     { f: 'dragon',  dx:  -60, dy:    0 },
  'リリム':          { f: 'dragon',  dx:   60, dy:   80 },
  // 紅翼皇家
  'ひなた':          { f: 'redwing', dx:    0, dy:  -70 },
  '紅翼 ツキ':       { f: 'redwing', dx: -110, dy:   40 },
  '薫音':            { f: 'redwing', dx:  110, dy:   40 },
  '黒刃 玄':         { f: 'redwing', dx:    0, dy:  120 },
  // 夜焔郷
  '朱音':            { f: 'yakai',   dx:    0, dy:  -60 },
  '影刃 シン':       { f: 'yakai',   dx:  -90, dy:   80 },
  'こはね':          { f: 'yakai',   dx:   90, dy:   80 },
  // 月牙狼族
  '獣牙 ガルド':     { f: 'wolf',    dx:    0, dy:    0 },
  // 深緑樹海
  '森の射手 リナエ': { f: 'forest',  dx:  -70, dy:    0 },
  'ヴィオラ':        { f: 'forest',  dx:   70, dy:   70 },
  // 銀霜王国
  '仮面騎士 シオン': { f: 'silver',  dx:  -70, dy:    0 },
  'ルミナ':          { f: 'silver',  dx:   70, dy:   70 },
  // 黒曜塔
  '黒猫 ノア':       { f: 'tower',   dx:    0, dy:    0 },
  // 第七天
  '焔舞 ヒナカ':     { f: 'seventh', dx:    0, dy:    0 },
  // 星霊学院
  'ちさと':          { f: 'academy', dx: -100, dy:  -50 },
  'カイ':            { f: 'academy', dx:    0, dy:  -75 },
  'アルス':          { f: 'academy', dx:  -65, dy:   60 },
  'ミレイア':        { f: 'academy', dx:   75, dy:   60 },
};
// 注: こはね は 夜焔郷 配置 (1か所のみ)。星霊学院との関連は線で表現

// 関係性データ
// type: fellow(戦友,双方向) / master(a=師→b=弟子) / blood(血縁,双方向) / childhood(幼馴染,双方向)
//       / admire(a=憧れる人→b=憧れられる人) / rival(好敵手,双方向) / sister(a=姉→b=妹分)
// 双方向: label を1つ (中央表示)
// 方向あり: aRole/bRole を各端のキャラ寄りに表示
const RELATIONS = [
  // 観測者三姉妹
  { a: 'セラフィエル',    b: '千夜姫 カグヤ',     type: 'fellow', label: '三柱' },
  { a: '千夜姫 カグヤ',   b: '星海のノクス',      type: 'fellow', label: '三柱' },
  { a: 'セラフィエル',    b: '星海のノクス',      type: 'fellow', label: '三柱' },
  // プリズマ → セラフィエル
  { a: '虹意 プリズマ',   b: 'セラフィエル',      type: 'master', aRole: '主', bRole: '我が羽' },
  // 二大覇者
  { a: '龍帝 アルテミス', b: '焔帝 ヒノオウ',     type: 'fellow', label: '戦友' },
  // 白焔教会
  { a: 'イザベル',        b: 'セラフィエル',      type: 'admire', aRole: '仰ぐ', bRole: '我が神' },
  { a: 'イザベル',        b: 'メイリ',            type: 'sister', aRole: '姉', bRole: '妹' },
  { a: 'セラフィ',        b: 'メイリ',            type: 'fellow', label: '同期' },
  { a: 'セラフィ',        b: '詠聖 ベル',         type: 'fellow', label: '相方' },
  // 紫竜
  { a: '竜爵 ヴィル',     b: 'リリム',            type: 'master', aRole: '師', bRole: '弟子' },
  { a: '竜爵 ヴィル',     b: 'リリム',            type: 'blood',  label: '従姉妹' },
  { a: '龍帝 アルテミス', b: '竜爵 ヴィル',       type: 'blood',  label: '遠縁' },
  { a: '龍帝 アルテミス', b: 'リリム',            type: 'blood',  label: '遠縁' },
  // 紅翼皇家
  { a: '紅翼 ツキ',       b: 'ひなた',            type: 'sister', aRole: '姉', bRole: '末妹' },
  { a: '薫音',            b: 'ひなた',            type: 'master', aRole: '剣師', bRole: '弟子' },
  { a: '薫音',            b: '紅翼 ツキ',         type: 'master', aRole: '剣師', bRole: '弟子' },
  { a: '黒刃 玄',         b: '薫音',              type: 'fellow', label: '兄弟子' },
  { a: 'ひなた',          b: '龍帝 アルテミス',   type: 'admire', aRole: '慕う', bRole: 'おにーさま' },
  // 夜焔郷
  { a: '朱音',            b: 'こはね',            type: 'sister', aRole: '姉', bRole: '拾い妹' },
  { a: '影刃 シン',       b: 'こはね',            type: 'master', aRole: '先輩', bRole: '後輩' },
  { a: '千夜姫 カグヤ',   b: '朱音',              type: 'blood',  label: '九尾' },
  // 月牙
  { a: '獣牙 ガルド',     b: '竜爵 ヴィル',       type: 'fellow', label: '戦友' },
  // 深緑
  { a: '森の射手 リナエ', b: 'ヴィオラ',          type: 'master', aRole: '師', bRole: '後輩' },
  { a: '森の射手 リナエ', b: '影刃 シン',         type: 'rival',  label: '好敵手' },
  // 銀霜
  { a: 'イザベル',        b: '仮面騎士 シオン',   type: 'childhood', label: '幼馴染' },
  // 黒曜塔
  { a: '黒猫 ノア',       b: '星海のノクス',      type: 'admire', aRole: '憧れ', bRole: '師と仰ぐ' },
  { a: '黒猫 ノア',       b: 'こはね',            type: 'sister', aRole: '姉分', bRole: '妹分' },
  // 第七天
  { a: '焔帝 ヒノオウ',   b: '焔舞 ヒナカ',       type: 'master', aRole: '師', bRole: '愛弟子' },
  { a: '朱音',            b: '焔舞 ヒナカ',       type: 'fellow', label: '焔姉妹' },
  // 星霊学院
  { a: 'カイ',            b: 'ちさと',            type: 'admire', aRole: '想い', bRole: '想い人' },
  { a: 'ちさと',          b: 'ミレイア',          type: 'fellow', label: '同期' },
  { a: '黒刃 玄',         b: 'ミレイア',          type: 'master', aRole: '師(非公式)', bRole: '弟子' },
  { a: 'アルス',          b: '黒猫 ノア',         type: 'admire', aRole: '崇拝', bRole: '憧れの人' },
  { a: 'カイ',            b: '森の射手 リナエ',   type: 'admire', aRole: '目標', bRole: '憧れの人' },
  // 学院四人組+α (代表線のみ、密度抑制)
  { a: 'カイ',            b: 'アルス',            type: 'fellow', label: '四人組' },
  { a: 'アルス',          b: 'ミレイア',          type: 'fellow', label: '四人組' },
  // desc点検追加
  { a: 'ルミナ',          b: 'イザベル',          type: 'fellow', label: '情報交換' },
  { a: '詠聖 ベル',       b: 'メイリ',            type: 'fellow', label: '親友' },
  { a: '影刃 シン',       b: '朱音',              type: 'fellow', label: '別組織協力' },
];

const REL_STYLE = {
  fellow:    { color: '#5fffaa', dash: 'none',     w: 2.5, directed: false },
  master:    { color: '#ffd84d', dash: 'none',     w: 2.5, directed: true  }, // a=師 → b=弟子
  blood:     { color: '#ff5faa', dash: 'none',     w: 2.5, directed: false },
  childhood: { color: '#c87dff', dash: 'none',     w: 2.5, directed: false },
  admire:    { color: '#7ea8ff', dash: '6,4',      w: 1.8, directed: true  }, // a=憧れる人 → b=憧れられる人
  rival:     { color: '#ff8855', dash: '2,3',      w: 2.0, directed: false },
  sister:    { color: '#ff9fd0', dash: 'none',     w: 2.0, directed: true  }, // a=姉 → b=妹分
};

function getCharByName(name) {
  for (const tier of ['LR','UR','SSR','SR','R']) {
    const c = POOL[tier].find(x => x.name === name);
    if (c) return { ...c, tier };
  }
  return null;
}

function openRelations() {
  const canvas = document.getElementById('relations-canvas');
  // SVG構築
  const W = 2000, H = 1400;
  const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <defs>${renderArrowMarkers()}</defs>
    ${renderFactionBg()}
    ${renderRelationLines()}
    ${renderFactionLabels()}
    ${renderCharNodes()}
  </svg>`;
  canvas.innerHTML = svg;
  document.getElementById('relations').classList.add('active');

  // クリックでキャラ詳細にジャンプ (ドラッグと区別するため移動量チェック)
  // 相関図は背後に残す → 詳細を閉じたら相関図に戻る
  canvas.querySelectorAll('[data-char-name]').forEach(el => {
    el.addEventListener('click', e => {
      if (relationsDragMoved) return; // ドラッグ後の偽クリックを無視
      const name = el.dataset.charName;
      const c = getCharByName(name);
      if (c && isUnlocked(c)) {
        if (detailUnlockedList.length === 0) {
          detailUnlockedList = getAllCharactersWithTier().filter(x => isUnlocked(x));
        }
        showCharDetail(c);
      }
    });
  });

  // 初期位置: 中央寄せ (派閥中心 800,550 が見えるように)
  setTimeout(() => {
    const sw = canvas.scrollWidth, sh = canvas.scrollHeight;
    canvas.scrollLeft = (sw - canvas.clientWidth) / 2;
    canvas.scrollTop = (sh - canvas.clientHeight) / 2;
  }, 0);

  bindRelationsPan(canvas);
}

// ドラッグでパン
let relationsPanActive = false, relationsDragMoved = false;
let relPanStartX = 0, relPanStartY = 0, relPanScrollX = 0, relPanScrollY = 0;
let relationsPanBound = false;

function bindRelationsPan(canvas) {
  if (relationsPanBound) return;
  relationsPanBound = true;

  const start = (e) => {
    // キャラサムネ上で押した時もパン開始可 (移動量で判別)
    if (e.type === 'mousedown' && e.button !== 0) return;
    relationsPanActive = true;
    relationsDragMoved = false;
    const isTouch = e.type === 'touchstart';
    const x = isTouch ? e.touches[0].clientX : e.clientX;
    const y = isTouch ? e.touches[0].clientY : e.clientY;
    relPanStartX = x; relPanStartY = y;
    relPanScrollX = canvas.scrollLeft; relPanScrollY = canvas.scrollTop;
    canvas.style.cursor = 'grabbing';
  };
  const move = (e) => {
    if (!relationsPanActive) return;
    const isTouch = e.type === 'touchmove';
    const x = isTouch ? e.touches[0].clientX : e.clientX;
    const y = isTouch ? e.touches[0].clientY : e.clientY;
    const dx = x - relPanStartX, dy = y - relPanStartY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) relationsDragMoved = true;
    if (relationsDragMoved) {
      canvas.scrollLeft = relPanScrollX - dx;
      canvas.scrollTop = relPanScrollY - dy;
      if (isTouch) e.preventDefault();
    }
  };
  const end = () => {
    relationsPanActive = false;
    canvas.style.cursor = 'grab';
    setTimeout(() => { relationsDragMoved = false; }, 30);
  };

  canvas.addEventListener('mousedown', start);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, {passive: true});
  document.addEventListener('touchmove', move, {passive: false});
  document.addEventListener('touchend', end);
  canvas.style.cursor = 'grab';
}

function closeRelations() {
  document.getElementById('relations').classList.remove('active');
}

function getCharPos(name) {
  const meta = CHAR_FACTION[name];
  if (!meta) return null;
  const f = FACTIONS.find(x => x.id === meta.f);
  if (!f) return null;
  return { x: f.x + meta.dx, y: f.y + meta.dy };
}

function renderFactionBg() {
  return FACTIONS.map(f => {
    // 派閥領域を半透明の背景円で示す (新スケールに合わせ半径175)
    const r = 175;
    return `<circle cx="${f.x}" cy="${f.y + 40}" r="${r}" fill="${f.color}" fill-opacity="0.06" stroke="${f.color}" stroke-opacity="0.25" stroke-width="1.5" stroke-dasharray="4,4"/>`;
  }).join('');
}

function renderFactionLabels() {
  return FACTIONS.map(f => {
    const yomiTxt = f.yomi
      ? `<text x="${f.x}" y="${f.y - 137}" text-anchor="middle" fill="${f.color}" font-size="11" letter-spacing="2" opacity="0.7" style="text-shadow: 0 0 6px rgba(0,0,0,0.8)">${f.yomi}</text>`
      : '';
    return `${yomiTxt}<text x="${f.x}" y="${f.y - 115}" text-anchor="middle" fill="${f.color}" font-size="22" font-weight="700" letter-spacing="2" style="text-shadow: 0 0 8px rgba(0,0,0,0.8)">${f.label}</text>`;
  }).join('');
}

// 各タイプ用の矢印マーカー定義
function renderArrowMarkers() {
  const directedTypes = Object.entries(REL_STYLE).filter(([_, s]) => s.directed);
  return directedTypes.map(([type, s]) => `
    <marker id="arrow-${type}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${s.color}" fill-opacity="0.85"/>
    </marker>
  `).join('');
}

function renderRelationLines() {
  const lines = [];
  // 同じペア(a,b)を持つ関係をグループ化 → 上下に振り分けて重なり回避
  const pairGroups = {};
  RELATIONS.forEach((r, idx) => {
    const key = [r.a, r.b].sort().join('|');
    if (!pairGroups[key]) pairGroups[key] = [];
    pairGroups[key].push({ ...r, _idx: idx });
  });

  for (const [, rels] of Object.entries(pairGroups)) {
    const hasDirectional = rels.some(r => (REL_STYLE[r.type] || {}).directed);
    rels.forEach((r, i) => {
      const pa = getCharPos(r.a);
      const pb = getCharPos(r.b);
      if (!pa || !pb) return;
      const style = REL_STYLE[r.type] || REL_STYLE.fellow;
      const dash = style.dash !== 'none' ? `stroke-dasharray="${style.dash}"` : '';

      // 線の方向ベクトル + 垂直単位ベクトル
      const dxL = pb.x - pa.x, dyL = pb.y - pa.y;
      const lineLen = Math.hypot(dxL, dyL) || 1;
      const px = -dyL / lineLen, py = dxL / lineLen;

      // 同ペアでも線そのものは中央のまま (Lineが分散してると関係性が分かりにくい)
      const lineShift = 0;
      let x1 = pa.x + px * lineShift, y1 = pa.y + py * lineShift;
      let x2 = pb.x + px * lineShift, y2 = pb.y + py * lineShift;
      if (style.directed) {
        const trim = 36;
        x2 = x2 - (dxL / lineLen) * trim;
        y2 = y2 - (dyL / lineLen) * trim;
      }
      const marker = style.directed ? `marker-end="url(#arrow-${r.type})"` : '';
      lines.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${style.color}" stroke-opacity="0.65" stroke-width="${style.w}" ${dash} ${marker}/>`);

      // ラベル位置の計算
      const baseOffset = lineLen < 200 ? 26 : 14;
      const minMargin = Math.min(0.45, Math.max(0.32, 80 / lineLen));

      if (style.directed && (r.aRole || r.bRole)) {
        // 方向性ラベル: a/bを線の両側に振り分け (横線なら a=上/b=下)
        // 同ペア複数なら i に応じて回転 (内側スタックが大きくなり過ぎないよう±制御)
        const sideSign = (i % 2 === 0) ? 1 : -1;
        const sideStack = Math.floor(i / 2);
        const dirOffset = sideSign * (baseOffset + sideStack * 30);
        const tA = minMargin, tB = 1 - minMargin;
        const aPerp = dirOffset;
        const bPerp = -dirOffset;
        let ax = pa.x + dxL * tA + px * aPerp;
        let ay = pa.y + dyL * tA + py * aPerp;
        let bx = pa.x + dxL * tB + px * bPerp;
        let by = pa.y + dyL * tB + py * bPerp;
        if (r.aRole) lines.push(relLabel(ax, ay, r.aRole, style.color));
        if (r.bRole) lines.push(relLabel(bx, by, r.bRole, style.color));
      } else if (r.label) {
        // 双方向単一ラベル: 中央 + 垂直オフセット
        // 同ペアに方向性関係がある場合、その aPerp/bPerp と被らないよう更に外側へ
        const sideSign = (i % 2 === 0) ? 1 : -1;
        const sideStack = Math.floor(i / 2);
        let perp = sideSign * (baseOffset + sideStack * 30);
        if (hasDirectional) {
          // directionalの ±baseOffset と被らないよう更に外側 (+36)
          perp = sideSign * (baseOffset + 40 + sideStack * 30);
        }
        let mx = (pa.x + pb.x) / 2 + px * perp;
        let my = (pa.y + pb.y) / 2 + py * perp;
        lines.push(relLabel(mx, my, r.label, style.color));
      }
    });
  }
  return lines.join('');
}

// ラベルを背景プレート付きで描画 (アイコン被り対策で視認性確保)
function relLabel(x, y, text, color) {
  const w = text.length * 13 + 14;
  const h = 18;
  return `<g class="rel-label">
    <rect x="${x - w/2}" y="${y - h/2}" width="${w}" height="${h}" rx="4" fill="rgba(8,12,28,0.92)" stroke="${color}" stroke-opacity="0.45" stroke-width="0.8"/>
    <text x="${x}" y="${y + 4}" text-anchor="middle" fill="${color}" font-size="11" font-weight="700">${text}</text>
  </g>`;
}

function renderCharNodes() {
  const nodes = [];
  for (const [name, meta] of Object.entries(CHAR_FACTION)) {
    if (name.endsWith('_acad')) continue; // ダミーキー除外
    const c = getCharByName(name);
    if (!c) continue;
    const pos = getCharPos(name);
    if (!pos) continue;
    const unlocked = isUnlocked(c);
    const tierColor = TIER_COLORS[c.tier][0];
    const r = c.tier === 'LR' ? 36 : c.tier === 'UR' ? 32 : c.tier === 'SSR' ? 28 : 24;
    const opacity = unlocked ? 1 : 0.3;
    const cursor = unlocked ? 'pointer' : 'default';
    // 画像を clipPath で円形クリップ
    const clipId = `clip-${name.replace(/[\s ]/g, '_')}`;
    nodes.push(`
      <g data-char-name="${name}" style="cursor:${cursor}; opacity:${opacity}">
        <defs>
          <clipPath id="${clipId}"><circle cx="${pos.x}" cy="${pos.y}" r="${r}"/></clipPath>
        </defs>
        <circle cx="${pos.x}" cy="${pos.y}" r="${r + 3}" fill="${tierColor}" stroke="${tierColor}" stroke-width="2"/>
        ${unlocked ? `<image href="${c.img}" x="${pos.x - r}" y="${pos.y - r}" width="${r*2}" height="${r*2}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>`
                    : `<circle cx="${pos.x}" cy="${pos.y}" r="${r}" fill="#222"/><text x="${pos.x}" y="${pos.y + 6}" text-anchor="middle" fill="#888" font-size="16">?</text>`}
        <text x="${pos.x}" y="${pos.y + r + 16}" text-anchor="middle" fill="#fff" font-size="12" font-weight="700" style="text-shadow: 0 0 6px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)">${unlocked ? name : '???'}</text>
      </g>`);
  }
  return nodes.join('');
}

// ───── 画像拡大 (ズーム/パン対応) ─────
let zoomScale = 1, zoomTx = 0, zoomTy = 0;
let zoomMouseDown = false;
let zoomDragging = false, zoomStartX = 0, zoomStartY = 0, zoomBaseTx = 0, zoomBaseTy = 0;
const ZOOM_LEVELS = [1, 1.5, 2.5, 4];

function applyZoomTransform() {
  const img = $("#char-img-zoom-img");
  img.style.transform = `translate(${zoomTx}px, ${zoomTy}px) scale(${zoomScale})`;
  img.style.cursor = zoomScale > 1 ? "grab" : "zoom-in";
  $("#char-img-zoom-level").textContent = zoomScale.toFixed(1) + "x";
}

function resetZoom() {
  zoomScale = 1; zoomTx = 0; zoomTy = 0;
  applyZoomTransform();
}

function toggleCharImgZoom() {
  const z = $("#char-img-zoom");
  if (z.classList.contains("active")) {
    closeImgZoom();
  } else {
    resetZoom();
    z.classList.add("active");
  }
}

function closeImgZoom() {
  $("#char-img-zoom").classList.remove("active");
  resetZoom();
}

// dir: 1=拡大段階, -1=縮小段階, 0=リセット
function zoomImg(dir) {
  if (dir === 0) { resetZoom(); return; }
  const cur = ZOOM_LEVELS.findIndex(l => Math.abs(l - zoomScale) < 0.05);
  let nextIdx;
  if (cur >= 0) {
    nextIdx = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, cur + dir));
  } else {
    // 連続ズームの中間値からは最も近い段に飛ばす
    nextIdx = ZOOM_LEVELS.findIndex(l => l > zoomScale);
    if (nextIdx === -1) nextIdx = ZOOM_LEVELS.length - 1;
    if (dir < 0) nextIdx = Math.max(0, nextIdx - 1);
  }
  zoomScale = ZOOM_LEVELS[nextIdx];
  // リセット位置に戻す (中央揃え)
  if (zoomScale === 1) { zoomTx = 0; zoomTy = 0; }
  applyZoomTransform();
}

// 画像クリックで段階ズーム (デスクトップ/モバイル共通)
function onZoomImgClick(e) {
  e.stopPropagation();
  if (zoomDragging) return;
  // 1x→1.5x→2.5x→4x→1x ループ
  const cur = ZOOM_LEVELS.findIndex(l => Math.abs(l - zoomScale) < 0.05);
  const nextIdx = (cur + 1) % ZOOM_LEVELS.length;
  zoomScale = ZOOM_LEVELS[nextIdx];
  if (zoomScale === 1) { zoomTx = 0; zoomTy = 0; }
  applyZoomTransform();
}

// ドラッグで移動 (mousedown/touchstart で初めて有効化)
function onZoomDragStart(e) {
  if (zoomScale <= 1) return;
  // 左クリックのみ反応 (右クリック等を弾く)
  if (e.type === 'mousedown' && e.button !== 0) return;
  // ブラウザの画像ドラッグ(D&D)を抑止
  e.preventDefault();
  zoomMouseDown = true;
  zoomDragging = false;
  const isTouch = e.type === 'touchstart';
  const x = isTouch ? e.touches[0].clientX : e.clientX;
  const y = isTouch ? e.touches[0].clientY : e.clientY;
  zoomStartX = x; zoomStartY = y;
  zoomBaseTx = zoomTx; zoomBaseTy = zoomTy;
  const img = $("#char-img-zoom-img");
  img.style.cursor = "grabbing";
  img.style.transition = "none";  // ドラッグ中はtransition無効化(遅延防止)
}
function onZoomDragMove(e) {
  if (!zoomMouseDown) return;       // ★ 押されてない時は無視
  if (zoomScale <= 1) return;
  const isTouch = e.type === 'touchmove';
  const x = isTouch ? e.touches[0].clientX : e.clientX;
  const y = isTouch ? e.touches[0].clientY : e.clientY;
  const dx = x - zoomStartX, dy = y - zoomStartY;
  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) zoomDragging = true;
  if (zoomDragging) {
    zoomTx = zoomBaseTx + dx;
    zoomTy = zoomBaseTy + dy;
    applyZoomTransform();
    if (isTouch) e.preventDefault();
  }
}
function onZoomDragEnd() {
  zoomMouseDown = false;
  const img = $("#char-img-zoom-img");
  img.style.cursor = zoomScale > 1 ? "grab" : "zoom-in";
  img.style.transition = "";  // ドラッグ終了でtransition復活 (ボタン等のスムーズ動作)
  setTimeout(() => { zoomDragging = false; }, 30);
}

// 滑車ズーム
function onZoomWheel(e) {
  e.preventDefault();
  const dir = e.deltaY < 0 ? 0.15 : -0.15;
  const newScale = Math.max(1, Math.min(6, zoomScale + dir));
  zoomScale = newScale;
  if (zoomScale === 1) { zoomTx = 0; zoomTy = 0; }
  applyZoomTransform();
}

function closeCharDetail() {
  $("#char-detail").classList.remove("active");
  $("#char-img-zoom").classList.remove("active");
}

// ────────────── Bindings ──────────────
$("#btn-single").addEventListener("click", doSingle);
$("#btn-ten").addEventListener("click", doTen);
$("#result-close").addEventListener("click", closeResult);
$("#result-again-ten").addEventListener("click", () => {
  closeResult();
  // アニメ遷移の直後にdoTen呼出 (closeResult内で busy もクリア前提)
  setTimeout(() => doTen(), 100);
});
$("#result").addEventListener("click", e => { if (e.target.id === "result") closeResult(); });
$("#btn-gallery").addEventListener("click", openGallery);
$("#btn-relations").addEventListener("click", openRelations);

// ───── ストーリービューワー (紙芝居風) ─────
const STORY_FILES = {
  s1c1: { title: '序: 七座の使命', meta: 'Season 1 — 第1章', file: 'STORY/s1c1.md' },
};

function escapeHtml(s) {
  return String(s).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
}

// 固有名詞ふりがな辞書 (キーは長い順に処理する)
const FURIGANA = {
  // 世界観の根源
  '虹霊界': 'こうれいかい',
  '原虹': 'げんそう',
  '虹脈': 'こうみゃく',
  '影喰い': 'かげくい',
  '観測者': 'かんそくしゃ',
  '七座': 'しちざ',
  '三柱': 'みはしら',
  '大紀': 'たいき',
  '共観': 'きょうかん',
  // 派閥
  '夜焔郷': 'やえんごう',
  '紅翼皇家': 'こうよくこうか',
  '紫竜王国': 'しりゅうおうこく',
  '月牙狼族': 'げつがろうぞく',
  '深緑樹海': 'しんりょくじゅかい',
  '銀霜王国': 'ぎんそうおうこく',
  '黒曜塔': 'こくようとう',
  '白焔教会': 'はくえんきょうかい',
  '第七天': 'だいしちてん',
  '星霊学院': 'せいれいがくいん',
  '雪月神殿': 'せつげつしんでん',
  '影衆': 'かげしゅう',
  // 称号・キャラ系
  '虹意': 'こうい',
  '千夜姫': 'せんやひめ',
  '焔帝': 'えんてい',
  '龍帝': 'りゅうてい',
  '影刃': 'えいじん',
  '黒猫': 'くろねこ',
  '焔舞': 'えんぶ',
  '仮面騎士': 'かめんきし',
  '詠聖': 'えいせい',
  '紅翼': 'こうよく',
  '黒刃': 'くろは',
  '竜爵': 'りゅうしゃく',
  '獣牙': 'じゅうが',
  '聖巫騎士': 'せいふきし',
  '皇家': 'こうか',
  '皇帝': 'こうてい',
  // 武器・固有物
  '始源': 'げんそう',
  '虹天': 'こうてん',
  '紫雷': 'しらい',
  '月牙': 'げつが',
  '紅月': 'こうげつ',
  '誓盾': 'せいとん',
  '裁罰': 'さいばつ',
  // 他 (S1で出る固有名詞・難読語)
  '紅蓮': 'ぐれん',
  '九尾': 'きゅうび',
  '六翼': 'ろくよく',
  '剣術科': 'けんじゅつか',
  '弓術科': 'きゅうじゅつか',
  '魔術科': 'まじゅつか',
  '盾術': 'じゅんじゅつ',
  '魔導士': 'まどうし',
  '聖騎士': 'せいきし',
  '鈴宮': 'すずみや',
  '影衣': 'かげごろも',
  '遊芸師': 'ゆうげいし',
  '鳳凰': 'ほうおう',
  '詠唱': 'えいしょう',
  '聖槍': 'せいそう',
  '七色': 'しちしき',
  '黒月': 'こくげつ',
  // 将来章で登場予定 (Season 2 以降)
  '焔国': 'えんこく',
  '龍国': 'りゅうこく',
  '黎明祠': 'れいめいし',
  '巫女連邦': 'みこれんぽう',
  '異界の塔': 'いかいのとう',
  '古機文明': 'こきぶんめい',
  '海淵都市': 'かいえんとし',
  '古龍砂漠': 'こりゅうさばく',
  '氷霊王国': 'ひょうれいおうこく',
  '空挺城': 'くうていじょう',
  '地底市': 'ちていし',
  '黒月衆': 'こくげつしゅう',
  '沈黙の塔': 'ちんもくのとう',
};

// HTMLテキストノード内のキャラ名を <a class="char-link"> でラップ
// 詳細画面オープン用。長い候補から処理して短い名前の誤マッチ回避。
function linkifyCharNames(html) {
  if (typeof POOL === 'undefined') return html;
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  // 候補構築 (story-scene-charsと同じロジック、長い順)
  const candidates = [];
  for (const tier of ['LR','UR','SSR','SR','R']) {
    for (const c of POOL[tier]) {
      const fullName = c.name;
      const tokens = fullName.split(/[\s ]/);
      const lastToken = tokens[tokens.length - 1];
      const katakanaMatch = fullName.match(/[ァ-ヶー]+$/);
      const katakanaTail = katakanaMatch ? katakanaMatch[0] : null;
      const seenCands = new Set();
      const add = (s) => { if (s && s.length >= 2 && !seenCands.has(s)) { seenCands.add(s); candidates.push({ name: s, char: { ...c, tier } }); } };
      add(fullName);
      if (lastToken !== fullName) add(lastToken);
      if (katakanaTail && katakanaTail !== lastToken) add(katakanaTail);
    }
  }
  candidates.sort((a, b) => b.name.length - a.name.length);

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      // 長い候補から、まずプレースホルダーに置換
      const placeholders = [];
      for (const cand of candidates) {
        let parts = text.split(cand.name);
        if (parts.length === 1) continue;
        // 既にプレースホルダー(__CL_N__)と被るところはスキップしたいが、indexOfで管理
        const ph = `__CL_${placeholders.length}__`;
        placeholders.push(`<a class="char-link" data-name="${escapeHtml(cand.char.name)}">${escapeHtml(cand.name)}</a>`);
        text = parts.join(ph);
      }
      if (placeholders.length === 0) return;
      let html = escapeHtml(text);
      placeholders.forEach((p, i) => {
        html = html.split(`__CL_${i}__`).join(p);
      });
      const span = document.createElement('span');
      span.innerHTML = html;
      const frag = document.createDocumentFragment();
      while (span.firstChild) frag.appendChild(span.firstChild);
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // ruby/code/pre/aの中はスキップ
      const tag = node.tagName;
      if (tag === 'RUBY' || tag === 'CODE' || tag === 'PRE' || tag === 'A') return;
      Array.from(node.childNodes).forEach(walk);
    }
  }
  walk(tmp);
  return tmp.innerHTML;
}

// HTMLの中のテキストノードだけにふりがなを適用 (タグ内属性は対象外)
function applyFurigana(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const keys = Object.keys(FURIGANA).sort((a, b) => b.length - a.length);
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      let changed = false;
      for (const term of keys) {
        if (text.includes(term)) {
          text = text.split(term).join(` RUBY${term} `);
          changed = true;
        }
      }
      if (changed) {
        let html = text;
        for (const term of keys) {
          const yomi = FURIGANA[term];
          html = html.split(` RUBY${term} `).join(`<ruby>${term}<rt>${yomi}</rt></ruby>`);
        }
        const span = document.createElement('span');
        span.innerHTML = html;
        const frag = document.createDocumentFragment();
        while (span.firstChild) frag.appendChild(span.firstChild);
        node.parentNode.replaceChild(frag, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'RUBY' || node.tagName === 'CODE' || node.tagName === 'PRE') return;
      Array.from(node.childNodes).forEach(walk);
    }
  }
  walk(tmp);
  return tmp.innerHTML;
}
let storyOpenedAt = 0;
const STORY_KEY_GUARD_MS = 300;
let storyScenes = [];     // [{label, title, contentMd, bg}, ...]
let storyIdx = 0;
let currentStoryId = null;

async function openStory(storyId) {
  const info = STORY_FILES[storyId];
  if (!info) return;
  currentStoryId = storyId;
  $("#story-meta").textContent = info.meta;
  $("#story-title").textContent = info.title;
  $("#story-scene-content").innerHTML = '<div class="story-loading">読み込み中…</div>';
  $("#story-modal").classList.add("active");
  storyOpenedAt = Date.now();
  try {
    const resp = await fetch(info.file + '?v=' + Date.now());
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const md = await resp.text();
    storyScenes = parseStoryToScenes(md);
    storyIdx = restoreStoryProgress(storyId, storyScenes.length);
    renderScene();
  } catch (e) {
    $("#story-scene-content").innerHTML = '<div class="story-error">読み込みに失敗しました: ' + e.message + '</div>';
  }
}

// markdown を「シーン」配列に分解
// シーン = ## または ### の見出しから次の見出しまで
// # (h1) は章タイトルで「冒頭ページ」「終了ページ」に使う
function parseStoryToScenes(md) {
  const scenes = [];
  const lines = md.split('\n');
  let current = null;
  let preludeLines = [];

  function flushCurrent() {
    if (current && current.contentLines.length > 0) {
      scenes.push({
        label: current.label,
        title: current.title,
        contentMd: current.contentLines.join('\n').trim(),
        bg: current.bg,
      });
    }
  }

  for (const line of lines) {
    const h1 = line.match(/^# (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h1) {
      flushCurrent();
      current = null;
      // 章タイトルや「終」は表紙/終ページとして単独シーン化
      if (line.includes('終')) {
        scenes.push({ label: '', title: h1[1].trim(), contentMd: '*— 第1章 完 —*\n\n次章をお楽しみに。', bg: 'finale' });
      } else {
        scenes.push({ label: '', title: h1[1].trim(), contentMd: '', bg: 'cover', isCover: true });
      }
      preludeLines = [];
    } else if (h2) {
      flushCurrent();
      // メタ情報 (編集メモ・編集後記等) はストーリー本編から除外
      if (/^(編集メモ|編集後記|メモ|奥付|索引)$/.test(h2[1].trim())) {
        current = null;
        continue;
      }
      current = { label: '', title: h2[1].trim(), contentLines: [], bg: detectBg(h2[1]) };
    } else if (h3) {
      flushCurrent();
      // ### 1-1: 寮の二段ベッド → label="1-1", title="寮の二段ベッド"
      const m = h3[1].match(/^([\d\-]+):\s*(.+)/);
      const label = m ? m[1] : '';
      const title = m ? m[2] : h3[1];
      current = { label, title: title.trim(), contentLines: [], bg: detectBg(title) };
    } else if (current) {
      current.contentLines.push(line);
    } else {
      // 見出し前 = プロローグ前のメタ情報など、捨てる
    }
  }
  flushCurrent();
  return scenes;
}

// シーンタイトル/内容から背景を推定
function detectBg(text) {
  const t = String(text);
  if (/(プロローグ|序)/.test(t)) return 'prologue';
  if (/(エピローグ|月夜|宇宙|教会|プリズマ|黄昏)/.test(t)) return 'rainbow';
  if (/(影喰い|裂け目|戦闘|襲来|絶望)/.test(t)) return 'shadow';
  if (/(屋上|学院|寮|食堂|朝)/.test(t)) return 'academy';
  if (/(白い光|降臨|聖|イザベル)/.test(t)) return 'holy';
  if (/(朱音|焔|紅蓮|ひなた)/.test(t)) return 'flame';
  if (/(覚醒|虹色|プリズマ)/.test(t)) return 'rainbow';
  return 'default';
}

function renderScene() {
  if (!storyScenes.length) return;
  storyIdx = Math.max(0, Math.min(storyIdx, storyScenes.length - 1));
  const scene = storyScenes[storyIdx];
  $("#story-progress").textContent = `${storyIdx + 1} / ${storyScenes.length}`;
  $("#story-scene-label").textContent = scene.label || '';
  $("#story-scene-label").style.display = scene.label ? '' : 'none';
  // タイトル: キャラ名リンク化 + ふりがな
  const titleEl = $("#story-scene-title");
  titleEl.innerHTML = applyFurigana(linkifyCharNames(escapeHtml(scene.title)));
  let bodyHtml;
  if (typeof marked !== 'undefined' && scene.contentMd) {
    bodyHtml = marked.parse(scene.contentMd);
  } else {
    bodyHtml = scene.contentMd
      ? '<p>' + scene.contentMd.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>'
      : '';
  }
  // 本文: キャラ名リンク化 → ふりがな
  bodyHtml = linkifyCharNames(bodyHtml);
  bodyHtml = applyFurigana(bodyHtml);
  $("#story-scene-content").innerHTML = bodyHtml;
  // キャラ名リンクのクリックハンドラ
  $("#story-scene-content").querySelectorAll('.char-link').forEach(a => {
    a.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      const name = a.dataset.name;
      const c = getCharByName(name);
      if (c && isUnlocked(c)) {
        if (detailUnlockedList.length === 0) {
          detailUnlockedList = getAllCharactersWithTier().filter(x => isUnlocked(x));
        }
        showCharDetail(c);
      }
    });
  });
  $("#story-scene-title").querySelectorAll('.char-link').forEach(a => {
    a.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      const name = a.dataset.name;
      const c = getCharByName(name);
      if (c && isUnlocked(c)) {
        if (detailUnlockedList.length === 0) {
          detailUnlockedList = getAllCharactersWithTier().filter(x => isUnlocked(x));
        }
        showCharDetail(c);
      }
    });
  });
  // 登場キャラ立ち絵
  renderSceneChars(scene);
  $("#story-bg").className = 'story-bg bg-' + (scene.bg || 'default');
  $("#story-prev").disabled = storyIdx === 0;
  $("#story-next").disabled = storyIdx === storyScenes.length - 1;
  // スクロール位置リセット
  const scroll = $("#story-scroll");
  if (scroll) scroll.scrollTop = 0;
  // 進捗保存
  saveStoryProgress(currentStoryId, storyIdx);
}

// シーン本文に登場するキャラを自動検出して下部に立ち絵を並べる
function renderSceneChars(scene) {
  const container = $("#story-scene-chars");
  if (!container) return;
  // 表紙シーン (isCover=true) や本文がほぼ空の場合は表示しない
  if (scene.isCover || !scene.contentMd || scene.contentMd.trim().length < 80) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  const text = (scene.title || '') + '\n' + (scene.contentMd || '');

  // 検索候補を構築 (各キャラごとに複数の検索語)
  // 例: '竜爵 ヴィル' → ['竜爵 ヴィル', 'ヴィル']
  // 例: '星海のノクス' → ['星海のノクス', 'ノクス'] (末尾カタカナ列も追加)
  const candidates = [];
  for (const tier of ['LR','UR','SSR','SR','R']) {
    for (const c of POOL[tier]) {
      const fullName = c.name;
      const tokens = fullName.split(/[\s ]/);
      const lastToken = tokens[tokens.length - 1];
      const katakanaMatch = fullName.match(/[ァ-ヶー]+$/);
      const katakanaTail = katakanaMatch ? katakanaMatch[0] : null;
      const seenCands = new Set();
      const add = (s) => { if (s && s.length >= 2 && !seenCands.has(s)) { seenCands.add(s); candidates.push({ name: s, len: s.length, char: { ...c, tier } }); } };
      add(fullName);
      if (lastToken !== fullName) add(lastToken);
      if (katakanaTail && katakanaTail !== lastToken) add(katakanaTail);
    }
  }
  // 長い候補を先に処理 (短い候補が長い候補の一部にマッチする誤検出を防ぐ)
  candidates.sort((a, b) => b.len - a.len);

  // マッチ済み領域をマーク (重複カウント防止)
  const matched = new Array(text.length).fill(false);
  const hitsMap = new Map(); // キャラ名 → ヒット回数
  for (const cand of candidates) {
    let idx = 0;
    while ((idx = text.indexOf(cand.name, idx)) !== -1) {
      // 既にマーク済み領域に重なっていればスキップ
      let overlap = false;
      for (let i = idx; i < idx + cand.len; i++) {
        if (matched[i]) { overlap = true; break; }
      }
      if (!overlap) {
        for (let i = idx; i < idx + cand.len; i++) matched[i] = true;
        const k = cand.char.name;
        hitsMap.set(k, (hitsMap.get(k) || 0) + 1);
      }
      idx += cand.len;
    }
  }

  // tier順 → 出現回数順で並べる
  const found = [];
  const seen = new Set();
  for (const tier of ['LR','UR','SSR','SR','R']) {
    for (const c of POOL[tier]) {
      const hits = hitsMap.get(c.name) || 0;
      if (hits > 0 && !seen.has(c.name)) {
        seen.add(c.name);
        found.push({ ...c, tier, hits });
      }
    }
  }
  // 出現回数多い順、最大8体まで
  found.sort((a, b) => b.hits - a.hits);
  const top = found.slice(0, 8);
  if (top.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  container.style.display = '';
  container.innerHTML = `
    <div class="story-chars-label">このシーンに登場</div>
    <div class="story-chars-list">
      ${top.map(c => `
        <div class="story-char-thumb ${c.tier.toLowerCase()}" data-name="${escapeHtml(c.name)}" title="${escapeHtml(c.name)}">
          <div class="story-char-img" style="background-image:url('${c.img}')"></div>
          <div class="story-char-name">${escapeHtml(c.name.split(/[\s ]/).pop())}</div>
        </div>
      `).join('')}
    </div>
  `;
  container.querySelectorAll('.story-char-thumb').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation(); // ステージクリックの「次へ」を発火させない
      const name = el.dataset.name;
      const c = getCharByName(name);
      if (c && isUnlocked(c)) {
        if (detailUnlockedList.length === 0) {
          detailUnlockedList = getAllCharactersWithTier().filter(x => isUnlocked(x));
        }
        showCharDetail(c);
      }
    });
  });
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toggleStoryToc() {
  const toc = $("#story-toc");
  if (toc.classList.contains('active')) {
    toc.classList.remove('active');
  } else {
    renderStoryToc();
    toc.classList.add('active');
  }
}
function renderStoryToc() {
  const list = $("#story-toc-list");
  if (!storyScenes || storyScenes.length === 0) { list.innerHTML = ''; return; }
  list.innerHTML = storyScenes.map((scene, i) => {
    const isCurrent = i === storyIdx;
    const isCover = !!scene.isCover;
    const labelHtml = scene.label ? `<span class="story-toc-label">${escapeHtml(scene.label)}</span>` : '';
    const titleHtml = applyFurigana(escapeHtml(scene.title || ''));
    const tag = isCover ? '<span class="story-toc-tag">表紙</span>' : '';
    return `<button class="story-toc-item ${isCurrent ? 'current' : ''}" data-idx="${i}">
      ${labelHtml}<span class="story-toc-title">${titleHtml}</span>${tag}
    </button>`;
  }).join('');
  list.querySelectorAll('.story-toc-item').forEach(el => {
    el.addEventListener('click', () => {
      storyIdx = parseInt(el.dataset.idx);
      renderScene();
      toggleStoryToc();
    });
  });
  // 現在のシーンを可視位置にスクロール
  const cur = list.querySelector('.story-toc-item.current');
  if (cur) cur.scrollIntoView({ block: 'center' });
}

function storyNext() {
  if (storyIdx < storyScenes.length - 1) {
    storyIdx++;
    renderScene();
  }
}
function storyPrev() {
  if (storyIdx > 0) {
    storyIdx--;
    renderScene();
  }
}
function closeStory() {
  $("#story-modal").classList.remove("active");
}

// 進捗保存 (localStorage)
function saveStoryProgress(storyId, idx) {
  if (!storyId) return;
  try {
    const all = JSON.parse(localStorage.getItem('prism-story-progress') || '{}');
    all[storyId] = idx;
    localStorage.setItem('prism-story-progress', JSON.stringify(all));
  } catch {}
}
function restoreStoryProgress(storyId, total) {
  try {
    const all = JSON.parse(localStorage.getItem('prism-story-progress') || '{}');
    const idx = all[storyId];
    if (typeof idx === 'number' && idx >= 0 && idx < total) return idx;
  } catch {}
  return 0;
}

// ストーリーカードクリック
document.querySelectorAll('.story-card[data-story]').forEach(card => {
  card.addEventListener('click', () => openStory(card.dataset.story));
});
// 背景クリックで閉じる
$("#story-modal").addEventListener('click', e => {
  if (e.target.id === 'story-modal') closeStory();
});
// stageクリックで次へ (ボタン/キャラサムネ/キャラ名リンク等は除外)
$("#story-stage").addEventListener('click', e => {
  if (e.target.closest('.story-nav') || e.target.closest('button')) return;
  if (e.target.closest('.story-scene-chars')) return;
  if (e.target.closest('.char-link')) return;
  // テキスト選択中(マウスドラッグでハイライト)は誤発火させない
  const sel = window.getSelection && window.getSelection();
  if (sel && sel.toString().length > 0) return;
  storyNext();
});

// BGM トグル (ホーム画面用ループ再生)
const bgmAudio = document.getElementById("bgm-home");
let bgmEnabled = localStorage.getItem("prism-bgm") === "on";
function updateBgmBtn() {
  const btn = $("#btn-bgm");
  btn.textContent = bgmEnabled ? "🔊" : "🔇";
  btn.title = bgmEnabled ? "BGM OFF" : "BGM ON";
}
function setBgm(on) {
  bgmEnabled = on;
  localStorage.setItem("prism-bgm", on ? "on" : "off");
  if (on) {
    bgmAudio.volume = 0.4;
    bgmAudio.play().catch(() => {/* ユーザー操作ないと play 拒否されるが想定内 */});
  } else {
    bgmAudio.pause();
  }
  updateBgmBtn();
}
$("#btn-bgm").addEventListener("click", () => setBgm(!bgmEnabled));
updateBgmBtn();
// 設定が ON でも初回はブラウザポリシーで自動再生不可。次クリックで開始
if (bgmEnabled) {
  // ボリュームだけ準備、play は最初のユーザー操作で
  bgmAudio.volume = 0.4;
  document.addEventListener("click", function startBgmOnce() {
    if (bgmEnabled) bgmAudio.play().catch(() => {});
    document.removeEventListener("click", startBgmOnce);
  }, { once: true });
}
$("#relations").addEventListener("click", e => { if (e.target.id === "relations") closeRelations(); });
$("#gallery").addEventListener("click", e => { if (e.target.id === "gallery") closeGallery(); });
$("#char-detail").addEventListener("click", e => { if (e.target.id === "char-detail") closeCharDetail(); });

// 画像ズームのイベント
(function bindZoom(){
  const zoom = document.getElementById('char-img-zoom');
  const img = document.getElementById('char-img-zoom-img');
  if (!zoom || !img) return;
  // 背景クリックで閉じる
  zoom.addEventListener('click', e => { if (e.target === zoom) closeImgZoom(); });
  // 画像クリックで段階ズーム
  img.addEventListener('click', onZoomImgClick);
  // ブラウザ標準の画像ドラッグ(dragstart)を完全抑止
  img.addEventListener('dragstart', e => e.preventDefault());
  // ドラッグ
  img.addEventListener('mousedown', onZoomDragStart);
  document.addEventListener('mousemove', onZoomDragMove);
  document.addEventListener('mouseup', onZoomDragEnd);
  // タッチ
  img.addEventListener('touchstart', onZoomDragStart, {passive: false});
  document.addEventListener('touchmove', onZoomDragMove, {passive: false});
  document.addEventListener('touchend', onZoomDragEnd);
  // 滑車
  zoom.addEventListener('wheel', onZoomWheel, {passive: false});
})();

document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  // キャラ詳細 > 図鑑 > 結果 > ステージ の優先順で Esc処理
  if ($("#char-detail").classList.contains("active")) {
    if (e.key === "Escape") {
      // 拡大中なら拡大だけ閉じる、そうでなければ詳細閉じる
      if ($("#char-img-zoom").classList.contains("active")) {
        e.preventDefault(); $("#char-img-zoom").classList.remove("active");
      } else {
        e.preventDefault(); closeCharDetail();
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault(); navCharDetail(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault(); navCharDetail(1);
    }
    return;
  }
  if ($("#gallery").classList.contains("active")) {
    if (e.key === "Escape") { e.preventDefault(); closeGallery(); }
    return;
  }
  if ($("#relations").classList.contains("active")) {
    if (e.key === "Escape") { e.preventDefault(); closeRelations(); }
    return;
  }
  if ($("#story-modal").classList.contains("active")) {
    if (Date.now() - storyOpenedAt < STORY_KEY_GUARD_MS) return;
    const scrollEl = $("#story-scroll");
    // 目次が開いているなら Esc で目次だけ閉じる
    if ($("#story-toc").classList.contains("active")) {
      if (e.key === "Escape") { e.preventDefault(); toggleStoryToc(); return; }
    }
    if (e.key === "t" || e.key === "T") { e.preventDefault(); toggleStoryToc(); return; }
    if (e.key === "Escape") { e.preventDefault(); closeStory(); }
    else if (e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault(); storyNext();
    }
    else if (e.key === "ArrowLeft") {
      e.preventDefault(); storyPrev();
    }
    else if (e.key === " " || e.key === "ArrowDown") {
      // Space / ↓ で下スクロール (シーン送りではなく)
      e.preventDefault();
      if (scrollEl) scrollEl.scrollBy({ top: 120, behavior: 'smooth' });
    }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (scrollEl) scrollEl.scrollBy({ top: -120, behavior: 'smooth' });
    }
    else if (e.key === "PageDown") {
      e.preventDefault();
      if (scrollEl) scrollEl.scrollBy({ top: scrollEl.clientHeight * 0.85, behavior: 'smooth' });
    }
    else if (e.key === "PageUp") {
      e.preventDefault();
      if (scrollEl) scrollEl.scrollBy({ top: -scrollEl.clientHeight * 0.85, behavior: 'smooth' });
    }
    return;
  }
  if (stage.classList.contains("active") && (e.key === " " || e.key === "Escape")) {
    e.preventDefault(); skipRequested = true; return;
  }
  if ($("#result").classList.contains("active")) {
    if (Date.now() - resultOpenedAt < RESULT_KEY_GUARD_MS) return;
    if (e.key === "Escape") { e.preventDefault(); closeResult(); }
    else if (e.key === "Enter") {
      e.preventDefault(); closeResult();
      setTimeout(() => doTen(), 100);
    }
    return;
  }
  if (busy) return;
  if (e.key === " ") { e.preventDefault(); doSingle(); }
  else if (e.key === "Enter") { e.preventDefault(); doTen(); }
  else if (e.key === "g" || e.key === "G") { e.preventDefault(); openGallery(); }
});

// Init
updateHUD();

// ============================================================
// Firebase Auth & Cloud Sync (Prism Gacha アカウントシステム)
// ============================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBFSjOheMb_epwOXCjviAA_FLQFPNiED6g",
  authDomain: "task-board-fbf1e.firebaseapp.com",
  databaseURL: "https://task-board-fbf1e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "task-board-fbf1e",
  storageBucket: "task-board-fbf1e.firebasestorage.app",
  messagingSenderId: "174442724697",
  appId: "1:174442724697:web:06ac83b275780717c06048"
};
const EMAIL_DOMAIN = '@prism-gacha.internal';
let fbApp = null, fbAuth = null, fbDb = null, authUser = null;
let signupInProgress = false;
let initialAuthCheckDone = false;

try {
  if (typeof firebase !== 'undefined') {
    // 名前付きインスタンスで認証セッションを他のダッシュボードから分離
    // (同じapiKey/projectでも appName 違えば localStorage keyが分離される)
    fbApp = firebase.initializeApp(FIREBASE_CONFIG, 'prism-gacha');
    fbAuth = fbApp.auth();
    fbDb = fbApp.database();
    fbAuth.onAuthStateChanged(async (user) => {
      authUser = user;
      updateAccountButton();
      if (user && !signupInProgress) { await onAuthReady(user); }
      // admin判定も並列で (失敗してもUIには影響しない)
      checkPrismAdmin();
      // 初回auth state確定後(login or ゲスト)にprompt表示判定
      if (!initialAuthCheckDone) {
        initialAuthCheckDone = true;
        setTimeout(() => maybeShowAccountPrompt(), 1500);
      }
    });
    // Firebase SDK が読めていない等でonAuthStateChangedが発火しなくても最終フォールバック
    setTimeout(() => {
      if (!initialAuthCheckDone) {
        initialAuthCheckDone = true;
        maybeShowAccountPrompt();
      }
    }, 4000);
  } else {
    // Firebase SDK未読込: それでも既存ゲストには案内(ただしFirebase動かないので案内意味ないが念のため)
    setTimeout(() => maybeShowAccountPrompt(), 2000);
  }
} catch (e) {
  console.error('Firebase init error:', e);
}

// ────────────── nickname ↔ email 変換 ──────────────
function nicknameToEmail(nickname) {
  // 日本語nicknameを Base64URL に変換して RFC5321 compliant な email にする
  const bytes = new TextEncoder().encode(nickname);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return 'u-' + b64 + EMAIL_DOMAIN;
}

function validateNickname(n) {
  if (!n) return 'nicknameを入力してください';
  if (n.length < 1 || n.length > 20) return '1〜20文字で入力してください';
  if (/[\x00-\x1f\x7f]/.test(n)) return '制御文字は使えません';
  if (/[@\/\\.#$\[\]]/.test(n)) return '@ . / \\ # $ [ ] は使えません';
  return null;
}

function validatePassphrase(pp) {
  if (!pp) return '合言葉を入力してください';
  if (pp.length < 4) return '合言葉は4文字以上にしてください';
  if (pp.length > 15) return '合言葉は15文字以下にしてください';
  return null;
}

// ────────────── アカウント操作 ──────────────
async function doAccountSignup() {
  const nickname = $('#signup-nickname').value.trim();
  const pp1 = $('#signup-passphrase').value;
  const pp2 = $('#signup-passphrase2').value;
  const errEl = $('#signup-error');
  errEl.textContent = '';

  const e1 = validateNickname(nickname);
  if (e1) { errEl.textContent = e1; return; }
  const e2 = validatePassphrase(pp1);
  if (e2) { errEl.textContent = e2; return; }
  if (pp1 !== pp2) { errEl.textContent = '合言葉が一致しません'; return; }

  if (!fbAuth) { errEl.textContent = 'Firebase未初期化'; return; }

  const btn = document.querySelector('#account-signup .account-submit');
  btn.disabled = true; btn.textContent = '登録中…';
  signupInProgress = true;

  try {
    // nickname重複チェック (Auth前だが未認証では読めないため、Auth後に再度チェック)
    const email = nicknameToEmail(nickname);
    const cred = await fbAuth.createUserWithEmailAndPassword(email, pp1);
    await cred.user.updateProfile({ displayName: nickname });
    await cred.user.reload();
    authUser = fbAuth.currentUser;

    // nickname重複再チェック (Auth後)
    const indexSnap = await fbDb.ref('prism-gacha/_meta/userIndex/' + nickname).once('value');
    if (indexSnap.exists() && indexSnap.val() !== cred.user.uid) {
      // 重複: Auth user を削除して中止
      try { await cred.user.delete(); } catch(e){}
      errEl.textContent = 'このnicknameは既に使われています';
      return;
    }

    // userIndex登録
    await fbDb.ref('prism-gacha/_meta/userIndex/' + nickname).set(cred.user.uid);

    // ゲスト進捗(localStorage state)を無言でcloudへ移行
    const now = Date.now();
    await fbDb.ref('prism-gacha/users/' + cred.user.uid).set({
      displayName: nickname,
      createdAt: now,
      lastLoginAt: now,
      state: sanitizeStateForCloud(state),
    });

    updateAccountButton();
    closeAccountModal();
    showToast('新規登録が完了しました');
  } catch (e) {
    const code = e.code || '';
    if (code.includes('email-already-in-use')) {
      errEl.textContent = 'このnicknameは既に使われています';
    } else if (code.includes('weak-password')) {
      errEl.textContent = '合言葉が弱すぎます (6文字以上推奨)';
    } else {
      errEl.textContent = e.message || '登録に失敗しました';
    }
    console.error(e);
  } finally {
    btn.disabled = false; btn.textContent = '新規登録';
    signupInProgress = false;
  }
}

async function doAccountLogin() {
  const nickname = $('#login-nickname').value.trim();
  const pp = $('#login-passphrase').value;
  const errEl = $('#login-error');
  errEl.textContent = '';

  const e1 = validateNickname(nickname);
  if (e1) { errEl.textContent = e1; return; }
  const e2 = validatePassphrase(pp);
  if (e2) { errEl.textContent = e2; return; }

  if (!fbAuth) { errEl.textContent = 'Firebase未初期化'; return; }

  const btn = document.querySelector('#account-login .account-submit');
  btn.disabled = true; btn.textContent = 'ログイン中…';

  try {
    const email = nicknameToEmail(nickname);
    await fbAuth.signInWithEmailAndPassword(email, pp);
    closeAccountModal();
    showToast('ログインしました');
  } catch (e) {
    const code = e.code || '';
    if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential') || code.includes('invalid-login-credentials')) {
      errEl.textContent = 'nicknameまたは合言葉が違います';
    } else {
      errEl.textContent = e.message || 'ログインに失敗しました';
    }
    console.error(e);
  } finally {
    btn.disabled = false; btn.textContent = 'ログイン';
  }
}

async function doAccountLogout() {
  try {
    await fbAuth.signOut();
    showToast('ゲストに戻りました (進捗はこのブラウザに残ります)');
    closeAccountModal();
  } catch (e) {
    console.error(e);
  }
}

// ────────────── Cloud Sync ──────────────
let cloudSyncDebounceTimer = null;
const CLOUD_SYNC_DEBOUNCE = 800;

function sanitizeStateForCloud(s) {
  return {
    total: s.total || 0,
    ur: s.ur || 0,
    pity: s.pity || 0,
    history: (Array.isArray(s.history) ? s.history : []).slice(-120),
    unlockedSet: s.unlockedSet || {},
    dupCounts: s.dupCounts || {},
    galleryViewed: s.galleryViewed || {},
    storyProgress: s.storyProgress || {},
    updatedAt: Date.now(),
  };
}

async function saveStateCloud() {
  if (!authUser || !fbDb) return;
  try {
    await fbDb.ref('prism-gacha/users/' + authUser.uid + '/state').set(sanitizeStateForCloud(state));
  } catch (e) {
    console.error('saveStateCloud error:', e);
  }
}

function scheduleCloudSync() {
  if (!authUser) return;
  if (cloudSyncDebounceTimer) clearTimeout(cloudSyncDebounceTimer);
  cloudSyncDebounceTimer = setTimeout(() => {
    saveStateCloud();
  }, CLOUD_SYNC_DEBOUNCE);
}

async function onAuthReady(user) {
  if (!fbDb) return;
  try {
    const snap = await fbDb.ref('prism-gacha/users/' + user.uid).once('value');
    const cloudData = snap.val();

    if (!cloudData) {
      // 新規ユーザー(Auth作成済だがデータ未生成): localStorage state をcloudへ送信
      await fbDb.ref('prism-gacha/users/' + user.uid).set({
        displayName: user.displayName || 'Unknown',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        state: sanitizeStateForCloud(state),
      });
      return;
    }

    const cloudState = cloudData.state || {};
    const localHasProgress = (state.total || 0) > 0 && Object.keys(state.unlockedSet || {}).length > 0;
    const cloudTotal = cloudState.total || 0;
    const collision = localHasProgress && cloudTotal > 0 && !statesEqual(state, cloudState);

    if (collision) {
      // 差分あり → 無言で合算 (両者のmax/unionを取り、損失なし)
      const merged = mergeStates(state, cloudState);
      applyCloudState(merged);
      await saveStateCloud();
      showToast('データを最新化しました');
      try { await fbDb.ref('prism-gacha/users/' + user.uid + '/lastLoginAt').set(Date.now()); } catch (e) {}
      return;
    }

    // 衝突なし → cloud が優位 (cloudが空ならlocalを送る)
    if (cloudTotal > 0) {
      applyCloudState(cloudState);
    } else {
      await saveStateCloud();
    }

    try { await fbDb.ref('prism-gacha/users/' + user.uid + '/lastLoginAt').set(Date.now()); } catch (e) {}
  } catch (e) {
    console.error('onAuthReady error:', e);
  }
}

function statesEqual(a, b) {
  return (a.total || 0) === (b.total || 0)
    && Object.keys(a.unlockedSet || {}).length === Object.keys(b.unlockedSet || {}).length;
}

function applyCloudState(cs) {
  state.total = cs.total || 0;
  state.ur = cs.ur || 0;
  state.pity = cs.pity || 0;
  state.history = Array.isArray(cs.history) ? cs.history : [];
  state.galleryViewed = cs.galleryViewed || {};
  state.unlockedSet = cs.unlockedSet || {};
  state.dupCounts = cs.dupCounts || {};
  state.storyProgress = cs.storyProgress || {};
  localStorage.setItem("prism-gacha", JSON.stringify(state));
  updateHUD();
  if (typeof renderHistory === 'function') renderHistory();
}

function mergeStates(local, cloud) {
  const merged = {
    total: Math.max(local.total || 0, cloud.total || 0),
    ur: Math.max(local.ur || 0, cloud.ur || 0),
    pity: Math.max(local.pity || 0, cloud.pity || 0),
    history: [],
    unlockedSet: { ...(cloud.unlockedSet || {}), ...(local.unlockedSet || {}) },
    dupCounts: {},
    galleryViewed: { ...(cloud.galleryViewed || {}), ...(local.galleryViewed || {}) },
    storyProgress: {},
  };
  const allDupKeys = new Set([...Object.keys(local.dupCounts || {}), ...Object.keys(cloud.dupCounts || {})]);
  for (const k of allDupKeys) {
    merged.dupCounts[k] = Math.max((local.dupCounts && local.dupCounts[k]) || 0, (cloud.dupCounts && cloud.dupCounts[k]) || 0);
  }
  const combined = [...(cloud.history || []), ...(local.history || [])];
  merged.history = combined.slice(-120);
  const spKeys = new Set([...Object.keys(local.storyProgress || {}), ...Object.keys(cloud.storyProgress || {})]);
  for (const k of spKeys) {
    const l = (local.storyProgress && local.storyProgress[k]) || {};
    const c = (cloud.storyProgress && cloud.storyProgress[k]) || {};
    merged.storyProgress[k] = {
      lastSceneIndex: Math.max(l.lastSceneIndex || 0, c.lastSceneIndex || 0),
      totalScenes: Math.max(l.totalScenes || 0, c.totalScenes || 0),
      lastReadAt: Math.max(l.lastReadAt || 0, c.lastReadAt || 0),
      completed: !!(l.completed || c.completed),
    };
  }
  return merged;
}

// (衝突モーダル廃止: ログイン時に差分あれば自動合算→トースト表示)

// ────────────── UI handlers ──────────────
function showAccountModal() {
  const modal = $('#account-modal');
  if (!modal) return;
  if (authUser) {
    $('#account-guest-view').style.display = 'none';
    $('#account-logged-view').style.display = '';
    $('#account-info-nickname').textContent = authUser.displayName || '-';
    $('#account-info-total').textContent = state.total || 0;
    let urCount = 0, lrCount = 0;
    for (const k of Object.keys(state.unlockedSet || {})) {
      if (k.startsWith('UR_')) urCount++;
      else if (k.startsWith('LR_')) lrCount++;
    }
    $('#account-info-ur').textContent = `${urCount}/5`;
    $('#account-info-lr').textContent = `${lrCount}/1`;
    $('#account-info-sync').textContent = authUser.metadata && authUser.metadata.lastSignInTime
      ? new Date(authUser.metadata.lastSignInTime).toLocaleString('ja-JP')
      : '-';
  } else {
    $('#account-guest-view').style.display = '';
    $('#account-logged-view').style.display = 'none';
    switchAccountTab('login');
    setTimeout(() => { const el = $('#login-nickname'); if (el) el.focus(); }, 50);
  }
  modal.classList.add('active');
}

function closeAccountModal() {
  const modal = $('#account-modal');
  if (!modal) return;
  modal.classList.remove('active');
  const le = $('#login-error'); if (le) le.textContent = '';
  const se = $('#signup-error'); if (se) se.textContent = '';
  const lp = $('#login-passphrase'); if (lp) lp.value = '';
  const sp = $('#signup-passphrase'); if (sp) sp.value = '';
  const sp2 = $('#signup-passphrase2'); if (sp2) sp2.value = '';
}

function switchAccountTab(tab) {
  document.querySelectorAll('.account-tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  const login = $('#account-login'); if (login) login.style.display = tab === 'login' ? '' : 'none';
  const signup = $('#account-signup'); if (signup) signup.style.display = tab === 'signup' ? '' : 'none';
}

// (showCollisionModal / closeCollisionModal は廃止)

function updateAccountButton() {
  const label = $('#account-label');
  if (!label) return;
  label.textContent = authUser ? (authUser.displayName || 'アカウント') : 'ゲスト';
  // Admin リンクは authUser & admin判定済みの場合のみ表示
  const adminBtn = document.getElementById('btn-admin');
  if (adminBtn) {
    adminBtn.style.display = (authUser && isPrismAdmin) ? '' : 'none';
  }
}

let isPrismAdmin = false;
async function checkPrismAdmin() {
  if (!authUser || !fbDb) { isPrismAdmin = false; return; }
  try {
    const snap = await fbDb.ref('prism-gacha/_meta/admins/' + authUser.uid).once('value');
    isPrismAdmin = !!snap.val();
  } catch (e) {
    isPrismAdmin = false;
  }
  updateAccountButton();
}

// ────────────── Account Prompt (既存ゲスト進捗ありユーザーへの案内) ──────────────
const ACCOUNT_PROMPT_KEY = 'pg_account_prompt_dismissed';

function maybeShowAccountPrompt() {
  // 以下すべて満たす場合のみ表示:
  // - 未ログイン (authUser == null)
  // - localStorage進捗あり (total > 0 かつ unlockedSet に1つ以上)
  // - 「後で」で過去に dismiss していない
  if (authUser) return;
  if (localStorage.getItem(ACCOUNT_PROMPT_KEY) === 'true') return;
  const hasProgress = (state.total || 0) > 0 && Object.keys(state.unlockedSet || {}).length > 0;
  if (!hasProgress) return;
  const modal = document.getElementById('account-prompt');
  if (!modal) return;
  modal.classList.add('active');
}

function dismissAccountPrompt() {
  localStorage.setItem(ACCOUNT_PROMPT_KEY, 'true');
  const modal = document.getElementById('account-prompt');
  if (modal) modal.classList.remove('active');
}

function acceptAccountPrompt() {
  const modal = document.getElementById('account-prompt');
  if (modal) modal.classList.remove('active');
  // アカウントモーダルの新規登録タブを開く
  showAccountModal();
  switchAccountTab('signup');
  setTimeout(() => { const el = $('#signup-nickname'); if (el) el.focus(); }, 50);
}

// 簡易トースト (他で showToast 未定義の場合のみ定義)
if (typeof window.showToast !== 'function') {
  window.showToast = function(msg) {
    let t = document.getElementById('_ptoast');
    if (!t) {
      t = document.createElement('div');
      t.id = '_ptoast';
      t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(20,16,40,0.95);color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;z-index:20000;border:1px solid rgba(200,180,255,0.3);box-shadow:0 8px 30px rgba(0,0,0,0.4);opacity:0;transition:opacity 0.3s;pointer-events:none;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._h);
    t._h = setTimeout(() => { t.style.opacity = '0'; }, 2800);
  };
}

// アカウントモーダルのEnter/Escape対応
document.addEventListener('keydown', e => {
  const accountModal = document.getElementById('account-modal');
  if (accountModal && accountModal.classList.contains('active')) {
    if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); closeAccountModal(); }
    else if (e.key === 'Enter') {
      const signup = $('#account-signup');
      if (signup && signup.style.display !== 'none') { e.stopPropagation(); e.preventDefault(); doAccountSignup(); }
      else { e.stopPropagation(); e.preventDefault(); doAccountLogin(); }
    }
  }
}, true);

// account-modal の背景クリックで閉じる
document.addEventListener('DOMContentLoaded', () => {
  const am = document.getElementById('account-modal');
  if (am) am.addEventListener('click', e => { if (e.target === am) closeAccountModal(); });
});
