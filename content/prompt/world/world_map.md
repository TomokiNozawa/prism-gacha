# Prismaera ワールドマップ画像プロンプト (v2 全章対応版)

## メタ情報

- **対応シーン**: ワールドマップモーダル全体 (Phase 2 背景画像)
- **役割**: 14派閥 + S1C3-C7 新派閥 + S2/S3 領域placeholder + 章マーカーが乗る土台
- **被写体**: 虹霊界の大陸 + 海域 + 天空界 + 全Season領域
- **ストーリー使用**: ✅ ワールドマップ常時表示
- **コード参照**: `script.js` `renderWorldMap()` の `<g class="world-zoom-layer">` 直下、 既存SVG装飾の最背面に挿入
- **想定サイズ**: **1792×1024 (16:9 横長)** — DALL-E 3 のサポート aspect 上限 (5:4 / 2000×1600 等は DALL-E 3 で直接出力不可、 16:9 が現実的最大ワイド)
- **実表示**: SVG viewBox `0 0 2000 1600` 内に `<image x="0" y="0" width="2000" height="1600" preserveAspectRatio="xMidYMid slice"/>` で配置 (左右約400px が trim)
- **保存先**: `~/Box/.../prismaera/images/locations/world_map.png` → `cp ~/prism-gacha-work/images/locations/world_map.png`

---

## 🎯 v2 改訂方針 (2026-05-02 野沢さん指摘)

**ワールドマップの根幹は将来も変えたくない** ため、 **S1C1〜S3C7 までの全章を考慮した地形** で初版を作る。 後から派閥を足すのは「???」 領域の解禁のみとする。

### 重要原則
- **S1 全7章の派閥地形は最初から全部描き込む** (S1C3 サハール砂漠、 S1C4 ニーヴル氷土+ゼノニア空挺城、 S1C5 ノクトス黒月+リオラ地底、 S1C6 リーリエ巫女連邦、 S1C7 ザナド異界塔 含む)
- **S2/S3 領域は霧で「???」 化** (将来章で解禁時に SVG overlay で霧を晴らす設計)
- 派閥アイコン・章マーカー・ラベル・コンパスは **画像内に描かない** (SVG overlay で動的描画)
- アスペクト比は 16:9 で確定 (DALL-E 3 制約)

---

## 配置整合 (絶対厳守、 SVG派閥座標と一致)

既存の `FACTION_WORLD_COORDS` (script.js l.3500前後、 viewBox 2000×1600) に**地形を合わせる**こと。 ただし viewBox 5:4 と画像 16:9 のアスペクト不一致で **画像左右約400px (viewBox x=0-200 と x=1800-2000) は slice で切られる** ため、 派閥アイコンが乗る範囲は viewBox `x: 200-1800, y: 0-1600` を意識して描く。

### S1 公開済み 14派閥 + S1C3-C7 新派閥 の地形対応

| 領域 | viewBox 座標 | 派閥 | 公開章 | 地形 |
|---|---|---|---|---|
| **天空界 (北上中央)** | (1000, 140) | 原虹・観測者 (genso) | S1C1 | 浮遊する星雲・虹オーラ・小島群 |
| **中央大陸 中心** | (1000, 450) | 十国の覇者 (rulers) | S1C1 | 王城都市、 金のドーム |
| **中央大陸 中部** | (1000, 720) | 黒曜塔 (tower) | S1C1 | 黒い高塔、 螺旋 |
| **中央南部** | (1000, 1180) | 星霊学院 (academy) | S1C1 | 星形のキャンパス、 屋根に星座模様 |
| **西方北部** | (450, 380) | 白焔教会 (church) | S1C1/C2 | 白い大聖堂、 七色ステンドグラス |
| **西方中部** | (280, 720) | 深緑樹海 (forest) | S1C1 | 深い緑樹海、 古木 |
| **西方南部** | (330, 1010) | 月牙狼族 (wolf) | S1C1 | 銀の月光森、 狼の遠吠え岩 |
| **西方氷土** | (500, 1250) | 銀霜王国 (silver) | S1C1/C5 | 銀霜の氷宮殿 |
| **東方北部** | (1550, 380) | 紫竜王国 (dragon) | S1C1/C3 | 紫の城、 紫光の雷雲 |
| **東方中部** | (1720, 720) | 紅翼皇家 (redwing) | S1C1 | 紅の城下町、 桜舞う |
| **東方南部** | (1670, 1010) | 夜焔郷・影衆 (yakai) | S1C1 | 提灯灯る竹林、 朱の鳥居 |
| **東方光土** | (1500, 1250) | 第七天 (seventh) | S1C1 | 山頂神殿、 朝陽 |
| **南方海域 西** | (800, 1450) | 海淵都市アクアシス (aquasis) | S1C2 | 海中珊瑚都市、 透明水面 |
| **南方海域 東** | (1300, 1450) | 紅玉海賊団 (crimson) | S1C2 | 紅い帆船、 紅玉の島 |
| **東南端 砂漠** | (1700, 1450) ※ | **古龍砂漠サハール (sahar)** | **S1C3** | 黄金の砂丘、 古龍の風化像、 双月 |
| **北東 凍土** | (1700, 220) ※ | **氷霊王国ニーヴル (niiruru)** | **S1C4** | 凍土ツンドラ、 青白月光、 氷山 |
| **北上 雲海** | (1500, 100) ※ | **空挺城ゼノニア (zenonia)** | **S1C4** | 雲海上の真鍮要塞、 蒸気と歯車 |
| **西方深部** | (200, 1100) ※ | **黒月衆ノクトス (noctos)** | **S1C5** | 黒い亀裂の渓谷、 黒月の影 |
| **大陸地下** | (700, 1320) ※ | **地底市リオラ (riora)** | **S1C5** | 地下都市の入口、 結晶光 |
| **西方北部** | (350, 200) ※ | **巫女連邦リーリエ (lilie)** | **S1C6** | 翡翠の神殿群、 七色の灯篭 |
| **天空界中央** | (1000, 50) ※ | **異界の塔ザナド (zanad)** | **S1C7** | 次元の裂け目に立つ巨塔、 渦巻く虚空 |

### S2/S3 placeholder (霧で「???」 化、 将来章で解禁時に画像更新)

| viewBox 座標 | 領域 | 内容 |
|---|---|---|
| (200, 1500) 西南端 | **S2 接続の領域** | 紫の渦に閉ざされた未知、 並行世界の影 |
| (1850, 1500) 東南端 | **S3 始原の地** | 七色の渦、 創世の予感、 神聖な霧 |
| (200, 50) 北西天空 | **S2 鏡の世界** | もう一つの天空界、 銀色の鏡像 |
| (1850, 50) 北東天空 | **S3 共観の覚醒地** | 七色使徒の聖域、 虹の幾何学模様 |

---

## ChatGPT 用プロンプト (コピペ用、 v2 全章対応)

```
A high-detail hand-painted fantasy world map illustration of "Prismaera" (a rainbow-spirit realm covering all of Season 1 through Season 3 storyline), in the style of Genshin Impact or Final Fantasy XIV world maps. Top-down isometric perspective slightly tilted, full 16:9 horizontal canvas (1792x1024). Map shows the entire continent + ocean + sky realm with all 19 distinct factions visible.

NORTH SKY REALM (top of map):
- Center-top: floating celestial archipelago of "Genso" (Seven Observers) — small drifting islands wrapped in soft rainbow aurora and scattered stars
- Center-top, slightly above main: a colossal dimensional rift tower "Zanad" piercing through reality, surrounded by swirling void violet mist (S1C7 final boss zone)
- Upper-left corner: a smaller secondary "Mirror World" sky realm in silver hues — duplicate aurora islands as a hint of S2 parallel world (rendered with thin haze/fog, partly obscured)
- Upper-right corner: a "Seven-Color Apostles' Sanctuary" with rainbow geometric patterns (S3 area, also rendered with thin sacred haze)

NORTH-EAST: a floating brass-and-copper steampunk fortress "Zenonia" hovering above clouds, with rotating brass cogs and steam plumes (S1C4 sky empire)

CENTRAL CONTINENT (middle, dominant landmass):
- Center: golden imperial city of "Rulers" — domed palaces, plaza, lantern lights
- Below center: a single tall obsidian tower of "Black Tower" spiraling upward
- Further south: star-shaped academy campus of "Star-Spirit Academy" with constellation rooftops

WEST FLANK (left side, top to bottom):
- Northwest: a jade shrine complex "Lilie Miko Federation" with seven-color lanterns
- Mid-northwest: white cathedral of "White Flame Church" with seven-color stained glass and cloud sea
- Mid-west: deep emerald primeval forest of "Deep Green Sea of Trees" with ancient towering trees and fireflies
- Mid-west deep: a dark ravine canyon "Noctos Black Crescent Sect" with black moon shadows over cracked stone ruins (S1C5 antagonist zone)
- Southwest: silver moonlit clearing of "Moonfang Wolf Tribe" with howling rocks
- Far southwest: silver-frost ice palace of "Silver-Frost Kingdom" with frozen pillars
- Lower mid-west: an underground city entrance "Riora Underground City" glowing with crystal light through cave openings (S1C5 hidden city)

EAST FLANK (right side, top to bottom):
- Northeast (within continent): violet dragon palace of "Purple Dragon Kingdom" with coiled dragon silhouettes and amethyst lightning
- Mid-east: crimson castle town of "Crimson Wing Empire" at dusk with falling cherry petals
- Southeast: lantern-lit bamboo grove of "Night Flame Village" with red torii gate
- Far southeast (within continent): mountaintop sun temple of "Seventh Heaven" with morning sunlight cascading down stone steps

FAR NORTH-EAST CORNER: frozen tundra of "Ice Spirit Kingdom Niiruru" with pale blue moonlight, blade-like icy mountain ridge, drifting snow (S1C4 sister kingdom)

FAR EAST-SOUTH CORNER: golden sand dunes of "Ancient Dragon Desert Sahar" with weathered colossal dragon statues half-buried in sand, twin moons rising over dunes (S1C3 nomadic territory)

SOUTH OCEAN (bottom):
- Southwest waters: underwater coral palace city of "Aquasis Deep-Sea" visible through transparent turquoise water with bioluminescent reefs glowing from below
- Southeast waters: red-sailed pirate galleon of "Crimson Pearl Pirates" anchored near a ruby island

S2/S3 MYSTERIOUS REGIONS (rendered with sacred haze, hint at future expansion but obscured):
- Far west-south corner: dense violet swirling mist hiding "S2 Connection Realm" — vague silhouettes of parallel-world echoes
- Far east-south corner: rainbow primal swirl, "S3 Origin Land" — sense of creation, divine fog

VISUAL STYLE:
- Hand-painted illustration, soft watercolor + ink line, fantasy game world map aesthetic (Genshin / FFXIV inspired)
- Color palette: deep midnight navy ocean, rainbow aurora top, warm golden continent center, distinct color tints per region (jade for shrines, crimson for east, violet for dragon, gold for sands, ice-blue for tundra)
- Subtle parchment grain texture overlay
- Soft glow on important locations (cathedral, palaces, academy, tower, shrines)
- Three regions intentionally obscured with sacred haze (S2 mirror world, S2 connection realm, S3 origin lands) — visible silhouettes but mysterious
- No labels, no text, no markers, no compass — those are added in code overlay
- Aerial top-down view with slight perspective depth
- 16:9 horizontal landscape, 1792x1024
- All 19 named factions clearly distinguishable in their geographic positions

Atmosphere: epic fantasy spanning multiple seasons of storytelling, gentle wonder for present zones, mysterious haze for future zones, dawn-of-adventure feeling overall. Original setting, no logos, no text, no watermark.
```

---

## 使い方手順

1. **生成**: 上記プロンプトを ChatGPT (GPT-4o + DALL-E 3) に貼付 → 16:9 で生成 → 1792×1024 PNG ダウンロード
2. **保存**: `~/Box/DIK & Company/06_Other/野沢用/claude/prismaera/images/locations/world_map.png` に保存 (上書き)
3. **Claude 側**: `cp Box→work` + cache buster bump → dev push
4. **将来 S2/S3 章公開時**: 該当領域の霧を SVG overlay で除去 (画像差し替え不要が理想)

## 注意点

- 画像内に **テキスト・ラベル・コンパスを描かない** (SVG overlay で動的描画)
- 派閥アイコン (円) は SVG overlay で乗る、 画像内には派閥名を書かない
- アスペクト比は **16:9 確定** (DALL-E 3 制約)、 viewBox 5:4 との不一致で左右 ~400px が slice trim される (中央維持)
- 派閥配置精度は DALL-E 3 ガチャ性、 2-3回試行推奨。 完璧な座標一致は難しいため、 派閥アイコンが画像内の建物と多少ずれても許容
- S2/S3 placeholder は **画像内に薄く** 描いておくと、 将来「霧を晴らす」 演出が可能。 完全に空白にしない

## 過去の経緯 (v1 → v2)

- v1 (2026-05-01): S1C1+C2 14派閥のみ考慮 → S1C3 サハール砂漠、 S1C4 凍土+空挺、 S1C5 黒月+地底等が地形に無く、 後から付け足す必要があった (野沢さん指摘「ワールドマップの根幹は変えたくない」)
- v2 (2026-05-02): S1C1〜S1C7 全派閥 + S2/S3 placeholder を最初から組み込み、 将来章は「霧解禁」 のみで対応可能に
