# 派閥 BGM プロンプト — Prism Frostcrown (銀霜王国)

銀霜王国派閥の派閥テーマ BGM。 Suno AI 向け。 ルール7-14 (派閥キャラ ≥5 で BGM プロンプト必須) BLOCKER 防御 (s1c5 公開済、 silver 9体所属で 既存負債解消)。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-frostcrown.mp3`
> - **基調**: アップテンポ王国/騎士 (BPM 125-135、 野沢さん指示 2026-05-06「銀霜王国 BGM は王国とか騎士のイメージで」 対応)
> - 章テーマ prism-blackmoon (BPM 102 二重月対峙の劇性 = シオン内面) と区別: 派閥 BGM は **銀霜王国の威風・騎士の機能美** (外面)
> - シーン特化 prism-lullaby (BPM 122 月夜祭 = 民の祭、 `scene_silver_festival.md` 別ファイル) と区別: こちらは **王宮・近衛・王の威厳**
> - 楽曲は野沢さん側 Suno AI で生成予定、 mp3 受領後 BGM_LIST + sw.js PRECACHE 追加 + cache buster bump

---

## 楽曲コンセプト

銀霜王国派閥の音楽。 章 BGM (Prism Blackmoon) が「シオンの仮面と内面の対峙」 を、 シーン特化 (Prism Lullaby) が「銀霜国の月夜祭・民の祭の温かさ」 を担うのに対し、 派閥 BGM は **銀霜王国そのもの** = 王宮の格調・騎士の機能美・若き王ノヴァの覇気・銀霜近衛の威風 を表現する。 月光謁見の間の royal brass fanfare、 騎士団の進軍リズム、 千年銀霜国の伝統 (仮面騎士の作法・銀霜剣術師範オリエルの系譜)、 銀霜の冷気の中の王宮の威厳。 図鑑/相関図で銀霜王国のキャラ (ノヴァ・オリエル・シオン・ルミナ・セレン・アスター・ラピス・銀霜民) を眺める時、 「王国の誇り高い格調と騎士の駆動感」 が立ち上がる構成。

---

## 🎵 v1 — Up-tempo Royal Vanguard (BPM 130、 推奨基準)

- **基調**: royal brass fanfare + ティンパニ + 軍鼓 + 駆動的弦楽 + harpsichord + 銀の鈴 + martial mixed choir
- **ムード**: 王国の威厳 + 騎士の機能美 + 若き王ノヴァの覇気 + 銀霜の冷気を保つ駆動感 (暗くない、 誇り高い)
- **テンポ**: アップテンポ (BPM 125-135、 派閥 BGM 推奨 110-160 範囲、 騎士団進軍の駆動感)
- **構成**: 銀の鈴 sparkle 冒頭 (銀霜の冷気) → royal brass fanfare (王の登場) → ティンパニ + 軍鼓 騎士進軍リズム → 弦 + harpsichord で王宮格調主題 → 山場 martial mixed choir (騎士の誓い) → 余韻 銀の鈴 lingering

### Suno AI プロンプト (Style)

```
Royal-fantasy frost kingdom martial theme with up-tempo proud-driving energy and
silver-frost majestic warmth. Featured instruments:
- royal brass fanfare (trumpets, French horns, trombones) carrying primary
  ceremonial-heroic motifs throughout (NOT bright festival, NOT contemplative —
  proud royal-court trumpets with formal-martial gravitas)
- timpani drums (large, ceremonial) keeping a strong driving 4/4 royal pulse
- military snare drums (rolling accents on strong beats, knight regiment march
  rhythm)
- full strings ensemble (cello + viola + violin) with thick driving forward motion
  (NOT chamber-intimate — orchestral royal hall scale)
- harpsichord (royal-court formality, ornamental flourishes between brass calls,
  archaic-formal tone)
- silver bells and glockenspiel sparkling lightly throughout (frost-cold sparkle,
  silver-frost kingdom flavor, NOT festival jingle bells)
- mixed choir (male + female mid-low register, "ah-ah-ah" "ho-ho-ho" rhythmic
  vocalize, NOT angelic-distant high — earthy martial-formal knight oath voice,
  resolute and proud)
- distant bass drone (cold mountain wind, silver-frost kingdom backdrop)
Atmosphere: the silver-frost royal palace under moonlight, the high vaulted
moonlight throne hall with banners of the silver-frost crown hanging from
crystalline pillars, the young king Nova (twenty-one, half a year into reign)
sitting on the silver throne with the weight of the crown pressing down, the
masked knight Sion (the Silent Shield) standing in formal salute, the upper
sword master Oliel (Sion's teacher) silent at the corner pillar, the silver
royal guard in their northern winter formation marching through the palace
courtyard with frost-cold breath rising in the moonlight, the millennium-old
silver-knight tradition flowing through every formal step. NOT a festival,
NOT a banquet — a proud royal court in driving formal motion, the dignity of
a frost kingdom holding itself together against the cold.
Emotional arc: silver bells frost-sparkle opening (cold royal hall awakening) →
royal brass fanfare proud entry (king's procession) → timpani + military snare
driving rhythm enters with knight march pulse → harpsichord royal-court formal
theme weaves between brass calls → strings thicken with proud orchestral
foundation → climax with martial mixed choir knight oath ("ah-ah-ah" rhythmic
proud vocalize) → fade with silver bells lingering and a single distant horn
call.
BPM 130, key D major with Mixolydian color (proud royal-formal flavor, short
D minor passages briefly inserted for silver-frost cold contrast), 2:30 duration
target, instrumental with martial mixed choir vocalize only, fantasy game music
aesthetic, dynamic proud-cinematic royal.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental + martial mixed choir vocalize "ah-ah-ah" "ho-ho-ho" rhythmic only, no spoken lyrics]
```

---

## メタ情報

- **対応シーン**: 銀霜王国派閥のキャラを図鑑/相関図/キャラ詳細で表示する時の派閥 BGM
- **ストーリー使用**: 派閥 BGM (図鑑タブ/相関図/キャラ詳細モーダルで再生)、 章ストーリー再生中は章テーマ prism-blackmoon が優先 (s1c5 4-1 黒月祭壇等)、 1-3 月夜祭シーンでは prism-lullaby が優先
- **本文整合 (s1c5 1-1 月光謁見の間 + 銀霜近衛セレン市街警備)**: 「銀霜王宮の月光謁見の間」 「玉座には銀霜王ノヴァが座っている」 「即位から半年。 玉座の重みに耐え始めた若き王」 「沈黙の盾 (シオン)」 「銀霜剣術の上席師範オリエル」 「仮面騎士の作法」 「銀霜近衛のセレン (銀の髪を短く整えた、 真面目な若き後輩)」 「王宮の北の塔」
- **コード参照**: `script.js` `BGM_LIST` に `id: 'frostcrown'` (`category: 'faction'`) エントリ追加予定 (mp3 受領後)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-frostcrown.mp3`

## 整合性 (章 BGM + シーン特化 BGM との差別化)

- 派閥のテーマ: 銀霜王国の **王国の威厳・騎士の機能美・若き王ノヴァの覇気・銀霜近衛の威風** (外面)
- 章 BGM (prism-blackmoon) との差別化:
  - prism-blackmoon (BPM 102): 二重月対峙の **劇性** + シオン内面 + silver flute (高音純粋) + void choir (重低音) + 二音階交差
  - prism-frostcrown (BPM 130): **王国格調・騎士威風** + royal brass fanfare + ティンパニ + harpsichord + martial choir
  - 楽器面の差別化: 章 = silver flute 高音 / void choir 重低音 / 派閥 = royal brass / timpani / harpsichord / mixed choir mid-low (二極 vs 単極+格調)
  - ムード面の差別化: 章 = 仮面の対峙 → 分離儀式 (内面、 静的劇性) / 派閥 = 王国の進軍 → 騎士の誓い (外面、 動的威風)
- シーン特化 (prism-lullaby、 月夜祭) との差別化:
  - prism-lullaby (BPM 122 シーン特化): 民の祭の温かさ + アコーディオン + 子守歌調歌姫 (民の暖色)
  - prism-frostcrown (BPM 130 派閥): 王国の威厳 + royal brass + martial choir (王国の格調)
  - 楽器面: シーン特化 = アコーディオン / warm flute / 子守歌調歌姫 (民俗温かい中音域) / 派閥 = royal brass / timpani / harpsichord / martial choir (王国格調 brass 主体)
  - ムード面: シーン特化 = 民の祭 (内側民) / 派閥 = 王国威風 (外側王)
- 既存派閥 BGM との整合: prism-niflheim (ニーヴル BPM 112) と勢力近接性 (北方寒冷王国系)、 niflheim = 氷霊王国 mystic-orchestral / silver = 銀霜王国 royal-martial で 路線差別化
- 例外 派閥 BGM (教会 70 BPM processional / アクアシス 60 BPM underwater) は世界観必然で維持、 銀霜は **王国/騎士 = アップテンポ** が整合
- 銀霜王国の世界観要素を全て音楽要素に翻訳: 月光謁見の間 (royal brass) / 玉座 (timpani) / 王宮の北の塔 (distant horn) / 仮面騎士の作法 (harpsichord ornamental) / 銀霜近衛の進軍 (military snare) / 千年伝統の格調 (orchestral strings) / 銀霜の冷気 (silver bells + bass drone)

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental + martial mixed choir vocalize]` → 生成 (2:30 instrumental)
2. 気に入ったテイクを採用版に
3. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-frostcrown.mp3` に保存
4. Claude:
   - work へ cp + duration 計測 (`bash scripts/measure_bgm.sh`)
   - `script.js` BGM_LIST に新エントリ追加: `{ id: 'frostcrown', label: '銀霜王国テーマ', desc: 'Prism Frostcrown (銀霜王冠)', category: 'faction', duration: 'mm:ss', file: '/media/audio/bgm/prism-frostcrown.mp3' }`
   - `sw.js` PRECACHE_BGM 配列に `'/media/audio/bgm/prism-frostcrown.mp3'` 追加
   - cache buster bump → dev push (pre-push hook で Box auto-sync)

## 関連 memory / ルール

- `feedback_bgm_uptempo.md`: 派閥 BGM もなるべく速めのテンポ (野沢さん指示 2026-05-06)
- ルール7-14 (派閥 BGM ≥5キャラ): 銀霜王国は s1c1-s1c5 で 9体所属 = ≥5 BLOCKER 化対象、 本ファイル + mp3 取込で防御
- 設計方針変更履歴 (野沢さん指示 2026-05-06):
  1. 当初 月夜祭 D 案を 派閥 BGM として制作 → 野沢さん「銀霜王国の BGM じゃなくて 銀霜国の月夜祭の BGM だ」
  2. 月夜祭 prompt は `scene_silver_festival.md` (other カテゴリ シーン特化) に隔離
  3. 派閥 BGM は本ファイル `faction_silver.md` で 王国/騎士路線 (Prism Frostcrown) を新規制作
- 章 BGM との差別化方針: 章 = シオン内面 (劇性、 silver flute + void choir 二極) / 派閥 = 王国外面 (威風、 royal brass + timpani + martial choir 単極格調)
