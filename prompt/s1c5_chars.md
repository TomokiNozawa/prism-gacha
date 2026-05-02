# Prismaera 画像プロンプト — Season 1 第5章「黒月の予兆」

POV: シオン (銀霜王国 仮面騎士、 既存 SSR `masked_knight.png` の物語上 POV 再登場、 新キャラ追加なし)
新派閥: 黒月衆ノクトス (影の使徒・闇に堕ちた者) / 地底市リオラ (影と共生する地下都市)
背景基調: 銀霜の二重月夜・黒い亀裂・地底市の青光・影織りの工房

**tier配分**: UR 3 / SSR 4 / SR 3 / R 5 = 15体 (UR比 20%、 章テーマ「分離の儀式」 が UR3 の重みを必要とするため微増)

**UR3体の構成** (S1C7 + S2 への伏線視覚化):
- 1体目: **シ・ロエン** (シオン分離後の影、 S2C1 主人公の伏線、 UR重要キャラ)
- 2体目: **ノクトリア** (黒月の盟主、 ヴォイドラの代弁者、 S1C7 + S2C5 への伏線)
- 3体目: **リオラエル** (地底市の母、 観測者と同時代の古き存在、 S2C4 への伏線)

**⚠️ キャラ #1 (シ・ロエン) 生成時の重要ルール**:
- **既存 SSR シオン画像 `images/characters/season1/ssr/masked_knight.png` を必ず添付してから生成**
- 顔の輪郭・体格・身長は既存シオンと同一に保つ (分離した「もう一人の自分」 のため)
- 衣装・仮面の色・オーラ・背景を「銀から黒へ」 反転させる、 仮面は片側だけ装着し光/影の境界を象徴

**共通末尾**: `original character, no logos, no text, no watermark`
**推奨設定**: `gpt-image-1` (quality: high) / DALL·E 3 HD / size `1024x1536`
**保存先**: `images/characters/season1/<tier>/<slug>.png`

**CRITICAL ANATOMY REQUIREMENTS** (キャラ含む全プロンプトで必須、 feedback_image_prompt_charref_suffix.md 準拠):
- 5本指明示、 関節制約自然、 武器の握り方は人間工学的に正しく
- 末尾文言「元画像から表情や姿勢は変わってOKです」 はキャラリファ添付ありの時のみ追加

---

## UR (3体)

### 1. `shadow_apostle.png` — 銀霜黒月衆の使徒 シ・ロエン (シオンの影の側、 分離後)

**⚠️ 生成前に必ず添付してください**: `images/characters/season1/ssr/masked_knight.png` (既存 SSR 仮面騎士シオン)
→ ChatGPTに画像添付してから下記プロンプトを送る
→ 「分離した影の側」 演出に最適化、 顔と体格は既存シオンと同一保持

```
[Attached: reference image of the same character "Sion" / 銀霜王国の仮面騎士シオン]

Please create the SHADOW SELF (separated dark side) of the SAME character from the attached reference image. Keep the facial structure, body proportions, height, and basic identity EXACTLY as in the reference — this is his separated mirror self after the ritual. Only invert the costume colors from silver to black, change the half-mask alignment, and add black moon aura.

anime-style full-body portrait of the same character as reference but as his separated shadow self, SAME face structure as reference image with eyes now glowing dim violet, wearing only HALF of the silver mask now broken in half showing his right eye unmasked while the left half remains as a black-fragmented mask, long flowing midnight-black hair instead of silver streaming as if pulled by a void wind, deep black knight armor with violet-black trim and crescent moon engravings replacing the silver-white plates, torn black cloak fluttering with shadow particles, wielding a black mace twin to his original silver one but with darker engravings of black crescent moons, heroic stance with black crescent moon aura behind him forming a halo of cracked moon shards, divine presence floating slightly above broken stone, black crescent moon over cracked stone ruins background with violet void cracks in the air, dramatic rim light with violet-black glow and scattering black moon petals, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, weapon grip realistic.

元画像から表情や姿勢は変わってOKです
```

**ポイント**: 既存シオンの「銀」 を「黒」 に、 仮面を「半割れ」 に、 オーラは「黒月」。 顔は同一保持で「もう一人の自分」 を表現。 S2C1「眠れる主の世界」 主人公として再登場するため、 印象的なルックスを確立する。

**対応シーン**: s1c5 4-1 黒月の祭壇 — シオン分離の儀式直後 / s1c5 4-2 別れの朝 / S2C1 で再登場
**ストーリー使用**: ✅ (本編山場 + S2 への伏線)

---

### 2. `black_moon_lord.png` — 黒月の盟主 ノクトリア (黒月衆を統べる影の女王、 ヴォイドラの代弁者)

```
anime-style full-body portrait of an enigmatic dark moon empress, long straight midnight-violet hair flowing down to her ankles with black crescent moon ornaments scattered throughout, piercing pale lavender eyes with black slit pupils glowing with void light, porcelain pale skin with subtle black crescent tattoo across her cheekbone, wearing an elegant black queen gown of layered void-silk with violet-black filigree of crescent moons and broken stars, black lace high collar framing her face, long black gloves reaching above her elbows, large translucent black-violet wing-cape rising behind her like void-petals, holding a tall ornate dark staff topped with a floating black crescent moon orb radiating violet shadows, heroic stance with black moon aura swirling around her, divine presence floating slightly above cracked obsidian, black crescent moon over cracked stone ruins background with floating broken star-fragments and violet void rifts, dramatic rim light with violet-black glow and scattering void particles, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, staff grip realistic.
```

**伏線視覚化**: 浮遊する「broken star-fragments」 と「violet void rifts」 はヴォイドラ覚醒 (S1C7) の前奏。 S2C5「影との和解」 でヴォイドラ陣営の交渉役となる威厳を視覚化。
**対応シーン**: s1c5 2-1 月喰いの森 (黒月衆の隠れ家) でシオンに「取引」 を持ちかけるシーン
**ストーリー使用**: ✅ (本編敵首魁 + S1C7/S2C5 への伏線)

---

### 3. `underworld_matriarch.png` — 地底市リオラを統べる古女王 リオラエル (影と共生する文化の守護者)

```
anime-style full-body portrait of a graceful underground city matriarch with timeless youthful beauty, long flowing pale silver hair with subtle violet undertones reaching her waist, gentle deep amethyst eyes with ancient kind wisdom, fair luminous skin with faint glowing rune-tattoos along her arms, wearing an elegant midnight-blue and silver royal gown of layered woven shadows and starlight threads, intricate silver embroidery of interwoven light-and-shadow patterns across her bodice, silver crown of crescent and full moons combined, long flowing silver-violet cape with subtle living shadow tendrils trailing behind her, holding a tall slender staff of polished obsidian topped with a paired light-and-shadow orb (one half white-gold, one half violet-black) glowing softly, dynamic stance facing forward with arms slightly spread in welcoming gesture, dignified divine presence floating gently above polished obsidian floor, deep underground city of Liora background with crystalline cavern ceiling glowing with bioluminescent blue-violet lights, woven banners of light-and-shadow tapestries, dramatic rim light with twin-tone violet-and-gold glow, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, staff grip realistic.
```

**伏線視覚化**: 「paired light-and-shadow orb」 = 章テーマ「影を抱きしめる」 の象徴。 「ancient kind wisdom」 + 「rune-tattoos」 で「観測者と同時代の古き存在」 を匂わせ、 S2C4 千年記憶のキーへの伏線。 老齢ではなく**若々しい古き貴族型** (10-20代既定、 feedback_char_age_youth_first.md 準拠)。
**対応シーン**: s1c5 3-1 地底市リオラ全景 (シオン到着) / s1c5 3-3 「影を抱きしめる」 を教えるシーン
**ストーリー使用**: ✅ (本編キャラ + S2C4 への伏線)

---

## SSR (4体)

### 4. `fallen_paladin.png` — 元教会破門の堕者剣聖 ガルヴィン (黒月衆 旧教会勢)

```
anime-style full-body portrait of a fallen former holy paladin man in his late twenties, jet-black hair with silver streaks reaching his shoulders, sharp ash-grey eyes with hollow weariness, fair pale skin with a long scar running from temple to jaw, wearing tarnished dark-grey and black formerly-holy plate armor with violet-black corruption stains spreading from the chest emblem (a cracked white cross now half-blackened), long tattered dark-violet cape, black gauntlets, holding a single long ornate two-handed greatsword with a half-corrupted silver-and-black blade, confident grim poised stance with one hand on his sword's pommel, cinematic rim lighting with cold violet-grey accents, black crescent moon over cracked stone ruins background, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, sword grip realistic.
```

**伏線視覚化**: 「half-corrupted silver-and-black blade」 = 元・教会の聖剣が黒月衆で堕ちた象徴。 イザベル/ラナス との対峙 (S1C7) を予感させる。
**対応シーン**: s1c5 2-1 月喰いの森 (黒月衆登場、 ノクトリアの脇に立つ)
**ストーリー使用**: ✅ (本編 + S1C7 旧教会対峙への伏線)

---

### 5. `shadow_weaver.png` — 地底市の上級織り手 ルナリア (影と光の織物職人)

```
anime-style full-body portrait of a young female shadow-and-light weaver in her early twenties, long flowing pale-silver hair tied loosely with a violet ribbon, calm pale-violet eyes with creative focus, fair skin with subtle silver thread-tattoos on her hands, wearing an elegant artisan robe of midnight-blue and silver with woven shadow-and-light patterns flowing across the fabric, long sleeves with intricate silver embroidery of interlocking moons and suns, leather artisan belt with weaving tools and shadow-thread spools, holding a slender weaving wand of polished obsidian with a glowing shadow-light thread spinning between her fingers, dynamic stance leaning slightly toward her loom, gentle focused smile, deep underground workshop background with woven shadow-light tapestries hanging from cavern walls and bioluminescent blue-violet lights, cinematic rim lighting with twin-tone violet-and-silver glow, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, weaving wand grip realistic.
```

**伏線視覚化**: 「shadow-light thread」 = シ・ロエン覚醒の触媒 (山場 4-1 で織物がシオンの影を分離する儀式具に)。 地底市文化の象徴。
**対応シーン**: s1c5 3-2 影織りの工房
**ストーリー使用**: ✅

---

### 6. `silver_swordmaster.png` — 銀霜剣術の上席師範 オリエル (シオンの師匠、 仮面の意味を教えた人物)

```
anime-style full-body portrait of a dignified male silver-frost swordmaster in his late twenties to early thirties appearance with timeless poised aura, long platinum-silver hair tied in a low warrior's tail, sharp pale-blue eyes with master's calm authority, fair pale skin, wearing elegant silver-blue swordmaster robes with high collar and intricate frost-pattern embroidery, long silver-blue cape, leather armor segments at shoulders and forearms, holding a single long elegant silver-blue katana-style longsword with frost engravings, confident master stance with one hand resting on the sword's hilt, deep snow-frost shrine training hall background with silver-blue mist and moonlight from high windows, cinematic rim lighting with cool silver-blue glow, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, sword grip realistic.
```

**Tier 整合性**: 「上席師範」 + 「master」 で SSR 級アンカー (師範) 含む。 北方剣聖ハグル (s1c4 SSR `north_swordmaster.png`) と並列の立ち位置。
**対応シーン**: s1c5 1-2 シオンの私室の回想 / s1c5 4-1 祭壇の儀式に立ち会う
**ストーリー使用**: ✅

---

### 7. `silver_king.png` — 銀霜王国の若き王 ノヴァ (シオンが守る対象、 暗殺未遂の標的)

```
anime-style full-body portrait of a young silver-frost king in his early twenties, neat short platinum-silver hair with a small silver crown, gentle pale-blue eyes with thoughtful royal kindness, fair pale skin, wearing elegant silver and white royal robes with deep blue trim and intricate frost-and-moon embroidery across the chest, long flowing white royal cape lined with pale blue silk and silver moon emblems, royal sash with the silver crescent moon insignia, ceremonial silver-rimmed gauntlets, holding a slender ornate ceremonial silver scepter with a frost-crystal moon at its top, dynamic stance facing forward with one hand gently raised in greeting, dignified composed smile, silver-frost throne hall at midnight background with tall pale moonlit windows, cinematic rim lighting with soft silver-blue glow, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, scepter grip realistic.
```

**Tier 整合性**: 「若き王」 + 「royal scepter」 で SSR 級アンカー (近衛/上級/王権) 含む。 ガチャキャラ若め (10-20代) ルール準拠。
**対応シーン**: s1c5 1-1 銀霜王宮の月光謁見の間 (シオンに月夜の儀を命じる)
**ストーリー使用**: ✅ (本編 + S2 龍譲位類比への伏線)

---

## SR (3体)

### 8. `black_assassin.png` — 月夜の暗殺者 (黒月衆の刺客、 匿名仮面)

```
anime-style full-body portrait of a slender masked night assassin of indeterminate age in lithe young adult build, lean form covered head-to-toe in dark-violet and black assassin attire with hood, full-face smooth black mask with two violet eye-slits glowing dimly, dark fingerless gloves, body wraps with subtle crescent moon stitching, soft soundless cloth boots, dual short black daggers held in reverse grip with violet-edged blades, low crouching attack stance ready to strike, black crescent moon over cracked stone ruins background with shadowed alleyway and dim moonlight, cinematic rim lighting with cold violet accents, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, dagger reverse grip realistic.
```

**対応シーン**: s1c5 2-2 王族暗殺未遂現場 (回想 + 現在)
**ストーリー使用**: ✅

---

### 9. `moon_priest.png` — 雪月神殿の月夜祭司 アスター (祭壇の儀式を司る)

```
anime-style full-body portrait of a dignified moon-shrine priest in his mid-twenties with calm spiritual presence, long pale-blue hair tied in a high warrior's tail, gentle pale-violet eyes with priestly serenity, fair pale skin, wearing elegant silver and pale-blue ceremonial priest robes with crescent moon and starlight embroidery, white sash with silver crescent moon emblem, soft silver shoulder ornaments, holding a tall ornate silver-and-blue ceremonial staff with a frost-crystal crescent moon at its top, confident poised stance with the staff held vertically, silver-frost throne hall at midnight background with moonlight beams from high windows and floating silver dust motes, cinematic rim lighting with cool silver-blue glow, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, staff grip realistic.
```

**Tier 整合性**: 「祭司」 で SR 級アンカー含む。 既存 SR_メイリ「銀霜の巫女」 と並列の立ち位置。
**対応シーン**: s1c5 4-1 黒月の祭壇の儀式 (シオン分離) — メイリと共に儀式を進行
**ストーリー使用**: ✅

---

### 10. `underworld_bard.png` — 地底市リオラの語り部 オルフェ (地底市の歴史を歌で伝える詩人)

```
anime-style full-body portrait of a thoughtful young underworld city bard in his early twenties, medium-length flowing pale-violet hair, gentle warm amber eyes with poetic depth, fair skin with subtle silver musical-rune tattoos on his fingers, wearing comfortable artisan-bard attire of deep blue and silver layered tunic with woven shadow-and-light patterns, leather artisan belt with small instruments, soft cloth shoulder cape, holding a slender ornate harp-staff (a small portable harp wrapped around a silver staff) with shadow-light strings, dynamic stance with one hand plucking the strings, gentle focused expression, deep underground city of Liora background with bioluminescent blue-violet lights and woven shadow-light tapestries, cinematic rim lighting with violet-silver glow, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, harp-staff grip realistic.
```

**対応シーン**: s1c5 3-1 / 3-3 地底市の歴史をシオンに歌で伝える
**ストーリー使用**: ✅

---

## R (5体)

### 11. `silver_squire.png` — 銀霜近衛騎士 セレン (シオンを慕う後輩、 王族近衛)

```
anime-style full-body portrait of an earnest young silver-frost knight squire, neat short platinum-silver hair, eager pale-blue eyes with youthful determination, fair skin, wearing simple silver and pale-blue knight squire armor with crescent moon emblem on chest plate, light pale-blue cloth surcoat, leather pauldrons, holding a slender silver knight's sword in one hand with composed grip, natural standing with respectful straight posture, gentle determined smile, silver-frost throne hall at midnight background with soft moonlight, soft daylight balanced lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, sword grip realistic.
```

**Tier 整合性**: 「近衛」 が R/SR の境界で迷うが、 「squire」 + 「youthful」 で R 級。 セレンは若手の意。
**対応シーン**: s1c5 1-1 王宮 / 1-3 市街の警備
**ストーリー使用**: ✅

---

### 12. `moon_acolyte.png` — 雪月神殿の見習い少年 ラピス (灯火を運ぶ、 メイリの後輩)

```
anime-style full-body portrait of an innocent young moon-shrine acolyte boy around fourteen years old, neat short pale-blue hair with a small silver crescent moon hairpin, large gentle hazel eyes, fair skin, wearing simple silver and pale-blue acolyte robes with white sash and crescent moon emblem, small leather belt with prayer beads, holding a small lit silver brass lantern in one hand carefully, the other hand clasped respectfully to his chest, natural standing with composed polite expression, silver-frost shrine corridor at midnight background with soft moonlight from high windows, soft daylight balanced lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, lantern grip realistic.
```

**対応シーン**: s1c5 4-1 祭壇の儀式 (灯火担当)
**ストーリー使用**: ✅

---

### 13. `underworld_girl.png` — 地底市の少女 シエル (影喰いを「友達」 と呼ぶ純粋な視点)

```
anime-style full-body portrait of an innocent young underworld city girl around ten years old, short curly pale-silver hair with a tiny violet ribbon, large bright amethyst eyes with curious wonder, fair skin with faint glowing rune freckles, wearing simple comfortable shadow-and-light woven dress in deep blue and silver with crescent moon embroidery, soft cloth slippers, holding a small handmade light-and-shadow doll, gentle curious smile, natural standing with one hand reaching toward a tiny harmless friendly shadow-creature near her feet, deep underground city of Liora background with bioluminescent blue-violet lights, soft daylight balanced lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints.
```

**伏線視覚化**: 「friendly shadow-creature」 = 「影と共生する文化」 を子供視点で象徴 (S2C5 への伏線)。
**対応シーン**: s1c5 3-1 地底市全景 / 3-3 シオンに「影は友達」 と話すシーン
**ストーリー使用**: ✅ (本編 + S2C5 への伏線)

---

### 14. `silver_villager_a.png` — 銀霜王国の若き工房娘 (祭夜の街で働く)

```
anime-style full-body portrait of a cheerful young silver-frost villager girl in her late teens, medium-length wavy pale-blue hair tied in a side braid with a small silver crescent moon hair clip, warm hazel eyes with bright curiosity, fair skin, wearing comfortable silver-blue villager work dress with white apron and frost-pattern embroidery, leather work belt, holding a small silver lantern for the moon festival, bright cheerful smile, natural standing with one hand waving in greeting, silver-frost villager street at midnight festival background with paper crescent moon lanterns hung along the alley, soft daylight balanced lighting with warm lantern glow, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, lantern grip realistic.
```

**対応シーン**: s1c5 1-3 銀霜の市街・祭夜
**ストーリー使用**: ✅

---

### 15. `silver_villager_b.png` — 銀霜王国の若き祭夜の歌姫 (祭夜の街で歌う)

```
anime-style full-body portrait of a gentle young silver-frost villager singer girl in her late teens, long flowing pale-silver hair with a small silver crescent moon hairpin, soft pale-violet eyes with calm singing focus, fair skin, wearing simple but elegant silver-blue villager singer dress with white sash and frost-and-moon embroidery, soft cloth shoulder shawl, holding a small handmade silver-blue songbook in both hands, gentle singing expression with parted lips, natural standing with composed singing posture, silver-frost villager street at midnight festival background with paper crescent moon lanterns hung along the alley and gentle audience silhouettes listening, soft daylight balanced lighting with warm lantern glow, detailed linework, high-quality illustration, original character, no logos, no text, no watermark.

CRITICAL ANATOMY REQUIREMENTS: clearly visible 5 fingers on each hand, anatomically correct joints, songbook grip realistic.
```

**対応シーン**: s1c5 1-3 銀霜の市街・祭夜 (シオンが市街を歩くシーンの背景)
**ストーリー使用**: ✅

---

## 📋 スマホ生成用まとめ (生成順 + 対応シーン)

| # | tier | 名前 | slug | 対応シーン | 備考 |
|---|---|---|---|---|---|
| 1 | UR | シ・ロエン | `shadow_apostle` | 4-1 / 4-2 / S2C1再登場 | **既存 SSR シオン画像を必ず添付** |
| 2 | UR | ノクトリア | `black_moon_lord` | 2-1 黒月衆登場 | ヴォイドラ伏線 |
| 3 | UR | リオラエル | `underworld_matriarch` | 3-1 地底市登場 | S2C4 千年記憶伏線 |
| 4 | SSR | ガルヴィン | `fallen_paladin` | 2-1 黒月衆 | S1C7 旧教会対峙伏線 |
| 5 | SSR | ルナリア | `shadow_weaver` | 3-2 影織り工房 | 分離儀式の触媒 |
| 6 | SSR | オリエル | `silver_swordmaster` | 1-2 / 4-1 | シオン師匠、 ハグル並列 |
| 7 | SSR | ノヴァ (銀霜王) | `silver_king` | 1-1 王宮謁見 | S2 龍譲位類比 |
| 8 | SR | 黒月の刺客 | `black_assassin` | 2-2 暗殺現場 | |
| 9 | SR | アスター | `moon_priest` | 4-1 祭壇儀式 | メイリと並列 |
| 10 | SR | オルフェ | `underworld_bard` | 3-1/3-3 地底市 | |
| 11 | R | セレン | `silver_squire` | 1-1 / 1-3 | 王族近衛若手 |
| 12 | R | ラピス | `moon_acolyte` | 4-1 灯火 | メイリ後輩 |
| 13 | R | シエル | `underworld_girl` | 3-1 / 3-3 | S2C5 影共生伏線 |
| 14 | R | 工房娘 | `silver_villager_a` | 1-3 祭夜 | |
| 15 | R | 歌姫 | `silver_villager_b` | 1-3 祭夜 | |

生成結果は `images/characters/season1/<tier>/<slug>.png` にそのまま保存。
キャラ生成完了時に thumb 版 `images/characters/season1/<tier>/thumb/<slug>_thumb.webp` を作成 (Phase 1-A 完了後の規約)。

---

## 派閥背景の確認

`prompt/_common.md` 派閥テーブル参照:
- **黒月衆ノクトス (S1C5〜)**: `black crescent moon over cracked stone ruins` (ガルヴィン / ノクトリア / シ・ロエン / 黒月の刺客)
- **地底市リオラ (S1C5〜、 NEW)**: `deep underground city with bioluminescent blue-violet lights and woven shadow-light tapestries` ← `_common.md` に追加要 (リオラエル / ルナリア / オルフェ / シエル)
- **銀霜王国**: `silver-frost throne hall at midnight` (ノヴァ / アスター / セレン / ラピス / 工房娘 / 歌姫 / オリエル — 神殿は若干違う)

→ **`_common.md` 派閥背景テーブルに「地底市リオラ」 行追加の todo** あり (実装時)。
