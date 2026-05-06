# S1C6 章テーマBGM プロンプト — Prism Promise (七色の約束)

第6章「七座満つる」 の章テーマBGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-promise.mp3` (Box B-2 で path 移行済 = `assets/bgm/` ではなく `media/audio/bgm/`)
> - **基調**: アップテンポ既定 (BPM 110-130、 `feedback_bgm_uptempo.md` 準拠) — 神聖+希望の上昇感、 七座が満ちる時代の幕開け
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める (`bash scripts/measure_bgm.sh`)

---

## 楽曲コンセプト

第6章のテーマ「**違っていても、 同じ目的を持つ仲間でいられる**」 を反映。 観測者七座のうち4席が満ちる時代の幕開け、 千年血脈の継承、 観測者三柱+イリスが東方の灯篭祭の夜に集結する儀式の場面。 イリスの第四席「約束」 = 緑色の祈りを、 七色の灯篭が天空界へ昇る上昇感で表現。 セラフィエルの千年の祈り (「最初の羽」 から「翼を返す日」 へ) を 静かな弦のテーマで通底に流しつつ、 イリスの新しい光が中盤から立ち上がる二層構造。

---

## 🎵 v1 — Mid-up-tempo 神聖儀式 (BPM 118、 推奨基準)

- **基調**: 神聖オーケストラ + 七色合唱 + 東方楽器 (尺八/笛/鈴) の融合
- **ムード**: 千年の祈り + 新しい時代の幕開け + 七座満ちる神聖さ + 母娘の絆 (千年血脈継承)
- **テンポ**: アップテンポ (BPM 110-130 中速、 神聖さを保ちつつ祝祭の駆動感)
- **構成**: 静謐な祈祷の塔導入 (silver flute solo) → 灯篭祭の生命感 (東方笛+鈴) → 神殿の聖堂 (orchestral strings) → 山場 (七座儀式、 七色合唱+全楽器の上昇) → 別れの朝 (浄化、 silver chorus 解放)

### Suno AI プロンプト (Style)

```
Sacred-fantasy orchestral with eastern shrine instrumentation and seven-prism choir,
mid-up-tempo prophetic ceremony theme, gracefully ascending with sacred gravitas and
millennium-deep emotional resonance. Featured instruments: ethereal silver flute and
crystalline glockenspiel for the heavenly observer side (pure high register), eastern
shakuhachi flute and bamboo bell percussion for the shrine federation Lirie side
(earthen mid register), sacred koto and biwa string accents for ceremonial ritual
moments, seven-layered ascending choir — soft pure female angelic choir vocalize
(seraphic, observer voice) blended with warm earthen female chorus (priestess
voice, eastern shrine), distant tubular bells like temple chimes throughout, harp
prismatic arpeggios cascading like seven-color lanterns rising into the cosmos,
gentle taiko-style heartbeat percussion (slow ceremonial beat building gradually),
solo violin lead carrying the millennium-mother melody (Violena's thousand-year prayer),
subtle music-box motif briefly inserted (memory of the first wing — Seraph's
ancient creation moment).
Atmosphere: eastern shrine federation Lirie at lantern festival night with hundreds
of seven-color paper lanterns floating skyward, the celestial moon-palace inner hall
where four observer seats are about to be filled, the central temple inner sanctuary
with seven small standing seven-color lanterns on the altar, the prayer tower under
the full moon, the moment when the fourth observer seat-bearer Iris ascends to take
her seat as a "fellow seat-bearer" (not a younger sister but an equal), the moment
when seven-color lanterns rise from the table reflecting in the cosmos floor.
Emotional arc: silent millennium prayer → festival warmth and life → sacred reunion
between thousand-year mother and angel → ceremonial gathering of four observers →
seven-color lanterns ascending → quiet release of new dawn.
BPM 118, key D major with Lydian and Mixolydian color (sacred ascending flavor),
3:00 duration target, instrumental only, fantasy game music aesthetic, cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

---

## メタ情報

- **対応シーン**: ストーリー第6章「七座満つる」 全体 (プロローグ〜エピローグ)
- **ストーリー使用**: ✅ ストーリー再生中 BGM、 BGMパネルから選曲可能
- **コード参照**: `script.js` `BGM_LIST` の章テーマセクション (s1c6 用エントリ追加予定)
- **対応シーン強調**: 山場 4-1「七座満つる儀式」 で「七色合唱+全楽器の上昇」 が活き、 4-2「別れの朝」 で「silver chorus 解放」 が章を結ぶ
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-promise.mp3` → `cp ~/prism-gacha-work/media/audio/bgm/prism-promise.mp3`

## 整合性 (outline 準拠)

- 章テーマ「違っていても、 同じ目的を持つ仲間でいられる」 を 「天上の観測者 (silver flute)」 + 「地上の巫女連邦 (shakuhachi+koto)」 + 「七色合唱の和 (聖+俗の融合)」 の三層構造で表現
- LR_プリズマ凸秘話「セラフィエルという『羽』」 を music-box motif (記憶モチーフ) で 軽く差し込み (3-2 回想シーンとの BGM 整合)
- ヴィオレナ千年血脈 (S2C4 / S2C6 への伏線) を solo violin lead (millennium-mother melody) で表現
- 4-1 山場の七座儀式は「七層合唱の上昇」 + taiko ceremonial beat の高揚で頂点
- 章末の黒月予兆 (S1C7 引き) はあえて BGM では強調せず、 章末の余韻に留める (本曲は s1c6 の祝祭性を保つ)

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (3:00 instrumental)
2. 気に入ったテイクを採用版に
3. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-promise.mp3` に保存
4. Claude (notebook or desktop):
   - `cp ~/Box/.../prismaera/media/audio/bgm/prism-promise.mp3 ~/prism-gacha-work/media/audio/bgm/prism-promise.mp3`
   - `bash scripts/measure_bgm.sh` で duration 計測 (`mm:ss` 表記取得)
   - `script.js` `BGM_LIST` に新エントリ追加: `{ id: 'promise', label: '第6章テーマ', desc: 'Prism Promise (七色の約束)', category: 'chapter', duration: '3:00', file: '/media/audio/bgm/prism-promise.mp3' }`
   - `sw.js` の `PRECACHE_BGM` 配列にも `'/media/audio/bgm/prism-promise.mp3'` を追加 (ルール7-13 BLOCKER 防御)
   - cache buster bump → dev push

## 派閥 BGM (巫女連邦リーリエ、 ≥5キャラで BLOCKER)

巫女連邦リーリエ派閥は s1c6 で 20体追加 = ≥5 キャラ条件を超えるため、 派閥 BGM が必須 (ルール7-14 BLOCKER 化予定)。 別途 `prompt/bgm/faction_lirie.md` (or `faction_shrines.md`) を制作する必要あり (本ファイル末尾の TODO として残す)。

候補 ファイル名: `media/audio/bgm/prism-shrine.mp3` (or `prism-lirie.mp3`)。 章 BGM (prism-promise) より神聖度を控え、 日常的な祭祀音楽 (eastern shrine ambient) に寄せる方向。
