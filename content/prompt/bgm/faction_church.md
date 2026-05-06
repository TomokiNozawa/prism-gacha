# 派閥 BGM プロンプト — Prism Sanctus (白焔教会)

白焔教会派閥の派閥テーマ BGM。 Suno AI 生成済 (野沢さん 2026-04 段階)。 ルール 7-14 BLOCKER 防御。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-church.mp3`
> - 楽曲は野沢さん側 Suno AI で既に生成済 (duration 3:09、 BGM_LIST id='church' で登録済)
> - 本ファイルは野沢さん原本プロンプトの記録 (2026-05-06 提供、 後追い記録版を 上書き)

---

## Suno AI プロンプト (Style、 野沢さん原本)

```
Cinematic sacred orchestral fantasy, 70 bpm in slow 4/4 processional pulse; intro opens with solo harp, breathing space, and distant bell chimes; theme A brings wordless female choir over warm strings, theme B lifts with soft pipe organ swells and celesta glints; bridge thins to pianissimo strings and murmuring solo cello in B minor, then return brighter and tender with full choir, Ethereal close-mic vowel choir, long reverb tails, shimmering bell accents, seamless loop-ready mix—wide, luminous, and quietly melancholic, theme, slow, classical, cello, electronic, harp, rap, light, soft, rock, warm, orchestral
```

### Lyrics 欄

```
[Instrumental]
```

---

## メタ情報

- **対応シーン**: 白焔教会派閥のキャラを図鑑 / 相関図 / キャラ詳細で表示する時の BGM
- **コード参照**: `script.js BGM_LIST` の `id: 'church'` (登録済、 'Prism Sanctus (白焔の祈り)'、 duration 3:09)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-church.mp3` (既存、 5/6 19:59 配置済)

## キーワード解説

- **70 BPM slow 4/4 processional pulse**: 教会の入堂行進曲 (processional) のゆったり 4拍子
- **solo harp + bell chimes intro**: 教会の朝、 鐘の遠音と祈祷の harp
- **wordless female choir + pipe organ + celesta**: 聖歌 (歌詞なし vocal)、 教会のパイプオルガン、 セレスタの鈴の音
- **B minor bridge**: 短調の橋渡し = 「波紋の聖女」 イザベル覚醒前の沈黙、 セラフィエル様への祈りの溜め
- **luminous and quietly melancholic**: 白焔の温度 (luminous) + 千年の祈りの哀感 (quietly melancholic)

## 整合性

- 白焔教会派閥 (イザベル / セラフィ / メイリ / 詠聖ベル / ラナス / リッカ / ルーナ) 7体 (≥5、 BLOCKER 化対象) の派閥 BGM
- s1c1 イザベル降臨 / s1c2 イザベル「波紋の聖女」 覚醒のテーマ的整合
- 「Prism Sanctus」 命名: ラテン語 "Sanctus" (聖なるかな) = 白焔教会のミサ典書由来モチーフ

## 関連 memory / ルール
- ルール 7-14: 派閥キャラ ≥5 で BGM プロンプト必須 → 本ファイルで防御
- `feedback_bgm_uptempo.md`: 派閥 BGM はテンポより世界観優先 (教会は敢えて 70 BPM の processional)
