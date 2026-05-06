# 派閥 BGM プロンプト — Prism Shrine (巫女連邦リーリエ)

巫女連邦リーリエ派閥の派閥テーマ BGM。 Suno AI 向け。 ルール7-14 (派閥キャラ ≥5 で BGM プロンプト必須) BLOCKER 防御。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-shrine.mp3`
> - **基調**: アップテンポ千年神楽 (BPM 120-135、 野沢さん指示 2026-05-06「派閥 BGM もなるべく速めのテンポが望ましい」 対応、 巫女の身体性・舞・呪術路線)
> - 章テーマ prism-promise (BPM 118 神聖儀式の上昇感+七色合唱の格調) と区別: 派閥 BGM は **巫女の舞・呪術・身体性** = 動的シャーマニズム
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める

---

## 楽曲コンセプト

巫女連邦リーリエ派閥の派閥音楽。 章 BGM (prism-promise) が「七座儀式の神聖な上昇感+七色合唱の格調」 を担うのに対し、 派閥 BGM は **巫女の身体性・舞・呪術** を表現する。 千年継承された神楽舞、 巫女がトランス状態で舞い続ける動的シャーマニズム、 言葉にならない呪文の女声 chant、 神楽鈴と拍子木の身体的リズム。 図鑑/相関図で巫女連邦のキャラを眺める時、 「儀式の参列者」 ではなく「舞う巫女そのもの」 の存在感が立ち上がる構成。

---

## 🎵 v1 — Up-tempo 千年神楽 (Mystic Shrine Dance、 BPM 125、 推奨基準)

- **基調**: 神楽鈴 + 拍子木 + 尺八ソロ + koto + biwa + 駆動的弦 + 巫女のささやき声合唱 (whispered/hummed chant、 言葉にならない呪文)
- **ムード**: 動的シャーマニズム + トランス感 + 千年継承の身体性 + 呪術的躍動
- **テンポ**: アップテンポ (BPM 120-135、 派閥 BGM 推奨 110-160 範囲、 神楽舞の身体的リズム)
- **構成**: 神楽鈴イントロ (空間に呪を切る) → 尺八ソロの呼びかけ → 拍子木+koto の身体的駆動開始 → 巫女のささやき声 chant 重なり → biwa+太鼓で舞の頂点 → 中盤 トランス的 ostinato → 終盤 神楽鈴の余韻で呪が解ける

### Suno AI プロンプト (Style)

```
Mystic shrine dance with up-tempo trance-shamanic ceremonial energy and millennium-deep
priestess body-rhythm. Featured instruments: kagura-suzu (sacred shrine bells)
shimmering throughout as the spiritual pulse, hyoshigi (wooden clappers) striking
sharp percussive accents on every off-beat like priestess footwork, eastern shakuhachi
flute solo as primary melodic voice (mystical-windy, calling-summoning tone with
breathy attacks), seven-string koto with driving rhythmic ostinato (sacred plucked
patterns repeating like ritual incantation), biwa with sharp accent strikes for
spell-casting moments, taiko drums (medium, NOT festival-loud) keeping a tribal
trance pulse, full strings ensemble with low driving forward motion (cello + viola
foundation), wordless whispered female chorus (priestess hum-chant, "shu-shu-shu",
"ah-ha-ah", spell-like syllables, NOT angelic — earthy and incantatory), occasional
solo female mezzo voice singing wordless melodic chant in mid-register (the head
priestess voice leading the trance).
Atmosphere: ancient shrine inner sanctuary at twilight, priestesses dancing the
millennium-old kagura with seven-color silk ribbons swirling in trance-like
synchronization, the air thick with incense smoke and the sound of paper talismans
fluttering, the dance never stopping for centuries, the priestesses' bodies moving
as one continuous prayer, the shrine bells ringing in time with their breath, the
boundary between human and divine blurring through movement, NOT a public festival
but the priestesses' private trance ritual passed mother-to-daughter for a thousand
years.
Emotional arc: shrine bells opening the spiritual space → shakuhachi summoning call
→ koto-hyoshigi driving rhythm enters with priestess footwork → whispered chorus
chant builds layered → biwa-taiko climax of trance dance → mid-section pure ostinato
trance → fade with shrine bells releasing the spell.
BPM 125, key D dorian with Phrygian color (mystical-shamanic flavor), 2:30 duration
target, instrumental with whispered female chorus chant only, fantasy game music
aesthetic, dynamic mystical-cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental + whispered female priestess chorus chanting wordless syllables, no spoken lyrics]
```

---

## メタ情報

- **対応シーン**: 巫女連邦リーリエ派閥のキャラを図鑑/相関図/キャラ詳細で表示する時の BGM
- **ストーリー使用**: 派閥 BGM (図鑑タブ/相関図/キャラ詳細モーダルで再生)、 章ストーリー再生中は章テーマ prism-promise が優先
- **コード参照**: `script.js` `BGM_LIST` の `id: 'shrine'` (BGM_LIST 既登録、 duration は アセット完成後 実値更新)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-shrine.mp3`

## 整合性 (outline + 章 BGM との差別化)

- 派閥のテーマ: 巫女連邦の **身体性・舞・呪術** (千年継承された神楽舞、 動的シャーマニズム)
- 章 BGM (prism-promise) との差別化:
  - prism-promise (BPM 118): 七座満つる**神聖儀式の上昇感**、 オーケストラ + 七色合唱 (angelic) + silver flute、 静的儀式の格調
  - prism-shrine (BPM 125): **巫女の舞・呪術・身体性**、 神楽鈴 + 拍子木 + 尺八 + koto + biwa + ささやき声 chant (incantatory)、 動的シャーマニズム
  - 楽器面の差別化: 章 = silver flute / orchestral strings / angelic choir、 派閥 = kagura-suzu / hyoshigi / shakuhachi solo / whispered chant
  - ムード面の差別化: 章 = 上昇 → 解放、 派閥 = トランス → 呪が解ける
- 既存派閥 BGM との整合: prism-aether (ゼノニア BPM 116) や prism-niflheim (ニーヴル BPM 112) と同等のアップテンポ、 巫女連邦は神楽舞ベースで独自路線
- 例外として 教会 (BPM 70 processional) / アクアシス (BPM 60 underwater current) は世界観必然で維持、 巫女連邦は **動的シャーマニズム = 速めデフォルト** が整合
- 千年血脈 (ヴィオレナ・イリス・S2C4 接続) は 「ささやき声 chant の継承」 で表現 (mother-to-daughter trance ritual)

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental + whispered female priestess chorus chanting wordless syllables]` → 生成 (2:30 instrumental)
2. 気に入ったテイクを採用版に
3. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-shrine.mp3` に保存
4. Claude:
   - work へ cp + duration 計測 (`bash scripts/measure_bgm.sh`)
   - `script.js` BGM_LIST の `id: 'shrine'` entry duration を実値に更新
   - cache buster bump → dev push (pre-push hook で Box auto-sync)

## 関連 memory

- `feedback_bgm_uptempo.md`: 派閥 BGM もなるべく速めのテンポ (野沢さん指示 2026-05-06)
- ルール7-14 (派閥 BGM ≥5キャラ): 巫女連邦は s1c6 で 20体追加 = ≥5 BLOCKER 化対象、 本ファイルで防御済
- 章 BGM との差別化方針: 「祭祀音楽感は章 BGM で作成済、 別角度のBGMがいいかも」 (野沢さん指示 2026-05-06) → 「巫女の身体性・舞・呪術」 路線で対応
