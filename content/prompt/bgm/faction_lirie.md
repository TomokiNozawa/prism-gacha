# 派閥 BGM プロンプト — Prism Shrine (巫女連邦リーリエ)

巫女連邦リーリエ派閥の派閥テーマ BGM。 Suno AI 向け。 ルール7-14 (派閥キャラ ≥5 で BGM プロンプト必須) BLOCKER 防御。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-shrine.mp3`
> - **基調**: アップテンポ祝祭神楽 (BPM 125-135、 野沢さん指示 2026-05-06「派閥 BGM もなるべく速めのテンポが望ましい」 + 2026-05-06「楽しい感じがいい、 暗い感じは NG」 対応)
> - 章テーマ prism-promise (BPM 118 神聖儀式の上昇感+七色合唱の angelic 格調) と区別: 派閥 BGM は **巫女達の楽しい神楽舞・祝祭の活気** = 動的祝祭神楽
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める

---

## 楽曲コンセプト

巫女連邦リーリエ派閥の派閥音楽。 章 BGM (prism-promise) が「七座儀式の神聖な上昇感+七色合唱の厳粛な格調」 を担うのに対し、 派閥 BGM は **巫女達の楽しい神楽舞・祝祭の活気** を表現する。 朝の境内で巫女達が神楽を舞い、 七色の紙灯篭が日中の光に揺れ、 弟子達の笑い声と先達巫女の温かい指導が響く、 千年継承された生きた伝統の喜び。 図鑑/相関図で巫女連邦のキャラを眺める時、 「重い厳粛さ」 ではなく「ここに居たくなる温かさと祝祭の高揚」 が立ち上がる構成。

---

## 🎵 v1 — Up-tempo 神楽の喜び (Joyful Kagura Festival、 BPM 128、 推奨基準)

- **基調**: 神楽鈴 + 拍子木 + 尺八 (cheerful) + koto (bright arpeggios) + 横笛 + 太鼓 + 明るい女声合唱 + glockenspiel sparkle
- **ムード**: 楽しい祝祭 + 巫女達の躍動 + 千年継承の温かい喜び + 朝の境内の活気
- **テンポ**: アップテンポ (BPM 125-135、 神楽舞の駆動感、 派閥 BGM 推奨 110-160 範囲内)
- **構成**: 朝の神楽鈴イントロ (sunlit sparkle) → 尺八の cheerful 呼びかけ → 拍子木+koto の駆動開始 → 明るい女声合唱重なり → biwa+太鼓で舞の頂点 → 中盤 楽しい ostinato → 終盤 神楽鈴の余韻で 笑顔の朝に戻る

### Suno AI プロンプト (Style)

```
Joyful eastern shrine festival dance with up-tempo cheerful kagura energy and
millennium-bright priestess joy. Featured instruments: kagura-suzu (sacred shrine
bells) ringing brightly throughout as cheerful sparkles, hyoshigi (wooden clappers)
striking light playful accents on every off-beat like priestess dance footwork,
eastern shakuhachi flute as primary melodic voice (bright cheerful tone, calling
for celebration NOT contemplation, energetic uplifting attacks), seven-string koto
with bright rapid arpeggios cascading like sunlight through seven-color paper
lanterns, biwa with sharp accent strikes for festival rhythm, taiko drums
(medium-large festival size) keeping a strong driving 4/4 festival pulse,
glockenspiel and small bells (rin) sparkling on every beat, light bamboo flute
(yokobue) trills for festive ornaments, full strings ensemble (cello + viola
+ violin) with driving forward motion, bright cheerful female choir vocalize
("la-la-la", "ah-ha-ah" on rhythmic accents, NOT angelic-distant — earthy joyful
priestess voice) lifting at chorus moments, harp prismatic arpeggios cascading
rapidly like seven-color paper lanterns flying skyward, occasional solo female
voice singing wordless joyful melodic line in mid-register (a cheerful head
priestess leading the dance celebration).
Atmosphere: eastern shrine federation Lirie central courtyard during a bright
morning festival, hundreds of seven-color paper lanterns hanging cheerfully in
the daylight, priestesses dancing the kagura with seven-color silk ribbons
swirling joyfully, the sound of children laughing and elderly priestesses
smiling, cherry-blossom-like seven-color petals scattering through bright air,
the central temple courtyard alive with festival drums and flute calls, the
dance is a celebration of life passed mother-to-daughter for a thousand years
— NOT trance, NOT twilight ritual, but joyful living tradition under sunlight.
Emotional arc: bright morning shrine bells opening the day → shakuhachi
cheerful summoning call → koto-hyoshigi driving rhythm with priestess footwork
→ joyful chorus vocalize building layered → biwa-taiko festival climax of
dance celebration → mid-section pure joyful ostinato → bright fade with shrine
bells lingering in sunlight.
BPM 128, key D major with Lydian and Mixolydian color (bright joyful celebratory
flavor), 2:30 duration target, instrumental with bright female chorus vocalize
only, fantasy game music aesthetic, energetic cheerful cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental + bright female priestess chorus vocalize "la-la-la" "ah-ha-ah", no spoken lyrics]
```

---

## メタ情報

- **対応シーン**: 巫女連邦リーリエ派閥のキャラを図鑑/相関図/キャラ詳細で表示する時の BGM
- **ストーリー使用**: 派閥 BGM (図鑑タブ/相関図/キャラ詳細モーダルで再生)、 章ストーリー再生中は章テーマ prism-promise が優先
- **コード参照**: `script.js` `BGM_LIST` の `id: 'shrine'` (BGM_LIST 既登録、 duration は アセット完成後 実値更新)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-shrine.mp3`

## 整合性 (outline + 章 BGM との差別化)

- 派閥のテーマ: 巫女連邦の **楽しい神楽舞・祝祭の活気・千年継承の喜び**
- 章 BGM (prism-promise) との差別化:
  - prism-promise (BPM 118): 七座満つる**神聖儀式の厳粛な上昇感**、 sacred-fantasy orchestral + angelic choir + silver flute、 静的儀式の格調、 prophetic ceremony
  - prism-shrine (BPM 128): **巫女達の楽しい神楽舞**、 kagura-suzu + hyoshigi + 明るい shakuhachi + bright koto + cheerful chorus、 動的祝祭、 joyful celebration
  - 楽器面の差別化: 章 = silver flute / orchestral strings / angelic choir (天上的)、 派閥 = 神楽鈴 / 拍子木 / shakuhachi cheerful / bright earthy chorus (地上的)
  - ムード面の差別化: 章 = 厳粛 → 上昇 → 解放 (静的)、 派閥 = 朝の活気 → 神楽駆動 → 笑顔の余韻 (動的)
  - 調性: 章 = D major + Lydian/Mixolydian (神聖な上昇)、 派閥 = D major + Lydian/Mixolydian (明るい祝祭) — 同じ key 系だが Mood の方向性が異なる (厳粛 vs 楽しい)
- 既存派閥 BGM との整合: prism-aether (ゼノニア BPM 116) や prism-niflheim (ニーヴル BPM 112) と同等以上のアップテンポ、 巫女連邦は神楽舞ベースで「明るい祝祭」 が独自性
- 例外として 教会 (BPM 70 processional) / アクアシス (BPM 60 underwater current) は世界観必然で維持、 巫女連邦は **明るい神楽舞 = 速めデフォルト** が整合
- 千年血脈 (ヴィオレナ・イリス・S2C4 接続) は 「mother-to-daughter で受け継がれる温かい伝承の喜び」 として bright chorus + solo voice で表現

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental + bright female priestess chorus vocalize]` → 生成 (2:30 instrumental)
2. 気に入ったテイクを採用版に
3. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-shrine.mp3` に保存
4. Claude:
   - work へ cp + duration 計測 (`bash scripts/measure_bgm.sh`)
   - `script.js` BGM_LIST の `id: 'shrine'` entry duration を実値に更新
   - cache buster bump → dev push (pre-push hook で Box auto-sync)

## 関連 memory

- `feedback_bgm_uptempo.md`: 派閥 BGM もなるべく速めのテンポ (野沢さん指示 2026-05-06)
- ルール7-14 (派閥 BGM ≥5キャラ): 巫女連邦は s1c6 で 20体追加 = ≥5 BLOCKER 化対象、 本ファイルで防御済
- 章 BGM との差別化方針 + 雰囲気指定: 「祭祀音楽感は章 BGM で作成済」 + 「楽しい感じがいい、 暗い感じは NG」 (野沢さん指示 2026-05-06) → 「巫女達の楽しい神楽舞・祝祭の活気」 路線で対応 (千年神楽 trance 路線は trial 後 reject)
