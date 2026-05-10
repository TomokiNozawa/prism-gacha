# 派閥BGM プロンプト — Prism Aether (空挺城ゼノニア)

空挺城ゼノニア専用テーマBGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-aether.mp3`
> - **派閥BGM自動追加ルール 5人超え** (`reference_prism_gacha_repo.md`): ゼノニア所属キャラ 9体 (ヴァーレ UR / ガリオン SSR / ゼピル SSR / ハーニア SSR / ヴィン SR / ジン SR / ベル SR / ピピ R / ピット R) で **対象**
> - **基調**: アップテンポ既定 (BPM 100-130、 `feedback_bgm_uptempo.md` 準拠) — 蒸気と歯車の駆動感、 機械文明の威厳と工房の温度感
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める

---

## 楽曲コンセプト

空挺城ゼノニアの世界観: 雲海の上に浮かぶ蒸気要塞、 真鍮歯車と蒸気管が外殻を覆う、 機械工学+魔導の融合、 ヴァーレ女皇の知的な威厳、 ハーニア工房の温かい労働の音、 S2C3「沈黙の塔」 機械文明覚醒の前奏としての厚み。 単なる「機械的」 ではなく、 **機械の中に魂と文明の温度を宿す** 風格。

---

## 🎵 v1 — Up-tempo 蒸気オーケストラ (BPM 116、 現行)

- **基調**: 蒸気機械音 + 真鍮 brass + オーケストラ + 工房ハンマー音
- **ムード**: 機械文明の威厳 / 蒸気の駆動感 / 工房の生活音 / 知的な研究室の静謐
- **テンポ**: アップテンポ (BPM 110-125、 蒸気エンジンの鼓動に同期)
- **構成**: 蒸気駆動の導入 → 主題 (mid-tempo brass orchestral) → ヴァーレ女皇の威厳 (盛り上がり、 ホルン + 歯車音) → 工房の温度感 (アンビエント+ハンマー) → 余韻

### Suno AI プロンプト (Style)

```
Steampunk fantasy orchestral with brass clockwork accents, mid-up-tempo majestic theme
of a floating mechanical empire, regal yet warm with the heartbeat of industry. Featured
instruments: full orchestral brass section (french horns lead with bold proclamations,
trumpets in counterpoint), mechanical clockwork ticking percussion (brass cogs as rhythm),
steam-powered hisses as accents, taiko-style timpani for empress's footsteps, harp
prismatic arpeggios with metallic resonance, distant choir vocalize with ethereal awe
(industrial cathedral feel), low cello sustains, subtle workshop hammer rhythm in the
background (tink-tink-tink of craft), brass bells for chimes.
Atmosphere: massive brass-and-copper floating fortress city sailing above a sunset
cloudscape, glowing orange windows of countless workshops, the empress walking through
brass cathedral halls of her sky kingdom, the seven prismatic streams of the genso
refracting through stained-glass windows of the audience hall, the warm sound of
hundreds of artisans crafting at their forges far below. Both regal authority and
warm working life — the soul of an industrial civilization.
Emotional arc: industrial pulse → empress's procession → majestic flourish → warm workshop temperature → renewed momentum.
BPM 116, key F major with Mixolydian color (industrial-fantasy flavor),
2:50 duration target, instrumental only, fantasy game music aesthetic, cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

---

## メタ情報

- **対応シーン**: ストーリー第4章 ゼノニア滞在中 (3-1 空挺城外交、 ハーニア工房)、 BGMパネルから選曲可能
- **ストーリー使用**: ✅
- **コード参照**: `script.js` `BGM_LIST` 派閥セクション (s1c4 公開時に追加)
- **保存先**: `~/Box/.../prismaera/assets/bgm/prism-aether.mp3` → `cp ~/prism-gacha-work/assets/bgm/prism-aether.mp3`

## 整合性 (outline 準拠)

- 空挺城ゼノニア = `steampunk floating fortress sky with brass cogs` (`_common.md`) を音響的に翻訳
- ヴァーレ女皇「機械工学+魔導の融合」 → orchestral brass + clockwork percussion で industrial cathedral 感を表現
- ハーニア工房 (3-1 後半) → 背景の subtle workshop hammer rhythm で生活の温度
- ゼピル学者 → ethereal choir vocalize で知的な静謐
- S2C3「沈黙の塔」 機械文明覚醒の前奏 → brass clockwork が中心、 沈黙の塔のテーマと連結予定

## 生成手順

1. 上記 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (2:50 instrumental)
2. 気に入ったテイクを mp3 ダウンロード → `~/Box/.../prismaera/assets/bgm/prism-aether.mp3` に保存
3. Claude (notebook or desktop):
   - `cp ~/Box/.../prismaera/assets/bgm/prism-aether.mp3 ~/prism-gacha-work/assets/bgm/prism-aether.mp3`
   - `bash scripts/measure_bgm.sh` で duration 計測
   - `script.js` `BGM_LIST` に新エントリ追加: `{ id: 'prism-aether', label: 'Prism Aether (蒸気の鼓動)', desc: '空挺城ゼノニア 派閥テーマ', duration: '2:50', file: '/assets/bgm/prism-aether.mp3' }`
   - cache buster bump → dev push
