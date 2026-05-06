# 派閥BGM プロンプト — Prism Niflheim (氷霊王国ニーヴル)

氷霊王国ニーヴル専用テーマBGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-niflheim.mp3`
> - **派閥BGM自動追加ルール 5人超え** (`reference_prism_gacha_repo.md`): ニーヴル所属キャラ 6体 (グレイル UR / リオネ SSR / ユーリス SSR / イズン SR / シエラ SR / アルク R) で **対象**
> - **基調**: アップテンポ既定 (BPM 100-130、 `feedback_bgm_uptempo.md` 準拠) — 凍土の冷気を保ちつつ、 氷霊王国の威厳と神秘を駆動感で表現
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める

---

## 楽曲コンセプト

氷霊王国ニーヴルの世界観: 凍土の中に立つ氷の宮殿、 古代氷霊の血を継ぐ氷帝グレイルの威厳、 凍り付いた予言の神殿、 氷霊が灯篭となって謁見の間を彩る神秘。 単なる「冷たい」 ではなく、 **氷の中に神聖さと古代の知恵を宿す** 風格。

---

## 🎵 v1 — Up-tempo 氷霊オーケストラ (BPM 112、 現行)

- **基調**: 北欧 + 神聖オーケストラ + 氷霊の鈴 + 氷霊コーラス
- **ムード**: 凍土の威厳 / 氷霊の神秘 / 古代血脈の重み / 静謐な強さ
- **テンポ**: アップテンポ (BPM 105-120、 凍土を歩む覇王の歩み)
- **構成**: 氷霊コーラスの導入 → 主題 (mid-tempo 北欧オーケストラ) → 氷帝の威厳 (盛り上がり、 ホルン + 鈴) → 余韻

### Suno AI プロンプト (Style)

```
Nordic ice-spirit fantasy orchestral, mid-up-tempo majestic theme of an ancient ice
kingdom, sacred and ethereal yet driving forward. Featured instruments: full orchestral
strings section (violins lead with crystalline countermelody), ethereal wordless female
choir vocalize (ice spirit voices, sacred and otherworldly), french horn proclamations,
crystalline glockenspiel and chimes (ice rune accents), small handbells (frost shrine
bells), low brass swells, taiko-style timpani for emperor's footsteps, harp prismatic
arpeggios cascading like falling ice crystals, soft snow-shaker percussion, distant
crystal-resonant chimes.
Atmosphere: vast crystalline ice palace audience hall under pale blue moonlight,
hovering ice-spirit lanterns floating through the chamber, ancient frost-blooded ice
emperor walking down the central aisle in solitary majesty, the prismatic seven streams
of the genso refracting through the ice ceiling into rainbow patterns on the floor,
sacred frozen prophecy chamber where the future is read in ice. Both regal authority
and mystical reverence.
Emotional arc: sacred stillness → emperor's procession → majestic recognition → quiet eternity.
BPM 112, key A minor with Aeolian and Phrygian color (Nordic-sacred flavor),
2:45 duration target, instrumental only, fantasy game music aesthetic, cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

---

## メタ情報

- **対応シーン**: ストーリー第4章 ニーヴル滞在中 (2-1 氷宮殿 / 2-2 一騎打ち導入 / 4-1 ユーリス予言)、 BGMパネルから選曲可能
- **ストーリー使用**: ✅
- **コード参照**: `script.js` `BGM_LIST` 派閥セクション (s1c4 公開時に追加)
- **保存先**: `~/Box/.../prismaera/assets/bgm/prism-niflheim.mp3` → `cp ~/prism-gacha-work/assets/bgm/prism-niflheim.mp3`

## 整合性 (outline 準拠)

- 氷霊王国ニーヴル = `frozen tundra under pale blue moonlight` (`_common.md`) を音響的に翻訳
- グレイル「古代氷霊の血を強く引く者」 → ethereal female choir で sacred ancient blood を表現
- ユーリス予言シーン (4-1) → handbells (frost shrine bells) + harp prismatic arpeggios で予言の啓示感
- 一騎打ち導入 (2-2 序盤) → emperor's footsteps の timpani で覇王対決の緊張へ橋渡し

## 生成手順

1. 上記 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (2:45 instrumental)
2. 気に入ったテイクを mp3 ダウンロード → `~/Box/.../prismaera/assets/bgm/prism-niflheim.mp3` に保存
3. Claude (notebook or desktop):
   - `cp ~/Box/.../prismaera/assets/bgm/prism-niflheim.mp3 ~/prism-gacha-work/assets/bgm/prism-niflheim.mp3`
   - `bash scripts/measure_bgm.sh` で duration 計測
   - `script.js` `BGM_LIST` に新エントリ追加: `{ id: 'prism-niflheim', label: 'Prism Niflheim (氷霊の歌)', desc: '氷霊王国ニーヴル 派閥テーマ', duration: '2:45', file: '/assets/bgm/prism-niflheim.mp3' }`
   - cache buster bump → dev push

---

## 参考: ゼノニア BGM について

空挺城ゼノニア所属キャラは 4体 (ヴァーレ UR / ガリオン SSR / ベル SR / ピピ R) で **5人未満** のため派閥BGM追加ルール対象外。 S2C3「沈黙の塔」 で機械文明関連キャラが追加されてから (もしくは野沢さん任意) 別ファイル `bgm/faction_zenonia.md` で追加検討。

candidate name (将来用): **Prism Aether (蒸気の鼓動)** — steampunk brass clockwork orchestral
