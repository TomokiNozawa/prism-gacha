# S1C4 章テーマBGM プロンプト — Prism Frost (凍空の鼓動)

第4章「凍土と空」 の章テーマBGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-frost.mp3`
> - **基調**: アップテンポ既定 (BPM 100-130、 `feedback_bgm_uptempo.md` 準拠) — 凍土の冷気を保ちつつ、 旅情と覇王の歩みを駆動感で表現
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める (`bash scripts/measure_bgm.sh`)

---

## 楽曲コンセプト

第4章のテーマ「**強者の頂は、 孤独を共に分かち合うことで初めて温かい**」 を反映。 凍土の広大さ、 空挺城の機械的荘厳さ、 二人の覇王の対峙と相互承認、 雪原で空を見上げる山場の余韻。 アルテミスの龍帝としての重みと、 ヒノオウとの戦友回想 (二十歳の戦場の若さ) を併せ持つ二層構造。

---

## 🎵 v1 — Up-tempo 北欧オーケストラ (BPM 118、 現行)

- **基調**: 北欧オーケストラ + 蒸気機械音 (steampunk accent)
- **ムード**: 凍土の冷気 + 覇王の重み + 戦友の温度 + 静寂の余韻
- **テンポ**: アップテンポ (BPM 110-125、 旅と歩みを表現)
- **構成**: 静かな氷霊の導入 → 旅路の主題 (mid-tempo) → 覇王対決 (盛り上がり) → 山場 (雪原の静寂、 一瞬テンポダウン) → 終結 (再駆動、 別れの高揚)

### Suno AI プロンプト (Style)

```
Nordic-fantasy orchestral with steampunk accents, mid-up-tempo emperor's journey theme,
forward-moving with cold majestic gravitas. Featured instruments: full orchestral strings
section (violins lead with soaring countermelody), french horn proclamations, low brass
swells, taiko-style timpani heartbeat rhythm, crystalline glockenspiel and chimes for ice
spirit ambience, distant wordless female choir vocalize (ethereal, oracle voice), soft
brass clockwork ticking accents (steampunk influence), cello sustains, harp prismatic
arpeggios, faint snow-shaker percussion.
Atmosphere: vast frozen tundra under pale blue moonlight, two solitary emperors finally
meeting as equals, the floating brass fortress city sailing through clouds, the prismatic
seven streams of the genso flowing across the cold night sky. Memory of a distant battle
where two young warriors stood back-to-back. Quiet companionship found in silence.
Emotional arc: cold solitude → epic journey → mutual recognition → silent kinship → renewed purpose.
BPM 118, key D minor with Aeolian and Dorian color (Nordic flavor),
3:00 duration target, instrumental only, fantasy game music aesthetic, cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

---

## メタ情報

- **対応シーン**: ストーリー第4章「凍土と空」 全体 (1-1〜エピローグ)
- **ストーリー使用**: ✅ ストーリー再生中 BGM、 BGMパネルから選曲可能
- **コード参照**: `script.js` `BGM_LIST` の章テーマセクション (s1c4 用エントリ追加予定)
- **対応シーン強調**: 山場 3-3 「雪原で空を見上げる」 でテンポダウンの余韻部分が活きる構造
- **保存先**: `~/Box/.../prismaera/assets/bgm/prism-frost.mp3` → `cp ~/prism-gacha-work/assets/bgm/prism-frost.mp3`

## 整合性 (outline 準拠)

- 章テーマ「強者の頂は、 孤独を共に分かち合うことで初めて温かい」 を mid-tempo の駆動 + 余韻の二層で表現
- 「ヒノオウ回想」 を memory モチーフ (distant wordless female choir vocalize) で示唆
- ゼノニア機械文明 (S2C3 前奏) を steampunk clockwork accent で軽く溶け込ませる (主役は凍土オーケストラ)
- ニーヴル氷霊は crystalline glockenspiel + chimes + ice spirit ambience で表現

## 生成手順

1. 上記 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (3:00 instrumental)
2. 気に入ったテイクを mp3 ダウンロード → `~/Box/.../prismaera/assets/bgm/prism-frost.mp3` に保存
3. Claude (notebook or desktop):
   - `cp ~/Box/.../prismaera/assets/bgm/prism-frost.mp3 ~/prism-gacha-work/assets/bgm/prism-frost.mp3`
   - `bash scripts/measure_bgm.sh` で duration 計測 (`mm:ss` 表記取得)
   - `script.js` `BGM_LIST` に新エントリ追加: `{ id: 'prism-frost', label: 'Prism Frost (凍空の鼓動)', desc: '第4章 凍土と空 章テーマ', duration: '3:00', file: '/assets/bgm/prism-frost.mp3' }`
   - cache buster bump → dev push
