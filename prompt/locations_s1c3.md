# Prismaera 場所画像プロンプト — Season 1 第3章「砂塵の隊商」

S1C3「砂塵の隊商」 の場所画像 (背景+挿絵) の DALL-E 3 用プロンプト。

> **🎯 引き継ぎ規約 (重要)**
>
> 各画像セクション冒頭に必ず以下のメタデータを書く。 別セッション・別PCで自分自身が引き継いだ時に推測で誤マッピングしないため (CLAUDE.md / `feedback_asset_scene_mapping.md`)。
>
> - **対応シーン**: ストーリー上の章節 (例: `2-7 アクアシス宮殿 (冒頭)`)
> - **本文行**: `STORY/s1c3.md` の該当行 + 直接引用フレーズ (本文執筆後に追記)
> - **役割**: 単独表示か連続表示か、 どの位置か
> - **被写体**: 画像実物に何が描かれているか
> - **ストーリー使用**: ✅ (ストーリー再生で表示) / ❌ (ワールドマップ等の別用途)
> - **コード参照**: `LOCATION_CONFIG['s1c3']['シーン']` / `STORY_LOCATION_INLINE_CONFIG['s1c3']` (実装後に記載)

> **🎯 比率規約**: 背景 = **3:4 縦長 (1024×1536)** / 挿絵 = **16:9 横長 (1672×941)** (野沢方針 2026-05-01)

> **🎯 形式規約 (絶対)**: 全プロンプトを **単一ブロック prose** (s1c2_locations.md と同形式) で記述。 多段パラグラフ (キャラ/設定/スタイル/解剖の分割) は禁止。

> **🎯 キャラ含む画像 (添付ありプロンプト)**:
> - `CRITICAL ANATOMY REQUIREMENTS` 必須 (5本指・関節・武器の握り)
> - 末尾文言「元画像から表情や姿勢は変わってOKです」 必須
> - リファ画像添付指示を画像セクション冒頭に明記

> **🎯 純風景 (添付なし)**: anatomy 指示・末尾文言 不要、 `Aspect ratio X:Y, high detail.` で締める

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

# 【1】purple_dragon_palace.png — 紫竜王国玉座 (背景、 3:4、 純風景)

- **対応シーン**: プロローグ + 1-1 + 1-2 (ヴィル POV、 城を抜けるまで)
- **本文行**: ヴィル「私は何を継承する者か」 と問い、 父王と対峙。 城を抜けて旅立つまで (本文執筆時に行番号追記)
- **役割**: 背景画像 (LOCATION_CONFIG['s1c3']['プロローグ' or '1-1' or '1-2'])、 3:4 縦長
- **被写体**: 紫竜王国の玉座の間。 紫の柱、 巨大な竜の彫刻、 玉座、 高い天井のステンドグラスから紫色の光が降り注ぐ
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of the Throne Hall of the Purple Dragon Kingdom, towering violet-stone columns rising on either side carved with intricate serpentine dragon reliefs spiraling upward, at the far end an elevated empty throne of polished violet stone with silver dragon-scale inlay draped with royal purple silks, high above an enormous arched stained-glass window depicting a great dragon coiled around the seven prismatic streams of the genso casting violet and rainbow light beams down across the marble floor, royal banners hanging from the walls each bearing the silver dragon emblem, solemn dynastic atmosphere weighted with centuries of heritage, no human figures pure environmental establishing shot, anime fantasy illustration style with deep violet and silver and jewel-tone palette and rainbow stained-glass beams, tall vertical composition emphasizing throne hall verticality. Aspect ratio 3:4, high detail.
```

---

# 【2】desert_caravan.png — 砂漠の隊商 (背景、 3:4、 純風景)

- **対応シーン**: 2-1 隊商に紛れて (ヴィルが顔を隠してアーシャの商隊に同行)
- **本文行**: (執筆後追記)
- **役割**: 背景画像、 3:4 縦長
- **被写体**: 砂漠を進むキャラバン全景。 多数のラクダ、 隊列、 商隊の旗、 砂塵、 朝日。 遠景に人影のみ (個別キャラなし)
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of a desert caravan crossing a vast sandy plain at golden morning hour, a long line of laden camels stretching diagonally across the frame each laden with goods draped in colorful merchant fabrics of deep greens ochres crimsons and dust-faded golds, caravan members riding and walking alongside the camels mostly seen in mid-distance silhouette with no specific characters featured, caravan banners fluttering in the desert breeze marking merchant guild emblems, dunes rolling into infinite distance behind the caravan, the sky transitioning from warm gold horizon to deep blue zenith with the seven prismatic streams of the genso flowing softly through the upper sky, hot desert sun bathing the entire scene in warm amber-gold light casting long camel shadows, anime fantasy illustration style with epic peaceful journey atmosphere and warm golden palette dominant with cool sky-blue and rainbow accents overhead, tall vertical composition emphasizing the height of sky over the desert plain. Aspect ratio 3:4, high detail.
```

---

# 【3】oasis_night.png — オアシスの夜 (背景、 3:4、 純風景)

- **対応シーン**: 2-3 オアシスの夜 (キャラバンの夜営、 サハナとヴィルが互いの孤独を匂わせる)
- **本文行**: (執筆後追記)
- **役割**: 背景画像、 3:4 縦長
- **被写体**: オアシスの泉、 椰子の木、 焚き火、 多数の天幕、 満天の星空。 キャラなし (人影は遠景の天幕のみ)
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of a desert oasis at night with a peaceful nomadic camp scene, in the foreground a small clear oasis pool reflecting the brilliant night sky above, tall date palm trees curving gracefully around the pool with their fronds silhouetted against the violet-night sky, to one side a warm orange campfire flickering and casting golden light onto the surrounding sand, in the mid-distance several traditional desert tents of patterned crimson and amber fabric standing grouped together with soft warm lantern glow from within, behind the tents the silhouette of distant dunes rolling into the horizon, above an absolutely magnificent night sky of deep velvet violet with countless stars and the seven prismatic streams of the genso flowing visibly across the heavens like rainbow rivers among the stars, a faint bright crescent moon hanging low, no human figures pure environmental peaceful camp scene, anime fantasy illustration style with serene mystical desert night atmosphere and deep violet and warm campfire amber and starlight palette and vivid rainbow streams overhead, tall vertical composition emphasizing the magnificent night sky above the camp. Aspect ratio 3:4, high detail.
```

---

# 【4】ancient_ruins.png — 古代遺跡 (背景、 3:4、 純風景)

- **対応シーン**: 3-1 古代遺跡 (ファラー登場、 「失われた古龍王」 伝承を語る場)
- **本文行**: (執筆後追記)
- **役割**: 背景画像、 3:4 縦長
- **被写体**: 古龍時代の石造遺跡。 巨大な古龍の彫像 (半ば砂に埋もれた)、 崩れかけた石柱、 古代の碑文。 夕暮れの紫光。 キャラなし
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of ancient dragon-era stone ruins in the desert at twilight, the composition dominated by a colossal half-buried dragon statue at the center with its serpentine head and one outstretched claw protruding from the desert sands and the rest of its body submerged, the statue surface weathered violet stone with fragmentary gold leaf still clinging in places depicting incredibly ancient dragon-king imagery, around the central statue broken stone columns leaning at various angles with surfaces covered in carved ancient script of proto-Sahar dragon-runes glowing faintly violet, sand drifts having partially covered the floor and small dunes built up against the ruins, the sky a dramatic twilight purple with the seven prismatic streams of the genso flowing in muted hues and the first few stars visible, a distant mountain silhouette framing the background, no human figures pure environmental establishing shot of the ruins as a sleeping presence, anime fantasy illustration style with ancient mystical melancholy atmosphere and deep violet and sand-bone and faint amber glow palette with twilight rainbow accents overhead, tall vertical composition emphasizing the colossal statue and layered ruin depth. Aspect ratio 3:4, high detail.
```

---

# 【5】starlight_oath.png — 星空の告白 山場 (背景、 3:4、 キャラ含む)

- **対応シーン**: 3-3 星空の告白 (S1C3 山場、 ヴィル+サハナが夜空の下で互いの孤独を打ち明ける静的感動シーン)
- **本文行**: (執筆後追記)
- **役割**: 背景画像 (山場用)、 3:4 縦長
- **被写体**: ヴィル と サハナ が砂丘の頂で並んで腰掛け、 夜空を見上げる。 二人とも背中を見せた構図 (顔は半分見える、 横顔シルエット)
- **添付画像 (2枚、 必須)**:
  - `images/characters/season1/ssr/draco_lancer.png` (ヴィル、 既存)
  - `images/characters/season1/ur/desert_princess.png` (サハナ、 S1C3 ur_08 生成済み前提)

```
A vertical 3:4 view of two young women sitting side-by-side on the crest of a tall sand dune at deep night both gazing up at a magnificent starry desert sky, both seen mostly from behind in three-quarters back angle with only partial profile of their faces visible as they look upward, on the left a violet-haired dragon princess matching the first reference image with long flowing violet hair and a simpler under-tunic in muted purple now (her formal armor set aside beside her) and her silver-and-violet ornate spear lying flat on the sand near her hip, on the right a desert nomad princess matching the second reference image with long wavy light-brown hair flowing in the night breeze and sun-tanned skin and her tribal red-and-gold tunic now relaxed and simple with her twin curved scimitar swords resting on the sand beside her and small glints of her ornaments catching starlight, both sitting close but not touching their postures relaxed yet contemplative the kind of silence shared between people who have just exchanged deep truths about themselves, above them the night sky breathtaking a deep velvet-violet expanse filled with countless stars and the seven prismatic streams of the genso flowing visibly across the heavens like rainbow rivers among the stars and a faint comet streaking across the upper sky, the desert dunes rolling away below them into infinite night, anime fantasy illustration style with intimate emotional starlit atmosphere and deep violet and soft starlight and warm hair colors palette with vivid rainbow streams overhead, tall vertical composition with the figures occupying lower third and sky dominating upper two thirds. CRITICAL ANATOMY REQUIREMENTS: both characters with anatomically correct human hands of exactly five distinct well-formed fingers per hand, hands resting naturally on knees or in laps with all fingers visible and properly positioned, both arms in natural relaxed human poses with proper joint angles. Aspect ratio 3:4, high detail.

-----
元画像から表情や姿勢は変わってOKです
```

---

# 【6】desert_dawn.png — 砂漠の朝 別れ (背景、 3:4、 純風景)

- **対応シーン**: 4-2 別れ (ヴィルが「血ではなく時間が家族」 を腹に落とし、 紫竜王国へ帰る朝)
- **本文行**: (執筆後追記)
- **役割**: 背景画像、 3:4 縦長
- **被写体**: 砂漠の夜明け、 朝日が地平線に昇る。 砂丘の影、 朝霧、 静かな別れの空気。 キャラなし (純風景、 余韻シーン)
- **添付画像**: なし (純風景)

```
A vertical 3:4 view of a desert dawn at the moment when night surrenders to morning, in the lower portion soft sand dunes stretching outward with their crests catching the first warm rosy-gold rays of the rising sun, the sun itself just emerging at the horizon as a brilliant gold disc partially obscured by faint morning mist drifting low across the desert, the sky transitioning from warm dawn-gold at the horizon to soft peach mid-sky to deep amethyst-purple still holding fading stars at the upper zenith, the seven prismatic streams of the genso flowing gracefully across the upper sky more delicate and soft than at night almost watercolor-like in this dawn light, a single solitary set of camel tracks in the foreground sand leading off into the distance hinting at someone's recent departure, peaceful melancholic-hopeful atmosphere the silence after deep emotion, no human figures purely environmental capturing the stillness of dawn and the empty trail, anime fantasy illustration style with peaceful emotional dawn atmosphere and warm rose-gold and soft peach and fading violet palette with delicate rainbow accents, tall vertical composition with empty trail leading into vast dawn-touched distance. Aspect ratio 3:4, high detail.
```

---

# 【7】sand_shadeova_battle.png — 砂塵の襲撃 (挿絵、 16:9、 キャラ含む)

- **対応シーン**: 2-2 砂塵の襲撃 (サハナ初登場、 砂塵影喰い vs サハナ + 隊商)
- **本文行**: (marker候補: 「サハナが風を纏って跳んだ」 等、 シーン中盤、 執筆後確定)
- **役割**: 本文インライン挿絵、 16:9 横長
- **被写体**: 砂塵影喰いと戦うサハナ。 影喰いは画面奥で巨大砂虫風 (`enemies_shadeova.md` 参照)、 サハナが画面前景で双風刀構え
- **添付画像 (2枚、 必須)**:
  - `images/characters/season1/ur/desert_princess.png` (サハナ、 S1C3 ur_08 生成済み前提)
  - `images/enemies/shadeova_sand.png` (野沢生成済の砂塵影喰い参照画像)

```
A horizontal 16:9 dramatic battlefield scene of a desert princess engaging a massive sand-shadow-eater creature, in the foreground center a young desert nomad princess matching the first reference image with long wavy light-brown hair flowing in the desert wind and sun-tanned skin and traditional red-and-gold tribal warrior outfit holding her two curved scimitar Shamar twin blades with seven-color prismatic wind currents swirling around the blades, she is in mid-leap soaring through the air toward the creature with twin blades poised to strike and a fierce focused expression, in the upper-mid background the colossal sand-shadow-eater Shadeova matching the second reference image as a hybrid sand-worm and shadow-demon creature roughly 12 meters long with a body of liquid black shadow partially clad in flowing sand and multiple shadow-tendrils whipping outward and a head with a massive maw ringed with violet-glowing crystalline teeth and tiny voidpurple pinpoints around its mouth like a hellish crown, sand and dust storming violently around its emergence point, in the lower-foreground sides glimpses of caravan wagons being toppled and terrified camels fleeing and a few caravan members taking cover, the desert sky above sun-bright golden on one side but twisted to violet-darkness near the creature, anime fantasy illustration style with intense desert combat atmosphere and warm sand-gold and violet shadow and crimson outfit color contrast, wide cinematic horizontal composition with the princess in mid-leap as focal subject. CRITICAL ANATOMY REQUIREMENTS: the princess with anatomically correct human hands of exactly five distinct well-formed fingers per hand, both hands gripping her scimitar hilts firmly with all five fingers visible and properly positioned, both arms in natural combat poses with proper joint angles. Aspect ratio 16:9, high detail.

-----
元画像から表情や姿勢は変わってOKです
```

---

# 【8】tribe_battle.png — 部族集結 影喰いの大波 (挿絵、 16:9、 キャラ含む)

- **対応シーン**: 3-2 影喰いの大波 (サハール部族集結、 ヴィル+サハナ+グラン共闘)
- **本文行**: (marker候補: 「部族の戦士たちが、 一斉に駆けた」 等、 執筆後確定)
- **役割**: 本文インライン挿絵、 16:9 横長
- **被写体**: 部族戦士たちと共闘するヴィル+サハナ+グラン。 影喰いの群れ (sand_shadeova) が前面に押し寄せる
- **添付画像 (4枚、 ChatGPT添付上限注意。 4枚目不安定なら shadeova_sand 割愛OK)**:
  - `images/characters/season1/ssr/draco_lancer.png` (ヴィル、 既存)
  - `images/characters/season1/ur/desert_princess.png` (サハナ、 ur_08 生成済み前提)
  - `images/characters/season1/ssr/desert_swordsaint.png` (グラン、 ssr_17 若き剣聖版 生成済み前提)
  - `images/enemies/shadeova_sand.png` (砂塵影喰い参照)

> **⚠️ グランの隻眼維持に関する強い注意 (2026-05-01 再生成時の指摘)**: DALL-E 3 が戦闘シーンで「キャラを完全な姿に整える」 自動補正をかけて、 グランの欠損した左目を「両目開き」 にしてしまう事故あり。 プロンプト本文で **「left eye permanently missing — closed scarred eyelid sealed shut」** を明示し、 ANATOMY ブロックでも **「ONLY right eye is open, left eye must remain closed/scarred as in reference image」** を再確認する。

```
A horizontal 16:9 epic combat scene of three warrior champions standing united against a wave of sand-shadow-eater creatures, on the left a violet-haired dragon princess matching the first reference image with long flowing violet hair and royal violet-and-silver armor gripping her ornate violet spear crackling with violet dragon-energy lightning in mid-thrust forward, in the center a young desert nomad princess matching the second reference image with long wavy light-brown hair and tribal red-and-gold outfit and both curved Shamar scimitar blades raised in cross-block stance with prismatic wind currents visible around her blades, on the right a young sword saint warrior in his mid-twenties matching the third reference image with sleek dark-black hair (no grey) and **his left eye permanently missing — closed scarred eyelid sealed shut by an old battle scar across it, NO eyepatch (the closed scarred eyelid is directly visible), ONLY his right amber-gold eye is open and visible** and subtle iridescent dragon-scale tattoos on his forearms and dragon-scale chest armor swinging his massive two-handed bronze greatsword in a powerful arc, in the mid-background dozens of fellow Sahar tribe warriors charging forward alongside them with weapons raised and banners catching the wind, in the foreground advancing waves of sand-shadeova creatures (small and medium sand-shadow forms matching the fourth reference image) pouring toward them from a violet rift in the sky beyond, the desert ground cracked and stained violet from the shadow corruption, anime fantasy illustration style with epic united-stand battle atmosphere and warm earth and violet and crimson and bronze palette against violet shadow background, wide cinematic horizontal composition with the three champions as the focal triangle and allies fanning out behind them.

CRITICAL ANATOMY REQUIREMENTS:
- All three characters with anatomically correct human hands of exactly five distinct well-formed fingers per hand, all hands gripping their weapons firmly with all five fingers visible and properly positioned, all arms in natural combat poses with proper joint angles.
- **CRITICAL EYE PRESERVATION for the sword saint warrior on the right (Gran)**: His left eye is permanently missing — the eyelid is sealed shut, crossed by a battle scar, NO eyepatch. ONLY his right eye is open and visible. Do NOT depict both eyes open. Match the reference image exactly for the missing-eye state.

Aspect ratio 16:9, high detail.

-----
元画像から表情や姿勢は変わってOKです (ただしグランの欠損した左目は維持してください、 両目開きにしないでください)
```

---

# 【9】lost_dragon_king_omen.png — 古龍王の予兆 (挿絵、 16:9、 キャラ含む)

- **対応シーン**: 4-1 古龍王の予兆 (ファラーが「古龍王はいずれ覚醒する」 と告げる、 S2 古龍王覚醒の伏線可視化シーン)
- **本文行**: (marker候補: 「ファラーは砂を一握り掬い、 風に放った」 等、 執筆後確定)
- **役割**: 本文インライン挿絵、 16:9 横長
- **被写体**: ロリババアのファラー (8-10歳少女体型) が自分の身長の3倍ある古龍杖を掲げ、 背後に巨大な古龍王のシルエット (砂と影で半透明、 まだ眠っている姿)
- **添付画像 (1枚、 必須)**:
  - `images/characters/season1/ur/dragon_sage.png` (ファラー、 S1C3 ur_09 ロリババア版 生成済み前提)

```
A horizontal 16:9 mystical revelation scene featuring a tiny ancient dragon-blooded sage girl and a colossal sleeping dragon king silhouette behind her, in the foreground center a tiny sage girl matching the reference image who appears 8-10 years old with long silver braided hair trailing past her ankles and oversized deep violet ceremonial robes pooling around her bare feet holding her tall staff (roughly three times her own small height) with the violet amethyst crystal raised high glowing brightly with pulsing prismatic violet light casting illumination forward and upward, her expression solemn and reverent showing centuries of wisdom in her child face seen in three-quarters view releasing a handful of fine golden sand from her free small hand into the wind, in the entire upper background a colossal translucent silhouette of an immense ancient dragon king coiling through the sky with its massive serpentine body glimpsed through the violet evening clouds only partially visible mostly silhouette in cloud and haze and its head turned slightly as if dreaming, the dragon outline shimmering between solid form and pure violet mist suggesting it is still asleep still half-mythical but beginning to stir, the contrast between her tiny child body and the colossal dragon emphasizing her ancient soul, faint golden-violet sparks drifting upward from the sage released sand toward the dragon silhouette as if her offering reaches its dream, the desert below dusk-purple with ancient ruin pillars visible in the lower foreground frame, the sky deep amethyst with the seven prismatic streams of the genso faintly visible behind the dragon shape, anime fantasy illustration style with mystical prophetic awe atmosphere and deep violet and golden mist and amethyst silhouette palette, wide cinematic horizontal composition with the small sage anchoring the lower-left and the colossal dragon silhouette dominating the upper expanse. CRITICAL ANATOMY REQUIREMENTS: the sage girl with anatomically correct human hands of exactly five distinct well-formed fingers per hand, the small hand on the tall staff gripping firmly with all five fingers visible, both arms in natural childlike human poses with proper joint angles. Aspect ratio 16:9, high detail.

-----
元画像から表情や姿勢は変わってOKです
```

---

# 生成順序 (野沢用メモ)

**先にキャラ画像** (s1c3_chars.md → ChatGPT) を生成 → 場所画像でキャラリファとして添付すると安定。 キャラ未生成でも純風景5枚は先行生成可能。

1. キャラ画像10体生成 (s1c3_chars.md) → Box保存 (`images/characters/season1/{tier}/{slug}.png`)
2. 純風景5枚先行可: purple_dragon_palace / desert_caravan / oasis_night / ancient_ruins / desert_dawn
3. キャラ含む4枚はキャラ画像生成後: starlight_oath (Vil既存+サハナ) / sand_shadeova_battle (サハナ+影喰い) / tribe_battle (Vil+サハナ+グラン+影喰い) / lost_dragon_king_omen (ファラー)
4. Box保存 → Claude が thumb webp + LOCATION_CONFIG['s1c3'] + STORY_LOCATION_INLINE_CONFIG['s1c3'] 反映

**シーン対応** (script.js への反映用):
- 背景: 1-1 / 1-2 → purple_dragon_palace、 2-1 → desert_caravan、 2-3 → oasis_night、 3-1 → ancient_ruins、 3-3 → starlight_oath、 4-2 → desert_dawn
- 挿絵: 2-2 → sand_shadeova_battle、 3-2 → tribe_battle、 4-1 → lost_dragon_king_omen
