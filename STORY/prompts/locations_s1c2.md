# アクアシス 画像生成プロンプト集

S1C2「南方海域の異変」より。GPT(DALL-E 3)向け英語プロンプト。

---

## 【1】全景 — 海溝に広がる深海都市（ワールドマップ・挿絵兼用）

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

## 【2】ネプテア女王の宮殿 外観

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

## 【3】謁見の間 — ネプテアの玉座

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

## 【4】海溝の底 — 黒い亀裂（戦闘シーン）

> **添付画像2枚**:
> - `images/characters/season1/ssr/pirate_captain.png`（シャンティ）
> - `images/characters/season1/ur/sea_queen.png`（ネプテア）※【3】で使ったのと同じ画像
>
> 「この2人が戦闘シーンの中心に立つように」と一言添えると精度アップ。

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

## 【5】アクアシス海溝への入り口 — 海上から見た

> **添付画像2枚**:
> - `images/characters/season1/ssr/paladin_lady.png`（イザベル SSR）
> - `images/characters/season1/ssr/pirate_captain.png`（シャンティ）
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

## 使い方メモ

- 末尾に `high detail, 16:9` (横長) または `vertical, 9:16` (縦) を追加で比率指定
- 【1】全景 → ワールドマップのアクアシスエリア画像に兼用可
- 【3】添付: `ur/sea_queen.png` (ネプテア) ← 野沢さん作成済み
- 【4】添付2枚: `ssr/pirate_captain.png` (シャンティ) + `ur/sea_queen.png` (ネプテア)
- 【5】添付2枚: `ssr/paladin_lady.png` (イザベル SSR) + `ssr/pirate_captain.png` (シャンティ)
- 【4】→ タスクIの影喰いプロンプトと組み合わせて戦闘シーン生成も可
