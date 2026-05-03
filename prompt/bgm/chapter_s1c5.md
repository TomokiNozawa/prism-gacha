# S1C5 章テーマBGM プロンプト — Prism Blackmoon (黒月の鼓動)

第5章「黒月の予兆」 の章テーマBGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-blackmoon.mp3`
> - **基調**: アップテンポ既定 (BPM 130-145、 `feedback_bgm_uptempo.md` 準拠) — 神秘+決意の二音階、 銀の月と黒の月の対比を駆動感で表現
> - **試聴用 v2**: BPM 180 急速版 (野沢さん指示 2026-05-03 「もっとテンポ早くても良ければ 180 とか一回聞いてみたい」)。 v1 と v2 を生成して比較、 世界観次第で採用判断
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める (`bash scripts/measure_bgm.sh`)

---

## 楽曲コンセプト

第5章のテーマ「**自分の中の影を見つめ、 抱きしめてから手放す**」 を反映。 銀霜の二重月夜、 仮面の下の二つの自分の対峙、 影と光の織物文化、 分離の儀式。 銀の純粋な高音 (silver) と黒の沈んだ重音 (void) が交差しながら最終的に「光の側」 だけが残る構造。 シオンの過去の罪 (イザベルの姉) の記憶と、 「次こそ守る」 未来への決意を併せ持つ二層構造。

---

## 🎵 v1 — Up-tempo 二重月夜 (BPM 138、 推奨基準)

- **基調**: 神秘的なオーケストラ + コーラス + シンセパッド (光と影の二音階表現)
- **ムード**: 月夜の静謐 + 仮面の下の決意 + 影の蠢き + 別離の余韻
- **テンポ**: アップテンポ (BPM 130-145、 神秘性を保ちつつ駆動感)
- **構成**: 静謐な銀の月導入 (silver flute) → 黒月の予兆侵入 (低弦+void choir) → 山場 (二重月の対峙、 二音階交差) → 分離の儀式 (高揚) → 別れの夜明け (光の側だけ残る浄化)

### Suno AI プロンプト (Style)

```
Mystical-fantasy orchestral with dual-tone shadow-and-light theme, mid-up-tempo
prophetic ritual theme, forward-moving with sacred gravitas and emotional resonance.
Featured instruments: ethereal silver flute and crystalline glockenspiel for the silver
moon side (pure high register), low cello drones and contrabass with subtle void
distortion for the black moon side (deep low register), two contrasting choir layers —
soft pure female choir vocalize (oracle voice, silver moonlight) versus deep wordless
male choir vocalize (void, shadow side) — orchestral strings section building from quiet
suspense to dramatic climax, distant tubular bells like distant temple chimes, harp
prismatic arpeggios, taiko-style heartbeat percussion (slow at first, accelerating into
the ritual climax), faint music-box motif (memory of past sins), violin solo for the
moment of mask removal.
Atmosphere: silver-frost kingdom under a dual moon (pure silver and void black hanging
side by side), a masked knight walking the festival streets at midnight, the dark
crescent moon grove of the Black Moon Sect, the bioluminescent underground city of Liora
where shadow and light are woven into tapestries, the sacred dual-moon shrine altar where
a silver mirror reflects two moons simultaneously, the moment of separation where one
self walks away into the dawn while the other stays. The seven prismatic streams of the
genso flowing softly across the night sky.
Emotional arc: silent contemplation → looming dread → recognition of inner shadow →
sacred resolve → ritual climax → quiet release → hopeful dawn.
BPM 138, key F# minor with Phrygian and Aeolian color (sacred mystic flavor),
3:00 duration target, instrumental only, fantasy game music aesthetic, cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

---

## 🎵 v2 — Up-tempo 急速ロック版 試聴用 (BPM 180、 野沢さん試聴指示)

野沢さん 2026-05-03 「もっとテンポ早くても良ければ 180 とか一回聞いてみたい。 世界観が崩れるなら辞めてください」 の試聴用バリアント。 v1 (BPM 138) と比較して採用判断。

- **基調**: 急速メタル+オーケストラハイブリッド (近年のFantasyゲームBGMでよくある加速調、 例: Genshin Impact 戦闘曲、 Bayonetta 等)
- **ムード**: 緊迫感 + 神聖な疾走感 + 黒月の躍動 + 儀式の高揚
- **構成**: 急速導入 (driving strings) → 黒月の侵入 (heavy guitar/percussion) → 二重月対峙 (orchestral hits + 急速合唱) → 儀式高揚 (持続) → 終結 (急速解放)

### Suno AI プロンプト (Style v2)

```
High-energy mystical-fantasy orchestral-rock fusion with dual-tone shadow-and-light theme,
fast-tempo prophetic ritual battle theme, aggressively forward-moving with epic urgency.
Featured instruments: driving electric strings (cello and viola sections at full tempo),
intense double-bass pedal kick drums and rapid taiko percussion as heartbeat foundation,
soaring solo violin lead carrying the silver moon melody at fast tempo, distorted electric
guitar power chords and palm-muted rhythm for the black moon side, dual contrasting choir
layers — fast staccato pure female choir 'ah-ah-ah' rhythm (silver, sacred) versus deep
guttural male choir chant (void, shadow) — orchestral brass section punctuating with
sharp accents, synth pad swells layered underneath, frantic harp arpeggios, tubular bells
for sacred moments, music-box motif briefly inserted as memory contrast.
Atmosphere: same dual-moon silver-frost kingdom setting as v1 but reimagined as a frantic
ritual race against time, the masked knight running through festival streets, the void
cracks spreading rapidly through the air, the sacred altar reaching its climactic moment
of separation under accelerating heartbeat.
Emotional arc: tense awakening → racing dread → frantic confrontation → sacred climax → 
breakthrough release → driving dawn.
BPM 180, key F# minor with Phrygian and Aeolian color (sacred mystic flavor with rock
intensity), 3:00 duration target, instrumental only, fantasy game music aesthetic,
cinematic with rock energy.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

**v1 vs v2 採否判定基準** (野沢さん試聴後):
- v1 (BPM 138) → 神秘性・荘厳さ重視、 儀式の重みが伝わる、 「自分の中の影を見つめる」 のテーマに合う
- v2 (BPM 180) → 駆動感・緊迫感、 戦闘級のBGMだが、 章の山場が「祭壇の儀式」 (静的なシーン) なので 世界観が崩れるリスクあり
- 推奨: **v1 採用** (BPM 138 が章テーマと整合)、 v2 は将来「黒月決戦 S1C7 戦闘 BGM」 の参考に転用可

---

## メタ情報

- **対応シーン**: ストーリー第5章「黒月の予兆」 全体 (プロローグ〜エピローグ)
- **ストーリー使用**: ✅ ストーリー再生中 BGM、 BGMパネルから選曲可能
- **コード参照**: `script.js` `BGM_LIST` の章テーマセクション (s1c5 用エントリ追加予定)
- **対応シーン強調**: 山場 4-1「分離の儀式」 で v1 の二重月対峙 (二音階交差) が活きる構造、 4-2「別れの夜明け」 で「光の側だけ残る浄化」 で章を結ぶ
- **保存先**: `~/Box/.../prismaera/assets/bgm/prism-blackmoon.mp3` → `cp ~/prism-gacha-work/assets/bgm/prism-blackmoon.mp3`

## 整合性 (outline 準拠)

- 章テーマ「自分の中の影を見つめ、 抱きしめてから手放す」 を 銀+黒の二音階対立 → 統合 → 解放 の三段構成で表現
- 「シオンの過去の罪 (イザベルの姉)」 を music-box motif (記憶モチーフ) で軽く差し込み
- 黒月衆ノクトス (S1C7 への伏線) を low cello drone + void choir で軽く溶け込ませる (主役は分離儀式の祭壇音楽)
- 地底市リオラ (S2C5 への伏線) を bioluminescent crystal harp arpeggio + 二音階の織物で表現

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (3:00 instrumental) → 気に入ったテイクを v1 候補に
2. 同様に v2 Style プロンプトで BPM 180 急速版を生成 → 野沢さん試聴
3. v1/v2 を野沢さん比較聴取 → 採用版決定
4. mp3 ダウンロード → `~/Box/.../prismaera/assets/bgm/prism-blackmoon.mp3` に保存
5. Claude (notebook or desktop):
   - `cp ~/Box/.../prismaera/assets/bgm/prism-blackmoon.mp3 ~/prism-gacha-work/assets/bgm/prism-blackmoon.mp3`
   - `bash scripts/measure_bgm.sh` で duration 計測 (`mm:ss` 表記取得)
   - `script.js` `BGM_LIST` に新エントリ追加: `{ id: 'prism-blackmoon', label: 'Prism Blackmoon (黒月の鼓動)', desc: '第5章 黒月の予兆 章テーマ', duration: '3:00', file: '/assets/bgm/prism-blackmoon.mp3' }`
   - `sw.js` の `PRECACHE_BGM` 配列にも `'/assets/bgm/prism-blackmoon.mp3'` を追加 (ルール7-13)
   - cache buster bump → dev push
