# 瞬き sprite (blink) プロンプト集

UR以上のキャラに「瞬きアニメ」 (Live2D風、 CSS+sprite swap) を適用するため、 既存キャラ画像と **同じ構図で目を閉じた版** を生成する。

> **🎯 規約**
> - 命名: `<original>_blink.png` (例: `prisma_blink.png` は既存)
> - 配置先: `images/characters/season1/{tier}/<name>_blink.png`
> - 元画像と **完全に同じ構図・服装・髪・背景・ライティング**、 違うのは **目を閉じている** 点のみ
> - 添付画像: 元のキャラ画像を **必ず** リファとして添付
> - script.js 側は既に全 tier 対応済 (2026-05-01 v1.2.4r) → 画像があれば自動的に瞬き有効化される

---

## 共通プロンプトテンプレ (全キャラ共通の言い回し、 キャラ名だけ差替)

```
A vertical portrait of [CHARACTER_NAME], EXACTLY identical to the attached reference
image in every detail — same pose, same outfit, same hair style and color, same accessories,
same weapons/items, same lighting, same background — with ONLY ONE difference: the
character's eyes are gently closed in a natural mid-blink expression. The eyelids are
softly closed with the same eyelashes visible, the rest of the facial expression
unchanged (mouth, eyebrows, head tilt all preserved exactly). All other details
including the entire composition must be preserved 1:1 with the reference image.

CRITICAL ANATOMY REQUIREMENTS: Anatomically correct human hands with five distinct,
well-formed fingers per hand. Both arms in natural human poses with proper joint
angles. Avoid any anatomical distortion.

Aspect ratio matches the reference image (3:4 vertical for character portraits).

-----
元画像から表情や姿勢は変わってOKです (※目を閉じる以外、 元画像と完全一致)
```

注: 末尾文言「元画像から表情や姿勢は変わってOKです」 は通常通り入れるが、 **追加注釈で「目を閉じる以外は完全一致」 と強調**する。

---

## キャラ別 生成リスト (LR + UR、 計7体)

### LR (1体)
- ✅ **虹意 プリズマ** (`lr/prisma.png` → `lr/prisma_blink.png`) — **既存生成済**

### UR (6体、 順次生成)

| # | キャラ名 | 元画像 | 生成先 | 添付画像 |
|---|---|---|---|---|
| 1 | セラフィエル | `ur/seraph_paladin.png` | `ur/seraph_paladin_blink.png` | seraph_paladin.png |
| 2 | 龍帝 アルテミス | `ur/dragon_emperor.png` | `ur/dragon_emperor_blink.png` | dragon_emperor.png |
| 3 | 星海のノクス | `ur/cosmic_witch.png` | `ur/cosmic_witch_blink.png` | cosmic_witch.png |
| 4 | 千夜姫 カグヤ | `ur/ancient_sage.png` | `ur/ancient_sage_blink.png` | ancient_sage.png |
| 5 | 焔帝 ヒノオウ | `ur/flame_empress.png` | `ur/flame_empress_blink.png` | flame_empress.png |
| 6 | 深海女王 ネプテア | `ur/sea_queen.png` | `ur/sea_queen_blink.png` | sea_queen.png |
| 7 | 波紋の聖女 イザベル | `ur/ripple_saint.png` | `ur/ripple_saint_blink.png` | ripple_saint.png |

### S1C3 で追加予定 (キャラ画像生成後)
- 砂海王女 サハナ (`ur/desert_princess.png` → `_blink.png`)
- 古龍の語り部 ファラー (`ur/dragon_sage.png` → `_blink.png`)

---

## 生成手順 (野沢用メモ)

1. 各 UR キャラ毎に: ChatGPT に **元画像を添付** + 上記共通プロンプトの `[CHARACTER_NAME]` を該当キャラ名に差し替えて貼付
2. 生成された目閉じ画像を `<original>_blink.png` で Box保存
3. 全 UR (or 一部) 完了後、 Claude に伝えれば即動作確認 (script.js 側はリリース済)

優先順: 第1章 UR から (5体: セラフィエル/アルテミス/ノクス/カグヤ/ヒノオウ) → 第2章 UR (2体: ネプテア/ イザベル覚醒) → 第3章 UR (2体)

---

## 動作確認方法

1. `<name>_blink.png` を該当フォルダに配置
2. cache buster bump で dev に反映
3. ストーリーシーンで該当キャラが「このシーンに登場」 リストに表示される時、 1.8〜3.5秒間隔で瞬きする
4. キャラ詳細モーダル (図鑑から開く) でも同様に瞬きする

画像が無ければ瞬きなし (静止)、 画像追加で自動的に瞬き有効化。 段階的展開可能。
