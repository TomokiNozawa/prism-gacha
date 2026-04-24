# Prismaera

課金なし・ブラウザ完結のガチャ+物語シミュ(旧称: Prism Gacha)。
+ タワーディフェンスゲーム **Prism Defense** も同梱。

## バージョニング

現在のバージョン: **v1.1.1** (Season 1 第1章公開 + patch 1)

`v{Season}.{公開済み章数}.{patch}` — 詳細ルールは [`VERSIONING.md`](VERSIONING.md) を参照。

- Season桁 bump = 新Season突入 (章リセット)
- 章桁 bump = 新章追加
- patch桁 bump = バグ修正/UI改善/新機能(章追加なし)
- 更新は `python scripts/bump_version.py {patch|chapter|season} --note "..."` で自動同期

Prism Defense はサブブランドとして独自バージョン(v1.0〜)で管理。

- **Prismaera URL**: https://tomokinozawa.github.io/prism-gacha/ (GitHub Pagesパスは旧リポ名のまま)
- **Prism Defense URL**: https://tomokinozawa.github.io/prism-gacha/td/
- **排出率**: R 65% / SR 25% / SSR 7% / UR 3% / LR 0.5%
- **天井**: 180連
- **操作**: Space=単発 / Enter=10連 / Gキー=図鑑
- **保存**: ブラウザの localStorage (将来Firebase対応予定)

## 世界観 (大枠)

詳細は [`DESIGN.md`](DESIGN.md) を参照。

- **原虹 (げんそう)**: 万物の源、7色の光
- **観測者の七座**: 各色に対応する原理の人格化 (現在3座着任、4座空席)
- **観測者の三柱**: セラフィエル / カグヤ / ノクス (姉妹ではなく独立した3神格)
- **影喰い**: 観測されない側の意志、世界を脅かす敵
- **5つの世界軸**: 神性 / 王権 / 野生 / 叡智 / 境界

## ストーリー

詳細プロット → [`STORY/outline.md`](STORY/outline.md) (Season 1-3 全21章)
本編 → [`STORY/s1c1.md`](STORY/s1c1.md) (Season 1 第1章本文)

## フォルダ構成

```
gacha-sim/
├── DESIGN.md           設計書 (全体方針)
├── VERSIONING.md       バージョン管理ルール
├── README.md           この資料
├── version.json        バージョン情報 (単一ソース、更新通知で使用)
├── index.html          エントリポイント
├── script.js           ゲームロジック
├── style.css           スタイル
│
├── scripts/
│   └── bump_version.py  バージョン自動bumpスクリプト
├── .gitignore
├── .nojekyll           GitHub Pages 用
│
├── images/             画像
│   ├── characters/
│   │   └── season1/
│   │       ├── lr/     LR (1体)
│   │       ├── ur/     UR (5体)
│   │       ├── ssr/    SSR (8体)
│   │       ├── sr/     SR (10体)
│   │       └── r/      R (6体)
│   └── fx/             演出用画像 (柱・パーティクル等)
│
├── assets/             音声・音楽
│   ├── bgm/            BGM (Suno生成)
│   │   └── home.mp3    ホーム画面BGM
│   ├── voices/         キャラボイス (VOICEVOX、将来)
│   └── se/             効果音 (将来、現在は Web Audio API で合成)
│
├── sounds/             旧音声フォルダ (現在未使用)
│
├── STORY/              ストーリー文書
│   ├── outline.md      21章アウトライン
│   ├── s1c1.md         Season1 第1章本文
│   └── prompts/
│       ├── _common.md  画像プロンプト共通テンプレ
│       └── s1c1.md     第1章 画像プロンプト集 (旧 /prompts.md から移行)
│
└── td/                 Prism Defense (TDゲーム)
    ├── index.html
    ├── script.js
    └── style.css
```

## Prism Defense 概要

- **iPhone縦持ち前提** のレーン型タワーディフェンス
- **6章 / 30ステージ** (章境に中ボス、10/20/30話に章ボス)
- **ガチャで引けるかに関係なく全30体** を自由に編成可能 (最大6体)
- **進行度はブラウザに保存**

## 開発メモ

- **想定ユーザー**: 友人10人程度 (公開は様子見)
- **画像生成**: GPT (Image gen) — Claudeがプロンプトテンプレ提供
- **BGM生成**: Suno
- **将来**: VOICEVOX でボイス追加、Firebase でクラウドセーブ

## ライセンス

個人/社内利用限定のジョーク・合宿ネタ向け。キャラ画像はAI生成のオリジナルキャラクター、特定作品のコピーではありません。
