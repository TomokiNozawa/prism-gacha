# Prismaera 場所画像プロンプト — Season 1 第4章「凍土と空」

S1C4「凍土と空」 (POV: アルテミス、 龍国 龍帝) の場所画像 (背景+挿絵) の DALL-E 3 用プロンプト。

> **🎯 引き継ぎ規約 (重要)**
>
> 各画像セクション冒頭に必ず以下のメタデータを書く。 別セッション・別PCで自分自身が引き継いだ時に推測で誤マッピングしないため (CLAUDE.md / `feedback_asset_scene_mapping.md`)。
>
> - **対応シーン**: ストーリー上の章節 (例: `2-2 氷帝との一騎打ち`)
> - **本文行**: `STORY/s1c4.md` の該当行 + 直接引用フレーズ (本文執筆後に追記)
> - **役割**: 単独表示か連続表示か、 どの位置か
> - **被写体**: 画像実物に何が描かれているか
> - **ストーリー使用**: ✅ (ストーリー再生で表示) / ❌ (ワールドマップ等の別用途)
> - **コード参照**: `LOCATION_CONFIG['s1c4']['シーン']` / `STORY_LOCATION_INLINE_CONFIG['s1c4']` (実装後に記載)

> **🎯 比率規約**: 背景 = **3:4 縦長 (1024×1536)** / 挿絵 = **16:9 横長 (1672×941)** (野沢方針 2026-05-01)

> **🎯 形式規約 (絶対)**: 全プロンプトを **単一ブロック prose** (s1c2/s1c3 locations.md と同形式) で記述。 多段パラグラフ (キャラ/設定/スタイル/解剖の分割) は禁止。

> **🎯 キャラ含む画像 (添付ありプロンプト)**:
> - `CRITICAL ANATOMY REQUIREMENTS` 必須 (5本指・関節・武器の握り)
> - 末尾文言「元画像から表情や姿勢は変わってOKです」 必須
> - リファ画像添付指示を画像セクション冒頭に明記

> **🎯 純風景 (添付なし)**: anatomy 指示・末尾文言 不要、 `Aspect ratio X:Y, high detail.` で締める

---

## 整合性: outline.md 通読確認済 (S1C3 エピローグ → S1C4 → S1C5 引き)

- **前章引き**: S1C3 エピローグ 観測者三柱「次は、 北だ」 「凍土と、 空が、 揺れる」 → S1C4 で凍土と空 (氷霊王国 + 空挺城) が実際の舞台
- **S1C4 仕込み伏線**:
  - グレイル「凍土の戦力」 → S1C7 黒月決戦で再登場 (七座級) の予兆
  - ヴァーレ機械工学 → S2C3「沈黙の塔」 機械文明覚醒の前奏
  - ユーリス予言「龍を譲る相手」 → S2 龍帝退位への布石
  - ヒノオウ回想 → アルテミス既存凸秘話「ヒノオウとの夜」 との完全整合 (二十歳の戦場、 背中合わせで影喰い斬り)
  - エピローグ「次は、 西だ」 「銀霜の月が、 仮面を呼ぶ」 → S1C5 シオン (銀霜王国) への引き
- **既存背景キーワード** (`_common.md` 準拠):
  - 龍国 (アルテミス本拠): `imperial jade throne with golden lantern mist`
  - 氷霊王国ニーヴル (新派閥、 S1C4): `frozen tundra under pale blue moonlight`
  - 空挺城ゼノニア (新派閥、 S1C4): `steampunk floating fortress sky with brass cogs`

---

## S1C4 シーン対応表

| # | filename | 比率 | 役割 | 対応シーン | キャラ |
|---|---|---|---|---|---|
| 1 | imperial_jade_palace.png | 3:4 | 背景 | プロローグ / 1-1 龍国玉座 | (純風景) |
| 2 | frozen_tundra_journey.png | 3:4 | 背景 | 1-3 雪原を行く | (純風景、 遠景人影のみ) |
| 3 | niiruru_ice_palace.png | 3:4 | 背景 | 2-1 氷宮殿謁見の間 | (純風景) |
| 4 | zenonia_floating_fortress.png | 3:4 | 背景 | 3-1 空挺城外観 | (純風景) |
| 5 | snow_field_silence.png | 3:4 | 背景 | 3-3 山場 (雪原で空を見上げる) | アルテミス+グレイル (添付2枚) |
| 6 | observer_prophecy_realm.png | 3:4 | 背景 | エピローグ (観測者三柱の場) | (純風景、 天空界の景色) |
| 7 | duel_ice_vs_dragon.png | 16:9 | 挿絵 | 2-2 一騎打ち | アルテミス+グレイル (添付2枚) |
| 8 | flashback_artemis_hinoo.png | 16:9 | 挿絵 | 2-3 ヒノオウ回想 | アルテミス20歳+ヒノオウ20歳 (添付2枚) |
| 9 | vaire_diplomacy.png | 16:9 | 挿絵 | 3-1 ヴァーレ初登場、 外交 | アルテミス+ヴァーレ (添付2枚) |
| 10 | frost_oracle_prophecy.png | 16:9 | 挿絵 | 4-1 ユーリス予言 | アルテミス+ユーリス (添付2枚) |

合計 10枚 (背景6 + 挿絵4)。 s1c2 (12枚) / s1c3 (12枚) と同規模、 章規模圧縮。

---

# 【1】imperial_jade_palace.png — 龍国玉座 (背景、 3:4、 純風景)

- **対応シーン**: プロローグ / 1-1 龍国玉座 (アルテミス独白)
- **本文行**: `STORY/s1c4.md` (執筆後に追記)
- **役割**: 単独表示、 章冒頭の場面を象徴
- **被写体**: 龍国 (rulers) imperial 玉座、 jade 翡翠の柱、 黄金の灯篭の霧、 双大剣『陰陽』 が玉座脇に置かれている、 アルテミス本拠の威厳
- **ストーリー使用**: ✅ s1c4 1-1 背景
- **コード参照**: `LOCATION_CONFIG['s1c4']['1-1']`

```
fantasy painting of a vast imperial jade throne hall of the Dragon Empire (Ryukoku) at dawn, towering polished jade columns rising into the misty heights, golden lantern mist drifting through the air, an ornate jade and gold imperial throne at the far end on a raised dais with five steps, twin great-swords (Yang and Yin) crossed and resting against the side of the throne radiating subtle golden-violet aura, deep red imperial carpets running down the central aisle, hanging silk banners of the dragon empire, dragon motif engravings throughout the columns and throne back, the seven prismatic streams of the genso flowing softly through the high vaulted ceiling, atmospheric perspective with golden mist obscuring the back wall, dawn light filtering through high arched windows in warm gold and amber, no people, no characters, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【2】frozen_tundra_journey.png — 凍土への旅路 (背景、 3:4、 純風景・遠景人影のみ)

- **対応シーン**: 1-3 雪原を行く (アルテミス + 護衛団が龍国から凍土への遠征)
- **本文行**: `STORY/s1c4.md` (執筆後に追記)
- **役割**: 単独表示、 旅路の広大さと孤独
- **被写体**: 凍土に伸びる細い隊列 (遠景の小さな人影、 龍旗を翻す)、 雪原の地平、 冷たい青の月光、 ニーヴル方面の氷山シルエット
- **ストーリー使用**: ✅ s1c4 1-3 背景
- **コード参照**: `LOCATION_CONFIG['s1c4']['1-3']`

```
fantasy painting of a vast frozen tundra under pale blue moonlight at twilight, a thin distant caravan of about a dozen tiny silhouetted figures with horses crossing the snowy plain in the lower-middle distance carrying a tall imperial dragon banner, vast snow-covered horizon stretching to a distant range of crystalline ice mountains and ice spires of Niiruru in the background silhouetted against the cold blue sky, drifting snow particles in the foreground, soft pale-blue and silver moonlight casting long shadows on the snow, the seven prismatic streams of the genso flowing faintly across the deep navy twilight sky, atmospheric perspective showing the vast emptiness of the frozen north, lonely epic journey atmosphere, no close characters visible only distant tiny silhouettes, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【3】niiruru_ice_palace.png — 氷宮殿の謁見の間 (背景、 3:4、 純風景)

- **対応シーン**: 2-1 ニーヴル氷宮殿到着 + 謁見
- **本文行**: `STORY/s1c4.md` (執筆後に追記)
- **役割**: 単独表示、 氷霊王国の威容
- **被写体**: 氷の柱が立ち並ぶ謁見の間、 凍り付いた池、 グレイルの氷の玉座 (空、 まだ着座していない場面)、 氷霊の青い灯
- **ストーリー使用**: ✅ s1c4 2-1 背景
- **コード参照**: `LOCATION_CONFIG['s1c4']['2-1']`

```
fantasy painting of a vast crystalline ice palace audience hall of Niiruru Ice Spirit Kingdom under pale blue moonlight, towering pillars of clear blue ice rising into the high vaulted ceiling, an ornate frozen pool of crystal-clear water at the center reflecting the prismatic light from above, an empty pale-blue ice throne with intricate frost-crystal carvings at the far end on a raised dais of polished ice, frozen banners of the Niiruru ice-kingdom hanging from the columns, hovering pale-blue ice-spirit lanterns floating softly through the hall casting cool blue and prismatic light, the seven prismatic streams of the genso flowing through the high crystal ceiling refracting through the ice into rainbow patterns on the floor, atmospheric perspective with pale-blue mist drifting between the pillars, cold ethereal otherworldly atmosphere, no people, no characters, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【4】zenonia_floating_fortress.png — 空挺城ゼノニア外観 (背景、 3:4、 純風景)

- **対応シーン**: 3-1 空挺城到着、 ヴァーレとの外交場面
- **本文行**: `STORY/s1c4.md` (執筆後に追記)
- **役割**: 単独表示、 機械文明の威容 (S2C3「沈黙の塔」 への前奏)
- **被写体**: 雲海の上に浮かぶ巨大な蒸気要塞、 真鍮歯車と蒸気管が外殻を覆う、 機械翼の浮遊船が周囲を旋回
- **ストーリー使用**: ✅ s1c4 3-1 背景
- **コード参照**: `LOCATION_CONFIG['s1c4']['3-1']`

```
fantasy painting of a massive steampunk floating fortress city of Zenonia hovering above a vast sea of clouds at sunset, towering brass and copper plated city silhouette with countless glowing orange windows and rotating mechanical cogs visible on the exterior walls, multiple massive brass smokestacks releasing soft steam plumes, intricate steampunk architecture mixing brass clockwork with cathedral spires, large brass mechanical wings extending from the bottom of the floating city slowly rotating, a few smaller brass airships circling the fortress in the foreground sky, vast warm sunset cloudscape filling the lower half with golden orange and pink hues, the seven prismatic streams of the genso flowing through the upper twilight sky in violet-rainbow tones, atmospheric perspective with steam mist drifting around the fortress, epic awe-inspiring grandeur, no people, no characters, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【5】snow_field_silence.png — 雪原で空を見上げる山場 (背景、 3:4、 キャラ含む)

> **添付リファ画像 (2枚必須)**:
> - `images/characters/season1/ur/dragon_emperor.png` (アルテミス)
> - `images/characters/season1/ur/ice_emperor.png` (グレイル — 生成後)

- **対応シーン**: 3-3 山場 — 一騎打ち後、 二人で雪原に並んで空を見上げる無言の時間
- **本文行**: `STORY/s1c4.md` (執筆後に追記)
- **役割**: 単独表示、 章テーマ「強者の頂は、 孤独を共に分かち合うことで初めて温かい」 を象徴
- **被写体**: アルテミス + グレイルが背中を向けて (or 横並び) 雪原に立ち、 二人で星空を見上げる、 双大剣と氷剣を地面に刺している、 戦いの後の静寂
- **ストーリー使用**: ✅ s1c4 3-3 背景 (山場)
- **コード参照**: `LOCATION_CONFIG['s1c4']['3-3']`

```
anime-style fantasy game illustration of two emperors standing side by side in a vast snowy plain at deep night after a duel, on the right Emperor Artemis in dragon-emperor regalia with twin great-swords planted in the snow beside him, on the left Emperor Glayl in ice-emperor regalia with twin ice-swords planted in the snow beside him, both emperors facing away or in three-quarter back view looking up at the night sky in silent contemplation, the brilliant seven prismatic streams of the genso flowing across the moonlit night sky above them like a vast cosmic river, faint snow particles drifting around them, vast frozen tundra stretching to crystalline ice mountains in the distance, soft pale-blue moonlight casting long shadows on the pristine snow, atmosphere of profound silent kinship between two solitary emperors finally finding mutual recognition, peaceful aftermath of conflict transformed into quiet companionship, dramatic rim light from the cosmic prismatic sky overhead, anime fantasy game illustration painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, both emperors with both hands at their sides or relaxed positions all fingers properly visible, both arms in natural restful poses with proper joint angles, original character setting, no logos, no text, no watermark.

元画像から表情や姿勢は変わってOKです (静かに空を見上げる構図に最適化)
```

---

# 【6】observer_prophecy_realm.png — 観測者三柱の場 (背景、 3:4、 純風景)

- **対応シーン**: エピローグ — 観測者三柱 (カグヤ・ノクス・セラフィエル) が「次は、 西だ」 「銀霜の月が、 仮面を呼ぶ」 と告げる S1C5 引き場面
- **本文行**: `STORY/s1c4.md` (執筆後に追記)
- **役割**: 単独表示、 章間連結
- **被写体**: 天空界の小さな景色、 七色の渦が中心に静かに回る、 遠くに小さな浮遊島群、 静謐な天界の余韻
- **ストーリー使用**: ✅ s1c4 エピローグ 背景 (中表紙形式 subscene 「観測者の啓示」 で使用)
- **コード参照**: `LOCATION_CONFIG['s1c4']['観測者の啓示']` (label無いので title 比較で hit)

```
fantasy painting of a serene celestial realm in the upper sky where the seven observer streams of the genso converge in a slow cosmic spiral, a small floating archipelago of crystal islands drifting in the deep cosmic darkness in the mid-distance, soft prismatic mist swirling gently across the scene, distant nebulae glowing in violet and rainbow tones, the very faint silhouettes of three observer thrones (one warm-golden, one silvery-white, one starlit-violet) at the corners of the central spiral, no characters visible, ethereal silent prophetic atmosphere of the place where the three observers convene only in moments of crisis, anime fantasy game background painting style, high detail, Aspect ratio 3:4, vertical orientation 1024x1536.

original character setting, no logos, no text, no watermark
```

---

# 【7】duel_ice_vs_dragon.png — 一騎打ち (挿絵、 16:9、 キャラ含む)

> **添付リファ画像 (2枚必須)**:
> - `images/characters/season1/ur/dragon_emperor.png` (アルテミス)
> - `images/characters/season1/ur/ice_emperor.png` (グレイル — 生成後)

- **対応シーン**: 2-2 一騎打ち — アルテミス vs グレイル、 双大剣『陰陽』 vs 氷の双剣
- **本文行**: `STORY/s1c4.md` (執筆後に追記、 marker 候補: 「氷と龍が、 真っ向から打ち合った」 等)
- **役割**: 本文インライン挿絵、 戦闘の動的瞬間
- **被写体**: 二人の覇王が剣を打ち合う瞬間、 氷の刃と龍気の刃が空中で交差、 火花と凍気が散る
- **ストーリー使用**: ✅ s1c4 2-2 挿絵
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c4']` (2-2 marker)

```
dynamic anime fantasy game illustration of an epic duel between two emperors clashing swords mid-air on a frozen tundra battlefield, on the right Emperor Artemis (dragon-emperor) leaping forward with twin great-swords Yang and Yin crossed in a striking motion radiating golden-violet dragon aura, on the left Emperor Glayl (ice-emperor) leaping forward with twin ice-swords Nifl and Heil crossed in a striking parry motion radiating prismatic frost aura, all four blades meeting at the center of the frame in a brilliant burst of golden sparks and crystalline frost vapor mixing together, the seven prismatic streams of the genso visible through the night sky above them, frozen tundra battlefield with ice spires in the mid-distance, intense dramatic motion-blur capturing the climactic moment of mutual recognition between two solitary equals, dramatic rim lighting with prismatic frost and golden dragon aura colliding, cinematic composition, anime fantasy game illustration painting style, high detail, Aspect ratio 16:9, horizontal orientation 1672x941, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, both emperors gripping their twin sword hilts firmly with all five fingers visible and properly positioned, both arms of both characters in natural combat-ready poses with proper joint angles, original character setting, no logos, no text, no watermark.

元画像から表情や姿勢は変わってOKです (剣が交差する瞬間の動的構図に最適化)
```

---

# 【8】flashback_artemis_hinoo.png — ヒノオウ回想 (挿絵、 16:9、 キャラ含む)

> **添付リファ画像 (2枚必須)**:
> - `images/characters/season1/ur/dragon_emperor.png` (アルテミス、 二十歳の若き姿として参考)
> - `images/characters/season1/ur/flame_empress.png` (ヒノオウ、 二十歳の若き姿として参考)

- **対応シーン**: 2-3 (推定) — 回想シーン、 二十歳のアルテミスとヒノオウが背中合わせで影喰いを斬り伏せた戦場
- **本文行**: `STORY/s1c4.md` (執筆後に追記、 marker 候補: 「あの夜の戦場が、 不意に蘇った」 等)
- **役割**: 本文インライン挿絵、 凸秘話 #1「ヒノオウとの夜」 と整合する公式画
- **被写体**: 二十歳の若きアルテミス + ヒノオウが背中合わせで影喰いの群れと戦う、 双大剣 + 双大剣『日輪・月輪』、 影喰い数体が周囲に
- **ストーリー使用**: ✅ s1c4 2-3 挿絵 (回想)
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c4']` (回想 marker)

```
dynamic anime fantasy game illustration of a flashback to twenty years prior showing two young warriors fighting back-to-back against a horde of shadow-eaters (shadeova) in a moonlit battlefield, on the left a young Artemis at age 20 (looking slightly younger than his current emperor form, similar facial features but more youthful and less weathered, less ornate armor of a young warrior not yet emperor) wielding twin great-swords swinging outward in a powerful slash sending out golden-violet dragon-energy waves, on the right a young Hino-oh at age 20 (looking slightly younger than her current empress form, similar facial features but more youthful, less ornate armor of a young warrior not yet empress) wielding twin great-swords Nichirin and Getsurin swinging outward in a powerful slash sending out crimson phoenix-flame waves, the two young warriors pressing their backs together at the center of the frame both leaning into their attacks with mutual unspoken trust, multiple shadow-eater monsters being cut down around them dissolving into dark mist, the seven prismatic streams of the genso visible faintly through the moonlit battlefield sky, dramatic motion-blur of swords slashing, intense moonlit nighttime battlefield with rolling hills, dramatic rim lighting with golden dragon aura and crimson flame intermingling, cinematic flashback composition with slightly desaturated dreamlike color palette to indicate memory, anime fantasy game illustration painting style, high detail, Aspect ratio 16:9, horizontal orientation 1672x941, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, both warriors gripping their twin sword hilts firmly with all five fingers visible and properly positioned, both arms of both characters in natural combat-ready poses with proper joint angles, original character setting, no logos, no text, no watermark.

元画像から表情や姿勢は変わってOKです (若き戦友、 背中合わせの構図に最適化、 やや幼く描いてOK)
```

---

# 【9】vaire_diplomacy.png — ヴァーレとの外交 (挿絵、 16:9、 キャラ含む)

> **添付リファ画像 (2枚必須)**:
> - `images/characters/season1/ur/dragon_emperor.png` (アルテミス)
> - `images/characters/season1/ur/sky_empress.png` (ヴァーレ — 生成後)

- **対応シーン**: 3-1 ヴァーレ初登場 — 空挺城ゼノニアでアルテミスとヴァーレが外交場面
- **本文行**: `STORY/s1c4.md` (執筆後に追記、 marker 候補: 「真鍮の翼を持つ女皇が、 静かに立っていた」 等)
- **役割**: 本文インライン挿絵、 ヴァーレ初登場の印象付け、 S2C3 機械文明覚醒の前奏
- **被写体**: アルテミス + ヴァーレが空挺城内の謁見の間で対峙、 ヴァーレが真鍮歯車の翼を広げて外交の挨拶、 アルテミスが落ち着いて応える
- **ストーリー使用**: ✅ s1c4 3-1 挿絵
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c4']` (3-1 marker)

```
anime fantasy game illustration of a diplomatic meeting between two rulers in the steampunk audience hall of Zenonia floating fortress, on the right Emperor Artemis (dragon-emperor) standing in his dragon-emperor regalia with twin great-swords sheathed at his sides looking with composed respect, on the left Empress Vaire (sky-fortress empress) standing in her steampunk royal attire with her ornate animated brass mechanical wings with prismatic stained-glass panels gracefully half-extended behind her shoulders in a formal greeting pose holding her steam-magic staff Orarion, both rulers facing each other in three-quarter view with mutual measured respect, ornate steampunk audience chamber background with brass clockwork architecture and rotating gears in the walls and ceiling and stained-glass windows showing the cloudscape outside, soft brass lantern light mixed with prismatic rainbow light filtering through the stained glass, the seven prismatic streams of the genso visible faintly through the chamber windows, atmosphere of historic first meeting between two ruling powers, dramatic rim light with warm brass amber glow and prismatic accents, cinematic composition, anime fantasy game illustration painting style, high detail, Aspect ratio 16:9, horizontal orientation 1672x941, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, both rulers with hands properly positioned all five fingers visible (Artemis hands at sides, Vaire hand gripping the staff), both arms of both characters in natural diplomatic poses with proper joint angles, original character setting, no logos, no text, no watermark.

元画像から表情や姿勢は変わってOKです (外交の対峙構図に最適化)
```

---

# 【10】frost_oracle_prophecy.png — ユーリス予言 (挿絵、 16:9、 キャラ含む)

> **添付リファ画像 (2枚必須)**:
> - `images/characters/season1/ur/dragon_emperor.png` (アルテミス)
> - `images/characters/season1/ssr/frost_oracle.png` (ユーリス — 生成後)

- **対応シーン**: 4-1 ユーリス予言 — 帰路、 氷霜の巫女ユーリスがアルテミスに「次に龍を譲る相手」 を示唆する伏線回収シーン (S2 龍帝退位の布石)
- **本文行**: `STORY/s1c4.md` (執筆後に追記、 marker 候補: 「次に龍を譲る相手を、 もう知っているはずです」 等)
- **役割**: 本文インライン挿絵、 S2 への伏線
- **被写体**: ユーリスが氷の予言杖イルディラを掲げて予言を放ち、 アルテミスが静かに聞いている、 雪の小さな神殿
- **ストーリー使用**: ✅ s1c4 4-1 挿絵
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c4']` (4-1 marker)

```
anime fantasy game illustration of a prophetic oracle scene in a small ice shrine on the journey home, on the left Frost Oracle Yuris in her ceremonial frost oracle attire holding her tall ice-oracle staff Ildira raised high above her head with the pale-blue ice crystal at the top radiating prismatic prophetic light beams cascading down through the air, on the right Emperor Artemis in his dragon-emperor regalia standing quietly in receiving posture listening with composed gravity, both characters facing each other in three-quarter view, intricate ice shrine interior with crystalline pillars and a small frozen altar between them, prismatic prophetic light filling the chamber illuminating both characters with rainbow halo effects, the seven prismatic streams of the genso visible through the open shrine roof flowing into the prophecy light beams, atmosphere of solemn revelation of future events, dramatic rim light with cool silver-blue glow and prismatic prophecy beams, cinematic composition, anime fantasy game illustration painting style, high detail, Aspect ratio 16:9, horizontal orientation 1672x941, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, Yuris both hands gripping the staff overhead all five fingers visible, Artemis hands at his sides all five fingers visible, both arms of both characters in natural ceremonial poses with proper joint angles, original character setting, no logos, no text, no watermark.

元画像から表情や姿勢は変わってOKです (予言の啓示構図に最適化)
```

---

# 【11】frost_swordmaster_sparring.png — ハグル+グレイルの剣師教え (挿絵、 16:9、 キャラ含む)

> **添付リファ画像 (2枚必須)**:
> - `images/characters/season1/ssr/north_swordmaster.png` (ハグル — 生成後)
> - `images/characters/season1/ur/ice_emperor.png` (グレイル — 生成後)

- **対応シーン**: 2-1 氷宮殿の謁見の途中、 ハグル剣師が紹介されるシーン (or 一騎打ち前夜の修行回想)
- **本文行**: `STORY/s1c4.md` (リライト後に追記、 marker 候補: 「剣師に教わった構えだ」 等)
- **役割**: 本文インライン挿絵、 ハグル (グレイル剣師) の存在を絵で示す
- **被写体**: ハグル (年齢曖昧の若き剣聖、 双剣ヘルファング) が氷柱の前に立ち、 グレイル (氷帝) が片膝をついて剣を捧げる伝授風構図
- **ストーリー使用**: ✅ s1c4 2-1 挿絵
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c4']` (2-1 marker)

```
anime fantasy game illustration of a sword master and his student in a snow training ground at twilight, on the left North Sword Saint Hagul standing tall in his north sword master attire holding twin ice swords Hellfang in a guard pose with quiet authority, on the right young Ice Emperor Glayl kneeling on one knee with his head bowed in respect his twin ice swords Nifl and Heil placed crossed before him on the snow as a gesture of receiving instruction, the master and student facing each other in three-quarter view connected by mutual unspoken trust, frozen tundra training ground at twilight with crystalline ice pillars rising around them and Niiruru ice palace silhouetted in the distance, the seven prismatic streams of the genso visible faintly through the violet twilight sky, soft pale-blue moonlight beginning to emerge mixed with last orange of sunset, atmosphere of solemn transmission between an ancient-blooded master and his coronated student, dramatic rim light with cool silver-blue glow and warm twilight amber accents, crystalline frost vapor drifting around them, cinematic composition, anime fantasy game illustration painting style, high detail, Aspect ratio 16:9, horizontal orientation 1672x941, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, Hagul both hands gripping the twin sword hilts firmly with all five fingers visible, Glayl both hands resting on his thigh with all five fingers visible, both arms of both characters in natural ceremonial poses with proper joint angles, original character setting, no logos, no text, no watermark.

元画像から表情や姿勢は変わってOKです (剣の伝授構図に最適化)
```

---

# 【12】zenonia_workshop.png — ハーニア+ベル+ピットの工房 (挿絵、 16:9、 キャラ含む)

> **添付リファ画像 (3枚必須)**:
> - `images/characters/season1/ssr/brass_foreman.png` (ハーニア — 生成後)
> - `images/characters/season1/sr/sky_engineer.png` (ベル — 生成後)
> - `images/characters/season1/r/sky_boy.png` (ピット — 生成後)

- **対応シーン**: 3-1 空挺城ゼノニア外交シーン末尾、 整備工房の様子を描く生活感シーン
- **本文行**: `STORY/s1c4.md` (リライト後に追記、 marker 候補: 「整備工房から、 元気な声が響いた」 等)
- **役割**: 本文インライン挿絵、 ゼノニア機械文明の温度感 (生活レベル) を可視化、 S2C3「沈黙の塔」 前奏としての文化背景
- **被写体**: ハーニア (工房親方) が中央でレンチハンマーを担いで指示、 ベル (整備士) が右で部品を手に持って向き合う、 ピット (見習い少年) が左で工具を運ぶ、 ゼノニア大工房の真鍮歯車が回る背景
- **ストーリー使用**: ✅ s1c4 3-1 挿絵 (生活感)
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c4']` (3-1 marker、 vaire_diplomacy の後ろ)

```
anime fantasy game illustration of a busy steampunk workshop interior in Zenonia floating fortress, in the center stands brass foreman Hania resting her large brass wrench-hammer on her shoulder in a confident foreman stance giving instructions, on the right young sky engineer Bell standing across from her holding a brass mechanical part in both hands listening attentively, on the left young sky boy Pitto walking past carrying a small brass wrench and a copper pipe like a young apprentice helping out, the three workshop members of three generations together in their craft, large workshop floor background with brass forges glowing with embers, hanging tools and partially assembled brass machines, large rotating brass cogs visible on the back wall, scaffolding rising into the upper portion with airship parts in mid-construction, warm forge-fire amber light mixed with daylight from a high window, the seven prismatic streams of the genso visible faintly through the high window, atmosphere of working craft pride and the warm noise of a living workshop, dramatic rim lighting with warm forge-amber glow and brass dust and steam particles, cinematic composition, anime fantasy game illustration painting style, high detail, Aspect ratio 16:9, horizontal orientation 1672x941, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, Hania both hands gripping the wrench-hammer firmly with all five fingers visible, Bell both hands holding the mechanical part with all five fingers visible, Pitto both hands carrying the wrench and pipe with all five fingers visible, all arms of all three characters in natural workshop human poses with proper joint angles, original character setting, no logos, no text, no watermark.

元画像から表情や姿勢は変わってOKです (3人工房構図に最適化)
```

---

## 整合性チェック (生成前確認)

- [x] S1C3 エピローグ予言「凍土と空が、 揺れる」 と S1C4 の凍土+空挺城 設定一致 (背景3 + 4)
- [x] アルテミス凸秘話 #1「ヒノオウとの夜」 と回想挿絵 (#8) 完全整合
- [x] グレイル「凍土の戦力」 → S1C7 黒月決戦予兆 (山場挿絵 #5 + 一騎打ち #7 で覇王オーラ強調)
- [x] ヴァーレ機械文明 → S2C3「沈黙の塔」 前奏 (#9 で真鍮歯車翼 + #12 で工房を視覚化)
- [x] ユーリス予言「龍を譲る相手」 → S2 龍帝退位 (#10 で伏線回収シーン明示)
- [x] エピローグ「次は、 西だ」 → S1C5 銀霜引き (#6 観測者の場で展開)
- [x] 派閥背景キーワード `_common.md` 準拠 (frozen tundra / steampunk floating fortress / imperial jade)
- [x] **追加 (2026-05-01 +20体構成対応)**: ハグル (グレイル剣師、 #11) + ハーニア+ベル+ピット (工房3人、 #12) を挿絵で正式登場、 凍土の血脈 + 機械文明の温度感を強化

## 生成順序 (推奨)

1. キャラ画像 (`prompt/s1c4_chars.md` 全20体) を全部生成 → リファ画像が揃う
2. 純風景 5枚を先行生成 (#1, #2, #3, #4, #6) — リファ不要、 即生成可
3. キャラ含む 7枚 を後で生成 (#5, #7, #8, #9, #10, #11, #12) — 該当キャラ画像が揃ってから
