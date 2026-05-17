# PCB ショップ 商品画像 プロンプト 素案 v0.2

PCB (Prismaera Cards Battle) ショップ用 マット 5種 + 衣装 5種 の DALL-E 3 / ChatGPT (gpt-image-1) 生成プロンプト。 アイコン絵文字だけだった現状を 実画像へ置換するためのアセット。

## 🔴 生成時の必須前提 (野沢さん指示 2026-05-18)

1. **本編世界観を 崩さない**: マット = 既存 `content/prompt/locations_s1cN.md` の各 派閥本拠 場所画像と 同じ世界観キーワード (palette / 装飾 / 神話モチーフ) を 引用。 衣装 = 既存 `content/prompt/s1cN_chars.md` の キャラ立ち絵プロンプトの aura/装飾密度 を 1段控えめ にして 別衣装化 (= 衣装が 元キャラより 派手になりすぎない)
2. **既存画像のリファ添付 OK**:
   - **衣装は リファ画像 必須** (= `images/characters/season1/{tier}/{slug}.png`、 該当キャラ立ち絵)
   - **マットは リファ画像 推奨** (= `images/locations/s1cN/{slug}_thumb.webp` 等の 同派閥 場所画像 1-2枚を 「色味 + 装飾モチーフ 参考」 として 添付)、 純テキスト プロンプトでも可
3. **別衣装は 元キャラを ベースに**: 衣装プロンプトの「Same character as the reference image, exact same face, hairstyle, hair color, eye color, body type, height, and gender — only the costume changes」 を **絶対外さない**。 顔・髪型・体型が 元キャラと違うと「同じキャラの別衣装」 として 整合性が取れず ショップ価値が 崩れる (ガチャ排出されたキャラに 着せる 前提)

## 🔵 保存名 + 格納先 一覧 (野沢さん指示 2026-05-18)

生成画像は 以下の **保存名で 各格納先に配置**。 PCB script は `cardgame/data/shop_items.json` の `id` 完全一致で fetch するため、 **保存名は id と完全一致** 必須。

### マット (1024×1024 PNG)

| id (= 保存名 拡張子なし) | 保存名 | 格納先 (repo) |
|---|---|---|
| mat_aquasis | `mat_aquasis.png` | `cardgame/img/shop/mats/mat_aquasis.png` |
| mat_sahar | `mat_sahar.png` | `cardgame/img/shop/mats/mat_sahar.png` |
| mat_niflheim | `mat_niflheim.png` | `cardgame/img/shop/mats/mat_niflheim.png` |
| mat_silver | `mat_silver.png` | `cardgame/img/shop/mats/mat_silver.png` |
| mat_voidtower | `mat_voidtower.png` | `cardgame/img/shop/mats/mat_voidtower.png` |

### 衣装 (768×1024 PNG)

| id (= 保存名 拡張子なし) | キャラ | 保存名 | 格納先 (repo) |
|---|---|---|---|
| cos_prisma_radiant | プリズマ (LR) | `cos_prisma_radiant.png` | `cardgame/img/shop/costumes/cos_prisma_radiant.png` |
| cos_artemis_jade | アルテミス (UR) | `cos_artemis_jade.png` | `cardgame/img/shop/costumes/cos_artemis_jade.png` |
| cos_isabel_dawn | イザベル (UR) | `cos_isabel_dawn.png` | `cardgame/img/shop/costumes/cos_isabel_dawn.png` |
| cos_shion_lunar | シオン (SSR) | `cos_shion_lunar.png` | `cardgame/img/shop/costumes/cos_shion_lunar.png` |
| cos_iris_seven | イリス (UR) | `cos_iris_seven.png` | `cardgame/img/shop/costumes/cos_iris_seven.png` |
| cos_kaguya_thousand | カグヤ (UR) | `cos_kaguya_thousand.png` | `cardgame/img/shop/costumes/cos_kaguya_thousand.png` |
| cos_runa_night | ルーナ (SSR) | `cos_runa_night.png` | `cardgame/img/shop/costumes/cos_runa_night.png` |
| cos_seresta_glacier | セレスタ (SR) | `cos_seresta_glacier.png` | `cardgame/img/shop/costumes/cos_seresta_glacier.png` |
| cos_noa_blackcat | ノア (SSR) | `cos_noa_blackcat.png` | `cardgame/img/shop/costumes/cos_noa_blackcat.png` |
| cos_shanty_gala | シャンティ (SSR) | `cos_shanty_gala.png` | `cardgame/img/shop/costumes/cos_shanty_gala.png` |

### 取込フロー (野沢さん作業)

1. ChatGPT で 該当 prompt + リファ画像 (= 上記「元: ...」) を 入力 → 画像生成
2. 出力 PNG を **保存名 完全一致** で 保存
3. Box mirror に 配置 (`~/Box/.../prismaera/cardgame/img/shop/[mats|costumes]/{id}.png`)
4. Claude に「shop アセット格納したよ」 と 伝える → repo に cp & dev push & main release

## 配置先

- repo: `cardgame/data/shop_items.json` の `id` と同名で `.png` 出力
  - マット: `cardgame/img/shop/mats/{id}.png` (例: `mat_aquasis.png`)
  - 衣装: `cardgame/img/shop/costumes/{id}.png` (例: `cos_prisma_radiant.png`)
- Box mirror: 同階層に コピー (sync_to_box.sh)
- 表示時は `<img src="img/shop/mats/${item.id}.png">` 等で 参照、 アイコン絵文字は fallback

## マット 共通仕様 (1024×1024 = 1:1 正方形、 v0.3 = 背景のみ 仕様 2026-05-18)

- **構図**: 上から俯瞰する **派閥本拠 装飾背景** (= アプリ上で カードを 上に配置する 純背景画像)。 **グリッド線・マス目は 描かない** (アプリ側で マス目通り キャラ配置は しない設計のため、 背景画像として 完結させる)
- **中央**: 派閥モチーフの **円形マンダラ装飾** を 控えめに 配置 (= カードを 置いた時に 邪魔にならない 程度、 中央のみ 透明感ある 暗めの 色合いで「カード置き場」 を 暗示)
- **周囲 (corner ornament)**: 派閥色 + 派閥モチーフの 装飾 framing (= 四隅に 神話モチーフを 配置、 海洋なら 珊瑚+真珠+アバロニ貝、 砂漠なら 古龍鱗+鎖+ヒエログリフ、 等)
- **質感**: ファンタジー世界の祭壇 / 床 / 地面 を 上から見た風景、 神秘的・装飾的
- **色味**: 派閥色を 主調、 中央付近は 暗め (カードを置いた時の視認性確保)
- **テキスト・ロゴ無し**: `no grid, no grid lines, no squares, no logos, no text, no watermark, no character`
- **末尾共通**: `original artwork, atmospheric perspective, top-down view, square 1:1 ratio, no grid, no grid lines, no characters, no logos, no text, no watermark`

### mat_aquasis : アクアシス深海マット (#1e5e8e 深青)

```
Top-down view of an underwater coral altar serving as a decorative background mat,
deep ocean blue (#1e5e8e) base with iridescent pearl inlays radiating outward,
centered pearl-mandala motif (a single ornate pearl at center, surrounded by abalone-shell rosette and bioluminescent coral filigree, decorative only, no grid lines, no squares, leaves clear darker space around the mandala for placing cards on top),
soft ripples of bioluminescent plankton scattered across the surface,
abalone shell mosaic and coral clusters at the four corners (corner ornament framing), brass and silver accents,
mythical aquatic kingdom aesthetic of Aquasis,
atmospheric perspective, top-down view, square 1:1 ratio,
no grid, no grid lines, no squares, no characters, no logos, no text, no watermark
```

### mat_sahar : 古龍砂漠マット (#b8860b 黄土)

```
Top-down view of an ancient dragon-scale stone altar serving as a decorative background mat,
desert gold (#b8860b) base with weathered sandstone texture,
centered dragon-scale mandala motif (an engraved ancient dragon eye at center, surrounded by radial dragon scales and hieroglyphic runes, decorative only, no grid lines, no squares, leaves clear darker space around the mandala for placing cards on top),
sand drifting across the surface,
hieroglyphic dragon runes and coiled-chain ornaments at the four corners (corner ornament framing),
copper and bronze accents, mythical Sahar desert aesthetic with millennial dust,
atmospheric perspective, top-down view, square 1:1 ratio,
no grid, no grid lines, no squares, no characters, no logos, no text, no watermark
```

### mat_niflheim : 氷霊王国マット (#7fa8c8 薄水色)

```
Top-down view of a frosted crystalline altar serving as a decorative background mat,
pale ice blue (#7fa8c8) base with translucent permafrost ice surface,
centered snowflake-mandala motif (an intricate six-pointed ice crystal at center, surrounded by fern-like frost patterns, decorative only, no grid lines, no squares, leaves clear darker space around the mandala for placing cards on top),
frozen lake mirror reflection feel across the surface,
fern-like ice patterns and aurora-tinted ice shards at the four corners (corner ornament framing),
silver-white aurora hints,
mythical Niflheim spirit kingdom aesthetic,
atmospheric perspective, top-down view, square 1:1 ratio,
no grid, no grid lines, no squares, no characters, no logos, no text, no watermark
```

### mat_silver : 銀霜王国マット (#9999cc 薄紫)

```
Top-down view of a silver-frost moonlight altar serving as a decorative background mat,
pale lavender (#9999cc) base with moonlit silver-frost finish,
centered moon-phase mandala motif (a full moon at center surrounded by waxing/waning crescent blades in eight directions, decorative only, no grid lines, no squares, leaves clear darker indigo space around the mandala for placing cards on top),
silver thread embroidery forming aurora-like waves,
crescent moon blades and silver-frost lacework at the four corners (corner ornament framing),
mythical Silver Frost kingdom aesthetic,
atmospheric perspective, top-down view, square 1:1 ratio,
no grid, no grid lines, no squares, no characters, no logos, no text, no watermark
```

### mat_voidtower : 異界塔ザナドマット (#4b0082 濃紫)

```
Top-down view of an ancient void-tower obsidian altar serving as a decorative background mat,
deep indigo void (#4b0082) base with obsidian black mirror surface,
centered void-flame mandala motif (a single purple eternal flame at center, surrounded by broken-chain runes in a circular ring, decorative only, no grid lines, no squares, leaves clear darker space around the mandala for placing cards on top),
twilight stars scattered in the negative space,
purple eternal flames and broken chain ornaments at the four corners (corner ornament framing, symbolizing thousand-year captivity),
mythical Voidtower Zanad aesthetic,
atmospheric perspective, top-down view, square 1:1 ratio,
no grid, no grid lines, no squares, no characters, no logos, no text, no watermark
```

## 衣装 共通仕様 (768×1024 = 3:4 縦長 立ち絵)

- **リファ画像 必須添付**: 該当キャラの **既存 LR/UR 立ち絵** (`images/characters/season1/{tier}/{slug}.png`) を 入力画像として 添付
- **指示**: 「**顔・髪型・髪色・目・体型・身長・性別は元画像と完全一致、 衣装と装飾のみ別バージョン**」
- **CRITICAL ANATOMY REQUIREMENTS** (CLAUDE.md ⑤ ルール準拠、 キャラ含む画像必須):
  - 5本指明示 (each hand has exactly five fingers, anatomically correct)
  - 関節制約 (joints bend naturally, no extra limbs)
  - 武器の握り方 (if holding a weapon, grip is realistic and matches the original)
- **末尾文言**: `元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです` (CLAUDE.md ルール)

### cos_prisma_radiant : プリズマ「原虹輝光衣」 (元: `images/characters/season1/lr/prisma.png`)

```
Same character as the reference image (虹意プリズマ, LR), exact same face, hairstyle, hair color,
eye color, body type, height, and gender — only the costume changes.

Costume: 'Radiant Seven-Color Aura Robe' — the final form of Prisma's thousand-year prayer.
Flowing long robe in seven prismatic colors (red, orange, yellow, green, blue, indigo, violet)
that shimmer as a constant rainbow aura around her body, semi-translucent silk layers,
silver thread embroidery of the seven-color river motif at the hem and sleeves,
delicate crystal pendant at the chest emitting soft prismatic light,
barefoot or with silver sandals.

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, no extra limbs.

Background: soft dawn light with faint rainbow gradient, no logos, no text, no watermark.
Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです。
```

### cos_artemis_jade : アルテミス「翡翠龍鎧」 (元: `images/characters/season1/ur/dragon_emperor.png`)

```
Same character as the reference image (龍帝アルテミス, UR), exact same face, hairstyle, hair color,
eye color, body type, height, and gender — only the costume changes.

Costume: 'Jade Dragon Ceremonial Armor' — Dragon Emperor's ceremonial regalia.
Lacquered jade-green armor plates with deep crimson silk braiding (kumihimo) at the joints and waist,
dragon-scale chest piece, asymmetric pauldrons, gold-inlay dragon engravings on the chest plate,
crimson sash flowing diagonally, twin great-swords 'Yin-Yang' (陰陽) sheathed at the back,
the swords glow faintly emerald and crimson respectively.

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, weapon grip is realistic, no extra limbs.

Background: imperial court interior with jade pillars, soft golden light,
no logos, no text, no watermark. Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです。
```

### cos_isabel_dawn : イザベル「暁光聖衣」 (元: `images/characters/season1/ur/ripple_saint.png`)

```
Same character as the reference image (波紋の聖女イザベル, UR), exact same face, hairstyle, hair color,
eye color, body type, height, and gender — only the costume changes.

Costume: 'Dawn-Light Holy Vestment' — White Flame Church's saint dawn-prayer attire.
Silver-white plate armor over white-and-gold ceremonial robe, gold thread embroidery
of ripple and wave motifs on the chest, sleeves, and hem, layered silk underrobes,
golden halo-circlet on the forehead, light silver gauntlets, holy spear of ripples held lightly,
the spearhead emits a soft dawn glow.

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, weapon grip is realistic, no extra limbs.

Background: cathedral interior with rose-gold dawn light streaming through stained glass,
no logos, no text, no watermark. Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです。
```

### cos_shion_lunar : シオン「月光仮面装束」 (元: `images/characters/season1/ssr/masked_knight.png`)

```
Same character as the reference image (仮面騎士シオン, UR), exact same face, hairstyle, hair color,
eye color, body type, height, and gender — only the costume changes.

Costume: 'Moonlight Masked Festival Attire' — Silver Frost kingdom Masked Knight's moon-night festival garb.
Deep indigo-black ceremonial cloak with silver moon-phase embroidery along the edges,
silver crescent pauldrons, lacquered silver mask with pale moonlight glow on its surface,
black leather under-armor with silver filigree, slim katana at the hip in a silver sheath,
flowing dark silk sash with crescent moon prints.

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, weapon grip is realistic, no extra limbs.

Background: silver-frost garden at night with full moon high above, no logos, no text, no watermark.
Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです。
```

### cos_iris_seven : イリス「七色巫女衣」 (元: `images/characters/season1/ur/iris.png`)

```
Same character as the reference image (イリス, UR, 巫女連邦第四席「約束」), exact same face, hairstyle,
hair color, eye color, body type, height, and gender — only the costume changes.

Costume: 'Seven-Color Priestess Festival Robe' — main attendant attire of the Seven-Color Festival.
Layered miko-style robes (襦袢 + 千早 + 緋袴) in seven prismatic colors, each layer a different hue
(red, orange, yellow, green, blue, indigo, violet), white inner layer underneath,
elegant golden hair ornaments with seven small bell charms in seven colors,
white tabi with thonged geta sandals, holding a seven-color paper-streamer staff (御幣).

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, no extra limbs.

Background: festival shrine plaza with seven-color paper lanterns at golden hour,
no logos, no text, no watermark. Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです。
```

## 価格設計 (野沢さん指示「高め」 反映、 別途相談)

現状: 全 1000pt 一律
提案: tier別 / 章別で 階段化

| 商品種別 | 提案価格 | 根拠 |
|---|---|---|
| マット (派閥) | 3000-5000pt | 1派閥 = 章まるごと、 1枚あれば長期利用 |
| 衣装 LR (プリズマ等) | 8000-10000pt | LR 1枚 = 物語の核、 看板アイテム |
| 衣装 UR (アルテミス/イザベル/シオン/イリス等) | 4000-6000pt | UR = 派閥代表級 |

参考: Master 勝利 8pt + BO3 +5pt = 1 BO3 勝利 13pt → LR 衣装 1着 700+ BO3 必要、 「結構プレイしないと買えない」 体験設計 (野沢さん方針)。

## 生成優先順位

1. **マット 5種** (Phase A、 1:1 正方形、 比較的失敗少ない)
2. **衣装 LR プリズマ** (Phase B、 看板)
3. **衣装 UR 4種** (Phase C、 派閥代表)
4. **追加候補** (Phase D): s1c5 シオン 別衣装、 s1c6 ヴィオレナ、 s1c6 ホムラ、 s1c7 ヴォイドラ 等 章追加で 拡張

## v0.4 追加 5体 (野沢さん採用 2026-05-18、 顔タイプ + PCB使用)

野沢さん 選定: カグヤ (顔) / ルーナ (顔) / セレスタ (顔) / ノア (顔、 PCB 使用率低い告白あり) / シャンティ (PCB よく使う)。 詳細根拠は memory `feedback_user_favorite_chars.md` 参照。

### cos_kaguya_thousand : 千夜姫カグヤ「千夜祭礼装束」 (元: `images/characters/season1/ur/ancient_sage.png`)

```
Same character as the reference image (千夜姫カグヤ, UR), exact same face, hairstyle (silver-purple long hair),
hair color, eye color, body type (loli build of ancient dragon-blood), height, and gender — only the costume changes.

Costume: 'Thousand-Night Festival Robe' — ancient dragon-blood thousand-year festival attire.
Silver-purple long hair flowing, lunar crown with crescent moon ornaments,
ancient dragon-scale obi (orichalcum-bronze color) wrapped around waist,
moonlit silver-embroidered furisode (long-sleeved kimono in deep indigo with silver moon-phase embroidery),
faint dragon-scale tattoo on forehead (subtle, ceremonial),
holding the Moon-shadow staff with crescent crystal,
white tabi with lacquered geta sandals.

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, staff grip is realistic, no extra limbs.

Background: Moon-shadow palace altar under thousand-night moonlight, soft silver glow,
no logos, no text, no watermark. Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです。
```

### cos_runa_night : ルーナ「夜の街パーカースタイル」 (私服、 元: `images/characters/season1/ssr/apprentice_priestess.png`)

野沢さん指示 2026-05-18: 「私服っぽく、 パーカーとか良いかも」 = 公式制服ではなく **オフの普段着**。 教会見習いの 別の一面 (= ルーナの「素」 を 引き出す カジュアル路線)。

```
Same character as the reference image (白焔教会見習い巫女ルーナ, SSR, s1c2), exact same face, hairstyle,
hair color, eye color, body type, height, and gender — only the costume changes.

Costume: 'Night Stroll Hoodie & Long Skirt Style' — Luna's casual off-duty private outfit,
a soft pastel-white oversized pullover hoodie with subtle silver moon-phase print on the chest,
gentle pale lavender accent on the sleeves and hood lining,
**an elegant ankle-length pleated long skirt in cream-white or pale ivory** with subtle silver embroidery at the hem (上品なロングスカート、 野沢さん指示 2026-05-18),
plain white sneakers OR cream-color loafers with silver buckles (= sneakers でも 上品な skirt と balance、 野沢さん 2026-05-18 生成画像で確認済 OK),
silver rosary with a small crescent moon pendant worn over the hoodie (the only church-symbol kept, hinting at her novice life),
a tiny silver crescent moon earring on one ear,
a small leather shoulder bag in soft beige.

The overall vibe: relaxed, slightly shy, like a young trainee enjoying her rare night-off in town.

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, no extra limbs.

Background: nighttime street near the White Flame Church district, soft warm streetlamp glow,
faint silhouette of a cathedral spire in the distance, gentle bokeh of city lights,
no logos, no text, no watermark. Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです (顔・髪型・体型・性別は元キャラと完全一致)。
```

### cos_seresta_glacier : セレスタ「氷塔オフタイム読書スタイル」 (私服、 元: `images/characters/season1/sr/frost_mage.png`)

野沢さん指示 2026-05-18: 「セレスタも私服が良いかな」 = 魔導士ローブではなく **オフタイムの知的私服**。 氷塔の窓辺で 魔導書を読む クール系 大人っぽい カジュアル (= フィオルン / ツバキ 系 涼やか 顔タイプとの 整合)。

```
Same character as the reference image (氷塔の魔導士セレスタ, SR, s1c7), exact same face, hairstyle,
hair color, eye color, body type, height, and gender — only the costume changes.

Costume: 'Glacier-Tower Off-Day Reading Style' — Celesta's casual off-duty study outfit,
an oversized soft-knit cardigan in pale ice-blue (#7fa8c8) over a white cotton long-sleeve shirt,
relaxed-fit dark indigo skinny jeans OR a high-waist pleated navy-blue mini skirt with cream tights,
beige ankle-high lace-up boots OR plain white canvas sneakers,
silver-rimmed reading glasses pushed up to her forehead (intellectual accent),
a single small silver snowflake pendant necklace,
holding a thick leather-bound magic tome casually against her chest,
a steaming porcelain tea cup on a nearby ledge (suggested in the scene).

The overall vibe: quiet, scholarly, slightly cool, like a young mage enjoying her library off-day.

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, tome grip is realistic, no extra limbs.

Background: Glacier Tower private library window seat at golden afternoon, soft frost patterns on the glass,
ancient tomes stacked nearby, warm-cool light contrast,
no logos, no text, no watermark. Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです (顔・髪型・体型・性別は元キャラと完全一致)。
```

### cos_noa_blackcat : ノア「黒猫祭装束」 (元: `images/characters/season1/ssr/cat_librarian.png`)

```
Same character as the reference image (黒猫ノア, SSR, s1c1), exact same face, hairstyle (black hair),
hair color, eye color, body type, height, and gender — only the costume changes.

Costume: 'Black Cat Festival Attire' — playful black-cat festival garb.
Black twin braids tied with crimson ribbons,
black funeral-style short robe with crimson silk lining (visible at sleeves and hem),
silver locket pendant at the neck with a tiny cat charm,
black-and-crimson sash with a small bell,
black tabi with lacquered black geta sandals,
small black cat-tail ornament dangling from the sash (playful detail),
slight mischievous smile.

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, no extra limbs.

Background: moonlit cemetery garden with red spider lilies (彼岸花) in soft focus, a black cat leaping in the background,
no logos, no text, no watermark. Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです。
```

### cos_shanty_gala : シャンティ「夜会の女海賊」 (B案 採用、 元: `images/characters/season1/ssr/pirate_captain.png`)

野沢さん指示 2026-05-18: A案 (リゾート) → B案 (夜会) に変更採用。 船長の意外な大人面、 海賊identity 残しつつ華やか。

```
Same character as the reference image (紅玉海賊団船長シャンティ, SSR, s1c2), exact same face, hairstyle,
hair color, eye color, body type, height, and gender — only the costume changes.

Costume: 'Pirate's Gala Night' — Shanty's formal-attire pirate gala outfit,
a deep black floor-length dressy gown with a deep V-neckline (modest yet elegant),
crimson velvet corset cinching the waist (her crew color preserved as accent),
black silk opera-length gloves (above the elbow),
a stylized black-and-crimson tricorn hat with a single black ostrich feather (gala version of her captain's hat),
a slim ceremonial rapier in a black-lacquered sheath at her hip (decorative, gala-formal — not a working blade),
gold chain choker with a small ruby pendant,
elegant black low-heel court shoes (or black ankle-strap heels),
red lipstick, subtly mature makeup,
dignified composed expression with a hint of her usual mischief.

The overall vibe: dignified, mature, the captain's unexpected formal side — pirate identity retained through accents (tricorn + rapier + crew colors) but in gala formality.

CRITICAL ANATOMY REQUIREMENTS: each hand has exactly five fingers, anatomically correct,
joints bend naturally, weapon grip is realistic, no extra limbs.

Background: a coastal city's grand gala hall at night, gold candelabras and crimson velvet curtains,
chandeliers reflecting on polished marble floor, soft warm light bokeh,
no logos, no text, no watermark. Original artwork, portrait 3:4 ratio.

元画像から表情や姿勢は変わってOKです、 衣装と装飾だけが別バージョンです (顔・髪型・体型・性別は元キャラと完全一致)。
```

## 関連

- shop_items.json 構造: `cardgame/data/shop_items.json`
- 表示ロジック: `cardgame/script.js` L2157- (`_renderShopList`)
- アイコン絵文字 (fallback): `mats[].icon` / `costumes[].icon` フィールド
- 配置ロジック: `_applyShopEquips` (L162 等、 装備中アイテムを 対戦盤 + キャラ詳細に反映)

## メモ

- 衣装は **元キャラ画像 添付必須** = ChatGPT/DALL-E 3 に 「Reference image」 として 添付してから プロンプト送信
- マットは リファ画像不要、 純テキストプロンプトで OK
- 失敗が多い時は ANATOMY 行を 単独段落で 強調、 末尾「元画像から表情や姿勢は変わってOK」 で キャラ識別性を 担保
