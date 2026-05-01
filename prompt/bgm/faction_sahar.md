# 派閥BGM プロンプト — 古龍砂漠サハール (Prism Sahar)

新派閥「古龍砂漠サハール」 の派閥BGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-sahar.mp3`
> - **現在運用中**: **v2** (BPM 130、 up-tempo、 2:48) で生成 → `prism-sahar.mp3` として配置済 (野沢方針 2026-05-01「やっぱアップテンポ系が好み」 反映後の再生成版)
> - **v1 (BPM 110、 中速)** は撤去済、 v2 が現行
> - 「派閥6人超で派閥BGM追加」 ルール対象 (S1C3で古龍砂漠サハール 9体 = 5人超)

---

## 楽曲コンセプト (共通)

派閥「古龍砂漠サハール」 の世界観を表現。 砂漠遊牧民の自由と古龍末裔の神秘の融合。 chapter BGM (Prism Sands) より派手目で勇壮、 部族集結や戦闘シーン (3-2) で映える。

---

## 🎵 v1 — Mid-tempo 原版 (BPM 110、 アーカイブ、 現在は未使用)

- **基調**: 砂漠民族戦闘音楽 + 神話的スケール感
- **ムード**: 勇壮 / 神秘 / 部族の力 / 古代の血脈
- **テンポ**: 中速〜やや速 (BPM 100-120、 駆ける駱駝のような躍動感)
- **構成**: 部族集結のホルン → 主題 (砂漠の風) → 戦闘 (古龍の鼓動) → 勝利の余韻

### Suno AI プロンプト (Style)

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

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental with stylized male battle calls "Hai!" in distant background]
```

---

## 🎵 v2 — Up-tempo 版 ★現行 (BPM 130、 野沢方針 2026-05-01、 現 `prism-sahar.mp3` 2:48 はこれ)

> 「やっぱアップテンポ系が好み」 を反映 (`feedback_bgm_uptempo.md`)。 派閥/戦闘テーマ既定範囲 (BPM 120-140) に揃えた版。 **野沢が v1 から差し替えて運用中**。

- **基調**: 砂漠民族戦闘音楽 + 神話的スケール感
- **ムード**: 勇壮 / 神秘 / 部族の力 / 古代の血脈
- **テンポ**: アップテンポ (BPM 125-135、 全速で駆ける部族戦士の躍動感)
- **構成**: 部族集結のホルン → 主題 (砂漠の風) → 戦闘 (古龍の鼓動) → 勝利の余韻 (テンポ維持)

### Suno AI プロンプト (Style)

```
Epic Middle Eastern tribal battle theme with ancient dragon mysticism, highly energetic
and heroic with driving up-tempo momentum. Featured instruments: bold brass horns
(war-horn calls), powerful tribal drums (djembe + frame drum + taiko-style hits),
sitar dynamic melody with rapid runs, kemenche (bowed lute) intense passages, qanun
(zither) shimmering ornaments, masculine male choir chants in distant background (no
actual lyrics, just stylized "Hai!" battle calls), ney flute soaring lead, deep gong
impacts at climax, sand-shaker rhythmic backdrop, driving bass percussion throughout.
Atmosphere: desert tribe warriors charging at full speed across dunes, ancient dragon-king's
spirit stirring beneath the sands, dragon-scale armor flashing in sunlight, banners of
crimson and gold whipping in fierce desert wind.
Emotional arc: rallying call → tribal sprint → battle clash → triumphant continuation
(maintain up-tempo throughout, no slow-downs).
BPM 130, key D minor with Phrygian dominant flavor (Middle Eastern color), bridge to
Lydian dominant at climax for "ancient dragon mystic" lift,
3:00 duration target, instrumental only, fantasy game faction-theme aesthetic.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental with stylized male battle calls "Hai!" in distant background]
```

---

## 用途 (共通)

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
| **Prism Sahar (新)** | 古龍砂漠サハール | シタール+ホルン+部族ドラム+男性choir | 勇壮・古代神秘 |

ジャンル被りなし、 既存3派閥BGMとも明確に差別化される。

---

## 切替時の注意

v2 で再生成する場合:
1. Suno で v2 プロンプトを叩く → 出力 mp3 を Box 経由で work へ
2. 既存 `prism-sahar.mp3` をリネーム (`prism-sahar_v1.mp3` 等で保管推奨) or 上書き
3. `bash scripts/measure_bgm.sh` で duration 再計測 → script.js BGM_LIST の duration 値を更新
4. sw.js SW_VERSION bump (cache 刷新)、 cache buster bump
5. dev push → 動作確認 → main
