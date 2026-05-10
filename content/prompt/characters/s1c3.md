# Prismaera 画像プロンプト — Season 1 第3章「砂塵の隊商」

POV: ヴィル (紫竜王国 第三王女、 既存 SSR `draco_lancer.png`)
新派閥: 古龍砂漠サハール (遊牧民+古龍末裔の混合)
背景基調: 砂漠・古代遺跡・古龍の彫像 / 派閥背景キーワード `golden dune under twin stars and ancient dragon statues` (`_common.md` 準拠)

**tier配分**: UR 2 / SSR 3 / SR 3 / R 2 = 10体 (UR比率 ~20%、 章規模圧縮)

**UR2体の構成**:
- UR1 サハナ: 第3章ヒロイン、 砂海王女、 風使い → **S1C7 黒月決戦に七座級風使いとして再登場 (outline.md S1C3伏線)**。 UR帯の派手さはこの未来戦力に向けた布石として描く必要あり (七色の風オーラ + 額の風紋)
- UR2 ファラー: 古龍末裔の老女、 千年級記憶を持つ語り部 → **S2 古龍王覚醒キーパーソン / S2C4 記憶の海で再登場**。 背後に「失われた古龍王」 colossal silhouette を必ず焼き付ける + 千年記憶の浮遊光

**⚠️ S1C1/S1C2 とのテイスト整合 (絶対)**:
- 全プロンプトを **単一パラグラフ・キーワード密集型** で記述 (s1c1_chars.md / s1c2_chars.md と同形式)
- 多段パラグラフ・物語的描写は禁止 (DALL-E 3 が別テイストを返す事故源)
- tier別の派手さ階層 (`_common.md` 準拠):
  - **UR**: heroic stance with rainbow aura + dramatic rim light + glowing accents + majestic divine presence
  - **SSR**: dynamic stance + cinematic rim lighting + detailed weapon decoration
  - **SR**: confident poised stance + cinematic rim lighting (控えめ)
  - **R**: natural standing + soft daylight
- 装飾密度ではなく「オーラ/ライティング/背景の派手さ」 で tier を表現する

**⚠️ ファイル名規則 (絶対)**:
- 本ファイルのセクション見出しは tier+連番+slug 形式 (`ur_08_desert_princess.png` 等) — s1c1 (ur_01〜ur_05) / s1c2 (ur_06〜ur_07) からの連番継承
- **実保存ファイル名は slug のみ** (`images/characters/season1/ur/desert_princess.png`) — 既存 `sea_queen.png` / `ripple_saint.png` 等と整合

**共通末尾**: `original character, no logos, no text, no watermark`
**推奨設定**: `gpt-image-1` (quality: high) / DALL·E 3 HD / size `1024x1536`
**保存先**: `images/characters/season1/<tier>/<slug>.png`

**解剖学指示**: 全プロンプトに `CRITICAL ANATOMY REQUIREMENTS` (5本指・関節・武器の握り) を埋め込み済 (CLAUDE.md / `feedback_image_prompt_charref_suffix.md` 準拠)

---

## UR (2体)

### 1. `ur_08_desert_princess.png` — 砂海王女 サハナ（古龍砂漠サハール・双風刀シャマール・七色風オーラ）

**派閥**: 古龍砂漠サハール / **役割**: 第3章ヒロイン、 17-18歳の砂漠遊牧王女、 風を操る戦士 / **武器**: 双風刀シャマール (二振りの曲剣、 振ると風が刃となる) / **伏線**: S1C7黒月決戦に**七座級風使い**として再登場、 七色の風で黒月の妖気を吹き散らす役 — 額の風紋がその布石

```
anime-style full-body portrait of a young desert nomad princess named Sahana, 17-18 years old with sun-tanned warm honey skin glowing with healthy radiance, long wavy light-brown hair with subtle golden highlights flowing wildly in seven swirling prismatic wind currents around her body, striking amber-gold eyes glowing with inner prismatic light, ornate forehead chain with a small glowing wind-rune mark radiating soft rainbow light between her brows, traditional desert nomad warrior attire — flowing crimson-and-gold tribal tunic with deep V neckline and rich gold embroidery, layered violet silk sash at the waist with hanging gold coins, loose violet trousers tucked into ornate leather warrior boots, multiple gold bangles and arm-cuffs, jeweled earrings, wielding twin curved scimitar swords (Shamar twin blades) with prismatic rainbow-edged blades one in each hand, surrounded by spiraling seven-color wind streams of red orange yellow green blue indigo violet light flowing outward from her body like seven outspread wings of wind, heroic stance with full rainbow wind aura radiating majestic divine warrior presence, golden dune under twin stars and ancient dragon statues with the seven prismatic streams of the genso flowing across the upper sky, dramatic rim light with prismatic wind aura and golden dust particles swirling around her, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, both hands gripping the scimitar hilts firmly with all five fingers visible and properly positioned, both arms in natural combat-ready poses with proper joint angles, original character, no logos, no text, no watermark
```

---

### 2. `ur_09_dragon_sage.png` — 古龍の語り部 ファラー（古龍砂漠サハール・古龍杖ジナ・千年記憶+古龍王シルエット）

**派閥**: 古龍砂漠サハール / **役割**: 古龍の末裔の少女 (見た目8-10歳幼女、 実年齢千年級)、 「失われた古龍王」 の伝承を語る、 千年級の知恵 / **武器**: 古龍杖ジナ (紫水晶を頂いた、 自分の身丈よりも大きい長杖、 古龍の鱗を埋め込んだ) / **伏線**: S2 古龍王覚醒のキーパーソン、 S2C4 記憶の海で再登場 — 背後の colossal sleeping dragon silhouette は必ず焼き付け、 観測者三柱 (カグヤ・ノクス・セラフィエル) との遠縁を示唆する千年記憶の浮遊光を散らす

**⚠️ カグヤとの差別化** (両者「幼子姿の千年級存在」 被り回避、 内部メモ — 公式 desc には出さない):
- 体格: カグヤ tiny petite (5-6歳級) vs ファラー 8-10歳級 (少し大きめ)
- 種族特徴: カグヤ 白狐耳9尾+額月紋 vs ファラー 額の古龍鱗紋 (角・尾なし)
- スタイル: カグヤ 和風 junihitoe (十二単) vs ファラー ペルシャ・エジプト混合 砂漠
- 雰囲気: カグヤ playful「うむ千年やっとるでな」 vs ファラー solemn ancient prophet「〜じゃ」「わし」「お主」
- 派閥: カグヤ 観測者七座 第二席 vs ファラー 古龍砂漠サハール

```
anime-style full-body portrait of a tiny ancient dragon-blooded sage girl named Fara who appears 8-10 years old but radiates centuries of presence, sun-tanned warm-honey skin with delicate childlike features, very long silver hair in a single thick braid falling past her ankles trailing on the ground with iridescent dragon-scale ornaments woven into the braid, deep amethyst-violet eyes glowing with prismatic ancient knowledge seeing far beyond her childlike face, intricate dragon-scale glyph mark on her forehead radiating soft rainbow light, layered ceremonial sage robes blending ancient Persian and Egyptian aesthetics in oversized form — deep-violet outer robe with extensive gold dragon-scale embroidery flowing along hem and sleeves much too large for her tiny frame and pooling around her bare feet, layered iridescent silk shawls trailing on the ground, wide ornate belt embedded with shimmering rainbow dragon-scale fragments wrapped multiple times around her small waist, holding a tall ornate ceremonial staff named Jhina that is taller than her small body but not towering (about 1.3-1.5 times her height, plausible to depict) topped with a faceted amethyst crystal radiating prismatic violet-rainbow light beams, the staff body wrapped with dragon scales and prayer cords, heroic dignified stance with rainbow aura, majestic ancient sage presence in a child body with floating translucent memory-images of past dragons drifting around her like glowing wisps, behind her a colossal translucent silhouette of an immense ancient sleeping dragon king coiling through the sky in violet-rainbow mist, golden dune under twin stars and ancient dragon statues with the seven prismatic streams of the genso flowing across the night sky, dramatic rim light with prismatic glow and floating golden dust, serene composed sage-like expression with subtle knowing smile showing centuries of wisdom in a child face, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, the hand gripping the tall staff firmly with all five fingers visible and properly positioned, both arms in natural childlike human poses with proper joint angles, original character, no logos, no text, no watermark
```

---

## SSR (3体)

### 3. `ssr_16_caravan_leader.png` — 隊商長 アーシャ（古龍砂漠サハール・神童商人・短剣+鞭）

**派閥**: 古龍砂漠サハール / **役割**: 砂漠隊商の女商人指揮官、 若くして大隊商を率いる神童商人、 サハナの旧知の姉貴分、 ヴィルが顔を隠して同行する / **武器**: 短剣 + 鞭 / **設定**: 22-23歳、 若くして達観した商売人気質、 義理堅い

```
anime-style full-body portrait of a young prodigy desert caravan leader woman 22-23 years old named Asha who already commands a major caravan despite her youth, sun-tanned warm-honey skin lightly weathered from desert travel, wild black hair pulled into a high messy ponytail under a deep forest-green silk turban-headband decorated with hanging small gold coins, sharp calculating brown eyes with a confident smirk that belies her years, deep forest-green long traveler coat worn open over a tan tunic, sturdy leather belt with multiple pouches and scrolls and a sheathed dagger, loose practical desert pants tucked into knee-high leather boots, multiple silver bracelets on one wrist and an intricate single thumb ring, holding a coiled leather merchant whip in one hand and the other hand resting on her dagger hilt, dynamic confident stance facing forward with one foot slightly forward, sun-baked desert market scene with caravan tents and laden camels in mid-distance under a golden hour sky with the seven prismatic streams of the genso flowing through the upper sky, cinematic rim lighting with warm desert amber glow, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, the hand holding the whip grips it firmly with all five fingers visible, both arms in natural human poses with proper joint angles, original character, no logos, no text, no watermark
```

---

### 4. `ssr_17_desert_swordsaint.png` — 砂牙の剣聖 グラン（古龍砂漠サハール・両手大剣サンガ・隻眼・古龍の血濃く年齢曖昧）

**派閥**: 古龍砂漠サハール / **役割**: サハナに剣を教えた若き剣聖、 砂漠最強、 一族の守り手 / **武器**: 両手大剣サンガ (砂で研いだ青銅) / **設定**: 25-26歳の若き剣才、 隻眼 (左目に古傷)、 寡黙、 弟子に深い愛情。 **古龍の血を強く引く者** — 実年齢は本人も知らず、 見た目より達観した気配を纏う / **挿絵連動**: tribe_battle.png に登場

```
anime-style full-body portrait of a young desert sword saint man 25-26 years old named Gran with the strong blood of ancient dragons making his presence ambiguous beyond his apparent age, sun-tanned dark skin, missing left eye covered by an old battle scar across the closed eyelid (no eyepatch), sharp amber-gold remaining right eye that holds a gravitas beyond his years, sleek dark-black hair slicked back (no grey), clean-shaven sharp jawline, subtle iridescent dragon-scale tattoos visible on his forearms tracing his ancient lineage, desert sword saint armored attire — chest piece of large iridescent dragon scales bound with leather straps, layered earth-toned undertunic, leather greaves and gauntlets, faded burgundy traveler mantle flowing in the desert wind behind him, holding a massive two-handed bronze greatsword named Sanga etched with desert sigils with the blade tip planted in the sand beside him, dynamic confident warrior stance like a young blade master rooted in his craft, windswept rocky desert canyon at dusk with sandstone cliffs and faint sandstorm in the distance and the seven prismatic streams of the genso flowing across the violet-amber dusk sky, cinematic rim lighting with warm dusk amber glow and dust particles, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, both hands gripping the greatsword hilt firmly with all five fingers visible and properly positioned, both arms in natural athletic human poses with proper joint angles and lean musculature, original character, no logos, no text, no watermark
```

---

### 5. `ssr_18_purple_dragon_servant.png` — 紫竜の侍従 リアム（紫竜王国・紫竜の槍・若き侍従）

**派閥**: 紫竜王国 (既存) / **役割**: ヴィルを心配して砂漠まで追ってくる若き忠臣、 紫竜王国側の視点 / **武器**: 紫竜の槍 (細身の儀礼槍、 紫の刃) / **設定**: 22-23歳、 真面目、 王女への忠誠心強い

```
anime-style full-body portrait of a young Purple Dragon Kingdom royal retainer 22-23 years old named Liam, fair skin with a subtle light tan, neatly combed dark hair with violet highlights, royal violet earnest serious eyes, formal armor of the Purple Dragon Kingdom — violet-and-silver plate armor with intricate dragon-motif engravings on the chest piece and shoulder guards, white ceremonial undertunic, royal purple cape clasped at the shoulder with the kingdom silver dragon emblem, silver-trimmed armored boots, holding a slender ceremonial spear with a violet-glowing blade emitting faint violet dragon-energy along its edge, dynamic upright dignified stance with the spear held vertical at his side like a young royal guard standing watch, expression of earnest concern as he searches for his missing princess, violet dragon palace with coiled dragon silhouettes and silver banners under a dawn sky transitioning from purple horizon to bright gold zenith with the seven prismatic streams of the genso flowing through the upper sky, cinematic rim lighting with cool violet and silver glow, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, the hand gripping the spear shows all five fingers firmly around the shaft, both arms in natural youthful human poses with proper joint angles, original character, no logos, no text, no watermark
```

---

## SR (3体)

### 6. `sr_16_festival_dancer.png` — 祭舞のサフィラ（古龍砂漠サハール・七色絹布・浄化の踊り手）

**派閥**: 古龍砂漠サハール / **役割**: 部族祭事の踊り手、 七色絹を纏う踊りで影喰いを浄化する / **武器**: 七色の絹布 (踊りの道具、 戦闘では浄化の武器) / **設定**: 20代前半女性、 朗らか、 神聖な踊りには深い覚悟

```
anime-style full-body portrait of a desert festival dancer young woman in her early twenties named Safira, sun-tanned warm-honey skin, long red-brown hair in intricate braids decorated with small golden coins and ribbons, bright joyful jade-green eyes, intricate beaded headpiece with hanging jewels, desert festival dance costume — fitted bandeau-style top in deep crimson with golden embroidery, flowing low-rise skirt made of seven layered prismatic silks (red orange yellow green blue indigo violet) swirling outward in the dance, multiple bangles on arms and ankles, exposed midriff, holding two long flowing silk scarves of different prismatic colors swirling around her in mid-motion, confident poised mid-twirl pose with one leg extended in a graceful spiral creating a rainbow halo of silks, radiant joy expression, desert oasis at evening with festive bonfires and tribal banners under the seven prismatic streams of the genso, cinematic rim lighting with warm amber dance-firelight glow, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, both hands holding silk scarves with all fingers clearly defined, both arms in natural dancer poses with proper joint angles, original character, no logos, no text, no watermark
```

---

### 7. `sr_17_dragon_smith.png` — 古龍鍛冶 オウル（古龍砂漠サハール・大ハンマー・若き天才鍛冶・古龍鱗の刺青）

**派閥**: 古龍砂漠サハール / **役割**: 古龍の鱗を鍛える若き天才鍛冶、 ヴィルに「血の意味」 を諭す若き哲人 / **武器**: 鍛冶用大ハンマー (戦闘でも使う) / **設定**: 24-25歳、 athletic build (大柄ではなく逞しい)、 寡黙、 古龍鱗の刺青を腕に纏う (古龍の血を引く一族の証)

```
anime-style full-body portrait of a young prodigy desert dragon-scale blacksmith man 24-25 years old named Owl with the heritable blood of ancient dragons, athletic build with broad shoulders and toned muscular arms, sun-tanned warm skin with iridescent rainbow dragon-scale tattoos tracing along his forearms as the lineage marks of his ancient blood, sleek short black hair, sharp-jawed face, deep patient brown eyes that hold wisdom beyond his years, heavy leather blacksmith apron over a sleeveless dark-grey work tunic with subtle soot smudges, leather work gauntlets on his hands, sturdy work pants and reinforced boots, single iridescent dragon-scale pendant on a leather cord around his neck, holding a large blacksmith warhammer with a polished bronze head etched with dragon-scale patterns and a thick desert hardwood haft, confident poised grounded stance like a young master rooted in his craft, desert forge workshop at twilight with stone forge glowing with embers and an anvil and finished dragon-scale armor pieces displayed on racks under the seven prismatic streams of the genso faintly visible through a high window, cinematic rim lighting with warm forge-fire amber glow against twilight blue accent, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, the hand gripping the hammer shows all five fingers firmly around the haft, both arms with athletic musculature in natural human poses with proper joint angles, original character, no logos, no text, no watermark
```

---

### 8. `sr_18_young_desert_warrior.png` — 砂風の戦士 ライ（古龍砂漠サハール・双短剣・サハナへの憧れ）

**派閥**: 古龍砂漠サハール / **役割**: サハナを慕う若き戦士、 一族の未来 / **武器**: 双短剣 (サハナの双剣を真似た若き戦士の構え) / **設定**: 16-17歳少年、 真面目、 まっすぐ、 サハナへの憧れ

```
anime-style full-body portrait of a young desert warrior boy 16-17 years old named Rai, sun-tanned warm-honey skin, dark brown short hair with longer fringe sweeping across his forehead, earnest bright hazel eyes full of admiration, sleeveless dark-tan tunic with a leather chest harness, practical loose dark trousers tucked into ankle-high leather boots, leather wraps on his forearms as training gear, single small amulet around his neck, holding two short daggers clearly modeled after his master's twin scimitar style on a smaller scale, confident poised eager forward stance ready to spring into action like a young warrior trying to prove himself, determined bright expression, desert training ground at sunset with target dummies and weapon racks and older warriors training in the distance under the seven prismatic streams of the genso, cinematic rim lighting with warm orange sunset glow, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, both hands grip the daggers firmly with all fingers visible, both arms in natural youthful human poses with proper joint angles, original character, no logos, no text, no watermark
```

---

## R (2体)

### 9. `r_12_desert_child.png` — 砂塵の子 ティナ（古龍砂漠サハール・スリング・子供枠）

**派閥**: 古龍砂漠サハール / **役割**: サハナの妹分、 子供枠、 一族の未来 / **武器**: 小さな革のスリング (護身用の小石を投げる) / **設定**: 8-9歳少女、 元気、 好奇心旺盛、 サハナを姉のように慕う

```
anime-style full-body portrait of a small desert child girl 8-9 years old named Tina, sun-tanned warm-honey skin, fluffy light-brown hair tied into two small twin braids decorated with tiny colorful beads, large warm round curious brown eyes bright with childhood wonder, simple desert children attire — loose short red-orange tunic with white embroidery, comfortable bloomer pants reaching her knees, simple woven sandals, small bag slung across her shoulder containing her stones and treasures, holding a small leather sling in one hand almost like a toy, natural standing bouncy pose with one foot slightly forward and an excited bright grin, peaceful nomadic camp at midday with colorful patterned tents and grazing camels in the distance and family members visible going about daily life under the seven prismatic streams of the genso flowing peacefully through the bright sky, soft daylight with gentle warm cheerful glow, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, the hand holding the sling shows all five fingers clearly, both arms in natural childlike human poses with proper joint angles, original character, no logos, no text, no watermark
```

---

### 10. `r_13_young_storyteller.png` — 砂風の語り部 ナドラ（古龍砂漠サハール・物語の杖・若き伝承継承者）

**派閥**: 古龍砂漠サハール / **役割**: 古龍王伝承の補助的な語り部 (ファラーとは別系統、 一般遊牧民側の伝承)、 祖父から物語の杖と語り部の役を受け継いだ若者 / **武器**: 物語の杖 (祖父の遺品、 実用ではなく装飾、 古龍の歯を埋め込んだ) / **設定**: 22-23歳、 温和、 物語を愛する、 子供たちに祖父の話を語り継ぐ

```
anime-style full-body portrait of a young desert storyteller man 22-23 years old named Nadra who recently inherited the role from his late grandfather, sun-tanned warm-honey skin, shoulder-length dark hair tied back in a low ponytail, clean-shaven face with light stubble, warm dark-brown eyes that hold ancient stories beyond his youth, slightly oversized desert storyteller robes inherited from his grandfather — deep blue-grey long flowing robe with silver embroidery, layered lighter-grey shawl over his shoulders, wide woven belt holding a small leather pouch with grandfather mementos, simple leather sandals, holding a tall slender storyteller staff of pale desert wood with a single ancient dragon tooth embedded near the top, the staff worn smooth from his grandfather generations of use, natural confident stance with a gentle wise smile passed down from his grandfather lessons, tribal evening campfire scene with children sitting around the fire and scattered tents in soft firelight under the seven prismatic streams of the genso flowing softly among the night stars, soft daylight blending into warm firelight glow, detailed linework, high-quality illustration, CRITICAL ANATOMY REQUIREMENTS: anatomically correct human hands with exactly five distinct well-formed fingers per hand, the hand on the staff shows all five fingers clearly gripping, both arms in natural youthful human poses with proper joint angles, original character, no logos, no text, no watermark
```

---

## 📋 スマホ生成用まとめ（生成順）

| # | tier | 名前 | section header | 実保存slug | 派閥 | 伏線 |
|---|---|---|---|---|---|---|
| 1 | UR | サハナ (砂海王女) | `ur_08_desert_princess` | `desert_princess` | 古龍砂漠サハール | S1C7 七座級風使い再登場 |
| 2 | UR | ファラー (古龍の語り部、 幼子姿の千年級存在) | `ur_09_dragon_sage` | `dragon_sage` | 古龍砂漠サハール | S2 古龍王覚醒キーパーソン / S2C4 記憶の海 |
| 3 | SSR | アーシャ (隊商長) | `ssr_16_caravan_leader` | `caravan_leader` | 古龍砂漠サハール | — |
| 4 | SSR | グラン (砂牙の剣聖、 若き古龍の血) | `ssr_17_desert_swordsaint` | `desert_swordsaint` | 古龍砂漠サハール | tribe_battle 挿絵連動 |
| 5 | SSR | リアム (紫竜の侍従) | `ssr_18_purple_dragon_servant` | `purple_dragon_servant` | 紫竜王国 | — |
| 6 | SR | サフィラ (祭舞) | `sr_16_festival_dancer` | `festival_dancer` | 古龍砂漠サハール | — |
| 7 | SR | オウル (古龍鍛冶) | `sr_17_dragon_smith` | `dragon_smith` | 古龍砂漠サハール | — |
| 8 | SR | ライ (砂風の戦士) | `sr_18_young_desert_warrior` | `young_desert_warrior` | 古龍砂漠サハール | — |
| 9 | R | ティナ (砂塵の子) | `r_12_desert_child` | `desert_child` | 古龍砂漠サハール | — |
| 10 | R | ナドラ (砂風の語り部、 祖父から継承) | `r_13_young_storyteller` | `young_storyteller` | 古龍砂漠サハール | — |

生成結果は `images/characters/season1/<tier>/<slug>.png` (実保存slug 列の名前で) に保存。

---

## 生成手順 (野沢用メモ)

1. 各セクションの ``` ブロックを ChatGPT (DALL-E 3) にコピペ → 添付画像なし → 生成
2. 全員 1024x1536 縦長 (3:4)、 解剖学指示込みで指破綻リスク低減
3. 保存先: `images/characters/season1/{tier}/{slug}.png` (実保存slug 列の名前)
4. 全10体生成完了後、 Claude に伝えれば thumb webp + POOL追加 + LOCATION_CONFIG 設定 + 第3章本文の最終ブラッシュアップ → v1.3.0 リリースまで実行
5. 10体並行生成は ChatGPT の負荷次第で時間かかる、 4-5体ずつ分割推奨
