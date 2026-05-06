# 派閥 BGM プロンプト — Prism Sanctus (白焔教会、 後追い記録版)

白焔教会派閥の派閥テーマ BGM。 Suno AI 向け。 ルール 7-14 (派閥キャラ ≥5 で BGM プロンプト必須) BLOCKER 防御。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-church.mp3` (Box B-2 で path 移行済)
> - **本ファイルは後追い記録**: 楽曲は 2026-04 段階で野沢さん側既に Suno AI 生成済 (3:09)、 後追いで本 prompt を記録
> - script.js BGM_LIST 登録済 (id: 'church', 'Prism Sanctus 白焔の祈り'、 duration 3:09)
> - sw.js PRECACHE_BGM 登録済

---

## 楽曲コンセプト

白焔教会派閥の聖歌風 BGM。 イザベル / セラフィ / メイリ / 詠聖ベル / 白焔教会騎士ラナス / 白焔教会従士リッカ / 白焔教会見習い巫女ルーナ ら教会派閥キャラ群の派閥テーマ。 「波紋の聖女」 への覚醒、 「セラフィエル様の代理として祈る」 静謐さ、 詠聖ベルの合唱、 教会の白焔の温度を 神聖+清浄+温度の三層で表現。

---

## 🎵 v1 — Sacred-choir mid-tempo (推奨基準、 既存実装版)

- **基調**: 神聖オーケストラ + 教会聖歌コーラス + 白焔の温度
- **ムード**: 祈り + 信仰 + 清浄 + 「セラフィエル様が見守ってくださる」 安らぎ
- **テンポ**: 中速 (BPM 95-115、 神聖さ重視で安定的)
- **構成**: 静謐な祭壇導入 (organ pad) → 聖歌コーラス (女性合唱) → ステンドグラス越しの朝光 (string ensemble) → 白焔の祈り (溶ける温度)

### Suno AI プロンプト (Style)

```
Sacred-choir orchestral with white-flame church sanctuary atmosphere, mid-tempo
contemplative prayer theme, gracefully ascending with sacred gravitas and millennium-deep
emotional resonance. Featured instruments: cathedral pipe organ for foundational sacred
pad (low to mid register), pure female angelic choir vocalize (soft Latin-flavored "ah-ah"
and "lacrimosa"-like phrasing) carrying the main melody, soft string ensemble (cello +
viola) for warm undercurrent, distant tubular bells like cathedral chimes throughout, harp
prismatic arpeggios cascading like white-flame embers, gentle taiko/timpani heartbeat
rhythm (slow ceremonial beat, NOT aggressive), solo violin lead carrying Isabelle's
"波紋の聖女" awakening melody, brief boy-soprano moment as a counterpoint (Sera and
詠聖ベル duet feel), prismatic chime accents.
Atmosphere: white-flame church sanctuary at morning prayer, tall stained-glass windows
casting prismatic rainbow light onto polished marble floor, the altar surrounded by
seven white candles burning steadily, the central rose window depicting Seraph Paladin
descending from heaven, soft white-flame petals drifting through the air, the peaceful
sacred silence of devout prayer, the moment when Isabelle's prayer reaches Seraphiel,
the choir of acolytes singing in the upper gallery.
Emotional arc: silent dawn prayer → choir gathering → sacred ascension → warmth of
faith → peaceful afternoon light through stained glass.
BPM 105, key F major with Lydian color (sacred bright flavor), 3:09 duration target,
instrumental + female choir vocalize only (no spoken lyrics), fantasy game music
aesthetic, cinematic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Female angelic choir vocalize only, no Latin words spelled out, just "ah-ah-ah" and humming]
```

---

## メタ情報

- **対応シーン**: 白焔教会派閥のキャラを図鑑/相関図/キャラ詳細で表示する時の BGM
- **ストーリー使用**: 派閥 BGM (図鑑タブ/相関図/キャラ詳細モーダルで再生)、 章ストーリー再生中は章テーマが優先 (s1c2 prism-tide 等)
- **コード参照**: `script.js BGM_LIST` の `id: 'church'` entry (既登録、 'Prism Sanctus (白焔の祈り)'、 duration 3:09)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-church.mp3` (既存、 5/6 19:59 配置済)

## 整合性 (outline 準拠)

- 派閥のテーマ: 白焔教会の聖歌・祈り・セラフィエル様への信仰
- s1c1 イザベルの祈りの情景 / s1c2 イザベル「波紋の聖女」 覚醒 (ネプテア「神は陸の上だけにいるのか」 への解答) のテーマと整合
- 既存派閥 BGM (prism-aether 蒸気 BPM 105 / prism-niflheim 氷霊 BPM 95) と並ぶ中速、 神聖系統で差別化
- 「Prism Sanctus」 命名: ラテン語 "Sanctus" (聖なるかな) = 白焔教会のミサ典書由来モチーフ

## 関連 memory / ルール

- ルール 7-14 (派閥 BGM ≥5キャラ): 白焔教会 7キャラ存在 (≥5)、 派閥テーマ BGM 必須 → 本ファイル + prism-church.mp3 で防御
- `feedback_bgm_uptempo.md`: BGM テンポは世界観優先、 派閥 BGM は中速で OK
