# S1C3 場所画像 プロンプト集

S1C3「砂塵の隊商」 の場所画像 (背景+挿絵) の DALL-E 3 用プロンプト。

> **🎯 引き継ぎ規約**
> - **比率**: 背景 = **3:4 縦長 (1024×1365)** / 挿絵 = **16:9 横長 (1672×941)** (野沢方針 2026-05-01)
> - **キャラ含む画像 (添付ありプロンプト)**: 末尾文言「元画像から表情や姿勢は変わってOKです」 + CRITICAL ANATOMY REQUIREMENTS 必須
> - **純風景 (添付なし)**: 末尾文言・解剖学指示 不要
> - **生成順序**: できればキャラ画像 (s1c3_chars.md) を先に生成 → 場所画像でキャラリファとして添付。 ただし添付なしでも生成可能 (体型が多少変わるが許容)

---

## S1C3 シーン対応表

| # | filename | 比率 | 役割 | 対応シーン | キャラ |
|---|---|---|---|---|---|
| 1 | purple_dragon_palace.png | 3:4 | 背景 | プロローグ / 1-1 / 1-2 | (純風景) |
| 2 | desert_caravan.png | 3:4 | 背景 | 2-1 隊商に紛れて | (純風景、 遠景人影のみ) |
| 3 | oasis_night.png | 3:4 | 背景 | 2-3 オアシスの夜 | (純風景) |
| 4 | ancient_ruins.png | 3:4 | 背景 | 3-1 古代遺跡 | (純風景) |
| 5 | starlight_oath.png | 3:4 | 背景 | 3-3 星空の告白 (山場) | ヴィル+サハナ |
| 6 | desert_dawn.png | 3:4 | 背景 | 4-2 別れ | (純風景) |
| 7 | sand_shadeova_battle.png | 16:9 | 挿絵 | 2-2 砂塵の襲撃 | サハナ初登場 |
| 8 | tribe_battle.png | 16:9 | 挿絵 | 3-2 影喰いの大波 | サハナ+ヴィル+グラン |
| 9 | lost_dragon_king_omen.png | 16:9 | 挿絵 | 4-1 古龍王の予兆 | ファラー |

合計 9枚 (背景6 + 挿絵3)。

---

# 【1】purple_dragon_palace.png — 紫竜王国玉座 (背景、 3:4)

- **対応シーン**: プロローグ + 1-1 + 1-2 (ヴィル POV、 城を抜けるまで)
- **本文行**: ヴィル「私は何を継承する者か」 と問い、 父王と対峙。 城を抜けて旅立つまで
- **役割**: 背景画像 (LOCATION_CONFIG['s1c3']['プロローグ' or '1-1' or '1-2'])、 3:4 縦長
- **被写体**: 紫竜王国の玉座の間。 紫の柱、 巨大な竜の彫刻、 玉座、 高い天井のステンドグラスから紫色の光が降り注ぐ。 **キャラなし**
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of the Throne Hall of the Purple Dragon Kingdom (Murasaki-Ryu Oukoku),
seen from inside. Towering violet-stone columns rise on either side, each carved with
intricate serpentine dragon reliefs that spiral upward. At the far end, an elevated empty
throne of polished violet stone with silver dragon-scale inlay, draped with royal purple
silks. High above, an enormous arched stained-glass window depicts a great dragon coiled
around the seven prismatic streams of the genso, casting violet-and-rainbow light beams
down across the marble floor. Royal banners hang from the walls, each bearing the silver
dragon emblem. The atmosphere is solemn and weighted with centuries of dynasty.
No human figures — pure environmental establishing shot of the throne hall.
The composition leads the eye upward from the marble floor through the columns to the
stained-glass window, emphasizing the height and the heritage.

Anime fantasy illustration style, regal-solemn dynastic atmosphere,
deep violet + silver + jewel-tones with rainbow-colored stained glass beams.
Tall vertical composition emphasizing the throne hall's verticality.
Aspect ratio 3:4, high detail.
```

---

# 【2】desert_caravan.png — 砂漠の隊商 (背景、 3:4)

- **対応シーン**: 2-1 隊商に紛れて (ヴィルが顔を隠してアーシャの商隊に同行)
- **役割**: 背景画像、 3:4 縦長
- **被写体**: 砂漠を進むキャラバン全景。 多数のラクダ、 隊列、 商隊の旗、 砂塵、 朝日。 **遠景に人影のみ** (個別キャラなし)
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of a desert caravan crossing a vast sandy plain at golden morning hour.
A long line of laden camels stretches diagonally across the frame, each laden with goods
draped in colorful merchant fabrics — deep greens, ochres, crimsons, dust-faded golds.
The caravan members ride and walk alongside the camels, mostly seen in mid-distance silhouette
(no specific characters featured). Caravan banners flutter in the desert breeze, marking
the merchant guild emblems. The dunes roll away into infinite distance behind the caravan,
the sky transitioning from warm gold horizon to deep blue zenith with the seven prismatic
streams of the genso flowing softly through the upper sky. Hot desert sun bathes the entire
scene in warm amber-gold light, casting long shadows from the camels.

Anime fantasy illustration style, epic-journey atmosphere, peaceful expanse of desert,
warm golden palette dominant with cool sky-blue and rainbow accent overhead.
Tall vertical composition emphasizing the height of the sky over the desert plain.
Aspect ratio 3:4, high detail.
```

---

# 【3】oasis_night.png — オアシスの夜 (背景、 3:4)

- **対応シーン**: 2-3 オアシスの夜 (キャラバンの夜営、 サハナとヴィルが互いの孤独を匂わせる)
- **役割**: 背景画像、 3:4 縦長
- **被写体**: オアシスの泉、 椰子の木、 焚き火、 多数の天幕、 満天の星空。 **キャラなし** (人影は遠景の天幕のみ)
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of a desert oasis at night, peaceful nomadic camp scene.
In the foreground, a small clear oasis pool reflects the brilliant night sky above.
Tall date palm trees curve gracefully around the pool, their fronds silhouetted against
the violet-night sky. To one side, a warm orange campfire flickers, casting golden
light onto the surrounding sand. In the mid-distance, several traditional desert tents
of patterned crimson and amber fabric stand grouped together, soft warm glow from
within (lanterns inside). Behind the tents, the silhouette of distant dunes rolling
into the horizon. Above, an absolutely magnificent night sky — deep velvet violet
with countless stars, the seven prismatic streams of the genso flowing visibly across
the heavens like rainbow rivers among the stars. A faint bright crescent moon hangs
low. No featured human characters — pure environmental peaceful camp scene.

Anime fantasy illustration style, serene-mystical desert night atmosphere,
deep violet + warm campfire amber + starlight palette, vivid rainbow streams overhead.
Tall vertical composition emphasizing the magnificent night sky above the camp.
Aspect ratio 3:4, high detail.
```

---

# 【4】ancient_ruins.png — 古代遺跡 (背景、 3:4)

- **対応シーン**: 3-1 古代遺跡 (ファラー登場、 「失われた古龍王」 伝承を語る場)
- **役割**: 背景画像、 3:4 縦長
- **被写体**: 古龍時代の石造遺跡。 巨大な古龍の彫像 (半ば砂に埋もれた)、 崩れかけた石柱、 古代の碑文。 夕暮れの紫光。 **キャラなし**
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of ancient dragon-era stone ruins in the desert at twilight.
The composition is dominated by a colossal half-buried dragon statue at the center —
its serpentine head and one outstretched claw protruding from the desert sands, the
rest of its body submerged. The statue's surface is weathered violet stone with
fragmentary gold leaf still clinging in places, depicting incredibly ancient dragon-king
imagery. Around the central statue, broken stone columns lean at various angles,
their surfaces covered in carved ancient script (proto-Sahar dragon-runes glowing
faintly violet at the inscriptions). Sand drifts have partially covered the floor, and
small dunes have built up against the ruins. The sky above is dramatic twilight purple
with the seven prismatic streams of the genso flowing in muted hues, the first few
stars visible. A distant mountain silhouette frames the background. No human figures —
pure environmental establishing shot of the ruins as a sleeping presence.

Anime fantasy illustration style, ancient-mystical-melancholy atmosphere,
deep violet + sand-bone + faint amber glow palette, twilight rainbow accent overhead.
Tall vertical composition emphasizing the colossal statue and the ruins' layered depth.
Aspect ratio 3:4, high detail.
```

---

# 【5】starlight_oath.png — 星空の告白 (背景、 3:4、 山場)

- **対応シーン**: 3-3 (S1C3 山場、 ヴィル+サハナが夜空の下で互いの孤独を打ち明ける)
- **役割**: 背景画像 (山場用、 静的な感動シーン)、 3:4 縦長
- **被写体**: ヴィル と サハナ が砂丘の頂で並んで腰掛け、 夜空を見上げる。 二人とも背中を見せた構図 (顔は半分見える、 横顔シルエット)
- **添付画像**: ヴィル `ssr/draco_lancer.png` (既存) + サハナ `ur/desert_princess.png` (S1C3新規、 生成済の場合)

```
A vertical 3:4 view of two young women sitting side-by-side on the crest of a tall sand
dune at deep night, both gazing up at a magnificent starry desert sky. Both are seen
mostly from behind/three-quarters back angle (only partial profile of their faces visible
as they look upward).
On the left: a violet-haired dragon princess matching the first reference image — long
flowing violet hair, royal armored dress in muted purple now (her formal armor set aside
beside her), her silver-and-violet spear lying flat on the sand near her hip. She has
pulled her armor down to a simpler under-tunic for this private moment.
On the right: a desert nomad princess matching the second reference image — long wavy
light-brown hair flowing in the night breeze, sun-tanned skin, her tribal red-and-gold
tunic now relaxed and simple (her swords resting on the sand beside her), small glints
of her ornaments catching starlight.
They sit close but not touching, their postures relaxed yet contemplative — the kind of
silence shared between people who have just exchanged deep truths about themselves.
Above them, the night sky is breathtaking: a deep velvet-violet expanse filled with
countless stars and the seven prismatic streams of the genso flowing visibly across the
heavens — red, orange, yellow, green, blue, indigo, violet — like rainbow rivers among
the stars. A faint comet streaks across the upper sky. The desert dunes roll away below
them into infinite night.

Anime fantasy illustration style, intimate-emotional starlit atmosphere,
deep violet + soft starlight + warm hair colors palette, vivid rainbow streams overhead.
Tall vertical composition emphasizing the vastness of the night sky above the two seated
figures (figures occupy lower third, sky dominates upper two thirds).

CRITICAL ANATOMY REQUIREMENTS: Both characters must have anatomically correct human hands
with five distinct, well-formed fingers per hand. Hands resting naturally on knees or in
their laps with all fingers visible and properly positioned. Both arms in natural relaxed
human poses with proper joint angles.

-----
元画像から表情や姿勢は変わってOKです
```

---

# 【6】desert_dawn.png — 砂漠の朝、 別れ (背景、 3:4)

- **対応シーン**: 4-2 別れ (ヴィルが「血ではなく時間が家族」 を腹に落とし、 紫竜王国へ帰る朝)
- **役割**: 背景画像、 3:4 縦長
- **被写体**: 砂漠の夜明け、 朝日が地平線に昇る。 砂丘の影、 朝霧、 静かな別れの空気。 **キャラなし** (純風景、 余韻シーン)
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of a desert dawn, the moment when night surrenders to morning.
In the lower portion, soft sand dunes stretch outward, their crests catching the first
warm rosy-gold rays of the rising sun. The sun itself is just emerging at the horizon,
a brilliant gold disc partially obscured by faint morning mist that drifts low across
the desert. The sky transitions from warm dawn-gold at the horizon, to soft peach
mid-sky, to deep amethyst-purple still holding fading stars at the upper zenith.
The seven prismatic streams of the genso flow gracefully across the upper sky, more
delicate and soft than at night — almost watercolor-like in this dawn light.
A single solitary set of camel tracks in the foreground sand leads off into the distance,
hinting at someone's recent departure (Vil leaving back home). The atmosphere is
peaceful, melancholic-hopeful — the silence after deep emotion.
No human figures — purely environmental, capturing the stillness of dawn and the empty
trail.

Anime fantasy illustration style, peaceful-emotional dawn atmosphere,
warm rose-gold + soft peach + fading violet palette, delicate rainbow accents.
Tall vertical composition with empty trail leading into vast dawn-touched distance.
Aspect ratio 3:4, high detail.
```

---

# 【7】sand_shadeova_battle.png — 砂塵の襲撃 (挿絵、 16:9)

- **対応シーン**: 2-2 砂塵の襲撃 (サハナ初登場、 砂塵影喰い vs サハナ + 隊商)
- **役割**: 本文インライン挿絵 (marker候補: 「サハナが風を纏って跳んだ」 等、 シーン中盤)、 16:9 横長
- **被写体**: 砂塵影喰いと戦うサハナ。 影喰いは画面奥で巨大砂虫風 (enemies_shadeova.md 参照)、 サハナが画面前景で双風刀構え
- **添付画像 (2枚)**: サハナ `ur/desert_princess.png` (S1C3新規生成済) + `images/enemies/shadeova_sand.png` (野沢生成済の砂塵影喰い参照画像)

```
A horizontal 16:9 dramatic battlefield scene of a desert princess engaging a massive
sand-shadow-eater creature.
In the foreground-center, a young desert nomad princess matching the reference image —
long wavy light-brown hair flowing in the desert wind, sun-tanned skin, traditional
red-and-gold tribal outfit, holding her two curved scimitar (Shamar twin blades), wind
swirling around the blades. She is in mid-leap, soaring through the air at the creature,
twin blades poised to strike. Her expression is fierce and focused.
In the upper-mid background, the colossal sand-shadow-eater (Shadeova, sand variant) —
a hybrid sand-worm and shadow-demon creature roughly 12 meters long, body of liquid black
shadow partially clad in flowing sand, multiple shadow-tendrils whipping outward, head
a massive maw ringed with violet-glowing crystalline teeth, tiny voidpurple pinpoints
ringing its mouth like a hellish crown. Sand and dust storm violently around its
emergence point.
In the lower-foreground sides: glimpses of caravan wagons being toppled, terrified camels
fleeing, a few caravan members taking cover. The desert sky above is sun-bright golden
on one side but twisted to violet-darkness near the creature.

Anime fantasy illustration style, intense desert combat atmosphere,
warm sand-gold + violet shadow + crimson outfit color contrast.
Wide cinematic horizontal composition with the princess in mid-leap as focal subject.

CRITICAL ANATOMY REQUIREMENTS: The princess must have anatomically correct human hands
with five distinct, well-formed fingers per hand, both hands gripping her scimitar
hilts firmly with all five fingers visible. Both arms in natural combat poses with
proper joint angles.

-----
元画像から表情や姿勢は変わってOKです
```

---

# 【8】tribe_battle.png — 部族集結 影喰いの大波 (挿絵、 16:9)

- **対応シーン**: 3-2 影喰いの大波 (サハール部族集結、 ヴィル+サハナ+グラン共闘)
- **役割**: 本文インライン挿絵 (marker候補: 「部族の戦士たちが、 一斉に駆けた」 等)、 16:9 横長
- **被写体**: 部族戦士たちと共闘するヴィル+サハナ+グラン。 影喰いの群れ (sand_shadeova) が前面に押し寄せる
- **添付画像 (4枚、 ChatGPT添付上限注意)**: ヴィル `ssr/draco_lancer.png` (既存) + サハナ `ur/desert_princess.png` + グラン `ssr/desert_veteran.png` (S1C3新規) + `images/enemies/shadeova_sand.png` (砂塵影喰い参照、 4枚目で生成不安定なら割愛OK)

```
A horizontal 16:9 epic combat scene of three warrior champions standing united against
a wave of sand-shadow-eater creatures.
On the left: a violet-haired dragon princess matching the first reference image — long
flowing violet hair, royal violet-and-silver armor, gripping her ornate violet spear
crackling with violet dragon-energy lightning, in mid-thrust forward.
In the center: a young desert nomad princess matching the second reference image — long
wavy light-brown hair, tribal red-and-gold outfit, both curved scimitar blades raised
in cross-block stance, wind currents visible around her blades.
On the right: an aged warrior matching the third reference image — silver-streaked black
hair, missing left eye, dragon-scale chest armor, swinging his massive two-handed bronze
greatsword in a powerful arc.
In the mid-background, dozens of fellow Sahar tribe warriors charge forward alongside
them, weapons raised, banners catching the wind. In the foreground, advancing waves of
sand-shadeova creatures (small and medium sand-shadow forms) pour toward them from a
violet rift in the sky beyond. The desert ground is cracked and stained violet from the
shadow corruption.

Anime fantasy illustration style, epic united-stand battle atmosphere,
warm earth + violet + crimson + bronze palette against violet shadow background.
Wide cinematic horizontal composition with the three champions as the focal triangle,
allies fanning out behind them.

CRITICAL ANATOMY REQUIREMENTS: All three characters must have anatomically correct human
hands with five distinct, well-formed fingers per hand. All hands grip their weapons
firmly with all five fingers visible and properly positioned. All arms in natural combat
poses with proper joint angles.

-----
元画像から表情や姿勢は変わってOKです
```

---

# 【9】lost_dragon_king_omen.png — 古龍王の予兆 (挿絵、 16:9)

- **対応シーン**: 4-1 古龍王の予兆 (ファラーが「古龍王はいずれ覚醒する」 と告げる)
- **役割**: 本文インライン挿絵 (marker候補: 「ファラーは砂を一握り掬い、 風に放った」 等)、 16:9 横長
- **被写体**: ファラーが古龍杖を掲げ、 背後に巨大な古龍王のシルエット (砂と影で半透明、 まだ眠っている姿)
- **添付画像**: ファラー `ur/dragon_sage.png` (S1C3新規)

```
A horizontal 16:9 mystical revelation scene featuring an ancient dragon-blooded sage and
a colossal sleeping dragon king silhouette behind her.
In the foreground-center, an elderly sage matching the reference image — long silver
braided hair, deep violet ceremonial robes, holding her tall staff with the violet
amethyst crystal raised high. The crystal is glowing brightly with pulsing violet light,
casting illumination forward and upward. Her expression is solemn and reverent. She is
seen in three-quarters view, releasing a handful of fine golden sand from her free hand
into the wind.
In the entire upper background, a colossal translucent silhouette of an immense ancient
dragon king coils through the sky — its massive serpentine body glimpsed through the
violet evening clouds, only partially visible (mostly silhouette in cloud and haze),
its head turned slightly as if dreaming. The dragon's outline shimmers between solid
form and pure violet mist, suggesting it is still asleep, still half-mythical, but
beginning to stir. Faint golden-violet sparks drift upward from the sage's released sand
toward the dragon's silhouette, as if her offering is reaching its dream.
The desert below is dusk-purple, with ancient ruin pillars visible in the lower
foreground frame. The sky is deep amethyst with the genso seven prismatic streams faintly
visible behind the dragon's shape.

Anime fantasy illustration style, mystical-prophetic awe atmosphere,
deep violet + golden mist + amethyst silhouette palette.
Wide cinematic horizontal composition with the sage anchoring the lower-left, the
colossal dragon silhouette dominating the upper expanse.

CRITICAL ANATOMY REQUIREMENTS: The sage must have anatomically correct human hands with
five distinct, well-formed fingers per hand. The hand on the staff grips firmly with
all fingers visible. Both arms in natural elderly human poses with proper joint angles.

-----
元画像から表情や姿勢は変わってOKです
```

---

# 生成順序 (野沢用メモ)

**先にキャラ画像** (s1c3_chars.md → ChatGPT) を生成 → 場所画像でキャラリファとして添付すると安定。

ただし添付なしでも生成可能 (体型・服装が多少変わるが許容):

1. キャラ画像10体生成 (s1c3_chars.md)
2. 場所画像9枚生成 (このファイル)
3. Box保存 → Claude が thumb webp + LOCATION_CONFIG['s1c3'] + STORY_LOCATION_INLINE_CONFIG['s1c3'] 反映

**シーン対応** (script.js への反映用):
- 背景: 1-1 / 1-2 → purple_dragon_palace、 2-1 → desert_caravan、 2-3 → oasis_night、 3-1 → ancient_ruins、 3-3 → starlight_oath、 4-2 → desert_dawn
- 挿絵: 2-2 → sand_shadeova_battle、 3-2 → tribe_battle、 4-1 → lost_dragon_king_omen
