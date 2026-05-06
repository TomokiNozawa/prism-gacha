# 派閥 BGM プロンプト — Prism Sailborn (紅玉海賊団)

紅玉海賊団派閥の派閥テーマ BGM。 Suno AI 生成済 (野沢さん 2026-04 段階)。 ルール 7-14 BLOCKER 防御。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-crimson.mp3`
> - 楽曲は野沢さん側 Suno AI で既に生成済 (duration 2:51、 BGM_LIST id='crimson' で登録済)
> - 本ファイルは野沢さん原本プロンプトの記録 (2026-05-06 提供)

---

## Suno AI プロンプト (Style、 野沢さん原本)

```
Cinematic Celtic pirate orchestral instrumental in 6/8 at a jaunty 110 BPM, sea-shanty swing with fiddle-led themes, bouzouki drive, bodhran pulse, low whistle calls, accordion color, pizzicato cellos, brass and warm horns for the lift, Solo intro, fuller theme, half-time wistful bridge, then triumphant return, Wide, salty, golden-hour mix, celtic, melancholy, joyful, warm, rap, light, swing, violin, soundtrack, acoustic, dubstep, low, theme, orchestral, shanty, edm, accordion, electronic, cello, metal
```

### Lyrics 欄

```
[Instrumental]
```

---

## メタ情報

- **対応シーン**: 紅玉海賊団派閥のキャラを図鑑 / 相関図 / キャラ詳細で表示する時の BGM
- **コード参照**: `script.js BGM_LIST` の `id: 'crimson'` (登録済、 'Prism Sailborn (紅潮の風)'、 duration 2:51)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-crimson.mp3` (既存)

## キーワード解説

- **6/8 110 BPM jaunty**: 6/8 の弾むリズム、 海賊船 sea-shanty の代表テンポ
- **fiddle-led / bouzouki / bodhran / low whistle / accordion**: ケルト系酒場+船上音楽の代表楽器
- **pizzicato cellos / brass + warm horns**: オーケストラ系の lift で 「triumphant return」 を強調
- **wistful bridge → triumphant return**: シャンティ典型構成 (溜めて爆発)

## 整合性

- s1c2 紅玉海賊団 (シャンティ / ケイレブ / クレオ / ミカ) の自由奔放な世界観と整合
- 「海上自由商人」 の活気 + 「紅玉号」 の航海感を Celtic シャンティで表現
- 既存派閥 BGM (アクアシス slow 60 BPM = 神秘) と対の活気 (110 BPM = 港+航海)

## 関連 memory / ルール
- ルール 7-14: 派閥キャラ ≥5 で BGM プロンプト必須 → 本ファイルで防御
- `feedback_bgm_uptempo.md`: アップテンポ既定 (110 BPM = 該当)
