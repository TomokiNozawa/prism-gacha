# 派閥 BGM プロンプト — Prism Kagura (巫女連邦リーリエ)

巫女連邦リーリエ派閥の派閥テーマ BGM。 Suno AI 向け。 ルール7-14 (派閥キャラ ≥5 で BGM プロンプト必須) BLOCKER 防御 (s1c6 公開で 20体追加、 既存負債解消)。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-kagura.mp3`
> - **基調**: アップテンポ神事中心 (BPM 115-125、 野沢さん指示 2026-05-07「もっと巫女感強い派閥テーマ」 = 灯篭祭の祝祭ではなく 神楽中心の常態)
> - 章テーマ prism-promise (BPM 118 七座満つる神聖儀式、 angelic 七色合唱) と区別: 派閥 BGM は **巫女連邦の常態** (神楽中心、 千年継承神事の整然とした駆動) = earthy 巫女合唱 + 男声祝詞
> - シーン特化 prism-shrine (BPM 128 灯篭祭 = 民の祝祭、 `scene_lirie_festival.md` 別ファイル) と区別: こちらは **神楽中心の派閥常態** (祭ではなく日々の神事)
> - 楽曲は野沢さん側 Suno AI で生成予定、 mp3 受領後 BGM_LIST + sw.js PRECACHE 追加 + cache buster bump

---

## 楽曲コンセプト

巫女連邦リーリエ派閥の音楽。 章 BGM (Prism Promise) が「七座儀式の神聖な上昇感」 を、 シーン特化 (Prism Shrine) が「灯篭祭の祝祭の活気」 を担うのに対し、 派閥 BGM は **巫女連邦そのものの常態** = 神楽中心の千年継承神事を表現する。 七色聖塔の朝の祈祷、 巫女学院の神楽稽古、 神域の整然とした巫女の歩み、 主祭の祝詞、 神楽舞の駆動感、 千年伝統の格調。 図鑑/相関図で巫女連邦のキャラ (イリス・ヴィオレナ・ホムラ・ヴィーナ・リアラ・各層巫女) を眺める時、 「祭の祝祭」 ではなく「神事中心の千年神楽の整然とした神聖さ」 が立ち上がる構成。

---

## 🎵 v1 — Up-tempo Sacred Kagura (BPM 120、 推奨基準)

- **基調**: 尺八ソロ + koto + 神楽鈴 + 拍子木 + biwa + 軽い太鼓 + 巫女女声合唱 + 男声祝詞 (主祭)
- **ムード**: 千年神楽の整然とした神聖さ + 巫女の歩みの駆動 + 暗くない (D dorian → D major mixolydian、 古風だが明るい)
- **テンポ**: アップテンポ (BPM 115-125、 派閥 BGM 推奨 110-160 範囲、 神事の整然とした駆動感、 灯篭祭の祝祭駆動 BPM 128 より整然)
- **構成**: 神楽鈴 sparkle 冒頭 (神事の開始) → 尺八ソロ呼びかけ (主旋律) → koto 駆動的アルペジオ + 拍子木 (千年継承の流れ + 神楽の節) → 巫女女声合唱重なり (神楽歌) → 男声祝詞低音 (主祭) → biwa+太鼓で 神楽舞の頂点 → 余韻に神楽鈴 lingering

### Suno AI プロンプト (Style)

```
Sacred shrine federation kagura with up-tempo formal-ceremonial energy and
millennium-deep priestess solemn warmth. Featured instruments:
- shakuhachi flute as primary melodic voice (sacred-formal calling tone, NOT
  mystical-windy like trance, NOT bright like festival — pure prayer-call tone
  with breathy attacks for sacred summons)
- seven-string koto with driving rhythmic ostinato (sacred plucked patterns,
  millennium-tradition flow, NOT festival cascading sparkle — formal arpeggios
  with steady pulse)
- kagura-suzu (sacred shrine bells) sparkling in formal-sacred tone throughout
  (NOT festival jingle bells — solemn ceremonial sparkle)
- hyoshigi (wooden clappers) striking sharp accents on every formal beat
  (priestess-step rhythm, NOT festival dance footwork — formal procession steps)
- biwa with archaic accent strikes for ceremonial rhythm (millennium classical
  gravitas)
- light taiko drums (medium-small, ceremonial NOT festival-loud) keeping a
  formal-driving 4/4 sacred pulse
- pure female priestess choir vocalize (mid-low register, "ah-ha-ah" rhythmic
  vocalize, EARTHY pure NOT angelic-distant high, NOT trance-whisper, NOT
  bright festival "la-la-la" — sacred-prayer-chant solemn pure tone, like
  priestesses chanting kagura-uta during morning ritual)
- solo male voice singing wordless low-register norito-style chant (the head
  priest's prayer voice, deep solemn formal, occasional throughout — adds
  millennium-tradition gravitas)
- distant temple bell low gong accents (sacred temple atmosphere)
Atmosphere: the seven-color sacred tower of the shrine federation Lirie at the
sacred dawn ritual, the inner sanctuary of the central temple where priestesses
walk in formal ceremonial procession with seven-color silk vestments, the
millennium-old kagura dance practiced daily by every priestess from apprentice
to high-priestess, the sacred chronicle hall where Violena recites the
thousand-year prayer, the prayer tower under the moon where Iris kneels in
nightly devotion, the head priest reciting the ancient norito at the shrine's
heart. NOT a festival, NOT a trance — the EVERYDAY sacred state of the shrine
federation, the millennium tradition flowing through every formal step, the
solemn proud-sacred routine that is the daily life of being a priestess of
Lirie.
Emotional arc: kagura-suzu sacred-bells opening (sacred space awakening) →
shakuhachi solo prayer-call summon (priestess voice of Lirie) → koto-hyoshigi
driving rhythm with formal ceremonial steps → priestess earthy chorus vocalize
builds in formal-pure tone → male norito chant low gravitas adds → biwa-taiko
formal climax of sacred kagura procession → mid-section pure formal ostinato
→ fade with kagura-suzu sacred bells lingering and a single distant temple
gong.
BPM 120, key D dorian shifting to D major Mixolydian (sacred-archaic flavor
resolving to formal-bright), 2:30 duration target, instrumental with female
priestess earthy chorus and male norito chant only, fantasy game music
aesthetic, dynamic sacred-cinematic ceremonial.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

> ⚠️ Suno AI の Lyrics 欄は `[Instrumental]` しか機能しない仕様。 vocalize 指示は Style 側に既に明記済 (`pure female priestess earthy choir vocalize "ah-ha-ah"` + `solo male voice norito-style chant`) ので、 そちら経由で反映される。

---

## メタ情報

- **対応シーン**: 巫女連邦リーリエ派閥のキャラを図鑑/相関図/キャラ詳細で表示する時の派閥 BGM
- **ストーリー使用**: 派閥 BGM (図鑑タブ/相関図/キャラ詳細モーダルで再生)、 章ストーリー再生中は章テーマ prism-promise が優先 (s1c6 4-1 七座儀式等)、 1-2 灯篭祭シーンでは prism-shrine が優先
- **本文整合 (s1c6 神事シーン群)**: 「中央神殿の聖堂——翡翠色の柱が二列に並ぶ、 静謐なる聖域」 (2-1) / 「千年伝承の間——古文書+壁画」 (2-2) / 「月夜の祈祷の塔」 (2-3) / 「主祭リアラ——巫女連邦の儀典官」 (4-1) / 「七色の灯篭の杖を両手で支える」 (神事の所作)
- **コード参照**: `script.js` `BGM_LIST` に `id: 'kagura'` (`category: 'faction'`) エントリ追加予定 (mp3 受領後)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-kagura.mp3`

## 整合性 (章 BGM + シーン特化 BGM との差別化)

- 派閥のテーマ: 巫女連邦の **常態 = 神楽中心の千年継承神事の整然とした神聖さ** (祭ではなく日々の神事)
- 章 BGM (prism-promise) との差別化:
  - prism-promise (BPM 118): 七座満つる **神聖儀式の上昇感** + silver flute + angelic 七色合唱 (天上的)
  - prism-kagura (BPM 120): **神楽中心の常態** + shakuhachi 主旋律 + earthy 巫女合唱 + 男声祝詞 (地上的)
  - 楽器面の差別化: 章 = silver flute 高音 / angelic distant choir / orchestral strings (天上向け) / 派閥 = shakuhachi 主旋律 / earthy priestess chorus / 男声 norito / koto + biwa + 拍子木 (地上の神事)
  - ムード面の差別化: 章 = 上昇 → 解放 (静的儀式) / 派閥 = 整然駆動 → 神楽の持続 (動的常態)
  - 調性: 章 = D major Lydian/Mixolydian (天上の神聖な上昇) / 派閥 = D dorian → D major Mixolydian (地上の archaic-formal、 古風から明るくへ解決)
- シーン特化 (prism-shrine、 灯篭祭) との差別化:
  - prism-shrine (BPM 128 シーン特化): 民の祝祭の活気 + 神楽鈴 festival sparkle + bright "la-la-la" 合唱 (祝祭の祭)
  - prism-kagura (BPM 120 派閥): 神楽中心の常態 + 神楽鈴 sacred-formal sparkle + earthy "ah-ha-ah" 合唱 + 男声祝詞 (神事の常態)
  - 楽器面: シーン特化 = 神楽鈴 festival jingle / bright cheerful chorus / shakuhachi cheerful / 派閥 = 神楽鈴 sacred-formal / earthy priestess chorus / shakuhachi prayer-call / 男声 norito
  - ムード面: シーン特化 = 灯篭祭の祝祭 (祭) / 派閥 = 神事の常態 (日々)
- 既存派閥 BGM との整合: prism-niflheim (ニーヴル BPM 112) や prism-aether (ゼノニア BPM 116) と同等のミドルアップテンポ、 巫女連邦は「神楽の連邦」 で独自の archaic-formal 路線
- 例外 派閥 BGM (教会 70 BPM processional / アクアシス 60 BPM underwater) は世界観必然で維持、 巫女連邦は **神楽中心の常態 = ミドルアップテンポ** が整合
- 巫女連邦の世界観要素を全て音楽要素に翻訳: 七色聖塔 (神楽鈴 sacred sparkle) / 中央神殿の聖堂 (orchestral strings 厚さ) / 千年伝承の間 (biwa 古典格調) / 祈祷の塔 (shakuhachi 主旋律) / 主祭リアラの祝詞 (男声 norito) / 巫女学院の修行 (koto 駆動的) / 神楽舞の節 (拍子木) / 朝の祈祷 (神楽鈴 sacred opening)

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (2:30 instrumental、 vocalize は Style 側で指示済)
2. 気に入ったテイクを採用版に
3. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-kagura.mp3` に保存
4. Claude:
   - work へ cp + duration 計測 (`bash scripts/measure_bgm.sh`)
   - `script.js` BGM_LIST に新エントリ追加: `{ id: 'kagura', label: '巫女連邦テーマ', desc: 'Prism Kagura (神楽の連邦)', category: 'faction', duration: 'mm:ss', file: '/media/audio/bgm/prism-kagura.mp3' }`
   - `sw.js` PRECACHE_BGM 配列に `'/media/audio/bgm/prism-kagura.mp3'` 追加
   - cache buster bump → dev push (pre-push hook で Box auto-sync)

## 関連 memory / ルール

- `feedback_bgm_uptempo.md`: 派閥 BGM もなるべく速めのテンポ (野沢さん指示 2026-05-06)
- ルール7-14 (派閥 BGM ≥5キャラ): 巫女連邦は s1c6 で 20体追加 = ≥5 BLOCKER 化対象、 本ファイル + mp3 取込で防御
- 設計方針変更履歴 (野沢さん指示 2026-05-06〜2026-05-07):
  1. 当初 派閥 BGM として制作した 灯篭祭 joyful kagura (Prism Shrine BPM 128) → 野沢さん「派閥 BGM じゃなくて 灯篭祭の BGM っぽい、 もっと巫女感強いのを派閥テーマに」
  2. 灯篭祭 prompt は `scene_lirie_festival.md` (other カテゴリ シーン特化) に隔離、 BGM_LIST id='shrine' は category 'faction' → 'other' に変更
  3. 派閥 BGM は本ファイル `faction_lirie.md` で 神楽中心 (Prism Kagura) を新規制作
- 章 BGM との差別化方針: 章 = 七座儀式の上昇感 angelic / 派閥 = 神楽中心の常態 earthy + 男声祝詞 (天上 vs 地上)
