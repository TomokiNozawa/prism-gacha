# S1C3 章テーマBGM プロンプト — Prism Sands (砂塵の鼓動)

第3章「砂塵の隊商」 の章テーマBGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-sands.mp3`
> - 想定 duration: 2:40 〜 3:00 (S1C2 prism-tide.mp3 = 2:44 と同等程度)
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める (`bash scripts/measure_bgm.sh`)

---

## 楽曲コンセプト

第3章のテーマ「血ではなく、 共に過ごした時間が家族」 を反映。 砂漠の広大さ、 古代神秘、 出会いと別れの哀愁を表現。 ヴィルとサハナが夜空の下で互いの孤独を打ち明ける山場 (3-3) のシーンに合う旋律であること。

- **基調**: 砂漠系民族音楽 + ファンタジー (アップテンポ寄り)
- **ムード**: エキゾチック / 神秘的 / 旅情の躍動感
- **テンポ**: アップテンポ (BPM 110-115、 駱駝が砂を蹴って進む駆動感)
- **構成**: 駆動的な導入 → 旅情の主題 → 山場 (盛り上がり) → 余韻はテンポ維持で dynamics を落として表現

> **🎯 野沢方針 (2026-05-01)**: BGMは基本アップテンポ系を好む (`feedback_bgm_uptempo.md`)。 章テーマも contemplative/slow 路線ではなく energetic mid-tempo に。 静謐シーンは BPM ではなく instrument density で表現。

---

## Suno AI プロンプト (Style)

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
