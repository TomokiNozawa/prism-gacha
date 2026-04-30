# 派閥BGM プロンプト — 古龍砂漠サハール (Prism Sahar)

新派閥「古龍砂漠サハール」 の派閥BGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-sahar.mp3`
> - 想定 duration: 2:50 〜 3:10 (派閥BGM 既存 prism-aquasis.mp3=2:59、 prism-crimson.mp3=2:51 程度)
> - 「派閥6人超で派閥BGM追加」 ルール対象 (S1C3で古龍砂漠サハール 9体 = 5人超)

---

## 楽曲コンセプト

派閥「古龍砂漠サハール」 の世界観を表現。 砂漠遊牧民の自由と古龍末裔の神秘の融合。 chapter BGM (Prism Sands) より派手目で勇壮、 部族集結や戦闘シーン (3-2) で映える。

- **基調**: 砂漠民族戦闘音楽 + 神話的スケール感
- **ムード**: 勇壮 / 神秘 / 部族の力 / 古代の血脈
- **テンポ**: 中速〜やや速 (BPM 100-120、 駆ける駱駝のような躍動感)
- **構成**: 部族集結のホルン → 主題 (砂漠の風) → 戦闘 (古龍の鼓動) → 勝利の余韻

---

## Suno AI プロンプト (Style)

```
Epic Middle Eastern tribal battle theme with ancient dragon mysticism, energetic and
heroic. Featured instruments: bold brass horns (war-horn calls), powerful tribal drums
(djembe + frame drum), sitar dynamic melody, kemenche (bowed lute) intense passages,
qanun (zither) shimmering ornaments, masculine male choir chants in distant background
(no actual lyrics, just stylized "Hai!" battle calls), ney flute soaring lead, deep
gong impacts at climax, sand-shaker rhythmic backdrop.
Atmosphere: desert tribe warriors charging across dunes, ancient dragon-king's spirit
stirring beneath the sands, dragon-scale armor flashing in sunlight, banners of crimson
and gold flowing in fierce desert wind.
Emotional arc: gathering call → tribal march → battle clash → triumphant calm.
BPM 110, key D minor with Phrygian dominant flavor (Middle Eastern color), bridge to
Lydian dominant at climax for "ancient dragon mystic" lift,
3:00 duration target, instrumental only, fantasy game faction-theme aesthetic.
```

## Suno AI プロンプト (Lyrics 欄)

```
[Instrumental with stylized male battle calls "Hai!" in distant background]
```

---

## 用途

- **古龍砂漠サハール所属キャラ** (UR サハナ / UR ファラー / SSR アーシャ / SSR グラン / SR サフィラ / SR オウル / SR ライ / R ティナ / R ナドラ = 9体) のキャラ詳細表示時
- **第3章戦闘シーン** (3-2 部族集結+影喰いの大波) で chapter テーマから一時切替
- **派閥別BGMピッカー** (BGMパネル) で個別選択可能に

BGM_LIST 追加例:
```js
{ id: 'sahar', label: 'サハールテーマ', desc: 'Prism Sahar (古龍の風)', duration: 'X:XX', file: '/assets/bgm/prism-sahar.mp3' },
```

---

## 既存派閥BGMとの差別化

| 派閥BGM | 既存 | 楽器特徴 | ムード |
|---|---|---|---|
| Prism Sanctus | 白焔教会 | パイプオルガン+聖歌隊 | 荘厳・聖性 |
| Prism Abyss | アクアシス | 深海エコー+水音+チェロ | 神秘・深淵 |
| Prism Sailborn | 紅玉海賊団 | アコーディオン+海賊歌+船笛 | 自由・潮風 |
| **Prism Sahar (新)** | 古龍砂漠サハール | シタール+ホルン+部族ドラム+男性coir | 勇壮・古代神秘 |

ジャンル被りなし、 既存3派閥BGMとも明確に差別化される。
