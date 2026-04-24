# Prismaera 画像プロンプト 共通テンプレート

各章の画像プロンプト(`s1c1.md` 等)で共通する要素を集約。章別プロンプトから参照して使う。

---

## 出力設定 (全キャラ共通)

- モデル: `gpt-image-1` (quality: high) / DALL·E 3 (HD)
- サイズ: `1024x1536` (縦長、全身立ち絵用)
- 保存先: `images/characters/season{N}/<tier>/<slug>.png`

## 著作権セーフ末尾 (全プロンプトに必須)

```
original character, no logos, no text, no watermark
```

---

## 背景プリセット (派閥別)

派閥ごとに背景の基調色・エフェクトを固定することで、世界観の一貫性を保つ。

| 軸 | 派閥 | 背景キーワード |
|---|---|---|
| 神性 | 観測者七座 / 白焔教会 | `clean starry night background with subtle aurora` / `holy cathedral stained glass light` |
| 神性 | 巫女連邦リーリエ (S1C6〜) | `pale jade shrine corridor with gentle golden dust` |
| 王権 | 紅翼皇家 | `crimson battlefield at dusk with cherry petals` |
| 王権 | 紫竜王国 | `violet dragon palace with coiled silhouettes` |
| 王権 | 龍国 | `imperial jade throne with golden lantern mist` |
| 王権 | 氷霊王国ニーヴル (S1C4〜) | `frozen tundra under pale blue moonlight` |
| 野生 | 月牙狼族 | `moonlit forest clearing with tall silver trees` |
| 野生 | 深緑樹海 | `deep emerald canopy with fireflies` |
| 野生 | 夜焔郷 | `lantern-lit bamboo alley with red paper charms` |
| 野生 | 海淵都市アクアシス (S1C2〜) | `deep underwater palace with bioluminescent coral` |
| 野生 | 古龍砂漠サハール (S1C3〜) | `golden dune under twin stars and ancient dragon statues` |
| 叡智 | 黒曜塔 | `obsidian library spiral with floating books` |
| 叡智 | 空挺城ゼノニア (S1C4〜) | `steampunk floating fortress sky with brass cogs` |
| 境界 | 銀霜王国 | `silver-frost throne hall at midnight` |
| 境界 | 星霊学院 | `starlit academy rooftop with constellations` |
| 境界 | 黒月衆ノクトス (S1C5〜) | `black crescent moon over cracked stone ruins` |
| 境界 | 異界の塔ザナド (S1C7) | `dimensional rift tower with swirling void` |

---

## ポーズ/ライティング プリセット

### tier別推奨

| tier | ポーズ | ライティング | 備考 |
|---|---|---|---|
| R | natural standing, gentle smile | soft daylight, balanced | 派手さ控えめ、学生/町人系 |
| SR | confident poised stance | cinematic rim lighting, soft | 装飾控えめ・印象に残る一手 |
| SSR | dynamic stance, facing forward | cinematic rim lighting + detailed linework | 武器/装飾を明確に |
| UR | heroic stance with aura | dramatic rim light + glowing accents | オーラ/背後エフェクト |
| LR | divine presence floating | full rainbow aura + scattering particles | 画面全体に光 |

**大事な統一ルール**: 同じ章内の R と UR で服装の情報量に極端な差をつけない(R=地味すぎ/UR=ゴテゴテすぎ、の反転禁止)。**キャラデザの格差は「装飾密度」ではなく「オーラ/ライティング/背景の派手さ」で表現する**こと。

### 表情差分
不要(Prismaeraは紙芝居UIで表情差分を使わない設計 — DESIGN.md §8.2参照)。

---

## 命名規則

- slug: 英小文字_区切り、ASCII のみ (`forest_elf_archer.png` / `draco_lancer.png`)
- ファイル名とscript.jsの`image` フィールドを一致させる
- `ssr_08_elf_archer.png` のように tier+連番+slug の形式推奨

---

## 章別プロンプトファイル

- [s1c1.md](s1c1.md) — Season 1 第1章 (30体、執筆済)
- s1c2.md — Season 1 第2章 (15体、今後追加予定)
- s1c3.md — Season 1 第3章 (10体、今後)
- ...
