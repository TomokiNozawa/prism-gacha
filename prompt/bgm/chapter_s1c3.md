# S1C3 章テーマBGM プロンプト — Prism Sands (砂塵の鼓動)

第3章「砂塵の隊商」 の章テーマBGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-sands.mp3`
> - **現在運用中**: **v2** (BPM 110、 up-tempo、 3:02) で生成 → `prism-sands.mp3` として配置済 (野沢方針 2026-05-01「やっぱアップテンポ系が好み」 反映後の再生成版)
> - **v1 (BPM 78、 contemplative)** は撤去済、 v2 が現行
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める (`bash scripts/measure_bgm.sh`)

---

## 楽曲コンセプト (共通)

第3章のテーマ「血ではなく、 共に過ごした時間が家族」 を反映。 砂漠の広大さ、 古代神秘、 出会いと別れの旅情を表現。 ヴィルとサハナが夜空の下で互いの孤独を打ち明ける山場 (3-3) のシーンに合う旋律であること。

---

## 🎵 v1 — Contemplative 原版 (BPM 78、 アーカイブ、 現在は未使用)

- **基調**: 砂漠系民族音楽 + ファンタジー
- **ムード**: エキゾチック / 神秘的 / 哀愁 / 旅情
- **テンポ**: 中速 (BPM 70-90、 ゆったりとした砂漠の歩み)
- **構成**: 静かな導入 → 旅情の主題 → 山場 (盛り上がり) → 余韻 (静謐)

### Suno AI プロンプト (Style)

```
Middle Eastern desert fantasy orchestral, mystical and contemplative, slow-tempo nomadic
journey theme. Featured instruments: sitar lead melody, oud harmonic backing, ney flute
breaths, frame drum (daf) heartbeat rhythm, tabla accents, distant Persian female vocalize
(wordless, ethereal), soft cello sustains, golden harp accents, faint sand-shaker percussion.
Atmosphere: vast endless desert at twilight, ancient dragon ruins half-buried in sand,
nomadic caravan crossing infinite dunes, two souls finding each other under starlight.
Emotional arc: solitude → longing → revelation → peace.
BPM 78, key D minor with Phrygian dominant flavor (Middle Eastern color),
3:00 duration target, instrumental only, fantasy game music aesthetic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

---

## 🎵 v2 — Up-tempo 版 ★現行 (BPM 110、 野沢方針 2026-05-01、 現 `prism-sands.mp3` 3:02 はこれ)

> 「やっぱアップテンポ系が好み」 を反映 (`feedback_bgm_uptempo.md`)。 contemplative/slow を energetic forward momentum に切替、 旅情を保ちつつ駆動感を加える。 **野沢が v1 から差し替えて運用中**。

- **基調**: 砂漠系民族音楽 + ファンタジー (アップテンポ寄り)
- **ムード**: エキゾチック / 神秘的 / 旅情の躍動感
- **テンポ**: アップテンポ (BPM 110-115、 駱駝が砂を蹴って進む駆動感)
- **構成**: 駆動的な導入 → 旅情の主題 → 山場 → 余韻はテンポ維持で instrument density を落として表現 (BPM は落とさない)

### Suno AI プロンプト (Style)

```
Middle Eastern desert fantasy orchestral with energetic forward momentum, mystical and uplifting
nomadic journey theme. Featured instruments: sitar lead melody with driving phrasing, oud
harmonic backing, ney flute soaring lines, frame drum (daf) energetic heartbeat rhythm,
tabla rhythmic accents, distant Persian female vocalize (wordless, ethereal), cello pulse
sustains, golden harp accents, sand-shaker percussion driving forward.
Atmosphere: vast endless desert at golden hour, ancient dragon ruins half-buried in sand,
nomadic caravan moving with purpose across infinite dunes, two souls finding each other
under starlight, journey full of momentum and discovery.
Emotional arc: setting out → forward journey → revelation → triumphant continuation
(no slow-down, maintain forward motion throughout).
BPM 110, key D minor with Phrygian dominant flavor (Middle Eastern color),
3:00 duration target, instrumental only, fantasy game music aesthetic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

---

## 用途 (共通)

- **第3章 (s1c3) ストーリーモーダル開始時**: メインで流れる
- **第3章ストーリー全シーン共通**: bgm autoplay
- **章選択画面で第3章選択時のホバー演出 (将来検討)**: フェードプレビュー

BGM_LIST 追加例:
```js
{ id: 'sands', label: '第3章テーマ', desc: 'Prism Sands (砂塵の鼓動)', duration: 'X:XX', file: '/assets/bgm/prism-sands.mp3' },
```

---

## 切替時の注意

v2 で再生成する場合:
1. Suno で v2 プロンプトを叩く → 出力 mp3 を Box 経由で work へ
2. 既存 `prism-sands.mp3` をリネーム (`prism-sands_v1.mp3` 等で保管推奨) or 上書き
3. `bash scripts/measure_bgm.sh` で duration 再計測 → script.js BGM_LIST の duration 値を更新
4. sw.js SW_VERSION bump (cache 刷新)、 cache buster bump
5. dev push → 動作確認 → main
