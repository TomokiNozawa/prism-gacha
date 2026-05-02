# Prismaera 場所画像プロンプト — Season 1 第5章「黒月の予兆」

S1C5「黒月の予兆」 (POV: シオン、 銀霜王国 仮面騎士) の場所画像 (背景+挿絵) の DALL-E 3 用プロンプト。

> **🎯 引き継ぎ規約 (重要)**
>
> 各画像セクション冒頭に必ず以下のメタデータを書く。 別セッション・別PCで自分自身が引き継いだ時に推測で誤マッピングしないため (CLAUDE.md / `feedback_asset_scene_mapping.md`)。
>
> - **対応シーン**: ストーリー上の章節 (例: `4-1 黒月の祭壇`)
> - **本文行**: `STORY/s1c5.md` の該当行 + 直接引用フレーズ (本文執筆後に追記)
> - **役割**: 単独表示か連続表示か、 どの位置か
> - **被写体**: 画像実物に何が描かれているか
> - **ストーリー使用**: ✅ (ストーリー再生で表示) / ❌ (ワールドマップ等の別用途)
> - **コード参照**: `LOCATION_CONFIG['s1c5']['シーン']` / `STORY_LOCATION_INLINE_CONFIG['s1c5']` (実装後に記載)

> **🎯 比率規約**: 背景 = **3:4 縦長 (1024×1536)** / 挿絵 = **16:9 横長 (1672×941)** (野沢方針 2026-05-01)

> **🎯 形式規約 (絶対)**: 全プロンプトを **単一ブロック prose** (s1c2/s1c3/s1c4 locations.md と同形式) で記述。 多段パラグラフ (キャラ/設定/スタイル/解剖の分割) は禁止。

> **🎯 キャラ含む画像 (添付ありプロンプト)**:
> - `CRITICAL ANATOMY REQUIREMENTS` 必須 (5本指・関節・武器の握り)
> - 末尾文言「元画像から表情や姿勢は変わってOKです」 必須
> - リファ画像添付指示を画像セクション冒頭に明記

> **🎯 純風景 (添付なし)**: anatomy 指示・末尾文言 不要、 `Aspect ratio X:Y, high detail.` で締める

---

## 整合性: outline.md 通読確認済 (S1C4 エピローグ → S1C5 → S1C6 引き)

- **前章引き**: S1C4 エピローグ 観測者三柱「次は、 西だ」 「銀霜の月が、 仮面を呼ぶ」 「光の側と影の側」 「自分の中の影を、 見つめる夜だ」 → S1C5 で銀霜王国 (シオン) が実際の舞台
- **S1C5 仕込み伏線 (新規、 outline.md 伏線リスト記載済)**:
  - シ・ロエン覚醒 → S2C1「眠れる主の世界」 主人公として再登場
  - ノクトリア (ヴォイドラの代弁者) → S1C7 黒月決戦 + S2C5「影との和解」 交渉役
  - 黒月衆ノクトス → S1C7 全派閥決戦の敵勢力
  - 地底市リオラの民「影と共生する歴史」 → S2C5 歴史的先例
  - 銀霜王ノヴァのシオン依存 → S2 龍譲位類比
  - リオラエル「観測者と同時代の古き存在」 → S2C4 千年記憶のキー
- **既存伏線回収 (s1c5 で実発)**:
  - s1c2 ネプテア「青の音が薄れる」 / SR_ティアラ「水晶玉が黒く濁った夜」 → 黒月の前兆として可視化 (3-1)
  - s1c2 SR_ラナス「シオンへの兄弟弟子」 → 教会の塔で再会 (2-3) + 祭壇の儀式に立ち会う (4-1)
  - s1c3 ファラー「世界の縫い目が緩んでいる」「ヴォイドラが力を取り戻している」 → 西で実発 (2-1 黒月衆)
  - s1c4 観測者三柱「次は西、 銀霜の月、 仮面、 光の側と影の側」 → 全章を貫く
- **既存背景キーワード** (`_common.md` 準拠):
  - 銀霜王国: `silver-frost throne hall at midnight`
  - 黒月衆ノクトス (新派閥、 S1C5): `black crescent moon over cracked stone ruins`
  - 地底市リオラ (新派閥、 S1C5): `deep underground city with bioluminescent blue-violet lights and woven shadow-light tapestries` ← `_common.md` 派閥背景テーブルに追加要

---

## S1C5 シーン対応表

| # | filename | 比率 | 役割 | 対応シーン | キャラ |
|---|---|---|---|---|---|
| 1 | observer_west_realm.png | 3:4 | 背景 | プロローグ (観測者三柱「次は西」 観測の場) | (純風景、 天空界の景色) |
| 2 | silver_throne_hall.png | 3:4 | 背景 | 1-1 銀霜王宮 月光謁見の間 | (純風景) |
| 3 | sion_chamber.png | 3:4 | 背景 | 1-2 シオンの私室 (仮面の置かれた机) | (純風景、 静謐) |
| 4 | silver_festival_street.png | 3:4 | 背景 | 1-3 銀霜の市街・祭夜 | (純風景、 群衆遠景のみ) |
| 5 | black_moon_grove.png | 3:4 | 背景 | 2-1 月喰いの森 (黒月衆の隠れ家) | (純風景) |
| 6 | underworld_liora_full.png | 3:4 | 背景 | 3-1 地底市リオラ全景 | (純風景、 都市俯瞰) |
| 7 | moon_shrine_altar.png | 3:4 | 背景 | 3-3 雪月神殿の祭壇 (儀式準備) | (純風景) |
| 8 | observer_west_close.png | 3:4 | 背景 | エピローグ (観測者三柱「次は東」) | (純風景、 天空界、 1番と微差) |
| 9 | royal_assassination_flashback.png | 16:9 | 挿絵 | 2-2 王族暗殺未遂現場 (回想 + 現在) | シオン+刺客 (添付2枚) |
| 10 | church_tower_reunion.png | 16:9 | 挿絵 | 2-3 教会の塔 (シオン+ラナス再会) | シオン+ラナス (添付2枚) |
| 11 | shadow_loom_workshop.png | 16:9 | 挿絵 | 3-2 影織りの工房 (リオラエル + ルナリア + シオン) | 3人 (添付3枚) |
| 12 | mask_separation_ritual.png | 16:9 | 挿絵 | **4-1 山場** 分離の儀式 (シオン+シ・ロエン+ラナス+メイリ+アスター) | シオン+シ・ロエン+ラナス+メイリ+アスター (添付5枚) |
| 13 | shi_loen_departure.png | 16:9 | 挿絵 | 4-2 別れの朝 (シ・ロエン黒月衆へ去る、 シオン見送る) | シオン+シ・ロエン (添付2枚) |

合計 13枚 (背景8 + 挿絵5)。 章規模 +15キャラ + 山場の重みから s1c4 (10枚) より 30% 増。

---

# 【1】observer_west_realm.png — 観測者三柱・西の月の異変観測 (背景、 3:4、 純風景)

- **対応シーン**: プロローグ (観測者三柱が銀霜の月の異変を観測)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 単独表示、 章冒頭の場面を象徴 (s1c4 エピローグの続き)
- **被写体**: 天空界の天空、 七色の渦、 三つの観測者の座 (うっすら輪郭)、 西の銀霜の月が黒く欠け始めている
- **ストーリー使用**: ✅ s1c5 プロローグ 背景
- **コード参照**: `LOCATION_CONFIG['s1c5']['プロローグ']`

```
fantasy painting of an ethereal celestial observation realm of the seven seats with three thrones partially visible as luminous outlines, vast cosmic backdrop with the seven prismatic streams of the genso (rainbow rivers) flowing slowly across an infinite navy violet void, in the upper-right portion of the sky a silver crescent moon is partially eclipsing into a black crescent shape with violet void cracks beginning to spread from its edges, scattered floating star fragments and broken silver light particles drifting through the void, three faint translucent silhouettes of seated divine observers in the foreground (only soft outlines visible, identities deliberately obscured), atmospheric perspective with the eclipsing silver-to-black moon as the visual focus, ominous yet beautiful prophetic atmosphere, no specific characters visible only soft silhouettes, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【2】silver_throne_hall.png — 銀霜王宮の月光謁見の間 (背景、 3:4、 純風景)

- **対応シーン**: 1-1 銀霜王宮 (シオンが王ノヴァに月夜の儀を命じられる)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 単独表示、 銀霜王国の威厳と月夜の静謐
- **被写体**: 銀霜王宮の謁見の間、 銀の柱、 高い月光の窓、 銀の玉座 (ノヴァが座る位置)、 月光が床に三日月模様を投げる
- **ストーリー使用**: ✅ s1c5 1-1 背景
- **コード参照**: `LOCATION_CONFIG['s1c5']['1-1']`

```
fantasy painting of a vast silver-frost throne hall of the Silver Frost Kingdom (Ginsou) at midnight, towering polished silver columns with delicate frost-and-moon engravings rising into the high vaulted ceiling, tall arched windows with pale-blue moonlight streaming through casting long crescent moon shadows across the polished silver floor, an ornate silver and pale-blue royal throne with crescent moon engravings at the far end on a raised dais of three steps, twin silver royal banners with crescent moon emblems flanking the throne, hanging silver chandeliers with floating pale-blue spirit lanterns gently illuminating the hall, the seven prismatic streams of the genso flowing softly through the high vaulted ceiling visible through the moonlit windows, atmospheric perspective with pale-blue mist drifting between the pillars, dignified solemn moonlit atmosphere, no people, no characters, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【3】sion_chamber.png — シオンの私室 (仮面の置かれた机) (背景、 3:4、 純風景・静謐)

- **対応シーン**: 1-2 シオン私室 (仮面を外して内省するシーン)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 単独表示、 「仮面の下のもう一人」 のテーマを象徴
- **被写体**: シンプルな騎士の私室、 木製の机に銀の仮面が静かに置かれている、 壁に剣と盾が掛かっている、 月光が窓から差し込む
- **ストーリー使用**: ✅ s1c5 1-2 背景
- **コード参照**: `LOCATION_CONFIG['s1c5']['1-2']`

```
fantasy painting of a quiet austere knight's private chamber at midnight in the silver-frost kingdom, a simple wooden writing desk in the center with a single silver knight's mask placed on it carefully (the mask facing upward, its empty eyes catching the moonlight), an open window in the background with pale-blue moonlight streaming through casting a long shadow of the mask across the wooden floor, a single silver mace and round shield hanging on the wall to the left, a folded knight's tabard on a chair, a small silver oil lamp on the desk with a dim flame, atmospheric perspective showing a chamber simultaneously peaceful and lonely, dust motes catching the moonlight, deep contemplative quiet atmosphere, no people, no characters, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【4】silver_festival_street.png — 銀霜の市街・祭夜 (背景、 3:4、 純風景・群衆遠景)

- **対応シーン**: 1-3 銀霜の市街 (祭夜、 シオンが街を歩きながら暗殺予兆を察する)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 単独表示、 平和な祭夜と忍び寄る不穏の対比
- **被写体**: 銀霜の街並み、 紙の三日月灯篭が路地に並ぶ、 遠景の群衆 (シルエットのみ)、 祭の屋台、 月光と灯篭の暖色
- **ストーリー使用**: ✅ s1c5 1-3 背景
- **コード参照**: `LOCATION_CONFIG['s1c5']['1-3']`

```
fantasy painting of a silver-frost villager street during the moon festival at midnight, a long winding stone-paved alley lined with paper crescent moon lanterns hung overhead casting warm golden-orange light, distant silhouetted festival-goers walking and gathering at small festival stalls in the lower distance (only shadow figures, no detailed faces), pale-blue moonlight from above mixing with the warm orange lantern glow creating a contrast of cold and warm, frost-covered slate rooftops with subtle silver moss between stones, hanging silver festival banners with crescent moon emblems, light dusting of snow on the cobbled stones, the seven prismatic streams of the genso flowing faintly across the deep navy sky above, atmospheric perspective with the alley extending into a moonlit distance, peaceful festival atmosphere with a hint of looming unease in the background shadows, no close characters visible only distant tiny silhouettes, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【5】black_moon_grove.png — 月喰いの森・黒月衆の隠れ家 (背景、 3:4、 純風景)

- **対応シーン**: 2-1 月喰いの森 (シオンがノクトリアと接触、 「取引」 を持ちかけられる)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 単独表示、 黒月衆の本拠地の妖しい威容
- **被写体**: 枯れた古樹の森、 中央に石の祭壇、 黒い三日月が空に欠けている、 violet void rifts (亀裂)、 黒月衆の旗
- **ストーリー使用**: ✅ s1c5 2-1 背景
- **コード参照**: `LOCATION_CONFIG['s1c5']['2-1']`

```
fantasy painting of an ominous black crescent moon grove deep in a withered forest at midnight, towering ancient dead trees with twisted branches stretching toward the sky, the trees' gnarled silhouettes covered in subtle violet void crystals growing along the bark, a circular cracked stone altar in the center of a small clearing carved with black crescent moon engravings, a black crescent moon hanging in the upper sky with violet void cracks spreading outward like webs, scattered floating broken star-fragments drifting through the air, dim violet-black mist hanging low along the forest floor, hanging banners of the Black Moon Sect (Nokutosu) with their crescent emblems strung between the dead trees, faint glowing violet runes etched on the cracked stones, atmospheric perspective with the dying forest extending into a misty distance, ominous yet beautiful sacred-corruption atmosphere, no people, no characters, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【6】underworld_liora_full.png — 地底市リオラ全景 (背景、 3:4、 純風景・都市俯瞰)

- **対応シーン**: 3-1 地底市リオラ (シオン到着、 リオラエルとの出会い)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 単独表示、 「影と光の織物」 が織りなす地下都市の威容
- **被写体**: 巨大な地下洞窟空間、 階段状に建つ地下都市、 蒼紫の発光、 影と光が織り交ざる文化の象徴 (織物の旗が随所に)
- **ストーリー使用**: ✅ s1c5 3-1 背景
- **コード参照**: `LOCATION_CONFIG['s1c5']['3-1']`

```
fantasy painting of a vast underground city of Liora carved into a massive crystalline cavern, terraced layered architecture of dark-stone buildings descending the cavern walls in concentric tiers, hundreds of bioluminescent blue-violet crystal formations growing from the cavern ceiling and walls casting soft glowing light across the entire city, a central circular plaza at the bottom with a great loom-shaped monument woven of light-and-shadow tapestries, hanging woven banners of intricate shadow-and-light patterns strung between buildings showing interlocking moon and sun motifs, narrow stone bridges connecting different tiers of the city, small distant silhouettes of inhabitants going about their lives across the tiers (only tiny shadow figures, no detailed faces), the cavern ceiling far above shows a single circular opening through which one shaft of moonlight from the surface descends like a sacred pillar of pale-blue light into the city's center, atmospheric perspective with violet mist drifting through the lower tiers, awe-inspiring sacred underground civilization atmosphere, no close characters visible only distant tiny silhouettes, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

**ポイント**: 「影と光の織物」 が地底市の文化的象徴。 シオンが「影を抱きしめる」 を学ぶ場として、 影と光が等価に織られている世界観を視覚化。

---

# 【7】moon_shrine_altar.png — 雪月神殿の祭壇 (背景、 3:4、 純風景)

- **対応シーン**: 3-3 雪月神殿 (儀式の準備、 シオンが分離の決意を固める)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 単独表示、 山場 4-1 の儀式の舞台 (準備段階)
- **被写体**: 雪月神殿の内部、 中央の月鏡 (鏡面の祭壇)、 周囲に白い灯篭、 二重月夜の予兆 (天井の窓から銀の月と黒の月が同時に見える)
- **ストーリー使用**: ✅ s1c5 3-3 背景
- **コード参照**: `LOCATION_CONFIG['s1c5']['3-3']`

```
fantasy painting of a sacred snow-moon shrine interior at deep midnight, a vast circular ritual hall with polished pale-silver floor reflecting the ceiling, a great circular silver mirror altar in the center (the mirror facing upward toward the ceiling), surrounded by twelve tall white silver shrine lanterns in a circle each with a soft pale-blue flame, ancient silver-and-blue tapestries with crescent moon emblems hanging from the high columns surrounding the hall, the high vaulted ceiling has a great circular skylight opening through which TWO moons are visible simultaneously — a pure silver crescent moon on the right and a void-black crescent moon on the left both reflected together in the mirror altar below — pale-blue moonlight beams streaming down through the skylight illuminating the mirror in dual cold-and-void light, the seven prismatic streams of the genso flowing through the night sky visible above, atmospheric perspective with cold pale-blue mist drifting between the columns, sacred prophetic atmosphere with a sense of impending mystery, no people, no characters, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

**ポイント**: 「銀の月 + 黒の月」 が同時に見える二重月夜は、 山場のシンボル。 鏡の祭壇が分離儀式の舞台。

---

# 【8】observer_west_close.png — 観測者三柱・東への引き (背景、 3:4、 純風景)

- **対応シーン**: エピローグ (観測者三柱「次は東、 七座満つる」 と s1c6 への引き)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 単独表示、 章末の余韻と次章 (s1c6) への引き
- **被写体**: 天空界、 七色の渦、 観測者三柱の座、 東の空に「七色の灯篭」 が灯り始めている (s1c6 = 七座満つる の予兆)
- **ストーリー使用**: ✅ s1c5 エピローグ 背景
- **コード参照**: `LOCATION_CONFIG['s1c5']['エピローグ']`

```
fantasy painting of an ethereal celestial observation realm of the seven seats with three thrones partially visible as luminous outlines, vast cosmic backdrop with the seven prismatic streams of the genso (rainbow rivers) flowing across an infinite navy violet void, the silver crescent moon now restored to its full radiance in the upper-left portion of the sky (the eclipse has passed), in the upper-right portion of the sky four small lantern-like prismatic lights are gently flickering into existence one by one (representing the gradually filling seven seats — foreshadowing s1c6), three faint translucent silhouettes of seated divine observers in the foreground (only soft outlines visible, identities deliberately obscured) gazing toward the eastern lights, scattered floating star fragments drifting peacefully through the void, atmospheric perspective with the eastern awakening lights as the visual focus, hopeful prophetic atmosphere of dawn-after-storm, no specific characters visible only soft silhouettes, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【9】royal_assassination_flashback.png — 王族暗殺未遂現場 (挿絵、 16:9、 シオン+刺客 添付2枚)

**⚠️ 生成前に必ず添付してください**:
- `images/characters/season1/ssr/masked_knight.png` (既存 SSR 仮面騎士シオン)
- `images/characters/season1/sr/black_assassin.png` (新規 SR 黒月の刺客 — 生成後)

→ ChatGPTに2枚の画像添付してから下記プロンプトを送る

- **対応シーン**: 2-2 王族暗殺未遂 (回想 + 現在、 シオンの過去の罪と向き合うシーン)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 山場 4-1 への動機を視覚化、 シオンの「五つ目の誓い」 の背景
- **被写体**: 銀霜王宮の廊下、 シオンが刺客を阻止する瞬間、 倒れる王 (シルエット遠景)
- **ストーリー使用**: ✅ s1c5 2-2 挿絵
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c5']` (entry: scene='2-2', marker='伏線フレーズ', position='after')

```
[Attached: reference image 1 = "Sion" / 銀霜王国の仮面騎士シオン (SSR), reference image 2 = "Black Assassin" / 黒月の刺客 (SR)]

Please create a dynamic illustration of these two characters from the attached references in a tense royal palace assassination attempt scene. Keep the facial features and identities EXACTLY as in the references. Optimize for a moonlit corridor confrontation composition.

anime-style dynamic action illustration of two characters from the references locked in a desperate confrontation, on the LEFT the silver-frost masked knight Sion (SAME face as reference 1 unchanged) lunging forward with his silver mace raised to deflect, his white cape flowing dramatically, his silver mask catching the moonlight, on the RIGHT the slender hooded violet-and-black assassin (SAME mask as reference 2 unchanged) mid-strike with reverse-grip dual daggers their violet edges glowing as they slash toward an unseen target, between them in the BACKGROUND a distant silhouette of a fallen royal figure wearing a silver crown sprawled on the floor in the deep distance (only a tiny shadowed silhouette, deliberately small), setting is a long silver-frost royal palace corridor at midnight with tall arched windows letting in pale-blue moonlight, polished silver columns lining both sides, fallen silver royal banner crumpled in the foreground, sparks of silver light flying from the moment of clashing weapons, dramatic motion blur on capes and weapon trails, cinematic rim lighting with cold silver-blue glow accented by violet-black void streaks emanating from the assassin, urgent tense atmosphere of a moment of deadly stakes, detailed linework, high-quality illustration, Aspect ratio 16:9, horizontal orientation 1672x941, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand for both characters, anatomically correct joints, realistic weapon grips (mace handle held with both hands by Sion, dual daggers in reverse grip by the assassin).

元画像から表情や姿勢は変わってOKです
```

---

# 【10】church_tower_reunion.png — 教会の塔・シオンとラナス再会 (挿絵、 16:9、 シオン+ラナス 添付2枚)

**⚠️ 生成前に必ず添付してください**:
- `images/characters/season1/ssr/masked_knight.png` (既存 SSR シオン)
- `images/characters/season1/sr/holy_guardian.png` (既存 SR 白焔教会騎士 ラナス)

- **対応シーン**: 2-3 教会の塔 (シオンとラナス兄弟弟子の再会、 二人の沈黙の対話)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 山場 4-1 への伏線、 ラナスがシオンの「光の側」 を見届ける証人としての立ち位置を視覚化
- **被写体**: 教会の塔の高い回廊、 二人が並んで月夜の銀霜の街を見下ろす、 言葉を交わさない静謐な兄弟弟子像
- **ストーリー使用**: ✅ s1c5 2-3 挿絵
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c5']` (scene='2-3', position='after')

```
[Attached: reference image 1 = "Sion" / 銀霜王国の仮面騎士シオン (SSR), reference image 2 = "Lanas" / 白焔教会騎士 ラナス (SR)]

Please create a quiet illustration of these two characters from the attached references standing together on a high cathedral tower terrace at midnight. Keep the facial features and identities EXACTLY as in the references. Optimize for a still contemplative brotherly composition.

anime-style contemplative illustration of two characters from the references standing side by side at a high cathedral tower terrace overlooking a moonlit city below, on the LEFT the silver-frost masked knight Sion (SAME face as reference 1 unchanged) leaning lightly with both hands resting on the silver railing, looking out toward the distant city, his silver cape flowing gently in the wind, on the RIGHT the holy white knight Lanas (SAME face as reference 2 unchanged) standing upright next to him in his silver-white plate armor with hand resting on his sword's pommel, also looking out toward the city, both characters facing the same direction with a sense of unspoken understanding between them, setting is a high cathedral tower terrace at midnight in the silver-frost kingdom with tall arched gothic windows behind them and a pale-blue moonlit silver city skyline stretching into the distance below, scattered paper lanterns of the moon festival visible far below in the distant streets, the silver crescent moon hanging in the deep navy sky, gentle wind moving the capes, cinematic rim lighting with soft silver-blue glow and warm distant lantern accents, peaceful contemplative brotherly atmosphere, detailed linework, high-quality illustration, Aspect ratio 16:9, horizontal orientation 1672x941, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand for both characters, anatomically correct joints, realistic hand placements on railings and sword pommel.

元画像から表情や姿勢は変わってOKです
```

**伏線視覚化**: ラナスの「沈黙の誓い」 (SR_ラナス凸秘話「シオンへの兄弟弟子」) を本編で公式画化。 二人が同じ方向を見ている = 「過去の罪を共有しつつ未来を見ている」 兄弟弟子の関係性。

---

# 【11】shadow_loom_workshop.png — 影織りの工房 (挿絵、 16:9、 リオラエル+ルナリア+シオン 添付3枚)

**⚠️ 生成前に必ず添付してください**:
- `images/characters/season1/ur/underworld_matriarch.png` (新規 UR リオラエル)
- `images/characters/season1/ssr/shadow_weaver.png` (新規 SSR ルナリア)
- `images/characters/season1/ssr/masked_knight.png` (既存 SSR シオン)

- **対応シーン**: 3-2 影織りの工房 (リオラエルがシオンに「影を抱きしめる」 を教える、 ルナリアが織物を実演)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 章テーマ「影を抱きしめる」 を視覚化、 山場 4-1 の儀式具 (影織りの糸) の伏線
- **被写体**: 地底市の織物工房、 中央の大きな織機 (光と影の糸が織り合わさる)、 3人が織機を囲む
- **ストーリー使用**: ✅ s1c5 3-2 挿絵
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c5']` (scene='3-2', position='after')

```
[Attached: reference image 1 = "Liorael" / 地底市の母 (UR), reference image 2 = "Lunaria" / 影織りの導師 (SSR), reference image 3 = "Sion" / 仮面騎士シオン (SSR)]

Please create a contemplative illustration of these three characters from the attached references gathered around a great loom in an underground workshop. Keep the facial features and identities EXACTLY as in the references. Optimize for a teaching scene composition with the light-and-shadow loom as the visual focus.

anime-style contemplative illustration of three characters from the references gathered around a great wooden weaving loom in an underground workshop, on the LEFT the matriarch Liorael (SAME face as reference 1 unchanged) standing tall with her staff slightly lowered, gesturing gently with her free hand toward the loom in a teaching posture, in the CENTER the young weaver Lunaria (SAME face as reference 2 unchanged) seated at the loom actively weaving with her obsidian wand spinning a glowing shadow-light thread between the warp, on the RIGHT the silver-frost masked knight Sion (SAME face as reference 3 unchanged) standing slightly behind and watching the weaving in still attentive contemplation, the loom in the center has half-completed tapestry showing interlocking light-and-shadow moon patterns with one half pure silver and the other half pure void-black being woven into a single unified piece, setting is a deep underground workshop carved into a crystalline cavern with bioluminescent blue-violet crystals along the walls casting soft glowing light, hanging completed shadow-light tapestries on the walls behind the characters, scattered weaving tools and shadow-thread spools on a side table, the cavern ceiling above shows soft prismatic light, cinematic rim lighting with twin-tone violet-and-silver glow centered on the loom, peaceful sacred teaching atmosphere, detailed linework, high-quality illustration, Aspect ratio 16:9, horizontal orientation 1672x941, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand for all three characters, anatomically correct joints, realistic loom and tool grips.

元画像から表情や姿勢は変わってOKです
```

**伏線視覚化**: 「one half pure silver and other half pure void-black being woven into a single unified piece」 = 章テーマと山場の儀式具の象徴。

---

# 【12】mask_separation_ritual.png — 分離の儀式 (挿絵、 16:9、 山場、 シオン+シ・ロエン+ラナス+メイリ+アスター 添付5枚)

**⚠️ 生成前に必ず添付してください** (5枚):
- `images/characters/season1/ssr/masked_knight.png` (既存 SSR シオン)
- `images/characters/season1/ur/shadow_apostle.png` (新規 UR シ・ロエン)
- `images/characters/season1/sr/holy_guardian.png` (既存 SR ラナス)
- `images/characters/season1/sr/frost_priestess.png` (既存 SR 銀霜の巫女 メイリ)
- `images/characters/season1/sr/moon_priest.png` (新規 SR 雪月神殿祭司 アスター)

- **対応シーン**: 4-1 黒月の祭壇・分離の儀式 (**章の山場**)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: **本章のクライマックス**、 二重月夜の祭壇、 シオンが仮面を外し、 シ・ロエンと向き合う瞬間
- **被写体**: 雪月神殿の祭壇、 中央の月鏡から立ち上がる影の人型 (シ・ロエン誕生)、 シオンが仮面を脇に置く、 ラナス + メイリ + アスターが証人として周囲に立つ
- **ストーリー使用**: ✅ s1c5 4-1 挿絵 (山場、 大判)
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c5']` (scene='4-1', position='before' - 山場の本文直前)

```
[Attached: reference image 1 = "Sion" (SSR), reference image 2 = "Shi-Loen" (UR), reference image 3 = "Lanas" (SR), reference image 4 = "Meili" (SR銀霜の巫女), reference image 5 = "Aster" (SR雪月神殿祭司)]

Please create the climactic illustration of these five characters from the attached references at the moment of the mask separation ritual. Keep the facial features and identities EXACTLY as in the references. Optimize for a sacred ceremony composition with the dual-moon mirror altar as the visual focus.

anime-style climactic ceremony illustration of five characters from the references gathered at a great circular silver mirror altar in a sacred shrine at midnight under a dual moon, in the CENTER the silver-frost knight Sion (SAME face as reference 1 unchanged) standing upright having JUST removed his silver mask now held in his right hand at his side, his face exposed for the first time with a serene resolved expression, his eyes catching the moonlight, RISING from the mirror altar in front of him is the shadow apostle Shi-Loen (SAME face as reference 2 unchanged) emerging from the silver mirror's surface like a living mirror image stepping out, the figure half-formed of black smoke and violet void light gradually solidifying into Shi-Loen's full form, the broken half-mask of Shi-Loen taking shape on the left side of his face, on the LEFT and RIGHT the witnesses standing in respectful silent vigil — Lanas the holy knight (SAME face as reference 3 unchanged) on the far left with both hands clasped in front, the priestess Meili (SAME face as reference 4 unchanged) holding a small silver lantern, and the moon-priest Aster (SAME face as reference 5 unchanged) holding his ceremonial staff vertically as the ritual conductor, the mirror altar on the floor reflects both moons simultaneously — pure silver crescent visible on its right half and void-black crescent visible on its left half — pale-blue moonlight and violet void light streaming down from the open skylight above where the dual moons hang side by side in the night sky, the seven prismatic streams of the genso swirling around the entire scene, twelve tall silver shrine lanterns surrounding the altar in a circle each emanating soft pale-blue flames, sacred and weighty atmosphere with epic emotional resonance, dramatic rim lighting with twin-tone silver-and-violet glow centered on Sion and Shi-Loen, detailed linework, high-quality illustration, Aspect ratio 16:9, horizontal orientation 1672x941, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand for all five characters, anatomically correct joints, realistic grips on mask, lantern, and staff.

元画像から表情や姿勢は変わってOKです
```

**ポイント**: 本章のすべての伏線が収束する場面。 「二重月の同時表示」「鏡から立ち上がる影」「証人三人の沈黙」 = 山場のフォーカル。 シオンの「素顔」 を公式画で初めて描く (本編で「素顔を知るのは王族・イザベル・セラフィエルの3人」 とあるが、 章末でラナス・メイリ・アスターも知る側に追加される — シオンの新しい誓いとして)。

---

# 【13】shi_loen_departure.png — シ・ロエン黒月衆へ去る朝 (挿絵、 16:9、 シオン+シ・ロエン 添付2枚)

**⚠️ 生成前に必ず添付してください**:
- `images/characters/season1/ssr/masked_knight.png` (既存 SSR シオン、 仮面戻した姿)
- `images/characters/season1/ur/shadow_apostle.png` (新規 UR シ・ロエン)

- **対応シーン**: 4-2 別れの朝 (シ・ロエンが黒月衆へ去る、 シオンが見送る)
- **本文行**: `STORY/s1c5.md` (執筆後に追記)
- **役割**: 章末の余韻、 S2C1「眠れる主の世界」 への引き
- **被写体**: 雪原の朝、 シ・ロエンが背を向けて遠くへ歩いていく、 シオンが立ち止まって見送る
- **ストーリー使用**: ✅ s1c5 4-2 挿絵
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c5']` (scene='4-2', position='after')

```
[Attached: reference image 1 = "Sion" (SSR), reference image 2 = "Shi-Loen" (UR)]

Please create a quiet emotional illustration of these two characters from the attached references at a moment of departure across a snowy field at dawn. Keep the facial features and identities EXACTLY as in the references. Optimize for a melancholic-yet-hopeful parting composition.

anime-style emotional parting illustration of two characters from the references at a snowy frost field at dawn, on the LEFT in the foreground the silver-frost masked knight Sion (SAME face as reference 1 unchanged) standing still with his silver mask now back on his face but his hand resting on his chest in silent acknowledgment, his white cape gently moving in the dawn wind, on the RIGHT in the middle distance the shadow apostle Shi-Loen (SAME face as reference 2 unchanged) walking away from Sion with his back partly turned toward the viewer but turning his head slightly to look back over his shoulder one final time with a faint resolved smile, his torn black cloak fluttering with shadow particles, behind Shi-Loen in the FAR distance the silhouettes of the Black Moon Sect (Nokutosu) gathered waiting for him at the edge of the field with their banners rising in the dawn mist, between Sion and Shi-Loen the snowy ground bears two sets of footprints in the frost — one set of silver footprints leading toward Sion now stopped, and one set of dark footprints continuing onward toward the Black Moon Sect, setting is a vast pale silver-frost field at dawn with the silver crescent moon now setting in the western sky and a faint warm dawn light from the east beginning to color the snow in gentle gold, scattered shadow-light particles drifting through the air like falling petals, the seven prismatic streams of the genso flowing softly across the dawn sky, melancholic yet quietly hopeful atmosphere of acceptance and parting, dramatic rim lighting with twin-tone silver-and-warm-gold glow, detailed linework, high-quality illustration, Aspect ratio 16:9, horizontal orientation 1672x941, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand for both characters, anatomically correct joints, realistic stances and walking postures.

元画像から表情や姿勢は変わってOKです
```

**伏線視覚化**: 「two sets of footprints」 = 二人が別の道を歩み始める象徴 (S2C1 で再会するまでの長い道)。 「dawn light beginning to color the snow」 = 章末の希望、 シオンが「光だけ」 を残した未来への一歩。

---

## 📋 スマホ生成用まとめ (生成順 + 対応シーン + キャラ添付要否)

| # | filename | 比率 | シーン | キャラ添付 |
|---|---|---|---|---|
| 1 | observer_west_realm.png | 3:4 | プロローグ | なし (純風景) |
| 2 | silver_throne_hall.png | 3:4 | 1-1 王宮 | なし |
| 3 | sion_chamber.png | 3:4 | 1-2 私室 | なし |
| 4 | silver_festival_street.png | 3:4 | 1-3 祭夜 | なし |
| 5 | black_moon_grove.png | 3:4 | 2-1 月喰いの森 | なし |
| 6 | underworld_liora_full.png | 3:4 | 3-1 地底市全景 | なし |
| 7 | moon_shrine_altar.png | 3:4 | 3-3 雪月神殿 | なし |
| 8 | observer_west_close.png | 3:4 | エピローグ | なし |
| 9 | royal_assassination_flashback.png | 16:9 | 2-2 暗殺現場 | シオン + 黒月の刺客 |
| 10 | church_tower_reunion.png | 16:9 | 2-3 教会の塔 | シオン + ラナス |
| 11 | shadow_loom_workshop.png | 16:9 | 3-2 影織り | リオラエル + ルナリア + シオン |
| 12 | mask_separation_ritual.png | 16:9 | **4-1 山場** | シオン + シ・ロエン + ラナス + メイリ + アスター |
| 13 | shi_loen_departure.png | 16:9 | 4-2 別れ | シオン + シ・ロエン |

生成結果は `images/locations/s1c5/<filename>` にそのまま保存。
完了時に thumb 版 `images/locations/s1c5/thumb/<basename>_thumb.webp` を作成 (Phase 1-B 完了後の規約)。

## 派閥背景キーワード追加 (`prompt/_common.md` への todo)

S1C5 で新派閥追加に伴い、 `prompt/_common.md` の派閥背景テーブルに 1 行追加要:

| 軸 | 派閥 | 背景キーワード |
|---|---|---|
| 境界 | 地底市リオラ (S1C5〜) | `deep underground city with bioluminescent blue-violet lights and woven shadow-light tapestries` |

(黒月衆ノクトス の行は既に `_common.md` に存在 — `black crescent moon over cracked stone ruins`)
