# 派閥 BGM プロンプト — Prism Lullaby (銀霜王国)

銀霜王国派閥の派閥テーマ BGM。 Suno AI 向け。 ルール7-14 (派閥キャラ ≥5 で BGM プロンプト必須) BLOCKER 防御 (s1c5 公開済、 silver 9体所属で 既存負債解消)。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-lullaby.mp3`
> - **基調**: ミドルアップテンポ月夜祭 (BPM 120-128、 野沢さん指示 2026-05-06「楽しい寄り、 暗い感じは NG」 + 「派閥 BGM もなるべく速め」 対応)
> - 章テーマ prism-blackmoon (BPM 102 二重月対峙の劇性 + silver flute 高音 + void choir 重低音 + 二音階交差) と区別: 派閥 BGM は **銀霜国の月夜祭の温かい民の祭** = アコーディオン + 暖色 mid 音域 + 子守歌調歌姫
> - 楽曲は野沢さん側 Suno AI で生成予定、 mp3 受領後 BGM_LIST + sw.js PRECACHE 追加 + cache buster bump

---

## 楽曲コンセプト

銀霜王国の派閥音楽。 章 BGM (prism-blackmoon) が「二重月夜の対峙・分離儀式の劇性 + 観測者三柱の予言」 を担うのに対し、 派閥 BGM は **銀霜国の月夜祭** = 民の生活の祭の温かさを表現する (s1c5 1-3「銀霜の祭夜」 シーンそのまま)。 紙の三日月灯篭が雪上に丸い暖色の影を作り、 工房の娘が手を振り、 若い歌姫が古い子守歌調の祭夜の歌を慎ましく歌い、 銀霜の冷気の中にオレンジ色の灯火の温度がぽつぽつと灯る。 雪国でも温かい、 民の慎ましい祝祭。 図鑑/相関図で銀霜王国のキャラを眺める時、 「劇的な対峙」 ではなく「銀霜の街角の温かさ・歌姫の歌・灯篭の暖色」 が立ち上がる構成。

---

## 🎵 v1 — Warm Snow Festival Lullaby (BPM 122、 推奨基準)

- **基調**: アコーディオン + 銀の鈴 + warm flute (mid-low) + felted piano + cello + viola + 遠い violin + 子守歌調女声ソロ (歌姫) + 軽い hand-drum + triangle
- **ムード**: 雪国の月夜祭の温かさ + 慎ましい民の祝祭 + 子守歌調の余韻 + 紙の三日月灯篭の暖色
- **テンポ**: ミドルアップテンポ (BPM 120-128、 派閥 BGM 推奨 110-160 範囲、 雪を踏む足音と灯篭祭の活気の駆動感)
- **構成**: アコーディオン民俗イントロ → warm flute 暖色の呼びかけ → 子守歌調女声ソロ重なり → cello-piano 全弦の祝祭頂点 → 中盤 子守歌調の reprise → 銀の鈴と遠い violin の余韻

### Suno AI プロンプト (Style)

```
Warm snow-kingdom festival eve with mid-up-tempo gentle village-festival energy
and lullaby-like cradle warmth. Featured instruments:
- accordion (folk-village warmth, NOT mystical, NOT trance) carrying primary
  melodic motifs throughout
- silver bells and small jingling sleigh bells sparkling lightly throughout (snow-
  cold sparkle, bright not chilling)
- warm flute in mid-low register (paper-lantern orange tone, distinctly NOT
  silver-high register — to differentiate from the chapter BGM's high silver
  flute)
- felted grand piano (intimate, paper-lantern light) with light arpeggios
- cello and viola foundation (warm earthy chamber sound)
- distant single violin (NOT ensemble — like a faraway memory)
- solo female voice singing wordless lullaby-like vocalize (young songstress voice,
  modest cradle-song tone, NOT angelic-distant, NOT trance-whisper — earthy
  village-festival warmth)
- light hand-drum (small, gentle pulse like footsteps in snow)
- light triangle accents on chorus moments
Atmosphere: the silver-frost kingdom on a moonlit festival night, hundreds of paper
crescent-moon lanterns hanging along snow-dusted streets glowing warm orange,
market stalls bustling with laughter and snow-crunching footsteps, villagers
gathering in small groups under the lanterns, a young female songstress singing
an old lullaby-like festival song softly in a back alley (modest, not loud),
warm steam rising from food stalls into the cold air. The cold of the silver-
frost kingdom is real, but the warmth of the orange lanterns and the festival
crowd creates a tender contrast. NOT a grand royal banquet, NOT a trance ritual —
a humble village festival eve where ordinary people warm each other against the
snow.
Emotional arc: gentle accordion intro (paper lantern light flickering on snow) →
warm flute call (warmth in the cold) → wordless lullaby vocalize enters softly →
cello-piano foundation thickens with festival pulse → all instruments bloom warmly
at chorus (the village square at peak festival warmth) → mid-section gentle
reprise of lullaby in slightly higher register → fade with silver bells and a
single distant violin lingering.
BPM 122, key D major with Mixolydian color (warm folk-festival flavor, NOT minor
and NOT angelic-Lydian), 2:30 duration target, instrumental with solo female
songstress lullaby-like vocalize only, fantasy game music aesthetic, warm
cinematic lullaby-festival.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental + solo female songstress wordless lullaby-like vocalize, no spoken lyrics]
```

---

## メタ情報

- **対応シーン**: 銀霜王国派閥のキャラを図鑑/相関図/キャラ詳細で表示する時の BGM
- **ストーリー使用**: 派閥 BGM (図鑑タブ/相関図/キャラ詳細モーダルで再生)、 章ストーリー再生中は章テーマ prism-blackmoon が優先 (s1c5 4-1 黒月祭壇等の劇場面)
- **本文整合 (s1c5 1-3「銀霜の祭夜」)**: 「街は紙の三日月灯篭で隅々まで暖色に染まっていた」 「祭の屋台、 笑い声、 雪の上を踏む靴の音」 「銀霜の冷気の中にオレンジ色の灯火の温度」 「歌姫の声 古い子守歌のような曲調」 「月夜の静寂を傷つけないよう慎ましく歌っていた」
- **コード参照**: `script.js` `BGM_LIST` に `id: 'lullaby'` エントリ追加予定 (mp3 受領後)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-lullaby.mp3`

## 整合性 (outline + 章 BGM との差別化)

- 派閥のテーマ: 銀霜王国の **月夜祭の温かい民の祭・子守歌調の余韻・紙の三日月灯篭の暖色**
- 章 BGM (prism-blackmoon) との差別化:
  - prism-blackmoon (BPM 102): 二重月対峙の **劇性**、 silver flute (高音純粋) + void choir (重低音) + 二音階交差 + 分離儀式
  - prism-lullaby (BPM 122): **月夜祭の温かい民の祭**、 アコーディオン + warm flute (mid-low) + 子守歌調歌姫 + 暖色 mid 音域
  - 楽器面の差別化: 章 = silver flute 高音 / void choir 重低音 (二極) / 章固有 / 派閥 = アコーディオン / warm flute mid-low / cello / 子守歌調歌姫 (中音域 単極 暖色) / 民俗
  - ムード面の差別化: 章 = 二重月対峙 → 分離儀式 → 別れ (劇性) / 派閥 = 灯篭の暖色 → 民の活気 → 子守歌の余韻 (温かい民の祭)
  - 調性: 章 = 二音階交差 (silver/void 対立) / 派閥 = D major Mixolydian (温かい単一調)
- 既存派閥 BGM との整合: prism-niflheim (ニーヴル BPM 112) や prism-shrine (リーリエ BPM 128) と同等のミドルアップテンポ、 銀霜は「雪国の月夜祭」 で独自の温かさ
- 例外 派閥 BGM (教会 70 BPM processional / アクアシス 60 BPM underwater) は世界観必然で維持、 銀霜は **月夜祭 = ミドルアップテンポ** が整合
- s1c5 1-3 シーンの音楽化として 本文要素 (紙の三日月灯篭 / 工房の娘 / 若い歌姫の子守歌調 / 雪上の足音 / 銀霜の冷気 + オレンジ灯火の温度) を 全部 音楽要素に翻訳

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental + solo female songstress wordless lullaby-like vocalize]` → 生成 (2:30 instrumental)
2. 気に入ったテイクを採用版に
3. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-lullaby.mp3` に保存
4. Claude:
   - work へ cp + duration 計測 (`bash scripts/measure_bgm.sh`)
   - `script.js` BGM_LIST に新エントリ追加: `{ id: 'lullaby', label: '銀霜王国テーマ', desc: 'Prism Lullaby (銀霜の月夜祭)', category: 'faction', duration: 'mm:ss', file: '/media/audio/bgm/prism-lullaby.mp3' }`
   - `sw.js` PRECACHE_BGM 配列に `'/media/audio/bgm/prism-lullaby.mp3'` 追加
   - cache buster bump → dev push (pre-push hook で Box auto-sync)

## 関連 memory / ルール

- `feedback_bgm_uptempo.md`: 派閥 BGM もなるべく速めのテンポ + 既存負債は BGM_TEMPO_OK マーカーで OK
- ルール7-14 (派閥 BGM ≥5キャラ): 銀霜王国は s1c1-s1c5 で 9体所属 = ≥5 BLOCKER 化対象、 本ファイル + mp3 取込で防御
- 章 BGM との差別化方針 + 雰囲気指定: 「祭祀音楽感は章 BGM で作成済」 + 「楽しい寄り、 暗い感じは NG」 + 「仮面文化はシオンだけ」 + 「月夜祭はやっていた」 (野沢さん指示 2026-05-06) → s1c5 1-3「銀霜の祭夜」 シーンそのまま音楽化、 雪国の月夜祭の温かい民の祭路線で対応 (千年神楽 trance 路線・舞踏会・冬祭りオーケストラ路線は trial 後 reject)
