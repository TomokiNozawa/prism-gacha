# 戦闘テーマ BGM プロンプト — Prismatic Rift Overture (虹裂の序曲)

戦闘テーマ BGM (other カテゴリ、 章/派閥に属さない 戦闘・追跡・緊迫シーン共通)。 Suno AI 生成済 (野沢さん 2026-04 段階)。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/Prismatic Rift Overture.mp3` (ファイル名に空白あり、 既存維持)
> - 楽曲は野沢さん側 Suno AI で既に生成済 (duration 3:08、 BGM_LIST id='rift' で登録済)
> - 本ファイルは野沢さん原本プロンプトの記録 (2026-05-06 提供)

---

## Suno AI プロンプト (Style、 野沢さん原本)

```
Epic cinematic orchestral battle theme with fast 150-160 BPM minor-key drive, JRPG boss energy, urgent syncopated strings, heroic brass, taiko surges, military snare rolls, and syllabic mixed choir; intro opens on tense tremolo and rising drums, theme A races with catchy ostinato and brass counterlines, theme B widens into choir and heavier percussion, bridge strips to solo violin over sparse hits, climax floods with full orchestra and soaring lead before a cymbal-decay loop back to the opening tension, Glimmering synth accents, dynamic modern Hollywood mastering, wide and powerful yet crisp for game SFX overlay, soaring, theme, dynamic, hollywood, light, electronic, orchestral, latin, world, violin, pop, rapid, mythical
```

### Lyrics 欄

```
[Instrumental]
```

> ⚠️ Suno AI の Lyrics 欄は `[Instrumental]` しか機能しない仕様 (野沢さん指示 2026-05-06)。 vocalize 指示 (`syllabic mixed choir`) は Style 側に既に明記済。 野沢さん原本では `[Instrumental + syllabic mixed choir vocalize]` と記録されていたが、 実際の生成時は `[Instrumental]` で投入された (Style 側の指示のみ有効)。

---

## メタ情報

- **対応シーン**: 戦闘・追跡・緊迫シーン全般 (章を越えた共通 BGM、 ストーリー本編の戦闘場面で用いる想定)
- **コード参照**: `script.js BGM_LIST` の `id: 'rift'` (登録済、 'Prismatic Rift Overture (虹裂の序曲)'、 category: 'other'、 duration 3:08)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/Prismatic Rift Overture.mp3` (既存、 ファイル名に空白)

## キーワード解説

- **150-160 BPM minor-key drive**: 高速短調の駆動感、 JRPG ボス戦級の緊迫
- **urgent syncopated strings**: シンコペーションで切迫感を強調
- **heroic brass + taiko surges + military snare rolls**: 英雄的金管 + 太鼓のうねり + 軍鼓ロール
- **syllabic mixed choir**: 混声合唱 (歌詞なし、 音節のみ "Ah / Ha / Ko" 等)
- **theme A racing ostinato + theme B widens choir**: 二段階構成 (race → 解放)
- **bridge strips to solo violin**: 中盤の溜め (sparse hits)
- **climax soaring lead → cymbal-decay loop**: 頂点 → 余韻 → 開幕の緊張に戻るループ構成
- **dynamic modern Hollywood mastering**: 現代映画音楽級の音圧、 ゲーム SFX overlay 対応

## 整合性

- 戦闘テーマ = 章を越えた共通 BGM (s1c1 影喰い襲来 / s1c2 海中影喰い / s1c4 凍り影喰い / s1c5 黒月衆 / s1c7 黒月決戦 等で 共通使用想定)
- 既存派閥 BGM (BPM 60-130) より速め (150-160) で 戦闘級の独立感
- BGM_LIST `category: 'other'` 配置 = 章/派閥カテゴリと区別、 BGMパネルで「戦闘テーマ」 として独立表示
- 野沢さん指示「派閥 BGM もなるべく速め」 規約上は超アップテンポ寄り、 戦闘 BGM の典型的速度

## 関連 memory / ルール
- BGM_LIST `category: 'other'` カテゴリ独自、 章/派閥 BGM ルール (7-13 / 7-14) 対象外
- `feedback_bgm_uptempo.md`: 戦闘 BGM は BPM 150+ 推奨範囲内
