# 派閥 BGM プロンプト — Prism Shrine (巫女連邦リーリエ)

巫女連邦リーリエ派閥の派閥テーマBGM。 Suno AI 向け。 ルール7-14 (派閥キャラ ≥5 で BGM プロンプト必須) BLOCKER 防御。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-shrine.mp3` (Box B-2 で path 移行済 = `media/audio/bgm/`)
> - **基調**: 中速 (BPM 90-110、 章テーマ prism-promise BPM 118 より控えめ、 日常的な祭祀音楽)
> - 派閥 BGM は「派閥のキャラを図鑑/相関図で見る時に流れる」 ため、 章テーマよりも背景音楽寄りで OK
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める

---

## 楽曲コンセプト

巫女連邦リーリエ派閥の日常的な祭祀音楽。 千年祭祀の継承、 灯篭祭の温度、 翡翠の神殿の静謐。 章テーマ prism-promise (七座満つる神聖儀式) の上昇感とは異なり、 派閥 BGM は「巫女連邦の日常の温度」 を表現。 七色の灯篭が街路に揺らぎ、 巫女たちが祈祷を続ける、 平和な千年血脈の継続。

---

## 🎵 v1 — Mid-tempo 千年祭祀 (BPM 95、 推奨基準)

- **基調**: 東方楽器中心 (尺八/笛/鈴/木魚/琴) + 軽い弦楽 + 七色合唱 (控えめ)
- **ムード**: 千年祭祀の継承 + 灯篭祭の暖かさ + 神殿の静謐 + 母から娘への祈りの伝承
- **テンポ**: 中速 (BPM 90-110、 日常的)
- **構成**: 早朝の祈祷の静寂 → 灯篭祭の街並みの温度 → 神殿の祭祀 → 夕暮れの灯篭灯し → 夜の祈祷の塔

### Suno AI プロンプト (Style)

```
Sacred-eastern instrumental ambient with shrine-festival warmth, mid-tempo daily-life
ceremonial theme, gracefully flowing with peaceful millennium-deep continuity. Featured
instruments: eastern shakuhachi flute as the primary melodic voice (gentle warm tone),
koto for harmonic accompaniment with seven-color rolling arpeggios, biwa for occasional
plucked accents like ceremonial punctuations, wooden temple bells (mokugyo) and brass
small bells (rin) keeping a soft heartbeat rhythm, light woodblock percussion, faint
strings ensemble providing warm pad foundation, soft female angelic choir vocalize used
sparingly only at ceremonial moments, harp prismatic arpeggios cascading softly like
seven-color paper lanterns gently swaying in night air.
Atmosphere: eastern shrine federation Lirie at peaceful daytime and twilight, the jade
shrine corridor with rows of seven-color paper lanterns, the lantern festival cityscape
with vendors and pilgrims walking peacefully, the central temple inner sanctuary in
afternoon golden light, mountain mist drifting through wooden roofs, the prayer tower
under the full moon at dusk, the chronicle hall with thousand-year scrolls glowing
faintly. Daily life of priestesses tending lanterns, chanting morning prayers, weaving
seven-color silk ribbons, lighting evening candles.
Emotional arc: peaceful dawn awakening → festival warmth and life → ceremonial reverence
→ twilight golden hour → quiet night prayer.
BPM 95, key D major with Lydian and Dorian color (sacred warm flavor), 2:30 duration
target, instrumental only, fantasy game music aesthetic, ambient cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

---

## メタ情報

- **対応シーン**: 巫女連邦リーリエ派閥のキャラを図鑑/相関図/キャラ詳細で表示する時の BGM
- **ストーリー使用**: 派閥 BGM (図鑑タブ/相関図/キャラ詳細モーダルで再生)、 章ストーリー再生中は章テーマ prism-promise が優先
- **コード参照**: `script.js` `BGM_LIST` の `category: 'faction'` セクション (s1c6 公開時に新エントリ追加)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-shrine.mp3` → `cp ~/prism-gacha-work/media/audio/bgm/prism-shrine.mp3`

## 整合性 (outline 準拠)

- 派閥のテーマ: 巫女連邦の千年祭祀の継承、 「次の代に灯る」 系譜の継続性
- 章テーマ prism-promise との差別化: prism-promise は 七座満つる神聖儀式の高揚感 (BPM 118、 オーケストラ+七色合唱)、 一方 prism-shrine は 日常的な祭祀の暖かさ (BPM 95、 東方楽器中心)
- 既存派閥 BGM との整合: prism-aether (ゼノニア機械工房、 BPM 105) や prism-niflheim (ニーヴル氷霊王国、 中速) と並べた時、 各派閥の文化的個性が音楽でも区別できるように、 巫女連邦は「東方楽器」 で明確に差別化

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (2:30 instrumental)
2. 気に入ったテイクを採用版に
3. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-shrine.mp3` に保存
4. Claude (notebook or desktop):
   - `cp ~/Box/.../prismaera/media/audio/bgm/prism-shrine.mp3 ~/prism-gacha-work/media/audio/bgm/prism-shrine.mp3`
   - `bash scripts/measure_bgm.sh` で duration 計測
   - `script.js` `BGM_LIST` に新エントリ追加: `{ id: 'shrine', label: '巫女連邦テーマ', desc: 'Prism Shrine (千年祭祀の温度)', category: 'faction', duration: '2:30', file: '/media/audio/bgm/prism-shrine.mp3' }`
   - `sw.js` の `PRECACHE_BGM` 配列にも `'/media/audio/bgm/prism-shrine.mp3'` を追加 (ルール7-13 BLOCKER 防御)
   - cache buster bump → dev push

## 関連 memory

- `feedback_bgm_uptempo.md`: BGM テンポは世界観優先、 派閥 BGM は中速で OK
- ルール7-14 (派閥 BGM ≥5キャラ): 巫女連邦は s1c6 で 20体追加 = ≥5 BLOCKER 化対象、 本ファイルで防御済
