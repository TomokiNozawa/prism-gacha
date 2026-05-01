# Prismaera ワールドマップ画像プロンプト

## メタ情報

- **対応シーン**: ワールドマップモーダル全体 (Phase 2 背景画像)
- **役割**: 14派閥 + S2/S3 placeholder + 章マーカーが乗る土台、 SVG装飾と並列配置
- **被写体**: 虹霊界の大陸 + 海域 + 天空界、 ファンタジー手描き地図風
- **ストーリー使用**: ✅ (ワールドマップ常時表示、 章ジャンプ起点)
- **コード参照**: `script.js` `renderWorldMap()` の `<g class="world-zoom-layer">` 直下、 既存SVG装飾の最背面に挿入予定
- **想定サイズ**: 1792x1024 (16:9 横長、 ChatGPT/DALL-E 3 の最大wide)
- **実表示**: SVG viewBox `0 0 2000 1600` 内に <image x="0" y="0" width="2000" height="1600" preserveAspectRatio="xMidYMid slice"/> として配置 (4:3.2 比でclip)
- **保存先**: `~/Box/.../prismaera/images/locations/world_map.png` → `cp ~/prism-gacha-work/images/locations/world_map.png`

---

## 配置整合 (絶対厳守)

既存の SVG 派閥座標 (`FACTION_WORLD_COORDS` viewBox 2000x1600) に**地形を合わせる**こと。 派閥アイコン (円) は SVG 側で重ねるので、 マップ側は **地形のみ** (派閥名やアイコンは描かない、 派閥の有無を地形で示唆する)。

### 派閥配置と地形対応

| 領域 | viewBox 座標 | 派閥 | 地形 |
|---|---|---|---|
| **天空界 (北上)** | (1000, 140) | 原虹・観測者 (genso) | 浮遊する星雲・虹オーラ・小島群 |
| **中央大陸 中心** | (1000, 450) | 十国の覇者 (rulers) | 王城都市、 金のドーム、 大広場 |
| **中央大陸 中部** | (1000, 720) | 黒曜塔 (tower) | 黒い高塔1本、 螺旋階段 |
| **中央南部** | (1000, 1180) | 星霊学院 (academy) | 星形のキャンパス、 屋根に星座模様 |
| **西方北部** | (450, 380) | 白焔教会 (church) | 白い大聖堂、 七色ステンドグラス、 周囲は雲海 |
| **西方中部** | (280, 720) | 深緑樹海 (forest) | 深い緑の樹海、 古木 |
| **西方南部** | (330, 1010) | 月牙狼族 (wolf) | 銀の月光に照らされた森、 狼の遠吠え岩 |
| **西方氷土** | (500, 1250) | 銀霜王国 (silver) | 銀霜の氷宮殿、 氷柱と霜の結晶 |
| **東方北部** | (1550, 380) | 紫竜王国 (dragon) | 紫の城、 玉座の山、 紫光の雷雲 |
| **東方中部** | (1720, 720) | 紅翼皇家 (redwing) | 紅の城下町、 桜舞う戦場、 朱の旗 |
| **東方南部** | (1670, 1010) | 夜焔郷・影衆 (yakai) | 提灯灯る竹林、 朱の鳥居、 夜の里 |
| **東方光土** | (1500, 1250) | 第七天 (seventh) | 山頂神殿、 朝陽光、 七天の階段 |
| **南方海域 西** | (800, 1450) | 海淵都市アクアシス (aquasis) | 海中の珊瑚都市、 青い波紋、 透明な水面 |
| **南方海域 東** | (1300, 1450) | 紅玉海賊団 (crimson) | 紅い帆船、 紅玉の島、 海賊湾 |
| **東南端 (S1C3)** | (1700, 1450) | 古龍砂漠サハール (未派閥登録) | 黄金の砂丘、 古龍の風化像、 双月 |
| **北東 (S1C4)** | (1720, 130) | 氷霊王国ニーヴル (S1C4で追加予定) | 凍土ツンドラ、 青白い月光、 雪の刃のような山脈 |

### S2/S3 placeholder (霧表現)

| viewBox 座標 | 表現 |
|---|---|
| (200, 1530) 西南端 | 霧に閉ざされた未知の領域、 紫の渦、 「???」 を呼ぶ気配 |
| (1900, 1530) 東南端 | 始原の地、 七色の渦、 創世の予感 |

---

## ChatGPT 用プロンプト (コピペ用)

```
A high-detail hand-painted fantasy world map illustration of "Prismaera" (a rainbow-spirit realm), in the style of Genshin Impact or Final Fantasy world maps. Top-down isometric perspective slightly tilted, full 16:9 horizontal canvas (1792x1024).

WORLD LAYOUT (top to bottom, west to east):

NORTH (top center, sky realm): a floating celestial archipelago in soft rainbow aurora — small drifting islands, scattered stars, faint galactic mist. This is the "Genso" realm of seven observers.

CENTRAL CONTINENT (middle, dominant landmass): a large organic-shaped continent with golden imperial city of "Rulers" at its heart — domed palaces, plaza, lantern lights. Below it, a single tall obsidian tower spiraling upward ("Black Tower"). Further south, a star-shaped academy campus with constellation rooftops ("Star-Spirit Academy").

WEST FLANK (left side, top to bottom):
- Northwest: white cathedral of "White Flame Church" with seven-color stained glass, surrounded by cloud sea
- Mid-west: deep emerald primeval forest ("Deep Green Sea of Trees") with ancient towering trees and fireflies
- Southwest: silver moonlit forest clearing of "Moonfang Wolf Tribe" with howling rocks
- Far southwest: silver-frost ice palace of "Silver-Frost Kingdom" with frozen pillars

EAST FLANK (right side, top to bottom):
- Northeast: violet dragon palace of "Purple Dragon Kingdom" with coiled dragon silhouettes and amethyst lightning
- Mid-east: crimson castle town of "Crimson Wing Empire" at dusk with falling cherry petals and red banners
- Southeast: lantern-lit bamboo grove of "Night Flame Village" with red torii gate
- Far southeast: mountaintop sun temple of "Seventh Heaven" with morning sunlight cascading down stone steps

FAR SOUTHEAST (NEW area for chapter 3): golden sand dunes of "Ancient Dragon Desert Sahar" with weathered dragon statues half-buried in sand, twin moons rising

NORTHEAST (NEW area for chapter 4): frozen tundra of "Ice Spirit Kingdom Niiruru" with pale blue moonlight, blade-like icy mountain ridge, drifting snow

SOUTH OCEAN (bottom):
- Southwest waters: underwater coral palace city of "Aquasis Deep-Sea" with bioluminescent reefs glowing through transparent water surface
- Southeast waters: red-sailed pirate galleon of "Crimson Pearl Pirates" anchored near a ruby island

MYSTERIOUS REGIONS (placeholder):
- Far west-southern corner: dense violet swirling mist hiding unknown lands ("???")
- Far east-southern corner: rainbow primal swirl, sense of creation ("origin land")

VISUAL STYLE:
- Hand-painted illustration, soft watercolor + ink line, fantasy game world map aesthetic
- Color palette: deep midnight navy ocean, rainbow aurora top, warm golden continent center, distinct color tints per region
- Subtle parchment grain texture overlay
- Soft glow on important locations (cathedral, palaces, academy)
- No labels, no text, no markers, no compass — those are added in code overlay
- Aerial top-down view with slight perspective depth
- 16:9 horizontal landscape, 1792x1024

Atmosphere: epic fantasy, gentle wonder, dawn-of-adventure feeling. Original setting, no logos, no text, no watermark.
```

---

## 使い方手順

1. **生成**: 上記プロンプトを ChatGPT (GPT-4o + DALL-E 3) に貼付 → 生成 → 1792x1024 PNG ダウンロード
2. **保存**: `~/Box/DIK & Company/06_Other/野沢用/claude/prismaera/images/locations/world_map.png` に保存
3. **Claude 側 (notebook or desktop)**:
   - `cp ~/Box/.../prismaera/images/locations/world_map.png ~/prism-gacha-work/images/locations/world_map.png`
   - `script.js` の `renderWorldMap()` 内 `<g class="world-zoom-layer">` 開始直後に `<image href="/images/locations/world_map.png" x="0" y="0" width="2000" height="1600" preserveAspectRatio="xMidYMid slice" opacity="0.85"/>` を挿入
   - 既存SVG装飾 (大陸shape / 山脈三角 / 海岸線3本 / 中央森🌳) は重複する可能性あり → 画像反映後に削除 or opacity 下げで判断 (野沢さんに見せて確認)
   - 派閥アイコン (円) は背景画像の上にそのまま乗る (派閥名を画像内に書かないので衝突なし)
   - cache buster bump → dev push

## 注意点

- 画像内に **テキスト・ラベル・コンパスを描かない** (これらは SVG overlay で動的描画)
- 派閥座標と地形がズレた場合、 マップ画像の生成ガチャを再回す (DALL-E は配置精度低、 2-3回試行推奨)
- 半透明 (opacity 0.85) で SVG装飾と馴染ませる、 完全 1.0 にすると派閥アイコンが見えづらくなる
- Step B 完了後、 既存 SVG装飾の整理を野沢さん確認のうえ判断
