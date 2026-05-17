# 派閥 BGM プロンプト — Prism Observatorium (原虹・観測者)

原虹・観測者 (genso) 派閥の派閥テーマ BGM。 Suno AI 向け。 ルール7-14 (派閥キャラ ≥5 で BGM プロンプト必須) BLOCKER 防御 (s1c1 から既存 5体所属: 虹意プリズマ・セラフィエル・千夜姫カグヤ・星海のノクス + s1c7 追加 沈黙の候補ミューティス、 合計 5体到達)。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-observatorium.mp3`
> - **基調**: アップテンポ神秘 (BPM 110、 月影宮の常夜の卓に観測者四席+候補が集う 千年継承神秘の常態)
> - 章テーマ prism-watch (s1c1 BPM 92 三柱の夜警) と区別: 派閥 BGM は **観測者の派閥常態** (動的予兆観測ではなく、 月影宮で千年祈り続ける情景の駆動感)
> - 章テーマ prism-promise (s1c6 BPM 118 七座満つる神聖儀式) と区別: 派閥 BGM は **集会の場の静かな神秘** (儀式の祝祭ではなく 千年継承の日常神事)
> - 楽曲は野沢さん側 Suno AI で生成予定、 mp3 受領後 BGM_LIST + sw.js PRECACHE 追加 + cache buster bump

---

## 楽曲コンセプト

原虹・観測者派閥の音楽。 章 BGM (Prism Watch/Promise) が「特定章の動的観測ドラマ」 を担うのに対し、 派閥 BGM は **観測者の千年継承される神秘の常態** = 月影宮の常夜の卓に観測者四席 (セラフィエル+カグヤ+ノクス+イリス) + 沈黙の候補ミューティス が静かに集い、 七色の宇宙の渦を観続ける情景。 主席プリズマが眠る/動く中で、 観測者たちが千年祈りを継承し続ける派閥の格 を 駆動感ある神秘で表現。 図鑑/相関図で genso のキャラを眺める時、 「千年継承される観測者の神秘 + 月影宮の永遠の時間」 が立ち上がる構成。

---

## 🎵 v1 — Mid-uptempo Millennium Observatory Sacred Mystic (BPM 110、 推奨基準)

- **基調**: heavenly mixed choir (女声+男声) + harp + crystal singing bell + 高弦アンサンブル + celesta + pipe organ (荘厳ベース) + 遠い chime bells + 弱い timpani
- **ムード**: 千年継承される観測者の神秘 + 月影宮の常夜の卓の静かな駆動 + 七色の宇宙の渦が巡る神秘 + 神聖だが穏やか (派閥常態の格)
- **テンポ**: 中アップテンポ (BPM 100-120、 派閥 BGM アップテンポ範囲、 千年継承される神秘の落ち着いた駆動)
- **構成**: harp arpeggio + celesta 冒頭 (月影宮の静かな目覚め) → high strings sustained + heavenly choir 重なり (観測者たちが集う) → pipe organ ascending motif + crystal bell (千年神秘の格) → 高弦 + chime bells 駆動 (七色の渦が巡る) → 山場 (choir + pipe organ + 全層) → 余韻 (harp + celesta 単独、 千年続く神秘)

### Suno AI プロンプト (Style)

```
Heavenly-fantasy millennium-observatory sacred-mystic theme with mid-uptempo
timeless dignity and seven-color cosmic mystic. Featured instruments:
- heavenly mixed choir (women + men "ah-oh-oo" sustained vocalize, sacred-
  serene-millennium, observers' eternal prayer)
- celesta (high crystalline arpeggios, starlight-twinkle motifs, cosmic vortex)
- harp (flowing arpeggios in major+minor, millennium tapestry weaving)
- crystal singing bell (sustained high shimmer, sacred space resonance)
- high strings ensemble (violins+violas sustained chords + occasional gentle
  tremolo, ethereal heavenly canopy)
- pipe organ (cathedral-scale low fundamental + occasional ascending sacred
  motif, ancient observer-dignity)
- chime bells (occasional distant bell tolls, moonlight palace's eternal hour)
- light timpani (soft heroic accents, dignified pulse without aggression)

Atmosphere: moonlight palace observatory where the four observers (Seraphiel
with six white wings, Kaguya with moon staff, Nox with galactic hair, Iris with
seven-color lantern staff) gather around the black-obsidian council table
inscribed with seven concentric constellation rings, the silent silence-
candidate Mutys standing quietly nearby, the seven-color cosmic vortex of the
heavenly realm visible through open arches, galactic stars wheeling slowly,
the four lit seat-flames glowing softly (red flame for Seraphiel, orange ember
for Kaguya, gold star for Nox, jade-green lantern for Iris), the central master
seat of Prisma quietly accumulating light. The sacred-mystic music of a
millennium council that observes the cosmos in dignified eternal vigilance —
serene, dignified, never grandiose, the heartbeat of the world's witnesses.

Emotional arc: harp arpeggios + celesta opening (palace stirs gently) →
high strings sustained + heavenly choir layer in (observers gather) →
pipe organ ascending sacred motif + crystal bell (millennium dignity rises) →
high strings + chime bells driving (seven-color vortex circling) → climax
choir + pipe organ + all layers (observatory's sacred zenith) → tail-out harp
+ celesta solo (millennium continues into next watch).

BPM 110, key C major with Aeolian/Lydian color (sacred-serene, brief D minor
and G major modulations for breath), 2:30 duration, instrumental with mixed
choir vocalize only, fantasy game cinematic, dignified-sacred-mystic mid-
uptempo heavenly observatory.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

> ⚠️ Suno AI の Lyrics 欄は `[Instrumental]` しか機能しない仕様。 vocalize 指示は Style 側に既に明記済 (`heavenly mixed choir "ah-oh-oo"`)。

---

## メタ情報

- **対応シーン**: 原虹・観測者派閥のキャラ (虹意プリズマ・セラフィエル・千夜姫カグヤ・星海のノクス・沈黙の候補ミューティス) を図鑑/相関図/キャラ詳細で表示する時の派閥 BGM
- **ストーリー使用**: 派閥 BGM (図鑑タブ/相関図/キャラ詳細モーダルで再生)、 章ストーリー再生中は章テーマが優先
- **本文整合**: 観測者プロローグ各章 (s1c5 / s1c6 / s1c7) の月影宮シーンと整合、 「月影宮の常夜の卓」 「七色の宇宙の渦」 「四席の灯火」 「千年継承神秘」
- **コード参照**: `script.js` `BGM_LIST` に `id: 'observatorium'` (`category: 'faction'`) エントリ追加予定 (mp3 受領後)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-observatorium.mp3`

## 整合性 (既存 BGM との差別化)

- 派閥のテーマ: 観測者・原虹の **千年継承される神秘の常態・月影宮の常夜の卓・神聖だが穏やか・七色の宇宙の渦が巡る駆動感**
- 既存 章/シーン BGM との差別化:
  - prism-dawn (home BPM 90 メインテーマ): 朝の希望 vs observatorium 神秘継承、 ムード逆 (夜明け/月影夜)
  - prism-watch (s1c1 BPM 92 三柱の夜警): 動的予兆観測 vs observatorium 静かな常態、 動 vs 静
  - prism-promise (s1c6 BPM 118 七座満つる儀式): 祝祭儀式 vs observatorium 日常神事、 動的祝祭 vs 静的常態
- 既存 派閥 BGM との差別化:
  - prism-church (church BPM 70 processional): 教会聖歌 vs observatorium 観測者神秘、 速度・場所で独立 (教会/月影宮)
  - prism-kagura (lirie BPM 115-125 神楽): 巫女連邦神楽 vs observatorium 観測者神秘、 楽器系統で独立 (和楽器/西洋神聖)
  - prism-aquasis/crimson/sahar/niiruru/zenonia/silver/voidtower: 全て地上派閥 vs observatorium 天空界、 完全別世界
- 例外路線: observatorium は **唯一の「天空界 観測者派閥」 BGM** という独自ニッチ、 既存派閥群 (地上派閥) との時空間軸的差別化で一意性を確保
- 観測者・原虹の世界観要素を全て音楽要素に翻訳: 月影宮 (heavenly choir + pipe organ) / 七色の宇宙の渦 (high strings + crystal bell) / 千年継承神秘 (harp arpeggio + celesta) / 月影の杖の格 (pipe organ ascending) / 観測者四席の集い (choir + chime bells) / 沈黙の候補 (静寂の間)

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (2:30 instrumental、 vocalize は Style 側で指示済)
2. 「千年継承される観測者の神秘 + 月影宮の静かな駆動感」 の印象が出ているか確認 (戦闘曲・派手な祝祭・evil 曲ではないか注意)、 神聖だが穏やか・派閥常態である必要
3. 気に入ったテイクを採用版に
4. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-observatorium.mp3` に保存
5. Claude:
   - work へ cp + duration 計測 (`bash scripts/measure_bgm.sh`)
   - `script.js` BGM_LIST に新エントリ追加: `{ id: 'observatorium', label: '観測者・原虹派閥', desc: 'Prism Observatorium (月影宮の常夜)', category: 'faction', duration: 'mm:ss', file: '/media/audio/bgm/prism-observatorium.mp3' }`
   - `sw.js` PRECACHE_BGM 配列に `'/media/audio/bgm/prism-observatorium.mp3'` 追加 + コメント `// genso 原虹・観測者派閥 BGM`
   - cache buster bump → dev push (pre-push hook で Box auto-sync)

## 関連 memory / ルール

- `feedback_bgm_uptempo.md`: 派閥 BGM はアップテンポ既定 (BPM 100-130)、 observatorium は BPM 110 で範囲内
- ルール7-14 (派閥 BGM ≥5キャラ): genso は s1c7 追加で 5体到達 = BLOCKER 化対象、 本ファイル + mp3 取込で防御
- ルール7-42 (BGM テンポ自動チェック): 本プロンプトは BPM 110 で範囲内、 BGM_TEMPO_OK マーカー不要
- 章 BGM (prism-watch, prism-promise) との差別化方針: 章 = 動的観測ドラマ / 派閥 = 静的派閥常態 (神秘継承の格)
