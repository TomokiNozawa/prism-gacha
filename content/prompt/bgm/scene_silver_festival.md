# シーン特化 BGM プロンプト — Prism Lullaby (銀霜国の月夜祭)

「その他」 カテゴリ (戦闘 BGM rift と同等の シーン特化テーマ)。 銀霜国の月夜祭 (s1c5 1-3「銀霜の祭夜」 シーン専用)。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-lullaby.mp3`
> - **カテゴリ**: `other` (BGM_LIST `category: 'other'`、 戦闘テーマ rift と並列のシーン特化、 派閥 BGM ではない)
> - **基調**: ミドルアップテンポ月夜祭 (BPM 120-128、 野沢さん指示 2026-05-06「楽しい寄り、 暗い感じは NG」 対応)
> - 章テーマ prism-blackmoon (BPM 102 二重月対峙の劇性) とは別軸、 章本文 1-3 月夜祭シーンの音楽そのもの
> - **派閥 BGM は別途**: 銀霜王国派閥 BGM (王国・騎士路線) は `faction_silver.md` で 別ファイル管理、 別曲 (野沢さん指示 2026-05-06「銀霜王国 BGM は王国/騎士のイメージで」)
> - 楽曲は野沢さん側 Suno AI で生成中、 mp3 受領後 BGM_LIST other カテゴリに追加 + sw.js PRECACHE 追加 + cache buster bump

---

## 楽曲コンセプト

銀霜国の月夜祭 シーン特化 BGM。 s1c5 1-3「銀霜の祭夜」 シーンそのままを音楽化。 紙の三日月灯篭が雪上に丸い暖色の影を作り、 工房の娘が手を振り、 若い歌姫が古い子守歌調の祭夜の歌を慎ましく歌い、 銀霜の冷気の中にオレンジ色の灯火の温度がぽつぽつと灯る。 雪国でも温かい、 民の慎ましい祝祭。

「その他」 カテゴリ配置の理由: 銀霜王国 **全体** を代表する派閥 BGM ではなく、 **特定シーン (月夜祭の夜)** 専用なので、 戦闘 BGM rift と同様の シーン特化テーマとして「その他」 に置く。 銀霜王国の派閥 BGM は王国・騎士のイメージで別途 `faction_silver.md` で制作。

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
[Instrumental]
```

> ⚠️ Suno AI の Lyrics 欄は `[Instrumental]` しか機能しない仕様 (野沢さん指示 2026-05-06)。 vocalize 指示は Style 側に既に明記済 (`solo female voice singing wordless lullaby-like vocalize`) ので、 そちら経由で反映される。

---

## メタ情報

- **対応シーン**: s1c5 第5章 1-3「銀霜の祭夜」 シーン専用 BGM (戦闘 rift と同等のシーン特化テーマ)
- **ストーリー使用**: ✅ s1c5 1-3 シーン再生中の専用 BGM、 BGMパネルから「その他」 カテゴリで選曲可能
- **本文整合 (s1c5 1-3「銀霜の祭夜」)**: 「街は紙の三日月灯篭で隅々まで暖色に染まっていた」 「祭の屋台、 笑い声、 雪の上を踏む靴の音」 「銀霜の冷気の中にオレンジ色の灯火の温度」 「歌姫の声 古い子守歌のような曲調」 「月夜の静寂を傷つけないよう慎ましく歌っていた」
- **コード参照**: `script.js` `BGM_LIST` に `id: 'lullaby'` (`category: 'other'`) エントリ追加予定 (mp3 受領後)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-lullaby.mp3`

## 整合性 (章 BGM + 派閥 BGM との差別化)

- シーン特化テーマ: 銀霜国の **月夜祭の温かい民の祭・子守歌調の余韻・紙の三日月灯篭の暖色**
- 章 BGM (prism-blackmoon) との差別化:
  - prism-blackmoon (BPM 102 章テーマ): 二重月対峙の **劇性**、 silver flute (高音純粋) + void choir (重低音) + 二音階交差 + 分離儀式 (4-1 等)
  - prism-lullaby (BPM 122 シーン特化): **月夜祭の温かい民の祭** (1-3 シーン専用)、 アコーディオン + warm flute (mid-low) + 子守歌調歌姫 + 暖色 mid 音域
  - 楽器面: 章 = silver flute 高音 / void choir 重低音 (二極) / 派閥 = アコーディオン / warm flute mid-low / cello / 子守歌調歌姫 (中音域 単極 暖色) / 民俗
  - ムード面: 章 = 二重月対峙 → 分離儀式 → 別れ (劇性) / シーン特化 = 灯篭の暖色 → 民の活気 → 子守歌の余韻 (温かい民の祭)
- 派閥 BGM (faction_silver.md、 王国/騎士路線、 別曲) との差別化:
  - 派閥 BGM = 銀霜王国 全体 (王城・近衛・銀霜王 ノヴァ・剣聖オリエル) を代表 (王国格調 + 騎士威風)
  - シーン特化 = 銀霜国の **特定夜 (月夜祭)** = 民の祭、 派閥 BGM ではない
- 「その他」 カテゴリ配置の利点: 戦闘 BGM rift と同様、 シーン特化テーマとして 図鑑等で派閥キャラ表示時に流れず、 本編 1-3 再生中のみ流れる (派閥 BGM 圏域汚染を避ける)

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (2:30 instrumental、 vocalize は Style 側で指示済)
2. 気に入ったテイクを採用版に
3. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-lullaby.mp3` に保存
4. Claude:
   - work へ cp + duration 計測 (`bash scripts/measure_bgm.sh`)
   - `script.js` BGM_LIST に新エントリ追加: `{ id: 'lullaby', label: '銀霜国 月夜祭', desc: 'Prism Lullaby (銀霜の月夜祭)', category: 'other', duration: 'mm:ss', file: '/media/audio/bgm/prism-lullaby.mp3' }`
   - **scene-specific 連動**: s1c5 シーン 1-3 再生中に prism-lullaby を 自動再生 する仕組み (将来検討)、 当面は BGMパネルから手動選曲
   - `sw.js` PRECACHE_BGM 配列に `'/media/audio/bgm/prism-lullaby.mp3'` 追加
   - cache buster bump → dev push (pre-push hook で Box auto-sync)

## 関連 memory / ルール

- `feedback_bgm_uptempo.md`: 既存負債 / 世界観必然なら BPM の柔軟適用 OK
- 派閥 BGM 7-14 とは別ルート: 銀霜王国 派閥 BGM は別途 `faction_silver.md` (王国/騎士路線) で対応
- 設計方針変更履歴 (野沢さん指示 2026-05-06):
  1. 「銀霜王国派閥 BGM」 として書いた D 案 月夜祭 → 野沢さん「銀霜王国の BGM じゃなくて 銀霜国の月夜祭の BGM だ」
  2. 月夜祭 prompt は 「その他」 カテゴリの シーン特化テーマに格下げ (本ファイル)
  3. 派閥 BGM faction_silver.md は 王国/騎士路線で別曲を 別途制作
