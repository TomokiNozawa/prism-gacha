# Prismaera 場所画像プロンプト — Season 1 第6章「七座満つる」

S1C6「七座満つる」 (POV: セラフィエル、 観測者七座 第一席) の場所画像 (背景+挿絵) の DALL-E 3 / gpt-image-1 用プロンプト。

> **🎯 引き継ぎ規約 (重要)**
>
> 各画像セクション冒頭に必ず以下のメタデータを書く。 別セッション・別PCで自分自身が引き継いだ時に推測で誤マッピングしないため (CLAUDE.md / `feedback_asset_scene_mapping.md`)。
>
> - **対応シーン**: ストーリー上の章節 (例: `4-1 七座儀式`)
> - **本文行**: `STORY/s1c6.md` の該当行 + 直接引用フレーズ (本文執筆後に追記)
> - **役割**: 単独表示か連続表示か、 どの位置か
> - **被写体**: 画像実物に何が描かれているか
> - **ストーリー使用**: ✅ (ストーリー再生で表示) / ❌ (ワールドマップ等の別用途)
> - **コード参照**: `LOCATION_CONFIG['s1c6']['シーン']` / `STORY_LOCATION_INLINE_CONFIG['s1c6']` (実装後に記載)

> **🎯 比率規約**: 背景 = **3:4 縦長 (1024×1536)** / 挿絵 = **16:9 横長 (1672×941)** (野沢方針 2026-05-01)

> **🎯 形式規約 (絶対)**: 全プロンプトを **単一ブロック prose** (s1c2/s1c3/s1c4/s1c5 locations.md と同形式) で記述。 多段パラグラフ禁止。

> **🎯 キャラ含む画像 (添付ありプロンプト)**:
> - `CRITICAL ANATOMY REQUIREMENTS` 必須 (5本指・関節・武器の握り)
> - 末尾文言「元画像から表情や姿勢は変わってOKです」 必須
> - リファ画像添付指示を画像セクション冒頭に明記

> **🎯 純風景 (添付なし)**: anatomy 指示・末尾文言 不要、 `Aspect ratio X:Y, high detail.` で締める

> **🎯 同一シーン挿絵の背景参照添付 (野沢さん指示 2026-05-06、 ルール7-35 WARNING)**:
> 挿絵プロンプトには **同一シーンの背景画像 filename を「先行画像 添付」 として明記** すること。 構図・建築・光線方向の整合性確保のため。

---

## 整合性: outline.md 通読確認済 (S1C5 エピローグ → S1C6 → S1C7 引き)

- **前章引き**: S1C5 エピローグ 観測者三柱「次は、 東じゃ」「七座が、 満ちる時が、 来た」「巫女連邦のイリス。 第四席『約束』 の灯火」 → S1C6 で巫女連邦 (イリス) 着座
- **S1C6 仕込み伏線 (新規、 outline.md 伏線リスト記載済)**:
  - ノクス「これでも足りない」 → S2C3 沈黙の塔 (第七席候補)
  - カグヤ千年日記 → セラフィエルへ手渡す未来 → S2C4 記憶の海
  - イリス千年血脈 (ヴィオレナ系譜) → S2C6 新たな七座
  - ヴィオレナ vs リオラエル 千年級存在 → S2C4 / S2C5
  - セラフィエル翼を一枚畳む準備 → S1C7 / S2C7
  - 黒月の予兆 (西の空) → S1C7 黒月決戦
  - 鳳神巫女ホムラ「七座入り辞退、 警護を継ぐ」 → S2C6 / S3C5
- **既存伏線回収 (s1c6 で実発)**:
  - s1c5 エピローグ「次は東、 七座が満つる時」 → s1c6 全体で実現
  - LR_プリズマ凸秘話「終わりにして始まり」「セラフィエル・カグヤ・ノクスに立ち会ってほしい」 → 七座儀式の場面で予兆
  - UR_セラフィエル凸秘話「最初の羽」「プリズマへの返事」 → s1c6 3-2 公式画化
- **既存背景キーワード** (`_common.md` 準拠):
  - 巫女連邦リーリエ (新派閥、 S1C6): `pale jade shrine corridor with gentle golden dust` ← `_common.md` 派閥背景テーブル既存
  - 月影宮 (天空界): `celestial moon-palace floating in the seven-color cosmos`

---

## S1C6 シーン対応表

| # | filename | 比率 | 役割 | 対応シーン | キャラ | 添付要否 |
|---|---|---|---|---|---|---|
| 1 | observer_east_realm.png | 3:4 | 挿絵風背景 | プロローグ (観測者三柱「次は東」 観測の場) | セラフィエル+カグヤ+ノクス | 添付3枚 |
| 2 | moonlight_palace_hall.png | 3:4 | 背景 | 1-1 月影宮 常夜の卓 (天空界) | (純風景) | なし |
| 3 | shrine_lantern_festival.png | 3:4 | 背景 | 1-3 巫女連邦 灯篭祭の街並み | (純風景、 群衆遠景のみ) | なし |
| 4 | shrine_central_temple.png | 3:4 | 背景 | 2-1 巫女連邦中央神殿の聖堂 | (純風景) | なし |
| 5 | shrine_chronicle_hall.png | 3:4 | 背景 | 2-2 千年伝承の間 (古文書+壁画) | (純風景) | なし |
| 6 | shrine_prayer_tower.png | 3:4 | 背景 | 2-3 月夜の祈祷の塔 | (純風景) | なし |
| 7 | shrine_extinguished_village.png | 3:4 | 背景 | 2-4 灯篭が消えた村跡 (廃墟) | (純風景) | なし |
| 8 | observer_east_with_iris.png | 3:4 | 挿絵風背景 | エピローグ (観測者三柱+イリス、 西の黒月予兆) | セラフィエル+カグヤ+ノクス+イリス | 添付4枚 |
| 9 | seraph_descent_to_iris.png | 16:9 | 挿絵 | 1-2 セラフィエル単独地上降臨+招待状 | セラフィエル+イリス | 添付2枚 + 背景 #3 添付 |
| 10 | shrine_oracle_reunion.png | 16:9 | 挿絵 | 2-1 神殿でセラフィエル+ヴィオレナ再会 (千年ぶり) | セラフィエル+ヴィオレナ | 添付2枚 + 背景 #4 添付 |
| 11 | seraph_first_wing_memory.png | 16:9 | 挿絵 | 3-2 「最初の羽」 回想 (プリズマがセラフィエルを生んだ古代の場面) | プリズマ+セラフィエル | 添付2枚 |
| 12 | seven_seat_ritual.png | 16:9 | 挿絵 | **4-1 山場** 七座満つる儀式 (4人初集合) | セラフィエル+カグヤ+ノクス+イリス | 添付4枚 + 背景 #2 添付 |
| 13 | iris_departure_morning.png | 16:9 | 挿絵 | 4-2 別れの朝 (イリス地上へ、 ヴィオレナ「千年待った」) | セラフィエル+イリス+ヴィオレナ | 添付3枚 + 背景 #4 添付 |

合計 13枚 (背景8 + 挿絵5)。 s1c5 (背景8 + 挿絵5) と同規模、 outline.md 章規模 +20キャラ・山場の重みに整合。

---

# 【1】observer_east_realm.png — 観測者三柱・東の灯火観測 (挿絵風背景、 3:4)

**⚠️ 生成前に必ず添付してください** (3枚):
- `images/characters/season1/ur/seraph_paladin.png` (既存 UR セラフィエル)
- `images/characters/season1/ur/ancient_sage.png` (既存 UR 千夜姫 カグヤ)
- `images/characters/season1/ur/cosmic_witch.png` (既存 UR 星海のノクス)

- **対応シーン**: プロローグ (観測者三柱が東の四つ目の灯火 = イリスの予兆を観測)
- **役割**: プロローグ単独表示、 章開幕の視覚軸
- **被写体**: 月影宮の常夜の卓を背に、 三柱が東の空 (七色の四つの灯篭) を見上げる構図
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c6']['プロローグ']`

```
[Attached: 3 reference images of Seraph Paladin (UR seraph), Ancient Sage Kaguya (UR small girl), Cosmic Witch Nokus (UR cosmic witch)]

anime-style cinematic illustration of three observer goddesses standing on the celestial moon-palace overlooking the eastern sky in the seven-color cosmos, the same characters as in the reference images keeping their faces and outfits exactly, Seraph Paladin (six-winged angel in silver-white armor) standing center facing east with her halberd grounded, Ancient Sage Kaguya (small silver-haired girl with moon staff) seated on a celestial stone beside her looking up wistfully at the four small seven-color lanterns hovering in the eastern sky, Cosmic Witch Nokus (cosmic witch with galactic hair) standing to the right with her star-staff resting against her shoulder, all three gazing toward the eastern horizon where four small seven-color lanterns float in a row at varying brightness (one bright, three dim and growing), the celestial moon-palace floor of polished obsidian-and-silver tiles with seven-color cosmos beyond the railing, soft seven-color cosmic glow rim-lighting all three figures, dramatic dawn light from the east casting long pastel rainbow shadows behind them, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, weapon grips realistic.

元画像から表情や姿勢は変わってOKです

Aspect ratio 3:4, high detail.
```

**ポイント**: s1c5 エピローグ (observer_west_close.png に対応) と直接連結。 「four small seven-color lanterns」 = 第四席着座 + 残り三席 (五/六/七席) の系譜継承予兆。

---

# 【2】moonlight_palace_hall.png — 月影宮 常夜の卓 (純背景、 3:4)

- **対応シーン**: 1-1 月影宮の常夜の卓 (三柱が世界の観測結果を語り合う場、 UR_ノクス凸秘話「三柱の常夜」 公式背景)
- **役割**: 1-1 シーン単独表示
- **被写体**: 巨大な円卓を中心に、 七色のコスモスが見渡せる広大なホール、 観測者三柱が集う神聖な空間
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c6']['1-1']`

```
celestial moon-palace inner hall floating in the seven-color cosmos, vast circular obsidian-and-silver dining table at the center engraved with seven concentric rings of celestial constellations, three high-backed silver thrones around the table (one tall with six-wing motif for Seraph, one small with crescent moon motif for Kaguya, one with star-spiral motif for Nokus), tall transparent silver pillars rising into the cosmos sky, no railing — open edge with seven-color cosmic infinity beyond, floating seven-color lanterns drifting through the hall like ethereal jellyfish, the floor of polished black-mirror obsidian reflecting the cosmos above, soft cool moonlight blended with seven-color cosmic glow filtering through the open edges, divine sacred atmosphere of the observers' gathering place, no characters in this scene, dramatic ethereal lighting with prismatic rim accents, detailed linework, high-quality illustration. Aspect ratio 3:4, high detail.
```

**ポイント**: 「three high-backed silver thrones」 = 三柱の指定席、 第四席用の空席が右奥に控えていることを暗示する構図 (山場 #12 で4席目が満ちる)。

---

# 【3】shrine_lantern_festival.png — 巫女連邦リーリエ 灯篭祭の街並み (純背景、 3:4)

- **対応シーン**: 1-3 巫女連邦の灯篭祭でイリスが祭祀を取り仕切る場面の街並み
- **役割**: 1-3 シーン単独表示、 巫女連邦の世界観の最初の視覚提示
- **被写体**: 翡翠の神殿群を背景に、 七色の紙灯篭が街路に連なる夜祭の街並み
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c6']['1-3']`

```
eastern shrine federation Lirie cityscape during the lantern festival night, jade-green stone shrine buildings with curved wooden roofs in traditional eastern architecture, hundreds of seven-color paper lanterns hanging in long strings across the streets and floating in the sky like a flowing river of light, paved stone-tile streets bathed in warm orange-and-gold lantern glow, distant background showing the central jade temple silhouette with the largest seven-color lantern at its peak, small figures of festival-goers (extras) walking the street as distant silhouettes only, cherry-blossom petals and seven-color light particles drifting gently through the air, peaceful festive atmosphere, no individual characters foregrounded, dramatic warm rim lighting from the lanterns combined with cool moonlight from above, detailed linework, high-quality illustration. Aspect ratio 3:4, high detail.
```

---

# 【4】shrine_central_temple.png — 巫女連邦中央神殿の聖堂 (純背景、 3:4)

- **対応シーン**: 2-1 神殿の聖堂 (セラフィエルがヴィオレナと再会する場、 内部の構造は 2-2 / 4-2 にも継承)
- **役割**: 2-1 シーン単独表示 + 挿絵 #10/#13 の背景参照源
- **被写体**: 神殿内部の聖堂、 翡翠の柱と七色の灯篭、 中央の祭壇
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c6']['2-1']`

```
sacred inner sanctuary of the eastern shrine federation Lirie central temple, tall jade-green stone columns rising in two rows along the hall to a vaulted ceiling carved with the seven-prism rainbow motif, polished pale-jade stone floor with concentric rings of seven-color inlay leading to the central altar, the central altar a circular platform of white marble with seven small standing seven-color lanterns arranged in a perfect ring, a tall narrow stained-glass window at the far end depicting a single great lantern surrounded by six smaller ones (the seven seats of observation), morning-mist filtering through the columns and stained glass casting prismatic rainbows on the floor, no characters in this scene, sacred quiet atmosphere, dramatic golden-hour light streaming through the stained glass, detailed linework, high-quality illustration. Aspect ratio 3:4, high detail.
```

---

# 【5】shrine_chronicle_hall.png — 千年伝承の間 (純背景、 3:4)

- **対応シーン**: 2-2 千年伝承の間 (ヴィオレナが巫女連邦の千年血脈を語る場、 古文書+壁画)
- **役割**: 2-2 シーン単独表示
- **被写体**: 古い書物と壁画に囲まれた静謐な部屋
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c6']['2-2']`

```
ancient chronicle hall of the shrine federation Lirie inner sanctum, tall pale-jade stone walls covered floor to ceiling with intricate murals depicting a thousand years of past Promise candidates (faded portraits of past priestesses in traditional eastern shrine attire), rows of cedar bookshelves filled with ancient bamboo-bound scrolls and parchment volumes glowing faintly with prismatic preservation magic, a central low jade reading table with a single open scroll glowing with seven-color text, a tall central pillar engraved with the names of past Promise candidates in vertical eastern calligraphy, no characters in this scene, scholarly sacred atmosphere of millennium-deep memory, dramatic warm candle-lantern light combined with seven-color preservation glow from the scrolls, detailed linework, high-quality illustration. Aspect ratio 3:4, high detail.
```

**ポイント**: 「past Promise candidates」 = ヴィオレナの母祖系譜が一千年遡って描かれている、 S2C6 系譜継承への伏線視覚化。

---

# 【6】shrine_prayer_tower.png — 月夜の祈祷の塔 (純背景、 3:4)

- **対応シーン**: 2-3 月夜の祈祷の塔 (イリス告白「私は約束を守るために生まれた」 の場)
- **役割**: 2-3 シーン単独表示
- **被写体**: 高い塔の最上階、 月光に照らされる祈祷の場
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c6']['2-3']`

```
top platform of an ancient prayer tower of the shrine federation Lirie under the night moonlight, circular open-air stone platform with low jade-green railing, seven small standing seven-color lanterns arranged in a perfect ring around a central praying altar of polished obsidian, the central altar marked with a single jade-green crescent and a green leaf for the Promise color, vast star-filled night sky above with the full moon shining down, distant view of the lantern festival cityscape far below glowing softly, single seven-color thread floating around the altar like a sacred ribbon of memory, no characters in this scene, sacred quiet sacred atmosphere, dramatic moonlight rim lighting on the altar with deep shadow surrounding, detailed linework, high-quality illustration. Aspect ratio 3:4, high detail.
```

---

# 【7】shrine_extinguished_village.png — 灯篭が消えた村跡 (純背景、 3:4)

- **対応シーン**: 2-4 灯篭が消えた村跡 (過去の影喰い襲撃の伝承の場、 千年前の悲劇の現場)
- **役割**: 2-4 シーン単独表示
- **被写体**: 朽ちた村の廃墟、 今は誰も住まない土地、 静かな喪失感
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c6']['2-4']`

```
abandoned ancient shrine village ruins overgrown with seven-color wildflowers, half-collapsed jade-green stone houses with caved-in wooden roofs, dozens of broken paper lanterns scattered on the ground (their seven colors faded to pale ghosts), a single intact seven-color lantern recently lit by a pilgrim hangs alone on a leaning wooden pole at the village center, distant view of the surrounding mountains in soft mist, fallen cherry-blossom petals carpet the broken pavement, no characters in this scene, melancholy sacred atmosphere of remembered loss, dramatic overcast afternoon light with single warm lantern glow as the focal point, detailed linework, high-quality illustration. Aspect ratio 3:4, high detail.
```

**ポイント**: 「a single intact seven-color lantern recently lit by a pilgrim」 = 千年経ても巫女連邦の民が灯し続ける伝承の継承を象徴。

---

# 【8】observer_east_with_iris.png — エピローグ・観測者三柱+イリス、 西の黒月予兆 (挿絵風背景、 3:4)

**⚠️ 生成前に必ず添付してください** (4枚):
- `images/characters/season1/ur/seraph_paladin.png` (既存 UR セラフィエル)
- `images/characters/season1/ur/ancient_sage.png` (既存 UR 千夜姫 カグヤ)
- `images/characters/season1/ur/cosmic_witch.png` (既存 UR 星海のノクス)
- `images/characters/season1/ur/iris.png` (新規 UR イリス、 #1 で先に生成)

- **対応シーン**: エピローグ (七座満ちた4人が東の七色灯篭+西の黒月の予兆を見つめる、 S1C7 引き)
- **役割**: エピローグ単独表示、 章収束+次章引きの視覚軸
- **被写体**: 4人並びの観測者、 東に七色の灯篭4つ、 西の空に薄く揺らぐ黒月
- **ストーリー使用**: ✅
- **コード参照**: `LOCATION_CONFIG['s1c6']['エピローグ']`

```
[Attached: 4 reference images of Seraph Paladin (UR), Kaguya (UR), Nokus (UR), and Iris (UR new)]

anime-style cinematic illustration of four observer goddesses standing together on the celestial moon-palace looking out at the seven-color cosmos, the same characters as in the reference images keeping their faces and outfits exactly, Seraph Paladin standing slightly forward as the eldest with her halberd grounded, Iris (the new fourth seat in jade-green ceremonial robe holding her seven-color lantern staff) standing beside Seraph as the new "fellow seat-bearer" (not as a younger sister, but as an equal), Kaguya seated on her celestial stone with her moon staff, Nokus standing to the right with her star-staff, all four turning their gaze toward the eastern sky where four bright seven-color lanterns now hover (the four seats now lit), but Nokus's gaze drifts westward where a thin black crescent moon shimmers ominously in the dawn sky, the celestial moon-palace floor of polished obsidian-and-silver tiles, soft seven-color cosmic glow rim-lighting all four figures with the four eastern lanterns reflected in the floor, dramatic dawn light from the east contrasting with the faint ominous black moon in the west, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, weapon grips realistic.

元画像から表情や姿勢は変わってOKです

Aspect ratio 3:4, high detail.
```

**ポイント**: 「Iris standing beside Seraph as the new fellow seat-bearer (not as a younger sister, but as an equal)」 = 「七座の同胞」 表現の視覚化、 上下関係なし。 「thin black crescent moon shimmers ominously in the dawn sky」 = S1C7 黒月決戦への引き。

---

# 【9】seraph_descent_to_iris.png — セラフィエル単独地上降臨 (挿絵、 16:9)

**⚠️ 生成前に必ず添付してください** (2枚 + 背景):
- `images/characters/season1/ur/seraph_paladin.png` (既存 UR セラフィエル)
- `images/characters/season1/ur/iris.png` (新規 UR イリス)
- **先行画像 添付**: `images/locations/s1c6/shrine_lantern_festival.png` (#3、 灯篭祭の街並み = 同シーン背景、 ルール7-35 整合)

- **対応シーン**: 1-2 セラフィエル単独地上降臨+招待状をイリスに渡す
- **役割**: 1-2 シーン単独表示、 章序盤の視覚軸 (天上→地上の降臨)
- **被写体**: 灯篭祭の街路で、 六翼を半分広げたセラフィエルが招待状をイリスに差し出す瞬間
- **ストーリー使用**: ✅
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c6']['1-2']` (LEFT or RIGHT は本文 inline 配置で決定)

```
[Attached: 2 reference images (Seraph Paladin UR, Iris UR new) + 1 background image (shrine_lantern_festival.png)]

anime-style cinematic illustration in the same shrine federation Lirie lantern festival cityscape as the attached background image (matching architecture, lantern arrangement, color palette), Seraph Paladin descending mid-air with six white wings half-spread casting prismatic rainbow light onto the cobblestones, Iris (the young high priestess in jade-green ceremonial robe) standing on the festival street looking up at her with calm reverence, Seraph extending a small jade-green sealed scroll (the invitation to the seventh-seat ritual) toward Iris with one gloved hand, both characters keeping their faces and outfits exactly as in the reference images, surrounding festival-goers in the distance turning to look in awe, seven-color paper lanterns floating overhead reflecting the angel's wing-light, gentle prismatic petals drifting in the air, dramatic dawn-meets-dusk lighting with golden lantern glow contrasting with Seraph's heavenly white-gold descent radiance, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, scroll grip realistic.

元画像から表情や姿勢は変わってOKです

Aspect ratio 16:9, high detail.
```

**ポイント**: 背景は #3 と完全整合 (architecture / lantern arrangement / color palette)、 ルール7-35 BLOCKER 防御。

---

# 【10】shrine_oracle_reunion.png — 神殿でセラフィエル+ヴィオレナ再会 (挿絵、 16:9)

**⚠️ 生成前に必ず添付してください** (2枚 + 背景):
- `images/characters/season1/ur/seraph_paladin.png` (既存 UR セラフィエル)
- `images/characters/season1/ur/shrine_oracle.png` (新規 UR ヴィオレナ)
- **先行画像 添付**: `images/locations/s1c6/shrine_central_temple.png` (#4、 中央神殿の聖堂 = 同シーン背景、 ルール7-35 整合)

- **対応シーン**: 2-1 神殿の聖堂でセラフィエルとヴィオレナが千年ぶりに再会
- **役割**: 2-1 シーン単独表示
- **被写体**: 神殿の中央祭壇で、 セラフィエルとヴィオレナが向き合う構図
- **ストーリー使用**: ✅
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c6']['2-1']`

```
[Attached: 2 reference images (Seraph Paladin UR, Violena UR new) + 1 background image (shrine_central_temple.png)]

anime-style cinematic illustration in the same shrine federation Lirie central temple inner sanctuary as the attached background image (matching tall jade pillars, central altar with seven small lanterns, stained glass with seven-prism motif), Seraph Paladin standing at one side of the central altar with her wings folded gracefully behind her, Violena (the millennium-old mother priestess in midnight-violet robe with prismatic rune-tattoos on her arms) standing on the opposite side of the altar with her seven-color staff lowered, both meeting eyes after a thousand years apart with subtle emotion of recognition (Seraph's calm reverence + Violena's serene gentle smile of millennium memory), both characters keeping their faces and outfits exactly as in the reference images, the seven small standing seven-color lanterns on the altar between them glowing brighter as if reacting to their reunion, morning-mist filtering through the columns casting prismatic rainbows on the polished floor between them, dramatic golden-hour light streaming through the stained glass at the far end, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, weapon and staff grips realistic.

元画像から表情や姿勢は変わってOKです

Aspect ratio 16:9, high detail.
```

**ポイント**: 「the seven small standing seven-color lanterns on the altar between them glowing brighter as if reacting to their reunion」 = 千年級存在の再会を空間的に演出。

---

# 【11】seraph_first_wing_memory.png — 「最初の羽」 回想 (挿絵、 16:9)

**⚠️ 生成前に必ず添付してください** (2枚):
- `images/characters/season1/ur/seraph_paladin.png` (既存 UR セラフィエル)
- `images/characters/season1/lr/prisma.png` (既存 LR 虹意 プリズマ)

- **対応シーン**: 3-2 セラフィエル「最初の羽」 だった頃の回想 (UR_セラフィエル凸秘話「最初の羽」「プリズマへの返事」 公式画化)
- **役割**: 3-2 シーン単独表示、 凸秘話の本編公式画 (s1c4 アルテミス凸秘話「ヒノオウとの夜」 公式画化と同パターン)
- **被写体**: 万年前の原虹の中心、 プリズマがセラフィエル (六翼の天使) を生み出す瞬間
- **ストーリー使用**: ✅
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c6']['3-2']`

```
[Attached: 2 reference images (Seraph Paladin UR, Prisma LR)]

anime-style cinematic illustration of an ancient cosmic memory at the heart of the original prism at the dawn of the world, Prisma (the rainbow-haired androgynous deity in crystalline rainbow robes) standing at the center of a pure rainbow vortex with her hand extended creating Seraph Paladin from her own light, Seraph Paladin emerging mid-formation from the rainbow with her six white wings just unfurling for the first time and her halberd manifesting from rainbow particles, the moment of "the first wing being separated" as Prisma's silent prayer "I want someone to watch over me" gives birth to her first companion observer, both characters keeping their faces and outfits exactly as in the reference images (Seraph's face emerging in calm reverence, Prisma's face in serene loneliness softening into hope), surrounding pure rainbow vortex with seven swirling color streams, gentle rainbow particles drifting like sacred snow, dramatic divine light radiating from the center of the prism with both figures illuminated as silhouettes against the brilliance, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, weapon manifestation realistic.

元画像から表情や姿勢は変わってOKです

Aspect ratio 16:9, high detail.
```

**ポイント**: LR_プリズマ凸秘話「セラフィエルという『羽』」 + UR_セラフィエル凸秘話「最初の羽」 と完全整合の公式画。 章のテーマ「翼を返す日」 への原点を視覚化。

---

# 【12】seven_seat_ritual.png — 山場・七座満つる儀式 (挿絵、 16:9)

**⚠️ 生成前に必ず添付してください** (4枚 + 背景):
- `images/characters/season1/ur/seraph_paladin.png` (既存 UR セラフィエル)
- `images/characters/season1/ur/ancient_sage.png` (既存 UR 千夜姫 カグヤ)
- `images/characters/season1/ur/cosmic_witch.png` (既存 UR 星海のノクス)
- `images/characters/season1/ur/iris.png` (新規 UR イリス)
- **先行画像 添付**: `images/locations/s1c6/moonlight_palace_hall.png` (#2、 月影宮の常夜の卓 = 同シーン背景、 ルール7-35 整合)

- **対応シーン**: **4-1 山場** 月影宮の七座儀式の間で4人が初めて同じ場所に揃う
- **役割**: 4-1 シーン単独表示、 章のクライマックス視覚軸
- **被写体**: 月影宮の常夜の卓を中心に、 4人 (三柱+イリス) が四席に着座する瞬間、 七色の灯篭4つが空に舞い上がる
- **ストーリー使用**: ✅
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c6']['4-1']`

```
[Attached: 4 reference images (Seraph Paladin UR, Kaguya UR, Nokus UR, Iris UR new) + 1 background image (moonlight_palace_hall.png)]

anime-style cinematic illustration in the same celestial moon-palace inner hall as the attached background image (matching circular obsidian-and-silver dining table, three high-backed silver thrones, transparent silver pillars, seven-color cosmos beyond), Seraph Paladin seated at her tall six-wing throne with halberd grounded, Kaguya seated at her crescent moon throne with moon staff, Nokus seated at her star-spiral throne with star-staff, Iris (the new fourth seat-bearer in jade-green ceremonial robe holding her seven-color lantern staff) seated at a newly-manifested fourth throne of jade-and-silver with a green leaf and crescent motif (matching the central altar pillar), all four characters keeping their faces and outfits exactly as in the reference images, four seven-color lanterns floating up from the central table toward the cosmic ceiling (the moment the fourth seat lights), the table's seven concentric rings glowing brighter than ever before, divine cosmic atmosphere of "seven seats now four" with three remaining empty thrones implied in the misty distance behind, dramatic ethereal lighting with prismatic rainbow rim accents on all four figures, the four lanterns reflected in the polished black-mirror floor, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, weapon and staff grips realistic.

元画像から表情や姿勢は変わってOKです

Aspect ratio 16:9, high detail.
```

**ポイント**: 「three remaining empty thrones implied in the misty distance behind」 = ノクス「これでも足りない」 (S2C3 沈黙の塔への伏線) を視覚化。 構図的に「四人並列」 で 同列性を強調 (「七座の同胞」 整合)。

---

# 【13】iris_departure_morning.png — 別れの朝 (挿絵、 16:9)

**⚠️ 生成前に必ず添付してください** (3枚 + 背景):
- `images/characters/season1/ur/seraph_paladin.png` (既存 UR セラフィエル)
- `images/characters/season1/ur/iris.png` (新規 UR イリス)
- `images/characters/season1/ur/shrine_oracle.png` (新規 UR ヴィオレナ)
- **先行画像 添付**: `images/locations/s1c6/shrine_central_temple.png` (#4、 中央神殿の聖堂 = 同シーン背景、 ルール7-35 整合)

- **対応シーン**: 4-2 別れの朝、 イリスが地上の巫女連邦に戻る、 セラフィエル「妹よ」、 ヴィオレナ「千年待った」
- **役割**: 4-2 シーン単独表示、 章の収束 + 次章への余韻
- **被写体**: 神殿の聖堂前、 イリスが旅立ちの装いに着替え、 セラフィエルが見送り、 ヴィオレナが感慨深く微笑む構図
- **ストーリー使用**: ✅
- **コード参照**: `STORY_LOCATION_INLINE_CONFIG['s1c6']['4-2']`

```
[Attached: 3 reference images (Seraph Paladin UR, Iris UR new, Violena UR new) + 1 background image (shrine_central_temple.png)]

anime-style cinematic illustration at the entrance of the same shrine federation Lirie central temple sanctuary as the attached background image (matching tall jade pillars, central altar visible deeper in, stained glass at the far end), Iris (the new fourth seat-bearer in slightly more travel-worthy version of her jade-green ceremonial robe) standing at the temple's grand staircase facing outward toward the morning light with her seven-color lantern staff in hand, Seraph Paladin standing just behind her with her wings folded and one hand gently raised in farewell blessing, Violena (the millennium-old mother priestess in her midnight-violet robe) standing to Iris's other side with a deeply emotional gentle smile and one hand resting on her daughter's shoulder, all three characters keeping their faces and outfits exactly as in the reference images, golden morning sunlight pouring in from the temple entrance illuminating the three figures in warm golden glow, seven-color lanterns hovering peacefully throughout the temple in the background, falling cherry-blossom-like seven-color petals drifting through the air, dramatic warm dawn lighting with both Seraph's heavenly white-gold and Violena's millennium-violet aura blending around Iris in the center, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, staff grip realistic.

元画像から表情や姿勢は変わってOKです

Aspect ratio 16:9, high detail.
```

**ポイント**: 「Seraph's heavenly white-gold and Violena's millennium-violet aura blending around Iris in the center」 = 「天上 (観測者) + 千年血脈 (母) + 新世代 (娘)」 の三世代継承の視覚化、 S2C6 系譜継承への伏線。

---

## 整合性確認 (CLAUDE.md セルフチェック)

- ✅ outline.md L83-90 (S1C6 セクション) と完全整合
- ✅ s1c5 エピローグ「次は東、 七座が満つる時」 → s1c6 で実発、 視覚的に直接連結 (#1 観測者三柱 + #8 観測者+イリス)
- ✅ 全 13シーン 単一パラグラフ prose で記述 (s1c2/s1c3/s1c4/s1c5 形式準拠)
- ✅ 挿絵 5枚 (#9, #10, #12, #13) は対応する背景画像を「先行画像 添付」 として明記 (ルール7-35 BLOCKER 防御)
- ✅ 挿絵 #11 (回想シーン) は時空が異なる古代の場面なので背景参照不要 (該当背景なし)
- ✅ 全挿絵に CRITICAL ANATOMY REQUIREMENTS + 末尾文言「元画像から表情や姿勢は変わってOKです」 必須記載
- ✅ 純風景 (#2-#7) は ANATOMY 不要、 `Aspect ratio 3:4, high detail.` で締める
- ✅ メタデータ (対応シーン / 役割 / 被写体 / ストーリー使用 / コード参照) 全画像に必須記載

---

## 関連 memory / ルール

- `feedback_asset_scene_mapping.md`: アセットメタ必須記載 (誤マッピング事故防止)
- `feedback_image_prompt_charref_suffix.md`: ANATOMY + 末尾文言ルール
- `feedback_dalle_disabled_feature_preservation.md`: 動的シーンで欠損部位自動補正対策
- ルール7-35 (同一シーン背景未参照 WARNING): 挿絵プロンプトに背景 filename を「先行画像 添付」 として明記
- ルール7-34 (挿絵 同一シーン LEFT/RIGHT 整合 WARNING): STORY_LOCATION_INLINE_CONFIG で配置を統一
- `feedback_chapter_design_self_check.md` (新規): セルフチェック明示宣言義務化
