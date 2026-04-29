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

## 配置サマリ (一覧)

| シーン | 画像 | 本文行 | 備考 |
|---|---|---|---|
| 2-6 ネプテア | (場所画像なし) | l.265〜 | キャラカットイン `sea_queen.png` で対応 |
| **2-7 冒頭 (1)** | `entrance.png` | l.313 | 進入連続 1/2 |
| **2-7 冒頭 (2)** | `city.png` | l.316 | 進入連続 2/2 |
| **2-7 後半** | `throne.png` | l.322 | 一旦別ピース (試運転) |
| 2-8 同行者たち | (場所画像なし) | l.363〜 | グラデ背景のみ |
| **2-9 黒い亀裂** | `rift.png` | l.391 | 単独表示 |
| 2-10 / 2-11 | (場所画像なし) | l.435〜 / l.481〜 | `bg-shadow` → `bg-rainbow` で覚醒演出 |
| (ワールドマップ) | `palace.png` | — | ストーリー未使用、Task L で実装時に組込 |

---

## S1C1 場所画像 (タスク残)

→ `STORY/prompts/locations_s1c1.md` を別途新規作成予定。同じ規約 (対応シーン・本文行・役割・被写体・ストーリー使用・コード参照) で書く。

---

## 使い方メモ

- 末尾に `high detail, 16:9` (横長) または `vertical, 9:16` (縦) を追加で比率指定
- 全プロンプトはアニメ風ファンタジー、深海色 (青緑+金) を統一
- 添付画像は `images/characters/season1/{tier}/{name}.png` から指定
