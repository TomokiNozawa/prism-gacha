# S1C2 場所画像 プロンプト集

S1C2「南方海域の異変」の場所画像。GPT(DALL-E 3)向け英語プロンプト。

> **🎯 引き継ぎ規約 (重要)**
>
> 各画像セクション冒頭に必ず以下のメタデータを書くこと。別セッション・別PCで自分自身が引き継いだ時に推測で誤マッピングしないため。
>
> - **対応シーン**: ストーリー上の章節 (例: `2-7 アクアシス宮殿 (冒頭)`)
> - **本文行**: `STORY/s1c2.md` の該当行 + 直接引用フレーズ
> - **役割**: 単独表示か連続表示か、どの位置か
> - **被写体**: 画像実物に何が描かれているか
> - **ストーリー使用**: ✅ (ストーリー再生で表示) / ❌ (ワールドマップ等の別用途)
> - **コード参照**: `LOCATION_CONFIG[storyId][scene]` のキー (実装後に記載)

---

## 【1】aquasis_entrance.png — 2-7冒頭 (海溝への進入)

- **対応シーン**: 2-7 アクアシス宮殿 (冒頭・進入演出 1/2)
- **本文行**: `STORY/s1c2.md` l.313〜「ネプテアの招きで、紅玉号と私たちは、海溝の入り口に向かった」
- **役割**: entrance → city の連続2枚演出 1枚目
- **被写体**: 海上、紅玉号 (Crimson Pearl) 甲板、夕日、海溝を見下ろすイザベル+シャンティ
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-7'].paragraphs[0]` (実装後)

> **添付画像2枚** (生成時):
> - `images/characters/season1/ssr/paladin_lady.png`(イザベル SSR)
> - `images/characters/season1/ssr/pirate_captain.png`(シャンティ)
>
> 「この2人が甲板に並んで立つように」と一言添えると精度アップ。

```
A wooden sailing ship with crimson sails — the pirate galleon "Crimson Pearl" —
approaches the edge of a vast ocean trench from the surface.
The trench is visible as a perfectly calm dark oval in the water,
where the sea floor simply drops away into deep turquoise darkness.
Faint bioluminescent lights glow far below through the clear water.
The ship's crew gathers at the railing, gazing down in awe.
On the deck stand two women side by side:
a female holy knight matching the first reference image —
white armor, glowing silver lance in hand —
and a female pirate captain matching the second reference image —
red coat, large feathered tricorn hat — both gazing into the trench.
Anime illustration, late afternoon orange-gold sky, dramatic perspective
from behind the ship looking down into the trench.
```

---

## 【2】aquasis_city.png — 2-7冒頭 (珊瑚都市 発見)

- **対応シーン**: 2-7 アクアシス宮殿 (冒頭・進入演出 2/2)
- **本文行**: `STORY/s1c2.md` l.316〜「海中に、巨大な珊瑚の都市が広がっていた」「これがアクアシス——千年の隠れ都市」
- **役割**: entrance → city の連続2枚演出 2枚目
- **被写体**: 海中の珊瑚都市俯瞰、真珠と硝子の建物、発光魚
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-7'].paragraphs[1]` (実装後)

```
A breathtaking underwater city built inside a massive deep-sea trench.
The city of Aquasis: towering spires and domes constructed from giant corals and
iridescent pearl, with walls of translucent sea-glass that glow from within.
Thousands of bioluminescent fish drift between buildings like living lanterns,
casting soft teal and gold light. The trench walls rise on both sides like
dark canyon cliffs, creating a sense of immense depth and enclosure.
The city rests on the trench floor with cascading terraces of coral architecture,
connected by arching bridges of pearl-white stone.
Grand underwater cityscape, fantasy anime illustration style,
vibrant blues and aquamarines, gold-tinted light beams filtering from far above,
tiny silhouettes of merfolk and sea creatures visible between buildings.
Wide establishing shot, cinematic perspective from mid-trench height.
```

---

## 【3】aquasis_palace.png — ワールドマップ専用 (ストーリー未使用)

- **対応シーン**: なし (ストーリーには入れない方針)
- **本文行**: 該当なし
- **役割**: ワールドマップのアクアシス拠点画像、ホットスポット用
- **被写体**: アクアシス宮殿外観、中央ドーム、四方の珊瑚塔、海中
- **ストーリー使用**: ❌
- **コード参照**: ワールドマップ実装時 (Task L) に決定

> 採否理由: city.png と被写体重複(海中珊瑚建築)で、2-7冒頭にentrance/city/palaceと3枚並べると情報過多。palaceはワールドマップで「拠点アイコンクリック→拠点画像」のような用途に回す。

```
A majestic underwater palace at the heart of Aquasis.
A grand central dome of layered pearl and abalone shell,
flanked by four slender coral towers with softly glowing windows.
The entrance gate is framed by enormous curved whale ribs draped in sea anemone.
Giant sea fans and soft corals bloom along the palace walls in deep violet and pink.
The palace glows with a gentle inner radiance of aquamarine and pale gold.
Bioluminescent jellyfish drift lazily past the towers.
Fantasy anime illustration, majestic and serene,
deep-sea atmosphere, teal and lavender color palette.
```

---

## 【4】aquasis_throne.png — 2-7後半 (謁見の間)

- **対応シーン**: 2-7 アクアシス宮殿 (後半・謁見シーン)
- **本文行**: `STORY/s1c2.md` l.322〜「宮殿の謁見の間。ネプテアの傍らには、銀髪の女性が立っていた」
- **役割**: 単独表示 (entrance/city とは数行間を空けて別ピースで配置)
- **被写体**: 玉座の間、玉座に座るネプテア、海騎士の衛兵、貝殻の天蓋
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-7'].paragraphs[2]` (実装後)
- **試運転メモ**: 一旦離してみる方針。実機で違和感あれば entrance/city/throne の連続化(あるいはpalace復活させて4枚連続)も検討。

> **添付画像** (生成時):
> - `images/characters/season1/ur/sea_queen.png`(ネプテア)

```
An awe-inspiring throne room deep within an underwater palace.
High vaulted ceiling of woven coral, with shafts of filtered light
descending from crystal skylights set in the pearl dome above.
The throne is carved from a single enormous shell, encrusted with sea gems
in turquoise, deep violet, and soft gold.
Seawater currents gently drift through open archways on both sides,
carrying luminescent plankton like floating stars.
On the throne sits the Sea Queen — silver-blue flowing hair, trident in hand,
coral and pearl crown. Rows of sea-knight guards in coral armor stand at attention.
Interior fantasy illustration, grand ceremonial atmosphere,
cool blues and warm gold accents, shimmer and depth.
```

---

## 【5】aquasis_rift.png — 2-9 (黒い亀裂)

- **対応シーン**: 2-9 黒い亀裂 (1枚のみ)
- **本文行**: `STORY/s1c2.md` l.391〜「海溝の底——光のない、深い深い闇の中」
- **役割**: 単独表示。2-10 (自分自身の祈り) / 2-11 (波紋の聖女) には継続表示しない
- **被写体**: 暗黒の海底、黒い亀裂、シャンティ+ネプテア+影喰い、聖光
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-9']` (実装後)
- **2-10/2-11 補足**: 場所画像なし。背景CSSグラデ `bg-shadow` → 2-11 で `bg-rainbow` overlay にトランジションして覚醒演出を表現。

> **添付画像2枚** (生成時):
> - `images/characters/season1/ssr/pirate_captain.png`(シャンティ)
> - `images/characters/season1/ur/sea_queen.png`(ネプテア)

```
The absolute bottom of a deep ocean trench, shrouded in near-total darkness.
At the center of the seafloor: a massive, jagged black rift tears through the
rock, pulsing with dark miasma and shadow. Corrupted sea creatures —
fish with blackened scales, twisted forms — crawl out from the crack.
Around the rift, a group of warriors stands in combat formation.
At the front: a bold female pirate captain matching the first reference image —
red coat, large feathered tricorn hat, twin curved blades drawn —
and a silver-haired sea queen matching the second reference image —
trident raised, coral crown, aquamarine aura.
Flanked by knights in holy armor and sea-beast riders,
the group is surrounded by glowing holy light and bioluminescence
that barely holds back the encroaching shadow.
Dark fantasy battle illustration, high contrast between holy rainbow light
and dark void, oppressive atmosphere, deep indigo and black with flashes
of gold, teal, and rainbow.
```

---

# Phase 2 — 本文インライン挿絵 (確認1-2 ハイブリッド方針)

野沢指示 (2026-04-30): 場所画像を背景だけでなく、 キャラ挿絵と同じ感覚で本文中にインライン挿絵として登場させる。 ストーリー全体 (S3C7 まで) の伏線・整合を踏まえた被写体設計。 添付キャラは複数人OK。

---

## 【6】church_morning.png — 2-1 教会の朝

- **対応シーン**: 2-1 教会の朝 (S1C2 冒頭、 イザベルの「代理の祈り」 状態の象徴)
- **本文行**: `STORY/s1c2.md` l.33〜「朝の鐘が、 白焔教会の鐘楼から響き渡る」 「祭壇の前に膝をつき、 いつもの祈りを捧げていた」
- **役割**: 本文インライン挿絵 (シーン冒頭直後)
- **被写体**: 白焔教会の聖堂内部、 七色のステンドグラスから朝光、 祭壇、 イザベルが祈りを捧げる後ろ姿
- **ストーリー全体との整合**: ステンドグラスに **七色 (原虹)** + セラフィエル象徴 (六翼) → 後の波紋の聖女覚醒 (七色) との視覚的伏線。 序盤の「静かな白い祈り」 が、 終盤の「自分自身の七色波紋」 へと変容する物語アーク
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-1']` (実装後)

> **添付画像** (生成時):
> - `images/characters/season1/ssr/paladin_lady.png` (イザベル SSR、 後ろ姿で祭壇前に跪く)

```
A serene cathedral interior of the White Flame Church at dawn.
Tall stained-glass windows depict an elaborate seven-colored prismatic pattern
(red, orange, yellow, green, blue, indigo, violet) with a six-winged angelic
guardian figure — Seraphiel — at the apex window.
Golden morning sunlight streams through the seven-color glass,
casting prismatic light onto a polished marble floor.
At the center: a stone altar adorned with a silver chalice and white candles,
a tall iron cross behind it. Vaulted ceilings of pale ivory stone,
rows of polished wooden pews lining either side.
A female holy paladin matching the reference image kneels before the altar,
seen from behind — flowing white-silver hair, white-and-gold ornate armor,
a long silver lance laid beside her, her form bathed in seven-colored light from above.
Soft, sacred atmosphere, anime fantasy illustration style,
warm golden tones with vivid prismatic accents, particles of light dust drifting in the air.
Wide cinematic interior shot from rear-three-quarters perspective.
```

---

## 【7】serapia_sunset.png — 2-3 港町セラピア (夕暮れ)

- **対応シーン**: 2-3 港町セラピア (イザベルとシャンティの初対面)
- **本文行**: `STORY/s1c2.md` l.114〜「南方の港町セラピアに着いた頃には、 夕暮れだった」 「オレンジ色に染まる桟橋」 / l.130〜「紅い長コートを翻し、 双剣を腰に差した、 赤毛の女が大笑いしている」
- **役割**: 本文インライン挿絵 (場所転換の演出)
- **被写体**: 夕暮れの港町、 桟橋、 紅玉号 (背景)、 イザベル + ラナス (左) / シャンティ (右)
- **ストーリー全体との整合**: 陸の白 (教会) と海の紅 (海賊団) の対比 → 後の波紋の聖女が「海と陸の橋渡し」 になる象徴。 イザベルが教会の鎧でしか自分を見れない時期の最後の姿
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-3']` (実装後)

> **添付画像** (生成時):
> - `images/characters/season1/ssr/paladin_lady.png` (イザベル SSR、 桟橋左)
> - `images/characters/season1/ssr/pirate_captain.png` (シャンティ SSR、 桟橋右)
> - `images/characters/season1/sr/holy_guardian.png` (ラナス SR、 イザベル背後で警戒)

```
A bustling southern harbor town at sunset, named Serapia.
A long wooden pier extends into a calm sea bathed in orange-gold sunset light.
On the pier, two women face each other across a few paces of distance.
On the left: a female holy paladin matching the first reference image —
white-and-gold armor, silver-blonde flowing hair, a long silver lance in hand,
modest and composed posture. Behind her: a young male holy knight matching
the third reference image — silver-white armor, sword at his side, vigilant
expression, standing ready to draw.
On the right: a bold female pirate captain matching the second reference image —
red long coat, large feathered tricorn hat, twin curved blades on her hips,
golden eyes glinting with mischief, laughing aloud.
Background: tall masts of pirate galleons rise, their crimson sails partially furled,
silhouetted against the setting sun. Stone-and-timber buildings line the shore,
lanterns being lit one by one, fishermen carrying baskets, seabirds wheeling overhead.
The horizon glows with deep amber and rose, the sea reflecting molten gold.
The visual contrast between the white-clad church faction and the red-clad pirate
faction is striking — the meeting of two worlds.
Anime fantasy illustration style, warm twilight atmosphere,
vibrant orange and rose-pink palette with cool blue ocean below.
Wide cinematic shot from a slightly elevated angle on the pier, side-on perspective.
```

---

## 【8】crimson_pearl_night.png — 2-4 海賊船の夜

- **対応シーン**: 2-4 海賊船の夜 (船上対話、 一夜の小休止)
- **本文行**: `STORY/s1c2.md` l.166〜「紅玉号——シャンティの船は、 思ったよりも、 ずっと整然としていた」 / l.205「月のない夜だった」
- **役割**: 本文インライン挿絵 (戦闘前の静かな夜)
- **被写体**: 紅玉号甲板、 月のない夜、 ランタンの灯、 シャンティ (船尾煙草) + ケイレブ + ミカ
- **ストーリー全体との整合**: 「月のない夜」 = 後の「黒月の前兆」 (S1C5/C7) を視覚的に暗示。 月のない夜の海はまだ静かだが、 影喰い襲来直前の不穏さを孕む。 ストーリー全体で「月のない夜」 が再登場する時の伏線
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-4']` (実装後)

> **添付画像** (生成時):
> - `images/characters/season1/ssr/pirate_captain.png` (シャンティ SSR、 船尾で煙草)
> - `images/characters/season1/sr/pirate_firstmate.png` (ケイレブ SR、 中央甲板)
> - `images/characters/season1/r/pirate_cabin_girl.png` (ミカ R、 甲板を駆ける)

```
The deck of a pirate galleon at night, on a moonless sea — the night sky shows
absolutely no moon, only scattered cold stars, hinting at an ominous absence.
The ship "Crimson Pearl" cuts through dark water, its crimson sails barely visible
against a starless midnight sky. Lanterns hang from the masts and railings,
casting warm amber pools of light onto polished wooden planks.
At the stern: a bold female pirate captain matching the first reference image —
red coat, large feathered tricorn hat, twin curved blades on her waist —
leans against the railing, smoking a thin pipe, the ember glowing red.
Mid-deck: a young male first mate matching the second reference image — black hair,
amber eyes, friendly composed smile, twin curved swords crossed on his back —
stands attentively. Forward of the deck: a young girl apprentice pirate matching
the third reference image — short brown hair, a small dagger at her belt —
runs across the deck with wide curious eyes.
The sea stretches into pure black darkness beyond, only faint phosphorescence
from passing waves visible. The mood is heavy with anticipation,
a calm before unseen danger — the absent moon a subtle hint of greater shadows to come.
Anime fantasy illustration, deep indigo and black with warm amber lantern accents,
side-angle shot from mid-deck height.
```

---

## 【9】shadeova_swarm.png — 2-5 影喰いの群れ

- **対応シーン**: 2-5 影喰いの群れ (海上戦闘)
- **本文行**: `STORY/s1c2.md` l.213〜「左舷! 左舷に、 影が!」 / l.220〜「珊瑚色の鱗を黒く侵食された巨大な魚影が、 続々と海面から飛び出してくる」 / l.253〜「サメの背に立つのは、 褐色の肌に黒髪の活発な少女——」
- **役割**: 本文インライン挿絵 (戦闘の緊迫感、 影喰いの脅威可視化)
- **被写体**: 紅玉号、 海面に飛び出す巨大影喰い、 イザベル+シャンティ+モルガが各方向から戦う
- **ストーリー全体との整合**: 影喰いは原虹七色を侵食する敵 → ストーリー全体の主敵設定の一例。 ネプテア発言「青の音が薄れている」 (l.341) と直結する戦闘シーン。 影喰いの黒vs聖光の七色の対比は終盤決戦 (S1C7) と同じ構図
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-5']` (実装後)

> **添付画像** (生成時):
> - `images/characters/season1/ssr/paladin_lady.png` (イザベル SSR、 中央で槍構え)
> - `images/characters/season1/ssr/pirate_captain.png` (シャンティ SSR、 双剣で切り込む)
> - `images/characters/season1/sr/shark_tamer.png` (モルガ SR、 サメの背中で参戦)

```
A pirate galleon under attack at midnight by monstrous shadow creatures.
Massive fish-like silhouettes — once coral-colored, now corrupted with
blackened scales and pulsing dark veins, eyes glowing violet — leap from
the dark sea around the ship "Crimson Pearl". Their forms twisted and predatory,
some larger than the ship itself. The ship rocks violently, lanterns swinging,
sailors drawing weapons. Sprays of dark water and shadow miasma rise in arcs
against the moonless sky.
At the center of the deck: a holy paladin matching the first reference image —
white-and-gold armor, silver-blonde hair — raises a glowing silver lance,
holy white-gold light piercing the darkness, banishing creatures into motes of light.
On the left side of the deck: a bold pirate captain matching the second reference
image — red coat, tricorn hat, twin curved blades drawn — leaps forward to slash
a charging shadow creature in half. Surfacing from the sea on the right: a tan-skinned
ocean nomad girl matching the third reference image — short black hair, ocean-blue
seafaring clothing — rides atop a massive white shark, charging into the swarm,
followed by dolphins and giant sea-beasts breaching the waves.
The composition shows holy light vs corrupting shadow on a grand scale —
a microcosm of the prismatic world's eternal struggle.
Anime fantasy battle illustration, high contrast between holy white-gold light
and oppressive black-violet shadow, dramatic dynamic composition,
wide cinematic shot from mid-air angle showing all three protagonists and the swarm.
```

---

## 【10】ripple_saint_awakening.png — 2-11 波紋の聖女覚醒

- **対応シーン**: 2-11 波紋の聖女 (S1C2 クライマックス、 SSR→UR覚醒の瞬間)
- **本文行**: `STORY/s1c2.md` l.479〜「光の中で、 私の鎧が、 変容した」 / l.488〜「聖槍『天穹』も変容した。 白い穂先が、 虹色の刃へと変わり」 / l.494「ネプテアが、 深く頷いた」
- **役割**: 本文インライン挿絵 (覚醒の絶頂、 物語の山場)
- **被写体**: 覚醒イザベル UR (中央メイン)、 ネプテア UR (右、 見守り頷き)、 海溝の底、 七色波紋
- **ストーリー全体との整合**: 七色波紋 → S1C7 黒月決戦の七座級戦力としての姿 (outline.md 伏線リスト記載済) / ネプテアと姉妹盟約の視覚化 / 黒い亀裂が七色光で塞がれる = 「青の音」 の祈りが復活 = 原虹七色の世界が守られた瞬間
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-11']` (実装後)

> **添付画像** (生成時):
> - `images/characters/season1/ur/ripple_saint.png` (波紋の聖女イザベル UR、 中央メイン)
> - `images/characters/season1/ur/sea_queen.png` (ネプテア UR、 右側で見守る)

```
A radiant awakening at the bottom of a deep ocean trench.
A holy paladin matching the first reference image — in her awakened form,
rainbow-iridescent armor more elaborate than before, shoulder ornaments unfurling
into seven-colored wings of light, a central rainbow prism core glowing in her chest plate
casting seven-colored beams into the surrounding seawater, silver-rainbow gradient hair
flowing weightlessly, eyes glowing turquoise with rainbow ripples — floats at the
center of an explosive prismatic vortex.
She holds a long ceremonial spear whose pristine white blade has transformed
into a rainbow-colored crystal edge, trailing concentric prismatic ripples
through the deep water. To her right: the silver-haired sea queen matching
the second reference image — long silver-blue flowing hair, coral and pearl crown,
trident grounded by her side, nodding deeply with reverent approval, her aquamarine
aura mingling with the rainbow light. Around them: black abyss receding before
the rainbow light, shadow creatures dissolving into motes of color, a black rift
in the seafloor sealing closed with prismatic light, sealed by the ripples.
Anime fantasy illustration, ascendant ceremonial atmosphere,
vibrant rainbow palette against deep indigo-black,
dramatic central composition, spiritual awakening pose,
wide cinematic shot facing the awakening figure with the queen as supporting witness.
```

---

## 【11】serapia_dawn.png — 2-13 夜明けの港 (帰還)

- **対応シーン**: 2-13 夜明けの港 (帰還、 物語の締め)
- **本文行**: `STORY/s1c2.md` l.576〜「セラピアの港に戻ったのは、 夜明けだった」 / l.578〜「ミカが私の手を握って、 笑った」 / l.605〜「朝陽が、 海から昇り、 虹霊界の南方を七色に染めていた」
- **役割**: 本文インライン挿絵 (物語の余韻、 章の締め)
- **被写体**: 朝焼けのセラピア港、 七色に染まる空、 紅玉号、 覚醒イザベル UR + ミカ
- **ストーリー全体との整合**: 朝陽の七色 = 原虹七色の世界が今も保たれている象徴 / 2-3 (夕暮れ) と対をなす朝焼けで 「失われていない」 ことを示す / 物語の最後の七色 → 次の章への希望 + S1C7 までずっと続く「七色を守る祈り」 のテーマ
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c2']['2-13']` (実装後)

> **添付画像** (生成時):
> - `images/characters/season1/ur/ripple_saint.png` (覚醒後イザベル UR、 紅玉号甲板)
> - `images/characters/season1/r/pirate_cabin_girl.png` (ミカ R、 イザベルの隣で見上げる)

```
The southern harbor town of Serapia at sunrise.
The sun rises directly from the eastern sea, casting a long golden path across the water.
The sky transitions from deep indigo at the top to soft rose, gold, and full prismatic
seven-color rainbow hues at the horizon — a vivid sign that the prismatic world's
harmony has been preserved.
A pirate galleon with crimson sails (the Crimson Pearl) is moored at the pier,
its silhouette warm against the dawn light.
On the deck of the galleon: a holy paladin in her awakened form matching the first
reference image — rainbow-iridescent armor, seven-colored light wings folded gently
behind her, silver-rainbow gradient hair, serene expression — kneels lightly to face
a young pirate apprentice girl matching the second reference image — short brown hair,
a small dagger at her belt, looking up with bright admiring eyes.
The paladin's hand rests softly on the girl's head in a gesture of farewell blessing.
Mist drifts low over the water, seabirds beginning their morning calls.
The harbor is quiet and reverent, holding the stillness of a new day after great trial.
Anime fantasy illustration style, hopeful and ascendant atmosphere,
soft full-rainbow gradient sky, golden hour color palette with prismatic highlights.
Wide cinematic shot from the pier, looking eastward toward the rising sun and the ship.
```

---

# 配置サマリ (一覧)

## Phase 1 — 既存5枚 (アクアシス系背景画像)

| シーン | 画像 | 本文行 | 用途 | 備考 |
|---|---|---|---|---|
| **2-7 冒頭 (1)** | `entrance.png` | l.313 | 段落マーカー or インライン | 進入連続 1/2 (Phase 2 で実装予定) |
| **2-7 冒頭 (2)** | `city.png` | l.316 | 背景画像 | 進入連続 2/2 (LOCATION_CONFIG Phase 1 実装済) |
| **2-7 後半** | `throne.png` | l.322 | 段落マーカー or インライン | 一旦別ピース (Phase 2 で実装予定) |
| **2-9 黒い亀裂** | `rift.png` | l.391 | 背景画像 | 単独表示 (LOCATION_CONFIG Phase 1 実装済) |
| (ワールドマップ) | `palace.png` | — | ワールドマップ専用 | ストーリー未使用、 Task L (ワールドマップ Genshin風) で実装時に組込 |

## Phase 2 — 新規6枚 (本文インライン挿絵 + 物語全体に七色伏線を散りばめる)

| シーン | 画像 | 本文行 | 用途 | ストーリー全体での意味 |
|---|---|---|---|---|
| **2-1 教会の朝** | `church_morning.png` | l.33 | インライン挿絵 | 七色ステンドグラスでイザベル覚醒 (七色波紋) の伏線 |
| **2-3 港町セラピア (夕暮れ)** | `serapia_sunset.png` | l.114 | インライン挿絵 | 陸の白×海の紅の対比、 後の橋渡し象徴 |
| **2-4 紅玉号の夜** | `crimson_pearl_night.png` | l.166 | インライン挿絵 | 月のない夜 = 黒月の前兆を視覚的に暗示 |
| **2-5 影喰いの群れ** | `shadeova_swarm.png` | l.213 | インライン挿絵 | 影喰い vs 七色 = 終盤決戦 (S1C7) の縮図 |
| **2-11 波紋の聖女覚醒** | `ripple_saint_awakening.png` | l.479 | インライン挿絵 | UR覚醒、 七座級戦力の視覚化 (S1C7 黒月決戦の伏線) |
| **2-13 夜明けの港 (帰還)** | `serapia_dawn.png` | l.576 | インライン挿絵 | 朝陽の七色 = 原虹七色が守られた象徴、 次章への希望 |

## 場所画像なしシーン (CSSグラデ背景のみ)

| シーン | 本文行 | 備考 |
|---|---|---|
| 2-2 派遣の命 (大主教執務室) | l.61 | 室内シーン、 短いので不要 |
| 2-6 ネプテア (海面浮上) | l.265 | キャラカットイン `sea_queen.png` で対応済 |
| 2-8 同行者たち (宮殿の控えの間) | l.363 | 短いシーン、 throne 余韻でOK |
| 2-10 自分自身の祈り | l.435 | 内面回想、 場所画像不要 |
| 2-12 帰り道 | l.526 | 移動の余韻、 場所画像不要 |

---

## S1C1 場所画像 (タスク残)

→ `STORY/prompts/locations_s1c1.md` を別途新規作成予定。同じ規約 (対応シーン・本文行・役割・被写体・ストーリー使用・コード参照) で書く。

---

## 使い方メモ

- 末尾に `high detail, 16:9` (横長) または `vertical, 9:16` (縦) を追加で比率指定
- 全プロンプトはアニメ風ファンタジー、深海色 (青緑+金) を統一
- 添付画像は `images/characters/season1/{tier}/{name}.png` から指定
