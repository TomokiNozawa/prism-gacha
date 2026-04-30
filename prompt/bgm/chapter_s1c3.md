# S1C3 章テーマBGM プロンプト — Prism Sands (砂塵の鼓動)

第3章「砂塵の隊商」 の章テーマBGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-sands.mp3`
> - 想定 duration: 2:40 〜 3:00 (S1C2 prism-tide.mp3 = 2:44 と同等程度)
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める (`bash scripts/measure_bgm.sh`)

---

## 楽曲コンセプト

第3章のテーマ「血ではなく、 共に過ごした時間が家族」 を反映。 砂漠の広大さ、 古代神秘、 出会いと別れの哀愁を表現。 ヴィルとサハナが夜空の下で互いの孤独を打ち明ける山場 (3-3) のシーンに合う旋律であること。

- **基調**: 砂漠系民族音楽 + ファンタジー
- **ムード**: エキゾチック / 神秘的 / 哀愁 / 旅情
- **テンポ**: 中速 (BPM 70-90、 ゆったりとした砂漠の歩み)
- **構成**: 静かな導入 → 旅情の主題 → 山場 (盛り上がり) → 余韻 (静謐)

---

## Suno AI プロンプト (Style)

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

## Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

(歌詞なし、 完全インストゥルメンタル)

---

## 用途

- **第3章 (s1c3) ストーリーモーダル開始時**: メインで流れる
- **第3章ストーリー全シーン共通**: bgm autoplay
- **章選択画面で第3章選択時のホバー演出 (将来検討)**: フェードプレビュー

BGM_LIST 追加例:
```js
{ id: 'sands', label: '第3章テーマ', desc: 'Prism Sands (砂塵の鼓動)', duration: 'X:XX', file: '/assets/bgm/prism-sands.mp3' },
```
