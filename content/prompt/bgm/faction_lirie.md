# 派閥 BGM プロンプト — Prism Shrine (巫女連邦リーリエ)

巫女連邦リーリエ派閥の派閥テーマ BGM。 Suno AI 向け。 ルール7-14 (派閥キャラ ≥5 で BGM プロンプト必須) BLOCKER 防御。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-shrine.mp3`
> - **基調**: アップテンポ (BPM 120-135、 野沢さん指示 2026-05-06「派閥 BGM もなるべく速めのテンポが望ましい」 対応、 灯篭祭の躍動感重視)
> - 章テーマ prism-promise (BPM 118 神聖儀式) と区別: 派閥 BGM は灯篭祭の祭祀躍動 + 七色合唱の祝祭感
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める

---

## 楽曲コンセプト

巫女連邦リーリエ派閥の祭祀音楽。 灯篭祭の夜、 七色の紙灯篭が街路に揺れる中、 巫女たちが神楽を舞い、 七弦の琴と尺八が躍動するアップテンポ祭祀。 千年祭祀の継承を「日常の静謐」 ではなく「祝祭の躍動感」 で表現。 派閥のキャラを図鑑で開いた瞬間に、 灯篭祭の活気が立ち上がる構成。

---

## 🎵 v1 — Up-tempo 灯篭祭の躍動 (BPM 125、 推奨基準)

- **基調**: 東方楽器 (尺八/笛/七弦琴/biwa) + 太鼓 + 七色合唱 + driving 弦楽
- **ムード**: 灯篭祭の祝祭 + 神楽の躍動 + 千年祭祀の伝承を 動的に
- **テンポ**: アップテンポ (BPM 120-135、 派閥 BGM 推奨 110-160 範囲、 野沢さん 2026-05-06 指示準拠)
- **構成**: 七弦琴イントロの呼びかけ → 太鼓の祭祀リズム導入 → 神楽の主題 → 七色合唱のリフト → 駆け抜ける祭祀の頂点 → 余韻の鈴

### Suno AI プロンプト (Style)

```
Sacred-eastern festival orchestral with up-tempo ceremonial energy and seven-prism
luminous joy, vibrantly uplifting Lirie shrine-festival theme driven by ancient
Japanese-flavored instrumentation. Featured instruments: eastern shakuhachi flute as
soaring primary melodic voice (energetic and bright tone, NOT contemplative), seven-string
koto with rapid driving arpeggios cascading like seven-color lantern light, biwa with
sharp plucked accents like festival drumbeat punctuations, taiko drums (medium-large)
keeping a strong driving 4/4 festival pulse, brass small bells (rin) chiming on every
beat, light woodblock percussion in active staccato, full strings ensemble (cello +
viola + violin) with driving forward motion, energetic female choir vocalize ("ah-ah-ah"
on rhythmic accents) lifting at chorus moments, harp prismatic arpeggios cascading
rapidly like seven-color paper lanterns flying skyward.
Atmosphere: eastern shrine federation Lirie during full lantern festival night, hundreds
of seven-color paper lanterns floating skyward in choreographed waves, priestesses
dancing the sacred kagura with seven-color silk ribbons swirling, the central temple
courtyard alive with festival drums and flute calls, cherry-blossom-like seven-color
petals scattering through the air, the lively sacred energy of millennium tradition
reborn each night.
Emotional arc: festive dawn drum call → kagura dance opening → choir lift → driving
festival climax → lingering seven-color resonance.
BPM 125, key D major with Lydian and Mixolydian color (sacred bright joyful flavor),
2:30 duration target, instrumental only with female choir vocalize, fantasy game music
aesthetic, energetic cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental + female angelic choir vocalize, no spoken lyrics]
```

---

## メタ情報

- **対応シーン**: 巫女連邦リーリエ派閥のキャラを図鑑/相関図/キャラ詳細で表示する時の BGM
- **ストーリー使用**: 派閥 BGM (図鑑タブ/相関図/キャラ詳細モーダルで再生)、 章ストーリー再生中は章テーマ prism-promise が優先
- **コード参照**: `script.js` `BGM_LIST` の `id: 'shrine'` (BGM_LIST 既登録、 duration は アセット完成後 実値更新)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-shrine.mp3`

## 整合性 (outline + テンポ規約準拠)

- 派閥のテーマ: 巫女連邦の祭祀の躍動感、 灯篭祭の活気
- 章テーマ prism-promise との差別化:
  - prism-promise (BPM 118): 七座満つる神聖儀式の上昇感、 オーケストラ + 七色合唱の格調
  - prism-shrine (BPM 125): 灯篭祭の祭祀躍動、 東方楽器 + 太鼓 + 駆動的弦楽
- 既存派閥 BGM との整合: prism-aether (ゼノニア BPM 105) や prism-niflheim (ニーヴル BPM 95) より速め、 アップテンポ路線で野沢さん指示「派閥 BGM もなるべく速めが望ましい」 に対応
- 例外として 教会 (BPM 70 processional) / アクアシス (BPM 60 underwater current) は世界観必然で維持、 巫女連邦は 祭祀躍動 = 速めデフォルトが整合

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental + female angelic choir vocalize]` → 生成 (2:30 instrumental)
2. 気に入ったテイクを採用版に
3. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-shrine.mp3` に保存
4. Claude:
   - work へ cp + duration 計測 (`bash scripts/measure_bgm.sh`)
   - `script.js` BGM_LIST の `id: 'shrine'` entry duration を実値に更新
   - cache buster bump → dev push (pre-push hook で Box auto-sync)

## 関連 memory

- `feedback_bgm_uptempo.md`: 派閥 BGM もなるべく速めのテンポ (野沢さん指示 2026-05-06)
- ルール7-14 (派閥 BGM ≥5キャラ): 巫女連邦は s1c6 で 20体追加 = ≥5 BLOCKER 化対象、 本ファイルで防御済
